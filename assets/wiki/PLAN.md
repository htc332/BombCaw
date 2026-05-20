修改计划 [2026-05-08 09:50]
需求：添加 console-capture.js 日志捕获功能
影响文件：
- game.js：顶部注入日志捕获代码
修改顺序：
1. 在 game.js 最顶部添加 console-capture.js 代码
2. 确保在 wx 对象可用后初始化
回退命令：git reset --hard HEAD~1
预期结果：
- console.log/error/warn 自动保存到 wx.env.USER_DATA_PATH + '/console.log'
- 可以通过文件系统读取日志
验证方法：
- 编译后检查 Console 是否有 "[Capture]" 初始化日志
- 检查日志文件是否生成
