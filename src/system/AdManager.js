/**
 * System/AdManager.js
 * 广告管理器 - 激励视频广告
 * 功能：看广告续炸弹
 */

class AdManager {
  constructor() {
    this.rewardedAd = null;
    this.isReady = false;
    this.adUnitId = null; // 从配置读取
  }

  // ========== 初始化 ==========

  init(adUnitId) {
    this.adUnitId = adUnitId;
    
    if (!wx.createRewardedVideoAd) {
      console.log('[AdManager] 基础库版本不支持激励视频');
      return false;
    }

    this.rewardedAd = wx.createRewardedVideoAd({
      adUnitId: adUnitId
    });

    this.rewardedAd.onLoad(() => {
      console.log('[AdManager] 广告加载成功');
      this.isReady = true;
    });

    this.rewardedAd.onError((err) => {
      console.error('[AdManager] 广告错误:', err);
      this.isReady = false;
    });

    // 预加载
    this.load();
    return true;
  }

  load() {
    if (this.rewardedAd) {
      this.rewardedAd.load().catch(err => {
        console.error('[AdManager] 加载失败:', err);
      });
    }
  }

  // ========== 播放广告 ==========

  /**
   * 播放激励视频广告
   * @param {Object} options
   * @param {Function} options.onSuccess - 看完广告回调
   * @param {Function} options.onFail - 失败/跳过回调
   * @param {Function} options.onClose - 关闭回调（无论是否看完）
   */
  showRewardedAd(options = {}) {
    const { onSuccess, onFail, onClose } = options;

    if (!this.rewardedAd) {
      console.log('[AdManager] 广告未初始化');
      onFail && onFail({ reason: 'not_initialized' });
      return;
    }

    let rewarded = false;

    // 监听关闭
    const closeHandler = (res) => {
      this.rewardedAd.offClose(closeHandler);
      
      if (res && res.isEnded) {
        rewarded = true;
        onSuccess && onSuccess({ rewardType: 'bomb', count: 3 });
      } else {
        onFail && onFail({ reason: 'skipped' });
      }
      
      onClose && onClose({ rewarded });
      
      // 重新加载
      this.load();
    };

    this.rewardedAd.onClose(closeHandler);

    // 显示广告
    this.rewardedAd.show().catch(() => {
      // 失败时重新加载再试一次
      this.rewardedAd.load().then(() => {
        return this.rewardedAd.show();
      }).catch(err => {
        console.error('[AdManager] 播放失败:', err);
        onFail && onFail({ reason: 'play_failed', error: err });
      });
    });
  }

  // ========== 续命功能 ==========

  /**
   * 看广告续炸弹
   * @param {GameLogic} gameLogic - 游戏逻辑实例
   * @param {Function} onComplete - 完成回调
   */
  revive(gameLogic, onComplete) {
    this.showRewardedAd({
      onSuccess: (res) => {
        const success = gameLogic.reviveWithAd(res.count || 3);
        onComplete && onComplete({ 
          success, 
          rewarded: true,
          bombsAdded: res.count || 3 
        });
      },
      onFail: (res) => {
        onComplete && onComplete({ 
          success: false, 
          rewarded: false,
          reason: res.reason 
        });
      }
    });
  }
}

// 导出到微信小游戏全局
GameGlobal.AdManager = AdManager;
