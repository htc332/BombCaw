# 爆炸特效问题分析 - 修正版

## 一、完整代码遍历结果

### 1. 爆炸触发路径（关键发现）

**路径A：Renderer 视觉触发（提前）**
```
Renderer.drawBombs() 
  → drawAnimatedBomb() 检测到 countdown <= 6
  → 设置 isNearExplosion = true
  → 调用 this.onBombVisualExplode(bomb.x, bomb.y, bomb.evolution, cx, cy)
  → main.onBombVisualExplode()
  → animator.createCrossExplosion(cx, cy, cellSize, power, gridSize, gx, gy)
```

**路径B：GameLogic 逻辑触发（正式）**
```
GameLogic.explodeBomb()
  → emitEvent('bomb_exploded', {x, y, evolution})
  → main.handleGameEvent()
  → main.onBombExploded(event)
  → animator.createCrossExplosion(pos.cx, pos.cy, cellSize, power, gridSize, centerGridX, centerGridY)
```

**路径C：静态炸弹触发**
```
GameLogic.explodeStaticBomb()
  → emitEvent('static_bomb_exploded', {x, y, evolution})
  → main.onStaticBombExploded(event)
  → animator.createCrossExplosion(pos.cx, pos.cy, cellSize, power)
  （注意：这里缺少 gridSize, centerGridX, centerGridY 参数！）
```

### 2. 双重触发确认

**1级炸弹（evo=0）：**
- 路径A：power = 1 + 0 = 1，创建 SimpleExplosion(power=1)
- 路径B：power = 1 + 0 = 1，创建 SimpleExplosion(power=1)
- **结果：** 两个完全相同的爆炸，视觉上重叠，看起来正常

**2级炸弹（evo=1）：**
- 路径A：power = 1 + 1 = 2，创建 SimpleExplosion(power=2)
- 路径B：power = 1 + 1 = 2，创建 SimpleExplosion(power=2)
- **结果：** 两个完全相同的爆炸，同时存在，导致闪烁！

**闪烁原因：**
- 两个 SimpleExplosion 对象同时绘制在同一个位置
- 每个都有5个cells（中心+4方向各2格）
- `globalCompositeOperation = 'lighter'` 叠加导致亮度异常
- 当一个消散、另一个还在时，出现闪烁

### 3. 静态炸弹参数缺失

```javascript
// main.js onStaticBombExploded
this.animator.createCrossExplosion(pos.cx, pos.cy, cellSize, power);
// 缺少：gridSize, centerGridX, centerGridY
```

**后果：**
- SimpleExplosion 构造函数中 `gridSize = undefined`
- `half = Math.floor(undefined / 2) = NaN`
- 边界检查全部失败，但cells仍然被创建（因为 `gx < NaN` 永远为false）
- 可能导致异常行为

### 4. 墙壁震动代码位置

**位置1：Renderer.js drawWalls()**
```javascript
if (wall.shake > 0) {
  shakeX = (Math.random() - 0.5) * wall.shake * pr;
  shakeY = (Math.random() - 0.5) * wall.shake * pr;
}
// 绘制时应用偏移
drawWallSprite(ctx, wall, x + shakeX, y + shakeY, cs, spriteType);
```

**位置2：main.js render()**
```javascript
var shake = this.animator.getScreenShake();
if (shake.x !== 0 || shake.y !== 0) {
  ctx.translate(shake.x, shake.y);
}
```

**状态：** 两者都已注释掉/禁用

### 5. 1级爆炸边缘出框

**原因：** `SimpleExplosion._drawCell()` 使用圆形绘制，半径大于格子
```javascript
var size = cs * (1 + ExplosionConfig.overlapRatio * 2); // 1.5倍格子大小
ctx.arc(cx, cy, half, 0, Math.PI * 2); // 圆形超出格子边界
```

**没有网格边界裁剪**，导致绘制到场景外。

---

## 二、问题清单（修正）

| # | 问题 | 根因 | 当前状态 | 修复方案 |
|---|------|------|----------|----------|
| 1 | **2级爆炸闪烁** | **双重触发**（Renderer+GameLogic各创建一次） | 临时限制数量 | **移除Renderer中的提前触发** |
| 2 | **静态炸弹可能异常** | createCrossExplosion缺少gridSize参数 | 未修复 | **补齐参数** |
| 3 | 1级边缘出框 | 圆形绘制无边界裁剪 | 未修复 | 添加裁剪或改用方形 |
| 4 | 墙壁震动 | wall.shake偏移 | 已禁用 | 无需处理 |
| 5 | 升级报错 | 缺少createUpgrade | 已临时添加 | 确认方法正确 |

---

## 三、核心问题：双重触发

**现状：**
- Renderer 在炸弹动画最后6帧提前触发爆炸特效
- GameLogic 在炸弹真正爆炸时再次触发
- 两者独立，导致同一个炸弹创建两个爆炸对象

**炸弹人参考：**
- 炸弹人没有"提前触发"概念
- 炸弹倒计时结束 → 逻辑计算范围 → 视觉一次性绘制
- 视觉和逻辑是同步的

**为什么1级正常，2级闪烁？**
- 1级：两个爆炸完全重叠，看起来只是一个（power=1，cells相同）
- 2级：两个爆炸同时绘制，lighter叠加导致亮度翻倍，当一个先消散时出现闪烁

---

## 四、修复方案（最小修改）

### 批次1：修复双重触发（核心问题）

**修改1：移除 Renderer 中的提前触发**
```javascript
// Renderer.drawBombs()
// 删除以下代码：
if (isNearExplosion && !bomb.explosionTriggered) {
  bomb.explosionTriggered = true;
  if (this.onBombVisualExplode) {
    this.onBombVisualExplode(bomb.x, bomb.y, bomb.evolution, cx, cy);
  }
}
```

**修改2：删除 main.onBombVisualExplode 方法**
```javascript
// main.js 中删除整个 onBombVisualExplode 方法
// 爆炸只由 onBombExploded 创建
```

**修改3：删除 Renderer.onBombVisualExplode 回调设置**
```javascript
// main.js initSystems() 中删除：
this.renderer.onBombVisualExplode = (gx, gy, evolution, cx, cy) => {
  this.onBombVisualExplode(gx, gy, evolution, cx, cy);
};
```

### 批次2：修复静态炸弹参数

**修改：main.onStaticBombExploded**
```javascript
onStaticBombExploded(event) {
  var pos = this.toScreen(event.x, event.y);
  var cellSize = this.renderer.cellSize;
  var evo = event.evolution || 0;
  var power = 1 + evo;
  var gridSize = this.gameLogic.gridSize;
  
  // 补齐缺失的参数
  this.animator.createCrossExplosion(
    pos.cx, pos.cy, cellSize, power, 
    gridSize, event.x, event.y
  );
}
```

### 批次3：修复1级边缘出框

**方案A：添加裁剪**
```javascript
// SimpleExplosion._drawCell() 开头添加：
ctx.save();
ctx.beginPath();
ctx.rect(gridLeft, gridTop, gridWidth, gridHeight);
ctx.clip();
// ... 绘制 ...
ctx.restore();
```

**方案B：改用方形绘制**
```javascript
// 不使用 arc，使用 fillRect 并限制在格子内
```

---

## 五、验证清单

修复后需要验证：
- [ ] 1级炸弹爆炸正常（单十字5格）
- [ ] 2级炸弹爆炸正常（不闪烁）
- [ ] 静态炸弹爆炸正常
- [ ] 连锁爆炸正常（多个炸弹依次爆炸）
- [ ] 边缘炸弹不出框
- [ ] 升级特效正常
- [ ] 无ERROR日志

---

## 六、不做的修改

- 不重构 SimpleExplosion 类结构
- 不改变爆炸颜色/样式
- 不修改 GameLogic 伤害计算
- 不修改炸弹动画播放逻辑

---

_修正日期: 2026-05-11_
_基于完整代码遍历_
