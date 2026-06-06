# 炸弹推墙 · 哞哞大作战 - 项目工程结构文档

> **版本**: v0.5.2  
> **生成时间**: 2026-05-13 10:11 GMT+8  
> **项目路径**: `/Users/htc332/.openclaw/workspace-pioneer/bomb-wall-canvas`  
> **平台**: 微信小游戏（原生 Canvas）  

---

## 一、项目概述

| 属性 | 值 |
|------|-----|
| 游戏名称 | 牛牛炸鼠 |
| 版本号 | v0.5.2 |
| 平台 | 微信小游戏（仅支持，不兼容浏览器） |
| 架构 | 原生 Canvas + ES6 Class |
| 关卡数 | 18关（含测试关） |
| 游戏类型 | 纯单机益智 |
| AppID | `wx14a9f8ce89e44b26` |

**核心玩法**: 放置炸弹牛摧毁墙壁，相邻爆炸触发进化升级，资源有限需策略规划。

---

## 二、目录结构总览

```
bomb-wall-canvas/
│
├── 📄 入口与配置（根目录）
│   ├── game.js              # 微信小游戏启动入口（模块加载 + 日志捕获）
│   ├── game.json            # 小游戏运行时配置（分包、屏幕方向）
│   ├── app.json             # 小程序配置（屏幕方向、超时设置）
│   ├── project.config.json  # 微信开发者工具项目配置
│   ├── index.html           # 浏览器备用入口（非微信环境）
│   └── package.json         # npm 配置（仅 qrcode 开发依赖）
│
├── 📁 src/                  # 核心源代码（~35KB，不含资源）
│   ├── main.js              # 游戏主入口（BombWallGame 类）
│   │
│   ├── 📁 core/             # 游戏逻辑层
│   │   ├── GameLogic.js     # 核心游戏逻辑（炸弹、爆炸、胜负判定）
│   │   └── LevelSystem.js   # 关卡系统（解锁、进度、无尽模式）
│   │
│   ├── 📁 data/             # 数据层
│   │   ├── LevelData.js     # 18关关卡配置（宫本茂式设计）
│   │   ├── Storage.js       # 本地存档封装（wx Storage API）
│   │   ├── Config.js        # 游戏配置中心（单例）
│   │   ├── EnemyConfig.js   # 墙壁/敌人类型配置表
│   │   └── PlayerData.js    # 玩家数据管理（进度、分数、设置）
│   │
│   ├── 📁 view/             # 渲染层
│   │   ├── Renderer.js      # Canvas 渲染器（精灵图、网格、HUD）
│   │   ├── Animator.js      # 动画管理器（爆炸特效、升级光环）
│   │   ├── ParticleSystem.js # 粒子系统（7层架构）
│   │   ├── UIManager.js     # UI 管理器（场景切换）
│   │   └── 📁 components/
│   │       └── Button.js    # 自适应按钮组件
│   │
│   ├── 📁 app/              # 应用层（新架构 - 场景系统）
│   │   ├── GameApp.js       # 游戏应用入口（新架构统一入口）
│   │   ├── SceneManager.js  # 场景管理器（生命周期、切换）
│   │   └── 📁 scenes/
│   │       ├── BaseScene.js      # 场景基类
│   │       ├── LoginScene.js     # 登录/加载场景
│   │       ├── MainMenuScene.js  # 主菜单场景
│   │       ├── GameScene.js      # 游戏场景（复用 BombWallGame）
│   │       ├── LevelSelectScene.js # 关卡选择场景
│   │       ├── ResultScene.js    # 结算场景（通关/失败）
│   │       └── SettingsScene.js  # 设置场景
│   │
│   ├── 📁 system/           # 系统层
│   │   ├── AudioManager.js  # 音效/震动管理（可配置）
│   │   └── AdManager.js     # 激励视频广告（续命功能）
│   │
│   ├── 📁 managers/         # 资源管理
│   │   └── ResourceManager.js # 分包加载、重试机制、进度追踪
│   │
│   └── 📁 utils/            # 工具层
│       ├── Constants.js     # 游戏常量定义
│       ├── EventBus.js      # 事件总线（发布订阅）
│       ├── Helpers.js       # 通用工具函数
│       └── StateMachine.js  # 状态机基类
│
├── 📁 res/                  # 美术资源
│   ├── 📁 characters/       # 角色精灵图
│   │   ├── lv1.png          # 炸弹牛 Lv1
│   │   ├── lv2.png          # 炸弹牛 Lv2
│   │   ├── lv3.png          # 炸弹牛 Lv3
│   │   └── lv4.png          # 炸弹牛 Lv4
│   │
│   ├── 📁 ui/               # UI 资源
│   │   ├── Loading.png      # 加载界面背景
│   │   ├── LoginTitle.png   # 登录标题
│   │   ├── 📁 buttons/      # 按钮素材（SVG）
│   │   ├── 📁 icons/        # 图标素材（SVG）
│   │   ├── 📁 panels/       # 面板素材（SVG）
│   │   └── 📁 numbers/      # 艺术数字 0-9（PNG）
│   │
│   ├── 📁 backgrounds/      # 背景素材（SVG）
│   ├── 📁 sprites/          # 精灵图动画
│   │   └── enemy_n_death/   # 一级鼠死亡动画
│   │       ├── sprite.png   # 精灵图集
│   │       └── index.json   # 帧配置
│   └── colors.css           # 颜色定义（备用）
│
├── 📁 subpackage/           # 微信分包资源（运行时下载）
│   ├── 📁 res/              # 角色/UI资源分包
│   ├── 📁 levels/           # 关卡数据分包
│   └── 📁 audio/            # 音效音乐分包
│
├── 📁 wiki/                 # 项目文档（22个文档）
│   ├── WORKFLOW.md          # 开发工作流程
│   ├── ARCHITECTURE_REFACTOR.md # 架构重构计划
│   ├── LEVEL_DESIGN.md      # 关卡设计文档
│   ├── GAMEPLAY_DESIGN.md   # 玩法设计文档
│   ├── TECHNICAL_DESIGN.md  # 技术设计文档
│   ├── ASSET_ADAPTATION.md  # 精灵图适配方案
│   ├── EVENT_SYSTEM.md      # 事件系统设计
│   ├── CROSS_EXPLOSION_SPEC.md # 十字爆炸特效规范
│   ├── SCORE_IMPLEMENTATION_PLAN.md # 积分系统实现计划
│   ├── EXPLOSION_ANALYSIS.md # 爆炸系统分析
│   ├── ERROR_ANALYSIS.md    # 错误分析
│   ├── INCIDENT_2026_05_07.md # 5.7事故报告
│   ├── REPAIR_PLAN.md       # 修复计划
│   ├── BACKUP_RULES.md      # 备份规则
│   ├── WECHAT_SPEC.md       # 微信小游戏规范
│   ├── LAYOUT_ADJUSTMENT.md # 布局调整记录
│   ├── EFFECTS_ASSET_REQUIREMENTS.md # 特效资源需求
│   ├── SIMPLE_EXPLOSION_DESIGN.md # 极简爆炸设计
│   ├── art-style-reference.md # 美术风格参考
│   └── INCIDENT_FULL_REPORT.md # 完整事故报告
│
├── 📁 scripts/              # 自动化脚本
│   ├── auto-backup.sh       # 自动备份
│   ├── backup-before-push.sh # 推送前备份
│   ├── push-to-device.sh    # 推送到真机
│   ├── save-version.sh      # 保存版本
│   └── version-manager.sh   # 版本管理
│
├── 📁 tools/                # 辅助工具
│   └── auto-push.sh         # 自动推送脚本
│
├── 📁 wiki/           # 经验教训记录
│   ├── ERRORS.md            # 错误记录
│   └── LEARNINGS.md         # 学习记录
│
└── 📄 项目文档（根目录）
    ├── README.md            # 项目说明
    ├── ARCHITECTURE.md      # 架构文档
    ├── PROJECT_STATUS.md    # 项目状态
    ├── DESIGN_INDEX.md      # 设计索引
    ├── HANDOVER.md          # 交接文档
    ├── PLAN.md              # 开发计划
    ├── BUGFIX_REPORT.md     # Bug修复报告
    ├── EFFECTS_TEST.md      # 特效测试
    ├── VERSION_GUIDE.md     # 版本指南
    └── VERSION_INFO.txt     # 版本信息
```

---

## 三、核心模块详解

### 3.1 入口流程

```
微信小游戏启动
    ↓
game.js (模块加载器)
    ├── Console 日志捕获系统
    ├── 按顺序 require 所有模块
    └── 调用 initGame()
        ↓
main.js (BombWallGame 类)
    ├── initCanvas()      # 初始化 Canvas + roundRect polyfill
    ├── initSystems()     # 初始化所有子系统
    ├── initGame()        # 加载资源、启动下载
    ├── bindEvents()      # 绑定触摸事件
    └── startLoop()       # 启动游戏主循环
```

### 3.2 模块加载顺序（game.js）

```javascript
1.  src/data/Storage.js         // 本地存储
2.  src/data/LevelData.js       // 关卡配置
3.  src/data/EnemyConfig.js     // 敌人配置
4.  src/core/GameLogic.js       // 核心逻辑
5.  src/core/LevelSystem.js     // 关卡系统
6.  src/managers/ResourceManager.js // 资源管理
7.  src/system/AudioManager.js  // 音效
8.  src/system/AdManager.js     // 广告
9.  src/view/Animator.js        // 动画
10. src/view/ParticleSystem.js // 粒子
11. src/view/Renderer.js        // 渲染器
12. src/view/UIManager.js       // UI管理
13. src/main.js                 // 游戏主入口
```

### 3.3 核心类关系

```
BombWallGame (main.js)
    ├── GameLogic (core/)
    │   └── 事件回调 → handleGameEvent()
    ├── LevelSystem (core/)
    ├── Renderer (view/)
    ├── Animator (view/)
    ├── ParticleSystem (view/)
    ├── UIManager (view/)
    ├── AudioManager (system/)
    └── AdManager (system/)

新架构（并行存在）:
GameApp (app/)
    ├── SceneManager (app/)
    │   ├── LoginScene
    │   ├── MainMenuScene
    │   ├── GameScene → 复用 BombWallGame
    │   ├── LevelSelectScene
    │   ├── ResultScene
    │   └── SettingsScene
    └── ResourceManager (managers/)
```

### 3.4 全局对象（微信小游戏）

所有模块通过 `GameGlobal` 导出：

```javascript
GameGlobal.Storage         // 本地存储
GameGlobal.LEVELS          // 关卡数据
GameGlobal.ENEMY_TYPES     // 敌人类型
GameGlobal.GameLogic       // 游戏逻辑
GameGlobal.LevelSystem     // 关卡系统
GameGlobal.ResourceManager // 资源管理
GameGlobal.AudioManager    // 音频管理
GameGlobal.AdManager       // 广告管理
GameGlobal.Animator        // 动画
GameGlobal.ParticleSystem  // 粒子
GameGlobal.Renderer        // 渲染器
GameGlobal.UIManager       // UI管理
GameGlobal.Constants       // 常量
GameGlobal.EventBus        // 事件总线
GameGlobal.Helpers         // 工具函数
GameGlobal.StateMachine    // 状态机
GameGlobal.Config          // 配置
GameGlobal.PlayerData      // 玩家数据
GameGlobal.BombWallGame    // 游戏主类
GameGlobal.GameApp         // 应用入口（新架构）
GameGlobal.SceneManager    // 场景管理器
GameGlobal.sceneManager    // 场景管理器单例
GameGlobal.Button          // 按钮组件
// 场景类
GameGlobal.BaseScene
GameGlobal.LoginScene
GameGlobal.MainMenuScene
GameGlobal.GameScene
GameGlobal.LevelSelectScene
GameGlobal.ResultScene
GameGlobal.SettingsScene
```

---

## 四、关键配置文件

### 4.1 game.json（小游戏配置）

```json
{
  "deviceOrientation": "portrait",      // 竖屏
  "showStatusBar": false,               // 隐藏状态栏
  "subpackages": [                      // 分包配置
    { "name": "res", "root": "subpackage/" },
    { "name": "levels", "root": "subpackage/levels/" },
    { "name": "audio", "root": "subpackage/audio/" }
  ],
  "lazyCodeLoading": "requiredComponents"
}
```

### 4.2 project.config.json（开发者工具配置）

```json
{
  "compileType": "game",
  "appid": "wx14a9f8ce89e44b26",
  "projectname": "炸弹推墙",
  "setting": {
    "es6": true,              // 支持 ES6
    "enhance": true,
    "minified": true,         // 代码压缩
    "compileHotReLoad": true  // 热重载
  },
  "libVersion": "3.0.0"       // 基础库版本
}
```

---

## 五、资源文件清单

### 5.1 角色精灵图（res/characters/）

| 文件 | 尺寸 | 说明 |
|------|------|------|
| lv1.png | 256x256 | 炸弹牛 1级（白色） |
| lv2.png | 256x256 | 炸弹牛 2级（蓝色） |
| lv3.png | 256x256 | 炸弹牛 3级（紫色） |
| lv4.png | 256x256 | 炸弹牛 4级（红色） |

### 5.2 UI 资源（res/ui/）

| 目录 | 内容 |
|------|------|
| buttons/ | 按钮素材（SVG）：主按钮、次级按钮、关卡按钮 |
| icons/ | 图标素材（SVG）：返回、炸弹、锁定、设置、星星 |
| panels/ | 面板素材（SVG）：格子网格、顶部面板、底部面板、进度条 |
| numbers/ | 艺术数字 0-9（PNG） |

### 5.3 精灵图动画（res/sprites/）

| 目录 | 内容 |
|------|------|
| enemy_n_death/ | 一级鼠死亡动画（sprite.png + index.json） |

---

## 六、技术特点

### 6.1 架构设计

| 特性 | 实现 |
|------|------|
| 分层架构 | core(逻辑) / view(渲染) / data(数据) / system(系统) / app(场景) |
| 事件通信 | 回调模式（GameLogic.onEvent）+ EventBus 发布订阅 |
| 模块导出 | `GameGlobal.ClassName = ClassName` |
| 单例模式 | ResourceManager、PlayerData、Config、EventBus、SceneManager |

### 6.2 渲染系统

| 特性 | 实现 |
|------|------|
| 渲染器 | 原生 Canvas 2D API |
| 适配方案 | 以 iPhone 6/7/8（375px）为基准，动态计算 scale |
| 安全区 | 适配刘海屏（safeArea.top/bottom） |
| 特效裁剪 | `ctx.clip()` 限制特效在网格区域内 |
| 精灵图 | 支持帧动画（死亡动画） |
| 艺术数字 | 0-9 独立图片资源 |

### 6.3 动画系统

| 特效 | 实现 |
|------|------|
| 十字爆炸 | 中心→四向逐格蔓延，4级颜色区分 |
| 升级光环 | 双环扩散 + 旋转星光 |
| 伤害闪烁 | 白色闪烁反馈 |
| 屏幕震动 | 基于爆炸强度 |
| 死亡动画 | 精灵图帧动画（基于 animTime - startTime） |

### 6.4 粒子系统（7层架构）

| 层级 | 类型 | 混合模式 |
|------|------|----------|
| Layer 0 | 地面焦痕 | Normal |
| Layer 1 | 烟雾背景 | Normal |
| Layer 2 | 上升火星 | Additive |
| Layer 3 | 破片飞溅 | Normal |
| Layer 4 | 核心火球 | Screen |
| Layer 5 | 闪光星点 | Additive |
| Layer 6 | 冲击波环 | Additive |

### 6.5 微信小游戏适配

| 特性 | 处理 |
|------|------|
| roundRect | Polyfill 注入（`Object.getPrototypeOf()` 原型链方式） |
| 全局对象 | 使用 `GameGlobal` 而非 `window` |
| 分包加载 | `wx.loadSubpackage()` 串行加载 |
| 图片加载 | `wx.createImage()` 异步加载 |
| 震动反馈 | `wx.vibrateShort()` 组件化 |
| 存储 | `wx.getStorageSync()` / `wx.setStorageSync()` |
| ES5 兼容 | `var` / `function` / 无模板字符串 |

---

## 七、关卡配置（LevelData.js）

| 关卡 | 网格 | 炸弹 | 核心教学点 |
|------|------|------|-----------|
| 1 | 8x8 | 8 | 测试关：各种爆炸特效 |
| 2 | 5x5 | 4 | 连锁的力量：静态炸弹引爆 |
| 3-18 | 5-8 | 3-8 | 逐步引入新机制 |

---

## 八、开发脚本

| 脚本 | 功能 |
|------|------|
| `scripts/auto-backup.sh` | 自动备份 |
| `scripts/backup-before-push.sh` | 推送前备份 |
| `scripts/push-to-device.sh` | 推送到真机 |
| `scripts/save-version.sh` | 保存版本 |
| `scripts/version-manager.sh` | 版本管理 |
| `tools/auto-push.sh` | 自动推送 |

---

## 九、项目文档索引

| 文档 | 内容 |
|------|------|
| `wiki/WORKFLOW.md` | 开发工作流程（14步标准流程） |
| `wiki/LEVEL_DESIGN.md` | 18关关卡设计（宫本茂式教学） |
| `wiki/TECHNICAL_DESIGN.md` | 技术架构设计 |
| `wiki/ASSET_ADAPTATION.md` | 精灵图适配方案（最大内容边统一） |
| `wiki/EVENT_SYSTEM.md` | 事件回调模式设计 |
| `wiki/CROSS_EXPLOSION_SPEC.md` | 十字爆炸特效规范 |
| `wiki/SCORE_IMPLEMENTATION_PLAN.md` | 积分系统实现计划 |
| `wiki/INCIDENT_2026_05_07.md` | 5.7生产事故报告 |
| `wiki/BACKUP_RULES.md` | Git 备份规则（四步铁律） |
| `wiki/WECHAT_SPEC.md` | 微信小游戏开发规范 |

---

## 十、版本历史

| 版本 | 日期 | 关键更新 |
|------|------|----------|
| v0.5.2 | 2026-05-13 | 当前版本，积分系统开发中 |
| v0.5.1 | 2026-05-12 | 一级鼠死亡动画集成 |
| v0.5.0 | 2026-05-11 | 爆炸特效边界限制（clip） |
| v0.4.x | 2026-05-07 | 基础功能恢复，真机调试成功 |
| v0.3.x | 2026-04-09 | Canvas 重写版，18关完成 |
| v0.1.x | 2026-03-04 | 项目启动 |

---

*本文档由工程遍历自动生成，反映当前代码状态。*
