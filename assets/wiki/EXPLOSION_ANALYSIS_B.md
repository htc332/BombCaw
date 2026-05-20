# 爆炸特效问题分析 - 模块B：爆炸绘制与范围

## 模块B：SimpleExplosion 实现分析

### B1. 构造函数

```javascript
function SimpleExplosion(cx, cy, cellSize, power, gridSize, centerGridX, centerGridY) {
  this.cx = cx;  // 屏幕坐标X（中心）
  this.cy = cy;  // 屏幕坐标Y（中心）
  this.cellSize = cellSize;
  this.power = Math.min(power, 3);  // 限制最大3
  this.elapsed = 0;
  this.cells = [];
  
  // 边界计算（基于gridSize）
  var half = Math.floor(gridSize / 2);
  this.minX = -half;
  this.maxX = gridSize % 2 === 0 ? half - 1 : half;
  this.minY = -half;
  this.maxY = gridSize % 2 === 0 ? half - 1 : half;
  
  // 中心格
  this.cells.push({ x: 0, y: 0, distance: 0, spawnTime: 0 });
  
  // 四向格子（上下左右）
  var dirs = [
    { dx: 0, dy: -1 },  // 上
    { dx: 0, dy: 1 },   // 下
    { dx: -1, dy: 0 },  // 左
    { dx: 1, dy: 0 }    // 右
  ];
  
  dirs.forEach(function(dir) {
    for (var d = 1; d <= self.power; d++) {
      var gx = dir.dx * d;
      var gy = dir.dy * d;
      
      // 边界检查
      if (gx < self.minX || gx > self.maxX || gy < self.minY || gy > self.maxY) {
        continue;
      }
      
      self.cells.push({
        x: gx, y: gy,
        distance: d,
        spawnTime: d * ExplosionConfig.spreadInterval
      });
    }
  });
}
```

**关键发现：**
- 只支持**十字方向**（上下左右），不支持斜向
- 1级（power=1）：中心 + 4方向各1格 = 5格
- 2级（power=2）：中心 + 4方向各2格 = 9格
- 3级（power=3）：中心 + 4方向各3格 = 13格

**与用户需求的对比：**

| 等级 | 用户需求 | 当前实现 | 差异 |
|------|----------|----------|------|
| 1级 | 十字5格 | 十字5格 | ✅ 匹配 |
| 2级 | 3×3范围9格 | 十字9格 | ❌ 不匹配！ |
| 3级 | 十字延伸+1格 | 十字13格 | ❌ 不匹配！ |
| 4级 | 各方向衍生2格 | 十字17格 | ❌ 不匹配！ |

**重要发现：** 当前实现只有十字形状，但用户需求2级是3×3范围（包括斜向）！

### B2. 绘制方法

```javascript
SimpleExplosion.prototype.draw = function(ctx) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';  // 叠加模式
  
  for (var i = this.cells.length - 1; i >= 0; i--) {
    var cell = this.cells[i];
    
    // 还没出现
    if (elapsed < cell.spawnTime) continue;
    
    // 计算生命进度
    var life = elapsed - cell.spawnTime;
    var maxLife = cfg.totalDuration - cell.spawnTime;
    var progress = life / maxLife;
    var alpha = Math.max(0, 1 - progress);
    
    // 绘制格子
    this._drawCell(ctx, cell, cs, alpha);
  }
  
  ctx.restore();
};
```

**绘制特点：**
- 从末端向中心绘制（中心在最上层）
- 每个格子独立计算alpha（透明度）
- 使用 `lighter` 叠加模式，多个爆炸重叠时会变亮

### B3. 单个格子绘制

```javascript
SimpleExplosion.prototype._drawCell = function(ctx, cell, cs, alpha) {
  var x = this.cx + cell.x * cs - cs / 2;
  var y = this.cy + cell.y * cs - cs / 2;
  
  // 重叠消除间隙
  var size = cs * (1 + ExplosionConfig.overlapRatio * 2);  // 1.5倍格子
  var half = size / 2;
  var cx = x + cs / 2;
  var cy = y + cs / 2;
  
  // 径向渐变
  var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, half);
  grad.addColorStop(0, 'rgba(255,220,100,' + (alpha * brightness) + ')');
  grad.addColorStop(0.5, 'rgba(255,120,40,' + (alpha * brightness * 0.6) + ')');
  grad.addColorStop(1, 'rgba(255,120,40,0)');
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, half, 0, Math.PI * 2);  // 圆形
  ctx.fill();
};
```

**问题：**
1. 圆形半径 = 0.75 * cellSize（因为1.5倍/2），超出格子边界
2. 没有网格边界裁剪，导致绘制到场景外（边缘出框）
3. 使用 `lighter` 叠加，多个爆炸重叠时亮度异常

### B4. 生命周期

```javascript
SimpleExplosion.prototype.update = function(dt) {
  this.elapsed += dt * 1000;  // 转换为毫秒
  return this.elapsed < ExplosionConfig.totalDuration;  // 250ms
};
```

**特点：**
- 总生命周期250ms
- 每个格子根据 spawnTime 延迟出现
- 所有格子同时消散（基于elapsed）

---

## 模块B问题总结

| 问题 | 根因 | 影响 |
|------|------|------|
| 2级形状不匹配 | 只支持十字，不支持3×3 | 2级应该是9格（含斜向），实际是十字9格 |
| 1级边缘出框 | 圆形绘制无裁剪 | 场景边缘爆炸超出网格 |
| 叠加变亮 | globalCompositeOperation='lighter' | 多个爆炸重叠时异常明亮 |

## 模块B修复方案

**方案1：修改SimpleExplosion支持不同形状（推荐）**

根据power创建不同形状：
- power=1：十字5格（当前）
- power=2：3×3范围9格（新增斜向）
- power=3：十字延伸（当前）
- power=4：各方向衍生2格（需要新算法）

**方案2：添加边界裁剪**

在_drawCell中添加：
```javascript
// 保存当前状态
ctx.save();
// 设置裁剪区域为当前格子
ctx.beginPath();
ctx.rect(x, y, cs, cs);
ctx.clip();
// 绘制圆形
ctx.arc(cx, cy, half, 0, Math.PI * 2);
ctx.fill();
// 恢复状态
ctx.restore();
```

---

_模块B完成_
