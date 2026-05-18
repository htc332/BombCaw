import { _decorator, Component, Node, Sprite, SpriteFrame, Animation, AnimationClip, CCInteger } from 'cc';

const { ccclass, property } = _decorator;

/**
 * AnimationManager Component
 * 动画管理器 - 按 Cocos 引擎设计
 * 职责：管理所有游戏对象的动画状态
 */
@ccclass('AnimationManager')
export class AnimationManager extends Component {
    
    // ========== 动画剪辑引用 ==========
    
    @property(AnimationClip)
    bombIdleClip: AnimationClip | null = null;      // 炸弹待机
    
    @property(AnimationClip)
    bombTickClip: AnimationClip | null = null;      // 炸弹倒计时
    
    @property(AnimationClip)
    bombExplodeClip: AnimationClip | null = null;  // 炸弹爆炸
    
    @property(AnimationClip)
    wallIdleClip: AnimationClip | null = null;       // 墙壁待机
    
    @property(AnimationClip)
    wallHurtClip: AnimationClip | null = null;       // 墙壁受伤
    
    @property(AnimationClip)
    wallDieClip: AnimationClip | null = null;        // 墙壁死亡
    
    @property(AnimationClip)
    upgradeClip: AnimationClip | null = null;         // 升级特效
    
    // ========== 动画状态缓存 ==========
    
    private animationCache: Map<string, Animation> = new Map();
    
    onLoad() {
        console.log('[AnimationManager] Loaded');
    }
    
    /**
     * 注册动画组件
     */
    registerAnimation(nodeName: string, animation: Animation) {
        this.animationCache.set(nodeName, animation);
    }
    
    /**
     * 获取动画组件
     */
    getAnimation(nodeName: string): Animation | null {
        return this.animationCache.get(nodeName) || null;
    }
    
    // ========== 炸弹动画 ==========
    
    /**
     * 播放炸弹待机动画
     */
    playBombIdle(node: Node) {
        const anim = node.getComponent(Animation);
        if (anim && this.bombIdleClip) {
            anim.defaultClip = this.bombIdleClip;
            anim.play('bomb_idle');
        }
    }
    
    /**
     * 播放炸弹倒计时动画
     */
    playBombTick(node: Node, countdown: number) {
        const anim = node.getComponent(Animation);
        if (anim && this.bombTickClip) {
            // 根据倒计时播放不同帧
            anim.play('bomb_tick');
            
            // 设置播放速度，使动画与倒计时同步
            const state = anim.getState('bomb_tick');
            if (state) {
                state.speed = 1.0 / countdown;
            }
        }
    }
    
    /**
     * 播放炸弹爆炸动画
     */
    playBombExplode(node: Node, callback?: Function) {
        const anim = node.getComponent(Animation);
        if (anim && this.bombExplodeClip) {
            anim.play('bomb_explode');
            
            // 动画完成后回调
            if (callback) {
                anim.once(Animation.EventType.FINISHED, () => {
                    callback();
                });
            }
        }
    }
    
    // ========== 墙壁动画 ==========
    
    /**
     * 播放墙壁待机动画
     */
    playWallIdle(node: Node) {
        const anim = node.getComponent(Animation);
        if (anim && this.wallIdleClip) {
            anim.play('wall_idle');
        }
    }
    
    /**
     * 播放墙壁受伤动画
     */
    playWallHurt(node: Node) {
        const anim = node.getComponent(Animation);
        if (anim && this.wallHurtClip) {
            anim.play('wall_hurt');
        }
    }
    
    /**
     * 播放墙壁死亡动画
     */
    playWallDie(node: Node, callback?: Function) {
        const anim = node.getComponent(Animation);
        if (anim && this.wallDieClip) {
            anim.play('wall_die');
            
            if (callback) {
                anim.once(Animation.EventType.FINISHED, () => {
                    callback();
                });
            }
        }
    }
    
    // ========== 特效动画 ==========
    
    /**
     * 播放升级特效
     */
    playUpgradeEffect(node: Node) {
        const anim = node.getComponent(Animation);
        if (anim && this.upgradeClip) {
            anim.play('upgrade');
        }
    }
    
    /**
     * 停止所有动画
     */
    stopAllAnimations(node: Node) {
        const anim = node.getComponent(Animation);
        if (anim) {
            anim.stop();
        }
    }
    
    /**
     * 暂停动画
     */
    pauseAnimation(node: Node) {
        const anim = node.getComponent(Animation);
        if (anim) {
            anim.pause();
        }
    }
    
    /**
     * 恢复动画
     */
    resumeAnimation(node: Node) {
        const anim = node.getComponent(Animation);
        if (anim) {
            anim.resume();
        }
    }
}