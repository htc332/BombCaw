# 积分系统实现方案

**版本**: v1.0  
**日期**: 2026-05-13  
**基线版本**: v0.7.2-stable (9836776)  
**状态**: 设计阶段，未开始编码

---

## 一、核心原则

### 1.1 渐进式开发
```
Step 1: 基础分数记录（无UI表现，console.log验证）
  ↓
Step 2: 基础分数显示（简单数字）
  ↓
Step 3: 连击系统（连续爆炸得分翻倍）
  ↓
Step 4: 倍率系统（基于连胜）
```

**明确不做（现阶段）**:
- ❌ 飘字特效
- ❌ 艺术数字
- ❌ 详细统计面板
- ❌ 复杂的UI表现

**原则**: 先保证积分计算正确，UI表现后续迭代。

### 1.2 每个Step的验证标准
- [ ] 语法检查通过
- [ ] 微信开发者工具编译无错误
- [ ] Console无异常日志
- [ ] 分数计算正确（通过日志验证）
- [ ] 真机测试通过

### 1.3 调试策略
- **Step 1-2**: 使用 `console.log` 输出分数变化
- **Step 3+**: 移除调试日志，使用UI反馈
- **禁止**: 每帧打印日志（日志风暴）

---

## 二、当前状态分析

### 2.1 现有计分方式（v0.7.2-stable）
```javascript
// GameLogic.js
this.score = 0;  // 初始化
this.score += config.score || 10;  // 过关奖励
this.score += bonus;  // 剩余炸弹奖励

getState() {
  return {
    score: this.score,  // 直接返回
    // ...
  };
}
```

### 2.2 现有问题
- ❌ 没有炸弹升级的分数
- ❌ 没有墙壁摧毁的即时分数
- ❌ 没有连击加成
- ❌ 没有倍率系统
- ✅ 基础框架可用

### 2.3 事件流（现有）
```
放置炸弹 → bomb_placed 事件
  ↓
倒计时结束 → bomb_exploded 事件
  ↓
检查墙壁 → wall_destroyed / enemy_death 事件
  ↓
检查静态炸弹 → static_bomb_activated 事件
  ↓
检查升级 → bomb_upgraded 事件
  ↓
检查胜负 → level_complete / level_fail 事件
```

---

## 三、实现步骤详解

---

### Step 1: 基础分数记录（预计30分钟）

**目标**: 让 GameLogic 正确记录每种得分事件

**修改文件**: `src/core/GameLogic.js`

**基础计分规则**:
| 事件 | 基础分 | 说明 |
|------|--------|------|
| 1级普通鼠摧毁 | +5 | 基础目标 |
| 2级精英鼠摧毁 | +10 | 需2次爆炸 |
| 炸弹墙摧毁 | +5 | 返还炸弹 |
| 静态炸弹激活 | +5 | 利用环境 |
| 炸弹升级(Lv0→1) | +5 | 策略奖励 |
| 炸弹升级(Lv1→2) | +10 | 高等级升级 |
| 剩余炸弹 | +10/个 | 通关奖励 |

**连击计分规则**:
```
定义: 单次爆炸链内，连续摧毁墙壁触发连击

计分公式: 最终得分 = 基础分 × 连击倍数

连击倍数:
- 第1次摧毁: ×1 (无翻倍)
- 第2次摧毁: ×2
- 第3次摧毁: ×4
- 第4次及以上: ×8 (上限)

示例:
- 第1只普通鼠: 5 × 1 = 5分
- 第2只普通鼠: 5 × 2 = 10分
- 第3只精英鼠: 10 × 4 = 40分
- 第4只普通鼠: 5 × 8 = 40分
- 第5只普通鼠: 5 × 8 = 40分
```

**连击清除条件**（满足任一即清除）：
1. **爆炸链结束**: 所有连锁爆炸完成，且场上无正在倒计时的炸弹
2. **玩家操作**: 玩家放置新炸弹、点击屏幕等任何操作
3. **关卡结束**: 关卡完成或失败

**连击状态机**:
```
[空闲] --玩家放置炸弹--> [爆炸链开始] --摧毁墙壁--> [连击中]
                              |
                              v
[连击中] --爆炸链结束--> [结算] --玩家操作--> [空闲]
                              |
                              v
                        [显示连击统计]
```

**设计理由**: 
- 基础分降低（5-10分），为后续倍率系统预留空间
- 连击翻倍鼓励连锁反应，增加爽快感
- 上限×8防止分数过大

**实现方式**:
```javascript
// 在 GameLogic.js 中添加
addScore(points, reason) {
  this.score += points;
  console.log('[Score]', reason, '+', points, '=', this.score);
}

// 在 handleEnemyDeath 中调用（根据类型）
addScore(config.score, wall.type + '摧毁');

// 在 onStaticBombActivated 中调用
addScore(5, '静态炸弹激活');

// 在 upgradeAdjacentBombs 中调用（根据等级）
addScore(5 * (newLevel + 1), '炸弹升级Lv' + newLevel);
```

**验证方法**:
1. 打开 Console
2. 放置炸弹炸毁墙壁
3. 确认看到 `[Score] normal摧毁 +5 = xxx`
4. 确认总分正确
5. 炸毁精英鼠确认 `[Score] strong摧毁 +10 = xxx`

**回退命令**:
```bash
git checkout src/core/GameLogic.js
```

---

### Step 2: 基础分数显示（预计30分钟）

**目标**: 在屏幕上显示当前分数

**修改文件**: `src/view/Renderer.js`

**实现方式**:
```javascript
// 在 drawScorePanel 中
const score = state.score || 0;
ctx.fillStyle = '#FFD700';
ctx.font = `bold ${24 * s * pr}px sans-serif`;
ctx.textAlign = 'center';
ctx.fillText(`得分: ${score}`, w / 2, y + scoreH / 2);
```

**验证方法**:
1. 游戏画面上方显示"得分: 0"
2. 炸毁墙壁后数字增加
3. 数字与实际分数一致

**回退命令**:
```bash
git checkout src/view/Renderer.js
```

---

### Step 3: 连击系统（预计1小时）

**目标**: 连续爆炸（含连锁反应）得分翻倍

**修改文件**: `src/core/GameLogic.js`

**设计**:
```
连击规则:
- 每次爆炸摧毁墙壁时触发连击计数
- 连击得分 = 基础分 × 2^(连击数-1)
- 示例:
  - 第1次: 5分 (无翻倍)
  - 第2次: 10分 (×2)
  - 第3次: 20分 (×4)
  - 第4次: 40分 (×8)
  - 上限: ×8 (第4次后不再增加)

连击窗口: 单次爆炸链内（从第一个炸弹爆炸到最后一个连锁爆炸结束）
连击重置: 所有爆炸结束后，玩家下次操作前重置
```

**实现方式**:
```javascript
// 在 GameLogic.js 中添加
this.comboCount = 0;        // 当前连击数
this.isInCombo = false;     // 是否处于连击状态
this.comboBaseScore = 0;    // 本次连击的基础分

// 爆炸开始时（processExplosionChain 开头）
startCombo() {
  if (!this.isInCombo) {
    this.isInCombo = true;
    this.comboCount = 0;
    console.log('[Combo] 连击开始');
  }
}

// 每次摧毁墙壁时
onWallDestroyed(wall) {
  this.comboCount++;
  
  // 计算倍数: 2^(n-1), 上限 8 (即 2^3)
  const multiplier = Math.min(Math.pow(2, this.comboCount - 1), 8);
  
  // 基础分根据墙壁类型
  let baseScore = 5;  // 默认5分
  if (wall.type === 'strong') baseScore = 10;
  if (wall.type === 'bomb') baseScore = 5;
  
  // 最终得分
  const finalScore = baseScore * multiplier;
  this.score += finalScore;
  
  console.log('[Combo] x' + this.comboCount, 
              '基础' + baseScore, 
              '倍数x' + multiplier, 
              '最终+' + finalScore,
              '总分=' + this.score);
}

// 爆炸链结束时（processExplosionChain 结尾）
endCombo() {
  if (this.isInCombo) {
    if (this.comboCount >= 2) {
      console.log('[Combo] 连击结束! 最高x' + this.comboCount, '总分=' + this.score);
    }
    this.isInCombo = false;
    this.comboCount = 0;
  }
}

// 玩家操作前重置（tryPlaceBomb 开头）
resetCombo() {
  if (!this.isInCombo && this.comboCount > 0) {
    this.comboCount = 0;
  }
}
```

**关键设计**: 
- 连击基于"爆炸链"而非时间窗口
- 玩家放置炸弹 → 爆炸链开始 → 连锁反应 → 爆炸链结束 → 连击结算
- 连击清除条件:
  1. 爆炸链完全结束（无倒计时炸弹）
  2. 玩家放置新炸弹
  3. 玩家点击屏幕（任何操作）
  4. 关卡完成或失败

**验证方法**:
1. 放置炸弹触发连锁爆炸
2. Console显示连击日志：
   ```
   [Combo] x1 基础5 倍数x1 最终+5 总分=5
   [Combo] x2 基础5 倍数x2 最终+10 总分=15
   [Combo] x3 基础10 倍数x4 最终+40 总分=55
   ```
3. 确认连击倍数正确（×1, ×2, ×4, ×8）
4. 确认第4次后倍数不再增加（保持×8）

**回退命令**:
```bash
git checkout src/core/GameLogic.js
```

---

### Step 4: 倍率系统（预计1小时）

**目标**: 基于连胜的分数倍率

**修改文件**: 
- `src/core/GameLogic.js`
- `src/data/Storage.js`

**设计**:
```
连胜倍率:
- 0-1连胜: 1.0x
- 2连胜: 1.2x
- 3连胜: 1.5x
- 4连胜: 2.0x
- 5连胜: 2.5x
- 6连胜+: 3.0x (上限)

失败重置: 连胜归零
```

**实现方式**:
```javascript
// 在 GameLogic.js 中添加
this.consecutiveWins = 0;
this.currentMultiplier = 1.0;

loadProgress() {
  try {
    const data = wx.getStorageSync('nnzs_progress');
    if (data) {
      const progress = JSON.parse(data);
      this.consecutiveWins = progress.consecutiveWins || 0;
      this.currentMultiplier = this.calculateMultiplier();
    }
  } catch (e) {}
}

calculateMultiplier() {
  const wins = this.consecutiveWins;
  if (wins <= 1) return 1.0;
  if (wins === 2) return 1.2;
  if (wins === 3) return 1.5;
  if (wins === 4) return 2.0;
  if (wins === 5) return 2.5;
  return 3.0;
}

onLevelComplete() {
  this.consecutiveWins++;
  this.saveProgress();
}

onLevelFail() {
  this.consecutiveWins = 0;
  this.saveProgress();
}

  // 分数计算时应用倍率（在addScore内部应用）
  addScore(basePoints, reason) {
    const finalPoints = Math.floor(basePoints * this.currentMultiplier);
    this.score += finalPoints;
    console.log('[Score]', reason, basePoints + 'x' + this.currentMultiplier, '=', finalPoints, '总分=' + this.score);
  }
```

**验证方法**:
1. 通关后检查倍率显示
2. 下次游戏分数按倍率计算
3. 失败后倍率重置

**回退命令**:
```bash
git checkout src/core/GameLogic.js src/data/Storage.js
```

---

## 四、风险与应对

## 四、风险与应对

| 风险 | 可能性 | 影响 | 应对 |
|------|--------|------|------|
| 分数计算错误 | 中 | 高 | Step 1-2 充分验证 |
| 性能问题 | 低 | 中 | 避免每帧计算 |
| 状态不同步 | 中 | 高 | 单一数据源 |
| 日志风暴 | 高 | 中 | Step 2后移除日志 |

---

## 五、时间估算

| Step | 预计时间 | 验证时间 | 总计 |
|------|----------|----------|------|
| Step 1 | 30分钟 | 15分钟 | 45分钟 |
| Step 2 | 30分钟 | 15分钟 | 45分钟 |
| Step 3 | 1小时 | 30分钟 | 1.5小时 |
| Step 4 | 1小时 | 30分钟 | 1.5小时 |
| **总计** | **3小时** | **1.5小时** | **4.5小时** |

---

## 六、回退策略

### 6.1 单个 Step 回退
```bash
# 回退单个文件
git checkout src/core/GameLogic.js

# 回退多个文件
git checkout src/core/GameLogic.js src/view/Renderer.js
```

### 6.2 全部回退
```bash
# 回退到稳定版本
git reset --hard v0.7.2-stable
```

### 6.3 标签管理
```bash
# 每完成一个 Step 打标签
git tag -a v0.7.3-step1 -m "Step 1完成: 基础分数记录"
git push origin v0.7.3-step1
```

---

## 七、开发纪律

### 7.1 必须遵守
1. **一次只做一个 Step**
2. **每个 Step 必须验证通过**
3. **验证通过后才能打标签**
4. **发现问题立即回退，不硬修**

### 7.2 禁止行为
- ❌ 一次修改多个 Step
- ❌ 未验证就继续下一步
- ❌ 在失败版本上叠加修改
- ❌ 添加大量调试日志

### 7.3 日志规范
- Step 1-2: 允许使用 `console.log` 验证分数
- Step 3+: 移除所有 `console.log`，使用 UI 反馈
- 错误处理: 使用 `console.error` 但限制频率

---

## 八、验收标准

### 8.1 功能验收
- [ ] 1级普通鼠摧毁 +5分
- [ ] 2级精英鼠摧毁 +10分
- [ ] 炸弹升级根据等级加分
- [ ] 静态炸弹激活 +5分
- [ ] 连击得分翻倍（×2, ×4, ×8）
- [ ] 连击在爆炸链内计算
- [ ] 倍率正确应用
- [ ] 分数在UI上正确显示

### 8.2 性能验收
- [ ] 60fps 稳定
- [ ] 无内存泄漏
- [ ] 真机流畅

### 8.3 代码验收
- [ ] 语法检查通过
- [ ] 无 ESLint 错误
- [ ] 注释完整

---

_文档版本: v1.0 | 2026-05-13 | 基于 v0.7.2-stable_
