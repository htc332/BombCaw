/**
 * System/AudioManager.js
 * 音频管理器 - 专注BGM诊断
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
    
    // 音效配置（合成音效）
    this.soundEffects = {
      place: { type: 'synthetic', freq: 800, duration: 100 },
      explode: { type: 'synthetic', freq: 200, duration: 300 },
      break: { type: 'synthetic', freq: 400, duration: 150 },
      upgrade: { type: 'synthetic', freq: 1200, duration: 200 },
      win: { type: 'synthetic', freq: 600, duration: 500 },
      fail: { type: 'synthetic', freq: 300, duration: 400 },
      hit: { type: 'synthetic', freq: 1000, duration: 80 }
    };
    
    // 关闭震动
    this.vibrateConfig = { enabled: false };
    
    // Web Audio API
    this.audioContext = null;
    
    // 诊断日志（只记录关键事件）
    this._diagLogs = [];
    
    this._log('AUDIO: Constructor');
  }
  
  // 只记录关键诊断信息
  _log(msg) {
    var entry = '[' + Date.now() + '] ' + msg;
    this._diagLogs.push(entry);
    console.log('[BGM-DIAG] ' + msg);
    
    // 限制日志数量
    if (this._diagLogs.length > 20) {
      this._diagLogs.shift();
    }
  }
  
  // 导出诊断日志
  exportLogs() {
    return this._diagLogs.join('\n');
  }

  init() {
    if (this.initialized) return;
    
    this._log('AUDIO: init() start');
    
    try {
      this.enabled = wx.getStorageSync('bomb_wall_sound_enabled') !== false;
      this.musicEnabled = wx.getStorageSync('bomb_wall_music_enabled') !== false;
      this.volume = wx.getStorageSync('bomb_wall_volume') || 1.0;
      
      this._log('AUDIO: settings loaded, music=' + this.musicEnabled);
      
      // 初始化 Web Audio
      if (typeof wx.createWebAudioContext === 'function') {
        this.audioContext = wx.createWebAudioContext();
        this._log('AUDIO: WebAudio ready');
      }
      
      this.initialized = true;
      this._log('AUDIO: init done');
    } catch (e) {
      this._log('AUDIO: init ERROR ' + e.message);
    }
  }

  loadBGM() {
    this._log('AUDIO: loadBGM()');
    
    if (this.bgm) {
      this._log('AUDIO: BGM exists, skip');
      return;
    }
    
    this._createBGM();
  }

  _createBGM() {
    this._log('AUDIO: createBGM()');
    
    try {
      this.bgm = wx.createInnerAudioContext();
      this._log('AUDIO: context created');
      
      // 先设置属性，再设置 src
      this.bgm.loop = true;
      this.bgm.volume = this.volume;
      this.bgm.src = this.bgmPath;
      
      this._log('AUDIO: src=' + this.bgmPath);
      
      // 关键事件监听
      this.bgm.onCanPlay(() => {
        this.bgmLoaded = true;
        this._log('AUDIO: onCanPlay, duration=' + this.bgm.duration);
      });
      
      this.bgm.onError((err) => {
        this._log('AUDIO: onError code=' + err.errCode + ' msg=' + (err.errMsg || 'unknown'));
      });
      
      this.bgm.onPlay(() => {
        this.bgmPlaying = true;
        this._log('AUDIO: onPlay');
      });
      
      this.bgm.onWaiting(() => {
        this._log('AUDIO: onWaiting');
      });
      
      this._log('AUDIO: BGM ready, wait for touch');
    } catch (e) {
      this._log('AUDIO: create ERROR ' + e.message);
    }
  }

  playBGM() {
    this._log('AUDIO: playBGM() called');
    
    if (!this.bgm) {
      this._log('AUDIO: no BGM, loading...');
      this.loadBGM();
      return;
    }
    
    if (!this.musicEnabled) {
      this._log('AUDIO: music disabled');
      return;
    }
    
    if (this.bgmPlaying) {
      this._log('AUDIO: already playing');
      return;
    }
    
    try {
      this.bgm.play();
      this._log('AUDIO: play() executed');
    } catch (e) {
      this._log('AUDIO: play ERROR ' + e.message);
    }
  }

  pauseBGM() {
    if (!this.bgm) return;
    this.bgm.pause();
    this.bgmPlaying = false;
    this._log('AUDIO: paused');
  }

  stopBGM() {
    if (!this.bgm) return;
    this.bgm.stop();
    this.bgmPlaying = false;
    this._log('AUDIO: stopped');
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
      // 忽略合成音效错误
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
