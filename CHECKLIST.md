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

# 动画系统迁移

## 动画管理器 (AnimationManager.ts)
- [x] 使用 AnimationClip 资源引用
- [x] 使用 Animation 组件播放控制
- [x] 支持回调函数 (FINISHED 事件)
- [x] 支持播放速度控制
- [x] 支持暂停/恢复/停止

## 精灵图动画适配
- [x] 创建 SpriteAnimationHelper 组件
- [x] 创建 SpriteSheetLoader 组件
- [x] 支持程序化 SpriteFrame 切换
- [x] 兼容现有 index.json 格式
- [x] 编写迁移指南文档

## 资源迁移
- [x] 复制 lv1-lv4 炸弹精灵图
- [x] 复制 enemy_n 精灵图
- [x] 复制 enemy_elite 系列精灵图
- [x] 复制 static_bombs 精灵图
- [x] 创建迁移脚本 (migrate-sprites.sh)

## Cocos 动画特性
- [x] AnimationClip 资源
- [x] Animation 组件
- [x] AnimationState 状态控制
- [x] 事件系统 (FINISHED)
- [x] SpriteFrame 程序化切换
- [ ] 编辑器中创建 AnimationClip（需在 Cocos Editor 操作）

## 待完善
- [ ] 在 Cocos Editor 中创建 AnimationClip 资源
- [ ] 配置 SpriteFrame 的 Trim 和 Anchor
- [ ] 设置纹理 Filter 为 LINEAR
- [ ] Tween 动画接入

---