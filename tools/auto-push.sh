#!/bin/bash
# 自动推送到手机脚本

PROJECT="/Users/htc332/.openclaw/workspace-pioneer/bomb-wall-canvas"
CLI="/Applications/wechatwebdevtools.app/Contents/MacOS/cli"
PORT="30924"

echo "[1/4] 清除缓存..."
$CLI cache --project $PROJECT --port $PORT --clean compile

echo "[2/4] 打开项目..."
$CLI open --project $PROJECT --port $PORT

echo "[3/4] 编译项目..."
osascript -e 'tell application "微信开发者工具" to activate'
sleep 0.5
python3 -c "
from pynput.keyboard import Controller, Key
import time
k = Controller()
k.press(Key.cmd)
k.press('b')
k.release('b')
k.release(Key.cmd)
"
sleep 3

echo "[4/4] 推送到手机..."
$CLI auto-preview --project $PROJECT --port $PORT

echo "✅ 已推送到手机！"
