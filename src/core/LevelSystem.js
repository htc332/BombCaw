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
    this.maxLevels = 500; // [v1.0] 扩展到500关
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
   * [v1.0] 支持200关手工配置 + 200关后肉鸽生成
   */
  getLevelConfig(level) {
    // 1-200关：从 LevelData.js 加载手工配置
    if (level <= 200 && LEVELS[level]) {
      return LEVELS[level];
    }
    
    // 201-300关：半配置（关键节点手工设计，中间模板生成）
    if (level <= 300) {
      if (LEVELS[level]) {
        return LEVELS[level]; // 关键节点有关工配置
      }
      return this.generateFromTemplate(level);
    }
    
    // 301+关：纯肉鸽生成
    return this.roguelikeGenerate(level);
  }

  /**
   * [v1.0] 从模板生成关卡（201-300关）
   */
  generateFromTemplate(level) {
    const gridSize = getGridSize(level);
    const wallRatios = getWallRatios(level);
    const staticConfig = getStaticBombConfig(level);
    
    // 根据关卡类型选择模板
    const isConsume = isConsumeLevel(level);
    const template = this.selectTemplate(level, isConsume);
    
    return this.fillTemplate(template, {
      level,
      gridSize,
      wallRatios,
      staticConfig,
      isConsume
    });
  }

  /**
   * [v1.0] 选择关卡模板
   */
  selectTemplate(level, isConsume) {
    const templates = ['cross_chain', 'domino', 'symmetric', 'maze', 'efficiency', 'precision'];
    
    // 消耗关优先使用效率模板
    if (isConsume) {
      return 'efficiency';
    }
    
    // 根据关卡进度选择模板
    const index = (level - 1) % templates.length;
    return templates[index];
  }

  /**
   * [v1.0] 填充模板
   */
  fillTemplate(template, params) {
    const { gridSize, wallRatios, staticConfig, isConsume } = params;
    const half = Math.floor(gridSize / 2);
    
    // 基础墙壁数量
    const baseWallCount = isConsume ? 12 : 8;
    const wallCount = Math.min(baseWallCount + Math.floor(params.level / 10), gridSize * gridSize - 1);
    
    const walls = [];
    const staticBombs = [];
    const used = new Set();

    // 生成墙壁鼠
    let placed = 0;
    while (placed < wallCount) {
      const x = Math.floor(Math.random() * gridSize) - half;
      const y = Math.floor(Math.random() * gridSize) - half;
      
      if (x === 0 && y === 0) continue;
      
      const key = `${x},${y}`;
      if (used.has(key)) continue;
      
      used.add(key);
      
      // 根据比例选择墙壁类型
      const rand = Math.random();
      let type = 'normal';
      if (rand < wallRatios.strong) type = 'strong';
      else if (rand < wallRatios.strong + wallRatios.ghost) type = 'ghost';
      else if (rand < wallRatios.strong + wallRatios.ghost + wallRatios.bomb) type = 'bomb';
      
      walls.push({ x, y, type });
      placed++;
    }

    // 生成静态炸弹
    if (Math.random() < staticConfig.chance) {
      const bombCount = Math.min(staticConfig.maxCount, Math.floor(params.level / 10) + 1);
      let bombPlaced = 0;
      while (bombPlaced < bombCount) {
        const x = Math.floor(Math.random() * gridSize) - half;
        const y = Math.floor(Math.random() * gridSize) - half;
        
        if (x === 0 && y === 0) continue;
        
        const key = `${x},${y}`;
        if (used.has(key)) continue;
        
        used.add(key);
        
        // 随机选择静态炸弹类型
        const evolution = staticConfig.types[Math.floor(Math.random() * staticConfig.types.length)];
        staticBombs.push({ x, y, evolution });
        bombPlaced++;
      }
    }

    return {
      gridSize,
      type: isConsume ? 'consume' : 'normal',
      isConsume,
      hint: `第${params.level}关：${isConsume ? '精打细算每一颗炸弹！' : '消灭所有老鼠！'}`,
      walls,
      staticBombs
    };
  }

  /**
   * [v1.0] 肉鸽生成关卡（301+关）
   */
  roguelikeGenerate(level) {
    // 基于玩家技能的动态难度调整
    const playerSkill = this.getPlayerSkill();
    const difficulty = this.calculateDifficulty(level, playerSkill);
    
    return this.generateFromTemplate(level, difficulty);
  }

  /**
   * [v1.0] 获取玩家技能评级（0-1）
   */
  getPlayerSkill() {
    // 基于历史通关数据计算
    const history = [];
    for (let i = 1; i <= Math.min(this.currentLevel, 50); i++) {
      const best = this.storage.get(`level_${i}_best`) || 0;
      if (best > 0) {
        history.push(best);
      }
    }
    
    if (history.length === 0) return 0.5;
    
    const avgScore = history.reduce((a, b) => a + b, 0) / history.length;
    // 平均分数越高，技能评级越高
    return Math.min(1, avgScore / 15);
  }

  /**
   * [v1.0] 计算动态难度
   */
  calculateDifficulty(level, playerSkill) {
    const baseDifficulty = level / 10;
    const ddaMultiplier = 0.7 + playerSkill * 0.6; // 0.7-1.3
    
    return {
      wallCountMultiplier: ddaMultiplier,
      staticBombMultiplier: 0.8 + playerSkill * 0.4,
      isConsumeLevel: isConsumeLevel(level)
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
   * [v1.0] 完成关卡（支持跳关逻辑）
   * 根据剩余积分决定跳关数量
   */
  completeLevel(level, score) {
    let nextLevel;
    
    if (level === 1) {
      // 第1关结束后，从2-5关随机选择
      nextLevel = Math.floor(Math.random() * 4) + 2;
    } else {
      // 根据剩余积分决定跳关
      nextLevel = this.calculateNextLevel(level, score);
    }
    
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
