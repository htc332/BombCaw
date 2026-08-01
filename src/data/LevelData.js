const LEVELS = {
  // 第1关
  1: {
    gridSize: 5,
    hint: '第1关：在中间放一颗炸弹，炸掉所有老鼠',
    walls: [
      { x: 0, y: -1, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
    ],
  },
  // 第2关
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
      { x: -1, y: 0, evolution: 1 },
      { x: 1, y: 0, evolution: 1 },
    ]
  },
  // 第3关
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
      { x: -1, y: 0, evolution: 2 },
      { x: 1, y: -1, evolution: 3 },
      { x: -2, y: 1, evolution: 2 },
      { x: 0, y: 1, evolution: 3 },
    ]
  },
  // 第4关
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
      { x: 1, y: -1, evolution: 3 },
      { x: -2, y: 1, evolution: 3 },
      { x: 1, y: 1, evolution: 3 },
    ]
  },
  // 第5关
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
      { x: -1, y: 0, evolution: 0 },
      { x: 1, y: 0, evolution: 0 },
      { x: -1, y: 2, evolution: 0 },
    ]
  },
  // 第6关
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
      { x: 0, y: 1, evolution: 0 },
      { x: 0, y: 2, evolution: 2 },
    ]
  },
  // 第7关
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
      { x: 1, y: 2, evolution: 0 },
    ]
  },
  // 第8关
  8: {
    gridSize: 5,
    hint: '第8关：加固墙需要两次爆炸！',
    walls: [
      { x: 0, y: -1, type: 'strong' },
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: 0, y: 1, type: 'strong' },
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 0, evolution: 0 },
      { x: -2, y: 0, evolution: 0 },
      { x: 2, y: 0, evolution: 0 },
    ]
  },
  // 第9关
  9: {
    gridSize: 5,
    hint: '第9关：连锁反应对付加固墙！',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 1, y: -2, type: 'strong' },
      { x: 2, y: -2, type: 'strong' },
      { x: 2, y: -1, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 0, evolution: 0 },
      { x: 0, y: 1, evolution: 0 },
      { x: 1, y: 2, evolution: 0 },
    ]
  },
  // 第10关
  10: {
    gridSize: 5,
    hint: '第10关：★精打细算★',
    walls: [
      { x: 0, y: -2, type: 'strong' },
      { x: -2, y: 0, type: 'strong' },
      { x: 2, y: 0, type: 'strong' },
      { x: 0, y: 2, type: 'strong' },
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: -1, evolution: 0 },
      { x: -1, y: 0, evolution: 0 },
      { x: 1, y: 0, evolution: 0 },
      { x: 0, y: 1, evolution: 0 },
    ]
  },
  // 第11关
  11: {
    gridSize: 5,
    hint: '第11关：消灭所有老鼠！',
    walls: [
      { x: 0, y: -2, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: -1, evolution: 0 },
      { x: -2, y: 0, evolution: 0 },
      { x: -1, y: 0, evolution: 0 },
    ]
  
  },
  // 第12关
  12: {
    gridSize: 5,
    hint: '第12关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 2, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: 2, evolution: 0 },
      { x: 0, y: 1, evolution: 0 },
      { x: 0, y: 0, evolution: 0 },
    ]
  
  },
  // 第13关
  13: {
    gridSize: 5,
    hint: '第13关：消灭所有老鼠！',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: -1, evolution: 0 },
      { x: 0, y: 1, evolution: 0 },
      { x: -1, y: 0, evolution: 0 },
    ]
  
  },
  // 第14关
  14: {
    gridSize: 5,
    hint: '第14关：消灭所有老鼠！',
    walls: [
      { x: 0, y: 1, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: -1, evolution: 0 },
      { x: -1, y: 2, evolution: 0 },
      { x: 0, y: -1, evolution: 0 },
    ]
  
  },
  // 第15关
  15: {
    gridSize: 5,
    hint: '第15关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 1, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: -2, evolution: 0 },
      { x: 1, y: 2, evolution: 0 },
      { x: 0, y: -2, evolution: 0 },
      { x: 2, y: 1, evolution: 0 },
    ]
  
  },
  // 第16关
  16: {
    gridSize: 5,
    hint: '第16关：消灭所有老鼠！',
    walls: [
      { x: 1, y: -1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: -2, evolution: 0 },
      { x: -1, y: 1, evolution: 0 },
      { x: 0, y: -1, evolution: 0 },
    ]
  
  },
  // 第17关
  17: {
    gridSize: 5,
    hint: '第17关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 0, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: -2, evolution: 0 },
      { x: -1, y: 0, evolution: 0 },
      { x: -1, y: 2, evolution: 0 },
    ]
  
  },
  // 第18关
  18: {
    gridSize: 5,
    hint: '第18关：消灭所有老鼠！',
    walls: [
      { x: 0, y: -2, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: 2, y: -2, evolution: 0 },
      { x: 0, y: 1, evolution: 0 },
      { x: -2, y: 0, evolution: 0 },
    ]
  
  },
  // 第19关
  19: {
    gridSize: 5,
    hint: '第19关：消灭所有老鼠！',
    walls: [
      { x: 1, y: 1, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: -1, evolution: 0 },
      { x: -2, y: -2, evolution: 0 },
    ]
  
  },
  // 第20关
  20: {
    gridSize: 5,
    hint: '第20关：消灭所有老鼠！',
    walls: [
      { x: 2, y: -2, type: 'normal' },
      { x: -1, y: -1, type: 'strong' },
      { x: 0, y: -1, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: -1, y: 0, type: 'strong' },
      { x: 1, y: 1, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: -2, evolution: 0 },
      { x: 2, y: 0, evolution: 0 },
      { x: 0, y: 2, evolution: 0 },
      { x: -1, y: -2, evolution: 0 },
    ]
  
  },
  // 第21关
  21: {
    gridSize: 5,
    hint: '第21关：消灭所有老鼠！',
    walls: [
      { x: 0, y: 1, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: -1, evolution: 0 },
      { x: 2, y: 0, evolution: 0 },
      { x: -2, y: -2, evolution: 0 },
    ]
  
  },
  // 第22关
  22: {
    gridSize: 5,
    hint: '第22关：消灭所有老鼠！',
    walls: [
      { x: -1, y: 1, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: -2, y: 0, type: 'strong' },
      { x: 1, y: 0, type: 'strong' },
    ],
    staticBombs: [
      { x: -2, y: 1, evolution: 0 },
      { x: -2, y: -2, evolution: 0 },
      { x: 2, y: 1, evolution: 0 },
    ]
  
  },
  // 第23关
  23: {
    gridSize: 5,
    hint: '第23关：消灭所有老鼠！',
    walls: [
      { x: 0, y: -2, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 0, y: -1, type: 'strong' },
      { x: 1, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: 2, evolution: 0 },
      { x: 1, y: 1, evolution: 0 },
    ]
  
  },
  // 第24关
  24: {
    gridSize: 5,
    hint: '第24关：消灭所有老鼠！',
    walls: [
      { x: 0, y: -1, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 1, y: 0, type: 'strong' },
      { x: 2, y: 2, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: 2, evolution: 0 },
      { x: 0, y: -2, evolution: 0 },
    ]
  
  },
  // 第25关
  25: {
    gridSize: 5,
    hint: '第25关：消灭所有老鼠！',
    walls: [
      { x: 0, y: -1, type: 'normal' },
      { x: 1, y: 1, type: 'strong' },
      { x: 2, y: 2, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: -1, y: 2, type: 'strong' },
    ],
    staticBombs: [
      { x: -2, y: 0, evolution: 0 },
      { x: -2, y: -1, evolution: 0 },
      { x: -1, y: 0, evolution: 2 },
      { x: 1, y: -1, evolution: 0 },
    ]
  
  },
  // 第26关
  26: {
    gridSize: 5,
    hint: '第26关：消灭所有老鼠！',
    walls: [
      { x: -2, y: -1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: -1, y: 0, type: 'strong' },
      { x: 2, y: -2, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: 0, evolution: 0 },
      { x: 2, y: 1, evolution: 2 },
      { x: 0, y: 2, evolution: 2 },
    ]
  
  },
  // 第27关
  27: {
    gridSize: 5,
    hint: '第27关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 1, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 0, y: -2, type: 'strong' },
      { x: 1, y: -2, type: 'normal' },
      { x: 1, y: 0, type: 'strong' },
      { x: -2, y: 0, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 0, evolution: 2 },
      { x: 0, y: -1, evolution: 2 },
      { x: -1, y: -2, evolution: 0 },
    ]
  
  },
  // 第28关
  28: {
    gridSize: 5,
    hint: '第28关：消灭所有老鼠！',
    walls: [
      { x: 0, y: 1, type: 'strong' },
      { x: -1, y: -2, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 2, y: 1, type: 'strong' },
      { x: -1, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: 0, evolution: 0 },
      { x: -1, y: -1, evolution: 2 },
    ]
  
  },
  // 第29关
  29: {
    gridSize: 5,
    hint: '第29关：消灭所有老鼠！',
    walls: [
      { x: 1, y: 1, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: 0, y: -1, type: 'strong' },
      { x: 0, y: 1, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: 2, evolution: 2 },
      { x: 1, y: 0, evolution: 0 },
      { x: -2, y: -1, evolution: 0 },
    ]
  
  },
  // 第30关
  30: {
    gridSize: 5,
    hint: '第30关：消灭所有老鼠！',
    walls: [
      { x: 2, y: 1, type: 'strong' },
      { x: -1, y: 2, type: 'strong' },
      { x: -2, y: 2, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 0, y: -2, type: 'ghost' },
      { x: 2, y: 2, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: -2, evolution: 0 },
      { x: 1, y: -1, evolution: 0 },
      { x: -1, y: 1, evolution: 2 },
      { x: 0, y: 2, evolution: 0 },
    ]
  
  },
  // 第31关
  31: {
    gridSize: 5,
    hint: '第31关：消灭所有老鼠！',
    walls: [
      { x: 2, y: 2, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 2, y: -1, type: 'strong' },
      { x: 1, y: 0, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: -1, y: 0, type: 'strong' },
      { x: 0, y: 2, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: 1, y: 2, type: 'ghost' },
      { x: -2, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: -2, evolution: 0 },
      { x: -1, y: 1, evolution: 0 },
    ]
  
  },
  // 第32关
  32: {
    gridSize: 5,
    hint: '第32关：消灭所有老鼠！',
    walls: [
      { x: 2, y: -1, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: -2, y: 0, type: 'strong' },
      { x: 0, y: 2, type: 'normal' },
      { x: -1, y: 2, type: 'ghost' },
      { x: -2, y: 1, type: 'strong' },
      { x: 2, y: 2, type: 'strong' },
      { x: -2, y: -2, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: -1, evolution: 2 },
      { x: -2, y: -1, evolution: 2 },
      { x: -1, y: 1, evolution: 2 },
    ]
  
  },
  // 第33关
  33: {
    gridSize: 5,
    hint: '第33关：消灭所有老鼠！',
    walls: [
      { x: 2, y: 0, type: 'ghost' },
      { x: -1, y: -2, type: 'normal' },
      { x: -1, y: -1, type: 'strong' },
      { x: 0, y: 2, type: 'strong' },
      { x: -2, y: 2, type: 'strong' },
      { x: -1, y: 0, type: 'strong' },
      { x: 0, y: 0, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: 2, y: -1, type: 'strong' },
    ],
    staticBombs: [
      { x: 0, y: -2, evolution: 2 },
      { x: -2, y: 0, evolution: 0 },
    ]
  
  },
  // 第34关
  34: {
    gridSize: 5,
    hint: '第34关：消灭所有老鼠！',
    walls: [
      { x: 0, y: 0, type: 'normal' },
      { x: -1, y: 2, type: 'strong' },
      { x: 2, y: 2, type: 'strong' },
      { x: -1, y: 0, type: 'ghost' },
      { x: -2, y: -2, type: 'normal' },
      { x: -1, y: -2, type: 'strong' },
      { x: -1, y: -1, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: 1, evolution: 2 },
      { x: -2, y: -1, evolution: 0 },
      { x: 2, y: -2, evolution: 2 },
    ]
  
  },
  // 第35关
  35: {
    gridSize: 5,
    hint: '第35关：消灭所有老鼠！',
    walls: [
      { x: -1, y: 0, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: -1, y: -2, type: 'strong' },
      { x: -2, y: 1, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: -1, y: 2, type: 'strong' },
      { x: 0, y: -1, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: 1, evolution: 2 },
      { x: 1, y: -2, evolution: 2 },
      { x: -2, y: 2, evolution: 0 },
      { x: -1, y: 1, evolution: 2 },
    ]
  
  },
  // 第36关
  36: {
    gridSize: 5,
    hint: '第36关：消灭所有老鼠！',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: 0, y: 1, type: 'strong' },
      { x: 0, y: -1, type: 'ghost' },
      { x: 1, y: 0, type: 'normal' },
      { x: 2, y: -1, type: 'strong' },
      { x: -2, y: 2, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: -1, type: 'ghost' },
    ],
    staticBombs: [
      { x: -1, y: -2, evolution: 2 },
      { x: 0, y: 0, evolution: 0 },
      { x: 1, y: 2, evolution: 2 },
    ]
  
  },
  // 第37关
  37: {
    gridSize: 5,
    hint: '第37关：消灭所有老鼠！',
    walls: [
      { x: 2, y: 2, type: 'strong' },
      { x: 1, y: 1, type: 'normal' },
      { x: -1, y: -2, type: 'strong' },
      { x: 2, y: 0, type: 'normal' },
      { x: 1, y: -2, type: 'strong' },
      { x: 1, y: -1, type: 'ghost' },
      { x: 1, y: 0, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: -1, y: 2, type: 'ghost' },
      { x: -2, y: -2, type: 'ghost' },
      { x: 0, y: -1, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: 1, evolution: 2 },
      { x: -2, y: 1, evolution: 2 },
    ]
  
  },
  // 第38关
  38: {
    gridSize: 5,
    hint: '第38关：消灭所有老鼠！',
    walls: [
      { x: 2, y: 0, type: 'strong' },
      { x: -1, y: 2, type: 'strong' },
      { x: 1, y: 0, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: -1, y: 0, type: 'ghost' },
      { x: 1, y: -2, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: 2, y: 2, evolution: 2 },
      { x: -2, y: 0, evolution: 2 },
    ]
  
  },
  // 第39关
  39: {
    gridSize: 5,
    hint: '第39关：消灭所有老鼠！',
    walls: [
      { x: 2, y: 1, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: -1, y: 1, type: 'ghost' },
    ],
    staticBombs: [
      { x: 0, y: -2, evolution: 2 },
      { x: -2, y: 2, evolution: 2 },
      { x: -1, y: -2, evolution: 2 },
    ]
  
  },
  // 第40关
  40: {
    gridSize: 5,
    hint: '第40关：消灭所有老鼠！',
    walls: [
      { x: 0, y: 0, type: 'ghost' },
      { x: 0, y: -1, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: -1, y: 0, type: 'strong' },
      { x: -2, y: 2, type: 'ghost' },
      { x: 1, y: -1, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 1, evolution: 2 },
      { x: -2, y: -2, evolution: 0 },
      { x: 0, y: -2, evolution: 2 },
      { x: 2, y: -1, evolution: 0 },
    ]
  
  },
  // 第41关
  41: {
    gridSize: 5,
    hint: '第41关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 1, type: 'ghost' },
      { x: -1, y: 1, type: 'strong' },
      { x: 1, y: 0, type: 'normal' },
      { x: -2, y: -1, type: 'strong' },
      { x: 2, y: -1, type: 'strong' },
      { x: 0, y: -2, type: 'strong' },
      { x: -1, y: 2, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
    ],
    staticBombs: [
      { x: 2, y: 0, evolution: 0 },
      { x: -2, y: 0, evolution: 0 },
      { x: 0, y: 1, evolution: 0 },
    ]
  
  },
  // 第42关
  42: {
    gridSize: 5,
    hint: '第42关：消灭所有老鼠！',
    walls: [
      { x: -2, y: -1, type: 'strong' },
      { x: 1, y: -2, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: 1, y: 0, type: 'strong' },
      { x: 0, y: -1, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: -2, evolution: 0 },
      { x: -2, y: 0, evolution: 2 },
    ]
  
  },
  // 第43关
  43: {
    gridSize: 5,
    hint: '第43关：消灭所有老鼠！',
    walls: [
      { x: 1, y: 2, type: 'ghost' },
      { x: 0, y: 1, type: 'normal' },
      { x: 0, y: -2, type: 'strong' },
      { x: -1, y: -2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: 0, type: 'ghost' },
      { x: 1, y: -1, type: 'strong' },
    ],
    staticBombs: [
      { x: 1, y: 1, evolution: 3 },
      { x: -2, y: 1, evolution: 2 },
      { x: -2, y: -2, evolution: 3 },
    ]
  
  },
  // 第44关
  44: {
    gridSize: 5,
    hint: '第44关：消灭所有老鼠！',
    walls: [
      { x: 0, y: 1, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: 1, y: 0, type: 'ghost' },
      { x: -2, y: -2, type: 'ghost' },
    ],
    staticBombs: [
      { x: 1, y: 2, evolution: 2 },
      { x: 0, y: 2, evolution: 3 },
    ]
  
  },
  // 第45关
  45: {
    gridSize: 5,
    hint: '第45关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 2, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 2, y: -2, type: 'strong' },
      { x: 0, y: 2, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: -1, evolution: 0 },
      { x: 1, y: -2, evolution: 3 },
      { x: 2, y: 1, evolution: 3 },
      { x: 0, y: -2, evolution: 0 },
    ]
  
  },
  // 第46关
  46: {
    gridSize: 5,
    hint: '第46关：消灭所有老鼠！',
    walls: [
      { x: 2, y: -1, type: 'strong' },
      { x: 0, y: 1, type: 'normal' },
      { x: -1, y: -1, type: 'strong' },
      { x: 0, y: -1, type: 'normal' },
      { x: 0, y: -2, type: 'strong' },
      { x: 2, y: 2, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: 0, evolution: 2 },
      { x: 2, y: -2, evolution: 3 },
      { x: 1, y: 2, evolution: 3 },
    ]
  
  },
  // 第47关
  47: {
    gridSize: 5,
    hint: '第47关：消灭所有老鼠！',
    walls: [
      { x: -1, y: -2, type: 'normal' },
      { x: -2, y: -1, type: 'ghost' },
      { x: -1, y: -1, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: 1, y: -1, type: 'ghost' },
      { x: 1, y: 0, type: 'ghost' },
      { x: 2, y: 0, type: 'strong' },
      { x: -2, y: -2, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 0, evolution: 3 },
      { x: 0, y: 2, evolution: 0 },
      { x: 0, y: -2, evolution: 0 },
    ]
  
  },
  // 第48关
  48: {
    gridSize: 5,
    hint: '第48关：消灭所有老鼠！',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: -1, y: 2, type: 'ghost' },
      { x: -2, y: 1, type: 'strong' },
      { x: -1, y: -2, type: 'ghost' },
      { x: 0, y: 0, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: 0, y: 1, type: 'ghost' },
    ],
    staticBombs: [
      { x: 0, y: -1, evolution: 0 },
      { x: -1, y: -1, evolution: 3 },
      { x: -1, y: 1, evolution: 0 },
    ]
  
  },
  // 第49关
  49: {
    gridSize: 5,
    hint: '第49关：消灭所有老鼠！',
    walls: [
      { x: 2, y: 2, type: 'normal' },
      { x: -2, y: 1, type: 'strong' },
      { x: 0, y: 0, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: -1, y: -2, type: 'strong' },
    ],
    staticBombs: [
      { x: 2, y: -1, evolution: 3 },
      { x: -2, y: -1, evolution: 0 },
      { x: 2, y: -2, evolution: 2 },
    ]
  
  },
  // 第50关
  50: {
    gridSize: 5,
    hint: '第50关：消灭所有老鼠！',
    walls: [
      { x: 1, y: 1, type: 'strong' },
      { x: 1, y: -2, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: 0, y: 1, type: 'ghost' },
      { x: -1, y: 1, type: 'strong' },
      { x: -1, y: -1, type: 'ghost' },
    ],
    staticBombs: [
      { x: 1, y: 2, evolution: 3 },
      { x: 0, y: -1, evolution: 3 },
      { x: 0, y: 2, evolution: 3 },
      { x: -1, y: -2, evolution: 2 },
    ]
  
  },

  // 第51关
  51: {
    gridSize: 6,
    hint: '第51关：运用技巧，巧妙通关！',
    walls: [
      { x: 3, y: 3, type: 'normal' },
      { x: -2, y: 3, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 0, evolution: 0 },
      { x: -1, y: -1, evolution: 2 },
    ]
  },

  // 第52关
  52: {
    gridSize: 6,
    hint: '第52关：运用技巧，巧妙通关！',
    walls: [
      { x: 0, y: 3, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: 0, evolution: 0 },
      { x: 1, y: -1, evolution: 2 },
    ]
  },

  // 第53关
  53: {
    gridSize: 6,
    hint: '第53关：运用技巧，巧妙通关！',
    walls: [
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: -1, y: 3, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 0, evolution: 0 },
      { x: 2, y: 0, evolution: 2 },
    ]
  },

  // 第54关
  54: {
    gridSize: 6,
    hint: '第54关：运用技巧，巧妙通关！',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
      { x: -2, y: 3, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: 1, evolution: 0 },
      { x: 1, y: 2, evolution: 2 },
    ]
  },

  // 第55关：★消耗关★
  55: {
    gridSize: 6,
    hint: '第55关：★消耗关★精打细算！',
    walls: [
      { x: 0, y: -2, type: 'normal' },
      { x: 0, y: 3, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: 0, evolution: 0 },
      { x: 2, y: 0, evolution: 0 },
      { x: 0, y: 2, evolution: 2 },
    ]
  },

  // 第56关
  56: {
    gridSize: 6,
    hint: '第56关：运用技巧，巧妙通关！',
    walls: [
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 0, evolution: 0 },
      { x: 2, y: 2, evolution: 2 },
    ]
  },

  // 第57关
  57: {
    gridSize: 6,
    hint: '第57关：运用技巧，巧妙通关！',
    walls: [
      { x: 3, y: 3, type: 'normal' },
      { x: -2, y: 3, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: 1, evolution: 0 },
      { x: 1, y: -1, evolution: 2 },
    ]
  },

  // 第58关
  58: {
    gridSize: 6,
    hint: '第58关：运用技巧，巧妙通关！',
    walls: [
      { x: 0, y: 3, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: 0, evolution: 0 },
      { x: -1, y: -2, evolution: 2 },
    ]
  },

  // 第59关
  59: {
    gridSize: 6,
    hint: '第59关：运用技巧，巧妙通关！',
    walls: [
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: -2, y: 3, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 0, evolution: 0 },
      { x: 2, y: -2, evolution: 2 },
    ]
  },

  // 第60关：★Boss挑战★
  60: {
    gridSize: 6,
    hint: '第60关：★Boss挑战★',
    walls: [
      { x: 0, y: -2, type: 'normal' },
      { x: 0, y: 3, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: -2, y: -2, type: 'strong' },
      { x: 2, y: 2, type: 'strong' },
      { x: -1, y: 2, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: 3, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: 0, evolution: 2 },
      { x: 2, y: 0, evolution: 2 },
      { x: 0, y: 2, evolution: 0 },
      { x: 1, y: 0, evolution: 0 },
    ]
  },

  // 第61关
  61: {
    gridSize: 6,
    hint: '第61关：消灭所有老鼠！',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: -2, y: 3, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: 2, y: 0, evolution: 0 },
      { x: 3, y: 0, evolution: 2 },
    ]
  },

  // 第62关
  62: {
    gridSize: 6,
    hint: '第62关：消灭所有老鼠！',
    walls: [
      { x: 0, y: -1, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: 2, y: 3, type: 'normal' },
      { x: 0, y: 3, type: 'normal' },
      { x: -2, y: 3, type: 'normal' },
      { x: -1, y: 3, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: 2, evolution: 0 },
      { x: 1, y: 3, evolution: 2 },
      { x: 3, y: -1, evolution: 2 },
    ]
  },

  // 第63关
  63: {
    gridSize: 6,
    hint: '第63关：挑战你的策略极限！',
    walls: [
      { x: 0, y: 1, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: 3, y: 2, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: -1, y: 3, type: 'normal' },
      { x: 2, y: 3, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: -2, evolution: 2 },
      { x: 3, y: 3, evolution: 0 },
      { x: 1, y: 2, evolution: 2 },
    ]
  },

  // 第64关
  64: {
    gridSize: 6,
    hint: '第64关：消灭所有老鼠！',
    walls: [
      { x: 0, y: 0, type: 'normal' },
      { x: 3, y: 1, type: 'normal' },
      { x: 3, y: 2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
    ],
    staticBombs: [
      { x: 2, y: 0, evolution: 2 },
      { x: -1, y: 1, evolution: 0 },
    ]
  },

  // 第65关：★消耗关★
  65: {
    gridSize: 6,
    hint: '第65关：★消耗关★精打细算！',
    walls: [
      { x: 3, y: 1, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 3, y: 2, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: -2, y: 3, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: 2, evolution: 2 },
      { x: -1, y: 0, evolution: 0 },
      { x: 1, y: -1, evolution: 0 },
      { x: -2, y: -1, evolution: 2 },
    ]
  },

  // 第66关
  66: {
    gridSize: 6,
    hint: '第66关：消灭所有老鼠！',
    walls: [
      { x: 3, y: 1, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 2, y: -2, type: 'ghost' },
      { x: 0, y: 3, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: -2, evolution: 0 },
      { x: 3, y: -1, evolution: 0 },
      { x: -2, y: 2, evolution: 2 },
    ]
  },

  // 第67关
  67: {
    gridSize: 6,
    hint: '第67关：消灭所有老鼠！',
    walls: [
      { x: 3, y: 3, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 0, y: -1, type: 'ghost' },
      { x: 3, y: 0, type: 'normal' },
      { x: 3, y: 1, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: 0, y: 3, type: 'normal' },
    ],
    staticBombs: [
      { x: 2, y: 2, evolution: 0 },
      { x: -1, y: -1, evolution: 0 },
      { x: -2, y: -1, evolution: 2 },
    ]
  },

  // 第68关
  68: {
    gridSize: 6,
    hint: '第68关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 2, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 2, y: 3, type: 'normal' },
      { x: 3, y: 2, type: 'ghost' },
      { x: 0, y: -2, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: 3, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 2, evolution: 2 },
      { x: 2, y: -2, evolution: 0 },
    ]
  },

  // 第69关
  69: {
    gridSize: 6,
    hint: '第69关：消灭所有老鼠！',
    walls: [
      { x: 1, y: 3, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: 2, y: 3, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 0, y: 3, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: -1, y: 3, type: 'ghost' },
    ],
    staticBombs: [
      { x: -2, y: 2, evolution: 2 },
      { x: 0, y: 0, evolution: 2 },
      { x: -1, y: 2, evolution: 0 },
    ]
  },

  // 第70关：★Boss挑战★
  70: {
    gridSize: 6,
    hint: '第70关：★Boss挑战★',
    walls: [
      { x: -1, y: 3, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
      { x: 2, y: 1, type: 'ghost' },
      { x: 1, y: 0, type: 'normal' },
      { x: 1, y: -1, type: 'ghost' },
      { x: 0, y: 3, type: 'ghost' },
      { x: -1, y: 1, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: -2, evolution: 0 },
      { x: 3, y: 0, evolution: 0 },
      { x: -2, y: 2, evolution: 2 },
      { x: 3, y: 1, evolution: 2 },
      { x: 1, y: 1, evolution: 2 },
    ]
  },

  // 第71关
  71: {
    gridSize: 6,
    hint: '第71关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 1, type: 'strong' },
      { x: -1, y: 3, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 3, y: 2, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: -2, y: 0, type: 'ghost' },
    ],
    staticBombs: [
      { x: -2, y: -2, evolution: 3 },
      { x: 1, y: -2, evolution: 2 },
      { x: 0, y: 0, evolution: 3 },
    ]
  },

  // 第72关
  72: {
    gridSize: 6,
    hint: '第72关：消灭所有老鼠！',
    walls: [
      { x: 0, y: -2, type: 'ghost' },
      { x: 0, y: 3, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: 3, y: 2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: 3, evolution: 2 },
      { x: 1, y: 1, evolution: 2 },
    ]
  },

  // 第73关
  73: {
    gridSize: 6,
    hint: '第73关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 1, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: 2, y: 3, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: 0, y: 3, type: 'ghost' },
      { x: -1, y: 2, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: 2, y: 2, evolution: 0 },
      { x: -1, y: 3, evolution: 3 },
    ]
  },

  // 第74关
  74: {
    gridSize: 6,
    hint: '第74关：消灭所有老鼠！',
    walls: [
      { x: 1, y: -2, type: 'strong' },
      { x: -2, y: -2, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: 2, y: 3, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: -1, y: 3, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: -2, y: 1, type: 'ghost' },
      { x: 2, y: -1, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 1, evolution: 3 },
      { x: 0, y: 3, evolution: 2 },
    ]
  },

  // 第75关：★消耗关★
  75: {
    gridSize: 6,
    hint: '第75关：★消耗关★精打细算！',
    walls: [
      { x: 2, y: 2, type: 'ghost' },
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 0, y: 3, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: -2, y: 1, type: 'ghost' },
      { x: -1, y: 3, type: 'ghost' },
      { x: 3, y: 1, type: 'strong' },
      { x: -1, y: -1, type: 'ghost' },
      { x: 3, y: -1, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: -1, evolution: 2 },
      { x: 2, y: 1, evolution: 2 },
      { x: 0, y: -1, evolution: 0 },
      { x: 0, y: 2, evolution: 3 },
    ]
  },

  // 第76关
  76: {
    gridSize: 6,
    hint: '第76关：消灭所有老鼠！',
    walls: [
      { x: 3, y: -2, type: 'normal' },
      { x: 2, y: -2, type: 'strong' },
      { x: -1, y: -2, type: 'normal' },
      { x: 0, y: -2, type: 'strong' },
      { x: 0, y: 1, type: 'normal' },
      { x: 3, y: 2, type: 'ghost' },
      { x: -2, y: -2, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: -1, y: 1, type: 'ghost' },
      { x: -1, y: 3, type: 'strong' },
      { x: 1, y: 0, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 2, evolution: 0 },
      { x: 0, y: -1, evolution: 2 },
      { x: 2, y: 0, evolution: 0 },
    ]
  },

  // 第77关
  77: {
    gridSize: 6,
    hint: '第77关：挑战你的策略极限！',
    walls: [
      { x: -1, y: 1, type: 'normal' },
      { x: 0, y: 1, type: 'strong' },
      { x: 3, y: 3, type: 'strong' },
      { x: -2, y: -1, type: 'strong' },
      { x: 1, y: 1, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: -1, y: 3, type: 'ghost' },
      { x: -2, y: 1, type: 'ghost' },
      { x: 3, y: 1, type: 'normal' },
      { x: 1, y: 2, type: 'ghost' },
      { x: 1, y: 0, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: 0, evolution: 3 },
      { x: -2, y: 3, evolution: 3 },
      { x: 1, y: 3, evolution: 2 },
    ]
  },

  // 第78关
  78: {
    gridSize: 6,
    hint: '第78关：消灭所有老鼠！',
    walls: [
      { x: 0, y: -2, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: 0, y: 3, type: 'normal' },
      { x: 3, y: 2, type: 'normal' },
      { x: -1, y: 3, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 2, y: 3, type: 'strong' },
      { x: -2, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: 1, evolution: 2 },
      { x: -2, y: -2, evolution: 0 },
    ]
  },

  // 第79关
  79: {
    gridSize: 6,
    hint: '第79关：消灭所有老鼠！',
    walls: [
      { x: -1, y: 1, type: 'ghost' },
      { x: -2, y: -1, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: 0, y: 3, type: 'ghost' },
      { x: 3, y: -1, type: 'normal' },
      { x: 2, y: 0, type: 'ghost' },
      { x: -2, y: 1, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: -2, y: 3, type: 'ghost' },
    ],
    staticBombs: [
      { x: 1, y: -1, evolution: 3 },
      { x: 2, y: -1, evolution: 0 },
      { x: 1, y: 0, evolution: 0 },
    ]
  },

  // 第80关：★Boss挑战★
  80: {
    gridSize: 6,
    hint: '第80关：★Boss挑战★',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: -1, y: -2, type: 'ghost' },
      { x: 1, y: -2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: 3, y: 2, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: 0, evolution: 1 },
      { x: 2, y: 3, evolution: 3 },
      { x: -1, y: -1, evolution: 2 },
      { x: 2, y: 1, evolution: 0 },
      { x: -2, y: -1, evolution: 1 },
    ]
  },

  // 第81关
  81: {
    gridSize: 6,
    hint: '第81关：消灭所有老鼠！',
    walls: [
      { x: 1, y: -1, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: 0, y: 3, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: 0, y: 0, type: 'ghost' },
      { x: -1, y: 3, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: 2, evolution: 0 },
      { x: -2, y: 2, evolution: 3 },
      { x: 0, y: -1, evolution: 2 },
    ]
  },

  // 第82关
  82: {
    gridSize: 6,
    hint: '第82关：消灭所有老鼠！',
    walls: [
      { x: 0, y: -2, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: -1, y: 1, type: 'ghost' },
      { x: 0, y: 1, type: 'normal' },
      { x: -2, y: 3, type: 'normal' },
      { x: 3, y: 2, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: 3, y: -2, evolution: 2 },
      { x: -2, y: 0, evolution: 1 },
      { x: 1, y: 3, evolution: 3 },
    ]
  },

  // 第83关
  83: {
    gridSize: 6,
    hint: '第83关：消灭所有老鼠！',
    walls: [
      { x: -1, y: 3, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: 0, y: -1, type: 'ghost' },
      { x: 1, y: 2, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: -1, y: -1, type: 'strong' },
      { x: 0, y: 1, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: 1, y: -2, type: 'ghost' },
      { x: 1, y: 0, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 3, evolution: 3 },
      { x: -1, y: 0, evolution: 3 },
      { x: -1, y: 2, evolution: 1 },
    ]
  },

  // 第84关
  84: {
    gridSize: 6,
    hint: '第84关：挑战你的策略极限！',
    walls: [
      { x: 1, y: -1, type: 'ghost' },
      { x: 1, y: 2, type: 'normal' },
      { x: 0, y: 3, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: 2, y: 3, type: 'ghost' },
      { x: 2, y: 0, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: 3, y: 3, type: 'ghost' },
      { x: 3, y: 1, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: -1, y: 1, type: 'ghost' },
    ],
    staticBombs: [
      { x: -1, y: 0, evolution: 1 },
      { x: -2, y: 3, evolution: 3 },
      { x: -2, y: 1, evolution: 3 },
    ]
  },

  // 第85关：★消耗关★
  85: {
    gridSize: 6,
    hint: '第85关：★消耗关★精打细算！',
    walls: [
      { x: 2, y: -1, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: 2, y: 3, type: 'strong' },
      { x: 0, y: 0, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: 3, y: 1, type: 'ghost' },
      { x: 1, y: -2, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: 1, evolution: 2 },
      { x: 1, y: -1, evolution: 2 },
      { x: -2, y: 0, evolution: 1 },
      { x: 3, y: -1, evolution: 3 },
    ]
  },

  // 第86关
  86: {
    gridSize: 6,
    hint: '第86关：消灭所有老鼠！',
    walls: [
      { x: 0, y: 1, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: 0, y: 3, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 2, evolution: 2 },
      { x: -2, y: 0, evolution: 2 },
      { x: 1, y: -2, evolution: 3 },
    ]
  },

  // 第87关
  87: {
    gridSize: 6,
    hint: '第87关：消灭所有老鼠！',
    walls: [
      { x: 2, y: -2, type: 'normal' },
      { x: 2, y: -1, type: 'ghost' },
      { x: 1, y: -2, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: -1, y: 3, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: -1, y: 2, type: 'ghost' },
    ],
    staticBombs: [
      { x: 2, y: 2, evolution: 0 },
      { x: 0, y: 1, evolution: 1 },
      { x: 0, y: 2, evolution: 0 },
    ]
  },

  // 第88关
  88: {
    gridSize: 6,
    hint: '第88关：消灭所有老鼠！',
    walls: [
      { x: 0, y: 3, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: -1, y: 3, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 1, y: -1, type: 'ghost' },
      { x: 3, y: 0, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: 2, y: 0, type: 'strong' },
    ],
    staticBombs: [
      { x: 3, y: -1, evolution: 0 },
      { x: 1, y: 0, evolution: 0 },
      { x: 2, y: -1, evolution: 1 },
    ]
  },

  // 第89关
  89: {
    gridSize: 6,
    hint: '第89关：消灭所有老鼠！',
    walls: [
      { x: 0, y: 3, type: 'normal' },
      { x: 1, y: 3, type: 'strong' },
      { x: 1, y: -1, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: -2, y: 3, type: 'normal' },
      { x: -1, y: -2, type: 'ghost' },
      { x: 2, y: 0, type: 'normal' },
      { x: 3, y: 2, type: 'strong' },
      { x: -1, y: 0, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: 2, y: 1, evolution: 1 },
      { x: 2, y: -2, evolution: 1 },
      { x: 0, y: -1, evolution: 3 },
    ]
  },

  // 第90关：★Boss挑战★
  90: {
    gridSize: 6,
    hint: '第90关：★Boss挑战★',
    walls: [
      { x: 2, y: 3, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: 2, y: 1, evolution: 1 },
      { x: -1, y: 3, evolution: 1 },
      { x: 1, y: 0, evolution: 1 },
      { x: 2, y: 0, evolution: 0 },
      { x: 3, y: 2, evolution: 3 },
    ]
  },

  // 第91关
  91: {
    gridSize: 6,
    hint: '第91关：挑战你的策略极限！',
    walls: [
      { x: 2, y: -2, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: -2, y: 0, type: 'ghost' },
      { x: 1, y: -2, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: -2, y: 3, type: 'ghost' },
      { x: -2, y: 2, type: 'normal' },
      { x: 1, y: 0, type: 'strong' },
      { x: 2, y: 0, type: 'strong' },
      { x: 2, y: -1, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
    ],
    staticBombs: [
      { x: 2, y: 3, evolution: 3 },
      { x: 3, y: 3, evolution: 0 },
    ]
  },

  // 第92关
  92: {
    gridSize: 6,
    hint: '第92关：消灭所有老鼠！',
    walls: [
      { x: -1, y: 3, type: 'ghost' },
      { x: 3, y: 0, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: 2, y: 3, type: 'strong' },
      { x: -1, y: -1, type: 'normal' },
      { x: 3, y: 2, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: 3, y: 3, evolution: 1 },
      { x: 1, y: 3, evolution: 2 },
    ]
  },

  // 第93关
  93: {
    gridSize: 6,
    hint: '第93关：消灭所有老鼠！',
    walls: [
      { x: 1, y: 0, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: 0, y: 3, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 3, y: 1, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: 2, y: -1, evolution: 3 },
      { x: 1, y: 2, evolution: 2 },
    ]
  },

  // 第94关
  94: {
    gridSize: 6,
    hint: '第94关：消灭所有老鼠！',
    walls: [
      { x: 1, y: 3, type: 'strong' },
      { x: -1, y: 0, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 3, y: 2, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
      { x: 2, y: 3, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: -1, evolution: 3 },
      { x: 0, y: 3, evolution: 0 },
      { x: 0, y: 0, evolution: 0 },
    ]
  },

  // 第95关：★消耗关★
  95: {
    gridSize: 6,
    hint: '第95关：★消耗关★精打细算！',
    walls: [
      { x: 2, y: 0, type: 'normal' },
      { x: 3, y: 2, type: 'normal' },
      { x: 3, y: -2, type: 'ghost' },
      { x: -2, y: 1, type: 'normal' },
      { x: -2, y: 3, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: 2, y: 3, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: 2, y: -2, evolution: 1 },
      { x: -2, y: 0, evolution: 1 },
      { x: 0, y: -1, evolution: 0 },
      { x: 0, y: -2, evolution: 3 },
    ]
  },

  // 第96关
  96: {
    gridSize: 6,
    hint: '第96关：消灭所有老鼠！',
    walls: [
      { x: 1, y: -2, type: 'strong' },
      { x: 0, y: 1, type: 'ghost' },
      { x: 0, y: -1, type: 'ghost' },
      { x: 3, y: 1, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: -1, y: 3, type: 'normal' },
      { x: 0, y: 0, type: 'strong' },
      { x: -2, y: 3, type: 'normal' },
      { x: 2, y: 3, type: 'normal' },
      { x: 1, y: -1, type: 'ghost' },
      { x: -1, y: -2, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: 2, evolution: 0 },
      { x: 3, y: 3, evolution: 1 },
    ]
  },

  // 第97关
  97: {
    gridSize: 6,
    hint: '第97关：消灭所有老鼠！',
    walls: [
      { x: 2, y: -1, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: 1, y: 1, type: 'ghost' },
      { x: 2, y: 2, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 2, y: 3, type: 'normal' },
      { x: -1, y: 1, type: 'ghost' },
      { x: -2, y: 2, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: -2, y: 3, type: 'normal' },
    ],
    staticBombs: [
      { x: 3, y: 3, evolution: 3 },
      { x: 3, y: -1, evolution: 2 },
    ]
  },

  // 第98关
  98: {
    gridSize: 6,
    hint: '第98关：挑战你的策略极限！',
    walls: [
      { x: 1, y: -2, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: -2, y: -2, type: 'ghost' },
      { x: 1, y: 3, type: 'strong' },
      { x: -1, y: -2, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: -2, y: 3, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: 0, evolution: 0 },
      { x: 0, y: 2, evolution: 0 },
    ]
  },

  // 第99关
  99: {
    gridSize: 6,
    hint: '第99关：消灭所有老鼠！',
    walls: [
      { x: 2, y: 3, type: 'strong' },
      { x: 2, y: 0, type: 'ghost' },
      { x: 0, y: 1, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: 0, y: -2, type: 'strong' },
      { x: 1, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: -2, evolution: 2 },
      { x: 2, y: -1, evolution: 3 },
      { x: 1, y: 3, evolution: 0 },
    ]
  },

  // 第100关：★Boss挑战★
  100: {
    gridSize: 6,
    hint: '第100关：★Boss挑战★',
    walls: [
      { x: 2, y: 1, type: 'normal' },
      { x: 0, y: -1, type: 'ghost' },
      { x: -2, y: 1, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 1, y: 3, type: 'strong' },
      { x: 0, y: 0, type: 'normal' },
      { x: 0, y: -2, type: 'strong' },
      { x: -1, y: 3, type: 'normal' },
      { x: 3, y: 2, type: 'normal' },
      { x: 3, y: -2, type: 'ghost' },
    ],
    staticBombs: [
      { x: 1, y: 0, evolution: 2 },
      { x: 0, y: 1, evolution: 0 },
      { x: 3, y: 3, evolution: 3 },
      { x: -1, y: -2, evolution: 0 },
      { x: 0, y: 2, evolution: 0 },
    ]
  },

  // 第101关
  101: {
    gridSize: 7,
    hint: '第101关：进入高级阶段，7x7棋盘！',
    walls: [
      { x: 0, y: 2, type: 'normal' },
      { x: -3, y: 0, type: 'ghost' },
      { x: -1, y: -2, type: 'strong' },
      { x: 3, y: 1, type: 'strong' },
      { x: 0, y: 1, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: 3, y: 3, type: 'strong' },
      { x: -1, y: 2, type: 'strong' },
      { x: 2, y: 2, type: 'normal' },
      { x: -1, y: 3, type: 'normal' },
      { x: -2, y: -3, type: 'normal' },
    ],
    staticBombs: [
      { x: -3, y: 2, evolution: 0 },
      { x: -1, y: 1, evolution: 0 },
      { x: -2, y: -2, evolution: 0 },
    ]
  },

  // 第102关
  102: {
    gridSize: 7,
    hint: '第102关：消灭所有老鼠！',
    walls: [
      { x: 3, y: 1, type: 'strong' },
      { x: 2, y: -1, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: -1, y: 2, type: 'strong' },
      { x: -2, y: 0, type: 'strong' },
      { x: -1, y: 3, type: 'normal' },
      { x: -1, y: -3, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: 3, y: 3, type: 'ghost' },
      { x: 3, y: 0, type: 'strong' },
      { x: 1, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: 0, evolution: 0 },
      { x: 0, y: -2, evolution: 2 },
      { x: 3, y: 2, evolution: 0 },
    ]
  },

  // 第103关
  103: {
    gridSize: 7,
    hint: '第103关：消灭所有老鼠！',
    walls: [
      { x: -2, y: -3, type: 'strong' },
      { x: 1, y: 2, type: 'normal' },
      { x: -3, y: 0, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: 3, y: -3, type: 'ghost' },
      { x: 1, y: 1, type: 'strong' },
      { x: -2, y: 1, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: -2, y: 2, type: 'strong' },
      { x: 1, y: 3, type: 'ghost' },
    ],
    staticBombs: [
      { x: -3, y: -2, evolution: 2 },
      { x: -2, y: 0, evolution: 2 },
      { x: 1, y: 0, evolution: 2 },
    ]
  },

  // 第104关
  104: {
    gridSize: 7,
    hint: '第104关：消灭所有老鼠！',
    walls: [
      { x: 1, y: 2, type: 'ghost' },
      { x: 0, y: 1, type: 'normal' },
      { x: 2, y: -2, type: 'ghost' },
      { x: 1, y: -1, type: 'strong' },
      { x: 2, y: -1, type: 'ghost' },
      { x: -1, y: 3, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: 0, y: 3, type: 'strong' },
      { x: 3, y: -1, type: 'normal' },
      { x: 0, y: -3, type: 'strong' },
      { x: 1, y: -3, type: 'ghost' },
      { x: -1, y: 0, type: 'strong' },
    ],
    staticBombs: [
      { x: 2, y: 2, evolution: 0 },
      { x: -2, y: 2, evolution: 2 },
      { x: -2, y: -1, evolution: 2 },
    ]
  },

  // 第105关：★消耗关★
  105: {
    gridSize: 7,
    hint: '第105关：★消耗关★精打细算！',
    walls: [
      { x: 3, y: -3, type: 'normal' },
      { x: -3, y: -2, type: 'normal' },
      { x: -2, y: 3, type: 'strong' },
      { x: -1, y: -3, type: 'ghost' },
      { x: -1, y: -2, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
      { x: 1, y: 1, type: 'ghost' },
      { x: 1, y: -1, type: 'normal' },
      { x: -3, y: 3, type: 'normal' },
      { x: 2, y: 3, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: 1, y: 0, type: 'ghost' },
      { x: -2, y: -3, type: 'normal' },
      { x: 2, y: 0, type: 'strong' },
      { x: -1, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: -3, y: 0, evolution: 2 },
      { x: 0, y: 1, evolution: 2 },
      { x: -2, y: -1, evolution: 2 },
      { x: 1, y: 3, evolution: 2 },
      { x: -2, y: 0, evolution: 2 },
    ]
  },

  // 第106关
  106: {
    gridSize: 7,
    hint: '第106关：消灭所有老鼠！',
    walls: [
      { x: -3, y: 0, type: 'normal' },
      { x: -1, y: 0, type: 'ghost' },
      { x: -3, y: 3, type: 'strong' },
      { x: -2, y: 0, type: 'strong' },
      { x: 2, y: 0, type: 'strong' },
      { x: 3, y: 3, type: 'ghost' },
      { x: -2, y: 3, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: 3, y: -2, type: 'strong' },
      { x: -1, y: -1, type: 'ghost' },
      { x: 2, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: -1, evolution: 2 },
      { x: 0, y: 2, evolution: 2 },
      { x: 2, y: 3, evolution: 2 },
    ]
  },

  // 第107关
  107: {
    gridSize: 7,
    hint: '第107关：消灭所有老鼠！',
    walls: [
      { x: 0, y: -2, type: 'normal' },
      { x: -1, y: -2, type: 'strong' },
      { x: 3, y: -1, type: 'strong' },
      { x: 2, y: 3, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: 2, y: -3, type: 'normal' },
      { x: 2, y: 0, type: 'ghost' },
      { x: 1, y: 2, type: 'normal' },
      { x: 3, y: 0, type: 'ghost' },
      { x: -3, y: -2, type: 'normal' },
      { x: -1, y: 3, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 0, evolution: 2 },
      { x: -1, y: 1, evolution: 0 },
      { x: 1, y: 3, evolution: 0 },
    ]
  },

  // 第108关
  108: {
    gridSize: 7,
    hint: '第108关：消灭所有老鼠！',
    walls: [
      { x: -3, y: 2, type: 'ghost' },
      { x: 3, y: 3, type: 'strong' },
      { x: -1, y: 2, type: 'ghost' },
      { x: 1, y: 0, type: 'strong' },
      { x: 2, y: 1, type: 'ghost' },
      { x: 2, y: 0, type: 'normal' },
      { x: 0, y: -3, type: 'strong' },
      { x: 2, y: -2, type: 'ghost' },
      { x: -1, y: 0, type: 'ghost' },
      { x: -3, y: 0, type: 'normal' },
      { x: -2, y: -3, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: 2, y: 3, evolution: 2 },
      { x: 1, y: 2, evolution: 2 },
      { x: 3, y: 1, evolution: 0 },
    ]
  },

  // 第109关
  109: {
    gridSize: 7,
    hint: '第109关：消灭所有老鼠！',
    walls: [
      { x: 2, y: 3, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: -3, y: 3, type: 'normal' },
      { x: 1, y: -3, type: 'strong' },
      { x: 2, y: -2, type: 'strong' },
      { x: 0, y: -2, type: 'strong' },
      { x: -2, y: -3, type: 'normal' },
      { x: 0, y: 1, type: 'ghost' },
      { x: 3, y: -3, type: 'normal' },
      { x: 1, y: -1, type: 'strong' },
      { x: 3, y: 3, type: 'normal' },
      { x: 0, y: -3, type: 'normal' },
    ],
    staticBombs: [
      { x: 3, y: 1, evolution: 2 },
      { x: -2, y: -2, evolution: 2 },
      { x: -2, y: 2, evolution: 2 },
    ]
  },

  // 第110关：★Boss挑战★
  110: {
    gridSize: 7,
    hint: '第110关：★Boss挑战★',
    walls: [
      { x: -1, y: 2, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: -3, y: 3, type: 'normal' },
      { x: 2, y: 2, type: 'strong' },
      { x: -2, y: -3, type: 'normal' },
      { x: 3, y: -3, type: 'normal' },
      { x: 0, y: -3, type: 'normal' },
      { x: -1, y: 3, type: 'ghost' },
      { x: 3, y: 0, type: 'strong' },
      { x: 1, y: -2, type: 'normal' },
      { x: 1, y: -3, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: 0, y: 2, type: 'strong' },
      { x: 1, y: -1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: -3, y: 1, type: 'normal' },
      { x: -3, y: 2, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: -2, evolution: 0 },
      { x: 2, y: 1, evolution: 0 },
      { x: 3, y: -1, evolution: 2 },
      { x: -2, y: 3, evolution: 0 },
      { x: 1, y: 0, evolution: 0 },
      { x: 3, y: 1, evolution: 2 },
    ]
  },

  // 第111关
  111: {
    gridSize: 7,
    hint: '第111关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 0, type: 'normal' },
      { x: 0, y: 1, type: 'strong' },
      { x: 2, y: -3, type: 'normal' },
      { x: 2, y: 1, type: 'ghost' },
      { x: -2, y: 2, type: 'normal' },
      { x: -2, y: 3, type: 'normal' },
      { x: -1, y: -3, type: 'ghost' },
      { x: -1, y: -2, type: 'normal' },
      { x: -2, y: -3, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: -1, y: 3, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: 1, evolution: 2 },
      { x: -2, y: -1, evolution: 0 },
      { x: 2, y: 2, evolution: 2 },
    ]
  },

  // 第112关
  112: {
    gridSize: 7,
    hint: '第112关：挑战你的策略极限！',
    walls: [
      { x: -2, y: 0, type: 'ghost' },
      { x: -3, y: -3, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: -2, y: -2, type: 'strong' },
      { x: 0, y: -1, type: 'strong' },
      { x: 2, y: -2, type: 'normal' },
      { x: -3, y: 0, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 3, y: 3, type: 'ghost' },
      { x: 1, y: 2, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: -2, y: -3, type: 'normal' },
      { x: 0, y: -3, type: 'ghost' },
    ],
    staticBombs: [
      { x: -2, y: 2, evolution: 2 },
      { x: -2, y: -1, evolution: 0 },
      { x: 2, y: 0, evolution: 0 },
    ]
  },

  // 第113关
  113: {
    gridSize: 7,
    hint: '第113关：消灭所有老鼠！',
    walls: [
      { x: 2, y: -2, type: 'ghost' },
      { x: 2, y: -1, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: 3, y: 2, type: 'ghost' },
      { x: 2, y: 0, type: 'strong' },
      { x: -1, y: -3, type: 'normal' },
      { x: -1, y: 3, type: 'ghost' },
      { x: 1, y: -3, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: 2, y: -3, type: 'ghost' },
      { x: 1, y: 2, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: -2, evolution: 2 },
      { x: -3, y: -1, evolution: 2 },
      { x: 2, y: 1, evolution: 2 },
    ]
  },

  // 第114关
  114: {
    gridSize: 7,
    hint: '第114关：消灭所有老鼠！',
    walls: [
      { x: 1, y: 0, type: 'normal' },
      { x: -3, y: -2, type: 'strong' },
      { x: -2, y: -1, type: 'ghost' },
      { x: -1, y: 3, type: 'strong' },
      { x: 3, y: 2, type: 'strong' },
      { x: -2, y: -2, type: 'ghost' },
      { x: 0, y: 2, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: 0, y: 1, type: 'strong' },
      { x: 2, y: 2, type: 'ghost' },
      { x: 1, y: -2, type: 'strong' },
      { x: 2, y: 3, type: 'strong' },
      { x: -2, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: 2, y: -3, evolution: 0 },
      { x: -2, y: 2, evolution: 0 },
      { x: 3, y: 3, evolution: 2 },
    ]
  },

  // 第115关：★消耗关★
  115: {
    gridSize: 7,
    hint: '第115关：★消耗关★精打细算！',
    walls: [
      { x: 3, y: 0, type: 'normal' },
      { x: 0, y: -3, type: 'normal' },
      { x: 1, y: 1, type: 'strong' },
      { x: 0, y: -2, type: 'normal' },
      { x: -2, y: 2, type: 'ghost' },
      { x: 2, y: 2, type: 'ghost' },
      { x: -1, y: 3, type: 'normal' },
      { x: 1, y: 0, type: 'ghost' },
      { x: 2, y: -3, type: 'normal' },
      { x: 2, y: -2, type: 'strong' },
      { x: 1, y: -3, type: 'normal' },
      { x: 1, y: -1, type: 'ghost' },
      { x: -2, y: 1, type: 'normal' },
      { x: -2, y: -3, type: 'normal' },
      { x: -3, y: 3, type: 'ghost' },
      { x: 0, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: 3, y: 2, evolution: 0 },
      { x: -2, y: 3, evolution: 2 },
      { x: 0, y: 0, evolution: 2 },
      { x: 3, y: 1, evolution: 2 },
      { x: 1, y: 3, evolution: 2 },
    ]
  },

  // 第116关
  116: {
    gridSize: 7,
    hint: '第116关：消灭所有老鼠！',
    walls: [
      { x: 1, y: 1, type: 'strong' },
      { x: 1, y: -1, type: 'strong' },
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: 0, type: 'strong' },
      { x: 3, y: -1, type: 'strong' },
      { x: 3, y: 0, type: 'ghost' },
      { x: 2, y: 1, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 1, y: 2, type: 'strong' },
      { x: 0, y: -1, type: 'normal' },
      { x: 3, y: 1, type: 'normal' },
      { x: -3, y: 3, type: 'normal' },
    ],
    staticBombs: [
      { x: -1, y: 3, evolution: 0 },
      { x: -1, y: -3, evolution: 0 },
      { x: 3, y: 3, evolution: 0 },
      { x: -3, y: 2, evolution: 0 },
    ]
  },

  // 第117关
  117: {
    gridSize: 7,
    hint: '第117关：消灭所有老鼠！',
    walls: [
      { x: -1, y: -3, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: -2, y: 0, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: -3, y: 2, type: 'ghost' },
      { x: 3, y: -1, type: 'normal' },
      { x: -3, y: 1, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: 3, y: 2, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: -3, y: 3, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: 0, evolution: 0 },
      { x: 2, y: 1, evolution: 0 },
      { x: -2, y: -3, evolution: 0 },
      { x: 2, y: -3, evolution: 0 },
    ]
  },

  // 第118关
  118: {
    gridSize: 7,
    hint: '第118关：消灭所有老鼠！',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: 3, y: -3, type: 'normal' },
      { x: 3, y: 1, type: 'normal' },
      { x: -1, y: 2, type: 'strong' },
      { x: 3, y: 2, type: 'strong' },
      { x: -2, y: -3, type: 'strong' },
      { x: -3, y: -3, type: 'normal' },
      { x: 0, y: -2, type: 'strong' },
      { x: -1, y: -3, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
      { x: -3, y: 3, type: 'normal' },
      { x: 3, y: 3, type: 'strong' },
    ],
    staticBombs: [
      { x: -3, y: 1, evolution: 0 },
      { x: -3, y: 0, evolution: 2 },
      { x: 0, y: 3, evolution: 0 },
      { x: -3, y: 2, evolution: 2 },
    ]
  },

  // 第119关
  119: {
    gridSize: 7,
    hint: '第119关：挑战你的策略极限！',
    walls: [
      { x: -3, y: -1, type: 'ghost' },
      { x: 3, y: 0, type: 'ghost' },
      { x: 0, y: 0, type: 'normal' },
      { x: 2, y: 3, type: 'normal' },
      { x: -3, y: 1, type: 'normal' },
      { x: -2, y: -2, type: 'ghost' },
      { x: 0, y: -3, type: 'normal' },
      { x: 1, y: -3, type: 'strong' },
      { x: 3, y: -2, type: 'normal' },
      { x: -3, y: 0, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 1, y: 1, type: 'strong' },
      { x: 3, y: 2, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: -1, evolution: 0 },
      { x: 1, y: 2, evolution: 0 },
      { x: 0, y: -2, evolution: 2 },
      { x: 0, y: 1, evolution: 2 },
    ]
  },

  // 第120关：★Boss挑战★
  120: {
    gridSize: 7,
    hint: '第120关：★Boss挑战★',
    walls: [
      { x: 1, y: -2, type: 'strong' },
      { x: -2, y: 2, type: 'normal' },
      { x: -3, y: 2, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: 1, y: -3, type: 'normal' },
      { x: 0, y: -1, type: 'strong' },
      { x: -1, y: -3, type: 'normal' },
      { x: -3, y: 3, type: 'normal' },
      { x: 1, y: 2, type: 'ghost' },
      { x: 2, y: 3, type: 'normal' },
      { x: -1, y: 3, type: 'normal' },
      { x: 0, y: 3, type: 'normal' },
      { x: 2, y: 1, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: -3, y: 0, type: 'ghost' },
      { x: -1, y: 1, type: 'strong' },
    ],
    staticBombs: [
      { x: -1, y: -2, evolution: 0 },
      { x: 1, y: 1, evolution: 0 },
      { x: -3, y: -3, evolution: 2 },
      { x: 3, y: -1, evolution: 0 },
      { x: 3, y: 2, evolution: 2 },
      { x: -3, y: 1, evolution: 2 },
    ]
  },

  // 第121关
  121: {
    gridSize: 7,
    hint: '第121关：消灭所有老鼠！',
    walls: [
      { x: -3, y: 0, type: 'strong' },
      { x: -1, y: -3, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: 3, y: 0, type: 'ghost' },
      { x: 2, y: 1, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: -3, y: 3, type: 'normal' },
      { x: 2, y: 0, type: 'strong' },
      { x: -2, y: 0, type: 'strong' },
      { x: -1, y: -1, type: 'ghost' },
      { x: 2, y: 2, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: -2, evolution: 2 },
      { x: -2, y: 1, evolution: 2 },
      { x: 3, y: 3, evolution: 2 },
      { x: -1, y: -2, evolution: 0 },
    ]
  },

  // 第122关
  122: {
    gridSize: 7,
    hint: '第122关：消灭所有老鼠！',
    walls: [
      { x: 3, y: 3, type: 'normal' },
      { x: 0, y: 2, type: 'strong' },
      { x: 2, y: 0, type: 'normal' },
      { x: -1, y: 3, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: 2, y: -1, type: 'normal' },
      { x: 1, y: -3, type: 'strong' },
      { x: -3, y: -2, type: 'strong' },
      { x: 3, y: -3, type: 'normal' },
      { x: -3, y: 1, type: 'normal' },
      { x: 0, y: 3, type: 'strong' },
      { x: -2, y: -3, type: 'ghost' },
      { x: -2, y: -2, type: 'ghost' },
      { x: 2, y: -3, type: 'ghost' },
    ],
    staticBombs: [
      { x: -3, y: 2, evolution: 2 },
      { x: -3, y: 0, evolution: 0 },
      { x: 3, y: -2, evolution: 2 },
      { x: 1, y: 3, evolution: 0 },
    ]
  },

  // 第123关
  123: {
    gridSize: 7,
    hint: '第123关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 0, type: 'ghost' },
      { x: 2, y: -1, type: 'strong' },
      { x: 0, y: -2, type: 'strong' },
      { x: -1, y: -1, type: 'strong' },
      { x: -2, y: -1, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: -2, y: 3, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: -2, y: 1, type: 'ghost' },
      { x: -1, y: 0, type: 'strong' },
    ],
    staticBombs: [
      { x: 3, y: -3, evolution: 2 },
      { x: -1, y: 2, evolution: 0 },
      { x: 1, y: -3, evolution: 0 },
      { x: -3, y: 2, evolution: 0 },
    ]
  },

  // 第124关
  124: {
    gridSize: 7,
    hint: '第124关：消灭所有老鼠！',
    walls: [
      { x: 3, y: 2, type: 'normal' },
      { x: 0, y: -3, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: 1, y: -3, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: 2, y: -3, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: -3, y: 2, type: 'ghost' },
      { x: 1, y: -2, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: -3, y: -1, type: 'ghost' },
      { x: 0, y: 3, type: 'normal' },
      { x: -3, y: 0, type: 'normal' },
    ],
    staticBombs: [
      { x: -3, y: -2, evolution: 0 },
      { x: 2, y: -1, evolution: 0 },
      { x: -3, y: -3, evolution: 0 },
      { x: -1, y: -2, evolution: 2 },
    ]
  },

  // 第125关：★消耗关★
  125: {
    gridSize: 7,
    hint: '第125关：★消耗关★精打细算！',
    walls: [
      { x: 0, y: 0, type: 'strong' },
      { x: 2, y: 3, type: 'strong' },
      { x: 1, y: 0, type: 'strong' },
      { x: 1, y: 2, type: 'strong' },
      { x: 3, y: -2, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: -1, y: -3, type: 'strong' },
      { x: -3, y: 1, type: 'normal' },
      { x: 0, y: -1, type: 'strong' },
      { x: 3, y: -3, type: 'ghost' },
      { x: -3, y: -1, type: 'strong' },
      { x: -2, y: 1, type: 'ghost' },
      { x: 1, y: -3, type: 'strong' },
      { x: 3, y: 2, type: 'ghost' },
      { x: 2, y: 0, type: 'normal' },
      { x: 2, y: -1, type: 'strong' },
    ],
    staticBombs: [
      { x: -3, y: 3, evolution: 3 },
      { x: 0, y: -2, evolution: 3 },
      { x: 2, y: -3, evolution: 3 },
      { x: 1, y: -2, evolution: 3 },
      { x: -2, y: 0, evolution: 3 },
    ]
  },

  // 第126关
  126: {
    gridSize: 7,
    hint: '第126关：挑战你的策略极限！',
    walls: [
      { x: 2, y: 0, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: 3, y: 1, type: 'strong' },
      { x: 0, y: 3, type: 'strong' },
      { x: 2, y: 3, type: 'normal' },
      { x: -2, y: 2, type: 'strong' },
      { x: -3, y: 1, type: 'normal' },
      { x: -3, y: 2, type: 'normal' },
      { x: 0, y: -2, type: 'ghost' },
      { x: -3, y: -2, type: 'strong' },
      { x: -1, y: 0, type: 'strong' },
      { x: 3, y: -3, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: 3, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: 3, evolution: 0 },
      { x: -3, y: 0, evolution: 0 },
      { x: 0, y: -3, evolution: 0 },
      { x: -2, y: -3, evolution: 0 },
    ]
  },

  // 第127关
  127: {
    gridSize: 7,
    hint: '第127关：消灭所有老鼠！',
    walls: [
      { x: -1, y: 1, type: 'strong' },
      { x: 0, y: -3, type: 'normal' },
      { x: -3, y: -2, type: 'strong' },
      { x: 2, y: 1, type: 'strong' },
      { x: 0, y: 1, type: 'ghost' },
      { x: 1, y: -2, type: 'ghost' },
      { x: -1, y: 0, type: 'ghost' },
      { x: -3, y: 2, type: 'strong' },
      { x: -2, y: 0, type: 'ghost' },
      { x: 2, y: -3, type: 'strong' },
      { x: -1, y: 3, type: 'ghost' },
      { x: 1, y: 1, type: 'strong' },
      { x: 2, y: 2, type: 'ghost' },
      { x: 0, y: -1, type: 'normal' },
    ],
    staticBombs: [
      { x: 3, y: -2, evolution: 0 },
      { x: 1, y: 0, evolution: 2 },
      { x: 1, y: -1, evolution: 3 },
      { x: 0, y: 2, evolution: 3 },
    ]
  },

  // 第128关
  128: {
    gridSize: 7,
    hint: '第128关：消灭所有老鼠！',
    walls: [
      { x: 0, y: -1, type: 'strong' },
      { x: 2, y: 1, type: 'ghost' },
      { x: 3, y: 0, type: 'ghost' },
      { x: 0, y: 3, type: 'strong' },
      { x: -3, y: 2, type: 'ghost' },
      { x: -1, y: -3, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: -2, y: 3, type: 'ghost' },
      { x: 2, y: 0, type: 'normal' },
      { x: 1, y: -1, type: 'ghost' },
      { x: 3, y: -2, type: 'strong' },
      { x: -3, y: -1, type: 'ghost' },
      { x: 0, y: 2, type: 'strong' },
      { x: 1, y: 3, type: 'normal' },
    ],
    staticBombs: [
      { x: -3, y: -2, evolution: 3 },
      { x: -1, y: -1, evolution: 0 },
      { x: -2, y: -3, evolution: 3 },
      { x: 1, y: 2, evolution: 2 },
    ]
  },

  // 第129关
  129: {
    gridSize: 7,
    hint: '第129关：消灭所有老鼠！',
    walls: [
      { x: -1, y: 0, type: 'normal' },
      { x: 0, y: 3, type: 'normal' },
      { x: -3, y: 1, type: 'normal' },
      { x: -2, y: 0, type: 'strong' },
      { x: 3, y: 3, type: 'strong' },
      { x: 3, y: -3, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: 2, y: 2, type: 'strong' },
      { x: 1, y: 1, type: 'strong' },
      { x: 2, y: 1, type: 'strong' },
      { x: -2, y: -2, type: 'ghost' },
      { x: 0, y: 0, type: 'strong' },
      { x: -1, y: 2, type: 'normal' },
      { x: 0, y: 2, type: 'strong' },
    ],
    staticBombs: [
      { x: 1, y: -1, evolution: 3 },
      { x: 3, y: 2, evolution: 2 },
      { x: -3, y: 2, evolution: 2 },
      { x: 2, y: -1, evolution: 3 },
    ]
  },

  // 第130关：★Boss挑战★
  130: {
    gridSize: 7,
    hint: '第130关：★Boss挑战★',
    walls: [
      { x: 1, y: -1, type: 'normal' },
      { x: 1, y: -2, type: 'strong' },
      { x: -3, y: 0, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: -1, y: -3, type: 'normal' },
      { x: 0, y: -2, type: 'strong' },
      { x: -2, y: 3, type: 'strong' },
      { x: 3, y: -3, type: 'normal' },
      { x: 0, y: 2, type: 'ghost' },
      { x: 0, y: -3, type: 'strong' },
      { x: 0, y: -1, type: 'normal' },
      { x: 3, y: 0, type: 'ghost' },
      { x: 2, y: -3, type: 'strong' },
      { x: 0, y: 0, type: 'normal' },
      { x: -3, y: 2, type: 'strong' },
    ],
    staticBombs: [
      { x: -1, y: 0, evolution: 3 },
      { x: -2, y: -3, evolution: 0 },
      { x: 2, y: 3, evolution: 2 },
      { x: 0, y: 1, evolution: 0 },
      { x: -3, y: -1, evolution: 2 },
      { x: -3, y: -2, evolution: 2 },
    ]
  },

  // 第131关
  131: {
    gridSize: 7,
    hint: '第131关：消灭所有老鼠！',
    walls: [
      { x: -2, y: -1, type: 'strong' },
      { x: 1, y: 2, type: 'normal' },
      { x: -1, y: -2, type: 'strong' },
      { x: -1, y: 2, type: 'normal' },
      { x: 1, y: -2, type: 'ghost' },
      { x: 0, y: -2, type: 'ghost' },
      { x: -1, y: -1, type: 'ghost' },
      { x: 3, y: 0, type: 'ghost' },
      { x: -2, y: 1, type: 'strong' },
      { x: 1, y: 1, type: 'normal' },
      { x: 1, y: -3, type: 'strong' },
      { x: 0, y: -3, type: 'strong' },
      { x: -3, y: 2, type: 'ghost' },
      { x: -1, y: 1, type: 'normal' },
      { x: 3, y: -1, type: 'strong' },
    ],
    staticBombs: [
      { x: -3, y: 1, evolution: 3 },
      { x: -2, y: 0, evolution: 2 },
      { x: -3, y: -3, evolution: 2 },
      { x: -3, y: -1, evolution: 2 },
      { x: 1, y: -1, evolution: 0 },
    ]
  },

  // 第132关
  132: {
    gridSize: 7,
    hint: '第132关：消灭所有老鼠！',
    walls: [
      { x: -3, y: -1, type: 'normal' },
      { x: -2, y: 2, type: 'ghost' },
      { x: -3, y: 3, type: 'normal' },
      { x: 0, y: -3, type: 'normal' },
      { x: 3, y: -3, type: 'strong' },
      { x: -2, y: 3, type: 'strong' },
      { x: 2, y: 1, type: 'strong' },
      { x: 0, y: 0, type: 'strong' },
      { x: -1, y: 0, type: 'strong' },
      { x: 0, y: 2, type: 'strong' },
      { x: 3, y: -1, type: 'strong' },
      { x: -2, y: 1, type: 'ghost' },
      { x: 1, y: 2, type: 'normal' },
      { x: 0, y: 3, type: 'ghost' },
      { x: 1, y: -3, type: 'strong' },
    ],
    staticBombs: [
      { x: 0, y: -2, evolution: 0 },
      { x: 3, y: 3, evolution: 0 },
      { x: 3, y: 2, evolution: 3 },
      { x: 1, y: -2, evolution: 3 },
      { x: 3, y: 0, evolution: 2 },
    ]
  },

  // 第133关
  133: {
    gridSize: 7,
    hint: '第133关：挑战你的策略极限！',
    walls: [
      { x: 2, y: 1, type: 'ghost' },
      { x: -3, y: -2, type: 'normal' },
      { x: 0, y: 1, type: 'ghost' },
      { x: -3, y: -1, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: 3, y: -2, type: 'ghost' },
      { x: 1, y: -3, type: 'normal' },
      { x: -3, y: 3, type: 'strong' },
      { x: -2, y: 2, type: 'ghost' },
      { x: -3, y: 0, type: 'ghost' },
      { x: 3, y: 0, type: 'ghost' },
      { x: -2, y: -2, type: 'normal' },
      { x: -2, y: -3, type: 'normal' },
      { x: 2, y: -3, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: 0, evolution: 2 },
      { x: -3, y: -3, evolution: 0 },
      { x: 3, y: -1, evolution: 2 },
      { x: -1, y: 3, evolution: 2 },
      { x: 1, y: -1, evolution: 0 },
    ]
  },

  // 第134关
  134: {
    gridSize: 7,
    hint: '第134关：消灭所有老鼠！',
    walls: [
      { x: -1, y: -2, type: 'normal' },
      { x: 3, y: -1, type: 'strong' },
      { x: -1, y: 0, type: 'strong' },
      { x: 0, y: 0, type: 'normal' },
      { x: 2, y: -3, type: 'strong' },
      { x: 1, y: 2, type: 'normal' },
      { x: 0, y: 1, type: 'ghost' },
      { x: -3, y: 1, type: 'strong' },
      { x: -2, y: 3, type: 'strong' },
      { x: 3, y: 1, type: 'strong' },
      { x: 2, y: 2, type: 'ghost' },
      { x: -2, y: -1, type: 'ghost' },
      { x: 1, y: -2, type: 'ghost' },
      { x: -3, y: -2, type: 'strong' },
      { x: -2, y: -3, type: 'ghost' },
    ],
    staticBombs: [
      { x: 2, y: 0, evolution: 2 },
      { x: -2, y: -2, evolution: 2 },
      { x: -3, y: -3, evolution: 3 },
      { x: -2, y: 0, evolution: 3 },
      { x: 3, y: -3, evolution: 3 },
    ]
  },

  // 第135关：★消耗关★
  135: {
    gridSize: 7,
    hint: '第135关：★消耗关★精打细算！',
    walls: [
      { x: -1, y: -2, type: 'normal' },
      { x: -3, y: 3, type: 'normal' },
      { x: -2, y: 2, type: 'strong' },
      { x: -3, y: 2, type: 'ghost' },
      { x: -2, y: 1, type: 'strong' },
      { x: -1, y: 1, type: 'normal' },
      { x: 1, y: 2, type: 'strong' },
      { x: 1, y: -2, type: 'strong' },
      { x: 3, y: 1, type: 'ghost' },
      { x: 1, y: 0, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
      { x: 3, y: -3, type: 'normal' },
      { x: -3, y: 0, type: 'ghost' },
      { x: 2, y: -2, type: 'strong' },
      { x: 2, y: -1, type: 'normal' },
      { x: 0, y: 3, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 1, evolution: 2 },
      { x: 0, y: 0, evolution: 3 },
      { x: -2, y: -3, evolution: 3 },
      { x: 2, y: 0, evolution: 2 },
      { x: 3, y: 3, evolution: 3 },
    ]
  },

  // 第136关
  136: {
    gridSize: 7,
    hint: '第136关：消灭所有老鼠！',
    walls: [
      { x: 1, y: 0, type: 'strong' },
      { x: 1, y: 1, type: 'ghost' },
      { x: -1, y: -3, type: 'ghost' },
      { x: 3, y: -3, type: 'strong' },
      { x: 2, y: 3, type: 'ghost' },
      { x: -2, y: 2, type: 'strong' },
      { x: 2, y: 2, type: 'strong' },
      { x: -1, y: 2, type: 'normal' },
      { x: -3, y: 2, type: 'normal' },
      { x: -1, y: -1, type: 'strong' },
      { x: -2, y: -1, type: 'normal' },
      { x: 0, y: -1, type: 'ghost' },
      { x: -1, y: 0, type: 'ghost' },
      { x: -3, y: -3, type: 'strong' },
      { x: -3, y: -1, type: 'ghost' },
    ],
    staticBombs: [
      { x: 2, y: -2, evolution: 0 },
      { x: 0, y: 2, evolution: 2 },
      { x: 2, y: -1, evolution: 0 },
      { x: 2, y: -3, evolution: 3 },
      { x: 0, y: 1, evolution: 2 },
    ]
  },

  // 第137关
  137: {
    gridSize: 7,
    hint: '第137关：消灭所有老鼠！',
    walls: [
      { x: -3, y: -1, type: 'ghost' },
      { x: 1, y: 3, type: 'ghost' },
      { x: 0, y: 1, type: 'ghost' },
      { x: 3, y: 1, type: 'normal' },
      { x: -2, y: -2, type: 'strong' },
      { x: 1, y: -2, type: 'strong' },
      { x: 0, y: 0, type: 'ghost' },
      { x: -1, y: 0, type: 'normal' },
      { x: 0, y: -3, type: 'ghost' },
      { x: -1, y: -1, type: 'normal' },
      { x: 0, y: 2, type: 'strong' },
      { x: -1, y: -3, type: 'normal' },
      { x: 1, y: 0, type: 'strong' },
      { x: -3, y: -2, type: 'strong' },
      { x: -2, y: 0, type: 'strong' },
    ],
    staticBombs: [
      { x: -2, y: -1, evolution: 0 },
      { x: 0, y: 3, evolution: 0 },
      { x: -3, y: -3, evolution: 3 },
      { x: -1, y: 1, evolution: 2 },
      { x: 3, y: -3, evolution: 2 },
    ]
  },

  // 第138关
  138: {
    gridSize: 7,
    hint: '第138关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 2, type: 'ghost' },
      { x: 2, y: -2, type: 'strong' },
      { x: -1, y: 0, type: 'strong' },
      { x: 3, y: -2, type: 'ghost' },
      { x: -1, y: 3, type: 'strong' },
      { x: 2, y: -1, type: 'strong' },
      { x: 0, y: -2, type: 'normal' },
      { x: -3, y: -1, type: 'normal' },
      { x: -3, y: 2, type: 'strong' },
      { x: -3, y: 1, type: 'normal' },
      { x: -2, y: -1, type: 'ghost' },
      { x: 1, y: 0, type: 'ghost' },
      { x: 3, y: 1, type: 'normal' },
      { x: 1, y: -3, type: 'normal' },
      { x: -2, y: 1, type: 'strong' },
    ],
    staticBombs: [
      { x: 2, y: 3, evolution: 0 },
      { x: 0, y: 3, evolution: 0 },
      { x: -2, y: -3, evolution: 3 },
      { x: 0, y: 2, evolution: 0 },
      { x: -3, y: 0, evolution: 2 },
    ]
  },

  // 第139关
  139: {
    gridSize: 7,
    hint: '第139关：消灭所有老鼠！',
    walls: [
      { x: 2, y: 3, type: 'normal' },
      { x: 2, y: 0, type: 'strong' },
      { x: -3, y: 0, type: 'strong' },
      { x: -2, y: 3, type: 'strong' },
      { x: 1, y: 3, type: 'strong' },
      { x: 0, y: 1, type: 'ghost' },
      { x: -1, y: -2, type: 'normal' },
      { x: -3, y: -2, type: 'ghost' },
      { x: -3, y: 2, type: 'ghost' },
      { x: 3, y: -3, type: 'strong' },
      { x: -1, y: 1, type: 'strong' },
      { x: 1, y: 0, type: 'strong' },
      { x: -2, y: 0, type: 'strong' },
      { x: -1, y: 2, type: 'strong' },
      { x: 2, y: -1, type: 'normal' },
    ],
    staticBombs: [
      { x: 1, y: -3, evolution: 0 },
      { x: -1, y: 0, evolution: 0 },
      { x: 1, y: -1, evolution: 3 },
      { x: 2, y: 2, evolution: 3 },
      { x: 3, y: 1, evolution: 3 },
    ]
  },

  // 第140关：★Boss挑战★
  140: {
    gridSize: 7,
    hint: '第140关：★Boss挑战★',
    walls: [
      { x: -1, y: 3, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: 3, y: 2, type: 'strong' },
      { x: 0, y: -3, type: 'ghost' },
      { x: -1, y: -1, type: 'ghost' },
      { x: -2, y: 1, type: 'ghost' },
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: 2, type: 'normal' },
      { x: 2, y: -3, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: -2, y: -2, type: 'strong' },
      { x: -2, y: 0, type: 'normal' },
      { x: 0, y: 3, type: 'ghost' },
      { x: -3, y: 0, type: 'normal' },
      { x: 3, y: -3, type: 'normal' },
      { x: -1, y: 1, type: 'strong' },
      { x: 2, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 0, evolution: 2 },
      { x: -3, y: -1, evolution: 3 },
      { x: -3, y: 1, evolution: 3 },
      { x: -1, y: -2, evolution: 3 },
      { x: 3, y: 3, evolution: 2 },
      { x: 1, y: 3, evolution: 0 },
    ]
  },

  // 第141关
  141: {
    gridSize: 7,
    hint: '第141关：消灭所有老鼠！',
    walls: [
      { x: -1, y: 3, type: 'strong' },
      { x: 3, y: 0, type: 'strong' },
      { x: 3, y: -1, type: 'strong' },
      { x: 0, y: 3, type: 'normal' },
      { x: -1, y: 1, type: 'strong' },
      { x: 0, y: 1, type: 'normal' },
      { x: 1, y: -2, type: 'normal' },
      { x: -3, y: -1, type: 'strong' },
      { x: -3, y: 3, type: 'strong' },
      { x: 0, y: -1, type: 'strong' },
      { x: 2, y: -3, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: 3, y: -3, type: 'strong' },
      { x: -1, y: 0, type: 'normal' },
      { x: 0, y: 0, type: 'ghost' },
      { x: 3, y: 3, type: 'normal' },
    ],
    staticBombs: [
      { x: 3, y: 2, evolution: 2 },
      { x: 3, y: -2, evolution: 3 },
      { x: 3, y: 1, evolution: 2 },
      { x: 2, y: 0, evolution: 2 },
      { x: -3, y: -2, evolution: 3 },
    ]
  },

  // 第142关
  142: {
    gridSize: 7,
    hint: '第142关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 3, type: 'normal' },
      { x: -3, y: 3, type: 'strong' },
      { x: 2, y: 0, type: 'ghost' },
      { x: 0, y: -2, type: 'ghost' },
      { x: 2, y: -1, type: 'normal' },
      { x: 0, y: -1, type: 'normal' },
      { x: -3, y: -1, type: 'ghost' },
      { x: 3, y: -2, type: 'ghost' },
      { x: 2, y: 3, type: 'ghost' },
      { x: 3, y: 0, type: 'strong' },
      { x: -2, y: -1, type: 'strong' },
      { x: 2, y: 1, type: 'normal' },
      { x: -1, y: 2, type: 'normal' },
      { x: -1, y: -3, type: 'strong' },
      { x: -1, y: 1, type: 'ghost' },
      { x: 3, y: 3, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: 2, evolution: 0 },
      { x: 1, y: 1, evolution: 0 },
      { x: 0, y: 1, evolution: 2 },
      { x: 0, y: -3, evolution: 0 },
      { x: 1, y: -2, evolution: 2 },
    ]
  },

  // 第143关
  143: {
    gridSize: 7,
    hint: '第143关：消灭所有老鼠！',
    walls: [
      { x: 0, y: -2, type: 'ghost' },
      { x: -1, y: 2, type: 'ghost' },
      { x: 1, y: 1, type: 'ghost' },
      { x: -3, y: 2, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: 1, y: -3, type: 'normal' },
      { x: 1, y: 0, type: 'strong' },
      { x: 2, y: 0, type: 'normal' },
      { x: -3, y: 3, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: 3, y: -3, type: 'strong' },
      { x: 3, y: 1, type: 'ghost' },
      { x: 0, y: 3, type: 'normal' },
      { x: 0, y: -3, type: 'normal' },
      { x: 1, y: -2, type: 'ghost' },
    ],
    staticBombs: [
      { x: -1, y: 1, evolution: 0 },
      { x: 3, y: 2, evolution: 3 },
      { x: 0, y: 0, evolution: 2 },
      { x: 2, y: -3, evolution: 0 },
      { x: -3, y: -3, evolution: 3 },
    ]
  },

  // 第144关
  144: {
    gridSize: 7,
    hint: '第144关：消灭所有老鼠！',
    walls: [
      { x: -1, y: -1, type: 'ghost' },
      { x: 3, y: -1, type: 'strong' },
      { x: -3, y: -1, type: 'ghost' },
      { x: -1, y: 1, type: 'strong' },
      { x: -3, y: 0, type: 'normal' },
      { x: 3, y: -3, type: 'normal' },
      { x: 0, y: -1, type: 'strong' },
      { x: 2, y: 3, type: 'strong' },
      { x: -2, y: 2, type: 'normal' },
      { x: 3, y: 2, type: 'normal' },
      { x: 0, y: 3, type: 'normal' },
      { x: -3, y: 2, type: 'strong' },
      { x: 0, y: 2, type: 'strong' },
      { x: 1, y: 1, type: 'normal' },
      { x: -3, y: 3, type: 'strong' },
      { x: 2, y: -3, type: 'strong' },
    ],
    staticBombs: [
      { x: -2, y: -3, evolution: 3 },
      { x: 3, y: 0, evolution: 2 },
      { x: 0, y: 1, evolution: 0 },
      { x: 1, y: 2, evolution: 2 },
      { x: -3, y: 1, evolution: 0 },
    ]
  },

  // 第145关：★消耗关★
  145: {
    gridSize: 7,
    hint: '第145关：★消耗关★精打细算！',
    walls: [
      { x: 1, y: 1, type: 'strong' },
      { x: 0, y: -3, type: 'ghost' },
      { x: -3, y: 0, type: 'ghost' },
      { x: -1, y: 2, type: 'normal' },
      { x: 0, y: -2, type: 'strong' },
      { x: -2, y: -1, type: 'normal' },
      { x: -1, y: 1, type: 'ghost' },
      { x: 3, y: -2, type: 'normal' },
      { x: -3, y: 3, type: 'strong' },
      { x: -1, y: 3, type: 'strong' },
      { x: 0, y: 2, type: 'ghost' },
      { x: -2, y: -3, type: 'strong' },
      { x: 1, y: 3, type: 'strong' },
      { x: 0, y: 3, type: 'normal' },
      { x: -3, y: 2, type: 'strong' },
      { x: 1, y: -1, type: 'normal' },
    ],
    staticBombs: [
      { x: 2, y: 1, evolution: 0 },
      { x: -3, y: -2, evolution: 2 },
      { x: -2, y: 3, evolution: 2 },
      { x: 2, y: 3, evolution: 3 },
      { x: -2, y: 1, evolution: 2 },
    ]
  },

  // 第146关
  146: {
    gridSize: 7,
    hint: '第146关：消灭所有老鼠！',
    walls: [
      { x: 2, y: 0, type: 'normal' },
      { x: -2, y: -3, type: 'normal' },
      { x: -1, y: -2, type: 'strong' },
      { x: -2, y: 0, type: 'strong' },
      { x: -3, y: -1, type: 'ghost' },
      { x: 0, y: 3, type: 'normal' },
      { x: 2, y: 1, type: 'strong' },
      { x: 1, y: -3, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: -3, y: 3, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: -2, y: 1, type: 'ghost' },
      { x: 3, y: -2, type: 'normal' },
      { x: 2, y: 2, type: 'ghost' },
      { x: 1, y: 0, type: 'strong' },
      { x: -3, y: 1, type: 'strong' },
    ],
    staticBombs: [
      { x: 0, y: -3, evolution: 0 },
      { x: 3, y: -3, evolution: 3 },
      { x: 2, y: 3, evolution: 3 },
      { x: -3, y: 2, evolution: 0 },
      { x: -3, y: -3, evolution: 3 },
      { x: 2, y: -3, evolution: 3 },
    ]
  },

  // 第147关
  147: {
    gridSize: 7,
    hint: '第147关：挑战你的策略极限！',
    walls: [
      { x: 1, y: 0, type: 'ghost' },
      { x: -3, y: 1, type: 'normal' },
      { x: 1, y: -3, type: 'strong' },
      { x: 1, y: -1, type: 'strong' },
      { x: 0, y: -1, type: 'ghost' },
      { x: -2, y: 3, type: 'strong' },
      { x: 2, y: 0, type: 'normal' },
      { x: 0, y: 0, type: 'normal' },
      { x: -1, y: -3, type: 'strong' },
      { x: -1, y: 0, type: 'normal' },
      { x: -3, y: 3, type: 'normal' },
      { x: 0, y: 3, type: 'strong' },
      { x: -3, y: 2, type: 'normal' },
      { x: -2, y: -3, type: 'strong' },
      { x: -1, y: 2, type: 'ghost' },
      { x: -2, y: -1, type: 'ghost' },
    ],
    staticBombs: [
      { x: -2, y: -2, evolution: 2 },
      { x: 3, y: -1, evolution: 2 },
      { x: 2, y: 2, evolution: 3 },
      { x: 3, y: -3, evolution: 2 },
      { x: -2, y: 0, evolution: 3 },
      { x: 2, y: -1, evolution: 0 },
    ]
  },

  // 第148关
  148: {
    gridSize: 7,
    hint: '第148关：消灭所有老鼠！',
    walls: [
      { x: 0, y: 2, type: 'ghost' },
      { x: 3, y: -3, type: 'normal' },
      { x: 1, y: -2, type: 'ghost' },
      { x: 2, y: -1, type: 'strong' },
      { x: -1, y: 3, type: 'ghost' },
      { x: 0, y: -3, type: 'strong' },
      { x: 3, y: -2, type: 'normal' },
      { x: -3, y: 0, type: 'normal' },
      { x: -2, y: -2, type: 'ghost' },
      { x: -1, y: 0, type: 'strong' },
      { x: -3, y: 2, type: 'normal' },
      { x: 0, y: -2, type: 'strong' },
      { x: -2, y: -1, type: 'strong' },
      { x: -3, y: -3, type: 'ghost' },
      { x: 3, y: 0, type: 'normal' },
      { x: -2, y: 3, type: 'ghost' },
    ],
    staticBombs: [
      { x: 2, y: 0, evolution: 2 },
      { x: 0, y: 3, evolution: 3 },
      { x: -2, y: -3, evolution: 3 },
      { x: 1, y: -1, evolution: 0 },
      { x: -1, y: 1, evolution: 2 },
      { x: 1, y: 0, evolution: 0 },
    ]
  },

  // 第149关
  149: {
    gridSize: 7,
    hint: '第149关：消灭所有老鼠！',
    walls: [
      { x: 0, y: 2, type: 'strong' },
      { x: 1, y: -1, type: 'strong' },
      { x: -1, y: 1, type: 'normal' },
      { x: 0, y: -1, type: 'ghost' },
      { x: 0, y: 1, type: 'strong' },
      { x: -3, y: -2, type: 'strong' },
      { x: -2, y: -3, type: 'ghost' },
      { x: -3, y: -3, type: 'ghost' },
      { x: 2, y: 0, type: 'strong' },
      { x: 3, y: 2, type: 'strong' },
      { x: 3, y: 1, type: 'strong' },
      { x: -3, y: -1, type: 'strong' },
      { x: -1, y: 3, type: 'strong' },
      { x: 0, y: -2, type: 'normal' },
      { x: -3, y: 0, type: 'strong' },
      { x: 3, y: 3, type: 'strong' },
    ],
    staticBombs: [
      { x: 2, y: 2, evolution: 2 },
      { x: -1, y: -2, evolution: 3 },
      { x: 0, y: 0, evolution: 3 },
      { x: -1, y: -3, evolution: 3 },
      { x: 1, y: -3, evolution: 3 },
      { x: -1, y: 0, evolution: 2 },
    ]
  },

  // 第150关：★Boss挑战★
  150: {
    gridSize: 7,
    hint: '第150关：★Boss挑战★',
    walls: [
      { x: -3, y: 2, type: 'normal' },
      { x: -2, y: -3, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 1, y: 3, type: 'strong' },
      { x: -1, y: -3, type: 'normal' },
      { x: 0, y: 0, type: 'strong' },
      { x: 0, y: -2, type: 'strong' },
      { x: 3, y: 1, type: 'strong' },
      { x: -1, y: -2, type: 'ghost' },
      { x: 2, y: 2, type: 'normal' },
      { x: -3, y: 3, type: 'ghost' },
      { x: -1, y: 3, type: 'normal' },
      { x: -3, y: 1, type: 'ghost' },
      { x: 3, y: 3, type: 'strong' },
      { x: 0, y: -1, type: 'strong' },
      { x: 3, y: -2, type: 'strong' },
      { x: -2, y: 1, type: 'ghost' },
      { x: 3, y: 2, type: 'strong' },
    ],
    staticBombs: [
      { x: 2, y: -2, evolution: 0 },
      { x: 1, y: -1, evolution: 3 },
      { x: 2, y: 0, evolution: 3 },
      { x: 3, y: -1, evolution: 2 },
      { x: -3, y: -3, evolution: 2 },
      { x: -3, y: 0, evolution: 2 },
    ]
  },

  // 第151关
  151: {
    gridSize: 8,
    hint: '第151关：终极挑战，8x8棋盘！',
    walls: [
      { x: 0, y: -3, type: 'ghost' },
      { x: 3, y: -1, type: 'strong' },
      { x: -2, y: -1, type: 'normal' },
      { x: -2, y: 1, type: 'strong' },
      { x: 1, y: 1, type: 'strong' },
      { x: -1, y: 2, type: 'strong' },
      { x: -2, y: -3, type: 'ghost' },
      { x: 2, y: 2, type: 'strong' },
      { x: -3, y: -3, type: 'strong' },
      { x: -1, y: 1, type: 'normal' },
      { x: -2, y: 2, type: 'strong' },
      { x: 0, y: 1, type: 'normal' },
      { x: -3, y: 0, type: 'normal' },
      { x: -3, y: -2, type: 'strong' },
    ],
    staticBombs: [
      { x: 1, y: -1, evolution: 2 },
      { x: 3, y: 1, evolution: 0 },
      { x: -3, y: 1, evolution: 2 },
      { x: -3, y: 2, evolution: 2 },
      { x: 3, y: 2, evolution: 2 },
      { x: -3, y: 3, evolution: 2 },
    ]
  },

  // 第152关
  152: {
    gridSize: 8,
    hint: '第152关：消灭所有老鼠！',
    walls: [
      { x: 0, y: 0, type: 'ghost' },
      { x: 2, y: 0, type: 'normal' },
      { x: 0, y: 4, type: 'ghost' },
      { x: -1, y: -1, type: 'normal' },
      { x: -2, y: -1, type: 'normal' },
      { x: -2, y: 1, type: 'normal' },
      { x: 1, y: 0, type: 'ghost' },
      { x: -1, y: -3, type: 'ghost' },
      { x: -2, y: 3, type: 'normal' },
      { x: 4, y: 1, type: 'strong' },
      { x: -3, y: -1, type: 'strong' },
      { x: -2, y: -2, type: 'normal' },
      { x: 1, y: 3, type: 'normal' },
      { x: 4, y: 2, type: 'strong' },
    ],
    staticBombs: [
      { x: 1, y: -2, evolution: 0 },
      { x: -3, y: 0, evolution: 0 },
      { x: 4, y: -1, evolution: 0 },
      { x: 4, y: 0, evolution: 3 },
      { x: 1, y: -1, evolution: 3 },
      { x: 0, y: -1, evolution: 2 },
    ]
  },

  // 第153关
  153: {
    gridSize: 8,
    hint: '第153关：消灭所有老鼠！',
    walls: [
      { x: 2, y: 2, type: 'ghost' },
      { x: -3, y: 4, type: 'strong' },
      { x: -3, y: -3, type: 'strong' },
      { x: -3, y: 2, type: 'ghost' },
      { x: -1, y: 2, type: 'ghost' },
      { x: -3, y: 0, type: 'strong' },
      { x: 3, y: -3, type: 'ghost' },
      { x: 4, y: 0, type: 'strong' },
      { x: 3, y: 3, type: 'normal' },
      { x: 2, y: -1, type: 'strong' },
      { x: 4, y: -1, type: 'ghost' },
      { x: -3, y: -1, type: 'ghost' },
      { x: -1, y: 1, type: 'strong' },
      { x: 0, y: -2, type: 'strong' },
    ],
    staticBombs: [
      { x: -3, y: 1, evolution: 3 },
      { x: -1, y: 3, evolution: 0 },
      { x: 0, y: 3, evolution: 0 },
      { x: -1, y: 0, evolution: 0 },
      { x: 0, y: 2, evolution: 3 },
      { x: 1, y: 3, evolution: 0 },
    ]
  },

  // 第154关
  154: {
    gridSize: 8,
    hint: '第154关：挑战你的策略极限！',
    walls: [
      { x: -2, y: 3, type: 'strong' },
      { x: -1, y: 4, type: 'strong' },
      { x: 0, y: -3, type: 'ghost' },
      { x: -3, y: 3, type: 'strong' },
      { x: -2, y: -2, type: 'normal' },
      { x: 0, y: 2, type: 'ghost' },
      { x: -3, y: 1, type: 'strong' },
      { x: 0, y: 0, type: 'normal' },
      { x: 3, y: 0, type: 'ghost' },
      { x: -3, y: 2, type: 'normal' },
      { x: 3, y: -1, type: 'normal' },
      { x: -1, y: -2, type: 'ghost' },
      { x: -3, y: -3, type: 'strong' },
      { x: 2, y: -1, type: 'ghost' },
    ],
    staticBombs: [
      { x: 4, y: -2, evolution: 2 },
      { x: -1, y: 3, evolution: 3 },
      { x: -1, y: 2, evolution: 0 },
      { x: 1, y: -1, evolution: 3 },
      { x: 1, y: -3, evolution: 3 },
      { x: 1, y: 2, evolution: 2 },
    ]
  },

  // 第155关：★消耗关★
  155: {
    gridSize: 8,
    hint: '第155关：★消耗关★精打细算！',
    walls: [
      { x: 4, y: -1, type: 'strong' },
      { x: 4, y: 3, type: 'strong' },
      { x: 3, y: 4, type: 'strong' },
      { x: 4, y: 2, type: 'normal' },
      { x: 0, y: 4, type: 'strong' },
      { x: 3, y: -2, type: 'ghost' },
      { x: 1, y: 2, type: 'normal' },
      { x: 0, y: 0, type: 'ghost' },
      { x: 3, y: 1, type: 'strong' },
      { x: -1, y: -1, type: 'strong' },
      { x: -1, y: -3, type: 'normal' },
      { x: -3, y: 3, type: 'normal' },
      { x: -2, y: -1, type: 'strong' },
      { x: -2, y: -2, type: 'strong' },
      { x: 0, y: 3, type: 'strong' },
      { x: -1, y: 0, type: 'strong' },
      { x: -1, y: -2, type: 'strong' },
      { x: 3, y: 3, type: 'normal' },
      { x: -2, y: 2, type: 'ghost' },
      { x: -2, y: 3, type: 'normal' },
    ],
    staticBombs: [
      { x: -3, y: 2, evolution: 2 },
      { x: -2, y: 1, evolution: 3 },
      { x: -3, y: 1, evolution: 2 },
      { x: 4, y: 1, evolution: 0 },
      { x: 1, y: 1, evolution: 2 },
    ]
  },

  // 第156关
  156: {
    gridSize: 8,
    hint: '第156关：消灭所有老鼠！',
    walls: [
      { x: 1, y: 4, type: 'ghost' },
      { x: 1, y: -1, type: 'normal' },
      { x: 4, y: -3, type: 'strong' },
      { x: -3, y: 3, type: 'strong' },
      { x: 0, y: 1, type: 'ghost' },
      { x: -3, y: 4, type: 'ghost' },
      { x: -2, y: 3, type: 'normal' },
      { x: 3, y: 2, type: 'strong' },
      { x: 2, y: -3, type: 'strong' },
      { x: 0, y: -3, type: 'normal' },
      { x: 3, y: 0, type: 'ghost' },
      { x: 0, y: -2, type: 'strong' },
      { x: 1, y: 3, type: 'strong' },
      { x: 2, y: 0, type: 'strong' },
    ],
    staticBombs: [
      { x: 2, y: 2, evolution: 2 },
      { x: 3, y: -1, evolution: 3 },
      { x: 4, y: 0, evolution: 3 },
      { x: -1, y: -2, evolution: 0 },
      { x: -1, y: 3, evolution: 2 },
      { x: -1, y: 1, evolution: 0 },
    ]
  },

  // 第157关
  157: {
    gridSize: 8,
    hint: '第157关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 1, type: 'normal' },
      { x: -3, y: -1, type: 'strong' },
      { x: 3, y: 3, type: 'ghost' },
      { x: 3, y: -2, type: 'ghost' },
      { x: 2, y: -2, type: 'ghost' },
      { x: 1, y: -2, type: 'ghost' },
      { x: 2, y: -1, type: 'strong' },
      { x: -2, y: 2, type: 'strong' },
      { x: 0, y: -3, type: 'normal' },
      { x: -3, y: -2, type: 'normal' },
      { x: -2, y: -2, type: 'ghost' },
      { x: 4, y: 2, type: 'ghost' },
      { x: 2, y: 4, type: 'strong' },
      { x: -1, y: 1, type: 'normal' },
    ],
    staticBombs: [
      { x: 3, y: 1, evolution: 3 },
      { x: 0, y: 1, evolution: 0 },
      { x: 0, y: -2, evolution: 2 },
      { x: 0, y: 3, evolution: 0 },
      { x: 0, y: -1, evolution: 3 },
      { x: -1, y: -3, evolution: 2 },
    ]
  },

  // 第158关
  158: {
    gridSize: 8,
    hint: '第158关：消灭所有老鼠！',
    walls: [
      { x: -1, y: 3, type: 'strong' },
      { x: 1, y: -1, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: 3, y: 4, type: 'strong' },
      { x: 4, y: 1, type: 'normal' },
      { x: -2, y: 4, type: 'strong' },
      { x: 0, y: -1, type: 'strong' },
      { x: 4, y: 0, type: 'strong' },
      { x: -2, y: 1, type: 'ghost' },
      { x: 4, y: 4, type: 'strong' },
      { x: -2, y: 2, type: 'strong' },
      { x: 0, y: -3, type: 'normal' },
      { x: 3, y: -1, type: 'strong' },
      { x: -3, y: 1, type: 'ghost' },
    ],
    staticBombs: [
      { x: -2, y: 3, evolution: 0 },
      { x: 1, y: 1, evolution: 3 },
      { x: -1, y: -1, evolution: 2 },
      { x: -1, y: 1, evolution: 2 },
      { x: -3, y: -3, evolution: 2 },
      { x: 2, y: 0, evolution: 0 },
    ]
  },

  // 第159关
  159: {
    gridSize: 8,
    hint: '第159关：消灭所有老鼠！',
    walls: [
      { x: -3, y: -3, type: 'strong' },
      { x: -1, y: 2, type: 'ghost' },
      { x: 0, y: 4, type: 'ghost' },
      { x: -2, y: 2, type: 'strong' },
      { x: 2, y: 4, type: 'strong' },
      { x: 4, y: 4, type: 'normal' },
      { x: 1, y: -3, type: 'strong' },
      { x: 1, y: 3, type: 'strong' },
      { x: -3, y: -1, type: 'strong' },
      { x: -1, y: 0, type: 'normal' },
      { x: -1, y: -1, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: -3, y: 1, type: 'strong' },
      { x: -3, y: 4, type: 'normal' },
    ],
    staticBombs: [
      { x: 4, y: 1, evolution: 2 },
      { x: -1, y: -3, evolution: 2 },
      { x: 1, y: 2, evolution: 2 },
      { x: 1, y: 0, evolution: 0 },
      { x: -2, y: 1, evolution: 2 },
      { x: 1, y: 1, evolution: 3 },
    ]
  },

  // 第160关：★Boss挑战★
  160: {
    gridSize: 8,
    hint: '第160关：★Boss挑战★',
    walls: [
      { x: 1, y: 1, type: 'ghost' },
      { x: 0, y: 3, type: 'normal' },
      { x: 2, y: -1, type: 'strong' },
      { x: 0, y: 0, type: 'strong' },
      { x: 3, y: 4, type: 'ghost' },
      { x: 3, y: 3, type: 'normal' },
      { x: -1, y: 3, type: 'strong' },
      { x: -1, y: 0, type: 'ghost' },
      { x: -2, y: 1, type: 'strong' },
      { x: 0, y: 1, type: 'ghost' },
      { x: 0, y: 2, type: 'strong' },
      { x: -3, y: -1, type: 'strong' },
      { x: 4, y: -2, type: 'strong' },
      { x: 4, y: -3, type: 'strong' },
      { x: -3, y: 1, type: 'strong' },
      { x: 0, y: -2, type: 'ghost' },
      { x: -2, y: -2, type: 'strong' },
      { x: 1, y: 3, type: 'strong' },
      { x: 3, y: 2, type: 'normal' },
      { x: 4, y: 0, type: 'strong' },
      { x: -1, y: -2, type: 'strong' },
      { x: -3, y: -2, type: 'ghost' },
    ],
    staticBombs: [
      { x: -3, y: 3, evolution: 3 },
      { x: 1, y: 0, evolution: 2 },
      { x: 0, y: 4, evolution: 0 },
      { x: 4, y: 3, evolution: 2 },
      { x: 4, y: -1, evolution: 2 },
      { x: -1, y: 1, evolution: 0 },
    ]
  },

  // 第161关
  161: {
    gridSize: 8,
    hint: '第161关：挑战你的策略极限！',
    walls: [
      { x: 1, y: -1, type: 'strong' },
      { x: -2, y: -2, type: 'ghost' },
      { x: 4, y: 2, type: 'strong' },
      { x: 1, y: 3, type: 'strong' },
      { x: 1, y: 1, type: 'strong' },
      { x: -1, y: 1, type: 'ghost' },
      { x: 2, y: -3, type: 'normal' },
      { x: -2, y: 1, type: 'ghost' },
      { x: 4, y: -2, type: 'ghost' },
      { x: 2, y: -1, type: 'ghost' },
      { x: 1, y: 4, type: 'strong' },
      { x: -2, y: 2, type: 'normal' },
      { x: -3, y: 4, type: 'strong' },
      { x: 3, y: -1, type: 'strong' },
      { x: 1, y: 0, type: 'strong' },
    ],
    staticBombs: [
      { x: -1, y: -3, evolution: 0 },
      { x: 4, y: 1, evolution: 3 },
      { x: -1, y: 4, evolution: 3 },
      { x: -2, y: -3, evolution: 3 },
      { x: 0, y: 1, evolution: 2 },
      { x: -3, y: 2, evolution: 3 },
      { x: -3, y: 0, evolution: 2 },
    ]
  },

  // 第162关
  162: {
    gridSize: 8,
    hint: '第162关：消灭所有老鼠！',
    walls: [
      { x: 4, y: 4, type: 'ghost' },
      { x: 1, y: 3, type: 'ghost' },
      { x: 0, y: 3, type: 'strong' },
      { x: -3, y: 2, type: 'strong' },
      { x: 2, y: 4, type: 'ghost' },
      { x: -1, y: 3, type: 'strong' },
      { x: 4, y: -1, type: 'strong' },
      { x: -2, y: -2, type: 'normal' },
      { x: 4, y: 3, type: 'strong' },
      { x: 2, y: 2, type: 'ghost' },
      { x: -2, y: 0, type: 'strong' },
      { x: 3, y: 3, type: 'ghost' },
      { x: 2, y: 1, type: 'normal' },
      { x: 0, y: 2, type: 'ghost' },
      { x: -1, y: 4, type: 'ghost' },
    ],
    staticBombs: [
      { x: -2, y: 1, evolution: 0 },
      { x: 3, y: 1, evolution: 2 },
      { x: 0, y: -1, evolution: 0 },
      { x: 1, y: -3, evolution: 0 },
      { x: 2, y: 3, evolution: 3 },
      { x: 1, y: 0, evolution: 2 },
      { x: -3, y: 4, evolution: 2 },
    ]
  },

  // 第163关
  163: {
    gridSize: 8,
    hint: '第163关：消灭所有老鼠！',
    walls: [
      { x: -3, y: -3, type: 'ghost' },
      { x: 4, y: 4, type: 'strong' },
      { x: -1, y: -3, type: 'strong' },
      { x: 2, y: 4, type: 'strong' },
      { x: -2, y: 2, type: 'strong' },
      { x: 3, y: 0, type: 'strong' },
      { x: -3, y: -1, type: 'normal' },
      { x: -1, y: 4, type: 'strong' },
      { x: -2, y: -1, type: 'strong' },
      { x: -2, y: -3, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 3, y: -1, type: 'strong' },
      { x: -3, y: 1, type: 'strong' },
      { x: 3, y: -2, type: 'normal' },
      { x: 2, y: 0, type: 'ghost' },
    ],
    staticBombs: [
      { x: -1, y: 2, evolution: 0 },
      { x: -1, y: 1, evolution: 3 },
      { x: -3, y: 0, evolution: 3 },
      { x: -3, y: -2, evolution: 3 },
      { x: -2, y: 3, evolution: 2 },
      { x: 1, y: 0, evolution: 3 },
      { x: -1, y: 3, evolution: 3 },
    ]
  },

  // 第164关
  164: {
    gridSize: 8,
    hint: '第164关：消灭所有老鼠！',
    walls: [
      { x: 4, y: 2, type: 'strong' },
      { x: -3, y: 4, type: 'strong' },
      { x: 3, y: 1, type: 'strong' },
      { x: 2, y: -1, type: 'ghost' },
      { x: -2, y: 4, type: 'normal' },
      { x: 0, y: 2, type: 'strong' },
      { x: -3, y: -1, type: 'normal' },
      { x: 3, y: 4, type: 'ghost' },
      { x: -1, y: 3, type: 'strong' },
      { x: 2, y: 2, type: 'normal' },
      { x: 4, y: -3, type: 'ghost' },
      { x: 1, y: 3, type: 'ghost' },
      { x: -1, y: 4, type: 'strong' },
      { x: 3, y: -3, type: 'ghost' },
      { x: 3, y: -2, type: 'strong' },
    ],
    staticBombs: [
      { x: -2, y: -1, evolution: 2 },
      { x: 0, y: 1, evolution: 3 },
      { x: 0, y: 4, evolution: 3 },
      { x: 1, y: -2, evolution: 0 },
      { x: 1, y: 2, evolution: 0 },
      { x: 4, y: -2, evolution: 0 },
      { x: -2, y: 3, evolution: 2 },
    ]
  },

  // 第165关：★消耗关★
  165: {
    gridSize: 8,
    hint: '第165关：★消耗关★精打细算！',
    walls: [
      { x: 4, y: -1, type: 'strong' },
      { x: 0, y: 3, type: 'ghost' },
      { x: 3, y: 2, type: 'ghost' },
      { x: 3, y: 4, type: 'strong' },
      { x: 0, y: 4, type: 'strong' },
      { x: 1, y: 3, type: 'normal' },
      { x: 4, y: 1, type: 'strong' },
      { x: -1, y: -2, type: 'strong' },
      { x: 4, y: 0, type: 'ghost' },
      { x: 0, y: 0, type: 'ghost' },
      { x: -2, y: -1, type: 'strong' },
      { x: -2, y: -3, type: 'strong' },
      { x: -1, y: -1, type: 'strong' },
      { x: -1, y: 1, type: 'strong' },
      { x: 4, y: -2, type: 'ghost' },
      { x: 4, y: 3, type: 'ghost' },
      { x: 1, y: 0, type: 'strong' },
      { x: 2, y: 1, type: 'ghost' },
      { x: 2, y: 2, type: 'ghost' },
      { x: -1, y: 4, type: 'strong' },
    ],
    staticBombs: [
      { x: -2, y: 2, evolution: 0 },
      { x: 2, y: 3, evolution: 0 },
      { x: 0, y: -3, evolution: 3 },
      { x: 1, y: -3, evolution: 2 },
      { x: 4, y: -3, evolution: 2 },
    ]
  },

  // 第166关
  166: {
    gridSize: 8,
    hint: '第166关：消灭所有老鼠！',
    walls: [
      { x: 2, y: 1, type: 'strong' },
      { x: -3, y: 1, type: 'normal' },
      { x: -2, y: 0, type: 'strong' },
      { x: 3, y: 1, type: 'normal' },
      { x: 1, y: 0, type: 'ghost' },
      { x: 3, y: 2, type: 'strong' },
      { x: 4, y: 1, type: 'strong' },
      { x: 3, y: 0, type: 'strong' },
      { x: 2, y: -3, type: 'strong' },
      { x: -2, y: -2, type: 'strong' },
      { x: -3, y: 4, type: 'ghost' },
      { x: 4, y: -2, type: 'ghost' },
      { x: 4, y: 3, type: 'strong' },
      { x: -1, y: -1, type: 'strong' },
      { x: -2, y: 3, type: 'ghost' },
    ],
    staticBombs: [
      { x: 4, y: 0, evolution: 3 },
      { x: -2, y: -3, evolution: 2 },
      { x: -1, y: -3, evolution: 2 },
      { x: -3, y: 3, evolution: 2 },
      { x: 2, y: 2, evolution: 3 },
      { x: 4, y: -3, evolution: 2 },
      { x: 3, y: -1, evolution: 0 },
    ]
  },

  // 第167关
  167: {
    gridSize: 8,
    hint: '第167关：消灭所有老鼠！',
    walls: [
      { x: 1, y: -3, type: 'strong' },
      { x: -1, y: 1, type: 'normal' },
      { x: 3, y: -3, type: 'strong' },
      { x: 3, y: 0, type: 'strong' },
      { x: 1, y: 3, type: 'normal' },
      { x: 1, y: -1, type: 'strong' },
      { x: 2, y: 4, type: 'ghost' },
      { x: 3, y: -2, type: 'ghost' },
      { x: -3, y: 0, type: 'ghost' },
      { x: 1, y: 0, type: 'strong' },
      { x: 1, y: 1, type: 'strong' },
      { x: 3, y: 1, type: 'ghost' },
      { x: -1, y: -1, type: 'ghost' },
      { x: -1, y: -2, type: 'normal' },
      { x: -2, y: 4, type: 'ghost' },
    ],
    staticBombs: [
      { x: 0, y: 2, evolution: 2 },
      { x: -2, y: 3, evolution: 3 },
      { x: -3, y: 2, evolution: 3 },
      { x: -2, y: 0, evolution: 2 },
      { x: 1, y: 4, evolution: 0 },
      { x: -1, y: 0, evolution: 3 },
      { x: 2, y: -2, evolution: 3 },
    ]
  },

  // 第168关
  168: {
    gridSize: 8,
    hint: '第168关：挑战你的策略极限！',
    walls: [
      { x: 0, y: 4, type: 'strong' },
      { x: -3, y: -2, type: 'ghost' },
      { x: 1, y: 3, type: 'strong' },
      { x: -3, y: -1, type: 'strong' },
      { x: -3, y: 2, type: 'ghost' },
      { x: 3, y: -2, type: 'strong' },
      { x: 4, y: -2, type: 'strong' },
      { x: 4, y: 2, type: 'strong' },
      { x: -1, y: -2, type: 'ghost' },
      { x: 1, y: -3, type: 'strong' },
      { x: 2, y: -3, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: 3, y: 3, type: 'normal' },
      { x: 4, y: 1, type: 'ghost' },
      { x: 1, y: 1, type: 'strong' },
    ],
    staticBombs: [
      { x: -2, y: 1, evolution: 3 },
      { x: 3, y: 2, evolution: 0 },
      { x: 2, y: 3, evolution: 0 },
      { x: 1, y: 4, evolution: 2 },
      { x: 1, y: -1, evolution: 0 },
      { x: 2, y: -1, evolution: 3 },
      { x: -2, y: 4, evolution: 2 },
    ]
  },

  // 第169关
  169: {
    gridSize: 8,
    hint: '第169关：消灭所有老鼠！',
    walls: [
      { x: -3, y: -2, type: 'ghost' },
      { x: -2, y: 4, type: 'strong' },
      { x: 1, y: 1, type: 'normal' },
      { x: -3, y: 0, type: 'strong' },
      { x: 0, y: -3, type: 'ghost' },
      { x: -1, y: 1, type: 'strong' },
      { x: 1, y: -3, type: 'strong' },
      { x: 2, y: 3, type: 'normal' },
      { x: 2, y: 0, type: 'ghost' },
      { x: 4, y: 4, type: 'normal' },
      { x: 0, y: 4, type: 'strong' },
      { x: -2, y: -2, type: 'ghost' },
      { x: 3, y: 1, type: 'strong' },
      { x: 4, y: 0, type: 'ghost' },
      { x: 0, y: -2, type: 'strong' },
    ],
    staticBombs: [
      { x: 3, y: 2, evolution: 0 },
      { x: 0, y: 1, evolution: 2 },
      { x: 0, y: 2, evolution: 0 },
      { x: 1, y: 0, evolution: 0 },
      { x: 1, y: 2, evolution: 3 },
      { x: 3, y: 4, evolution: 0 },
      { x: -2, y: 0, evolution: 2 },
    ]
  },

  // 第170关：★Boss挑战★
  170: {
    gridSize: 8,
    hint: '第170关：★Boss挑战★',
    walls: [
      { x: -1, y: -3, type: 'ghost' },
      { x: -3, y: -3, type: 'ghost' },
      { x: 0, y: -1, type: 'strong' },
      { x: 1, y: 1, type: 'strong' },
      { x: 3, y: 3, type: 'strong' },
      { x: -3, y: 0, type: 'strong' },
      { x: 1, y: 0, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      { x: 4, y: 2, type: 'ghost' },
      { x: 3, y: -2, type: 'strong' },
      { x: -1, y: 1, type: 'strong' },
      { x: 3, y: -1, type: 'strong' },
      { x: 4, y: 3, type: 'strong' },
      { x: 4, y: -2, type: 'normal' },
      { x: -2, y: -3, type: 'strong' },
      { x: 4, y: -1, type: 'strong' },
      { x: 2, y: 1, type: 'strong' },
      { x: -3, y: 1, type: 'strong' },
      { x: -3, y: 3, type: 'normal' },
      { x: 2, y: 3, type: 'ghost' },
      { x: -2, y: 3, type: 'ghost' },
      { x: 2, y: 0, type: 'strong' },
    ],
    staticBombs: [
      { x: 2, y: 2, evolution: 0 },
      { x: -2, y: -2, evolution: 2 },
      { x: -1, y: 2, evolution: 2 },
      { x: 0, y: 0, evolution: 2 },
      { x: 1, y: 4, evolution: 2 },
      { x: 4, y: 4, evolution: 3 },
    ]
  },

  // 第171关
  171: {
    gridSize: 8,
    hint: '第171关：消灭所有老鼠！',
    walls: [
      { x: 2, y: -3, type: 'ghost' },
      { x: -1, y: 1, type: 'normal' },
      { x: -3, y: 1, type: 'strong' },
      { x: 0, y: -1, type: 'strong' },
      { x: 3, y: 4, type: 'normal' },
      { x: -3, y: 4, type: 'strong' },
      { x: 4, y: 3, type: 'strong' },
      { x: -3, y: 0, type: 'strong' },
      { x: 4, y: -2, type: 'strong' },
      { x: 1, y: -2, type: 'normal' },
      { x: -1, y: 4, type: 'normal' },
      { x: 3, y: -2, type: 'ghost' },
      { x: 4, y: 0, type: 'normal' },
      { x: 3, y: -3, type: 'strong' },
      { x: 1, y: -1, type: 'strong' },
      { x: 2, y: -1, type: 'strong' },
    ],
    staticBombs: [
      { x: -2, y: -1, evolution: 3 },
      { x: 4, y: -1, evolution: 3 },
      { x: 2, y: 3, evolution: 2 },
      { x: -2, y: 4, evolution: 2 },
      { x: 2, y: 0, evolution: 2 },
      { x: 4, y: 1, evolution: 2 },
      { x: 0, y: 0, evolution: 3 },
    ]
  },

  // 第172关
  172: {
    gridSize: 8,
    hint: '第172关：消灭所有老鼠！',
    walls: [
      { x: 0, y: -3, type: 'ghost' },
      { x: 4, y: -2, type: 'strong' },
      { x: -2, y: 1, type: 'strong' },
      { x: -1, y: 4, type: 'ghost' },
      { x: 1, y: 3, type: 'ghost' },
      { x: 3, y: 4, type: 'ghost' },
      { x: 0, y: 0, type: 'strong' },
      { x: 0, y: -2, type: 'ghost' },
      { x: -3, y: 4, type: 'strong' },
      { x: 1, y: -1, type: 'strong' },
      { x: -1, y: -2, type: 'strong' },
      { x: 2, y: 0, type: 'ghost' },
      { x: 1, y: 4, type: 'normal' },
      { x: 3, y: 3, type: 'strong' },
      { x: -1, y: 0, type: 'ghost' },
      { x: 4, y: -3, type: 'strong' },
    ],
    staticBombs: [
      { x: -2, y: 3, evolution: 3 },
      { x: 3, y: -1, evolution: 3 },
      { x: -3, y: -1, evolution: 2 },
      { x: -2, y: -1, evolution: 0 },
      { x: 4, y: 1, evolution: 2 },
      { x: -3, y: 3, evolution: 0 },
      { x: 2, y: -1, evolution: 2 },
    ]
  },

  // 第173关
  173: {
    gridSize: 8,
    hint: '第173关：消灭所有老鼠！',
    walls: [
      { x: -3, y: 2, type: 'strong' },
      { x: 0, y: 2, type: 'strong' },
      { x: -1, y: -2, type: 'strong' },
      { x: 0, y: -1, type: 'strong' },
      { x: -2, y: 4, type: 'normal' },
      { x: -3, y: -2, type: 'strong' },
      { x: -3, y: 3, type: 'ghost' },
      { x: 4, y: 4, type: 'strong' },
      { x: 3, y: 2, type: 'normal' },
      { x: 4, y: -1, type: 'strong' },
      { x: 1, y: -1, type: 'strong' },
      { x: 1, y: 1, type: 'ghost' },
      { x: 4, y: 3, type: 'strong' },
      { x: -3, y: 0, type: 'strong' },
      { x: -2, y: 0, type: 'normal' },
      { x: 0, y: 4, type: 'strong' },
    ],
    staticBombs: [
      { x: 2, y: 2, evolution: 2 },
      { x: -1, y: 4, evolution: 0 },
      { x: 4, y: 2, evolution: 0 },
      { x: -1, y: -1, evolution: 3 },
      { x: -1, y: 1, evolution: 3 },
      { x: 1, y: 3, evolution: 3 },
      { x: 0, y: 3, evolution: 2 },
    ]
  },

  // 第174关
  174: {
    gridSize: 8,
    hint: '第174关：消灭所有老鼠！',
    walls: [
      { x: 2, y: -1, type: 'ghost' },
      { x: -1, y: 4, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: -2, y: -2, type: 'ghost' },
      { x: 3, y: 1, type: 'strong' },
      { x: 2, y: -3, type: 'strong' },
      { x: 0, y: 2, type: 'ghost' },
      { x: 4, y: -1, type: 'strong' },
      { x: 3, y: -2, type: 'strong' },
      { x: 1, y: 1, type: 'ghost' },
      { x: 3, y: -3, type: 'normal' },
      { x: 1, y: 3, type: 'ghost' },
      { x: 3, y: 2, type: 'strong' },
      { x: -1, y: 1, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: -1, y: 0, type: 'strong' },
    ],
    staticBombs: [
      { x: 4, y: 1, evolution: 0 },
      { x: -2, y: -3, evolution: 0 },
      { x: 3, y: -1, evolution: 2 },
      { x: 0, y: -1, evolution: 0 },
      { x: -1, y: 2, evolution: 3 },
      { x: 0, y: 4, evolution: 2 },
      { x: 4, y: 3, evolution: 2 },
    ]
  },

  // 第175关：★消耗关★
  175: {
    gridSize: 8,
    hint: '第175关：★消耗关★精打细算！',
    walls: [
      { x: -2, y: 3, type: 'ghost' },
      { x: 1, y: -2, type: 'normal' },
      { x: 3, y: 3, type: 'strong' },
      { x: 2, y: -2, type: 'ghost' },
      { x: 0, y: 0, type: 'strong' },
      { x: 3, y: 2, type: 'strong' },
      { x: -3, y: 3, type: 'ghost' },
      { x: 4, y: 1, type: 'normal' },
      { x: 4, y: 4, type: 'normal' },
      { x: -1, y: -1, type: 'strong' },
      { x: -3, y: 1, type: 'ghost' },
      { x: -1, y: 4, type: 'strong' },
      { x: 4, y: 0, type: 'normal' },
      { x: 1, y: -1, type: 'strong' },
      { x: -3, y: -1, type: 'normal' },
      { x: 3, y: 4, type: 'strong' },
      { x: 0, y: -3, type: 'strong' },
      { x: 0, y: -1, type: 'strong' },
      { x: 2, y: 4, type: 'strong' },
      { x: 0, y: 3, type: 'normal' },
    ],
    staticBombs: [
      { x: 3, y: -1, evolution: 0 },
      { x: 2, y: 2, evolution: 3 },
      { x: 2, y: -3, evolution: 0 },
      { x: -3, y: 4, evolution: 1 },
      { x: 1, y: 3, evolution: 2 },
    ]
  },

  // 第176关
  176: {
    gridSize: 8,
    hint: '第176关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 4, type: 'strong' },
      { x: 1, y: 0, type: 'ghost' },
      { x: 0, y: 1, type: 'strong' },
      { x: 1, y: -2, type: 'strong' },
      { x: -3, y: 0, type: 'strong' },
      { x: -3, y: 3, type: 'ghost' },
      { x: 2, y: 1, type: 'strong' },
      { x: -2, y: -2, type: 'strong' },
      { x: -2, y: 2, type: 'strong' },
      { x: -2, y: 1, type: 'normal' },
      { x: 1, y: -3, type: 'ghost' },
      { x: 4, y: -2, type: 'ghost' },
      { x: -3, y: 4, type: 'ghost' },
      { x: 1, y: -1, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 3, y: 3, type: 'strong' },
    ],
    staticBombs: [
      { x: 1, y: 4, evolution: 2 },
      { x: -2, y: 3, evolution: 3 },
      { x: 2, y: 4, evolution: 3 },
      { x: 2, y: -3, evolution: 3 },
      { x: -1, y: 0, evolution: 1 },
      { x: 3, y: 1, evolution: 2 },
      { x: -3, y: -2, evolution: 3 },
      { x: -1, y: -3, evolution: 0 },
    ]
  },

  // 第177关
  177: {
    gridSize: 8,
    hint: '第177关：消灭所有老鼠！',
    walls: [
      { x: 0, y: -1, type: 'ghost' },
      { x: 1, y: 0, type: 'strong' },
      { x: -1, y: 2, type: 'normal' },
      { x: 4, y: 2, type: 'ghost' },
      { x: 2, y: -3, type: 'ghost' },
      { x: -3, y: 4, type: 'ghost' },
      { x: 3, y: 3, type: 'normal' },
      { x: 0, y: 2, type: 'ghost' },
      { x: 3, y: -1, type: 'ghost' },
      { x: -3, y: 1, type: 'strong' },
      { x: 3, y: 2, type: 'normal' },
      { x: 2, y: 2, type: 'strong' },
      { x: 0, y: 4, type: 'strong' },
      { x: 0, y: -3, type: 'ghost' },
      { x: 1, y: -3, type: 'strong' },
      { x: 1, y: -2, type: 'normal' },
    ],
    staticBombs: [
      { x: -2, y: -3, evolution: 2 },
      { x: 2, y: -1, evolution: 0 },
      { x: -2, y: -2, evolution: 0 },
      { x: -3, y: -3, evolution: 0 },
      { x: -3, y: 0, evolution: 0 },
      { x: 2, y: 3, evolution: 2 },
      { x: 3, y: -3, evolution: 0 },
      { x: -1, y: 4, evolution: 1 },
    ]
  },

  // 第178关
  178: {
    gridSize: 8,
    hint: '第178关：消灭所有老鼠！',
    walls: [
      { x: 2, y: 0, type: 'ghost' },
      { x: -3, y: -3, type: 'ghost' },
      { x: 0, y: -1, type: 'strong' },
      { x: -1, y: 4, type: 'ghost' },
      { x: -1, y: 1, type: 'ghost' },
      { x: 0, y: 1, type: 'ghost' },
      { x: 4, y: 4, type: 'strong' },
      { x: 3, y: 3, type: 'strong' },
      { x: -1, y: 0, type: 'normal' },
      { x: 3, y: -2, type: 'ghost' },
      { x: 0, y: -2, type: 'ghost' },
      { x: -3, y: -1, type: 'strong' },
      { x: 3, y: -3, type: 'strong' },
      { x: 2, y: -2, type: 'strong' },
      { x: -1, y: -1, type: 'ghost' },
      { x: 4, y: 2, type: 'strong' },
    ],
    staticBombs: [
      { x: 4, y: -1, evolution: 2 },
      { x: -2, y: 3, evolution: 1 },
      { x: 2, y: -1, evolution: 0 },
      { x: 2, y: 2, evolution: 1 },
      { x: 2, y: -3, evolution: 2 },
      { x: 0, y: 0, evolution: 2 },
      { x: -3, y: -2, evolution: 1 },
      { x: 4, y: 0, evolution: 2 },
    ]
  },

  // 第179关
  179: {
    gridSize: 8,
    hint: '第179关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 2, type: 'strong' },
      { x: 3, y: 0, type: 'strong' },
      { x: -1, y: 1, type: 'strong' },
      { x: 4, y: 0, type: 'strong' },
      { x: 2, y: 3, type: 'strong' },
      { x: -1, y: 4, type: 'strong' },
      { x: 3, y: 1, type: 'strong' },
      { x: -2, y: 0, type: 'strong' },
      { x: 3, y: -2, type: 'ghost' },
      { x: 1, y: 3, type: 'ghost' },
      { x: 2, y: 0, type: 'strong' },
      { x: 2, y: 2, type: 'ghost' },
      { x: -2, y: -1, type: 'strong' },
      { x: 1, y: 4, type: 'ghost' },
      { x: -3, y: 2, type: 'strong' },
      { x: 0, y: 2, type: 'strong' },
    ],
    staticBombs: [
      { x: -3, y: 3, evolution: 1 },
      { x: -1, y: 0, evolution: 1 },
      { x: -3, y: -2, evolution: 1 },
      { x: 2, y: -2, evolution: 0 },
      { x: 2, y: -1, evolution: 3 },
      { x: -2, y: -2, evolution: 1 },
      { x: -2, y: 3, evolution: 0 },
      { x: 3, y: 2, evolution: 0 },
    ]
  },

  // 第180关：★Boss挑战★
  180: {
    gridSize: 8,
    hint: '第180关：★Boss挑战★',
    walls: [
      { x: -2, y: -2, type: 'strong' },
      { x: 2, y: 3, type: 'strong' },
      { x: -1, y: 1, type: 'normal' },
      { x: 0, y: 1, type: 'normal' },
      { x: -3, y: 4, type: 'normal' },
      { x: 4, y: -3, type: 'normal' },
      { x: -1, y: 0, type: 'ghost' },
      { x: 0, y: 2, type: 'ghost' },
      { x: 0, y: -3, type: 'ghost' },
      { x: 1, y: -3, type: 'strong' },
      { x: -1, y: -2, type: 'strong' },
      { x: -1, y: 4, type: 'normal' },
      { x: 3, y: -2, type: 'strong' },
      { x: 0, y: 4, type: 'ghost' },
      { x: -2, y: 4, type: 'strong' },
      { x: 4, y: 3, type: 'normal' },
      { x: 4, y: -2, type: 'normal' },
      { x: -1, y: -1, type: 'ghost' },
      { x: 1, y: 0, type: 'strong' },
      { x: 2, y: 4, type: 'ghost' },
      { x: 0, y: -1, type: 'strong' },
      { x: -2, y: -3, type: 'ghost' },
    ],
    staticBombs: [
      { x: 2, y: -3, evolution: 1 },
      { x: 2, y: -1, evolution: 1 },
      { x: -1, y: 2, evolution: 2 },
      { x: -1, y: 3, evolution: 3 },
      { x: 1, y: -2, evolution: 1 },
      { x: -3, y: 0, evolution: 0 },
    ]
  },

  // 第181关
  181: {
    gridSize: 8,
    hint: '第181关：消灭所有老鼠！',
    walls: [
      { x: 2, y: -2, type: 'strong' },
      { x: 4, y: -2, type: 'normal' },
      { x: -1, y: -2, type: 'normal' },
      { x: -1, y: -1, type: 'strong' },
      { x: -3, y: 2, type: 'ghost' },
      { x: -3, y: -3, type: 'ghost' },
      { x: -3, y: 1, type: 'strong' },
      { x: 3, y: 1, type: 'strong' },
      { x: -1, y: 3, type: 'strong' },
      { x: 2, y: 0, type: 'strong' },
      { x: 3, y: 2, type: 'strong' },
      { x: 4, y: 4, type: 'strong' },
      { x: -2, y: -2, type: 'ghost' },
      { x: 2, y: -3, type: 'strong' },
      { x: 1, y: -1, type: 'ghost' },
      { x: 4, y: 0, type: 'strong' },
      { x: 0, y: 0, type: 'normal' },
    ],
    staticBombs: [
      { x: 3, y: 0, evolution: 1 },
      { x: 1, y: 2, evolution: 0 },
      { x: -2, y: 2, evolution: 0 },
      { x: 2, y: 3, evolution: 1 },
      { x: 0, y: -3, evolution: 3 },
      { x: 0, y: 3, evolution: 2 },
      { x: -2, y: -1, evolution: 2 },
      { x: -2, y: 3, evolution: 3 },
    ]
  },

  // 第182关
  182: {
    gridSize: 8,
    hint: '第182关：挑战你的策略极限！',
    walls: [
      { x: 2, y: 3, type: 'strong' },
      { x: 4, y: 4, type: 'strong' },
      { x: 1, y: -3, type: 'ghost' },
      { x: -1, y: 2, type: 'strong' },
      { x: 2, y: 1, type: 'strong' },
      { x: -3, y: 1, type: 'ghost' },
      { x: 1, y: 0, type: 'ghost' },
      { x: 1, y: 3, type: 'strong' },
      { x: 2, y: 2, type: 'strong' },
      { x: 0, y: -1, type: 'ghost' },
      { x: 1, y: -2, type: 'strong' },
      { x: 4, y: 2, type: 'strong' },
      { x: 4, y: 1, type: 'strong' },
      { x: 3, y: 4, type: 'strong' },
      { x: -3, y: 2, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: 4, type: 'ghost' },
    ],
    staticBombs: [
      { x: 0, y: 2, evolution: 2 },
      { x: -2, y: 1, evolution: 3 },
      { x: 3, y: 1, evolution: 0 },
      { x: 2, y: -2, evolution: 1 },
      { x: -2, y: -3, evolution: 1 },
      { x: -1, y: 1, evolution: 3 },
      { x: -2, y: 3, evolution: 3 },
      { x: 2, y: -3, evolution: 1 },
    ]
  },

  // 第183关
  183: {
    gridSize: 8,
    hint: '第183关：消灭所有老鼠！',
    walls: [
      { x: 0, y: 4, type: 'ghost' },
      { x: 2, y: -1, type: 'normal' },
      { x: 3, y: -1, type: 'strong' },
      { x: -1, y: -2, type: 'strong' },
      { x: -3, y: 4, type: 'strong' },
      { x: 4, y: -2, type: 'strong' },
      { x: 1, y: 0, type: 'ghost' },
      { x: -1, y: -3, type: 'strong' },
      { x: 4, y: -3, type: 'ghost' },
      { x: 3, y: 3, type: 'strong' },
      { x: 1, y: 2, type: 'strong' },
      { x: 1, y: -3, type: 'strong' },
      { x: -2, y: 3, type: 'normal' },
      { x: -3, y: 3, type: 'normal' },
      { x: 4, y: -1, type: 'ghost' },
      { x: 2, y: 4, type: 'strong' },
      { x: 2, y: 2, type: 'strong' },
    ],
    staticBombs: [
      { x: 0, y: 3, evolution: 2 },
      { x: -2, y: 1, evolution: 3 },
      { x: -3, y: 0, evolution: 3 },
      { x: 2, y: 0, evolution: 3 },
      { x: 0, y: 0, evolution: 1 },
      { x: 4, y: 0, evolution: 1 },
      { x: -3, y: 1, evolution: 1 },
      { x: 3, y: 4, evolution: 1 },
    ]
  },

  // 第184关
  184: {
    gridSize: 8,
    hint: '第184关：消灭所有老鼠！',
    walls: [
      { x: -3, y: 1, type: 'strong' },
      { x: 0, y: 3, type: 'ghost' },
      { x: 2, y: -3, type: 'normal' },
      { x: 3, y: 1, type: 'strong' },
      { x: -2, y: -1, type: 'ghost' },
      { x: 4, y: 4, type: 'strong' },
      { x: -2, y: 3, type: 'ghost' },
      { x: 2, y: 3, type: 'strong' },
      { x: 2, y: 4, type: 'strong' },
      { x: 3, y: 4, type: 'ghost' },
      { x: 4, y: 0, type: 'ghost' },
      { x: -2, y: -2, type: 'normal' },
      { x: -1, y: 2, type: 'strong' },
      { x: 4, y: 2, type: 'ghost' },
      { x: 4, y: -3, type: 'strong' },
      { x: 0, y: 0, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
    ],
    staticBombs: [
      { x: 0, y: -1, evolution: 1 },
      { x: 4, y: 3, evolution: 0 },
      { x: 2, y: -2, evolution: 3 },
      { x: 2, y: -1, evolution: 3 },
      { x: -1, y: 0, evolution: 0 },
      { x: 0, y: -2, evolution: 3 },
      { x: -2, y: -3, evolution: 0 },
      { x: 0, y: 1, evolution: 0 },
    ]
  },

  // 第185关：★消耗关★
  185: {
    gridSize: 8,
    hint: '第185关：★消耗关★精打细算！',
    walls: [
      { x: 3, y: 0, type: 'strong' },
      { x: 4, y: 0, type: 'strong' },
      { x: 2, y: -1, type: 'normal' },
      { x: -1, y: -2, type: 'strong' },
      { x: -1, y: 1, type: 'strong' },
      { x: 1, y: 4, type: 'ghost' },
      { x: 2, y: 3, type: 'normal' },
      { x: 4, y: 3, type: 'strong' },
      { x: 3, y: -1, type: 'strong' },
      { x: 3, y: 2, type: 'ghost' },
      { x: 3, y: 4, type: 'strong' },
      { x: 0, y: 3, type: 'ghost' },
      { x: 1, y: 0, type: 'strong' },
      { x: 3, y: -2, type: 'ghost' },
      { x: 2, y: 4, type: 'ghost' },
      { x: -3, y: 1, type: 'normal' },
      { x: 2, y: -3, type: 'strong' },
      { x: -2, y: -2, type: 'strong' },
      { x: 1, y: 2, type: 'strong' },
      { x: -3, y: -2, type: 'ghost' },
    ],
    staticBombs: [
      { x: -1, y: 2, evolution: 3 },
      { x: -2, y: 2, evolution: 0 },
      { x: 4, y: 1, evolution: 3 },
      { x: 0, y: 1, evolution: 1 },
      { x: 0, y: -1, evolution: 0 },
    ]
  },

  // 第186关
  186: {
    gridSize: 8,
    hint: '第186关：消灭所有老鼠！',
    walls: [
      { x: 0, y: -1, type: 'strong' },
      { x: -1, y: 0, type: 'ghost' },
      { x: 3, y: -2, type: 'strong' },
      { x: 1, y: -3, type: 'ghost' },
      { x: 3, y: 4, type: 'strong' },
      { x: -1, y: 3, type: 'ghost' },
      { x: -2, y: 3, type: 'strong' },
      { x: -2, y: 0, type: 'ghost' },
      { x: 3, y: 0, type: 'normal' },
      { x: 1, y: 4, type: 'normal' },
      { x: 3, y: 1, type: 'normal' },
      { x: 0, y: -3, type: 'strong' },
      { x: -1, y: 2, type: 'ghost' },
      { x: 0, y: -2, type: 'ghost' },
      { x: 4, y: 1, type: 'ghost' },
      { x: 1, y: 3, type: 'ghost' },
      { x: -3, y: 0, type: 'strong' },
    ],
    staticBombs: [
      { x: 0, y: 0, evolution: 2 },
      { x: 0, y: 4, evolution: 0 },
      { x: -3, y: -1, evolution: 0 },
      { x: -3, y: 1, evolution: 3 },
      { x: -2, y: 2, evolution: 1 },
      { x: -2, y: 4, evolution: 2 },
      { x: -3, y: 2, evolution: 0 },
      { x: 4, y: -3, evolution: 0 },
    ]
  },

  // 第187关
  187: {
    gridSize: 8,
    hint: '第187关：消灭所有老鼠！',
    walls: [
      { x: -3, y: 0, type: 'strong' },
      { x: -3, y: -1, type: 'strong' },
      { x: -2, y: 0, type: 'ghost' },
      { x: 0, y: -1, type: 'strong' },
      { x: 2, y: 2, type: 'strong' },
      { x: -2, y: 2, type: 'ghost' },
      { x: -3, y: 3, type: 'strong' },
      { x: -3, y: 2, type: 'ghost' },
      { x: 4, y: -1, type: 'ghost' },
      { x: -3, y: -3, type: 'ghost' },
      { x: 0, y: -2, type: 'strong' },
      { x: 0, y: 3, type: 'ghost' },
      { x: -1, y: -3, type: 'ghost' },
      { x: 0, y: 0, type: 'strong' },
      { x: 4, y: 2, type: 'strong' },
      { x: 2, y: -1, type: 'strong' },
      { x: -1, y: 3, type: 'ghost' },
    ],
    staticBombs: [
      { x: -2, y: 4, evolution: 2 },
      { x: -2, y: 3, evolution: 3 },
      { x: -2, y: -2, evolution: 1 },
      { x: -3, y: 1, evolution: 0 },
      { x: -3, y: 4, evolution: 0 },
      { x: 3, y: 2, evolution: 2 },
      { x: 3, y: 3, evolution: 3 },
      { x: 2, y: 4, evolution: 3 },
    ]
  },

  // 第188关
  188: {
    gridSize: 8,
    hint: '第188关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 0, type: 'normal' },
      { x: 4, y: 1, type: 'ghost' },
      { x: 2, y: 1, type: 'strong' },
      { x: -2, y: 1, type: 'strong' },
      { x: 4, y: -3, type: 'strong' },
      { x: -2, y: -3, type: 'ghost' },
      { x: 0, y: 4, type: 'strong' },
      { x: 3, y: 0, type: 'strong' },
      { x: 2, y: 0, type: 'strong' },
      { x: 3, y: 3, type: 'strong' },
      { x: 1, y: -3, type: 'ghost' },
      { x: 0, y: -2, type: 'normal' },
      { x: -2, y: 4, type: 'strong' },
      { x: -1, y: -3, type: 'strong' },
      { x: 3, y: -1, type: 'normal' },
      { x: 1, y: -2, type: 'strong' },
      { x: -3, y: -1, type: 'ghost' },
    ],
    staticBombs: [
      { x: 4, y: 2, evolution: 3 },
      { x: 3, y: 2, evolution: 1 },
      { x: -3, y: 4, evolution: 3 },
      { x: 0, y: 0, evolution: 0 },
      { x: 4, y: -1, evolution: 1 },
      { x: 1, y: 0, evolution: 2 },
      { x: 3, y: 4, evolution: 1 },
      { x: 0, y: 2, evolution: 3 },
    ]
  },

  // 第189关
  189: {
    gridSize: 8,
    hint: '第189关：挑战你的策略极限！',
    walls: [
      { x: 0, y: 0, type: 'strong' },
      { x: -2, y: 2, type: 'ghost' },
      { x: 1, y: 1, type: 'ghost' },
      { x: 0, y: -2, type: 'strong' },
      { x: 3, y: -3, type: 'strong' },
      { x: 3, y: 1, type: 'normal' },
      { x: -3, y: 4, type: 'ghost' },
      { x: -3, y: 3, type: 'strong' },
      { x: -1, y: 1, type: 'ghost' },
      { x: -1, y: 2, type: 'strong' },
      { x: 0, y: -3, type: 'strong' },
      { x: 3, y: 3, type: 'strong' },
      { x: 3, y: 2, type: 'strong' },
      { x: -2, y: 1, type: 'strong' },
      { x: -1, y: -1, type: 'ghost' },
      { x: 1, y: -3, type: 'strong' },
      { x: 1, y: 4, type: 'ghost' },
    ],
    staticBombs: [
      { x: 2, y: -1, evolution: 3 },
      { x: -3, y: 1, evolution: 2 },
      { x: 4, y: 0, evolution: 2 },
      { x: 3, y: 0, evolution: 3 },
      { x: 2, y: 3, evolution: 0 },
      { x: 2, y: -3, evolution: 0 },
      { x: -3, y: -3, evolution: 1 },
      { x: 1, y: 2, evolution: 3 },
    ]
  },

  // 第190关：★Boss挑战★
  190: {
    gridSize: 8,
    hint: '第190关：★Boss挑战★',
    walls: [
      { x: 0, y: -3, type: 'ghost' },
      { x: 0, y: 3, type: 'strong' },
      { x: 2, y: 1, type: 'normal' },
      { x: 4, y: 0, type: 'strong' },
      { x: 1, y: 1, type: 'strong' },
      { x: 0, y: 4, type: 'ghost' },
      { x: 1, y: 4, type: 'ghost' },
      { x: 2, y: 3, type: 'strong' },
      { x: -3, y: 4, type: 'strong' },
      { x: 2, y: -2, type: 'strong' },
      { x: -1, y: 2, type: 'ghost' },
      { x: -3, y: 2, type: 'strong' },
      { x: 1, y: 3, type: 'ghost' },
      { x: 3, y: -3, type: 'ghost' },
      { x: -1, y: 3, type: 'ghost' },
      { x: 3, y: 2, type: 'strong' },
      { x: 0, y: -1, type: 'strong' },
      { x: 2, y: 4, type: 'strong' },
      { x: 4, y: -2, type: 'ghost' },
      { x: 4, y: 4, type: 'ghost' },
      { x: -2, y: 3, type: 'normal' },
      { x: 4, y: -3, type: 'ghost' },
    ],
    staticBombs: [
      { x: -2, y: -2, evolution: 3 },
      { x: 4, y: -1, evolution: 2 },
      { x: 4, y: 1, evolution: 1 },
      { x: -2, y: 4, evolution: 3 },
      { x: 0, y: 2, evolution: 0 },
      { x: 1, y: -3, evolution: 1 },
    ]
  },

  // 第191关
  191: {
    gridSize: 8,
    hint: '第191关：消灭所有老鼠！',
    walls: [
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: 2, type: 'strong' },
      { x: 3, y: -1, type: 'ghost' },
      { x: 0, y: 3, type: 'ghost' },
      { x: 2, y: -1, type: 'normal' },
      { x: 0, y: 0, type: 'ghost' },
      { x: -3, y: -3, type: 'strong' },
      { x: -2, y: 2, type: 'strong' },
      { x: -1, y: -3, type: 'strong' },
      { x: -2, y: 1, type: 'ghost' },
      { x: 0, y: 1, type: 'strong' },
      { x: 3, y: 0, type: 'strong' },
      { x: 0, y: 4, type: 'strong' },
      { x: 1, y: 1, type: 'strong' },
      { x: -2, y: 3, type: 'strong' },
      { x: -3, y: 2, type: 'strong' },
      { x: -1, y: 3, type: 'ghost' },
      { x: 4, y: 2, type: 'strong' },
    ],
    staticBombs: [
      { x: 0, y: -1, evolution: 2 },
      { x: 3, y: 1, evolution: 0 },
      { x: 3, y: 4, evolution: 2 },
      { x: 3, y: -3, evolution: 2 },
      { x: -1, y: 4, evolution: 1 },
      { x: 1, y: 4, evolution: 1 },
      { x: -1, y: -1, evolution: 3 },
      { x: -2, y: 0, evolution: 0 },
      { x: 2, y: 0, evolution: 1 },
    ]
  },

  // 第192关
  192: {
    gridSize: 8,
    hint: '第192关：消灭所有老鼠！',
    walls: [
      { x: 3, y: 4, type: 'normal' },
      { x: 1, y: 2, type: 'strong' },
      { x: -1, y: -1, type: 'ghost' },
      { x: -2, y: -3, type: 'strong' },
      { x: -2, y: 4, type: 'strong' },
      { x: -1, y: 0, type: 'strong' },
      { x: 2, y: 1, type: 'ghost' },
      { x: 0, y: 0, type: 'strong' },
      { x: -3, y: -2, type: 'strong' },
      { x: 4, y: 1, type: 'ghost' },
      { x: -3, y: 1, type: 'ghost' },
      { x: 3, y: -3, type: 'ghost' },
      { x: 3, y: 3, type: 'ghost' },
      { x: 0, y: 3, type: 'strong' },
      { x: -3, y: 2, type: 'strong' },
      { x: 1, y: 0, type: 'strong' },
      { x: 0, y: 1, type: 'ghost' },
      { x: -2, y: 1, type: 'ghost' },
    ],
    staticBombs: [
      { x: 2, y: 4, evolution: 0 },
      { x: 3, y: 2, evolution: 2 },
      { x: -2, y: 2, evolution: 2 },
      { x: -3, y: 0, evolution: 2 },
      { x: 4, y: -2, evolution: 0 },
      { x: 3, y: -2, evolution: 0 },
      { x: -2, y: -1, evolution: 3 },
      { x: 3, y: 1, evolution: 0 },
      { x: 4, y: -1, evolution: 3 },
    ]
  },

  // 第193关
  193: {
    gridSize: 8,
    hint: '第193关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 0, type: 'ghost' },
      { x: 3, y: -3, type: 'ghost' },
      { x: 0, y: 2, type: 'ghost' },
      { x: 1, y: 1, type: 'strong' },
      { x: -3, y: -2, type: 'ghost' },
      { x: 4, y: 2, type: 'ghost' },
      { x: 4, y: 0, type: 'strong' },
      { x: -1, y: 3, type: 'strong' },
      { x: 1, y: -1, type: 'strong' },
      { x: -1, y: 2, type: 'strong' },
      { x: 3, y: -2, type: 'ghost' },
      { x: -1, y: 1, type: 'strong' },
      { x: 0, y: -2, type: 'strong' },
      { x: 2, y: -2, type: 'ghost' },
      { x: -1, y: 0, type: 'strong' },
      { x: 2, y: 3, type: 'ghost' },
      { x: 0, y: 1, type: 'normal' },
      { x: -3, y: 3, type: 'ghost' },
    ],
    staticBombs: [
      { x: -2, y: 3, evolution: 3 },
      { x: 3, y: 1, evolution: 3 },
      { x: 3, y: 4, evolution: 3 },
      { x: -3, y: 1, evolution: 3 },
      { x: -1, y: 4, evolution: 3 },
      { x: 3, y: -1, evolution: 2 },
      { x: -2, y: 2, evolution: 1 },
      { x: 0, y: -1, evolution: 2 },
      { x: 2, y: 2, evolution: 1 },
    ]
  },

  // 第194关
  194: {
    gridSize: 8,
    hint: '第194关：消灭所有老鼠！',
    walls: [
      { x: 1, y: 1, type: 'ghost' },
      { x: 0, y: -3, type: 'ghost' },
      { x: 2, y: 3, type: 'ghost' },
      { x: 0, y: 4, type: 'strong' },
      { x: 0, y: 3, type: 'strong' },
      { x: -3, y: 2, type: 'ghost' },
      { x: 3, y: 2, type: 'ghost' },
      { x: 0, y: -1, type: 'normal' },
      { x: 0, y: 0, type: 'strong' },
      { x: 2, y: 2, type: 'strong' },
      { x: 3, y: 3, type: 'strong' },
      { x: 1, y: 0, type: 'strong' },
      { x: 4, y: -1, type: 'ghost' },
      { x: -1, y: -1, type: 'ghost' },
      { x: -1, y: -3, type: 'strong' },
      { x: 3, y: 1, type: 'ghost' },
      { x: 2, y: -2, type: 'strong' },
      { x: -3, y: 1, type: 'strong' },
    ],
    staticBombs: [
      { x: 3, y: -1, evolution: 0 },
      { x: 2, y: -3, evolution: 1 },
      { x: 1, y: -1, evolution: 1 },
      { x: -2, y: 4, evolution: 1 },
      { x: -1, y: 2, evolution: 0 },
      { x: 3, y: 0, evolution: 2 },
      { x: 1, y: 2, evolution: 1 },
      { x: 3, y: 4, evolution: 1 },
      { x: -1, y: 4, evolution: 1 },
    ]
  },

  // 第195关：★消耗关★
  195: {
    gridSize: 8,
    hint: '第195关：★消耗关★精打细算！',
    walls: [
      { x: 0, y: 4, type: 'strong' },
      { x: -2, y: -1, type: 'ghost' },
      { x: -3, y: -2, type: 'strong' },
      { x: 4, y: -2, type: 'strong' },
      { x: -2, y: 1, type: 'strong' },
      { x: 4, y: 2, type: 'strong' },
      { x: -3, y: 4, type: 'ghost' },
      { x: 4, y: -3, type: 'strong' },
      { x: -2, y: -3, type: 'strong' },
      { x: 0, y: 1, type: 'strong' },
      { x: -2, y: 4, type: 'ghost' },
      { x: 2, y: 1, type: 'ghost' },
      { x: -1, y: -3, type: 'strong' },
      { x: -3, y: -1, type: 'strong' },
      { x: 0, y: 2, type: 'strong' },
      { x: 2, y: -1, type: 'strong' },
      { x: 3, y: 2, type: 'strong' },
      { x: 2, y: 4, type: 'strong' },
      { x: 1, y: 3, type: 'strong' },
      { x: -2, y: 0, type: 'ghost' },
    ],
    staticBombs: [
      { x: 4, y: 4, evolution: 1 },
      { x: 4, y: 1, evolution: 0 },
      { x: 4, y: -1, evolution: 0 },
      { x: -1, y: 2, evolution: 2 },
      { x: -1, y: 0, evolution: 2 },
    ]
  },

  // 第196关
  196: {
    gridSize: 8,
    hint: '第196关：挑战你的策略极限！',
    walls: [
      { x: -1, y: 0, type: 'strong' },
      { x: -3, y: -2, type: 'ghost' },
      { x: -2, y: 0, type: 'strong' },
      { x: 2, y: -3, type: 'strong' },
      { x: -2, y: 3, type: 'ghost' },
      { x: 4, y: -1, type: 'strong' },
      { x: 3, y: 1, type: 'ghost' },
      { x: -2, y: -3, type: 'ghost' },
      { x: 2, y: 3, type: 'ghost' },
      { x: -3, y: 4, type: 'strong' },
      { x: -2, y: -1, type: 'ghost' },
      { x: 0, y: -1, type: 'strong' },
      { x: 4, y: 0, type: 'strong' },
      { x: 4, y: 3, type: 'strong' },
      { x: 1, y: -2, type: 'strong' },
      { x: -1, y: 2, type: 'ghost' },
      { x: -2, y: 1, type: 'strong' },
      { x: 1, y: 3, type: 'ghost' },
    ],
    staticBombs: [
      { x: 2, y: -2, evolution: 2 },
      { x: 1, y: -3, evolution: 0 },
      { x: 4, y: -3, evolution: 2 },
      { x: 4, y: -2, evolution: 1 },
      { x: 1, y: -1, evolution: 1 },
      { x: 3, y: 4, evolution: 3 },
      { x: 4, y: 2, evolution: 2 },
      { x: -2, y: 2, evolution: 1 },
      { x: 3, y: 3, evolution: 0 },
    ]
  },

  // 第197关
  197: {
    gridSize: 8,
    hint: '第197关：消灭所有老鼠！',
    walls: [
      { x: -2, y: 4, type: 'strong' },
      { x: -3, y: -3, type: 'ghost' },
      { x: -1, y: 2, type: 'ghost' },
      { x: 0, y: 1, type: 'strong' },
      { x: 4, y: -2, type: 'strong' },
      { x: -3, y: -2, type: 'strong' },
      { x: -1, y: 3, type: 'strong' },
      { x: 0, y: 3, type: 'ghost' },
      { x: 1, y: 3, type: 'strong' },
      { x: 4, y: 1, type: 'strong' },
      { x: 1, y: 1, type: 'ghost' },
      { x: 1, y: -3, type: 'strong' },
      { x: -2, y: 3, type: 'strong' },
      { x: 4, y: 4, type: 'strong' },
      { x: 0, y: 2, type: 'strong' },
      { x: -3, y: 4, type: 'ghost' },
      { x: -1, y: 0, type: 'strong' },
      { x: -1, y: -2, type: 'ghost' },
    ],
    staticBombs: [
      { x: 2, y: -1, evolution: 2 },
      { x: 2, y: 1, evolution: 2 },
      { x: 2, y: 3, evolution: 3 },
      { x: -2, y: -2, evolution: 2 },
      { x: 3, y: 1, evolution: 2 },
      { x: 1, y: -2, evolution: 3 },
      { x: 1, y: 2, evolution: 3 },
      { x: 0, y: -1, evolution: 3 },
      { x: 4, y: 3, evolution: 1 },
    ]
  },

  // 第198关
  198: {
    gridSize: 8,
    hint: '第198关：消灭所有老鼠！',
    walls: [
      { x: -3, y: 2, type: 'strong' },
      { x: -3, y: -2, type: 'ghost' },
      { x: 3, y: 2, type: 'ghost' },
      { x: -2, y: 1, type: 'strong' },
      { x: 0, y: -3, type: 'strong' },
      { x: 2, y: 2, type: 'ghost' },
      { x: 1, y: 1, type: 'ghost' },
      { x: -3, y: -3, type: 'strong' },
      { x: 3, y: 3, type: 'ghost' },
      { x: -1, y: 0, type: 'ghost' },
      { x: 4, y: 0, type: 'strong' },
      { x: 4, y: 1, type: 'ghost' },
      { x: 2, y: 1, type: 'strong' },
      { x: -1, y: 1, type: 'ghost' },
      { x: -2, y: 2, type: 'ghost' },
      { x: -1, y: -3, type: 'strong' },
      { x: 0, y: 2, type: 'ghost' },
      { x: 0, y: 0, type: 'strong' },
    ],
    staticBombs: [
      { x: 2, y: 3, evolution: 2 },
      { x: 1, y: 4, evolution: 1 },
      { x: 2, y: -2, evolution: 3 },
      { x: -2, y: -3, evolution: 0 },
      { x: 4, y: 4, evolution: 3 },
      { x: 3, y: 1, evolution: 0 },
      { x: 4, y: 2, evolution: 2 },
      { x: 2, y: 0, evolution: 1 },
      { x: 2, y: 4, evolution: 1 },
    ]
  },

  // 第199关
  199: {
    gridSize: 8,
    hint: '第199关：消灭所有老鼠！',
    walls: [
      { x: -3, y: 2, type: 'strong' },
      { x: -2, y: -1, type: 'ghost' },
      { x: 2, y: 3, type: 'ghost' },
      { x: 3, y: 2, type: 'strong' },
      { x: -2, y: 4, type: 'strong' },
      { x: 4, y: 3, type: 'strong' },
      { x: -1, y: 2, type: 'ghost' },
      { x: -2, y: 2, type: 'strong' },
      { x: -2, y: 1, type: 'ghost' },
      { x: 1, y: -3, type: 'strong' },
      { x: -3, y: -2, type: 'ghost' },
      { x: 3, y: -3, type: 'ghost' },
      { x: 2, y: -3, type: 'normal' },
      { x: 2, y: -1, type: 'strong' },
      { x: -1, y: -1, type: 'strong' },
      { x: -3, y: 0, type: 'strong' },
      { x: 1, y: -1, type: 'ghost' },
      { x: 3, y: 0, type: 'ghost' },
    ],
    staticBombs: [
      { x: 4, y: -2, evolution: 1 },
      { x: 1, y: 0, evolution: 3 },
      { x: -1, y: 3, evolution: 3 },
      { x: 1, y: 1, evolution: 2 },
      { x: -1, y: -2, evolution: 3 },
      { x: 0, y: -2, evolution: 3 },
      { x: -2, y: 3, evolution: 0 },
      { x: -3, y: -1, evolution: 1 },
      { x: 0, y: 2, evolution: 1 },
    ]
  },

  // 第200关：★Boss挑战★
  200: {
    gridSize: 8,
    hint: '第200关：★Boss挑战★',
    walls: [
      { x: 3, y: 3, type: 'ghost' },
      { x: -1, y: 1, type: 'strong' },
      { x: 2, y: 2, type: 'ghost' },
      { x: 3, y: -3, type: 'strong' },
      { x: 4, y: -2, type: 'strong' },
      { x: 4, y: -3, type: 'strong' },
      { x: 0, y: -2, type: 'ghost' },
      { x: 0, y: 0, type: 'strong' },
      { x: 2, y: 3, type: 'ghost' },
      { x: 3, y: 4, type: 'ghost' },
      { x: -2, y: -2, type: 'strong' },
      { x: -2, y: 0, type: 'strong' },
      { x: 1, y: -2, type: 'ghost' },
      { x: -2, y: 4, type: 'ghost' },
      { x: 2, y: 4, type: 'strong' },
      { x: 1, y: -3, type: 'strong' },
      { x: -1, y: -3, type: 'ghost' },
      { x: -1, y: 0, type: 'ghost' },
      { x: 1, y: 2, type: 'strong' },
      { x: 0, y: 1, type: 'ghost' },
      { x: -3, y: 2, type: 'ghost' },
      { x: 4, y: 4, type: 'strong' },
    ],
    staticBombs: [
      { x: 1, y: 3, evolution: 2 },
      { x: -1, y: -1, evolution: 0 },
      { x: -3, y: 3, evolution: 0 },
      { x: -3, y: 0, evolution: 0 },
      { x: 3, y: 2, evolution: 1 },
      { x: -3, y: -1, evolution: 2 },
    ]
  },
};

module.exports = LEVELS;
