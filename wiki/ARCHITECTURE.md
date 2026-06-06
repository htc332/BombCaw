# 炸弹推墙 - 工程架构文档

**版本**: v0.5.2  
**平台**: 微信小游戏 (Canvas 原生)  
**最后更新**: 2026-04-09

---

## 目录结构

```
bomb-wall-canvas/
├── game.js                 # 微信小游戏入口
├── game.json               # 小游戏配置
├── project.config.json     # 开发者工具配置
├── index.html              # 调试用的 HTML 入口
├── app.json                # 小程序配置
├── src/                    # 源代码
│   ├── core/               # 核心逻辑层
│   │   ├── GameLogic.js    # 游戏逻辑（炸弹、爆炸、胜负判定）
│   │   └── LevelSystem.js  # 关卡系统（解锁、进度管理）
│   ├── data/               # 数据层
│   │   ├── Storage.js      # 本地存档 (wx.getStorageSync)
│   │   └── LevelData.js    # 18关关卡配置
│   ├── view/               # 表现层
│   │   ├── Renderer.js     # Canvas 渲染器
│   │   ├── Animator.js     # 动画管理（爆炸、飘字）
│   │   ├── ParticleSystem.js # 粒子效果
│   │   └── UIManager.js    # UI 界面（关卡选择、设置）
│   ├── system/             # 系统层
│   │   ├── AudioManager.js # 音效/震动管理
│   │   └── AdManager.js    # 激励视频广告
│   └── main.js             # 游戏主入口 (BombWallGame)
├── res/                    # 资源文件
│   └── images/             # 图片资源
│       ├── Level_1.jpg     # 炸弹等级1（黑色牛）
│       ├── Level_2.jpg     # 炸弹等级2
│       ├── Level_3.jpg     # 炸弹等级3
│       └── Level_4.jpg     # 炸弹等级4
└── images/                 # 其他图片资源
```

---

## 架构设计

### 分层架构

```
┌─────────────────────────────────────┐
│           UI 层 (UIManager)          │
├─────────────────────────────────────┤
│      表现层 (Renderer/Animator)      │
├─────────────────────────────────────┤
│       核心逻辑 (GameLogic)           │
├─────────────────────────────────────┤
│       数据层 (Storage/LevelData)     │
├─────────────────────────────────────┤
│       系统服务 (Audio/Ad)            │
└─────────────────────────────────────┘
```

### 事件驱动通信

GameLogic 通过 `onEvent` 回调通知上层：

```javascript
// GameLogic 触发事件
this.emitEvent('bomb_placed', { x, y, bomb, bombsLeft });
this.emitEvent('bomb_exploded', { x, y, evolution });
this.emitEvent('level_complete', { level, score, bonus });

// main.js 处理事件
handleGameEvent(event) {
  switch (event.type) {
    case 'bomb_placed': ...
    case 'bomb_exploded': ...
  }
}
```

---

## 核心模块

### GameLogic.js

**职责**: 纯游戏逻辑，无渲染

**关键状态**:
- `walls: Map` - 墙壁数据 (key: "x,y")
- `bombs: Map` - 玩家放置的炸弹
- `staticBombs: Map` - 静态炸弹（关卡预设）
- `bombsLeft: number` - 剩余炸弹数

**核心方法**:
- `tryPlaceBomb(x, y)` - 尝试放置炸弹
- `explodeBomb(bomb)` - 炸弹爆炸（处理连锁）
- `getExplosionRange(bomb)` - 计算爆炸范围

### Renderer.js

**职责**: Canvas 绘制，无逻辑

**绘制顺序**:
1. 背景清空
2. 顶部状态栏
3. 网格
4. 墙壁
5. 静态炸弹
6. 玩家炸弹（带图片资源）
7. 底部提示面板

### AudioManager.js

**震动组件配置**:
```javascript
vibrateConfig: {
  enabled: true,
  light: { type: 'light', duration: 15 },
  medium: { type: 'medium', duration: 25 },
  heavy: { type: 'heavy', duration: 40 }
}
```

**音效配置**:
```javascript
soundEffects: {
  place: { intensity: null },      // 放置不震动
  explode: { intensity: 'heavy' },
  upgrade: { intensity: 'light' }
}
```

---

## 关卡设计

### 教学阶段 (1-6关)
- 第1关：静态炸弹基础
- 第2关：升级 = 更远
- 第3关：连锁激活
- 第4关：自己炸弹也能升级
- 第5关：规划顺序
- 第6关：三级升级系统

### 应用阶段 (7-12关)
- 机制组合应用
- 静态炸弹 + 炸弹墙
- 多米诺连锁

### 精通阶段 (13-18关)
- 创意挑战
- 综合应用

---

## 技术要点

### 微信小游戏全局对象
- 使用 `GameGlobal` 而非 `window`
- 模块导出：`GameGlobal.ClassName = ClassName`

### 图片资源加载
```javascript
const img = wx.createImage();
img.src = 'res/images/Level_1.jpg';
```

### 本地存储
```javascript
wx.getStorageSync('key');
wx.setStorageSync('key', value);
```

---

## 功能边界

**明确不做**:
- ❌ 排行榜（纯单机）
- ❌ 好友对战
- ❌ 浏览器版本（仅微信）

**预留功能**:
- [x] 广告续命
- [ ] 关卡选择界面
- [ ] 设置界面
- [ ] 音效文件播放
