/**
 * 生成101-200关关卡配置
 * 难度递增设计：
 * - 101-150关: 7x7棋盘 (坐标范围 [-3, 3])
 * - 151-200关: 8x8棋盘 (坐标范围 [-3, 4])
 * 
 * 难度参数：
 * - 墙壁数量递增
 * - 幽灵鼠、加固墙、炸弹墙比例递增
 * - 静态炸弹数量和类型递增
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

// 根据关卡号获取棋盘大小和坐标范围
function getGridConfig(levelNum) {
  if (levelNum <= 150) {
    // 7x7棋盘: 坐标范围 [-3, 3]
    return { gridSize: 7, minC: -3, maxC: 3 };
  } else {
    // 8x8棋盘: 坐标范围 [-3, 4]
    return { gridSize: 8, minC: -3, maxC: 4 };
  }
}

function getRandomCoord(minC, maxC) {
  return Math.floor(Math.random() * (maxC - minC + 1)) + minC;
}

function generateLevel(levelNum) {
  const { gridSize, minC, maxC } = getGridConfig(levelNum);
  const isConsume = levelNum % 5 === 0;
  const isBoss = levelNum % 10 === 0;
  
  // 墙壁数量：随关卡递增，101-150: 12-18, 151-200: 14-22
  let wallCount;
  if (levelNum <= 150) {
    wallCount = isBoss ? 18 : (isConsume ? 16 : 12 + Math.floor((levelNum - 101) / 10));
  } else {
    wallCount = isBoss ? 22 : (isConsume ? 20 : 14 + Math.floor((levelNum - 151) / 10));
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
  while (walls.length < wallCount && attempts < 300) {
    attempts++;
    const x = getRandomCoord(minC, maxC);
    const y = getRandomCoord(minC, maxC);
    
    if (!addPosition(x, y)) continue;
    
    // 墙壁类型分布（难度递增）
    let type = 'normal';
    const rand = Math.random();
    
    // 幽灵鼠比例：101+关开始增加
    const ghostRatio = 0.15 + (levelNum - 100) * 0.002;
    // 加固墙比例
    const strongRatio = 0.20 + (levelNum - 100) * 0.003;
    // 炸弹墙比例（125+关引入）
    const bombRatio = levelNum >= 125 ? 0.05 + (levelNum - 125) * 0.001 : 0;
    
    if (rand < ghostRatio) {
      type = 'ghost';
    } else if (rand < ghostRatio + strongRatio) {
      type = 'strong';
    } else if (rand < ghostRatio + strongRatio + bombRatio) {
      type = 'bomb';
    }
    
    walls.push({ x, y, type });
  }
  
  // 生成静态炸弹
  const bombCount = isBoss ? 6 : (isConsume ? 5 : 3 + Math.floor((levelNum - 101) / 15));
  
  attempts = 0;
  while (staticBombs.length < bombCount && attempts < 300) {
    attempts++;
    const x = getRandomCoord(minC, maxC);
    const y = getRandomCoord(minC, maxC);
    
    if (!addPosition(x, y)) continue;
    
    // 静态炸弹类型（难度递增）
    let evolution;
    if (levelNum >= 175) {
      evolution = [0, 1, 2, 3][Math.floor(Math.random() * 4)];
    } else if (levelNum >= 150) {
      evolution = [0, 2, 3][Math.floor(Math.random() * 3)];
    } else if (levelNum >= 125) {
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
  } else if (levelNum % 7 === 0) {
    hint = `第${levelNum}关：挑战你的策略极限！`;
  } else if (levelNum === 101) {
    hint = `第${levelNum}关：进入高级阶段，7x7棋盘！`;
  } else if (levelNum === 151) {
    hint = `第${levelNum}关：终极挑战，8x8棋盘！`;
  } else {
    hint = `第${levelNum}关：消灭所有老鼠！`;
  }
  
  return {
    gridSize,
    hint,
    walls,
    staticBombs
  };
}

// 生成101-200关
const newLevels = [];
for (let i = 101; i <= 200; i++) {
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
console.log(`已生成101-200关，共100个关卡`);
console.log('难度设计：');
console.log('- 101-150关: 7x7棋盘，12-18墙壁');
console.log('- 151-200关: 8x8棋盘，14-22墙壁');
console.log('- 幽灵鼠、加固墙、炸弹墙比例递增');
