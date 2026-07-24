/**
 * Data/LevelData.js
 * 关卡配置 - 基于算法生成 v0.9.7
 * 
 * 爆炸范围规则（老胡纠正后）：
 * - LV1(evolution=0): 十字1格（上下左右各1格）
 * - LV2(evolution=2): 竖直上下各2格
 * - LV3(evolution=3): 横向左右各2格
 * - LV4(evolution=5): 十字1格 + 对角1格
 * 
 * 坐标系：5x5网格，中心为(0,0)
 * x: -2,-1,0,1,2 (左到右)
 * y: -2,-1,0,1,2 (上到下)
 */

const LEVELS = {
  // ========== 第一阶段：基础机制（0001-0007）==========

  // 0001 - 初识炸弹（教学关）
  // 5x5网格，4只1级鼠十字排列
  // CSV: ,,,,,,,,normal,,,,normal,,normal,,,,normal,,,,,,,
  1: {
    gridSize: 5,
    hint: '第1关：在中间放一颗炸弹，炸掉所有老鼠',
    walls: [
      { x: 0, y: -1, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
    ],
    staticBombs: []
  },

  // 0002 - 静态炸弹连锁（教学关）
  // 5x5网格，8只1级鼠 + 2个LV2静态炸弹
  // CSV: ,normal,,normal,,,normal,,normal,,,staticBombsLV2,,staticBombsLV2,,,normal,,normal,,,normal,,normal,
  2: {
    gridSize: 5,
    hint: '第2关：找到连锁引爆的关键位置！',
    walls: [
      { x: -1, y: -2, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: 0, evolution: 2 },
      { x: 1, y: 0, evolution: 2 }
    ]
  },

  // 0003 - 双连锁设计（难度关）
  // 5x5网格，7只普通鼠 + 2个LV2静态炸弹 + 2个LV3静态炸弹
  // CSV: ,,,normal,,,,,staticBombsLV2,normal,staticBombsLV3,normal,,normal,,,staticBombsLV2,normal,staticBombsLV3,normal,normal,normal,,,,
  3: {
    gridSize: 5,
    hint: '第3关：多个连锁点，找到最优解！',
    walls: [
      { x: 0, y: -2, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: -1, evolution: 2 },
      { x: 2, y: -1, evolution: 3 },
      { x: -2, y: 1, evolution: 2 },
      { x: 0, y: 1, evolution: 3 }
    ]
  },

  // 0004 - 交叉连锁（难度关）
  // 5x5网格，5只普通鼠 + 2个LV2静态炸弹 + 2个LV3静态炸弹
  // CSV: normal,,,,,staticBombsLV2,normal,staticBombsLV3,normal,normal,normal,,normal,,,staticBombsLV3,normal,staticBombsLV2,,,,,normal,,
  4: {
    gridSize: 5,
    hint: '第4关：交叉连锁，精确计算！',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: -1, evolution: 2 },
      { x: 0, y: -1, evolution: 3 },
      { x: -2, y: 1, evolution: 3 },
      { x: 0, y: 1, evolution: 2 }
    ]
  },

  // 0005 - LV1炸弹网（积分关）
  // 5x5网格，7只普通鼠 + 4个LV1静态炸弹
  // CSV: normal,,,,normal,staticBombsLV1,normal,,normal,staticBombsLV1,normal,staticBombsLV1,normal,staticBombsLV1,normal,,normal,staticBombsLV1,normal,,,,normal,,
  5: {
    gridSize: 5,
    hint: '第5关：LV1炸弹网，多点击发！',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: -1, evolution: 0 },
      { x: 2, y: -1, evolution: 0 },
      { x: -2, y: 0, evolution: 0 },
      { x: 2, y: 0, evolution: 0 },
      { x: -1, y: 1, evolution: 0 }
    ]
  },

  // 0006 - 混合炸弹（挑战关）
  // 5x5网格，6只普通鼠 + 1个LV1静态炸弹 + 2个LV2静态炸弹 + 1个LV3静态炸弹
  // CSV: ,normal,,normal,,,staticBombsLV2,normal,staticBombsLV3,,,normal,,normal,,,staticBombsLV1,normal,staticBombsLV2,,,normal,,normal,
  6: {
    gridSize: 5,
    hint: '第6关：混合炸弹，复杂连锁！',
    walls: [
      { x: -1, y: -2, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: -1, evolution: 2 },
      { x: 1, y: -1, evolution: 3 },
      { x: -1, y: 1, evolution: 0 },
      { x: 1, y: 1, evolution: 2 }
    ]
  },

  // 0007 - LV1对称网（挑战关）
  // 5x5网格，6只普通鼠 + 4个LV1静态炸弹
  // CSV: normal,staticBombsLV1,normal,staticBombsLV1,normal,,normal,,normal,,,,,,,,normal,,normal,,normal,staticBombsLV1,normal,staticBombsLV1,normal
  7: {
    gridSize: 5,
    hint: '第7关：对称布局，中心引爆！',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: -2, evolution: 0 },
      { x: 1, y: -2, evolution: 0 },
      { x: -1, y: 2, evolution: 0 },
      { x: 1, y: 2, evolution: 0 }
    ]
  },
};

// 导出到微信小游戏全局
if (typeof GameGlobal !== 'undefined') {
  GameGlobal.LEVELS = LEVELS;
}

// CommonJS 导出
module.exports = LEVELS;
