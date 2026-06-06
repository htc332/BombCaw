# 牛牛炸鼠 - 关卡设计文档

**版本**: v0.5.2  
**平台**: 微信小游戏 (Canvas 原生)  
**关卡数**: 18关  
**最后更新**: 2026-05-03

---

## 一、设计原则

### 1.1 宫本茂式教学
- **一次只教一个机制**
- 让玩家通过尝试自己发现规律
- 避免长篇文字说明，用关卡布局引导

### 1.2 难度曲线
```
1-6关: 教学阶段 → 逐个引入机制
7-12关: 应用阶段 → 机制组合应用
13-18关: 精通阶段 → 创意挑战
```

### 1.3 验证清单
每关设计后必须检查：
1. ✅ 所有坐标在网格范围内
2. ✅ 静态炸弹与墙壁不重叠
3. ✅ 爆炸范围覆盖所有墙壁（可解性）
4. ✅ 静态炸弹能被正常炸弹引爆

**工具**: `node test-levels.js` 自动化验证

---

## 二、教学阶段 (1-6关)

### 第1关：基础放置
```javascript
gridSize: 5,
bombs: 2,
hint: '点击空白格放炸弹，炸毁墙壁',
walls: [
  { x: 0, y: 1, type: 'normal' },
  { x: 0, y: -1, type: 'normal' },
  { x: 1, y: 0, type: 'normal' },
  { x: -1, y: 0, type: 'normal' }
],
staticBombs: []
```
**教学点**: 点击空白格放置炸弹，倒计时结束后爆炸

---

### 第2关：连锁的力量
```javascript
gridSize: 5,
bombs: 4,
hint: '引爆中间的炸弹，看它如何帮你炸掉所有墙壁',
walls: [
  { x: -2, y: 0, type: 'normal' },
  { x: 2, y: 0, type: 'normal' },
  { x: 0, y: -2, type: 'normal' },
  { x: 0, y: 2, type: 'normal' }
],
staticBombs: [
  { x: 0, y: 0, evolution: 0 },    // 中心雷，升级后范围2
  { x: -1, y: 0, evolution: 0 },
  { x: 0, y: -1, evolution: 0 },
  { x: 0, y: 1, evolution: 0 }
]
```
**教学点**: 中间静态炸弹被引爆后升级+连锁激活周围炸弹
**关键**: 中心炸弹升级后范围2，刚好能炸到四角墙壁

---

### 第3关：连锁惊喜
```javascript
gridSize: 5,
bombs: 2,
hint: '一个炸弹可以激活另一个',
walls: [
  { x: -2, y: 0, type: 'normal' },
  { x: 2, y: 0, type: 'normal' },
  { x: 0, y: -2, type: 'normal' },
  { x: 0, y: 2, type: 'normal' }
],
staticBombs: [
  { x: -1, y: 0, evolution: 0 },
  { x: 1, y: 0, evolution: 0 }
]
```
**教学点**: 爆炸可以连锁激活其他静态炸弹

---

### 第4关：自己也要升级
```javascript
gridSize: 5,
bombs: 4,
hint: '把两个自己的炸弹放一起，也会升级！',
walls: [
  { x: -2, y: 0, type: 'normal' },
  { x: -1, y: 0, type: 'normal' },
  { x: 1, y: 0, type: 'normal' },
  { x: 2, y: 0, type: 'normal' },
  { x: 0, y: 2, type: 'normal' },
  { x: 0, y: -2, type: 'normal' }
],
staticBombs: []
```
**教学点**: 玩家炸弹相邻也会升级（和静态炸弹一样）

---

### 第5关：选择与规划
```javascript
gridSize: 5,
bombs: 3,
hint: '先激活哪个静态炸弹？规划你的策略',
walls: [
  { x: -2, y: 0, type: 'normal' },
  { x: 2, y: 0, type: 'normal' },
  { x: 0, y: -2, type: 'normal' },
  { x: 0, y: 2, type: 'normal' },
  { x: 0, y: 0, type: 'normal' }
],
staticBombs: [
  { x: -1, y: 0, evolution: 0 },
  { x: 1, y: 0, evolution: 0 }
]
```
**教学点**: 引爆顺序很重要

---

### 第6关：范围叠加
```javascript
gridSize: 7,
bombs: 5,
hint: '三个炸弹十字相邻，威力最大！',
walls: [
  { x: 0, y: 3, type: 'normal' },
  { x: 0, y: -3, type: 'normal' },
  { x: 3, y: 0, type: 'normal' },
  { x: -3, y: 0, type: 'normal' }
],
staticBombs: [
  { x: 0, y: 0, evolution: 0 }
]
```
**教学点**: 三级升级系统（0→1→2）
**关键**: 三个炸弹十字相邻，中心炸弹可升到 Lv2，范围3格

---

## 三、应用阶段 (7-12关)

### 第7关：静态炸弹 + 炸弹墙
```javascript
gridSize: 5,
bombs: 2,
hint: '用静态炸弹的爆炸触发黄色炸弹墙',
walls: [
  { x: 0, y: 2, type: 'bomb', color: 'yellow' },
  { x: 2, y: 0, type: 'bomb', color: 'yellow' }
],
staticBombs: [
  { x: 0, y: 0, evolution: 1 }  // 初始1级，范围2格
]
```
**教学点**: 静态炸弹也能触发炸弹墙，黄色炸弹墙返还炸弹

---

### 第8关：静态炸弹 vs 加固墙
```javascript
gridSize: 5,
bombs: 2,
hint: '1级静态炸弹可以一次炸掉加固墙',
walls: [
  { x: 0, y: 2, type: 'strong' },
  { x: 0, y: -2, type: 'strong' }
],
staticBombs: [
  { x: 0, y: 0, evolution: 1 }  // 1级=范围2，刚好够到
]
```
**教学点**: 进化炸弹对加固墙更有效（1级范围2可直接摧毁）

---

### 第9关：多米诺连锁
```javascript
gridSize: 7,
bombs: 1,
hint: '只需一个炸弹，看连锁反应',
walls: [
  { x: -3, y: 0, type: 'normal' },
  { x: 3, y: 0, type: 'normal' },
  { x: 0, y: 3, type: 'normal' },
  { x: 0, y: -3, type: 'normal' }
],
staticBombs: [
  { x: -2, y: 0, evolution: 0 },
  { x: -1, y: 0, evolution: 0 },
  { x: 0, y: 0, evolution: 0 },
  { x: 1, y: 0, evolution: 0 },
  { x: 2, y: 0, evolution: 0 }
]
```
**教学点**: 连锁的优雅，一个炸弹触发一整排

---

### 第10关：静态炸弹 + 红色炸弹墙连锁
```javascript
gridSize: 5,
bombs: 2,
hint: '创造大爆炸连锁反应',
walls: [
  { x: -2, y: 0, type: 'normal' },
  { x: 2, y: 0, type: 'normal' },
  { x: 0, y: -2, type: 'normal' },
  { x: 0, y: 2, type: 'normal' }
],
staticBombs: [
  { x: -1, y: 0, evolution: 0 },
  { x: 1, y: 0, evolution: 0 }
]
```
**教学点**: 所有爆炸机制联动

---

### 第11关：混合战场
```javascript
gridSize: 7,
bombs: 4,
hint: '先处理哪个？想清楚顺序',
walls: [
  { x: -2, y: -2, type: 'normal' },
  { x: 2, y: -2, type: 'strong' },
  { x: -2, y: 2, type: 'bomb', color: 'yellow' },
  { x: 2, y: 2, type: 'bomb', color: 'red' },
  { x: 0, y: 0, type: 'normal' }
],
staticBombs: [
  { x: -1, y: 0, evolution: 0 },
  { x: 1, y: 0, evolution: 1 }
]
```
**教学点**: 识别优先级，不同墙壁有不同策略

---

### 第12关：效率最大化
```javascript
gridSize: 7,
bombs: 3,
hint: '3个炸弹激活所有静态炸弹',
walls: [
  { x: -3, y: -3, type: 'normal' },
  { x: 3, y: 3, type: 'normal' }
],
staticBombs: [
  { x: -2, y: -2, evolution: 0 },
  { x: 0, y: 0, evolution: 0 },
  { x: 2, y: 2, evolution: 0 }
]
```
**教学点**: 用最少的资源达到目标

---

## 四、精通阶段 (13-18关)

### 第13关：只用静态炸弹
```javascript
gridSize: 5,
bombs: 1,
hint: '只有一个炸弹，让它触发连锁',
walls: [
  { x: -2, y: 0, type: 'normal' },
  { x: 2, y: 0, type: 'normal' },
  { x: 0, y: -2, type: 'normal' },
  { x: 0, y: 2, type: 'normal' }
],
staticBombs: [
  { x: -1, y: 0, evolution: 0 },
  { x: 1, y: 0, evolution: 0 },
  { x: 0, y: -1, evolution: 0 },
  { x: 0, y: 1, evolution: 0 }
]
```
**挑战**: 不放任何炸弹，只用静态炸弹通关（只用1个激活第一个）

---

### 第14关：最大化连锁
```javascript
gridSize: 7,
bombs: 2,
hint: '制造最大的连锁爆炸！',
walls: [
  { x: -3, y: -3, type: 'normal' },
  { x: -3, y: 3, type: 'normal' },
  { x: 3, y: -3, type: 'normal' },
  { x: 3, y: 3, type: 'normal' }
],
staticBombs: 十字形排列，共9个
```
**挑战**: 创造最大的连锁爆炸

---

### 第15关：精准控制
```javascript
gridSize: 7,
bombs: 3,
hint: '太强的爆炸会触发不好的东西...',
walls: [
  { x: -2, y: 0, type: 'normal' },
  { x: 2, y: 0, type: 'normal' }
],
staticBombs: [
  { x: -1, y: 0, evolution: 0 },
  { x: 0, y: 0, evolution: 0 },
  { x: 1, y: 0, evolution: 0 }
]
```
**挑战**: 需要精确控制爆炸范围（暗示不要升级太多）

---

### 第16关：综合挑战 A
```javascript
gridSize: 7,
bombs: 4,
hint: '综合运用你学到的所有技巧',
walls: [
  { x: -3, y: -3, type: 'normal' },
  { x: -3, y: 0, type: 'strong' },
  { x: -3, y: 3, type: 'normal' },
  { x: 0, y: -3, type: 'strong' },
  { x: 0, y: 3, type: 'strong' },
  { x: 3, y: -3, type: 'normal' },
  { x: 3, y: 0, type: 'strong' },
  { x: 3, y: 3, type: 'normal' },
  { x: -2, y: -2, type: 'bomb', color: 'yellow' },
  { x: 2, y: 2, type: 'bomb', color: 'red' }
],
staticBombs: [
  { x: -1, y: -1, evolution: 0 },
  { x: 1, y: 1, evolution: 1 },
  { x: 0, y: 0, evolution: 0 }
]
```

---

### 第17关：综合挑战 B
```javascript
gridSize: 7,
bombs: 5,
hint: '最难的谜题',
walls: 12面墙壁 + 4面加固墙
staticBombs: 4个横向排列
```
**挑战**: 最难的谜题，需要精确规划

---

### 第18关：最终试炼
```javascript
gridSize: 8,
bombs: 6,
hint: '大师级挑战',
walls: 15面墙壁（动态生成，含所有类型）
staticBombs: 动态生成，避开墙壁
```
**挑战**: 大师级挑战，随机生成但确保可解

---

## 五、关卡参数总表

| 关卡 | 网格 | 炸弹 | 墙壁数 | 静态炸弹 | 教学重点 |
|------|------|------|--------|----------|----------|
| 1 | 5×5 | 2 | 4 | 0 | 基础放置 |
| 2 | 5×5 | 4 | 4 | 4 | 连锁升级 |
| 3 | 5×5 | 2 | 4 | 2 | 连锁激活 |
| 4 | 5×5 | 4 | 6 | 0 | 玩家炸弹升级 |
| 5 | 5×5 | 3 | 5 | 2 | 规划顺序 |
| 6 | 7×7 | 5 | 4 | 1 | 三级升级 |
| 7 | 5×5 | 2 | 2 | 1 | 黄色炸弹墙 |
| 8 | 5×5 | 2 | 2 | 1 | 加固墙 |
| 9 | 7×7 | 1 | 4 | 5 | 多米诺连锁 |
| 10 | 5×5 | 2 | 4 | 2 | 红色炸弹墙 |
| 11 | 7×7 | 4 | 5 | 2 | 混合战场 |
| 12 | 7×7 | 3 | 2 | 3 | 效率最大化 |
| 13 | 5×5 | 1 | 4 | 4 | 只用静态炸弹 |
| 14 | 7×7 | 2 | 4 | 9 | 最大化连锁 |
| 15 | 7×7 | 3 | 2 | 3 | 精准控制 |
| 16 | 7×7 | 4 | 10 | 3 | 综合挑战A |
| 17 | 7×7 | 5 | 12 | 4 | 综合挑战B |
| 18 | 8×8 | 6 | 15 | 动态 | 大师级 |

---

## 六、设计经验

### 6.1 关键教训
1. **坐标范围检查**: 所有坐标必须在 `[-half, half]` 范围内
2. **避免重叠**: 静态炸弹不能与墙壁重叠
3. **可解性验证**: 爆炸范围必须能覆盖所有墙壁
4. **静态炸弹可触达**: 确保静态炸弹能被玩家炸弹或连锁爆炸激活

### 6.2 自动化验证
```bash
# 验证所有关卡
node test-levels.js

# 检查项
- 坐标范围
- 重叠检测
- 爆炸覆盖
```

---

_文档版本: v1.0 | 2026-05-03_
