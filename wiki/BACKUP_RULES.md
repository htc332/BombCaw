# 炸弹推墙真机调试血泪教训

## 2026-05-06 重大事故

### 发生了什么
花了3个月建立的炸弹推墙 Canvas 版，因为下午盲目修改导致回到黑屏原点。

### 根本原因
1. **没有备份就开始修改**
2. 在 `game.js` 中意外创建了 Canvas，抢占了主画布位置
3. 修改 `Renderer.js` 时清空了 Canvas 内容
4. 反复添加诊断代码，越改越乱
5. **没有 git 版本控制** — 无法回退

### 必须遵守的流程

#### 修改前
1. ✅ 备份关键文件：`cp file.js file.js.bak.时间戳`
2. ✅ 记录要改什么、为什么改
3. ✅ 一次只改一个文件

#### 修改后
1. ✅ 语法检查：`node --check file.js`
2. ✅ 模拟器测试（开发者工具内）
3. ✅ 确认改动确实解决了目标问题
4. ✅ 才推送到真机

#### 推送前
1. ✅ 备份整个项目或关键文件
2. ✅ 检查 game.js 中没有 `wx.createCanvas()`
3. ✅ 检查 main.js 的 `initCanvas()` 使用了全局 `canvas`
4. ✅ 确认没有意外的 `canvas.width/height` 重置

### 关键代码检查清单

```bash
# 推送前必须检查
grep -n "wx.createCanvas" game.js src/*/*.js
grep -n "canvas.width\s*=" src/view/Renderer.js
grep -n "typeof canvas" src/main.js
```

### 微信小游戏 Canvas 铁律
1. **game.js 绝不能创建 Canvas** — 会抢占主画布
2. **main.js 必须使用全局 `canvas` 变量** — 这是真正的屏幕画布
3. **不要重置已有 Canvas 的 width/height** — 会清空所有绘制内容
4. **Renderer.resize() 要小心** — 只在尺寸真正变化时才重置

### 诊断代码原则
- 不要在 game.js 添加任何 Canvas 诊断
- 使用 `console.log` 代替画面诊断
- 诊断代码要容易移除

---

_记录于 2026-05-06 21:30 — 血的教训，必须遵守！_
