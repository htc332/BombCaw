/**
 * Utils/EventBus.js
 * 事件总线 - 发布订阅模式
 * 用于模块间解耦通信
 */

class EventBus {
  constructor() {
    this.events = {};
    this.onceEvents = {};
  }

  /**
   * 订阅事件
   * @param {string} event 事件名
   * @param {function} callback 回调函数
   * @param {object} context this上下文
   */
  on(event, callback, context = null) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push({ callback, context });
  }

  /**
   * 订阅事件（只触发一次）
   */
  once(event, callback, context = null) {
    if (!this.onceEvents[event]) {
      this.onceEvents[event] = [];
    }
    this.onceEvents[event].push({ callback, context });
  }

  /**
   * 取消订阅
   */
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(
        listener => listener.callback !== callback
      );
    }
    if (this.onceEvents[event]) {
      this.onceEvents[event] = this.onceEvents[event].filter(
        listener => listener.callback !== callback
      );
    }
  }

  /**
   * 触发事件
   */
  emit(event, data = null) {
    // 触发普通事件
    if (this.events[event]) {
      this.events[event].forEach(listener => {
        try {
          if (listener.context) {
            listener.callback.call(listener.context, data);
          } else {
            listener.callback(data);
          }
        } catch (e) {
          console.error(`[EventBus] Error in event ${event}:`, e);
        }
      });
    }

    // 触发一次性事件
    if (this.onceEvents[event]) {
      this.onceEvents[event].forEach(listener => {
        try {
          if (listener.context) {
            listener.callback.call(listener.context, data);
          } else {
            listener.callback(data);
          }
        } catch (e) {
          console.error(`[EventBus] Error in once event ${event}:`, e);
        }
      });
      delete this.onceEvents[event];
    }
  }

  /**
   * 检查是否有监听器
   */
  hasListeners(event) {
    return (this.events[event] && this.events[event].length > 0) ||
           (this.onceEvents[event] && this.onceEvents[event].length > 0);
  }

  /**
   * 清除所有事件
   */
  clear() {
    this.events = {};
    this.onceEvents = {};
  }
}

// 单例模式
let instance = null;
EventBus.getInstance = function() {
  if (!instance) {
    instance = new EventBus();
  }
  return instance;
};

// 导出到全局
GameGlobal.EventBus = EventBus;
GameGlobal.eventBus = EventBus.getInstance();
