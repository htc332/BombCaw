#!/bin/bash
# auto-backup.sh — 自动备份关键文件
# 用法: bash auto-backup.sh [备注]

PROJECT_DIR="/Users/htc332/.openclaw/workspace-pioneer/bomb-wall-canvas"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$PROJECT_DIR/backups/$TIMESTAMP"
NOTE="${1:-auto}"

echo "=== 自动备份 [$NOTE] ==="
echo "时间: $(date)"
echo "目录: $BACKUP_DIR"

mkdir -p "$BACKUP_DIR"

# 备份所有关键 JS 文件
for file in \
  "$PROJECT_DIR/game.js" \
  "$PROJECT_DIR/src/main.js" \
  "$PROJECT_DIR/src/view/Renderer.js" \
  "$PROJECT_DIR/src/core/GameLogic.js" \
  "$PROJECT_DIR/src/core/LevelSystem.js" \
  "$PROJECT_DIR/src/data/LevelData.js" \
  "$PROJECT_DIR/src/data/Storage.js" \
  "$PROJECT_DIR/src/view/Animator.js" \
  "$PROJECT_DIR/src/view/ParticleSystem.js" \
  "$PROJECT_DIR/src/view/UIManager.js" \
  "$PROJECT_DIR/src/managers/ResourceManager.js" \
  "$PROJECT_DIR/src/system/AudioManager.js" \
  "$PROJECT_DIR/src/system/AdManager.js"
do
  if [ -f "$file" ]; then
    cp "$file" "$BACKUP_DIR/"
    echo "  ✅ $(basename $file)"
  fi
done

# 记录备份原因
echo "$TIMESTAMP — $NOTE" >> "$PROJECT_DIR/backups/backup-log.txt"

echo ""
echo "=== 备份完成 ==="
echo "如需恢复: cp $BACKUP_DIR/* src/ game.js"
