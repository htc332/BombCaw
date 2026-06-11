# 炸弹牛 v0.7.0 设计任务拆解

**日期**: 2026-06-11  
**设计人**: 胡天驰  
**版本**: v0.7.0  

---

## 一、设计核心

### 1.1 游戏模式转变
- **从**: 固定炸弹数量，策略是位置选择
- **到**: 得分驱动购买系统，策略是资源管理+位置选择

### 1.2 关键循环
```
初始得分 → 购买炸弹牛 → 放置炸弹 → 炸老鼠 → 获得得分 → 购买更强炸弹牛 → ...
```

---

## 二、任务拆解

### 任务1: 得分系统基础框架
**文件**: `src/core/GameLogic.js`  
**工作量**: 30分钟  

**需求**:
- 每局初始得分（如 100 分）
- 炸老鼠获得得分（普通 +10，加固 +20，炸弹墙 +15）
- 得分不能为负数

**实现**:
```javascript
// GameLogic.reset()
this.score = 100; // 初始得分
this.selectedBombType = 0; // 当前选中的炸弹类型 0-3

// 炸老鼠得分
addScore(points) {
  this.score += points;
  this.emitEvent('score_changed', { score: this.score, delta: points });
}

// 放置炸弹时扣除得分
tryPlaceBomb(x, y) {
  const cost = BOMB_TYPES[this.selectedBombType].cost;
  if (this.score < cost) {
    this.emitEvent('action_rejected', { reason: 'score_not_enough' });
    this.selectedBombType = 0; // 切回1级
    return false;
  }
  this.score -= cost;
  // ... 放置逻辑
}
```

**验收标准**:
- [ ] 初始得分正确显示
- [ ] 炸老鼠后得分增加
- [ ] 放置炸弹后得分扣除
- [ ] 得分不足时拒绝放置并切回1级

---

### 任务2: 4种炸弹牛类型定义
**文件**: `src/data/Config.js` 或 `src/core/GameLogic.js`  
**工作量**: 20分钟  

**需求**:
| 等级 | 名称 | 消耗得分 | 爆炸范围 | 外观 |
|------|------|----------|----------|------|
| Lv1 | 白色炸弹牛 | 0 (免费) | 十字1格 | 白色 |
| Lv2 | 蓝色炸弹牛 | 20 | 十字2格 | 蓝色 |
| Lv3 | 紫色炸弹牛 | 50 | 十字2格+对角1格 | 紫色 |
| Lv4 | 红色炸弹牛 | 100 | 十字3格+对角2格 | 红色 |

**实现**:
```javascript
const BOMB_TYPES = [
  { level: 1, name: '白色炸弹牛', cost: 0, evolution: 0, color: 'white' },
  { level: 2, name: '蓝色炸弹牛', cost: 20, evolution: 2, color: 'blue' },
  { level: 3, name: '紫色炸弹牛', cost: 50, evolution: 3, color: 'purple' },
  { level: 4, name: '红色炸弹牛', cost: 100, evolution: 5, color: 'red' }
];
```

**验收标准**:
- [ ] 4种类型配置正确
- [ ] 每种类型对应正确的爆炸范围（复用现有 evolution 计算）
- [ ] 消耗得分正确

---

### 任务3: 购买栏 UI 实现
**文件**: `src/view/UIManager.js` / `src/view/Renderer.js`  
**工作量**: 1.5小时  

**需求**:
- 界面底部显示4个炸弹牛图标
- 每个图标显示：等级、消耗得分、选中状态
- 点击切换选中类型
- 得分不足时显示灰色不可点击
- 当前选中的高亮显示

**实现要点**:
```javascript
// UIManager.js
renderShopBar(ctx, screenWidth, screenHeight) {
  const barHeight = 80;
  const itemWidth = screenWidth / 4;
  
  BOMB_TYPES.forEach((type, index) => {
    const x = index * itemWidth;
    const y = screenHeight - barHeight;
    
    // 背景
    ctx.fillStyle = (index === this.selectedBombType) ? '#FFD700' : '#333';
    ctx.fillRect(x, y, itemWidth, barHeight);
    
    // 图标（复用现有炸弹牛精灵图）
    this.drawBombIcon(ctx, x + itemWidth/2, y + 30, type.color);
    
    // 文字
    ctx.fillStyle = (this.score >= type.cost) ? '#FFF' : '#666';
    ctx.fillText(type.name, x + 10, y + 55);
    ctx.fillText(type.cost + '分', x + 10, y + 70);
  });
}

// 点击检测
onShopBarClick(touchX, touchY) {
  if (touchY < screenHeight - 80) return; // 不在购买栏区域
  
  const index = Math.floor(touchX / (screenWidth / 4));
  if (index >= 0 && index < 4) {
    if (this.score >= BOMB_TYPES[index].cost) {
      this.selectedBombType = index;
      this.emitEvent('bomb_type_selected', { type: index });
    } else {
      this.emitEvent('score_not_enough');
    }
  }
}
```

**验收标准**:
- [ ] 购买栏显示在底部
- [ ] 4个图标正确显示
- [ ] 点击切换选中状态
- [ ] 得分不足时灰色显示
- [ ] 选中后有视觉反馈

---

### 任务4: 炸弹放置逻辑修改
**文件**: `src/core/GameLogic.js`  
**工作量**: 30分钟  

**需求**:
- 放置炸弹时根据 `selectedBombType` 设置 `evolution`
- 扣除对应得分
- 得分不足时提示并切回1级

**实现**:
```javascript
tryPlaceBomb(x, y) {
  // ... 原有校验 ...
  
  const bombType = BOMB_TYPES[this.selectedBombType];
  
  if (this.score < bombType.cost) {
    this.selectedBombType = 0; // 切回1级
    this.emitEvent('action_rejected', { 
      reason: 'score_not_enough',
      required: bombType.cost,
      current: this.score
    });
    return false;
  }
  
  this.score -= bombType.cost;
  this.bombsLeft--; // 或者移除 bombsLeft 限制，只用得分控制
  
  const bomb = {
    x, y,
    countdown: 90,
    evolution: bombType.evolution, // 根据选中类型设置
    key,
    animTime: 0,
    animSpeed: 0.8 + Math.random() * 0.4
  };
  
  this.bombs.set(key, bomb);
  
  this.emitEvent('bomb_placed', {
    x, y,
    bomb: { ...bomb },
    score: this.score,
    bombType: this.selectedBombType
  });
  
  return true;
}
```

**验收标准**:
- [ ] 放置的炸弹等级与选中类型一致
- [ ] 得分正确扣除
- [ ] 得分不足时切回1级并提示

---

### 任务5: 老鼠得分配置
**文件**: `src/data/Config.js`  
**工作量**: 15分钟  

**需求**:
- 每种老鼠类型对应不同得分

**实现**:
```javascript
const ENEMY_TYPES = {
  normal: { hp: 1, score: 10, name: '普通鼠' },
  strong: { hp: 2, score: 20, name: '加固鼠' },
  bomb_yellow: { hp: 1, score: 15, name: '黄色炸弹鼠', onDeath: 'bombWall', color: 'yellow' },
  bomb_red: { hp: 1, score: 15, name: '红色炸弹鼠', onDeath: 'bombWall', color: 'red' }
};
```

**验收标准**:
- [ ] 炸普通鼠 +10分
- [ ] 炸加固鼠 +20分
- [ ] 炸炸弹墙 +15分

---

### 任务6: 第一关设计
**文件**: `src/data/LevelData.js`  
**工作量**: 30分钟  

**需求**:
- 初始得分: 100
- 老鼠配置: 8只普通鼠，2只加固鼠
- 无静态炸弹（简化教学）
- 目标: 用得分购买更强炸弹，清空所有老鼠

**实现**:
```javascript
level1: {
  gridSize: 5,
  initialScore: 100, // 初始得分
  bombsLeft: 999, // 或移除限制，只用得分控制
  walls: [
    // 8只普通鼠
    { x: -2, y: -2, type: 'normal' },
    { x: 0, y: -2, type: 'normal' },
    { x: 2, y: -2, type: 'normal' },
    { x: -2, y: 0, type: 'normal' },
    { x: 2, y: 0, type: 'normal' },
    { x: -2, y: 2, type: 'normal' },
    { x: 0, y: 2, type: 'normal' },
    { x: 2, y: 2, type: 'normal' },
    // 2只加固鼠
    { x: 0, y: 0, type: 'strong' },
    { x: -1, y: -1, type: 'strong' }
  ],
  staticBombs: [], // 第一关无静态炸弹
  hint: '炸老鼠赚得分，购买更强炸弹牛！'
}
```

**验收标准**:
- [ ] 初始得分100
- [ ] 10只老鼠配置正确
- [ ] 无静态炸弹
- [ ] 可解性验证通过

---

### 任务7: 得分显示 UI
**文件**: `src/view/UIManager.js`  
**工作量**: 30分钟  

**需求**:
- 顶部显示当前得分
- 得分变化时有动画（飘字 + 缩放）
- 购买栏显示每种炸弹的消耗

**实现**:
```javascript
renderScore(ctx, screenWidth) {
  const scoreText = '得分: ' + this.score;
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 24px Arial';
  ctx.fillText(scoreText, 20, 40);
  
  // 得分变化动画
  if (this.scoreAnim) {
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 30px Arial';
    ctx.fillText('+' + this.scoreAnim.delta, 20, 70);
  }
}
```

**验收标准**:
- [ ] 得分显示在顶部
- [ ] 得分变化有动画
- [ ] 购买栏显示消耗

---

### 任务8: 提示系统
**文件**: `src/view/UIManager.js`  
**工作量**: 20分钟  

**需求**:
- 得分不足时提示"得分不足，已切回1级炸弹牛"
- 首次获得得分时提示"炸老鼠获得得分，可以购买更强炸弹了！"

**实现**:
```javascript
showTip(message, duration = 2000) {
  this.tip = { text: message, endTime: Date.now() + duration };
}

// 在得分不足时
if (this.score < bombType.cost) {
  this.selectedBombType = 0;
  this.showTip('得分不足，已切回1级炸弹牛！');
  return false;
}
```

**验收标准**:
- [ ] 得分不足提示正确
- [ ] 提示自动消失
- [ ] 首次得分提示正确

---

## 三、文件修改清单

| 文件 | 修改内容 | 工作量 |
|------|----------|--------|
| `src/core/GameLogic.js` | 得分系统、炸弹类型选择、放置逻辑 | 1小时 |
| `src/data/Config.js` | 炸弹类型配置、老鼠得分配置 | 20分钟 |
| `src/data/LevelData.js` | 第一关配置 | 30分钟 |
| `src/view/UIManager.js` | 购买栏UI、得分显示、提示系统 | 2小时 |
| `src/view/Renderer.js` | 炸弹牛渲染（根据类型） | 30分钟 |

**总工作量**: 约 4-5小时  
**依赖关系**: 任务1 → 任务2 → 任务4 → 任务3,5,6,7,8  

---

## 四、验收测试清单

- [ ] 初始得分100正确显示
- [ ] 购买栏4种炸弹牛显示正确
- [ ] 点击切换炸弹类型
- [ ] 放置炸弹扣除对应得分
- [ ] 炸老鼠获得得分
- [ ] 得分不足时切回1级并提示
- [ ] 第一关可通关
- [ ] 得分变化有动画
- [ ] 提示系统正常

---

_文档版本: v0.7.0-draft | 2026-06-11_
