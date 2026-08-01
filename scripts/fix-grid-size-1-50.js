/**
 * 修复1-50关棋盘大小：全部改为5x5
 * 规则：1-50关必须是5x5，51-100关6x6，101-150关7x7，151-200关8x8
 */

const fs = require('fs');
const path = require('path');

const levelDataPath = path.join(__dirname, '../src/data/LevelData.js');
let content = fs.readFileSync(levelDataPath, 'utf8');

// 解析所有关卡
const levelRegex = /\/\/ 第(\d+)关[\s\S]*?(\d+): \{[\s\S]*?gridSize: (\d+),[\s\S]*?\},/g;
let match;

// 记录需要修改的关卡
const levelsToFix = [];

while ((match = levelRegex.exec(content)) !== null) {
  const levelNum = parseInt(match[2]);
  const gridSize = parseInt(match[3]);
  
  if (levelNum <= 50 && gridSize !== 5) {
    levelsToFix.push({ levelNum, oldGridSize: gridSize });
  }
}

console.log('需要修复的关卡:', levelsToFix.map(l => `${l.levelNum}关(${l.oldGridSize}x${l.oldGridSize})`).join(', '));

// 重新读取文件内容（因为正则会改变位置）
content = fs.readFileSync(levelDataPath, 'utf8');

// 修复每个关卡
levelsToFix.forEach(({ levelNum, oldGridSize }) => {
  // 找到该关卡的gridSize并替换
  const pattern = new RegExp(`(// 第${levelNum}关[\\s\\S]*?${levelNum}: \\{[\\s\\S]*?)gridSize: ${oldGridSize},`);
  content = content.replace(pattern, `$1gridSize: 5,`);
  
  console.log(`已修复第${levelNum}关: ${oldGridSize}x${oldGridSize} -> 5x5`);
});

fs.writeFileSync(levelDataPath, content);
console.log(`\n共修复 ${levelsToFix.length} 个关卡`);
