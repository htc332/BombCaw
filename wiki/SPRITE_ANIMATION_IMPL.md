# Cocos Creator 精灵图动画实现方案

> 版本: v1.0 | 2026-05-19
> 目标: 在不改变原有资源规格的情况下，完成精灵图动画移植

---

## 一、现有资源规格分析

### 1.1 精灵图格式

**文件结构**:
```
sprites/lv1/
├── sprite.png      # 合图 (450x280)
└── index.json      # 帧索引
```

**index.json 格式**:
```json
{
  "version": "1.0",
  "frame_size": { "w": 75, "h": 56 },    // 单帧尺寸
  "sheet_size": { "w": 450, "h": 280 },  // 合图尺寸
  "frames": [
    { "i": 0, "x": 0, "y": 0, "w": 75, "h": 56, "t": 0 },      // 第0帧
    { "i": 1, "x": 75, "y": 0, "w": 75, "h": 56, "t": 0.083 }, // 第1帧，时间点
    ...
  ]
}
```

**关键参数**:
- 帧尺寸: 75x56 (所有等级统一)
- 合图尺寸: 450x280 (6列 x 5行 = 30帧)
- 时间戳 `t`: 相对时间（秒），用于计算帧率

### 1.2 资源清单

| 资源 | 类型 | 帧数 | 用途 |
|------|------|------|------|
| lv1-lv4 | 动态炸弹 | 30 | 4级炸弹待机动画 |
| enemy_n | 普通鼠 | 循环 | 墙壁待机动画 |
| enemy_n_death | 死亡 | 12 | 普通鼠死亡 |
| enemy_elite | 精英鼠 | 循环 | 精英鼠满血待机 |
| enemy_elite_break | 破损过渡 | ~15 | 头盔破损动画 |
| enemy_elite_break_idle | 破损待机 | 循环 | 破损后待机 |
| enemy_elite_death | 死亡 | ~10 | 精英鼠死亡 |
| static_bombs/Sleep | 静态 | 1 | 静态炸弹睡眠状态 |

---

## 二、Cocos Creator 精灵图动画支持

### 2.1 官方支持方式

Cocos Creator 3.8 提供三种精灵图动画方案：

#### 方案A: SpriteFrame 动画剪辑 (AnimationClip)
- **适用**: 简单循环动画（如待机）
- **优点**: 可视化编辑，性能优化
- **缺点**: 需要为每个动画创建资源文件
- **实现**: 在编辑器中创建 AnimationClip，绑定 SpriteFrame 关键帧

#### 方案B: 程序化 SpriteFrame 切换 (代码驱动)
- **适用**: 复杂逻辑动画（如倒计时驱动）
- **优点**: 灵活控制，兼容现有逻辑
- **缺点**: 需要手动管理帧切换
- **实现**: 在 update() 中根据时间/状态切换 sprite.spriteFrame

#### 方案C: SpriteAtlas + Animation
- **适用**: 大量精灵图管理
- **优点**: 自动图集，内存优化
- **缺点**: 需要预处理资源
- **实现**: 使用 Auto Atlas 合并精灵图

### 2.2 推荐方案: B + A 混合

**核心动画**（炸弹倒计时、状态切换）→ **方案B 程序化**
- 原因: 需要与游戏逻辑同步（倒计时、爆炸触发）
- 实现: SpriteAnimationHelper 已提供

**辅助动画**（待机、死亡）→ **方案A AnimationClip**
- 原因: 固定循环，不需要逻辑干预
- 实现: 在编辑器中创建剪辑

---

## 三、移植策略（不改变资源规格）

### 3.1 核心原则

1. **保留现有文件结构**: sprite.png + index.json 不变
2. **复用现有解析逻辑**: index.json 格式不变
3. **运行时转换**: 在 Cocos 中动态创建 SpriteFrame
4. **零修改资源**: 不重新打包、不修改尺寸

### 3.2 实现步骤

#### 步骤1: 加载精灵图纹理
```typescript
// 使用 assetManager 加载 sprite.png
assetManager.loadRemote("resources/sprites/lv1/sprite.png", (err, texture) => {
    // texture 为 SpriteFrame 可用的 Texture2D
});
```

#### 步骤2: 解析 index.json
```typescript
// 读取现有 index.json（格式不变）
const indexData = await fetch("resources/sprites/lv1/index.json").then(r => r.json());
// 包含 frames 数组，每个帧有 x, y, w, h, t
```

#### 步骤3: 动态创建 SpriteFrame
```typescript
// 为每一帧创建 SpriteFrame
const spriteFrames = indexData.frames.map(frame => {
    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    spriteFrame.rect = new Rect(frame.x, frame.y, frame.w, frame.h);
    spriteFrame.originalSize = new Size(frame.w, frame.h);
    // 关键: 不设置 Trim，保持原始尺寸
    // 关键: Anchor 使用默认 (0.5, 0.5)
    return spriteFrame;
});
```

#### 步骤4: 注册到动画系统
```typescript
// 使用已有的 SpriteAnimationHelper
const animHelper = node.getComponent(SpriteAnimationHelper);
animHelper.registerClip("lv1_idle", spriteFrames);
animHelper.play("lv1_idle", { loop: true, fps: 12 });
```

---

## 四、Cocos 特定配置

### 4.1 SpriteFrame 配置

| 属性 | 值 | 说明 |
|------|-----|------|
| Trim | false | 保持原始尺寸，不裁剪 |
| Anchor | (0.5, 0.5) | 中心锚点 |
| Filter | LINEAR | 线性过滤，保持平滑 |
| WrapMode | CLAMP | 边缘拉伸 |

### 4.2 纹理配置

```typescript
// 设置纹理过滤
const texture = assetManager.get("resources/sprites/lv1/sprite.png");
texture.setFilters(Texture2D.Filter.LINEAR, Texture2D.Filter.LINEAR);
```

### 4.3 Sprite 组件配置

```typescript
// 节点上的 Sprite 组件
const sprite = node.getComponent(Sprite);
sprite.sizeMode = Sprite.SizeMode.CUSTOM;  // 自定义尺寸
sprite.trim = false;  // 不裁剪
```

---

## 五、批量迁移计划

### 5.1 迁移顺序

1. **lv1-lv4 动态炸弹**（核心资源，优先）
2. **enemy_n 普通鼠**（基础墙壁）
3. **enemy_n_death 死亡**（特效）
4. **enemy_elite 系列**（精英鼠）
5. **static_bombs**（静态炸弹）

### 5.2 自动化脚本

```typescript
// 批量加载所有精灵图
const spriteSheets = [
    { name: "lv1", path: "resources/sprites/lv1" },
    { name: "lv2", path: "resources/sprites/lv2" },
    { name: "lv3", path: "resources/sprites/lv3" },
    { name: "lv4", path: "resources/sprites/lv4" },
    { name: "enemy_n", path: "resources/sprites/enemy_n" },
    // ...
];

// 自动注册到 SpriteAnimationHelper
spriteSheets.forEach(sheet => {
    loader.loadSpriteSheet(
        `${sheet.path}/sprite.png`,
        `${sheet.path}/index.json`,
        (frames) => {
            console.log(`[Migrate] ${sheet.name}: ${frames.length} frames`);
        }
    );
});
```

---

## 六、性能优化

### 6.1 对象池

```typescript
// 炸弹节点对象池
const bombPool = new NodePool("Bomb");

// 爆炸时回收
bombPool.put(bombNode);

// 放置时复用
const bombNode = bombPool.get();
```

### 6.2 纹理压缩

```typescript
// 启用压缩纹理（构建时）
// 微信小游戏支持: ETC2, ASTC, PVRTC
```

### 6.3 合批渲染

```typescript
// 相同纹理的 Sprite 自动合批
// 确保使用同一 sprite.png 的节点在同一层
```

---

## 七、验证清单

- [ ] lv1 动画正常播放（30帧，循环）
- [ ] lv2 动画正常播放（帧率正确）
- [ ] lv3 动画正常播放
- [ ] lv4 动画正常播放
- [ ] enemy_n 待机动画循环
- [ ] enemy_n_death 死亡动画一次播放
- [ ] enemy_elite 状态切换正常
- [ ] static_bombs Sleep 状态显示
- [ ] 所有精灵图无变形、无裁剪异常
- [ ] 真机测试通过

---

_文档位置: `cocos-projects/bomb-wall/wiki/SPRITE_ANIMATION_IMPL.md`_
_更新日期: 2026-05-19_
