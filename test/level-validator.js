/**
 * test/level-validator.js
 * 关卡验证器 - 确保生成的关卡可解且符合设计规则
 */

const LEVELS = require('../src/data/LevelData.js');

class LevelValidator {
  constructor() {
    this.results = [];
    this.errors = [];
    this.warnings = [];
  }

  // 验证所有关卡
  validateAll() {
    console.log('=== 关卡验证开始 ===\n');
    
    for (let i = 1; i <= 18; i++) {
      const level = LEVELS[i];
      if (!level) {
        this.errors.push(`关卡 ${i}: 缺失`);
        continue;
      }
      
      this.validateLevel(i, level);
    }
    
    this.printReport();
    return this.errors.length === 0;
  }

  // 验证单个关卡
  validateLevel(levelNum, level) {
    const result = {
      level: levelNum,
      gridSize: level.gridSize,
      wallCount: level.walls ? level.walls.length : 0,
      staticBombCount: level.staticBombs ? level.staticBombs.length : 0,
      errors: [],
      warnings: []
    };

    // 1. 检查基本结构
    if (!level.gridSize || level.gridSize < 3 || level.gridSize > 9) {
      result.errors.push(`gridSize 无效: ${level.gridSize}`);
    }

    // 2. 检查墙壁坐标是否合法
    if (level.walls) {
      const half = Math.floor(level.gridSize / 2);
      level.walls.forEach((wall, idx) => {
        if (Math.abs(wall.x) > half || Math.abs(wall.y) > half) {
          result.errors.push(`墙壁[${idx}] 坐标越界: (${wall.x}, ${wall.y})`);
        }
        if (!wall.type) {
          result.errors.push(`墙壁[${idx}] 缺少type`);
        }
      });
    }

    // 3. 检查静态炸弹坐标是否合法
    if (level.staticBombs) {
      const half = Math.floor(level.gridSize / 2);
      level.staticBombs.forEach((bomb, idx) => {
        if (Math.abs(bomb.x) > half || Math.abs(bomb.y) > half) {
          result.errors.push(`静态炸弹[${idx}] 坐标越界: (${bomb.x}, ${bomb.y})`);
        }
      });
    }

    // 4. 检查是否有重叠
    const positions = new Set();
    if (level.walls) {
      level.walls.forEach(wall => {
        const key = `${wall.x},${wall.y}`;
        if (positions.has(key)) {
          result.errors.push(`位置重叠: (${wall.x}, ${wall.y})`);
        }
        positions.add(key);
      });
    }
    if (level.staticBombs) {
      level.staticBombs.forEach(bomb => {
        const key = `${bomb.x},${bomb.y}`;
        if (positions.has(key)) {
          result.errors.push(`静态炸弹与墙壁重叠: (${bomb.x}, ${bomb.y})`);
        }
        positions.add(key);
      });
    }

    // 5. 检查是否有解（简化版：至少有一个墙壁鼠或普通墙壁）
    const hasTarget = level.walls && level.walls.some(w => 
      w.type === 'wall' || w.type === 'normal' || w.type === 'strong'
    );
    if (!hasTarget) {
      result.warnings.push('没有可破坏的目标');
    }

    // 6. 检查提示文字
    if (!level.hint || level.hint.length === 0) {
      result.warnings.push('缺少提示文字');
    }

    this.results.push(result);
    if (result.errors.length > 0) {
      this.errors.push(...result.errors.map(e => `关卡 ${levelNum}: ${e}`));
    }
    if (result.warnings.length > 0) {
      this.warnings.push(...result.warnings.map(w => `关卡 ${levelNum}: ${w}`));
    }
  }

  // 打印报告
  printReport() {
    console.log('\n=== 验证报告 ===\n');
    
    // 统计
    const totalLevels = this.results.length;
    const errorLevels = this.results.filter(r => r.errors.length > 0).length;
    const warningLevels = this.results.filter(r => r.warnings.length > 0).length;
    
    console.log(`总关卡数: ${totalLevels}`);
    console.log(`错误关卡: ${errorLevels}`);
    console.log(`警告关卡: ${warningLevels}`);
    console.log('');
    
    // 详细结果
    this.results.forEach(r => {
      const status = r.errors.length > 0 ? '❌' : (r.warnings.length > 0 ? '⚠️' : '✅');
      console.log(`${status} 关卡 ${r.level.toString().padStart(2, '0')}: ${r.wallCount}墙壁 ${r.staticBombCount}静态炸弹`);
      
      r.errors.forEach(e => console.log(`   ❌ ${e}`));
      r.warnings.forEach(w => console.log(`   ⚠️ ${w}`));
    });
    
    // 总结
    console.log('\n=== 总结 ===');
    if (this.errors.length === 0) {
      console.log('✅ 所有关卡验证通过！');
    } else {
      console.log(`❌ 发现 ${this.errors.length} 个错误:`);
      this.errors.forEach(e => console.log(`   - ${e}`));
    }
    
    if (this.warnings.length > 0) {
      console.log(`\n⚠️ 发现 ${this.warnings.length} 个警告:`);
      this.warnings.forEach(w => console.log(`   - ${w}`));
    }
  }
}

// 运行验证
if (require.main === module) {
  const validator = new LevelValidator();
  const success = validator.validateAll();
  process.exit(success ? 0 : 1);
}

module.exports = LevelValidator;
