/**
 * App/Scenes/LoginScene.js
 * 登录/加载场景
 * 游戏入口，显示登录界面，预加载资源
 */

class LoginScene extends BaseScene {
  constructor() {
    super('login');
    this.progress = 0;
    this.isLoading = false;
    this.uiImages = {};
  }

  onInit() {
    // 加载UI资源
    this.loadUIImages();
  }

  loadUIImages() {
    const resMgr = ResourceManager.getInstance();
    
    Promise.all([
      resMgr.loadImage('res/images/ui/Login.png'),
      resMgr.loadImage('res/images/ui/Title.png')
    ]).then(([loginImg, titleImg]) => {
      this.uiImages.login = loginImg;
      this.uiImages.title = titleImg;
    }).catch(err => {
      console.warn('[LoginScene] Failed to load UI images:', err);
    });
  }

  onEnter(data) {
    this.progress = 0;
    this.isLoading = true;
    
    // 预加载游戏核心资源
    this.preloadGameResources();
    
    // 监听资源加载进度
    eventBus.on(Constants.EVENTS.RESOURCE_LOAD, this.onResourceProgress, this);
  }

  onExit() {
    eventBus.off(Constants.EVENTS.RESOURCE_LOAD, this.onResourceProgress);
  }

  onResourceProgress(data) {
    this.progress = data.progress;
    
    // 加载完成
    if (this.progress >= 1) {
      this.isLoading = false;
    }
  }

  preloadGameResources() {
    const resMgr = ResourceManager.getInstance();
    
    // 加载游戏场景所需资源
    resMgr.preloadForScene('game').then(() => {
      console.log('[LoginScene] Game resources preloaded');
    }).catch(err => {
      console.warn('[LoginScene] Preload warning:', err);
    });
  }

  onUpdate(dt) {
    // 可以在这里做加载动画
  }

  onRender() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    
    // 绘制登录背景
    if (this.uiImages.login) {
      const imgW = this.uiImages.login.width;
      const imgH = this.uiImages.login.height;
      const scaleX = w / imgW;
      const scaleY = h / imgH;
      const scale = Math.max(scaleX, scaleY);
      
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const drawX = (w - drawW) / 2;
      const drawY = (h - drawH) / 2;
      
      ctx.drawImage(this.uiImages.login, drawX, drawY, drawW, drawH);
    } else {
      // 备用背景
      this.drawBackground('#1A1A2E');
    }
    
    // 绘制标题
    if (this.uiImages.title) {
      const titleW = this.uiImages.title.width;
      const titleH = this.uiImages.title.height;
      const titleScale = Math.min(w * 0.8 / titleW, h * 0.15 / titleH);
      const drawW = titleW * titleScale;
      const drawH = titleH * titleScale;
      ctx.drawImage(this.uiImages.title, (w - drawW) / 2, h * 0.12, drawW, drawH);
    }
    
    // 绘制加载进度
    if (this.isLoading) {
      this.drawLoadingProgress();
    } else {
      // 绘制点击提示
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = `bold ${18 * (w / 375)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('点击屏幕开始游戏', w / 2, h * 0.75);
    }
  }

  drawLoadingProgress() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const barW = w * 0.6;
    const barH = 6;
    const barX = (w - barW) / 2;
    const barY = h * 0.7;
    
    // 背景条
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(barX, barY, barW, barH);
    
    // 进度条
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(barX, barY, barW * this.progress, barH);
    
    // 进度文字
    ctx.fillStyle = '#FFF';
    ctx.font = `bold ${14}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.floor(this.progress * 100)}%`, w / 2, barY + 20);
  }

  onTouch(x, y) {
    if (!this.isLoading) {
      // 切换到游戏场景
      if (typeof GameApp !== 'undefined') {
        // 新架构：通过 GameApp 切换
        const app = GameApp._instance;
        if (app) {
          app.switchToGame(1);
          return true;
        }
      }
      // 备用：直接切换
      sceneManager.switchTo('game', { level: 1 });
      return true;
    }
    return false;
  }
}

// 导出到全局
GameGlobal.LoginScene = LoginScene;
