# 牛牛炸鼠 - 微信小游戏开发规范

**版本**: v0.5.2  
**平台**: 微信小游戏 (Canvas 原生)  
**最后更新**: 2026-05-03

---

## 一、环境基础

### 1.1 全局对象
**关键区别**：微信小游戏使用 `GameGlobal` 而非 `window`

```javascript
// ✅ 正确 - 微信小游戏
GameGlobal.ClassName = ClassName;
const instance = new GameGlobal.ClassName();

// ❌ 错误 - 浏览器环境
window.ClassName = ClassName;
```

**影响范围**：所有通过 `game.js` 加载的模块

### 1.2 模块导出规范
```javascript
// 类定义
class MyClass { ... }

// 导出到全局
GameGlobal.MyClass = MyClass;

// 其他模块使用
const instance = new GameGlobal.MyClass();
```

---

## 二、模块加载顺序

```javascript
// game.js 加载顺序
1. src/data/Storage.js         // 本地存储
2. src/data/LevelData.js       // 关卡配置
3. src/utils/Constants.js      // 常量定义
4. src/utils/Helpers.js        // 工具函数
5. src/utils/EventBus.js       // 事件总线
6. src/utils/StateMachine.js   // 状态机
7. src/core/GameLogic.js       // 游戏逻辑
8. src/core/LevelSystem.js     // 关卡系统
9. src/managers/ResourceManager.js  // 资源管理
10. src/view/Renderer.js       // Canvas 渲染
11. src/view/Animator.js       // 动画
12. src/view/ParticleSystem.js // 粒子
13. src/view/UIManager.js      // UI 界面
14. src/system/AudioManager.js // 音效
15. src/system/AdManager.js    // 广告
16. src/app/GameApp.js         // 应用入口
17. src/main.js                // 游戏主入口
```

---

## 三、图片资源加载

```javascript
// 微信小游戏创建图片
const img = wx.createImage();
img.onload = () => console.log('loaded');
img.src = 'res/images/Level_1.jpg'; // 相对路径
```

**注意事项**：
- 图片加载是异步的，需处理加载完成前的备用显示
- 使用 Canvas `clip()` 实现圆形裁剪
- 建议预加载所有图片资源

---

## 四、本地存储

```javascript
// 读取
const data = wx.getStorageSync('key');

// 写入
wx.setStorageSync('key', value);

// 键名规范
const STORAGE_KEYS = {
  PREFIX: 'nnzs_',
  PLAYER_DATA: 'player_data',
  SETTINGS: 'settings',
  LEVEL_PROGRESS: 'level_progress',
  HIGH_SCORES: 'high_scores'
};
```

---

## 五、常见配置错误

| 配置项 | 错误示例 | 正确做法 |
|--------|---------|---------|
| workers | `"workers": ""` | 直接省略该字段 |
| 关卡键名 | `6: {...}, 7: {...}, 7: {...}` | 确保键名唯一 |
| 全局对象 | `window.Class = Class` | `GameGlobal.Class = Class` |
| roundRect | `ctx.roundRect(x,y,w,h,16)` | `ctx.roundRect(x,y,w,h,[16])` 数组格式 |

---

## 六、调试方法

### 6.1 语法检查
```bash
# 快速检查所有 JS 语法
for f in src/**/*.js game.js; do node --check "$f"; done
```

### 6.2 开发者工具
- Console 查看日志
- Network 面板检查资源加载
- 真机测试：开发者工具 → 真机调试
- 清除缓存：开发者工具 → 详情 → 本地缓存
- 重新编译：Cmd+B

### 6.3 日志捕获
```javascript
// console-capture.js - 保存日志到文件系统
const logs = [];
const origLog = console.log;
console.log = (...args) => {
  logs.push(args.join(' '));
  origLog.apply(console, args);
};
```

---

## 七、已知问题与修复

### 7.1 Worker 不支持
**现象**: `wx.createWorker is not a function`

**修复**:
```javascript
// 禁用 Worker
let positionWorker = null;
getPositionWorklet() { return null; }
```

### 7.2 roundRect API 兼容性
**现象**: 参数格式错误

**修复**:
```javascript
// 圆角参数必须是数组
ctx.roundRect(x, y, w, h, [16 * pr]);  // ✅
ctx.roundRect(x, y, w, h, 16 * pr);    // ❌
```

### 7.3 第18关动态生成
**问题**: 随机生成的墙壁可能与静态炸弹重叠

**修复**:
```javascript
const used = new Set();
// 生成墙壁，记录位置
// 生成静态炸弹时避开已占用格子
```

---

## 八、包体积优化

### 8.1 当前大小
- **代码**: ~35KB（不含图片）
- **图片**: 根据资源而定

### 8.2 限制
- 主包 4MB
- 子包 4MB/个
- 总包无限制（通过子包）

### 8.3 优化策略
- 背景图使用 JPG
- 小图标合并为图集
- 图片尺寸保持 2 的幂次方

---

## 九、明确边界

### 9.1 仅支持微信小游戏
- ❌ 不兼容浏览器
- ❌ 不使用 DOM API
- ✅ 直接使用 wx.* API

### 9.2 纯单机
- ❌ 不联网
- ❌ 无服务器通信
- ✅ 完全离线可玩

---

_文档版本: v1.0 | 2026-05-03_
