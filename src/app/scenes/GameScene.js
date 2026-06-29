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
    
    // 播放背景音乐
    if (audioManager) {
      audioManager.playBGM();
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
    // 恢复背景音乐
    if (audioManager) {
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
