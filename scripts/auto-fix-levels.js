/**
 * 修复关卡配置 - 自动修复重叠和不可解问题
 */

const fs = require('fs');
const path = require('path');

const levelDataPath = path.join(__dirname, '../src/data/LevelData.js');
let levelDataContent = fs.readFileSync(levelDataPath, 'utf8');

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

// 解析关卡数据（简单解析）
function parseLevels(content) {
  const levels = {};
  const regex = /(\d+):\s*\{[\s\S]*?walls:\s*\[([\s\S]*?)\][\s\S]*?staticBombs:\s*\[([\s\S]*?)\]/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const levelNum = parseInt(match[1]);
    const wallsStr = match[2];
    const bombsStr = match[3];
    
    // 解析 walls
    const walls = [];
    const wallRegex = /\{\s*x:\s*(-?\d+)\s*,\s*y:\s*(-?\d+)\s*,\s*type:\s*'([^']+)'(?:\s*,\s*color:\s*'([^']+)')?\s*\}/g;
    let wallMatch;
    while ((wallMatch = wallRegex.exec(wallsStr)) !== null) {
      const wall = { x: parseInt(wallMatch[1]), y: parseInt(wallMatch[2]), type: wallMatch[3] };
      if (wallMatch[4]) wall.color = wallMatch[4];
      walls.push(wall);
    }
    
    // 解析 staticBombs
    const staticBombs = [];
    const bombRegex = /\{\s*x:\s*(-?\d+)\s*,\s*y:\s*(-?\d+)\s*,\s*evolution:\s*(\d+)\s*\}/g;
    let bombMatch;
    while ((bombMatch = bombRegex.exec(bombsStr)) !== null) {
      staticBombs.push({ x: parseInt(bombMatch[1]), y: parseInt(bombMatch[2]), evolution: parseInt(bombMatch[3]) });
    }
    
    levels[levelNum] = { walls, staticBombs };
  }
  
  return levels;
}

console.log('开始修复关卡配置...');

// 由于直接解析和修改JS文件比较复杂，我们采用更简单的方法：
// 1. 找出有问题的关卡
// 2. 手动修复（通过编辑文件）

// 先检查问题
const LEVELS = require('../src/data/LevelData.js');

const problems = [];

for (const [levelNum, level] of Object.entries(LEVELS)) {
  const walls = level.walls || [];
  const staticBombs = level.staticBombs || [];
  const gridSize = level.gridSize || 5;
  const halfGrid = Math.floor(gridSize / 2);
  
  const wallPositions = new Map();
  for (const w of walls) {
    const key = `${w.x},${w.y}`;
    wallPositions.set(key, w);
  }
  
  // 检查重叠
  for (const b of staticBombs) {
    const key = `${b.x},${b.y}`;
    if (wallPositions.has(key)) {
      problems.push({ level: levelNum, type: 'overlap', bomb: b, wall: wallPositions.get(key) });
    }
  }
  
  // 检查可解性
  for (const b of staticBombs) {
    if (!canHitWall(b, walls)) {
      problems.push({ level: levelNum, type: 'unsolvable', bomb: b });
    }
  }
}

console.log(`发现 ${problems.length} 个问题：`);
problems.forEach(p => {
  if (p.type === 'overlap') {
    console.log(`  第${p.level}关: 重叠 - 炸弹(${p.bomb.x},${p.bomb.y}) vs 墙壁(${p.wall.type})`);
  } else {
    console.log(`  第${p.level}关: 不可解 - 炸弹(${p.bomb.x},${p.bomb.y},evo=${p.bomb.evolution})`);
  }
});

console.log('\n请手动修复上述问题，或重新生成关卡配置。');
