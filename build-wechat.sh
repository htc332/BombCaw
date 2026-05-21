#!/bin/bash
# Cocos Creator 微信小游戏构建脚本

PROJECT_PATH="/Users/htc332/.openclaw/workspace-pioneer/cocos-projects/bomb-wall"
BUILD_PATH="$PROJECT_PATH/build/wechatgame"

# 1. 先通过 MCP 尝试构建
echo "Step 1: 尝试 MCP 构建..."
curl -s -X POST http://127.0.0.1:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "project_build_project",
      "arguments": {
        "platform": "web-mobile",
        "debug": true
      }
    }
  }'

echo ""
echo "Step 2: 检查构建输出..."
if [ -d "$BUILD_PATH" ]; then
    echo "✅ 构建输出存在: $BUILD_PATH"
    ls -la "$BUILD_PATH"
else
    echo "❌ 构建输出不存在，需要通过 Cocos Editor UI 手动构建"
fi

echo ""
echo "Step 3: 微信开发者工具配置..."
# 检查微信开发者工具
if [ -d "/Applications/wechatwebdevtools.app" ]; then
    echo "✅ 微信开发者工具已安装"
else
    echo "❌ 微信开发者工具未安装"
    exit 1
fi

echo ""
echo "构建完成！"
echo "如果 MCP 构建失败，请手动在 Cocos Editor 中:"
echo "1. 点击菜单 Project -> Build"
echo "2. 选择 WeChat Game 平台"
echo "3. 点击 Build"
