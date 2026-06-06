/**
 * ParticleSystem.js
 * 粒子特效系统 - 7层架构实现
 * 
 * 分层：
 * Layer 0: 地面焦痕 (ScorchMark) - Normal
 * Layer 1: 烟雾背景 (Smoke) - Normal
 * Layer 2: 上升火星 (Ember) - Additive
 * Layer 3: 破片飞溅 (Debris) - Normal
 * Layer 4: 核心火球 (Fireball) - Screen
 * Layer 5: 闪光星点 (Sparkle) - Additive
 * Layer 6: 冲击波环 (Shockwave) - Additive
 */

var ParticleSystem = function() {
  // 分层粒子数组
  this.layers = [
    [], // Layer 0: scorch
    [], // Layer 1: smoke
    [], // Layer 2: ember
    [], // Layer 3: debris
    [], // Layer 4: fireball
    [], // Layer 5: sparkle
    []  // Layer 6: shockwave
  ];
  
  // 配置
  this.config = {
    maxParticles: 200
  };
};

// ========== 公共 API：创建爆炸 ==========

ParticleSystem.prototype.createExplosion = function(cx, cy, evolution) {
  console.log('[PS] Explosion', cx, cy, 'evo', evolution);
  evolution = evolution || 0;
  
  // 检查总粒子数，防止卡死
  var totalParticles = 0;
  for (var i = 0; i < this.layers.length; i++) {
    totalParticles += this.layers[i].length;
  }
  if (totalParticles > this.config.maxParticles) {
    console.warn('[PS] Particle limit reached, skipping');
    return;
  }
  
  // T+0: 核心火球 + 冲击波 + 闪光星点 + 地面焦痕
  this.addFireball(cx, cy, evolution);
  this.addShockwave(cx, cy, evolution);
  this.addSparkles(cx, cy, evolution);
  this.addScorchMark(cx, cy, evolution);
  
  // T+50ms: 破片飞溅
  var self = this;
  setTimeout(function() {
    self.addDebris(cx, cy, evolution);
  }, 50);
  
  // T+100ms: 上升火星 + 烟雾
  setTimeout(function() {
    self.addEmbers(cx, cy, evolution);
    self.addSmoke(cx, cy, evolution);
  }, 100);
  
  // T+200ms: 更多烟雾
  setTimeout(function() {
    self.addSmoke(cx, cy, evolution);
  }, 200);
};

// ========== Layer 0: 地面焦痕 ==========

ParticleSystem.prototype.addScorchMark = function(cx, cy, evolution) {
  var size = 60 + evolution * 20;
  
  this.layers[0].push(this.createParticle({
    type: 'scorch',
    x: cx, y: cy,
    vx: 0, vy: 0,
    life: 2.5,
    size: size,
    r: 20, g: 10, b: 5,
    a: 0.7
  }));
};

// ========== Layer 1: 烟雾背景 ==========

ParticleSystem.prototype.addSmoke = function(cx, cy, evolution) {
  var count = 8 + evolution * 4;
  
  for (var i = 0; i < count; i++) {
    this.layers[1].push(this.createParticle({
      type: 'smoke',
      x: cx + (Math.random() - 0.5) * 40,
      y: cy + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 30,
      vy: -40 - Math.random() * 80,
      life: 1.0 + Math.random() * 0.8,
      size: 20 + Math.random() * 30,
      endSize: 50 + Math.random() * 40,
      r: 120, g: 120, b: 120,
      a: 0.6,
      gravity: -15,
      drag: 0.2,
      turbulence: 0.3
    }));
  }
};

// ========== Layer 2: 上升火星 ==========

ParticleSystem.prototype.addEmbers = function(cx, cy, evolution) {
  var count = 15 + evolution * 10;
  
  for (var i = 0; i < count; i++) {
    var angle = Math.random() * Math.PI * 2;
    var speed = 50 + Math.random() * 150;
    
    this.layers[2].push(this.createParticle({
      type: 'ember',
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 100,
      life: 0.5 + Math.random() * 0.7,
      size: 2 + Math.random() * 3,
      r: 255, g: 150 + Math.random() * 100, b: 50,
      a: 1.0,
      gravity: -30,
      drag: 0.1,
      flickerSpeed: 8 + Math.random() * 15
    }));
  }
};

// ========== Layer 3: 破片飞溅 ==========

ParticleSystem.prototype.addDebris = function(cx, cy, evolution) {
  var count = 10 + evolution * 5;
  var colors = [
    [139, 90, 43],
    [160, 82, 45],
    [120, 60, 30]
  ];
  
  for (var i = 0; i < count; i++) {
    var angle = Math.random() * Math.PI * 2;
    var speed = 100 + Math.random() * 300;
    var color = colors[Math.floor(Math.random() * colors.length)];
    
    this.layers[3].push(this.createParticle({
      type: 'debris',
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 50,
      life: 0.3 + Math.random() * 0.4,
      size: 3 + Math.random() * 5,
      r: color[0], g: color[1], b: color[2],
      a: 1.0,
      gravity: 300,
      drag: 0.05,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 10
    }));
  }
};

// ========== Layer 4: 核心火球 ==========

ParticleSystem.prototype.addFireball = function(cx, cy, evolution) {
  var size = 50 + evolution * 25;
  
  // 核心层
  this.layers[4].push(this.createParticle({
    type: 'fireball',
    x: cx, y: cy,
    vx: 0, vy: 0,
    life: 0.6 + evolution * 0.2,
    size: size * 0.4,
    endSize: size * 1.5,
    r: 255, g: 255, b: 200,
    a: 1.0,
    layer: 0  // 内层
  }));
  
  // 中层
  this.layers[4].push(this.createParticle({
    type: 'fireball',
    x: cx, y: cy,
    vx: 0, vy: 0,
    life: 0.8 + evolution * 0.2,
    size: size * 0.8,
    endSize: size * 2.0,
    r: 255, g: 200, b: 50,
    a: 0.8,
    layer: 1  // 中层
  }));
  
  // 外层
  this.layers[4].push(this.createParticle({
    type: 'fireball',
    x: cx, y: cy,
    vx: 0, vy: 0,
    life: 1.0 + evolution * 0.2,
    size: size * 1.2,
    endSize: size * 2.5,
    r: 255, g: 120, b: 30,
    a: 0.5,
    layer: 2  // 外层
  }));
};

// ========== Layer 5: 闪光星点 ==========

ParticleSystem.prototype.addSparkles = function(cx, cy, evolution) {
  var count = 20 + evolution * 15;
  
  for (var i = 0; i < count; i++) {
    var angle = Math.random() * Math.PI * 2;
    var speed = 100 + Math.random() * 400;
    
    this.layers[5].push(this.createParticle({
      type: 'sparkle',
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.2 + Math.random() * 0.3,
      size: 1 + Math.random() * 2,
      r: 255, g: 255, b: 200 + Math.random() * 55,
      a: 1.0,
      gravity: 80,
      drag: 0.05
    }));
  }
};

// ========== Layer 6: 冲击波环 ==========

ParticleSystem.prototype.addShockwave = function(cx, cy, evolution) {
  var maxRadius = 80 + evolution * 40;
  
  this.layers[6].push(this.createParticle({
    type: 'shockwave',
    x: cx, y: cy,
    vx: 0, vy: 0,
    life: 0.4 + evolution * 0.1,
    size: 0,
    endSize: maxRadius,
    r: 255, g: 200, b: 100,
    a: 0.8,
    lineWidth: 4
  }));
  
  // 二次环
  this.layers[6].push(this.createParticle({
    type: 'shockwave',
    x: cx, y: cy,
    vx: 0, vy: 0,
    life: 0.5 + evolution * 0.1,
    size: 0,
    endSize: maxRadius * 0.7,
    r: 255, g: 150, b: 50,
    a: 0.5,
    lineWidth: 3,
    delay: 0.1
  }));
};

// ========== 粒子工厂 ==========

ParticleSystem.prototype.createParticle = function(config) {
  return {
    x: config.x || 0,
    y: config.y || 0,
    vx: config.vx || 0,
    vy: config.vy || 0,
    life: config.life || 1.0,
    maxLife: config.life || 1.0,
    size: config.size || 5,
    endSize: config.endSize || config.size || 5,
    r: config.r || 255,
    g: config.g || 255,
    b: config.b || 255,
    a: config.a || 1,
    gravity: config.gravity || 0,
    drag: config.drag || 0,
    rotation: config.rotation || 0,
    rotationSpeed: config.rotationSpeed || 0,
    type: config.type || 'spark',
    turbulence: config.turbulence || 0,
    flickerSpeed: config.flickerSpeed || 0,
    lineWidth: config.lineWidth || 1,
    layer: config.layer || 0,
    delay: config.delay || 0,
    elapsed: 0
  };
};

// ========== 更新 ==========

ParticleSystem.prototype.update = function(dt) {
  for (var layer = 0; layer < this.layers.length; layer++) {
    var particles = this.layers[layer];
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      
      p.elapsed += dt;
      
      // 延迟处理
      if (p.delay > 0) {
        if (p.elapsed < p.delay) continue;
      }
      
      // 生命周期
      var actualElapsed = p.elapsed - p.delay;
      var actualLife = p.life;
      if (actualElapsed >= actualLife) {
        particles.splice(i, 1);
        continue;
      }
      
      // 物理
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += (p.gravity || 0) * dt;
      
      // 阻力
      if (p.drag) {
        p.vx *= (1 - p.drag * dt);
        p.vy *= (1 - p.drag * dt);
      }
      
      // 旋转
      if (p.rotationSpeed) {
        p.rotation += p.rotationSpeed * dt;
      }
      
      // 大小插值
      if (p.endSize !== undefined && p.maxLife > 0) {
        var t = actualElapsed / actualLife;
        p.size = p.size + (p.endSize - p.size) * t;
      }
    }
  }
};

// ========== 绘制 ==========

ParticleSystem.prototype.draw = function(ctx) {
  // Layer 0: 地面焦痕 (Normal)
  this.drawLayer(ctx, 0, 'source-over');
  
  // Layer 1: 烟雾 (Normal)
  this.drawLayer(ctx, 1, 'source-over');
  
  // Layer 2: 上升火星 (Additive)
  this.drawLayer(ctx, 2, 'lighter');
  
  // Layer 3: 破片 (Normal)
  this.drawLayer(ctx, 3, 'source-over');
  
  // Layer 4: 火球 (Screen)
  this.drawLayer(ctx, 4, 'screen');
  
  // Layer 5: 闪光星点 (Additive)
  this.drawLayer(ctx, 5, 'lighter');
  
  // Layer 6: 冲击波 (Additive)
  this.drawLayer(ctx, 6, 'lighter');
};

ParticleSystem.prototype.drawLayer = function(ctx, layerIndex, blendMode) {
  var particles = this.layers[layerIndex];
  if (particles.length === 0) return;
  
  ctx.globalCompositeOperation = blendMode;
  
  for (var i = 0; i < particles.length; i++) {
    this.drawParticle(ctx, particles[i]);
  }
};

ParticleSystem.prototype.drawParticle = function(ctx, p) {
  var actualElapsed = p.elapsed - p.delay;
  if (actualElapsed < 0) return;
  
  var alpha = Math.max(0, Math.min(1, 1 - actualElapsed / p.life));
  var size = p.size || 5;
  
  // 防御性检查
  if (!isFinite(p.x) || !isFinite(p.y) || !isFinite(size) || size <= 0) {
    return;
  }
  
  ctx.save();
  
  switch (p.type) {
    case 'scorch':
      this.drawScorch(ctx, p, alpha, size);
      break;
    case 'smoke':
      this.drawSmoke(ctx, p, alpha, size);
      break;
    case 'ember':
      this.drawEmber(ctx, p, alpha, size);
      break;
    case 'debris':
      this.drawDebris(ctx, p, alpha, size);
      break;
    case 'fireball':
      this.drawFireball(ctx, p, alpha, size);
      break;
    case 'sparkle':
      this.drawSparkle(ctx, p, alpha, size);
      break;
    case 'shockwave':
      this.drawShockwave(ctx, p, alpha, size);
      break;
  }
  
  ctx.restore();
};

// ========== 各类型绘制方法 ==========

ParticleSystem.prototype.drawScorch = function(ctx, p, alpha, size) {
  // 防御性检查
  if (!isFinite(p.x) || !isFinite(p.y) || !isFinite(size) || size <= 0) {
    return;
  }
  
  var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
  grad.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${alpha * p.a * 0.8})`);
  grad.addColorStop(0.5, `rgba(${p.r},${p.g},${p.b},${alpha * p.a * 0.4})`);
  grad.addColorStop(1, `rgba(${p.r},${p.g},${p.b},0)`);
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
  ctx.fill();
  
  // 裂纹
  ctx.strokeStyle = `rgba(60, 40, 30, ${alpha * p.a * 0.3})`;
  ctx.lineWidth = 1;
  for (var i = 0; i < 5; i++) {
    var angle = (i / 5) * Math.PI * 2 + p.rotation;
    var length = size * (0.3 + Math.random() * 0.5);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + Math.cos(angle) * length, p.y + Math.sin(angle) * length);
    ctx.stroke();
  }
};

ParticleSystem.prototype.drawSmoke = function(ctx, p, alpha, size) {
  var turbX = Math.sin(p.elapsed * 2) * p.turbulence * 10;
  var turbY = Math.cos(p.elapsed * 1.5) * p.turbulence * 5;
  
  var grad = ctx.createRadialGradient(
    p.x + turbX, p.y + turbY, 0,
    p.x + turbX, p.y + turbY, size
  );
  grad.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${alpha * p.a * 0.5})`);
  grad.addColorStop(0.5, `rgba(${p.r},${p.g},${p.b},${alpha * p.a * 0.2})`);
  grad.addColorStop(1, `rgba(${p.r},${p.g},${p.b},0)`);
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(p.x + turbX, p.y + turbY, size, 0, Math.PI * 2);
  ctx.fill();
};

ParticleSystem.prototype.drawEmber = function(ctx, p, alpha, size) {
  var flicker = Math.sin(p.elapsed * p.flickerSpeed) * 0.3 + 0.7;
  var a = alpha * p.a * flicker;
  
  // 光晕
  var glowSize = size * 3;
  var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
  grad.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${a})`);
  grad.addColorStop(0.5, `rgba(${p.r},${p.g},${p.b},${a * 0.3})`);
  grad.addColorStop(1, `rgba(${p.r},${p.g},${p.b},0)`);
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
  ctx.fill();
  
  // 核心
  ctx.fillStyle = `rgba(255, 255, 200, ${a})`;
  ctx.beginPath();
  ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
  ctx.fill();
};

ParticleSystem.prototype.drawDebris = function(ctx, p, alpha, size) {
  ctx.globalAlpha = alpha * p.a;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation || 0);
  ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
  ctx.fillRect(-size / 2, -size / 2, size, size);
};

ParticleSystem.prototype.drawFireball = function(ctx, p, alpha, size) {
  var a = alpha * p.a;
  var r = p.r, g = p.g, b = p.b;
  
  // 根据layer调整颜色
  if (p.layer === 0) {
    // 内层：白热
    r = 255; g = 255; b = 200;
  } else if (p.layer === 1) {
    // 中层：金黄
    r = 255; g = 200; b = 50;
  } else {
    // 外层：橙红
    r = 255; g = 120; b = 30;
  }
  
  var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
  grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
  grad.addColorStop(0.6, `rgba(${r},${g},${b},${a * 0.5})`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
  ctx.fill();
};

ParticleSystem.prototype.drawSparkle = function(ctx, p, alpha, size) {
  var a = alpha * p.a;
  
  // 拖尾
  var trailLength = 3;
  ctx.strokeStyle = `rgba(${p.r},${p.g},${p.b},${a * 0.5})`;
  ctx.lineWidth = size * 0.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(p.x - p.vx * 0.02, p.y - p.vy * 0.02);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
  
  // 核心亮点
  ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
  ctx.beginPath();
  ctx.arc(p.x, p.y, size * 1.5, 0, Math.PI * 2);
  ctx.fill();
};

ParticleSystem.prototype.drawShockwave = function(ctx, p, alpha, size) {
  var progress = p.elapsed / p.life;
  var a = Math.sin(progress * Math.PI) * alpha * p.a;
  
  ctx.beginPath();
  ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(${p.r},${p.g},${p.b},${a})`;
  ctx.lineWidth = p.lineWidth * (1 - progress);
  ctx.stroke();
};

// ========== 工具方法 ==========

ParticleSystem.prototype.clear = function() {
  for (var i = 0; i < this.layers.length; i++) {
    this.layers[i] = [];
  }
};

ParticleSystem.prototype.getActiveCount = function() {
  var count = 0;
  for (var i = 0; i < this.layers.length; i++) {
    count += this.layers[i].length;
  }
  return count;
};

// ========== 升级特效 ==========

ParticleSystem.prototype.createUpgrade = function(cx, cy, evolution) {
  console.log('[PS] Upgrade', cx, cy, 'evo', evolution);
  evolution = evolution || 0;
  
  // 升级光环粒子
  var count = 30 + evolution * 20;
  var colors = [
    [255, 200, 50],   // 黄
    [100, 200, 255],  // 蓝
    [200, 100, 255],  // 紫
    [255, 80, 80]     // 红
  ];
  var color = colors[evolution] || colors[0];
  
  for (var i = 0; i < count; i++) {
    var angle = Math.random() * Math.PI * 2;
    var speed = 50 + Math.random() * 150;
    var life = 0.5 + Math.random() * 0.5;
    
    this.layers[5].push(this.createParticle({
      type: 'sparkle',
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 100,
      life: life,
      size: 2 + Math.random() * 3,
      r: color[0], g: color[1], b: color[2],
      a: 1.0,
      gravity: -50,
      drag: 0.1
    }));
  }
  
  // 中心闪光
  this.layers[4].push(this.createParticle({
    type: 'fireball',
    x: cx, y: cy,
    vx: 0, vy: 0,
    life: 0.4,
    size: 20,
    endSize: 60 + evolution * 20,
    r: 255, g: 255, b: 200,
    a: 0.8,
    layer: 0
  }));
};

// 导出到微信小游戏全局
GameGlobal.ParticleSystem = ParticleSystem;