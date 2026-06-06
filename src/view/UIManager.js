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

  draw() {
    switch (this.currentScene) {
      case 'level_select':
        this.drawLevelSelect();
        break;
      case 'settings':
        this.drawSettings();
        break;
    }
  }
}

// 导出到微信小游戏全局
GameGlobal.UIManager = UIManager;
