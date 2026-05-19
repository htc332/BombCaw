import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform, Size, Vec3 } from 'cc';
import { SpriteAnimationHelper } from './SpriteAnimationHelper';

const { ccclass, property } = _decorator;

/**
 * Wall Component
 * 墙壁/敌人组件 - Cocos 规范实现
 * 
 * 职责：墙壁显示、受伤动画、死亡处理
 * 使用 SpriteAnimationHelper 播放动画
 */
@ccclass('Wall')
export class Wall extends Component {
    
    @property(Sprite)
    sprite: Sprite | null = null;
    
    @property
    hp: number = 1;
    
    @property
    maxHp: number = 1;
    
    @property
    type: string = 'normal'; // normal, elite
    
    @property
    isDead: boolean = false;
    
    // 网格坐标
    private gridX: number = 0;
    private gridY: number = 0;
    
    // 动画辅助器
    private animHelper: SpriteAnimationHelper | null = null;
    
    // 受伤震动
    private shakeTime: number = 0;
    
    onLoad() {
        // 获取或创建组件
        if (!this.sprite) {
            this.sprite = this.getComponent(Sprite);
            if (!this.sprite) {
                this.sprite = this.addComponent(Sprite);
            }
        }
        
        // 确保有 UITransform
        let uiTransform = this.getComponent(UITransform);
        if (!uiTransform) {
            uiTransform = this.addComponent(UITransform);
        }
        
        // 获取动画辅助器
        this.animHelper = this.getComponent(SpriteAnimationHelper);
        if (!this.animHelper) {
            this.animHelper = this.addComponent(SpriteAnimationHelper);
            this.animHelper.sprite = this.sprite;
        }
    }
    
    /**
     * 初始化墙壁
     */
    init(gx: number, gy: number, type: string = 'normal', hp: number = 1) {
        this.gridX = gx;
        this.gridY = gy;
        this.type = type;
        this.maxHp = hp;
        this.hp = hp;
        this.isDead = false;
        
        // 设置节点名称
        this.node.name = `Wall_${gx}_${gy}_${type}`;
        
        // 播放待机动画
        this.playIdleAnimation();
    }
    
    /**
     * 播放待机动画
     */
    playIdleAnimation() {
        if (!this.animHelper || this.isDead) return;
        
        let clipName: string;
        
        if (this.type === 'elite') {
            if (this.hp <= 1 && this.maxHp > 1) {
                // 破损后待机
                clipName = 'enemy_elite_break_idle';
            } else {
                // 满血待机
                clipName = 'enemy_elite';
            }
        } else {
            clipName = 'enemy_n';
        }
        
        this.animHelper.play(clipName, {
            mode: 'loop',
            loop: true
        });
    }
    
    /**
     * 受到伤害
     */
    takeDamage(damage: number): boolean {
        if (this.isDead) return false;
        
        this.hp -= damage;
        this.shakeTime = 0.2; // 震动0.2秒
        
        // 受伤震动效果
        this.startShake();
        
        if (this.hp <= 0) {
            this.die();
            return true; // 死亡了
        }
        
        // 精英鼠破损过渡
        if (this.type === 'elite' && this.hp === 1 && this.maxHp > 1) {
            this.playBreakTransition();
        }
        
        return false; // 还活着
    }
    
    /**
     * 震动效果
     */
    private startShake() {
        const originalPos = this.node.position.clone();
        
        let elapsed = 0;
        const duration = 0.2;
        const magnitude = 5;
        
        this.schedule(() => {
            elapsed += 0.016;
            if (elapsed >= duration) {
                this.node.setPosition(originalPos);
                this.unschedule(this.startShake);
                return;
            }
            
            const offsetX = (Math.random() - 0.5) * magnitude;
            const offsetY = (Math.random() - 0.5) * magnitude;
            this.node.setPosition(originalPos.x + offsetX, originalPos.y + offsetY);
        }, 0.016);
    }
    
    /**
     * 破损过渡动画（精英鼠）
     */
    private playBreakTransition() {
        if (!this.animHelper) return;
        
        this.animHelper.play('enemy_elite_break', {
            mode: 'once',
            loop: false,
            onComplete: () => {
                // 过渡到破损待机
                this.playIdleAnimation();
            }
        });
    }
    
    /**
     * 死亡
     */
    die() {
        this.isDead = true;
        
        // 播放死亡动画
        if (this.animHelper) {
            const clipName = this.type === 'elite' ? 'enemy_elite_death' : 'enemy_n_death';
            
            this.animHelper.play(clipName, {
                mode: 'once',
                loop: false,
                onComplete: () => {
                    // 动画完成后销毁节点
                    this.scheduleOnce(() => {
                        this.node.destroy();
                    }, 0.5);
                }
            });
        }
        
        console.log('[Wall] Died at', this.gridX, this.gridY);
    }
    
    /**
     * 获取网格坐标
     */
    getGridPosition(): { x: number, y: number } {
        return { x: this.gridX, y: this.gridY };
    }
    
    /**
     * 获取类型
     */
    getType(): string {
        return this.type;
    }
    
    /**
     * 是否死亡
     */
    getIsDead(): boolean {
        return this.isDead;
    }
    
    /**
     * 获取当前HP
     */
    getHp(): number {
        return this.hp;
    }
}
