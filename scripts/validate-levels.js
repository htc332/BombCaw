/**
 * 关卡配置验证脚本
 * 检查所有关卡的配置合法性
 * 
 * 验证规则：
 * 1. 坐标范围检查 - 所有坐标必须在 gridSize 范围内
 * 2. 牛鼠重叠检查 - walls 和 staticBombs 不能有相同坐标
 * 3. walls 内部重复检查 - walls 数组内不能有重复坐标
 * 4. staticBombs 内部重复检查 - staticBombs 数组内不能有重复坐标
 * 5. evolution 值范围检查 - 必须在 0-3 范围内（对应 LV1-LV4）
 * 6. 可解性检查 - 每个 staticBomb 的爆炸范围内至少有一个 wall
 * 7. 方向正确性检查 - evolution=1(竖直)对应竖直walls，evolution=2(横向)对应横向walls
 * 8. 墙壁类型检查 - 只允许 normal, strong, ghost 三种类型（不允许 bomb）
 * 9. 棋盘大小规则检查 - 1-50关5x5，51-100关6x6，101-150关7x7，151-200关8x8，不递减
 */

const LEVELS = require('../src/data/LevelData.js');

// 获取坐标键值
function getCoordKey(x, y) {
  return `${x},${y}`;
}

// 检查坐标是否在范围内（与游戏逻辑一致）
function isInRange(x, y, gridSize) {
  const half = Math.floor(gridSize / 2);
  // 偶数棋盘: [-half+1, half]，奇数棋盘: [-half, half]
  const min = gridSize % 2 === 0 ? -half + 1 : -half;
  const max = half;
  return x >= min && x <= max && y >= min && y <= max;
}

// 获取坐标范围（用于显示）
function getRange(gridSize) {
  const half = Math.floor(gridSize / 2);
  const min = gridSize % 2 === 0 ? -half + 1 : -half;
  const max = half;
  return { min, max };
}

// 验证单个关卡
function validateLevel(levelNum, level) {
  const errors = [];
  const warnings = [];
  
  const { gridSize, walls = [], staticBombs = [] } = level;
  const range = getRange(gridSize);
  
  // 1. 坐标范围检查
  walls.forEach((wall, index) => {
    if (!isInRange(wall.x, wall.y, gridSize)) {
      errors.push(`❌ walls[${index}] 坐标(${wall.x}, ${wall.y})超出范围 [${range.min}~${range.max}]`);
    }
  });
  
  staticBombs.forEach((bomb, index) => {
    if (!isInRange(bomb.x, bomb.y, gridSize)) {
      errors.push(`❌ staticBombs[${index}] 坐标(${bomb.x}, ${bomb.y})超出范围 [${range.min}~${range.max}]`);
    }
  });
  
  // 2. walls 内部重复检查
  const wallCoords = new Map();
  walls.forEach((wall, index) => {
    const key = getCoordKey(wall.x, wall.y);
    if (wallCoords.has(key)) {
      errors.push(`❌ walls 内部重复: 坐标(${wall.x}, ${wall.y}) 在索引 ${wallCoords.get(key)} 和 ${index}`);
    } else {
      wallCoords.set(key, index);
    }
  });
  
  // 3. staticBombs 内部重复检查
  const bombCoords = new Map();
  staticBombs.forEach((bomb, index) => {
    const key = getCoordKey(bomb.x, bomb.y);
    if (bombCoords.has(key)) {
      errors.push(`❌ staticBombs 内部重复: 坐标(${bomb.x}, ${bomb.y}) 在索引 ${bombCoords.get(key)} 和 ${index}`);
    } else {
      bombCoords.set(key, index);
    }
  });
  
  // 4. 牛鼠重叠检查（walls 和 staticBombs 之间）
  staticBombs.forEach((bomb, index) => {
    const key = getCoordKey(bomb.x, bomb.y);
    if (wallCoords.has(key)) {
      errors.push(`❌ 牛鼠重叠: staticBombs[${index}] 坐标(${bomb.x}, ${bomb.y}) 与 walls[${wallCoords.get(key)}] 重叠`);
    }
  });
  
  // 5. evolution 值范围检查
  staticBombs.forEach((bomb, index) => {
    if (bomb.evolution < 0 || bomb.evolution > 3) {
      errors.push(`❌ staticBombs[${index}] evolution=${bomb.evolution} 超出范围 [0-3]`);
    }
  });
  
  // 6. 可解性检查 - 每个 staticBomb 是否能炸到至少一个 wall
  staticBombs.forEach((bomb, index) => {
    if (bomb.evolution < 0 || bomb.evolution > 3) return;
    
    let canHitWall = false;
    
    // 检查所有方向（根据爆炸范围规则）
    const directions = [];
    
    // 基础方向（所有等级都有）
    directions.push([0, -1], [0, 1], [-1, 0], [1, 0]); // 上下左右1格
    
    if (bomb.evolution === 3) {
      // LV4: 加上对角
      directions.push([-1, -1], [1, -1], [-1, 1], [1, 1]);
    }
    
    // 检查基础方向
    for (const [dx, dy] of directions) {
      const targetX = bomb.x + dx;
      const targetY = bomb.y + dy;
      if (wallCoords.has(getCoordKey(targetX, targetY))) {
        canHitWall = true;
        break;
      }
    }
    
    // 对于 LV2 (evolution=1)，检查竖直方向2格
    if (!canHitWall && bomb.evolution === 1) {
      for (let dist = 2; dist <= 2; dist++) {
        if (wallCoords.has(getCoordKey(bomb.x, bomb.y - dist)) ||
            wallCoords.has(getCoordKey(bomb.x, bomb.y + dist))) {
          canHitWall = true;
          break;
        }
      }
    }
    
    // 对于 LV3 (evolution=2)，检查横向2格
    if (!canHitWall && bomb.evolution === 2) {
      for (let dist = 2; dist <= 2; dist++) {
        if (wallCoords.has(getCoordKey(bomb.x - dist, bomb.y)) ||
            wallCoords.has(getCoordKey(bomb.x + dist, bomb.y))) {
          canHitWall = true;
          break;
        }
      }
    }
    
    if (!canHitWall) {
      warnings.push(`⚠️ staticBombs[${index}] 坐标(${bomb.x}, ${bomb.y}) 爆炸范围内没有 walls（可能无法被触发）`);
    }
  });
  
  // 7. 检查是否有 walls 无法被任何 staticBomb 炸到
  walls.forEach((wall, index) => {
    let canBeHit = false;
    
    staticBombs.forEach(bomb => {
      if (bomb.evolution < 0 || bomb.evolution > 3) return;
      
      const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];
      
      if (bomb.evolution === 3) {
        directions.push([-1, -1], [1, -1], [-1, 1], [1, 1]);
      }
      
      for (const [dx, dy] of directions) {
        if (bomb.x + dx === wall.x && bomb.y + dy === wall.y) {
          canBeHit = true;
          break;
        }
      }
      
      if (!canBeHit && bomb.evolution === 1) {
        for (let dist = 2; dist <= 2; dist++) {
          if (bomb.x === wall.x && Math.abs(bomb.y - wall.y) === dist) {
            canBeHit = true;
            break;
          }
        }
      }
      
      if (!canBeHit && bomb.evolution === 2) {
        for (let dist = 2; dist <= 2; dist++) {
          if (bomb.y === wall.y && Math.abs(bomb.x - wall.x) === dist) {
            canBeHit = true;
            break;
          }
        }
      }
    });
    
    if (!canBeHit && staticBombs.length > 0) {
      warnings.push(`⚠️ walls[${index}] 坐标(${wall.x}, ${wall.y}) 无法被任何 staticBomb 直接炸到`);
    }
  });
  
  // 8. 检查 staticBomb 方向是否与 walls 分布匹配
  staticBombs.forEach((bomb, index) => {
    if (bomb.evolution < 0 || bomb.evolution > 3) return;
    
    // 计算 walls 的分布方向
    const verticalWalls = walls.filter(w => w.x === bomb.x).length;
    const horizontalWalls = walls.filter(w => w.y === bomb.y).length;
    
    // evolution=1 (竖直) 应该对应竖直分布的 walls
    if (bomb.evolution === 1 && verticalWalls === 0 && horizontalWalls > 0) {
      warnings.push(`⚠️ staticBombs[${index}] 坐标(${bomb.x},${bomb.y}) evolution=1(竖直)但walls是横向分布，方向可能不匹配`);
    }
    
    // evolution=2 (横向) 应该对应横向分布的 walls
    if (bomb.evolution === 2 && horizontalWalls === 0 && verticalWalls > 0) {
      warnings.push(`⚠️ staticBombs[${index}] 坐标(${bomb.x},${bomb.y}) evolution=2(横向)但walls是竖直分布，方向可能不匹配`);
    }
  });
  
  // 9. 墙壁类型检查 - 只允许 normal, strong, ghost
  const validWallTypes = ['normal', 'strong', 'ghost'];
  walls.forEach((wall, index) => {
    if (!validWallTypes.includes(wall.type)) {
      errors.push(`❌ walls[${index}] 类型 '${wall.type}' 无效，只允许: ${validWallTypes.join(', ')}`);
    }
  });
  
  // 10. 棋盘大小规则检查
  // 规则: 1-50关5x5，51-100关6x6，101-150关7x7，151-200关8x8
  // 棋盘一旦扩张就不再回退
  const expectedGridSize = levelNum <= 50 ? 5 : (levelNum <= 100 ? 6 : (levelNum <= 150 ? 7 : 8));
  if (gridSize !== expectedGridSize) {
    errors.push(`❌ 棋盘大小错误: 第${levelNum}关应该是 ${expectedGridSize}x${expectedGridSize}，实际是 ${gridSize}x${gridSize}`);
  }
  
  return { errors, warnings, wallCount: walls.length, bombCount: staticBombs.length };
}

// 主函数
function main() {
  console.log('🔍 开始验证关卡配置...\n');
  
  let totalErrors = 0;
  let totalWarnings = 0;
  let passedLevels = 0;
  let failedLevels = 0;
  
  const levelKeys = Object.keys(LEVELS).sort((a, b) => parseInt(a) - parseInt(b));
  
  for (const levelNum of levelKeys) {
    const level = LEVELS[levelNum];
    const result = validateLevel(parseInt(levelNum), level);
    
    if (result.errors.length === 0 && result.warnings.length === 0) {
      console.log(`✅ 第${levelNum}关: 通过 (${result.wallCount} walls, ${result.bombCount} bombs)`);
      passedLevels++;
    } else {
      console.log(`\n📋 第${levelNum}关 (${result.wallCount} walls, ${result.bombCount} bombs):`);
      
      if (result.errors.length > 0) {
        console.log('  错误:');
        result.errors.forEach(err => console.log(`    ${err}`));
        totalErrors += result.errors.length;
      }
      
      if (result.warnings.length > 0) {
        console.log('  警告:');
        result.warnings.forEach(warn => console.log(`    ${warn}`));
        totalWarnings += result.warnings.length;
      }
      
      if (result.errors.length > 0) {
        failedLevels++;
      } else {
        passedLevels++;
      }
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 验证结果统计:');
  console.log(`   总关卡数: ${levelKeys.length}`);
  console.log(`   ✅ 通过: ${passedLevels}`);
  console.log(`   ❌ 失败: ${failedLevels}`);
  console.log(`   ⚠️ 警告总数: ${totalWarnings}`);
  console.log(`   🚨 错误总数: ${totalErrors}`);
  console.log('='.repeat(50));
  
  if (totalErrors === 0) {
    console.log('\n🎉 所有关卡配置验证通过！');
  } else {
    console.log(`\n⚠️ 发现 ${totalErrors} 个错误，需要修复！`);
    process.exit(1);
  }
}

main();
