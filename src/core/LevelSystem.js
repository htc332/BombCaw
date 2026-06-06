/**
 * Core/LevelSystem.js
 * 关卡系统 - 管理关卡解锁、进度
 */

// 使用全局变量（微信小游戏 require 可能返回 undefined）
const LEVELS = (typeof GameGlobal !== 'undefined' && GameGlobal.LEVELS) ? GameGlobal.LEVELS : require('../data/LevelData.js');

class LevelSystem {
  constructor(storage) {
    this.storage = storage;
    this.maxLevels = 18;
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

  // ========== 关卡操作 ==========

  /**
   * 获取关卡配置
   */
  getLevelConfig(level) {
    if (level <= 18) {
      return LEVELS[level]; // 从 LevelData.js 加载
    }
    // 无尽模式
    return this.generateInfiniteLevel(level);
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
   * 完成关卡
   */
  completeLevel(level, score) {
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

  // ========== 无尽模式 ==========

  generateInfiniteLevel(level) {
    const size = level < 25 ? 7 : 9;
    const bombs = 5 + Math.floor(level / 3);
    const wallCount = 8 + level;
    
    return {
      gridSize: size,
      bombs: bombs,
      hint: `第${level}关：无尽挑战`,
      walls: this.generateRandomWalls(size, wallCount)
    };
  }

  generateRandomWalls(size, count) {
    const walls = [];
    const half = Math.floor(size / 2);
    const used = new Set();
    
    let placed = 0;
    while (placed < count) {
      const x = Math.floor(Math.random() * size) - half;
      const y = Math.floor(Math.random() * size) - half;
      
      if (x === 0 && y === 0) continue;
      
      const key = `${x},${y}`;
      if (used.has(key)) continue;
      
      used.add(key);
      const r = Math.random();
      let type = 'normal';
      let color = null;
      
      if (r < 0.4) type = 'normal';
      else if (r < 0.7) type = 'strong';
      else if (r < 0.85) { type = 'bomb'; color = 'yellow'; }
      else { type = 'bomb'; color = 'red'; }
      
      walls.push({ x, y, type, color });
      placed++;
    }
    
    return walls;
  }
}

// 导出到微信小游戏全局
GameGlobal.LevelSystem = LevelSystem;
