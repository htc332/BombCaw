# Cocos Creator Project - Bomb Wall

## Git 配置

### 初始设置（已完成）
```bash
git init
git remote add origin https://github.com/hutianchi20111-cmyk/CowBomb.git
```

### 日常备份流程

**1. 备份（修改前必须）**
```bash
git add -A
git commit -m "backup: 修改前_功能描述"
git push origin main
```

**2. 修改代码**
- 在 Cocos Creator 中编辑
- 或修改 extensions/cocos-mcp-server/ 插件

**3. 提交更新**
```bash
git add -A
git commit -m "feat/fix/doc: 具体描述"
git push origin main
```

### Git 忽略配置

已配置 `.gitignore`：
- `library/` - 自动生成的缓存（可重建）
- `temp/` - 临时文件
- `local/` - 本地设置
- `profiles/` - 配置文件
- `build/` - 构建输出

### 重要原则

- **每次修改前备份**
- **不要删除 `library/` 目录**（会导致项目损坏）
- **提交信息规范**：`feat:`/`fix:`/`doc:` 前缀

---

## Cocos MCP Server 插件

### 部署状态
- ✅ 已克隆到 `extensions/cocos-mcp-server/`
- ✅ 已构建（`npm install` + `npm run build`）
- ✅ 技能已安装到 OpenClaw

### 使用方法
1. Cocos Creator → 扩展 → 扩展管理器 → 启用 cocos-mcp-server
2. 扩展 → Cocos MCP Server → 启动服务器
3. 默认地址：`http://127.0.0.1:3000/mcp`

---

_项目路径: /Users/htc332/.openclaw/workspace-pioneer/cocos-projects/bomb-wall/_
