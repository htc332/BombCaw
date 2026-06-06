# WIKI 索引

> **文档统一存放路径**: `bomb-wall-canvas/wiki/`  
> **总文件数**: 34 个  
> **最后整理**: 2026-05-13

---

## 📐 架构设计（4个）

| 文件 | 内容 |
|------|------|
| [ARCHITECTURE.md](wiki/ARCHITECTURE.md) | 项目架构文档 |
| [ARCHITECTURE_REFACTOR.md](wiki/ARCHITECTURE_REFACTOR.md) | 架构重构计划 |
| [DESIGN_INDEX.md](wiki/DESIGN_INDEX.md) | 设计索引 |
| [TECHNICAL_DESIGN.md](wiki/TECHNICAL_DESIGN.md) | 技术设计文档 |

---

## 🎮 关卡玩法（3个）

| 文件 | 内容 |
|------|------|
| [GAMEPLAY_DESIGN.md](wiki/GAMEPLAY_DESIGN.md) | 玩法设计文档 |
| [LAYOUT_ADJUSTMENT.md](wiki/LAYOUT_ADJUSTMENT.md) | 布局调整记录 |
| [LEVEL_DESIGN.md](wiki/LEVEL_DESIGN.md) | 18关关卡设计（宫本茂式） |

---

## 💥 爆炸特效（7个）

| 文件 | 内容 |
|------|------|
| [ASSET_ADAPTATION.md](wiki/ASSET_ADAPTATION.md) | 精灵图适配方案 |
| [CROSS_EXPLOSION_SPEC.md](wiki/CROSS_EXPLOSION_SPEC.md) | 十字爆炸特效规范 |
| [EFFECTS_ASSET_REQUIREMENTS.md](wiki/EFFECTS_ASSET_REQUIREMENTS.md) | 特效资源需求 |
| [EFFECTS_TEST.md](wiki/EFFECTS_TEST.md) | 特效测试记录 |
| [EXPLOSION_ANALYSIS.md](wiki/EXPLOSION_ANALYSIS.md) | 爆炸系统分析 |
| [EXPLOSION_ANALYSIS_A.md](wiki/EXPLOSION_ANALYSIS_A.md) | 爆炸分析 A |
| [EXPLOSION_ANALYSIS_B.md](wiki/EXPLOSION_ANALYSIS_B.md) | 爆炸分析 B |
| [EXPLOSION_ANALYSIS_C.md](wiki/EXPLOSION_ANALYSIS_C.md) | 爆炸分析 C |
| [SIMPLE_EXPLOSION_DESIGN.md](wiki/SIMPLE_EXPLOSION_DESIGN.md) | 极简爆炸设计 |

---

## 📡 事件系统（1个）

| 文件 | 内容 |
|------|------|
| [EVENT_SYSTEM.md](wiki/EVENT_SYSTEM.md) | 事件回调模式设计 |

---

## 🚨 事故报告（6个）

| 文件 | 内容 |
|------|------|
| [BUGFIX_REPORT.md](wiki/BUGFIX_REPORT.md) | Bug修复报告 |
| [ERRORS.md](wiki/ERRORS.md) | 错误记录 |
| [ERROR_ANALYSIS.md](wiki/ERROR_ANALYSIS.md) | 错误分析 |
| [INCIDENT_2026_05_07.md](wiki/INCIDENT_2026_05_07.md) | 5.7生产事故报告 |
| [INCIDENT_FULL_REPORT.md](wiki/INCIDENT_FULL_REPORT.md) | 完整事故报告 |
| [REPAIR_PLAN.md](wiki/REPAIR_PLAN.md) | 修复计划 |

---

## 📝 开发流程（8个）

| 文件 | 内容 |
|------|------|
| [BACKUP_RULES.md](wiki/BACKUP_RULES.md) | Git备份规则（四步铁律） |
| [HANDOVER.md](wiki/HANDOVER.md) | 交接文档 |
| [PLAN.md](wiki/PLAN.md) | 开发计划 |
| [PROJECT_STATUS.md](wiki/PROJECT_STATUS.md) | 项目状态 |
| [SCORE_IMPLEMENTATION_PLAN.md](wiki/SCORE_IMPLEMENTATION_PLAN.md) | 积分系统实现计划 |
| [VERSION_GUIDE.md](wiki/VERSION_GUIDE.md) | 版本指南 |
| [VERSION_INFO.txt](wiki/VERSION_INFO.txt) | 版本信息 |
| [WORKFLOW.md](wiki/WORKFLOW.md) | 开发工作流程（14步标准流程） |

---

## 🧠 学习记录（2个）

| 文件 | 内容 |
|------|------|
| [ERRORS.md](wiki/ERRORS.md) | 错误记录 |
| [LEARNINGS.md](wiki/LEARNINGS.md) | 学习记录 |

### Workspace-Level 学习记录（迁移自 `.learnings/`）

| 文件 | 内容 |
|------|------|
| [workspace_ERRORS.md](wiki/workspace_ERRORS.md) | Workspace 级别错误记录 |
| [workspace_LEARNINGS.md](wiki/workspace_LEARNINGS.md) | Workspace 级别学习记录 |
| [workspace_FEATURE_REQUESTS.md](wiki/workspace_FEATURE_REQUESTS.md) | Workspace 级别功能请求 |

---

## 🎨 其他（3个）

| 文件 | 内容 |
|------|------|
| [art-style-reference.md](wiki/art-style-reference.md) | 美术风格参考 |
| [WECHAT_SPEC.md](wiki/WECHAT_SPEC.md) | 微信小游戏规范 |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | 项目工程结构（本文件同级） |

---

## 快速查找

```bash
# 按关键词搜索 wiki
grep -r "关键词" wiki/

# 查看最近修改的文档
ls -lt wiki/ | head -10
```

---

## 历史归档

以下历史文档保留在根目录 `docs/`，供参考：

| 文件/目录 | 说明 | 时间 |
|-----------|------|------|
| `docs/PROJECT_KNOWLEDGE_BASE.md` | 项目知识库总览 | 2026-05-10 |
| `docs/bomb-wall-canvas-summary/` | 10篇项目完整总结 + 设计资源 | 2026-04-26 |
| `docs/bomb-wall-canvas-summary.zip` | 总结文档压缩包 | 2026-04-26 |

**注意**: 这些文档是历史归档，不再维护。最新文档请查看本索引上方列表。

---

## 文档存放规范

**统一路径**: `bomb-wall-canvas/wiki/`

**历史变更**:
- 2026-05-13: 将 `docs/`、`README.md`、`.learnings/` 统一合并到 `wiki/`
- 新增 `WIKI_INDEX.md` 作为文档索引

**记住**: 
- 所有项目文档都放到 `wiki/` 目录
- 不再分散在 `docs/` 或根目录
- 新增文档时同步更新 `WIKI_INDEX.md`
