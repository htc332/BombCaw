/**
 * App/Scenes/GameScene.js
 * 游戏场景
 * 核心玩法场景，复用现有 BombWallGame 实例
 */

class GameScene extends BaseScene {
  constructor() {
    super('game');
    this.gameInstance = null;
    this.level = 1;
    this.bgmStarted = false; // 标记BGM是否已开始
  }

  onInit() {
    // 复用全局已有的 BombWallGame 实例（由 main.js 创建）
    // 或创建新的但由外部控制循环
    if (typeof BombWallGame !== 'undefined') {
      // 标记为场景模式，不自动启动循环
      this.gameInstance = BombWallGame._instance || null;
    }
  }

  onEnter(data) {
    this.level = data?.level || 1;
    this.bgmStarted = false;
    
    // 预加载背景音乐，但不自动播放（等待用户交互）
    if (audioManager && !audioManager.bgm) {
      audioManager.loadBGM();
    }
    
    // 如果已有游戏实例，启动关卡
    if (this.gameInstance && this.gameInstance.startLevel) {
      this.gameInstance.startLevel(this.level);
    }
    
    eventBus.emit(Constants.EVENTS.LEVEL_START, { level: this.level });
  }

  onExit() {
    // 游戏实例继续存在，只是停止更新
    // 暂停背景音乐（不停止，保持位置）
    if (audioManager) {
      audioManager.pauseBGM();
    }
  }

  onPause() {
    if (this.gameInstance) {
      this.gameInstance.gameState = 'paused';
    }
    // 暂停背景音乐
    if (audioManager) {
      audioManager.pauseBGM();
    }
  }

  onResume() {
    if (this.gameInstance) {
      this.gameInstance.gameState = 'playing';
    }
    // 恢复背景音乐（如果已经开始过）
    if (audioManager && this.bgmStarted) {
      audioManager.playBGM();
    }
  }

  onUpdate(dt) {
    // 由 GameApp 主循环驱动
    if (this.gameInstance && !this.isPaused) {
      this.gameInstance.update?.(dt);
    }
  }

  onRender() {
    if (this.gameInstance) {
      this.gameInstance.render?.();
    }
  }

  onTouch(x, y) {
    // 用户第一次交互时开始播放BGM
    if (!this.bgmStarted && audioManager) {
      this.bgmStarted = true;
      audioManager.playBGM();
    }
    
    if (this.gameInstance) {
      this.gameInstance.handleTouch?.(x, y);
      return true;
    }
    return false;
  }

  /**
   * 设置游戏实例（由外部注入）
   */
  setGameInstance(instance) {
    this.gameInstance = instance;
  }
}

// 导出到全局
GameGlobal.GameScene = GameScene;
