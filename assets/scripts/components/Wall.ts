import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform, Vec3, CCInteger, Animation } from 'cc';

const { ccclass, property } = _decorator;

/**
 * Wall Component
 * 墙壁/敌人组件
 * 职责：墙壁显示、受伤动画、死亡处理
 */
@ccclass('Wall')
export class Wall extends Component {
    @property(Sprite)
    sprite: Sprite | null = null;
    
    @property(CCInteger)
    hp: number = 1;
    
    @property(CCInteger)
    maxHp: number = 1;
    
    @property
    type: string = 'normal'; // normal, elite
    
    @property
    isDead: boolean = false;
    
    // 网格坐标
    private gridX: number = 0;
    private gridY: number = 0;
    
    // 动画
    private animation: Animation | null = null;
    
    // 受伤震动
    private shakeTime: number = 0;
    
    onLoad() {
        this.animation = this.getComponent(Animation);
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
        
        this.updateSprite();
    }
    
    /**
     * 更新精灵图
     */
    updateSprite() {
        // TODO: 根据类型和状态加载 SpriteFrame
    }
    
    /**
     * 受到伤害
     */
    takeDamage(damage: number): boolean {
        if (this.isDead) return false;
        
        this.hp -= damage;
        this.shakeTime = 10;
        
        // 播放受伤动画
        if (this.animation) {
            // this.animation.play('hurt');
        }
        
        if (this.hp <= 0) {
            this.die();
            return true; // 死亡了
        }
        
        return false; // 还活着
    }
    
    /**
     * 死亡
     */
    die() {
        this.isDead = true;
        
        // 播放死亡动画
        if (this.animation) {
            // this.animation.play('die');
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
}
