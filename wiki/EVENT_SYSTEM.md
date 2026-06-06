# 牛牛炸鼠 - 事件系统设计文档

**版本**: v0.5.2  
**平台**: 微信小游戏 (Canvas 原生)  
**最后更新**: 2026-05-03

---

## 一、设计目标

### 1.1 核心原则
- **逻辑层与表现层完全解耦**
- **异步回调模式**（不是数组收集再批量传回）
- **即时响应** - 事件发生时立即通知

### 1.2 为什么用回调而不是数组？
```javascript
// ❌ 错误模式 - 异步回调中不要用数组收集
this.events = [];
// ... 收集事件 ...
// 数组在异步场景中不可靠

// ✅ 正确模式 - 回调即时传递
constructor() { this.onEvent = null; }
emitEvent(type, data) {
  if (this.onEvent) this.onEvent({ type, ...data });
}
```
**原因**: 回调模式是微信小游戏/单线程环境的正确做法，即时、可靠、无延迟。

---

## 二、事件总线 (EventBus)

### 2.1 发布订阅模式
```javascript
// 订阅
EventBus.on('level.complete', (data) => { ... });

// 发布
EventBus.emit('level.complete', { level: 1, score: 100 });
```

### 2.2 事件分类
| 类别 | 事件名 | 触发时机 |
|------|--------|----------|
| 游戏 | `game.start` | 游戏开始 |
| 游戏 | `game.pause` | 游戏暂停 |
| 游戏 | `game.resume` | 游戏恢复 |
| 游戏 | `game.over` | 游戏结束 |
| 关卡 | `level.start` | 关卡开始 |
| 关卡 | `level.complete` | 关卡完成 |
| 关卡 | `level.fail` | 关卡失败 |
| 玩家 | `score.change` | 分数变化 |
| 玩家 | `bomb.place` | 放置炸弹 |
| 玩家 | `bomb.explode` | 炸弹爆炸 |
| 玩家 | `bomb.upgrade` | 炸弹升级 |
| 系统 | `scene.change` | 场景切换 |
| 系统 | `resource.load` | 资源加载 |
| 系统 | `ad.show` / `ad.close` | 广告 |
| UI | `touch.start` / `touch.end` | 触摸 |
| UI | `button.click` | 按钮点击 |

---

## 三、GameLogic 事件流

### 3.1 核心事件序列
```
initLevel() 
  → level_started { gridSize, bombsLeft, wallCount }
  
tryPlaceBomb(x, y)
  → bomb_placed { x, y, bomb, bombsLeft }
  → bomb_upgraded { x, y, evolution } (如果相邻)
  
explodeBomb(bomb)
  → bomb_exploded { x, y, evolution, destroyed }
  → wall_destroyed { x, y, type } (每摧毁一面墙)
  → bomb_activated { x, y } (激活静态炸弹)
  → bomb_upgraded { x, y, evolution } (静态炸弹升级)
  
checkVictory()
  → level_complete { level, score, bonus } (延迟结算后)
  
checkFail()
  → level_fail { level, reason }
```

### 3.2 事件数据结构
```javascript
// 放置炸弹
{
  type: 'bomb_placed',
  x: 0, y: 0,
  bomb: { x, y, evolution, countdown },
  bombsLeft: 2
}

// 爆炸
{
  type: 'bomb_exploded',
  x: 0, y: 0,
  evolution: 1,
  destroyed: [ { x, y, type } ],  // 摧毁的墙壁列表
  chain: [ { x, y } ]           // 连锁激活的炸弹
}

// 升级
{
  type: 'bomb_upgraded',
  x: 0, y: 0,
  evolution: 1,  // 新等级
  reason: 'adjacent' // 或 'chain'
}

// 关卡完成
{
  type: 'level_complete',
  level: 1,
  score: 500,
  bonus: { remaining: 200, chain: 100 },
  stars: 3
}
```

---

## 四、延迟结算模式

### 4.1 为什么需要延迟？
游戏逻辑层设置 `pendingVictory = true`，但**不立即结算**。

### 4.2 结算条件
```javascript
// 主循环检查
if (pendingVictory && 
    animator.getActiveCount() === 0 && 
    particles.getActiveCount() === 0) {
  // 真正结算
  emitEvent('level_complete', ...);
}
```

### 4.3 效果
- 所有视觉反馈（爆炸、粒子、飘字）完整播放后再进入结算界面
- 玩家感受到完整的成就感
- 避免结算界面打断动画

---

## 五、场景间通信

### 5.1 场景栈 + EventBus
```javascript
// GameScene 触发
EventBus.emit('level.complete', { level, score });

// ResultScene 接收
EventBus.on('level.complete', (data) => {
  this.showResult(data);
});

// SceneManager 处理场景切换
EventBus.on('level.complete', () => {
  SceneManager.push('result');
});
```

### 5.2 场景生命周期
```
init -> load -> enter -> update -> exit -> destroy
```

---

## 六、未来扩展接口

| 功能 | 事件 | 预留位置 |
|------|------|----------|
| 分享得分 | `share.score` | managers/EventBus.js |
| 排行榜 | `leaderboard.update` | 明确不做 ❌ |
| 好友挑战 | `friend.challenge` | 明确不做 ❌ |
| 广告复活 | `ad.revive` | managers/AdManager.js |
| 关卡解锁 | `level.unlock` | data/PlayerData.js |

---

_文档版本: v1.0 | 2026-05-03_
