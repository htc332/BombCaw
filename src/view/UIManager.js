/**
 * View/UIManager.js
 * UI 管理器 - 管理各种界面（关卡选择、设置、商店等）
 */

class UIManager {
  constructor(canvas, renderer) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.renderer = renderer;
    
    // 当前场景
    this.currentScene = 'game'; // game, level_select, settings, shop
    
    // 按钮缓存
    this.buttons = [];
    
    // 回调
    this.onLevelSelect = null;
    this.onSettingChange = null;
    
    // 加载牛奶瓶图标（微信小游戏环境）
    this.milkIcon = wx.createImage ? wx.createImage() : (typeof Image !== 'undefined' ? new Image() : null);
    if (this.milkIcon) {
      this.milkIcon.src = 'images/ui_grid.png';
    }
  }

  // ========== 购买栏（Shop Bar）==========

  /**
   * 绘制底部购买栏 - 4个炸弹牛图标（匹配原型样式）
   * @param {Object} gameState - 游戏状态
   * @param {number} w - 画布宽度
   * @param {number} h - 画布高度
   * @param {Object} layout - 布局参数（来自 Renderer.calcLayout）
   */
  renderShopBar(gameState, w, h, layout) {
    const ctx = this.ctx;
    const r = this.renderer;
    const s = r.scale || 1;
    const pr = r.pixelRatio || 2;
    
    // [v0.8.0] 新计分系统：炸弹消耗积分
    const bombTypes = [
      { level: 1, name: '白色炸弹牛', cost: 2, evolution: 0, color: '#FFFFFF' },
      { level: 2, name: '蓝色炸弹牛', cost: 3, evolution: 2, color: '#5BA3F5' },
      { level: 3, name: '紫色炸弹牛', cost: 4, evolution: 3, color: '#C084FC' },
      { level: 4, name: '红色炸弹牛', cost: 5, evolution: 5, color: '#FF4444' }
    ];
    
    const score = gameState.score || 0;
    const selected = gameState.selectedBombType !== undefined ? gameState.selectedBombType : 0;
    
    // 使用 layout 参数，如果没有则回退到旧参数
    const bottomSafe = layout.bottomSafe || Math.max(20 * s * pr, 0);
    const barHeight = layout.shopBarH || Math.min(90 * s * pr, (h - bottomSafe) * 0.18);
    const scoreDisplayH = 35 * s * pr; // 得分显示区域高度
    const barY = h - bottomSafe - barHeight - scoreDisplayH - 20 * s * pr;  // 上移给得分留空间
    const itemWidth = Math.min(w / 4, 85 * s * pr);
    const itemHeight = barHeight - 15 * s * pr;
    const startX = (w - itemWidth * 4) / 2;
    const itemY = barY + 8 * s * pr;
    
    // 绘制背景（完全透明）
    ctx.fillStyle = 'rgba(13, 13, 21, 0)';
    ctx.fillRect(0, barY, w, barHeight);
    
    // 保存购买栏按钮区域（用于点击检测）
    this.shopBarButtons = [];
    
    bombTypes.forEach((type, index) => {
      const x = startX + index * itemWidth;
      const canAfford = score >= type.cost;
      const isSelected = selected === index;
      
      // 保存按钮区域
      this.shopBarButtons.push({
        type: 'shop_item',
        index: index,
        x: x,
        y: itemY,
        width: itemWidth - 6 * s * pr,
        height: itemHeight,
        bombType: type,
        onClick: () => {
          if (canAfford && this.onShopItemClick) {
            this.onShopItemClick(index);
          }
        }
      });
      
      // 绘制外框（原型风格：圆角矩形）
      const padding = 3 * s * pr;
      const boxX = x + padding;
      const boxY = itemY + padding;
      const boxW = itemWidth - 6 * s * pr - padding * 2;
      const boxH = itemHeight - padding * 2;
      const cornerRadius = 8 * s * pr;
      
      if (isSelected) {
        // 选中状态：金色边框 + 发光效果（原型风格）
        ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
        this.roundRect(ctx, boxX, boxY, boxW, boxH, cornerRadius);
        ctx.fill();
        
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2 * s * pr;
        this.roundRect(ctx, boxX, boxY, boxW, boxH, cornerRadius);
        ctx.stroke();
      } else if (!canAfford) {
        // 不可购买：灰色边框 + 半透明
        ctx.fillStyle = 'rgba(100, 100, 100, 0.1)';
        this.roundRect(ctx, boxX, boxY, boxW, boxH, cornerRadius);
        ctx.fill();
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
        ctx.lineWidth = 1;
        this.roundRect(ctx, boxX, boxY, boxW, boxH, cornerRadius);
        ctx.stroke();
      } else {
        // 可购买：默认边框
        ctx.fillStyle = 'rgba(42, 42, 62, 0.3)';
        this.roundRect(ctx, boxX, boxY, boxW, boxH, cornerRadius);
        ctx.fill();
        ctx.strokeStyle = 'rgba(74, 74, 90, 0.6)';
        ctx.lineWidth = 1;
        this.roundRect(ctx, boxX, boxY, boxW, boxH, cornerRadius);
        ctx.stroke();
      }
      
      // 绘制炸弹牛图标（原型风格：大图标）
      const iconSize = Math.min(boxW * 0.6, boxH * 0.55);
      const iconX = boxX + boxW / 2;
      const iconY = boxY + boxH * 0.4;
      
      this.drawShopBombIcon(ctx, type.level, iconX, iconY, iconSize, canAfford, r);
      
      // 绘制消耗积分（原型风格：底部）
      // [v0.8.0] 牛奶=积分，显示牛奶图标+数字
      ctx.fillStyle = canAfford ? '#FFD700' : '#FF4444'; // 黄色 : 红色
      const fontSize = canAfford ? (11 * s * pr) : (10 * s * pr); // 能买时放大1号
      const fontWeight = canAfford ? 'bold' : 'normal'; // 能买时加粗
      ctx.font = `${fontWeight} ${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      const costText = type.cost === 0 ? '免费' : `${type.cost}`;
      const textWidth = ctx.measureText(costText).width;
      
      // 绘制牛奶瓶图标（50%大小）
      const milkSize = 10 * s * pr;
      const milkX = boxX + boxW / 2 - textWidth / 2 - milkSize - 2 * s * pr + 4 * s * pr;
      const milkY = boxY + boxH - 4 * s * pr - milkSize;
      if (this.milkIcon && this.milkIcon.complete && this.milkIcon.width > 0) {
        ctx.drawImage(this.milkIcon, milkX, milkY, milkSize, milkSize);
      }
      
      ctx.fillText(costText, boxX + boxW / 2 + 4 * s * pr, boxY + boxH - 4 * s * pr); // 向右偏移4像素
    });
    
    // 绘制动态提示文字（根据玩家行为变化，1.2秒后回到默认）
    let hintText = '点击上方格子盘放置选中的牛牛';
    const lastAction = gameState.lastShopAction;
    const now = Date.now();
    const HINT_DURATION = 2500; // 2.5秒
    
    if (lastAction && lastAction.time && (now - lastAction.time) < HINT_DURATION) {
      if (lastAction.type === 'placed') {
        const bombCosts = [2, 3, 4, 5];
        const cost = bombCosts[selected] || 0;
        hintText = `消耗${cost}牛奶放置牛牛`;
      } else if (lastAction.type === 'cannot_afford') {
        hintText = '牛奶不足';
      }
    }
    
    // 提示文字在棋盘下方，购买栏上方
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${12 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(hintText, w / 2, barY - 35 * s * pr);
    
    // 绘制当前得分（牛奶图标 + 数字）
    const scoreY = barY - 20 * s * pr;
    const scoreText = `${score}`;
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${14 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const scoreTextWidth = ctx.measureText(scoreText).width;
    
    // 绘制牛奶图标
    const milkSize = 14 * s * pr;
    const totalWidth = scoreTextWidth + milkSize + 4 * s * pr;
    const milkStartX = (w - totalWidth) / 2;
    
    if (this.milkIcon && this.milkIcon.complete && this.milkIcon.width > 0) {
      ctx.drawImage(this.milkIcon, milkStartX, scoreY - milkSize / 2, milkSize, milkSize);
    }
    
    ctx.fillText(scoreText, milkStartX + milkSize + 4 * s * pr + scoreTextWidth / 2, scoreY);
  }
  
  /**
   * 绘制圆角矩形辅助函数
   */
  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
  
  /**
   * 绘制购买栏中的炸弹图标
   * 复用静态炸弹精灵图或绘制回退图形
   */
  drawShopBombIcon(ctx, level, cx, cy, size, canAfford, renderer) {
    // 使用动态炸弹精灵图（静态炸弹精灵图可能不存在）
    const spriteKey = 'level' + level;
    const sprite = renderer.bombSprites ? renderer.bombSprites[spriteKey] : null;
    
    if (sprite && sprite.loaded && sprite.sheet) {
      // 使用第15帧（索引14）作为购买栏图标
      const frames = sprite.index.frames;
      if (frames && frames.length > 0) {
        // 帧选择：1级第10帧(索引9)，4级第20帧(索引19)，其他第15帧(索引14)
        let frameIdx;
        if (level === 1) {
          frameIdx = Math.min(9, frames.length - 1);
        } else if (level === 4) {
          frameIdx = Math.min(19, frames.length - 1);
        } else {
          frameIdx = Math.min(14, frames.length - 1);
        }
        const frame = frames[frameIdx];
        console.log('[ShopIcon] level:', level, 'frames:', frames.length, 'using frame:', frameIdx, 'frame:', JSON.stringify(frame));
        const sheet = sprite.sheet;
        const frameW = frame.w;
        const frameH = frame.h;
        const maxDim = Math.max(frameW, frameH);
        const scale = (size * 1.2) / maxDim;
        
        const drawW = frameW * scale;
        const drawH = frameH * scale;
        const drawX = cx - drawW / 2;
        const drawY = cy - drawH / 2;
        
        if (!canAfford) {
          ctx.globalAlpha = 0.4;
        }
        ctx.drawImage(sheet, frame.x, frame.y, frame.w, frame.h, drawX, drawY, drawW, drawH);
        if (!canAfford) {
          ctx.globalAlpha = 1.0;
        }
        return;
      }
    }
    
    // 回退：绘制简单图形
    const colors = ['#FFFFFF', '#5BA3F5', '#C084FC', '#FF4444'];
    const color = colors[level - 1] || '#FFFFFF';
    
    ctx.fillStyle = canAfford ? color : '#555';
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制等级数字
    ctx.fillStyle = canAfford ? '#1A1A2E' : '#333';
    ctx.font = `bold ${size * 0.4}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(level), cx, cy);
  }
  
  /**
   * 购买栏点击检测
   * @param {number} x - 触摸X坐标
   * @param {number} y - 触摸Y坐标
   * @returns {boolean} - 是否处理了点击
   */
  onShopBarClick(x, y) {
    if (!this.shopBarButtons || this.shopBarButtons.length === 0) return false;
    
    for (const btn of this.shopBarButtons) {
      if (x >= btn.x && x <= btn.x + btn.width &&
          y >= btn.y && y <= btn.y + btn.height) {
        btn.onClick && btn.onClick();
        return true;
      }
    }
    return false;
  }
  
  // ========== 场景切换 ==========

  switchScene(sceneName, data = {}) {
    this.currentScene = sceneName;
    this.buttons = [];
    
    switch (sceneName) {
      case 'level_select':
        this.setupLevelSelect(data.levels || []);
        break;
      case 'settings':
        this.setupSettings(data.settings || {});
        break;
      case 'game':
        // 游戏主界面不需要预设置按钮
        break;
    }
  }

  // ========== 关卡选择界面 ==========

  setupLevelSelect(levels) {
    const r = this.renderer;
    const pr = r.pixelRatio;
    const s = r.scale;
    const cols = 5;
    const btnSize = 60 * s * pr;
    const gap = 15 * s * pr;
    const startX = (this.canvas.width - (cols * btnSize + (cols - 1) * gap)) / 2;
    const startY = r.safeAreaTop + 100 * s * pr;

    levels.forEach((level, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      this.buttons.push({
        type: 'level',
        level: level.level,
        x: startX + col * (btnSize + gap),
        y: startY + row * (btnSize + gap),
        width: btnSize,
        height: btnSize,
        unlocked: level.unlocked,
        bestScore: level.bestScore,
        current: level.current,
        onClick: () => {
          if (level.unlocked && this.onLevelSelect) {
            this.onLevelSelect(level.level);
          }
        }
      });
    });
  }

  drawLevelSelect() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const r = this.renderer;
    const s = r.scale;
    const pr = r.pixelRatio;

    // 背景
    ctx.fillStyle = '#0D0D15';
    ctx.fillRect(0, 0, w, h);

    // 标题
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${28 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('选择关卡', w / 2, r.safeAreaTop + 30 * s * pr);

    // 绘制关卡按钮
    this.buttons.forEach(btn => {
      this.drawLevelButton(btn);
    });

    // 返回按钮
    this.drawBackButton();
  }

  drawLevelButton(btn) {
    const ctx = this.ctx;
    const r = this.renderer;
    const s = r.scale;
    const pr = r.pixelRatio;
    
    // 背景
    ctx.fillStyle = btn.unlocked ? '#2A2A3E' : '#1A1A28';
    ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
    
    // 边框
    ctx.strokeStyle = btn.current ? '#FFD700' : (btn.unlocked ? '#4A4A5A' : '#2A2A3E');
    ctx.lineWidth = btn.current ? 3 * s * pr : 1;
    ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);

    // 关卡数字
    ctx.fillStyle = btn.unlocked ? '#FFF' : '#555';
    ctx.font = `bold ${20 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(btn.level), btn.x + btn.width / 2, btn.y + btn.height / 2);

    // 最高分
    if (btn.bestScore > 0) {
      ctx.fillStyle = '#FFD700';
      ctx.font = `${10 * s * pr}px sans-serif`;
      ctx.textBaseline = 'bottom';
      ctx.fillText(String(btn.bestScore), btn.x + btn.width / 2, btn.y + btn.height - 6 * s * pr);
    }

    // 锁定标记
    if (!btn.unlocked) {
      ctx.fillStyle = '#555';
      ctx.font = `${12 * s * pr}px sans-serif`;
      ctx.textBaseline = 'top';
      ctx.fillText('🔒', btn.x + btn.width / 2, btn.y + 6 * s * pr);
    }
  }

  // ========== 设置界面 ==========

  setupSettings(settings) {
    const r = this.renderer;
    const s = r.scale;
    const pr = r.pixelRatio;
    const startY = r.safeAreaTop + 140 * s * pr;
    const gap = 80 * s * pr;
    const margin = 20 * s * pr;

    const options = [
      { key: 'sound', label: '音效', value: settings.sound },
      { key: 'music', label: '背景音乐', value: settings.music },
      { key: 'vibrate', label: '震动反馈', value: settings.vibrate }
    ];

    options.forEach((opt, index) => {
      this.buttons.push({
        type: 'toggle',
        key: opt.key,
        label: opt.label,
        value: opt.value,
        x: margin,
        y: startY + index * gap,
        width: this.canvas.width - margin * 2,
        height: 50 * s * pr,
        onClick: () => {
          opt.value = !opt.value;
          this.buttons.find(b => b.key === opt.key).value = opt.value;
          if (this.onSettingChange) {
            this.onSettingChange(opt.key, opt.value);
          }
        }
      });
    });
  }

  drawSettings() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const r = this.renderer;
    const s = r.scale;
    const pr = r.pixelRatio;

    // 背景
    ctx.fillStyle = '#0D0D15';
    ctx.fillRect(0, 0, w, this.canvas.height);

    // 标题
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${28 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('设置', w / 2, r.safeAreaTop + 30 * s * pr);

    // 绘制选项
    this.buttons.forEach(btn => {
      this.drawToggleButton(btn);
    });

    this.drawBackButton();
  }

  drawToggleButton(btn) {
    const ctx = this.ctx;
    const r = this.renderer;
    const s = r.scale;
    const pr = r.pixelRatio;

    // 标签
    ctx.fillStyle = '#FFF';
    ctx.font = `${18 * s * pr}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(btn.label, btn.x, btn.y + btn.height / 2);

    // 开关
    const toggleW = 50 * s * pr;
    const toggleH = 30 * s * pr;
    const toggleX = btn.x + btn.width - toggleW - 10 * s * pr;
    const toggleY = btn.y + (btn.height - toggleH) / 2;

    // 背景
    ctx.fillStyle = btn.value ? '#4CAF50' : '#555';
    ctx.beginPath();
    ctx.roundRect(toggleX, toggleY, toggleW, toggleH, [toggleH / 2]);
    ctx.fill();

    // 滑块
    ctx.fillStyle = '#FFF';
    const knobR = (toggleH - 4 * s * pr) / 2;
    const knobX = btn.value ? toggleX + toggleW - knobR - 4 * s * pr : toggleX + knobR + 4 * s * pr;
    ctx.beginPath();
    ctx.arc(knobX, toggleY + toggleH / 2, knobR, 0, Math.PI * 2);
    ctx.fill();
  }

  // ========== 通用组件 ==========

  drawBackButton() {
    const ctx = this.ctx;
    const r = this.renderer;
    const s = r.scale;
    const pr = r.pixelRatio;
    
    const btn = {
      type: 'back',
      x: 10 * s * pr,
      y: r.safeAreaTop + 10 * s * pr,
      width: 60 * s * pr,
      height: 34 * s * pr,
      onClick: () => this.switchScene('game')
    };
    
    if (!this.buttons.find(b => b.type === 'back')) {
      this.buttons.push(btn);
    }

    ctx.fillStyle = '#2A2A3E';
    ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
    ctx.strokeStyle = '#4A4A5A';
    ctx.lineWidth = 1;
    ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);
    
    ctx.fillStyle = '#FFF';
    ctx.font = `${16 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('← 返回', btn.x + btn.width / 2, btn.y + btn.height / 2);
  }

  // ========== 输入处理 ==========

  handleTouch(x, y) {
    // 优先检测购买栏点击（如果在游戏场景）
    if (this.currentScene === 'game' && this.onShopBarClick(x, y)) {
      return true;
    }
    
    for (const btn of this.buttons) {
      if (x >= btn.x && x <= btn.x + btn.width &&
          y >= btn.y && y <= btn.y + btn.height) {
        btn.onClick && btn.onClick();
        return true;
      }
    }
    return false;
  }

  // ========== 主绘制 ==========

  draw(gameState) {
    switch (this.currentScene) {
      case 'level_select':
        this.drawLevelSelect();
        break;
      case 'settings':
        this.drawSettings();
        break;
      case 'game':
        // 游戏场景不在这里绘制，由 Renderer 调用 renderShopBar
        break;
    }
  }
}

// 导出到微信小游戏全局
GameGlobal.UIManager = UIManager;
