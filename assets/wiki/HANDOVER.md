# 项目交接文档

## 项目状态

### 当前版本
- **工作区状态**：基础版本（方块墙壁+圆形炸弹）
- **最后备份**：versions/v20260507_0128_current/
- **可工作版本**：versions/v20260507_0105_base/（有截图证明）

### 工程结构
```
src/
├── main.js          # 游戏主入口（BombWallGame类）
├── core/
│   ├── GameLogic.js # 核心逻辑（倒计时、爆炸、胜负）
│   └── LevelSystem.js # 关卡系统
├── view/
│   ├── Renderer.js  # Canvas渲染器（当前为简化版）
│   ├── Animator.js  # 动画管理
│   ├── ParticleSystem.js # 粒子效果
│   └── UIManager.js # UI界面
├── data/
│   ├── LevelData.js # 18关配置
│   └── Storage.js   # 本地存档
├── system/
│   ├── AudioManager.js # 音效
│   └── AdManager.js    # 广告
├── utils/
│   ├── Constants.js    # 常量
│   ├── EventBus.js     # 事件总线（未加载）
│   ├── Helpers.js      # 工具函数（未加载）
│   └── StateMachine.js # 状态机（未加载）
└── app/              # 场景系统（未加载）
    ├── GameApp.js
    ├── SceneManager.js
    └── scenes/         # 7个场景实现
```

### 美术资源
```
res/                    # 主包资源（2.6MB）
├── characters/         # 角色精灵图（lv1~4.png）
└── ui/                 # UI资源（LoginTitle.png, Loading.png, numbers/）

subpackage/             # 分包资源（2.9MB）
├── sprites/            # 帧动画精灵图
│   ├── lv1~4/          # 炸弹牛（30帧，75x56每帧）
│   └── enemy_n~elite/  # 敌人（30帧，64x64每帧）
└── ui/                 # 分包UI资源
```

## 凌晨5点成功版本的关键配置

### game.js
- 不创建任何Canvas
- 按顺序require所有模块
- 调用initGame()启动

### main.js
- 优先使用全局`canvas`变量
- 注入`roundRect` polyfill：`Object.getPrototypeOf(ctx).roundRect = ...`
- Renderer.resize()只在尺寸变化时重置画布

### Renderer.js（成功版本）
- 简化绘制：方块墙壁+圆形炸弹
- 不依赖精灵图
- 优先使用全局canvas

## 当前问题

### 未使用精灵图
当前Renderer.js使用几何图形，没有使用subpackage/sprites/下的帧动画资源。

### 未加载utils/和app/
main.js没有加载：
- utils/Constants.js
- utils/EventBus.js
- utils/Helpers.js
- utils/StateMachine.js
- app/下的场景系统

### 缺少模块加载
main.js的加载顺序：
```
1. Storage.js
2. LevelData.js
3. GameLogic.js
4. LevelSystem.js
5. ResourceManager.js
6. AudioManager.js
7. AdManager.js
8. Animator.js
9. ParticleSystem.js
10. Renderer.js
11. UIManager.js
12. main.js
```

但WECHAT_SPEC.md要求：
```
1. Storage.js
2. LevelData.js
3. Constants.js      # 未加载
4. Helpers.js        # 未加载
5. EventBus.js       # 未加载
6. StateMachine.js   # 未加载
7. GameLogic.js
8. LevelSystem.js
9. ResourceManager.js
10. Renderer.js
11. Animator.js
12. ParticleSystem.js
13. UIManager.js
14. AudioManager.js
15. AdManager.js
16. GameApp.js       # 未加载
17. main.js
```

## 设计文档

| 文档 | 路径 | 内容 |
|------|------|------|
| DESIGN_INDEX.md | ./ | 总索引 |
| GAMEPLAY_DESIGN.md | wiki/ | 核心玩法 |
| LEVEL_DESIGN.md | wiki/ | 18关配置 |
| WECHAT_SPEC.md | wiki/ | 微信开发规范 |
| ASSET_ADAPTATION.md | wiki/ | 精灵图适配配置 |
| ARCHITECTURE.md | ./ | 工程架构 |

## 重要教训

1. **game.js绝不能创建Canvas**
2. **main.js必须使用全局canvas变量**
3. **Renderer.resize()只在尺寸变化时重置画布**
4. **加入而不是修改** — 保留旧方法，添加新方法
5. **失败后回退，不叠加**
6. **备份：save-version.sh**
7. **推送：push-to-device.sh**

## 工作流程脚本

```bash
# 保存版本
bash scripts/save-version.sh "版本名" "状态" "说明"

# 推送真机（带语法检查和安全检查）
bash scripts/push-to-device.sh
```

## 交接时间
2026-05-07 01:35

## 交接人
Pioneer（当前AI）

## 待办事项
1. [ ] 确认基础版本在真机正常工作
2. [ ] 按WECHAT_SPEC.md加载所有模块（Constants.js, Helpers.js, EventBus.js, StateMachine.js, GameApp.js）
3. [ ] 使用精灵图资源（subpackage/sprites/）
4. [ ] 按ASSET_ADAPTATION.md配置资产适配
5. [ ] 启用app/层的场景系统
6. [ ] 验证18关全部可玩

