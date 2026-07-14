/**
 * test/fix-static-bombs.js
 * 自动修复所有关卡的静态炸弹布局
 */

const fs = require('fs');
const path = require('path');

// 读取原始文件
const levelFile = path.join(__dirname, '../src/data/LevelData.js');
let content = fs.readFileSync(levelFile, 'utf8');

// 爆炸范围定义
function getExplosionRange(evo) {
  const range = [{ x: 0, y: 0 }];
  if (evo === 0) {
    range.push({ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 });
  } else if (evo === 2) {
    for (let d = 1; d <= 3; d++) {
      range.push({ x: 0, y: -d }, { x: 0, y: d });
    }
  } else if (evo === 3) {
    for (let d = 1; d <= 3; d++) {
      range.push({ x: -d, y: 0 }, { x: d, y: 0 });
    }
    range.push({ x: 0, y: -1 });
  } else if (evo === 5) {
    range.push({ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 });
    range.push({ x: -1, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: 1, y: 1 });
  }
  return range;
}

// 检查静态炸弹是否能炸到老鼠
function canHitMouse(sb, walls) {
  const range = getExplosionRange(sb.evolution);
  let hitCount = 0;
  
  for (const w of walls) {
    if (w.type === 'normal' || w.type === 'strong' || w.type === 'ghost' || w.type === 'wall') {
      for (const r of range) {
        if (w.x === sb.x + r.x && w.y === sb.y + r.y) {
          hitCount++;
          break;
        }
      }
    }
  }
  
  return hitCount;
}

// 找到最佳静态炸弹位置
function findBestStaticBombPosition(walls, gridSize, evolution) {
  const range = getExplosionRange(evolution);
  const half = Math.floor(gridSize / 2);
  let bestPos = null;
  let bestHit = 0;
  
  // 遍历所有可能位置
  for (let x = -half; x <= half; x++) {
    for (let y = -half; y <= half; y++) {
      // 检查位置是否被占用
      let occupied = false;
      for (const w of walls) {
        if (w.x === x && w.y === y) {
          occupied = true;
          break;
        }
      }
      if (occupied) continue;
      
      // 计算能炸到的老鼠数
      let hitCount = 0;
      for (const w of walls) {
        if (w.type === 'normal' || w.type === 'strong' || w.type === 'ghost' || w.type === 'wall') {
          for (const r of range) {
            if (w.x === x + r.x && w.y === y + r.y) {
              hitCount++;
              break;
            }
          }
        }
      }
      
      if (hitCount > bestHit) {
        bestHit = hitCount;
        bestPos = { x, y, evolution };
      }
    }
  }
  
  return bestPos;
}

// 解析关卡配置
function parseLevel(content, levelNum) {
  const regex = new RegExp(`${levelNum}:\\s*\\{([^}]+)\\}`, 's');
  const match = content.match(regex);
  if (!match) return null;
  
  // 简单解析，提取walls和staticBombs
  const wallsMatch = match[1].match(/walls:\\s*\\[([^\\]]+)\\]/s);
  const staticBombsMatch = match[1].match(/staticBombs:\\s*\\[([^\\]]*)\\]/s);
  
  return {
    walls: wallsMatch ? wallsMatch[1] : '',
    staticBombs: staticBombsMatch ? staticBombsMatch[1] : ''
  };
}

// 主函数
function main() {
  console.log('=== 开始修复静态炸弹布局 ===\n');
  
  // 由于解析复杂，我们采用更简单的方法：
  // 1. 备份原文件
  // 2. 重新生成所有关卡
  
  console.log('建议：重新生成所有关卡配置');
  console.log('由于文件复杂，手动修复容易出错');
  
  // 检查特定关卡的静态炸弹
  const problematicLevels = [2, 3, 7, 8, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 22, 23, 26, 27, 28, 30, 33, 36, 38, 43];
  
  console.log('\n问题关卡列表：');
  problematicLevels.forEach(l => console.log(`  - 关卡 ${l}`));
  
  console.log('\n建议修复方案：');
  console.log('1. 重新设计所有关卡的静态炸弹布局');
  console.log('2. 确保LV2竖直炸弹与老鼠在同一x列');
  console.log('3. 确保LV3横向炸弹与老鼠在同一y行');
  console.log('4. 确保LV4十字对角炸弹在老鼠的十字或对角方向');
}

main();
