/**
 * test/level-tester.js
 * 关卡测试器 - 模拟游戏逻辑测试关卡可解性
 */

const GameLogic = require('../src/core/GameLogic.js');
const LEVELS = require('../src/data/LevelData.js');

class LevelTester {
  constructor() {
    this.results = [];
  }

  // 测试所有关卡
  testAll() {
    console.log('=== 关卡可解性测试 ===\n');
    
    for (let i = 1; i <= 18; i++) {
      const level = LEVELS[i];
      if (!level) {
        console.log(`❌ 关卡 ${i}: 缺失`);
        continue;
      }
      
      this.testLevel(i, level);
    }
    
    this.printReport();
  }

  // 测试单个关卡
  testLevel(levelNum, levelConfig) {
    console.log(`\n测试关卡 ${levelNum}...`);
    
    const game = new GameLogic();
    game.initLevel(levelConfig);
    
    // 模拟最优解：尝试在中心放置炸弹
    const half = Math.floor(levelConfig.gridSize / 2);
    let bombsPlaced = 0;
    let maxBombs = 20; // 防止无限循环
    
    // 简单策略：在(0,0)放置LV1炸弹
    while (game.walls.size > 0 && bombsPlaced < maxBombs && game.score > 0) {
      // 尝试在(0,0)放置
      if (game.tryPlaceBomb(0, 0)) {
        bombsPlaced++;
        // 等待爆炸完成（简化：直接调用爆炸）
        const bomb = game.bombs.get('0,0');
        if (bomb) {
          game.explodeBomb(bomb);
        }
      } else {
        // 尝试其他位置
        let placed = false;
        for (let x = -half; x <= half && !placed; x++) {
          for (let y = -half; y <= half && !placed; y++) {
            if (game.tryPlaceBomb(x, y)) {
              bombsPlaced++;
              placed = true;
              const bomb = game.bombs.get(`${x},${y}`);
              if (bomb) {
                game.explodeBomb(bomb);
              }
            }
          }
        }
        if (!placed) break;
      }
    }
    
    const result = {
      level: levelNum,
      wallsRemaining: game.walls.size,
      bombsPlaced: bombsPlaced,
      score: game.score,
      success: game.walls.size === 0,
      reason: game.walls.size === 0 ? '通关' : (game.score <= 0 ? '积分耗尽' : '无法放置')
    };
    
    this.results.push(result);
    
    const status = result.success ? '✅' : '❌';
    console.log(`${status} 关卡 ${levelNum}: ${result.reason}, 剩余${game.walls.size}墙壁, 积分${game.score}`);
  }

  // 打印报告
  printReport() {
    console.log('\n=== 测试报告 ===\n');
    
    const successCount = this.results.filter(r => r.success).length;
    const failCount = this.results.length - successCount;
    
    console.log(`通过: ${successCount}/${this.results.length}`);
    console.log(`失败: ${failCount}/${this.results.length}`);
    
    if (failCount > 0) {
      console.log('\n失败的关卡:');
      this.results.filter(r => !r.success).forEach(r => {
        console.log(`  关卡 ${r.level}: ${r.reason}, 剩余${r.wallsRemaining}墙壁`);
      });
    }
  }
}

// 运行测试
if (require.main === module) {
  const tester = new LevelTester();
  tester.testAll();
}

module.exports = LevelTester;
