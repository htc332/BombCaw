# 自适应布局调整记录 (2026-05-02)

## 调整依据
根据《消除游戏自适应布局需求》文档，以实际项目情况为准进行正式上线标准调整。

---

## 文档核心要求 vs 当前代码差距

| 要求 | 修改前 | 修改后 | 状态 |
|------|--------|--------|------|
| **格子间隙 gap** | 无间隙，格子紧挨 | `gap = max(2, floor(cellSize × 0.05))` | ✅ |
| **棋盘总尺寸** | `gridSize × cellSize` | `cellSize × gridSize + gap × (gridSize-1)` | ✅ |
| **页面分区比例** | 硬编码高度 | HUD 12%, 棋盘 70%, 底部 15% | ✅ |
| **安全区适配** | 只有 top/bottom | 完整 left/right/top/bottom | ✅ |
| **cellSize 计算** | 基于屏幕宽度 | 基于可用区域 70% 动态计算 | ✅ |
| **cellSize ≥ 44px** | 限制 50-90pt | 物理像素 ≥ 44px | ✅ |
| **左右边距** | 无 | 可用宽度的 5% | ✅ |
| **棋盘居中** | 水平居中 | 锚定可用区域几何中心 | ✅ |
| **极端小屏处理** | 无 | 先压gap至2px，再缩放0.9x | ✅ |

---

## 修改文件

### 1. `src/view/Renderer.js`

#### `resize()` 方法
- **简化 cellSize 计算**，移除此处计算（由 `calcLayout` 接管）
- **增加安全区 left/right 记录**（之前只有 top/bottom）

#### `calcLayout()` 方法 - 核心重写
```javascript
// 新规格:
// 1. 安全区内可用区域 = 总尺寸 - 安全区
// 2. 页面分区: HUD 12%, 棋盘 70%, 底部 15%
// 3. 左右边距 = 可用宽度的 5%
// 4. cellSize 基于棋盘区域动态计算
// 5. gap = max(2, floor(cellSize * 0.05))
// 6. boardSize = cellSize * gridSize + gap * (gridSize - 1)
// 7. 棋盘居中于可用区域
// 8. cellSize 物理像素 >= 44px
// 9. 极端小屏: 先压gap至2px，再整体缩放0.9x直到放下
```

#### `drawGrid()` 方法
- 添加 `gap` 参数使用
- 格子定位: `x = offsetX + col * (cellSize + gap)`

#### `drawWalls()` 方法
- 添加 `gap` 参数使用
- 墙壁定位考虑 gap

#### `drawBombs()` 方法
- 添加 `gap` 参数使用
- 炸弹定位考虑 gap

#### `drawStaticBombs()` 方法
- 添加 `gap` 参数使用
- 静态炸弹定位考虑 gap

#### `screenToGrid()` 方法
- 坐标转换考虑 gap: `(screenX - offsetX) / (cellSize + gap)`

#### `gridToScreen()` 方法
- 坐标转换考虑 gap: `offsetX + (gx + half) * (cellSize + gap)`
- 新增返回 `cx, cy, size` 字段

---

## 关键公式

### 棋盘尺寸计算
```
gap = max(2, floor(cellSize * 0.05))
boardSize = cellSize * gridSize + gap * (gridSize - 1)
```

### 格子定位
```javascript
// 第 col 列，第 row 行
col = gx + half;  // 0-based 列索引
row = gy + half;  // 0-based 行索引
x = offsetX + col * (cellSize + gap);
y = offsetY + row * (cellSize + gap);
```

### 触摸坐标转换
```javascript
// screen -> grid
col = floor((screenX - offsetX) / (cellSize + gap));
row = floor((screenY - offsetY) / (cellSize + gap));
```

---

## 验收标准检查

根据文档第 9 节验收标准：

| 标准 | 状态 |
|------|------|
| 1. 棋盘完整显示，格子正方形，无拉伸 | ✅ cellSize 是正方形，强制整数 |
| 2. 棋盘中心与可用区域中心重合 | ✅ calcLayout 中计算 |
| 3. HUD 不被刘海/灵动岛遮挡 | ✅ safeAreaTop + 12% 分区 |
| 4. 底部按钮不被手势条覆盖 | ✅ safeAreaBottom + 15% 分区 |
| 5. 弹窗内容不越安全区 | UI 弹窗未在本次修改范围 |
| 6. 横屏/折叠后 3 秒内重算 | resize() 保持，布局重算在 calcLayout |
| 7. 单格热区 ≥ 44px | ✅ cellSize 物理像素强制 ≥ 44 |

---

## 测试验证

```bash
# 语法检查通过
for f in src/**/*.js game.js; do node --check "$f"; done
```

**待验证**（需微信开发者工具）：
1. 不同机型下棋盘是否正常显示
2. 格子间隙是否可见（gap ≥ 2px）
3. 触摸点击是否准确映射到格子
4. 安全区适配是否正确（刘海屏、底部手势条）

---

## 注意事项

1. **gridSize 保持动态**: 文档要求 8×8，但实际项目根据关卡配置（5-10 不等），保持动态适配
2. **calcLayout 缓存**: 每次渲染调用一次，性能可接受；如需优化可添加缓存机制
3. **UI 弹窗**: 文档第 3.4 节弹窗安全区约束未在本次修改中实现（需 UI 层配合）
4. **横屏旋转**: resize() 已监听，calcLayout 动态重算已支持

---

_调整时间: 2026-05-02_
_依据文档: 消除游戏自适应布局需求_
