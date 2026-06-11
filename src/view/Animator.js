/**
 * View/Animator.js
 * 动画管理器 - 极简爆炸特效
 * 
 * 设计原则：
 * 1. 爆炸时间极短（250ms）
 * 2. 中心→四向逐格蔓延
 * 3. 统一颜色，只区分范围
 * 4. 无震屏，无线条
 */

// ========== 配置 ==========

// 各等级爆炸颜色配置
var LevelColors = {
  1: { // 白色
    center: 'rgba(255,255,255,',
    inner: 'rgba(220,240,255,',
    mid: 'rgba(180,220,255,',
    outer: 'rgba(120,180,255,',
    edge: 'rgba(80,150,255,0)'
  },
  2: { // 蓝色
    center: 'rgba(200,240,255,',
    inner: 'rgba(100,200,255,',
    mid: 'rgba(40,150,255,',
    outer: 'rgba(20,100,220,',
    edge: 'rgba(10,60,180,0)'
  },
  3: { // 紫色
    center: 'rgba(255,200,255,',
    inner: 'rgba(220,100,255,',
    mid: 'rgba(180,40,255,',
    outer: 'rgba(140,20,220,',
    edge: 'rgba(100,10,180,0)'
  },
  4: { // 橙红色
    center: 'rgba(255,255,255,',
    inner: 'rgba(255,180,50,',
    mid: 'rgba(255,100,20,',
    outer: 'rgba(220,60,10,',
    edge: 'rgba(180,30,5,0)'
  }
};

var ExplosionConfig = {
  spreadInterval: 60,      // 每格蔓延间隔（ms）
  totalDuration: 500,       // 总生命周期（ms）- 0.5秒
  overlapRatio: 0.3,       // 重叠比例
};

// ========== SimpleExplosion: 极简爆炸 ==========

function SimpleExplosion(cx, cy, cellSize, power, gridSize, centerGridX, centerGridY, evo) {
  this.cx = cx;
  this.cy = cy;
  this.cellSize = cellSize;
  this.power = Math.min(power, 4);
  this.elapsed = 0;
  this.cells = [];
  
  // 边界计算
  var half = Math.floor(gridSize / 2);
  this.minX = -half;
  this.maxX = gridSize % 2 === 0 ? half - 1 : half;
  this.minY = -half;
  this.maxY = gridSize % 2 === 0 ? half - 1 : half;
  
  // [v0.7.9] 根据 evo 创建正确的爆炸形状
  // evo=0 (Lv1): 十字 1 格
  // evo=2 (Lv2): 上下 2 格（竖直）
  // evo=3 (Lv3): 左右 2 格（横向）
  // evo=5 (Lv4): 十字 1 格 + 对角 1 格
  
  if (evo === 2) {
    // Lv2 蓝色：上下 2 格（竖直方向）
    this.cells.push({ x: 0, y: 0, distance: 0, spawnTime: 0 });
    var dirs2 = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }];
    dirs2.forEach(function(dir) {
      for (var d = 1; d <= 2; d++) {
        var gx = dir.dx * d;
        var gy = dir.dy * d;
        if (gx < this.minX || gx > this.maxX || gy < this.minY || gy > this.maxY) continue;
        this.cells.push({
          x: gx, y: gy,
          distance: d,
          spawnTime: d * ExplosionConfig.spreadInterval
        });
      }
    }.bind(this));
  } else if (evo === 3) {
    // Lv3 紫色：左右 2 格（横向方向）
    this.cells.push({ x: 0, y: 0, distance: 0, spawnTime: 0 });
    var dirs3 = [{ dx: -1, dy: 0 }, { dx: 1, dy: 0 }];
    dirs3.forEach(function(dir) {
      for (var d = 1; d <= 2; d++) {
        var gx = dir.dx * d;
        var gy = dir.dy * d;
        if (gx < this.minX || gx > this.maxX || gy < this.minY || gy > this.maxY) continue;
        this.cells.push({
          x: gx, y: gy,
          distance: d,
          spawnTime: d * ExplosionConfig.spreadInterval
        });
      }
    }.bind(this));
  } else if (evo === 5) {
    // Lv4 红色：十字 1 格 + 对角 1 格
    this.cells.push({ x: 0, y: 0, distance: 0, spawnTime: 0 });
    // 十字方向
    var crossDirs = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }];
    crossDirs.forEach(function(dir) {
      var gx = dir.dx;
      var gy = dir.dy;
      if (gx < this.minX || gx > this.maxX || gy < this.minY || gy > this.maxY) return;
      this.cells.push({
        x: gx, y: gy,
        distance: 1,
        spawnTime: ExplosionConfig.spreadInterval
      });
    }.bind(this));
    // 对角方向
    var diagDirs = [{ dx: -1, dy: -1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 }, { dx: 1, dy: 1 }];
    diagDirs.forEach(function(dir) {
      var gx = dir.dx;
      var gy = dir.dy;
      if (gx < this.minX || gx > this.maxX || gy < this.minY || gy > this.maxY) return;
      this.cells.push({
        x: gx, y: gy,
        distance: 1,
        spawnTime: ExplosionConfig.spreadInterval
      });
    }.bind(this));
  } else {
    // Lv1 白色：十字 1 格（默认）
    this.cells.push({ x: 0, y: 0, distance: 0, spawnTime: 0 });
    var dirs = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }];
    dirs.forEach(function(dir) {
      var gx = dir.dx;
      var gy = dir.dy;
      if (gx < this.minX || gx > this.maxX || gy < this.minY || gy > this.maxY) return;
      this.cells.push({
        x: gx, y: gy,
        distance: 1,
        spawnTime: ExplosionConfig.spreadInterval
      });
    }.bind(this));
  }
}

SimpleExplosion.prototype.update = function(dt) {
  this.elapsed += dt * 1000; // 转换为毫秒
  return this.elapsed < ExplosionConfig.totalDuration;
};

SimpleExplosion.prototype.draw = function(ctx) {
  var cfg = ExplosionConfig;
  var cs = this.cellSize;
  var elapsed = this.elapsed;
  
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  
  // 从末端向中心绘制（中心在最上层）
  for (var i = this.cells.length - 1; i >= 0; i--) {
    var cell = this.cells[i];
    
    // 还没出现
    if (elapsed < cell.spawnTime) continue;
    
    // 检查格子是否在网格边界内
    if (cell.x < this.minX || cell.x > this.maxX || cell.y < this.minY || cell.y > this.maxY) continue;
    
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

// 绘制单个格子
SimpleExplosion.prototype._drawCell = function(ctx, cell, cs, alpha) {
  var x = this.cx + cell.x * cs - cs / 2;
  var y = this.cy + cell.y * cs - cs / 2;
  
  // 保存状态并设置裁剪（限制在当前格子内，防止出框）
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, cs, cs);
  ctx.clip();
  
  // 中心格更亮
  var brightness = cell.distance === 0 ? 1.0 : 0.7;
  
  // 重叠消除间隙
  var size = cs * (1 + ExplosionConfig.overlapRatio * 2);
  var half = size / 2;
  var cx = x + cs / 2;
  var cy = y + cs / 2;
  
  // 增强爆炸感：添加内部亮核（使用对应等级的中心颜色）
  var colors = LevelColors[this.power] || LevelColors[4];
  var coreSize = cs * 0.3;
  var coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize);
  coreGrad.addColorStop(0, colors.center + (alpha * brightness) + ')');
  coreGrad.addColorStop(1, colors.center + '0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, coreSize, 0, Math.PI * 2);
  ctx.fill();
  
  // 增强爆炸感：添加内部亮核
  var colors = LevelColors[this.power] || LevelColors[4];
  var coreSize = cs * 0.3;
  var coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize);
  coreGrad.addColorStop(0, colors.center + (alpha * brightness) + ')');
  coreGrad.addColorStop(1, colors.center + '0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, coreSize, 0, Math.PI * 2);
  ctx.fill();
  
  // 径向渐变 - 增强中层和外层颜色浓度
  var colors = LevelColors[this.power] || LevelColors[4];
  var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, half);
  // 核心：亮白热
  grad.addColorStop(0, colors.center + (alpha * brightness) + ')');
  // 内层
  grad.addColorStop(0.2, colors.inner + (alpha * brightness) + ')');
  // 中层：增强浓度
  grad.addColorStop(0.5, colors.mid + (alpha * brightness * 0.95) + ')');
  // 外层：增强浓度
  grad.addColorStop(0.8, colors.outer + (alpha * brightness * 0.7) + ')');
  // 边缘：透明
  grad.addColorStop(1, colors.edge);
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, half, 0, Math.PI * 2);
  ctx.fill();
  
  // 恢复状态
  ctx.restore();
};

// 最外层线条
SimpleExplosion.prototype._drawEndLine = function(ctx, cell, cs, alpha) {
  var x = this.cx + cell.x * cs;
  var y = this.cy + cell.y * cs;
  
  // 方向
  var dirX = cell.x > 0 ? 1 : cell.x < 0 ? -1 : 0;
  var dirY = cell.y > 0 ? 1 : cell.y < 0 ? -1 : 0;
  
  // 从格子中心向外延伸
  var startX = x + dirX * cs * 0.3;
  var startY = y + dirY * cs * 0.3;
  var endX = x + dirX * cs * 0.8;
  var endY = y + dirY * cs * 0.8;
  
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = 'rgba(255, 255, 200, 0.8)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
};

// ========== Animator 主类 ==========

class Animator {
  constructor() {
    this.explosions = [];
    this.pool = [];
    this.nextId = 1;
    
    // 屏幕闪光
    this.screenFlash = null;
  }

  // 震屏（已移除）
  getScreenShake() {
    return { x: 0, y: 0 };
  }

  // 屏幕闪光（保留）
  createScreenFlash(intensity = 0.4, duration = 0.25) {
    this.screenFlash = {
      intensity,
      duration: 0,
      totalDuration: duration
    };
  }

  drawScreenFlash(ctx, w, h) {
    if (!this.screenFlash) return;
    var s = this.screenFlash;
    var progress = s.duration / s.totalDuration;
    if (progress >= 1) {
      this.screenFlash = null;
      return;
    }
    var alpha = s.intensity * (1 - progress * progress);
    ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
    ctx.fillRect(0, 0, w, h);
  }

  // ========== 爆炸创建 ==========
  
  // 创建十字蔓延爆炸
  // [v0.7.9] 根据 evolution 值创建正确的爆炸形状
  createCrossExplosion(cx, cy, cellSize, evo, gridSize, centerGridX, centerGridY) {
    // 限制同屏数量
    if (this.explosions.length >= 3) {
      this.explosions.shift(); // 移除最旧的
    }
    
    // 根据 evo 映射到 power（用于特效颜色）
    var powerMap = { 0: 1, 2: 2, 3: 3, 5: 4 };
    var power = powerMap[evo] || 1;
    
    // 创建新爆炸对象，传入 evo 用于形状计算
    var explosion = new SimpleExplosion(cx, cy, cellSize, power, gridSize, centerGridX, centerGridY, evo);
    
    this.explosions.push(explosion);
    return explosion;
  }

  // 兼容旧接口
  createExplosion(x, y, cellSize, color, gridSize, centerGridX, centerGridY) {
    var cx = x + cellSize / 2;
    var cy = y + cellSize / 2;
    var power = 1; // 默认1级
    var gs = gridSize || 8;
    var cgx = centerGridX || 0;
    var cgy = centerGridY || 0;
    return this.createCrossExplosion(cx, cy, cellSize, power, gs, cgx, cgy);
  }

  createWallBreak(x, y, cellSize, wallType, gridSize, centerGridX, centerGridY) {
    // 墙壁破坏不创建爆炸特效，避免震屏
    return null;
  }

  // ========== 升级特效 ==========

  createUpgrade(x, y, cellSize) {
    var cx = x + cellSize / 2;
    var cy = y + cellSize / 2;
    var id = this.nextId++;
    
    // 简化为环
    this.animations = this.animations || [];
    this.animations.push({
      id: id,
      type: 'ring',
      x: cx, y: cy,
      radius: 0,
      maxRadius: cellSize * 0.8,
      alpha: 1,
      duration: 0.4,
      color: '#00D9FF'
    });
    
    return id;
  }

  createFloatingText(x, y, text, color, scale) {
    var id = this.nextId++;
    this.animations = this.animations || [];
    this.animations.push({
      id: id,
      type: 'floating_text',
      x: x, y: y,
      text: text,
      color: color || '#FFD700',
      life: 1.0,
      vy: -1.8,
      duration: 1.0,
      scale: scale || 1,
      popIn: 0.15
    });
    return id;
  }

  // ========== 更新与绘制 ==========

  update(dt) {
    // 更新闪光
    if (this.screenFlash) {
      this.screenFlash.duration += dt;
    }
    
    // 更新爆炸（回收已结束的）
    for (var i = this.explosions.length - 1; i >= 0; i--) {
      var explosion = this.explosions[i];
      if (!explosion.update(dt)) {
        // 回收
        explosion.cells.length = 0;
        this.pool.push(explosion);
        this.explosions.splice(i, 1);
      }
    }
    
    // 更新旧动画
    if (this.animations) {
      this.animations = this.animations.filter(function(anim) {
        anim.progress = (anim.progress || 0) + dt / anim.duration;
        
        switch (anim.type) {
          case 'ring':
            anim.radius = anim.maxRadius * Math.sqrt(anim.progress);
            anim.alpha = 1 - anim.progress;
            return anim.progress < 1;
          case 'floating_text':
            anim.life -= dt;
            anim.y += anim.vy;
            return anim.life > 0;
          default:
            return anim.progress < 1;
        }
      });
    }
  }

  draw(ctx) {
    // 绘制爆炸
    this.explosions.forEach(function(explosion) {
      explosion.draw(ctx);
    });
    
    // 绘制旧动画
    if (this.animations) {
      this.animations.forEach(function(anim) {
        switch (anim.type) {
          case 'ring':
            drawRing(ctx, anim);
            break;
          case 'floating_text':
            drawFloatingText(ctx, anim);
            break;
        }
      });
    }
  }

  // ========== 工具方法 ==========

  clear() {
    // 回收所有爆炸
    this.explosions.forEach(function(ex) {
      ex.cells.length = 0;
      this.pool.push(ex);
    }, this);
    this.explosions.length = 0;
    this.animations = [];
    this.screenFlash = null;
  }

  getActiveCount() {
    return this.explosions.length + (this.animations ? this.animations.length : 0);
  }
}

// ========== 绘制辅助函数 ==========

function drawRing(ctx, anim) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, anim.alpha);
  ctx.beginPath();
  ctx.arc(anim.x, anim.y, anim.radius, 0, Math.PI * 2);
  ctx.strokeStyle = anim.color;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();
}

function drawFloatingText(ctx, anim) {
  ctx.save();
  var scale = anim.scale;
  if (anim.progress < anim.popIn) {
    var t = anim.progress / anim.popIn;
    scale *= (1 + Math.sin(t * Math.PI) * 0.5);
  } else {
    scale *= (1 - (anim.progress - anim.popIn) * 0.2);
  }
  ctx.globalAlpha = Math.max(0, anim.life);
  ctx.fillStyle = anim.color;
  ctx.font = 'bold ' + (20 * scale) + 'px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.translate(anim.x, anim.y);
  ctx.scale(scale, scale);
  ctx.fillText(anim.text, 0, 0);
  ctx.restore();
}

// 导出到微信小游戏全局
GameGlobal.Animator = Animator;