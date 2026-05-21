#!/bin/bash
# Cocos Creator CLI 构建脚本

PROJECT_PATH="/Users/htc332/.openclaw/workspace-pioneer/cocos-projects/bomb-wall"
COCOS="/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator"

echo "Step 1: 尝试使用 Cocos CLI 构建..."

# 方法1: 使用 cocos-dashboard 的 CLI（如果可用）
if command -v cocos-dashboard &> /dev/null; then
    echo "使用 cocos-dashboard CLI..."
    cocos-dashboard build --project "$PROJECT_PATH" --platform wechatgame
    exit 0
fi

# 方法2: 使用 CocosCreator 的 --build 参数
echo "尝试 CocosCreator --build 参数..."
"$COCOS" --project "$PROJECT_PATH" --build "platform=wechatgame;debug=true" 2>&1

# 检查构建输出
if [ -d "$PROJECT_PATH/build/wechatgame" ]; then
    echo "✅ 构建成功！"
    ls -la "$PROJECT_PATH/build/wechatgame"
else
    echo "❌ 构建失败或输出目录不存在"
fi
