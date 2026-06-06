/**
 * App/Scenes/BaseScene.js
 * 场景基类
 * 所有场景继承此类
 */

class BaseScene {
  constructor(name) {
    this.name = name;
    this.isActive = false;
    this.isPaused = false;
    this.resources = [];
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    
    // 绑定事件
    this.bindEvents();
  }
  
  /**
   * 初始化场景
   */
  init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    
    this.onInit();
  }
  
  /**
   * 加载资源
   */
  load() {
    const resMgr = ResourceManager.getInstance();
    return resMgr.preloadForScene(this.name);
  }
  
  /**
   * 进入场景
   */
  enter(data = null) {
    this.isActive = true;
    this.isPaused = false;
    this.onEnter(data);
    
    eventBus.emit(Constants.EVENTS.SCENE_CHANGE, {
      from: SceneManager.getInstance().previousScene?.name,
      to: this.name,
      data
    });
  }
  
  /**
   * 退出场景
   */
  exit() {
    this.isActive = false;
    this.onExit();
  }
  
  /**
   * 暂停场景
   */
  pause() {
    this.isPaused = true;
    this.onPause();
  }
  
  /**
   * 恢复场景
   */
  resume() {
    this.isPaused = false;
    this.onResume();
  }
  
  /**
   * 更新（每帧调用）
   */
  update(dt) {
    if (!this.isActive || this.isPaused) return;
    this.onUpdate(dt);
  }
  
  /**
   * 渲染（每帧调用）
   */
  render() {
    if (!this.isActive) return;
    this.onRender();
  }
  
  /**
   * 触摸事件处理
   */
  handleTouch(x, y) {
    if (!this.isActive || this.isPaused) return false;
    return this.onTouch(x, y);
  }
  
  // ========== 子类需重写的方法 ==========
  
  onInit() {}
  onEnter(data) {}
  onExit() {}
  onPause() {}
  onResume() {}
  onUpdate(dt) {}
  onRender() {}
  onTouch(x, y) { return false; }
  
  // ========== 事件绑定 ==========
  
  bindEvents() {
    // 子类可重写，绑定特定事件
  }
  
  // ========== 工具方法 ==========
  
  /**
   * 获取窗口信息
   */
  getWindowInfo() {
    return Helpers.getWindowInfo();
  }
  
  /**
   * 清除画布
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  
  /**
   * 绘制背景
   */
  drawBackground(color = '#1A1A2E') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
  
  /**
   * 销毁场景
   */
  destroy() {
    this.exit();
    this.onDestroy();
    
    // 释放资源
    this.resources = [];
  }
  
  onDestroy() {}
}

// 导出到全局
GameGlobal.BaseScene = BaseScene;
