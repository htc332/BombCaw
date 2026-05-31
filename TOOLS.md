# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.


## Cocos Creator MCP 技能
- **MCP 服务器**: `http://127.0.0.1:3000/mcp`
- **完整文档**: `SKILL.md` (cocos-mcp-server)
- **可用工具**:
  - 项目: project_get_project_info, project_get_assets, project_get_build_settings
  - 场景: scene_get_current_scene, scene_get_scene_list, scene_open_scene, scene_get_scene_hierarchy
  - 节点: node_get_all_nodes, node_find_node_by_name, node_create_node, node_set_node_property
  - 组件: component_get_components, component_add_component, component_set_component_property
  - 预制体: prefab_get_prefab_list, prefab_instantiate_prefab
  - 日志: debug_get_console_logs, debug_get_editor_info, debug_clear_console_logs
- **限制**:
  - 脚本编辑必须使用文件系统工具（read/edit/write），MCP 不提供脚本编辑
  - 构建发布必须使用终端命令，MCP 构建功能受限
- **工作流**:
  1. 遇到问题先调用 debug_get_console_logs 查看错误
  2. 使用 scene_get_scene_hierarchy 检查场景结构
  3. 使用 component_get_components 检查组件状态
  4. 脚本修改使用文件系统工具
  5. 构建使用终端命令
- **项目路径**: `/Users/htc332/Desktop/bomb-wall`
- **Cocos 版本**: 3.8.8
- **启动方式**: `open -a "CocosCreator"` 然后在编辑器中启动 MCP Server 扩展

## Cocos Creator MCP 技能
- **MCP 服务器**: `http://127.0.0.1:3000/mcp`
- **完整文档**: `cocos-mcp-config.md`
- **可用工具**:
  - 项目: project_get_project_info, project_get_assets, project_get_build_settings
  - 场景: scene_get_current_scene, scene_get_scene_list, scene_open_scene, scene_get_scene_hierarchy
  - 节点: node_get_all_nodes, node_find_node_by_name, node_create_node, node_set_node_property
  - 组件: component_get_components, component_add_component, component_set_component_property
  - 预制体: prefab_get_prefab_list, prefab_instantiate_prefab
  - 日志: debug_get_console_logs, debug_get_editor_info, debug_clear_console_logs
- **限制**:
  - 脚本编辑必须使用文件系统工具（read/edit/write），MCP 不提供脚本编辑
  - 构建发布必须使用终端命令，MCP 构建功能受限
- **工作流**:
  1. 遇到问题先调用 debug_get_console_logs 查看错误
  2. 使用 scene_get_scene_hierarchy 检查场景结构
  3. 使用 component_get_components 检查组件状态
  4. 脚本修改使用文件系统工具
  5. 构建使用终端命令
- **项目路径**: `/Users/htc332/Desktop/bomb-wall`
- **Cocos 版本**: 3.8.8
- **启动方式**: `open -a "CocosCreator"` 然后在编辑器中启动 MCP Server 扩展

## bomb-wall 项目
- 工程地址：`~/Desktop/bomb-wall/`
- 类型：Cocos Creator 微信小游戏
- 记录时间：2026-05-28
- **MCP 服务器**: `http://127.0.0.1:3000/mcp`
- **MCP 配置**: `cocos-mcp-config.md`
- **Cocos 版本**: 3.8.8
- **常用命令**:
  - 查看日志: `curl -X POST http://127.0.0.1:3000/mcp -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"debug_get_console_logs","arguments":{}}}'`
  - 获取场景层级: `curl -X POST http://127.0.0.1:3000/mcp -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"scene_get_scene_hierarchy","arguments":{"includeComponents":true}}}'`
  - 构建: `/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator --project ~/Desktop/bomb-wall --build "platform=wechatgame;debug=true"`

