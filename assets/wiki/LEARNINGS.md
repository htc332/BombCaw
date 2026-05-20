# 开发经验教训 - 2026-05-07

## 🎉 今日核心突破

### 炸弹动画正确方案（最终版）
**错误思路**：
- 每个炸弹独立 `animTime`，用 `dt` 累加
- 使用 `%` 取模循环播放
- 复杂的帧时间计算

**正确思路**：
- 动画与逻辑绑定：根据 `countdown` 进度计算帧
- 简单直接：`progress = 1 - countdown / 90`
- 帧索引：`Math.floor(progress * totalFrames)`
- 到最后一帧停止，等待爆炸销毁

**正确代码**：
```javascript
// 根据倒计时进度播放动画
const progress = 1 - (bomb.countdown || 0) / 90; // 0~1
const frameIdx = Math.min(Math.floor(progress * totalFrames), totalFrames - 1);
```

### 关键教训
1. **不要把动画和渲染时间混为一谈**
   - 动画进度应该跟随游戏逻辑（倒计时）
   - 不是独立的 `animTime` 累加

2. **简单方案往往最好**
   - 不需要复杂的 `dt` 计算
   - 不需要 `animSpeed` 随机化
   - 直接根据逻辑状态计算视觉表现

3. **独立实例 ≠ 独立时间**
   - 每个炸弹是独立实例
   - 但动画进度由统一的 `countdown` 驱动
   - 视觉表现跟随逻辑状态

## 📋 当前配置记录

### 缩放比例
| 元素 | 比例 |
|------|------|
| 老鼠墙 | 1.0 |
| 牛牛炸弹 | 1.5 |

### 倒计时
- 牛牛炸弹：90帧（1.5秒 @ 60fps）

### 爆炸范围
- Lv.0：十字1格
- Lv.1：十字2格
- Lv.2：十字3格

## 🔧 工作流程改进

### 真机调试流程
1. 开发工具测试基本功能
2. 推送到真机
3. 发现问题 → 简化思路 → 修复 → 重新推送
4. 不要过度复杂化

### 动画系统开发
1. 先确定动画和逻辑的绑定关系
2. 简单的进度计算优于复杂的时间系统
3. 每个实例独立，但跟随统一逻辑

## 📝 代码规范

### 炸弹动画模板
```javascript
// 正确：动画跟随逻辑状态
drawAnimatedBomb(bomb) {
  const progress = 1 - (bomb.countdown || 0) / totalCountdown;
  const frameIdx = Math.min(
    Math.floor(progress * totalFrames), 
    totalFrames - 1
  );
  // 绘制当前帧
}
```

### 避免过度设计
```javascript
// ❌ 错误：过度复杂
bomb.animTime = (bomb.animTime || 0) + dt * animSpeed;
const currentTime = bomb.animTime % animDuration;

// ✅ 正确：简单直接
const progress = 1 - bomb.countdown / 90;
const frameIdx = Math.floor(progress * totalFrames);
```

## 🎯 下次注意

1. **动画问题先想逻辑绑定**，不要立即想到时间系统
2. **简单方案优先**，复杂方案容易出错
3. **真机测试要快速迭代**，不要堆积调试代码
4. **版本备份要及时**，稳定版本打标签

## 📚 历史版本

| 版本 | 状态 | 说明 |
|------|------|------|
| v0.5.2 | 稳定 | 基础功能完整 |
| v0.5.3-debug | 调试 | 动画问题排查 |
| **v0.5.3-stable** | **稳定** | **炸弹动画正确** |

---

_记录时间: 2026-05-07 23:14_
_记录人: Pioneer_
_关键突破: 动画跟随逻辑进度，简化设计_
