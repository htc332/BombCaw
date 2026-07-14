/**
 * test/validate-static-bombs.js
 * 验证所有关卡的静态炸弹爆炸范围是否与老鼠布局匹配
 */

const LEVELS = require('../src/data/LevelData.js');

// 爆炸范围定义（与GameLogic.js一致）
function getExplosionRange(evo) {
  const range = [{ x: 0, y: 0, distance: 0 }]; // 中心点

  if (evo === 0) {
    // LV1: 十字1格
    range.push({ x: 0, y: -1, distance: 1 });
    range.push({ x: 0, y: 1, distance: 1 });
    range.push({ x: -1, y: 0, distance: 1 });
    range.push({ x: 1, y: 0, distance: 1 });
  } else if (evo === 2) {
    // LV2: 竖直上下各3格
    for (let d = 1; d <= 3; d++) {
      range.push({ x: 0, y: -d, distance: d });
      range.push({ x: 0, y: d, distance: d });
    }
  } else if (evo === 3) {
    // LV3: 横向左右各3格 + 上方1格
    for (let d = 1; d <= 3; d++) {
      range.push({ x: -d, y: 0, distance: d });
      range.push({ x: d, y: 0, distance: d });
    }
    range.push({ x: 0, y: -1, distance: 1 });
  } else if (evo === 5) {
    // LV4: 十字1格 + 对角1格
    range.push({ x: 0, y: -1, distance: 1 });
    range.push({ x: 0, y: 1, distance: 1 });
    range.push({ x: -1, y: 0, distance: 1 });
    range.push({ x: 1, y: 0, distance: 1 });
    range.push({ x: -1, y: -1, distance: 1 });
    range.push({ x: 1, y: -1, distance: 1 });
    range.push({ x: -1, y: 1, distance: 1 });
    range.push({ x: 1, y: 1, distance: 1 });
  }

  return range;
}

// 检查静态炸弹是否能炸到至少一只老鼠
function validateStaticBomb(levelNum, levelConfig) {
  const errors = [];
  const warnings = [];

  if (!levelConfig.staticBombs || levelConfig.staticBombs.length === 0) {
    return { errors, warnings }; // 没有静态炸弹，无需检查
  }

  const walls = levelConfig.walls || [];
  
  // 创建老鼠位置集合
  const mousePositions = new Set();
  walls.forEach(w => {
    if (w.type === 'normal' || w.type === 'strong' || w.type === 'ghost' || w.type === 'wall') {
      mousePositions.add(`${w.x},${w.y}`);
    }
  });

  levelConfig.staticBombs.forEach((sb, idx) => {
    const range = getExplosionRange(sb.evolution);
    let canHitMouse = false;
    let hitCount = 0;

    range.forEach(r => {
      const targetX = sb.x + r.x;
      const targetY = sb.y + r.y;
      if (mousePositions.has(`${targetX},${targetY}`)) {
        canHitMouse = true;
        hitCount++;
      }
    });

    if (!canHitMouse) {
      errors.push(`静态炸弹[${idx}]@(${sb.x},${sb.y}) evo=${sb.evolution} 无法炸到任何老鼠`);
    } else if (hitCount < 2) {
      warnings.push(`静态炸弹[${idx}]@(${sb.x},${sb.y}) evo=${sb.evolution} 只能炸到${hitCount}只老鼠，效果有限`);
    }
  });

  return { errors, warnings };
}

// 检查所有关卡
function validateAll() {
  console.log('=== 静态炸弹布局验证 ===\n');
  
  let totalErrors = 0;
  let totalWarnings = 0;

  for (let i = 1; i <= 50; i++) {
    const level = LEVELS[i];
    if (!level) {
      console.log(`❌ 关卡 ${i}: 缺失`);
      totalErrors++;
      continue;
    }

    const result = validateStaticBomb(i, level);
    
    if (result.errors.length > 0 || result.warnings.length > 0) {
      console.log(`关卡 ${i.toString().padStart(2, '0')} (${level.walls.length}墙壁 ${level.staticBombs?.length || 0}静态炸弹):`);
      
      result.errors.forEach(e => {
        console.log(`  ❌ ${e}`);
        totalErrors++;
      });
      
      result.warnings.forEach(w => {
        console.log(`  ⚠️ ${w}`);
        totalWarnings++;
      });
      
      console.log('');
    }
  }

  console.log('=== 验证总结 ===');
  console.log(`错误: ${totalErrors}`);
  console.log(`警告: ${totalWarnings}`);
  
  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('✅ 所有静态炸弹布局正确！');
  }
  
  return totalErrors === 0;
}

// 运行验证
const success = validateAll();
process.exit(success ? 0 : 1);
