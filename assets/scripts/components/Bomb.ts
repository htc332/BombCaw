import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform, Size, Vec3 } from 'cc';
import { SpriteAnimationHelper } from './SpriteAnimationHelper';

const { ccclass, property } = _decorator;

/**
 * Bomb Component
 * 炸弹节点组件 - Cocos 规范实现
 * 
 * 职责：炸弹显示、倒计时动画、爆炸触发
 * 使用 SpriteAnimationHelper 播放动画，不直接操作 SpriteFrame
 */
@ccclass('Bomb')
export class Bomb extends Component {
    
    @property(Sprite)
    sprite: Sprite | null = null;
    
    @property
    evolution: number = 1;
    
    @property
    countdown: number = 3;
    
    @property
    isStatic: boolean = false;
    
    @property
    isActive: boolean = false;
    
    // 网格坐标
    private gridX: number = 0;
    private gridY: number = 0;
    
    // 动画辅助器
    private animHelper: SpriteAnimationHelper | null = null;
    
    // 倒计时计时
    private countdownTimer: number = 0;
    
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
        if (this.animHelper) {
            this.animHelper.sprite = this.sprite;
        }
        }
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
            this.countdownTimer = 0;
        }
        
        // 设置节点名称
        this.node.name = isStatic ? `StaticBomb_${gx}_${gy}` : `Bomb_${gx}_${gy}`;
    }
    
    /**
     * 激活静态炸弹
     */
    activate() {
        if (!this.isStatic || this.isActive) return;
        
        this.isActive = true;
        this.countdown = 3;
        this.countdownTimer = 0;
        
        // 播放激活动画
        this.playIdleAnimation();
        
        console.log('[Bomb] Static bomb activated at', this.gridX, this.gridY);
    }
    
    /**
     * 播放待机动画（倒计时驱动）
     */
    playIdleAnimation() {
        if (!this.animHelper) return;
        
        const clipName = `lv${this.evolution}`;
        
        if (this.isStatic && !this.isActive) {
            // 静态未激活：显示 Sleep 图片
            // 这里需要加载 Sleep 图片作为静态显示
            this.loadSleepSprite();
        } else {
            // 播放倒计时动画
            this.animHelper.play(clipName, {
                mode: 'countdown',
                countdownDuration: this.countdown,
                loop: false,
                onComplete: () => {
                    this.explode();
                }
            });
        }
    }
    
    /**
     * 加载 Sleep 状态图片（静态炸弹未激活）
     */
    private loadSleepSprite() {
        // 静态炸弹 Sleep 状态使用单张图片
        const sleepPath = `sprites/static_bombs/Sleep/Sleep_lv${this.evolution}`;
        // 通过资源管理加载（实际实现中需要资源加载逻辑）
        console.log('[Bomb] Loading sleep sprite:', sleepPath);
    }
    
    /**
     * 更新倒计时进度
     */
    updateCountdown(dt: number) {
        if (!this.isActive && this.isStatic) return;
        
        this.countdownTimer += dt;
        const progress = this.countdownTimer / this.countdown;
        
        // 更新动画进度
        if (this.animHelper) {
            this.animHelper.setCountdownProgress(Math.min(1, progress));
        }
        
        // 检查是否爆炸
        if (this.countdownTimer >= this.countdown) {
            this.explode();
        }
    }
    
    /**
     * 爆炸
     */
    explode() {
        console.log('[Bomb] Explosion at', this.gridX, this.gridY, 'evolution:', this.evolution);
        
        // 停止动画
        if (this.animHelper) {
            this.animHelper.stop();
        }
        
        // 通知外部爆炸事件
        this.node.emit('bomb_exploded', {
            x: this.gridX,
            y: this.gridY,
            evolution: this.evolution
        });
        
        // 销毁节点（延迟一点让爆炸效果播放）
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.5);
    }
    
    /**
     * 升级
     */
    upgrade() {
        if (this.evolution < 4) {
            this.evolution++;
            
            // 重新播放动画（新等级）
            if (this.isActive || !this.isStatic) {
                this.playIdleAnimation();
            }
            
            console.log('[Bomb] Upgraded to level', this.evolution);
        }
    }
    
    /**
     * 获取网格坐标
     */
    getGridPosition(): { x: number, y: number } {
        return { x: this.gridX, y: this.gridY };
    }
    
    /**
     * 获取当前等级
     */
    getEvolution(): number {
        return this.evolution;
    }
    
    /**
     * 是否是静态炸弹
     */
    getIsStatic(): boolean {
        return this.isStatic;
    }
    
    /**
     * 是否已激活
     */
    getIsActive(): boolean {
        return this.isActive;
    }
}
