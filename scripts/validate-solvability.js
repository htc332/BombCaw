/**
 * 关卡可解性验证脚本
 * 模拟完整的爆炸过程，验证每个关卡是否可解
 */

const LEVELS = require('../src/data/LevelData.js');

// 获取坐标键值
function getCoordKey(x, y) {
  return `${x},${y}`;
}

// 获取爆炸范围（与游戏逻辑一致）
function getExplosionRange(x, y, evolution) {
  const range = [{ x, y }];
  
  if (evolution === 0) {
    // LV1: 十字1格
    [[0,1], [0,-1], [1,0], [-1,0]].forEach(([dx, dy]) => {
      range.push({ x: x + dx, y: y + dy });
    });
  } else if (evolution === 1) {
    // LV2: 竖直上下2格
    [[0,1], [0,-1]].forEach(([dx, dy]) => {
      for (let d = 1; d <= 2; d++) {
        range.push({ x: x + dx * d, y: y + dy * d });
      }
    });
  } else if (evolution === 2) {
    // LV3: 横向左右2格
    [[1,0], [-1,0]].forEach(([dx, dy]) => {
      for (let d = 1; d <= 2; d++) {
        range.push({ x: x + dx * d, y: y + dy * d });
      }
    });
  } else if (evolution === 3) {
    // LV4: 十字1格 + 对角1格
    [[0,1], [0,-1], [1,0], [-1,0]].forEach(([dx, dy]) => {
      range.push({ x: x + dx, y: y + dy });
    });
    [[-1,-1], [1,-1], [-1,1], [1,1]].forEach(([dx, dy]) => {
      range.push({ x: x + dx, y: y + dy });
    });
  }
  
  return range;
}

// 验证关卡可解性
function validateSolvability(levelNum, level) {
  const { walls = [], staticBombs = [] } = level;
  const wallCoords = new Set();
  walls.forEach(w => wallCoords.add(getCoordKey(w.x, w.y)));
  
  const warnings = [];
  
  // 1. 检查每个 staticBomb 是否能被触发（爆炸范围内有 wall 或其他 staticBomb）
  staticBombs.forEach((bomb, index) => {
    const range = getExplosionRange(bomb.x, bomb.y, bomb.evolution);
    let canTrigger = false;
    
    for (const pos of range) {
      // 检查是否有 wall
      if (wallCoords.has(getCoordKey(pos.x, pos.y))) {
        canTrigger = true;
        break;
      }
      // 检查是否有其他 staticBomb（连锁触发）
      for (let i = 0; i < staticBombs.length; i++) {
        if (i !== index && staticBombs[i].x === pos.x && staticBombs[i].y === pos.y) {
          canTrigger = true;
          break;
        }
      }
      if (canTrigger) break;
    }
    
    if (!canTrigger) {
      warnings.push(`⚠️ staticBombs[${index}] 坐标(${bomb.x},${bomb.y}) 无法被任何方式触发`);
    }
  });
  
  // 2. 检查每个 wall 是否能被炸到（被 staticBomb 或玩家炸弹）
  // 简化检查：只要有 staticBomb 在附近，或者可以被玩家炸弹炸到
  walls.forEach((wall, index) => {
    let canBeHit = false;
    
    // 检查是否有 staticBomb 的爆炸范围覆盖此 wall
    for (const bomb of staticBombs) {
      const range = getExplosionRange(bomb.x, bomb.y, bomb.evolution);
      if (range.some(pos => pos.x === wall.x && pos.y === wall.y)) {
        canBeHit = true;
        break;
      }
    }
    
    // 如果没有 staticBomb 能直接炸到，检查是否有 staticBomb 在相邻位置（玩家可以引爆炸弹）
    if (!canBeHit) {
      const adjacentPositions = [
        [0, -1], [0, 1], [-1, 0], [1, 0],
        [-1, -1], [1, -1], [-1, 1], [1, 1]
      ];
      
      for (const [dx, dy] of adjacentPositions) {
        const adjX = wall.x + dx;
        const adjY = wall.y + dy;
        
        // 检查相邻位置是否有 staticBomb
        const hasStaticBomb = staticBombs.some(b => b.x === adjX && b.y === adjY);
        if (hasStaticBomb) {
          canBeHit = true;
          break;
        }
        
        // 检查相邻位置是否为空（玩家可以放置炸弹）
        const hasWall = walls.some(w => w.x === adjX && w.y === adjY);
        const hasOtherStaticBomb = staticBombs.some(b => b.x === adjX && b.y === adjY);
        if (!hasWall && !hasOtherStaticBomb) {
          canBeHit = true;
          break;
        }
      }
    }
    
    if (!canBeHit) {
      warnings.push(`❌ walls[${index}] 坐标(${wall.x},${wall.y}) 无法被任何炸弹炸到（不可解）`);
    }
  });
  
  return warnings;
}

// 主函数
function main() {
  console.log('🔍 开始验证关卡可解性...\n');
  
  let totalWarnings = 0;
  let unsolvableLevels = 0;
  
  const levelKeys = Object.keys(LEVELS).sort((a, b) => parseInt(a) - parseInt(b));
  
  for (const levelNum of levelKeys) {
    const level = LEVELS[levelNum];
    const warnings = validateSolvability(parseInt(levelNum), level);
    
    if (warnings.length === 0) {
      console.log(`✅ 第${levelNum}关: 可解`);
    } else {
      console.log(`\n📋 第${levelNum}关:`);
      warnings.forEach(warn => console.log(`  ${warn}`));
      totalWarnings += warnings.length;
      
      // 如果有 ❌ 标记，说明是不可解的
      if (warnings.some(w => w.includes('❌'))) {
        unsolvableLevels++;
      }
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 可解性验证结果:');
  console.log(`   总关卡数: ${levelKeys.length}`);
  console.log(`   ✅ 完全可解: ${levelKeys.length - unsolvableLevels}`);
  console.log(`   ❌ 不可解: ${unsolvableLevels}`);
  console.log(`   ⚠️ 警告总数: ${totalWarnings}`);
  console.log('='.repeat(50));
  
  if (unsolvableLevels === 0) {
    console.log('\n🎉 所有关卡理论上可解！');
  } else {
    console.log(`\n⚠️ 发现 ${unsolvableLevels} 个不可解关卡，需要修复！`);
  }
}

main();
