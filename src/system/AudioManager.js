/**
 * System/AudioManager.js
 * 音频管理器 - 使用工程原有日志系统
 */

class AudioManager {
  constructor() {
    if (AudioManager.instance) return AudioManager.instance;
    AudioManager.instance = this;
    
    this.enabled = true;
    this.musicEnabled = true;
    this.volume = 1.0;
    this.initialized = false;
    
    this.bgm = null;
    this.bgmPath = 'res/audio/bgm_level.mp3';
    this.bgmLoaded = false;
    
    this.soundEffects = {
      place: { type: 'vibrate', intensity: null },
      explode: { type: 'vibrate', intensity: 'heavy' },
      break: { type: 'vibrate', intensity: null },
      upgrade: { type: 'vibrate', intensity: 'light' },
      win: { type: 'vibrate', intensity: 'heavy' },
      fail: { type: 'vibrate', intensity: 'medium' },
      hit: { type: 'vibrate', intensity: 'light' }
    };
    
    this.vibrateConfig = {
      enabled: false, // [v0.8.5] 关闭震动反馈
      light: { type: 'light', duration: 15 },
      medium: { type: 'medium', duration: 25 },
      heavy: { type: 'heavy', duration: 40 }
    };
    
    console.log('[AudioManager] Constructor called');
  }

  init() {
    if (this.initialized) {
      console.log('[AudioManager] Already initialized, skip');
      return;
    }
    
    console.log('[AudioManager] init() starting...');
    
    try {
      this.enabled = wx.getStorageSync('bomb_wall_sound_enabled') !== false;
      this.musicEnabled = wx.getStorageSync('bomb_wall_music_enabled') !== false;
      this.volume = wx.getStorageSync('bomb_wall_volume') || 1.0;
      
      console.log('[AudioManager] Settings loaded - enabled:', this.enabled, 'musicEnabled:', this.musicEnabled);
      
      this.initialized = true;
      console.log('[AudioManager] Initialized successfully');
    } catch (e) {
      console.error('[AudioManager] Init failed:', e.message);
    }
  }

  loadBGM() {
    console.log('[AudioManager] loadBGM() called, bgm:', !!this.bgm);
    
    if (this.bgm) {
      console.log('[AudioManager] BGM already exists, skip');
      return;
    }
    
    console.log('[AudioManager] Creating BGM directly...');
    this.createBGM();
  }

  createBGM() {
    console.log('[AudioManager] createBGM() called');
    try {
      console.log('[AudioManager] Calling wx.createInnerAudioContext...');
      this.bgm = wx.createInnerAudioContext();
      console.log('[AudioManager] InnerAudioContext created:', !!this.bgm);
      
      this.bgm.src = this.bgmPath;
      this.bgm.loop = true;
      this.bgm.volume = this.volume;
      
      console.log('[AudioManager] BGM configured, src:', this.bgmPath);
      
      this.bgm.onCanPlay(() => {
        this.bgmLoaded = true;
        console.log('[AudioManager] BGM can play');
      });
      
      this.bgm.onError((err) => {
        console.error('[AudioManager] BGM error:', err);
      });
      
      this.bgm.onPlay(() => {
        console.log('[AudioManager] BGM onPlay fired');
      });
      
      console.log('[AudioManager] BGM created, waiting for user interaction to play');
    } catch (e) {
      console.error('[AudioManager] Create BGM failed:', e.message);
    }
  }

  playBGM() {
    console.log('[AudioManager] playBGM() called, bgm:', !!this.bgm, 'musicEnabled:', this.musicEnabled);
    
    if (!this.bgm) {
      console.log('[AudioManager] BGM not created, loading...');
      this.loadBGM();
      return;
    }
    if (!this.musicEnabled) {
      console.log('[AudioManager] Music disabled, skip');
      return;
    }
    
    try {
      this.bgm.play();
      console.log('[AudioManager] BGM play() called');
    } catch (e) {
      console.error('[AudioManager] Play BGM failed:', e.message);
    }
  }

  pauseBGM() {
    if (!this.bgm) return;
    try {
      this.bgm.pause();
      console.log('[AudioManager] BGM paused');
    } catch (e) {
      console.error('[AudioManager] Pause BGM failed:', e.message);
    }
  }

  stopBGM() {
    if (!this.bgm) return;
    try {
      this.bgm.stop();
      console.log('[AudioManager] BGM stopped');
    } catch (e) {
      console.error('[AudioManager] Stop BGM failed:', e.message);
    }
  }

  play(soundName) {
    if (!this.enabled) return;
    
    const config = this.soundEffects[soundName];
    if (!config) return;
    
    if (config.type === 'vibrate') {
      this.vibrate(config.intensity);
    }
  }

  vibrate(config) {
    if (!this.vibrateConfig.enabled) return;
    if (!wx.vibrateShort) return;
    if (config === null || config === undefined) return;
    
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
      wx.vibrateShort({ type: type });
    } catch (e) {
      try {
        if (duration > 30) {
          wx.vibrateLong();
        } else {
          wx.vibrateShort();
        }
      } catch (e2) {}
    }
  }

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

const audioManager = new AudioManager();
GameGlobal.AudioManager = AudioManager;
GameGlobal.audioManager = audioManager;

module.exports = { AudioManager, audioManager };
