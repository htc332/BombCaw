#!/bin/bash
# backup-before-push.sh — 推送前备份+安全检查

PROJECT_DIR="/Users/htc332/.openclaw/workspace-pioneer/bomb-wall-canvas"

# 先执行自动备份
bash "$PROJECT_DIR/scripts/auto-backup.sh" "before-push"

echo ""
echo "=== 安全检查 ==="

# 检查危险代码
echo "1. 检查 game.js 是否创建了 Canvas:"
if grep -q "wx.createCanvas" "$PROJECT_DIR/game.js"; then
  echo "   ❌ 危险！game.js 中有 wx.createCanvas"
  echo "   必须移除后才能推送！"
  exit 1
else
  echo "   ✅ game.js 安全"
fi

echo "2. 检查 Renderer 是否会重置 Canvas:"
if grep -q "this.canvas.width\s*=" "$PROJECT_DIR/src/view/Renderer.js"; then
  echo "   ⚠️  Renderer.js 中有 canvas.width 重置"
  echo "   确认只在需要时才重置！"
fi

echo "3. 检查 main.js 使用全局 canvas:"
if grep -q "typeof canvas.*canvas" "$PROJECT_DIR/src/main.js"; then
  echo "   ✅ main.js 检查了全局 canvas"
else
  echo "   ❌ main.js 没有使用全局 canvas！"
  exit 1
fi

echo ""
echo "=== 检查完成，可以推送 ==="
