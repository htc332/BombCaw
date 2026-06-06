/**
 * Utils/Constants.js
 * 游戏常量定义
 */

const Constants = {
  // 游戏信息
  GAME_NAME: '牛牛炸鼠',
  VERSION: '0.5.2',
  
  // 棋盘规格
  GRID_SIZES: [5, 6, 7, 8], // 支持的棋盘尺寸
  DEFAULT_GRID_SIZE: 5,
  
  // 页面分区比例
  LAYOUT: {
    HUD_RATIO: 0.12,
    BOARD_RATIO: 0.70,
    BOTTOM_RATIO: 0.15,
    SIDE_MARGIN: 0.05,
    HUD_TOP_OFFSET: 10, // px
    BUTTON_BOTTOM_OFFSET: 15 // px
  },
  
  // 格子参数
  CELL: {
    MIN_SIZE_PX: 44, // 最小热区
    GAP_RATIO: 0.05,
    MIN_GAP: 2
  },
  
  // 缩放补偿（精灵图）
  SPRITE_SCALE: {
    BOMB_LV1: 1.80,
    BOMB_LV2: 1.10,
    BOMB_LV3: 1.50,
    BOMB_LV4: 1.50,
    ENEMY_N: 1.05,
    ENEMY_ELITE: 1.05
  },
  
  // 广告配置
  AD: {
    MAX_REVIVE_COUNT: 3,
    REVIVE_BOMBS: [3, 2, 3], // 每次复活获得炸弹数
    AD_UNIT_ID: '' // 预留
  },
  
  // 分享配置
  SHARE: {
    TITLE: '我在牛牛炸鼠炸了{score}分，快来挑战！',
    IMAGE_URL: '' // 预留
  },
  
  // 动画参数
  ANIMATION: {
    EXPLOSION_DURATION: 0.3,
    UPGRADE_DURATION: 0.5,
    SHAKE_DURATION: 0.3,
    VICTORY_DELAY: 3.0, // 胜利结算延迟
    RESULT_TRANSITION: 3.0 // 结果界面自动跳转
  },
  
  // 音效类型
  SOUND: {
    PLACE: 'place',
    EXPLODE: 'explode',
    UPGRADE: 'upgrade',
    VICTORY: 'victory',
    FAIL: 'fail',
    CLICK: 'click'
  },
  
  // 存储键名
  STORAGE_KEYS: {
    PREFIX: 'nnzs_',
    PLAYER_DATA: 'player_data',
    SETTINGS: 'settings',
    LEVEL_PROGRESS: 'level_progress',
    HIGH_SCORES: 'high_scores'
  },
  
  // 事件名
  EVENTS: {
    // 游戏事件
    GAME_START: 'game.start',
    GAME_PAUSE: 'game.pause',
    GAME_RESUME: 'game.resume',
    GAME_OVER: 'game.over',
    
    // 关卡事件
    LEVEL_START: 'level.start',
    LEVEL_COMPLETE: 'level.complete',
    LEVEL_FAIL: 'level.fail',
    LEVEL_SELECT: 'level.select',
    
    // 玩家事件
    SCORE_CHANGE: 'score.change',
    BOMB_PLACE: 'bomb.place',
    BOMB_EXPLODE: 'bomb.explode',
    BOMB_UPGRADE: 'bomb.upgrade',
    
    // 系统事件
    SCENE_CHANGE: 'scene.change',
    RESOURCE_LOAD: 'resource.load',
    AD_SHOW: 'ad.show',
    AD_CLOSE: 'ad.close',
    SHARE: 'share',
    
    // UI事件
    TOUCH_START: 'touch.start',
    TOUCH_END: 'touch.end',
    BUTTON_CLICK: 'button.click'
  }
};

// 导出到全局
GameGlobal.Constants = Constants;
