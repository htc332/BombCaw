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
    
    console.log('[GameScene] onEnter level:', this.level);
    
    // 检查 audioManager 是否存在
    const am = audioManager || GameGlobal.audioManager;
    console.log('[GameScene] audioManager exists:', !!am);
    
    if (am) {
      console.log('[GameScene] Initializing audio...');
      am.init();
      
      if (!am.bgm) {
        console.log('[GameScene] Loading BGM...');
        am.loadBGM();
      }
    } else {
      console.error('[GameScene] audioManager not found!');
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
    const am = audioManager || GameGlobal.audioManager;
    if (am) {
      am.pauseBGM();
    }
  }

  onPause() {
    if (this.gameInstance) {
      this.gameInstance.gameState = 'paused';
    }
    // 暂停背景音乐
    const am = audioManager || GameGlobal.audioManager;
    if (am) {
      am.pauseBGM();
    }
  }

  onResume() {
    if (this.gameInstance) {
      this.gameInstance.gameState = 'playing';
    }
    // 恢复背景音乐（如果已经开始过）
    const am = audioManager || GameGlobal.audioManager;
    if (am && this.bgmStarted) {
      am.playBGM();
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
    
    // 绘制音频调试信息（使用游戏现有渲染系统）
    try {
      const am = audioManager || GameGlobal.audioManager;
      if (am && this.gameInstance && this.gameInstance.renderer) {
        const renderer = this.gameInstance.renderer;
        const ctx = renderer.ctx;
        if (ctx) {
          // 使用游戏现有的文字样式
          ctx.fillStyle = 'rgba(0,0,0,0.8)';
          ctx.fillRect(10, 10, 400, 100);
          ctx.fillStyle = '#FFE4B5';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'left';
          
          let y = 30;
          const x = 20;
          ctx.fillText('AUDIO: ' + (am.initialized ? 'OK' : 'NO_INIT'), x, y);
          y += 20;
          ctx.fillText('BGM: ' + (am.bgm ? 'CREATED' : 'NULL'), x, y);
          y += 20;
          ctx.fillText('MUSIC: ' + (am.musicEnabled ? 'ON' : 'OFF'), x, y);
          y += 20;
          ctx.fillText('STATUS: ' + (am.debugInfo?.status || 'unknown'), x, y);
        }
      }
    } catch (e) {
      // 忽略调试绘制错误
    }
  }

  onTouch(x, y) {
    // 用户第一次交互时开始播放BGM
    console.log('[GameScene] onTouch called, bgmStarted:', this.bgmStarted);
    
    const am = audioManager || GameGlobal.audioManager;
    if (!this.bgmStarted && am) {
      this.bgmStarted = true;
      console.log('[GameScene] First touch, playing BGM...');
      am.playBGM();
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
