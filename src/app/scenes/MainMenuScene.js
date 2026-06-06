/**
 * App/Scenes/MainMenuScene.js
 * 主菜单场景
 * 游戏主界面：开始游戏、关卡选择、设置等入口
 * 
 * 自适应设计：
 * - 所有位置基于安全区和屏幕比例
 * - 按钮大小随屏幕缩放
 * - 标题位置动态计算
 */

class MainMenuScene extends BaseScene {
  constructor() {
    super('main_menu');
    this.buttons = [];
    this.titleY = 0;
    this.menuStartY = 0;
    this.buttonHeight = 60;
    this.buttonGap = 20;
  }

  onInit() {
    // 计算自适应布局参数
    this.calcLayout();
    
    // 创建按钮
    this.createButtons();
  }

  /**
   * 计算自适应布局
   */
  calcLayout() {
    const info = this.getWindowInfo();
    const pr = info.pixelRatio || 2;
    const s = info.windowWidth / 375; // 缩放基准
    
    this.pr = pr;
    this.s = s;
    
    // 安全区
    const safeTop = (info.safeArea?.top || 0) * pr;
    const safeBottom = (info.windowHeight - (info.safeArea?.bottom || info.windowHeight)) * pr;
    
    // 可用高度
    const usableH = this.height - safeTop - safeBottom;
    
    // 标题位置：安全区顶部 + 10% 可用高度
    this.titleY = safeTop + usableH * 0.1;
    
    // 菜单起始位置：标题下方 + 20% 可用高度
    this.menuStartY = safeTop + usableH * 0.35;
    
    // 按钮尺寸自适应
    this.buttonWidth = Math.min(280, this.width * 0.7) * s * pr;
    this.buttonHeight = 60 * s * pr;
    this.buttonGap = 20 * s * pr;
    
    // 按钮水平居中
    this.buttonX = (this.width - this.buttonWidth) / 2;
  }

  /**
   * 创建菜单按钮
   */
  createButtons() {
    const btnConfigs = [
      { text: '开始游戏', style: 'primary', action: 'start_game' },
      { text: '关卡选择', style: 'secondary', action: 'level_select' },
      { text: '设置', style: 'secondary', action: 'settings' }
    ];
    
    this.buttons = [];
    
    btnConfigs.forEach((config, index) => {
      const btn = new Button({
        x: this.buttonX,
        y: this.menuStartY + index * (this.buttonHeight + this.buttonGap),
        width: this.buttonWidth,
        height: this.buttonHeight,
        text: config.text,
        style: config.style,
        fontSize: 20,
        onClick: () => this.handleButtonClick(config.action)
      });
      
      this.buttons.push(btn);
    });
  }

  onEnter(data) {
    // 重新计算布局（屏幕可能旋转或尺寸变化）
    this.calcLayout();
    this.createButtons();
    
    // 获取玩家数据
    const playerData = PlayerData.getInstance().getData();
    this.currentLevel = playerData.progress.currentLevel;
    this.unlockedLevel = playerData.progress.unlockedLevel;
    
    // 生产环境关闭场景进入日志
    // console.log(`[MainMenu] Entered, current level: ${this.currentLevel}`);
  }

  onUpdate(dt) {
    // 更新按钮动画
    this.buttons.forEach(btn => btn.update(dt));
  }

  onRender() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    
    // 绘制背景
    this.drawBackground('#1A1A2E');
    
    // 绘制标题图片
    this.drawTitle();
    
    // 绘制版本号
    ctx.fillStyle = '#555';
    ctx.font = `${10 * this.s * this.pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`v${Constants.VERSION}`, w / 2, h - this.safeAreaBottom - 10 * this.pr);
    
    // 绘制按钮
    this.buttons.forEach(btn => btn.draw(ctx, this.pr, this.s));
    
    // 绘制玩家信息（预留）
    this.drawPlayerInfo();
  }

  drawTitle() {
    const ctx = this.ctx;
    const titleImg = this.renderer?.uiImages?.title;
    
    if (titleImg) {
      // 使用标题图片
      const imgW = titleImg.width;
      const imgH = titleImg.height;
      const maxW = this.width * 0.8;
      const maxH = this.height * 0.2;
      const scale = Math.min(maxW / imgW, maxH / imgH);
      
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const drawX = (this.width - drawW) / 2;
      
      ctx.drawImage(titleImg, drawX, this.titleY, drawW, drawH);
    } else {
      // 备用文字标题
      ctx.fillStyle = '#FFD700';
      ctx.font = `bold ${36 * this.s * this.pr}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(Constants.GAME_NAME, this.width / 2, this.titleY);
    }
  }

  drawPlayerInfo() {
    const ctx = this.ctx;
    const playerData = PlayerData.getInstance().getData();
    
    // 显示当前关卡和总分
    const infoY = this.menuStartY + this.buttons.length * (this.buttonHeight + this.buttonGap) + 30 * this.pr;
    
    ctx.fillStyle = '#A0A8C0';
    ctx.font = `${14 * this.s * this.pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    ctx.fillText(`当前关卡: ${playerData.progress.currentLevel}`, this.width / 2, infoY);
    ctx.fillText(`总分: ${playerData.stats.totalScore}`, this.width / 2, infoY + 20 * this.pr);
  }

  onTouch(x, y) {
    // 检查按钮点击
    for (const btn of this.buttons) {
      if (btn.contains(x, y)) {
        btn.press();
        btn.release();
        return true;
      }
    }
    return false;
  }

  handleButtonClick(action) {
    switch (action) {
      case 'start_game':
        // 直接进入当前关卡
        sceneManager.switchTo('game', { level: this.currentLevel });
        break;
      case 'level_select':
        sceneManager.switchTo('level_select');
        break;
      case 'settings':
        sceneManager.switchTo('settings');
        break;
    }
  }

  onResize() {
    // 屏幕尺寸变化时重新计算
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.calcLayout();
    this.createButtons();
  }
}

// 导出到全局
GameGlobal.MainMenuScene = MainMenuScene;
