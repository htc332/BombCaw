/**
 * System/AudioManager.js
 * 音频管理器 - 音效和背景音乐
 * 
 * 上线标准：
 * 1. 即时的音效反馈
 * 2. 震动支持
 * 3. 可配置的音量控制
 */

class AudioManager {
  constructor() {
    this.enabled = true;
    this.musicEnabled = true;
    this.volume = 1.0;
    this.initialized = false;
    
    // 背景音乐
    this.bgm = null;
    this.bgmPath = 'res/audio/bgm_level.mp3';
    this.bgmLoaded = false;
    
    // 音效配置
    // vibrate 设置为 null 表示该音效不触发震动
    this.soundEffects = {
      place: { type: 'vibrate', intensity: null },      // 放置不震动
      explode: { type: 'vibrate', intensity: 'heavy' },
      break: { type: 'vibrate', intensity: null },
      upgrade: { type: 'vibrate', intensity: 'light' },
      win: { type: 'vibrate', intensity: 'heavy' },
      fail: { type: 'vibrate', intensity: 'medium' },
      hit: { type: 'vibrate', intensity: 'light' }
    };
    
    // 震动组件配置 - 可外部调整
    this.vibrateConfig = {
      enabled: true,           // 总开关
      light: { type: 'light', duration: 15 },
      medium: { type: 'medium', duration: 25 },
      heavy: { type: 'heavy', duration: 40 }
    };
  }

  init() {
    if (this.initialized) return;
    
    try {
      // 从存储读取设置
      this.enabled = wx.getStorageSync('bomb_wall_sound_enabled') !== false;
      this.musicEnabled = wx.getStorageSync('bomb_wall_music_enabled') !== false;
      this.volume = wx.getStorageSync('bomb_wall_volume') || 1.0;
      
      this.initialized = true;
      console.log('[AudioManager] Initialized');
    } catch (e) {
      console.error('[AudioManager] Init failed:', e);
    }
  }

  /**
   * 播放音效
   */
  play(soundName) {
    if (!this.enabled) return;
    
    const config = this.soundEffects[soundName];
    if (!config) return;
    
    // 震动反馈
    if (config.type === 'vibrate') {
      this.vibrate(config.intensity);
    }
    
    // 未来可以添加音频文件播放
    // this.playAudioFile(soundName);
  }

  /**
   * 震动反馈组件 - 可调整参数
   * @param {string|object} config - 强度名称('light'/'medium'/'heavy') 或配置对象 {type, duration}
   */
  vibrate(config = 'light') {
    if (!this.vibrateConfig.enabled) return;
    if (!wx.vibrateShort) return;
    if (config === null || config === undefined) return;
    
    // 解析配置
    let type, duration;
    if (typeof config === 'string') {
      const preset = this.vibrateConfig[config];
      if (!preset) return;
      type = preset.type;
      duration = preset.duration;
    } else if (typeof config === 'object') {
      type = config.type || 'light';
      duration = config.duration || 15;
    } else {
      return;
    }
    
    try {
      // 支持 type 参数的微信版本
      wx.vibrateShort({ type: type });
    } catch (e) {
      // 旧版本兼容 - 使用 vibrateLong 模拟长震动
      try {
        if (duration > 30) {
          wx.vibrateLong();
        } else {
          wx.vibrateShort();
        }
      } catch (e2) {
        // 忽略错误
      }
    }
  }

  /**
   * 设置震动配置
   * @param {object} config - 震动配置对象
   */
  setVibrateConfig(config) {
    if (config.enabled !== undefined) {
      this.vibrateConfig.enabled = config.enabled;
    }
    if (config.light) Object.assign(this.vibrateConfig.light, config.light);
    if (config.medium) Object.assign(this.vibrateConfig.medium, config.medium);
    if (config.heavy) Object.assign(this.vibrateConfig.heavy, config.heavy);
    
    console.log('[AudioManager] Vibrate config updated:', this.vibrateConfig);
  }

  /**
   * 设置某个音效的震动强度（设为 null 则禁用该音效震动）
   * @param {string} soundName - 音效名称
   * @param {string|null} intensity - 强度名称或 null
   */
  setSoundVibrate(soundName, intensity) {
    if (this.soundEffects[soundName]) {
      this.soundEffects[soundName].intensity = intensity;
    }
  }

  /**
   * 加载背景音乐
   */
  loadBGM() {
    if (this.bgm) return;
    
    try {
      this.bgm = wx.createInnerAudioContext();
      this.bgm.src = this.bgmPath;
      this.bgm.loop = true;
      this.bgm.volume = this.volume;
      
      this.bgm.onCanPlay(() => {
        this.bgmLoaded = true;
        console.log('[AudioManager] BGM loaded');
        if (this.musicEnabled) {
          this.playBGM();
        }
      });
      
      this.bgm.onError((err) => {
        console.error('[AudioManager] BGM error:', err);
      });
      
    } catch (e) {
      console.error('[AudioManager] Load BGM failed:', e);
    }
  }

  /**
   * 播放背景音乐
   */
  playBGM() {
    if (!this.bgm) {
      this.loadBGM();
      return;
    }
    if (!this.musicEnabled) return;
    
    try {
      this.bgm.play();
      console.log('[AudioManager] BGM playing');
    } catch (e) {
      console.error('[AudioManager] Play BGM failed:', e);
    }
  }

  /**
   * 暂停背景音乐
   */
  pauseBGM() {
    if (!this.bgm) return;
    try {
      this.bgm.pause();
    } catch (e) {
      console.error('[AudioManager] Pause BGM failed:', e);
    }
  }

  /**
   * 停止背景音乐
   */
  stopBGM() {
    if (!this.bgm) return;
    try {
      this.bgm.stop();
    } catch (e) {
      console.error('[AudioManager] Stop BGM failed:', e);
    }
  }

  /**
   * 播放音频文件（预留接口）
   */
  playAudioFile(soundName) {
    // 未来实现：
    // const audio = wx.createInnerAudioContext();
    // audio.src = `res/audio/${soundName}.mp3`;
    // audio.volume = this.volume;
    // audio.play();
  }

  // ========== 设置 ==========

  setEnabled(enabled) {
    this.enabled = enabled;
    wx.setStorageSync('bomb_wall_sound_enabled', enabled);
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    wx.setStorageSync('bomb_wall_music_enabled', enabled);
    
    if (enabled) {
      this.playBGM();
    } else {
      this.pauseBGM();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    wx.setStorageSync('bomb_wall_volume', this.volume);
    
    if (this.bgm) {
      this.bgm.volume = this.volume;
    }
  }
}

// 导出单例
const audioManager = new AudioManager();
GameGlobal.AudioManager = AudioManager;
GameGlobal.audioManager = audioManager;

// CommonJS 导出
module.exports = { AudioManager, audioManager };
