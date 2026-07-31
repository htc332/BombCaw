/**
 * 重新生成1-100关关卡配置
 * 确保每个静态炸弹都能炸到至少一个老鼠
 */

const fs = require('fs');
const path = require('path');

const levelDataPath = path.join(__dirname, '../src/data/LevelData.js');

// 关卡类型
const LEVEL_TYPES = {
  TUTORIAL: 'tutorial',
  PRACTICE: 'practice',
  CHALLENGE: 'challenge',
  CONSUME: 'consume',
  BOSS: 'boss',
  RELAX: 'relax'
};

// 爆炸范围计算
function getExplosionRange(x, y, evolution) {
  const range = [{x, y}];
  
  if (evolution === 0) {
    // LV1: 十字1格
    range.push({x: x+1, y}, {x: x-1, y}, {x, y: y+1}, {x, y: y-1});
  } else if (evolution === 2) {
    // LV2: 竖直上下各3格
    for (let d = 1; d <= 3; d++) {
      range.push({x, y: y+d}, {x, y: y-d});
    }
  } else if (evolution === 3) {
    // LV3: 横向左右各3格 + 上方1格
    for (let d = 1; d <= 3; d++) {
      range.push({x: x+d, y}, {x: x-d, y});
    }
    range.push({x, y: y-1});
  } else if (evolution === 5) {
    // LV4: 十字1格 + 对角1格
    range.push({x: x+1, y}, {x: x-1, y}, {x, y: y+1}, {x, y: y-1});
    range.push({x: x+1, y: y+1}, {x: x-1, y: y-1}, {x: x+1, y: y-1}, {x: x-1, y: y+1});
  }
  
  return range;
}

// 检查静态炸弹是否能炸到墙壁
function canHitWall(staticBomb, walls) {
  const wallPositions = new Set();
  walls.forEach(w => wallPositions.add(`${w.x},${w.y}`));
  
  const range = getExplosionRange(staticBomb.x, staticBomb.y, staticBomb.evolution);
  
  for (const pos of range) {
    if (wallPositions.has(`${pos.x},${pos.y}`)) {
      return true;
    }
  }
  
  return false;
}

// 生成有效的静态炸弹位置
function generateValidStaticBomb(walls, usedPositions, gridSize, evolution) {
  const halfGrid = Math.floor(gridSize / 2);
  
  // 尝试随机位置，确保能炸到至少一个墙壁
  let attempts = 0;
  while (attempts < 100) {
    const x = Math.floor(Math.random() * (gridSize + 1)) - halfGrid;
    const y = Math.floor(Math.random() * (gridSize + 1)) - halfGrid;
    const key = `${x},${y}`;
    
    // 检查是否已被使用
    if (usedPositions.has(key)) continue;
    
    // 检查是否在墙壁上
    const isWall = walls.some(w => w.x === x && w.y === y);
    if (isWall) continue;
    
    // 检查是否能炸到至少一个墙壁
    const bomb = {x, y, evolution};
    if (canHitWall(bomb, walls)) {
      return bomb;
    }
    
    attempts++;
  }
  
  // 如果随机找不到，尝试系统性地找
  for (let x = -halfGrid; x <= halfGrid; x++) {
    for (let y = -halfGrid; y <= halfGrid; y++) {
      const key = `${x},${y}`;
      if (usedPositions.has(key)) continue;
      
      const isWall = walls.some(w => w.x === x && w.y === y);
      if (isWall) continue;
      
      const bomb = {x, y, evolution};
      if (canHitWall(bomb, walls)) {
        return bomb;
      }
    }
  }
  
  return null;
}

// 生成关卡
function generateLevel(levelNum) {
  let gridSize;
  if (levelNum <= 50) gridSize = 5;
  else if (levelNum <= 100) gridSize = 6;
  else gridSize = 7;
  
  const isConsume = levelNum % 5 === 0;
  
  let type;
  if (isConsume) {
    type = levelNum % 10 === 0 ? LEVEL_TYPES.BOSS : LEVEL_TYPES.CONSUME;
  } else if (levelNum % 7 === 0) {
    type = LEVEL_TYPES.CHALLENGE;
  } else if (levelNum % 3 === 0) {
    type = LEVEL_TYPES.RELAX;
  } else {
    type = LEVEL_TYPES.PRACTICE;
  }
  
  // 生成墙壁
  const walls = [];
  const usedPositions = new Set();
  const halfGrid = Math.floor(gridSize / 2);
  
  // 根据关卡确定墙壁数量
  const wallCount = Math.min(6 + Math.floor(levelNum / 5), 12);
  
  // 生成墙壁位置（确保有合理的布局）
  for (let i = 0; i < wallCount; i++) {
    let x, y, key;
    let attempts = 0;
    
    do {
      x = Math.floor(Math.random() * (gridSize + 1)) - halfGrid;
      y = Math.floor(Math.random() * (gridSize + 1)) - halfGrid;
      key = `${x},${y}`;
      attempts++;
    } while (usedPositions.has(key) && attempts < 50);
    
    if (attempts < 50) {
      usedPositions.add(key);
      
      let wallType = 'normal';
      
      // 50关后引入幽灵鼠
      if (levelNum >= 55 && Math.random() < 0.3) {
        wallType = 'ghost';
      }
      
      // 加固墙
      if (levelNum >= 60 && Math.random() < 0.2) {
        wallType = 'strong';
      }
      
      walls.push({x, y, type: wallType});
    }
  }
  
  // 生成静态炸弹（确保每个都能炸到墙壁）
  const staticBombs = [];
  const staticBombCount = isConsume ? 3 : Math.floor(Math.random() * 2) + 1;
  
  for (let i = 0; i < staticBombCount; i++) {
    // 根据关卡确定静态炸弹类型
    let evolution = 0;
    if (levelNum >= 70) {
      evolution = [0, 2, 3, 5][Math.floor(Math.random() * 4)];
    } else if (levelNum >= 60) {
      evolution = [0, 2, 3][Math.floor(Math.random() * 3)];
    } else if (levelNum >= 20) {
      evolution = [0, 2][Math.floor(Math.random() * 2)];
    }
    
    const bomb = generateValidStaticBomb(walls, usedPositions, gridSize, evolution);
    
    if (bomb) {
      usedPositions.add(`${bomb.x},${bomb.y}`);
      staticBombs.push(bomb);
    }
  }
  
  // 生成提示
  let hint;
  if (isConsume) {
    hint = `第${levelNum}关：精打细算，用最少的炸弹消灭所有老鼠！`;
  } else if (type === LEVEL_TYPES.CHALLENGE) {
    hint = `第${levelNum}关：挑战你的策略极限！`;
  } else if (type === LEVEL_TYPES.RELAX) {
    hint = `第${levelNum}关：放松一下，享受连锁的快感！`;
  } else {
    hint = `第${levelNum}关：运用技巧，巧妙通关！`;
  }
  
  return {
    gridSize,
    type,
    isConsume,
    hint,
    walls,
    staticBombs
  };
}

// 验证关卡
function validateLevel(level) {
  const issues = [];
  
  // 检查静态炸弹是否能炸到墙壁
  for (const sb of level.staticBombs) {
    if (!canHitWall(sb, level.walls)) {
      issues.push(`静态炸弹(${sb.x},${sb.y},evo=${sb.evolution}) 炸不到任何老鼠`);
    }
  }
  
  // 检查重叠
  const wallPositions = new Set();
  for (const w of level.walls) {
    const key = `${w.x},${w.y}`;
    if (wallPositions.has(key)) {
      issues.push(`墙壁重叠(${w.x},${w.y})`);
    }
    wallPositions.add(key);
  }
  
  for (const sb of level.staticBombs) {
    const key = `${sb.x},${sb.y}`;
    if (wallPositions.has(key)) {
      issues.push(`静态炸弹(${sb.x},${sb.y}) 与墙壁重叠`);
    }
  }
  
  return issues;
}

// 生成所有关卡
const levels = {};

for (let i = 1; i <= 100; i++) {
  let level;
  let attempts = 0;
  
  do {
    level = generateLevel(i);
    attempts++;
  } while (validateLevel(level).length > 0 && attempts < 100);
  
  if (attempts >= 100) {
    console.log(`警告：关卡 ${i} 无法生成有效配置`);
  }
  
  levels[i] = level;
}

// 验证所有关卡
console.log('验证关卡...');
let totalIssues = 0;
for (let i = 1; i <= 100; i++) {
  const issues = validateLevel(levels[i]);
  if (issues.length > 0) {
    console.log(`关卡 ${i} 问题：`);
    issues.forEach(issue => console.log(`  - ${issue}`));
    totalIssues += issues.length;
  }
}

if (totalIssues === 0) {
  console.log('✅ 所有关卡验证通过！');
} else {
  console.log(`⚠️ 共发现 ${totalIssues} 个问题`);
}

// 生成关卡数据文件内容
let fileContent = `/**
 * Data/LevelData.js
 * 关卡配置 - 自动生成，确保每个静态炸弹都能炸到至少一个老鼠
 */

// 关卡类型（内部使用，不显示给玩家）
const LEVEL_TYPES = {
  TUTORIAL: 'tutorial',
  PRACTICE: 'practice',
  CHALLENGE: 'challenge',
  CONSUME: 'consume',
  BOSS: 'boss',
  RELAX: 'relax'
};

// 消耗关节奏配置
const CONSUME_INTERVAL = {
  50: 5,
  200: 5,
  300: 3,
  500: 2,
  Infinity: 1
};

// 棋盘大小 progression
const GRID_SIZES = {
  10: 5,
  30: 6,
  60: 7,
  100: 8,
  200: 8,
  Infinity: 9
};

// 工具函数
function getConfigForLevel(configMap, level) {
  const thresholds = Object.keys(configMap).map(Number).sort((a, b) => a - b);
  for (const threshold of thresholds) {
    if (level <= threshold) return configMap[threshold];
  }
  return configMap[Infinity];
}

function isConsumeLevel(level) {
  const interval = getConfigForLevel(CONSUME_INTERVAL, level);
  return level % interval === 0;
}

function getGridSize(level) {
  return getConfigForLevel(GRID_SIZES, level);
}

// ========== 关卡数据（1-100关）==========

const LEVELS = {
`;

// 生成每个关卡的配置
for (let i = 1; i <= 100; i++) {
  const level = levels[i];
  
  fileContent += `  // 第${i}关${level.isConsume ? '：★消耗关★' : ''}\n`;
  fileContent += `  ${i}: {\n`;
  fileContent += `    gridSize: ${level.gridSize},\n`;
  fileContent += `    type: LEVEL_TYPES.${level.type.toUpperCase()},\n`;
  fileContent += `    isConsume: ${level.isConsume},\n`;
  fileContent += `    hint: '${level.hint}',\n`;
  
  // walls
  fileContent += `    walls: [\n`;
  level.walls.forEach(wall => {
    fileContent += `      { x: ${wall.x}, y: ${wall.y}, type: '${wall.type}' },\n`;
  });
  fileContent += `    ],\n`;
  
  // staticBombs
  fileContent += `    staticBombs: [\n`;
  level.staticBombs.forEach(bomb => {
    fileContent += `      { x: ${bomb.x}, y: ${bomb.y}, evolution: ${bomb.evolution} },\n`;
  });
  fileContent += `    ]\n`;
  fileContent += `  },\n`;
  fileContent += `\n`;
}

fileContent += `};

// ========== 导出 ==========

if (typeof GameGlobal !== 'undefined') {
  GameGlobal.LEVELS = LEVELS;
  GameGlobal.LEVEL_TYPES = LEVEL_TYPES;
  GameGlobal.isConsumeLevel = isConsumeLevel;
  GameGlobal.getGridSize = getGridSize;
}

module.exports = { LEVELS, LEVEL_TYPES, isConsumeLevel, getGridSize };
`;

// 写入文件
fs.writeFileSync(levelDataPath, fileContent);

console.log('✅ 关卡配置已重新生成！');
console.log(`共生成 100 个关卡`);
