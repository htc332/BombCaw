/**
 * Utils/Helpers.js
 * 通用工具函数
 */

const Helpers = {
  /**
   * 创建唯一ID
   */
  uuid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  },

  /**
   * 深拷贝对象
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (Array.isArray(obj)) return obj.map(item => this.deepClone(item));
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.deepClone(obj[key]);
      }
    }
    return cloned;
  },

  /**
   * 节流函数
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * 防抖函数
   */
  debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  /**
   * 格式化数字（千分位）
   */
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  /**
   * 线性插值
   */
  lerp(a, b, t) {
    return a + (b - a) * t;
  },

  /**
   * 限制数值范围
   */
  clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  },

  /**
   * 随机整数
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * 随机选择数组元素
   */
  randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  /**
   * 计算两点距离
   */
  distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  },

  /**
   * 获取微信窗口信息
   */
  getWindowInfo() {
    if (typeof wx !== 'undefined' && wx.getWindowInfo) {
      return wx.getWindowInfo();
    }
    return {
      windowWidth: 375,
      windowHeight: 667,
      pixelRatio: 2,
      safeArea: { top: 0, left: 0, right: 375, bottom: 667 }
    };
  },

  /**
   * 检查点在矩形内
   */
  pointInRect(x, y, rx, ry, rw, rh) {
    return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
  },

  /**
   * 计算棋盘布局
   */
  calcBoardLayout(canvasW, canvasH, safeArea, gridSize) {
    const pr = safeArea.pixelRatio || 2;
    const s = canvasW / (375 * pr); // 缩放基准
    
    const usableW = canvasW - safeArea.left * pr - (canvasW / pr - safeArea.right) * pr;
    const usableH = canvasH - safeArea.top * pr - (canvasH / pr - safeArea.bottom) * pr;
    
    const L = Constants.LAYOUT;
    const hudH = usableH * L.HUD_RATIO;
    const boardH = usableH * L.BOARD_RATIO;
    const bottomH = usableH * L.BOTTOM_RATIO;
    
    const boardAreaTop = safeArea.top * pr + hudH;
    const boardAreaH = boardH;
    const sideMargin = usableW * L.SIDE_MARGIN;
    const boardAreaW = usableW - sideMargin * 2;
    
    let cellSize = Math.floor(Math.min(boardAreaW, boardAreaH) / (gridSize * 1.05));
    let gap = Math.max(Constants.CELL.MIN_GAP, Math.floor(cellSize * Constants.CELL.GAP_RATIO));
    
    let boardSize = cellSize * gridSize + gap * (gridSize - 1);
    
    // 极端小屏处理
    if (boardSize > boardAreaW || boardSize > boardAreaH) {
      gap = Constants.CELL.MIN_GAP;
      cellSize = Math.floor(Math.min(
        (boardAreaW - gap * (gridSize - 1)) / gridSize,
        (boardAreaH - gap * (gridSize - 1)) / gridSize
      ));
      boardSize = cellSize * gridSize + gap * (gridSize - 1);
      
      while (boardSize > boardAreaW || boardSize > boardAreaH) {
        cellSize = Math.floor(cellSize * 0.9);
        gap = Math.max(Constants.CELL.MIN_GAP, Math.floor(cellSize * Constants.CELL.GAP_RATIO));
        boardSize = cellSize * gridSize + gap * (gridSize - 1);
      }
    }
    
    // cellSize 物理像素不得小于最小值
    const minCell = Math.ceil(Constants.CELL.MIN_SIZE_PX * pr);
    if (cellSize < minCell) {
      cellSize = minCell;
      gap = Math.max(Constants.CELL.MIN_GAP, Math.floor(cellSize * Constants.CELL.GAP_RATIO));
      boardSize = cellSize * gridSize + gap * (gridSize - 1);
    }
    
    const offsetX = safeArea.left * pr + sideMargin + (boardAreaW - boardSize) / 2;
    const offsetY = boardAreaTop + (boardAreaH - boardSize) / 2;
    
    return {
      cellSize,
      gap,
      boardSize,
      offsetX,
      offsetY,
      hudH,
      bottomH
    };
  }
};

// 导出到全局
GameGlobal.Helpers = Helpers;
