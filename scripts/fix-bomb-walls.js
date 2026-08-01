/**
 * 修复101-200关：移除炸弹墙(type: 'bomb')，改为normal或strong
 * 炸弹墙不是游戏中的有效元素
 */

const fs = require('fs');
const path = require('path');

const levelDataPath = path.join(__dirname, '../src/data/LevelData.js');
let content = fs.readFileSync(levelDataPath, 'utf8');

// 将所有 type: 'bomb' 替换为 type: 'strong'（因为炸弹墙不应该存在）
content = content.replace(/type: 'bomb'/g, "type: 'strong'");

fs.writeFileSync(levelDataPath, content);
console.log('已修复：将所有炸弹墙(type: bomb)替换为加固墙(type: strong)');
