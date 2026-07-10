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
    this.bgmPath = '/res/audio/bgm_level.mp3';
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
    
    // 日志系统
    this.logs = [];
    this.logFile = wx.env.USER_DATA_PATH + '/audio_debug.log';
    
    this.log('Constructor called');
  }
  
  log(msg) {
    var time = new Date().toLocaleTimeString();
    var logMsg = '[' + time + '] [AudioManager] ' + msg;
    this.logs.push(logMsg);
    console.log(logMsg);
    
    // 写入文件（异步）
    if (this.logs.length > 50) {
      this.flushLogs();
    }
  }
  
  flushLogs() {
    try {
      var fs = wx.getFileSystemManager();
      var content = this.logs.join('\n') + '\n';
      fs.appendFileSync(this.logFile, content, 'utf8');
      this.logs = [];
    } catch (e) {
      console.error('[AudioManager] Flush logs failed:', e.message);
    }
  }
  
  readLogs() {
    try {
      var fs = wx.getFileSystemManager();
      return fs.readFileSync(this.logFile, 'utf8');
    } catch (e) {
      return 'No logs yet';
    }
  }

  init() {
    if (this.initialized) {
      this.log('Already initialized, skip');
      return;
    }
    
    this.log('init() starting...');
    
    try {
      this.enabled = wx.getStorageSync('bomb_wall_sound_enabled') !== false;
      this.musicEnabled = wx.getStorageSync('bomb_wall_music_enabled') !== false;
      this.volume = wx.getStorageSync('bomb_wall_volume') || 1.0;
      
      this.log('Settings loaded - enabled:' + this.enabled + ' musicEnabled:' + this.musicEnabled);
      
      // 初始化 Web Audio API
      this.initWebAudio();
      
      this.initialized = true;
      this.log('Initialized successfully');
    } catch (e) {
      this.log('Init failed: ' + e.message);
    }
  }
  
  initWebAudio() {
    try {
      if (typeof wx.createWebAudioContext === 'function') {
        this.audioContext = wx.createWebAudioContext();
        this.log('Web Audio API initialized');
      } else {
        this.log('Web Audio API not available');
      }
    } catch (e) {
      this.log('Web Audio init failed: ' + e.message);
    }
  }

  loadBGM() {
    this.log('loadBGM() called, bgm:' + !!this.bgm);
    
    if (this.bgm) {
      this.log('BGM already exists, skip');
      return;
    }
    
    this.log('Creating BGM directly...');
    this.createBGM();
  }

  createBGM() {
    this.log('createBGM() called');
    try {
      this.log('Calling wx.createInnerAudioContext...');
      this.bgm = wx.createInnerAudioContext();
      this.log('InnerAudioContext created:' + !!this.bgm);
      
      // 设置属性（在 src 之前）
      this.bgm.loop = true;
      this.bgm.volume = this.volume;
      this.bgm.src = this.bgmPath;
      
      this.log('BGM configured, src:' + this.bgmPath);
      
      this.bgm.onCanPlay(() => {
        this.bgmLoaded = true;
        this.log('BGM can play, duration:' + this.bgm.duration);
      });
      
      this.bgm.onError((err) => {
        this.log('BGM error: ' + JSON.stringify(err));
        // 如果绝对路径失败，尝试相对路径
        if (err.errCode === 10001 && this.bgm.src.startsWith('/')) {
          this.log('Retrying with relative path...');
          this.bgm.src = this.bgmPath.substring(1); // 去掉开头的 /
        }
      });
      
      this.bgm.onPlay(() => {
        this.bgmPlaying = true;
        this.log('BGM onPlay fired');
      });
      
      this.bgm.onEnded(() => {
        this.log('BGM ended (should loop)');
      });
      
      this.bgm.onWaiting(() => {
        this.log('BGM waiting for data');
      });
      
      this.log('BGM created, waiting for user interaction to play');
    } catch (e) {
      this.log('Create BGM failed: ' + e.message);
    }
  }

  playBGM() {
    this.log('playBGM() called, bgm:' + !!this.bgm + ' musicEnabled:' + this.musicEnabled + ' loaded:' + this.bgmLoaded);
    
    if (!this.bgm) {
      this.log('BGM not created, loading...');
      this.loadBGM();
      return;
    }
    if (!this.musicEnabled) {
      this.log('Music disabled, skip');
      return;
    }
    
    try {
      // 检查是否已经播放中
      if (this.bgmPlaying) {
        this.log('BGM already playing');
        return;
      }
      
      this.bgm.play();
      this.log('BGM play() called');
      
      // 设置一个标志，表示我们尝试播放了
      this._playAttempted = true;
    } catch (e) {
      this.log('Play BGM failed: ' + e.message);
    }
  }

  pauseBGM() {
    if (!this.bgm) return;
    try {
      this.bgm.pause();
      this.bgmPlaying = false;
      this.log('BGM paused');
    } catch (e) {
      this.log('Pause BGM failed: ' + e.message);
    }
  }

  stopBGM() {
    if (!this.bgm) return;
    try {
      this.bgm.stop();
      this.bgmPlaying = false;
      this.log('BGM stopped');
    } catch (e) {
      this.log('Stop BGM failed: ' + e.message);
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
      
      this.log('Synthetic sound played: ' + freq + 'Hz for ' + duration + 'ms');
    } catch (e) {
      this.log('Synthetic sound failed: ' + e.message);
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
