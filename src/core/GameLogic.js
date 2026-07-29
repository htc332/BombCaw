/**
 * Core/GameLogic.js
 * 核心游戏逻辑 - 纯逻辑，无渲染
 * 职责：炸弹放置、爆炸计算、胜负判定
 * 
 * 上线标准修复：
 * 1. 使用事件回调确保异步事件能被正确处理
 * 2. 完善的游戏状态机
 * 3. 清晰的胜负判定
 */

class GameLogic {
  constructor() {
    this.reset();
    // 事件回调 - 由外部设置
    this.onEvent = null;
  }

  reset() {
    this.level = 1;
    this.score = 10;          // [v0.8.0] 每局初始10分
    this.selectedBombType = 0;
    this.gameActive = false;
    this.walls = new Map();      // key: "x,y"
    this.bombs = new Map();      // key: "x,y" (玩家放置的)
    this.staticBombs = new Map(); // key: "x,y" (静态炸弹)
    this.gridSize = 5;
    this.processingExplosion = false; // 防止递归爆炸死锁
    this.pendingVictory = false;      // 延迟胜利，等动画播完
    
    // 本局统计
    this.bombsPlaced = 0;       // 已放置炸弹数
    this.wallsDestroyed = 0;    // 已消灭老鼠数
    
    // [v0.8.3] 牛奶收益统计
    this.milkProfit = 0;        // 本次操作净收益
    this.scoreBeforePlace = 0;  // 放置前分数（用于计算收益）
    this.isExplosionChain = false; // 是否正在爆炸链中
    
    // 加分事件记录（用于UI显示）
    this.lastScoreEvent = null;  // { text: '普通鼠摧毁 +1', time: Date.now() }
  }
  
  // 添加分数（v0.8.0 新计分系统）
  addScore(points, reason) {
    this.score += points;
    if (this.score < 0) this.score = 0;
    
    // 记录加分事件
    this.lastScoreEvent = {
      text: reason + ' +' + points,
      time: Date.now()
    };
  }

  // ========== 关卡初始化 ==========
  
  initLevel(levelConfig) {
    this.gridSize = levelConfig.gridSize || 5;
    this.gameActive = true;
    this.processingExplosion = false;
    this.pendingVictory = false;
    this.walls.clear();
    this.bombs.clear();
    this.staticBombs.clear();
    
    // [v0.8.0] 本局统计重置
    this.bombsPlaced = 0;
    this.wallsDestroyed = 0;
    
    // [v0.8.3] 牛奶收益统计重置
    this.milkProfit = 0;
    this.scoreBeforePlace = 0;
    this.isExplosionChain = false;

    // 初始化墙壁
    if (levelConfig.walls) {
      levelConfig.walls.forEach(w => {
        this.spawnWall(w.x, w.y, w.type, w.color);
      });
    }

    // 初始化静态炸弹
    if (levelConfig.staticBombs) {
      levelConfig.staticBombs.forEach(sb => {
        this.spawnStaticBomb(sb.x, sb.y, sb.evolution);
      });
    }

    this.emitEvent('level_started', {
      gridSize: this.gridSize,
      score: this.score,
      wallCount: this.walls.size
    });

    return this.getState();
  }

  spawnWall(x, y, type, color) {
    const config = ENEMY_TYPES[type || 'normal'];
    const key = `${x},${y}`;
    const wall = {
      x, y,
      type: type || 'normal',
      hp: config ? config.hp : 1,
      maxHp: config ? config.hp : 1,
      color: color || null,
      shake: 0,
      state: 'idle'  // 由配置定义的状态机控制
    };
    
    // 幽灵鼠：独立显隐计时器
    if (wall.type === 'ghost') {
      wall.ghostVisible = true;      // 当前是否可见
      wall.ghostTimer = 0;           // 显隐计时器（秒），>0表示可见
      wall.ghostInterval = 2.0 + Math.random() * 1.0; // 每个幽灵鼠独立的显隐周期（2~3秒）
      wall.ghostPhase = Math.random() * Math.PI * 2; // 随机相位，避免同步闪烁
    }
    
    this.walls.set(key, wall);
  }

  spawnStaticBomb(x, y, evolution = 0) {
    const key = `${x},${y}`;
    // [v0.9.9-fix] 防止静态炸弹与墙壁重叠
    if (this.walls.has(key)) {
      console.warn(`[GameLogic] 静态炸弹(${x},${y})与墙壁重叠，跳过放置`);
      return;
    }
    this.staticBombs.set(key, {
      x, y,
      evolution: evolution || 0,
      active: false,
      countdown: 0,
      key
    });
  }

  // ========== 事件系统 ==========

  emitEvent(type, data = {}) {
    if (this.onEvent) {
      this.onEvent({ type, ...data });
    }
  }

  // ========== 核心玩法 ==========

  tryPlaceBomb(x, y) {
    const key = `${x},${y}`;

    // 校验
    if (!this.gameActive) {
      this.emitEvent('action_rejected', { reason: 'game_inactive', x, y });
      return false;
    }
    if (!this.isValidGridPos(x, y)) {
      this.emitEvent('action_rejected', { reason: 'invalid_position', x, y });
      return false;
    }
    if (this.walls.has(key)) {
      this.emitEvent('action_rejected', { reason: 'wall_exists', x, y });
      return false;
    }
    if (this.bombs.has(key)) {
      this.emitEvent('action_rejected', { reason: 'bomb_exists', x, y });
      return false;
    }
    if (this.staticBombs.has(key)) {
      this.emitEvent('action_rejected', { reason: 'static_bomb_exists', x, y });
      return false;
    }

    // [v0.9.9] 新计分系统：LV1/2/3统一2分，LV4改为4分
    const bombCosts = [2, 2, 2, 4];
    const cost = bombCosts[this.selectedBombType] || 2;
    
    if (this.score < cost) {
      this.emitEvent('action_rejected', { reason: 'insufficient_score', x, y, current: this.score, cost: cost });
      
      // [v0.9.3-fix] 积分不足时检查是否可以放置任何炸弹，如果不能则触发失败
      const minCost = Math.min(...bombCosts);
      if (this.score < minCost) {
        // 检查是否还有待爆炸的炸弹
        const hasPendingBombs = this.bombs.size > 0 || 
          Array.from(this.staticBombs.values()).some(sb => sb.active);
        if (!hasPendingBombs) {
          this.checkFailure();
        }
      }
      
      return false;
    }
    
    // 扣除分数
    this.score -= cost;
    this.bombsPlaced++; // 统计
    
    // [v0.8.3] 记录放置前分数（用于计算牛奶收益）
    if (!this.isExplosionChain) {
      this.scoreBeforePlace = this.score + cost; // 放置前的分数
      this.isExplosionChain = true;
    }

    // 放置炸弹
    // 根据选中的炸弹类型获取 evolution
    const bombTypes = [
      { evolution: 0 },  // Lv1 白色
      { evolution: 1 },  // Lv2 蓝色
      { evolution: 2 },  // Lv3 紫色
      { evolution: 3 }   // Lv4 红色
    ];
    const selectedType = bombTypes[this.selectedBombType] || bombTypes[0];
    
    const bomb = {
      x, y,
      countdown: 3, // 倒计时秒数，由外部根据动画帧数控制
      evolution: selectedType.evolution, // 根据选中类型设置 evolution
      key,
      animTime: 0, // 独立动画时间（秒）
      animSpeed: 0.8 + Math.random() * 0.4 // 动画速度系数 (0.8~1.2)
    };
    this.bombs.set(key, bomb);

    this.emitEvent('bomb_placed', { 
      x, y, 
      bomb: { ...bomb },
      score: this.score,
      cost: cost
    });

    // 启动倒计时
    this.startBombCountdown(bomb);
    
    return true;
  }

  startBombCountdown(bomb) {
    // 倒计时1.5秒（基于60fps，1.5秒=90帧）
    bomb.countdown = 90;
    
    const tick = () => {
      if (!this.bombs.has(bomb.key)) return;
      
      bomb.countdown--;
      
      if (bomb.countdown <= 0) {
        this.explodeBomb(bomb);
      } else {
        this.emitEvent('countdown_tick', { 
          x: bomb.x, y: bomb.y, 
          countdown: Math.ceil(bomb.countdown / 60) // 显示秒数
        });
        if (typeof requestAnimationFrame !== 'undefined') {
          requestAnimationFrame(tick);
        } else {
          setTimeout(tick, 16);
        }
      }
    };
    
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(tick);
    } else {
      setTimeout(tick, 16);
    }
  }

  explodeBomb(bomb) {
    if (!this.bombs.has(bomb.key)) return;
    if (this.processingExplosion) {
      // 延迟处理，避免递归死锁
      setTimeout(() => this.explodeBomb(bomb), 50);
      return;
    }
    
    this.processingExplosion = true;
    
    // 连击开始（如果不是连锁反应）
    if (!this.isInCombo) {
      this.isInCombo = true;
      this.comboCount = 0;
      // 生产环境关闭连击日志
      // console.log('[Combo] 连击开始');
    }
    
    this.bombs.delete(bomb.key);
    // 计算爆炸范围
    const range = this.getExplosionRange(bomb);
    
    // [v0.8.1] 计算被墙壁鼠阻挡的格子（用于特效显示）
    const blockedCells = this.getBlockedCells(bomb, range);
    
    // 生产环境关闭详细爆炸日志
    // console.log('[Explosion] Bomb at', bomb.x, bomb.y, 'evo:', bomb.evolution, 'range:', JSON.stringify(range));
    
    this.emitEvent('bomb_exploded', { 
      x: bomb.x, y: bomb.y, 
      evolution: bomb.evolution,
      blockedCells: blockedCells  // 被阻挡的格子列表
    });
    
    // 处理爆炸范围内的所有格子
    range.forEach(pos => {
      // 生产环境关闭详细命中日志
      // console.log('[Explosion] Hit pos:', pos.x, pos.y, 'type:', pos.distance === 0 ? 'center' : (Math.abs(pos.x - bomb.x) === Math.abs(pos.y - bomb.y) ? 'diag' : 'cross'));
      this.processExplosionHit(pos.x, pos.y, bomb.evolution);
    });

    // [v0.7.10] 任何炸弹爆炸时，所有幽灵鼠都显示（无论是否被炸到）
    this.revealAllGhosts();

    // 处理静态炸弹被引爆（这可能会触发连锁爆炸）
    this.triggerStaticBombs(bomb, range);

    // [v0.6.0] 移除：升级相邻炸弹
    // this.upgradeAdjacentBombs(bomb);

    this.processingExplosion = false;

    // [v0.8.3] 检查爆炸链是否结束，计算牛奶收益
    this.checkExplosionChainEnd();

    // 检查游戏状态
    this.checkGameState();
  }

  getExplosionRange(bomb) {
    const evo = bomb.evolution || 0;
    const range = [{ x: bomb.x, y: bomb.y, distance: 0 }];

    if (evo === 0) {
      // [v0.9.9-fix] LV1: 十字1格
      const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
      dirs.forEach(([dx, dy]) => {
        const pos = { x: bomb.x + dx, y: bomb.y + dy, distance: 1 };
        range.push(pos);
      });
    } else if (evo === 1) {
      // [v0.9.9-fix] LV2: 竖直方向上下各2格（带墙壁鼠阻挡）
      const dirs = [[0,1], [0,-1]];
      dirs.forEach(([dx, dy]) => {
        for (let d = 1; d <= 2; d++) {
          const pos = { x: bomb.x + dx * d, y: bomb.y + dy * d, distance: d };
          range.push(pos);
          // [v0.8.1] 只有墙壁鼠(type: 'wall')能阻挡爆炸
          const key = `${pos.x},${pos.y}`;
          const wall = this.walls.get(key);
          if (wall && wall.type === 'wall') break;
        }
      });
    } else if (evo === 2) {
      // [v0.9.9-fix] LV3: 横向左右各2格（带墙壁鼠阻挡）
      const hDirs = [[1,0], [-1,0]];
      hDirs.forEach(([dx, dy]) => {
        for (let d = 1; d <= 2; d++) {
          const pos = { x: bomb.x + dx * d, y: bomb.y + dy * d, distance: d };
          range.push(pos);
          const key = `${pos.x},${pos.y}`;
          const wall = this.walls.get(key);
          if (wall && wall.type === 'wall') break;
        }
      });
    } else if (evo === 3) {
      // [v0.9.9-fix] LV4: 十字1格 + 对角1格
      const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
      dirs.forEach(([dx, dy]) => {
        range.push({ x: bomb.x + dx, y: bomb.y + dy, distance: 1 });
      });
      const diags = [[-1,-1], [1,-1], [-1,1], [1,1]];
      diags.forEach(([dx, dy]) => {
        range.push({ x: bomb.x + dx, y: bomb.y + dy, distance: 1 });
      });
    } else {
      // 兼容旧逻辑：默认十字 1 格
      const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
      dirs.forEach(([dx, dy]) => {
        range.push({ x: bomb.x + dx, y: bomb.y + dy, distance: 1 });
      });
    }

    return range;
  }

  // [v0.8.1] 检查指定位置是否有任何墙壁（用于阻挡爆炸）
  isWallAt(x, y) {
    const key = `${x},${y}`;
    const wall = this.walls.get(key);
    return wall && !wall.dying;
  }

  // [v0.8.1] 检查指定位置是否有墙壁鼠（用于特效显示）
  isWallMouseAt(x, y) {
    const key = `${x},${y}`;
    const wall = this.walls.get(key);
    return wall && wall.type === 'wall' && !wall.dying;
  }

  // [v0.8.1] 计算被墙壁鼠阻挡的格子（用于特效显示阻挡效果）
  // 注意：此方法需要在爆炸前调用，检查原始墙壁状态
  getBlockedCells(bomb, actualRange) {
    const blocked = [];
    const evo = bomb.evolution || 0;
    
    if (evo === 2) {
      // LV2: 检查竖直方向被墙壁鼠阻挡的格子
      const dirs = [[0,1], [0,-1]];
      dirs.forEach(([dx, dy]) => {
        for (let d = 1; d <= 3; d++) {
          const x = bomb.x + dx * d;
          const y = bomb.y + dy * d;
          // 检查原始位置是否有墙壁鼠（不检查dying状态，因为爆炸前还没死）
          const key = `${x},${y}`;
          const wall = this.walls.get(key);
          if (wall && wall.type === 'wall') {
            // 记录被阻挡的格子（包含墙壁鼠本身和后面的格子）
            // 注意：返回相对坐标（相对于炸弹中心），因为Animator使用相对坐标
            for (let bd = d; bd <= 3; bd++) {
              blocked.push({ x: dx * bd, y: dy * bd });
            }
            break;
          }
        }
      });
    } else if (evo === 3) {
      // LV3: 检查横向方向被墙壁鼠阻挡的格子
      const dirs = [[1,0], [-1,0]];
      dirs.forEach(([dx, dy]) => {
        for (let d = 1; d <= 3; d++) {
          const x = bomb.x + dx * d;
          const y = bomb.y + dy * d;
          // 检查原始位置是否有墙壁鼠
          const key = `${x},${y}`;
          const wall = this.walls.get(key);
          if (wall && wall.type === 'wall') {
            // 记录被阻挡的格子（包含墙壁鼠本身和后面的格子）
            // 注意：返回相对坐标（相对于炸弹中心），因为Animator使用相对坐标
            for (let bd = d; bd <= 3; bd++) {
              blocked.push({ x: dx * bd, y: dy * bd });
            }
            break;
          }
        }
      });
    }
    
    return blocked;
  }

  // [v0.7.10] 任何炸弹爆炸时，所有幽灵鼠都显示出来（无论是否被炸到）
  revealAllGhosts() {
    this.walls.forEach(wall => {
      if (wall.type === 'ghost' && !wall.dying) {
        wall.ghostTimer = 1.5; // 显示1.5秒
        wall.ghostAlpha = 0;   // 从透明开始淡入
      }
    });
  }

  processExplosionHit(x, y, bombEvo) {
    const key = `${x},${y}`;
    const wall = this.walls.get(key);
    
    if (!wall) return;

    wall.hp--;

    if (wall.hp <= 0) {
      this.handleEnemyDeath(wall, key);
    } else {
      this.handleEnemyDamaged(wall, key);
    }
  }

  // 连击计分（已废弃，保留方法避免外部调用报错）
  addComboScore(basePoints, reason) {
    this.addScore(basePoints, reason);
  }

  // ========== 敌人状态处理（配置驱动） ==========

  // [v0.8.0] 所有老鼠墙破坏后都+1分
  handleEnemyDeath(wall, key) {
    const config = ENEMY_TYPES[wall.type];
    if (!config) {
      this.walls.delete(key);
      return;
    }

    wall.dying = true;
    
    // [v0.8.0] 统一+1分，不再区分类型
    this.addScore(1, '消灭老鼠');
    this.wallsDestroyed++; // 统计

    this.emitEvent('enemy_death', {
      x: wall.x, y: wall.y,
      wallType: wall.type,
      score: this.score,
      gained: 1
    });

    // 根据配置处理特殊死亡逻辑
    if (config.onDeath === 'bombWall') {
      // [v0.8.0] 炸弹墙：不再返还炸弹，改为+1分奖励
      this.addScore(1, '炸弹墙奖励');
      this.emitEvent('bomb_refilled', { x: wall.x, y: wall.y, score: this.score });
      
      setTimeout(() => {
        const chainBomb = {
          x: wall.x, y: wall.y,
          countdown: 0,
          evolution: wall.color === 'red' ? 1 : 0,
          key: `chain_${wall.x}_${wall.y}_${Date.now()}`
        };
        this.explodeBomb(chainBomb);
      }, 100);
    }

    // 延迟移除（幽灵鼠死亡动画时长由精灵图决定，但保留最小显示时间）
    const duration = Math.max(config.deathDuration || 2000, 2000); // [v0.7.10] 确保至少2秒，让死亡动画播放完
    setTimeout(() => {
      this.walls.delete(key);
      this.emitEvent('wall_destroyed', { 
        x: wall.x, y: wall.y,
        wallType: wall.type,
        wallColor: wall.color,
        score: this.score
      });
      this.checkGameState();
    }, duration);
  }

  handleEnemyDamaged(wall, key) {
    const config = ENEMY_TYPES[wall.type];
    if (!config) return;

    // 根据配置处理受伤
    if (config.onDamaged === 'eliteBreak') {
      wall.state = 'break_transition';
      wall.animStartTime = -1;
      this.emitEvent('elite_damaged', { x: wall.x, y: wall.y, hp: wall.hp, maxHp: wall.maxHp });
      
      // 过渡动画完成后切换到破损待机
      setTimeout(() => {
        const currentWall = this.walls.get(key);
        if (currentWall && currentWall.hp > 0) {
          currentWall.state = 'break_idle';
          delete currentWall.animStartTime;
        }
      }, 2600);
      
      return;
    }
    
    // 默认受伤处理
    wall.shake = 10;
    this.emitEvent('wall_damaged', { x: wall.x, y: wall.y, hp: wall.hp, maxHp: wall.maxHp });
  }

  // [v0.8.0] 静态炸弹激活不再额外加分，只触发爆炸
  triggerStaticBombs(explodedBomb, range) {
    this.staticBombs.forEach(staticBomb => {
      // 检查是否在爆炸范围内
      const inRange = range.some(r => r.x === staticBomb.x && r.y === staticBomb.y);
      if (!inRange) return;
      // 已激活则忽略，不再升级
      if (staticBomb.active) return;

      // 首次被激活（不升级，保持原等级）
      staticBomb.active = true;
      staticBomb.countdown = 3;
      
      this.emitEvent('static_bomb_activated', {
        x: staticBomb.x,
        y: staticBomb.y,
        evolution: staticBomb.evolution
      });
      // 启动倒计时
      this.startStaticBombCountdown(staticBomb);
    });
  }

  startStaticBombCountdown(staticBomb) {
    // [v0.7.9-fix] 使用基于帧的倒计时，与动态炸弹一致，确保动画流畅
    staticBomb.countdown = 90; // 1.5秒 = 90帧（与动态炸弹一致）
    
    const tick = () => {
      if (!this.staticBombs.has(staticBomb.key)) return;
      if (!staticBomb.active) return;
      
      staticBomb.countdown--;
      
      if (staticBomb.countdown <= 0) {
        this.explodeStaticBomb(staticBomb);
      } else {
        this.emitEvent('static_bomb_tick', {
          x: staticBomb.x,
          y: staticBomb.y,
          countdown: Math.ceil(staticBomb.countdown / 60) // 显示秒数
        });
        if (typeof requestAnimationFrame !== 'undefined') {
          requestAnimationFrame(tick);
        } else {
          setTimeout(tick, 16);
        }
      }
    };
    
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(tick);
    } else {
      setTimeout(tick, 16);
    }
  }

  explodeStaticBomb(staticBomb) {
    if (!this.staticBombs.has(staticBomb.key)) return;
    if (this.processingExplosion) {
      setTimeout(() => this.explodeStaticBomb(staticBomb), 50);
      return;
    }
    
    this.processingExplosion = true;
    
    this.staticBombs.delete(staticBomb.key);
    
    // 计算爆炸范围
    const range = this.getExplosionRange(staticBomb);
    
    // [v0.8.1] 计算被墙壁鼠阻挡的格子
    const blockedCells = this.getBlockedCells(staticBomb, range);
    
    this.emitEvent('static_bomb_exploded', { 
      x: staticBomb.x, 
      y: staticBomb.y,
      evolution: staticBomb.evolution,
      blockedCells: blockedCells
    });

    // 处理爆炸范围内的所有格子
    range.forEach(pos => {
      this.processExplosionHit(pos.x, pos.y, staticBomb.evolution);
    });

    // 静态炸弹爆炸也能触发其他静态炸弹
    this.triggerStaticBombs(staticBomb, range);
    // [v0.6.0] 移除：升级相邻炸弹
    // this.upgradeAdjacentBombs(staticBomb);

    // [v0.7.10] 任何炸弹爆炸时，所有幽灵鼠都显示
    this.revealAllGhosts();

    this.processingExplosion = false;

    // [v0.8.3] 检查爆炸链是否结束，计算牛奶收益
    this.checkExplosionChainEnd();

    // 检查游戏状态
    this.checkGameState();
  }

  // [v0.6.0] 已废弃 - 移除炸弹升级机制
  upgradeAdjacentBombs(explodedBomb) {
    // 空实现，保留方法避免外部调用报错
  }

  // ========== 游戏状态 ==========

  checkGameState() {
    if (!this.gameActive) return;

    // 计算剩余墙壁（包括所有类型）
    const remaining = this.walls.size;

    if (remaining === 0) {
      // 胜利
      this.handleVictory();
    } else {
      // [v0.8.0] 检查是否失败：分数<=0 且 没有待爆炸的炸弹
      this.checkFailure();
    }
  }

  handleVictory() {
    if (this.pendingVictory) return;
    this.pendingVictory = true;
    this.gameActive = false;
    
    // [v0.9.3] 延迟发送胜利事件，等待动画完成（0.4秒）
    setTimeout(() => {
      this.confirmVictory();
    }, 400);
  }

  confirmVictory() {
    if (!this.pendingVictory) return;
    this.pendingVictory = false;
    
    // 生产环境关闭胜利确认日志
    // console.log('[GameLogic] Victory confirmed! Level:', this.level);
    
    this.emitEvent('level_complete', { 
      level: this.level,
      score: this.score,
      bombsPlaced: this.bombsPlaced,
      wallsDestroyed: this.wallsDestroyed
    });
  }

  checkFailure() {
    // [v0.8.0] 失败条件：分数 <= 0 且 没有待爆炸的炸弹（动态炸弹+静态炸弹）
    // [v0.9.3-fix] 或者分数不足以放置最便宜的炸弹且没有待爆炸的炸弹
    const hasPendingBombs = this.bombs.size > 0 || 
      Array.from(this.staticBombs.values()).some(sb => sb.active);
    
    const minCost = 2; // 最便宜炸弹消耗2分
    const cannotAffordAnyBomb = this.score < minCost;
    
    if ((this.score <= 0 || cannotAffordAnyBomb) && !hasPendingBombs) {
      this.gameActive = false;
      
      const remainingWalls = this.walls.size;
      
      this.emitEvent('level_failed', { 
        reason: 'out_of_score',
        remainingWalls: remainingWalls,
        score: this.score,
        bombsPlaced: this.bombsPlaced,
        wallsDestroyed: this.wallsDestroyed
      });
    }
  }

  // [v0.8.3] 检查爆炸链是否结束，计算牛奶收益
  checkExplosionChainEnd() {
    // 检查是否还有未爆炸的炸弹（动态炸弹 + 已激活的静态炸弹）
    // [v0.8.4-fix] 还要检查是否还有正在处理中的爆炸
    const hasPendingBombs = this.bombs.size > 0 || 
      Array.from(this.staticBombs.values()).some(sb => sb.active) ||
      this.processingExplosion;
    
    if (!hasPendingBombs && this.isExplosionChain) {
      // 爆炸链结束，计算收益
      this.milkProfit = this.score - this.scoreBeforePlace;
      this.isExplosionChain = false;
      
      this.emitEvent('explosion_chain_end', {
        scoreBefore: this.scoreBeforePlace,
        scoreAfter: this.score,
        profit: this.milkProfit,
        bombsPlaced: this.bombsPlaced,
        wallsDestroyed: this.wallsDestroyed
      });
    }
  }

  // ========== 广告续命 ==========

  reviveWithAd(count = 3) {
    if (this.gameActive) return false;
    
    // [v0.8.0] 复活不再给炸弹，而是给分数（让玩家能继续放置）
    this.score += 5; // 给5分救命
    this.gameActive = true;
    
    this.emitEvent('revived', { scoreAdded: 5, score: this.score });
    
    // 重新检查状态（以防续命后自动过关）
    this.checkGameState();
    
    return true;
  }

  // ========== 工具方法 ==========

  isValidGridPos(x, y) {
    const half = Math.floor(this.gridSize / 2);
    // [v0.9.9-fix] 偶数棋盘中心对齐：范围改为 [-half+1, half]
    const minC = this.gridSize % 2 === 0 ? -half + 1 : -half;
    const maxC = half;
    return x >= minC && x <= maxC && y >= minC && y <= maxC;
  }

  getState() {
    // 计算剩余墙壁数（排除正在播放死亡动画的）
    const aliveWalls = Array.from(this.walls.values()).filter(w => !w.dying);
    const wallCount = aliveWalls.length;

    return {
      level: this.level,
      score: this.score,
      selectedBombType: this.selectedBombType,
      gameActive: this.gameActive,
      gridSize: this.gridSize,
      wallCount,
      walls: Array.from(this.walls.values()),
      bombs: Array.from(this.bombs.values()).map(b => ({ ...b })),
      staticBombs: Array.from(this.staticBombs.values()).map(sb => ({ ...sb })),
      lastScoreEvent: this.lastScoreEvent,
      bombsPlaced: this.bombsPlaced,
      wallsDestroyed: this.wallsDestroyed,
      // [v0.8.3] 牛奶收益统计
      milkProfit: this.milkProfit,
      scoreBeforePlace: this.scoreBeforePlace,
      isExplosionChain: this.isExplosionChain
    };
  }
}

// 导出到微信小游戏全局
GameGlobal.GameLogic = GameLogic;

// CommonJS 导出
module.exports = GameLogic;
