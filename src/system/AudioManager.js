/**
 * System/AudioManager.js
 * 音频管理器 - BGM诊断专用
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
    
    // 音效配置
    this.soundEffects = {
      place: { type: 'synthetic', freq: 800, duration: 100 },
      explode: { type: 'synthetic', freq: 200, duration: 300 },
      break: { type: 'synthetic', freq: 400, duration: 150 },
      upgrade: { type: 'synthetic', freq: 1200, duration: 200 },
      win: { type: 'synthetic', freq: 600, duration: 500 },
      fail: { type: 'synthetic', freq: 300, duration: 400 },
      hit: { type: 'synthetic', freq: 1000, duration: 80 }
    };
    
    this.vibrateConfig = { enabled: false };
    this.audioContext = null;
    
    // 诊断日志写入独立文件
    this._logFile = wx.env.USER_DATA_PATH + '/bgm_diag.txt';
    this._writeLog('=== BGM Diagnostic Log ===');
    this._writeLog('Constructor called');
  }
  
  _writeLog(msg) {
    try {
      var fs = wx.getFileSystemManager();
      var time = new Date().toLocaleTimeString();
      var line = '[' + time + '] ' + msg + '\n';
      
      // 尝试追加写入
      try {
        fs.appendFileSync(this._logFile, line, 'utf8');
      } catch (e) {
        // 文件不存在则创建
        fs.writeFileSync(this._logFile, line, 'utf8');
      }
    } catch (e) {
      // 静默失败，不影响游戏
    }
  }

  init() {
    if (this.initialized) return;
    
    this._writeLog('init() start');
    
    try {
      this.enabled = wx.getStorageSync('bomb_wall_sound_enabled') !== false;
      this.musicEnabled = wx.getStorageSync('bomb_wall_music_enabled') !== false;
      this.volume = wx.getStorageSync('bomb_wall_volume') || 1.0;
      
      this._writeLog('Settings: music=' + this.musicEnabled + ' vol=' + this.volume);
      
      if (typeof wx.createWebAudioContext === 'function') {
        this.audioContext = wx.createWebAudioContext();
        this._writeLog('WebAudio OK');
      } else {
        this._writeLog('WebAudio NOT available');
      }
      
      this.initialized = true;
      this._writeLog('init() done');
    } catch (e) {
      this._writeLog('init() ERROR: ' + e.message);
    }
  }

  loadBGM() {
    this._writeLog('loadBGM()');
    
    if (this.bgm) {
      this._writeLog('BGM already exists');
      return;
    }
    
    this._createBGM();
  }

  _createBGM() {
    this._writeLog('createBGM()');
    
    try {
      this.bgm = wx.createInnerAudioContext();
      this._writeLog('InnerAudioContext created');
      
      this.bgm.loop = true;
      this.bgm.volume = this.volume;
      this.bgm.src = this.bgmPath;
      
      this._writeLog('src set to: ' + this.bgmPath);
      
      this.bgm.onCanPlay(() => {
        this.bgmLoaded = true;
        this._writeLog('onCanPlay: duration=' + this.bgm.duration);
      });
      
      this.bgm.onError((err) => {
        this._writeLog('onError: code=' + err.errCode + ' msg=' + (err.errMsg || 'unknown'));
      });
      
      this.bgm.onPlay(() => {
        this.bgmPlaying = true;
        this._writeLog('onPlay: BGM started');
      });
      
      this.bgm.onWaiting(() => {
        this._writeLog('onWaiting: buffering');
      });
      
      this._writeLog('BGM ready, waiting for user touch');
    } catch (e) {
      this._writeLog('createBGM() ERROR: ' + e.message);
    }
  }

  playBGM() {
    this._writeLog('playBGM() called');
    
    if (!this.bgm) {
      this._writeLog('No BGM instance, loading...');
      this.loadBGM();
      return;
    }
    
    if (!this.musicEnabled) {
      this._writeLog('Music disabled');
      return;
    }
    
    if (this.bgmPlaying) {
      this._writeLog('Already playing');
      return;
    }
    
    try {
      this.bgm.play();
      this._writeLog('play() executed');
    } catch (e) {
      this._writeLog('play() ERROR: ' + e.message);
    }
  }

  pauseBGM() {
    if (!this.bgm) return;
    this.bgm.pause();
    this.bgmPlaying = false;
    this._writeLog('paused');
  }

  stopBGM() {
    if (!this.bgm) return;
    this.bgm.stop();
    this.bgmPlaying = false;
    this._writeLog('stopped');
  }

  play(soundName) {
    if (!this.enabled) return;
    
    const config = this.soundEffects[soundName];
    if (!config) return;
    
    if (config.type === 'synthetic') {
      this._playSynthetic(config.freq, config.duration);
    }
  }
  
  _playSynthetic(freq, duration) {
    if (!this.audioContext) return;
    
    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.frequency.value = freq;
      osc.type = 'square';
      
      gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
      
      osc.start(this.audioContext.currentTime);
      osc.stop(this.audioContext.currentTime + duration / 1000);
    } catch (e) {
      // 忽略
    }
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
