# 工作流程总览

**任务类型判断**：
- **开发代码任务** → 走「开发工作流程」（下方详细步骤）
- **文档/方案任务** → 走「文档工作流程」（见下方独立章节）

---

# 开发工作流程

## 真实流程（基于记忆和教训）

```
接到需求
  ↓
1. 读取相关资料（wiki + 记忆）
  ↓
2. 搜索现成方案（官方文档/论坛）
  ↓
3. 分析影响范围
  ↓
4. 备份当前版本（git commit）
  ↓
5. 制定修改计划
  ↓
6. 修改（一次只改一个文件）
  ↓
7. 语法检查 + 本地运行测试
  ↓
8. 安全检查
  ↓
9. 保存版本（git commit）
  ↓
10. 推送到真机
  ↓
11. 自查日志（查看微信开发者工具 Console）
    ↓ 有报错？
    ├── 是 → 12. 报错自修复
    │         ↓ 修复后回到步骤7
    └── 否 → 13. 验证功能（用户反馈）
              ↓ 正常？
              ├── 是 → 14. 记录成功日志 → 流程结束
              └── 否 → 15. 回退到备份 → 重新开始
```

## 详细步骤

### 步骤 1：读取资料（wiki + 记忆）
**必须查看**：
- `DESIGN_INDEX.md` — 确认对应哪个设计文档
- 相关设计文档（如 wiki/GAMEPLAY_DESIGN.md）
- `memory/dev-lessons.md` — 查看相关教训
- `wiki/WECHAT_SPEC.md` — 微信小游戏特殊要求

### 步骤 2：搜索现成方案（关键！）
**如果 wiki 和记忆中没有答案**：
1. 访问微信小游戏官方文档：`https://developers.weixin.qq.com`
2. 搜索相关 API 或问题
3. 参考社区解决方案
4. **不再重复造轮子**

**不做**：
- ❌ 不搜索就凭感觉解决
- ❌ 遇到 Canvas/微信问题就从头诊断

### 步骤 3：分析影响范围
列出所有需要修改的文件：
```
修改计划：
- 文件A：修改内容，原因
- 文件B：修改内容，原因
```

### 步骤 4：备份（git commit + push）
```bash
git add -A
git commit -m "backup: 修改前_功能名"
git push origin main
```
**确认备份成功**：
```bash
git log --oneline -3
git status
```
**重要**：每次重大改动前必须先备份到 GitHub！

### 步骤 5：制定修改计划
写在文件中：
```
修改计划 [时间戳]
需求：xxx
影响文件：
- file1.js：原因
修改顺序：
1. 先改 file1.js
回退命令：git reset --hard HEAD~1
预期结果：xxx
```

### 步骤 6：修改
**一次只改一个文件**

**修改前**：
```bash
cp file.js file.js.working
```

**修改原则**：
- 不改能工作的代码
- 保留回退路径（如果新方法失败，自动用旧的）

### 步骤 7：语法检查 + 本地运行测试
```bash
node --check file.js
```
**本地运行测试**：
- 在微信开发者工具中运行游戏
- 查看 Console 面板是否有红色 ERROR
- 查看是否有 WARNING
- 确认游戏能正常显示画面
- 确认触摸交互正常
- **有报错立即修复，不推送**

### 步骤 8：安全检查
```bash
bash scripts/backup-before-push.sh
```

### 步骤 9：保存版本（git commit + push）
```bash
git add -A
git commit -m "feat: 功能描述"
git push origin main
```
**确认推送成功**：
```bash
git log --oneline -3
```

### 步骤 10：推送到真机
```bash
bash scripts/push-to-device.sh
```

### 步骤 11: 自查日志（关键！）
**打开微信开发者工具 Console 面板**

**必须检查**：
- 是否有红色 ERROR？
- 是否有 WARNING？
- 日志输出是否符合预期？

**日志捕获方案**（已集成到项目）：
1. **console-capture.js** - 自动保存到 `wx.env.USER_DATA_PATH + '/console.log'`
2. **真机远程调试** - 微信开发者工具连接手机查看 Console
3. **诊断面板** - 屏幕左上角显示绿色日志

**读取日志文件**：
```bash
# 查看日志文件
cat ~/Library/Application\ Support/微信开发者工具/*/console.log
```

**不做**：
- ❌ 不看日志就问用户"有没有问题"
- ❌ 只看"Compiled"成功就认为没问题
- ❌ 忽略黄色 WARNING

### 步骤 12：报错自修复（关键！）
**如果 Console 有红色 ERROR**：
1. 立即截图/记录错误信息
2. 分析错误位置（哪个文件、哪一行）
3. 修复错误
4. 回到步骤 7（语法检查）
5. 重新推送
6. 再次自查日志

**不做**：
- ❌ 忽略 ERROR 直接问用户
- ❌ 让用户去看报错是什么
- ❌ 说"应该没问题"但不验证

### 步骤 13：验证功能
等待用户反馈：
- 功能是否正常？
- 画面是否正确？
- 触摸是否灵敏？

### 步骤 14：记录成功日志
```
修改成功 [时间戳]
文件：xxx
修改内容：xxx
验证结果：正常
```

### 步骤 15：失败处理
**如果用户反馈有问题**：
1. 立即回退：
   ```bash
   git reset --hard HEAD~1
   ```
2. 记录失败原因：
   ```bash
   git add -A
   git commit -m "fix: 失败原因"
   ```
3. 分析日志和截图
4. 重新开始步骤 1

**不做**：
- ❌ 在失败版本上继续叠加修改
- ❌ 添加"诊断代码"（诊断代码本身就是问题）
- ❌ 不验证就继续下一步

---

## Git 操作教训（2026-05-12 血泪教训）

### 问题：回退后 `git pull --rebase` 拉回了错误版本

**场景**：
1. 回退到稳定版本 `git reset --hard 9836776`
2. `git push` 失败（远程有更新）
3. 执行 `git pull --rebase`
4. 结果：把有问题的 `d07e797` 又拉回来了
5. 导致：基于错误版本继续修改，问题重现

**正确做法**：
```bash
# 回退到稳定版本后，强制推送
git reset --hard 9836776
git push --force origin main

# 或者先删除远程分支再推送
git push origin --delete main
git push origin main
```

**关键原则**：
- 回退后必须 **强制推送**，不能 pull/rebase
- 回退前确保本地没有未提交的修改
- 回退后立即打标签 `git tag -a v0.7.2-stable`
- 标签是找回稳定版本的最可靠方式

### 标签使用规范

```bash
# 打标签（稳定版本必须打标签）
git tag -a v0.7.2-stable -m "v0.7.2 稳定基线 - 包含xxx功能"

# 推送标签到远程
git push origin v0.7.2-stable

# 查看所有标签
git tag -l

# 回退到标签版本
git reset --hard v0.7.2-stable
```

**标签命名规范**：
- `vX.Y.Z-stable` — 稳定版本
- `vX.Y.Z-backup` — 备份版本
- `vX.Y.Z-milestone` — 里程碑版本

---

## 稳定版本标记清单

当确认一个版本稳定时：

1. **打标签**：
   ```bash
   git tag -a v0.7.2-stable -m "稳定版本说明"
   git push origin v0.7.2-stable
   ```

2. **更新文档**：
   - 在 `VERSION_INFO.txt` 记录
   - 在 `wiki/SCORE_SYSTEM_REVIEW.md` 记录回退原因

3. **验证标签**：
   ```bash
   git log --oneline v0.7.2-stable -1
   ```

---

---

## GitHub 仓库配置

**仓库地址**: `https://github.com/hutianchi20111-cmyk/CowBomb.git`
**仓库类型**: 私有
**协议**: HTTPS (Token)

## 备份命令（每次修改前必须执行）

```bash
# 1. 备份当前状态
git add -A
git commit -m "backup: 修改前状态"
git push origin main

# 2. 修改代码...

# 3. 保存修改
git add -A
git commit -m "feat: 修改描述"
git push origin main
```

## 铁律

1. **不备份不动手** — 每次重大改动前必须 `git commit + push`
2. **推送前必须本地运行测试** — 自己运行游戏，检查报错
3. **推送后必须自查日志**
4. **有报错必须自修复**
5. **不自行推断"应该没问题"**
6. **wiki/记忆没有答案时，先搜索现成方案**
7. **GitHub 是唯一的备份源** — 本地不保留历史版本

---

# 文档工作流程

## 适用场景
- 编写/更新设计文档、技术方案、规范说明
- 整理项目结构、工程索引、知识库
- 任何不涉及代码修改的文档类任务

## 文档工作准则

### 1. 统一存放路径
**所有项目文档必须放到 `bomb-wall-canvas/wiki/` 目录**

```
✅ 正确：
   bomb-wall-canvas/wiki/新文档.md
   bomb-wall-canvas/wiki/更新文档.md

❌ 错误：
   bomb-wall-canvas/docs/新文档.md（docs/ 已废弃）
   根目录/新文档.md（不要分散）
   .learnings/新文档.md（学习记录专用）
```

**新增文档时同步更新**：
- `bomb-wall-canvas/WIKI_INDEX.md` — 文档索引

### 2. 备份 Git，并注明是设计任务
```bash
# 备份当前状态
git add -A
git commit -m "doc: 文档更新描述"
git push origin main
```

**提交信息规范**：
- `doc: 更新xxx文档` — 新增/修改文档
- `doc: 整理工程结构` — 结构调整
- `doc: 添加设计规范` — 新增规范

**注意**：文档任务的 commit message 必须以 `doc:` 开头，与代码任务的 `feat:`/`fix:` 区分

### 3. 文档工作流程步骤

```
接到文档需求
  ↓
1. 判断任务类型 → 确认是文档任务
  ↓
2. 读取现有文档（wiki/ + WIKI_INDEX.md）
  ↓
3. 制定文档计划（影响哪些文件）
  ↓
4. Git 备份（git commit -m "doc: 备份_文档任务名"）
  ↓
5. 编写/修改文档
  ↓
6. 更新 WIKI_INDEX.md（如有新增文档）
  ↓
7. 自查（检查路径一致性、格式规范）
  ↓
8. Git 提交（git commit -m "doc: 文档更新描述"）
  ↓
9. 推送（git push origin main）
  ↓
10. 记录完成
```

### 4. 文档自查清单
- [ ] 文档存放在 `bomb-wall-canvas/wiki/` 目录
- [ ] 新增文档已添加到 `WIKI_INDEX.md`
- [ ] 文档内引用的路径统一为 `wiki/`，不是 `docs/`
- [ ] 提交信息以 `doc:` 开头
- [ ] 无敏感信息（token、密码等）

### 5. 文档与开发任务的区别

| 维度 | 开发代码任务 | 文档/方案任务 |
|------|-------------|--------------|
| 入口流程 | 开发工作流程 | 文档工作流程 |
| 存放路径 | `src/` / `game.js` | `bomb-wall-canvas/wiki/` |
| Git 提交前缀 | `feat:` / `fix:` / `backup:` | `doc:` |
| 必须检查 | 语法检查、真机测试 | 路径一致性、索引更新 |
| 推送目标 | 真机预览 | GitHub 即可 |
| 自查重点 | Console 日志 | 文档路径、格式规范 |

---

_流程版本: v5.2 | 2026-05-13_
_更新: 添加文档工作流程，区分开发任务与文档任务_
