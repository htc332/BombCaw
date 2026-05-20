# Learnings

Corrections, insights, and knowledge gaps captured during development.

**Categories**: correction | insight | knowledge_gap | best_practice

---

## [LRN-20260507-001] correction

**Logged**: 2026-05-07T11:00:00+08:00
**Priority**: critical
**Status**: promoted
**Area**: config

### Summary
GitHub 推送时，历史提交中包含的 Figma Token 会触发 GitHub Push Protection，阻止推送。

### Details
在推送代码到 GitHub 时，如果历史提交中包含敏感信息（如 API Token），GitHub 的 secret scanning 会检测并阻止推送。即使已经删除文件，历史提交中仍然存在。

### Suggested Action
1. 使用 `git filter-branch` 或 `git filter-repo` 重写历史，移除敏感信息
2. 或者访问 GitHub 提供的链接允许特定 secret
3. 未来避免在代码中硬编码 token

### Metadata
- Source: error
- Related Files: bomb-wall-canvas/test-figma-api.js
- Tags: git, github, security, token
- Promoted: TOOLS.md

---

## [LRN-20260507-002] best_practice

**Logged**: 2026-05-07T11:30:00+08:00
**Priority**: high
**Status**: pending
**Area**: workflow

### Summary
使用 GitHub 仓库替代本地版本备份，更可靠且可追踪。

### Details
用户创建了 GitHub 仓库 `htc332/BombCaw` 用于项目备份。以后每次修改前应该：
1. `git add -A`
2. `git commit -m "备份描述"`
3. 修改代码
4. `git commit -m "修改描述"`
5. `git push origin main`

### Suggested Action
更新工作流程文档，将 GitHub 备份作为标准步骤。

### Metadata
- Source: user_feedback
- Related Files: wiki/WORKFLOW.md
- Tags: git, backup, workflow

---

## [LRN-20260507-003] insight

**Logged**: 2026-05-07T13:00:00+08:00
**Priority**: medium
**Status**: pending
**Area**: config

### Summary
OpenClaw 有梦境模块（Dreaming），可以自动整理记忆并生成梦境日记。

### Details
通过配置 `memory-core` 插件的 `dreaming` 选项，可以开启自动记忆整理功能：
- Light（浅睡）：整理短期记忆
- Deep（深睡）：评估并写入长期记忆
- REM（快速眼动）：反思并生成洞察

### Suggested Action
保持梦境功能开启，定期查看 DREAMS.md 了解 AI 的"梦境日记"。

### Metadata
- Source: user_feedback
- Related Files: ~/.openclaw/openclaw.json
- Tags: openclaw, memory, dreaming

---

---
**Note**: This is a workspace-level learning log. For project-specific learnings, use `bomb-wall-canvas/wiki/`.

---

> **Note**: This is a workspace-level learning log (migrated from `.learnings/` on 2026-05-13). For project-specific learnings, use `bomb-wall-canvas/wiki/`.
