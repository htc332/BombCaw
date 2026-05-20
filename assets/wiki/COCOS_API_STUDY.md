# Cocos Creator 3.8 API 学习总结

> 基于项目当前实现（炸弹推墙 v0.7.8）的模块对照分析
> 日期: 2026-05-18

---

## 1. 项目架构 vs Cocos Creator 3.8 架构

### 当前项目架构（原生 Canvas）
```
src/
├── core/           # 游戏逻辑层
│   ├── GameLogic.js    # 主逻辑
│   ├── Grid.js         # 网格系统
│   └── LevelData.js    # 关卡数据
├── view/           # Canvas 渲染层
│   └── Renderer.js     # 渲染器
├── data/           # 数据存档
│   └── Storage.js      # 微信存储
└── system/         # 系统层
    ├── Audio.js        # 音效
    └── Ad.js           # 广告
```

### Cocos Creator 3.8 对应架构
```
assets/
├── scripts/        # 脚本组件
│   ├── GameLogic.ts    # 组件化逻辑
│   ├── GridManager.ts  # 网格管理
│   └── LevelData.ts    # 关卡数据
├── scenes/         # 场景文件
├── prefabs/        # 预制体
│   ├── Bomb.prefab     # 炸弹预制体
│   ├── Wall.prefab     # 墙壁预制体
│   └── StaticBomb.prefab # 静态炸弹
├── resources/      # 动态资源
│   ├── sprites/        # 精灵图
│   ├── audio/          # 音效
│   └── levels/         # 关卡配置
└── settings/       # 项目设置
```

---

## 2. 核心模块对照分析

### 2.1 2D 渲染系统

| 当前实现 | Cocos Creator 3.8 | 说明 |
|---------|-------------------|------|
| 原生 Canvas API | `cc.Sprite` 组件 | 精灵渲染 |
| `ctx.drawImage()` | `SpriteFrame` 资源 | 精灵帧管理 |
| 手动计算坐标 | `UITransform` 组件 | 自动布局适配 |
| 自定义动画帧 | `Animation` 组件 | 帧动画系统 |
| 粒子系统(Canvas) | `ParticleSystem2D` | 2D粒子系统 |

**关键 API 类**:
- `Sprite` - 2D 精灵渲染组件
- `SpriteFrame` - 精灵帧资源
- `SpriteAtlas` - 精灵图集
- `UITransform` - UI 变换组件
- `Label` - 文本渲染
- `GraphicsComponent` - 矢量绘制

### 2.2 场景与节点系统

| 当前实现 | Cocos Creator 3.8 | 说明 |
|---------|-------------------|------|
| 自定义对象池 | `Node` + `Prefab` | 节点与预制体 |
| 手动坐标计算 | `Node.position` | 节点坐标系统 |
| 自定义层级 | `Node.layer` + `Layers` | 层级管理 |
| 手动事件传递 | `NodeEventType` | 节点事件系统 |

**关键 API 类**:
- `Node` - 场景节点基类
- `Scene` - 场景管理
- `Prefab` - 预制体系统
- `Component` - 组件基类
- `EventHandler` - 事件处理

### 2.3 动画系统

| 当前实现 | Cocos Creator 3.8 | 说明 |
|---------|-------------------|------|
| 手动帧动画 | `Animation` 组件 | 动画组件 |
| 倒计时驱动 | `AnimationState` | 动画状态控制 |
| 自定义插值 | `AnimCurve` | 动画曲线 |
| 精灵图切换 | `AnimationClip` | 动画剪辑 |

**关键 API 类**:
- `Animation` - 动画组件
- `AnimationClip` - 动画剪辑资源
- `AnimationState` - 动画状态
- `AnimCurve` - 动画曲线
- `AnimationManager` - 动画管理器

### 2.4 资源管理

| 当前实现 | Cocos Creator 3.8 | 说明 |
|---------|-------------------|------|
| 手动加载图片 | `assetManager` | 资源管理器 |
| 自定义分包 | `AssetManager.Bundle` | 资源分包 |
| 手动缓存 | `AssetManager.Cache` | 资源缓存 |
| 微信存储 | `sys.localStorage` | 本地存储 |

**关键 API 类**:
- `AssetManager` - 资源管理器
- `Bundle` - 资源包
- `Asset` - 资源基类
- `ImageAsset` - 图片资源
- `Texture2D` - 2D 纹理

### 2.5 输入系统

| 当前实现 | Cocos Creator 3.8 | 说明 |
|---------|-------------------|------|
| 微信触摸事件 | `Input` 系统 | 统一输入系统 |
| 手动坐标转换 | `EventTouch` | 触摸事件 |
| 自定义点击检测 | `SystemEvent` | 系统事件 |

**关键 API 类**:
- `Input` - 输入系统
- `EventTouch` - 触摸事件
- `EventMouse` - 鼠标事件
- `SystemEvent` - 系统事件
- `Touch` - 触摸点

### 2.6 音频系统

| 当前实现 | Cocos Creator 3.8 | 说明 |
|---------|-------------------|------|
| 微信音频 API | `AudioSource` 组件 | 音频组件 |
| 手动控制 | `AudioClip` 资源 | 音频剪辑 |

**关键 API 类**:
- `AudioSource` - 音频源组件
- `AudioClip` - 音频剪辑资源

### 2.7 数学与工具

| 当前实现 | Cocos Creator 3.8 | 说明 |
|---------|-------------------|------|
| 自定义数学函数 | `math` 命名空间 | 数学库 |
| 手动颜色计算 | `math.Color` | 颜色类 |
| 自定义缓动 | `easing` 函数集 | 缓动函数 |

**关键 API**:
- `math.Vec2` / `math.Vec3` - 向量
- `math.Color` - 颜色
- `math.Rect` - 矩形
- `math.Size` - 尺寸
- `easing` - 缓动函数集

---

## 3. 关键迁移建议

### 3.1 渲染层迁移

**当前**: 原生 Canvas 绘制
```javascript
// 当前实现
ctx.drawImage(spriteSheet, frame.x, frame.y, frame.w, frame.h, x, y, w, h);
```

**迁移到 Cocos**:
```typescript
// Cocos Creator 实现
const sprite = node.getComponent(Sprite);
sprite.spriteFrame = spriteFrame; // 设置精灵帧
```

### 3.2 动画系统迁移

**当前**: 手动计算帧索引
```javascript
const frameIdx = Math.floor((animTime % duration) / frameDuration);
```

**迁移到 Cocos**:
```typescript
// 使用 Animation 组件
const anim = node.getComponent(Animation);
anim.play('bomb_idle'); // 播放动画剪辑
```

### 3.3 事件系统迁移

**当前**: 回调模式
```javascript
this.onEvent = null;
emitEvent(type, data) {
  if (this.onEvent) this.onEvent({ type, ...data });
}
```

**迁移到 Cocos**:
```typescript
// 使用节点事件系统
node.on(NodeEventType.TOUCH_START, this.onTouchStart, this);
node.emit('custom_event', data); // 触发自定义事件
```

### 3.4 资源加载迁移

**当前**: 手动 Promise 加载
```javascript
Promise.all([
  loadImage(url1),
  loadImage(url2)
]).then(results => { ... });
```

**迁移到 Cocos**:
```typescript
// 使用 AssetManager
assetManager.loadBundle('sprites', (err, bundle) => {
  bundle.loadDir('lv1', SpriteFrame, (err, frames) => {
    // 使用加载的精灵帧
  });
});
```

---

## 4. 微信小游戏适配

### 4.1 平台差异

| 功能 | 原生 Canvas | Cocos Creator 3.8 |
|-----|------------|------------------|
| 画布获取 | `wx.createCanvas()` | 自动处理 |
| 存储 API | `wx.getStorageSync` | `sys.localStorage` |
| 音频 API | `wx.createInnerAudioContext` | `AudioSource` 组件 |
| 分包加载 | 手动实现 | `AssetManager.Bundle` |
| 屏幕适配 | 手动计算 | `Canvas` 组件自适应 |

### 4.2 Cocos 微信小游戏构建

- **构建面板**: 选择 "微信小游戏" 平台
- **AppID**: 配置微信小程序 ID
- **分包配置**: 在 `assets/resources` 中配置
- **远程资源**: 支持资源服务器配置

---

## 5. 性能优化对比

| 优化点 | 当前实现 | Cocos Creator 3.8 |
|-------|---------|------------------|
| 批处理 | 手动合并绘制 | 自动合批(Batch) |
| 图集 | 手动合成精灵图 | 自动图集(Auto Atlas) |
| 对象池 | 自定义实现 | `NodePool` 组件 |
| 渲染剔除 | 无 | 自动视锥剔除 |
| LOD | 无 | `LODGroup` 组件 |

---

## 6. 开发工作流对比

### 当前工作流
1. 代码编辑器编写 JS
2. 微信开发者工具预览
3. 真机调试

### Cocos Creator 工作流
1. Cocos Editor 可视化编辑
2. 场景搭建 + 组件配置
3. 脚本编写(TypeScript)
4. 构建发布到微信小游戏
5. 微信开发者工具预览

---

## 7. 学习建议

### 7.1 优先学习模块
1. **Node + Component** - 核心概念
2. **Sprite + UITransform** - 2D 渲染基础
3. **Animation** - 动画系统
4. **Prefab** - 预制体复用
5. **AssetManager** - 资源管理

### 7.2 迁移策略
1. **渐进式迁移**: 先迁移渲染层，再迁移逻辑层
2. **组件化改造**: 将现有类改造为 Cocos 组件
3. **资源迁移**: 精灵图转换为 SpriteFrame 资源
4. **场景搭建**: 在 Editor 中重建游戏场景

---

## 8. 参考文档

- **API 文档**: https://docs.cocos.com/creator/3.8/api/zh/
- **手册文档**: https://docs.cocos.com/creator/3.8/manual/zh/
- **微信小游戏发布**: https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-wechatgame.html

---

_文档位置: `bomb-wall-canvas/wiki/COCOS_API_STUDY.md`_
_更新日期: 2026-05-18_
