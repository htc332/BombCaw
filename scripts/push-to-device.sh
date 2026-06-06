#!/bin/bash
# push-to-device.sh — 快速推送到真机
# 用法: bash push-to-device.sh

PROJECT_DIR="/Users/htc332/.openclaw/workspace-pioneer/bomb-wall-canvas"

echo "=== 推送到真机 ==="

# 1. 语法检查
echo "1. 语法检查..."
cd "$PROJECT_DIR"
for f in game.js src/*/*.js; do
  if ! node --check "$f" 2>/dev/null; then
    echo "   ❌ 语法错误: $f"
    exit 1
  fi
done
echo "   ✅ 语法检查通过"

# 2. 安全检查
echo "2. 安全检查..."
if grep -q "wx.createCanvas" game.js; then
  echo "   ❌ game.js 中有 wx.createCanvas"
  exit 1
fi
echo "   ✅ 安全检查通过"

# 3. 编译
echo "3. 编译..."
/Applications/wechatwebdevtools.app/Contents/MacOS/cli cache --project "$PROJECT_DIR" --port 30924 --clean compile
if [ $? -ne 0 ]; then
  echo "   ❌ 编译失败"
  exit 1
fi
echo "   ✅ 编译成功"

# 4. 推送预览
echo "4. 推送到真机..."
sleep 2

# 使用 AppleScript 点击编译并预览
osascript -e 'tell application "微信开发者工具" to activate'
sleep 0.5

python3 << 'EOF'
from pynput.keyboard import Controller, Key
import time
k = Controller()
k.press(Key.cmd)
k.press('b')
k.release('b')
k.release(Key.cmd)
EOF

sleep 3

/Applications/wechatwebdevtools.app/Contents/MacOS/cli auto-preview --project "$PROJECT_DIR" --port 30924

if [ $? -eq 0 ]; then
  echo "   ✅ 推送成功"
else
  echo "   ❌ 推送失败"
  exit 1
fi

echo ""
echo "=== 完成 ==="
echo "请在手机上刷新小程序"
