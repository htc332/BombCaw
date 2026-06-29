/**
 * main.js
 * 游戏主入口
 */

class BombWallGame {
  constructor() {
    this.startTime = Date.now();
    this.debugLogs = [];
    this.maxLogs = 20;
    this.isDebugMode = true; // [v0.8.4-fix] 临时开启调试模式排查BUG
    
    this.initCanvas();
    this.initSystems();
    this.initGame();
    this.bindEvents();
    this.startLoop();
    
    this.log('[BombWall] Game initialized');
  }

  log(msg) {
    var time = ((Date.now() - this.startTime) / 1000).toFixed(1);
    var logMsg = '[' + time + 's] ' + msg;
    this.debugLogs.push(logMsg);
    if (this.debugLogs.length > this.maxLogs) {
      this.debugLogs.shift();
    }
    // 生产环境关闭日志输出，只保留到debugLogs数组用于屏幕显示
    if (this.isDebugMode) {
      console.log(logMsg);
    }
  }

  initCanvas() {
    // 微信小游戏：优先使用全局 canvas
    if (typeof canvas !== 'undefined' && canvas) {
      this.canvas = canvas;
      this.log('[Canvas] Using global canvas');
    } else {
      this.canvas = wx.createCanvas();
      this.log('[Canvas] Created new canvas');
    }
    
    this.ctx = this.canvas.getContext('2d');
    
    // roundRect polyfill（微信真机必需）
    try {
      var testCtx = wx.createCanvas().getContext('2d');
      var proto = Object.getPrototypeOf(testCtx);
      if (proto && !proto.roundRect) {
        proto.roundRect = function(x, y, w, h, radii) {
          var r = 0;
          if (Array.isArray(radii)) { r = radii[0] || 0; }
          else if (typeof radii === 'number') { r = radii; }
          r = Math.min(r, w / 2, h / 2);
          this.moveTo(x + r, y);
          this.lineTo(x + w - r, y);
          this.quadraticCurveTo(x + w, y, x + w, y + r);
          this.lineTo(x + w, y + h - r);
          this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          this.lineTo(x + r, y + h);
          this.quadraticCurveTo(x, y + h, x, y + h - r);
          this.lineTo(x, y + r);
          this.quadraticCurveTo(x, y, x + r, y);
          this.closePath();
          return this;
        };
        this.log('[Polyfill] roundRect injected');
      } else {
        this.log('[Polyfill] roundRect already exists');
      }
    } catch (e) {
      this.log('[Polyfill] failed: ' + e.message);
    }
    
    var info = wx.getWindowInfo ? wx.getWindowInfo() : {
      windowWidth: 375, windowHeight: 667, pixelRatio: 2
    };
    
    this.pixelRatio = info.pixelRatio || 2;
    this.canvas.width = info.windowWidth * this.pixelRatio;
    this.canvas.height = info.windowHeight * this.pixelRatio;
    
    this.log('[Canvas] Size: ' + this.canvas.width + 'x' + this.canvas.height);
  }

  initSystems() {
    this.log('[Systems] Initializing...');
    
    this.storage = new Storage();
    
    this.gameLogic = new GameLogic();
    this.gameLogic.onEvent = (event) => this.handleGameEvent(event);
    
    this.levelSystem = new LevelSystem(this.storage);
    
    this.renderer = new Renderer(this.canvas);
    
    this.animator = new Animator();
    this.particles = new ParticleSystem();
    this.uiManager = new UIManager(this.canvas, this.renderer);
    
    // [v0.8.0] 设置购买栏点击回调 - 新计分系统
    this.uiManager.onShopItemClick = (index) => {
      const bombCosts = [2, 3, 4, 5]; // LV1-4 消耗
      const score = this.gameLogic.score || 0;
      
      if (score < bombCosts[index]) {
        // 点击了买不起的档位，自动降级到能释放的最高档位
        let newType = index;
        while (newType > 0 && score < bombCosts[newType]) {
          newType--;
        }
        
        if (score < bombCosts[newType]) {
          // 全都不能释放
          this.lastShopAction = { type: 'cannot_afford', cost: bombCosts[index], score: score, time: Date.now() };
          this.showHint('积分不足');
          return;
        }
        
        // 自动切换到能释放的档位
        this.gameLogic.selectedBombType = newType;
        this.lastShopAction = { type: 'selected', level: newType, time: Date.now() };
        this.showHint('已选择 ' + (['白色','蓝色','紫色','红色'][newType]) + '炸弹牛 (消耗' + bombCosts[newType] + '分)');
        return;
      }
      
      this.gameLogic.selectedBombType = index;
      this.lastShopAction = { type: 'selected', level: index, time: Date.now() };
      this.showHint('已选择 ' + (['白色','蓝色','紫色','红色'][index]) + '炸弹牛 (消耗' + bombCosts[index] + '分)');
    };
    
    // 将 uiManager 引用传递给 renderer，用于绘制购买栏
    this.renderer.uiManager = this.uiManager;
    
    this.audio = audioManager;
    this.audio.init();
    this.audio.loadBGM(); // 预加载背景音乐
    
    this.adManager = new AdManager();
    
    this.transitionTimer = null;
    this.hint = '';
    this.hintTimer = null;
    this.pendingLevel = 1;
    this.loadingProgress = 0;
    this.loadingStatus = '准备下载...';
    this.downloadComplete = false;
    this.downloadFailed = false;
    this.lastRenderTime = Date.now();
    
    this.log('[Systems] Ready');
  }

  initGame() {
    this.gameState = 'login';
    this.pendingLevel = this.levelSystem.currentLevel || 1;
    
    this.renderer.loadImages().then(() => {
      // console.log('[Game] Main images loaded');
    }).catch(err => {
      // console.warn('[Game] Main images load failed:', err);
    });
    
    this.startDownload();
  }

  startDownload() {
    // console.log('[Game] startDownload');
    this.loadingStatus = '正在加载资源...';
    this.loadingProgress = 0;
    this.downloadFailed = false;
    
    // 备用：5秒后强制进入
    this._downloadForceTimer = setTimeout(() => {
      if (this.gameState === 'login') {
        // console.log('[Game] Download timeout, forcing entry');
        this.loadingProgress = 1;
        this.loadingStatus = '加载超时，尝试进入...';
        this.renderer.loadSubpackageImages(() => {
          // console.log('[Game] Timeout callback executed');
          this.gameState = 'playing';
          this.startLevel(this.pendingLevel || 1);
        });
      }
    }, 5000);
    
    var task = wx.loadSubpackage({
      name: 'res',
      success: () => {
        // console.log('[Game] Subpackage loaded');
        this.loadingProgress = 1;
        this.loadingStatus = '资源加载完成';
        
        if (this._downloadForceTimer) {
          clearTimeout(this._downloadForceTimer);
          this._downloadForceTimer = null;
        }
        
        var imagesLoaded = false;
        var imageTimeout = setTimeout(() => {
          if (!imagesLoaded) {
            // console.log('[Game] Image load timeout, entering game');
            this.gameState = 'playing';
            this.startLevel(this.pendingLevel || 1);
          }
        }, 3000);
        
        // console.log('[Game] Loading subpackage images...');
        this.renderer.loadSubpackageImages(() => {
          // console.log('[Game] Subpackage images loaded');
          imagesLoaded = true;
          clearTimeout(imageTimeout);
          this.gameState = 'playing';
          this.startLevel(this.pendingLevel || 1);
        });
      },
      fail: (err) => {
        // console.error('[Game] Subpackage failed:', err);
        this.loadingStatus = '资源加载失败，点击重试';
        this.downloadFailed = true;
        
        if (this._downloadForceTimer) {
          clearTimeout(this._downloadForceTimer);
          this._downloadForceTimer = null;
        }
      }
    });
    
    if (task && task.onProgressUpdate) {
      task.onProgressUpdate((res) => {
        this.loadingProgress = res.progress / 100;
      });
    }
  }

  startLevel(level) {
    // console.log('[Game] Starting level', level);
    
    this.gameState = 'playing';
    this.gameLogic.level = level;
    
    var config = this.levelSystem.getLevelConfig(level);
    this.gameLogic.initLevel(config);
    
    // [v0.7.9] 旧提示系统已废弃，使用购买栏动态提示
    // this.hint = config.hint || '点击空白格放置炸弹';
    this.hint = '';
    
    this.animator.clear();
    this.particles.clear();
    
    if (this.transitionTimer) {
      clearTimeout(this.transitionTimer);
      this.transitionTimer = null;
    }
  }

  bindEvents() {
    wx.onTouchStart((e) => {
      var touch = e.touches[0];
      var x = touch.clientX * this.pixelRatio;
      var y = touch.clientY * this.pixelRatio;
      this.handleTouch(x, y);
    });

    wx.onShow(() => {
      // console.log('[BombWall] Game shown');
    });

    wx.onHide(() => {
      // console.log('[BombWall] Game hidden');
    });
  }

  handleTouch(x, y) {
    // console.log('[Touch] handleTouch called', x, y, 'gameState:', this.gameState);
    
    if (this.gameState === 'login') {
      // console.log('[Touch] rejected: login state');
      if (this.downloadFailed) {
        this.downloadFailed = false;
        this.startDownload();
      }
      return;
    }
    
    if (this.uiManager.currentScene !== 'game') {
      // console.log('[Touch] rejected: ui scene', this.uiManager.currentScene);
      this.uiManager.handleTouch(x, y);
      return;
    }
    
    if (this.gameState !== 'playing') {
      // console.log('[Touch] rejected: not playing', this.gameState);
      return;
    }
    
    // 优先检测购买栏点击
    if (this.uiManager.onShopBarClick(x, y)) {
      return;
    }
    
    var gridPos = this.screenToGrid(x, y);
    // console.log('[Touch] gridPos:', gridPos);
    if (!gridPos) {
      // console.log('[Touch] rejected: invalid grid position');
      return;
    }
    
    var success = this.gameLogic.tryPlaceBomb(gridPos.x, gridPos.y);
    // console.log('[Touch] tryPlaceBomb result:', success);
    
    if (success) {
      this.lastShopAction = { type: 'placed', time: Date.now() };
      this.audio.play('place');
      
      // [v0.8.0] 放置后检查分数是否还够当前选中的档位，不够则自动降级
      const bombCosts = [2, 3, 4, 5];
      const currentScore = this.gameLogic.score || 0;
      const currentSelected = this.gameLogic.selectedBombType || 0;
      if (currentScore < bombCosts[currentSelected]) {
        let newType = currentSelected;
        while (newType > 0 && currentScore < bombCosts[newType]) {
          newType--;
        }
        if (currentScore >= bombCosts[newType]) {
          this.gameLogic.selectedBombType = newType;
          this.showHint('自动切换为 ' + (['白色','蓝色','紫色','红色'][newType]) + '炸弹牛');
        }
      }
    } else {
      this.lastShopAction = { type: 'rejected', time: Date.now() };
    }
  }

  screenToGrid(screenX, screenY) {
    return this.renderer.screenToGrid(screenX, screenY, this.gameLogic.gridSize);
  }

  handleGameEvent(event) {
    this.log('[Event] ' + event.type);
    
    switch (event.type) {
      case 'bomb_placed':
        this.showHint('炸弹放置! 倒计时: ' + event.bomb.countdown);
        break;
        
      case 'countdown_tick':
        break;
        
      case 'bomb_exploded':
        this.onBombExploded(event);
        break;
        
      case 'static_bomb_exploded':
        this.onStaticBombExploded(event);
        break;
        
      case 'wall_destroyed':
        this.onWallDestroyed(event);
        break;
        
      case 'enemy_death':
        this.onEnemyDeath(event);
        break;
        
      case 'wall_damaged':
        this.onWallDamaged(event);
        break;
        
      case 'bomb_upgraded':
        this.onBombUpgraded(event);
        break;
        
      case 'static_bomb_activated':
        this.showHint('静态炸弹激活!');
        break;
        
      case 'action_rejected':
        this.onActionRejected(event);
        break;
        
      case 'level_started':
        this.log('[Level] Started');
        break;
        
      case 'level_complete':
        this.onLevelComplete(event);
        break;
        
      case 'level_failed':
        this.onLevelFailed(event);
        break;
        
      case 'revived':
        this.showHint('获得' + event.scoreAdded + '分!');
        break;
    }
  }

  // ========== 坐标转换工具 ==========
  
  /**
   * 将网格坐标转为屏幕坐标
   * 所有特效统一使用此函数
   */
  toScreen(gx, gy) {
    return this.renderer.gridToScreen(gx, gy, this.gameLogic.gridSize);
  }
  
  /**
   * 获取进化等级对应颜色
   * v0.7.0: 支持新的 evolution 映射 (0,2,3,5)
   */
  getEvolutionColor(evolution) {
    // 根据 BOMB_TYPES 配置映射颜色
    var colorMap = {
      0: '#FFFFFF',   // Lv1 白色炸弹牛
      2: '#5BA3F5',   // Lv2 蓝色炸弹牛
      3: '#C084FC',   // Lv3 紫色炸弹牛
      5: '#FF4444'    // Lv4 红色炸弹牛
    };
    return colorMap[evolution] || '#FF6B35';
  }

  // ========== 特效事件处理 ==========

  onBombExploded(event) {
    var pos = this.toScreen(event.x, event.y);
    var cellSize = this.renderer.cellSize;
    var evo = event.evolution || 0;
    
    // console.log('[Main] Bomb explode at', event.x, event.y, 'evo', evo);
    
    // [v0.7.10] 幽灵鼠显隐已由 GameLogic.revealGhostIfHit 独立控制，此处无需全局处理
    
    // 音效即时触发
    this.audio.play('explosion');
    
    // 创建爆炸特效 - 传入 evo 让 Animator 根据新的爆炸范围绘制
    // [v0.8.1] 传入 blockedCells 让特效显示墙壁鼠阻挡
    var gridSize = this.gameLogic.gridSize;
    var centerGridX = event.x;
    var centerGridY = event.y;
    var blockedCells = event.blockedCells || [];
    this.animator.createCrossExplosion(pos.cx, pos.cy, cellSize, evo, gridSize, centerGridX, centerGridY, blockedCells);
    
    // 轻量辅助粒子（仅中心）- 只在evolution<=1时触发，避免高等级时粒子过多
    if (evo <= 1) {
      this.particles.createExplosion(pos.cx, pos.cy, evo);
    }
    
    var now = Date.now();
    if (now - this.lastExplosionTime < 500) {
      this.chainExplosionCount++;
      if (this.chainExplosionCount >= 3) {
        this.audio.play('combo');
        this.showHint(this.chainExplosionCount + '连击!');
      }
    } else {
      this.chainExplosionCount = 1;
    }
    this.lastExplosionTime = now;
  }

  onStaticBombExploded(event) {
    var pos = this.toScreen(event.x, event.y);
    var cellSize = this.renderer.cellSize;
    var evo = event.evolution || 0;
    var gridSize = this.gameLogic.gridSize;
    
    console.log('[Main] Static bomb exploded, evo:', evo, 'at', event.x, event.y);
    
    // [v0.7.10] 幽灵鼠显隐已由 GameLogic.revealGhostIfHit 独立控制，此处无需全局处理
    
    // [v0.8.1] 传入 blockedCells 让特效显示墙壁鼠阻挡
    var blockedCells = event.blockedCells || [];
    this.animator.createCrossExplosion(
      pos.cx, pos.cy, cellSize, evo,
      gridSize, event.x, event.y, blockedCells
    );
    
    // 轻量辅助粒子（仅中心）
    this.particles.createExplosion(pos.cx, pos.cy, evo);
    
    this.audio.play('explosion');
  }

  onWallDestroyed(event) {
    // 墙壁破坏不用特效
    this.audio.play('break');
    
    if (event.color) {
      this.audio.play('bonus');
      this.showHint('颜色匹配! 额外奖励!');
    }
  }

  onEnemyDeath(event) {
    // 播放死亡动画（根据墙壁类型选择专用动画）
    this.renderer.addDeathAnimation(event.x, event.y, event.wallType || 'normal');
    this.audio.play('break');
    
    // [v0.8.4] 积分飘字：牛奶+1
    if (event.gained && event.gained > 0) {
      this.renderer.addScoreFloatAnimation(event.x, event.y, `牛奶+${event.gained}`, this.gameLogic.gridSize);
    }
    
    // [Ghost] 幽灵鼠被炸死时，显示提示
    if (event.wallType === 'ghost') {
      this.showHint('幽灵鼠被消灭!');
    }
  }

  onWallDamaged(event) {
    var pos = this.toScreen(event.x, event.y);
    this.animator.createDamageFlash(pos.cx, pos.cy);
    this.audio.play('damage');
  }

  onBombUpgraded(event) {
    var pos = this.toScreen(event.x, event.y);
    var evo = event.evolution || 0;  // 使用 evolution，不是 newEvolution
    
    // console.log('[Main] Bomb upgraded at', event.x, event.y, 'evo:', evo);
    
    // Animator: 光环
    this.animator.createUpgrade(pos.cx, pos.cy, this.renderer.cellSize);
    
    // ParticleSystem: 上升粒子
    this.particles.createUpgrade(pos.cx, pos.cy, evo);
    
    this.audio.play('upgrade');
    this.showHint('炸弹升级! Lv.' + (evo + 1));
  }

  onLevelComplete(event) {
    this.log('[Level] Complete!');
    this.gameState = 'victory';
    this.audio.play('victory');
    
    // [v0.8.0] 新计分系统：通关保留分数，不再重置
    // 保存分数到总分
    var totalScore = this.storage.get('total_score') || 0;
    this.storage.set('total_score', totalScore + event.score);
    
    // 记录关卡最高分
    var bestKey = 'level_' + event.level + '_best';
    var currentBest = this.storage.get(bestKey) || 0;
    if (event.score > currentBest) {
      this.storage.set(bestKey, event.score);
    }
    
    var nextLevel = event.level + 1;
    this.levelSystem.unlockNext(event.level);
    
    this.transitionTimer = setTimeout(() => {
      this.startLevel(nextLevel);
    }, 3000);
  }

  onLevelFailed(event) {
    this.log('[Level] Failed!');
    this.gameState = 'failed';
    this.audio.play('defeat');
    
    // [v0.8.0] 新计分系统：失败重置分数为10分
    this.gameLogic.score = 10;
    
    this.transitionTimer = setTimeout(() => {
      this.startLevel(this.gameLogic.level);
    }, 3000);
  }

  onActionRejected(event) {
    var messages = {
      'game_inactive': '游戏未开始',
      'invalid_position': '无效位置',
      'wall_exists': '此处有墙壁',
      'bomb_exists': '此处已有炸弹',
      'static_bomb_active': '静态炸弹已激活',
      'insufficient_score': '积分不足!',
      'all_bombs_unaffordable': '得分不足，无法释放任何炸弹！'
    };
    
    this.showHint(messages[event.reason] || '无法放置');
  }

  showHint(text) {
    this.hint = text;
    
    if (this.hintTimer) {
      clearTimeout(this.hintTimer);
    }
    
    this.hintTimer = setTimeout(() => {
      if (this.hint === text) {
        this.hint = '';
      }
    }, 3000);
  }

  startLoop() {
    this.lastTime = Date.now();
    this.lastRenderTime = Date.now();
    
    var loop = () => {
      this.loop();
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(loop);
      } else {
        setTimeout(loop, 16);
      }
    };
    loop();
  }

  loop() {
    try {
      var now = Date.now();
      var dt = (now - this.lastTime) / 1000;
      this.lastTime = now;
      
      this.animator.update(dt);
      this.particles.update();
      // 更新全局动画时间（用于墙壁动画）
      this.renderer.updateBombAnimation(dt);
      
      if (this.gameLogic.pendingVictory) {
        if (this.animator.getActiveCount() === 0 && this.particles.getActiveCount() === 0) {
          this.gameLogic.confirmVictory();
        }
      }
      
      this.render(dt);
    } catch (e) {
      this.log('[LOOP ERROR] ' + e.message);
      // 生产环境只记录到debugLogs，不输出到console
      if (this.isDebugMode) {
        console.error('[LOOP ERROR]', e);
      }
    }
  }

  render(dt) {
    try {
      var ctx = this.ctx;
      var w = this.canvas.width;
      var h = this.canvas.height;
      var pr = this.pixelRatio || 2;
      
      if (this.gameState === 'login') {
        this.drawLoginScreen(ctx, w, h, pr);
        // 生产环境关闭屏幕日志显示
        if (this.isDebugMode) {
          this.drawDebugLogs(ctx, pr);
        }
        return;
      }
      
      var shake = this.animator.getScreenShake();
      ctx.save();
      if (shake.x !== 0 || shake.y !== 0) {
        ctx.translate(shake.x, shake.y);
      }
      
      var state = this.gameLogic.getState();
      state.hint = this.hint;
      state.gameState = this.gameState;
      state.lastShopAction = this.lastShopAction;
      
      this.lastRenderTime = Date.now();
      
      this.renderer.render(state, dt);
      
      // 设置网格裁剪区域，限制特效只在网格内显示
      var gridSize = state.gridSize || 5;
      var layout = this.renderer.calcLayout(gridSize);
      var cs = layout.cellSize;
      var g = layout.gap || 0;
      var totalW = gridSize * cs + (gridSize - 1) * g;
      var totalH = totalW;
      
      ctx.save();
      ctx.beginPath();
      ctx.rect(layout.offsetX, layout.offsetY, totalW, totalH);
      ctx.clip();
      
      // Layer 2: 粒子系统（在裁剪区域内）
      this.particles.draw(ctx);
      
      // Layer 3: 几何动画（在裁剪区域内）
      this.animator.draw(ctx);
      
      ctx.restore(); // 恢复裁剪
      
      this.renderUI();
      // 生产环境关闭屏幕日志显示
      if (this.isDebugMode) {
        this.drawDebugLogs(ctx, pr);
      }
      
      ctx.restore();
      
      this.animator.drawScreenFlash(ctx, w, h);
    } catch (e) {
      this.log('[RENDER ERROR] ' + e.message);
      // 生产环境只记录到debugLogs，不输出到console
      if (this.isDebugMode) {
        console.error('[RENDER ERROR]', e);
      }
    }
  }

  drawDebugLogs(ctx, pr) {
    if (!this.debugLogs || this.debugLogs.length === 0) return;
    
    var logH = 16 * pr;
    var maxLines = Math.min(this.debugLogs.length, 15);
    var startY = 10 * pr;
    
    ctx.save();
    ctx.globalAlpha = 0.85;
    
    for (var i = 0; i < maxLines; i++) {
      var log = this.debugLogs[this.debugLogs.length - 1 - i];
      var y = startY + i * logH;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(5 * pr, y - logH * 0.7, ctx.measureText(log).width + 10 * pr, logH);
      
      ctx.fillStyle = '#0F0';
      ctx.font = (10 * pr) + 'px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(log, 10 * pr, y);
    }
    
    ctx.restore();
  }

  drawLoginScreen(ctx, w, h, pr) {
    // 先尝试从子包加载登录图（如果还没加载）
    if (!this.renderer.uiImages.login) {
      // 尝试同步加载图片
      var img = wx.createImage();
      var self = this;
      img.onload = function() {
        self.renderer.uiImages.login = img;
      };
      img.src = 'res/ui/Login.png';
    }
    
    var loginImg = this.renderer.uiImages.login;
    if (loginImg && loginImg.width > 0) {
      var imgW = loginImg.width;
      var imgH = loginImg.height;
      var scaleX = w / imgW;
      var scaleY = h / imgH;
      var scale = Math.max(scaleX, scaleY);
      var drawW = imgW * scale;
      var drawH = imgH * scale;
      var drawX = (w - drawW) / 2;
      var drawY = (h - drawH) / 2;
      ctx.drawImage(loginImg, drawX, drawY, drawW, drawH);
    } else {
      ctx.fillStyle = '#1A1A2E';
      ctx.fillRect(0, 0, w, h);
    }
    
    var progress = this.loadingProgress || 0;
    var barW = 280 * pr;
    var barH = 12 * pr;
    var barX = (w - barW) / 2;
    var barY = h - 90 * pr;
    
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.roundRect(barX - 4, barY - 4, barW + 8, barH + 8, [8 * pr]);
    ctx.fill();
    
    ctx.fillStyle = progress >= 1 ? '#4CAF50' : '#FF6B9D';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW * progress, barH, [6 * pr]);
    ctx.fill();
    
    ctx.fillStyle = '#2A1A3E';
    ctx.font = 'bold ' + (18 * pr) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.floor(progress * 100) + '%', w / 2, barY + barH / 2);
    
    ctx.fillStyle = '#2A1A3E';
    ctx.font = 'bold ' + (14 * pr) + 'px sans-serif';
    ctx.fillText(this.loadingStatus || '准备加载...', w / 2, barY - 24 * pr);
    
    if (progress >= 1) {
      ctx.fillStyle = '#4CAF50';
      ctx.font = 'bold ' + (12 * pr) + 'px sans-serif';
      ctx.fillText('进入游戏中...', w / 2, barY + barH + 20 * pr);
    }
    
    if (this.downloadFailed) {
      var btnW = 200 * pr;
      var btnH = 50 * pr;
      var btnX = (w - btnW) / 2;
      var btnY = h - 70 * pr;
      
      ctx.fillStyle = '#FF6B35';
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, [25 * pr]);
      ctx.fill();
      
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold ' + (18 * pr) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('重试下载', w / 2, btnY + btnH / 2);
    }
  }

  renderUI() {
    var ctx = this.ctx;
    var w = this.canvas.width;
    var h = this.canvas.height;
    var pr = this.pixelRatio || 2;
    
    if (this.gameState === 'victory') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, w, h);
      
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold ' + (36 * pr) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('关卡完成!', w / 2, h / 2 - 60 * pr);
      
      var state = this.gameLogic.getState();
      ctx.fillStyle = '#FFF';
      ctx.font = (18 * pr) + 'px sans-serif';
      ctx.fillText('最终积分: ' + state.score, w / 2, h / 2 - 15 * pr);
      ctx.fillText('放置炸弹: ' + state.bombsPlaced + '颗', w / 2, h / 2 + 15 * pr);
      ctx.fillText('消灭老鼠: ' + state.wallsDestroyed + '只', w / 2, h / 2 + 45 * pr);
      ctx.fillText('3秒后进入下一关...', w / 2, h / 2 + 85 * pr);
    }
    
    if (this.gameState === 'failed') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, w, h);
      
      ctx.fillStyle = '#FF6B35';
      ctx.font = 'bold ' + (32 * pr) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('游戏结束', w / 2, h / 2 - 40 * pr);
      
      var state = this.gameLogic.getState();
      ctx.fillStyle = '#888';
      ctx.font = (16 * pr) + 'px sans-serif';
      ctx.fillText('积分耗尽，无法继续放置炸弹', w / 2, h / 2 - 5 * pr);
      ctx.fillText('积分已重置为10分', w / 2, h / 2 + 25 * pr);
      ctx.fillText('3秒后重新开始...', w / 2, h / 2 + 55 * pr);
    }
  }
}

function initGame() {
  new BombWallGame();
}

GameGlobal.BombWallGame = BombWallGame;
GameGlobal.initGame = initGame;

module.exports = { BombWallGame, initGame };
