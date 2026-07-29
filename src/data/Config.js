/**
 * Data/Config.js
 * 游戏配置中心
 * 集中管理所有游戏参数
 */

class Config {
  constructor() {
    this.data = {};
    this.loadDefaults();
  }

  /**
   * 加载默认配置
   */
  loadDefaults() {
    this.data = {
      // 游戏基础
      game: {
        name: Constants.GAME_NAME,
        version: Constants.VERSION,
        maxLevels: 100,
        defaultGridSize: Constants.DEFAULT_GRID_SIZE
      },

      // 布局配置
      layout: Constants.LAYOUT,

      // 格子配置
      cell: Constants.CELL,

      // 精灵图缩放
      spriteScale: Constants.SPRITE_SCALE,

      // 广告配置
      ad: Constants.AD,

      // 分享配置
      share: Constants.SHARE,

      // 动画参数
      animation: Constants.ANIMATION,

      // 难度曲线（随关卡递增）
      difficulty: {
        bombCountBase: 2,        // 基础炸弹数
        bombCountGrowth: 0.5,    // 每关增长
        wallCountBase: 4,        // 基础墙壁数
        wallCountGrowth: 0.8,    // 每关增长
        staticBombChance: 0.3,   // 静态炸弹出现概率
        strongWallChance: 0.2    // 加固墙出现概率
      },

      // 炸弹类型定义（v0.8.0 新计分系统）
      bombTypes: [
        { level: 1, name: '白色炸弹牛', cost: 2, evolution: 0, color: '#FFFFFF' },
        { level: 2, name: '蓝色炸弹牛', cost: 3, evolution: 1, color: '#5BA3F5' },
        { level: 3, name: '紫色炸弹牛', cost: 4, evolution: 2, color: '#C084FC' },
        { level: 4, name: '红色炸弹牛', cost: 5, evolution: 3, color: '#FF4444' }
      ],

      // 分数系统（v0.8.0 新计分系统）
      scoring: {
        destroyWall: 1,         // 炸毁任何老鼠墙 +1分
        startScore: 10,         // 每局初始分数
        staticBombActivate: 0   // 静态炸弹激活不再额外加分
      }
    };
  }

  /**
   * 获取配置值
   */
  get(path, defaultValue = null) {
    const keys = path.split('.');
    let value = this.data;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }
    return value;
  }

  /**
   * 设置配置值
   */
  set(path, value) {
    const keys = path.split('.');
    let target = this.data;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!target[keys[i]] || typeof target[keys[i]] !== 'object') {
        target[keys[i]] = {};
      }
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = value;
  }

  /**
   * 批量设置
   */
  setMultiple(configs) {
    for (const [key, value] of Object.entries(configs)) {
      this.set(key, value);
    }
  }

  /**
   * 获取关卡配置
   */
  getLevelConfig(level) {
    const diff = this.get('difficulty');
    return {
      level,
      gridSize: this.calculateGridSize(level),
      bombCount: Math.floor(diff.bombCountBase + level * diff.bombCountGrowth),
      wallCount: Math.floor(diff.wallCountBase + level * diff.wallCountGrowth),
      staticBombChance: diff.staticBombChance + level * 0.01,
      strongWallChance: Math.min(0.6, diff.strongWallChance + level * 0.02)
    };
  }

  /**
   * 计算关卡棋盘大小
   */
  calculateGridSize(level) {
    const sizes = Constants.GRID_SIZES;
    if (level <= 5) return sizes[0];   // 5x5
    if (level <= 10) return sizes[1];  // 6x6
    if (level <= 20) return sizes[2];  // 7x7
    return sizes[3];                    // 8x8
  }
}

// 单例
let instance = null;
Config.getInstance = function() {
  if (!instance) {
    instance = new Config();
  }
  return instance;
};

// 导出到全局
GameGlobal.Config = Config;
GameGlobal.config = Config.getInstance();
