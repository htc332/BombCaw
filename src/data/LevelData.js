/**
 * Data/LevelData.js
 * 18关关卡配置 - 宫本茂式设计哲学
 * 核心原则：一次教一个机制，让玩家自己发现乐趣
 */

const LEVELS = {
  // [v0.8.0] 新计分系统：关卡不再限制炸弹数，移除bombs字段
  // 玩家初始10分，通过炸鼠+1分维持经济循环
  // 所有关卡配置已移除bombs字段，改为无限放置模式

  // ========== 测试阶段：特效测试 ==========
  
  // 第1关：测试关 - 测试各种爆炸特效
  // 包含：普通炸弹、升级炸弹、静态炸弹，方便测试特效
  1: {
    gridSize: 8,
    hint: '测试关：8x8大场地，测试不同等级爆炸范围',
    walls: [
      { x: 0, y: 3, type: 'normal' },
      { x: 0, y: -3, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: -3, y: 0, type: 'normal' },
      { x: 2, y: 2, type: 'normal' },
      { x: -2, y: -2, type: 'normal' },
      { x: 2, y: -2, type: 'normal' },
      { x: -2, y: 2, type: 'normal' },
      // 二级头盔鼠（精英鼠）- 需要两次爆炸才能消灭
      { x: 1, y: 2, type: 'strong' },
      { x: -1, y: -2, type: 'strong' },
      { x: 2, y: -1, type: 'strong' },
      // 幽灵鼠 - 新敌人类型
      { x: -3, y: 3, type: 'ghost' },
      { x: 3, y: -3, type: 'ghost' },
      // 墙壁鼠 - 新敌人类型
      { x: -1, y: 1, type: 'wall' },
      { x: 1, y: 1, type: 'wall' },
      { x: 0, y: 1, type: 'wall' },
    ],
    staticBombs: [
      { x: 0, y: 0, evolution: 0 },   // 1级静态炸弹
      { x: 2, y: 0, evolution: 2 },  // 2级静态炸弹
      { x: -2, y: 0, evolution: 3 }, // 3级静态炸弹
      { x: 0, y: 2, evolution: 5 }    // 4级静态炸弹
    ]
  },

  // 第2关：连锁的力量
  // 教学点：中间静态炸弹被引爆后会升级+连锁激活周围的炸弹
  2: {
    gridSize: 5,
    hint: '引爆中间的炸弹，看它如何帮你炸掉所有墙壁',
    walls: [
      { x: -2, y: 0, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' }
    ],
    staticBombs: [
      { x: 0, y: 0, evolution: 0 },   // 中心雷，升级后范围2
      { x: -1, y: 0, evolution: 0 },  // 左侧雷
      { x: 0, y: -1, evolution: 0 },  // 上侧雷
      { x: 0, y: 1, evolution: 0 }    // 下侧雷
    ]
  },

  // 第3关：连锁惊喜
  // 教学点：爆炸可以连锁激活其他静态炸弹
  3: {
    gridSize: 5,
    hint: '一个炸弹可以激活另一个',
    walls: [
      { x: -2, y: 0, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' }
    ],
    staticBombs: [
      { x: -1, y: 0, evolution: 0 },
      { x: 1, y: 0, evolution: 0 }
    ]
  },

  // 第4关：自己也要升级
  // 教学点：玩家炸弹相邻也会升级（和静态炸弹一样）
  4: {
    gridSize: 5,
    hint: '把两个自己的炸弹放一起，也会升级！',
    walls: [
      { x: -2, y: 0, type: 'normal' },
      { x: -1, y: 0, type: 'normal' },
      { x: 1, y: 0, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: 0, y: -2, type: 'normal' }
    ],
    staticBombs: []
  },

  // 第5关：选择与规划
  // 教学点：引爆顺序很重要
  5: {
    gridSize: 5,
    hint: '先激活哪个静态炸弹？规划你的策略',
    walls: [
      { x: -2, y: 0, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' },
      { x: 0, y: 0, type: 'normal' }
    ],
    staticBombs: [
      { x: -1, y: 0, evolution: 0 },
      { x: 1, y: 0, evolution: 0 }
    ]
  },

  // 第6关：范围叠加
  // 教学点：三级升级系统（0→1→2）
  6: {
    gridSize: 7,
    hint: '三个炸弹十字相邻，威力最大！',
    walls: [
      { x: 0, y: 3, type: 'normal' },
      { x: 0, y: -3, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: -3, y: 0, type: 'normal' }
    ],
    staticBombs: [
      { x: 0, y: 0, evolution: 0 }
    ]
  },

  // ========== 应用阶段：机制组合 ==========

  // 第7关：静态炸弹 + 炸弹墙
  // 教学点：静态炸弹也能触发炸弹墙
  7: {
    gridSize: 5,
    hint: '用静态炸弹的爆炸触发黄色炸弹墙',
    walls: [
      { x: 0, y: 2, type: 'bomb', color: 'yellow' },
      { x: 2, y: 0, type: 'bomb', color: 'yellow' }
    ],
    staticBombs: [
      { x: 0, y: 0, evolution: 2 }  // 初始1级，范围2格
    ]
  },

  // 第8关：静态炸弹 vs 加固墙
  // 教学点：进化炸弹对加固墙更有效
  8: {
    gridSize: 5,
    hint: '1级静态炸弹可以一次炸掉加固墙',
    walls: [
      { x: 0, y: 2, type: 'strong' },
      { x: 0, y: -2, type: 'strong' }
    ],
    staticBombs: [
      { x: 0, y: 0, evolution: 2 }  // 1级=范围2，刚好够到
    ]
  },

  // 第9关：多米诺连锁
  // 教学点：连锁的优雅
  9: {
    gridSize: 7,
    hint: '只需一个炸弹，看连锁反应',
    walls: [
      { x: -3, y: 0, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: 0, y: 3, type: 'normal' },
      { x: 0, y: -3, type: 'normal' }
    ],
    staticBombs: [
      { x: -2, y: 0, evolution: 0 },
      { x: -1, y: 0, evolution: 0 },
      { x: 0, y: 0, evolution: 0 },
      { x: 1, y: 0, evolution: 0 },
      { x: 2, y: 0, evolution: 0 }
    ]
  },

  // 第10关：静态炸弹 + 红色炸弹墙连锁
  // 教学点：所有爆炸机制联动
  10: {
    gridSize: 5,
    hint: '创造大爆炸连锁反应',
    walls: [
      { x: -2, y: 0, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' }
    ],
    staticBombs: [
      { x: -1, y: 0, evolution: 0 },
      { x: 1, y: 0, evolution: 0 }
    ]
  },

  // 第11关：混合战场
  // 教学点：识别优先级
  11: {
    gridSize: 7,
    hint: '先处理哪个？想清楚顺序',
    walls: [
      { x: -2, y: -2, type: 'normal' },
      { x: 2, y: -2, type: 'strong' },
      { x: -2, y: 2, type: 'bomb', color: 'yellow' },
      { x: 2, y: 2, type: 'bomb', color: 'red' },
      { x: 0, y: 0, type: 'normal' }
    ],
    staticBombs: [
      { x: -1, y: 0, evolution: 0 },
      { x: 1, y: 0, evolution: 1 }
    ]
  },

  // 第12关：效率最大化
  // 教学点：用最少的资源达到目标
  12: {
    gridSize: 7,
    hint: '3个炸弹激活所有静态炸弹',
    walls: [
      { x: -3, y: -3, type: 'normal' },
      { x: 3, y: 3, type: 'normal' }
    ],
    staticBombs: [
      { x: -2, y: -2, evolution: 0 },
      { x: 0, y: 0, evolution: 0 },
      { x: 2, y: 2, evolution: 0 }
    ]
  },

  // ========== 精通阶段：创意应用 ==========

  // 第13关：只用静态炸弹
  // 挑战：不放任何炸弹，只用静态炸弹通关
  13: {
    gridSize: 5,
    hint: '只有一个炸弹，让它触发连锁',
    walls: [
      { x: -2, y: 0, type: 'normal' },
      { x: 2, y: 0, type: 'normal' },
      { x: 0, y: -2, type: 'normal' },
      { x: 0, y: 2, type: 'normal' }
    ],
    staticBombs: [
      { x: -1, y: 0, evolution: 0 },
      { x: 1, y: 0, evolution: 0 },
      { x: 0, y: -1, evolution: 0 },
      { x: 0, y: 1, evolution: 0 }
    ]
  },

  // 第14关：最大化连锁
  // 挑战：创造最大的连锁爆炸
  14: {
    gridSize: 7,
    hint: '制造最大的连锁爆炸！',
    walls: [
      { x: -3, y: -3, type: 'normal' },
      { x: -3, y: 3, type: 'normal' },
      { x: 3, y: -3, type: 'normal' },
      { x: 3, y: 3, type: 'normal' }
    ],
    staticBombs: (() => {
      // 生成十字形静态炸弹
      const bombs = [];
      for (let i = -2; i <= 2; i++) {
        bombs.push({ x: i, y: 0, evolution: 0 });
        if (i !== 0) bombs.push({ x: 0, y: i, evolution: 0 });
      }
      return bombs;
    })()
  },

  // 第15关：精准控制
  // 挑战：需要精确控制爆炸范围
  15: {
    gridSize: 7,
    hint: '太强的爆炸会触发不好的东西...',
    walls: [
      { x: -2, y: 0, type: 'normal' },
      { x: 2, y: 0, type: 'normal' }
    ],
    staticBombs: [
      { x: -1, y: 0, evolution: 0 },
      { x: 0, y: 0, evolution: 0 },
      { x: 1, y: 0, evolution: 0 }
    ]
  },

  // 第16关：综合挑战 A
  16: {
    gridSize: 7,
    hint: '综合运用你学到的所有技巧',
    walls: [
      { x: -3, y: -3, type: 'normal' },
      { x: -3, y: 0, type: 'strong' },
      { x: -3, y: 3, type: 'normal' },
      { x: 0, y: -3, type: 'strong' },
      { x: 0, y: 3, type: 'strong' },
      { x: 3, y: -3, type: 'normal' },
      { x: 3, y: 0, type: 'strong' },
      { x: 3, y: 3, type: 'normal' },
      { x: -2, y: -2, type: 'bomb', color: 'yellow' },
      { x: 2, y: 2, type: 'bomb', color: 'red' }
    ],
    staticBombs: [
      { x: -1, y: -1, evolution: 0 },
      { x: 1, y: 1, evolution: 1 },
      { x: 0, y: 0, evolution: 0 }
    ]
  },

  // 第17关：综合挑战 B
  17: {
    gridSize: 7,
    hint: '最难的谜题',
    walls: [
      { x: -3, y: -2, type: 'normal' },
      { x: -3, y: 0, type: 'normal' },
      { x: -3, y: 2, type: 'normal' },
      { x: -2, y: -3, type: 'strong' },
      { x: -2, y: 3, type: 'strong' },
      { x: 0, y: -3, type: 'normal' },
      { x: 0, y: 3, type: 'normal' },
      { x: 2, y: -3, type: 'strong' },
      { x: 2, y: 3, type: 'strong' },
      { x: 3, y: -2, type: 'normal' },
      { x: 3, y: 0, type: 'normal' },
      { x: 3, y: 2, type: 'normal' }
    ],
    staticBombs: [
      { x: -2, y: 0, evolution: 0 },
      { x: -1, y: 0, evolution: 0 },
      { x: 1, y: 0, evolution: 0 },
      { x: 2, y: 0, evolution: 0 }
    ]
  },

  // 第18关：最终试炼
  18: {
    gridSize: 8,
    hint: '大师级挑战',
    walls: [],  // 将在下面动态生成
    staticBombs: []  // 将在下面动态生成
  }
};

// 生成第18关的配置（避免墙壁和静态炸弹重叠）
(function generateLevel18() {
  const level18 = LEVELS[18];
  const used = new Set();
  
  // 生成墙壁
  let placed = 0;
  while (placed < 15) {
    const x = Math.floor(Math.random() * 8) - 4;  // [-4, 3]
    const y = Math.floor(Math.random() * 8) - 4;
    
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
    
    level18.walls.push({ x, y, type, color });
    placed++;
  }
  
  // 生成静态炸弹（避开墙壁位置）
  for (let x = -3; x <= 3; x += 2) {
    for (let y = -3; y <= 3; y += 2) {
      if (x === 0 && y === 0) continue;
      const key = `${x},${y}`;
      if (!used.has(key)) {
        level18.staticBombs.push({ x, y, evolution: Math.random() > 0.5 ? 0 : 2 });
      }
    }
  }
})();

// 生成挑战关卡墙壁
function generateChallengeWalls(level, count) {
  const walls = [];
  const size = level < 16 ? 7 : 9;
  const half = Math.floor(size / 2);
  const used = new Set();
  
  let placed = 0;
  while (placed < count) {
    // 生成 [-half, half] 范围内的坐标
    const x = Math.floor(Math.random() * size) - half;
    const y = Math.floor(Math.random() * size) - half;
    
    // 确保坐标在有效范围内
    if (x < -half || x > half || y < -half || y > half) continue;
    
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

// 导出到微信小游戏全局
if (typeof GameGlobal !== 'undefined') {
  GameGlobal.LEVELS = LEVELS;
}

// CommonJS 导出
module.exports = LEVELS;

// CommonJS 导出
module.exports = LEVELS;
