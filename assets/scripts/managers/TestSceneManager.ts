import { _decorator, Component, Node, Prefab, instantiate, Vec3, UITransform, Size, Canvas, director, EventTarget } from 'cc';
import { GameLogic } from '../core/GameLogic';
import { AnimationManager } from '../managers/AnimationManager';
import { UIManager } from '../managers/UIManager';

const { ccclass, property } = _decorator;

/**
 * TestSceneManager
 * 测试场景管理器 - 串联所有功能进行测试
 * 
 * 职责：
 * 1. 创建测试关卡（简化版）
 * 2. 初始化所有管理器
 * 3. 绑定 UI 事件
 * 4. 处理用户输入
 */
@ccclass('TestSceneManager')
export class TestSceneManager extends Component {
    
    // 预制体引用
    @property(Prefab)
    bombPrefab: Prefab | null = null;
    
    @property(Prefab)
    wallPrefab: Prefab | null = null;
    
    // 节点引用
    @property(Node)
    gameLayer: Node | null = null;
    
    @property(Node)
    uiLayer: Node | null = null;
    
    @property(Canvas)
    canvas: Canvas | null = null;
    
    // 管理器
    private gameLogic: GameLogic | null = null;
    private animManager: AnimationManager | null = null;
    private uiManager: UIManager | null = null;
    
    // 测试关卡配置
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
            { x: 0, y: 2, level: 1 }
        ]
    };
    
    onLoad() {
        console.log('[TestSceneManager] Loading...');
        
        // 获取或创建管理器
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
    }
    
    /**
     * 初始化管理器
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
    }
    
    /**
     * 初始化测试关卡
     */
    private initTestLevel() {
        if (!this.gameLogic) return;
        
        console.log('[TestSceneManager] Initializing test level...');
        
        // 初始化关卡
        this.gameLogic.initLevel(this.testLevelConfig);
        
        // 设置游戏层尺寸
        if (this.gameLayer) {
            const uiTransform = this.gameLayer.getComponent(UITransform);
            if (uiTransform) {
                uiTransform.setContentSize(375, 600);
            }
        }
    }
    
    /**
     * 绑定事件
     */
    private bindEvents() {
        if (!this.gameLogic) return;
        
        // 监听游戏事件
        this.gameLogic.onEvent('bomb_placed', (data: any) => {
            console.log('[TestScene] Bomb placed:', data);
            this.updateUI();
        });
        
        this.gameLogic.onEvent('bomb_exploded', (data: any) => {
            console.log('[TestScene] Bomb exploded:', data);
            this.updateUI();
        });
        
        this.gameLogic.onEvent('level_complete', (data: any) => {
            console.log('[TestScene] Level complete:', data);
            this.showVictory(data);
        });
        
        // 触摸事件
        if (this.gameLayer) {
            this.gameLayer.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }
    }
    
    /**
     * 触摸结束事件
     */
    private onTouchEnd(event: any) {
        if (!this.gameLogic || !this.gameLayer) return;
        
        // 获取触摸位置
        const touch = event.touch;
        const pos = touch.getLocation();
        
        // 转换为本地坐标
        const localPos = this.gameLayer.uiTransform?.convertToNodeSpaceAR(new Vec3(pos.x, pos.y, 0));
        if (!localPos) return;
        
        // 计算网格坐标
        const gridSize = 5;
        const cellSize = 70;
        const startX = -gridSize * cellSize / 2;
        const startY = -gridSize * cellSize / 2;
        
        const gx = Math.floor((localPos.x - startX) / cellSize);
        const gy = Math.floor((localPos.y - startY) / cellSize);
        
        // 检查是否在网格范围内
        if (gx < 0 || gx >= gridSize || gy < 0 || gy >= gridSize) return;
        
        console.log('[TestScene] Touch at grid:', gx, gy);
        
        // 放置炸弹
        const success = this.gameLogic.placeBomb(gx, gy);
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
        this.uiManager?.updateLevelInfo(state.level, state.wallCount);
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
        // 清除现有节点
        if (this.gameLayer) {
            this.gameLayer.removeAllChildren();
        }
        
        // 重新初始化
        this.initTestLevel();
        this.updateUI();
    }
}
