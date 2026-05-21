#!/bin/bash
# Cocos Creator 微信小游戏分包构建脚本

PROJECT_PATH="/Users/htc332/.openclaw/workspace-pioneer/cocos-projects/bomb-wall"
COCOS="/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator"

echo "Step 1: 使用分包配置重新构建..."

# 使用分包配置构建
"$COCOS" --project "$PROJECT_PATH" --build "platform=wechatgame;debug=false;md5Cache=true;mainBundleCompressionType=brotli;mainBundleIsRemote=false;assetsRemoteType=none;buildSubPackage=true" 2>&1

echo ""
echo "Step 2: 检查构建输出..."
if [ -d "$PROJECT_PATH/build/wechatgame" ]; then
    echo "✅ 构建输出存在"
    du -sh "$PROJECT_PATH/build/wechatgame"
    
    # 检查主包大小
    MAIN_SIZE=$(du -sk "$PROJECT_PATH/build/wechatgame" | awk '{print $1}')
    echo "主包大小: ${MAIN_SIZE}KB"
    
    if [ $MAIN_SIZE -lt 4096 ]; then
        echo "✅ 主包小于 4MB"
    else
        echo "⚠️ 主包仍大于 4MB，需要进一步优化"
    fi
else
    echo "❌ 构建失败"
fi
