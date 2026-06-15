# 炸弹推墙（Canvas v0.7.8）- 记分系统分析方案

## 一、项目现状总结

### 1.1 整体架构
- **入口**: `game.js` → `src/main.js` (BombWallGame 类)
- **分层**: core(逻辑) / view(渲染) / data(数据) / system(系统) / app(场景) / utils(工具)
- **游戏循环**: main.js `loop()` → `render()` → `Renderer.render()` + `Animator.draw()` + `ParticleSystem.draw()`
- **事件流**: GameLogic 触发事件 → main.js `handleGameEvent()` → 音效/特效/提示

### 1.2 当前已有"分数"相关代码
| 位置 | 内容 | 状态 |
|------|------|------|
| `GameLogic.js` | `this.score = 100` (初始分) | ✅ 运行中 |
| `GameLogic.js` | `addScore(points, reason)` | ✅ 运行中 |
| `GameLogic.js` | `lastScoreEvent` (飘字提示) | ✅ 运行中 |
| `Renderer.js` | `drawScorePanel()` 显示得分 | ✅ 运行中 |
| `Config.js` | `scoring` 配置项 | ⚠️ 部分未使用 |
| `PlayerData.js` | `levelScores` / `stats.totalScore` | ⚠️ 有结构但未被 GameLogic 调用 |
| `LevelSelectScene.js` | 显示 `bestScore` / `stars` | ⚠️ 有UI但无数据流入 |

### 1.3 当前分数逻辑
- **初始分**: 100 分
- **消耗**: 放置炸弹时扣除 (0/20/50/100 对应4个等级)
- **获得**: 炸毁老鼠/激活静态炸弹时增加 (由 `ENEMY_TYPES[wall.type].score` 决定)
- **关卡奖励**: 胜利时剩余炸弹 × 50 分
- **失败**: 分数保留，不重置

---

## 二、记分系统现状问题

### 2.1 数据未持久化
- `GameLogic.score` 是内存变量，关卡结束后丢失
- `PlayerData.saveLevelScore()` 存在但从未被调用
- 玩家重新进入游戏后分数归零

### 2.2 星级评价系统未实现
- `Config.js` 中有 `scoring` 配置但未使用
- `PlayerData.js` 有 `stars` 字段但无计算逻辑
- `LevelSelectScene.js` 有星星显示UI但无数据

### 2.3 排行榜/分享预留但未实现
- `Constants.SHARE` 有分享文案模板 `{score}`
- 无实际微信排行榜 API 调用

### 2.4 连击系统已废弃
- `GameLogic.js` 中 `comboCount` / `isInCombo` 存在但 `addComboScore()` 已废弃
- 连击加分逻辑未接入

---

## 三、记分系统设计方案

### 3.1 目标定义

**核心目标**: 建立完整的关卡分数 → 持久化 → 星级评价 → 选关界面展示的闭环

**具体功能**:
1. 每关实时分数计算（已有基础，需完善）
2. 关卡结束分数保存到本地存储
3. 星级评价（1-3星）计算规则
4. 选关界面显示每关最高分和星级
5. 总分统计与展示
6. 分享功能（调用微信分享API）

### 3.2 星级评价规则设计

**建议方案**:
```
星级 = 基于分数达成率
- 1星: 完成关卡（无论分数）
- 2星: 分数 ≥ 关卡基础目标分（如200分）
- 3星: 分数 ≥ 关卡完美目标分（如500分）
```

**数据需求**: 每关需要配置 `targetScore` 和 `perfectScore`
- 可放在 `LevelData.js` 每关配置中，或 `Config.js` 全局公式计算

### 3.3 修改点清单（仅分析，不执行）

#### A. 数据层修改

**A1. `LevelData.js` - 增加目标分配置**
```javascript
// 每关增加:
targetScore: 200,    // 2星线
perfectScore: 500,  // 3星线
```

**A2. `Config.js` - 完善 scoring 配置**
```javascript
scoring: {
  destroyWall: 10,
  destroyStrongWall: 20,
  destroyGhost: 15,      // 新增
  staticBombActivate: 5, // 已有
  bombLeftBonus: 50,     // 已有
  chainBonus: [0, 0, 10, 30, 60], // 连击奖励（2连/3连/4连/5连+）
  starThresholds: {      // 新增
    1: 0,    // 通关即1星
    2: 0.6,  // 达到目标分的60%
    3: 1.0   // 达到目标分
  }
}
```

**A3. `PlayerData.js` - 确保 saveLevelScore 被调用**
- 当前 `saveLevelScore(level, score, stars)` 方法已存在
- 需要在 `GameLogic` 关卡结束时调用

#### B. 逻辑层修改

**B1. `GameLogic.js` - 关卡结束保存分数**
```javascript
// 在 handleVictory() 或 confirmVictory() 中:
const stars = this.calculateStars();
PlayerData.getInstance().saveLevelScore(this.level, this.score, stars);
```

**B2. `GameLogic.js` - 连击系统复活**
- 当前 `addComboScore` 已废弃
- 建议: 在 `explodeBomb()` 中统计连击数，根据连击次数额外加分
- 连击判定: 1秒内连续爆炸算连击

**B3. `GameLogic.js` - 星级计算**
```javascript
calculateStars() {
  const config = LEVELS[this.level];
  if (!config) return 1;
  if (this.score >= config.perfectScore) return 3;
  if (this.score >= config.targetScore) return 2;
  return 1; // 通关即1星
}
```

#### C. 渲染层修改

**C1. `Renderer.js` - 得分面板增强**
- 当前 `drawScorePanel()` 只显示数字
- 建议增加: 目标分进度条（视觉反馈）
- 增加: 连击飘字动画（已有 `lastScoreEvent` 基础）

**C2. `ResultScene.js` - 结算界面完善**
- 当前已有胜利/失败界面
- 需要增加: 星级展示（★★★）
- 需要增加: "新纪录"提示
- 需要增加: 分享按钮

**C3. `LevelSelectScene.js` - 已适配，只需数据流入**
- 当前 UI 已支持显示 `bestScore` 和 `stars`
- 只需确保 `loadLevels()` 时数据正确

#### D. 系统层修改

**D1. `main.js` - 关卡结束事件处理**
- 当前 `onLevelComplete()` 只解锁下一关
- 需要增加: 调用 `PlayerData.saveLevelScore()`

**D2. 微信分享接入**
- 在 `ResultScene.js` 添加分享按钮
- 调用 `wx.shareAppMessage()` 带上分数

---

## 四、文件修改优先级

### P0（核心闭环）
1. `GameLogic.js` - 关卡结束调用 saveLevelScore
2. `LevelData.js` - 增加每关目标分配置
3. `PlayerData.js` - 验证 saveLevelScore 工作正常

### P1（体验提升）
4. `ResultScene.js` - 结算界面显示星级
5. `Renderer.js` - 得分面板增加目标进度
6. `Config.js` - 完善 scoring 配置

### P2（锦上添花）
7. 连击系统复活
8. 微信分享接入
9. 总分排行榜UI

---

## 五、风险与注意事项

### 5.1 现有数据兼容
- `PlayerData.js` 的 `levelScores` 格式: `{ level: { score, stars, bestScore, lastPlayed } }`
- 当前已有字段，新增字段不会破坏旧数据

### 5.2 微信存储限制
- 微信小游戏本地存储有容量限制（约10MB）
- 当前只存分数数据，远不到上限

### 5.3 分数平衡性
- 当前初始100分，炸弹成本 0/20/50/100
- 需要测试: 是否所有关都能达到1星（通关即1星可保证）
- 需要测试: 2星/3星是否难度合理

### 5.4 与现有系统的耦合
- `GameLogic.score` 被 `Renderer` / `UIManager` 多处读取
- 修改 `score` 计算逻辑需确保购买栏 affordability 检查同步更新

---

## 六、建议实施顺序

```
Step 1: LevelData.js 增加 targetScore / perfectScore 到每关
Step 2: GameLogic.js 增加 calculateStars() 方法
Step 3: GameLogic.js / main.js 关卡结束时调用 saveLevelScore
Step 4: 验证 LevelSelectScene.js 正确显示分数和星星
Step 5: ResultScene.js 结算界面显示星级
Step 6: 调平衡 - 根据测试调整目标分
Step 7: 增加连击加分（可选）
Step 8: 增加分享功能（可选）
```

---

## 七、关键代码引用

### GameLogic 当前分数相关代码位置
- 初始分: `GameLogic.js:24` `this.score = 100`
- 加分: `GameLogic.js:45-52` `addScore(points, reason)`
- 扣分: `GameLogic.js:186-190` 放置炸弹时 `this.score -= cost`
- 胜利奖励: `GameLogic.js:422-425` `handleVictory()` 中 `bonus = bombsLeft * 50`
- 事件: `GameLogic.js:393` `enemy_death` 事件带 `score` 和 `gained`

### PlayerData 存储方法
- `saveLevelScore()`: `PlayerData.js:86-104`
- 存储键: `Constants.STORAGE_KEYS.HIGH_SCORES`

### 渲染层分数显示
- `drawScorePanel()`: `Renderer.js:312-355`
- 飘字: `Renderer.js:345-354` `lastScoreEvent`

---

**分析完成时间**: 2026-06-15
**版本**: v0.7.8 → 目标 v0.8.0 (记分系统)
**分析人**: 小奎
