好的，老胡。根据你的要求，我分析了代码，不实际修改，只发原因和解决方案。

## 问题分析：幽灵鼠爆炸后持续显示，不隐藏

### 根本原因

`ghostRevealTimer` 计时器在爆炸后**没有正确递减归零**，导致幽灵鼠一直显示。

### 具体原因分析

#### 1. 计时器递减逻辑有漏洞（Renderer.js）

```javascript
updateBombAnimation(dt) {
    this.animTime += dt;
    // 幽灵鼠显隐计时器递减（仅非永久显示时）
    if (!this.ghostPermanentReveal && this.ghostRevealTimer > 0) {
      this.ghostRevealTimer -= dt;
      if (this.ghostRevealTimer < 0) this.ghostRevealTimer = 0;
    }
  }
```

**问题**：`dt` 是秒级时间差，但 `ghostRevealTimer` 初始值是 `1.2` 秒。如果 `dt` 很小（比如 0.016 秒，约60fps），递减是正常的。

**但是**：如果 `ghostRevealTimer` 被多次设置（比如多次爆炸），或者 `dt` 不稳定，可能导致计时器无法正确归零。

#### 2. 死亡动画逻辑错误地设置了永久显示（Renderer.js）

```javascript
// 幽灵鼠死亡时，设置永久显示标志（解决卡顿问题）
if (wallType === 'ghost') {
  this.ghostPermanentReveal = true;
}
```

**问题**：这里设置了 `ghostPermanentReveal = true`，这意味着幽灵鼠死亡后会**永久显示**，不再隐藏。

**但是**：根据你的反馈，问题是"爆炸后"就不隐藏了，而不是"死亡后"。这说明问题可能不是这里。

#### 3. 真正的罪魁祸首：`drawDeathAnimations` 中的逻辑错误

```javascript
drawDeathAnimations(ctx, offsetX, offsetY, gridSize, cs, g, half) {
    // 过滤已完成的动画
    this.deathAnimations = this.deathAnimations.filter(anim => {
      const elapsed = this.animTime - anim.startTime;
      return elapsed < anim.duration;
    });
    
    this.deathAnimations.forEach(anim => {
      // [Ghost] 幽灵鼠死亡动画：只有显隐计时器运行时或永久显示时才绘制
      const isGhostDeath = anim.spriteName === 'enemy_ghost_death';
      if (isGhostDeath && !this.ghostPermanentReveal && this.ghostRevealTimer <= 0) {
        return; // 跳过，不绘制
      }
      
      // 幽灵鼠死亡动画播放期间，确保显隐计时器足够（仅非永久显示时）
      if (isGhostDeath && !this.ghostPermanentReveal) {
        this.ghostRevealTimer = Math.max(this.ghostRevealTimer, anim.duration - (this.animTime - anim.startTime));
      }
```

**问题**：这里有两个问题：

1. **死亡动画会延长 `ghostRevealTimer`**：如果幽灵鼠被炸死，`drawDeathAnimations` 会设置 `ghostRevealTimer = Math.max(this.ghostRevealTimer, anim.duration - elapsed)`，这会确保死亡动画播放期间幽灵鼠可见。

2. **但是**：如果幽灵鼠**没有被炸死**（只是被爆炸波及，hp > 0），`addDeathAnimation` 不会被调用，但 `drawWalls` 中的 `ghostRevealTimer` 检查会阻止幽灵鼠显示。

#### 4. 真正的问题：`ghostRevealTimer` 被设置后，没有正确触发隐藏

回到 `drawWalls` 方法：

```javascript
walls.forEach(wall => {
      // 跳过正在播放死亡动画的老鼠（由 drawDeathAnimations 绘制）
      if (wall.dying) return;
      
      // 幽灵鼠：默认隐藏，除非显隐计时器正在运行或永久显示
      if (wall.type === 'ghost' && !this.ghostPermanentReveal && this.ghostRevealTimer <= 0) return;
```

**问题**：如果 `ghostRevealTimer` 被设置为一个很大的值（比如死亡动画的时长），那么幽灵鼠会一直保持显示，直到计时器归零。

**但是**：根据你的反馈，问题是"爆炸一次后就不隐藏了"，这说明 `ghostRevealTimer` 被设置后，可能**没有被正确递减**，或者**被重复设置**。

### 解决方案

#### 方案 1：修复 `ghostRevealTimer` 的初始化和递减逻辑

确保 `ghostRevealTimer` 只在爆炸时设置一次，并且正确递减：

```javascript
// 在爆炸事件中设置 ghostRevealTimer
onBombExploded(x, y, evolution) {
    // 设置幽灵鼠显隐计时器为 1.2 秒
    this.renderer.ghostRevealTimer = this.renderer.ghostRevealDuration; // 1.2 秒
}
```

#### 方案 2：移除 `drawDeathAnimations` 中对 `ghostRevealTimer` 的修改

死亡动画不应该影响显隐计时器，这是两个独立的逻辑：

```javascript
drawDeathAnimations(ctx, offsetX, offsetY, gridSize, cs, g, half) {
    // 过滤已完成的动画
    this.deathAnimations = this.deathAnimations.filter(anim => {
      const elapsed = this.animTime - anim.startTime;
      return elapsed < anim.duration;
    });
    
    this.deathAnimations.forEach(anim => {
      // 移除对 ghostRevealTimer 的修改，死亡动画应该独立处理
      const isGhostDeath = anim.spriteName === 'enemy_ghost_death';
      if (isGhostDeath && !this.ghostPermanentReveal && this.ghostRevealTimer <= 0) {
        return; // 跳过，不绘制
      }
      
      // 移除这段代码：不要在这里设置 ghostRevealTimer
      // if (isGhostDeath && !this.ghostPermanentReveal) {
      //   this.ghostRevealTimer = Math.max(this.ghostRevealTimer, anim.duration - (this.animTime - anim.startTime));
      // }
```

#### 方案 3：确保 `ghostPermanentReveal` 只在死亡时设置

```javascript
addDeathAnimation(x, y, wallType) {
    // ... 其他代码 ...
    
    // 只在幽灵鼠死亡时设置永久显示
    if (wallType === 'ghost') {
      this.ghostPermanentReveal = true;
    }
```

### 总结

**根本原因**：`drawDeathAnimations` 中错误地修改了 `ghostRevealTimer`，导致幽灵鼠在死亡动画播放期间一直保持显示。

**正确行为**：
1. 幽灵鼠默认隐藏
2. 爆炸时显示 1.2 秒（`ghostRevealTimer = 1.2`）
3. 1.2 秒后自动隐藏（`ghostRevealTimer` 递减到 0）
4. 如果幽灵鼠被炸死，设置 `ghostPermanentReveal = true`，永久显示死亡动画

**当前错误行为**：
1. 幽灵鼠默认隐藏
2. 爆炸时显示 1.2 秒
3. 死亡动画播放期间，`ghostRevealTimer` 被延长，导致幽灵鼠一直显示
4. 死亡动画结束后，`ghostRevealTimer` 可能仍然大于 0，幽灵鼠不隐藏

**建议修复**：
1. 移除 `drawDeathAnimations` 中对 `ghostRevealTimer` 的修改
2. 确保 `ghostRevealTimer` 只在爆炸事件中设置一次
3. 确保 `updateBombAnimation` 中正确递减 `ghostRevealTimer`