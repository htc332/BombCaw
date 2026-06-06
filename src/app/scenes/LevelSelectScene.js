/**
 * App/Scenes/LevelSelectScene.js
 * 关卡选择场景
 * 显示关卡网格，支持解锁状态显示
 * 
 * 自适应设计：
 * - 网格布局基于可用区域动态计算
 * - 按钮大小随屏幕缩放
 * - 支持5列或4列布局（根据屏幕宽度）
 */

class LevelSelectScene extends BaseScene {
  constructor() {
    super('level_select');
    this.levels = [];
    this.cols = 5;
    this.cellSize = 80;
    this.cellGap = 15;
    this.scrollY = 0;
    this.maxScroll = 0;
  }

  onInit() {
    this.calcLayout();
  }

  /**
   * 计算自适应布局
   */
  calcLayout() {
    const info = this.getWindowInfo();
    const pr = info.pixelRatio || 2;
    const s = info.windowWidth / 375;
    
    this.pr = pr;
    this.s = s;
    
    const safeTop = (info.safeArea?.top || 0) * pr;
    const safeBottom = (info.windowHeight - (info.safeArea?.bottom || info.windowHeight)) * pr;
    const usableH = this.height - safeTop - safeBottom;
    const usableW = this.width * (1 - Constants.LAYOUT.SIDE_MARGIN * 2);
    
    // 根据屏幕宽度决定列数
    if (usableW < 300 * pr) {
      this.cols = 4;
    } else {
      this.cols = 5;
    }
    
    // 计算格子大小
    this.cellGap = 15 * s * pr;
    this.cellSize = (usableW - this.cellGap * (this.cols - 1)) / this.cols;
    
    // 限制大小范围
    const minSize = 60 * s * pr;
    const maxSize = 100 * s * pr;
    this.cellSize = Math.max(minSize, Math.min(maxSize, this.cellSize));
    
    // 重新计算实际总宽度
    const totalW = this.cellSize * this.cols + this.cellGap * (this.cols - 1);
    this.startX = (this.width - totalW) / 2;
    this.startY = safeTop + 80 * s * pr;
    
    // 可用区域高度
    this.gridAreaH = usableH - 100 * s * pr - safeBottom;
  }

  onEnter(data) {
    this.calcLayout();
    this.loadLevels();
    this.scrollY = 0;
  }

  /**
   * 加载关卡数据
   */
  loadLevels() {
    const playerData = PlayerData.getInstance().getData();
    const maxLevels = Constants.GAME_NAME === '牛牛炸鼠' ? 100 : 18;
    
    this.levels = [];
    for (let i = 1; i <= maxLevels; i++) {
      const isUnlocked = i <= playerData.progress.unlockedLevel;
      const scoreData = playerData.levelScores[i];
      
      this.levels.push({
        level: i,
        unlocked: isUnlocked,
        completed: playerData.progress.completedLevels.includes(i),
        bestScore: scoreData?.bestScore || 0,
        stars: scoreData?.stars || 0
      });
    }
    
    // 计算最大滚动距离
    const rows = Math.ceil(this.levels.length / this.cols);
    const totalH = rows * (this.cellSize + this.cellGap);
    this.maxScroll = Math.max(0, totalH - this.gridAreaH);
  }

  onUpdate(dt) {
    // 可以在这里处理滚动动画
  }

  onRender() {
    const ctx = this.ctx;
    const w = this.width;
    
    // 背景
    this.drawBackground('#0D0D15');
    
    // 标题栏
    this.drawHeader();
    
    // 绘制关卡网格（带滚动）
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, this.startY, w, this.gridAreaH);
    ctx.clip();
    
    this.drawLevelGrid();
    
    ctx.restore();
    
    // 绘制返回按钮
    this.drawBackButton();
    
    // 绘制滚动指示器
    if (this.maxScroll > 0) {
      this.drawScrollIndicator();
    }
  }

  drawHeader() {
    const ctx = this.ctx;
    const pr = this.pr;
    const s = this.s;
    
    // 标题背景
    ctx.fillStyle = '#1A1A2E';
    ctx.fillRect(0, this.safeAreaTop, this.width, 70 * s * pr);
    
    // 标题
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${24 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('选择关卡', this.width / 2, this.safeAreaTop + 35 * s * pr);
    
    // 关卡进度
    const playerData = PlayerData.getInstance().getData();
    ctx.fillStyle = '#A0A8C0';
    ctx.font = `${12 * s * pr}px sans-serif`;
    ctx.fillText(
      `已解锁: ${playerData.progress.unlockedLevel} / ${this.levels.length}`,
      this.width / 2,
      this.safeAreaTop + 55 * s * pr
    );
  }

  drawLevelGrid() {
    const ctx = this.ctx;
    const pr = this.pr;
    const s = this.s;
    
    this.levels.forEach((level, index) => {
      const col = index % this.cols;
      const row = Math.floor(index / this.cols);
      
      const x = this.startX + col * (this.cellSize + this.cellGap);
      const y = this.startY + row * (this.cellSize + this.cellGap) - this.scrollY;
      
      // 只绘制可见的格子
      if (y + this.cellSize < this.startY || y > this.startY + this.gridAreaH) {
        return;
      }
      
      this.drawLevelCell(ctx, x, y, level, pr, s);
    });
  }

  drawLevelCell(ctx, x, y, level, pr, s) {
    const size = this.cellSize;
    
    if (level.unlocked) {
      // 已解锁
      ctx.fillStyle = level.completed ? '#2A3A5E' : '#2A2A3E';
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, [8 * pr]);
      ctx.fill();
      
      // 边框
      ctx.strokeStyle = level.completed ? '#5BA3F5' : '#4A4A5A';
      ctx.lineWidth = level.completed ? 2 * pr : 1;
      ctx.stroke();
      
      // 关卡数字 - 使用艺术数字
      if (this.renderer?.drawNumber) {
        this.renderer.drawNumber(ctx, level.level, x + size / 2, y + size / 2 - 5 * pr, size * 0.5, 'center');
      } else {
        ctx.fillStyle = '#FFF';
        ctx.font = `bold ${24 * s * pr}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(level.level), x + size / 2, y + size / 2 - 5 * pr);
      }
      
      // 星星（如果已通关）
      if (level.stars > 0) {
        ctx.fillStyle = '#FFD700';
        ctx.font = `${10 * s * pr}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('★'.repeat(level.stars), x + size / 2, y + size - 15 * pr);
      }
      
      // 最高分
      if (level.bestScore > 0) {
        ctx.fillStyle = '#A0A8C0';
        ctx.font = `${9 * s * pr}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(`${level.bestScore}`, x + size / 2, y + size - 5 * pr);
      }
    } else {
      // 未解锁
      ctx.fillStyle = '#1A1A28';
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, [8 * pr]);
      ctx.fill();
      
      ctx.strokeStyle = '#2A2A3E';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // 锁图标
      ctx.fillStyle = '#555';
      ctx.font = `${20 * s * pr}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔒', x + size / 2, y + size / 2);
    }
  }

  drawBackButton() {
    const ctx = this.ctx;
    const pr = this.pr;
    const s = this.s;
    
    const btnSize = 40 * s * pr;
    const x = 15 * s * pr;
    const y = this.safeAreaTop + 15 * s * pr;
    
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.arc(x + btnSize / 2, y + btnSize / 2, btnSize / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFF';
    ctx.font = `bold ${18 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('←', x + btnSize / 2, y + btnSize / 2);
    
    // 保存按钮区域用于触摸检测
    this.backButtonArea = { x, y, width: btnSize, height: btnSize };
  }

  drawScrollIndicator() {
    const ctx = this.ctx;
    const scrollRatio = this.scrollY / this.maxScroll;
    const barH = this.gridAreaH * 0.3;
    const barY = this.startY + (this.gridAreaH - barH) * scrollRatio;
    
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(this.width - 4, barY, 4, barH);
  }

  onTouch(x, y) {
    // 检查返回按钮
    if (this.backButtonArea &&
        x >= this.backButtonArea.x && x <= this.backButtonArea.x + this.backButtonArea.width &&
        y >= this.backButtonArea.y && y <= this.backButtonArea.y + this.backButtonArea.height) {
      sceneManager.back();
      return true;
    }
    
    // 检查关卡点击（考虑滚动偏移）
    if (y >= this.startY && y <= this.startY + this.gridAreaH) {
      for (let i = 0; i < this.levels.length; i++) {
        const col = i % this.cols;
        const row = Math.floor(i / this.cols);
        
        const cellX = this.startX + col * (this.cellSize + this.cellGap);
        const cellY = this.startY + row * (this.cellSize + this.cellGap) - this.scrollY;
        
        if (x >= cellX && x <= cellX + this.cellSize &&
            y >= cellY && y <= cellY + this.cellSize) {
          const level = this.levels[i];
          if (level.unlocked) {
            sceneManager.switchTo('game', { level: level.level });
          }
          return true;
        }
      }
    }
    
    return false;
  }

  onScroll(dy) {
    this.scrollY = Math.max(0, Math.min(this.maxScroll, this.scrollY + dy));
  }
}

// 导出到全局
GameGlobal.LevelSelectScene = LevelSelectScene;
