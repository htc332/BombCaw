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
    // 诊断信息（同时显示在游戏画面上）
    this.diagInfo = 'AUDIO: initializing...';
    
    this._writeLog('=== BGM Diagnostic Log ===');
    this._writeLog('Constructor called');
  }
  
  // 更新画面显示的诊断信息
  _updateDiag(msg) {
    this.diagInfo = msg;
    this._writeLog(msg);
  }
  
  // 获取诊断信息（供游戏画面渲染）
  getDiagInfo() {
    return this.diagInfo || 'AUDIO: no info';
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
    
    this._updateDiag('AUDIO: init() start');
    
    try {
      this.enabled = wx.getStorageSync('bomb_wall_sound_enabled') !== false;
      this.musicEnabled = wx.getStorageSync('bomb_wall_music_enabled') !== false;
      this.volume = wx.getStorageSync('bomb_wall_volume') || 1.0;
      
      this._updateDiag('AUDIO: settings loaded, music=' + this.musicEnabled);
      
      if (typeof wx.createWebAudioContext === 'function') {
        this.audioContext = wx.createWebAudioContext();
        this._updateDiag('AUDIO: WebAudio OK');
      } else {
        this._updateDiag('AUDIO: WebAudio NOT available');
      }
      
      this.initialized = true;
      this._updateDiag('AUDIO: init() done');
    } catch (e) {
      this._updateDiag('AUDIO: init() ERROR: ' + e.message);
    }
  }

  loadBGM() {
    this._updateDiag('AUDIO: loadBGM()');
    
    if (this.bgm) {
      this._updateDiag('AUDIO: BGM already exists');
      return;
    }
    
    this._createBGM();
  }

  _createBGM() {
    this._updateDiag('AUDIO: createBGM()');
    
    try {
      this.bgm = wx.createInnerAudioContext();
      this._updateDiag('AUDIO: InnerAudioContext created');
      
      this.bgm.loop = true;
      this.bgm.volume = this.volume;
      this.bgm.src = this.bgmPath;
      
      this._updateDiag('AUDIO: src=' + this.bgmPath);
      
      this.bgm.onCanPlay(() => {
        this.bgmLoaded = true;
        this._updateDiag('AUDIO: onCanPlay, duration=' + this.bgm.duration);
      });
      
      this.bgm.onError((err) => {
        this._updateDiag('AUDIO: onError code=' + err.errCode + ' msg=' + (err.errMsg || 'unknown'));
      });
      
      this.bgm.onPlay(() => {
        this.bgmPlaying = true;
        this._updateDiag('AUDIO: onPlay - BGM STARTED!');
      });
      
      this.bgm.onWaiting(() => {
        this._updateDiag('AUDIO: onWaiting - buffering');
      });
      
      this._updateDiag('AUDIO: BGM ready, click to play');
    } catch (e) {
      this._updateDiag('AUDIO: createBGM() ERROR: ' + e.message);
    }
  }

  playBGM() {
    this._updateDiag('AUDIO: playBGM() called');
    
    if (!this.bgm) {
      this._updateDiag('AUDIO: no BGM, loading...');
      this.loadBGM();
      return;
    }
    
    if (!this.musicEnabled) {
      this._updateDiag('AUDIO: music disabled');
      return;
    }
    
    if (this.bgmPlaying) {
      this._updateDiag('AUDIO: already playing');
      return;
    }
    
    try {
      this.bgm.play();
      this._updateDiag('AUDIO: play() executed');
    } catch (e) {
      this._updateDiag('AUDIO: play() ERROR: ' + e.message);
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
