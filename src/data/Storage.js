/**
 * Data/Storage.js
 * 本地存档管理
 */

class Storage {
  constructor() {
    this.prefix = 'bomb_wall_';
  }

  // ========== 基础操作 ==========

  get(key, defaultValue = null) {
    try {
      const data = wx.getStorageSync(this.prefix + key);
      return data !== undefined ? data : defaultValue;
    } catch (e) {
      console.error('Storage get error:', e);
      return defaultValue;
    }
  }

  set(key, value) {
    try {
      wx.setStorageSync(this.prefix + key, value);
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  }

  remove(key) {
    try {
      wx.removeStorageSync(this.prefix + key);
      return true;
    } catch (e) {
      console.error('Storage remove error:', e);
      return false;
    }
  }

  clear() {
    try {
      wx.clearStorageSync();
      return true;
    } catch (e) {
      console.error('Storage clear error:', e);
      return false;
    }
  }

  // ========== 游戏数据 ==========

  getPlayerData() {
    return {
      totalScore: this.get('total_score', 0),
      unlockedLevels: this.get('unlocked_levels', [1]),
      currentLevel: this.get('current_level', 1),
      soundEnabled: this.get('sound_enabled', true),
      musicEnabled: this.get('music_enabled', true),
      vibrateEnabled: this.get('vibrate_enabled', true)
    };
  }

  savePlayerData(data) {
    if (data.totalScore !== undefined) this.set('total_score', data.totalScore);
    if (data.unlockedLevels !== undefined) this.set('unlocked_levels', data.unlockedLevels);
    if (data.currentLevel !== undefined) this.set('current_level', data.currentLevel);
    if (data.soundEnabled !== undefined) this.set('sound_enabled', data.soundEnabled);
    if (data.musicEnabled !== undefined) this.set('music_enabled', data.musicEnabled);
    if (data.vibrateEnabled !== undefined) this.set('vibrate_enabled', data.vibrateEnabled);
  }

  // ========== 设置 ==========

  getSettings() {
    return {
      sound: this.get('setting_sound', true),
      music: this.get('setting_music', true),
      vibrate: this.get('setting_vibrate', true)
    };
  }

  saveSettings(settings) {
    if (settings.sound !== undefined) this.set('setting_sound', settings.sound);
    if (settings.music !== undefined) this.set('setting_music', settings.music);
    if (settings.vibrate !== undefined) this.set('setting_vibrate', settings.vibrate);
  }
}

// 导出到微信小游戏全局
GameGlobal.Storage = Storage;
