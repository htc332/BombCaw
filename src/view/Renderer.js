/**
 * View/Renderer.js
 * 完整版：精灵图帧动画 + 独立动画时间 + 发光效果
 */

class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.pixelRatio = 2;
    this.scale = 1;
    this.cellSize = 140;
    this.gap = 0;
    this.resize();
    
    // 全局动画时间（秒）— 用于墙壁等共享动画
    this.animTime = 0;
    
    // 资产适配配置
    this.spriteComp = {
      level1: { scale: 1.2, yOff: -2 },
      level2: { scale: 1.2, yOff: -2 },
      level3: { scale: 1.2, yOff: -2 },
      level4: { scale: 1.2, yOff: -2 }
    };
    this.wallComp = {
      enemy_n: { scale: 1.0, yOff: -0.5 },
      enemy_elite: { scale: 1.0, yOff: -1.6 },
    enemy_elite_break: { scale: 0.9, yOff: -1.6 },
    enemy_elite_break_idle: { scale: 1.0, yOff: -1.6 },
    enemy_elite_death: { scale: 1.0, yOff: -0.5 },
    enemy_ghost: { scale: 1.8, yOff: -1.0 },
    enemy_ghost_death: { scale: 1.8, yOff: -0.5 },
    };
    
    this.colors = {
      background: '#1A1A2E',
      // 棋盘格子配色 - 鼠尾草绿家族，低对比护眼
      cellBorder: '#2F4F3F',    // 格子边线，比背景略深
      cell: '#3B5B4B',           // 格子A（主色）
      cellAlt: '#4A6B5A',        // 格子B（交替色），仅比主色亮7%明度
      cellCorner: '#5A7B6A',     // 格子圆角描边，可选
      // 墙壁颜色
      wall: '#8A7A5A',
      wallBorder: '#6A5A3A',
      wallStrong: '#9A3A3A',
      // 炸弹颜色
      bombYellow: '#E5C84B',
      bombBlue: '#5BA3F5',
      bombPurple: '#C084FC',
      bombRed: '#FF4444',
      // 文字颜色
      text: '#FFF0D4',           // 主得分数字，暖奶油白
      textTitle: '#FFE4B5',       // 标题，浅月光黄
      textSub: '#E8D5C0',        // 次要文字，略暗米色
      textHint: '#F0E6D3',       // 提示文字，奶油沙色
      textNum: '#FFE4C0',        // 数字，浅杏黄
      star: '#FFD8A0',           // 星星装饰，柔和金黄
      // 描边/阴影
      strokeTop: '#1A2A4A',     // 顶部区域文字描边
      strokeBottom: '#2A2520'   // 底部区域文字描边
    };
    
    this.bombSprites = {
      level1: { loaded: false },
      level2: { loaded: false },
      level3: { loaded: false },
      level4: { loaded: false }
    };
    // 静态炸弹精灵图（单图/帧动画）
    this.staticBombSprites = {
      level1: { loaded: false },
      level2: { loaded: false },
      level3: { loaded: false },
      level4: { loaded: false }
    };
    this.wallSprites = {
      enemy_n: { loaded: false },
      enemy_elite: { loaded: false },
      enemy_n_death: { loaded: false },
      enemy_elite_break: { loaded: false },
      enemy_elite_break_idle: { loaded: false },
      enemy_elite_death: { loaded: false }
    };
    // 死亡动画实例列表 {x, y, startTime, duration}
    this.deathAnimations = [];
    this.uiImages = {};
    this.numImages = {};
    this.imagesLoaded = false;
  }
  
  resize() {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : { windowWidth: 375, windowHeight: 667, pixelRatio: 2 };
    const w = info.windowWidth * info.pixelRatio;
    const h = info.windowHeight * info.pixelRatio;
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.pixelRatio = info.pixelRatio || 2;
    this.scale = info.windowWidth / 375;
  }
  
  loadImages() { return Promise.resolve(); }
  
  loadSubpackageImages(callback) {
    // 生产环境关闭加载日志
    // console.log('[Renderer] loadSubpackageImages called');
    const loadImg = (src) => new Promise((resolve) => {
      const img = wx.createImage();
      let done = false;
      img.onload = () => { if (!done) { done = true; resolve(img); } };
      img.onerror = () => { if (!done) { done = true; resolve(null); } };
      setTimeout(() => { if (!done) { done = true; resolve(null); } }, 2000);
      img.src = src;
    });
    
    const loadJson = (src) => new Promise((resolve) => {
      try {
        wx.getFileSystemManager().readFile({
          filePath: src,
          encoding: 'utf8',
          success: (res) => {
            try { resolve(JSON.parse(res.data)); } catch(e) { resolve(null); }
          },
          fail: () => resolve(null)
        });
      } catch (e) { resolve(null); }
    });
    
    const bp = 'subpackage';
    const promises = [
      // UI 资源
      loadImg(`${bp}/ui/Login.png`),
      loadImg(`${bp}/ui/Loading.png`),
      loadImg(`${bp}/ui/game_bg_small.png`),
      // 炸弹精灵图
      loadImg(`${bp}/sprites/lv1/sprite.png`),
      loadJson(`${bp}/sprites/lv1/index.json`),
      loadImg(`${bp}/sprites/lv2/sprite.png`),
      loadJson(`${bp}/sprites/lv2/index.json`),
      loadImg(`${bp}/sprites/lv3/sprite.png`),
      loadJson(`${bp}/sprites/lv3/index.json`),
      loadImg(`${bp}/sprites/lv4/sprite.png`),
      loadJson(`${bp}/sprites/lv4/index.json`),
      // 墙壁精灵图
      loadImg(`${bp}/sprites/enemy_elite/sprite.png`),
      loadJson(`${bp}/sprites/enemy_elite/index.json`),
      loadImg(`${bp}/sprites/enemy_n/sprite.png`),
      loadJson(`${bp}/sprites/enemy_n/index.json`),
      // 一级鼠死亡动画
      loadImg(`${bp}/sprites/enemy_n_death/sprite.png`),
      loadJson(`${bp}/sprites/enemy_n_death/index.json`),
      // 精英鼠头盔破损过渡动画
      loadImg(`${bp}/sprites/enemy_elite_break/sprite.png`),
      loadJson(`${bp}/sprites/enemy_elite_break/index.json`),
      // 精英鼠破损后待机动画
      loadImg(`${bp}/sprites/enemy_elite_break_idle/sprite.png`),
      loadJson(`${bp}/sprites/enemy_elite_break_idle/index.json`),
      // 精英鼠死亡动画
      loadImg(`${bp}/sprites/enemy_elite_death/sprite.png`),
      loadJson(`${bp}/sprites/enemy_elite_death/index.json`),
      // Ghost老鼠精灵图（使用res路径）
      loadImg(`res/sprites/enemy_ghost/sprite.png`),
      loadJson(`res/sprites/enemy_ghost/index.json`),
      // Ghost老鼠死亡动画（使用res路径）
      loadImg(`res/sprites/enemy_ghost_death/sprite.png`),
      loadJson(`res/sprites/enemy_ghost_death/index.json`),
      // 静态炸弹精灵图（使用子包路径）
      loadImg(`${bp}/sprites/static_bombs/Sleep/Sleep_lv1.png`),
      loadJson(`${bp}/sprites/static_bombs/Sleep/Sleep_lv1.json`),
      loadImg(`${bp}/sprites/static_bombs/Sleep/Sleep_lv2.png`),
      loadJson(`${bp}/sprites/static_bombs/Sleep/Sleep_lv2.json`),
      loadImg(`${bp}/sprites/static_bombs/Sleep/Sleep_lv3.png`),
      loadJson(`${bp}/sprites/static_bombs/Sleep/Sleep_lv3.json`),
      loadImg(`${bp}/sprites/static_bombs/Sleep/Sleep_lv4.png`),
      loadJson(`${bp}/sprites/static_bombs/Sleep/Sleep_lv4.json`),
    ];
    
    Promise.all(promises).then((results) => {
      // 生产环境关闭加载完成日志
      // console.log('[Renderer] All promises resolved, count:', results.length);
      // UI
      this.uiImages.login = results[0];
      this.uiImages.loading = results[1];
      this.uiImages.gameBg = results[2];
      
      // 炸弹精灵图
      const makeSprite = (sheet, index) => ({
        sheet, index,
        loaded: !!(sheet && index && index.frames && index.frames.length > 0),
        frameCount: (index && index.frames) ? index.frames.length : 0,
        animDuration: (index && index.frames && index.frames.length > 0)
          ? index.frames[index.frames.length - 1].t + 0.033
          : 1
      });
      this.bombSprites.level1 = makeSprite(results[3], results[4]);
      this.bombSprites.level2 = makeSprite(results[5], results[6]);
      this.bombSprites.level3 = makeSprite(results[7], results[8]);
      this.bombSprites.level4 = makeSprite(results[9], results[10]);
      
      // 墙壁精灵图
      this.wallSprites.enemy_elite = makeSprite(results[11], results[12]);
      this.wallSprites.enemy_n = makeSprite(results[13], results[14]);
      // 一级鼠死亡动画
      this.wallSprites.enemy_n_death = makeSprite(results[15], results[16]);
      // 精英鼠头盔破损过渡动画
      this.wallSprites.enemy_elite_break = makeSprite(results[17], results[18]);
      // 精英鼠破损后待机动画
      this.wallSprites.enemy_elite_break_idle = makeSprite(results[19], results[20]);
      // 精英鼠死亡动画
      this.wallSprites.enemy_elite_death = makeSprite(results[21], results[22]);
      // Ghost老鼠精灵图
      this.wallSprites.enemy_ghost = makeSprite(results[23], results[24]);
      // Ghost老鼠死亡动画
      this.wallSprites.enemy_ghost_death = makeSprite(results[25], results[26]);
      
      // 静态炸弹精灵图（帧动画）
      const makeStaticSprite = (sheet, index) => ({
        sheet, index,
        loaded: !!(sheet && index && index.frames && index.frames.length > 0),
        frameCount: (index && index.frames) ? index.frames.length : 0,
        animDuration: (index && index.frames && index.frames.length > 0)
          ? index.frames[index.frames.length - 1].t + 0.033
          : 1
      });
      this.staticBombSprites.level1 = makeStaticSprite(results[27], results[28]);
      this.staticBombSprites.level2 = makeStaticSprite(results[29], results[30]);
      this.staticBombSprites.level3 = makeStaticSprite(results[31], results[32]);
      this.staticBombSprites.level4 = makeStaticSprite(results[33], results[34]);
      
      // 生产环境关闭静态炸弹精灵加载日志
      // console.log('[Renderer] Static bomb sprites loaded:', {
      //   lv1: this.staticBombSprites.level1.loaded,
      //   lv2: this.staticBombSprites.level2.loaded,
      //   lv3: this.staticBombSprites.level3.loaded,
      //   lv4: this.staticBombSprites.level4.loaded,
      //   sheet1: !!this.staticBombSprites.level1.sheet,
      //   sheet2: !!this.staticBombSprites.level2.sheet,
      //   sheet3: !!this.staticBombSprites.level3.sheet,
      //   sheet4: !!this.staticBombSprites.level4.sheet
      // });
      
      // 生产环境关闭墙壁精灵图调试日志
      // console.log('[Renderer] Wall sprites detail:', {
      //   enemy_elite: { loaded: this.wallSprites.enemy_elite.loaded, sheet: !!this.wallSprites.enemy_elite.sheet, frames: this.wallSprites.enemy_elite.frameCount },
      //   enemy_n: { loaded: this.wallSprites.enemy_n.loaded, sheet: !!this.wallSprites.enemy_n.sheet, frames: this.wallSprites.enemy_n.frameCount },
      //   enemy_elite_break: { loaded: this.wallSprites.enemy_elite_break.loaded, sheet: !!this.wallSprites.enemy_elite_break.sheet, frames: this.wallSprites.enemy_elite_break.frameCount },
      //   enemy_elite_break_idle: { loaded: this.wallSprites.enemy_elite_break_idle.loaded, sheet: !!this.wallSprites.enemy_elite_break_idle.sheet, frames: this.wallSprites.enemy_elite_break_idle.frameCount },
      //   enemy_elite_death: { loaded: this.wallSprites.enemy_elite_death.loaded, sheet: !!this.wallSprites.enemy_elite_death.sheet, frames: this.wallSprites.enemy_elite_death.frameCount }
      // });
      
      // 调试：打印 getWallSpriteType 结果
      // const testWall = { type: 'strong', state: 'idle' };
      // const spriteType = this.getWallSpriteType(testWall);
      // console.log('[Renderer] getWallSpriteType test:', { wall: testWall, spriteType, spriteLoaded: spriteType ? this.wallSprites[spriteType]?.loaded : false });
      
      this.imagesLoaded = true;
      // 生产环境关闭精灵加载总览日志
      // console.log('[Renderer] Sprites loaded:', {
      //   lv1: this.bombSprites.level1.loaded,
      //   lv2: this.bombSprites.level2.loaded,
      //   lv3: this.bombSprites.level3.loaded,
      //   lv4: this.bombSprites.level4.loaded,
      //   enemy: this.wallSprites.enemy_n.loaded,
      //   elite: this.wallSprites.enemy_elite.loaded,
      //   enemy_death: this.wallSprites.enemy_n_death.loaded,
      //   elite_break: this.wallSprites.enemy_elite_break.loaded,
      //   elite_break_idle: this.wallSprites.enemy_elite_break_idle.loaded,
      //   elite_death: this.wallSprites.enemy_elite_death.loaded,
      //   static_lv1: this.staticBombSprites.level1.loaded,
      //   static_lv2: this.staticBombSprites.level2.loaded,
      //   static_lv3: this.staticBombSprites.level3.loaded,
      //   static_lv4: this.staticBombSprites.level4.loaded
      // });
      
      if (callback) {
        // 生产环境关闭回调日志
      // console.log('[Renderer] Calling callback');
        callback();
      }
    }).catch((err) => {
      console.warn('[Renderer] Load failed:', err);
      if (callback) callback();
    });
  }
  
  updateBombAnimation(dt) {
    this.animTime += dt;
    // [v0.7.10] 幽灵鼠显隐逻辑已迁移到 drawWalls 中按每只独立计算
    // 保留此方法仅用于更新全局动画时间
  }
  
  getSpriteFrame(index, time) {
    if (!index || !index.frames || index.frames.length === 0) return 0;
    const frames = index.frames;
    const totalDuration = frames[frames.length - 1].t + 0.033;
    const loopedTime = time % totalDuration;
    
    for (let i = frames.length - 1; i >= 0; i--) {
      if (loopedTime >= frames[i].t) {
        return i;
      }
    }
    return 0;
  }
  
  // 非循环版本 - 用于过渡动画（播放一次后停在最后一帧）
  getSpriteFrameOnce(index, time) {
    if (!index || !index.frames || index.frames.length === 0) return 0;
    const frames = index.frames;
    const totalDuration = frames[frames.length - 1].t + 0.033;
    
    // 如果超过总时长，停在最后一帧
    if (time >= totalDuration) {
      return frames.length - 1;
    }
    
    for (let i = frames.length - 1; i >= 0; i--) {
      if (time >= frames[i].t) {
        return i;
      }
    }
    return 0;
  }
  
  calcLayout(gridSize) {
    const pr = this.pixelRatio, s = this.scale;
    const w = this.canvas.width, h = this.canvas.height;
    
    // 获取安全区
    var safeAreaTop = 0, safeAreaBottom = 0;
    try {
      var info = wx.getWindowInfo ? wx.getWindowInfo() : {};
      if (info.safeArea) {
        safeAreaTop = info.safeArea.top * pr;
        safeAreaBottom = (info.windowHeight - info.safeArea.bottom) * pr;
      }
    } catch (e) {}
    
    // 6个区域高度（从上到下）
    const funcBtnH = Math.max(50 * s * pr, safeAreaTop + 10 * pr);  // 功能按钮区
    const scoreH = 100 * s * pr;  // 得分区
    const infoH = 80 * s * pr;    // 信息区
    const bottomSafe = Math.max(20 * s * pr, safeAreaBottom + 10 * pr); // 底部安全区
    
    // 棋盘区域 = 剩余空间
    const availableH = h - funcBtnH - scoreH - infoH - bottomSafe;
    const boardAreaW = w - 40 * s * pr;
    const sideMargin = 20 * s * pr;
    
    let cellSize = Math.floor(Math.min(boardAreaW, availableH) / gridSize);
    let gap = 2;
    let boardSize = cellSize * gridSize + gap * (gridSize - 1);
    
    while (boardSize > boardAreaW || boardSize > availableH) {
      cellSize = Math.floor(cellSize * 0.9);
      gap = Math.max(2, Math.floor(cellSize * 0.05));
      boardSize = cellSize * gridSize + gap * (gridSize - 1);
    }
    
    const minCell = Math.ceil(44 * pr);
    if (cellSize < minCell) {
      cellSize = minCell;
      gap = Math.max(2, Math.floor(cellSize * 0.05));
      boardSize = cellSize * gridSize + gap * (gridSize - 1);
    }
    
    const offsetX = sideMargin + (boardAreaW - boardSize) / 2;
    const offsetY = funcBtnH + scoreH + (availableH - boardSize) / 2;
    
    this.cellSize = cellSize;
    this.gap = gap;
    
    return { 
      offsetX, offsetY, cellSize, gap,
      funcBtnH, scoreH, infoH, bottomSafe
    };
  }
  
  render(gameState, dt) {
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
    
    // 背景 - 根据关卡使用不同背景
    const level = gameState.level || 1;
    this.drawBackground(ctx, w, h, level);
    
    const layout = this.calcLayout(gameState.gridSize || 5);
    
    // 1. 功能按钮区（顶部）
    this.drawFuncButtons(gameState, w, layout.funcBtnH);
    
    // 2. 玩家得分区
    this.drawScorePanel(gameState, w, layout.funcBtnH, layout.scoreH);
    
    // 3. 游戏棋盘（中心区域，保持原有逻辑不变）
    this.drawGrid(gameState.gridSize || 5, layout.offsetX, layout.offsetY);
    this.drawWalls(gameState.walls || [], layout.offsetX, layout.offsetY, gameState.gridSize || 5, dt);
    this.drawStaticBombs(gameState.staticBombs || [], layout.offsetX, layout.offsetY, gameState.gridSize || 5);
    this.drawBombs(gameState.bombs || [], layout.offsetX, layout.offsetY, gameState.gridSize || 5, dt);
    
    // 4. 游戏信息区（已废弃，购买栏取代提示功能）
    // this.drawInfoPanel(gameState, w, h, layout.infoH, layout.bottomSafe);
    
    // 5. 购买栏（Shop Bar）- 在信息区下方
    if (this.uiManager && this.uiManager.renderShopBar) {
      this.uiManager.renderShopBar(gameState, w, h, layout.bottomSafe);
    }
    
    // 保存布局信息供遮罩层使用
    this.lastLayout = layout;
  }
  
  drawBackground(ctx, w, h, level) {
    // 使用背景图片
    const bg = this.uiImages.gameBg;
    if (bg && bg.width > 0) {
      // 计算缩放以适应屏幕（保持比例，覆盖全屏）
      const imgW = bg.width;
      const imgH = bg.height;
      const scale = Math.max(w / imgW, h / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const drawX = (w - drawW) / 2;
      const drawY = (h - drawH) / 2;
      ctx.drawImage(bg, 0, 0, imgW, imgH, drawX, drawY, drawW, drawH);
    } else {
      // 回退：纯色渐变
      var bgColors = {
        1: ['#1A1A2E', '#16213E', '#0F1628'],
        2: ['#2E1A1A', '#3E1616', '#280F0F'],
        3: ['#1A2E1A', '#163E16', '#0F280F'],
        4: ['#2E2E1A', '#3E3E16', '#28280F'],
        5: ['#1A1A2E', '#16213E', '#0F1628'],
      };
      var colors = bgColors[level] || bgColors[1];
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, colors[0]);
      grad.addColorStop(0.5, colors[1]);
      grad.addColorStop(1, colors[2]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  }
  
  drawFuncButtons(state, w, funcBtnH) {
    const ctx = this.ctx, pr = this.pixelRatio, s = this.scale;
    
    // 原型风格：深色半透明背景 + 圆角
    ctx.fillStyle = 'rgba(13, 13, 21, 0.85)';
    const cornerR = 12 * s * pr;
    const barH = funcBtnH - 8 * s * pr;
    const barY = 4 * s * pr;
    
    // 绘制圆角背景
    ctx.beginPath();
    ctx.moveTo(cornerR, barY);
    ctx.lineTo(w - cornerR, barY);
    ctx.quadraticCurveTo(w, barY, w, barY + cornerR);
    ctx.lineTo(w, barY + barH - cornerR);
    ctx.quadraticCurveTo(w, barY + barH, w - cornerR, barY + barH);
    ctx.lineTo(cornerR, barY + barH);
    ctx.quadraticCurveTo(0, barY + barH, 0, barY + barH - cornerR);
    ctx.lineTo(0, barY + cornerR);
    ctx.quadraticCurveTo(0, barY, cornerR, barY);
    ctx.closePath();
    ctx.fill();
    
    // 左侧：关卡（原型风格：金色星星 + 文字）
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${16 * s * pr}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('关卡:', 15 * s * pr, funcBtnH / 2);
    
    ctx.fillStyle = '#FFF';
    ctx.font = `bold ${18 * s * pr}px sans-serif`;
    ctx.fillText(`${state.level || 1}`, 55 * s * pr, funcBtnH / 2);
    
    // 星星图标（简化）
    ctx.fillStyle = '#FFD700';
    ctx.font = `${14 * s * pr}px sans-serif`;
    ctx.fillText('⭐', 75 * s * pr, funcBtnH / 2);
    
    // 右侧：剩余老鼠（原型风格：图标 + 数字）
    ctx.fillStyle = '#FFF';
    ctx.font = `bold ${16 * s * pr}px sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('剩余鼠鼠:', w - 80 * s * pr, funcBtnH / 2);
    
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${20 * s * pr}px sans-serif`;
    ctx.fillText(`${state.wallCount || 0}`, w - 35 * s * pr, funcBtnH / 2);
    
    // 老鼠图标（简化）
    ctx.fillStyle = '#FF9F5E';
    ctx.font = `${16 * s * pr}px sans-serif`;
    ctx.fillText('🐭', w - 15 * s * pr, funcBtnH / 2);
  }
  
  drawScorePanel(state, w, funcBtnH, scoreH) {
    const ctx = this.ctx, pr = this.pixelRatio, s = this.scale;
    const y = funcBtnH;
    
    // [v0.8.0] 新计分系统：显示当前积分、已放炸弹、已消灭老鼠
    const panelH = scoreH;
    
    // 背景
    ctx.fillStyle = 'rgba(13, 13, 21, 0.6)';
    ctx.fillRect(0, y, w, panelH);
    
    // 左侧：当前积分（大字体）
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${24 * s * pr}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('积分:', 15 * s * pr, y + panelH * 0.35);
    
    ctx.fillStyle = '#FFF';
    ctx.font = `bold ${28 * s * pr}px sans-serif`;
    ctx.fillText(`${state.score || 0}`, 75 * s * pr, y + panelH * 0.35);
    
    // 右侧：本局统计
    ctx.fillStyle = '#E8D5C0';
    ctx.font = `${14 * s * pr}px sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(`已放炸弹: ${state.bombsPlaced || 0}颗`, w - 15 * s * pr, y + panelH * 0.3);
    ctx.fillText(`消灭老鼠: ${state.wallsDestroyed || 0}只`, w - 15 * s * pr, y + panelH * 0.7);
    
    // 最近加分事件（显示2秒）- 飘字动画
    if (state.lastScoreEvent) {
      const elapsed = Date.now() - state.lastScoreEvent.time;
      if (elapsed < 2000) {
        const alpha = 1 - (elapsed / 2000);  // 淡出
        const offsetY = -elapsed / 100; // 向上飘
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#4CAF50';
        ctx.font = `bold ${16 * s * pr}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(state.lastScoreEvent.text, w / 2, y + panelH * 0.8 + offsetY);
        ctx.globalAlpha = 1;
      }
    }
  }
  
  drawGrid(gridSize, offsetX, offsetY) {
    const ctx = this.ctx, cs = this.cellSize, g = this.gap || 0;
    const half = Math.floor(gridSize / 2);
    const maxC = gridSize % 2 === 0 ? half - 1 : half;
    
    // 绘制网格外边界（粗边框）
    const totalW = gridSize * cs + (gridSize - 1) * g;
    const totalH = totalW;
    ctx.strokeStyle = this.colors.cellBorder;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]); // 虚线
    ctx.strokeRect(offsetX - 1, offsetY - 1, totalW + 2, totalH + 2);
    ctx.setLineDash([]);
    
    // 绘制网格背景（使用主色）
    ctx.fillStyle = this.colors.cell;
    ctx.fillRect(offsetX, offsetY, totalW, totalH);
    
    for (let gx = -half; gx <= maxC; gx++) {
      for (let gy = -half; gy <= maxC; gy++) {
        const x = offsetX + (gx + half) * (cs + g);
        const y = offsetY + (gy + half) * (cs + g);
        
        // 交替颜色：格子A和格子B
        const isAlt = (gx + gy) % 2 === 0;
        ctx.fillStyle = isAlt ? this.colors.cell : this.colors.cellAlt;
        ctx.fillRect(x, y, cs, cs);
        
        // 可选：圆角描边
        // ctx.strokeStyle = this.colors.cellCorner;
        // ctx.lineWidth = 0.5;
        // ctx.strokeRect(x, y, cs, cs);
      }
    }
  }
  
  // 网格边界遮罩 - 遮挡超出网格的爆炸特效
  drawGridMask(gridSize, layout) {
    if (!layout) return;
    
    const ctx = this.ctx;
    const offsetX = layout.offsetX;
    const offsetY = layout.offsetY;
    const cs = layout.cellSize;
    const g = layout.gap || 0;
    const totalW = gridSize * cs + (gridSize - 1) * g;
    const totalH = totalW;
    
    ctx.fillStyle = '#1A1A2E';
    
    // 上
    ctx.fillRect(0, 0, ctx.canvas.width, offsetY);
    // 下
    ctx.fillRect(0, offsetY + totalH, ctx.canvas.width, ctx.canvas.height);
    // 左
    ctx.fillRect(0, offsetY, offsetX, totalH);
    // 右
    ctx.fillRect(offsetX + totalW, offsetY, ctx.canvas.width, totalH);
  }
  
  drawWalls(walls, offsetX, offsetY, gridSize, dt) {
    const ctx = this.ctx, pr = this.pixelRatio || 2, half = Math.floor(gridSize / 2);
    const cs = this.cellSize, g = this.gap || 0;
    
    walls.forEach(wall => {
      // [v0.7.10] 幽灵鼠：平时隐藏，被爆炸触发后显示1.5秒再渐变消失
      if (wall.type === 'ghost') {
        // 初始化（兼容旧存档）
        if (wall.ghostTimer === undefined) {
          wall.ghostTimer = 0;
          wall.ghostAlpha = 0;  // 默认完全透明
        }
        
        // 死亡时：由 drawDeathAnimations 绘制死亡动画，此处不绘制 idle
        if (wall.dying) {
          // 不绘制 idle，让死亡动画在 drawDeathAnimations 中处理
          return;
        }
        
        if (wall.ghostTimer > 0) {
          // 被爆炸触发显示中：递减计时器
          wall.ghostTimer -= dt;
          if (wall.ghostTimer <= 0) {
            wall.ghostTimer = 0;
            wall.ghostAlpha = 0;
          } else {
            // 前0.3秒淡入，最后0.5秒淡出，中间保持1.0
            const elapsed = 1.5 - wall.ghostTimer;
            if (elapsed < 0.3) {
              wall.ghostAlpha = elapsed / 0.3;  // 淡入
            } else if (wall.ghostTimer < 0.5) {
              wall.ghostAlpha = wall.ghostTimer / 0.5;  // 淡出
            } else {
              wall.ghostAlpha = 1.0;  // 保持
            }
          }
        } else {
          // 平时完全隐藏
          wall.ghostAlpha = 0;
        }
        
        // 如果完全透明，跳过绘制
        if (wall.ghostAlpha <= 0.01) return;
      }
      
      // 跳过正在播放死亡动画的老鼠（由 drawDeathAnimations 绘制）
      if (wall.dying) return;
      
      const gx = wall.x;
      const gy = wall.y;
      const col = gx + half;
      const row = gy + half;
      
      const x = offsetX + col * (cs + g);
      const y = offsetY + row * (cs + g);
      
      // 使用配置获取精灵图类型
      const spriteType = this.getWallSpriteType(wall);
      
      let drawn = false;
      if (spriteType && this.wallSprites[spriteType]?.loaded) {
        drawn = this.drawWallSprite(ctx, wall, x, y, cs, spriteType);
      }
      
      if (!drawn) {
        this.drawWallLegacy(ctx, wall, x, y, cs, pr);
      }
      
      // 显示HP（如果大于1，且不是精英鼠/头盔鼠）
      if (wall.hp > 1 && wall.type !== 'strong') {
        this.drawNumber(ctx, wall.hp, x + cs / 2, y + cs / 2, cs * 0.35, 'center');
      }
      
      if (wall.type === 'bomb') {
        ctx.fillStyle = wall.color === 'red' ? '#FFF' : '#000';
        ctx.font = `bold ${20 * pr}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('+', x + cs / 2, y + cs / 2);
      }
    });
    
    // 绘制死亡动画
    this.drawDeathAnimations(ctx, offsetX, offsetY, gridSize, cs, g, half);
  }
  
  // 添加死亡动画（支持多种类型死亡动画）
  addDeathAnimation(x, y, wallType) {
    // 根据墙壁类型选择死亡动画
    let spriteName;
    switch(wallType) {
      case 'strong':
        spriteName = 'enemy_elite_death';
        break;
      case 'ghost':
        spriteName = 'enemy_ghost_death';
        break;
      default:
        spriteName = 'enemy_n_death';
    }
    
    const sprite = this.wallSprites[spriteName];
    if (!sprite || !sprite.loaded) {
      // 如果特定类型死亡动画未加载，回退到通用死亡动画
      if (wallType !== 'normal') {
        return this.addDeathAnimation(x, y, 'normal');
      }
      return;
    }
    
    // 计算实际动画时长（到最后一帧结束）
    const frames = sprite.index.frames;
    // 限制帧数：精英鼠最多10帧，普通鼠最多12帧，幽灵鼠使用全部帧
    let maxFrameIdx;
    switch(wallType) {
      case 'strong':
        maxFrameIdx = Math.min(frames.length - 1, 9);
        break;
      case 'ghost':
        maxFrameIdx = frames.length - 1;
        break;
      default:
        maxFrameIdx = Math.min(frames.length - 1, 11);
    }
    const realDuration = frames[maxFrameIdx].t + 0.033;
    
    this.deathAnimations.push({
      x, y,
      spriteName: spriteName,
      startTime: this.animTime,
      duration: Math.max(realDuration, 1.5) // [v0.7.10] 确保至少播放1.5秒，避免过早结束
    });
  }
  
  // 绘制死亡动画
  drawDeathAnimations(ctx, offsetX, offsetY, gridSize, cs, g, half) {
    // 过滤已完成的动画
    this.deathAnimations = this.deathAnimations.filter(anim => {
      const elapsed = this.animTime - anim.startTime;
      return elapsed < anim.duration;
    });
    
    this.deathAnimations.forEach(anim => {
      const col = anim.x + half;
      const row = anim.y + half;
      const x = offsetX + col * (cs + g);
      const y = offsetY + row * (cs + g);
      
      const spriteName = anim.spriteName || 'enemy_n_death';
      const sprite = this.wallSprites[spriteName];
      if (!sprite || !sprite.loaded) return;
      
      const elapsed = this.animTime - anim.startTime;
      // 使用非循环播放，在最后一帧后结束
      const frameIdx = this.getSpriteFrameOnce(sprite.index, elapsed);
      const frame = sprite.index.frames[frameIdx];
      const sheet = sprite.sheet;
      
      const comp = this.wallComp[spriteName] || { scale: 1.0, yOff: -0.5 };
      const frameW = frame.w;
      const frameH = frame.h;
      const maxDim = Math.max(frameW, frameH);
      
      const baseScale = cs / maxDim;
      const drawScale = baseScale * comp.scale;
      const drawW = frameW * drawScale;
      const drawH = frameH * drawScale;
      
      const drawX = x + (cs - drawW) / 2;
      const drawY = y + (cs - drawH) / 2 + comp.yOff;
      
      // [v0.7.10] 只有小精灵图（不超出格子）才限制在格子内，大精灵图允许超出
      const clampedX = (drawW <= cs) ? Math.max(x, Math.min(drawX, x + cs - drawW)) : drawX;
      const clampedY = (drawH <= cs) ? Math.max(y, Math.min(drawY, y + cs - drawH)) : drawY;
      
      ctx.drawImage(sheet, frame.x, frame.y, frame.w, frame.h, clampedX, clampedY, drawW, drawH);
    });
  }
  
  drawWallLegacy(ctx, wall, x, y, size, pr) {
    let color = this.colors.wall;
    if (wall.type === 'strong') color = this.colors.wallStrong;
    else if (wall.type === 'bomb') {
      color = wall.color === 'yellow' ? this.colors.bombYellow : this.colors.bombRed;
    }
    
    ctx.fillStyle = this.colors.wallBorder;
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = color;
    ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
  }
  
  drawWallSprite(ctx, wall, x, y, size, spriteType) {
    const sprite = this.wallSprites[spriteType];
    if (!sprite || !sprite.loaded) return false;
    
    // 判断是否需要非循环播放（过渡动画）
    const isTransition = (spriteType === 'enemy_elite_break');
    let frameIdx;
    
    if (isTransition && wall.animStartTime !== undefined) {
      // 首次渲染时设置开始时间
      if (wall.animStartTime === -1) {
        wall.animStartTime = this.animTime;
      }
      // 非循环播放：基于动画开始时间计算
      const elapsed = this.animTime - wall.animStartTime;
      frameIdx = this.getSpriteFrameOnce(sprite.index, elapsed);
    } else {
      // 循环播放：使用全局动画时间
      frameIdx = this.getSpriteFrame(sprite.index, this.animTime);
    }
    
    const frame = sprite.index.frames[frameIdx];
    const sheet = sprite.sheet;
    
    const comp = this.wallComp[spriteType] || { scale: 1.2, yOff: 0 };
    const frameW = frame.w;
    const frameH = frame.h;
    const maxDim = Math.max(frameW, frameH);
    
    const baseScale = size / maxDim;
    const drawScale = baseScale * comp.scale;
    const drawW = frameW * drawScale;
    const drawH = frameH * drawScale;
    
    const drawX = x + (size - drawW) / 2;
    const drawY = y + (size - drawH) / 2 + comp.yOff;
    
    // [v0.7.10] 只有小精灵图（不超出格子）才限制在格子内，大精灵图允许超出
    const clampedX = (drawW <= size) ? Math.max(x, Math.min(drawX, x + size - drawW)) : drawX;
    const clampedY = (drawH <= size) ? Math.max(y, Math.min(drawY, y + size - drawH)) : drawY;
    
    // [v0.7.10] 幽灵鼠：应用透明度
    const isGhost = wall.type === 'ghost';
    if (isGhost && wall.ghostAlpha !== undefined && wall.ghostAlpha < 1.0) {
      ctx.save();
      ctx.globalAlpha = wall.ghostAlpha;
      ctx.drawImage(sheet, frame.x, frame.y, frame.w, frame.h, clampedX, clampedY, drawW, drawH);
      ctx.restore();
    } else {
      ctx.drawImage(sheet, frame.x, frame.y, frame.w, frame.h, clampedX, clampedY, drawW, drawH);
    }
    return true;
  }
  
  // 根据墙壁状态和配置获取精灵图类型
  getWallSpriteType(wall) {
    const config = ENEMY_TYPES[wall.type];
    if (!config || !config.sprites) return null;
    
    // 如果有状态且状态对应精灵图，使用状态对应的
    if (wall.state && config.sprites[wall.state]) {
      const spriteName = config.sprites[wall.state];
      if (this.wallSprites[spriteName]?.loaded) {
        return spriteName;
      }
    }
    
    // 否则使用 idle 精灵图
    const idleSprite = config.sprites.idle;
    if (idleSprite && this.wallSprites[idleSprite]?.loaded) {
      return idleSprite;
    }
    
    return null;
  }
  
  drawBombs(bombs, offsetX, offsetY, gridSize, dt) {
    const ctx = this.ctx, pr = this.pixelRatio || 2, half = Math.floor(gridSize / 2);
    const cs = this.cellSize, g = this.gap || 0;
    
    bombs.forEach(bomb => {
      const col = bomb.x + half;
      const row = bomb.y + half;
      const cx = offsetX + col * (cs + g) + cs / 2;
      const cy = offsetY + row * (cs + g) + cs / 2;
      const size = cs;
      
      let drawn = false;
      // [v0.7.9-fix] 根据 evolution 映射到正确的 level 键
      const levelMap = { 0: 'level1', 2: 'level2', 3: 'level3', 5: 'level4' };
      const levelKey = levelMap[bomb.evolution] || 'level1';
      const sprite = this.bombSprites[levelKey];
      if (sprite && sprite.loaded) {
        const result = this.drawAnimatedBomb(ctx, bomb, cx, cy, size);
        drawn = result.drawn;
      }
      
      if (!drawn) {
        this.drawBombLegacy(ctx, bomb, cx, cy, size, pr);
      }
    });
  }
  
  drawAnimatedBomb(ctx, bomb, cx, cy, size) {
    const evo = bomb.evolution || 0;
    // [v0.7.9-fix] 根据 evolution 映射到正确的 level 键
    const levelMap = { 0: 'level1', 2: 'level2', 3: 'level3', 5: 'level4' };
    const levelKey = levelMap[evo] || 'level1';
    
    const sprite = this.bombSprites[levelKey];
    if (!sprite || !sprite.loaded) return { drawn: false };
    
    const frames = sprite.index.frames;
    const totalFrames = frames.length;
    
    const progress = 1 - (bomb.countdown || 0) / 90; // 0~1
    
    // 对于 level1 (BabyCow)，新动画从 t=1.583 开始
    // 映射：倒计时90秒 → 动画总时长约4.167秒（最后一帧t=4.167）
    // 但倒计时是90秒，所以用 progress 映射到有效帧范围
    
    // 新动画的时间范围：1.583 ~ 4.167（约2.6秒）
    // 但倒计时是90秒，所以需要按进度映射
    
    // 简单方案：按进度选择帧，让倒计时结束时显示最后一帧（紧张感）
    let frameIdx;
    if (evo === 0) {
      // LV1: 新动画30帧，从第0帧到第29帧
      // 倒计时90秒，progress从0到1
      // 让动画在倒计时前50%快速播完，然后停在最后一帧（约45秒播完30帧）
      const animProgress = Math.min(progress / 0.5, 1.0); // 前50%播完动画，约45秒
      frameIdx = Math.min(Math.floor(animProgress * totalFrames), totalFrames - 1);
    } else {
      frameIdx = Math.min(Math.floor(progress * totalFrames), totalFrames - 1);
    }
    
    const frame = frames[frameIdx];
    const sheet = sprite.sheet;
    
    const comp = this.spriteComp[levelKey] || { scale: 1.2, yOff: 0 };
    const frameW = frame.w;
    const frameH = frame.h;
    const maxDim = Math.max(frameW, frameH);
    
    const baseScale = size / maxDim;
    const drawScale = baseScale * comp.scale * 1.1;
    const drawW = frameW * drawScale;
    const drawH = frameH * drawScale;
    
    const drawX = cx - drawW / 2;
    const drawY = cy - drawH / 2 + comp.yOff;
    
    ctx.drawImage(sheet, frame.x, frame.y, frame.w, frame.h, drawX, drawY, drawW, drawH);
    
    return { drawn: true };
  }
  
  drawBombLegacy(ctx, bomb, cx, cy, size, pr) {
    const r = size * 0.35;
    
    let borderColor = this.colors.bombYellow;
    if (bomb.evolution >= 2) borderColor = this.colors.bombPurple;
    else if (bomb.evolution >= 1) borderColor = this.colors.bombBlue;
    
    ctx.fillStyle = borderColor + '40';
    ctx.beginPath();
    ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#1A1A2E';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3 * pr;
    ctx.stroke();
    
    if (bomb.evolution > 0) {
      const badgeR = 10 * pr;
      ctx.fillStyle = bomb.evolution >= 2 ? this.colors.bombPurple : this.colors.bombBlue;
      ctx.beginPath();
      ctx.arc(cx - size / 3, cy - size / 3, badgeR, 0, Math.PI * 2);
      ctx.fill();
      this.drawNumber(ctx, bomb.evolution, cx - size / 3, cy - size / 3 + 1, badgeR * 1.8, 'center');
    }
  }
  
  drawStaticBombs(staticBombs, offsetX, offsetY, gridSize) {
    const ctx = this.ctx, pr = this.pixelRatio || 2, half = Math.floor(gridSize / 2);
    const cs = this.cellSize, g = this.gap || 0;
    
    staticBombs.forEach(sb => {
      const col = sb.x + half;
      const row = sb.y + half;
      const cx = offsetX + col * (cs + g) + cs / 2;
      const cy = offsetY + row * (cs + g) + cs / 2;
      
      // 获取静态炸弹等级：evo=0→1级, evo=2→2级, evo=3→3级, evo=5→4级
      const levelMap = { 0: 0, 2: 1, 3: 2, 5: 3 };
      const level = levelMap[sb.evolution] !== undefined ? levelMap[sb.evolution] : 0;
      
      // 生产环境关闭静态炸弹绘制日志（高频触发）
      // console.log('[StaticBomb] Draw:', sb.active ? 'ACTIVE' : 'SLEEP', 'evolution:', sb.evolution, 'level:', level, 'pos:', sb.x, sb.y);
      
      if (sb.active) {
        // 激活后：绘制对应等级牛牛炸弹
        this.drawStaticBombActive(ctx, sb, cx, cy, cs, pr, level);
      } else {
        // 未激活：绘制Sleep图片
        this.drawStaticBombSleep(ctx, sb, cx, cy, cs, pr, level);
      }
    });
  }
  
  // 未激活：绘制Sleep帧动画（循环播放）
  drawStaticBombSleep(ctx, sb, cx, cy, cs, pr, level) {
    // 获取对应Sleep精灵图
    const sleepSprites = [
      this.staticBombSprites.level1,
      this.staticBombSprites.level2,
      this.staticBombSprites.level3,
      this.staticBombSprites.level4
    ];
    
    const sprite = sleepSprites[level];
    
    if (sprite && sprite.loaded && sprite.sheet) {
      // 使用帧动画（循环播放）
      const frames = sprite.index.frames;
      const totalDuration = sprite.animDuration || 1;
      const loopedTime = this.animTime % totalDuration;
      
      // 找到当前帧
      let frameIdx = 0;
      for (let i = frames.length - 1; i >= 0; i--) {
        if (loopedTime >= frames[i].t) {
          frameIdx = i;
          break;
        }
      }
      
      const frame = frames[frameIdx];
      const sheet = sprite.sheet;
      
      // 计算绘制大小（适配格子，使用spriteComp缩放）
      const frameW = frame.w;
      const frameH = frame.h;
      const maxDim = Math.max(frameW, frameH);
      const comp = this.spriteComp['level' + (level + 1)] || { scale: 1.2, yOff: 0 };
      const baseScale = cs / maxDim;
      const drawScale = baseScale * comp.scale;
      
      const drawW = frameW * drawScale;
      const drawH = frameH * drawScale;
      const drawX = cx - drawW / 2;
      const drawY = cy - drawH / 2 + comp.yOff;
      
      ctx.drawImage(sheet, frame.x, frame.y, frame.w, frame.h, drawX, drawY, drawW, drawH);
    } else {
      // 没有精灵图，回退到单图或画虚线圆圈
      const sleepImages = [
        this.staticBombSprites.level1.sheet,
        this.staticBombSprites.level2.sheet,
        this.staticBombSprites.level3.sheet,
        this.staticBombSprites.level4.sheet
      ];
      const sheet = sleepImages[level];
      
      if (sheet && sheet.width > 0) {
        // 回退：单图绘制
        const imgW = sheet.width;
        const imgH = sheet.height;
        const maxDim = Math.max(imgW, imgH);
        const scale = (cs * 0.95) / maxDim;
        
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        const drawX = cx - drawW / 2;
        const drawY = cy - drawH / 2;
        
        ctx.drawImage(sheet, 0, 0, imgW, imgH, drawX, drawY, drawW, drawH);
      } else {
        // 没有图片，画虚线圆圈
        this.drawStaticBombCircle(ctx, sb, cx, cy, cs, pr, false);
      }
    }
  }
  
  // 激活后：绘制对应等级的牛牛炸弹动画（使用倒计时进度，非循环）
  // [v0.7.9] 静态炸弹激活后 = 对应等级动态炸弹，清除循环动画，接爆炸逻辑
  drawStaticBombActive(ctx, sb, cx, cy, cs, pr, level) {
    // 获取对应牛牛炸弹精灵图
    const bombSprites = [
      this.bombSprites.level1,
      this.bombSprites.level2,
      this.bombSprites.level3,
      this.bombSprites.level4
    ];
    
    const sprite = bombSprites[level];
    
    if (sprite && sprite.loaded && sprite.sheet) {
      const frames = sprite.index.frames;
      const totalFrames = frames.length;
      
      // 使用倒计时进度映射帧（与动态炸弹一致）
      // sb.countdown 是 90→0 的帧数（1.5秒）
      const rawCountdown = sb.countdown || 0;
      const progress = 1 - rawCountdown / 90; // 90帧倒计时
      
      let frameIdx;
      if (level === 0) {
        // LV1: 前50%时间播完动画
        const animProgress = Math.min(progress / 0.5, 1.0);
        frameIdx = Math.min(Math.floor(animProgress * totalFrames), totalFrames - 1);
      } else {
        frameIdx = Math.min(Math.floor(progress * totalFrames), totalFrames - 1);
      }
      
      const frame = frames[frameIdx];
      const sheet = sprite.sheet;
      
      const frameW = frame.w;
      const frameH = frame.h;
      const maxDim = Math.max(frameW, frameH);
      const comp = this.spriteComp['level' + (level + 1)] || { scale: 1.2, yOff: 0 };
      const baseScale = cs / maxDim;
      const drawScale = baseScale * comp.scale;
      
      const drawW = frameW * drawScale;
      const drawH = frameH * drawScale;
      const drawX = cx - drawW / 2;
      const drawY = cy - drawH / 2 + comp.yOff;
      
      ctx.drawImage(sheet, frame.x, frame.y, frame.w, frame.h, drawX, drawY, drawW, drawH);
    } else {
      // 没有精灵图，画彩色圆圈
      this.drawStaticBombCircle(ctx, sb, cx, cy, cs, pr, true, level);
    }
  }
  
  // 回退绘制：圆圈
  drawStaticBombCircle(ctx, sb, cx, cy, cs, pr, isActive, level) {
    const r = cs * 0.3;
    
    if (isActive) {
      // 激活：彩色实线
      const colors = ['#E5C84B', '#5BA3F5', '#C084FC', '#FF4444'];
      ctx.strokeStyle = colors[level] || colors[0];
      ctx.lineWidth = 3 * pr;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      
      // 倒计时
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold ' + (r * 0.8) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(sb.countdown || 0), cx, cy);
    } else {
      // 未激活：虚线
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2 * pr;
      ctx.setLineDash([4 * pr, 4 * pr]);
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  
  drawInfoPanel(state, w, h, infoH, bottomSafe) {
    // [v0.7.9] 购买栏已取代信息区，所有提示在购买栏上方显示
    // 此方法保留为空，避免破坏调用链
  }
  
  screenToGrid(screenX, screenY, gridSize) {
    const layout = this.calcLayout(gridSize);
    const half = Math.floor(gridSize / 2);
    const maxC = gridSize % 2 === 0 ? half - 1 : half;
    const step = this.cellSize + (this.gap || 0);
    const gx = Math.floor((screenX - layout.offsetX) / step) - half;
    const gy = Math.floor((screenY - layout.offsetY) / step) - half;
    if (gx < -half || gx > maxC || gy < -half || gy > maxC) return null;
    return { x: gx, y: gy };
  }
  
  gridToScreen(gx, gy, gridSize) {
    const layout = this.calcLayout(gridSize);
    const half = Math.floor(gridSize / 2);
    const step = this.cellSize + (this.gap || 0);
    return {
      x: layout.offsetX + (gx + half) * step,
      y: layout.offsetY + (gy + half) * step,
      cx: layout.offsetX + (gx + half) * step + this.cellSize / 2,
      cy: layout.offsetY + (gy + half) * step + this.cellSize / 2,
      size: this.cellSize
    };
  }
  
  drawNumber(ctx, num, x, y, size, align) {
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold ' + size + 'px sans-serif';
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(num), x, y);
  }
}

GameGlobal.Renderer = Renderer;
module.exports = Renderer;
