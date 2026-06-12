# 静态炸弹等级映射问题总结

## 问题现象
Lv3 静态炸弹（紫色，横向爆炸）的爆炸特效显示为竖向，与预期不符。

## 根本原因
静态炸弹的 `evolution` 值和精灵图数组索引之间的映射关系错误。

### 数据流
```
LevelData.js          GameLogic.js          Renderer.js
staticBombs: [
  { x:0, y:0, evolution:0 },  →  spawnStaticBomb(x,y,evolution)  →  drawStaticBombs()
  { x:2, y:0, evolution:2 },                                    ↓
  { x:-2,y:0, evolution:3 },                              level = sb.evolution || 0
  { x:0, y:2, evolution:5 },                                    ↓
]                                                            sleepSprites[level]
                                                              [0]=level1, [1]=level2
                                                              [2]=level3, [3]=level4
```

### 错误映射
| evolution | 预期等级 | 预期索引 | 实际索引 | 结果 |
|-----------|---------|---------|---------|------|
| 0 | Lv1 白色 | 0 | 0 | ✅ 正确 |
| 2 | Lv2 蓝色 | 1 | 2 | ❌ 显示 Lv3 紫色 |
| 3 | Lv3 紫色 | 2 | 3 | ❌ 显示 Lv4 红色 |
| 5 | Lv4 红色 | 3 | 5 | ❌ undefined，回退到圆圈 |

## 修复方案
在 `Renderer.js` 的 `drawStaticBombs` 方法中添加映射表：

```javascript
const levelMap = { 0: 0, 2: 1, 3: 2, 5: 3 };
const level = levelMap[sb.evolution] !== undefined ? levelMap[sb.evolution] : 0;
```

## 影响范围
- 静态炸弹 Sleep 精灵图显示
- 静态炸弹激活后的动态炸弹精灵图显示
- 回退圆圈颜色显示
- **不影响**：爆炸逻辑（GameLogic）、爆炸特效（Animator）

## 教训
1. 数组索引和语义值（evolution）必须显式映射，不能假设连续
2. evolution 值 0,2,3,5 是历史遗留（对应炸弹类型的 evolution 值），不是等级索引
3. 任何使用 `sb.evolution || 0` 作为数组索引的地方都是潜在 bug
