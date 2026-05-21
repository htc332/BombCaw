tell application "CocosCreator" to activate
tell application "System Events"
    tell process "CocosCreator"
        -- 等待构建面板打开
        delay 2
        
        -- 尝试点击构建按钮（根据界面元素名称）
        try
            click button "Build" of window 1
            display notification "Build started" with title "Cocos Build"
        on error
            -- 如果找不到按钮，尝试键盘导航
            key code 48 -- Tab key
            delay 0.5
            key code 48 -- Tab
            delay 0.5
            key code 48 -- Tab
            delay 0.5
            key code 36 -- Enter key
        end try
    end tell
end tell
