# 十字格蔓延爆炸特效技术方案 V3

## 一、核心概念

**十字格蔓延**：爆炸不是瞬间全范围生效，而是从中心点开始，沿上下左右四个方向逐格蔓延，每格有独立的生成、燃烧、消散生命周期。

## 二、数据结构

### 2.1 十字爆炸结果

```javascript
CrossExplosionResult {
  center: { x, y },           // 中心网格坐标
  arms: [                      // 四个臂，每个臂独立蔓延
    {
      direction: 'up',         // up | down | left | right
      cells: [
        { x, y, distance, index }  // distance: 距中心距离
      ]
    }
  ],
  maxDistance: number          // 单臂最大长度
}
```

### 2.2 单个火焰格子状态

```javascript
FireCell {
  x, y,                      // 网格坐标
  distance,                  // 距中心距离（决定生成顺序）
  arm: 'up' | 'down' | 'left' | 'right',
  
  // 时间状态
  spawnTime: number,         // 应该生成的时间点
  actualSpawnTime: number,    // 实际生成时间
  burnEndTime: number,       // 燃烧结束时间
  fadeEndTime: number,       // 消散结束时间
  
  // 视觉状态
  phase: 'hidden' | 'spawning' | 'burning' | 'fading' | 'finished',
  scale: number,             // 当前缩放
  intensity: number,        // 当前亮度 0~1
  alpha: number,             // 当前透明度
  
  // 动画参数
  pulsePhase: number,       // 脉动相位
  pulseSpeed: number,        // 脉动频率
}
```

## 三、蔓延算法（严谨详细）

### 3.1 算法输入输出

```
输入：
  centerX: number    // 中心X坐标
  centerY: number    // 中心Y坐标
  power: number      // 单臂蔓延格数（evo + 1）

输出：
  CrossExplosionResult  // 包含四个臂的格子数据
```

### 3.2 算法步骤

```
步骤1: 初始化结果对象
  result = {
    center: { x: centerX, y: centerY },
    arms: [],
    maxDistance: power
  }

步骤2: 定义四个方向
  directions = [
    { name: 'up',    dx: 0,  dy: -1 },
    { name: 'down',  dx: 0,  dy: 1 },
    { name: 'left',  dx: -1, dy: 0 },
    { name: 'right', dx: 1,  dy: 0 }
  ]

步骤3: 对每个方向生成臂
  for each dir in directions:
    arm = { direction: dir.name, cells: [] }
    
    for d = 1 to power:
      cell = {
        x: centerX + dir.dx * d,
        y: centerY + dir.dy * d,
        distance: d,
        index: d - 1
      }
      arm.cells.push(cell)
    
    result.arms.push(arm)

步骤4: 返回结果
  return result
```

### 3.3 时间轴计算

```
给定参数：
  spreadInterval = 60ms    // 每格蔓延间隔
  burnDuration = 800ms     // 燃烧持续时间
  fadeInterval = 60ms      // 消散间隔

格子 (distance = d) 的时间线：
  spawnTime = d * spreadInterval
  burnStartTime = spawnTime + 100ms（生成动画完成）
  burnEndTime = burnStartTime + burnDuration
  fadeStartTime = burnEndTime
  fadeEndTime = fadeStartTime + (maxDistance - d + 1) * fadeInterval

示例（power=3, maxDistance=3）：
  中心格 (d=0):
    spawn = 0ms, burn = 100~900ms, fade = 900~1140ms
  
  第1格 (d=1):
    spawn = 60ms, burn = 160~960ms, fade = 960~1140ms
  
  第3格 (d=3):
    spawn = 180ms, burn = 280~1080ms, fade = 1080~1140ms
```

### 3.4 状态机

```
状态转换：
  hidden --(t >= spawnTime)--> spawning
  spawning --(t >= burnStartTime)--> burning
  burning --(t >= burnEndTime)--> fading
  fading --(t >= fadeEndTime)--> finished

每个状态视觉表现：
  hidden:     不可见
  spawning:   从0放大到1（弹性动画）
  burning:    稳定燃烧，轻微脉动
  fading:     颜色变暗，透明度降低，大小收缩
  finished:   完全消失，可回收
```

## 四、十字格绘制（详细）

### 4.1 绘制层次（每格）

```
从内到外：
1. 内芯高光
2. 主体色块
3. 外环/描边
4. 特殊效果（末端闪烁、中段亮条）
```

### 4.2 中心格（distance = 0）

```
颜色层次：
- 描边:     #5A0A00, 2px
- 外环:     #E63900 (Alpha 100%)
- 中间层:   #FF9500 (Alpha 90%)
- 内芯:     #FFF5BA (Alpha 80%)

绘制步骤：
1. 填充外环（圆角矩形）
2. 填充中间层（稍小圆角矩形）
3. 填充内芯（圆形高光）
4. 绘制描边

动画：
- 脉动: 内芯亮度 ±10%, 频率 3Hz
- 生成: 0→1.2→1 弹性缩放
```

### 4.3 中段格（0 < distance < maxDistance）

```
颜色层次：
- 描边:     #5A0A00, 2px
- 主体:     #FFAA33 (Alpha 85%)
- 内芯亮条: #FFE66D (Alpha 70%)

绘制步骤：
1. 填充主体（圆角矩形，沿臂方向稍长）
2. 绘制内芯亮条（矩形，沿臂方向）
3. 绘制描边

特殊效果：
- 亮条旋转: 沿臂方向 ±3°摆动
- 连接高光: 与相邻格子连接处更亮

动画：
- 脉动: 主体亮度 ±5%, 频率 4Hz
- 生成: 0→1 线性缩放
```

### 4.4 末端格（distance = maxDistance）

```
颜色层次：
- 描边:     #5A0A00, 3px（更粗）
- 外环:     #FF2200 (Alpha 100%)
- 爆心:     #FF2200 → #FFFFFF 渐变
- 闪烁白点: #FFFFFF (Alpha 100%)

绘制步骤：
1. 填充外环（圆形，最红）
2. 填充爆心（圆形，中心白边缘红）
3. 绘制闪烁白点（小圆，高频闪烁）
4. 绘制描边（粗线）

特殊效果：
- 闪烁白点: 10Hz 频率，亮度 0.5~1.0
- 边缘发光: 向外扩散的红色光晕

动画：
- 闪烁: 白点亮度快速变化
- 生成: 0→1.1→1 弹性缩放（比中心更弹）
```

### 4.5 消散阶段（所有格子）

```
颜色变化：
- 主体向 #6B3A2A 转变
- 内芯变暗
- 描边变细

透明度变化：
- 从 100% → 0%
- 非线性: 前慢后快

大小变化：
- 从 100% → 70%
- 中心先缩，末端后缩

烟雾残迹：
- 仅在中心格消散后出现
- 颜色: #888888, Alpha 40%
- 缓慢上升扩散
```

## 五、粒子系统（7层架构）

### 5.1 粒子分层

```
Layer 0: 地面焦痕 (ScorchMark)
  - 类型: scorch
  - 混合: Normal
  - 生命周期: 2500ms（半永久）
  - 数量: 1个/爆炸

Layer 1: 烟雾背景 (SmokeBG)
  - 类型: smoke
  - 混合: Normal
  - 生命周期: 1500ms
  - 数量: 15-25个/爆炸

Layer 2: 上升火星 (RisingEmbers)
  - 类型: ember
  - 混合: Additive
  - 生命周期: 800-1200ms
  - 数量: 20-40个/爆炸

Layer 3: 破片飞溅 (Debris)
  - 类型: debris
  - 混合: Normal
  - 生命周期: 500-800ms
  - 数量: 10-20个/爆炸

Layer 4: 核心火球 (Fireball)
  - 类型: fireball
  - 混合: Screen
  - 生命周期: 600-1000ms
  - 数量: 3-5个/爆炸（多层）

Layer 5: 闪光星点 (Sparkles)
  - 类型: sparkle
  - 混合: Additive
  - 生命周期: 300-600ms
  - 数量: 30-60个/爆炸

Layer 6: 冲击波环 (Shockwave)
  - 类型: shockwave
  - 混合: Additive
  - 生命周期: 400-600ms
  - 数量: 1-2个/爆炸
```

### 5.2 粒子发射时序

```
T+0ms (explode触发):
  ├─→ 核心火球 ×1 (Layer 4)
  ├─→ 冲击波环 ×1 (Layer 6)
  ├─→ 闪光星点 ×20 (Layer 5)
  └─→ 地面焦痕 ×1 (Layer 0)

T+50ms:
  └─→ 破片飞溅 ×15 (Layer 3)

T+100ms:
  ├─→ 上升火星 ×15 (Layer 2)
  └─→ 烟雾背景 ×10 (Layer 1)

T+200ms:
  └─→ 烟雾背景 ×10 (Layer 1)

T+300ms (蔓延完成):
  ├─→ 核心火球减弱
  └─→ 闪光星点减少
```

## 六、渲染流程

```
每帧渲染：

1. 清空画布

2. 绘制背景层
   - 网格
   - 墙壁

3. 绘制十字火焰（主视觉）
   for each arm in arms:
     for each cell in arm.cells (reverse order):
       // 从末端向中心绘制，确保中心在上层
       drawCell(cell)

4. 绘制粒子辅助
   - 冲击波环（Additive）
   - 中心闪光（Additive）
   - 火星飞溅（Additive）
   - 上升烟雾（Normal）

5. 绘制UI层
```

## 七、关键参数

| 参数 | 值 | 说明 |
|-----|-----|------|
| `spreadInterval` | 60ms | 蔓延间隔 |
| `burnDuration` | 800ms | 燃烧时间 |
| `fadeInterval` | 60ms | 消散间隔 |
| `spawnAnimDuration` | 100ms | 生成动画时间 |
| `pulseSpeed` | 3-5Hz | 脉动频率 |
| `centerScale` | 1.0 | 中心格大小 |
| `midScale` | 0.95 | 中段格大小 |
| `endScale` | 1.05 | 末端格大小（稍大） |

## 八、与现有工程整合

### 8.1 修改文件

| 文件 | 修改 | 说明 |
|-----|------|------|
| `GameLogic.js` | `getExplosionRange` 增加 `distance` | 用于蔓延顺序 |
| `Animator.js` | 新增 `CrossExplosion` 类 | 核心实现 |
| `Animator.js` | 重写 `createExplosion` | 调用 CrossExplosion |
| `ParticleSystem.js` | 7层粒子系统 | 辅助特效 |
| `main.js` | 删除 `startScreenShake` | 无震屏 |
| `main.js` | 调整 `onBombExploded` | 调用新系统 |

### 8.2 调用关系

```
main.onBombExploded(event)
  │
  ├─→ audio.play('explosion') ────────→ 即时音效
  │
  ├─→ animator.createCrossExplosion(...) ──→ 十字火焰
  │   │
  │   ├─→ calculateCross(center, power) ──→ 计算十字范围
  │   ├─→ update(dt) ───────────────────→ 每帧更新各格状态
  │   └─→ draw(ctx) ────────────────────→ 每帧绘制各格
  │
  └─→ particles.createExplosion(...) ────→ 7层粒子辅助
```

## 九、性能预算

| 项目 | 数量 | 性能影响 |
|-----|------|---------|
| 火焰格子 | 1 + 4×power (最大13格) | 低（纯色矩形）|
| 粒子总数 | 80-150个/爆炸 | 中（需控制上限）|
| 混合模式切换 | 3-4次/帧 | 低 |
| DrawCall | 5-8个/爆炸 | 中 |

**优化策略**：
1. 粒子数量上限：100个/爆炸
2. 同屏爆炸上限：3个
3. 超出上限时：优先保留核心火球和冲击波，减少火星和烟雾

---

_方案版本: V3 | 2026-05-09_