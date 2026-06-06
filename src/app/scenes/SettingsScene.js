/**
 * App/Scenes/SettingsScene.js
 * 设置场景
 * 音效、音乐、震动等设置
 * 
 * 自适应设计：
 * - 选项间距动态计算
 * - 开关按钮大小基于屏幕缩放
 */

class SettingsScene extends BaseScene {
  constructor() {
    super('settings');
    this.options = [];
    this.backButtonArea = null;
  }

  onInit() {
    this.calcLayout();
  }

  calcLayout() {
    const info = this.getWindowInfo();
    const pr = info.pixelRatio || 2;
    const s = info.windowWidth / 375;
    
    this.pr = pr;
    this.s = s;
    
    const safeTop = (info.safeArea?.top || 0) * pr;
    const safeBottom = (info.windowHeight - (info.safeArea?.bottom || info.windowHeight)) * pr;
    
    this.startY = safeTop + 100 * s * pr;
    this.itemGap = 80 * s * pr;
    this.itemHeight = 50 * s * pr;
    this.margin = 20 * s * pr;
    
    // 开关尺寸
    this.toggleW = 50 * s * pr;
    this.toggleH = 30 * s * pr;
  }

  onEnter(data) {
    this.calcLayout();
    
    const settings = PlayerData.getInstance().getSettings();
    
    this.options = [
      {
        key: 'sound',
        label: '音效',
        value: settings.sound,
        icon: '🔊'
      },
      {
        key: 'music',
        label: '背景音乐',
        value: settings.music,
        icon: '🎵'
      },
      {
        key: 'vibrate',
        label: '震动反馈',
        value: settings.vibrate,
        icon: '📳'
      }
    ];
  }

  onRender() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const pr = this.pr;
    const s = this.s;
    
    // 背景
    this.drawBackground('#0D0D15');
    
    // 标题栏
    ctx.fillStyle = '#1A1A2E';
    ctx.fillRect(0, this.safeAreaTop, w, 70 * s * pr);
    
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${24 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('设置', w / 2, this.safeAreaTop + 35 * s * pr);
    
    // 返回按钮
    this.drawBackButton();
    
    // 绘制选项
    this.options.forEach((opt, index) => {
      this.drawOption(ctx, opt, index, pr, s);
    });
    
    // 绘制版本号
    ctx.fillStyle = '#555';
    ctx.font = `${12 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`${Constants.GAME_NAME} v${Constants.VERSION}`, w / 2, h - this.safeAreaBottom - 10 * pr);
    
    // 清除数据按钮（预留）
    this.drawClearDataButton();
  }

  drawOption(ctx, opt, index, pr, s) {
    const y = this.startY + index * this.itemGap;
    const x = this.margin;
    const w = this.width - this.margin * 2;
    
    // 图标
    ctx.fillStyle = '#FFF';
    ctx.font = `${20 * s * pr}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(opt.icon, x, y + this.itemHeight / 2);
    
    // 标签
    ctx.fillStyle = '#FFF';
    ctx.font = `${18 * s * pr}px sans-serif`;
    ctx.fillText(opt.label, x + 35 * s * pr, y + this.itemHeight / 2);
    
    // 开关
    const toggleX = x + w - this.toggleW - 10 * s * pr;
    const toggleY = y + (this.itemHeight - this.toggleH) / 2;
    
    this.drawToggle(ctx, toggleX, toggleY, opt.value, pr, s);
    
    // 分隔线
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + this.itemHeight + 15 * s * pr);
    ctx.lineTo(x + w, y + this.itemHeight + 15 * s * pr);
    ctx.stroke();
  }

  drawToggle(ctx, x, y, value, pr, s) {
    // 背景
    ctx.fillStyle = value ? '#4CAF50' : '#555';
    ctx.beginPath();
    ctx.roundRect(x, y, this.toggleW, this.toggleH, [this.toggleH / 2]);
    ctx.fill();
    
    // 滑块
    ctx.fillStyle = '#FFF';
    const knobR = (this.toggleH - 4 * s * pr) / 2;
    const knobX = value
      ? x + this.toggleW - knobR - 4 * s * pr
      : x + knobR + 4 * s * pr;
    
    ctx.beginPath();
    ctx.arc(knobX, y + this.toggleH / 2, knobR, 0, Math.PI * 2);
    ctx.fill();
  }

  drawBackButton() {
    const ctx = this.ctx;
    const pr = this.pr;
    const s = this.s;
    
    const size = 40 * s * pr;
    const x = 15 * s * pr;
    const y = this.safeAreaTop + 15 * s * pr;
    
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFF';
    ctx.font = `bold ${18 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('←', x + size / 2, y + size / 2);
    
    this.backButtonArea = { x, y, width: size, height: size };
  }

  drawClearDataButton() {
    const ctx = this.ctx;
    const pr = this.pr;
    const s = this.s;
    
    const btnW = 200 * s * pr;
    const btnH = 40 * s * pr;
    const x = (this.width - btnW) / 2;
    const y = this.height - this.safeAreaBottom - 80 * pr;
    
    ctx.fillStyle = 'rgba(255, 107, 53, 0.2)';
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, btnW, btnH, [8 * pr]);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#FF6B35';
    ctx.font = `${14 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('清除游戏数据', this.width / 2, y + btnH / 2);
    
    this.clearDataArea = { x, y, width: btnW, height: btnH };
  }

  onTouch(x, y) {
    // 返回按钮
    if (this.backButtonArea &&
        x >= this.backButtonArea.x && x <= this.backButtonArea.x + this.backButtonArea.width &&
        y >= this.backButtonArea.y && y <= this.backButtonArea.y + this.backButtonArea.height) {
      sceneManager.back();
      return true;
    }
    
    // 选项开关
    for (let i = 0; i < this.options.length; i++) {
      const optY = this.startY + i * this.itemGap;
      const toggleX = this.margin + (this.width - this.margin * 2) - this.toggleW - 10 * this.pr;
      
      if (x >= toggleX && x <= toggleX + this.toggleW &&
          y >= optY && y <= optY + this.itemHeight) {
        this.toggleOption(i);
        return true;
      }
    }
    
    // 清除数据按钮
    if (this.clearDataArea &&
        x >= this.clearDataArea.x && x <= this.clearDataArea.x + this.clearDataArea.width &&
        y >= this.clearDataArea.y && y <= this.clearDataArea.y + this.clearDataArea.height) {
      this.clearData();
      return true;
    }
    
    return false;
  }

  toggleOption(index) {
    const opt = this.options[index];
    opt.value = !opt.value;
    
    // 更新玩家数据
    const settings = PlayerData.getInstance().getSettings();
    settings[opt.key] = opt.value;
    PlayerData.getInstance().updateSettings(settings);
    
    // 触发事件
    eventBus.emit(Constants.EVENTS.BUTTON_CLICK, {
      type: 'toggle',
      key: opt.key,
      value: opt.value
    });
    
    console.log(`[Settings] ${opt.label}: ${opt.value}`);
  }

  clearData() {
    // 预留：确认对话框
    console.log('[Settings] Clear data requested');
    
    // 实际清除
    PlayerData.getInstance().reset();
    
    // 刷新显示
    this.onEnter();
  }
}

// 导出到全局
GameGlobal.SettingsScene = SettingsScene;