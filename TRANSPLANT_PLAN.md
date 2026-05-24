# 牛牛灭鼠 Cocos Creator 移植 - 完整计划文档

> 版本: v2.1 | 2026-05-24
> 项目: 炸弹推墙 (bomb-wall-canvas) → Cocos Creator 3.8.8
> 状态: 阶段二已完成，阶段三进行中

---

## 一、项目现状分析

### 1.1 源项目 (bomb-wall-canvas)

**技术栈**: 原生 Canvas + 微信小游戏 API
**版本**: v0.7.8 (稳定运行，维护模式)
**核心文件**:
```
src/
├── core/
│   ├── GameLogic.js      # 游戏逻辑（炸弹、爆炸、胜负判定）
│   ├── LevelSystem.js    # 关卡系统（解锁、进度管理）
│   └── Grid.js           # 网格系统
├── view/
│   ├── Renderer.js       # Canvas 渲染器
│   ├── Animator.js       # 动画管理（爆炸、飘字）
│   ├── ParticleSystem.js # 粒子效果
│   └── UIManager.js      # UI 界面
├── data/
│   ├── LevelData.js      # 18关关卡配置
│   ├── Storage.js        # 本地存档 (wx.getStorageSync)
│   └── Config.js         # 游戏配置
├── system/
│   ├── AudioManager.js   # 音效/震动管理
│   └── AdManager.js      # 激励视频广告
└── main.js               # 游戏主入口
```

**资源结构**:
```
subpackage/
├── sprites/              # 精灵图资源
│   ├── lv1-lv4/          # 动态炸弹（4级进化）
│   ├── enemy_n/          # 普通鼠
│   ├── enemy_n_death/    # 普通鼠死亡动画
│   ├── enemy_elite/      # 精英鼠
│   ├── enemy_elite_break/     # 精英鼠破损过渡
│   ├── enemy_elite_break_idle/ # 精英鼠破损待机
│   ├── enemy_elite_death/      # 精英鼠死亡
│   └── static_bombs/Sleep/     # 静态炸弹
├── audio/                # 音效资源（预留）
└── ui/                   # UI 资源
    ├── Login.png
    ├── Loading.png
    └── game_bg_small.png
```

**关键机制**:
- 18关完整关卡配置
- 炸弹进化系统（Lv0-Lv3，十字+对角爆炸范围）
- 静态炸弹激活机制
- 精英鼠状态机（idle → break → break_idle → death）
- 延迟结算模式（动画完成后才进入结算）
- 连击计分系统
- 微信小游戏分包加载

### 1.2 目标项目 (cocos-projects/bomb-wall)

**技术栈**: Cocos Creator 3.8.8 + TypeScript
**状态**: 阶段二已完成，阶段三进行中
**已迁移文件**:
```
assets/
├── scripts/
│   ├── components/
│   │   ├── Bomb.ts              # ✅ 炸弹组件
│   │   ├── Wall.ts               # ✅ 墙壁组件
│   │   ├── SpriteAnimationHelper.ts  # ✅ 精灵动画辅助
│   │   └── SpriteSheetLoader.ts      # ✅ 精灵图加载器
│   ├── core/
│   │   ├── GameLogic.ts          # ✅ 核心逻辑
│   │   └── GridManager.ts       # ✅ 网格管理
│   └── managers/
│       ├── GameManager.ts       # ✅ 场景管理
│       ├── AnimationManager.ts  # ✅ 动画管理
│       └── UIManager.ts         # ✅ UI 管理
├── scenes/
│   ├── Main.scene               # ✅ 主场景
│   ├── Game.scene               # ✅ 游戏场景
│   ├── LevelSelect.scene        # ✅ 关卡选择
│   └── Result.scene             # ✅ 结算界面
├── resources/
│   └── sprites/                 # ✅ 精灵图资源已复制
└── wiki/                        # ✅ 文档已迁移
```

**Git 状态**:
- 远程仓库: `https://github.com/hutianchi20111-cmyk/CowBomb.git`
- 当前分支: main
- 最新提交: `1a05ce9 backup: before completing all pending items via MCP`

---

## 二、Cocos 引擎理解

### 2.1 核心架构差异

| 维度 | 原生 Canvas | Cocos Creator 3.8 |
|------|------------|-------------------|
| **渲染** | Canvas 2D API | Sprite + ParticleSystem2D |
| **节点** | 自定义对象 | Node + Component 组件化 |
| **动画** | 手动帧切换 | AnimationClip + Animation 组件 |
| **资源** | 手动加载 (wx.loadImage) | AssetManager + SpriteFrame |
| **事件** | 回调函数 | EventTarget + 节点事件系统 |
| **布局** | 手动计算坐标 | UITransform + Widget |
| **存储** | wx.getStorageSync | sys.localStorage |
| **构建** | 微信开发者工具 | Cocos Build Panel → 微信模板 |

### 2.2 关键 API 对照

```typescript
// 原生 Canvas → Cocos
// 绘制图片
ctx.drawImage(img, x, y, w, h) → sprite.spriteFrame = spriteFrame

// 坐标变换
手动计算 → node.position = new Vec3(x, y, 0)

// 动画播放
自定义帧动画 → animation.play('clipName')

// 事件监听
callback模式 → node.on(Node.EventType.TOUCH_END, handler)

// 资源加载
wx.loadImage → assetManager.loadRemote/loadBundle
```

### 2.3 已部署的 MCP Server

**插件位置**: `extensions/cocos-mcp-server/`
**状态**: 已构建，等待 Cocos Editor 中启用并启动
**工具数量**: 130+ 可用工具
**关键工具**:
- Scene Tools: 场景创建/管理
- Node Tools: 节点操作
- Component Tools: 组件配置
- Asset Tools: 资源导入/管理
- Prefab Tools: 预制体操作

---

## 三、文档迁移清单

### 3.1 已迁移文档 ✅

| 原文档 | Cocos 项目位置 | 状态 |
|--------|---------------|------|
| wiki/ARCHITECTURE.md | wiki/ARCHITECTURE.md | ✅ 已更新为 Cocos 架构 |
| wiki/EVENT_SYSTEM.md | wiki/EVENT_SYSTEM.md | ✅ 已更新为 Cocos EventTarget |
| wiki/GAMEPLAY_DESIGN.md | wiki/GAMEPLAY_DESIGN.md | ✅ 核心玩法不变 |
| wiki/TECHNICAL_DESIGN.md | wiki/TECHNICAL_DESIGN.md | ✅ 技术方案对照 |
| wiki/LEVEL_DESIGN.md | wiki/LEVEL_DESIGN.md | ✅ 关卡配置不变 |
| wiki/IMPLEMENTATION_REVIEW.md | wiki/IMPLEMENTATION_REVIEW.md | ✅ 实现回顾 |
| wiki/COCOS_API_STUDY.md | wiki/COCOS_API_STUDY.md | ✅ Cocos API 学习 |
| assets/wiki/SPRITE_ANIMATION_MIGRATION.md | assets/wiki/SPRITE_ANIMATION_MIGRATION.md | ✅ 精灵动画迁移指南 |
| assets/wiki/UI_DESIGN_SPEC.md | assets/wiki/UI_DESIGN_SPEC.md | ✅ UI 设计规范 |

### 3.2 待迁移/更新文档 ⏳

| 原文档 | 目标位置 | 优先级 |
|--------|---------|--------|
| wiki/WORKFLOW.md | wiki/COCOS_WORKFLOW.md | 🔥 高 - 建立新工作流 |
| wiki/ASSET_ADAPTATION.md | wiki/ASSET_ADAPTATION.md | 🔥 高 - 精灵图适配 |
| wiki/CROSS_EXPLOSION_SPEC.md | wiki/CROSS_EXPLOSION_SPEC.md | 中 - 爆炸特效规范 |
| wiki/SCORE_IMPLEMENTATION_PLAN.md | wiki/SCORE_SYSTEM.md | 中 - 计分系统 |
| wiki/BACKUP_RULES.md | wiki/BACKUP_RULES.md | 低 - 备份规则 |
| wiki/WECHAT_SPEC.md | wiki/WECHAT_BUILD_GUIDE.md | 中 - 微信构建指南 |

---

## 四、移植阶段计划

### 阶段一：项目初始化 ✅ (已完成)

- [x] 创建 Cocos Creator 3.8.8 项目
- [x] 部署 cocos-mcp-server 插件
- [x] 配置 Git 仓库（与源项目同仓库）
- [x] 迁移核心文档
- [x] 复制精灵图资源

### 阶段二：核心系统迁移 ✅ (已完成)

#### 2.1 场景系统
- [x] 创建 Main.scene
- [x] 创建 Game.scene（游戏主场景）
- [x] 创建 LevelSelect.scene（关卡选择）
- [x] 创建 Result.scene（结算界面）
- [x] 配置 Camera

#### 2.2 节点组件系统
- [x] Bomb.ts 组件
- [x] Wall.ts 组件
- [x] GridManager.ts 网格管理
- [x] 创建 StaticBomb 预制体
- [x] 创建 ParticleSystem 节点

#### 2.3 游戏逻辑
- [x] GameLogic.ts 框架
- [x] 完整爆炸计算逻辑
- [x] 关卡初始化逻辑
- [x] 胜负判定逻辑
- [x] 计分系统

#### 2.4 事件系统
- [x] EventTarget 基础
- [x] 完整事件流映射
- [x] 场景间通信

### 阶段三：资源系统迁移 ⏳ (进行中)

#### 3.1 精灵图配置
- [ ] 创建 SpriteFrame 资源（在 Editor 中）
- [ ] 配置 Trim（裁剪透明边）
- [ ] 配置 Anchor（锚点）
- [ ] 设置 Filter = LINEAR
- [ ] 创建 Auto Atlas（自动图集）

#### 3.2 动画资源
- [ ] 在 Editor 中创建 AnimationClip
- [ ] 配置炸弹倒计时动画
- [ ] 配置爆炸动画
- [ ] 配置死亡动画
- [ ] 配置升级特效

#### 3.3 UI 资源
- [ ] 导入背景图
- [ ] 导入登录界面
- [ ] 导入加载界面
- [ ] 配置 Sprite 组件

### 阶段四：特效系统重构 ⏳ (待开始)

#### 4.1 爆炸特效
- [ ] 十字格蔓延爆炸（Graphics 组件）
- [ ] 碎片物理效果
- [ ] 光晕效果（ParticleSystem2D）

#### 4.2 升级特效
- [ ] 双环扩散动画
- [ ] 旋转星光

#### 4.3 浮动文字
- [ ] 得分提示（Tween + Label）
- [ ] 连击提示

### 阶段五：微信小游戏适配 ⏳ (待开始)

#### 5.1 平台适配
- [ ] 屏幕适配（SafeArea）
- [ ] 触摸事件适配
- [ ] 存储系统迁移（sys.localStorage）

#### 5.2 构建配置
- [ ] 微信小游戏构建模板
- [ ] 分包配置
- [ ] 主包大小优化（≤2MB）

#### 5.3 调试优化
- [ ] 真机测试
- [ ] 性能优化（对象池）
- [ ] 内存优化

### 阶段六：工作流与自动化 ⏳ (待开始)

- [ ] 更新 cocos-mcp 技能文档
- [ ] 建立 Cocos 项目 Git 工作流
- [ ] 创建一键构建脚本
- [ ] 创建自动预览推送脚本
- [ ] 更新 MEMORY.md 项目状态

---

## 五、Git 备份策略

### 5.1 仓库配置

```bash
# 当前配置
远程: origin https://github.com/hutianchi20111-cmyk/CowBomb.git
分支: main

# Cocos 项目路径
cd /Users/htc332/.openclaw/workspace-pioneer/cocos-projects/bomb-wall
```

### 5.2 提交规范

| 前缀 | 用途 | 示例 |
|------|------|------|
| `backup:` | 修改前备份 | `backup: before animation migration` |
| `feat:` | 新功能 | `feat: add explosion particle effect` |
| `fix:` | 修复 | `fix: sprite frame loading error` |
| `doc:` | 文档 | `doc: update Cocos workflow` |
| `refactor:` | 重构 | `refactor: migrate to Component pattern` |

### 5.3 备份命令

```bash
# 1. 修改前备份
git add -A
git commit -m "backup: before xxx"
git push origin main

# 2. 修改后保存
git add -A
git commit -m "feat: xxx"
git push origin main

# 3. 打标签（稳定版本）
git tag -a v0.1.0-cocos -m "Cocos 移植里程碑"
git push origin v0.1.0-cocos
```

---

## 六、Cocos MCP 工作流

### 6.1 启动流程

```bash
# 1. 启动 Cocos Creator（手动）
# 2. 在 Extension Manager 中启用 cocos-mcp-server
# 3. 点击 Start Server
# 4. 默认端点: http://127.0.0.1:3000/mcp
```

### 6.2 常用 MCP 操作

```json
// 创建节点
{
  "method": "create_node",
  "params": {
    "name": "Bomb",
    "parentPath": "/Canvas/GameLayer"
  }
}

// 添加组件
{
  "method": "add_component",
  "params": {
    "nodeUuid": "xxx",
    "componentName": "cc.Sprite"
  }
}

// 设置 SpriteFrame
{
  "method": "set_component_property",
  "params": {
    "nodeUuid": "xxx",
    "componentName": "cc.Sprite",
    "property": "spriteFrame",
    "value": "asset-uuid"
  }
}
```

### 6.3 当前 MCP 状态

- ✅ 插件已部署
- ✅ 已构建（dist/ 存在）
- ⏳ 等待 Cocos Editor 中启用
- ⏳ 等待 Server 启动

---

## 七、风险与应对

| 风险 | 概率 | 影响 | 应对策略 |
|------|------|------|---------|
| MCP Server 连接失败 | 中 | 高 | 检查端口 3000，确认插件已启用 |
| 精灵图 Trim/Anchor 配置复杂 | 高 | 中 | 使用脚本批量处理，或手动在 Editor 配置 |
| 动画系统迁移工作量大 | 高 | 高 | 分优先级：炸弹动画 > 死亡动画 > 特效 |
| 性能下降（Cocos 开销） | 中 | 高 | 使用对象池，合批渲染，控制节点数量 |
| 微信构建兼容性问题 | 中 | 高 | 充分真机测试，预留调试时间 |
| 开发周期延长 | 高 | 中 | 分阶段交付，每阶段可独立验证 |

---

## 八、下一步行动

### 立即执行（今天）

1. **启动 Cocos Editor**
   - 打开 Cocos Creator 3.8.8
   - 打开项目 `cocos-projects/bomb-wall/`
   - 启用 cocos-mcp-server 插件
   - 启动 MCP Server

2. **验证 MCP 连接**
   ```bash
   curl -X POST http://127.0.0.1:3000/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
   ```

3. **创建 AnimationClip 资源**
   - 使用 MCP 创建 AnimationClip
   - 配置 SpriteFrame 的 Trim 和 Anchor
   - 设置纹理 Filter = LINEAR

### 本周目标

- 完成阶段三（资源系统迁移）
- 配置所有精灵图资源
- 实现基础动画系统

### 里程碑

| 里程碑 | 目标 | 预计时间 |
|--------|------|---------|
| v0.1.0-cocos | 核心玩法可运行（1关） | 1周 |
| v0.2.0-cocos | 18关完整 + 计分系统 | 2周 |
| v0.3.0-cocos | 特效系统 + 动画完善 | 3周 |
| v0.4.0-cocos | 微信构建 + 真机测试 | 4周 |
| v1.0.0-cocos | 完整上线版本 | 6周 |

---

## 九、记忆更新记录

### 2026-05-24 更新

**项目状态变更**:
- 原项目: `bomb-wall-canvas/` (原生 Canvas，v0.7.8，维护模式)
- 新项目: `cocos-projects/bomb-wall/` (Cocos Creator，阶段二已完成)
- 阶段二核心系统迁移已完成
- 阶段三资源系统迁移进行中

**文档整理**:
- 删除: MIGRATION_PLAN.md (被 TRANSPLANT_PLAN.md v2.1 取代)
- 删除: CHECKLIST.md (阶段二已完成，内容过时)
- 更新: TRANSPLANT_PLAN.md → v2.1，更新阶段状态

**技能状态**:
- cocos-mcp 技能: 已部署，等待 Editor 中启用
- wx-compile 技能: 仍有效（用于原项目维护）

**工作流变更**:
- 开发任务 → Cocos 项目路径
- 文档任务 → `cocos-projects/bomb-wall/wiki/`
- Git 提交 → 同一仓库，不同前缀区分

---

_文档位置: `cocos-projects/bomb-wall/TRANSPLANT_PLAN.md`_
_更新日期: 2026-05-24_
_下次更新: 阶段三完成时_
