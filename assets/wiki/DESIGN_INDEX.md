# 牛牛炸鼠 - 设计文档总索引

**项目**: 炸弹推墙 / 牛牛炸鼠  
**版本**: v0.7.8  
**最后更新**: 2026-05-18

---

## 📁 设计文档目录

### 核心设计
| 文档 | 路径 | 说明 |
|------|------|------|
| **核心玩法设计** | `wiki/GAMEPLAY_DESIGN.md` | 游戏机制、胜负判定、资源系统 |
| **关卡设计** | `wiki/LEVEL_DESIGN.md` | 18关完整配置、教学曲线、验证清单 |
| **工程架构** | `wiki/ARCHITECTURE.md` | 分层架构、模块职责、目录结构 |
| **架构重构计划** | `wiki/ARCHITECTURE_REFACTOR.md` | 场景管理、事件总线、未来扩展 |
| **事件系统设计** | `wiki/EVENT_SYSTEM.md` | 回调模式、事件流、延迟结算 |
| **技术实现回顾** | `wiki/IMPLEMENTATION_REVIEW.md` | 分包/动画/特效/UI/关卡实现总结 |
| **Cocos API 学习** | `wiki/COCOS_API_STUDY.md` | Cocos Creator 3.8 API 对照分析 |

### 技术规范
| 文档 | 路径 | 说明 |
|------|------|------|
| **微信小游戏开发规范** | `wiki/WECHAT_SPEC.md` | 全局对象、模块加载、调试方法 |
| **自适应布局调整** | `wiki/LAYOUT_ADJUSTMENT.md` | 安全区、格子间隙、响应式计算 |
| **精灵图资产适配** | `wiki/ASSET_ADAPTATION.md` | 最大边统一、scale补偿、验证流程 |
| **美术风格参考** | `wiki/art-style-reference.md` | 色彩系统、UI规范、动效设计 |

### 项目文档
| 文档 | 路径 | 说明 |
|------|------|------|
| **项目说明** | `README.md` | 项目简介、使用方法、功能边界 |
| **关卡测试报告** | `wiki/BUGFIX_REPORT.md` | 已修复问题、验证状态 |
| **常量定义** | `src/utils/Constants.js` | 游戏参数、事件名、存储键 |

---

## 📁 源代码目录

```
src/
├── app/                    # 应用层
│   ├── GameApp.js          # 应用入口
│   ├── SceneManager.js     # 场景管理器
│   └── scenes/             # 场景实现
│       ├── BaseScene.js
│       ├── LoginScene.js
│       ├── MainMenuScene.js
│       ├── GameScene.js
│       ├── LevelSelectScene.js
│       ├── ResultScene.js
│       └── SettingsScene.js
├── core/                   # 核心逻辑层
│   ├── GameLogic.js        # 游戏逻辑（炸弹、爆炸、胜负）
│   └── LevelSystem.js      # 关卡系统（解锁、进度）
├── data/                   # 数据层
│   ├── Storage.js          # 本地存档
│   └── LevelData.js        # 18关配置
├── managers/               # 管理层
│   └── ResourceManager.js  # 资源加载
├── view/                   # 表现层
│   ├── Renderer.js         # Canvas 渲染器
│   ├── UIManager.js        # UI 界面
│   ├── Animator.js         # 动画管理
│   ├── ParticleSystem.js   # 粒子效果
│   └── components/         # UI组件
│       └── Button.js
├── system/                 # 系统层
│   ├── AudioManager.js     # 音效/震动
│   └── AdManager.js        # 激励视频广告
├── utils/                  # 工具层
│   ├── Constants.js        # 常量定义
│   ├── EventBus.js         # 事件总线
│   ├── StateMachine.js     # 状态机
│   └── Helpers.js          # 工具函数
└── main.js                 # 游戏主入口（兼容旧版）
```

---

## 📁 资源目录

```
res/
└── images/
    ├── Level_1.jpg         # 炸弹等级1（黑色牛）
    ├── Level_2.jpg         # 炸弹等级2
    ├── Level_3.jpg         # 炸弹等级3
    ├── Level_4.jpg         # 炸弹等级4
    └── sprite/             # 精灵图资源
        ├── lv1/
        ├── lv2/
        ├── lv3/
        ├── lv4/
        ├── enemy_n/
        └── enemy_elite/
```

---

## 📁 开发日志与记忆

```
memory/
├── YYYY-MM-DD.md           # 每日会话记录
├── dev-lessons.md          # 开发经验教训
├── bomb-wall-state.json    # 项目状态跟踪
└── deploy-state.json       # 部署状态
```

**关键日志文件**:
| 文件 | 内容 |
|------|------|
| `memory/2026-05-02.md` | 牛牛主体性放大、移除倒计时、布局调整 |
| `memory/2026-05-02-dev-summary.md` | 开发总结 |
| `memory/2026-04-09.md` | 炸弹资源与震动优化 |
| `memory/2026-04-02.md` | Canvas版微信预览成功 |
| `memory/2026-03-23.md` | 微信小游戏环境问题汇总 |
| `memory/dev-lessons.md` | 核心开发经验（必须定期查看） |

---

## 📁 其他项目

```
bomb-wall-game/             # 早期设计文档
├── AI_IMAGE_WORKFLOW.md
├── WORKFLOW.md
├── DEVELOPMENT_GUIDE.md
└── README.md

9card-galaxy/               # 9牌银河（暂停）
└── ...
```

---

## 🔑 关键路径速查

| 用途 | 路径 |
|------|------|
| 游戏入口 | `bomb-wall-canvas/game.js` |
| 核心逻辑 | `bomb-wall-canvas/src/core/GameLogic.js` |
| 渲染器 | `bomb-wall-canvas/src/view/Renderer.js` |
| 关卡配置 | `bomb-wall-canvas/src/data/LevelData.js` |
| 常量定义 | `bomb-wall-canvas/src/utils/Constants.js` |
| 设计文档 | `bomb-wall-canvas/wiki/` |
| 开发日志 | `memory/` |
| 长期记忆 | `MEMORY.md` |

---

_索引版本: v1.0 | 2026-05-03_
