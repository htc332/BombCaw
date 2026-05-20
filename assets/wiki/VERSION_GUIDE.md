# 版本管理使用说明

## 保存版本（完成一个可用版本后执行）

```bash
cd bomb-wall-canvas
bash scripts/save-version.sh "版本名称" "状态" "备注"
```

示例：
```bash
bash scripts/save-version.sh "v1_base_game" "working" "基础游戏功能完成"
bash scripts/save-version.sh "v2_animation" "working" "添加动画效果"
bash scripts/save-version.sh "v3_bugfix" "working" "修复触摸问题"
```

## 查看历史版本

```bash
cat versions/version-history.txt
```

## 恢复到某个版本

```bash
# 复制版本到项目根目录
cp -r versions/v1_base_game/* .

# 然后推送测试
bash scripts/push-to-device.sh
```

## 版本目录结构

```
versions/
├── v20260507_0105_base/     # 版本目录
│   ├── VERSION_INFO.txt      # 版本信息
│   ├── game.js               # 入口文件
│   ├── game.json             # 配置
│   ├── project.config.json   # 项目配置
│   └── src/                  # 源代码
│       ├── core/
│       ├── data/
│       ├── view/
│       ├── managers/
│       └── system/
├── v20260507_0200_anim/     # 另一个版本
└── version-history.txt        # 版本历史记录
```

## 当前版本

- **最新可用版本**: `v20260507_0105_base`
- **状态**: 基础功能恢复（墙壁、炸弹、触摸正常）
- **保存时间**: 2026-05-07 01:03

---
