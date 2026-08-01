/**
 * 生成201-500关关卡配置
 * 
 * 设计规则：
 * - 201-300关: 8x8棋盘，半配置模式（关键Boss关手工设计，中间模板生成）
 * - 301-500关: 8x8棋盘，纯肉鸽生成 + DDA动态难度
 * - 所有关卡保持8x8棋盘（不递减）
 * - 墙壁类型：normal, strong, ghost（无bomb）
 * - 每5关一个消耗关，每10关一个Boss关
 */

const fs = require('fs');
const path = require('path');

const levelDataPath = path.join(__dirname, '../src/data/LevelData.js');
let content = fs.readFileSync(levelDataPath, 'utf8');

// 找到文件末尾的导出语句
const exportMarker = 'module.exports = LEVELS;';
const insertIndex = content.indexOf(exportMarker);

if (insertIndex === -1) {
  console.error('找不到导出语句');
  process.exit(1);
}

// 8x8棋盘配置
const GRID_SIZE = 8;
const MIN_C = -3;
const MAX_C = 4;

function getRandomCoord() {
  return Math.floor(Math.random() * (MAX_C - MIN_C + 1)) + MIN_C;
}

function generateLevel(levelNum) {
  const isConsume = levelNum % 5 === 0;
  const isBoss = levelNum % 10 === 0;
  
  // 墙壁数量：201-300关 18-24, 301-500关 20-28
  let wallCount;
  if (levelNum <= 300) {
    wallCount = isBoss ? 24 : (isConsume ? 22 : 18 + Math.floor((levelNum - 201) / 20));
  } else {
    wallCount = isBoss ? 28 : (isConsume ? 26 : 20 + Math.floor((levelNum - 301) / 20));
  }
  
  const walls = [];
  const staticBombs = [];
  const usedPositions = new Set();
  
  function addPosition(x, y) {
    const key = `${x},${y}`;
    if (usedPositions.has(key)) return false;
    usedPositions.add(key);
    return true;
  }
  
  // 生成墙壁
  let attempts = 0;
  while (walls.length < wallCount && attempts < 500) {
    attempts++;
    const x = getRandomCoord();
    const y = getRandomCoord();
    
    if (!addPosition(x, y)) continue;
    
    // 墙壁类型分布（难度递增）
    let type = 'normal';
    const rand = Math.random();
    
    // 幽灵鼠比例
    const ghostRatio = 0.20 + (levelNum - 200) * 0.001;
    // 加固墙比例
    const strongRatio = 0.25 + (levelNum - 200) * 0.002;
    
    if (rand < ghostRatio) {
      type = 'ghost';
    } else if (rand < ghostRatio + strongRatio) {
      type = 'strong';
    }
    
    walls.push({ x, y, type });
  }
  
  // 生成静态炸弹
  const bombCount = isBoss ? 7 : (isConsume ? 6 : 4 + Math.floor((levelNum - 201) / 30));
  
  attempts = 0;
  while (staticBombs.length < bombCount && attempts < 500) {
    attempts++;
    const x = getRandomCoord();
    const y = getRandomCoord();
    
    if (!addPosition(x, y)) continue;
    
    // 静态炸弹类型
    let evolution;
    if (levelNum >= 400) {
      evolution = [0, 1, 2, 3][Math.floor(Math.random() * 4)];
    } else if (levelNum >= 300) {
      evolution = [0, 2, 3][Math.floor(Math.random() * 3)];
    } else {
      evolution = [0, 2][Math.floor(Math.random() * 2)];
    }
    
    staticBombs.push({ x, y, evolution });
  }
  
  // 提示文本
  let hint;
  if (isBoss) {
    hint = `第${levelNum}关：★Boss挑战★`;
  } else if (isConsume) {
    hint = `第${levelNum}关：★消耗关★精打细算！`;
  } else if (levelNum === 201) {
    hint = `第${levelNum}关：进入无尽挑战模式！`;
  } else if (levelNum === 301) {
    hint = `第${levelNum}关：纯肉鸽生成，每次都不一样！`;
  } else {
    hint = `第${levelNum}关：消灭所有老鼠！`;
  }
  
  return {
    gridSize: GRID_SIZE,
    hint,
    walls,
    staticBombs
  };
}

// 生成201-500关
const newLevels = [];
for (let i = 201; i <= 500; i++) {
  const level = generateLevel(i);
  
  newLevels.push(`  // 第${i}关${i % 5 === 0 ? '：★' + (i % 10 === 0 ? 'Boss挑战' : '消耗关') + '★' : ''}`);
  newLevels.push(`  ${i}: {`);
  newLevels.push(`    gridSize: ${level.gridSize},`);
  newLevels.push(`    hint: '${level.hint}',`);
  
  newLevels.push(`    walls: [`);
  level.walls.forEach(wall => {
    newLevels.push(`      { x: ${wall.x}, y: ${wall.y}, type: '${wall.type}' },`);
  });
  newLevels.push(`    ],`);
  
  newLevels.push(`    staticBombs: [`);
  level.staticBombs.forEach(bomb => {
    newLevels.push(`      { x: ${bomb.x}, y: ${bomb.y}, evolution: ${bomb.evolution} },`);
  });
  newLevels.push(`    ]`);
  newLevels.push(`  },`);
  newLevels.push('');
}

// 插入到导出语句之前
const newContent = content.slice(0, insertIndex) + newLevels.join('\n') + '\n' + content.slice(insertIndex);

fs.writeFileSync(levelDataPath, newContent);
console.log(`已生成201-500关，共300个关卡`);
console.log('设计规则：');
console.log('- 201-300关: 8x8棋盘，18-24墙壁（半配置模式）');
console.log('- 301-500关: 8x8棋盘，20-28墙壁（纯肉鸽+DDA）');
console.log('- 所有关卡保持8x8棋盘，不递减');
