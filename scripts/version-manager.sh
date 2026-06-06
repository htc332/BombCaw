#!/bin/bash
# version-manager.sh — 本地版本管理
# 每次完成一个可用版本，自动保存为独立副本

PROJECT_DIR="/Users/htc332/.openclaw/workspace-pioneer/bomb-wall-canvas"
VERSIONS_DIR="$PROJECT_DIR/versions"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
VERSION_NAME="${1:-v_$TIMESTAMP}"
VERSION_PATH="$VERSIONS_DIR/$VERSION_NAME"

echo "=== 保存版本: $VERSION_NAME ==="
echo "时间: $(date)"
echo "路径: $VERSION_PATH"

# 创建版本目录
mkdir -p "$VERSION_PATH"
mkdir -p "$VERSION_PATH/src"
mkdir -p "$VERSION_PATH/src/core"
mkdir -p "$VERSION_PATH/src/data"
mkdir -p "$VERSION_PATH/src/view"
mkdir -p "$VERSION_PATH/src/managers"
mkdir -p "$VERSION_PATH/src/system"

# 复制所有关键文件
cp "$PROJECT_DIR/game.js" "$VERSION_PATH/"
cp "$PROJECT_DIR/game.json" "$VERSION_PATH/" 2>/dev/null
cp "$PROJECT_DIR/project.config.json" "$VERSION_PATH/" 2>/dev/null

for dir in core data view managers system; do
  if [ -d "$PROJECT_DIR/src/$dir" ]; then
    cp "$PROJECT_DIR/src/$dir"/*.js "$VERSION_PATH/src/$dir/" 2>/dev/null
  fi
done

# 创建版本说明
cat > "$VERSION_PATH/VERSION_INFO.txt" << EOF
版本: $VERSION_NAME
创建时间: $(date +"%Y-%m-%d %H:%M:%S")
状态: ${2:-unknown}
备注: ${3:-}
EOF

# 记录到版本日志
echo "$TIMESTAMP | $VERSION_NAME | ${2:-unknown} | ${3:-}" >> "$VERSIONS_DIR/version-history.txt"

echo ""
echo "=== 版本已保存 ==="
echo "总版本数: $(ls -1 $VERSIONS_DIR | wc -l)"
echo ""
echo "历史版本列表:"
tail -5 "$VERSIONS_DIR/version-history.txt" 2>/dev/null || echo "暂无历史记录"
echo ""
echo "如需恢复此版本:"
echo "  cp -r $VERSION_PATH/* $PROJECT_DIR/"
