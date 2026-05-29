import { _decorator, Component, Node, Vec3, ParticleSystem2D, Color, Size, instantiate } from 'cc';

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
    private victoryPool: Node[] = [];
    
    // 活跃粒子跟踪
    private activeParticles: Map<string, Node> = new Map();
    private particleIdCounter: number = 0;
    
    onLoad() {
        console.log('[ParticleManager] Loading...');
    }
    
    /**
     * 播放爆炸特效
     * @param position 世界坐标位置
     * @param evolution 炸弹进化等级 (1-4)
     */
    playExplosion(position: Vec3, evolution: number = 1) {
        const node = this.getParticleFromPool('explosion');
        if (!node) {
            console.warn('[ParticleManager] No explosion particle available');
            return;
        }
        
        const particleSystem = node.getComponent(ParticleSystem2D);
        
        if (particleSystem) {
            // 根据进化等级设置颜色
            particleSystem.startColor = this.getExplosionColor(evolution);
            particleSystem.endColor = new Color(255, 100, 0, 0);
            
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
            }, 2.0);
        }
        
        console.log(`[ParticleManager] Explosion at ${position.x}, ${position.y}`);
    }
    
    /**
     * 播放升级特效
     * @param position 世界坐标位置
     * @param newEvolution 新的进化等级 (2-4)
     */
    playUpgrade(position: Vec3, newEvolution: number) {
        const node = this.getParticleFromPool('upgrade');
        if (!node) return;
        
        const particleSystem = node.getComponent(ParticleSystem2D);
        
        if (particleSystem) {
            particleSystem.startColor = this.getUpgradeColor(newEvolution);
            
            node.setPosition(position);
            node.active = true;
            particleSystem.resetSystem();
            
            const id = `upgrade_${this.particleIdCounter++}`;
            this.activeParticles.set(id, node);
            
            this.scheduleOnce(() => {
                this.recycleParticle('upgrade', node);
                this.activeParticles.delete(id);
            }, 1.5);
        }
        
        console.log(`[ParticleManager] Upgrade to level ${newEvolution}`);
    }
    
    /**
     * 播放胜利特效
     * @param position 世界坐标位置
     */
    playVictory(position: Vec3) {
        const node = this.getParticleFromPool('victory');
        if (!node) return;
        
        const particleSystem = node.getComponent(ParticleSystem2D);
        
        if (particleSystem) {
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
