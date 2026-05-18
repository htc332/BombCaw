import { _decorator, Component, Node, Vec2, Vec3, EventTarget } from 'cc';

const { ccclass, property } = _decorator;

/**
 * GameLogic Component
 * 核心游戏逻辑 - 纯逻辑，无渲染
 * 职责：炸弹放置、爆炸计算、胜负判定
 */
@ccclass('GameLogic')
export class GameLogic extends Component {
    // 事件系统
    private eventTarget: EventTarget = new EventTarget();
    
    // 游戏状态
    private level: number = 1;
    private bombsLeft: number = 0;
    private score: number = 0;
    private gameActive: boolean = false;
    private gridSize: number = 5;
    
    // 游戏对象
    private walls: Map<string, any> = new Map();
    private bombs: Map<string, any> = new Map();
    private staticBombs: Map<string, any> = new Map();
    
    // 状态锁
    private processingExplosion: boolean = false;
    private pendingVictory: boolean = false;
    
    // 连击系统
    private comboCount: number = 0;
    private isInCombo: boolean = false;
    
    onLoad() {
        console.log('[GameLogic] Component loaded');
    }
    
    /**
     * 初始化关卡
     */
    initLevel(levelConfig: any) {
        this.gridSize = levelConfig.gridSize || 5;
        this.bombsLeft = levelConfig.bombs || 0;
        this.gameActive = true;
        this.processingExplosion = false;
        this.pendingVictory = false;
        
        this.walls.clear();
        this.bombs.clear();
        this.staticBombs.clear();
        
        // TODO: 初始化墙壁和静态炸弹
        
        this.emitEvent('level_started', {
            gridSize: this.gridSize,
            bombsLeft: this.bombsLeft,
            wallCount: this.walls.size
        });
        
        return this.getState();
    }
    
    /**
     * 获取游戏状态
     */
    getState() {
        return {
            level: this.level,
            score: this.score,
            bombsLeft: this.bombsLeft,
            gameActive: this.gameActive,
            gridSize: this.gridSize,
            wallCount: this.walls.size,
            bombCount: this.bombs.size
        };
    }
    
    /**
     * 添加分数
     */
    addScore(basePoints: number, reason: string) {
        this.score += basePoints;
        console.log('[Score]', reason, '+', basePoints, '=', this.score);
    }
    
    /**
     * 事件发射
     */
    emitEvent(eventName: string, data?: any) {
        this.eventTarget.emit(eventName, data);
    }
    
    /**
     * 事件监听
     */
    onEvent(eventName: string, callback: Function, target?: any) {
        this.eventTarget.on(eventName, callback, target);
    }
    
    /**
     * 放置炸弹
     */
    placeBomb(x: number, y: number): boolean {
        if (!this.gameActive || this.bombsLeft <= 0) return false;
        
        const key = `${x},${y}`;
        if (this.bombs.has(key) || this.walls.has(key)) return false;
        
        this.bombs.set(key, {
            x, y,
            evolution: 1,
            countdown: 3
        });
        
        this.bombsLeft--;
        
        this.emitEvent('bomb_placed', { x, y, bombsLeft: this.bombsLeft });
        
        return true;
    }
    
    /**
     * 触发爆炸
     */
    triggerExplosion(x: number, y: number) {
        // TODO: 实现爆炸逻辑
    }
    
    /**
     * 检查胜利条件
     */
    checkVictory(): boolean {
        // TODO: 实现胜利判定
        return false;
    }
}
