# Cocos Creator Project - Bomb Wall (Cocos Version)

## 项目信息

- **引擎**: Cocos Creator 3.8.8
- **类型**: 2D 游戏
- **目标平台**: 微信小游戏
- **原项目**: bomb-wall-canvas (Canvas 原生版)

## 目录结构

```
assets/
├── scripts/          # TypeScript 脚本
│   ├── core/        # 游戏逻辑
│   ├── managers/    # 管理器
│   └── components/  # 组件
├── scenes/          # 场景文件
│   ├── Main.scene   # 主场景
│   └── Game.scene   # 游戏场景
├── prefabs/         # 预制体
│   ├── Bomb.prefab
│   ├── Wall.prefab
│   └── StaticBomb.prefab
├── resources/       # 动态资源
│   ├── sprites/    # 精灵图
│   ├── audio/       # 音效
│   └── levels/      # 关卡配置
└── textures/        # 纹理

wiki/                # 迁移的文档
├── GAMEPLAY_DESIGN.md
├── LEVEL_DESIGN.md
├── ARCHITECTURE.md
└── ...
```

## Git 工作流

### 备份（每次修改前）
```bash
git add -A
git commit -m "backup: 修改前_功能描述"
```

### 提交更新
```bash
git add -A
git commit -m "feat/fix/doc: 具体描述"
```

## 开发阶段

| 阶段 | 状态 | 说明 |
|-----|------|------|
| 一：项目初始化 | 🔄 进行中 | 创建目录结构，迁移文档 |
| 二：核心系统迁移 | ⏳ 待开始 | 场景、节点、逻辑、动画 |
| 三：资源迁移 | ⏳ 待开始 | 精灵图、UI、音效 |
| 四：特效重构 | ⏳ 待开始 | 爆炸、升级、飘字 |
| 五：微信适配 | ⏳ 待开始 | 构建、调试、优化 |
| 六：文档整合 | ⏳ 待开始 | 技能、自动化 |

## Cocos MCP Server

- **位置**: `extensions/cocos-mcp-server/`
- **状态**: ✅ 已部署
- **使用**: 扩展 → Cocos MCP Server → 启动服务器

---

_迁移计划: MIGRATION_PLAN.md_
