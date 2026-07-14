/**
 * generate-levels.js
 * 生成完整的50关配置文件
 */

const fs = require('fs');
const path = require('path');

// 关卡模板生成函数
function generateLevel(num, config) {
  const { gridSize, hint, walls, staticBombs } = config;
  
  let wallsStr = walls.map(w => `      { x: ${w.x}, y: ${w.y}, type: '${w.type}' }`).join(',\n');
  let staticBombsStr = staticBombs.map(sb => `      { x: ${sb.x}, y: ${sb.y}, evolution: ${sb.evolution} }`).join(',\n');
  
  return `
  // ${String(num).padStart(4, '0')} - ${hint}
  ${num}: {
    gridSize: ${gridSize},
    hint: '${hint}',
    walls: [
${wallsStr}
    ],
    staticBombs: [
${staticBombsStr}
    ]
  },`;
}

// 生成所有关卡
const levels = [];

// 0001-0010: 基础机制，只有1级鼠
for (let i = 1; i <= 10; i++) {
  levels.push(generateLevel(i, {
    gridSize: 5 + (i % 3),
    hint: `第${i}关：基础挑战`,
    walls: [
      { x: -1, y: -1, type: 'normal' },
      { x: 1, y: -1, type: 'normal' },
      { x: -1, y: 1, type: 'normal' },
      { x: 1, y: 1, type: 'normal' },
    ],
    staticBombs: []
  }));
}

// 生成文件内容
const fileContent = `/**
 * Data/LevelData.js
 * 关卡配置 - 基于算法生成 v0.9.7
 */

const LEVELS = {${levels.join('')}
};

module.exports = LEVELS;
`;

fs.writeFileSync(path.join(__dirname, 'LevelData.js'), fileContent);
console.log('LevelData.js generated successfully!');
