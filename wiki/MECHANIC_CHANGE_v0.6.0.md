# 牛牛炸鼠 - 核心机制变更文档 v0.6.0

**变更日期**: 2026-06-11  
**变更类型**: 核心规则调整  
**影响范围**: 游戏逻辑、关卡设计、教学流程  

---

## 一、变更摘要

### 变更前 (v0.5.2)
1. 炸弹爆炸会让相邻的**玩家炸弹**升级（进化机制）
2. 炸弹爆炸会让相邻的**静态炸弹墙**升级（激活后再次触发可升级）

### 变更后 (v0.6.0)
1. ✅ 炸弹爆炸**不再**让相邻的玩家炸弹升级
2. ✅ 炸弹爆炸仍能**激活**周围的静态炸弹墙，但**不会**让静态炸弹墙升级

---

## 二、详细规则变更

### 2.1 玩家炸弹进化机制（已移除）

**变更前**:  
```javascript
// 爆炸后升级周围炸弹（8方向相邻）
upgradeAdjacentBombs(explodedBomb) {
  const dirs = [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]];
  dirs.forEach(([dx, dy]) => {
    const neighbor = this.bombs.get(`${nx},${ny}`);
    if (neighbor && neighbor.key !== explodedBomb.key) {
      if (neighbor.evolution < 3) {
        neighbor.evolution++;  // ← 升级！
        neighbor.countdown = 90; // 重置倒计时
      }
    }
  });
}
```

**变更后**:  
```javascript
// 爆炸不再升级周围炸弹
// upgradeAdjacentBombs() 方法已移除或改为空实现
```

**影响**: 
- 玩家放置的炸弹等级固定为 Lv0（范围1格，无对角）
- 静态炸弹的初始等级由关卡配置决定，不再通过爆炸升级
- 游戏策略从"堆叠升级"转向"精准放置+连锁激活"

### 2.2 静态炸弹墙激活机制（调整）

**变更前**:  
```javascript
triggerStaticBombs(explodedBomb, range) {
  this.staticBombs.forEach(staticBomb => {
    const inRange = range.some(r => r.x === staticBomb.x && r.y === staticBomb.y);
    if (!inRange) return;

    if (!staticBomb.active) {
      // 首次激活
      staticBomb.active = true;
      staticBomb.countdown = 3;
    } else {
      // 已激活，升级！ ← 这个逻辑移除
      staticBomb.evolution++;
      staticBomb.countdown = 3;
    }
  });
}
```

**变更后**:  
```javascript
triggerStaticBombs(explodedBomb, range) {
  this.staticBombs.forEach(staticBomb => {
    const inRange = range.some(r => r.x === staticBomb.x && r.y === staticBomb.y);
    if (!inRange) return;
    if (staticBomb.active) return; // 已激活则忽略

    // 仅激活，不升级
    staticBomb.active = true;
    staticBomb.countdown = 3;
    
    this.emitEvent('static_bomb_activated', {
      x: staticBomb.x, y: staticBomb.y,
      evolution: staticBomb.evolution  // 保持初始等级
    });
    
    this.startStaticBombCountdown(staticBomb);
  });
}
```

**影响**: 
- 静态炸弹墙只能被激活一次
- 静态炸弹的等级完全由关卡配置决定（`evolution` 初始值）
- 激活后倒计时启动，爆炸威力固定

---

## 三、代码实现方案

### 3.1 需要修改的文件

| 文件 | 修改内容 | 工作量 |
|------|----------|--------|
| `src/core/GameLogic.js` | 移除 `upgradeAdjacentBombs()` 调用；修改 `triggerStaticBombs()` 移除升级逻辑 | 小 |
| `src/view/Animator.js` | 移除炸弹升级动画（光环效果） | 小 |
| `src/view/UIManager.js` | 移除升级提示文字 | 极小 |
| `src/data/LevelData.js` | 重新设计所有关卡，静态炸弹初始等级决定威力 | 大 |
| `wiki/LEVEL_DESIGN.md` | 更新关卡设计文档 | 中 |

### 3.2 GameLogic.js 具体修改

```javascript
// 1. 移除 upgradeAdjacentBombs() 方法
// 或直接注释掉调用

explodeBomb(bomb) {
  // ... 现有代码 ...
  
  // 处理静态炸弹被引爆
  this.triggerStaticBombs(bomb, range);

  // 移除：升级相邻炸弹
  // this.upgradeAdjacentBombs(bomb);  ← 删除这行

  this.processingExplosion = false;
  this.checkGameState();
}

explodeStaticBomb(staticBomb) {
  // ... 现有代码 ...
  
  // 移除：静态炸弹爆炸也能升级相邻炸弹
  // this.upgradeAdjacentBombs(staticBomb);  ← 删除这行

  this.processingExplosion = false;
  this.checkGameState();
}

// 2. 修改 triggerStaticBombs()
triggerStaticBombs(explodedBomb, range) {
  this.staticBombs.forEach(staticBomb => {
    const inRange = range.some(r => r.x === staticBomb.x && r.y === staticBomb.y);
    if (!inRange) return;
    if (staticBomb.active) return; // 新增：已激活则忽略

    // 仅激活，不升级
    staticBomb.active = true;
    staticBomb.countdown = 3;
    
    this.addScore(5, '静态炸弹激活');
    this.emitEvent('static_bomb_activated', {
      x: staticBomb.x, y: staticBomb.y,
      evolution: staticBomb.evolution
    });
    
    this.startStaticBombCountdown(staticBomb);
  });
}

// 3. 移除或注释 upgradeAdjacentBombs 方法
/*
upgradeAdjacentBombs(explodedBomb) {
  // 此方法已废弃 - v0.6.0 移除炸弹升级机制
}
*/
```

### 3.3 动画系统调整

```javascript
// Animator.js - 移除升级动画
// 原逻辑：检测到 bomb_upgraded 事件播放光环动画
// 新逻辑：移除该事件监听

// 需要移除/注释的代码：
// - 升级光环粒子效果
// - 升级文字飘字（"升级!"）
// - 炸弹颜色变化动画（如果存在）
```

---

## 四、关卡设计调整

### 4.1 设计思路变化

**变更前**: 
- 玩家通过堆叠炸弹制造大威力爆炸
- 静态炸弹激活后还能继续升级
- 策略核心：最大化升级次数

**变更后**: 
- 玩家炸弹威力固定，策略转向"位置选择"
- 静态炸弹威力由关卡预设，玩家需要合理利用
- 策略核心：激活顺序、连锁路径、资源管理

### 4.2 关卡参数调整原则

| 机制 | 变更前 | 变更后 |
|------|--------|--------|
| 玩家炸弹 | Lv0初始，可升级到Lv3 | 固定Lv0 |
| 静态炸弹 | Lv0初始，激活后可升级 | 固定等级（由关卡配置） |
| 大威力爆炸 | 通过升级实现 | 通过预设高等级静态炸弹实现 |
| 教学重点 | 堆叠升级 | 连锁激活、路径规划 |

### 4.3 具体关卡调整示例

#### 第2关（连锁的力量）- 调整前
```javascript
// 变更前：中心炸弹升级后范围2
staticBombs: [
  { x: 0, y: 0, evolution: 0 },    // 激活后升级，范围2
  { x: -1, y: 0, evolution: 0 },
  { x: 0, y: -1, evolution: 0 },
  { x: 0, y: 1, evolution: 0 }
]
```

#### 第2关（连锁的力量）- 调整后
```javascript
// 变更后：中心炸弹预设为Lv1（范围2）
staticBombs: [
  { x: 0, y: 0, evolution: 1 },    // 预设Lv1，范围2
  { x: -1, y: 0, evolution: 0 },    // 辅助激活
  { x: 0, y: -1, evolution: 0 },
  { x: 0, y: 1, evolution: 0 }
]
// 教学点：静态炸弹预设等级决定威力，激活顺序很重要
```

#### 第6关（范围叠加）- 调整前
```javascript
// 变更前：三个炸弹十字相邻，中心升到Lv2
staticBombs: [
  { x: 0, y: 0, evolution: 0 }  // 通过堆叠升级到Lv2
]
```

#### 第6关（范围叠加）- 调整后
```javascript
// 变更后：直接预设高等级静态炸弹
staticBombs: [
  { x: 0, y: 0, evolution: 2 }  // 预设Lv2，范围3格
]
// 教学点：高等级静态炸弹的威力
```

### 4.4 新增关卡设计方向

**新增机制教学关卡**：
- **预设等级识别**：玩家需要观察静态炸弹的初始等级（通过外观区分）
- **激活路径规划**：选择最优的激活顺序，让连锁覆盖所有墙壁
- **资源约束**：炸弹数量有限，必须精准放置

---

## 五、UI/UX 调整

### 5.1 需要移除的UI元素

| 元素 | 位置 | 处理方式 |
|------|------|----------|
| 升级光环动画 | 炸弹周围 | 移除 |
| "升级!" 飘字 | 屏幕中央 | 移除 |
| 炸弹等级指示 | 炸弹图标 | 保留（用于显示静态炸弹预设等级） |
| 进化进度条 | 炸弹下方 | 移除 |

### 5.2 需要保留的UI元素

| 元素 | 说明 |
|------|------|
| 静态炸弹等级标识 | 通过颜色/数字显示预设等级 |
| 激活状态指示 | 静态炸弹被激活后的视觉变化 |
| 倒计时数字 | 炸弹爆炸前的倒计时 |

---

## 六、测试验证清单

### 6.1 功能测试

- [ ] 玩家炸弹爆炸后，相邻玩家炸弹不升级
- [ ] 玩家炸弹爆炸后，相邻静态炸弹激活但不升级
- [ ] 静态炸弹爆炸后，相邻玩家炸弹不升级
- [ ] 静态炸弹激活后，再次爆炸不会升级
- [ ] 静态炸弹预设等级正确生效（Lv0/1/2/3）
- [ ] 所有18关可解性验证

### 6.2 性能测试

- [ ] 移除升级逻辑后，爆炸计算性能无退化
- [ ] 移除升级动画后，渲染性能提升

### 6.3 兼容性测试

- [ ] 存档数据兼容（旧存档升级炸弹如何处理？）
- [ ] 真机测试（微信开发者工具 + 手机预览）

---

## 七、风险评估

| 风险 | 等级 | 应对措施 |
|------|------|----------|
| 关卡难度剧变 | 高 | 需要重新设计所有关卡，确保可解性 |
| 玩家体验断层 | 中 | 更新教学关卡，让玩家适应新规则 |
| 代码回归 | 低 | 彻底移除升级逻辑，避免残留 |
| 存档不兼容 | 低 | 新版本清空旧存档或做兼容处理 |

---

## 八、实施计划

### Phase 1: 代码修改（1天）
1. 修改 `GameLogic.js` - 移除升级逻辑
2. 修改 `Animator.js` - 移除升级动画
3. 修改 `UIManager.js` - 移除升级提示

### Phase 2: 关卡重设计（2-3天）
1. 重新设计所有18关
2. 验证每关可解性
3. 调整难度曲线

### Phase 3: 测试验证（1天）
1. 功能测试
2. 真机测试
3. 性能测试

### Phase 4: 文档更新（0.5天）
1. 更新所有设计文档
2. 更新技能描述
3. 发布更新日志

---

## 九、相关文档索引

- [原关卡设计](LEVEL_DESIGN.md) - 需要更新
- [技术架构](ARCHITECTURE.md) - 需要更新事件列表
- [爆炸特效规范](CROSS_EXPLOSION_SPEC.md) - 需要移除升级相关特效
- [积分系统](SCORE_IMPLEMENTATION_PLAN.md) - 需要移除升级得分

---

_文档版本: v0.6.0-draft | 2026-06-11 | 待实施_
