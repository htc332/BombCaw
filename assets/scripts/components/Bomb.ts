import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform, Size, Vec3 } from 'cc';
import { SpriteAnimationHelper } from './SpriteAnimationHelper';

const { ccclass, property } = _decorator;

/**
 * Bomb Component - 已验证文件系统编辑
 * 编辑时间: 2026-05-24
 * 编辑者: AI Assistant via 文件系统直接操作
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
    
    // 新增：炸弹威力属性（已验证文件系统编辑可行）
    @property
    power: number = 1;
    
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
            uiTransform.contentSize = new Size(64, 64);
        }
        
        // 初始化动画辅助器
        this.animHelper = new SpriteAnimationHelper(this.sprite);
    }
    
    start() {
        if (this.isActive && !this.isStatic) {
            this.startCountdown();
        }
    }
    
    update(deltaTime: number) {
        if (this.isActive && !this.isStatic && this.countdownTimer > 0) {
            this.countdownTimer -= deltaTime;
            if (this.countdownTimer <= 0) {
                this.explode();
            }
        }
    }
    
    /**
     * 设置网格坐标
     */
    setGridPosition(x: number, y: number) {
        this.gridX = x;
        this.gridY = y;
    }
    
    /**
     * 获取网格坐标
     */
    getGridPosition(): { x: number, y: number } {
        return { x: this.gridX, y: this.gridY };
    }
    
    /**
     * 激活炸弹（开始倒计时）
     */
    activate() {
        if (this.isStatic) return;
        
        this.isActive = true;
        this.startCountdown();
    }
    
    /**
     * 开始倒计时
     */
    private startCountdown() {
        this.countdownTimer = this.countdown;
        
        // 播放倒计时动画
        if (this.animHelper) {
            this.animHelper.playCountdown(this.countdown);
        }
    }
    
    /**
     * 爆炸
     */
    private explode() {
        this.isActive = false;
        
        // 播放爆炸动画
        if (this.animHelper) {
            this.animHelper.playExplosion(() => {
                this.onExplosionComplete();
            });
        } else {
            this.onExplosionComplete();
        }
    }
    
    /**
     * 爆炸完成回调
     */
    private onExplosionComplete() {
        // 通知游戏管理器爆炸完成
        // 这里可以发送事件或调用回调
        console.log(`Bomb at (${this.gridX}, ${this.gridY}) exploded with power ${this.power}!`);
        
        // 销毁节点
        this.node.destroy();
    }
    
    /**
     * 设置炸弹威力
     */
    setPower(value: number) {
        this.power = value;
    }
    
    /**
     * 获取炸弹威力
     */
    getPower(): number {
        return this.power;
    }
}
