#!/bin/bash
# Cocos Creator 微信小游戏构建 - 使用引擎裁剪

PROJECT_PATH="/Users/htc332/.openclaw/workspace-pioneer/cocos-projects/bomb-wall"
COCOS="/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator"

echo "Step 1: 清理旧构建..."
rm -rf "$PROJECT_PATH/build/wechatgame"

echo ""
echo "Step 2: 使用引擎裁剪配置构建..."
# 关键配置：
# - includeModules: 只包含必要模块
# - 排除 3D/物理/地形等不需要的模块
"$COCOS" \
  --project "$PROJECT_PATH" \
  --build "platform=wechatgame;debug=false;md5Cache=true;includeModules=base,gfx,renderer,2d,ui,animation,audio,network;excludeModules=3d,physics,terrain,particle,lighting;wechatGameAppId=wx6ac3f5090a6b99c5" \
  2>&1 | tail -30

echo ""
echo "Step 3: 检查构建输出..."
if [ -d "$PROJECT_PATH/build/wechatgame" ]; then
    echo "✅ 构建输出存在"
    du -sh "$PROJECT_PATH/build/wechatgame"
    
    echo ""
    echo "构建内容："
    du -sh "$PROJECT_PATH/build/wechatgame"/* | sort -rh | head -10
    
    # 检查主包大小
    MAIN_SIZE=$(du -sk "$PROJECT_PATH/build/wechatgame" | awk '{print $1}')
    echo ""
    echo "主包大小: ${MAIN_SIZE}KB"
    
    if [ $MAIN_SIZE -lt 4096 ]; then
        echo "✅ 主包小于 4MB，可以推送预览！"
    else
        echo "⚠️ 主包仍大于 4MB"
        echo "建议：在 Cocos Editor 中手动配置分包"
    fi
else
    echo "❌ 构建失败"
fi
