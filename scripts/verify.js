const fs = require('fs');

// 1. 检查 GameLogic.js 关键修改
const gameLogic = fs.readFileSync('src/core/GameLogic.js', 'utf8');
console.log('=== GameLogic.js 检查 ===');
console.log('初始10分:', gameLogic.includes('this.score = 10') ? '✓' : '✗');
console.log('炸弹消耗[2,3,4,5]:', gameLogic.includes('[2, 3, 4, 5]') ? '✓' : '✗');
console.log('LV2上下各3格:', gameLogic.includes('for (let d = 1; d <= 3; d++)') ? '✓' : '✗');
console.log('LV3横向+上方:', gameLogic.includes('y: bomb.y - 1') ? '✓' : '✗');
console.log('统一+1分:', gameLogic.includes("addScore(1, '消灭老鼠')") ? '✓' : '✗');
console.log('失败条件分数<=0:', gameLogic.includes('this.score <= 0') ? '✓' : '✗');
console.log('移除bombsLeft:', !gameLogic.includes('this.bombsLeft') ? '✓' : '✗');

// 2. 检查 Config.js
const config = fs.readFileSync('src/data/Config.js', 'utf8');
console.log('\n=== Config.js 检查 ===');
console.log('cost=2:', config.includes('cost: 2') ? '✓' : '✗');
console.log('cost=3:', config.includes('cost: 3') ? '✓' : '✗');
console.log('cost=4:', config.includes('cost: 4') ? '✓' : '✗');
console.log('cost=5:', config.includes('cost: 5') ? '✓' : '✗');

// 3. 检查 main.js
const main = fs.readFileSync('src/main.js', 'utf8');
console.log('\n=== main.js 检查 ===');
console.log('失败重置10分:', main.includes('this.gameLogic.score = 10') ? '✓' : '✗');
console.log('积分不足提示:', main.includes('insufficient_score') ? '✓' : '✗');
console.log('移除牛奶引用:', !main.includes('牛奶') ? '✓' : '✗');

// 4. 检查 LevelData.js
const levelData = fs.readFileSync('src/data/LevelData.js', 'utf8');
console.log('\n=== LevelData.js 检查 ===');
console.log('移除bombs字段:', !levelData.includes('bombs:') ? '✓' : '✗');

// 5. 检查 Renderer.js
const renderer = fs.readFileSync('src/view/Renderer.js', 'utf8');
console.log('\n=== Renderer.js 检查 ===');
console.log('显示已放炸弹:', renderer.includes('bombsPlaced') ? '✓' : '✗');
console.log('显示消灭老鼠:', renderer.includes('wallsDestroyed') ? '✓' : '✗');

// 6. 检查 UIManager.js
const uiManager = fs.readFileSync('src/view/UIManager.js', 'utf8');
console.log('\n=== UIManager.js 检查 ===');
console.log('显示消耗积分:', uiManager.includes('-${type.cost}分') ? '✓' : '✗');
console.log('积分不足提示:', uiManager.includes('积分不足') ? '✓' : '✗');
