#!/bin/bash
# save-version.sh — 保存当前可用版本
# 用法: bash save-version.sh "版本名称" "状态描述"

PROJECT_DIR="/Users/htc332/.openclaw/workspace-pioneer/bomb-wall-canvas"
VERSIONS_DIR="$PROJECT_DIR/versions"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
VERSION_NAME="${1:-v_$TIMESTAMP}"
STATUS="${2:-working}"
NOTE="${3:-}"
VERSION_PATH="$VERSIONS_DIR/$VERSION_NAME"

echo "=== 保存版本: $VERSION_NAME ==="
echo "状态: $STATUS"
echo "时间: $(date)"

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

for dir in core data view managers system app utils; do
  if [ -d "$PROJECT_DIR/src/$dir" ]; then
    cp "$PROJECT_DIR/src/$dir"/*.js "$VERSION_PATH/src/$dir/" 2>/dev/null
  fi
done

# 创建版本说明
cat > "$VERSION_PATH/VERSION_INFO.txt" << EOF
版本: $VERSION_NAME
创建时间: $(date +"%Y-%m-%d %H:%M:%S")
状态: $STATUS
备注: $NOTE
EOF

# 记录到版本日志
mkdir -p "$VERSIONS_DIR"
echo "$TIMESTAMP | $VERSION_NAME | $STATUS | $NOTE" >> "$VERSIONS_DIR/version-history.txt"

echo ""
echo "=== 版本已保存 ==="
echo "路径: $VERSION_PATH"
echo ""
echo "历史版本:"
cat "$VERSIONS_DIR/version-history.txt" | tail -10
echo ""
echo "恢复命令:"
echo "  cp -r $VERSION_PATH/* $PROJECT_DIR/"
