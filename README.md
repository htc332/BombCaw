# Cocos Creator Project - Bomb Wall (Cocos Version)

## 项目信息

- **引擎**: Cocos Creator 3.8.8
- **类型**: 2D 游戏
- **目标平台**: 微信小游戏
- **原项目**: bomb-wall-canvas (Canvas 原生版)
- **当前状态**: 阶段二已完成，阶段三进行中

## 目录结构

```
assets/
├── scripts/          # TypeScript 脚本
│   ├── core/        # 游戏逻辑
│   ├── managers/    # 管理器
│   └── components/  # 组件
├── scenes/          # 场景文件
│   ├── Main.scene   # 主场景
│   ├── Game.scene   # 游戏场景
│   ├── LevelSelect.scene  # 关卡选择
│   └── Result.scene       # 结算界面
├── prefabs/         # 预制体
│   ├── Bomb.prefab
│   ├── Wall.prefab
│   └── StaticBomb.prefab
├── resources/       # 动态资源
│   ├── sprites/    # 精灵图
│   ├── audio/       # 音效
│   └── levels/      # 关卡配置
└── textures/        # 纹理

wiki/                # 项目文档
├── GAMEPLAY_DESIGN.md
├── LEVEL_DESIGN.md
├── ARCHITECTURE.md
└── ...
```

## 开发阶段

| 阶段 | 状态 | 说明 |
|-----|------|------|
| 一：项目初始化 | ✅ 完成 | 创建目录结构，迁移文档 |
| 二：核心系统迁移 | ✅ 完成 | 场景、节点、逻辑、动画 |
| 三：资源迁移 | 🔄 进行中 | 精灵图、UI、音效 |
| 四：特效重构 | ⏳ 待开始 | 爆炸、升级、飘字 |
| 五：微信适配 | ⏳ 待开始 | 构建、调试、优化 |
| 六：文档整合 | ⏳ 待开始 | 技能、自动化 |

## Cocos MCP Server

- **位置**: `extensions/cocos-mcp-server/`
- **状态**: ✅ 已部署
- **使用**: 扩展 → Cocos MCP Server → 启动服务器

## 完整移植计划

详见: [TRANSPLANT_PLAN.md](./TRANSPLANT_PLAN.md)

---
_更新日期: 2026-05-24_
