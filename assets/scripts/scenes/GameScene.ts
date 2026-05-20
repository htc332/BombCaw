import { _decorator, Component, Node, Prefab, instantiate, Vec3, UITransform, Size, Canvas, director, EventTarget, JsonAsset, resources } from 'cc';
import { GameLogic } from '../core/GameLogic';
import { GridManager } from '../core/GridManager';
import { AnimationManager } from '../managers/AnimationManager';
import { UIManager } from '../managers/UIManager';
import { AudioManager } from '../managers/AudioManager';
import { ParticleManager } from '../managers/ParticleManager';
import { LevelManager, LevelData } from '../managers/LevelManager';

const { ccclass, property } = _decorator;

/**
 * GameScene
 * 主游戏场景脚本
 * 
 * 职责：
 * 1. 整合所有管理器
 * 2. 加载关卡数据
 * 3. 处理游戏流程
 * 4. 协调 UI、音效、粒子效果
 */
@ccclass('GameScene')
export class GameScene extends Component {
    
    // 预制体引用
    @property(Prefab)
    bombPrefab: Prefab | null = null;
    
    @property(Prefab)
    wallPrefab: Prefab | null = null;
    
    @property(Prefab)
    staticBombPrefab: Prefab | null = null;
    
    // 节点引用
    @property(Node)
    gameLayer: Node | null = null;
    
    @property(Node)
    uiLayer: Node | null = null;
    
    @property(Node)
    particleLayer: Node | null = null;
    
    @property(Canvas)
    canvas: Canvas | null = null;
    
    // 管理器
    private gameLogic: GameLogic | null = null;
    private gridManager: GridManager | null = null;
    private animManager: AnimationManager | null = null;
    private uiManager: UIManager | null = null;
    private audioManager: AudioManager | null = null;
    private particleManager: ParticleManager | null = null;
    private levelManager: LevelManager | null = null;
    
    // 当前关卡数据
    private currentLevelData: LevelData | null = null;
    
    onLoad() {
        console.log('[GameScene] Loading...');
        
        // 初始化所有管理器
        this.initManagers();
        
        // 绑定事件
        this.bindEvents();
    }
    
    async start() {
        console.log('[GameScene] Started');
        
        // 获取当前关卡
        const levelId = this.levelManager?.getCurrentLevel() || 1;
        
        // 加载关卡
        await this.loadLevel(levelId);
        
        // 开始游戏
        this.startGame();
    }
    
    /**
     * 初始化所有管理器
     */
    private initManagers() {
        // GameLogic
        this.gameLogic = this.getComponent(GameLogic);
        if (!this.gameLogic) {
            this.gameLogic = this.addComponent(GameLogic);
        }
        
        // 设置预制体
        if (this.gameLogic) {
            this.gameLogic.bombPrefab = this.bombPrefab;
            this.gameLogic.wallPrefab = this.wallPrefab;
            this.gameLogic.gameLayer = this.gameLayer;
        }
        
        // GridManager
        this.gridManager = this.getComponent(GridManager);
        if (!this.gridManager) {
            this.gridManager = this.addComponent(GridManager);
        }
        
        // AnimationManager
        this.animManager = this.getComponent(AnimationManager);
        if (!this.animManager) {
            this.animManager = this.addComponent(AnimationManager);
        }
        
        // UIManager
        this.uiManager = this.getComponent(UIManager);
        if (!this.uiManager) {
            this.uiManager = this.addComponent(UIManager);
        }
        
        // AudioManager
        this.audioManager = this.getComponent(AudioManager);
        if (!this.audioManager) {
            this.audioManager = this.addComponent(AudioManager);
        }
        
        // ParticleManager
        this.particleManager = this.getComponent(ParticleManager);
        if (!this.particleManager) {
            this.particleManager = this.addComponent(ParticleManager);
        }
        
        // LevelManager
        this.levelManager = this.getComponent(LevelManager);
        if (!this.levelManager) {
            this.levelManager = this.addComponent(LevelManager);
        }
    }
    
    /**
     * 加载关卡
     */
    async loadLevel(levelId: number): Promise<boolean> {
        console.log(`[GameScene] Loading level ${levelId}...`);
        
        // 加载关卡配置
        const levelData = await this.levelManager?.loadLevelConfig(levelId);
        if (!levelData) {
            console.error(`[GameScene] Failed to load level ${levelId}`);
            return false;
        }
        
        this.currentLevelData = levelData;
        
        // 初始化 GameLogic
        if (this.gameLogic) {
            this.gameLogic.initLevel(levelData);
        }
        
        // 设置网格大小
        if (this.gridManager) {
            this.gridManager.gridSize = levelData.gridSize;
            this.gridManager.calculateLayout();
        }
        
        // 更新 UI
        this.uiManager?.updateLevelInfo(levelId, levelData.walls.length);
        this.uiManager?.updateBombsLeft(levelData.bombs);
        
        console.log(`[GameScene] Level ${levelId} loaded: ${levelData.name}`);
        return true;
    }
    
    /**
     * 开始游戏
     */
    startGame() {
        console.log('[GameScene] Starting game...');
        
        // 播放背景音乐
        this.audioManager?.playBgm();
        
        // 显示游戏信息
        this.updateUI();
    }
    
    /**
     * 绑定事件
     */
    private bindEvents() {
        if (!this.gameLogic) return;
        
        // 炸弹放置
        this.gameLogic.onEvent('bomb_placed', (data: any) => {
            this.audioManager?.playSfx('bomb_place');
            this.updateUI();
        });
        
        // 炸弹爆炸
        this.gameLogic.onEvent('bomb_exploded', (data: any) => {
            this.audioManager?.playSfx('bomb_explode');
            
            // 播放爆炸粒子
            const pos = this.gridManager?.gridToWorld(data.x, data.y);
            if (pos) {
                this.particleManager?.playExplosion(pos, data.evolution);
            }
            
            this.updateUI();
        });
        
        // 炸弹升级
        this.gameLogic.onEvent('bomb_upgraded', (data: any) => {
            this.audioManager?.playSfx('bomb_upgrade');
            
            const pos = this.gridManager?.gridToWorld(data.x, data.y);
            if (pos) {
                this.particleManager?.playUpgrade(pos, data.newEvolution);
            }
        });
        
        // 墙壁受损
        this.gameLogic.onEvent('wall_damaged', (data: any) => {
            this.audioManager?.playSfx('wall_break');
        });
        
        // 墙壁摧毁
        this.gameLogic.onEvent('wall_destroyed', (data: any) => {
            this.audioManager?.playSfx('wall_destroy');
            this.updateUI();
        });
        
        // 关卡完成
        this.gameLogic.onEvent('level_complete', (data: any) => {
            this.onLevelComplete(data);
        });
        
        // 游戏失败
        this.gameLogic.onEvent('game_over', (data: any) => {
            this.onGameOver(data);
        });
        
        // 触摸事件
        if (this.gameLayer) {
            this.gameLayer.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }
        
        // UI 事件
        this.uiManager?.node.on('ui_reset_level', this.resetLevel, this);
        this.uiManager?.node.on('ui_next_level', this.nextLevel, this);
    }
    
    /**
     * 触摸结束事件
     */
    private onTouchEnd(event: any) {
        if (!this.gameLogic || !this.gameLayer || !this.gridManager) return;
        
        const touch = event.touch;
        const pos = touch.getLocation();
        
        // 转换为本地坐标
        const localPos = this.gameLayer.getComponent(UITransform)?.convertToNodeSpaceAR(new Vec3(pos.x, pos.y, 0));
        if (!localPos) return;
        
        // 计算网格坐标
        const gridPos = this.gridManager.worldToGrid(localPos.x, localPos.y);
        
        // 检查是否在网格内
        if (!this.gridManager.isInGrid(gridPos.x, gridPos.y)) return;
        
        console.log(`[GameScene] Touch at grid: ${gridPos.x}, ${gridPos.y}`);
        
        // 放置炸弹
        const success = this.gameLogic.placeBomb(gridPos.x, gridPos.y);
        if (success) {
            console.log('[GameScene] Bomb placed successfully');
        }
    }
    
    /**
     * 关卡完成
     */
    private onLevelComplete(data: any) {
        console.log('[GameScene] Level complete!', data);
        
        // 播放胜利音效
        this.audioManager?.playSfx('victory');
        
        // 播放胜利粒子
        this.particleManager?.playVictory(new Vec3(0, 0, 0));
        
        // 计算星级
        const levelId = this.currentLevelData?.id || 1;
        const result = this.levelManager?.completeLevel(levelId, data.score);
        
        // 显示胜利面板
        this.uiManager?.showVictoryPanel(data.score, result?.stars || 1);
    }
    
    /**
     * 游戏失败
     */
    private onGameOver(data: any) {
        console.log('[GameScene] Game over!', data);
        
        // 播放失败音效
        this.audioManager?.playSfx('game_over');
        
        // 显示失败面板
        // this.uiManager?.showGameOverPanel();
    }
    
    /**
     * 重置关卡
     */
    resetLevel() {
        console.log('[GameScene] Resetting level...');
        
        const levelId = this.currentLevelData?.id || 1;
        this.loadLevel(levelId).then(() => {
            this.startGame();
        });
    }
    
    /**
     * 下一关
     */
    nextLevel() {
        console.log('[GameScene] Loading next level...');
        
        const nextLevelId = (this.currentLevelData?.id || 1) + 1;
        
        // 检查是否解锁
        if (this.levelManager?.isLevelUnlocked(nextLevelId)) {
            this.levelManager?.setCurrentLevel(nextLevelId);
            this.loadLevel(nextLevelId).then(() => {
                this.startGame();
            });
        } else {
            console.log('[GameScene] Next level not unlocked');
            // 返回关卡选择
            director.loadScene('LevelSelect');
        }
    }
    
    /**
     * 更新 UI
     */
    private updateUI() {
        if (!this.gameLogic) return;
        
        const state = this.gameLogic.getState();
        
        this.uiManager?.updateScore(state.score);
        this.uiManager?.updateBombsLeft(state.bombsLeft);
    }
    
    /**
     * 暂停游戏
     */
    pauseGame() {
        director.pause();
        this.audioManager?.pauseBgm();
    }
    
    /**
     * 恢复游戏
     */
    resumeGame() {
        director.resume();
        this.audioManager?.resumeBgm();
    }
}

// 需要导入 UITransform
import { UITransform } from 'cc';
