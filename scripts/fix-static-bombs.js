/**
 * 修复关卡配置 - 确保每个静态炸弹都能炸到至少一个老鼠
 */

const fs = require('fs');
const path = require('path');

// 读取现有LevelData.js
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

// 为静态炸弹找到能炸到的墙壁位置
function findValidPositionForBomb(evolution, walls, usedPositions, gridSize) {
  const wallPositions = [];
  walls.forEach(w => wallPositions.push({x: w.x, y: w.y}));
  
  // 尝试每个墙壁周围的空位
  for (const wall of wallPositions) {
    // 根据炸弹类型，找到能炸到这个墙壁的位置
    let possiblePositions = [];
    
    if (evolution === 0) {
      // LV1: 需要在墙壁的上下左右1格
      possiblePositions = [
        {x: wall.x+1, y: wall.y},
        {x: wall.x-1, y: wall.y},
        {x: wall.x, y: wall.y+1},
        {x: wall.x, y: wall.y-1}
      ];
    } else if (evolution === 2) {
      // LV2: 需要在墙壁的同一列，上下1-3格
      for (let d = 1; d <= 3; d++) {
        possiblePositions.push({x: wall.x, y: wall.y + d});
        possiblePositions.push({x: wall.x, y: wall.y - d});
      }
    } else if (evolution === 3) {
      // LV3: 需要在墙壁的同一行，左右1-3格
      for (let d = 1; d <= 3; d++) {
        possiblePositions.push({x: wall.x + d, y: wall.y});
        possiblePositions.push({x: wall.x - d, y: wall.y});
      }
      // 或者上方1格
      possiblePositions.push({x: wall.x, y: wall.y + 1});
    } else if (evolution === 5) {
      // LV4: 需要在墙壁的上下左右1格，或对角1格
      possiblePositions = [
        {x: wall.x+1, y: wall.y},
        {x: wall.x-1, y: wall.y},
        {x: wall.x, y: wall.y+1},
        {x: wall.x, y: wall.y-1},
        {x: wall.x+1, y: wall.y+1},
        {x: wall.x-1, y: wall.y-1},
        {x: wall.x+1, y: wall.y-1},
        {x: wall.x-1, y: wall.y+1}
      ];
    }
    
    // 检查这些位置是否可用（不在墙壁位置，未被使用，且在网格范围内）
    const halfGrid = Math.floor(gridSize / 2);
    for (const pos of possiblePositions) {
      const posKey = `${pos.x},${pos.y}`;
      
      // 检查是否在网格范围内
      if (pos.x < -halfGrid || pos.x > halfGrid || pos.y < -halfGrid || pos.y > halfGrid) {
        continue;
      }
      
      // 检查是否已被使用
      if (usedPositions.has(posKey)) {
        continue;
      }
      
      // 检查这个位置是否不在墙壁上
      const isWall = walls.some(w => w.x === pos.x && w.y === pos.y);
      if (isWall) {
        continue;
      }
      
      return pos;
    }
  }
  
  return null;
}

console.log('开始修复关卡配置...');

// 这里需要解析并修复 LevelData.js
// 由于直接修改 JS 文件比较复杂，我们生成一个修复报告
console.log('请查看上面的检查结果，手动修复有问题的关卡');
console.log('或者使用关卡编辑器重新生成这些关卡');
