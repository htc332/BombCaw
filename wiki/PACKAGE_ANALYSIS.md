# 炸弹推墙 - 包体构成分析

## 📊 总体情况

| 包类型 | 大小 | 限制 | 状态 |
|--------|------|------|------|
| **主包 (main)** | ~8.8MB | 4MB | ❌ 超限 120% |
| **子包 (subpackage)** | ~4.8MB | 4MB | ❌ 超限 20% |

---

## 🔴 主包构成 (Main Package)

### 大文件 (>100KB)
| 文件 | 大小 | 类型 | 优化建议 |
|------|------|------|----------|
| `res/ui/LoginTitle.png` | 824K | UI | 压缩至 200K |
| `res/ui/Loading.png` | 684K | UI | 压缩至 200K |
| `res/characters/lv3.png` | 208K | 角色 | 移至子包 |
| `res/sprites/enemy_n_death/sprite.png` | 200K | 精灵图 | 移至子包 |
| `res/characters/lv2.png` | 172K | 角色 | 移至子包 |
| `res/characters/lv4.png` | 168K | 角色 | 移至子包 |
| `res/characters/lv1.png` | 132K | 角色 | 移至子包 |
| `preview_status.png` | 68K | 预览图 | **删除** |
| `devtool_status.png` | 68K | 调试图 | **删除** |

### 中文件 (20-100KB)
- `res/ui/numbers/` 目录：10张数字图片，共 ~360K
- `src/view/Renderer.js`：36K（代码）
- `src/main.js`：24K（代码）
- `src/core/GameLogic.js`：20K（代码）

### 小文件 (<20KB)
- 其他代码文件、JSON 配置、文档等

**主包问题**：`res/` 目录有重复资源！这些应该只在子包中。

---

## 🟠 子包构成 (Subpackage)

### 大文件 (>100KB)
| 文件 | 大小 | 类型 | 优化建议 |
|------|------|------|----------|
| `subpackage/ui/Login.png` | 824K | UI | 压缩至 200K |
| `subpackage/ui/Loading.png` | 684K | UI | 压缩至 200K |
| `subpackage/ui/game_bg_small.png` | 416K | 背景 | 压缩至 150K |
| `subpackage/sprites/enemy_n/sprite.png` | 248K | 精灵图 | 压缩至 100K |
| `subpackage/sprites/enemy_elite/sprite.png` | 236K | 精灵图 | 压缩至 100K |
| `subpackage/sprites/lv3/sprite.png` | 208K | 精灵图 | 压缩至 100K |
| `subpackage/sprites/enemy_elite_break_idle/sprite.png` | 200K | 精灵图 | 压缩至 80K |
| `subpackage/sprites/lv2/sprite.png` | 172K | 精灵图 | 压缩至 80K |
| `subpackage/sprites/lv4/sprite.png` | 168K | 精灵图 | 压缩至 80K |
| `subpackage/sprites/enemy_elite_break/sprite.png` | 108K | 精灵图 | 压缩至 50K |
| `subpackage/sprites/enemy_n_death/sprite.png` | 96K | 精灵图 | 压缩至 40K |

### 废弃文件 (需清理)
```
subpackage/sprites/enemy_elite_break_idle_old_1778905688/sprite.png  (200K)
subpackage/sprites/enemy_elite_old_1778905688/sprite.png           (188K)
subpackage/sprites/enemy_elite_break_old_1778907641/sprite.png      (168K)
subpackage/sprites/enemy_elite_break_old_1778905688/sprite.png      (144K)
```
**共 700K 废弃文件！**

### 数字图片 (可合并为精灵图)
```
subpackage/ui/Numbs/*.png  共 10 张，~360K
```
建议合并为一张精灵图，减少 HTTP 请求。

---

## 🎯 优化方案

### 立即行动 (今晚)
1. **删除废弃文件** (-700K)
   ```bash
   rm -rf subpackage/sprites/*_old_*/
   ```

2. **删除主包重复资源** (-2MB)
   ```bash
   rm -rf res/ui/ res/characters/ res/sprites/
   ```
   这些资源已经在子包中！

3. **删除调试图片** (-136K)
   ```bash
   rm preview_status.png devtool_status.png
   ```

### 短期优化 (明天)
4. **压缩所有 PNG**
   - 使用 tinypng 或 pngquant
   - 目标：所有精灵图 <100K
   - 预计节省：-2MB

5. **合并数字图片为精灵图**
   - 10张数字 → 1张精灵图
   - 预计节省：-200K

6. **背景图进一步压缩**
   - 当前 416K，目标 <150K
   - 使用 JPEG 或更低质量 PNG

### 预期效果
| 优化项 | 节省空间 | 后主包 | 后子包 |
|--------|----------|--------|--------|
| 删除废弃文件 | -700K | - | 4.1MB |
| 删除主包重复 | -2MB | 6.8MB | - |
| 删除调试图 | -136K | 6.7MB | - |
| 压缩 PNG | -2MB | 4.7MB | 2.1MB |
| 合并数字 | -200K | 4.7MB | 1.9MB |
| **总计** | **~5MB** | **<4MB ✅** | **<2MB ✅** |

---

## 📁 目录结构建议

```
bomb-wall-canvas/
├── game.js              # 主入口 (必须)
├── game.json            # 配置 (必须)
├── app.js               # 小程序逻辑 (必须)
├── src/                 # 源代码 (主包)
│   ├── main.js          # 36K
│   ├── core/            # 游戏逻辑
│   ├── view/            # 渲染器
│   └── data/            # 数据
├── subpackage/          # 子包 (资源)
│   ├── ui/              # UI 图片
│   ├── sprites/         # 精灵图
│   ├── levels/          # 关卡数据
│   └── audio/           # 音效
└── [删除] res/          # ❌ 重复资源
└── [删除] *_old_*       # ❌ 废弃文件
```

---

## 🛠️ 优化命令

```bash
# 1. 删除废弃文件
cd /Users/htc332/.openclaw/workspace-pioneer/bomb-wall-canvas
rm -rf subpackage/sprites/*_old_*/
rm -rf res/
rm -f preview_status.png devtool_status.png

# 2. 压缩 PNG (需要安装 pngquant)
brew install pngquant
find subpackage -name "*.png" -exec pngquant --quality=60-80 --skip-if-larger {} \;

# 3. 验证大小
du -sh .
du -sh subpackage
```

---

*生成时间: 2026-05-18 01:33*
*分析工具: du + find*