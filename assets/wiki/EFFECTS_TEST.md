# 粒子特效系统测试指南

## 修改内容

### 1. 坐标修复 (main.js)
- 新增 `toScreen()` 统一坐标转换
- 新增 `getEvolutionColor()` 进化等级颜色
- 修复 `onBombExploded` - 网格坐标→屏幕坐标
- 修复 `onStaticBombExploded` - 网格坐标→屏幕坐标
- 修复 `onWallDestroyed` - 启用 `createWallBurst`
- 新增 `onBombUpgraded` - 启用 `createUpgrade`

### 2. 渲染分层 (main.js)
```
Layer 1: renderer.render() - 游戏世界
Layer 2: particles.drawBackground() - 烟雾
Layer 3: animator.draw() - 冲击波
Layer 4: particles.drawForeground() - 火花 (Additive)
Layer 5: UI
```

### 3. 全新 ParticleSystem.js
- 分层粒子系统（背景/前景）
- Additive 混合发光效果
- 四种特效：爆炸、墙壁破碎、升级、闪光

## 测试步骤

### 模拟器测试
1. 微信开发者工具打开项目
2. 点击编译
3. 放置炸弹，观察：
   - ✅ 橙黄色火花从炸弹位置爆发
   - ✅ 白色闪光中心
   - ✅ 灰色烟雾上升
   - ✅ 冲击波环扩散

### 真机测试
1. 点击「预览」→「自动预览」→「编译并预览」
2. 手机查看：
   - ✅ 爆炸位置正确（不在左上角）
   - ✅ 不同等级炸弹颜色不同（橙/蓝/紫/红）
   - ✅ 墙壁破坏有碎片飞散
   - ✅ 炸弹升级有上升粒子

### 性能检查
- 连击爆炸时是否卡顿
- 粒子数量是否过多（调低 `maxFgParticles`）

## 常见问题

**Q: 爆炸还是看不到？**
A: 检查 `toScreen()` 是否返回正确坐标，应在屏幕中心区域（几百像素）

**Q: 火花颜色不对？**
A: 检查 `getEvolutionColor()` 返回的颜色值

**Q: 烟雾遮挡角色？**
A: 检查渲染顺序，`drawBackground()` 必须在 `renderer.render()` 之后

## 调参指南

编辑 `src/view/ParticleSystem.js`：

```javascript
// 粒子数量（性能敏感）
counts = [15, 25, 35, 50]; // Lv0~3 火花数量

// 生命周期（视觉效果）
life: 0.4 + Math.random() * 0.3; // 火花存活时间

// 速度（爆发感）
speed: 40 + Math.random() * 160; // 火花初始速度

// 重力（下落/上升）
gravity: 40;  // 正值下落，负值上升
```
