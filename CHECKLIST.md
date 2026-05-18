# 阶段二：UI 模块自查清单

## UI 管理器 (UIManager.ts)
- [x] 使用 @property 暴露面板引用
- [x] 使用 Node.active 控制显示/隐藏
- [x] 使用 Button 组件事件监听
- [x] 使用 Label 更新文本
- [x] 使用 ProgressBar 更新进度
- [x] 使用 UIOpacity 控制透明度
- [x] 浮动文字使用节点动画
- [x] 面板切换使用 switchPanel 方法

## 设计规范
- [x] 节点层级结构清晰
- [x] 组件配置标准化
- [x] 动画规范定义
- [x] 适配规则明确

## Cocos 引擎特性使用
- [x] cc.Canvas - 画布组件
- [x] cc.UITransform - UI 变换
- [x] cc.UIOpacity - UI 透明度
- [x] cc.Button - 按钮组件
- [x] cc.Label - 文本组件
- [x] cc.ProgressBar - 进度条
- [x] cc.Sprite - 精灵组件
- [x] cc.Widget - 适配组件 (预留)

## 待完善
- [ ] tween 动画接入 (等 Cocos 引擎加载)
- [ ] 对象池优化
- [ ] 多语言支持

## 与旧版本差异
| 旧实现 | Cocos 实现 |
|--------|-----------|
| 手动 Canvas 绘制 | 使用 cc.Sprite + cc.Label |
| 自定义点击检测 | 使用 cc.Button 组件 |
| 手动坐标计算 | 使用 UITransform + Widget |
| 自定义动画 | 使用 tween + UIOpacity |
| 固定分辨率 | 使用 Canvas 适配策略 |

---