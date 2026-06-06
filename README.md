# 炸弹推墙 - 微信小游戏

**纯单机益智游戏 | 仅支持微信小游戏平台**

## 项目结构

```
bomb-wall-canvas/
├── index.html              # 游戏入口
├── game.js                 # 微信小游戏启动入口
├── game.json               # 小游戏配置
├── project.config.json     # 微信开发者工具配置
├── src/
│   ├── core/
│   │   ├── GameLogic.js    # 核心游戏逻辑
│   │   └── LevelSystem.js  # 关卡系统
│   ├── data/
│   │   ├── LevelData.js    # 18关配置
│   │   └── Storage.js      # 本地存档
│   ├── view/
│   │   ├── Renderer.js     # Canvas 渲染
│   │   ├── Animator.js     # 动画管理
│   │   ├── ParticleSystem.js # 粒子系统
│   │   └── UIManager.js    # UI 界面
│   └── system/
│       ├── AudioManager.js # 音效/背景音乐
│       └── AdManager.js    # 激励视频广告
└── images/                 # 美术资源（可选）
```

**总大小：~35KB**（不含图片）

## 特点

1. **原生 Canvas**：不依赖任何游戏引擎
2. **微信专用**：直接使用微信小游戏 API（不兼容浏览器）
3. **纯单机**：无需联网，无排行榜，无社交功能
4. **18个关卡**：完整关卡设计
5. **核心机制**：
   - 炸弹放置与倒计时
   - 进化机制（相邻增强）
   - 静态炸弹（被引爆后升级激活）
   - 炸弹墙（黄色返还、红色连锁）
   - 加固墙（需2次爆炸）
   - 本地存档系统

## 使用方法

### 微信开发者工具
1. 打开微信开发者工具
2. 选择 "导入项目"
3. 选择 `bomb-wall-canvas` 目录
4. AppID 使用 `wx14a9f8ce89e44b26`
5. 点击 "预览" 或 "真机调试"

### 调试
- Console 查看日志
- 真机测试：开发者工具 → 真机调试

## 明确不做

- ❌ 排行榜 - 纯单机游戏
- ❌ 好友对战 - 无需社交功能
- ❌ 浏览器版本 - 仅微信小游戏平台
- ❌ 联网功能 - 完全离线可玩

## 待完善

- [ ] 音效系统（wx.createInnerAudioContext）
- [ ] 更多粒子特效
- [ ] 分享功能（wx.shareAppMessage）

## 技术栈

- 原生 Canvas API
- 微信小游戏 API
- ES6 Class
- 分层架构：core / view / data / system
