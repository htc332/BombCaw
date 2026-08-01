/**
 * 生成61-100关关卡配置
 * 基于已有51-60关的风格，继续生成
 * 规则：
 * - 6x6棋盘 (gridSize: 6, 坐标范围 [-2, 3])
 * - 每5关一个消耗关
 * - 61-100关逐步引入幽灵鼠和加固墙
 * - 避免牛鼠重叠
 * - 确保坐标在范围内
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

// 6x6棋盘坐标范围
const MIN_C = -2;
const MAX_C = 3;

function getRandomCoord() {
  return Math.floor(Math.random() * (MAX_C - MIN_C + 1)) + MIN_C;
}

function generateLevel(levelNum) {
  const isConsume = levelNum % 5 === 0;
  const isBoss = levelNum % 10 === 0;
  
  // 墙壁数量：随关卡递增
  const wallCount = isBoss ? 14 : (isConsume ? 12 : 10 + Math.floor((levelNum - 61) / 10));
  
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
  while (walls.length < wallCount && attempts < 200) {
    attempts++;
    const x = getRandomCoord();
    const y = getRandomCoord();
    
    if (!addPosition(x, y)) continue;
    
    // 墙壁类型分布
    let type = 'normal';
    const rand = Math.random();
    
    if (levelNum >= 65 && rand < 0.15) {
      type = 'ghost'; // 幽灵鼠
    } else if (levelNum >= 70 && rand < 0.25) {
      type = 'strong'; // 加固墙
    } else if (levelNum >= 75 && rand < 0.05) {
      type = 'bomb'; // 炸弹墙
    }
    
    walls.push({ x, y, type });
  }
  
  // 生成静态炸弹
  const bombCount = isBoss ? 5 : (isConsume ? 4 : 2 + Math.floor(Math.random() * 2));
  
  attempts = 0;
  while (staticBombs.length < bombCount && attempts < 200) {
    attempts++;
    const x = getRandomCoord();
    const y = getRandomCoord();
    
    if (!addPosition(x, y)) continue;
    
    // 静态炸弹类型
    let evolution = 0;
    if (levelNum >= 80) {
      evolution = [0, 1, 2, 3][Math.floor(Math.random() * 4)];
    } else if (levelNum >= 70) {
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
  } else {
    hint = `第${levelNum}关：消灭所有老鼠！`;
  }
  
  return {
    gridSize: 6,
    hint,
    walls,
    staticBombs
  };
}

// 生成61-100关
const newLevels = [];
for (let i = 61; i <= 100; i++) {
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
console.log(`已生成61-100关，共40个关卡`);
