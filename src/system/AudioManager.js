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
    this.bgmPlaying = false;
    
    // [v0.8.5] 音效使用 Web Audio API 生成，不需要外部文件
    this.soundEffects = {
      place: { type: 'synthetic', freq: 800, duration: 100 },
      explode: { type: 'synthetic', freq: 200, duration: 300 },
      break: { type: 'synthetic', freq: 400, duration: 150 },
      upgrade: { type: 'synthetic', freq: 1200, duration: 200 },
      win: { type: 'synthetic', freq: 600, duration: 500 },
      fail: { type: 'synthetic', freq: 300, duration: 400 },
      hit: { type: 'synthetic', freq: 1000, duration: 80 }
    };
    
    this.vibrateConfig = {
      enabled: false, // [v0.8.5] 关闭震动反馈
      light: { type: 'light', duration: 15 },
      medium: { type: 'medium', duration: 25 },
      heavy: { type: 'heavy', duration: 40 }
    };
    
    // Web Audio API 上下文
    this.audioContext = null;
    
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
      
      // 初始化 Web Audio API
      this.initWebAudio();
      
      this.initialized = true;
      console.log('[AudioManager] Initialized successfully');
    } catch (e) {
      console.error('[AudioManager] Init failed:', e.message);
    }
  }
  
  initWebAudio() {
    try {
      if (typeof wx.createWebAudioContext === 'function') {
        this.audioContext = wx.createWebAudioContext();
        console.log('[AudioManager] Web Audio API initialized');
      } else {
        console.log('[AudioManager] Web Audio API not available');
      }
    } catch (e) {
      console.error('[AudioManager] Web Audio init failed:', e.message);
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
      
      // 设置属性（在 src 之前）
      this.bgm.loop = true;
      this.bgm.volume = this.volume;
      this.bgm.src = this.bgmPath;
      
      console.log('[AudioManager] BGM configured, src:', this.bgmPath);
      
      this.bgm.onCanPlay(() => {
        this.bgmLoaded = true;
        console.log('[AudioManager] BGM can play, duration:', this.bgm.duration);
      });
      
      this.bgm.onError((err) => {
        console.error('[AudioManager] BGM error:', JSON.stringify(err));
        // 尝试重新加载
        if (err.errCode === 10001) {
          console.log('[AudioManager] Retrying with full path...');
          this.bgm.src = '/' + this.bgmPath;
        }
      });
      
      this.bgm.onPlay(() => {
        this.bgmPlaying = true;
        console.log('[AudioManager] BGM onPlay fired');
      });
      
      this.bgm.onEnded(() => {
        console.log('[AudioManager] BGM ended (should loop)');
      });
      
      this.bgm.onWaiting(() => {
        console.log('[AudioManager] BGM waiting for data');
      });
      
      console.log('[AudioManager] BGM created, waiting for user interaction to play');
    } catch (e) {
      console.error('[AudioManager] Create BGM failed:', e.message);
    }
  }

  playBGM() {
    console.log('[AudioManager] playBGM() called, bgm:', !!this.bgm, 'musicEnabled:', this.musicEnabled, 'loaded:', this.bgmLoaded);
    
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
      // 检查是否已经播放中
      if (this.bgmPlaying) {
        console.log('[AudioManager] BGM already playing');
        return;
      }
      
      this.bgm.play();
      console.log('[AudioManager] BGM play() called');
      
      // 设置一个标志，表示我们尝试播放了
      this._playAttempted = true;
    } catch (e) {
      console.error('[AudioManager] Play BGM failed:', e.message);
    }
  }

  pauseBGM() {
    if (!this.bgm) return;
    try {
      this.bgm.pause();
      this.bgmPlaying = false;
      console.log('[AudioManager] BGM paused');
    } catch (e) {
      console.error('[AudioManager] Pause BGM failed:', e.message);
    }
  }

  stopBGM() {
    if (!this.bgm) return;
    try {
      this.bgm.stop();
      this.bgmPlaying = false;
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
    } else if (config.type === 'synthetic') {
      this.playSyntheticSound(config.freq, config.duration);
    }
  }
  
  playSyntheticSound(freq, duration) {
    if (!this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (e) {
      console.error('[AudioManager] Synthetic sound failed:', e.message);
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
