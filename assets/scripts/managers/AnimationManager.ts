import { _decorator, Component, Node, Sprite, SpriteFrame, Texture2D, assetManager, Size, Rect, Vec3 } from 'cc';
import { SpriteAnimationHelper } from '../components/SpriteAnimationHelper';
import { SpriteSheetLoader } from '../components/SpriteSheetLoader';

const { ccclass, property } = _decorator;

/**
 * AnimationManager
 * 动画管理器 - 统一管理所有精灵图动画
 * 
 * 职责：
 * 1. 批量加载所有精灵图资源
 * 2. 根据游戏状态播放对应动画
 * 3. 管理炸弹倒计时动画
 * 4. 管理墙壁死亡动画
 */
@ccclass('AnimationManager')
export class AnimationManager extends Component {
    
    // 精灵图配置列表
    private spriteSheetConfigs = [
        { name: 'lv1', path: 'sprites/lv1' },
        { name: 'lv2', path: 'sprites/lv2' },
        { name: 'lv3', path: 'sprites/lv3' },
        { name: 'lv4', path: 'sprites/lv4' },
        { name: 'enemy_n', path: 'sprites/enemy_n' },
        { name: 'enemy_n_death', path: 'sprites/enemy_n_death' },
        { name: 'enemy_elite', path: 'sprites/enemy_elite' },
        { name: 'enemy_elite_break', path: 'sprites/enemy_elite_break' },
        { name: 'enemy_elite_break_idle', path: 'sprites/enemy_elite_break_idle' },
        { name: 'enemy_elite_death', path: 'sprites/enemy_elite_death' },
    ];
    
    // 动画辅助器引用
    private animHelpers: Map<string, SpriteAnimationHelper> = new Map();
    
    // 加载状态
    private loadedCount: number = 0;
    private totalCount: number = 0;
    private onAllLoaded: Function | null = null;
    
    onLoad() {
        console.log('[AnimationManager] Initializing...');
    }
    
    start() {
        // 延迟加载，等待场景准备完成
        this.scheduleOnce(() => {
            this.loadAllSpriteSheets();
        }, 0.1);
    }
    
    /**
     * 加载所有精灵图
     */
    loadAllSpriteSheets(callback?: Function) {
        this.onAllLoaded = callback || null;
        this.loadedCount = 0;
        this.totalCount = this.spriteSheetConfigs.length;
        
        console.log(`[AnimationManager] Loading ${this.totalCount} sprite sheets...`);
        
        this.spriteSheetConfigs.forEach(config => {
            this.loadSpriteSheet(config.name, config.path);
        });
    }
    
    /**
     * 加载单个精灵图
     */
    private loadSpriteSheet(name: string, path: string) {
        // 创建临时节点用于加载
        const loaderNode = new Node(`Loader_${name}`);
        this.node.addChild(loaderNode);
        
        // 必须添加 UITransform 才能渲染
        const uiTransform = loaderNode.addComponent(UITransform);
        uiTransform.setContentSize(64, 64);
        
        const loader = loaderNode.addComponent(SpriteSheetLoader);
        const sprite = loaderNode.addComponent(Sprite);
        const animHelper = loaderNode.addComponent(SpriteAnimationHelper);
        
        loader.spriteSheetPath = `${path}/sprite`;
        loader.indexJsonPath = `${path}/index`;
        loader.targetSprite = sprite;
        
        loader.loadSpriteSheet(loader.spriteSheetPath, loader.indexJsonPath, (frames: SpriteFrame[]) => {
            if (frames && frames.length > 0) {
                // 注册到动画辅助器
                animHelper.registerClip(name, frames);
                this.animHelpers.set(name, animHelper);
                
                console.log(`[AnimationManager] Loaded: ${name}, frames: ${frames.length}`);
            }
            
            this.loadedCount++;
            if (this.loadedCount >= this.totalCount) {
                console.log('[AnimationManager] All sprite sheets loaded!');
                this.onAllLoaded?.();
            }
        });
    }
    
    /**
     * 播放炸弹待机动画（倒计时驱动）
     */
    playBombIdle(bombNode: Node, level: number, countdownDuration: number) {
        const clipName = `lv${level}`;
        const animHelper = this.getAnimHelper(bombNode, clipName);
        
        if (animHelper) {
            animHelper.play(clipName, {
                mode: 'countdown',
                countdownDuration: countdownDuration,
                loop: false
            });
        }
    }
    
    /**
     * 更新炸弹倒计时进度
     */
    updateBombCountdown(bombNode: Node, progress: number) {
        const animHelper = bombNode.getComponent(SpriteAnimationHelper);
        if (animHelper) {
            animHelper.setCountdownProgress(progress);
        }
    }
    
    /**
     * 播放墙壁待机动画
     */
    playWallIdle(wallNode: Node, type: string) {
        const clipName = type === 'elite' ? 'enemy_elite' : 'enemy_n';
        const animHelper = this.getAnimHelper(wallNode, clipName);
        
        if (animHelper) {
            animHelper.play(clipName, {
                mode: 'loop',
                loop: true
            });
        }
    }
    
    /**
     * 播放死亡动画
     */
    playDeathAnimation(wallNode: Node, type: string, onComplete?: Function) {
        const clipName = type === 'elite' ? 'enemy_elite_death' : 'enemy_n_death';
        const animHelper = this.getAnimHelper(wallNode, clipName);
        
        if (animHelper) {
            animHelper.play(clipName, {
                mode: 'once',
                loop: false,
                onComplete: () => {
                    console.log(`[AnimationManager] Death animation complete: ${type}`);
                    onComplete?.();
                }
            });
        }
    }
    
    /**
     * 播放破损过渡动画
     */
    playBreakTransition(wallNode: Node, onComplete?: Function) {
        const animHelper = this.getAnimHelper(wallNode, 'enemy_elite_break');
        
        if (animHelper) {
            animHelper.play('enemy_elite_break', {
                mode: 'once',
                loop: false,
                onComplete: () => {
                    // 过渡到破损待机
                    this.playBreakIdle(wallNode);
                    onComplete?.();
                }
            });
        }
    }
    
    /**
     * 播放破损待机动画
     */
    playBreakIdle(wallNode: Node) {
        const animHelper = this.getAnimHelper(wallNode, 'enemy_elite_break_idle');
        
        if (animHelper) {
            animHelper.play('enemy_elite_break_idle', {
                mode: 'loop',
                loop: true
            });
        }
    }
    
    /**
     * 停止动画
     */
    stopAnimation(targetNode: Node) {
        const animHelper = targetNode.getComponent(SpriteAnimationHelper);
        if (animHelper) {
            animHelper.stop();
        }
    }
    
    /**
     * 获取或创建动画辅助器
     */
    private getAnimHelper(targetNode: Node, clipName: string): SpriteAnimationHelper | null {
        let animHelper = targetNode.getComponent(SpriteAnimationHelper);
        
        if (!animHelper) {
            // 确保有 UITransform
            let uiTransform = targetNode.getComponent(UITransform);
            if (!uiTransform) {
                uiTransform = targetNode.addComponent(UITransform);
                uiTransform.setContentSize(64, 64);
            }
            
            // 确保有 Sprite 组件
            let sprite = targetNode.getComponent(Sprite);
            if (!sprite) {
                sprite = targetNode.addComponent(Sprite);
            }
            
            animHelper = targetNode.addComponent(SpriteAnimationHelper);
            animHelper.sprite = sprite;
        }
        
        // 从全局缓存复制帧数据（如果可用）
        const globalHelper = this.animHelpers.get(clipName);
        if (globalHelper && animHelper) {
            const clips = globalHelper.getRegisteredClips();
            clips.forEach(clipName => {
                const frames = globalHelper.getClipFrames(clipName);
                const timings = globalHelper.getClipTimings(clipName);
                if (frames && frames.length > 0) {
                    animHelper!.registerClip(clipName, frames, timings);
                }
            });
        }
        
        return animHelper;
    }
    
    /**
     * 获取加载进度
     */
    getLoadProgress(): number {
        if (this.totalCount === 0) return 1;
        return this.loadedCount / this.totalCount;
    }
    
    /**
     * 是否全部加载完成
     */
    isAllLoaded(): boolean {
        return this.loadedCount >= this.totalCount;
    }
}