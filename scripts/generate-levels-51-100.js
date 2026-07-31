/**
 * 生成51-100关关卡配置
 * 6x6棋盘，引入幽灵鼠
 */

const fs = require('fs');
const path = require('path');

// 读取现有LevelData.js
const levelDataPath = path.join(__dirname, '../src/data/LevelData.js');
let levelDataContent = fs.readFileSync(levelDataPath, 'utf8');

// 找到第50关的结束位置（在导出之前插入）
const insertMarker = '  },\n};\n\n// ========== 导出 ==========';
const insertIndex = levelDataContent.indexOf(insertMarker);

if (insertIndex === -1) {
  console.error('找不到插入位置');
  process.exit(1);
}

// 生成51-100关
const newLevels = [];

// 关卡类型
const LEVEL_TYPES = {
  TUTORIAL: 'tutorial',
  PRACTICE: 'practice',
  CHALLENGE: 'challenge',
  CONSUME: 'consume',
  BOSS: 'boss',
  RELAX: 'relax'
};

// 生成关卡配置
function generateLevel(levelNum) {
  const gridSize = 6;
  const isConsume = levelNum % 5 === 0; // 每5关一个消耗关
  
  // 根据关卡号确定类型
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
  
  // 生成墙壁布局
  const walls = [];
  const staticBombs = [];
  
  // 6x6棋盘的坐标范围是 -3 到 3
  const maxCoord = 3;
  
  // 根据关卡难度确定墙壁数量
  const wallCount = Math.min(8 + Math.floor((levelNum - 51) / 5), 16);
  
  // 生成墙壁位置（避免重叠）
  const usedPositions = new Set();
  
  // 添加一些固定模式的墙壁
  const patterns = [
    // 四角
    [{x: -3, y: -3}, {x: 3, y: -3}, {x: -3, y: 3}, {x: 3, y: 3}],
    // 边缘
    [{x: 0, y: -3}, {x: 0, y: 3}, {x: -3, y: 0}, {x: 3, y: 0}],
    // 十字
    [{x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}],
  ];
  
  // 随机选择一个模式基础
  const basePattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  // 添加基础墙壁
  basePattern.forEach(pos => {
    if (usedPositions.size < wallCount) {
      const key = `${pos.x},${pos.y}`;
      if (!usedPositions.has(key)) {
        usedPositions.add(key);
        
        // 根据关卡决定墙壁类型
        let wallType = 'normal';
        
        // 50关后引入幽灵鼠
        if (levelNum >= 55 && Math.random() < 0.3) {
          wallType = 'ghost';
        }
        
        // 加固墙
        if (levelNum >= 60 && Math.random() < 0.2) {
          wallType = 'strong';
        }
        
        walls.push({
          x: pos.x,
          y: pos.y,
          type: wallType
        });
      }
    }
  });
  
  // 随机添加更多墙壁
  while (usedPositions.size < wallCount) {
    const x = Math.floor(Math.random() * 7) - 3; // -3 to 3
    const y = Math.floor(Math.random() * 7) - 3;
    
    const key = `${x},${y}`;
    if (!usedPositions.has(key)) {
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
      
      walls.push({
        x,
        y,
        type: wallType
      });
    }
  }
  
  // 生成静态炸弹
  const staticBombCount = isConsume ? 3 : Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < staticBombCount; i++) {
    let x, y, key;
    let attempts = 0;
    
    do {
      x = Math.floor(Math.random() * 7) - 3;
      y = Math.floor(Math.random() * 7) - 3;
      key = `${x},${y}`;
      attempts++;
    } while (usedPositions.has(key) && attempts < 50);
    
    if (attempts < 50) {
      usedPositions.add(key);
      
      // 根据关卡决定静态炸弹类型
      let evolution = 0;
      if (levelNum >= 70) {
        evolution = [0, 2, 3, 5][Math.floor(Math.random() * 4)];
      } else if (levelNum >= 60) {
        evolution = [0, 2, 3][Math.floor(Math.random() * 3)];
      } else {
        evolution = [0, 2][Math.floor(Math.random() * 2)];
      }
      
      staticBombs.push({
        x,
        y,
        evolution
      });
    }
  }
  
  // 生成提示文本
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

// 生成51-100关
for (let i = 51; i <= 100; i++) {
  const level = generateLevel(i);
  
  newLevels.push(`  // 第${i}关${level.isConsume ? '：★消耗关★' : ''}`);
  newLevels.push(`  ${i}: {`);
  newLevels.push(`    gridSize: ${level.gridSize},`);
  newLevels.push(`    type: LEVEL_TYPES.${level.type.toUpperCase()},`);
  newLevels.push(`    isConsume: ${level.isConsume},`);
  newLevels.push(`    hint: '${level.hint}',`);
  
  // walls
  newLevels.push(`    walls: [`);
  level.walls.forEach(wall => {
    newLevels.push(`      { x: ${wall.x}, y: ${wall.y}, type: '${wall.type}' },`);
  });
  newLevels.push(`    ],`);
  
  // staticBombs
  newLevels.push(`    staticBombs: [`);
  level.staticBombs.forEach(bomb => {
    newLevels.push(`      { x: ${bomb.x}, y: ${bomb.y}, evolution: ${bomb.evolution} },`);
  });
  newLevels.push(`    ]`);
  newLevels.push(`  },`);
  newLevels.push('');
}

// 插入新关卡到文件
const newContent = levelDataContent.slice(0, insertIndex) + 
  newLevels.join('\n') + '\n' + 
  levelDataContent.slice(insertIndex);

fs.writeFileSync(levelDataPath, newContent);

console.log('已生成51-100关关卡配置');
console.log(`共生成 ${100 - 51 + 1} 个关卡`);
