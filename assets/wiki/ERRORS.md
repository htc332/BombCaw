# Errors

Command failures and integration errors.

---

## [ERR-20260507-001] particles.createBurst

**Logged**: 2026-05-07T20:00:00+08:00
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
炸弹爆炸时，main.js 调用 `this.particles.createBurst()` 报错，方法不存在。

### Error
```
TypeError: this.particles.createBurst is not a function
 at BombWallGame.onWallDestroyed (main.js:344)
```

### Context
- 在 `onWallDestroyed` 中调用粒子效果
- `ParticleSystem` 类没有 `createBurst` 方法

### 修复
注释掉该调用，后续需要实现粒子系统或移除该效果。

### Metadata
- Reproducible: yes
- Related Files: src/main.js, src/view/ParticleSystem.js
- See Also: ERR-20260507-002

---

## [ERR-20260507-002] animator.createUpgradeEffect

**Logged**: 2026-05-07T20:05:00+08:00
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
炸弹升级时，main.js 调用 `this.animator.createUpgradeEffect()` 报错，方法不存在。

### Error
```
TypeError: this.animator.createUpgradeEffect is not a function
 at BombWallGame.onBombUpgraded (main.js:362)
```

### Context
- 在 `onBombUpgraded` 中调用升级特效
- `Animator` 类没有 `createUpgradeEffect` 方法

### 修复
注释掉该调用，后续需要实现升级特效或移除该效果。

### Metadata
- Reproducible: yes
- Related Files: src/main.js, src/view/Animator.js
- See Also: ERR-20260507-001

---

## [ERR-20260507-003] GitHub Push Protection

**Logged**: 2026-05-07T11:30:00+08:00
**Priority**: high
**Status**: resolved
**Area**: config

### Summary
推送代码到 GitHub 时，历史提交中包含 Figma Token，触发 GitHub Push Protection。

### Error
```
remote: error: GH013: Repository rule violations found
remote: Push cannot contain secrets
```

### Context
- 历史提交 `0e8166e` 包含 `test-figma-api.js`
- 文件中有 Figma Personal Access Token

### 修复
使用 `git filter-branch` 重写历史，删除包含 token 的文件。

### Metadata
- Reproducible: yes
- Related Files: test-figma-api.js
- See Also: LRN-20260507-001

---
