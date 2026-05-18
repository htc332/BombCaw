import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform, Vec3, Animation, CCInteger } from 'cc';

const { ccclass, property } = _decorator;

/**
 * Bomb Component
 * 炸弹节点组件
 * 职责：炸弹显示、倒计时动画、爆炸触发
 */
@ccclass('Bomb')
export class Bomb extends Component {
    @property(Sprite)
    sprite: Sprite | null = null;
    
    @property(CCInteger)
    evolution: number = 1;
    
    @property(CCInteger)
    countdown: number = 3;
    
    @property
    isStatic: boolean = false;
    
    @property
    isActive: boolean = false;
    
    // 网格坐标
    private gridX: number = 0;
    private gridY: number = 0;
    
    // 动画组件
    private animation: Animation | null = null;
    
    onLoad() {
        this.animation = this.getComponent(Animation);
        this.updateSprite();
    }
    
    /**
     * 初始化炸弹
     */
    init(gx: number, gy: number, evolution: number = 1, isStatic: boolean = false) {
        this.gridX = gx;
        this.gridY = gy;
        this.evolution = evolution;
        this.isStatic = isStatic;
        
        if (isStatic) {
            this.isActive = false;
            this.countdown = 0;
        } else {
            this.countdown = 3;
        }
        
        this.updateSprite();
    }
    
    /**
     * 更新精灵图
     */
    updateSprite() {
        // TODO: 根据等级加载对应的 SpriteFrame
        // const spriteFrame = AssetManager.getSpriteFrame(`lv${this.evolution}`);
        // if (this.sprite && spriteFrame) {
        //     this.sprite.spriteFrame = spriteFrame;
        // }
    }
    
    /**
     * 激活静态炸弹
     */
    activate() {
        if (!this.isStatic || this.isActive) return;
        
        this.isActive = true;
        this.countdown = 3;
        this.updateSprite();
        
        console.log('[Bomb] Static bomb activated at', this.gridX, this.gridY);
    }
    
    /**
     * 倒计时 tick
     */
    tick(): boolean {
        if (!this.isActive) return false;
        
        this.countdown--;
        
        if (this.countdown <= 0) {
            this.explode();
            return true; // 爆炸了
        }
        
        // 播放倒计时动画
        if (this.animation) {
            // this.animation.play('tick');
        }
        
        return false; // 还没爆炸
    }
    
    /**
     * 爆炸
     */
    explode() {
        console.log('[Bomb] Explosion at', this.gridX, this.gridY, 'evolution:', this.evolution);
        
        // 播放爆炸动画
        if (this.animation) {
            // this.animation.play('explode');
        }
        
        // 通知外部爆炸事件
        // this.node.emit('bomb_exploded', { x: this.gridX, y: this.gridY, evolution: this.evolution });
    }
    
    /**
     * 升级
     */
    upgrade() {
        if (this.evolution < 4) {
            this.evolution++;
            this.updateSprite();
            console.log('[Bomb] Upgraded to level', this.evolution);
        }
    }
    
    /**
     * 获取网格坐标
     */
    getGridPosition(): { x: number, y: number } {
        return { x: this.gridX, y: this.gridY };
    }
}
