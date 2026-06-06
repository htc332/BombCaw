/**
 * App/SceneManager.js
 * 场景管理器
 * 管理场景生命周期和切换
 */

class SceneManager {
  constructor() {
    this.scenes = {};
    this.currentScene = null;
    this.previousScene = null;
    this.canvas = null;
    
    // 场景栈（支持返回）
    this.sceneStack = [];
  }

  /**
   * 注册场景
   */
  register(name, sceneClass) {
    this.scenes[name] = sceneClass;
    // 生产环境关闭场景注册日志
    // console.log(`[SceneManager] Registered scene: ${name}`);
  }

  /**
   * 初始化场景管理器
   */
  init(canvas) {
    this.canvas = canvas;
  }

  /**
   * 切换到场景
   */
  switchTo(sceneName, data = null, options = {}) {
    const SceneClass = this.scenes[sceneName];
    if (!SceneClass) {
      // 保留错误日志，但生产环境可关闭
      // console.error(`[SceneManager] Scene not found: ${sceneName}`);
      return Promise.reject(new Error(`Scene not found: ${sceneName}`));
    }

    // 保存当前场景到栈
    if (this.currentScene && options.pushStack !== false) {
      this.sceneStack.push(this.currentScene.name);
    }

    // 退出当前场景
    if (this.currentScene) {
      this.currentScene.exit();
      this.previousScene = this.currentScene;
    }

    // 创建或获取场景实例
    let scene = SceneClass._instance;
    if (!scene) {
      scene = new SceneClass(sceneName);
      scene.init(this.canvas);
      SceneClass._instance = scene;
    }

    this.currentScene = scene;

    // 加载资源并进入
    return scene.load().then(() => {
      scene.enter(data);
      // 生产环境关闭场景切换日志
      // console.log(`[SceneManager] Switched to: ${sceneName}`);
      return scene;
    });
  }

  /**
   * 返回上一个场景
   */
  back(data = null) {
    if (this.sceneStack.length > 0) {
      const prevSceneName = this.sceneStack.pop();
      return this.switchTo(prevSceneName, data, { pushStack: false });
    }
    return Promise.reject(new Error('No previous scene'));
  }

  /**
   * 更新当前场景
   */
  update(dt) {
    if (this.currentScene) {
      this.currentScene.update(dt);
    }
  }

  /**
   * 渲染当前场景
   */
  render() {
    if (this.currentScene) {
      this.currentScene.render();
    }
  }

  /**
   * 处理触摸事件
   */
  handleTouch(x, y) {
    if (this.currentScene) {
      return this.currentScene.handleTouch(x, y);
    }
    return false;
  }

  /**
   * 获取当前场景
   */
  getCurrentScene() {
    return this.currentScene;
  }

  /**
   * 获取上一个场景
   */
  getPreviousScene() {
    return this.previousScene;
  }

  /**
   * 暂停当前场景
   */
  pause() {
    if (this.currentScene) {
      this.currentScene.pause();
    }
  }

  /**
   * 恢复当前场景
   */
  resume() {
    if (this.currentScene) {
      this.currentScene.resume();
    }
  }

  /**
   * 销毁所有场景
   */
  destroyAll() {
    for (const [name, SceneClass] of Object.entries(this.scenes)) {
      if (SceneClass._instance) {
        SceneClass._instance.destroy();
        SceneClass._instance = null;
      }
    }
    this.currentScene = null;
    this.previousScene = null;
    this.sceneStack = [];
  }
}

// 单例
let instance = null;
SceneManager.getInstance = function() {
  if (!instance) {
    instance = new SceneManager();
  }
  return instance;
};

// 导出到全局
GameGlobal.SceneManager = SceneManager;
GameGlobal.sceneManager = SceneManager.getInstance();
