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
    this.bombsLeft = 0;
    this.score = 0;
    this.gameActive = false;
    this.walls = new Map();      // key: "x,y"
    this.bombs = new Map();      // key: "x,y" (玩家放置的)
    this.staticBombs = new Map(); // key: "x,y" (静态炸弹)
    this.gridSize = 5;
    this.processingExplosion = false; // 防止递归爆炸死锁
    this.pendingVictory = false;      // 延迟胜利，等动画播完
    
    // 连击系统
    this.comboCount = 0;
    this.isInCombo = false;
    
    // 加分事件记录（用于UI显示）
    this.lastScoreEvent = null;  // { text: '普通鼠摧毁 +5', time: Date.now() }
  }
  
  // 添加分数
  addScore(basePoints, reason) {
    this.score += basePoints;
    
    // 记录加分事件
    this.lastScoreEvent = {
      text: reason + ' +' + basePoints,
      time: Date.now()
    };
    
    console.log('[Score]', reason, '+', basePoints, '=', this.score);
  }

  // ========== 关卡初始化 ==========
  
  initLevel(levelConfig) {
    this.gridSize = levelConfig.gridSize || 5;
    this.bombsLeft = levelConfig.bombs || 0;
    this.gameActive = true;
    this.processingExplosion = false;
    this.pendingVictory = false;
    this.walls.clear();
    this.bombs.clear();
    this.staticBombs.clear();

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
      bombsLeft: this.bombsLeft,
      wallCount: this.walls.size
    });

    return this.getState();
  }

  spawnWall(x, y, type, color) {
    const config = ENEMY_TYPES[type || 'normal'];
    const key = `${x},${y}`;
    this.walls.set(key, {
      x, y,
      type: type || 'normal',
      hp: config ? config.hp : 1,
      maxHp: config ? config.hp : 1,
      color: color || null,
      shake: 0,
      state: 'idle'  // 由配置定义的状态机控制
    });
  }

  spawnStaticBomb(x, y, evolution = 0) {
    const key = `${x},${y}`;
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
    // 清除连击（玩家新操作）
    if (this.isInCombo) {
      console.log('[Combo] 连击结束! 最高x' + this.comboCount, '总分=' + this.score);
      this.isInCombo = false;
      this.comboCount = 0;
    }
    
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
    if (this.staticBombs.has(key) && this.staticBombs.get(key).active) {
      this.emitEvent('action_rejected', { reason: 'static_bomb_active', x, y });
      return false;
    }
    if (this.bombsLeft <= 0) {
      this.emitEvent('action_rejected', { reason: 'no_bombs', x, y });
      return false;
    }

    // 放置炸弹
    this.bombsLeft--;
    const bomb = {
      x, y,
      countdown: 3, // 倒计时秒数，由外部根据动画帧数控制
      evolution: 0,
      key,
      animTime: 0, // 独立动画时间（秒）
      animSpeed: 0.8 + Math.random() * 0.4 // 动画速度系数 (0.8~1.2)
    };
    this.bombs.set(key, bomb);

    this.emitEvent('bomb_placed', { 
      x, y, 
      bomb: { ...bomb },
      bombsLeft: this.bombsLeft 
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
      console.log('[Combo] 连击开始');
    }
    
    this.bombs.delete(bomb.key);
    this.emitEvent('bomb_exploded', { x: bomb.x, y: bomb.y, evolution: bomb.evolution });

    // 计算爆炸范围
    const range = this.getExplosionRange(bomb);
    console.log('[Explosion] Bomb at', bomb.x, bomb.y, 'evo:', bomb.evolution, 'range:', JSON.stringify(range));
    
    // 处理爆炸范围内的所有格子
    range.forEach(pos => {
      console.log('[Explosion] Hit pos:', pos.x, pos.y, 'type:', pos.distance === 0 ? 'center' : (Math.abs(pos.x - bomb.x) === Math.abs(pos.y - bomb.y) ? 'diag' : 'cross'));
      this.processExplosionHit(pos.x, pos.y, bomb.evolution);
    });

    // 处理静态炸弹被引爆（这可能会触发连锁爆炸）
    this.triggerStaticBombs(bomb, range);

    // 升级相邻炸弹
    this.upgradeAdjacentBombs(bomb);

    this.processingExplosion = false;

    // 检查游戏状态
    this.checkGameState();
  }

  getExplosionRange(bomb) {
    const evo = bomb.evolution || 0;
    // 4级炸弹(evo=3)特殊处理：确保对角方向正确计算
    const power = 1 + Math.floor(evo / 2); // 十字方向: Lv0/1->1, Lv2/3->2
    const diagPower = (evo % 2 === 1) ? power : 0; // 对角: 奇数等级有

    const range = [{ x: bomb.x, y: bomb.y, distance: 0 }];

    // 十字方向
    const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
    dirs.forEach(([dx, dy]) => {
      for (let d = 1; d <= power; d++) {
        range.push({ x: bomb.x + dx * d, y: bomb.y + dy * d, distance: d });
      }
    });

    // 对角方向 - 4级(evo=3)应该有diagPower=2
    if (diagPower > 0) {
      const diags = [[-1,-1], [1,-1], [-1,1], [1,1]];
      diags.forEach(([dx, dy]) => {
        for (let d = 1; d <= diagPower; d++) {
          range.push({ x: bomb.x + dx * d, y: bomb.y + dy * d, distance: d });
        }
      });
    }
    
    console.log('[ExplosionRange] evo:', evo, 'power:', power, 'diagPower:', diagPower, 'total:', range.length);
    if (evo >= 2) {
      console.log('[ExplosionRange] Lv' + (evo+1) + ' range:', JSON.stringify(range));
    }

    return range;
  }

  processExplosionHit(x, y, bombEvo) {
    const key = `${x},${y}`;
    const wall = this.walls.get(key);
    
    // 4级炸弹调试日志
    if (bombEvo >= 3) {
      console.log('[Explosion] Lv4 Check wall at', x, y, 'key:', key, 'found:', !!wall, 'hp:', wall ? wall.hp : 'N/A');
    }
    
    if (!wall) return;

    wall.hp--;

    if (wall.hp <= 0) {
      this.handleEnemyDeath(wall, key);
    } else {
      this.handleEnemyDamaged(wall, key);
    }
  }

  // 连击计分
  addComboScore(basePoints, reason) {
    if (!this.isInCombo) {
      // 不在连击中，直接加分
      this.addScore(basePoints, reason);
      return;
    }
    
    this.comboCount++;
    
    // 计算倍数: 2^(n-1), 上限 8 (即 2^3)
    const multiplier = Math.min(Math.pow(2, this.comboCount - 1), 8);
    
    // 最终得分
    const finalScore = basePoints * multiplier;
    this.score += finalScore;
    
    console.log('[Combo] x' + this.comboCount, 
                '基础' + basePoints, 
                '倍数x' + multiplier, 
                '最终+' + finalScore,
                '总分=' + this.score);
  }

  // ========== 敌人状态处理（配置驱动） ==========

  handleEnemyDeath(wall, key) {
    const config = ENEMY_TYPES[wall.type];
    if (!config) {
      // 未知类型，直接删除
      this.walls.delete(key);
      return;
    }

    wall.dying = true;
    
    // 连击计分
    const points = config.score || 5;
    this.addComboScore(points, wall.type + '摧毁');

    // 发送死亡事件
    this.emitEvent('enemy_death', {
      x: wall.x, y: wall.y,
      wallType: wall.type,
      isElite: wall.type === 'strong',
      score: this.score,
      gained: points
    });

    // 根据配置处理特殊死亡逻辑
    if (config.onDeath === 'bombWall') {
      // 炸弹墙：返还炸弹并连锁爆炸
      this.bombsLeft++;
      this.emitEvent('bomb_refilled', { x: wall.x, y: wall.y, bombsLeft: this.bombsLeft });
      
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

    // 延迟移除
    const duration = config.deathDuration || 2000;
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

  triggerStaticBombs(explodedBomb, range) {
    this.staticBombs.forEach(staticBomb => {
      // 检查是否在爆炸范围内
      const inRange = range.some(r => r.x === staticBomb.x && r.y === staticBomb.y);
      if (!inRange) return;

      if (!staticBomb.active) {
        // 首次被激活（不升级，保持原等级）
        staticBomb.active = true;
        staticBomb.countdown = 3;
        
        // 静态炸弹激活计分
        this.addScore(5, '静态炸弹激活');
        
        this.emitEvent('static_bomb_activated', {
          x: staticBomb.x,
          y: staticBomb.y,
          evolution: staticBomb.evolution
        });
        // 启动倒计时
        this.startStaticBombCountdown(staticBomb);
      } else {
        // 已激活，升级并重置倒计时
        staticBomb.evolution++;
        staticBomb.countdown = 3;
        this.emitEvent('static_bomb_upgraded', {
          x: staticBomb.x,
          y: staticBomb.y,
          evolution: staticBomb.evolution
        });
      }
    });
  }

  startStaticBombCountdown(staticBomb) {
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
          countdown: staticBomb.countdown
        });
        setTimeout(tick, 1000);
      }
    };
    setTimeout(tick, 1000);
  }

  explodeStaticBomb(staticBomb) {
    if (!this.staticBombs.has(staticBomb.key)) return;
    if (this.processingExplosion) {
      setTimeout(() => this.explodeStaticBomb(staticBomb), 50);
      return;
    }
    
    this.processingExplosion = true;
    
    this.staticBombs.delete(staticBomb.key);
    this.emitEvent('static_bomb_exploded', { 
      x: staticBomb.x, 
      y: staticBomb.y,
      evolution: staticBomb.evolution 
    });

    // 计算爆炸范围
    const range = this.getExplosionRange(staticBomb);
    
    // 处理爆炸范围内的所有格子
    range.forEach(pos => {
      this.processExplosionHit(pos.x, pos.y, staticBomb.evolution);
    });

    // 静态炸弹爆炸也能触发其他静态炸弹和升级相邻炸弹
    this.triggerStaticBombs(staticBomb, range);
    this.upgradeAdjacentBombs(staticBomb);

    this.processingExplosion = false;

    // 检查游戏状态
    this.checkGameState();
  }

  upgradeAdjacentBombs(explodedBomb) {
    // 爆炸后升级周围炸弹（8方向相邻）
    const dirs = [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]];
    
    dirs.forEach(([dx, dy]) => {
      const nx = explodedBomb.x + dx;
      const ny = explodedBomb.y + dy;
      const neighborKey = `${nx},${ny}`;
      const neighbor = this.bombs.get(neighborKey);
      
      if (neighbor && neighbor.key !== explodedBomb.key) {
        // 升级：爆炸范围+1
        if (neighbor.evolution < 3) {
          const oldLevel = neighbor.evolution;
          neighbor.evolution++;
          // 重置倒计时为1.5秒（90帧）
          neighbor.countdown = 90;
          
          // 升级计分
          const upgradePoints = 5 * (neighbor.evolution + 1);
          this.addScore(upgradePoints, '炸弹升级Lv' + oldLevel + '->Lv' + neighbor.evolution);
          
          this.emitEvent('bomb_upgraded', { 
            x: neighbor.x, y: neighbor.y, 
            evolution: neighbor.evolution,
            reason: 'explosion_adjacent'
          });
        }
      }
    });
  }

  // ========== 游戏状态 ==========

  checkGameState() {
    if (!this.gameActive) return;

    // 计算剩余墙壁（包括所有类型）
    const remaining = this.walls.size;

    console.log('[GameLogic] Check state - remaining walls:', remaining, 'bombsLeft:', this.bombsLeft, 'activeBombs:', this.bombs.size, 'staticBombs:', this.staticBombs.size);

    if (remaining === 0) {
      // 胜利
      this.handleVictory();
    } else {
      // 检查是否失败
      this.checkFailure();
    }
  }

  handleVictory() {
    if (this.pendingVictory) return;
    this.pendingVictory = true;
    this.gameActive = false;
    const bonus = this.bombsLeft * 50;
    this.score += bonus;
    
    console.log('[GameLogic] Victory pending! Level:', this.level, 'Score:', this.score, 'Bonus:', bonus);
  }

  confirmVictory() {
    if (!this.pendingVictory) return;
    this.pendingVictory = false;
    
    console.log('[GameLogic] Victory confirmed! Level:', this.level);
    
    this.emitEvent('level_complete', { 
      level: this.level,
      score: this.score,
      bonus: this.bombsLeft * 50,
      bombsLeft: this.bombsLeft
    });
  }

  checkFailure() {
    // 检查是否还有活跃的玩家炸弹（倒计时中的）
    const hasActiveBombs = this.bombs.size > 0;
    
    // 检查是否还有已激活且正在倒计时中的静态炸弹
    const hasActiveStaticBombs = Array.from(this.staticBombs.values()).some(sb => sb.active);
    
    // 检查是否还有未激活的静态炸弹
    const hasInactiveStaticBombs = Array.from(this.staticBombs.values()).some(sb => !sb.active);
    
    // 检查是否还有可放置的炸弹
    const hasBombsLeft = this.bombsLeft > 0;

    console.log('[GameLogic] Check failure - hasActiveBombs:', hasActiveBombs, 'hasActiveStaticBombs:', hasActiveStaticBombs, 'hasInactiveStaticBombs:', hasInactiveStaticBombs, 'hasBombsLeft:', hasBombsLeft);

    // 失败条件：没有任何可以产生爆炸的东西了
    // - 没有活跃的玩家炸弹
    // - 没有活跃的静态炸弹（倒计时中）
    // - 没有未激活的静态炸弹
    // - 没有剩余炸弹可放置
    if (!hasActiveBombs && !hasActiveStaticBombs && !hasBombsLeft && !hasInactiveStaticBombs) {
      // 确定失败
      this.gameActive = false;
      
      const remainingWalls = this.walls.size;
      
      console.log('[GameLogic] Game Over! Remaining walls:', remainingWalls);
      
      this.emitEvent('level_failed', { 
        reason: 'out_of_bombs',
        remainingWalls: remainingWalls,
        score: this.score
      });
    }
  }

  // ========== 广告续命 ==========

  reviveWithAd(count = 3) {
    if (this.gameActive) return false;
    
    this.bombsLeft += count;
    this.gameActive = true;
    
    this.emitEvent('revived', { bombsAdded: count, bombsLeft: this.bombsLeft });
    
    // 重新检查状态（以防续命后自动过关）
    this.checkGameState();
    
    return true;
  }

  // ========== 工具方法 ==========

  isValidGridPos(x, y) {
    const half = Math.floor(this.gridSize / 2);
    return x >= -half && x <= half && y >= -half && y <= half;
  }

  getState() {
    // 计算剩余墙壁数（排除正在播放死亡动画的）
    const aliveWalls = Array.from(this.walls.values()).filter(w => !w.dying);
    const wallCount = aliveWalls.length;

    return {
      level: this.level,
      bombsLeft: this.bombsLeft,
      score: this.score,
      gameActive: this.gameActive,
      gridSize: this.gridSize,
      wallCount,
      walls: Array.from(this.walls.values()),
      bombs: Array.from(this.bombs.values()).map(b => ({ ...b })),
      staticBombs: Array.from(this.staticBombs.values()).map(sb => ({ ...sb })),
      lastScoreEvent: this.lastScoreEvent
    };
  }
}

// 导出到微信小游戏全局
GameGlobal.GameLogic = GameLogic;

// CommonJS 导出
module.exports = GameLogic;
