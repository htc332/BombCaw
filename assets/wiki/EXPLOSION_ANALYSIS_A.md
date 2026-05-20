# 爆炸特效问题分析 - 模块A：触发机制

## 模块A：爆炸触发路径分析

### A1. 触发路径梳理

**路径A：Renderer 视觉触发（提前6帧）**
```
Renderer.drawBombs()
  → drawAnimatedBomb() 检测到 bomb.countdown <= 6
  → 设置 isNearExplosion = true
  → bomb.explosionTriggered = true（标记已触发）
  → 调用 this.onBombVisualExplode(bomb.x, bomb.y, bomb.evolution, cx, cy)
  → main.onBombVisualExplode()
  → animator.createCrossExplosion(cx, cy, cellSize, power=1+evo, gridSize, gx, gy)
  → 创建 SimpleExplosion 对象
```

**路径B：GameLogic 逻辑触发（正式爆炸）**
```
GameLogic.explodeBomb()
  → 炸弹从 bombs Map 中删除
  → emitEvent('bomb_exploded', {x, y, evolution})
  → main.handleGameEvent() 分发到 onBombExploded()
  → animator.createCrossExplosion(pos.cx, pos.cy, cellSize, power=1+evo, gridSize, event.x, event.y)
  → 创建 SimpleExplosion 对象
```

**路径C：静态炸弹触发**
```
GameLogic.explodeStaticBomb()
  → emitEvent('static_bomb_exploded', {x, y, evolution})
  → main.onStaticBombExploded()
  → animator.createCrossExplosion(pos.cx, pos.cy, cellSize, power=1+evo)
  ⚠️ 缺少 gridSize, centerGridX, centerGridY 参数！
```

### A2. 双重触发确认

**1级炸弹（evo=0, power=1）：**
- 路径A：创建 SimpleExplosion(power=1)，cells=[中心+4方向各1格]=5格
- 路径B：创建 SimpleExplosion(power=1)，cells=[中心+4方向各1格]=5格
- 结果：两个完全相同的爆炸重叠，视觉上看起来正常（只是一个更亮）

**2级炸弹（evo=1, power=2）：**
- 路径A：创建 SimpleExplosion(power=2)，cells=[中心+4方向各2格]=9格
- 路径B：创建 SimpleExplosion(power=2)，cells=[中心+4方向各2格]=9格
- 结果：
  - 两个爆炸同时绘制在同一个位置
  - globalCompositeOperation='lighter' 叠加
  - 当一个消散、另一个还在时，亮度突变 → 闪烁
  - 中心和四格（距离1）是两个爆炸共有的，所以反复出现
  - 最外围（距离2）只出现一次，所以正常消散

### A3. 为什么用户观察到"中心和四格闪烁，最外围正常"？

**解释：**
- 两个 SimpleExplosion 对象同时存在
- 对象1先创建，对象2后创建（相差几帧）
- 对象1的 cells 先开始消散，对象2的 cells 还在
- 中心和距离1的格子是两个对象共有的，所以当一个消散、另一个还在时，看起来"反复出现"
- 距离2的格子只在对象1/2中存在（取决于哪个先创建），所以只出现一次

### A4. 静态炸弹参数缺失

```javascript
// main.js onStaticBombExploded
this.animator.createCrossExplosion(pos.cx, pos.cy, cellSize, power);
// 缺少：gridSize, centerGridX, centerGridY
```

**SimpleExplosion 构造函数：**
```javascript
function SimpleExplosion(cx, cy, cellSize, power, gridSize, centerGridX, centerGridY) {
  // gridSize = undefined
  var half = Math.floor(gridSize / 2); // NaN
  this.minX = -half; // NaN
  this.maxX = gridSize % 2 === 0 ? half - 1 : half; // NaN
  // 边界检查：gx < NaN 永远为false，所以所有格子都通过
}
```

**后果：** 静态炸弹爆炸时，边界检查失效，但power限制还在，所以不会无限创建格子。

---

## 模块A问题总结

| 问题 | 根因 | 影响 |
|------|------|------|
| 2级闪烁 | 双重触发（两个SimpleExplosion） | 视觉异常 |
| 静态炸弹边界失效 | 参数缺失导致NaN | 可能出框 |

## 模块A修复方案

**方案：移除路径A（Renderer提前触发）**

理由：
1. 炸弹人没有提前触发概念，爆炸和逻辑同步
2. 路径A和路径B创建完全相同的爆炸，重复
3. 移除后代码更清晰

**修改步骤：**
1. Renderer.js：删除 drawBombs() 中的 isNearExplosion 检查
2. main.js：删除 onBombVisualExplode() 方法
3. main.js：删除 initSystems() 中的 onBombVisualExplode 回调设置

---

_模块A完成_
