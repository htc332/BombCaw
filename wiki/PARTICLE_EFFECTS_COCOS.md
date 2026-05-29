# 炸弹牛项目 - 粒子特效适配Cocos需求与实现方案

**版本**: v1.0  
**日期**: 2026-05-29  
**引擎**: Cocos Creator 3.8.8  
**平台**: 微信小游戏

---

## 一、现状分析

### 1.1 已有实现

当前 `ParticleManager.ts` 已使用 Cocos `ParticleSystem2D` 组件，支持：
- 爆炸特效（按进化等级变色）
- 升级特效
- 胜利特效
- 对象池复用

### 1.2 存在的问题

| 问题 | 影响 | 原因 |
|------|------|------|
| 粒子预制体缺失 | 特效无法显示 | explosionPrefab/upgradePrefab/victoryPrefab 未绑定 |
| 无美术资产 | 效果简陋 | 使用纯代码粒子，无精灵图纹理 |
| 与原有设计脱节 | 视觉效果不达标 | 未参考 `EFFECTS_ASSET_REQUIREMENTS.md` 的美术规格 |
| 缺少屏幕震动 | 打击感不足 | GameScene 未接入震动反馈 |

### 1.3 原有设计规格（需保留）

来自 `EFFECTS_ASSET_REQUIREMENTS.md` 和 `GAMEPLAY_DESIGN.md`：

**爆炸特效等级化：**
- Lv.0（基础）：橙色火花，8-12个粒子，0.5秒
- Lv.1（强化）：蓝色火花，15-20个粒子，0.8秒，带烟雾
- Lv.2（超级）：紫色火花，25-30个粒子，1.2秒，带烟雾+星光
- Lv.3（究极）：红色火花，35-50个粒子，1.5秒，屏幕震动

**分层渲染顺序：**
1. 游戏世界（renderer.render）
2. 背景特效层（烟雾）
3. 实体特效层（冲击波）
4. 前景特效层（火花，Additive混合）
5. UI层

---

## 二、适配方案（不改变原有规则）

### 2.1 方案选择：纯代码粒子 → Cocos ParticleSystem2D

**决策理由：**
- 微信小游戏性能敏感，避免额外图片资源
- Cocos `ParticleSystem2D` 支持代码配置所有参数
- 与现有 `ParticleManager` 架构兼容
- 无需美术资产即可运行，后续可无缝替换为图片纹理

### 2.2 核心设计原则

1. **逻辑驱动表现**：特效由 GameLogic 事件触发，位置/等级/颜色由逻辑层决定
2. **等级化配置**：每个进化等级独立粒子参数
3. **对象池复用**：避免运行时创建销毁开销
4. **分层管理**：背景/实体/前景三层独立控制
5. **可扩展**：预留图片纹理替换接口

---

## 三、详细实现方案

### 3.1 粒子预制体结构（Cocos Editor 中创建）

#### ExplosionParticle.prefab
```
Node: "ExplosionParticle"
├── ParticleSystem2D (组件)
│   ├── duration: 0.5
│   ├── emissionRate: 30
│   ├── life: 0.4
│   ├── lifeVar: 0.3
│   ├── angle: 90
│   ├── angleVar: 180
│   ├── speed: 100
│   ├── speedVar: 60
│   ├── startSize: 8
│   ├── startSizeVar: 4
│   ├── endSize: 2
│   ├── startColor: (255, 200, 0, 255)  // 橙色默认
│   ├── endColor: (255, 100, 0, 0)
│   ├── gravity: (0, -40)
│   ├── positionType: FREE
│   └── texture: null (使用代码设置)
└── UITransform (组件)
```

#### UpgradeParticle.prefab
```
Node: "UpgradeParticle"
├── ParticleSystem2D (组件)
│   ├── duration: 0.8
│   ├── emissionRate: 20
│   ├── life: 0.6
│   ├── angle: 90
│   ├── angleVar: 30
│   ├── speed: 80
│   ├── speedVar: 40
│   ├── startSize: 12
│   ├── endSize: 4
│   ├── startColor: (0, 255, 100, 255)  // 绿色默认
│   ├── endColor: (0, 150, 255, 0)
│   ├── gravity: (0, -20)
│   └── positionType: FREE
└── UITransform (组件)
```

#### VictoryParticle.prefab
```
Node: "VictoryParticle"
├── ParticleSystem2D (组件)
│   ├── duration: 2.0
│   ├── emissionRate: 50
│   ├── life: 1.0
│   ├── angle: 90
│   ├── angleVar: 180
│   ├── speed: 150
│   ├── speedVar: 80
│   ├── startSize: 16
│   ├── endSize: 4
│   ├── startColor: (255, 215, 0, 255)  // 金色
│   ├── endColor: (255, 100, 0, 0)
│   ├── gravity: (0, -60)
│   └── positionType: FREE
└── UITransform (组件)
```

### 3.2 ParticleManager 代码增强

```typescript
// 增强版 ParticleManager - 适配原有设计规则

import { _decorator, Component, Node, Vec3, ParticleSystem2D, Color, instantiate } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 粒子特效配置（按进化等级）
 * 与 EFFECTS_ASSET_REQUIREMENTS.md 规格对应
 */
const EXPLOSION_CONFIG = {
    1: {  // Lv.0 基础
        count: 12,
        speed: 100,
        speedVar: 60,
        life: 0.4,
        lifeVar: 0.3,
        startColor: new Color(255, 107, 53, 255),   // #FF6B35 橙红
        endColor: new Color(255, 69, 0, 0),          // #FF4500 红橙
        startSize: 8,
        endSize: 2,
        gravity: new Vec3(0, -40, 0),
        duration: 0.5
    },
    2: {  // Lv.1 强化
        count: 18,
        speed: 120,
        speedVar: 80,
        life: 0.5,
        lifeVar: 0.3,
        startColor: new Color(91, 163, 245, 255),    // #5BA3F5 天蓝
        endColor: new Color(65, 105, 225, 0),          // #4169E1 皇家蓝
        startSize: 10,
        endSize: 3,
        gravity: new Vec3(0, -30, 0),
        duration: 0.8
    },
    3: {  // Lv.2 超级
        count: 28,
        speed: 150,
        speedVar: 100,
        life: 0.6,
        lifeVar: 0.4,
        startColor: new Color(192, 132, 252, 255),   // #C084FC 紫罗兰
        endColor: new Color(138, 43, 226, 0),          // #8A2BE2 蓝紫
        startSize: 12,
        endSize: 4,
        gravity: new Vec3(0, -20, 0),
        duration: 1.0
    },
    4: {  // Lv.3 究极
        count: 40,
        speed: 180,
        speedVar: 120,
        life: 0.7,
        lifeVar: 0.5,
        startColor: new Color(255, 50, 50, 255),       // 红色
        endColor: new Color(150, 0, 0, 0),
        startSize: 14,
        endSize: 5,
        gravity: new Vec3(0, -10, 0),
        duration: 1.2
    }
};

const UPGRADE_CONFIG = {
    2: {  // 升到 Lv.1
        count: 15,
        speed: 80,
        startColor: new Color(0, 255, 100, 255),       // 绿色
        endColor: new Color(0, 150, 255, 0),
        duration: 0.6
    },
    3: {  // 升到 Lv.2
        count: 20,
        speed: 100,
        startColor: new Color(0, 150, 255, 255),      // 蓝色
        endColor: new Color(255, 0, 255, 0),
        duration: 0.8
    },
    4: {  // 升到 Lv.3
        count: 25,
        speed: 120,
        startColor: new Color(255, 0, 255, 255),      // 紫色
        endColor: new Color(255, 215, 0, 0),
        duration: 1.0
    }
};

@ccclass('ParticleManager')
export class ParticleManager extends Component {
    
    @property(Node)
    explosionPrefab: Node | null = null;
    
    @property(Node)
    upgradePrefab: Node | null = null;
    
    @property(Node)
    victoryPrefab: Node | null = null;
    
    // 对象池
    private explosionPool: Node[] = [];
    private upgradePool: Node[] = [];
    private victoryPool: Node[] = [];
    
    // 活跃粒子跟踪
    private activeParticles: Map<string, Node> = new Map();
    private particleIdCounter: number = 0;
    
    onLoad() {
        console.log('[ParticleManager] Loading...');
    }
    
    /**
     * 播放爆炸特效 - 适配原有设计规则
     * @param position 世界坐标位置
     * @param evolution 炸弹进化等级 (1-4)
     */
    playExplosion(position: Vec3, evolution: number = 1) {
        const node = this.getParticleFromPool('explosion');
        if (!node) {
            console.warn('[ParticleManager] No explosion particle available');
            return;
        }
        
        const config = EXPLOSION_CONFIG[evolution] || EXPLOSION_CONFIG[1];
        const particleSystem = node.getComponent(ParticleSystem2D);
        
        if (particleSystem) {
            // 应用等级化配置
            this.configureParticleSystem(particleSystem, config);
            
            // 设置位置
            node.setPosition(position);
            node.active = true;
            
            // 重置并播放
            particleSystem.resetSystem();
            
            // 跟踪活跃粒子
            const id = `explosion_${this.particleIdCounter++}`;
            this.activeParticles.set(id, node);
            
            // 自动回收
            this.scheduleOnce(() => {
                this.recycleParticle('explosion', node);
                this.activeParticles.delete(id);
            }, config.duration + config.life + config.lifeVar);
        }
        
        console.log(`[ParticleManager] Explosion Lv.${evolution} at (${position.x}, ${position.y})`);
    }
    
    /**
     * 播放升级特效
     * @param position 世界坐标位置
     * @param newEvolution 新的进化等级 (2-4)
     */
    playUpgrade(position: Vec3, newEvolution: number) {
        const node = this.getParticleFromPool('upgrade');
        if (!node) return;
        
        const config = UPGRADE_CONFIG[newEvolution] || UPGRADE_CONFIG[2];
        const particleSystem = node.getComponent(ParticleSystem2D);
        
        if (particleSystem) {
            this.configureParticleSystem(particleSystem, config);
            
            node.setPosition(position);
            node.active = true;
            particleSystem.resetSystem();
            
            const id = `upgrade_${this.particleIdCounter++}`;
            this.activeParticles.set(id, node);
            
            this.scheduleOnce(() => {
                this.recycleParticle('upgrade', node);
                this.activeParticles.delete(id);
            }, config.duration + 0.5);
        }
        
        console.log(`[ParticleManager] Upgrade to Lv.${newEvolution}`);
    }
    
    /**
     * 播放胜利特效
     * @param position 世界坐标位置（通常屏幕中心）
     */
    playVictory(position: Vec3) {
        const node = this.getParticleFromPool('victory');
        if (!node) return;
        
        const particleSystem = node.getComponent(ParticleSystem2D);
        
        if (particleSystem) {
            // 胜利特效使用金色配置
            node.setPosition(position);
            node.active = true;
            particleSystem.resetSystem();
            
            const id = `victory_${this.particleIdCounter++}`;
            this.activeParticles.set(id, node);
            
            this.scheduleOnce(() => {
                this.recycleParticle('victory', node);
                this.activeParticles.delete(id);
            }, 3.0);
        }
        
        console.log('[ParticleManager] Victory effect');
    }
    
    /**
     * 配置粒子系统参数
     */
    private configureParticleSystem(ps: ParticleSystem2D, config: any) {
        if (config.count !== undefined) ps.totalParticles = config.count;
        if (config.speed !== undefined) ps.speed = config.speed;
        if (config.speedVar !== undefined) ps.speedVar = config.speedVar;
        if (config.life !== undefined) ps.life = config.life;
        if (config.lifeVar !== undefined) ps.lifeVar = config.lifeVar;
        if (config.startColor !== undefined) ps.startColor = config.startColor;
        if (config.endColor !== undefined) ps.endColor = config.endColor;
        if (config.startSize !== undefined) ps.startSize = config.startSize;
        if (config.endSize !== undefined) ps.endSize = config.endSize;
        if (config.duration !== undefined) ps.duration = config.duration;
        
        // 重力设置
        if (config.gravity !== undefined) {
            ps.gravity = config.gravity;
        }
        
        // 发射角度：全方向
        ps.angle = 90;
        ps.angleVar = 180;
        
        // 位置类型：自由移动
        ps.positionType = 0; // FREE
    }
    
    /**
     * 从对象池获取粒子节点
     */
    private getParticleFromPool(type: string): Node | null {
        let pool: Node[];
        let prefab: Node | null;
        
        switch (type) {
            case 'explosion':
                pool = this.explosionPool;
                prefab = this.explosionPrefab;
                break;
            case 'upgrade':
                pool = this.upgradePool;
                prefab = this.upgradePrefab;
                break;
            case 'victory':
                pool = this.victoryPool;
                prefab = this.victoryPrefab;
                break;
            default:
                return null;
        }
        
        // 从池中获取
        if (pool.length > 0) {
            const node = pool.pop()!;
            node.active = true;
            return node;
        }
        
        // 创建新的
        if (prefab) {
            const newNode = instantiate(prefab);
            this.node.addChild(newNode);
            return newNode;
        }
        
        console.warn(`[ParticleManager] No prefab for ${type}`);
        return null;
    }
    
    /**
     * 回收粒子到对象池
     */
    private recycleParticle(type: string, node: Node) {
        node.active = false;
        node.setPosition(new Vec3(0, 0, 0));
        
        // 停止粒子发射
        const ps = node.getComponent(ParticleSystem2D);
        if (ps) {
            ps.stopSystem();
        }
        
        switch (type) {
            case 'explosion':
                this.explosionPool.push(node);
                break;
            case 'upgrade':
                this.upgradePool.push(node);
                break;
            case 'victory':
                this.victoryPool.push(node);
                break;
        }
    }
    
    /**
     * 清除所有活跃粒子
     */
    clearAll() {
        this.activeParticles.forEach((node, key) => {
            const ps = node.getComponent(ParticleSystem2D);
            if (ps) ps.stopSystem();
            node.active = false;
        });
        this.activeParticles.clear();
    }
    
    /**
     * 获取当前活跃粒子数
     */
    getActiveCount(): number {
        return this.activeParticles.size;
    }
    
    /**
     * 预创建粒子池（性能优化）
     * @param type 粒子类型
     * @param count 预创建数量
     */
    prewarmPool(type: string, count: number) {
        let prefab: Node | null;
        let pool: Node[];
        
        switch (type) {
            case 'explosion':
                prefab = this.explosionPrefab;
                pool = this.explosionPool;
                break;
            case 'upgrade':
                prefab = this.upgradePrefab;
                pool = this.upgradePool;
                break;
            case 'victory':
                prefab = this.victoryPrefab;
                pool = this.victoryPool;
                break;
            default:
                return;
        }
        
        if (!prefab) return;
        
        for (let i = 0; i < count; i++) {
            const node = instantiate(prefab);
            node.active = false;
            this.node.addChild(node);
            pool.push(node);
        }
        
        console.log(`[ParticleManager] Prewarmed ${count} ${type} particles`);
    }
}
```

### 3.3 屏幕震动集成（GameScene 增强）

```typescript
// 在 GameScene.ts 中添加屏幕震动

import { _decorator, Component, Node, Vec3, screen, view } from 'cc';

// 震动配置（与 GAMEPLAY_DESIGN.md 对应）
const SHAKE_CONFIG = {
    light: { duration: 0.015, intensity: 2 },    // 升级
    medium: { duration: 0.025, intensity: 4 },   // 墙壁摧毁
    heavy: { duration: 0.04, intensity: 6 }      // 爆炸
};

export class GameScene extends Component {
    
    // ... 现有代码 ...
    
    private shakeDuration: number = 0;
    private shakeIntensity: number = 0;
    private shakeTimer: number = 0;
    private originalCameraPos: Vec3 = new Vec3();
    
    update(dt: number) {
        // 处理屏幕震动
        if (this.shakeTimer > 0) {
            this.shakeTimer -= dt;
            
            if (this.shakeTimer <= 0) {
                // 恢复相机位置
                const camera = this.node.scene.getComponentInChildren(Camera);
                if (camera) {
                    camera.node.setPosition(this.originalCameraPos);
                }
            } else {
                // 应用震动
                const offsetX = (Math.random() - 0.5) * this.shakeIntensity * 2;
                const offsetY = (Math.random() - 0.5) * this.shakeIntensity * 2;
                
                const camera = this.node.scene.getComponentInChildren(Camera);
                if (camera) {
                    const newPos = this.originalCameraPos.clone();
                    newPos.x += offsetX;
                    newPos.y += offsetY;
                    camera.node.setPosition(newPos);
                }
            }
        }
    }
    
    /**
     * 触发屏幕震动
     * @param type 震动类型: 'light' | 'medium' | 'heavy'
     */
    triggerScreenShake(type: 'light' | 'medium' | 'heavy') {
        const config = SHAKE_CONFIG[type];
        if (!config) return;
        
        // 保存原始相机位置
        const camera = this.node.scene.getComponentInChildren(Camera);
        if (camera && this.shakeTimer <= 0) {
            this.originalCameraPos = camera.node.position.clone();
        }
        
        this.shakeDuration = config.duration;
        this.shakeIntensity = config.intensity;
        this.shakeTimer = config.duration;
        
        // 微信震动反馈（真机）
        if (typeof wx !== 'undefined' && wx.vibrateShort) {
            switch (type) {
                case 'light':
                    wx.vibrateShort({ type: 'light' });
                    break;
                case 'medium':
                    wx.vibrateShort({ type: 'medium' });
                    break;
                case 'heavy':
                    wx.vibrateLong();
                    break;
            }
        }
    }
    
    // 在事件绑定中接入震动
    private bindEvents() {
        // ... 现有事件绑定 ...
        
        // 炸弹爆炸 - 触发重震动
        this.gameLogic.onEvent('bomb_exploded', (data: any) => {
            this.audioManager?.playSfx('bomb_explode');
            
            const pos = this.gridManager?.gridToWorld(data.x, data.y);
            if (pos) {
                this.particleManager?.playExplosion(pos, data.evolution);
                
                // 根据进化等级选择震动强度
                const shakeType = data.evolution >= 3 ? 'heavy' : 'medium';
                this.triggerScreenShake(shakeType);
            }
            
            this.updateUI();
        });
        
        // 炸弹升级 - 触发轻震动
        this.gameLogic.onEvent('bomb_upgraded', (data: any) => {
            this.audioManager?.playSfx('bomb_upgrade');
            
            const pos = this.gridManager?.gridToWorld(data.x, data.y);
            if (pos) {
                this.particleManager?.playUpgrade(pos, data.newEvolution);
                this.triggerScreenShake('light');
            }
        });
        
        // ... 其他事件 ...
    }
}
```

### 3.4 分层渲染架构（可选增强）

如需实现原有设计的分层渲染，创建三个 ParticleManager 实例：

```typescript
// GameScene.ts 中初始化分层粒子系统

@property(Node)
backgroundEffectLayer: Node | null = null;  // 烟雾层

@property(Node)
entityEffectLayer: Node | null = null;      // 冲击波层

@property(Node)
foregroundEffectLayer: Node | null = null;  // 火花层

private bgParticleManager: ParticleManager | null = null;
private entityParticleManager: ParticleManager | null = null;
private fgParticleManager: ParticleManager | null = null;

private initManagers() {
    // ... 现有管理器初始化 ...
    
    // 分层粒子管理器
    if (this.backgroundEffectLayer) {
        this.bgParticleManager = this.backgroundEffectLayer.addComponent(ParticleManager);
    }
    if (this.entityEffectLayer) {
        this.entityParticleManager = this.entityEffectLayer.addComponent(ParticleManager);
    }
    if (this.foregroundEffectLayer) {
        this.fgParticleManager = this.foregroundEffectLayer.addComponent(ParticleManager);
    }
}

// 爆炸时分层播放
playLayeredExplosion(position: Vec3, evolution: number) {
    // 背景层：烟雾（低透明度）
    this.bgParticleManager?.playExplosion(position, evolution);
    
    // 实体层：冲击波（缩放扩散）
    this.entityParticleManager?.playExplosion(position, evolution);
    
    // 前景层：火花（Additive混合）
    this.fgParticleManager?.playExplosion(position, evolution);
}
```

---

## 四、Cocos Editor 操作步骤

### 4.1 创建粒子预制体

1. **创建空节点**：在层级管理器中右键 → 创建节点 → 创建空节点
2. **命名**：`ExplosionParticle`
3. **添加组件**：Inspector 面板 → 添加组件 → 渲染 → ParticleSystem2D
4. **配置参数**：按 3.1 节表格填写
5. **保存预制体**：拖入 `assets/prefabs/` 目录
6. **重复**：创建 UpgradeParticle 和 VictoryParticle

### 4.2 场景绑定

1. 打开 `Game.scene`
2. 在 `GameRoot` 节点上：
   - 确认 `ParticleManager` 组件已挂载
   - 将 `ExplosionParticle.prefab` 拖到 `Explosion Prefab` 属性
   - 将 `UpgradeParticle.prefab` 拖到 `Upgrade Prefab` 属性
   - 将 `VictoryParticle.prefab` 拖到 `Victory Prefab` 属性
3. 保存场景

### 4.3 性能优化设置

1. **粒子数量上限**：
   - 微信小游戏建议单场景不超过 500 个活跃粒子
   - 每个爆炸特效根据等级 12-40 个粒子
   - 同时爆炸不超过 10 个

2. **对象池预创建**：
   ```typescript
   // 在 GameScene start() 中
   this.particleManager?.prewarmPool('explosion', 10);
   this.particleManager?.prewarmPool('upgrade', 5);
   ```

3. **纹理设置**：
   - 如使用自定义粒子纹理，设置为 SpriteFrame
   - 压缩格式：微信小游戏使用 ASTC 或 ETC2

---

## 五、验证清单

- [ ] 创建 3 个粒子预制体（Explosion/Upgrade/Victory）
- [ ] Game.scene 中绑定预制体引用
- [ ] 放置炸弹后 3 秒，看到爆炸粒子效果
- [ ] 不同进化等级爆炸颜色不同（橙/蓝/紫/红）
- [ ] 炸弹升级时有绿色/蓝色/紫色升级特效
- [ ] 关卡胜利时有金色粒子雨
- [ ] 爆炸时有屏幕震动（真机测试）
- [ ] 连续爆炸不卡顿（性能测试）
- [ ] 粒子对象池正常工作（无内存泄漏）

---

## 六、后续扩展（可选）

### 6.1 替换为美术资产

当美术提供粒子纹理后：

1. 导入纹理到 `assets/resources/effects/`
2. 在 ParticleSystem2D 组件中设置 `SpriteFrame`
3. 调整粒子尺寸和生命周期匹配美术效果
4. 无需修改代码，仅调整 Editor 参数

### 6.2 添加新特效类型

```typescript
// 在 ParticleManager 中添加
playWallDestroy(position: Vec3, wallType: string) {
    // 墙壁摧毁特效：碎石飞溅
}

playComboEffect(position: Vec3, comboCount: number) {
    // 连击特效：数字飘字 + 光环
}
```

---

**文档版本**: v1.0  
**更新日期**: 2026-05-29  
**负责人**: 2B (AI Assistant)  
**状态**: 待实施
