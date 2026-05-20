import { _decorator, Component, Node, Vec2, Vec3, EventTarget, Sprite, instantiate, Prefab } from 'cc';
import { AnimationManager } from '../managers/AnimationManager';

const { ccclass, property } = _decorator;

/**
 * GameLogic Component
 * 核心游戏逻辑 - 纯逻辑 + 动画集成
 * 职责：炸弹放置、爆炸计算、胜负判定、动画触发
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
    
    // 动画管理器
    private animManager: AnimationManager | null = null;
    
    // 节点预制体
    @property(Prefab)
    bombPrefab: Prefab | null = null;
    
    @property(Prefab)
    wallPrefab: Prefab | null = null;
    
    @property(Node)
    gameLayer: Node | null = null;
    
    onLoad() {
        console.log('[GameLogic] Component loaded');
        this.animManager = this.node.getComponent(AnimationManager);
    }
    
    /**
     * 注册事件监听
     */
    onEvent(eventName: string, callback: Function, target?: any) {
        this.eventTarget.on(eventName, callback, target);
    }
    
    /**
     * 触发事件
     */
    emitEvent(eventName: string, data?: any) {
        this.eventTarget.emit(eventName, data);
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
        
        // 初始化墙壁
        if (levelConfig.walls) {
            levelConfig.walls.forEach((wall: any) => {
                this.createWall(wall.x, wall.y, wall.type);
            });
        }
        
        // 初始化静态炸弹
        if (levelConfig.staticBombs) {
            levelConfig.staticBombs.forEach((bomb: any) => {
                this.createStaticBomb(bomb.x, bomb.y, bomb.level);
            });
        }
        
        this.emitEvent('level_started', {
            gridSize: this.gridSize,
            bombsLeft: this.bombsLeft,
            wallCount: this.walls.size
        });
        
        return this.getState();
    }
    
    /**
     * 创建墙壁
     */
    private createWall(x: number, y: number, type: string = 'normal') {
        const key = `${x},${y}`;
        const wallNode = instantiate(this.wallPrefab);
        
        if (wallNode && this.gameLayer) {
            wallNode.name = `Wall_${x}_${y}`;
            this.gameLayer.addChild(wallNode);
            
            // 设置位置
            const pos = this.gridToWorld(x, y);
            wallNode.setPosition(pos);
            
            // 保存墙壁数据
            this.walls.set(key, {
                x, y,
                type,
                hp: type === 'elite' ? 2 : 1,
                maxHp: type === 'elite' ? 2 : 1,
                node: wallNode
            });
            
            // 播放待机动画
            this.animManager?.playWallIdle(wallNode, type);
        }
    }
    
    /**
     * 创建静态炸弹
     */
    private createStaticBomb(x: number, y: number, level: number = 1) {
        const key = `${x},${y}`;
        const bombNode = instantiate(this.bombPrefab);
        
        if (bombNode && this.gameLayer) {
            bombNode.name = `StaticBomb_${x}_${y}`;
            this.gameLayer.addChild(bombNode);
            
            const pos = this.gridToWorld(x, y);
            bombNode.setPosition(pos);
            
            this.staticBombs.set(key, {
                x, y,
                level,
                isActive: false,
                node: bombNode
            });
        }
    }
    
    /**
     * 网格坐标转世界坐标
     */
    private gridToWorld(gx: number, gy: number): Vec3 {
        // 根据网格大小和屏幕尺寸计算
        const cellSize = 70; // 格子大小
        const startX = -this.gridSize * cellSize / 2;
        const startY = -this.gridSize * cellSize / 2;
        
        return new Vec3(
            startX + gx * cellSize + cellSize / 2,
            startY + gy * cellSize + cellSize / 2,
            0
        );
    }
    
    /**
     * 放置炸弹
     */
    placeBomb(x: number, y: number): boolean {
        if (!this.gameActive || this.bombsLeft <= 0) return false;
        
        const key = `${x},${y}`;
        if (this.bombs.has(key) || this.walls.has(key)) return false;
        
        // 创建炸弹节点
        const bombNode = instantiate(this.bombPrefab);
        if (bombNode && this.gameLayer) {
            bombNode.name = `Bomb_${x}_${y}`;
            this.gameLayer.addChild(bombNode);
            
            const pos = this.gridToWorld(x, y);
            bombNode.setPosition(pos);
            
            // 保存炸弹数据
            const bombData = {
                x, y,
                evolution: 1,
                countdown: 3,
                node: bombNode,
                isStatic: false
            };
            
            this.bombs.set(key, bombData);
            this.bombsLeft--;
            
            // 播放炸弹待机动画（倒计时驱动）
            this.animManager?.playBombIdle(bombNode, 1, 3);
            
            // 启动倒计时
            this.scheduleOnce(() => {
                this.explodeBomb(key);
            }, 3);
            
            this.emitEvent('bomb_placed', { x, y, bombsLeft: this.bombsLeft });
            
            return true;
        }
        
        return false;
    }
    
    /**
     * 炸弹爆炸
     */
    private explodeBomb(key: string) {
        const bomb = this.bombs.get(key);
        if (!bomb) return;
        
        console.log(`[GameLogic] Bomb exploded at ${bomb.x}, ${bomb.y}`);
        
        // 计算爆炸范围
        const destroyed = this.calculateExplosion(bomb.x, bomb.y, bomb.evolution);
        
        // 处理摧毁的墙壁
        destroyed.forEach((item: any) => {
            this.destroyWall(item.x, item.y);
        });
        
        // 移除炸弹
        if (bomb.node) {
            bomb.node.destroy();
        }
        this.bombs.delete(key);
        
        // 检查胜利
        this.checkVictory();
        
        this.emitEvent('bomb_exploded', {
            x: bomb.x,
            y: bomb.y,
            evolution: bomb.evolution,
            destroyed
        });
    }
    
    /**
     * 计算爆炸范围
     */
    private calculateExplosion(x: number, y: number, evolution: number): any[] {
        const destroyed: any[] = [];
        const range = this.getExplosionRange(evolution);
        
        // 十字方向
        const directions = [
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 }
        ];
        
        // 对角方向（Lv1+）
        if (evolution >= 1) {
            directions.push(
                { dx: 1, dy: 1 }, { dx: 1, dy: -1 },
                { dx: -1, dy: 1 }, { dx: -1, dy: -1 }
            );
        }
        
        directions.forEach(dir => {
            for (let i = 1; i <= range; i++) {
                const nx = x + dir.dx * i;
                const ny = y + dir.dy * i;
                
                if (nx < 0 || nx >= this.gridSize || ny < 0 || ny >= this.gridSize) break;
                
                const key = `${nx},${ny}`;
                const wall = this.walls.get(key);
                
                if (wall) {
                    destroyed.push({ x: nx, y: ny, type: wall.type });
                    break; // 墙壁阻挡爆炸
                }
                
                // 检查是否激活静态炸弹
                const staticBomb = this.staticBombs.get(key);
                if (staticBomb && !staticBomb.isActive) {
                    this.activateStaticBomb(key);
                }
            }
        });
        
        return destroyed;
    }
    
    /**
     * 获取爆炸范围
     */
    private getExplosionRange(evolution: number): number {
        // Lv0: 1格, Lv1: 1格(八方向), Lv2: 2格, Lv3: 2格(八方向)
        return evolution >= 2 ? 2 : 1;
    }
    
    /**
     * 摧毁墙壁
     */
    private destroyWall(x: number, y: number) {
        const key = `${x},${y}`;
        const wall = this.walls.get(key);
        
        if (!wall) return;
        
        wall.hp--;
        
        if (wall.hp <= 0) {
            // 播放死亡动画
            this.animManager?.playDeathAnimation(wall.node, wall.type, () => {
                // 动画完成后销毁节点
                wall.node.destroy();
                this.walls.delete(key);
                
                // 添加分数
                this.addScore(wall.type === 'elite' ? 10 : 5, `${wall.type}_destroyed`);
            });
        } else {
            // 精英鼠破损过渡
            if (wall.type === 'elite') {
                this.animManager?.playBreakTransition(wall.node, () => {
                    // 过渡到破损待机
                });
            }
        }
    }
    
    /**
     * 激活静态炸弹
     */
    private activateStaticBomb(key: string) {
        const bomb = this.staticBombs.get(key);
        if (!bomb || bomb.isActive) return;
        
        bomb.isActive = true;
        
        // 播放激活动画
        this.animManager?.playBombIdle(bomb.node, bomb.level, 3);
        
        // 启动倒计时
        this.scheduleOnce(() => {
            this.explodeStaticBomb(key);
        }, 3);
        
        this.emitEvent('static_bomb_activated', { x: bomb.x, y: bomb.y });
    }
    
    /**
     * 静态炸弹爆炸
     */
    private explodeStaticBomb(key: string) {
        const bomb = this.staticBombs.get(key);
        if (!bomb) return;
        
        // 类似普通炸弹爆炸
        const destroyed = this.calculateExplosion(bomb.x, bomb.y, bomb.level);
        
        destroyed.forEach((item: any) => {
            this.destroyWall(item.x, item.y);
        });
        
        if (bomb.node) {
            bomb.node.destroy();
        }
        this.staticBombs.delete(key);
        
        this.checkVictory();
    }
    
    /**
     * 检查胜利条件
     */
    checkVictory(): boolean {
        if (this.walls.size === 0) {
            this.pendingVictory = true;
            
            // 延迟结算，等待动画完成
            this.scheduleOnce(() => {
                if (this.pendingVictory) {
                    this.gameActive = false;
                    this.emitEvent('level_complete', {
                        level: this.level,
                        score: this.score,
                        stars: this.calculateStars()
                    });
                }
            }, 2); // 等待2秒，让死亡动画播放
            
            return true;
        }
        
        // 检查失败条件：炸弹用完且没有待爆炸弹
        if (this.bombsLeft <= 0 && this.bombs.size === 0) {
            // 检查是否还有未激活的静态炸弹
            let hasInactiveStaticBombs = false;
            this.staticBombs.forEach((bomb) => {
                if (!bomb.isActive) hasInactiveStaticBombs = true;
            });
            
            if (!hasInactiveStaticBombs) {
                this.gameActive = false;
                this.emitEvent('game_over', {
                    level: this.level,
                    score: this.score
                });
                return false;
            }
        }
        
        return false;
    }
    
    /**
     * 计算星级
     */
    private calculateStars(): number {
        if (this.score >= 500) return 3;
        if (this.score >= 300) return 2;
        return 1;
    }
    
    /**
     * 添加分数
     */
    addScore(basePoints: number, reason: string) {
        this.score += basePoints;
        console.log('[Score]', reason, '+', basePoints, '=', this.score);
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
}
