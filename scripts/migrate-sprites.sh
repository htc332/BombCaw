#!/bin/bash
# 迁移精灵图资源脚本

SOURCE_DIR="/Users/htc332/.openclaw/workspace-pioneer/bomb-wall-canvas/subpackage/sprites"
TARGET_DIR="/Users/htc332/.openclaw/workspace-pioneer/cocos-projects/bomb-wall/assets/resources/sprites"

# 复制炸弹精灵图
for level in lv1 lv2 lv3 lv4; do
    if [ -d "$SOURCE_DIR/$level" ]; then
        cp -R "$SOURCE_DIR/$level"/* "$TARGET_DIR/$level/" 2>/dev/null
        echo "✅ Copied $level sprites"
    fi
done

# 复制敌人精灵图
for enemy in enemy_n enemy_n_death enemy_elite enemy_elite_break enemy_elite_break_idle enemy_elite_death; do
    if [ -d "$SOURCE_DIR/$enemy" ]; then
        cp -R "$SOURCE_DIR/$enemy"/* "$TARGET_DIR/$enemy/" 2>/dev/null
        echo "✅ Copied $enemy sprites"
    fi
done

# 复制静态炸弹
if [ -d "$SOURCE_DIR/static_bombs" ]; then
    cp -R "$SOURCE_DIR/static_bombs"/* "$TARGET_DIR/static_bombs/" 2>/dev/null
    echo "✅ Copied static_bombs"
fi

echo "🎉 Sprite migration complete!"
