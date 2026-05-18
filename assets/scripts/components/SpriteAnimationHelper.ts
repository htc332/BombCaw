import { _decorator, Component, Node, Sprite, SpriteFrame, Animation, AnimationClip, math, UITransform } from 'cc';

const { ccclass, property } = _decorator;

/**
 * SpriteAnimationHelper
 * Cocos 精灵图动画辅助工具
 * 
 * Cocos Creator 支持两种精灵图动画方式：
 * 1. Sprite Animation Clip - 在编辑器中创建，适合简单循环动画
 * 2. 程序化 SpriteFrame 切换 - 代码控制，适合复杂逻辑
 * 
 * 本类提供程序化方式，兼容现有精灵图格式
 */
@ccclass('SpriteAnimationHelper')
export class SpriteAnimationHelper extends Component {
    
    @property(Sprite)
    sprite: Sprite | null = null;
    
    @property
    autoPlay: boolean = false;
    
    @property
    defaultClip: string = '';
    
    // 动画数据缓存
    private spriteFrames: Map<string, SpriteFrame[]> = new Map();
    private currentClip: string = '';
    private currentFrame: number = 0;
    private isPlaying: boolean = false;
    private loop: boolean = true;
    private fps: number = 12;
    private timer: number = 0;
    private onCompleteCallback: Function | null = null;
    
    onLoad() {
        if (!this.sprite) {
            this.sprite = this.getComponent(Sprite);
        }
    }
    
    start() {
        if (this.autoPlay && this.defaultClip) {
            this.play(this.defaultClip);
        }
    }
    
    update(dt: number) {
        if (!this.isPlaying) return;
        
        this.timer += dt;
        const frameDuration = 1 / this.fps;
        
        if (this.timer >= frameDuration) {
            this.timer -= frameDuration;
            this.nextFrame();
        }
    }
    
    /**
     * 注册精灵图动画
     * @param clipName 动画名称
     * @param spriteFrames 精灵帧数组
     */
    registerClip(clipName: string, spriteFrames: SpriteFrame[]) {
        this.spriteFrames.set(clipName, spriteFrames);
        console.log(`[SpriteAnimation] Registered clip: ${clipName} with ${spriteFrames.length} frames`);
    }
    
    /**
     * 播放动画
     */
    play(clipName: string, options?: { loop?: boolean, fps?: number, onComplete?: Function }) {
        const frames = this.spriteFrames.get(clipName);
        if (!frames || frames.length === 0) {
            console.warn(`[SpriteAnimation] Clip not found: ${clipName}`);
            return;
        }
        
        this.currentClip = clipName;
        this.currentFrame = 0;
        this.isPlaying = true;
        this.loop = options?.loop ?? true;
        this.fps = options?.fps ?? 12;
        this.onCompleteCallback = options?.onComplete || null;
        this.timer = 0;
        
        // 立即显示第一帧
        this.updateSpriteFrame();
        
        console.log(`[SpriteAnimation] Playing: ${clipName}, frames: ${frames.length}, fps: ${this.fps}`);
    }
    
    /**
     * 停止动画
     */
    stop() {
        this.isPlaying = false;
        this.currentFrame = 0;
        this.timer = 0;
    }
    
    /**
     * 暂停动画
     */
    pause() {
        this.isPlaying = false;
    }
    
    /**
     * 恢复动画
     */
    resume() {
        if (this.currentClip && this.spriteFrames.has(this.currentClip)) {
            this.isPlaying = true;
        }
    }
    
    /**
     * 切换到下一帧
     */
    private nextFrame() {
        const frames = this.spriteFrames.get(this.currentClip);
        if (!frames) return;
        
        this.currentFrame++;
        
        if (this.currentFrame >= frames.length) {
            if (this.loop) {
                this.currentFrame = 0;
            } else {
                this.currentFrame = frames.length - 1;
                this.isPlaying = false;
                
                if (this.onCompleteCallback) {
                    this.onCompleteCallback();
                    this.onCompleteCallback = null;
                }
                return;
            }
        }
        
        this.updateSpriteFrame();
    }
    
    /**
     * 更新精灵帧
     */
    private updateSpriteFrame() {
        const frames = this.spriteFrames.get(this.currentClip);
        if (!frames || !this.sprite) return;
        
        const frame = frames[this.currentFrame];
        if (frame) {
            this.sprite.spriteFrame = frame;
        }
    }
    
    /**
     * 跳转到指定帧
     */
    gotoFrame(frameIndex: number) {
        const frames = this.spriteFrames.get(this.currentClip);
        if (!frames) return;
        
        this.currentFrame = Math.max(0, Math.min(frameIndex, frames.length - 1));
        this.updateSpriteFrame();
    }
    
    /**
     * 获取当前动画信息
     */
    getCurrentClipInfo() {
        const frames = this.spriteFrames.get(this.currentClip);
        return {
            name: this.currentClip,
            currentFrame: this.currentFrame,
            totalFrames: frames?.length || 0,
            isPlaying: this.isPlaying,
            fps: this.fps
        };
    }
}
