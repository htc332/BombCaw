import { _decorator, Component, Node, Prefab, instantiate, Vec3, UITransform, Size, Canvas, director, EventTarget, Vec2 } from 'cc';
import { GameLogic } from '../core/GameLogic';
import { GridManager } from '../core/GridManager';
import { AnimationManager } from '../managers/AnimationManager';
import { UIManager } from '../managers/UIManager';
import { AudioManager } from '../managers/AudioManager';
import { ParticleManager } from '../managers/ParticleManager';

const { ccclass, property } = _decorator;

/**
 * TestSceneManager
 * 测试场景管理器 - 确保测试关卡能运行
 * 
 * 目标：保证测试关卡能运行！
 */
@ccclass('TestSceneManager')
export class TestSceneManager extends Component {
    
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
    
    @property(Canvas)
    canvas: Canvas | null = null;
    
    // 管理器
    private gameLogic: GameLogic | null = null;
    private gridManager: GridManager | null = null;
    private animManager: AnimationManager | null = null;
    private uiManager: UIManager | null = null;
    private audioManager: AudioManager | null = null;
    private particleManager: ParticleManager | null = null;
    
    // 测试关卡配置 - 基于原项目设计
    private testLevelConfig = {
        gridSize: 5,
        bombs: 3,
        walls: [
            { x: 1, y: 1, type: 'normal' },
            { x: 2, y: 2, type: 'normal' },
            { x: 3, y: 1, type: 'elite' },
            { x: 1, y: 3, type: 'normal' },
            { x: 3, y: 3, type: 'normal' }
        ],
        staticBombs: [
            { x: 0, y: 2, evolution: 1 }
        ]
    };
    
    onLoad() {
        console.log('[TestSceneManager] Loading...');
        
        // 初始化所有管理器
        this.initManagers();
        
        // 初始化测试关卡
        this.initTestLevel();
        
        // 绑定事件
        this.bindEvents();
    }
    
    start() {
        console.log('[TestSceneManager] Started');
        
        // 显示测试信息
        this.showTestInfo();
        
        // 更新UI
        this.updateUI();
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
        
        // 设置预制体引用
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
    }
    
    /**
     * 初始化测试关卡
     */
    private initTestLevel() {
        if (!this.gameLogic) return;
        
        console.log('[TestSceneManager] Initializing test level...');
        
        // 初始化关卡
        this.gameLogic.initLevel(this.testLevelConfig);
        
        // 设置网格管理器
        if (this.gridManager) {
            this.gridManager.gridSize = this.testLevelConfig.gridSize;
            this.gridManager.calculateLayout();
        }
        
        // 设置游戏层尺寸
        if (this.gameLayer) {
            const uiTransform = this.gameLayer.getComponent(UITransform);
            if (uiTransform) {
                uiTransform.setContentSize(375, 600);
            }
        }
        
        console.log('[TestSceneManager] Test level initialized');
    }
    
    /**
     * 绑定事件
     */
    private bindEvents() {
        if (!this.gameLogic) return;
        
        // 监听游戏事件
        this.gameLogic.onEvent('level_started', (data: any) => {
            console.log('[TestScene] Level started:', data);
        });
        
        this.gameLogic.onEvent('bomb_placed', (data: any) => {
            console.log('[TestScene] Bomb placed:', data);
            this.updateUI();
        });
        
        this.gameLogic.onEvent('bomb_exploded', (data: any) => {
            console.log('[TestScene] Bomb exploded:', data);
            this.updateUI();
        });
        
        this.gameLogic.onEvent('wall_destroyed', (data: any) => {
            console.log('[TestScene] Wall destroyed:', data);
            this.updateUI();
        });
        
        this.gameLogic.onEvent('level_complete', (data: any) => {
            console.log('[TestScene] Level complete:', data);
            this.showVictory(data);
        });
        
        this.gameLogic.onEvent('game_over', (data: any) => {
            console.log('[TestScene] Game over:', data);
        });
        
        // 触摸事件
        if (this.gameLayer) {
            this.gameLayer.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }
        
        // UI 事件
        this.uiManager?.node.on('ui_reset_level', this.resetTestLevel, this);
        this.uiManager?.node.on('ui_next_level', this.resetTestLevel, this);
    }
    
    /**
     * 触摸结束事件
     */
    private onTouchEnd(event: any) {
        if (!this.gameLogic || !this.gameLayer || !this.gridManager) return;
        
        // 获取触摸位置
        const touch = event.touch;
        const pos = touch.getLocation();
        
        // 转换为本地坐标
        const localPos = this.gameLayer.getComponent(UITransform)?.convertToNodeSpaceAR(new Vec3(pos.x, pos.y, 0));
        if (!localPos) return;
        
        // 使用 GridManager 计算网格坐标
        const gridPos = this.gridManager.worldToGrid(localPos.x, localPos.y);
        
        // 检查是否在网格内
        if (!this.gridManager.isInGrid(gridPos.x, gridPos.y)) return;
        
        console.log('[TestScene] Touch at grid:', gridPos.x, gridPos.y);
        
        // 放置炸弹
        const success = this.gameLogic.placeBomb(gridPos.x, gridPos.y);
        if (success) {
            console.log('[TestScene] Bomb placed successfully');
        } else {
            console.log('[TestScene] Cannot place bomb here');
        }
    }
    
    /**
     * 更新 UI
     */
    private updateUI() {
        if (!this.gameLogic || !this.uiManager) return;
        
        const state = this.gameLogic.getState();
        
        // 更新分数显示
        this.uiManager?.updateScore(state.score);
        
        // 更新剩余炸弹数
        this.uiManager?.updateBombsLeft(state.bombsLeft);
        
        // 更新关卡信息
        this.uiManager?.updateLevelInfo(1, state.wallCount);
    }
    
    /**
     * 显示胜利界面
     */
    private showVictory(data: any) {
        console.log('[TestScene] Victory! Score:', data.score, 'Stars:', data.stars);
        
        // 显示胜利 UI
        this.uiManager?.showVictoryPanel(data.score, data.stars);
    }
    
    /**
     * 显示测试信息
     */
    private showTestInfo() {
        console.log('[TestScene] === Test Level Info ===');
        console.log('[TestScene] Grid Size:', this.testLevelConfig.gridSize);
        console.log('[TestScene] Bombs:', this.testLevelConfig.bombs);
        console.log('[TestScene] Walls:', this.testLevelConfig.walls.length);
        console.log('[TestScene] Static Bombs:', this.testLevelConfig.staticBombs.length);
        console.log('[TestScene] Touch the grid to place bombs!');
        console.log('[TestScene] ============================');
    }
    
    /**
     * 重置测试关卡
     */
    resetTestLevel() {
        console.log('[TestScene] Resetting test level...');
        
        // 清除现有节点
        if (this.gameLayer) {
            this.gameLayer.removeAllChildren();
        }
        
        // 重新初始化
        this.initTestLevel();
        this.updateUI();
        
        // 隐藏胜利面板
        this.uiManager?.hideAllPanels();
    }
}
