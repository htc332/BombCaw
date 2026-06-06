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
      level1: { scale: 1.5, yOff: -6.5 },
      level2: { scale: 1.5, yOff: -0.1 },
      level3: { scale: 1.5, yOff: -1.6 },
      level4: { scale: 1.5, yOff: 0.8 }
    };
    this.wallComp = {
      enemy_n: { scale: 1.0, yOff: -0.5 },
      enemy_elite: { scale: 1.0, yOff: -1.6 },
    enemy_elite_break: { scale: 0.9, yOff: -1.6 },
    enemy_elite_break_idle: { scale: 1.0, yOff: -1.6 },
    enemy_elite_death: { scale: 1.0, yOff: -0.5 },
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
      // 静态炸弹精灵图（使用子包路径）
      loadImg(`${bp}/sprites/static_bombs/Sleep/Sleep_lv1.png`),
      loadImg(`${bp}/sprites/static_bombs/Sleep/Sleep_lv2.png`),
      loadImg(`${bp}/sprites/static_bombs/Sleep/Sleep_lv3.png`),
      loadImg(`${bp}/sprites/static_bombs/Sleep/Sleep_lv4.png`),
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
      
      // 静态炸弹精灵图（单图）
      this.staticBombSprites.level1 = { sheet: results[23], loaded: !!results[23], frameCount: 1 };
      this.staticBombSprites.level2 = { sheet: results[24], loaded: !!results[24], frameCount: 1 };
      this.staticBombSprites.level3 = { sheet: results[25], loaded: !!results[25], frameCount: 1 };
      this.staticBombSprites.level4 = { sheet: results[26], loaded: !!results[26], frameCount: 1 };
      
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
    this.drawWalls(gameState.walls || [], layout.offsetX, layout.offsetY, gameState.gridSize || 5);
    this.drawStaticBombs(gameState.staticBombs || [], layout.offsetX, layout.offsetY, gameState.gridSize || 5);
    this.drawBombs(gameState.bombs || [], layout.offsetX, layout.offsetY, gameState.gridSize || 5, dt);
    
    // 4. 游戏信息区（底部）
    this.drawInfoPanel(gameState, w, h, layout.infoH, layout.bottomSafe);
    
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
    ctx.fillStyle = 'rgba(30,42,74,0.6)';
    ctx.fillRect(0, 0, w, funcBtnH);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${14 * s * pr}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`第 ${state.level || 1} 关`, 15 * s * pr, funcBtnH / 2);
    ctx.textAlign = 'right';
    ctx.fillText(`剩余老鼠: ${state.wallCount || 0}`, w - 15 * s * pr, funcBtnH / 2);
  }
  
  drawScorePanel(state, w, funcBtnH, scoreH) {
    const ctx = this.ctx, pr = this.pixelRatio, s = this.scale;
    const y = funcBtnH;
    ctx.fillStyle = 'rgba(20,30,50,0.5)';
    ctx.fillRect(0, y, w, scoreH);
    
    // 分数显示
    ctx.fillStyle = this.colors.text;
    ctx.font = `bold ${24 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`得分: ${state.score || 0}`, w / 2, y + scoreH * 0.4);
    
    // 最近加分事件（显示2秒）
    if (state.lastScoreEvent) {
      const elapsed = Date.now() - state.lastScoreEvent.time;
      if (elapsed < 2000) {
        const alpha = 1 - (elapsed / 2000);  // 淡出
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#4CAF50';
        ctx.font = `${14 * s * pr}px sans-serif`;
        ctx.fillText(state.lastScoreEvent.text, w / 2, y + scoreH * 0.75);
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
  
  drawWalls(walls, offsetX, offsetY, gridSize) {
    const ctx = this.ctx, pr = this.pixelRatio || 2, half = Math.floor(gridSize / 2);
    const cs = this.cellSize, g = this.gap || 0;
    
    walls.forEach(wall => {
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
      
      // 显示HP（如果大于1）
      if (wall.hp > 1) {
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
  
  // 添加死亡动画（支持精英鼠专用死亡动画）
  addDeathAnimation(x, y, isElite) {
    const spriteName = isElite ? 'enemy_elite_death' : 'enemy_n_death';
    const sprite = this.wallSprites[spriteName];
    if (!sprite || !sprite.loaded) {
      // 如果精英鼠死亡动画未加载，回退到通用死亡动画
      if (isElite) {
        return this.addDeathAnimation(x, y, false);
      }
      return;
    }
    
    // 计算实际动画时长（到最后一帧结束）
    const frames = sprite.index.frames;
    const lastFrameIdx = Math.min(frames.length - 1, isElite ? 9 : 11);
    const realDuration = frames[lastFrameIdx].t + 0.033;
    
    this.deathAnimations.push({
      x, y,
      spriteName: spriteName,
      startTime: this.animTime,
      duration: realDuration
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
      
      ctx.drawImage(sheet, frame.x, frame.y, frame.w, frame.h, drawX, drawY, drawW, drawH);
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
    
    ctx.drawImage(sheet, frame.x, frame.y, frame.w, frame.h, drawX, drawY, drawW, drawH);
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
      const sprite = this.bombSprites['level' + (bomb.evolution + 1)];
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
    const level = 'level' + (evo + 1);
    
    const sprite = this.bombSprites[level];
    if (!sprite || !sprite.loaded) return { drawn: false };
    
    const frames = sprite.index.frames;
    const totalFrames = frames.length;
    
    // 根据倒计时进度播放动画
    const progress = 1 - (bomb.countdown || 0) / 90; // 0~1
    const frameIdx = Math.min(Math.floor(progress * totalFrames), totalFrames - 1);
    
    const frame = frames[frameIdx];
    const sheet = sprite.sheet;
    
    const comp = this.spriteComp[level] || { scale: 1.5, yOff: 0 };
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
      
      // 获取静态炸弹等级：0=1级, 1=2级, 2=3级, 3=4级
      const level = sb.evolution || 0;
      
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
  
  // 未激活：绘制Sleep图片
  drawStaticBombSleep(ctx, sb, cx, cy, cs, pr, level) {
    // 获取对应Sleep图片
    const sleepImages = [
      this.staticBombSprites.level1.sheet,
      this.staticBombSprites.level2.sheet,
      this.staticBombSprites.level3.sheet,
      this.staticBombSprites.level4.sheet
    ];
    
    const sheet = sleepImages[level];
    
    // 关键日志：确认level和sheet状态
    // 生产环境关闭静态炸弹Sleep日志
  // console.log('[StaticBomb] Sleep level:', level, 'sheet exists:', !!sheet, 'sheet.width:', sheet ? sheet.width : 0);
    
    if (sheet && sheet.width > 0) {
      // 计算绘制大小（适配格子）
      const imgW = sheet.width;
      const imgH = sheet.height;
      const maxDim = Math.max(imgW, imgH);
      const scale = (cs * 0.95) / maxDim; // 占格子95%
      
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const drawX = cx - drawW / 2;
      const drawY = cy - drawH / 2;
      
      ctx.drawImage(sheet, 0, 0, imgW, imgH, drawX, drawY, drawW, drawH);
      // 生产环境关闭绘制日志
      // console.log('[StaticBomb] Drew Sleep image at level', level);
    } else {
      // 没有图片，画虚线圆圈
      // 生产环境关闭绘制日志
      // console.log('[StaticBomb] No Sleep image, drawing circle fallback');
      this.drawStaticBombCircle(ctx, sb, cx, cy, cs, pr, false);
    }
  }
  
  // 激活后：绘制牛牛炸弹
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
      // 使用牛牛炸弹动画
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
      
      // 计算绘制大小（激活后放大到1.5倍）
      const frameW = frame.w;
      const frameH = frame.h;
      const maxDim = Math.max(frameW, frameH);
      const scale = (cs * 1.5) / maxDim;
      
      const drawW = frameW * scale;
      const drawH = frameH * scale;
      const drawX = cx - drawW / 2;
      const drawY = cy - drawH / 2;
      
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
    const ctx = this.ctx, pr = this.pixelRatio || 2, s = this.scale || 1;
    const y = h - infoH - bottomSafe;
    ctx.fillStyle = 'rgba(22,33,62,0.6)';
    ctx.fillRect(0, y, w, infoH);
    ctx.fillStyle = '#8888A0';
    ctx.font = `${12 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const hint = state.hint || '点击空白格放置炸弹';
    ctx.fillText(hint, w / 2, y + infoH / 2);
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
