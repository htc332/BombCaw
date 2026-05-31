# Cocos Creator MCP Server 技能文档

## 概述

Cocos Creator MCP Server 是一个基于 JSON-RPC 2.0 协议的 MCP (Model Context Protocol) 服务器，提供了对 Cocos Creator 编辑器的程序化控制能力。通过该服务器，可以远程操作 Cocos Creator 项目的场景、节点、资源、构建等。

**服务器地址**: `http://127.0.0.1:3000/mcp`
**通信协议**: JSON-RPC 2.0 over HTTP POST
**项目路径**: `/Users/htc332/Desktop/bomb-wall`

---

## 调用方式

所有工具通过 JSON-RPC 调用，基本格式如下：

```bash
curl -X POST http://127.0.0.1:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'
```

调用具体工具时，使用 `tools/call` 方法：

```bash
curl -X POST http://127.0.0.1:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "工具名称",
      "arguments": {
        "参数名": "参数值"
      }
    }
  }'
```

---

## 工具分类

### 一、项目相关工具 (project_*)

#### 1. project_get_project_info
获取当前项目的基本信息。

- **参数**: 无
- **返回值示例**:
```json
{
  "success": true,
  "data": {
    "name": "bomb-wall-cocos",
    "path": "/Users/htc332/Desktop/bomb-wall",
    "uuid": "89b9fc99-72e4-462c-ab29-97736b149d23",
    "version": "1.0.0",
    "cocosVersion": "Unknown",
    "config": { ... }
  }
}
```

#### 2. project_get_assets
获取项目资源列表。

- **参数**:
  - `type` (string, 可选): 资源类型过滤，如 `"all"`, `"cc.Script"`, `"cc.Prefab"` 等
  - `folder` (string, 可选): 指定目录，如 `"db://assets/scripts"`
- **返回值示例**:
```json
{
  "success": true,
  "data": {
    "type": "all",
    "folder": "db://assets",
    "count": 202,
    "assets": [
      {
        "name": "Bomb.ts",
        "uuid": "6820d868-c474-4595-9621-b2c25255e287",
        "path": "db://assets/scripts/components/Bomb.ts",
        "type": "cc.Script",
        "size": 0,
        "isDirectory": false
      }
    ]
  }
}
```

#### 3. project_get_asset_info
获取指定资源的详细信息。

- **参数**:
  - `assetPath` (string, 必填): 资源路径，如 `"db://assets/scripts/components/Bomb.ts"`
- **返回值示例**:
```json
{
  "success": true,
  "data": {
    "name": "Bomb.ts",
    "uuid": "6820d868-c474-4595-9621-b2c25255e287",
    "path": "db://assets/scripts/components/Bomb.ts",
    "type": "cc.Script",
    "isDirectory": false
  }
}
```

#### 4. project_get_project_settings
获取项目设置。

- **参数**:
  - `category` (string, 可选): 设置类别，如 `"general"`, `"physics"`, `"script"` 等
- **返回值示例**:
```json
{
  "success": true,
  "data": {
    "category": "general",
    "config": {
      "general": {
        "designResolution": {
          "width": 1280,
          "height": 720,
          "fitWidth": true,
          "fitHeight": false
        }
      }
    }
  }
}
```

#### 5. project_get_build_settings
获取构建设置。

- **参数**: 无
- **返回值示例**:
```json
{
  "success": true,
  "data": {
    "builderReady": true,
    "message": "Build settings are limited in MCP plugin environment",
    "availableActions": [
      "Open build panel with open_build_panel",
      "Check builder status with check_builder_status",
      "Start preview server with start_preview_server",
      "Stop preview server with stop_preview_server"
    ],
    "limitation": "Full build configuration requires direct Editor UI access"
  }
}
```

#### 6. project_check_builder_status
检查构建器状态。

- **参数**: 无
- **返回值示例**:
```json
{
  "success": true,
  "data": {
    "ready": true,
    "status": "Builder worker is ready",
    "message": "Builder status checked successfully"
  }
}
```

---

### 二、场景相关工具 (scene_*)

#### 1. scene_get_current_scene
获取当前打开的场景信息。

- **参数**: 无
- **返回值示例**:
```json
{
  "success": true,
  "data": {
    "name": "Main",
    "uuid": "1b7f940f-0554-4780-9926-20aba995ad92",
    "type": "cc.Scene",
    "active": true,
    "nodeCount": 1
  }
}
```

#### 2. scene_get_scene_list
获取项目中的所有场景文件列表。

- **参数**: 无
- **返回值示例**:
```json
{
  "success": true,
  "data": [
    {
      "name": "Main.scene",
      "path": "db://assets/scenes/Main.scene",
      "uuid": "1b7f940f-0554-4780-9926-20aba995ad92"
    }
  ]
}
```

#### 3. scene_open_scene
打开指定场景。

- **参数**:
  - `scenePath` (string, 必填): 场景文件路径，如 `"db://assets/scenes/Main.scene"`
- **返回值示例**:
```json
{
  "success": true,
  "message": "Scene opened: db://assets/scenes/Main.scene"
}
```

#### 4. scene_save_scene
保存当前场景。

- **参数**: 无
- **返回值**: 保存成功/失败信息

#### 5. scene_create_scene
创建新场景。

- **参数**:
  - `sceneName` (string, 必填): 场景名称
  - `savePath` (string, 必填): 保存路径，如 `"db://assets/scenes/NewScene.scene"`

#### 6. scene_save_scene_as
场景另存为。

- **参数**:
  - `path` (string, 必填): 保存路径

#### 7. scene_close_scene
关闭当前场景。

- **参数**: 无

#### 8. scene_get_scene_hierarchy
获取当前场景的完整层级结构。

- **参数**:
  - `includeComponents` (boolean, 可选, 默认 false): 是否包含组件信息
- **返回值示例**:
```json
{
  "success": true,
  "data": {
    "uuid": "1b7f940f-0554-4780-9926-20aba995ad92",
    "name": "Main",
    "type": "cc.Scene",
    "active": true,
    "children": [
      {
        "uuid": "fb2gpuEolC6qdV8hA2Awio",
        "name": "GameRoot",
        "type": "cc.Node",
        "active": true,
        "children": [
          {
            "uuid": "5bcy2jP41I+okt0yzI++fI",
            "name": "gameLayer",
            "type": "cc.Node",
            "active": true,
            "children": []
          },
          {
            "uuid": "37Zo2lsrNFlLXi30qINojm",
            "name": "uiLayer",
            "type": "cc.Node",
            "active": true,
            "children": []
          }
        ]
      }
    ]
  }
}
```

---

### 三、节点相关工具 (node_*)

#### 1. node_get_all_nodes
获取场景中所有节点的列表。

- **参数**: 无
- **返回值示例**:
```json
{
  "success": true,
  "data": {
    "totalNodes": 3,
    "nodes": [
      {
        "uuid": "f41266b4-e4ff-445a-875c-ec1c066158bc",
        "name": "scene-2d",
        "type": "cc.Scene",
        "active": true,
        "path": "scene-2d"
      },
      {
        "uuid": "956erLlrBNipf5WkeuXYa5",
        "name": "Canvas",
        "type": "cc.Node",
        "active": true,
        "path": "/Canvas"
      }
    ]
  }
}
```

#### 2. node_get_node_info
获取指定节点的详细信息。

- **参数**:
  - `uuid` (string, 必填): 节点 UUID
- **返回值示例**:
```json
{
  "success": true,
  "data": {
    "uuid": "956erLlrBNipf5WkeuXYa5",
    "name": "Canvas",
    "active": true,
    "position": {"x": 640, "y": 360, "z": 0},
    "rotation": {"x": 0, "y": 0, "z": 0},
    "scale": {"x": 1, "y": 1, "z": 1},
    "parent": "f41266b4-e4ff-445a-875c-ec1c066158bc",
    "children": [...],
    "components": [...],
    "layer": 33554432,
    "mobility": 0
  }
}
```

#### 3. node_find_node_by_name
根据名称查找节点（精确匹配）。

- **参数**:
  - `name` (string, 必填): 节点名称
- **返回值示例**:
```json
{
  "success": true,
  "data": {
    "uuid": "956erLlrBNipf5WkeuXYa5",
    "name": "Canvas",
    "path": "/Canvas"
  }
}
```

#### 4. node_find_nodes
根据名称模式查找节点（支持模糊匹配）。

- **参数**:
  - `pattern` (string, 必填): 名称模式
  - `exactMatch` (boolean, 可选, 默认 false): 是否精确匹配

#### 5. node_create_node
创建新节点。

- **参数**:
  - `name` (string, 必填): 节点名称
  - `parentUuid` (string, 可选): 父节点 UUID（强烈推荐提供）
  - `nodeType` (string, 可选): 节点类型，`"Node"`, `"2DNode"`, `"3DNode"`，默认 `"Node"`
  - `siblingIndex` (number, 可选, 默认 -1): 同级排序索引
  - `assetUuid` (string, 可选): 从资源实例化（如预制体 UUID）
  - `assetPath` (string, 可选): 从资源路径实例化
  - `components` (array, 可选): 要添加的组件类型列表，如 `["cc.Sprite", "cc.Button"]`
  - `unlinkPrefab` (boolean, 可选, 默认 false): 是否断开预制体关联
  - `keepWorldTransform` (boolean, 可选, 默认 false): 是否保持世界变换
  - `initialTransform` (object, 可选): 初始变换

#### 6. node_set_node_property
设置节点属性。

- **参数**:
  - `uuid` (string, 必填): 节点 UUID
  - `property` (string, 必填): 属性名，如 `"active"`, `"name"`, `"layer"`
  - `value` (any, 必填): 属性值
- **返回值示例**:
```json
{
  "success": true,
  "message": "Property 'name' updated successfully",
  "data": {
    "nodeUuid": "956erLlrBNipf5WkeuXYa5",
    "property": "name",
    "newValue": "Canvas2"
  },
  "verificationData": {
    "nodeInfo": { ... },
    "changeDetails": {
      "property": "name",
      "value": "Canvas2",
      "timestamp": "2026-05-24T08:01:39.501Z"
    }
  }
}
```

#### 7. node_set_node_transform
设置节点变换属性（统一接口，自动处理 2D/3D 差异）。

- **参数**:
  - `uuid` (string, 必填): 节点 UUID
  - `position` (object, 可选): `{x, y, z}`，2D 节点忽略 z
  - `rotation` (object, 可选): `{x, y, z}`，2D 节点只使用 z
  - `scale` (object, 可选): `{x, y, z}`，2D 节点 z 通常为 1
- **返回值示例**:
```json
{
  "success": true,
  "message": "Transform properties updated: position (2D node)",
  "updatedProperties": ["position"],
  "data": {
    "nodeUuid": "956erLlrBNipf5WkeuXYa5",
    "nodeType": "2D",
    "appliedChanges": ["position"],
    "transformConstraints": {
      "position": "x, y only (z ignored)",
      "rotation": "z only (x, y ignored)",
      "scale": "x, y main, z typically 1"
    }
  },
  "verificationData": {
    "nodeInfo": { ... },
    "beforeAfterComparison": {
      "before": { ... },
      "after": { ... }
    }
  }
}
```

#### 8. node_delete_node
删除节点。

- **参数**:
  - `uuid` (string, 必填): 要删除的节点 UUID

#### 9. node_move_node
移动节点到新的父节点。

- **参数**:
  - `nodeUuid` (string, 必填): 要移动的节点 UUID
  - `newParentUuid` (string, 必填): 新父节点 UUID
  - `siblingIndex` (number, 可选): 同级排序索引

---

### 四、组件相关工具 (component_*)

#### 1. component_get_components
获取节点上的所有组件。

- **参数**:
  - `nodeUuid` (string, 必填): 节点 UUID
- **返回值示例**:
```json
{
  "success": true,
  "data": {
    "nodeUuid": "956erLlrBNipf5WkeuXYa5",
    "components": [
      {
        "type": "cc.UITransform",
        "uuid": null,
        "enabled": true,
        "properties": {
          "contentSize": {"value": {"width": 1280, "height": 720}},
          "anchorPoint": {"value": {"x": 0.5, "y": 0.5}}
        }
      },
      {
        "type": "cc.Canvas",
        "uuid": null,
        "enabled": true,
        "properties": {
          "cameraComponent": {"value": {"uuid": "23EHSOJGZOxYSHow8Tn8Ec"}},
          "alignCanvasWithScreen": {"value": true}
        }
      }
    ]
  }
}
```

#### 2. component_get_available_components
获取可用的组件类型列表。

- **参数**:
  - `category` (string, 可选): 组件类别，如 `"all"`, `"ui"`, `"physics"` 等
- **返回值示例**:
```json
{
  "success": true,
  "data": {
    "category": "all",
    "components": [
      "cc.Sprite", "cc.Label", "cc.RichText", "cc.Mask",
      "cc.Graphics", "cc.Button", "cc.Toggle", "cc.Slider",
      "cc.ScrollView", "cc.EditBox", "cc.ProgressBar",
      "cc.RigidBody2D", "cc.BoxCollider2D", "cc.CircleCollider2D",
      "cc.PolygonCollider2D", "cc.Animation", "cc.AnimationClip",
      "cc.SkeletalAnimation", "cc.AudioSource", "cc.Layout",
      "cc.Widget", "cc.PageView", "cc.PageViewIndicator",
      "cc.MotionStreak", "cc.ParticleSystem2D", "cc.Camera",
      "cc.Light", "cc.DirectionalLight", "cc.PointLight", "cc.SpotLight"
    ]
  }
}
```

#### 3. component_add_component
为节点添加组件。

- **参数**:
  - `nodeUuid` (string, 必填): 节点 UUID
  - `componentType` (string, 必填): 组件类型，如 `"cc.Sprite"`

#### 4. component_remove_component
移除节点上的组件。

- **参数**:
  - `nodeUuid` (string, 必填): 节点 UUID
  - `componentType` (string, 必填): 组件类型

#### 5. component_set_component_property
设置组件属性。

- **参数**:
  - `nodeUuid` (string, 必填): 节点 UUID
  - `componentType` (string, 必填): 组件类型
  - `property` (string, 必填): 属性名
  - `value` (any, 必填): 属性值

---

### 五、预制体相关工具 (prefab_*)

#### 1. prefab_get_prefab_list
获取项目中的预制体列表。

- **参数**: 无
- **返回值示例**:
```json
{
  "success": true,
  "data": [
    {
      "name": "Bomb.prefab",
      "path": "db://assets/prefabs/Bomb.prefab",
      "uuid": "ca78e900-5b6a-4768-b62f-c11d78cbc686",
      "folder": "db://assets/prefabs"
    },
    {
      "name": "Wall.prefab",
      "path": "db://assets/prefabs/Wall.prefab",
      "uuid": "9cc63530-9855-47c5-a111-f643b0c00f1a",
      "folder": "db://assets/prefabs"
    }
  ]
}
```

#### 2. prefab_instantiate_prefab
在场景中实例化预制体。

- **参数**:
  - `prefabPath` (string, 必填): 预制体路径
  - `parentUuid` (string, 可选): 父节点 UUID
  - `position` (object, 可选): 初始位置 `{x, y, z}`

#### 3. prefab_create_prefab
从现有节点创建预制体。

- **参数**:
  - `nodeUuid` (string, 必填): 节点 UUID
  - `savePath` (string, 必填): 保存路径

---

### 六、调试与日志工具 (debug_*)

#### 1. debug_get_console_logs
获取控制台日志。

- **参数**:
  - `limit` (number, 可选, 默认 100): 返回日志数量
  - `filter` (string, 可选, 默认 "all"): 过滤类型，`"all"`, `"error"`, `"warn"`, `"info"`, `"log"`
- **返回值示例**:
```json
{
  "success": true,
  "data": {
    "total": 0,
    "returned": 0,
    "logs": []
  }
}
```

#### 2. debug_get_editor_info
获取编辑器信息。

- **参数**: 无
- **返回值示例**:
```json
{
  "success": true,
  "data": {
    "editor": {
      "version": "Unknown",
      "cocosVersion": "Unknown",
      "platform": "darwin",
      "arch": "arm64",
      "nodeVersion": "v20.15.1"
    },
    "project": {
      "name": "bomb-wall-cocos",
      "path": "/Users/htc332/Desktop/bomb-wall",
      "uuid": "89b9fc99-72e4-462c-ab29-97736b149d23"
    },
    "memory": {
      "rss": 474234880,
      "heapTotal": 267845632,
      "heapUsed": 264738076,
      "external": 3439036,
      "arrayBuffers": 0
    },
    "uptime": 716.705458541
  }
}
```

#### 3. debug_clear_console_logs
清空控制台日志。

- **参数**: 无

---

### 七、高级资源工具 (assetAdvanced_*)

#### 1. assetAdvanced_find_unused_assets
查找未使用的资源。

- **参数**:
  - `directory` (string, 可选, 默认 "db://assets"): 扫描目录
  - `excludeDirectories` (array, 可选, 默认 []): 排除的目录

#### 2. assetAdvanced_compress_textures
批量压缩纹理。

- **参数**:
  - `directory` (string, 可选, 默认 "db://assets"): 纹理目录
  - `format` (string, 可选, 默认 "auto"): 压缩格式，`"auto"`, `"jpg"`, `"png"`, `"webp"`
  - `quality` (number, 可选, 默认 0.8): 压缩质量 0.1-1.0

#### 3. assetAdvanced_export_asset_manifest
导出资源清单。

- **参数**:
  - `directory` (string, 可选, 默认 "db://assets"): 目录
  - `format` (string, 可选, 默认 "json"): 导出格式，`"json"`, `"csv"`, `"xml"`
  - `includeMetadata` (boolean, 可选, 默认 true): 包含元数据

---

### 八、验证工具 (validation_*)

#### 1. validation_validate_json_params
验证和修复 JSON 参数。

- **参数**:
  - `jsonString` (string, 必填): 要验证的 JSON 字符串
  - `expectedSchema` (object, 可选): 预期的参数模式

#### 2. validation_safe_string_value
创建安全的字符串值（避免 JSON 解析问题）。

- **参数**:
  - `value` (string, 必填): 字符串值

#### 3. validation_format_mcp_request
格式化完整的 MCP 请求（正确的 JSON 转义）。

- **参数**:
  - `toolName` (string, 必填): 工具名称
  - `arguments` (object, 必填): 工具参数

---

## 使用示例

### 示例 1: 获取项目信息并列出所有场景

```bash
# 获取项目信息
curl -s -X POST http://127.0.0.1:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "project_get_project_info",
      "arguments": {}
    }
  }'

# 列出所有场景
curl -s -X POST http://127.0.0.1:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "scene_get_scene_list",
      "arguments": {}
    }
  }'
```

### 示例 2: 打开场景并获取层级结构

```bash
# 打开场景
curl -s -X POST http://127.0.0.1:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "scene_open_scene",
      "arguments": {
        "scenePath": "db://assets/scenes/Main.scene"
      }
    }
  }'

# 获取层级结构（包含组件）
curl -s -X POST http://127.0.0.1:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/call",
    "params": {
      "name": "scene_get_scene_hierarchy",
      "arguments": {
        "includeComponents": true
      }
    }
  }'
```

### 示例 3: 查找节点并修改属性

```bash
# 查找节点
curl -s -X POST http://127.0.0.1:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "tools/call",
    "params": {
      "name": "node_find_node_by_name",
      "arguments": {
        "name": "Canvas"
      }
    }
  }'

# 修改节点名称
curl -s -X POST http://127.0.0.1:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 6,
    "method": "tools/call",
    "params": {
      "name": "node_set_node_property",
      "arguments": {
        "uuid": "956erLlrBNipf5WkeuXYa5",
        "property": "name",
        "value": "NewCanvas"
      }
    }
  }'

# 修改节点位置
curl -s -X POST http://127.0.0.1:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 7,
    "method": "tools/call",
    "params": {
      "name": "node_set_node_transform",
      "arguments": {
        "uuid": "956erLlrBNipf5WkeuXYa5",
        "position": {"x": 100, "y": 200, "z": 0}
      }
    }
  }'
```

---

## 重要限制
1. **脚本编辑**: MCP 不提供脚本编辑工具，必须使用文件系统操作（read/edit/write）
2. **构建发布**: MCP 构建功能受限，必须使用终端命令 `CocosCreator --build`
3. **编辑器 UI**: 无法通过 MCP 控制编辑器 UI，需要手动操作或使用 AppleScript

## 工作流
1. **遇到问题先调用 debug_get_console_logs 查看错误**
2. **使用 scene_get_scene_hierarchy 检查场景结构**
3. **使用 component_get_components 检查组件状态**
4. **脚本修改使用文件系统工具**
5. **构建使用终端命令**

## 常用路径
- 项目: `/Users/htc332/Desktop/bomb-wall`
- 脚本: `/Users/htc332/Desktop/bomb-wall/assets/scripts/`
- 场景: `/Users/htc332/Desktop/bomb-wall/assets/scenes/`
- 预制体: `/Users/htc332/Desktop/bomb-wall/assets/prefabs/`
- 日志: `/Users/htc332/Desktop/bomb-wall/temp/logs/`
- Cocos Creator: `/Applications/Cocos/Creator/3.8.8/CocosCreator.app`
