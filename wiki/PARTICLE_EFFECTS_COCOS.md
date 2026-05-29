# 炸弹牛项目 - 粒子特效适配Cocos需求与实现方案

**版本**: v2.0（已移除震动设计）  
**日期**: 2026-05-29  
**引擎**: Cocos Creator 3.8.8  
**平台**: 微信小游戏

---

## 一、设计约束声明

### 1.1 已移除的功能
- ❌ **屏幕震动** - 全部移除，包括代码实现、事件触发、配置参数
- ❌ **微信震动反馈** (`wx.vibrateShort` / `wx.vibrateLong`) - 全部移除
- ❌ **相机震动偏移** - 全部移除

### 1.2 保留的原有规则
- ✅ 粒子特效等级化（Lv.1-Lv.4 不同颜色/数量/持续时间）
- ✅ 分层渲染架构（背景/实体/前景）
- ✅ 对象池复用机制
- ✅ 爆炸/升级/胜利三种特效类型
- ✅ 原有色调体系（橙/蓝/紫/红/金）

---

## 二、原有特效实现构成分析

### 2.1 爆炸特效（来自 EFFECTS_TEST.md / EFFECTS_ASSET_REQUIREMENTS.md）

**Lv.0 基础爆炸（橙色）**：
- 中心闪光（金色 #FFD700）
- 8-12个橙色火花向四周散射
- 小型冲击波环（半径60px）
- 持续时间：0.5秒
- 主色：#FF6B35（橙红）
- 尾迹：#FF4500（红橙）

**Lv.1 强化爆炸（蓝色）**：
- 强烈中心闪光（白色）
- 15-20个蓝色火花散射
- 中型冲击波环（半径100px）
- 蓝色烟雾向上飘散
- 持续时间：0.8秒
- 主色：#5BA3F5（天蓝）
- 尾迹：#4169E1（皇家蓝）
- 烟雾：#A0C4FF（淡蓝）

**Lv.2 超级爆炸（紫色）**：
- 极强烈中心闪光（白色，持续0.3秒）
- 25-30个紫色火花高速散射
- 大型冲击波环（半径140px）
- 紫色烟雾 + 金色星光粒子
- 持续时间：1.2秒
- 主色：#C084FC（紫罗兰）
- 尾迹：#8A2BE2（蓝紫）
- 烟雾：#D0A0FF（淡紫）
- 星光：#FFD700（金色）

**Lv.3 究极爆炸（红色）**：
- 35-50个红色火花超高速散射
- 超大型冲击波环（半径180px）
- 红色烟雾 + 金色星光 + 白色闪光残留
- 持续时间：1.5秒
- 主色：#FF0000（纯红）
- 尾迹：#8B0000（暗红）
- 星光：#FFD700（金色）

### 2.2 升级特效（来自 GAMEPLAY_DESIGN.md）

- Lv.1→Lv.2：绿色光环上升（#00FF64）
- Lv.2→Lv.3：蓝色光环上升（#0096FF）
- Lv.3→Lv.4：紫色光环上升（#FF00FF）
- 伴随粒子向上飘散效果
- 持续时间：0.6-1.0秒

### 2.3 胜利特效（来自原有设计）

- 金色粒子雨从屏幕上方飘落
- 持续时间：3.0秒
- 颜色：#FFD700（金色）
- 伴随少量白色闪光粒子

---

## 三、Cocos ParticleSystem2D 适配方案

### 3.1 核心设计决策

**使用纯代码配置 ParticleSystem2D，不依赖外部图片纹理**
- 微信小游戏包体敏感，避免额外资源
- Cocos 内置粒子支持代码全参数配置
- 后续可无缝替换为自定义纹理

### 3.2 粒子预制体结构（Editor 中创建）

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
│   ├── startColor: (255, 200, 0, 255)  // 默认黄色
│   ├── endColor: (255, 100, 0, 0)
│   ├── gravity: (0, -40)
│   ├── positionType: FREE
│   └── texture: null (使用默认点状纹理)
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
│   ├── startColor: (0, 255, 100, 255)  // 默认绿色
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

### 3.3 ParticleManager 代码实现

```typescript
import { _decorator, Component, Node, Vec3, ParticleSystem2D, Color, instantiate } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 爆炸特效配置（按进化等级）
 * 与 EFFECTS_ASSET_REQUIREMENTS.md 规格对应
 */
const EXPLOSION_CONFIG = {
    1: {  // Lv.0 基础 - 橙色
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
    2: {  // Lv.1 强化 - 蓝色
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
    3: {  // Lv.2 超级 - 紫色
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
    4: {  // Lv.3 究极 - 红色
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
    2: {  // 升到 Lv.1 - 绿色
        count: 15,
        speed: 80,
        startColor: new Color(0, 255, 100, 255),       // #00FF64
        endColor: new Color(0, 150, 255, 0),
        duration: 0.6
    },
    3: {  // 升到 Lv.2 - 蓝色
        count: 20,
        speed: 100,
        startColor: new Color(0, 150, 255, 255),      // #0096FF
        endColor: new Color(255, 0, 255, 0),
        duration: 0.8
    },
    4: {  // 升到 Lv.3 - 紫色
        count: 25,
        speed: 120,
        startColor: new Color(255, 0, 255, 255),      // #FF00FF
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

### 3.4 GameScene 事件绑定（无震动版本）

```typescript
private bindEvents() {
    if (!this.gameLogic) return;
    
    // 炸弹爆炸 - 仅播放粒子和音效，无震动
    this.gameLogic.onEvent('bomb_exploded', (data: any) => {
        this.audioManager?.playSfx('bomb_explode');
        
        // 播放爆炸粒子
        const pos = this.gridManager?.gridToWorld(data.x, data.y);
        if (pos) {
            this.particleManager?.playExplosion(pos, data.evolution);
        }
        
        this.updateUI();
    });
    
    // 炸弹升级 - 仅播放粒子和音效，无震动
    this.gameLogic.onEvent('bomb_upgraded', (data: any) => {
        this.audioManager?.playSfx('bomb_upgrade');
        
        const pos = this.gridManager?.gridToWorld(data.x, data.y);
        if (pos) {
            this.particleManager?.playUpgrade(pos, data.newEvolution);
        }
    });
    
    // ... 其他事件绑定保持不变
}
```

---

## 四、Cocos Editor 操作步骤

### 4.1 创建粒子预制体

1. **创建空节点**：层级管理器右键 → 创建节点 → 创建空节点
2. **命名**：`ExplosionParticle`
3. **添加组件**：Inspector → 添加组件 → 渲染 → ParticleSystem2D
4. **配置参数**：按 3.1 节表格填写
5. **保存预制体**：拖入 `assets/prefabs/` 目录
6. **重复**：创建 UpgradeParticle 和 VictoryParticle

### 4.2 场景绑定

1. 打开 `Game.scene`
2. 在 `GameRoot` 节点上确认 `ParticleManager` 组件已挂载
3. 将预制体拖到对应属性：
   - `ExplosionParticle.prefab` → `Explosion Prefab`
   - `UpgradeParticle.prefab` → `Upgrade Prefab`
   - `VictoryParticle.prefab` → `Victory Prefab`
4. 保存场景

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

---

## 五、验证清单

- [ ] 创建 3 个粒子预制体（Explosion/Upgrade/Victory）
- [ ] Game.scene 中绑定预制体引用
- [ ] 放置炸弹后 3 秒，看到爆炸粒子效果
- [ ] 不同进化等级爆炸颜色不同（橙/蓝/紫/红）
- [ ] 炸弹升级时有绿色/蓝色/紫色升级特效
- [ ] 关卡胜利时有金色粒子雨
- [ ] 连续爆炸不卡顿（性能测试）
- [ ] 粒子对象池正常工作（无内存泄漏）
- [ ] **确认无屏幕震动效果**（真机测试）

---

## 六、已清理的震动相关代码

### 6.1 Wall.ts 清理内容
- ❌ 移除 `shakeTime` 属性
- ❌ 移除 `startShake()` 方法
- ❌ 移除 `takeDamage()` 中的震动调用

### 6.2 GameScene.ts 清理内容
- ❌ 移除 `triggerScreenShake()` 方法
- ❌ 移除 `SHAKE_CONFIG` 配置
- ❌ 移除 `update()` 中的震动处理
- ❌ 移除事件绑定中的 `triggerScreenShake()` 调用
- ❌ 移除微信 `wx.vibrateShort` / `wx.vibrateLong` 调用

### 6.3 文档清理内容
- ❌ 移除所有震动配置说明
- ❌ 移除震动触发条件描述
- ❌ 移除 `vibrateConfig` 相关设计

---

**文档版本**: v2.0（已移除震动）  
**更新日期**: 2026-05-29  
**负责人**: 2B (AI Assistant)  
**状态**: 待实施
