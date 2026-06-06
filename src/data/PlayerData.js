/**
 * Data/PlayerData.js
 * 玩家数据管理器
 * 管理玩家进度、分数、设置等
 */

class PlayerData {
  constructor() {
    this.storage = new Storage();
    this.cache = null; // 内存缓存
    this.dirty = false; // 是否有未保存的更改
  }

  /**
   * 获取玩家完整数据
   */
  getData() {
    if (this.cache) return this.cache;

    const keys = Constants.STORAGE_KEYS;
    this.cache = {
      // 用户信息（微信登录后填充）
      userInfo: this.storage.get(keys.PLAYER_DATA + '_user', null),

      // 关卡进度
      progress: {
        currentLevel: this.storage.get(keys.LEVEL_PROGRESS + '_current', 1),
        unlockedLevel: this.storage.get(keys.LEVEL_PROGRESS + '_unlocked', 1),
        completedLevels: this.storage.get(keys.LEVEL_PROGRESS + '_completed', [])
      },

      // 关卡分数记录 { level: { score, stars, bestScore } }
      levelScores: this.storage.get(keys.HIGH_SCORES, {}),

      // 总统计
      stats: {
        totalScore: this.storage.get(keys.PLAYER_DATA + '_total_score', 0),
        totalPlayTime: this.storage.get(keys.PLAYER_DATA + '_play_time', 0),
        totalGames: this.storage.get(keys.PLAYER_DATA + '_games', 0),
        bestChain: this.storage.get(keys.PLAYER_DATA + '_best_chain', 0)
      },

      // 设置
      settings: this.storage.get(keys.SETTINGS, {
        sound: true,
        music: true,
        vibrate: true
      }),

      // 广告相关
      adStats: {
        todayWatchCount: this.storage.get(keys.PLAYER_DATA + '_ad_today', 0),
        lastWatchDate: this.storage.get(keys.PLAYER_DATA + '_ad_date', ''),
        totalWatchCount: this.storage.get(keys.PLAYER_DATA + '_ad_total', 0)
      }
    };

    return this.cache;
  }

  /**
   * 保存数据到存储
   */
  save() {
    if (!this.dirty || !this.cache) return;

    const keys = Constants.STORAGE_KEYS;
    const data = this.cache;

    // 保存进度
    this.storage.set(keys.LEVEL_PROGRESS + '_current', data.progress.currentLevel);
    this.storage.set(keys.LEVEL_PROGRESS + '_unlocked', data.progress.unlockedLevel);
    this.storage.set(keys.LEVEL_PROGRESS + '_completed', data.progress.completedLevels);

    // 保存分数
    this.storage.set(keys.HIGH_SCORES, data.levelScores);

    // 保存统计
    this.storage.set(keys.PLAYER_DATA + '_total_score', data.stats.totalScore);
    this.storage.set(keys.PLAYER_DATA + '_play_time', data.stats.totalPlayTime);
    this.storage.set(keys.PLAYER_DATA + '_games', data.stats.totalGames);
    this.storage.set(keys.PLAYER_DATA + '_best_chain', data.stats.bestChain);

    // 保存设置
    this.storage.set(keys.SETTINGS, data.settings);

    // 保存广告统计
    this.storage.set(keys.PLAYER_DATA + '_ad_today', data.adStats.todayWatchCount);
    this.storage.set(keys.PLAYER_DATA + '_ad_date', data.adStats.lastWatchDate);
    this.storage.set(keys.PLAYER_DATA + '_ad_total', data.adStats.totalWatchCount);

    this.dirty = false;
    console.log('[PlayerData] Saved to storage');
  }

  /**
   * 保存关卡分数
   */
  saveLevelScore(level, score, stars = 0) {
    const data = this.getData();
    const existing = data.levelScores[level] || {};

    data.levelScores[level] = {
      score: Math.max(score, existing.score || 0),
      stars: Math.max(stars, existing.stars || 0),
      bestScore: Math.max(score, existing.bestScore || 0),
      lastPlayed: Date.now()
    };

    // 更新总分数
    data.stats.totalScore += score;
    data.stats.totalGames++;

    // 更新最高连锁（预留）
    // data.stats.bestChain = Math.max(chain, data.stats.bestChain);

    this.dirty = true;
    this.save();

    // 触发事件
    eventBus.emit(Constants.EVENTS.SCORE_CHANGE, { level, score, stars });
  }

  /**
   * 解锁关卡
   */
  unlockLevel(level) {
    const data = this.getData();
    if (level > data.progress.unlockedLevel) {
      data.progress.unlockedLevel = level;
      data.progress.currentLevel = level;

      if (!data.progress.completedLevels.includes(level - 1)) {
        data.progress.completedLevels.push(level - 1);
      }

      this.dirty = true;
      this.save();

      eventBus.emit(Constants.EVENTS.LEVEL_COMPLETE, { level });
    }
  }

  /**
   * 检查关卡是否解锁
   */
  isLevelUnlocked(level) {
    return level <= this.getData().progress.unlockedLevel;
  }

  /**
   * 获取关卡最佳分数
   */
  getLevelBestScore(level) {
    const scores = this.getData().levelScores[level];
    return scores ? scores.bestScore : 0;
  }

  /**
   * 更新设置
   */
  updateSettings(settings) {
    const data = this.getData();
    Object.assign(data.settings, settings);
    this.dirty = true;
    this.save();
  }

  /**
   * 获取设置
   */
  getSettings() {
    return this.getData().settings;
  }

  /**
   * 记录广告观看
   */
  recordAdWatch() {
    const data = this.getData();
    const today = new Date().toDateString();

    if (data.adStats.lastWatchDate !== today) {
      data.adStats.todayWatchCount = 0;
      data.adStats.lastWatchDate = today;
    }

    data.adStats.todayWatchCount++;
    data.adStats.totalWatchCount++;

    this.dirty = true;
    this.save();
  }

  /**
   * 获取今日广告观看次数
   */
  getTodayAdCount() {
    const data = this.getData();
    const today = new Date().toDateString();
    if (data.adStats.lastWatchDate !== today) {
      return 0;
    }
    return data.adStats.todayWatchCount;
  }

  /**
   * 设置用户信息（微信登录）
   */
  setUserInfo(userInfo) {
    const data = this.getData();
    data.userInfo = userInfo;
    this.dirty = true;
    this.save();
  }

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return this.getData().userInfo;
  }

  /**
   * 重置所有数据（调试用）
   */
  reset() {
    this.cache = null;
    this.dirty = false;
    // 保留设置，清除进度
    const settings = this.getSettings();
    this.storage.clear();
    this.storage.set(Constants.STORAGE_KEYS.SETTINGS, settings);
  }
}

// 单例
let instance = null;
PlayerData.getInstance = function() {
  if (!instance) {
    instance = new PlayerData();
  }
  return instance;
};

// 导出到全局
GameGlobal.PlayerData = PlayerData;
GameGlobal.playerData = PlayerData.getInstance();
