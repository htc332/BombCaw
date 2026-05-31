// 修复所有脚本类的 ccclass 名称，确保与场景文件中的 __type__ 完全匹配
// 问题：Cocos Creator 3.8.8 中，如果 @ccclass('Name') 与场景中的 __type__ 不匹配，
// 会导致 "Missing class" 错误，场景无法正确加载，表现为黑屏
// 修复方案：检查并统一所有脚本类名

// 当前已确认正确的类名映射：
// - MainMenu.ts → @ccclass('MainMenu') ✅
// - GameScene.ts → @ccclass('GameScene') ✅
// - GameLogic.ts → @ccclass('GameLogic') ✅
// - GridManager.ts → @ccclass('GridManager') ✅
// - UIManager.ts → @ccclass('UIManager') ✅
// - ScoreManager.ts → @ccclass('ScoreManager') ✅
// - LevelManager.ts → @ccclass('LevelManager') ✅
// - AnimationManager.ts → @ccclass('AnimationManager') ✅
// - AudioManager.ts → @ccclass('AudioManager') ✅
// - ParticleManager.ts → @ccclass('ParticleManager') ✅
// - SpriteAnimationHelper.ts → @ccclass('SpriteAnimationHelper') ✅
// - Bomb.ts → @ccclass('Bomb') ✅

// 所有 ccclass 名称都已正确设置，但问题可能出在：
// 1. 脚本编译失败导致类未注册
// 2. 场景文件中的 __type__ 与类名不匹配
// 3. 脚本文件路径变更但场景引用未更新

// 需要进一步检查：
// 1. 查看 Cocos Creator 控制台完整错误日志
// 2. 检查是否有 TypeScript 编译错误
// 3. 检查场景文件中的脚本组件引用路径是否正确

// 2026-05-31 修复记录：
// 问题已确认：temp/programming/preview/ 目录下缺少编译后的脚本文件
// 只有 system.js，没有编译后的 .ts 文件输出
// 解决方案：清除 temp/ 和 library/ 缓存，重启编辑器重新编译
// 执行：rm -rf temp/ library/
