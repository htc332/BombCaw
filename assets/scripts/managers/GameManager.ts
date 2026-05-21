import { _decorator, Component, Node, director, Director, Vec3, Vec2, instantiate, Prefab, CCInteger, UITransform } from 'cc';
import { GameLogic } from '../core/GameLogic';
import { GridManager } from '../core/GridManager';
import { Bomb } from '../components/Bomb';
import { Wall } from '../components/Wall';

const { ccclass, property } = _decorator;

/**
 * GameManager Component
 * 游戏管理器
 * 职责：场景管理、对象池、游戏流程控制
 */
@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    gridNode: Node | null = null;
    
    @property(Node)
    bombContainer: Node | null = null;
    
    @property(Node)
    wallContainer: Node | null = null;
    
    @property(Prefab)
    bombPrefab: Prefab | null = null;
    
    @property(Prefab)
    wallPrefab: Prefab | null = null;
    
    @property(Prefab)
    staticBombPrefab: Prefab | null = null;
    
    @property(CCInteger)
    currentLevel: number = 1;
    
    // 核心逻辑
    private gameLogic: GameLogic | null = null;
    private gridManager: GridManager | null = null;
    
    // 对象池
    private bombPool: Node[] = [];
    private wallPool: Node[] = [];
    
    onLoad() {
        console.log('[GameManager] Loading...');
        
        // 获取核心组件
        this.gameLogic = this.getComponent(GameLogic);
        if (!this.gameLogic) {
            this.gameLogic = this.addComponent(GameLogic);
        }
        
        if (this.gridNode) {
            this.gridManager = this.gridNode.getComponent(GridManager);
        }
        
        // 监听游戏事件
        this.setupEventListeners();
    }
    
    start() {
        console.log('[GameManager] Starting...');
        this.startLevel(this.currentLevel);
    }
    
    /**
     * 设置事件监听
     */
    setupEventListeners() {
        if (!this.gameLogic) return;
        
        this.gameLogic.onEvent('level_started', this.onLevelStarted, this);
        this.gameLogic.onEvent('bomb_placed', this.onBombPlaced, this);
        this.gameLogic.onEvent('bomb_exploded', this.onBombExploded, this);
        this.gameLogic.onEvent('wall_damaged', this.onWallDamaged, this);
        this.gameLogic.onEvent('wall_destroyed', this.onWallDestroyed, this);
    }
    
    /**
     * 开始关卡
     */
    startLevel(level: number) {
        console.log('[GameManager] Starting level', level);
        
        // TODO: 加载关卡配置
        const levelConfig = {
            gridSize: 5,
            bombs: 3,
            walls: [
                { x: 1, y: 1, type: 'normal' },
                { x: 3, y: 2, type: 'elite' }
            ],
            staticBombs: [
                { x: 2, y: 2, evolution: 1 }
            ]
        };
        
        if (this.gameLogic) {
            this.gameLogic.initLevel(levelConfig);
        }
        
        // 创建游戏对象
        this.createWalls(levelConfig.walls);
        this.createStaticBombs(levelConfig.staticBombs);
    }
    
    /**
     * 创建墙壁
     */
    createWalls(walls: any[]) {
        if (!this.wallContainer || !this.wallPrefab) return;
        
        walls.forEach(wallData => {
            const wallNode = instantiate(this.wallPrefab!) as unknown as Node;
            if (!wallNode) return;
            
            const wall = wallNode.getComponent(Wall);
            
            if (wall) {
                wall.init(wallData.x, wallData.y, wallData.type, wallData.hp || 1);
            }
            
            // 设置位置
            if (this.gridManager) {
                const pos = this.gridManager.gridToWorld(wallData.x, wallData.y);
                wallNode.setPosition(pos);
            } else {
                wallNode.setPosition(new Vec3(wallData.x * 70, wallData.y * 70, 0));
            }
            
            if (this.wallContainer) {
                this.wallContainer.addChild(wallNode);
            }
        });
    }
    
    /**
     * 创建静态炸弹
     */
    createStaticBombs(bombs: any[]) {
        if (!this.bombContainer || !this.staticBombPrefab) return;
        
        bombs.forEach(bombData => {
            const bombNode = instantiate(this.staticBombPrefab!) as unknown as Node;
            if (!bombNode) return;
            
            const bomb = bombNode.getComponent(Bomb);
            
            if (bomb) {
                bomb.init(bombData.x, bombData.y, bombData.evolution, true);
            }
            
            if (this.gridManager) {
                const pos = this.gridManager.gridToWorld(bombData.x, bombData.y);
                bombNode.setPosition(pos);
            } else {
                bombNode.setPosition(new Vec3(bombData.x * 70, bombData.y * 70, 0));
            }
            
            if (this.bombContainer) {
                this.bombContainer.addChild(bombNode);
            }
        });
    }
    
    /**
     * 放置炸弹
     */
    placeBomb(gx: number, gy: number) {
        if (!this.gameLogic || !this.bombContainer || !this.bombPrefab) return;
        
        if (this.gameLogic.placeBomb(gx, gy)) {
            const bombNode = instantiate(this.bombPrefab!) as unknown as Node;
            if (!bombNode) return;
            
            const bomb = bombNode.getComponent(Bomb);
            
            if (bomb) {
                bomb.init(gx, gy, 1, false);
            }
            
            if (this.gridManager) {
                const pos = this.gridManager.gridToWorld(gx, gy);
                bombNode.setPosition(pos);
            } else {
                bombNode.setPosition(new Vec3(gx * 70, gy * 70, 0));
            }
            
            this.bombContainer.addChild(bombNode);
        }
    }
    
    // 事件回调
    onLevelStarted(data: any) {
        console.log('[GameManager] Level started:', data);
    }
    
    onBombPlaced(data: any) {
        console.log('[GameManager] Bomb placed:', data);
    }
    
    onBombExploded(data: any) {
        console.log('[GameManager] Bomb exploded:', data);
    }
    
    onWallDamaged(data: any) {
        console.log('[GameManager] Wall damaged:', data);
    }
    
    onWallDestroyed(data: any) {
        console.log('[GameManager] Wall destroyed:', data);
    }
}
