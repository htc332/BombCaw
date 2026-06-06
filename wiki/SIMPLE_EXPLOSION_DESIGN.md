# 爆炸特效简化设计文档 V2

## 版本信息
- **备份标签**: `v0.6.1-particles` — 保留完整粒子系统版本
- **当前目标**: 极简爆炸特效

---

## 核心需求（3件事）

1. **融合度** — 十字格子之间看起来像连续火焰
2. **爆炸范围精确表达** — 玩家一眼能看出炸到哪几格
3. **爆炸时间极短** — 0.2~0.3 秒闪现后消失

---

## 用户最新反馈（3条）

1. **等级只区分范围** — 不区分颜色/粗细，所有炸弹统一视觉
2. **线条只在最外层** — 连接处不需要特效线条
3. **需要蔓延表现方案** — 中心→四向逐格展开的效果

---

## 蔓延表现方案（核心）

### 视觉效果

```
T+0ms:     中心格出现（最亮）
T+40ms:    第1格出现（四向同时）
T+80ms:    第2格出现
T+120ms:   第3格出现（如果power=3）
T+160ms~:  所有格子同时渐隐
```

**关键**：不是同时出现，而是**从中心向外逐格蔓延**。

### 技术实现

```javascript
// 每个格子有独立的 spawnTime
var cell = {
  x: gx, y: gy,           // 网格坐标
  distance: d,              // 距中心距离（决定出现时间）
  spawnTime: d * 40,      // 出现时间（ms）
  life: 0,                // 当前生命
  maxLife: 250            // 总生命 250ms
};

// 更新时检查是否该出现了
function updateCell(cell, elapsed) {
  if (elapsed < cell.spawnTime) {
    return { visible: false };  // 还没出现
  }
  
  var life = elapsed - cell.spawnTime;
  var progress = life / cell.maxLife;
  var alpha = 1 - progress;  // 渐隐
  
  return { visible: true, alpha: alpha };
}
```

### 绘制顺序（关键！）

```javascript
// 从末端向中心绘制
// 这样中心格在最上层，最亮
for (var i = cells.length - 1; i >= 0; i--) {
  drawCell(cells[i]);
}
```

### 格子绘制

```javascript
function drawCell(ctx, cell, cx, cy, cellSize, alpha) {
  var x = cx + cell.x * cellSize - cellSize/2;
  var y = cy + cell.y * cellSize - cellSize/2;
  
  // 统一颜色（所有等级一样）
  var color = { r: 255, g: 120, b: 40 };  // 橙红色
  
  // 中心格更亮
  var brightness = cell.distance === 0 ? 1.0 : 0.7;
  
  ctx.save();
  ctx.globalAlpha = alpha * brightness;
  ctx.globalCompositeOperation = 'lighter';
  
  // 重叠 25% 消除间隙
  var size = cellSize * 1.25;
  var half = size / 2;
  
  // 渐变填充（径向渐变，中心亮边缘暗）
  var grad = ctx.createRadialGradient(
    x + cellSize/2, y + cellSize/2, 0,
    x + cellSize/2, y + cellSize/2, half
  );
  var c = color;
  grad.addColorStop(0, `rgba(255,200,100,${brightness})`);   // 中心亮黄
  grad.addColorStop(0.5, `rgba(${c.r},${c.g},${c.b},0.6)`); // 中间橙红
  grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);     // 边缘透明
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x + cellSize/2, y + cellSize/2, half, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}
```

---

## 最外层线条

只在最末端格子（distance === power）绘制线条：

```javascript
function drawEndLine(ctx, cell, cx, cy, cellSize, alpha) {
  if (cell.distance !== power) return;  // 不是末端，不画
  
  var x = cx + cell.x * cellSize;
  var y = cy + cell.y * cellSize;
  
  // 线条方向
  var dirX = cell.x > 0 ? 1 : cell.x < 0 ? -1 : 0;
  var dirY = cell.y > 0 ? 1 : cell.y < 0 ? -1 : 0;
  
  // 从格子中心向外延伸
  var startX = x + dirX * cellSize * 0.3;
  var startY = y + dirY * cellSize * 0.3;
  var endX = x + dirX * cellSize * 0.8;
  var endY = y + dirY * cellSize * 0.8;
  
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = 'rgba(255, 255, 200, 0.8)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  
  ctx.restore();
}
```

---

## 边界问题清单

### 1. 多个炸弹爆炸生命周期独立
**方案**: 每个爆炸有独立对象，各自管理 `elapsed` 时间
```javascript
var explosions = [];  // 每个爆炸独立

function update(dt) {
  explosions = explosions.filter(function(ex) {
    ex.elapsed += dt * 1000;  // 毫秒
    return ex.elapsed < ex.totalDuration;
  });
}
```

### 2. 对象池管理
**方案**: 简单数组复用
```javascript
var pool = [];

function getExplosion() {
  return pool.pop() || { cells: [], elapsed: 0 };
}

function recycle(ex) {
  ex.cells.length = 0;
  pool.push(ex);
}
```

### 3. 格子盘边缘处理
**方案**: 创建时检查边界
```javascript
if (gx < minX || gx > maxX || gy < minY || gy > maxY) {
  continue; // 不创建越界格子
}
```

### 4. 多个爆炸重叠
**方案**: `globalCompositeOperation = 'lighter'`
- 重叠区域更亮，自然融合
- 不需要额外处理

### 5. 不同进化等级
**方案**: 只区分范围（power）
- Lv0: power=1（十字3格）
- Lv1: power=2（十字5格）
- Lv2: power=3（十字7格）
- 所有等级统一颜色/粗细

### 6. 性能保障
**方案**:
- 同屏最多 3 个爆炸
- 每个爆炸最多 13 个格子
- 0.25 秒强制结束
- 纯 Canvas 绘制，无粒子

---

## 完整代码结构

```javascript
// ========== SimpleExplosion ==========

function SimpleExplosion(cx, cy, cellSize, power, gridSize, centerGridX, centerGridY) {
  this.cx = cx;
  this.cy = cy;
  this.cellSize = cellSize;
  this.power = Math.min(power, 3);
  this.elapsed = 0;
  this.totalDuration = 250;  // 250ms
  this.cells = [];
  
  // 创建格子（带边界检查）
  var half = Math.floor(gridSize / 2);
  var minX = -half, maxX = gridSize % 2 === 0 ? half - 1 : half;
  var minY = -half, maxY = gridSize % 2 === 0 ? half - 1 : half;
  
  // 中心格
  this.cells.push({ x: 0, y: 0, distance: 0, spawnTime: 0 });
  
  // 四向格子
  var dirs = [[0,-1], [0,1], [-1,0], [1,0]];
  dirs.forEach(function(dir) {
    for (var d = 1; d <= this.power; d++) {
      var gx = dir[0] * d;
      var gy = dir[1] * d;
      
      // 边界检查
      if (gx < minX || gx > maxX || gy < minY || gy > maxY) continue;
      
      this.cells.push({
        x: gx, y: gy,
        distance: d,
        spawnTime: d * 40  // 每格40ms延迟
      });
    }
  }, this);
}

SimpleExplosion.prototype.update = function(dt) {
  this.elapsed += dt * 1000;
  return this.elapsed < this.totalDuration;
};

SimpleExplosion.prototype.draw = function(ctx) {
  var cs = this.cellSize;
  var elapsed = this.elapsed;
  
  // 从末端向中心绘制
  for (var i = this.cells.length - 1; i >= 0; i--) {
    var cell = this.cells[i];
    
    // 检查是否该出现了
    if (elapsed < cell.spawnTime) continue;
    
    // 计算生命
    var life = elapsed - cell.spawnTime;
    var progress = life / (this.totalDuration - cell.spawnTime);
    var alpha = Math.max(0, 1 - progress);
    
    // 绘制格子
    drawExplosionCell(ctx, this.cx, this.cy, cell, cs, alpha);
    
    // 末端画线条
    if (cell.distance === this.power) {
      drawEndLine(ctx, this.cx, this.cy, cell, cs, alpha);
    }
  }
};

// ========== 绘制函数 ==========

function drawExplosionCell(ctx, cx, cy, cell, cellSize, alpha) {
  var x = cx + cell.x * cellSize - cellSize/2;
  var y = cy + cell.y * cellSize - cellSize/2;
  
  var brightness = cell.distance === 0 ? 1.0 : 0.7;
  
  ctx.save();
  ctx.globalAlpha = alpha * brightness;
  ctx.globalCompositeOperation = 'lighter';
  
  var size = cellSize * 1.25;
  var half = size / 2;
  
  var grad = ctx.createRadialGradient(
    x + cellSize/2, y + cellSize/2, 0,
    x + cellSize/2, y + cellSize/2, half
  );
  grad.addColorStop(0, 'rgba(255,220,100,' + brightness + ')');
  grad.addColorStop(0.5, 'rgba(255,120,40,0.6)');
  grad.addColorStop(1, 'rgba(255,120,40,0)');
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x + cellSize/2, y + cellSize/2, half, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

function drawEndLine(ctx, cx, cy, cell, cellSize, alpha) {
  var x = cx + cell.x * cellSize;
  var y = cy + cell.y * cellSize;
  
  var dirX = cell.x > 0 ? 1 : cell.x < 0 ? -1 : 0;
  var dirY = cell.y > 0 ? 1 : cell.y < 0 ? -1 : 0;
  
  var startX = x + dirX * cellSize * 0.3;
  var startY = y + dirY * cellSize * 0.3;
  var endX = x + dirX * cellSize * 0.8;
  var endY = y + dirY * cellSize * 0.8;
  
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = 'rgba(255, 255, 200, 0.8)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  
  ctx.restore();
}
```

---

## 性能预算

| 项目 | 数量 | 说明 |
|------|------|------|
| 同屏爆炸 | ≤3 | 超出时忽略新的 |
| 每爆炸格子数 | ≤13 | power=3 时 |
| 绘制调用 | 1次/爆炸 | 批量绘制所有格子 |
| 生命周期 | 250ms | 短生命周期快速回收 |

---

## 回退方案

如果效果不佳，回退到 `v0.6.1-particles`：
```bash
git checkout v0.6.1-particles
```

---

_文档版本: v2.0 | 2026-05-10_
_备份: v0.6.1-particles_
