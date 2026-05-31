# GitHub 备份配置

## 仓库信息
- **仓库地址**: https://github.com/htc332/BombCaw.git
- **项目路径**: /Users/htc332/Desktop/bomb-wall
- **远程名称**: origin

## 认证信息
- **用户名**: hutianchi20111-cmyk
- **Token**: [已移除，请查看本地密码管理器]
- **权限**: 已具备 push 权限（token 已嵌入 remote URL）

## 备份策略
- **自动提交**: 修改后自动 git add + commit + push
- **提交信息格式**: `[Auto] 修改内容简述`
- **分支**: main

## 使用方法
```bash
cd /Users/htc332/Desktop/bomb-wall
git add .
git commit -m "[Auto] 修改说明"
git push origin main
```

## 注意事项
- Token 已过期或失效时需要更新 remote URL
- 更新命令: `git remote set-url origin https://新token@github.com/htc332/BombCaw.git`
