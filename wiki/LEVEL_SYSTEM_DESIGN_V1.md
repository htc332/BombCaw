# 牛牛炸鼠 - 关卡系统设计方案 v1.0

**版本**: v1.0  
**日期**: 2026-07-26  
**作者**: 2B  
**状态**: 设计方案（待老胡确认）

---

## 一、现状分析

### 1.1 当前关卡数据

| 维度 | 现状 |
|------|------|
| **手工配置关** | 仅 **7关**（LevelData.js 中 1-7） |
| **动态生成** | 第8关起使用 `generateLevel()` 随机生成 |
| **关卡类型** | 无标签系统，仅有 hint 文字区分 |
| **墙壁鼠类型** | normal（普通）、strong（加固）、ghost（幽灵） |
| **静态炸弹** | LV1-LV4 四种进化等级 |
| **计分系统** | v0.8.0 积分制（初始10分，炸弹消耗积分，炸鼠+1分） |

### 1.2 现有7关配置

```
第1关：基础十字排列，4只普通鼠，无静态炸弹
第2关：8只普通鼠 + 2个LV2静态炸弹（连锁教学）
第3关：7只普通鼠 + 2个LV2 + 2个LV3静态炸弹（多连锁）
第4关：5只普通鼠 + 2个LV2 + 2个LV3静态炸弹（交叉连锁）
第5关：7只普通鼠 + 4个LV1静态炸弹（LV1炸弹网）
第6关：6只普通鼠 + 1个LV1 + 2个LV2 + 1个LV3静态炸弹（混合）
第7关：6只普通鼠 + 4个LV1静态炸弹（对称布局）
```

### 1.3 当前动态生成逻辑（LevelSystem.js）

```javascript
// 19-100关随机生成
- 棋盘大小：5x5 → 9x9（每10关+1）
- 敌人数量：基于理论参数随机
- 墙壁类型：11关后30%加固墙，21关后20%幽灵鼠
- 静态炸弹：5关后30%概率出现
```

**问题**：随机生成缺乏节奏感，无法做到任天堂式的精心编排。

---

## 二、设计目标

### 2.1 核心原则（任天堂式关卡设计）

1. **一次只教一个机制** - 每关聚焦一个核心技巧
2. **安全区→挑战区→奖励区** - 让玩家在舒适和挑战间交替
3. **可预测的难度曲线** - 玩家能感知到自己的进步
4. **动态适配** - 根据玩家表现调整后续关卡

### 2.2 老胡的三条规则

> 1. **不显示关卡标签** - 玩家不知道当前是"教学关"还是"消耗关"
> 2. **消耗关节奏**：
>    - 1-50关：每5关一个消耗关
>    - 51-200关：每5关一个消耗关
>    - 201-300关：每3关一个消耗关
>    - 301-500关：每2关一个消耗关
>    - 500关后：每关都是消耗关
> 3. **墙壁鼠控制**：
>    - 数量从投放开始，每50关变化一次
>    - 墙壁鼠占比从10%以下开始，慢慢往上涨

---

## 三、200关配置方案

### 3.1 关卡类型定义（内部使用，不显示给玩家）

```javascript
const LEVEL_TYPES = {
  TUTORIAL: 'tutorial',      // 教学关：引入新机制
  PRACTICE: 'practice',      // 练习关：巩固已学机制
  CHALLENGE: 'challenge',    // 挑战关：机制组合应用
  SCORE: 'score',            // 积分关：奖励关，容易获得高分
  CONSUME: 'consume',        // 消耗关：考验资源管理
  BOSS: 'boss',              // 首领关：阶段性大挑战
  RELAX: 'relax'             // 放松关：简单关卡，让玩家喘息
};
```

### 3.2 阶段划分（参照马里奥的世界地图）

```
世界1 (1-10关)：基础机制教学
世界2 (11-20关)：静态炸弹进阶
世界3 (21-30关)：墙壁鼠类型引入
世界4 (31-40关)：连锁反应精通
世界5 (41-50关)：综合应用 + 阶段性Boss
世界6-10 (51-100关)：难度螺旋上升
世界11-20 (101-200关)：高级技巧组合
```

### 3.3 消耗关节奏表

| 关卡范围 | 消耗关间隔 | 消耗关编号示例 |
|----------|-----------|--------------|
| 1-50 | 每5关 | 5, 10, 15, 20, 25, 30, 35, 40, 45, 50 |
| 51-200 | 每5关 | 55, 60, 65... 195, 200 |
| 201-300 | 每3关 | 203, 206, 209... 297, 300 |
| 301-500 | 每2关 | 302, 304, 306... 498, 500 |
| 500+ | 每1关 | 全部 |

### 3.4 墙壁鼠参数表（每50关变化）

| 关卡范围 | 普通鼠占比 | 加固墙占比 | 幽灵鼠占比 | 炸弹墙占比 | 总墙壁数基准 |
|----------|-----------|-----------|-----------|-----------|------------|
| 1-50 | 85% | 10% | 0% | 5% | 4-8 |
| 51-100 | 75% | 15% | 5% | 5% | 6-10 |
| 101-150 | 65% | 20% | 10% | 5% | 8-12 |
| 151-200 | 55% | 25% | 15% | 5% | 10-14 |
| 201-300 | 45% | 30% | 20% | 5% | 12-16 |
| 301-500 | 35% | 35% | 25% | 5% | 14-18 |
| 500+ | 30% | 35% | 30% | 5% | 16-20 |

### 3.5 棋盘大小 progression

| 关卡范围 | 棋盘大小 | 说明 |
|----------|---------|------|
| 1-10 | 5x5 | 教学阶段，小棋盘聚焦 |
| 11-30 | 6x6 | 引入更多元素 |
| 31-60 | 7x7 | 中级难度 |
| 61-100 | 8x8 | 高级技巧 |
| 101-200 | 8x8 / 9x9 | 大师级挑战 |

### 3.6 静态炸弹配置策略

```javascript
// 静态炸弹出现概率和类型随关卡变化
const STATIC_BOMB_CONFIG = {
  '1-10':   { chance: 0.3, maxCount: 2, types: [0] },           // 只有LV1
  '11-20':  { chance: 0.4, maxCount: 3, types: [0, 2] },        // LV1 + LV2
  '21-30':  { chance: 0.5, maxCount: 4, types: [0, 2, 3] },     // 加入LV3
  '31-50':  { chance: 0.6, maxCount: 5, types: [0, 2, 3, 5] },  // 全部类型
  '51-100': { chance: 0.7, maxCount: 6, types: [0, 2, 3, 5] },
  '101-200':{ chance: 0.8, maxCount: 8, types: [0, 2, 3, 5] }
};
```

### 3.7 具体关卡配置示例（前20关）

```javascript
// 世界1：基础机制（1-10关）
const WORLD_1 = {
  // 第1关：基础放置（已有）
  1: { type: 'tutorial', gridSize: 5, walls: 4, staticBombs: 0, hint: '点击空白格放炸弹' },
  
  // 第2关：连锁反应（已有）
  2: { type: 'tutorial', gridSize: 5, walls: 8, staticBombs: 2, hint: '找到连锁引爆的关键位置' },
  
  // 第3关：多连锁（已有）
  3: { type: 'practice', gridSize: 5, walls: 7, staticBombs: 4, hint: '多个连锁点，找到最优解' },
  
  // 第4关：交叉连锁（已有）
  4: { type: 'practice', gridSize: 5, walls: 5, staticBombs: 4, hint: '交叉连锁，精确计算' },
  
  // 第5关：★消耗关★ - LV1炸弹网（已有）
  5: { type: 'consume', gridSize: 5, walls: 7, staticBombs: 5, hint: 'LV1炸弹网，多点击发' },
  
  // 第6关：混合炸弹（已有）
  6: { type: 'challenge', gridSize: 5, walls: 6, staticBombs: 4, hint: '混合炸弹，复杂连锁' },
  
  // 第7关：对称布局（已有）
  7: { type: 'practice', gridSize: 5, walls: 6, staticBombs: 4, hint: '对称布局，中心引爆' },
  
  // 第8关：引入加固墙
  8: { type: 'tutorial', gridSize: 5, walls: 6, staticBombs: 2, 
       wallTypes: { normal: 4, strong: 2 }, hint: '加固墙需要两次爆炸' },
  
  // 第9关：加固墙+连锁
  9: { type: 'practice', gridSize: 5, walls: 8, staticBombs: 3,
       wallTypes: { normal: 5, strong: 3 }, hint: '先处理加固墙' },
  
  // 第10关：★消耗关★ + 阶段性Boss
  10: { type: 'boss', gridSize: 6, walls: 12, staticBombs: 4,
        wallTypes: { normal: 8, strong: 4 }, hint: '世界1最终挑战' }
};

// 世界2：静态炸弹进阶（11-20关）
const WORLD_2 = {
  // 第11关：引入LV2静态炸弹
  11: { type: 'tutorial', gridSize: 6, walls: 8, staticBombs: 3,
        staticBombTypes: [0, 2], hint: '蓝色静态炸弹范围更大' },
  
  // 第12关：LV2连锁
  12: { type: 'practice', gridSize: 6, walls: 10, staticBombs: 4,
        staticBombTypes: [0, 2], hint: '利用LV2的大范围' },
  
  // 第13关：混合LV1+LV2
  13: { type: 'challenge', gridSize: 6, walls: 10, staticBombs: 5,
        staticBombTypes: [0, 2], hint: '不同等级，不同策略' },
  
  // 第14关：加固墙+LV2
  14: { type: 'practice', gridSize: 6, walls: 10, staticBombs: 4,
        wallTypes: { normal: 6, strong: 4 }, staticBombTypes: [0, 2], 
        hint: 'LV2对加固墙更有效' },
  
  // 第15关：★消耗关★
  15: { type: 'consume', gridSize: 6, walls: 12, staticBombs: 5,
        wallTypes: { normal: 8, strong: 4 }, staticBombTypes: [0, 2],
        hint: '精打细算每一颗炸弹' },
  
  // ... 16-20关类似模式
};
```

---

## 四、200关后方案评估：配置 vs 肉鸽生成

### 4.1 方案A：继续配置（推荐前300关）

**优点**：
- ✅ 精确控制每关体验，保证节奏感
- ✅ 可以实现"隐藏教学"——玩家不知不觉学会新技巧
- ✅ 容易做DDA（动态难度调整）——根据玩家表现微调参数

**缺点**：
- ❌ 工作量大（300关需要大量设计时间）
- ❌ 包体增大（关卡数据占用空间）

**适用场景**：
- 前200关必须配置（核心体验）
- 200-300关可以半配置（关键节点配置，中间填充生成）

### 4.2 方案B：肉鸽生成算法（推荐300关后）

**核心算法**：基于"关卡模板"的 procedural generation

```javascript
class RoguelikeLevelGenerator {
  constructor() {
    this.templates = [
      'cross_chain',      // 十字连锁模板
      'domino',           // 多米诺模板
      'symmetric',        // 对称布局模板
      'maze',             // 迷宫模板
      'boss_rush',        // 首领模板
      'efficiency',       // 效率挑战模板
      'precision'         // 精准控制模板
    ];
  }
  
  generate(level, playerSkill) {
    // 1. 根据关卡范围选择模板池
    const availableTemplates = this.getTemplatesForLevel(level);
    
    // 2. 根据玩家技能调整难度参数
    const difficulty = this.calculateDifficulty(level, playerSkill);
    
    // 3. 随机选择模板并填充参数
    const template = this.selectTemplate(availableTemplates, difficulty);
    
    // 4. 生成关卡配置
    return this.fillTemplate(template, difficulty);
  }
  
  calculateDifficulty(level, playerSkill) {
    // 基础难度随关卡线性增长
    const baseDifficulty = level / 10;
    
    // 根据玩家技能调整（DDA）
    // playerSkill: 基于历史通关数据计算（平均剩余分数、重试次数等）
    const ddaMultiplier = this.getDDAMultiplier(playerSkill);
    
    return baseDifficulty * ddaMultiplier;
  }
}
```

**优点**：
- ✅ 无限关卡，玩家永远不会"打完"
- ✅ 每次体验不同，重玩价值高
- ✅ 包体小，只有算法没有数据

**缺点**：
- ❌ 难以做到精心编排的"教学时刻"
- ❌ 可能出现无法解开的关卡（需要验证算法）
- ❌ 缺乏"记住这个关卡"的成就感

### 4.3 推荐方案：混合模式

```
1-200关：全手工配置（核心体验，精心编排）
201-300关：半配置（每10关一个精心设计的Boss关，中间用模板生成）
301-500关：模板生成 + DDA（基于玩家表现动态调整）
500+关：纯肉鸽生成（无限挑战）
```

---

## 五、DDA动态难度调整系统

### 5.1 玩家技能评估

```javascript
class PlayerSkillTracker {
  constructor() {
    this.history = []; // 最近20关的数据
  }
  
  recordLevelResult(level, score, bombsPlaced, wallsDestroyed, retries) {
    this.history.push({
      level, score, bombsPlaced, wallsDestroyed, retries,
      efficiency: wallsDestroyed / bombsPlaced, // 效率比
      timestamp: Date.now()
    });
    
    if (this.history.length > 20) this.history.shift();
  }
  
  getSkillRating() {
    // 计算综合技能分（0-1）
    const recent = this.history.slice(-5);
    const avgEfficiency = recent.reduce((s, r) => s + r.efficiency, 0) / recent.length;
    const avgRetries = recent.reduce((s, r) => s + r.retries, 0) / recent.length;
    const avgScore = recent.reduce((s, r) => s + r.score, 0) / recent.length;
    
    // 效率越高、重试越少、剩余分数越多 = 技能越高
    return Math.min(1, (avgEfficiency * 0.4 + (1 - avgRetries/5) * 0.3 + Math.min(avgScore/10, 1) * 0.3));
  }
}
```

### 5.2 动态调整参数

```javascript
class DDALevelAdjuster {
  adjustLevel(baseConfig, playerSkill) {
    const multiplier = 0.7 + playerSkill * 0.6; // 0.7-1.3
    
    return {
      ...baseConfig,
      // 技能高的玩家：更多墙壁、更复杂的静态炸弹布局
      wallCount: Math.round(baseConfig.wallCount * multiplier),
      staticBombCount: Math.round(baseConfig.staticBombCount * (0.8 + playerSkill * 0.4)),
      // 技能低的玩家：更多积分关、更简单的布局
      isConsumeLevel: playerSkill < 0.3 ? false : baseConfig.isConsumeLevel
    };
  }
}
```

---

## 六、实施计划

### 6.1 第一阶段：完善前50关配置（2周）

- [ ] 设计8-50关的具体配置
- [ ] 实现关卡类型系统（内部标签）
- [ ] 实现消耗关节奏控制
- [ ] 实现墙壁鼠参数表
- [ ] 测试并调整难度曲线

### 6.2 第二阶段：51-200关配置（3周）

- [ ] 设计世界6-20的关卡模板
- [ ] 批量生成配置数据
- [ ] 实现DDA系统
- [ ] 大规模测试

### 6.3 第三阶段：200+关肉鸽系统（2周）

- [ ] 设计关卡模板库
- [ ] 实现生成算法
- [ ] 实现可解性验证
- [ ] 集成DDA

---

## 七、技术实现建议

### 7.1 配置文件结构

```javascript
// data/LevelConfig.js
const LEVEL_CONFIG = {
  // 1-200关：手工配置
  handcrafted: {
    1: { /* 具体配置 */ },
    2: { /* 具体配置 */ },
    // ... 200关
  },
  
  // 201+关：模板配置
  templates: {
    cross_chain: { /* 模板参数 */ },
    domino: { /* 模板参数 */ },
    // ...
  },
  
  // 全局参数
  global: {
    consumeLevelInterval: (level) => {
      if (level <= 50) return 5;
      if (level <= 200) return 5;
      if (level <= 300) return 3;
      if (level <= 500) return 2;
      return 1;
    },
    wallRatios: (level) => { /* 返回各类型墙壁占比 */ },
    gridSize: (level) => { /* 返回棋盘大小 */ }
  }
};
```

### 7.2 关键代码修改点

```javascript
// LevelSystem.js 修改
class LevelSystem {
  getLevelConfig(level) {
    if (level <= 200) {
      // 手工配置关
      return LEVEL_CONFIG.handcrafted[level] || this.generateFromTemplate(level);
    } else {
      // 肉鸽生成
      return this.roguelikeGenerate(level);
    }
  }
  
  isConsumeLevel(level) {
    const interval = this.getConsumeInterval(level);
    return level % interval === 0;
  }
  
  getConsumeInterval(level) {
    if (level <= 50) return 5;
    if (level <= 200) return 5;
    if (level <= 300) return 3;
    if (level <= 500) return 2;
    return 1;
  }
}
```

---

## 八、风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 200关配置工作量太大 | 高 | 分阶段实施，先保证前50关质量 |
| 肉鸽生成关卡不可解 | 高 | 实现可解性验证算法 |
| DDA调整过于敏感 | 中 | 设置调整上限，避免剧烈变化 |
| 包体过大 | 中 | 200关后转生成，减少数据量 |
| 玩家感知到难度跳跃 | 低 | 平滑过渡，隐藏调整痕迹 |

---

## 九、结论与建议

### 9.1 推荐方案

**采用"配置+肉鸽"混合模式**：

1. **前200关全配置**：这是游戏的核心体验，必须精心编排
2. **200-300关半配置**：关键节点（每10关的Boss）手工设计，中间用模板填充
3. **300关后肉鸽生成**：无限挑战，保持长期留存

### 9.2 下一步行动

1. **老胡确认方案** - 确认混合模式的方向
2. **设计前50关详细配置** - 我（2B）可以开始设计
3. **实现关卡类型系统** - 不显示标签，但内部需要分类
4. **测试DDA系统** - 在小范围内测试动态难度效果

---

*文档版本: v1.0 | 2026-07-26*
*设计原则: 任天堂式关卡设计 + 老胡的三条规则*
