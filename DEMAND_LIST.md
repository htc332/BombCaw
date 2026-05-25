# 炸弹牛 (Bomb Wall) 需求清单

> 项目路径：`~/Desktop/bomb-wall`  
> 引擎：Cocos Creator 3.8.8  
> 类型：2D 炸弹推墙（牛牛灭鼠）  
> 目标平台：微信小游戏  
> 状态：阶段二已完成，阶段三进行中

---

## 一、设计需求（Gameplay Design）

### 1.1 核心玩法
| # | 需求项 | 优先级 | 状态 | 备注 |
|---|--------|--------|------|------|
| 1 | 网格放置炸弹（点击格子） | P0 | ✅ 已实现 | GameLogic.placeBomb() |
| 2 | 炸弹3秒倒计时后爆炸 | P0 | ✅ 已实现 | scheduleOnce(3s) |
| 3 | 十字+对角爆炸范围（Lv1+） | P0 | ✅ 已实现 | calculateExplosion() |
| 4 | 墙壁/敌人被爆炸摧毁 | P0 | ✅ 已实现 | destroyWall() |
| 5 | 精英鼠2点HP（需2次爆炸） | P0 | ✅ 已实现 | hp/maxHp |
| 6 | 静态炸弹被爆炸激活并连锁 | P0 | ✅ 已实现 | activateStaticBomb() |
| 7 | 炸弹数量限制（关卡配置） | P0 | ✅ 已实现 | bombsLeft |
| 8 | 胜负判定（墙全清=胜利，炸弹用完=失败） | P0 | ✅ 已实现 | checkVictory() |
| 9 | 延迟结算（等动画播完） | P0 | ✅ 已实现 | scheduleOnce(2s) |
| 10 | 炸弹进化系统（Lv0-Lv3） | P1 | 🟡 骨架有 | evolution 字段存在，升级逻辑待完善 |
| 11 | 18关完整关卡配置 | P1 | 🟡 部分有 | 仅4关JSON（level_1~3 + test） |
| 12 | 星级评定（1-3星） | P1 | ✅ 已实现 | ScoreManager.calculateStars() |
| 13 | 连击计分系统 | P1 | ✅ 已实现 | comboCount + COMBO_WINDOW |

### 1.2 关卡设计
| # | 关卡 | 状态 | 备注 |
|---|------|------|------|
| 1 | Level 1: First Steps | ✅ 有JSON | 5×5, 3炸弹, 3普通墙 |
| 2 | Level 2: Double Trouble | ✅ 有JSON | 5×5, 4炸弹, 2普通+1精英 |
| 3 | Level 3: Chain Reaction | ✅ 有JSON | 6×6, 5炸弹, 4普通+1精英+2静态炸弹 |
| 4 | Level 4-18 | ❌ 缺失 | 需补充15关配置 |
| 5 | level_test | ✅ 有JSON | 测试用 |

### 1.3 动画/特效需求
| # | 需求项 | 优先级 | 状态 | 备注 |
|---|--------|--------|------|------|
| 1 | 炸弹倒计时动画（Lv1-Lv4帧动画） | P0 | 🟡 骨架有 | AnimationManager.playBombIdle() 待验证 |
| 2 | 爆炸特效（十字蔓延+光晕） | P0 | ❌ 未实现 | 需 ParticleSystem2D 或 Graphics |
| 3 | 墙壁死亡动画（普通鼠/精英鼠） | P0 | 🟡 骨架有 | playDeathAnimation() 待验证 |
| 4 | 精英鼠破损过渡动画 | P0 | 🟡 骨架有 | playBreakTransition() 待验证 |
| 5 | 精英鼠破损待机动画 | P0 | 🟡 骨架有 | playBreakIdle() 待验证 |
| 6 | 浮动得分文字（Tween上浮淡出） | P1 | ✅ 已实现 | ScoreManager.showFloatingText() |
| 7 | 连击提示动画（放大+淡出） | P1 | ✅ 已实现 | showCombo() |
| 8 | 升级特效（双环扩散+旋转星光） | P2 | ❌ 未实现 | 阶段四待做 |
| 9 | 炸弹放置音效 | P1 | ❌ 未实现 | assets/audio 为空 |
| 10 | 爆炸音效 | P1 | ❌ 未实现 | assets/audio 为空 |
| 11 | 胜利/失败音效 | P2 | ❌ 未实现 | assets/audio 为空 |

### 1.4 敌人/墙壁类型
| # | 类型 | HP | 状态 | 动画资源 |
|---|------|-----|------|----------|
| 1 | 普通鼠（normal） | 1 | ✅ 已实现 | enemy_n, enemy_n_death |
| 2 | 精英鼠（elite） | 2 | ✅ 已实现 | enemy_elite, enemy_elite_break, enemy_elite_break_idle, enemy_elite_death |

---

## 二、引擎需求（Engine & Tech）

### 2.1 Cocos Creator 配置
| # | 需求项 | 状态 | 备注 |
|---|--------|------|------|
| 1 | Cocos Creator 3.8.8 | ✅ 已配置 | - |
| 2 | 2D 项目类型 | ✅ 已配置 | - |
| 3 | 微信小游戏构建 | ⏳ 待配置 | 阶段五 |
| 4 | 分包加载 | ⏳ 待配置 | 阶段五 |
| 5 | 主包≤2MB | ⏳ 待优化 | 阶段五 |

### 2.2 核心系统架构
| # | 系统 | 文件 | 状态 | 问题 |
|---|------|------|------|------|
| 1 | GameLogic | `assets/scripts/core/GameLogic.ts` | ✅ 已实现 | 完整 |
| 2 | GridManager | `assets/scripts/core/GridManager.ts` | ✅ 已实现 | 完整 |
| 3 | GameManager | `assets/scripts/managers/GameManager.ts` | 🟡 骨架有 | startLevel() 硬编码配置，未接入JSON |
| 4 | AnimationManager | `assets/scripts/managers/AnimationManager.ts` | 🟡 骨架有 | 加载逻辑有，实际播放待验证 |
| 5 | ScoreManager | `assets/scripts/managers/ScoreManager.ts` | ✅ 已实现 | 完整 |
| 6 | UIManager | `assets/scripts/managers/UIManager.ts` | 🟡 骨架有 | 基础UI有，面板待完善 |
| 7 | SpriteSheetLoader | `assets/scripts/components/SpriteSheetLoader.ts` | ✅ 已实现 | 完整 |
| 8 | SpriteAnimationHelper | `assets/scripts/components/SpriteAnimationHelper.ts` | ❌ 文件锁 | 无法读取，但AnimationManager引用它 |
| 9 | Bomb Component | `assets/scripts/components/Bomb.ts` | ✅ 已实现 | 完整 |
| 10 | Wall Component | `assets/scripts/components/Wall.ts` | ✅ 已实现 | 完整 |

### 2.3 场景系统
| # | 场景 | 文件 | 状态 | 备注 |
|---|------|------|------|------|
| 1 | Main（主场景/启动） | `assets/scenes/Main.scene` | 🟡 存在 | 内容待确认 |
| 2 | Game（游戏主场景） | `assets/scenes/Game.scene` | ❌ 未找到 | README说有，实际未扫描到 |
| 3 | LevelSelect（关卡选择） | `assets/scenes/LevelSelect.scene` | ❌ 未找到 | README说有，实际未扫描到 |
| 4 | Result（结算界面） | `assets/scenes/Result.scene` | ❌ 未找到 | README说有，实际未扫描到 |

### 2.4 预制体
| # | 预制体 | 文件 | 状态 | 备注 |
|---|--------|------|------|------|
| 1 | Bomb | `assets/prefabs/Bomb.prefab` | ✅ 存在 | - |
| 2 | Wall | `assets/prefabs/Wall.prefab` | ✅ 存在 | - |
| 3 | StaticBomb | ❌ 未找到 | README说有 | 实际未扫描到 |

### 2.5 精灵图资源
| # | 资源 | 路径 | 状态 | 备注 |
|---|------|------|------|------|
| 1 | 炸弹Lv1 | `sprites/lv1/` | ✅ 有 | sprite.png + index.json |
| 2 | 炸弹Lv2 | `sprites/lv2/` | ✅ 有 | sprite.png + index.json |
| 3 | 炸弹Lv3 | `sprites/lv3/` | ✅ 有 | sprite.png + index.json |
| 4 | 炸弹Lv4 | `sprites/lv4/` | ✅ 有 | sprite.png + index.json |
| 5 | 普通鼠 | `sprites/enemy_n/` | ✅ 有 | sprite.png + index.json |
| 6 | 普通鼠死亡 | `sprites/enemy_n_death/` | ✅ 有 | sprite.png + index.json |
| 7 | 精英鼠 | `sprites/enemy_elite/` | ✅ 有 | sprite.png + index.json |
| 8 | 精英鼠破损 | `sprites/enemy_elite_break/` | ✅ 有 | sprite.png + index.json |
| 9 | 精英鼠破损待机 | `sprites/enemy_elite_break_idle/` | ✅ 有 | sprite.png + index.json |
| 10 | 精英鼠死亡 | `sprites/enemy_elite_death/` | ✅ 有 | sprite.png + index.json |
| 11 | 静态炸弹Sleep | `sprites/static_bombs/Sleep/` | ✅ 有 | Sleep_lv1~4.png |

---

## 三、现状/技术债务（Current State & Debt）

### 3.1 已完成 ✅（阶段二）
| # | 内容 | 说明 |
|---|------|------|
| 1 | 核心游戏逻辑 | GameLogic.ts 完整实现 |
| 2 | 网格系统 | GridManager.ts 坐标转换 |
| 3 | 炸弹/墙壁组件 | Bomb.ts + Wall.ts |
| 4 | 得分系统 | ScoreManager.ts 连击+星级 |
| 5 | 精灵图加载器 | SpriteSheetLoader.ts |
| 6 | 动画管理器骨架 | AnimationManager.ts |
| 7 | UI管理器骨架 | UIManager.ts |
| 8 | 4关JSON配置 | level_1~3 + test |
| 9 | 所有精灵图资源 | 10组动画资源已复制 |
| 10 | Git仓库 | 已配置，有提交历史 |

### 3.2 进行中/待完善 🟡（阶段三）
| # | 问题 | 严重程度 | 说明 |
|---|------|----------|------|
| 1 | SpriteFrame资源未在Editor中创建 | 🔴 高 | 精灵图需在Cocos Editor中导入生成.meta |
| 2 | AnimationClip未创建 | 🔴 高 | 炸弹倒计时、死亡等动画需在Editor中配置 |
| 3 | Trim/Anchor未配置 | 🟡 中 | 精灵图可能需要裁剪和锚点调整 |
| 4 | 场景文件缺失 | 🔴 高 | Game/LevelSelect/Result.scene 未找到 |
| 5 | StaticBomb.prefab 缺失 | 🟡 中 | 静态炸弹预制体未找到 |
| 6 | GameManager.startLevel() 硬编码 | 🟡 中 | 未从JSON加载关卡配置 |
| 7 | MCP Server未启动 | 🟡 中 | cocos-mcp-server插件已部署，但未在Editor中启用 |
| 8 | 关卡4-18缺失 | 🟡 中 | 需补充15关配置 |

### 3.3 未开始 ❌（阶段四~六）
| # | 问题 | 阶段 | 说明 |
|---|------|------|------|
| 1 | 爆炸特效（粒子/Graphics） | 阶段四 | 十字蔓延、光晕、碎片 |
| 2 | 升级特效 | 阶段四 | 双环扩散、旋转星光 |
| 3 | 音效系统 | 阶段四 | assets/audio 完全为空 |
| 4 | 微信小游戏构建 | 阶段五 | 未配置构建模板 |
| 5 | 屏幕适配（SafeArea） | 阶段五 | 未处理 |
| 6 | 本地存储迁移 | 阶段五 | wx.getStorageSync → sys.localStorage |
| 7 | 对象池优化 | 阶段五 | 当前直接instantiate |
| 8 | 真机测试 | 阶段五 | 未进行 |
| 9 | 文档整合 | 阶段六 | 工作流、自动化脚本 |
| 10 | 背景图/UI资源 | 阶段三 | ui/ 目录资源未导入 |

### 3.4 已知代码问题
| # | 问题 | 位置 | 说明 |
|---|------|------|------|
| 1 | Bomb.ts 有语法错误 | line 107 | `if (this.animHelper) {` 嵌套重复 |
| 2 | Wall.ts 有语法错误 | line 50-54 | `if (this.animHelper) {` 嵌套重复 |
| 3 | GameManager.ts 类型转换 | line 97 | `as unknown as Node` 不规范 |
| 4 | AnimationManager.getAnimHelper() | line 165 | 全局缓存复制帧数据逻辑未完成 |
| 5 | ScoreManager.checkNewRecord() | line 240 | TODO注释，未实现本地存储读取 |
| 6 | UIManager.createVictoryPanel() | line 140 | TODO: 设置背景颜色或图片 |
| 7 | SpriteSheetLoader.loadTexture() | - | bundle.load 路径可能不正确 |

---

## 四、开发优先级建议

### 立即执行（今天）
1. **启动 Cocos Creator 3.8.8**
   - 打开 `~/Desktop/bomb-wall` 项目
   - 在 Extension Manager 中启用 cocos-mcp-server
   - 启动 MCP Server（端口3000）

2. **修复代码语法错误**
   - Bomb.ts line 107 嵌套if修复
   - Wall.ts line 50-54 嵌套if修复

3. **导入精灵图资源到 Editor**
   - 将 `assets/resources/sprites/` 下所有资源导入
   - 生成 .meta 文件
   - 配置 SpriteFrame

### 本周目标（阶段三完成）
1. 创建缺失的场景文件（Game/LevelSelect/Result）
2. 创建 StaticBomb.prefab
3. 在Editor中配置所有AnimationClip
4. 配置Trim/Anchor/Filter
5. 创建Auto Atlas自动图集
6. GameManager接入JSON关卡配置
7. 补充关卡4-18的JSON配置

### 下周目标（阶段四开始）
1. 爆炸特效（ParticleSystem2D）
2. 升级特效
3. 音效资源接入
4. UI背景图导入

---

*清单整理时间：2026-05-26*  
*基于工程目录：`~/Desktop/bomb-wall`*  
*参考文档：README.md + TRANSPLANT_PLAN.md*
