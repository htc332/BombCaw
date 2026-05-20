import { _decorator, Component, JsonAsset, assetManager, Asset, resources } from 'cc';

const { ccclass, property } = _decorator;

/**
 * LevelData
 * 关卡数据结构
 */
export interface LevelData {
    id: number;
    name: string;
    gridSize: number;
    bombs: number;
    walls: WallData[];
    staticBombs: StaticBombData[];
    starThresholds: number[]; // 三星阈值 [1星, 2星, 3星]
}

export interface WallData {
    x: number;
    y: number;
    type: 'normal' | 'elite';
    hp?: number;
}

export interface StaticBombData {
    x: number;
    y: number;
    evolution: number;
}

/**
 * LevelManager
 * 关卡系统管理器
 * 
 * 职责：
 * 1. 加载关卡配置（JSON）
 * 2. 管理关卡进度
 * 3. 计算星级评分
 * 4. 提供关卡数据给 GameLogic
 */
@ccclass('LevelManager')
export class LevelManager extends Component {
    
    // 关卡配置路径
    private levelConfigPath: string = 'levels';
    
    // 当前关卡
    private currentLevelId: number = 1;
    
    // 关卡数据缓存
    private levelDataCache: Map<number, LevelData> = new Map();
    
    // 玩家进度
    private playerProgress: {
        unlockedLevel: number;
        levelStars: Map<number, number>;
        levelScores: Map<number, number>;
    } = {
        unlockedLevel: 1,
        levelStars: new Map(),
        levelScores: new Map()
    };
    
    onLoad() {
        console.log('[LevelManager] Loading...');
        this.loadPlayerProgress();
    }
    
    /**
     * 加载关卡配置
     */
    async loadLevelConfig(levelId: number): Promise<LevelData | null> {
        // 检查缓存
        if (this.levelDataCache.has(levelId)) {
            return this.levelDataCache.get(levelId)!;
        }
        
        return new Promise((resolve) => {
            const path = `${this.levelConfigPath}/level_${levelId}`;
            
            resources.load(path, JsonAsset, (err, asset) => {
                if (err) {
                    console.error(`[LevelManager] Failed to load level ${levelId}:`, err);
                    resolve(null);
                    return;
                }
                
                const data = asset.json as LevelData;
                this.levelDataCache.set(levelId, data);
                console.log(`[LevelManager] Level ${levelId} loaded:`, data.name);
                resolve(data);
            });
        });
    }
    
    /**
     * 获取关卡数据（同步，需先加载）
     */
    getLevelData(levelId: number): LevelData | null {
        return this.levelDataCache.get(levelId) || null;
    }
    
    /**
     * 获取当前关卡
     */
    getCurrentLevel(): number {
        return this.currentLevelId;
    }
    
    /**
     * 设置当前关卡
     */
    setCurrentLevel(levelId: number) {
        this.currentLevelId = levelId;
    }
    
    /**
     * 计算星级
     */
    calculateStars(levelId: number, score: number): number {
        const levelData = this.getLevelData(levelId);
        if (!levelData) return 0;
        
        const thresholds = levelData.starThresholds;
        if (!thresholds || thresholds.length === 0) return 1;
        
        let stars = 0;
        for (let i = 0; i < thresholds.length; i++) {
            if (score >= thresholds[i]) {
                stars = i + 1;
            }
        }
        
        return stars;
    }
    
    /**
     * 完成关卡
     */
    completeLevel(levelId: number, score: number) {
        const stars = this.calculateStars(levelId, score);
        
        // 更新最高分
        const currentBest = this.playerProgress.levelScores.get(levelId) || 0;
        if (score > currentBest) {
            this.playerProgress.levelScores.set(levelId, score);
        }
        
        // 更新最高星级
        const currentStars = this.playerProgress.levelStars.get(levelId) || 0;
        if (stars > currentStars) {
            this.playerProgress.levelStars.set(levelId, stars);
        }
        
        // 解锁下一关
        if (levelId >= this.playerProgress.unlockedLevel) {
            this.playerProgress.unlockedLevel = levelId + 1;
        }
        
        // 保存进度
        this.savePlayerProgress();
        
        console.log(`[LevelManager] Level ${levelId} completed. Score: ${score}, Stars: ${stars}`);
        
        return { stars, isNewBest: score > currentBest };
    }
    
    /**
     * 获取解锁的关卡数
     */
    getUnlockedLevel(): number {
        return this.playerProgress.unlockedLevel;
    }
    
    /**
     * 获取关卡星级
     */
    getLevelStars(levelId: number): number {
        return this.playerProgress.levelStars.get(levelId) || 0;
    }
    
    /**
     * 获取关卡最高分
     */
    getLevelBestScore(levelId: number): number {
        return this.playerProgress.levelScores.get(levelId) || 0;
    }
    
    /**
     * 检查关卡是否解锁
     */
    isLevelUnlocked(levelId: number): boolean {
        return levelId <= this.playerProgress.unlockedLevel;
    }
    
    /**
     * 保存玩家进度
     */
    private savePlayerProgress() {
        const data = {
            unlockedLevel: this.playerProgress.unlockedLevel,
            levelStars: Array.from(this.playerProgress.levelStars.entries()),
            levelScores: Array.from(this.playerProgress.levelScores.entries())
        };
        
        try {
            localStorage.setItem('bomb_wall_progress', JSON.stringify(data));
        } catch (e) {
            console.error('[LevelManager] Failed to save progress:', e);
        }
    }
    
    /**
     * 加载玩家进度
     */
    private loadPlayerProgress() {
        try {
            const data = localStorage.getItem('bomb_wall_progress');
            if (data) {
                const parsed = JSON.parse(data);
                this.playerProgress.unlockedLevel = parsed.unlockedLevel || 1;
                this.playerProgress.levelStars = new Map(parsed.levelStars || []);
                this.playerProgress.levelScores = new Map(parsed.levelScores || []);
                console.log('[LevelManager] Progress loaded:', this.playerProgress);
            }
        } catch (e) {
            console.error('[LevelManager] Failed to load progress:', e);
        }
    }
    
    /**
     * 重置所有进度
     */
    resetProgress() {
        this.playerProgress = {
            unlockedLevel: 1,
            levelStars: new Map(),
            levelScores: new Map()
        };
        this.savePlayerProgress();
        console.log('[LevelManager] Progress reset');
    }
}
