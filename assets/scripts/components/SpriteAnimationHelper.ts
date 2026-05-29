import { _decorator, Component, Node, Sprite, SpriteFrame, Animation, AnimationClip, math, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

/**
 * SpriteAnimationHelper
 * Cocos 精灵图动画辅助工具 - 兼容现有 index.json 格式
 * 
 * 支持三种播放模式：
 * 1. 循环播放 - 待机动画 (enemy_n, enemy_elite)
 * 2. 倒计时驱动 - 炸弹动画 (lv1-lv4，与游戏逻辑同步)
 * 3. 一次播放 - 死亡动画 (enemy_n_death, enemy_elite_death)
 * 
 * 不修改原有资源规格，运行时动态控制帧切换
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
    private frameTimings: Map<string, number[]> = new Map(); // 每帧的时间戳
    
    // 当前播放状态
    private currentClip: string = '';
    private currentFrame: number = 0;
    private isPlaying: boolean = false;
    private loop: boolean = true;
    private playMode: 'loop' | 'countdown' | 'once' = 'loop';
    
    // 计时器
    private timer: number = 0;
    private totalTime: number = 0; // 动画总时长
    private countdownDuration: number = 3; // 倒计时总时长（秒）
    
    // 回调
    private onCompleteCallback: Function | null = null;
    private onFrameCallback: Function | null = null;
    
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
        if (!this.isPlaying || !this.spriteFrames.has(this.currentClip)) return;
        
        const frames = this.spriteFrames.get(this.currentClip)!;
        const timings = this.frameTimings.get(this.currentClip);
        
        if (!frames || frames.length === 0) return;
        
        this.timer += dt;
        
        switch (this.playMode) {
            case 'loop':
                this.updateLoop(frames, timings);
                break;
            case 'countdown':
                this.updateCountdown(frames, timings);
                break;
            case 'once':
                this.updateOnce(frames, timings);
                break;
        }
    }
    
    /**
     * 注册精灵图动画（带时间戳）
     * @param clipName 动画名称
     * @param spriteFrames 精灵帧数组
     * @param timings 时间戳数组（可选，从 index.json 的 t 字段）
     */
    registerClip(clipName: string, spriteFrames: SpriteFrame[], timings?: number[]) {
        this.spriteFrames.set(clipName, spriteFrames);
        
        if (timings && timings.length > 0) {
            this.frameTimings.set(clipName, timings);
        } else {
            // 默认均匀分布
            const defaultTimings = spriteFrames.map((_, i) => i / spriteFrames.length);
            this.frameTimings.set(clipName, defaultTimings);
        }
        
        console.log(`[SpriteAnimation] Registered: ${clipName}, frames: ${spriteFrames.length}`);
    }
    
    /**
     * 播放动画
     * @param clipName 动画名称
     * @param options 播放选项
     */
    play(clipName: string, options?: {
        loop?: boolean,
        mode?: 'loop' | 'countdown' | 'once',
        countdownDuration?: number,
        onComplete?: Function,
        onFrame?: Function
    }) {
        const frames = this.spriteFrames.get(clipName);
        if (!frames || frames.length === 0) {
            console.warn(`[SpriteAnimation] Clip not found: ${clipName}`);
            return;
        }
        
        this.currentClip = clipName;
        this.currentFrame = 0;
        this.isPlaying = true;
        this.timer = 0;
        
        // 设置播放模式
        this.loop = options?.loop ?? true;
        this.playMode = options?.mode || 'loop';
        this.countdownDuration = options?.countdownDuration || 3;
        this.onCompleteCallback = options?.onComplete || null;
        this.onFrameCallback = options?.onFrame || null;
        
        // 立即显示第一帧
        this.updateSpriteFrame();
        
        console.log(`[SpriteAnimation] Playing: ${clipName}, mode: ${this.playMode}, frames: ${frames.length}`);
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
     * 设置倒计时进度 (0.0 ~ 1.0)
     * 用于炸弹动画，与游戏逻辑同步
     */
    setCountdownProgress(progress: number) {
        if (this.playMode !== 'countdown') return;
        
        const frames = this.spriteFrames.get(this.currentClip);
        const timings = this.frameTimings.get(this.currentClip);
        if (!frames || !timings) return;
        
        // 根据进度计算当前帧
        const clampedProgress = Math.max(0, Math.min(1, progress));
        const targetTime = clampedProgress * this.countdownDuration;
        
        // 找到对应时间戳的帧
        let frameIndex = 0;
        for (let i = 0; i < timings.length; i++) {
            if (timings[i] <= targetTime) {
                frameIndex = i;
            } else {
                break;
            }
        }
        
        if (frameIndex !== this.currentFrame) {
            this.currentFrame = frameIndex;
            this.updateSpriteFrame();
        }
    }
    
    /**
     * 更新循环播放
     */
    private updateLoop(frames: SpriteFrame[], timings?: number[]) {
        const totalDuration = timings ? timings[timings.length - 1] : frames.length / 12; // 默认12fps
        
        if (this.timer >= totalDuration) {
            if (this.loop) {
                this.timer = 0;
                this.currentFrame = 0;
            } else {
                this.isPlaying = false;
                this.onCompleteCallback?.();
                return;
            }
        }
        
        // 根据时间找到对应帧
        const newFrame = this.getFrameByTime(this.timer, frames.length, timings);
        if (newFrame !== this.currentFrame) {
            this.currentFrame = newFrame;
            this.updateSpriteFrame();
            this.onFrameCallback?.(this.currentFrame);
        }
    }
    
    /**
     * 更新倒计时驱动
     */
    private updateCountdown(frames: SpriteFrame[], timings?: number[]) {
        // 倒计时模式由外部通过 setCountdownProgress 控制
        // 这里只处理自动播放的情况
        if (this.timer >= this.countdownDuration) {
            this.isPlaying = false;
            this.currentFrame = frames.length - 1;
            this.updateSpriteFrame();
            this.onCompleteCallback?.();
            return;
        }
        
        const progress = this.timer / this.countdownDuration;
        this.setCountdownProgress(progress);
    }
    
    /**
     * 更新一次播放
     */
    private updateOnce(frames: SpriteFrame[], timings?: number[]) {
        const totalDuration = timings ? timings[timings.length - 1] : frames.length / 12;
        
        if (this.timer >= totalDuration) {
            this.isPlaying = false;
            this.currentFrame = frames.length - 1; // 停留在末帧
            this.updateSpriteFrame();
            this.onCompleteCallback?.();
            return;
        }
        
        const newFrame = this.getFrameByTime(this.timer, frames.length, timings);
        if (newFrame !== this.currentFrame) {
            this.currentFrame = newFrame;
            this.updateSpriteFrame();
            this.onFrameCallback?.(this.currentFrame);
        }
    }
    
    /**
     * 根据时间获取帧索引
     */
    private getFrameByTime(time: number, totalFrames: number, timings?: number[]): number {
        if (!timings || timings.length === 0) {
            // 均匀分布
            const frameDuration = 1 / 12; // 默认12fps
            return Math.min(Math.floor(time / frameDuration), totalFrames - 1);
        }
        
        // 根据时间戳查找
        for (let i = 0; i < timings.length; i++) {
            if (time < timings[i]) {
                return Math.max(0, i - 1);
            }
        }
        return totalFrames - 1;
    }
    
    /**
     * 更新精灵帧显示
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
        const timings = this.frameTimings.get(this.currentClip);
        return {
            name: this.currentClip,
            currentFrame: this.currentFrame,
            totalFrames: frames?.length || 0,
            isPlaying: this.isPlaying,
            mode: this.playMode,
            progress: timings ? this.timer / (timings[timings.length - 1] || 1) : 0
        };
    }
    
    /**
     * 获取指定 clip 的帧数组
     */
    getClipFrames(clipName: string): SpriteFrame[] | undefined {
        return this.spriteFrames.get(clipName);
    }
    
    /**
     * 获取指定 clip 的时间戳数组
     */
    getClipTimings(clipName: string): number[] | undefined {
        return this.frameTimings.get(clipName);
    }
    
    /**
     * 获取已注册的动画列表
     */
    getRegisteredClips(): string[] {
        return Array.from(this.spriteFrames.keys());
    }
}