# Cocos MCP Server 使用流程

## 配置
- 服务器地址：`http://127.0.0.1:3000/mcp`
- 配置命令：`mcporter config add cocos-creator http://127.0.0.1:3000/mcp`
- 查看工具：`mcporter list cocos-creator --schema`

## 常用工具
- 场景信息：`mcporter call cocos-creator.scene_get_current_scene`
- 场景层级：`mcporter call cocos-creator.scene_get_scene_hierarchy`
- 控制台日志：`mcporter call cocos-creator.debug_get_console_logs limit=50`
- Prefab 列表：`mcporter call cocos-creator.prefab_get_prefab_list`
- 实例化 Prefab：`mcporter call cocos-creator.prefab_instantiate_prefab prefabPath="db://assets/prefabs/XXX.prefab" parentUuid="XXX"

## 项目路径
- `~/Desktop/bomb-wall/`
- Cocos 版本：3.8.8

## 教训
- 修改 prefab 不需要重启编辑器，Cocos 会自动检测文件变化
- 清理缓存只在缓存损坏时需要，不是每次都要做
- 先用 MCP 获取日志和状态，不要凭猜测修复
- Prefab 迁移错误可能是缺少 `ver` 字段，不是 `__id__` 越界
- 控制台操作：清理用 `debug_clear_console`，查看用 `debug_get_console_logs`
