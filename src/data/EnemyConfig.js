/**
 * Data/EnemyConfig.js
 * 墙壁/敌人类型配置表
 * 配置驱动，避免硬编码
 */

const ENEMY_TYPES = {
  normal: {
    name: '普通鼠',
    hp: 1,
    score: 5,
    sprites: {
      idle: 'enemy_n'
    },
    deathSprite: 'enemy_n_death',
    deathDuration: 2000,
    // 状态流转: idle -> dying
    states: ['idle'],
    // 受伤处理函数名
    onDamaged: null,
    // 死亡处理函数名
    onDeath: 'standard'
  },

  strong: {
    name: '精英鼠',
    hp: 2,
    score: 10,
    sprites: {
      idle: 'enemy_elite',
      break_transition: 'enemy_elite_break',
      break_idle: 'enemy_elite_break_idle'
    },
    deathSprite: 'enemy_elite_death',
    deathDuration: 2000,
    // 状态流转: idle -> break_transition -> break_idle -> dying
    states: ['idle', 'break_transition', 'break_idle'],
    onDamaged: 'eliteBreak',
    onDeath: 'standard'
  },

  ghost: {
    name: '幽灵鼠',
    hp: 1,
    score: 8,
    sprites: {
      idle: 'enemy_ghost'
    },
    deathSprite: 'enemy_ghost_death',
    deathDuration: 2000,
    states: ['idle'],
    onDamaged: null,
    onDeath: 'standard'
  },

  bomb: {
    name: '炸弹墙',
    hp: 1,
    score: 5,
    sprites: {
      idle: null // 使用 drawWallLegacy 绘制
    },
    deathDuration: 100,
    states: ['idle'],
    onDamaged: null,
    onDeath: 'bombWall'
  }
};

// 导出到微信小游戏全局
if (typeof GameGlobal !== 'undefined') {
  GameGlobal.ENEMY_TYPES = ENEMY_TYPES;
}

// CommonJS 导出
module.exports = ENEMY_TYPES;
