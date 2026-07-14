/**
 * Core/LevelSystem.js
 * 关卡系统 - 管理关卡解锁、进度
 * [v0.9.0] 添加动态难度调整（DDA）
 */

// 使用全局变量（微信小游戏 require 可能返回 undefined）
const LEVELS = (typeof GameGlobal !== 'undefined' && GameGlobal.LEVELS) ? GameGlobal.LEVELS : require('../data/LevelData.js');

class LevelSystem {
  constructor(storage) {
    this.storage = storage;
    this.maxLevels = 100; // [v0.9.0] 扩展到100关
    this.currentLevel = 1;
    this.unlockedLevels = new Set([1]);
    
    this.loadProgress();
  }

  // ========== 进度管理 ==========

  loadProgress() {
    const data = this.storage.get('level_progress');
    if (data) {
      this.currentLevel = data.currentLevel || 1;
      this.unlockedLevels = new Set(data.unlockedLevels || [1]);
    }
  }

  saveProgress() {
    this.storage.set('level_progress', {
      currentLevel: this.currentLevel,
      unlockedLevels: Array.from(this.unlockedLevels),
      lastUpdated: Date.now()
    });
  }

  // ========== 动态难度调整（DDA）==========

  /**
   * [v0.9.0] 根据玩家表现计算下一关
   * @param {number} currentLevel - 当前关卡
   * @param {number} remainingScore - 剩余积分
   * @returns {number} 下一关编号
   */
  calculateNextLevel(currentLevel, remainingScore) {
    // 根据剩余积分决定跳关
    if (remainingScore >= 10) {
      // 完美：跳3关
      return Math.min(this.maxLevels, currentLevel + 3);
    } else if (remainingScore >= 7) {
      // 良好：跳2关
      return Math.min(this.maxLevels, currentLevel + 2);
    } else if (remainingScore >= 4) {
      // 一般：跳1关
      return Math.min(this.maxLevels, currentLevel + 1);
    } else if (remainingScore >= 2) {
      // 危险：正常下一关
      return Math.min(this.maxLevels, currentLevel + 1);
    } else {
      // 濒死：回退到保底关（当前阶段的积分关）
      return this.getFallbackLevel(currentLevel);
    }
  }

  /**
   * [v0.9.0] 获取保底关编号
   * 保底关 = 当前阶段的第3关（积分关）
   */
  getFallbackLevel(currentLevel) {
    const phase = Math.floor((currentLevel - 1) / 10);
    return phase * 10 + 3;
  }

  /**
   * [v0.9.0] 计算关卡理论参数
   */
  calculateTheoryParams(level) {
    const baseMin = 2;
    const baseMax = 8;
    const deltaMin = 0.3;
    const deltaMax = 0.5;

    const minX = baseMin + (level - 1) * deltaMin;
    const maxX = baseMax + (level - 1) * deltaMax;

    // 根据关卡类型调整
    const type = this.getLevelType(level);
    const multipliers = {
      tutorial: 1.5,
      score: 2.0,
      challenge: 1.2,
      easter_egg: 3.0,
      normal: 1.5
    };

    return {
      minX: Math.round(minX * 10) / 10,
      maxX: Math.round(maxX * 10) / 10,
      targetReward: Math.round(maxX * (multipliers[type] || 1.5)),
      type: type
    };
  }

  /**
   * [v0.9.0] 获取关卡类型
   */
  getLevelType(level) {
    const lastDigit = level % 10;
    if (lastDigit === 1 || lastDigit === 2) return 'tutorial';
    if (lastDigit === 3) return 'score';
    if (lastDigit === 6) return 'challenge';
    if (lastDigit === 0) return 'easter_egg';
    return 'normal';
  }

  // ========== 关卡操作 ==========

  /**
   * 获取关卡配置
   */
  getLevelConfig(level) {
    if (level <= 18) {
      return LEVELS[level]; // 从 LevelData.js 加载
    }
    // [v0.9.0] 动态生成19-100关
    return this.generateLevel(level);
  }

  /**
   * [v0.9.0] 动态生成关卡（19-100关）
   */
  generateLevel(level) {
    const theory = this.calculateTheoryParams(level);
    const gridSize = Math.min(5 + Math.floor(level / 10), 9);
    const half = Math.floor(gridSize / 2);

    // 根据难度计算敌人数量
    const enemyCount = Math.floor(theory.targetReward / 2);
    const walls = [];
    const staticBombs = [];
    const used = new Set();

    // 生成墙壁鼠
    let placed = 0;
    while (placed < enemyCount) {
      const x = Math.floor(Math.random() * gridSize) - half;
      const y = Math.floor(Math.random() * gridSize) - half;
      
      if (x === 0 && y === 0) continue;
      
      const key = `${x},${y}`;
      if (used.has(key)) continue;
      
      used.add(key);
      
      // 根据关卡进度决定敌人类型
      let type = 'wall';
      if (level >= 11 && Math.random() < 0.3) type = 'strong';
      if (level >= 21 && Math.random() < 0.2) type = 'ghost';
      
      walls.push({ x, y, type });
      placed++;
    }

    // 生成静态炸弹（20%概率）
    if (level >= 5 && Math.random() < 0.3) {
      const bombCount = Math.floor(level / 10) + 1;
      let bombPlaced = 0;
      while (bombPlaced < bombCount) {
        const x = Math.floor(Math.random() * gridSize) - half;
        const y = Math.floor(Math.random() * gridSize) - half;
        
        if (x === 0 && y === 0) continue;
        
        const key = `${x},${y}`;
        if (used.has(key)) continue;
        
        used.add(key);
        staticBombs.push({ x, y, evolution: 0 });
        bombPlaced++;
      }
    }

    return {
      gridSize,
      hint: `第${level}关：${theory.type === 'tutorial' ? '教学' : theory.type === 'score' ? '积分' : theory.type === 'challenge' ? '挑战' : theory.type === 'easter_egg' ? '彩蛋' : '进阶'}关`,
      walls,
      staticBombs
    };
  }

  /**
   * 检查关卡是否已解锁
   */
  isUnlocked(level) {
    return this.unlockedLevels.has(level);
  }

  /**
   * 解锁下一关
   */
  unlockNext(currentLevel) {
    const next = currentLevel + 1;
    if (next <= this.maxLevels && !this.unlockedLevels.has(next)) {
      this.unlockedLevels.add(next);
      this.saveProgress();
      return true;
    }
    return false;
  }

  /**
   * 设置当前关卡
   */
  setCurrentLevel(level) {
    if (this.isUnlocked(level)) {
      this.currentLevel = level;
      this.saveProgress();
      return true;
    }
    return false;
  }

  /**
   * [v0.9.0] 完成关卡（支持DDA）
   */
  completeLevel(level, score) {
    // 计算下一关（动态难度调整）
    const nextLevel = this.calculateNextLevel(level, score);
    
    // 解锁下一关
    this.unlockNext(level);
    
    // 记录最高分
    const key = `level_${level}_best`;
    const currentBest = this.storage.get(key) || 0;
    if (score > currentBest) {
      this.storage.set(key, score);
    }

    // 总分数
    const totalScore = this.storage.get('total_score') || 0;
    this.storage.set('total_score', totalScore + score);

    this.saveProgress();
    
    return nextLevel;
  }

  // ========== 关卡列表 ==========

  /**
   * 获取所有关卡信息（用于关卡选择界面）
   */
  getLevelList() {
    const list = [];
    for (let i = 1; i <= this.maxLevels; i++) {
      list.push({
        level: i,
        unlocked: this.isUnlocked(i),
        bestScore: this.storage.get(`level_${i}_best`) || 0,
        current: i === this.currentLevel
      });
    }
    return list;
  }

  // ========== 无尽模式（保留兼容）==========

  generateInfiniteLevel(level) {
    return this.generateLevel(level);
  }
}

// 导出到微信小游戏全局
GameGlobal.LevelSystem = LevelSystem;
