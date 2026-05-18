# Cocos 精灵图动画迁移指南

## 现有资源格式

### 精灵图合图 (sprite.png)
- 多张精灵帧排列在一张大图中
- 使用 index.json 描述每帧的位置和大小

### 索引文件 (index.json)
```json
{
  "frame_size": { "w": 75, "h": 56 },
  "sheet_size": { "w": 450, "h": 280 },
  "frames": [
    { "i": 0, "x": 0, "y": 0, "w": 75, "h": 56, "t": 0 },
    { "i": 1, "x": 75, "y": 0, "w": 75, "h": 56, "t": 0.083 }
  ]
}
```

## Cocos 精灵图动画方案

### 方案一：Sprite Animation Clip（推荐）

在 Cocos Editor 中操作：
1. **导入精灵图**
   - 将 `sprite.png` 放入 `assets/resources/sprites/`
   - Cocos 自动识别为 Texture2D

2. **创建 SpriteFrame**
   - 在 Inspector 中设置 `SpriteFrame`
   - 使用 `Trim` 和 `Size` 裁剪每帧
   - 或使用 `Atlas` 自动图集

3. **创建 Animation Clip**
   - 在节点上添加 `Animation` 组件
   - 创建 `AnimationClip` 资源
   - 添加 `cc.Sprite.spriteFrame` 属性轨道
   - 插入关键帧，每帧对应一个 SpriteFrame

4. **设置播放**
   - `defaultClip` 设置默认动画
   - `playOnLoad` 自动播放
   - 代码控制：`animation.play('clipName')`

### 方案二：程序化 SpriteFrame 切换

使用 `SpriteAnimationHelper` 组件：

```typescript
// 注册动画
const helper = node.getComponent(SpriteAnimationHelper);
helper.registerClip('bomb_idle', spriteFrames);

// 播放动画
helper.play('bomb_idle', { loop: true, fps: 12 });

// 停止动画
helper.stop();
```

### 方案三：SpriteSheetLoader 自动加载

```typescript
const loader = node.getComponent(SpriteSheetLoader);
loader.loadSpriteSheet(
    'resources/sprites/lv1/sprite.png',
    'resources/sprites/lv1/index.json',
    (frames) => {
        console.log('Loaded', frames.length, 'frames');
    }
);
```

## 迁移步骤

### 1. 资源导入
```
assets/resources/sprites/
├── lv1/
│   ├── sprite.png        # 合图
│   ├── index.json        # 帧信息
│   └── lv1.anim          # 生成的动画剪辑
├── lv2/
│   ├── sprite.png
│   ├── index.json
│   └── lv2.anim
└── ...
```

### 2. 创建动画剪辑（编辑器操作）
1. 选择目标节点
2. 添加 `Animation` 组件
3. 创建 `AnimationClip`
4. 添加 `cc.Sprite.spriteFrame` 轨道
5. 按 index.json 中的帧顺序添加关键帧
6. 设置帧间隔（根据 `t` 值计算）

### 3. 代码控制
```typescript
// 获取动画组件
const anim = node.getComponent(Animation);

// 播放
anim.play('bomb_idle');

// 暂停
anim.pause();

// 恢复
anim.resume();

// 停止
anim.stop();

// 设置速度
const state = anim.getState('bomb_idle');
state.speed = 2.0; // 2倍速
```

## 帧率计算

根据 index.json 中的 `t` 值：
- `t` 是时间点（秒）
- 帧间隔 = 当前帧 `t` - 上一帧 `t`
- 示例：`t: 0.083` 表示 83ms 间隔 ≈ 12fps

## 注意事项

1. **Trim 设置**：确保 SpriteFrame 的 trim 正确，避免显示异常
2. **Anchor**：设置合适的锚点，通常是中心点 (0.5, 0.5)
3. **Size Mode**：使用 `CUSTOM` 模式，手动设置大小
4. **Filter**：纹理过滤使用 `LINEAR`，避免像素化

---

_文档位置: assets/wiki/SPRITE_ANIMATION_MIGRATION.md_
