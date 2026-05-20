# 爆炸特效问题分析 - 模块C：GameLogic逻辑层

## 模块C：GameLogic 爆炸逻辑分析

### C1. 爆炸入口

```javascript
explodeBomb(bomb) {
  // 防止重复处理
  if (!this.bombs.has(bomb.key)) return;
  
  // 防止递归死锁（关键！）
  if (this.processingExplosion) {
    setTimeout(() => this.explodeBomb(bomb), 50);
    return;
  }
  
  this.processingExplosion = true;
  
  // 从活动炸弹中移除
  this.bombs.delete(bomb.key);
  
  // 发送爆炸事件（视觉特效用）
  this.emitEvent('bomb_exploded', { 
    x: bomb.x, y: bomb.y, 
    evolution: bomb.evolution 
  });

  // 计算爆炸范围
  const range = this.getExplosionRange(bomb);
  
  // 处理爆炸范围内的墙壁
  range.forEach(pos => {
    this.processExplosionHit(pos.x, pos.y);
  });

  // 触发静态炸弹连锁
  this.triggerStaticBombs(bomb, range);

  // 升级相邻炸弹
  this.upgradeAdjacentBombs(bomb);

  this.processingExplosion = false;
  this.checkGameState();
}
```

**关键设计：**
- `processingExplosion` 锁防止递归死锁
- 先发送事件，再处理伤害（视觉和逻辑分离）
- 范围计算、伤害处理、连锁爆炸、升级炸弹，四步顺序执行

### C2. 爆炸范围计算

```javascript
getExplosionRange(bomb) {
  const evo = bomb.evolution || 0;
  const power = 1 + evo;  // 单臂蔓延格数

  // 中心格 distance = 0
  const range = [{ x: bomb.x, y: bomb.y, distance: 0 }];

  // 十字方向（上下左右）
  const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
  dirs.forEach(([dx, dy]) => {
    for (let d = 1; d <= power; d++) {
      range.push({ 
        x: bomb.x + dx * d, 
        y: bomb.y + dy * d, 
        distance: d 
      });
    }
  });

  return range;
}
```

**当前实现特点：**
- 只支持十字方向（上下左右）
- power = 1 + evolution
- 1级：power=1，5格
- 2级：power=2，9格
- 3级：power=3，13格
- 4级：power=4，17格（但SimpleExplosion限制为3）

**与Animator的交互：**
- GameLogic 计算范围用于伤害判定
- Animator 的 SimpleExplosion 独立计算cells用于视觉
- 两者计算逻辑相同（都是十字），但代码重复

### C3. 连锁爆炸处理

```javascript
// 炸弹墙被摧毁时
if (wall.type === 'bomb') {
  this.bombsLeft++;
  
  // 延迟100ms后创建新炸弹并爆炸
  setTimeout(() => {
    const chainBomb = {
      x, y,
      countdown: 0,  // 立即爆炸
      evolution: wall.color === 'red' ? 1 : 0,
      key: `chain_${x}_${y}_${Date.now()}`
    };
    this.explodeBomb(chainBomb);
  }, 100);
}
```

**潜在问题：**
- 使用 setTimeout 延迟100ms
- 如果processingExplosion锁还在，会再次延迟50ms
- 可能导致爆炸顺序混乱

### C4. 静态炸弹触发

```javascript
triggerStaticBombs(explodedBomb, range) {
  this.staticBombs.forEach(staticBomb => {
    // 检查是否在爆炸范围内
    const inRange = range.some(r => 
      r.x === staticBomb.x && r.y === staticBomb.y
    );
    
    if (!inRange) return;

    // 升级
    staticBomb.evolution++;
    
    if (!staticBomb.active) {
      // 首次激活：设置3秒倒计时
      staticBomb.active = true;
      staticBomb.countdown = 3;
      this.emitEvent('static_bomb_activated', {...});
      this.startStaticBombCountdown(staticBomb);
    } else {
      // 已激活：重置倒计时并升级
      staticBomb.countdown = 3;
      this.emitEvent('static_bomb_upgraded', {...});
    }
  });
}
```

**特点：**
- 静态炸弹被击中后升级（evolution++）
- 首次激活设置3秒倒计时
- 已激活则重置倒计时
- 倒计时结束后调用 explodeStaticBomb()

### C5. 升级相邻炸弹

```javascript
upgradeAdjacentBombs(explodedBomb) {
  // 8方向相邻
  const dirs = [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]];
  
  dirs.forEach(([dx, dy]) => {
    const nx = explodedBomb.x + dx;
    const ny = explodedBomb.y + dy;
    const neighborKey = `${nx},${ny}`;
    const neighbor = this.bombs.get(neighborKey);
    
    if (neighbor && neighbor.key !== explodedBomb.key) {
      neighbor.evolution++;
      this.emitEvent('bomb_upgraded', {
        x: nx, y: ny,
        newEvolution: neighbor.evolution
      });
    }
  });
}
```

**与特效的交互：**
- 升级事件触发 main.onBombUpgraded()
- 创建 Animator 光环 + ParticleSystem 粒子
- 但 ParticleSystem 之前缺少 createUpgrade 方法

---

## 模块C问题总结

| 问题 | 根因 | 影响 |
|------|------|------|
| 范围计算重复 | GameLogic和Animator各自计算 | 代码冗余，可能不一致 |
| 连锁爆炸延迟 | setTimeout 100ms | 可能和processing锁冲突 |
| 静态炸弹升级 | evolution++ 可能超出预期 | 静态炸弹等级可能过高 |

## 模块C修复建议

**建议1：统一范围计算**
- GameLogic 计算范围后，将 range 传递给事件
- Animator 根据 range 绘制，不再独立计算
- 确保视觉和逻辑完全一致

**建议2：简化连锁爆炸**
- 避免使用 setTimeout
- 直接在当前帧处理连锁

---

_模块C完成_
