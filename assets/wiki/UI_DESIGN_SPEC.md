# UI 预制体设计规范

## 按 Cocos 引擎设计原则

### 1. 节点层级结构

```
Canvas (cc.Canvas)
├── MainMenuPanel (Node)
│   ├── Background (Sprite)
│   ├── Title (Label)
│   ├── BtnStart (Button)
│   ├── BtnSettings (Button)
│   └── BtnExit (Button)
│
├── GamePanel (Node)
│   ├── HUD (Node)
│   │   ├── ScoreLabel (Label)
│   │   ├── LevelLabel (Label)
│   │   ├── BombsLeftLabel (Label)
│   │   ├── ProgressBar (ProgressBar)
│   │   ├── BtnPause (Button)
│   │   └── ComboLabel (Label)
│   ├── GridContainer (Node)
│   │   └── Grid (Node + GridManager)
│   ├── BombContainer (Node)
│   └── WallContainer (Node)
│
├── PausePanel (Node)
│   ├── Background (Sprite + UIOpacity)
│   ├── Title (Label)
│   ├── BtnResume (Button)
│   ├── BtnRestart (Button)
│   └── BtnBackMenu (Button)
│
├── ResultPanel (Node)
│   ├── Background (Sprite)
│   ├── Title (Label)
│   ├── ScoreLabel (Label)
│   ├── StarContainer (Node)
│   │   ├── Star1 (Sprite)
│   │   ├── Star2 (Sprite)
│   │   └── Star3 (Sprite)
│   ├── BtnNext (Button)
│   ├── BtnRestart (Button)
│   └── BtnBackMenu (Button)
│
└── FloatTextContainer (Node)
```

### 2. 组件配置

#### Canvas
- **组件**: Canvas, UITransform
- **设计分辨率**: 720 x 1280 (竖屏)
- **适配策略**: FIT_HEIGHT

#### 按钮规范
- **组件**: Button, Sprite, Label
- **过渡类型**: SCALE
- **缩放因子**: 0.95
- **颜色**: 
  - Normal: #FFFFFF
  - Pressed: #CCCCCC
  - Hover: #F0F0F0

#### 标签规范
- **组件**: Label
- **字体**: 系统默认或自定义 TTF
- **大小**: 标题 48px, 正文 32px, HUD 24px
- **颜色**: 标题 #FFD700, 正文 #FFFFFF, 提示 #AAAAAA

#### 进度条规范
- **组件**: ProgressBar
- **样式**: 圆角矩形
- **颜色**: 前景 #4CAF50, 背景 #333333

### 3. 动画规范

#### 面板切换
- 使用 UIOpacity 淡入淡出
- 时长: 0.3 秒
- 缓动: easeOut

#### 浮动文字
- 向上移动 50px
- 同时淡出
- 时长: 1.5 秒
- 自动销毁

#### 按钮点击
- 缩放至 0.95
- 时长: 0.1 秒
- 弹性恢复

### 4. 适配规则

#### 安全区
- 顶部: 留 88px (刘海屏)
- 底部: 留 34px (Home 指示器)
- 使用 Widget 组件适配

#### 多分辨率
- 基准: iPhone 6/7/8 (750x1334)
- 缩放: 基于高度适配
- 最小尺寸: 640x960

---

_文档位置: assets/wiki/UI_DESIGN_SPEC.md_
