/**
 * App/GameApp.js
 * 游戏应用入口
 * 新版架构的统一入口，替代直接实例化 BombWallGame
 */

class GameApp {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.pixelRatio = 2;
    
    // 初始化
    this.init();
  }

  /**
   * 初始化应用
   */
  init() {
    console.log(`[GameApp] Initializing ${Constants.GAME_NAME} v${Constants.VERSION}...`);
    
    // 初始化画布
    this.initCanvas();
    
    // 初始化管理器
    this.initManagers();
    
    // 初始化场景
    this.initScenes();
    
    // 绑定全局事件
    this.bindEvents();
    
    // 启动主循环
    this.startLoop();
    
    // 切换到登录场景
    this.switchToLogin();
    
    console.log('[GameApp] Initialized successfully');
  }

  /**
   * 初始化画布
   */
  initCanvas() {
    this.canvas = wx.createCanvas();
    this.ctx = this.canvas.getContext('2d');
    
    const info = Helpers.getWindowInfo();
    this.pixelRatio = info.pixelRatio || 2;
    this.canvas.width = info.windowWidth * this.pixelRatio;
    this.canvas.height = info.windowHeight * this.pixelRatio;
    
    console.log(`[Canvas] Size: ${this.canvas.width}x${this.canvas.height}, PixelRatio: ${this.pixelRatio}`);
  }

  /**
   * 初始化管理器
   */
  initManagers() {
    // 确保单例都已创建
    this.eventBus = EventBus.getInstance();
    this.sceneManager = SceneManager.getInstance();
    this.resourceManager = ResourceManager.getInstance();
    this.playerData = PlayerData.getInstance();
    this.config = Config.getInstance();
    
    // 初始化场景管理器
    this.sceneManager.init(this.canvas);
  }

  /**
   * 初始化场景
   */
  initScenes() {
    // 注册所有场景
    this.sceneManager.register('login', LoginScene);
    this.sceneManager.register('main_menu', MainMenuScene);
    this.sceneManager.register('level_select', LevelSelectScene);
    this.sceneManager.register('game', GameScene);
    this.sceneManager.register('result', ResultScene);
    this.sceneManager.register('settings', SettingsScene);
    
    console.log('[GameApp] All scenes registered');
  }

  /**
   * 切换到登录场景
   */
  switchToLogin() {
    this.sceneManager.switchTo('login').then(() => {
      console.log('[GameApp] Entered login scene');
    }).catch(err => {
      console.error('[GameApp] Failed to enter login:', err);
    });
  }

  /**
   * 切换到游戏场景
   */
  switchToGame(level = 1) {
    // 获取或创建游戏实例
    let gameInstance = BombWallGame._instance;
    
    if (!gameInstance && typeof BombWallGame === 'function') {
      // 创建新实例但不启动循环（由 GameApp 控制）
      gameInstance = new BombWallGame();
      BombWallGame._instance = gameInstance;
    }
    
    // 注入游戏实例到场景
    const gameScene = GameScene._instance;
    if (gameScene) {
      gameScene.setGameInstance(gameInstance);
    }
    
    return this.sceneManager.switchTo('game', { level }).then(() => {
      console.log(`[GameApp] Entered game scene, level ${level}`);
    });
  }

  /**
   * 绑定全局事件
   */
  bindEvents() {
    // 微信触摸事件
    wx.onTouchStart((e) => {
      const touch = e.touches[0];
      const x = touch.clientX * this.pixelRatio;
      const y = touch.clientY * this.pixelRatio;
      
      this.sceneManager.handleTouch(x, y);
    });
    
    // 监听场景切换
    this.eventBus.on(Constants.EVENTS.SCENE_CHANGE, (data) => {
      console.log(`[GameApp] Scene changed: ${data.from} -> ${data.to}`);
    });
    
    // 监听关卡完成
    this.eventBus.on(Constants.EVENTS.LEVEL_COMPLETE, (data) => {
      this.onLevelComplete(data);
    });
    
    // 监听关卡失败
    this.eventBus.on(Constants.EVENTS.LEVEL_FAIL, (data) => {
      this.onLevelFail(data);
    });
    
    // 监听分享事件（预留）
    this.eventBus.on(Constants.EVENTS.SHARE, (data) => {
      this.onShare(data);
    });
    
    // 微信生命周期
    wx.onShow(() => {
      console.log('[GameApp] Game shown');
      this.sceneManager.resume();
    });
    
    wx.onHide(() => {
      console.log('[GameApp] Game hidden');
      this.sceneManager.pause();
    });
  }

  /**
   * 关卡完成处理
   */
  onLevelComplete(data) {
    const { level, score } = data;
    
    // 保存分数
    this.playerData.saveLevelScore(level, score);
    
    // 解锁下一关
    this.playerData.unlockLevel(level + 1);
    
    console.log(`[GameApp] Level ${level} completed with score ${score}`);
    
    // 预留：显示结算界面
    // setTimeout(() => {
    //   this.sceneManager.switchTo('result', { 
    //     level, 
    //     score, 
    //     isVictory: true,
    //     nextLevel: level + 1 
    //   });
    // }, 3000);
  }

  /**
   * 关卡失败处理
   */
  onLevelFail(data) {
    const { level } = data;
    console.log(`[GameApp] Level ${level} failed`);
    
    // 预留：显示失败结算/广告复活
    // this.sceneManager.switchTo('result', { 
    //   level, 
    //   isVictory: false 
    // });
  }

  /**
   * 分享处理（预留）
   */
  onShare(data) {
    console.log('[GameApp] Share requested:', data);
    
    // 预留：调用微信分享API
    // wx.shareAppMessage({
    //   title: Constants.SHARE.TITLE.replace('{score}', data.score),
    //   imageUrl: Constants.SHARE.IMAGE_URL
    // });
  }

  /**
   * 主循环
   */
  startLoop() {
    this.lastTime = Date.now();
    
    const loop = () => {
      const now = Date.now();
      const dt = (now - this.lastTime) / 1000;
      this.lastTime = now;
      
      // 更新场景
      this.sceneManager.update(dt);
      
      // 渲染场景
      this.sceneManager.render();
      
      requestAnimationFrame(loop);
    };
    
    requestAnimationFrame(loop);
  }
}

// 导出到全局
GameGlobal.GameApp = GameApp;
