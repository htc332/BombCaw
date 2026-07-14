/**
 * Data/LevelData.js
 * 关卡配置 - 基于算法生成 v0.9.7
 * 
 * 爆炸范围规则：
 * - LV1(evolution=0): 十字1格（上下左右各1格）
 * - LV2(evolution=2): 竖直上下各3格
 * - LV3(evolution=3): 横向左右各3格 + 上方1格
 * - LV4(evolution=5): 十字1格 + 对角1格
 * 
 * 设计原则：
 * - 静态炸弹位置不能挡住玩家放炸弹的关键位置
 * - 静态炸弹的爆炸范围要与老鼠布局匹配
 * - LV2竖直炸弹：老鼠必须在同一x列，y方向分布
 * - LV3横向炸弹：老鼠必须在同一y行，x方向分布
 * - LV4十字对角：老鼠在十字或对角方向
 */

const LEVELS = {
  // ========== 第一阶段：基础机制（0001-0010）==========
  // 只有1级鼠(normal)，教学基础操作

  // 0001 - 初识炸弹（教学关）
  // 4只1级鼠十字排列，中心1颗LV1炸弹清屏
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

  // 0002 - 分散布局（教学关）
  // 8只1级鼠分散，需要2颗炸弹
  2: {
    gridSize: 6,
    hint: '第2关：老鼠分散了，需要多颗炸弹',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
    ],
    staticBombs: []
  },

  // 0003 - 上下排列（积分关）
  // 12只1级鼠上下两排，LV2竖直炸弹可覆盖
  3: {
    gridSize: 7,
    hint: '第3关：上下排列，竖直炸弹最有效',
    walls: [
      // 上排（y=-2, x=-3到3）
      { x: -3, y: -2, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
      // 下排（y=2, x=-3到3）
      { x: -3, y: 2, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: 3, y: 2, type: 'normal' },
    ],
    staticBombs: [
      // LV2竖直炸弹，放在x=0列，y=0，竖直上下3格覆盖上下排
      { x: 0, y: 0, evolution: 2 }
    ]
  },

  // 0004 - 左右排列（难度关）
  // 8只1级鼠左右两排，LV3横向炸弹可覆盖
  4: {
    gridSize: 7,
    hint: '第4关：左右排列，横向炸弹最有效',
    walls: [
      // 左排（x=-3, y=-2到2）
      { x: -3, y: -2, type: 'normal' },
      { x: -3, y: -1, type: 'normal' },
      { x: -3, y: 0, type: 'normal' },
      { x: -3, y: 1, type: 'normal' },
      { x: -3, y: 2, type: 'normal' },
      // 右排（x=3, y=-2到2）
      { x: 3, y: -2, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: 3, y: 1, type: 'normal' },
      { x: 3, y: 2, type: 'normal' },
    ],
    staticBombs: [
      // LV3横向炸弹，放在y=0行，x=0，横向左右3格覆盖左右排
      { x: 0, y: 0, evolution: 3 }
    ]
  },

  // 0005 - 对角线排列（难度关）
  // 5只1级鼠对角线排列，LV4十字对角炸弹可覆盖
  5: {
    gridSize: 6,
    hint: '第5关：对角线排列，十字对角炸弹最有效',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
    ],
    staticBombs: [
      // LV4十字对角炸弹，放在(0,-1)，对角可覆盖对角线老鼠
      { x: 0, y: -1, evolution: 5 }
    ]
  },

  // 0006 - 十字排列（挑战关）
  // 5只1级鼠十字排列，LV1炸弹可覆盖
  6: {
    gridSize: 5,
    hint: '第6关：十字排列，中心炸弹清屏',
    walls: [
      { x: 0, y: -2, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
    ],
    staticBombs: []
  },

  // 0007 - 环形排列（难度关）
  // 8只1级鼠环形排列，需要多颗炸弹
  7: {
    gridSize: 6,
    hint: '第7关：环形排列，需要精确计算',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
    ],
    staticBombs: []
  },

  // 0008 - 网格排列（难度关）
  // 9只1级鼠3x3网格，LV4炸弹可覆盖
  8: {
    gridSize: 7,
    hint: '第8关：网格排列，十字对角炸弹最有效',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
    ],
    staticBombs: [
      // LV4十字对角炸弹，放在(0,-1)，十字和对角覆盖网格
      { x: 0, y: -1, evolution: 5 }
    ]
  },

  // 0009 - 随机分散（难度关）
  // 10只1级鼠随机分散，需要策略
  9: {
    gridSize: 7,
    hint: '第9关：随机分散，仔细规划',
    walls: [
      { x: -3, y: -3, type: 'normal' },
      { x: 3, y: -3, type: 'normal' },
      { x: -3, y: 3, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
    ],
    staticBombs: []
  },

  // 0010 - 大网格（彩蛋关）
  // 16只1级鼠4x4网格，2个LV4炸弹可覆盖
  10: {
    gridSize: 8,
    hint: '第10关：彩蛋！大网格清屏',
    walls: [
      { x: -3, y: -3, type: 'normal' },
      { x: -1, y: -3, type: 'normal' },
      { x: 1, y: -3, type: 'normal' },
      { x: 3, y: -3, type: 'normal' },
      { x: -3, y: -1, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: -3, y: 1, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: 3, y: 1, type: 'normal' },
      { x: -3, y: 3, type: 'normal' },
      { x: -1, y: 3, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
    ],
    staticBombs: [
      // 2个LV4十字对角炸弹，放在中心区域，覆盖大网格
      // (-2,-2)的十字+对角可覆盖(-3,-3),(-3,-1),(-1,-3),(-1,-1)等
      { x: -2, y: -2, evolution: 5 },
      { x: 2, y: 2, evolution: 5 }
    ]
  },

  // ========== 第二阶段：2级鼠登场（0011-0020）==========
  // 2级鼠(strong)需要2次爆炸，引入新机制

  // 0011 - 2级鼠初现（教学关）
  // 2只1级鼠 + 2只2级鼠，简单介绍
  11: {
    gridSize: 5,
    hint: '第11关：2级老鼠需要炸两次！',
    walls: [
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: -1, y: 1, type: 'strong' },
      { x: 1, y: 1, type: 'strong' },
    ],
    staticBombs: []
  },

  // 0012 - 2级鼠练习（教学关）
  // 4只1级鼠 + 4只2级鼠，上下分布
  12: {
    gridSize: 7,
    hint: '第12关：2级老鼠上下分布，竖直炸弹最有效',
    walls: [
      // 上排1级鼠（y=-2, x=-3,-1,1,3）
      { x: -3, y: -2, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
      // 下排2级鼠（y=2, x=-3,-1,1,3）
      { x: -3, y: 2, type: 'strong' },
      { x: -1, y: 2, type: 'strong' },
      { x: 1, y: 2, type: 'strong' },
      { x: 3, y: 2, type: 'strong' },
    ],
    staticBombs: [
      // LV2竖直炸弹，放在x=-1和x=1列，y=0，竖直覆盖上下排
      { x: -1, y: 0, evolution: 2 },
      { x: 1, y: 0, evolution: 2 }
    ]
  },

  // 0013 - 2级鼠积分（积分关）
  // 6只1级鼠 + 6只2级鼠，上下分布
  13: {
    gridSize: 7,
    hint: '第13关：大量2级老鼠，赚取积分！',
    walls: [
      // 上排1级鼠（y=-2, x=-3,-2,-1,1,2,3）
      { x: -3, y: -2, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
      // 下排2级鼠（y=2, x=-3,-2,-1,1,2,3）
      { x: -3, y: 2, type: 'strong' },
      { x: -2, y: 2, type: 'strong' },
      { x: -1, y: 2, type: 'strong' },
      { x: 1, y: 2, type: 'strong' },
      { x: 2, y: 2, type: 'strong' },
      { x: 3, y: 2, type: 'strong' },
    ],
    staticBombs: [
      // 2个LV2竖直炸弹，放在x=-2和x=2列，y=0
      // 竖直上下3格可覆盖y=-2和y=2的老鼠
      { x: -2, y: 0, evolution: 2 },
      { x: 2, y: 0, evolution: 2 }
    ]
  },

  // 0014 - 2级鼠挑战（难度关）
  // 4只1级鼠 + 4只2级鼠，左右分布
  14: {
    gridSize: 7,
    hint: '第14关：2级老鼠左右分布，横向炸弹最有效',
    walls: [
      // 左排1级鼠（x=-3, y=-2,-1,1,2）
      { x: -3, y: -2, type: 'normal' },
      { x: -3, y: -1, type: 'normal' },
      { x: -3, y: 1, type: 'normal' },
      { x: -3, y: 2, type: 'normal' },
      // 右排2级鼠（x=3, y=-2,-1,1,2）
      { x: 3, y: -2, type: 'strong' },
      { x: 3, y: -1, type: 'strong' },
      { x: 3, y: 1, type: 'strong' },
      { x: 3, y: 2, type: 'strong' },
    ],
    staticBombs: [
      // LV3横向炸弹，放在y=-1和y=1行，x=0
      { x: 0, y: -1, evolution: 3 },
      { x: 0, y: 1, evolution: 3 }
    ]
  },

  // 0015 - 2级鼠环形（难度关）
  // 8只2级鼠环形排列，需要策略
  15: {
    gridSize: 6,
    hint: '第15关：2级老鼠环形排列，找到弱点',
    walls: [
      { x: -2, y: -2, type: 'strong' },
      { x: 0, y: -2, type: 'strong' },
      { x: 2, y: -2, type: 'strong' },
      { x: -2, y: 0, type: 'strong' },
      { x: 2, y: 0, type: 'strong' },
      { x: -2, y: 2, type: 'strong' },
      { x: 0, y: 2, type: 'strong' },
      { x: 2, y: 2, type: 'strong' },
    ],
    staticBombs: [
      // LV4十字对角炸弹，放在中心附近，覆盖环形
      { x: -1, y: -1, evolution: 5 },
      { x: 1, y: 1, evolution: 5 }
    ]
  },

  // 0016 - 2级鼠网格（挑战关）
  // 9只2级鼠3x3网格
  16: {
    gridSize: 7,
    hint: '第16关：2级老鼠网格，十字对角炸弹最有效',
    walls: [
      { x: -2, y: -2, type: 'strong' },
      { x: 0, y: -2, type: 'strong' },
      { x: 2, y: -2, type: 'strong' },
      { x: -2, y: 0, type: 'strong' },
      { x: 0, y: 0, type: 'strong' },
      { x: 2, y: 0, type: 'strong' },
      { x: -2, y: 2, type: 'strong' },
      { x: 0, y: 2, type: 'strong' },
      { x: 2, y: 2, type: 'strong' },
    ],
    staticBombs: [
      // LV4十字对角炸弹，覆盖网格
      { x: -1, y: -1, evolution: 5 },
      { x: 1, y: -1, evolution: 5 },
      { x: -1, y: 1, evolution: 5 },
      { x: 1, y: 1, evolution: 5 }
    ]
  },

  // 0017 - 混合上下（难度关）
  // 6只1级鼠 + 6只2级鼠，上下混合
  17: {
    gridSize: 7,
    hint: '第17关：混合上下分布，竖直炸弹最有效',
    walls: [
      // 上排混合（y=-2, x=-3到3）
      { x: -3, y: -2, type: 'normal' },
      { x: -2, y: -2, type: 'strong' },
      { x: -1, y: -2, type: 'normal' },
      { x: 1, y: -2, type: 'strong' },
      { x: 2, y: -2, type: 'normal' },
      { x: 3, y: -2, type: 'strong' },
      // 下排混合（y=2, x=-3到3）
      { x: -3, y: 2, type: 'strong' },
      { x: -2, y: 2, type: 'normal' },
      { x: -1, y: 2, type: 'strong' },
      { x: 1, y: 2, type: 'normal' },
      { x: 2, y: 2, type: 'strong' },
      { x: 3, y: 2, type: 'normal' },
    ],
    staticBombs: [
      // 2个LV2竖直炸弹，放在x=-2和x=2列，y=0
      // 竖直上下3格可覆盖y=-2和y=2的老鼠
      { x: -2, y: 0, evolution: 2 },
      { x: 2, y: 0, evolution: 2 }
    ]
  },

  // 0018 - 混合左右（难度关）
  // 6只1级鼠 + 6只2级鼠，左右混合
  18: {
    gridSize: 7,
    hint: '第18关：混合左右分布，横向炸弹最有效',
    walls: [
      // 左排混合（x=-3, y=-2到2）
      { x: -3, y: -2, type: 'normal' },
      { x: -3, y: -1, type: 'strong' },
      { x: -3, y: 0, type: 'normal' },
      { x: -3, y: 1, type: 'strong' },
      { x: -3, y: 2, type: 'normal' },
      // 右排混合（x=3, y=-2到2）
      { x: 3, y: -2, type: 'strong' },
      { x: 3, y: -1, type: 'normal' },
      { x: 3, y: 0, type: 'strong' },
      { x: 3, y: 1, type: 'normal' },
      { x: 3, y: 2, type: 'strong' },
    ],
    staticBombs: [
      // 3个LV3横向炸弹，放在y=-1,0,1行，x=0
      { x: 0, y: -1, evolution: 3 },
      { x: 0, y: 0, evolution: 3 },
      { x: 0, y: 1, evolution: 3 }
    ]
  },

  // 0019 - 2级鼠大挑战（难度关）
  // 12只2级鼠，复杂布局
  19: {
    gridSize: 8,
    hint: '第19关：大量2级老鼠，终极挑战',
    walls: [
      // 外围8只
      { x: -3, y: -3, type: 'strong' },
      { x: 3, y: -3, type: 'strong' },
      { x: -3, y: 3, type: 'strong' },
      { x: 3, y: 3, type: 'strong' },
      { x: -3, y: 0, type: 'strong' },
      { x: 3, y: 0, type: 'strong' },
      { x: 0, y: -3, type: 'strong' },
      { x: 0, y: 3, type: 'strong' },
      // 内圈4只
      { x: -1, y: -1, type: 'strong' },
      { x: 1, y: -1, type: 'strong' },
      { x: -1, y: 1, type: 'strong' },
      { x: 1, y: 1, type: 'strong' },
    ],
    staticBombs: [
      // 4个LV4十字对角炸弹，覆盖复杂布局
      { x: -1, y: -1, evolution: 5 },
      { x: 1, y: -1, evolution: 5 },
      { x: -1, y: 1, evolution: 5 },
      { x: 1, y: 1, evolution: 5 }
    ]
  },

  // 0020 - 2级鼠彩蛋（彩蛋关）
  // 16只2级鼠大网格，4个LV4炸弹清屏
  20: {
    gridSize: 8,
    hint: '第20关：彩蛋！2级老鼠大派对',
    walls: [
      { x: -3, y: -3, type: 'strong' },
      { x: -1, y: -3, type: 'strong' },
      { x: 1, y: -3, type: 'strong' },
      { x: 3, y: -3, type: 'strong' },
      { x: -3, y: -1, type: 'strong' },
      { x: -1, y: -1, type: 'strong' },
      { x: 1, y: -1, type: 'strong' },
      { x: 3, y: -1, type: 'strong' },
      { x: -3, y: 1, type: 'strong' },
      { x: -1, y: 1, type: 'strong' },
      { x: 1, y: 1, type: 'strong' },
      { x: 3, y: 1, type: 'strong' },
      { x: -3, y: 3, type: 'strong' },
      { x: -1, y: 3, type: 'strong' },
      { x: 1, y: 3, type: 'strong' },
      { x: 3, y: 3, type: 'strong' },
    ],
    staticBombs: [
      // 4个LV4十字对角炸弹，完美清屏
      { x: -2, y: -2, evolution: 5 },
      { x: 2, y: -2, evolution: 5 },
      { x: -2, y: 2, evolution: 5 },
      { x: 2, y: 2, evolution: 5 }
    ]
  },

  // ========== 第三阶段：3级鼠登场（0021-0030）==========
  // 3级鼠(ghost)会隐身，需要新策略

  // 0021 - 3级鼠初现（教学关）
  // 2只1级鼠 + 2只3级鼠，介绍隐身机制
  21: {
    gridSize: 5,
    hint: '第21关：3级老鼠会隐身！',
    walls: [
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: -1, y: 1, type: 'ghost' },
      { x: 1, y: 1, type: 'ghost' },
    ],
    staticBombs: []
  },

  // 0022 - 3级鼠练习（教学关）
  // 4只1级鼠 + 4只3级鼠，上下分布
  22: {
    gridSize: 7,
    hint: '第22关：3级老鼠上下分布，竖直炸弹最有效',
    walls: [
      // 上排1级鼠（y=-2, x=-3,-1,1,3）
      { x: -3, y: -2, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
      // 下排3级鼠（y=2, x=-3,-1,1,3）
      { x: -3, y: 2, type: 'ghost' },
      { x: -1, y: 2, type: 'ghost' },
      { x: 1, y: 2, type: 'ghost' },
      { x: 3, y: 2, type: 'ghost' },
    ],
    staticBombs: [
      // LV2竖直炸弹，放在x=-1和x=1列，y=0
      { x: -1, y: 0, evolution: 2 },
      { x: 1, y: 0, evolution: 2 }
    ]
  },

  // 0023 - 3级鼠积分（积分关）
  // 6只1级鼠 + 6只3级鼠，上下分布
  23: {
    gridSize: 7,
    hint: '第23关：大量3级老鼠，赚取积分！',
    walls: [
      // 上排1级鼠（y=-2, x=-3,-2,-1,1,2,3）
      { x: -3, y: -2, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
      // 下排3级鼠（y=2, x=-3,-2,-1,1,2,3）
      { x: -3, y: 2, type: 'ghost' },
      { x: -2, y: 2, type: 'ghost' },
      { x: -1, y: 2, type: 'ghost' },
      { x: 1, y: 2, type: 'ghost' },
      { x: 2, y: 2, type: 'ghost' },
      { x: 3, y: 2, type: 'ghost' },
    ],
    staticBombs: [
      // 2个LV2竖直炸弹，放在x=-2和x=2列，y=0
      { x: -2, y: 0, evolution: 2 },
      { x: 2, y: 0, evolution: 2 }
    ]
  },

  // 0024 - 3级鼠挑战（难度关）
  // 4只1级鼠 + 4只3级鼠，左右分布
  24: {
    gridSize: 7,
    hint: '第24关：3级老鼠左右分布，横向炸弹最有效',
    walls: [
      // 左排1级鼠（x=-3, y=-2,-1,1,2）
      { x: -3, y: -2, type: 'normal' },
      { x: -3, y: -1, type: 'normal' },
      { x: -3, y: 1, type: 'normal' },
      { x: -3, y: 2, type: 'normal' },
      // 右排3级鼠（x=3, y=-2,-1,1,2）
      { x: 3, y: -2, type: 'ghost' },
      { x: 3, y: -1, type: 'ghost' },
      { x: 3, y: 1, type: 'ghost' },
      { x: 3, y: 2, type: 'ghost' },
    ],
    staticBombs: [
      // LV3横向炸弹，放在y=-1和y=1行，x=0
      { x: 0, y: -1, evolution: 3 },
      { x: 0, y: 1, evolution: 3 }
    ]
  },

  // 0025 - 3级鼠环形（难度关）
  // 8只3级鼠环形排列
  25: {
    gridSize: 6,
    hint: '第25关：3级老鼠环形排列，找到弱点',
    walls: [
      { x: -2, y: -2, type: 'ghost' },
      { x: 0, y: -2, type: 'ghost' },
      { x: 2, y: -2, type: 'ghost' },
      { x: -2, y: 0, type: 'ghost' },
      { x: 2, y: 0, type: 'ghost' },
      { x: -2, y: 2, type: 'ghost' },
      { x: 0, y: 2, type: 'ghost' },
      { x: 2, y: 2, type: 'ghost' },
    ],
    staticBombs: [
      // LV4十字对角炸弹，覆盖环形
      { x: -1, y: -1, evolution: 5 },
      { x: 1, y: 1, evolution: 5 }
    ]
  },

  // 0026 - 3级鼠网格（挑战关）
  // 9只3级鼠3x3网格
  26: {
    gridSize: 7,
    hint: '第26关：3级老鼠网格，十字对角炸弹最有效',
    walls: [
      { x: -2, y: -2, type: 'ghost' },
      { x: 0, y: -2, type: 'ghost' },
      { x: 2, y: -2, type: 'ghost' },
      { x: -2, y: 0, type: 'ghost' },
      { x: 0, y: 0, type: 'ghost' },
      { x: 2, y: 0, type: 'ghost' },
      { x: -2, y: 2, type: 'ghost' },
      { x: 0, y: 2, type: 'ghost' },
      { x: 2, y: 2, type: 'ghost' },
    ],
    staticBombs: [
      // LV4十字对角炸弹，覆盖网格
      { x: -1, y: -1, evolution: 5 },
      { x: 1, y: -1, evolution: 5 },
      { x: -1, y: 1, evolution: 5 },
      { x: 1, y: 1, evolution: 5 }
    ]
  },

  // 0027 - 3级混合上下（难度关）
  // 6只1级鼠 + 6只3级鼠，上下混合
  27: {
    gridSize: 7,
    hint: '第27关：3级混合上下分布，竖直炸弹最有效',
    walls: [
      // 上排混合（y=-2, x=-3到3）
      { x: -3, y: -2, type: 'normal' },
      { x: -2, y: -2, type: 'ghost' },
      { x: -1, y: -2, type: 'normal' },
      { x: 1, y: -2, type: 'ghost' },
      { x: 2, y: -2, type: 'normal' },
      { x: 3, y: -2, type: 'ghost' },
      // 下排混合（y=2, x=-3到3）
      { x: -3, y: 2, type: 'ghost' },
      { x: -2, y: 2, type: 'normal' },
      { x: -1, y: 2, type: 'ghost' },
      { x: 1, y: 2, type: 'normal' },
      { x: 2, y: 2, type: 'ghost' },
      { x: 3, y: 2, type: 'normal' },
    ],
    staticBombs: [
      // 2个LV2竖直炸弹，放在x=-2和x=2列，y=0
      { x: -2, y: 0, evolution: 2 },
      { x: 2, y: 0, evolution: 2 }
    ]
  },

  // 0028 - 3级混合左右（难度关）
  // 6只1级鼠 + 6只3级鼠，左右混合
  28: {
    gridSize: 7,
    hint: '第28关：3级混合左右分布，横向炸弹最有效',
    walls: [
      // 左排混合（x=-3, y=-2到2）
      { x: -3, y: -2, type: 'normal' },
      { x: -3, y: -1, type: 'ghost' },
      { x: -3, y: 0, type: 'normal' },
      { x: -3, y: 1, type: 'ghost' },
      { x: -3, y: 2, type: 'normal' },
      // 右排混合（x=3, y=-2到2）
      { x: 3, y: -2, type: 'ghost' },
      { x: 3, y: -1, type: 'normal' },
      { x: 3, y: 0, type: 'ghost' },
      { x: 3, y: 1, type: 'normal' },
      { x: 3, y: 2, type: 'ghost' },
    ],
    staticBombs: [
      // 3个LV3横向炸弹，放在y=-1,0,1行，x=0
      { x: 0, y: -1, evolution: 3 },
      { x: 0, y: 0, evolution: 3 },
      { x: 0, y: 1, evolution: 3 }
    ]
  },

  // 0029 - 3级大挑战（难度关）
  // 12只3级鼠，复杂布局
  29: {
    gridSize: 8,
    hint: '第29关：大量3级老鼠，终极挑战',
    walls: [
      // 外围8只
      { x: -3, y: -3, type: 'ghost' },
      { x: 3, y: -3, type: 'ghost' },
      { x: -3, y: 3, type: 'ghost' },
      { x: 3, y: 3, type: 'ghost' },
      { x: -3, y: 0, type: 'ghost' },
      { x: 3, y: 0, type: 'ghost' },
      { x: 0, y: -3, type: 'ghost' },
      { x: 0, y: 3, type: 'ghost' },
      // 内圈4只
      { x: -1, y: -1, type: 'ghost' },
      { x: 1, y: -1, type: 'ghost' },
      { x: -1, y: 1, type: 'ghost' },
      { x: 1, y: 1, type: 'ghost' },
    ],
    staticBombs: [
      // 4个LV4十字对角炸弹，覆盖复杂布局
      { x: -1, y: -1, evolution: 5 },
      { x: 1, y: -1, evolution: 5 },
      { x: -1, y: 1, evolution: 5 },
      { x: 1, y: 1, evolution: 5 }
    ]
  },

  // 0030 - 3级彩蛋（彩蛋关）
  // 16只3级鼠大网格，4个LV4炸弹清屏
  30: {
    gridSize: 8,
    hint: '第30关：彩蛋！3级老鼠大派对',
    walls: [
      { x: -3, y: -3, type: 'ghost' },
      { x: -1, y: -3, type: 'ghost' },
      { x: 1, y: -3, type: 'ghost' },
      { x: 3, y: -3, type: 'ghost' },
      { x: -3, y: -1, type: 'ghost' },
      { x: -1, y: -1, type: 'ghost' },
      { x: 1, y: -1, type: 'ghost' },
      { x: 3, y: -1, type: 'ghost' },
      { x: -3, y: 1, type: 'ghost' },
      { x: -1, y: 1, type: 'ghost' },
      { x: 1, y: 1, type: 'ghost' },
      { x: 3, y: 1, type: 'ghost' },
      { x: -3, y: 3, type: 'ghost' },
      { x: -1, y: 3, type: 'ghost' },
      { x: 1, y: 3, type: 'ghost' },
      { x: 3, y: 3, type: 'ghost' },
    ],
    staticBombs: [
      // 4个LV4十字对角炸弹，完美清屏
      { x: -2, y: -2, evolution: 5 },
      { x: 2, y: -2, evolution: 5 },
      { x: -2, y: 2, evolution: 5 },
      { x: 2, y: 2, evolution: 5 }
    ]
  },

  // ========== 第四阶段：4级鼠登场（0031-0040）==========
  // 4级鼠(wall)需要4次爆炸，终极挑战

  // 0031 - 4级鼠初现（教学关）
  // 2只1级鼠 + 2只4级鼠，介绍坚固机制
  31: {
    gridSize: 5,
    hint: '第31关：4级老鼠需要炸四次！',
    walls: [
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: -1, y: 1, type: 'wall' },
      { x: 1, y: 1, type: 'wall' },
    ],
    staticBombs: []
  },

  // 0032 - 4级鼠练习（教学关）
  // 4只1级鼠 + 4只4级鼠，上下分布
  32: {
    gridSize: 7,
    hint: '第32关：4级老鼠上下分布，竖直炸弹最有效',
    walls: [
      // 上排1级鼠（y=-2, x=-3,-1,1,3）
      { x: -3, y: -2, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
      // 下排4级鼠（y=2, x=-3,-1,1,3）
      { x: -3, y: 2, type: 'wall' },
      { x: -1, y: 2, type: 'wall' },
      { x: 1, y: 2, type: 'wall' },
      { x: 3, y: 2, type: 'wall' },
    ],
    staticBombs: [
      // LV2竖直炸弹，放在x=-1和x=1列，y=0
      { x: -1, y: 0, evolution: 2 },
      { x: 1, y: 0, evolution: 2 }
    ]
  },

  // 0033 - 4级鼠积分（积分关）
  // 6只1级鼠 + 6只4级鼠，上下分布
  33: {
    gridSize: 7,
    hint: '第33关：大量4级老鼠，赚取积分！',
    walls: [
      // 上排1级鼠（y=-2, x=-3,-2,-1,1,2,3）
      { x: -3, y: -2, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
      // 下排4级鼠（y=2, x=-3,-2,-1,1,2,3）
      { x: -3, y: 2, type: 'wall' },
      { x: -2, y: 2, type: 'wall' },
      { x: -1, y: 2, type: 'wall' },
      { x: 1, y: 2, type: 'wall' },
      { x: 2, y: 2, type: 'wall' },
      { x: 3, y: 2, type: 'wall' },
    ],
    staticBombs: [
      // 2个LV2竖直炸弹，放在x=-2和x=2列，y=0
      { x: -2, y: 0, evolution: 2 },
      { x: 2, y: 0, evolution: 2 }
    ]
  },

  // 0034 - 4级鼠挑战（难度关）
  // 4只1级鼠 + 4只4级鼠，左右分布
  34: {
    gridSize: 7,
    hint: '第34关：4级老鼠左右分布，横向炸弹最有效',
    walls: [
      // 左排1级鼠（x=-3, y=-2,-1,1,2）
      { x: -3, y: -2, type: 'normal' },
      { x: -3, y: -1, type: 'normal' },
      { x: -3, y: 1, type: 'normal' },
      { x: -3, y: 2, type: 'normal' },
      // 右排4级鼠（x=3, y=-2,-1,1,2）
      { x: 3, y: -2, type: 'wall' },
      { x: 3, y: -1, type: 'wall' },
      { x: 3, y: 1, type: 'wall' },
      { x: 3, y: 2, type: 'wall' },
    ],
    staticBombs: [
      // LV3横向炸弹，放在y=-1和y=1行，x=0
      { x: 0, y: -1, evolution: 3 },
      { x: 0, y: 1, evolution: 3 }
    ]
  },

  // 0035 - 4级鼠环形（难度关）
  // 8只4级鼠环形排列
  35: {
    gridSize: 6,
    hint: '第35关：4级老鼠环形排列，找到弱点',
    walls: [
      { x: -2, y: -2, type: 'wall' },
      { x: 0, y: -2, type: 'wall' },
      { x: 2, y: -2, type: 'wall' },
      { x: -2, y: 0, type: 'wall' },
      { x: 2, y: 0, type: 'wall' },
      { x: -2, y: 2, type: 'wall' },
      { x: 0, y: 2, type: 'wall' },
      { x: 2, y: 2, type: 'wall' },
    ],
    staticBombs: [
      // LV4十字对角炸弹，覆盖环形
      { x: -1, y: -1, evolution: 5 },
      { x: 1, y: 1, evolution: 5 }
    ]
  },

  // 0036 - 4级鼠网格（挑战关）
  // 9只4级鼠3x3网格
  36: {
    gridSize: 7,
    hint: '第36关：4级老鼠网格，十字对角炸弹最有效',
    walls: [
      { x: -2, y: -2, type: 'wall' },
      { x: 0, y: -2, type: 'wall' },
      { x: 2, y: -2, type: 'wall' },
      { x: -2, y: 0, type: 'wall' },
      { x: 0, y: 0, type: 'wall' },
      { x: 2, y: 0, type: 'wall' },
      { x: -2, y: 2, type: 'wall' },
      { x: 0, y: 2, type: 'wall' },
      { x: 2, y: 2, type: 'wall' },
    ],
    staticBombs: [
      // LV4十字对角炸弹，覆盖网格
      { x: -1, y: -1, evolution: 5 },
      { x: 1, y: -1, evolution: 5 },
      { x: -1, y: 1, evolution: 5 },
      { x: 1, y: 1, evolution: 5 }
    ]
  },

  // 0037 - 4级混合上下（难度关）
  // 6只1级鼠 + 6只4级鼠，上下混合
  37: {
    gridSize: 7,
    hint: '第37关：4级混合上下分布，竖直炸弹最有效',
    walls: [
      // 上排混合（y=-2, x=-3到3）
      { x: -3, y: -2, type: 'normal' },
      { x: -2, y: -2, type: 'wall' },
      { x: -1, y: -2, type: 'normal' },
      { x: 1, y: -2, type: 'wall' },
      { x: 2, y: -2, type: 'normal' },
      { x: 3, y: -2, type: 'wall' },
      // 下排混合（y=2, x=-3到3）
      { x: -3, y: 2, type: 'wall' },
      { x: -2, y: 2, type: 'normal' },
      { x: -1, y: 2, type: 'wall' },
      { x: 1, y: 2, type: 'normal' },
      { x: 2, y: 2, type: 'wall' },
      { x: 3, y: 2, type: 'normal' },
    ],
    staticBombs: [
      // 2个LV2竖直炸弹，放在x=-2和x=2列，y=0
      { x: -2, y: 0, evolution: 2 },
      { x: 2, y: 0, evolution: 2 }
    ]
  },

  // 0038 - 4级混合左右（难度关）
  // 6只1级鼠 + 6只4级鼠，左右混合
  38: {
    gridSize: 7,
    hint: '第38关：4级混合左右分布，横向炸弹最有效',
    walls: [
      // 左排混合（x=-3, y=-2到2）
      { x: -3, y: -2, type: 'normal' },
      { x: -3, y: -1, type: 'wall' },
      { x: -3, y: 0, type: 'normal' },
      { x: -3, y: 1, type: 'wall' },
      { x: -3, y: 2, type: 'normal' },
      // 右排混合（x=3, y=-2到2）
      { x: 3, y: -2, type: 'wall' },
      { x: 3, y: -1, type: 'normal' },
      { x: 3, y: 0, type: 'wall' },
      { x: 3, y: 1, type: 'normal' },
      { x: 3, y: 2, type: 'wall' },
    ],
    staticBombs: [
      // 3个LV3横向炸弹，放在y=-1,0,1行，x=0
      { x: 0, y: -1, evolution: 3 },
      { x: 0, y: 0, evolution: 3 },
      { x: 0, y: 1, evolution: 3 }
    ]
  },

  // 0039 - 4级大挑战（难度关）
  // 12只4级鼠，复杂布局
  39: {
    gridSize: 8,
    hint: '第39关：大量4级老鼠，终极挑战',
    walls: [
      // 外围8只
      { x: -3, y: -3, type: 'wall' },
      { x: 3, y: -3, type: 'wall' },
      { x: -3, y: 3, type: 'wall' },
      { x: 3, y: 3, type: 'wall' },
      { x: -3, y: 0, type: 'wall' },
      { x: 3, y: 0, type: 'wall' },
      { x: 0, y: -3, type: 'wall' },
      { x: 0, y: 3, type: 'wall' },
      // 内圈4只
      { x: -1, y: -1, type: 'wall' },
      { x: 1, y: -1, type: 'wall' },
      { x: -1, y: 1, type: 'wall' },
      { x: 1, y: 1, type: 'wall' },
    ],
    staticBombs: [
      // 4个LV4十字对角炸弹，覆盖复杂布局
      { x: -1, y: -1, evolution: 5 },
      { x: 1, y: -1, evolution: 5 },
      { x: -1, y: 1, evolution: 5 },
      { x: 1, y: 1, evolution: 5 }
    ]
  },

  // 0040 - 4级彩蛋（彩蛋关）
  // 16只4级鼠大网格，4个LV4炸弹清屏
  40: {
    gridSize: 8,
    hint: '第40关：彩蛋！4级老鼠大派对',
    walls: [
      { x: -3, y: -3, type: 'wall' },
      { x: -1, y: -3, type: 'wall' },
      { x: 1, y: -3, type: 'wall' },
      { x: 3, y: -3, type: 'wall' },
      { x: -3, y: -1, type: 'wall' },
      { x: -1, y: -1, type: 'wall' },
      { x: 1, y: -1, type: 'wall' },
      { x: 3, y: -1, type: 'wall' },
      { x: -3, y: 1, type: 'wall' },
      { x: -1, y: 1, type: 'wall' },
      { x: 1, y: 1, type: 'wall' },
      { x: 3, y: 1, type: 'wall' },
      { x: -3, y: 3, type: 'wall' },
      { x: -1, y: 3, type: 'wall' },
      { x: 1, y: 3, type: 'wall' },
      { x: 3, y: 3, type: 'wall' },
    ],
    staticBombs: [
      // 4个LV4十字对角炸弹，完美清屏
      { x: -2, y: -2, evolution: 5 },
      { x: 2, y: -2, evolution: 5 },
      { x: -2, y: 2, evolution: 5 },
      { x: 2, y: 2, evolution: 5 }
    ]
  },

  // ========== 第五阶段：混合军团（0041-0050）==========
  // 所有类型老鼠混合出现，终极挑战

  // 0041 - 混合初现（教学关）
  // 各1只1-4级鼠，介绍混合机制
  41: {
    gridSize: 5,
    hint: '第41关：所有类型老鼠混合出现！',
    walls: [
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'strong' },
      { x: -1, y: 1, type: 'ghost' },
      { x: 1, y: 1, type: 'wall' },
    ],
    staticBombs: []
  },

  // 0042 - 混合练习（教学关）
  // 2只每种类型，上下分布
  42: {
    gridSize: 7,
    hint: '第42关：混合上下分布，竖直炸弹最有效',
    walls: [
      // 上排（y=-2, x=-3,-1,1,3）
      { x: -3, y: -2, type: 'normal' },
      { x: -1, y: -2, type: 'strong' },
      { x: 1, y: -2, type: 'ghost' },
      { x: 3, y: -2, type: 'wall' },
      // 下排（y=2, x=-3,-1,1,3）
      { x: -3, y: 2, type: 'wall' },
      { x: -1, y: 2, type: 'ghost' },
      { x: 1, y: 2, type: 'strong' },
      { x: 3, y: 2, type: 'normal' },
    ],
    staticBombs: [
      // LV2竖直炸弹，放在x=-1和x=1列，y=0
      { x: -1, y: 0, evolution: 2 },
      { x: 1, y: 0, evolution: 2 }
    ]
  },

  // 0043 - 混合积分（积分关）
  // 3只每种类型，上下分布
  43: {
    gridSize: 7,
    hint: '第43关：大量混合老鼠，赚取积分！',
    walls: [
      // 上排（y=-2, x=-3,-2,-1,1,2,3）
      { x: -3, y: -2, type: 'normal' },
      { x: -2, y: -2, type: 'strong' },
      { x: -1, y: -2, type: 'ghost' },
      { x: 1, y: -2, type: 'wall' },
      { x: 2, y: -2, type: 'normal' },
      { x: 3, y: -2, type: 'strong' },
      // 下排（y=2, x=-3,-2,-1,1,2,3）
      { x: -3, y: 2, type: 'ghost' },
      { x: -2, y: 2, type: 'wall' },
      { x: -1, y: 2, type: 'normal' },
      { x: 1, y: 2, type: 'strong' },
      { x: 2, y: 2, type: 'ghost' },
      { x: 3, y: 2, type: 'wall' },
    ],
    staticBombs: [
      // 2个LV2竖直炸弹，放在x=-2和x=2列，y=0
      { x: -2, y: 0, evolution: 2 },
      { x: 2, y: 0, evolution: 2 }
    ]
  },

  // 0044 - 混合挑战（难度关）
  // 2只每种类型，左右分布
  44: {
    gridSize: 7,
    hint: '第44关：混合左右分布，横向炸弹最有效',
    walls: [
      // 左排（x=-3, y=-2,-1,1,2）
      { x: -3, y: -2, type: 'normal' },
      { x: -3, y: -1, type: 'strong' },
      { x: -3, y: 1, type: 'ghost' },
      { x: -3, y: 2, type: 'wall' },
      // 右排（x=3, y=-2,-1,1,2）
      { x: 3, y: -2, type: 'wall' },
      { x: 3, y: -1, type: 'ghost' },
      { x: 3, y: 1, type: 'strong' },
      { x: 3, y: 2, type: 'normal' },
    ],
    staticBombs: [
      // LV3横向炸弹，放在y=-1和y=1行，x=0
      { x: 0, y: -1, evolution: 3 },
      { x: 0, y: 1, evolution: 3 }
    ]
  },

  // 0045 - 混合环形（难度关）
  // 8只混合类型环形排列
  45: {
    gridSize: 6,
    hint: '第45关：混合环形排列，找到弱点',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: 0, y: -2, type: 'strong' },
      { x: 2, y: -2, type: 'ghost' },
      { x: -2, y: 0, type: 'wall' },
      { x: 2, y: 0, type: 'normal' },
      { x: -2, y: 2, type: 'strong' },
      { x: 0, y: 2, type: 'ghost' },
      { x: 2, y: 2, type: 'wall' },
    ],
    staticBombs: [
      // LV4十字对角炸弹，覆盖环形
      { x: -1, y: -1, evolution: 5 },
      { x: 1, y: 1, evolution: 5 }
    ]
  },

  // 0046 - 混合网格（挑战关）
  // 9只混合类型3x3网格
  46: {
    gridSize: 7,
    hint: '第46关：混合网格，十字对角炸弹最有效',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: 0, y: -2, type: 'strong' },
      { x: 2, y: -2, type: 'ghost' },
      { x: -2, y: 0, type: 'wall' },
      { x: 0, y: 0, type: 'normal' },
      { x: 2, y: 0, type: 'strong' },
      { x: -2, y: 2, type: 'ghost' },
      { x: 0, y: 2, type: 'wall' },
      { x: 2, y: 2, type: 'normal' },
    ],
    staticBombs: [
      // LV4十字对角炸弹，覆盖网格
      { x: -1, y: -1, evolution: 5 },
      { x: 1, y: -1, evolution: 5 },
      { x: -1, y: 1, evolution: 5 },
      { x: 1, y: 1, evolution: 5 }
    ]
  },

  // 0047 - 混合大挑战（难度关）
  // 12只混合类型，复杂布局
  47: {
    gridSize: 8,
    hint: '第47关：混合大挑战，终极考验',
    walls: [
      // 外围8只
      { x: -3, y: -3, type: 'normal' },
      { x: 3, y: -3, type: 'strong' },
      { x: -3, y: 3, type: 'ghost' },
      { x: 3, y: 3, type: 'wall' },
      { x: -3, y: 0, type: 'wall' },
      { x: 3, y: 0, type: 'normal' },
      { x: 0, y: -3, type: 'strong' },
      { x: 0, y: 3, type: 'ghost' },
      // 内圈4只
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'strong' },
      { x: -1, y: 1, type: 'ghost' },
      { x: 1, y: 1, type: 'wall' },
    ],
    staticBombs: [
      // 4个LV4十字对角炸弹，覆盖复杂布局
      { x: -1, y: -1, evolution: 5 },
      { x: 1, y: -1, evolution: 5 },
      { x: -1, y: 1, evolution: 5 },
      { x: 1, y: 1, evolution: 5 }
    ]
  },

  // 0048 - 混合终极（难度关）
  // 16只混合类型大网格
  48: {
    gridSize: 8,
    hint: '第48关：混合终极挑战',
    walls: [
      { x: -3, y: -3, type: 'normal' },
      { x: -1, y: -3, type: 'strong' },
      { x: 1, y: -3, type: 'ghost' },
      { x: 3, y: -3, type: 'wall' },
      { x: -3, y: -1, type: 'wall' },
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'strong' },
      { x: 3, y: -1, type: 'ghost' },
      { x: -3, y: 1, type: 'ghost' },
      { x: -1, y: 1, type: 'wall' },
      { x: 1, y: 1, type: 'normal' },
      { x: 3, y: 1, type: 'strong' },
      { x: -3, y: 3, type: 'strong' },
      { x: -1, y: 3, type: 'ghost' },
      { x: 1, y: 3, type: 'wall' },
      { x: 3, y: 3, type: 'normal' },
    ],
    staticBombs: [
      // 4个LV4十字对角炸弹，完美清屏
      { x: -2, y: -2, evolution: 5 },
      { x: 2, y: -2, evolution: 5 },
      { x: -2, y: 2, evolution: 5 },
      { x: 2, y: 2, evolution: 5 }
    ]
  },

  // 0049 - 混合极限（挑战关）
  // 20只混合类型，极限布局
  49: {
    gridSize: 8,
    hint: '第49关：混合极限挑战！',
    walls: [
      // 外围12只
      { x: -3, y: -3, type: 'normal' },
      { x: -1, y: -3, type: 'strong' },
      { x: 1, y: -3, type: 'ghost' },
      { x: 3, y: -3, type: 'wall' },
      { x: -3, y: -1, type: 'wall' },
      { x: 3, y: -1, type: 'normal' },
      { x: -3, y: 1, type: 'strong' },
      { x: 3, y: 1, type: 'ghost' },
      { x: -3, y: 3, type: 'ghost' },
      { x: -1, y: 3, type: 'wall' },
      { x: 1, y: 3, type: 'normal' },
      { x: 3, y: 3, type: 'strong' },
      // 内圈8只
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'strong' },
      { x: -1, y: 1, type: 'ghost' },
      { x: 1, y: 1, type: 'wall' },
      { x: -2, y: 0, type: 'wall' },
      { x: 2, y: 0, type: 'normal' },
      { x: 0, y: -2, type: 'strong' },
      { x: 0, y: 2, type: 'ghost' },
    ],
    staticBombs: [
      // 4个LV4十字对角炸弹，极限清屏
      { x: -2, y: -2, evolution: 5 },
      { x: 2, y: -2, evolution: 5 },
      { x: -2, y: 2, evolution: 5 },
      { x: 2, y: 2, evolution: 5 }
    ]
  },

  // 0050 - 终极彩蛋（彩蛋关）
  // 24只混合类型，终极派对
  50: {
    gridSize: 8,
    hint: '第50关：终极彩蛋！混合老鼠大派对',
    walls: [
      // 全部24个位置，每种类型6只
      { x: -3, y: -3, type: 'normal' },
      { x: -1, y: -3, type: 'normal' },
      { x: 1, y: -3, type: 'normal' },
      { x: 3, y: -3, type: 'normal' },
      { x: -3, y: -1, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: -3, y: 1, type: 'strong' },
      { x: -1, y: 1, type: 'strong' },
      { x: 1, y: 1, type: 'strong' },
      { x: 3, y: 1, type: 'strong' },
      { x: -3, y: 3, type: 'strong' },
      { x: 3, y: 3, type: 'strong' },
      { x: -1, y: -1, type: 'ghost' },
      { x: 1, y: -1, type: 'ghost' },
      { x: -1, y: 3, type: 'ghost' },
      { x: 1, y: 3, type: 'ghost' },
      { x: -2, y: 0, type: 'ghost' },
      { x: 2, y: 0, type: 'ghost' },
      { x: 0, y: -2, type: 'wall' },
      { x: 0, y: 2, type: 'wall' },
      { x: -2, y: -2, type: 'wall' },
      { x: 2, y: -2, type: 'wall' },
      { x: -2, y: 2, type: 'wall' },
      { x: 2, y: 2, type: 'wall' },
    ],
    staticBombs: [
      // 4个LV4十字对角炸弹，终极清屏
      { x: -2, y: -2, evolution: 5 },
      { x: 2, y: -2, evolution: 5 },
      { x: -2, y: 2, evolution: 5 },
      { x: 2, y: 2, evolution: 5 }
    ]
  },
};

// 导出到微信小游戏全局
if (typeof GameGlobal !== 'undefined') {
  GameGlobal.LEVELS = LEVELS;
}

// CommonJS 导出
module.exports = LEVELS;