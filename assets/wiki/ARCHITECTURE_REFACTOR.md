# 牛牛炸鼠工程重构计划

## 目标
在不破坏现有功能的前提下，建立支持未来10个模块扩展的工程架构。

## 当前问题诊断

| 问题 | 现状 | 影响 |
|------|------|------|
| main.js 687行 | 游戏主入口过于臃肿 | 难以维护，新功能无处安放 |
| Renderer.js 1205行 | 渲染器职责过重 | 绘图、UI、特效混在一起 |
| 缺乏场景管理 | 状态用字符串控制 | 无法优雅切换登录/主菜单/游戏/结算 |
| 缺乏事件系统 | 模块间直接调用 | 耦合严重，难以扩展 |
| Storage太简单 | 只有KV存储 | 无法支持玩家数据、关卡进度、排行榜等 |
| 资源加载分散 | 各模块自行加载 | 无法统一管理、分包、预加载 |

## 新架构设计

```
src/
├── app/
│   ├── SceneManager.js      # 场景管理器：登录、主菜单、游戏、结算
│   ├── GameApp.js           # 应用入口（替代当前 main.js）
│   └── scenes/
│       ├── BaseScene.js     # 场景基类
│       ├── LoginScene.js    # 登录/加载场景
│       ├── MainMenuScene.js # 主菜单场景
│       ├── GameScene.js     # 游戏场景（核心玩法）
│       ├── LevelSelectScene.js # 关卡选择
│       ├── ResultScene.js   # 通关/失败结算
│       └── SettingsScene.js # 设置界面
├── core/
│   ├── GameLogic.js         # 游戏逻辑（精简，只保留玩法规则）
│   └── LevelSystem.js       # 关卡系统（支持100关配置）
├── data/
│   ├── Config.js            # 游戏配置中心
│   ├── LevelData.js         # 关卡配置表（保持现有）
│   ├── PlayerData.js        # 玩家数据管理（进度、分数、设置）
│   └── Storage.js           # 底层存储（保持现有）
├── managers/
│   ├── EventBus.js          # 事件总线（模块间解耦通信）
│   ├── ResourceManager.js   # 资源管理（加载、分包、缓存）
│   ├── AudioManager.js      # 音频管理（从 system 迁移）
│   └── AdManager.js        # 广告管理（从 system 迁移）
├── view/
│   ├── Renderer.js          # 精简：只负责网格和元素绘制
│   ├── GameRenderer.js      # 游戏场景专用渲染
│   ├── UIRenderer.js        # UI渲染（数字、血条、按钮）
│   ├── Animator.js          # 动画系统（保持现有）
│   ├── ParticleSystem.js    # 粒子系统（保持现有）
│   └── components/          # 可复用UI组件
│       ├── NumberDisplay.js # 艺术数字显示
│       ├── ProgressBar.js   # 进度条
│       └── Button.js        # 按钮组件
├── utils/
│   ├── Constants.js         # 常量定义
│   ├── Helpers.js           # 工具函数
│   └── StateMachine.js      # 状态机基类
└── workers/                 # 分包Worker（预留）
    └── asset-loader.js
```

## 关键设计原则

### 1. 场景管理器 (SceneManager)
- 管理场景生命周期：init -> load -> enter -> update -> exit -> destroy
- 支持场景栈（可返回上一场景）
- 场景间通过 EventBus 通信

### 2. 事件总线 (EventBus)
```javascript
// 发布订阅模式
EventBus.on('level.complete', (data) => { ... });
EventBus.emit('level.complete', { level: 1, score: 100 });
```

### 3. 玩家数据 (PlayerData)
```javascript
// 支持的数据
- userInfo: 微信用户信息
- progress: { currentLevel, unlockedLevel, levelScores: {} }
- settings: { sound, music, vibrate }
- stats: { totalPlayTime, totalScore, bestChain }
```

### 4. 资源管理器 (ResourceManager)
```javascript
// 分包策略
- core: 核心代码
- ui: UI图片、艺术数字
- spine: 精灵图动画
- sfx: 音效
- bgm: 背景音乐

// 加载策略
- 预加载：登录场景加载核心资源
- 按需加载：游戏场景加载关卡资源
- 内存管理：场景退出时释放非必要资源
```

## 重构步骤

### Phase 1: 基础设施（今天完成）
1. ✅ 创建目录结构
2. ✅ 实现 EventBus
3. ✅ 实现 StateMachine
4. ✅ 实现 Constants
5. ✅ 实现 Helpers

### Phase 2: 管理层（今天完成）
1. ✅ 实现 ResourceManager
2. ✅ 实现 PlayerData
3. ✅ 实现 Config
4. ✅ 迁移 AudioManager -> managers/
5. ✅ 迁移 AdManager -> managers/

### Phase 3: 场景层（今天完成）
1. ✅ 实现 BaseScene
2. ✅ 实现 SceneManager
3. ✅ 实现 GameScene（迁移现有 main.js 逻辑）
4. ✅ 实现 LoginScene
5. ✅ 实现 GameApp（新入口）

### Phase 4: 视图层（今天完成）
1. ✅ 拆分 Renderer -> GameRenderer + UIRenderer
2. ✅ 实现 NumberDisplay 组件
3. ✅ 实现 ProgressBar 组件

### Phase 5: 兼容与验证
1. ✅ 保持 game.js 入口不变
2. ✅ 逐步切换
3. ✅ 功能验证

## 未来模块预留接口

| 未来模块 | 预留位置 | 接口 |
|---------|---------|------|
| 登录加载界面 | app/scenes/LoginScene.js | ✅ |
| 主界面 | app/scenes/MainMenuScene.js | ✅ |
| 关卡解锁 | data/PlayerData.js | ✅ |
| 玩家信息 | data/PlayerData.js | ✅ |
| 关卡界面 | app/scenes/LevelSelectScene.js | ✅ |
| 分享得分 | managers/EventBus.js | EventBus.emit('share.score') |
| 通关提示 | app/scenes/ResultScene.js | ✅ |
| 广告复活 | managers/AdManager.js | ✅ |
| 分包管理 | managers/ResourceManager.js | ✅ |
| 关卡配置表 | data/LevelData.js | ✅ |

---

_重构计划版本: v1.0 | 2026-05-02_
