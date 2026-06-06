/**
 * Utils/StateMachine.js
 * 状态机基类
 * 管理对象状态转换
 */

class StateMachine {
  constructor(initialState = 'idle') {
    this.state = initialState;
    this.previousState = null;
    this.states = {};
    this.transitions = {};
    this.globalTransitions = [];
  }

  /**
   * 注册状态
   * @param {string} name 状态名
   * @param {object} handlers { onEnter, onUpdate, onExit }
   */
  registerState(name, handlers) {
    this.states[name] = {
      onEnter: handlers.onEnter || (() => {}),
      onUpdate: handlers.onUpdate || (() => {}),
      onExit: handlers.onExit || (() => {})
    };
  }

  /**
   * 注册状态转换
   * @param {string} from 起始状态
   * @param {string} to 目标状态
   * @param {function} condition 转换条件（可选）
   * @param {function} onTransition 转换时回调（可选）
   */
  registerTransition(from, to, condition = null, onTransition = null) {
    if (!this.transitions[from]) {
      this.transitions[from] = [];
    }
    this.transitions[from].push({ to, condition, onTransition });
  }

  /**
   * 注册全局转换（从任意状态）
   */
  registerGlobalTransition(to, condition, onTransition) {
    this.globalTransitions.push({ to, condition, onTransition });
  }

  /**
   * 切换状态
   */
  changeState(newState, data = null) {
    if (newState === this.state) return false;
    if (!this.states[newState]) {
      console.error(`[StateMachine] State ${newState} not registered`);
      return false;
    }

    // 退出当前状态
    if (this.states[this.state]) {
      this.states[this.state].onExit(newState, data);
    }

    this.previousState = this.state;
    this.state = newState;

    // 进入新状态
    this.states[newState].onEnter(this.previousState, data);

    return true;
  }

  /**
   * 尝试自动转换（检查条件）
   */
  update(dt) {
    // 更新当前状态
    if (this.states[this.state]) {
      this.states[this.state].onUpdate(dt);
    }

    // 检查全局转换
    for (const trans of this.globalTransitions) {
      if (trans.condition && trans.condition(this.state)) {
        if (trans.onTransition) trans.onTransition(this.state, trans.to);
        this.changeState(trans.to);
        return;
      }
    }

    // 检查状态特定转换
    const stateTransitions = this.transitions[this.state];
    if (stateTransitions) {
      for (const trans of stateTransitions) {
        if (trans.condition && trans.condition(this.state)) {
          if (trans.onTransition) trans.onTransition(this.state, trans.to);
          this.changeState(trans.to);
          return;
        }
      }
    }
  }

  /**
   * 获取当前状态
   */
  getState() {
    return this.state;
  }

  /**
   * 获取上一个状态
   */
  getPreviousState() {
    return this.previousState;
  }

  /**
   * 检查是否在某个状态
   */
  isInState(state) {
    return this.state === state;
  }

  /**
   * 是否可以转换到目标状态
   */
  canTransitionTo(targetState) {
    const stateTrans = this.transitions[this.state] || [];
    const globalTrans = this.globalTransitions || [];
    return stateTrans.some(t => t.to === targetState) ||
           globalTrans.some(t => t.to === targetState);
  }
}

// 导出到全局
GameGlobal.StateMachine = StateMachine;
