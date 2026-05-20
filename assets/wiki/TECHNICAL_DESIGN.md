# 牛牛灭鼠游戏技术方案 - Timeline、蒙太奇与扩展系统

## 1. 核心架构设计

### 1.1 分层架构
```
┌─────────────────────────────────────────┐
│  Presentation Layer (表现层)              │
│  - 动画系统 (Animation System)            │
│  - 特效系统 (Particle System)             │
│  - 音效系统 (Audio System)                │
│  - UI系统 (UI Manager)                    │
├─────────────────────────────────────────┤
│  Logic Layer (逻辑层)                     │
│  - 游戏逻辑 (Game Logic)                  │
│  - 关卡系统 (Level System)                │
│  - 实体管理 (Entity Manager)              │
│  - 事件系统 (Event System)                │
├─────────────────────────────────────────┤
│  Data Layer (数据层)                      │
│  - 配置数据 (Config Data)                 │
│  - 存档系统 (Storage)                     │
│  - 资源管理 (Resource Manager)            │
└─────────────────────────────────────────┘
```

### 1.2 关键设计原则
1. **逻辑驱动表现**：所有视觉/听觉效果由逻辑事件触发
2. **时间线统一**：使用游戏帧时间（不是真实时间）
3. **实例独立**：每个实体有独立的状态和表现
4. **资源复用**：模板实例化，避免重复加载

---

## 2. 音效系统技术方案

### 2.1 需求分析
| 场景 | 音效类型 | 技术要求 |
|------|---------|---------|
| 牛牛升级 | 升级音效 | 根据等级变化音高/音色 |
| 牛牛爆炸 | 爆炸音效 | 根据等级变化音量和混响 |
| 连续引爆 | 奖励音效 | 叠加播放，避免 clipping |
| 命中敌人 | 命中音效 | 根据敌人类型变化 |
| 连续命中 | 增强音效 | 音高递增，节奏加快 |

### 2.2 技术架构
```javascript
class AudioSystem {
  constructor() {
    this.channels = {
      sfx: new AudioChannel('sfx', 8),      // 音效通道，最多8个同时播放
      music: new AudioChannel('music', 1),  // 背景音乐，单通道
      ambient: new AudioChannel('ambient', 2) // 环境音
    };
    
    this.soundGroups = new Map(); // 音效组管理
    this.playHistory = []; // 播放历史，用于连续判定
  }
}

class AudioChannel {
  constructor(name, maxConcurrent) {
    this.name = name;
    this.maxConcurrent = maxConcurrent;
    this.activeSounds = []; // 当前播放的音效
    this.volume = 1.0;
    this.mute = false;
  }
  
  play(soundId, options = {}) {
    // 1. 检查是否达到最大并发数
    if (this.activeSounds.length >= this.maxConcurrent) {
      // 策略：停止最老的 或 拒绝播放
      this.stopOldest();
    }
    
    // 2. 创建音效实例
    const sound = {
      id: soundId,
      startTime: Date.now(),
      volume: options.volume || 1.0,
      pitch: options.pitch || 1.0,
      loop: options.loop || false,
      priority: options.priority || 0
    };
    
    this.activeSounds.push(sound);
    return sound;
  }
  
  stopOldest() {
    // 停止优先级最低且播放最久的音效
    const oldest = this.activeSounds
      .sort((a, b) => a.priority - b.priority || a.startTime - b.startTime)[0];
    this.stop(oldest);
  }
}
```

### 2.3 音效组管理（Sound Group）
```javascript
class SoundGroup {
  constructor(name, sounds) {
    this.name = name;
    this.sounds = sounds; // 音效数组，支持随机选择
    this.cooldown = 0;   // 冷却时间，防止连续触发
    this.lastPlayTime = 0;
    
    // 连续播放增强配置
    this.comboConfig = {
      enabled: false,
      maxCombo: 5,
      pitchStep: 0.1,    // 每连击音高增加
      volumeStep: 0.05,   // 每连击音量增加
      resetTime: 500      // 多少ms后重置连击
    };
  }
  
  play(options = {}) {
    const now = Date.now();
    
    // 检查冷却
    if (now - this.lastPlayTime < this.cooldown) {
      return null;
    }
    
    // 计算连击
    let combo = 0;
    if (this.comboConfig.enabled) {
      combo = this.calculateCombo(now);
      options.pitch = 1.0 + combo * this.comboConfig.pitchStep;
      options.volume = Math.min(1.0, options.volume + combo * this.comboConfig.volumeStep);
    }
    
    // 随机选择音效（如果有多个）
    const soundId = this.sounds[Math.floor(Math.random() * this.sounds.length)];
    
    this.lastPlayTime = now;
    return { soundId, combo, options };
  }
}
```

### 2.4 连续引爆音效方案
```javascript
// 连续引爆音效管理器
class ExplosionComboManager {
  constructor() {
    this.explosions = []; // 爆炸事件队列
    this.comboWindow = 300; // 300ms内算连续
    this.maxCombo = 5;
    this.basePitch = 1.0;
    this.pitchStep = 0.15;
  }
  
  onExplosion(level, chainCount) {
    const now = Date.now();
    
    // 清理过期的爆炸记录
    this.explosions = this.explosions.filter(e => now - e.time < this.comboWindow);
    
    // 计算当前连击数
    const combo = Math.min(this.explosions.length + 1, this.maxCombo);
    
    // 记录本次爆炸
    this.explosions.push({ time: now, level });
    
    // 计算音效参数
    const pitch = this.basePitch + (combo - 1) * this.pitchStep;
    const volume = Math.min(1.0, 0.7 + combo * 0.05);
    
    return {
      soundId: `explosion_lv${level}`,
      pitch,
      volume,
      combo,
      delay: combo > 1 ? (combo - 1) * 50 : 0 // 连击时稍微延迟，创造节奏感
    };
  }
}
```

### 2.5 音效叠加与防 clipping
```javascript
class AudioMixer {
  constructor() {
    this.masterVolume = 1.0;
    this.channels = new Map();
  }
  
  calculateMix() {
    // 计算所有通道的总音量，防止超过1.0导致clipping
    let totalVolume = 0;
    this.channels.forEach(channel => {
      channel.activeSounds.forEach(sound => {
        totalVolume += sound.volume;
      });
    });
    
    // 如果总音量超过阈值，按比例降低
    if (totalVolume > 1.2) {
      const scale = 1.2 / totalVolume;
      this.channels.forEach(channel => {
        channel.activeSounds.forEach(sound => {
          sound.volume *= scale;
        });
      });
    }
  }
}
```

---

## 3. 特效系统技术方案

### 3.1 需求分析
| 场景 | 特效类型 | 技术要求 |
|------|---------|---------|
| 牛牛爆炸 | 粒子爆炸 | 根据等级变化粒子数量和颜色 |
| 墙壁损坏 | 破损特效 | 叠加在精灵上，不替换精灵 |
| 墙壁摧毁 | 粉碎特效 | 粒子 + 屏幕震动 |
| 升级光环 | 升级特效 | 叠加在牛牛上，短暂播放 |

### 3.2 粒子发射器系统
```javascript
class ParticleEmitter {
  constructor(config) {
    this.config = config;
    this.particles = [];
    this.active = false;
    this.lifetime = config.lifetime || 1000; // ms
    this.elapsed = 0;
  }
  
  emit(x, y, options = {}) {
    // 根据配置生成粒子
    const count = options.count || this.config.count;
    
    for (let i = 0; i < count; i++) {
      const particle = {
        x, y,
        vx: (Math.random() - 0.5) * this.config.speed,
        vy: (Math.random() - 0.5) * this.config.speed,
        life: this.config.particleLife,
        maxLife: this.config.particleLife,
        size: this.config.size * (0.5 + Math.random() * 0.5),
        color: this.getColor(options.level),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2
      };
      
      this.particles.push(particle);
    }
    
    this.active = true;
  }
  
  update(dt) {
    if (!this.active) return;
    
    this.elapsed += dt;
    
    // 更新粒子
    this.particles.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.rotation += p.rotationSpeed;
      
      // 重力影响
      p.vy += this.config.gravity * dt;
    });
    
    // 移除死亡粒子
    this.particles = this.particles.filter(p => p.life > 0);
    
    // 检查发射器生命周期
    if (this.elapsed >= this.lifetime && this.particles.length === 0) {
      this.active = false;
    }
  }
  
  draw(ctx) {
    if (!this.active) return;
    
    this.particles.forEach(p => {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });
    
    ctx.globalAlpha = 1.0;
  }
  
  getColor(level) {
    const colors = {
      0: '#FF6B35', // 橙色
      1: '#5BA3F5', // 蓝色
      2: '#9B59B6', // 紫色
      3: '#FF0000'  // 红色
    };
    return colors[level] || colors[0];
  }
}
```

### 3.3 特效与精灵的叠层关系
```javascript
class EffectLayer {
  constructor() {
    this.layers = {
      background: [],  // 背景特效（地面痕迹等）
      entity: [],      // 实体特效（叠加在精灵上）
      foreground: [],  // 前景特效（屏幕特效等）
      overlay: []      // 覆盖层（全屏效果）
    };
  }
  
  addEffect(effect, layer = 'entity') {
    this.layers[layer].push(effect);
  }
  
  update(dt) {
    Object.values(this.layers).forEach(layer => {
      layer.forEach(effect => effect.update(dt));
      // 清理已完成的特效
      this.layers[layer] = layer.filter(e => e.active);
    });
  }
  
  draw(ctx, layer) {
    this.layers[layer].forEach(effect => effect.draw(ctx));
  }
}

// 绘制顺序
class Renderer {
  render() {
    // 1. 绘制背景
    this.drawBackground();
    this.effectLayer.draw(ctx, 'background');
    
    // 2. 绘制实体（墙壁、牛牛）
    this.drawEntities();
    this.effectLayer.draw(ctx, 'entity'); // 实体特效叠加
    
    // 3. 绘制前景
    this.effectLayer.draw(ctx, 'foreground');
    
    // 4. 绘制覆盖层
    this.effectLayer.draw(ctx, 'overlay');
  }
}
```

### 3.4 墙壁损坏状态特效
```javascript
class WallDamageEffect {
  constructor(wall) {
    this.wall = wall;
    this.damageLevel = 0; // 0=完好, 1=轻微, 2=严重
    this.cracks = []; // 裂纹粒子
    this.active = true;
  }
  
  addDamage(amount) {
    this.damageLevel = Math.min(3, this.damageLevel + amount);
    
    // 生成裂纹
    for (let i = 0; i < amount * 3; i++) {
      this.cracks.push({
        x: Math.random() * this.wall.width,
        y: Math.random() * this.wall.height,
        length: 10 + Math.random() * 20,
        angle: Math.random() * Math.PI * 2
      });
    }
  }
  
  draw(ctx, x, y) {
    // 绘制裂纹（叠加在墙壁精灵上）
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    
    this.cracks.forEach(crack => {
      ctx.beginPath();
      ctx.moveTo(x + crack.x, y + crack.y);
      ctx.lineTo(
        x + crack.x + Math.cos(crack.angle) * crack.length,
        y + crack.y + Math.sin(crack.angle) * crack.length
      );
      ctx.stroke();
    });
    
    // 严重损坏时添加红色警告色调
    if (this.damageLevel >= 2) {
      ctx.fillStyle = `rgba(255, 0, 0, ${0.1 * this.damageLevel})`;
      ctx.fillRect(x, y, this.wall.width, this.wall.height);
    }
  }
}
```

---

## 4. 动画系统技术方案

### 4.1 需求分析
| 场景 | 动画类型 | 技术要求 |
|------|---------|---------|
| 牛牛升级 | 升级动画 → 正常动画 | 状态切换，不循环 |
| 墙壁损坏 | 正常 → 损坏状态 | 状态机切换 |
| 召唤小弟 | 召唤动画 + 生成新实体 | 组合动画 |
| 爆炸 | 爆炸动画 → 销毁 | 一次性播放 |

### 4.2 状态机动画系统
```javascript
class AnimationStateMachine {
  constructor() {
    this.states = new Map();
    this.currentState = null;
    this.transitions = new Map();
    this.onStateChange = null;
  }
  
  addState(name, config) {
    this.states.set(name, {
      name,
      frames: config.frames || [],
      loop: config.loop !== false, // 默认循环
      duration: config.duration || 1000, // ms
      onEnter: config.onEnter || null,
      onExit: config.onExit || null,
      nextState: config.nextState || null // 播放完后自动切换
    });
  }
  
  addTransition(from, to, condition) {
    if (!this.transitions.has(from)) {
      this.transitions.set(from, []);
    }
    this.transitions.get(from).push({ to, condition });
  }
  
  setState(name, force = false) {
    if (this.currentState === name && !force) return;
    
    const oldState = this.states.get(this.currentState);
    const newState = this.states.get(name);
    
    if (!newState) return;
    
    // 退出旧状态
    if (oldState && oldState.onExit) {
      oldState.onExit();
    }
    
    // 进入新状态
    this.currentState = name;
    this.currentFrame = 0;
    this.stateTime = 0;
    
    if (newState.onEnter) {
      newState.onEnter();
    }
    
    if (this.onStateChange) {
      this.onStateChange(name, oldState?.name);
    }
  }
  
  update(dt) {
    if (!this.currentState) return;
    
    const state = this.states.get(this.currentState);
    this.stateTime += dt;
    
    // 计算当前帧
    const progress = this.stateTime / state.duration;
    const totalFrames = state.frames.length;
    
    if (state.loop) {
      this.currentFrame = Math.floor((progress % 1) * totalFrames);
    } else {
      this.currentFrame = Math.min(Math.floor(progress * totalFrames), totalFrames - 1);
      
      // 非循环动画播放完成
      if (progress >= 1) {
        // 检查是否有下一个状态
        if (state.nextState) {
          this.setState(state.nextState);
        }
      }
    }
    
    // 检查状态转换条件
    this.checkTransitions();
  }
  
  checkTransitions() {
    const transitions = this.transitions.get(this.currentState);
    if (!transitions) return;
    
    for (const trans of transitions) {
      if (trans.condition()) {
        this.setState(trans.to);
        break;
      }
    }
  }
  
  getCurrentFrame() {
    if (!this.currentState) return null;
    const state = this.states.get(this.currentState);
    return state.frames[this.currentFrame];
  }
}
```

### 4.3 牛牛升级动画方案
```javascript
// 牛牛动画状态机配置
const cowAnimationConfig = {
  states: [
    {
      name: 'idle',
      frames: [0, 1, 2, 3], // 正常待机动画帧
      loop: true,
      duration: 1000
    },
    {
      name: 'upgrade',
      frames: [10, 11, 12, 13, 14], // 升级动画帧
      loop: false,
      duration: 800,
      nextState: 'idle', // 升级完后回到idle
      onEnter: () => {
        // 播放升级音效
        audioSystem.play('upgrade_sound');
        // 播放升级特效
        effectSystem.play('upgrade_effect', this.x, this.y);
      }
    },
    {
      name: 'explode',
      frames: [20, 21, 22, 23], // 爆炸动画帧
      loop: false,
      duration: 500,
      onEnter: () => {
        // 播放爆炸音效和特效
        audioSystem.play('explosion_sound');
        effectSystem.play('explosion_effect', this.x, this.y);
      }
    }
  ],
  
  transitions: [
    { from: 'idle', to: 'upgrade', condition: () => this.isUpgrading },
    { from: 'idle', to: 'explode', condition: () => this.isExploding },
    { from: 'upgrade', to: 'idle', condition: () => !this.isUpgrading }
  ]
};
```

### 4.4 墙壁状态机动画
```javascript
// 墙壁动画状态机配置
const wallAnimationConfig = {
  states: [
    {
      name: 'healthy',
      frames: [0], // 完好状态
      loop: true,
      duration: 1000
    },
    {
      name: 'damaged',
      frames: [1, 2], // 损坏状态（闪烁警告）
      loop: true,
      duration: 600,
      onEnter: () => {
        // 添加损坏特效
        this.damageEffect = new WallDamageEffect(this);
      }
    },
    {
      name: 'destroyed',
      frames: [3, 4, 5], // 摧毁动画
      loop: false,
      duration: 500,
      onEnter: () => {
        // 播放摧毁特效
        effectSystem.play('destroy_effect', this.x, this.y);
      }
    }
  ],
  
  transitions: [
    { 
      from: 'healthy', 
      to: 'damaged', 
      condition: () => this.health < this.maxHealth * 0.5 
    },
    { 
      from: 'damaged', 
      to: 'destroyed', 
      condition: () => this.health <= 0 
    }
  ]
};
```

### 4.5 召唤小弟组合动画
```javascript
class SummonAnimation {
  constructor(entity) {
    this.entity = entity;
    this.phase = 'preparing'; // preparing, summoning, complete
    this.elapsed = 0;
    this.summonList = []; // 要召唤的小弟列表
  }
  
  start(summonConfigs) {
    this.summonList = summonConfigs;
    this.phase = 'preparing';
    this.elapsed = 0;
    
    // 播放准备动画
    this.entity.animation.setState('summon_prepare');
    
    // 播放准备音效
    audioSystem.play('summon_prepare_sound');
  }
  
  update(dt) {
    this.elapsed += dt;
    
    switch (this.phase) {
      case 'preparing':
        // 准备阶段：播放准备动画
        if (this.elapsed >= 500) { // 500ms准备时间
          this.phase = 'summoning';
          this.elapsed = 0;
          this.summonNext();
        }
        break;
        
      case 'summoning':
        // 召唤阶段：逐个召唤小弟
        if (this.elapsed >= 300) { // 每300ms召唤一个
          this.elapsed = 0;
          this.summonNext();
        }
        break;
        
      case 'complete':
        // 完成：回到正常状态
        this.entity.animation.setState('idle');
        break;
    }
  }
  
  summonNext() {
    if (this.summonList.length === 0) {
      this.phase = 'complete';
      return;
    }
    
    const config = this.summonList.shift();
    
    // 创建小弟实体
    const minion = new MinionEntity(config);
    
    // 播放召唤特效
    effectSystem.play('summon_effect', config.x, config.y);
    
    // 播放召唤音效
    audioSystem.play('summon_sound');
    
    // 添加到游戏
    gameLogic.addEntity(minion);
  }
}
```

---

## 5. Timeline 与蒙太奇系统

### 5.1 Timeline 系统
```javascript
class Timeline {
  constructor() {
    this.tracks = []; // 时间轴轨道
    this.currentTime = 0;
    this.duration = 0;
    this.playing = false;
    this.loop = false;
  }
  
  addTrack(name, type) {
    const track = {
      name,
      type, // 'animation', 'audio', 'effect', 'event'
      keyframes: [] // 关键帧
    };
    this.tracks.push(track);
    return track;
  }
  
  addKeyframe(trackName, time, value) {
    const track = this.tracks.find(t => t.name === trackName);
    if (track) {
      track.keyframes.push({ time, value });
      // 按时间排序
      track.keyframes.sort((a, b) => a.time - b.time);
    }
  }
  
  play() {
    this.currentTime = 0;
    this.playing = true;
  }
  
  update(dt) {
    if (!this.playing) return;
    
    this.currentTime += dt;
    
    // 检查所有轨道的关键帧
    this.tracks.forEach(track => {
      track.keyframes.forEach(kf => {
        if (Math.abs(kf.time - this.currentTime) < dt) {
          // 触发关键帧
          this.triggerKeyframe(track, kf);
        }
      });
    });
    
    // 检查是否结束
    if (this.currentTime >= this.duration) {
      if (this.loop) {
        this.currentTime = 0;
      } else {
        this.playing = false;
      }
    }
  }
  
  triggerKeyframe(track, keyframe) {
    switch (track.type) {
      case 'animation':
        track.target.setState(keyframe.value);
        break;
      case 'audio':
        audioSystem.play(keyframe.value);
        break;
      case 'effect':
        effectSystem.play(keyframe.value, track.target.x, track.target.y);
        break;
      case 'event':
        eventSystem.emit(keyframe.value);
        break;
    }
  }
}
```

### 5.2 蒙太奇系统（Montage）
```javascript
class Montage {
  constructor() {
    this.segments = []; // 片段列表
    this.currentSegment = 0;
    this.playing = false;
  }
  
  addSegment(config) {
    this.segments.push({
      name: config.name,
      duration: config.duration,
      timeline: config.timeline, // Timeline 实例
      blendIn: config.blendIn || 0, // 淡入时间
      blendOut: config.blendOut || 0, // 淡出时间
      onStart: config.onStart || null,
      onComplete: config.onComplete || null
    });
  }
  
  play(segmentName) {
    const index = this.segments.findIndex(s => s.name === segmentName);
    if (index >= 0) {
      this.currentSegment = index;
      this.startCurrentSegment();
    }
  }
  
  startCurrentSegment() {
    const segment = this.segments[this.currentSegment];
    
    if (segment.onStart) {
      segment.onStart();
    }
    
    // 开始时间轴
    segment.timeline.play();
    
    this.playing = true;
  }
  
  update(dt) {
    if (!this.playing) return;
    
    const segment = this.segments[this.currentSegment];
    segment.timeline.update(dt);
    
    // 检查片段是否完成
    if (!segment.timeline.playing) {
      this.onSegmentComplete();
    }
  }
  
  onSegmentComplete() {
    const segment = this.segments[this.currentSegment];
    
    if (segment.onComplete) {
      segment.onComplete();
    }
    
    // 检查是否有下一个片段
    if (this.currentSegment < this.segments.length - 1) {
      this.currentSegment++;
      this.startCurrentSegment();
    } else {
      this.playing = false;
    }
  }
}
```

### 5.3 组合动画示例（升级 + 爆炸）
```javascript
// 创建升级爆炸组合动画
function createUpgradeExplosionMontage(entity) {
  const montage = new Montage();
  
  // 片段1：升级动画
  const upgradeTimeline = new Timeline();
  const upgradeTrack = upgradeTimeline.addTrack('animation', 'animation');
  upgradeTimeline.addKeyframe('animation', 0, 'upgrade');
  upgradeTimeline.addKeyframe('animation', 800, 'idle'); // 800ms后回到idle
  upgradeTimeline.duration = 1000;
  
  montage.addSegment({
    name: 'upgrade',
    duration: 1000,
    timeline: upgradeTimeline,
    onStart: () => {
      audioSystem.play('upgrade_sound');
      effectSystem.play('upgrade_effect', entity.x, entity.y);
    }
  });
  
  // 片段2：爆炸动画
  const explodeTimeline = new Timeline();
  const explodeTrack = explodeTimeline.addTrack('animation', 'animation');
  explodeTimeline.addKeyframe('animation', 0, 'explode');
  explodeTimeline.duration = 500;
  
  montage.addSegment({
    name: 'explode',
    duration: 500,
    timeline: explodeTimeline,
    onStart: () => {
      audioSystem.play('explosion_sound');
      effectSystem.play('explosion_effect', entity.x, entity.y);
    },
    onComplete: () => {
      entity.destroy();
    }
  });
  
  return montage;
}
```

---

## 6. 系统整合与事件驱动

### 6.1 事件系统
```javascript
class EventSystem {
  constructor() {
    this.listeners = new Map();
    this.eventQueue = [];
  }
  
  on(event, callback, priority = 0) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push({ callback, priority });
    // 按优先级排序
    this.listeners.get(event).sort((a, b) => b.priority - a.priority);
  }
  
  emit(event, data) {
    this.eventQueue.push({ event, data });
  }
  
  processEvents() {
    while (this.eventQueue.length > 0) {
      const { event, data } = this.eventQueue.shift();
      const listeners = this.listeners.get(event);
      
      if (listeners) {
        listeners.forEach(l => l.callback(data));
      }
    }
  }
}

// 使用示例
eventSystem.on('bomb_exploded', (data) => {
  // 播放爆炸音效
  audioSystem.play('explosion', { level: data.level });
  
  // 播放爆炸特效
  effectSystem.play('explosion', data.x, data.y, { level: data.level });
  
  // 屏幕震动
  screenShake.start(data.level * 2);
  
  // 检查连击
  comboManager.onExplosion(data.level);
});
```

### 6.2 实体管理器
```javascript
class EntityManager {
  constructor() {
    this.entities = new Map();
    this.nextId = 0;
  }
  
  create(type, config) {
    const id = this.nextId++;
    const entity = {
      id,
      type,
      x: config.x,
      y: config.y,
      state: 'idle',
      animation: new AnimationStateMachine(),
      effects: [],
      ...config
    };
    
    this.entities.set(id, entity);
    return entity;
  }
  
  destroy(id) {
    const entity = this.entities.get(id);
    if (entity) {
      // 播放销毁特效
      effectSystem.play('destroy', entity.x, entity.y);
      
      // 清理
      this.entities.delete(id);
    }
  }
  
  update(dt) {
    this.entities.forEach(entity => {
      // 更新动画
      if (entity.animation) {
        entity.animation.update(dt);
      }
      
      // 更新特效
      entity.effects.forEach(effect => effect.update(dt));
      entity.effects = entity.effects.filter(e => e.active);
    });
  }
  
  draw(ctx) {
    this.entities.forEach(entity => {
      // 绘制实体
      this.drawEntity(ctx, entity);
      
      // 绘制特效
      entity.effects.forEach(effect => effect.draw(ctx));
    });
  }
}
```

---

## 7. 微信小游戏适配

### 7.1 性能优化
```javascript
class PerformanceManager {
  constructor() {
    this.targetFPS = 60;
    this.frameTime = 1000 / this.targetFPS;
    this.particleLimit = 500; // 最大粒子数
    this.effectLimit = 50;    // 最大特效数
  }
  
  optimize() {
    // 根据帧率动态调整粒子数量
    const currentFPS = this.measureFPS();
    if (currentFPS < 50) {
      this.particleLimit = Math.max(100, this.particleLimit - 50);
    }
  }
  
  measureFPS() {
    // 计算最近1秒的帧率
  }
}
```

### 7.2 资源管理
```javascript
class ResourceManager {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
  }
  
  async loadSprite(path) {
    if (this.cache.has(path)) return this.cache.get(path);
    
    return new Promise((resolve, reject) => {
      const img = wx.createImage();
      img.onload = () => {
        this.cache.set(path, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = path;
    });
  }
  
  preloadLevel(level) {
    // 预加载关卡需要的所有资源
    const resources = this.getLevelResources(level);
    return Promise.all(resources.map(r => this.loadSprite(r)));
  }
}
```

---

## 8. 实施路线图

### Phase 1: 基础框架（2周）
- [ ] 事件系统重构
- [ ] 实体管理器实现
- [ ] 动画状态机基础
- [ ] 音效通道系统

### Phase 2: 特效系统（2周）
- [ ] 粒子发射器系统
- [ ] 特效层管理
- [ ] 墙壁损坏特效
- [ ] 爆炸特效等级化

### Phase 3: 高级动画（2周）
- [ ] Timeline 系统
- [ ] 蒙太奇系统
- [ ] 组合动画（升级+爆炸）
- [ ] 召唤小弟动画

### Phase 4: 音效完善（1周）
- [ ] 音效组管理
- [ ] 连续引爆音效
- [ ] 音效叠加防 clipping
- [ ] 连击音效增强

### Phase 5: 整合测试（1周）
- [ ] 系统集成
- [ ] 性能优化
- [ ] 真机测试
- [ ] Bug修复

---

## 9. 技术风险与应对

| 风险 | 影响 | 应对方案 |
|------|------|---------|
| 性能不足 | 帧率下降 | 粒子池、对象池、LOD |
| 内存泄漏 | 闪退 | 严格的生命周期管理 |
| 音效延迟 | 体验差 | 预加载、音频池 |
| 复杂度失控 | 维护难 | 模块化、单元测试 |

---

**方案制定时间**: 2026-05-07
**适用项目**: 牛牛灭鼠微信小游戏
**版本**: v0.6.0 技术预研
