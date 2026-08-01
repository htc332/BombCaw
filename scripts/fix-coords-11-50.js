/**
 * 修复11-50关坐标：将超出5x5范围的坐标调整到[-2, 2]内
 * 同时确保不重复、不重叠
 */

const fs = require('fs');
const path = require('path');

const levelDataPath = path.join(__dirname, '../src/data/LevelData.js');
let content = fs.readFileSync(levelDataPath, 'utf8');

// 解析LevelData.js
const levels = {};
const levelRegex = /\/\/ 第(\d+)关[\s\S]*?(\d+): \{([\s\S]*?)\n  \},/g;
let match;

while ((match = levelRegex.exec(content)) !== null) {
  const levelNum = parseInt(match[2]);
  const levelContent = match[3];
  levels[levelNum] = { content: levelContent, fullMatch: match[0] };
}

// 5x5棋盘范围
const MIN_C = -2;
const MAX_C = 2;

function getRandomCoord() {
  return Math.floor(Math.random() * (MAX_C - MIN_C + 1)) + MIN_C;
}

function fixLevel(levelNum) {
  const levelData = levels[levelNum];
  if (!levelData) return null;
  
  let newContent = levelData.content;
  
  // 提取walls
  const wallsMatch = newContent.match(/walls: \[([\s\S]*?)\],/);
  if (!wallsMatch) return null;
  
  // 提取staticBombs
  const bombsMatch = newContent.match(/staticBombs: \[([\s\S]*?)\]/);
  
  // 生成新的walls（确保在5x5范围内）
  const usedPositions = new Set();
  const newWalls = [];
  const wallCount = 8 + Math.floor(Math.random() * 4); // 8-11个墙壁
  
  while (newWalls.length < wallCount) {
    const x = getRandomCoord();
    const y = getRandomCoord();
    const key = `${x},${y}`;
    
    if (usedPositions.has(key)) continue;
    usedPositions.add(key);
    
    let type = 'normal';
    if (levelNum >= 20 && Math.random() < 0.2) type = 'strong';
    if (levelNum >= 30 && Math.random() < 0.15) type = 'ghost';
    
    newWalls.push({ x, y, type });
  }
  
  // 生成新的staticBombs
  const newBombs = [];
  const bombCount = levelNum % 5 === 0 ? 4 : 2 + Math.floor(Math.random() * 2);
  
  while (newBombs.length < bombCount) {
    const x = getRandomCoord();
    const y = getRandomCoord();
    const key = `${x},${y}`;
    
    if (usedPositions.has(key)) continue;
    usedPositions.add(key);
    
    let evolution = 0;
    if (levelNum >= 25) {
      evolution = [0, 2][Math.floor(Math.random() * 2)];
    }
    if (levelNum >= 40) {
      evolution = [0, 2, 3][Math.floor(Math.random() * 3)];
    }
    
    newBombs.push({ x, y, evolution });
  }
  
  // 构建新的关卡内容
  let result = `\n    gridSize: 5,\n    hint: '第${levelNum}关：消灭所有老鼠！',\n    walls: [\n`;
  newWalls.forEach(wall => {
    result += `      { x: ${wall.x}, y: ${wall.y}, type: '${wall.type}' },\n`;
  });
  result += `    ],\n    staticBombs: [\n`;
  newBombs.forEach(bomb => {
    result += `      { x: ${bomb.x}, y: ${bomb.y}, evolution: ${bomb.evolution} },\n`;
  });
  result += `    ]\n  `;
  
  return result;
}

// 修复11-50关
for (let i = 11; i <= 50; i++) {
  const fixed = fixLevel(i);
  if (fixed) {
    const oldContent = levels[i].fullMatch;
    const newFullMatch = oldContent.replace(levels[i].content, fixed);
    content = content.replace(oldContent, newFullMatch);
    console.log(`已修复第${i}关`);
  }
}

fs.writeFileSync(levelDataPath, content);
console.log('\n11-50关坐标修复完成');
