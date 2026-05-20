import { _decorator, Component, Node, Vec3, ParticleSystem2D, Color, Size } from 'cc';

const { ccclass, property } = _decorator;

/**
 * ParticleManager
 * 粒子特效管理器
 * 
 * 职责：
 * 1. 管理爆炸粒子效果
 * 2. 管理升级特效
 * 3. 管理胜利/失败特效
 * 4. 对象池复用粒子节点
 */
@ccclass('ParticleManager')
export class ParticleManager extends Component {
    
    // 粒子预制体
    @property(Node)
    explosionPrefab: Node | null = null;
    
    @property(Node)
    upgradePrefab: Node | null = null;
    
    @property(Node)
    victoryPrefab: Node | null = null;
    
    // 对象池
    private explosionPool: Node[] = [];
    private upgradePool: Node[] = [];
    private activeParticles: Map<string, Node> = new Map();
    
    onLoad() {
        console.log('[ParticleManager] Loading...');
    }
    
    /**
     * 播放爆炸特效
     */
    playExplosion(position: Vec3, evolution: number = 1) {
        const node = this.getParticleFromPool('explosion');
        if (!node) {
            console.warn('[ParticleManager] No explosion particle available');
            return;
        }
        
        // 设置位置
        node.setPosition(position);
        
        // 根据等级设置颜色
        const particleSystem = node.getComponent(ParticleSystem2D);
        if (particleSystem) {
            particleSystem.startColor = this.getExplosionColor(evolution);
            particleSystem.endColor = new Color(255, 100, 0, 0);
        }
        
        // 播放
        node.active = true;
        if (particleSystem) {
            particleSystem.resetSystem();
            particleSystem.playOnAwake = true;
        }
        
        // 自动回收
        this.scheduleOnce(() => {
            this.recycleParticle('explosion', node);
        }, 2.0);
        
        console.log(`[ParticleManager] Explosion at ${position.x}, ${position.y}`);
    }
    
    /**
     * 播放升级特效
     */
    playUpgrade(position: Vec3, newEvolution: number) {
        const node = this.getParticleFromPool('upgrade');
        if (!node) return;
        
        node.setPosition(position);
        
        const particleSystem = node.getComponent(ParticleSystem2D);
        if (particleSystem) {
            particleSystem.startColor = this.getUpgradeColor(newEvolution);
        }
        
        node.active = true;
        if (particleSystem) {
            particleSystem.resetSystem();
        }
        
        this.scheduleOnce(() => {
            this.recycleParticle('upgrade', node);
        }, 1.5);
        
        console.log(`[ParticleManager] Upgrade to level ${newEvolution}`);
    }
    
    /**
     * 播放胜利特效
     */
    playVictory(position: Vec3) {
        const node = this.getParticleFromPool('victory');
        if (!node) return;
        
        node.setPosition(position);
        node.active = true;
        
        const particleSystem = node.getComponent(ParticleSystem2D);
        if (particleSystem) {
            particleSystem.resetSystem();
        }
        
        this.scheduleOnce(() => {
            this.recycleParticle('victory', node);
        }, 3.0);
        
        console.log('[ParticleManager] Victory effect');
    }
    
    /**
     * 从对象池获取粒子
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
                pool = [];
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
        
        return null;
    }
    
    /**
     * 回收粒子到对象池
     */
    private recycleParticle(type: string, node: Node) {
        node.active = false;
        
        switch (type) {
            case 'explosion':
                this.explosionPool.push(node);
                break;
            case 'upgrade':
                this.upgradePool.push(node);
                break;
        }
    }
    
    /**
     * 获取爆炸颜色（根据等级）
     */
    private getExplosionColor(evolution: number): Color {
        switch (evolution) {
            case 1: return new Color(255, 200, 0, 255);   // 黄色
            case 2: return new Color(255, 100, 0, 255);  // 橙色
            case 3: return new Color(255, 50, 50, 255);   // 红色
            case 4: return new Color(150, 0, 255, 255);   // 紫色
            default: return new Color(255, 255, 255, 255);
        }
    }
    
    /**
     * 获取升级颜色
     */
    private getUpgradeColor(evolution: number): Color {
        switch (evolution) {
            case 2: return new Color(0, 255, 100, 255);   // 绿色
            case 3: return new Color(0, 150, 255, 255);   // 蓝色
            case 4: return new Color(255, 0, 255, 255);   // 紫色
            default: return new Color(255, 255, 0, 255);
        }
    }
    
    /**
     * 清除所有活跃粒子
     */
    clearAll() {
        this.activeParticles.forEach((node, key) => {
            node.active = false;
        });
        this.activeParticles.clear();
    }
}

// 需要导入 instantiate
import { instantiate } from 'cc';
