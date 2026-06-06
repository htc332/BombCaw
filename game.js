/**
 * game.js
 * 微信小游戏入口
 * 关键：不创建任何 Canvas！
 */

console.log('[Game] Starting...');

if (typeof wx === 'undefined') {
  console.error('[Game] Not WeChat!');
  throw new Error('WeChat only');
}

// ========== Console 日志捕获 ==========
(function() {
  var logs = [];
  var maxLogs = 500;
  var origLog = console.log;
  var origError = console.error;
  var origWarn = console.warn;
  
  console.log = function() {
    var msg = '[LOG] ' + Array.prototype.slice.call(arguments).join(' ');
    logs.push(msg);
    if (logs.length > maxLogs) logs.shift();
    origLog.apply(console, arguments);
  };
  
  console.error = function() {
    var msg = '[ERROR] ' + Array.prototype.slice.call(arguments).join(' ');
    logs.push(msg);
    if (logs.length > maxLogs) logs.shift();
    origError.apply(console, arguments);
    saveLogs();
  };
  
  console.warn = function() {
    var msg = '[WARN] ' + Array.prototype.slice.call(arguments).join(' ');
    logs.push(msg);
    if (logs.length > maxLogs) logs.shift();
    origWarn.apply(console, arguments);
  };
  
  function saveLogs() {
    try {
      var fs = wx.getFileSystemManager();
      fs.writeFileSync(
        wx.env.USER_DATA_PATH + '/console.log',
        logs.join('\n'),
        'utf8'
      );
    } catch(e) {}
  }
  
  // 定期保存
  setInterval(saveLogs, 10000);
  
  // 导出接口
  GameGlobal.getConsoleLogs = function() {
    return logs.join('\n');
  };
  
  GameGlobal.saveConsoleLogs = saveLogs;
  
  console.log('[Capture] Console logger initialized');
})();
// ========== 日志捕获结束 ==========

try {
  console.log('[Game] Loading modules...');
  require('src/data/Storage.js');
  require('src/data/LevelData.js');
  require('src/data/EnemyConfig.js');
  require('src/core/GameLogic.js');
  require('src/core/LevelSystem.js');
  require('src/managers/ResourceManager.js');
  require('src/system/AudioManager.js');
  require('src/system/AdManager.js');
  require('src/view/Animator.js');
  require('src/view/ParticleSystem.js');
  require('src/view/Renderer.js');
  require('src/view/UIManager.js');
  require('src/main.js');
  console.log('[Game] All modules loaded');

  if (typeof initGame === 'function') {
    initGame();
    console.log('[Game] Started!');
  } else {
    throw new Error('initGame not found');
  }
} catch (e) {
  console.error('[Game] Fatal:', e);
}
