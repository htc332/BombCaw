# 炸弹牛项目 - 场景搭建需求文档

## 当前状态
核心逻辑代码已完成，但 Cocos Creator 3.8.8 中的场景和预制体绑定尚未完成。

---

## 一、需要创建的场景

### 1. Game.scene（主游戏场景）⭐ 最高优先级

**节点结构：**
```
Canvas (Canvas组件)
├── GameRoot (空节点，挂载 GameScene.ts)
│   ├── gameLayer (空节点，用于放置炸弹和墙壁)
│   ├── uiLayer (空节点，用于UI显示)
│   └── particleLayer (空节点，用于粒子特效)
└── Camera
```

**GameRoot 节点组件绑定：**
| 属性 | 绑定对象 |
|------|---------|
| bombPrefab | Bomb.prefab |
| wallPrefab | Wall.prefab |
| staticBombPrefab | Bomb.prefab（复用） |
| gameLayer | gameLayer 节点 |
| uiLayer | uiLayer 节点 |
| particleLayer | particleLayer 节点 |
| canvas | Canvas 节点 |

**GameRoot 脚本挂载：**
- GameScene.ts（主场景脚本）
- GameLogic.ts（核心逻辑）
- GridManager.ts（网格管理）
- AnimationManager.ts（动画管理）
- UIManager.ts（UI管理）
- AudioManager.ts（音效管理）
- ParticleManager.ts（粒子管理）
- LevelManager.ts（关卡管理）
- ScoreManager.ts（得分管理）

---

### 2. LevelSelect.scene（关卡选择场景）

**节点结构：**
```
Canvas
├── LevelSelectRoot (挂载 LevelSelect.ts)
│   ├── TitleLabel (Label组件，显示"选择关卡")
│   ├── LevelGrid (挂载 Layout 组件，网格排列)
│   └── BackButton (Button组件)
└── Camera
```

**LevelSelectRoot 组件绑定：**
| 属性 | 绑定对象 |
|------|---------|
| levelGrid | LevelGrid 节点 |
| backButton | BackButton 节点 |
| titleLabel | TitleLabel 节点 |

---

### 3. MainMenu.scene（主菜单场景）

**节点结构：**
```
Canvas
├── MainMenuRoot (挂载 MainMenu.ts)
│   ├── TitleNode (Label组件，显示"炸弹牛")
│   ├── StartButton (Button组件，文字"开始游戏")
│   ├── LevelSelectButton (Button组件，文字"选择关卡")
│   ├── SettingsButton (Button组件，文字"设置")
│   └── ProgressLabel (Label组件，显示进度)
└── Camera
```

**MainMenuRoot 组件绑定：**
| 属性 | 绑定对象 |
|------|---------|
| titleNode | TitleNode 节点 |
| startButton | StartButton 节点 |
| levelSelectButton | LevelSelectButton 节点 |
| settingsButton | SettingsButton 节点 |
| progressLabel | ProgressLabel 节点 |

---

## 二、需要检查的预制体

### 1. Bomb.prefab

**必须包含的组件：**
- Sprite（精灵渲染）
- UITransform（尺寸 64x64）
- Bomb.ts（炸弹脚本）
- SpriteAnimationHelper.ts（动画辅助）

**Bomb.ts 属性：**
| 属性 | 值 |
|------|---|
| sprite | 本节点的 Sprite 组件 |
| evolution | 1 |
| countdown | 3 |
| isStatic | false |
| isActive | false |
| power | 1 |

### 2. Wall.prefab

**必须包含的组件：**
- Sprite（精灵渲染）
- UITransform（尺寸 64x64）
- Wall.ts（墙壁脚本）
- SpriteAnimationHelper.ts（动画辅助）

**Wall.ts 属性：**
| 属性 | 值 |
|------|---|
| sprite | 本节点的 Sprite 组件 |
| hp | 1 |
| maxHp | 1 |
| type | normal |
| isDead | false |

---

## 三、资源导入步骤

### 1. 精灵图导入（已完成文件，需 Editor 生成 SpriteFrame）

在 Cocos Creator 中：
1. 打开 `assets/resources/sprites/`
2. 对每个子文件夹（lv1, lv2, lv3, lv4, enemy_n, enemy_n_death, enemy_elite, enemy_elite_break, enemy_elite_break_idle, enemy_elite_death）：
   - 右键 `sprite.png` → "Sprite Editor"
   - 或让 Editor 自动生成 SpriteFrame（点击资源即可）
3. 确认每个 sprite.png 生成了对应的 `.spriteFrame` 资源

### 2. 关卡数据

已存在于 `assets/resources/levels/level_1.json` ~ `level_18.json`，无需额外操作。

---

## 四、可选补充（不影响核心玩法）

### 音频资源
路径：`assets/resources/audio/`
| 文件名 | 用途 |
|--------|------|
| bomb_place.mp3 | 放置炸弹 |
| bomb_explode.mp3 | 炸弹爆炸 |
| bomb_upgrade.mp3 | 炸弹升级 |
| wall_break.mp3 | 墙壁受损 |
| wall_destroy.mp3 | 墙壁摧毁 |
| victory.mp3 | 胜利 |
| game_over.mp3 | 失败 |
| click.mp3 | 按钮点击 |
| bgm.mp3 | 背景音乐 |

### 粒子预制体
- ExplosionParticle.prefab（爆炸特效）
- UpgradeParticle.prefab（升级特效）
- VictoryParticle.prefab（胜利特效）

---

## 五、验证清单

场景搭建完成后，按此清单验证：

- [ ] Game.scene 能正常打开
- [ ] GameRoot 上挂载了 GameScene.ts
- [ ] bombPrefab、wallPrefab 已绑定
- [ ] gameLayer、uiLayer、particleLayer 已绑定
- [ ] 点击运行，能看到网格和初始墙壁
- [ ] 点击网格能放置炸弹
- [ ] 炸弹3秒后爆炸，摧毁墙壁
- [ ] 所有墙壁摧毁后显示胜利面板
- [ ] LevelSelect.scene 能显示18个关卡按钮
- [ ] MainMenu.scene 能跳转 Game 和 LevelSelect

---

## 六、注意事项

1. **网格大小**：GameScene 中 gridSize 默认 5，可在 LevelManager 的关卡配置中调整
2. **坐标系**：所有游戏对象在 gameLayer 下，使用本地坐标
3. **触摸事件**：GameScene 已绑定 TOUCH_END，确保 gameLayer 有 UITransform 和 BlockInputEvents（如果需要）
4. **性能**：精灵图使用 AutoAtlas 已配置，无需额外合图

---

**文档生成时间**：2026-05-29
**适用版本**：Cocos Creator 3.8.8
