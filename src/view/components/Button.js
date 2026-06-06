/**
 * View/Components/Button.js
 * 自适应按钮组件
 * 支持文字按钮和图片按钮
 */

class Button {
  constructor(options) {
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.width = options.width || 200;
    this.height = options.height || 60;
    this.text = options.text || '';
    this.image = options.image || null; // 图片按钮
    this.style = options.style || 'primary'; // primary | secondary | danger
    this.fontSize = options.fontSize || 18;
    this.onClick = options.onClick || (() => {});
    this.enabled = options.enabled !== false;
    this.visible = options.visible !== false;
    
    // 动画状态
    this.scale = 1;
    this.targetScale = 1;
    this.isPressed = false;
    
    // 样式配置
    this.styles = {
      primary: { bg: '#E5C84B', text: '#1A1A2E', border: '#F0D85C' },
      secondary: { bg: '#2A2A3E', text: '#FFF', border: '#4A4A5A' },
      danger: { bg: '#FF6B35', text: '#FFF', border: '#FF8C5A' }
    };
  }

  /**
   * 绘制按钮
   */
  draw(ctx, pr = 2, s = 1) {
    if (!this.visible) return;
    
    const x = this.x;
    const y = this.y;
    const w = this.width * this.scale;
    const h = this.height * this.scale;
    const offsetX = (this.width - w) / 2;
    const offsetY = (this.height - h) / 2;
    
    ctx.save();
    
    if (this.image) {
      // 图片按钮
      ctx.globalAlpha = this.enabled ? 1 : 0.5;
      ctx.drawImage(this.image, x + offsetX, y + offsetY, w, h);
    } else {
      // 文字按钮
      const style = this.styles[this.style] || this.styles.primary;
      
      // 阴影
      if (this.isPressed) {
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(x + 2 * pr, y + 2 * pr, this.width, this.height);
      }
      
      // 背景
      ctx.fillStyle = this.enabled ? style.bg : '#555';
      ctx.beginPath();
      ctx.roundRect(x + offsetX, y + offsetY, w, h, [h / 4]);
      ctx.fill();
      
      // 边框
      ctx.strokeStyle = style.border;
      ctx.lineWidth = 2 * pr;
      ctx.stroke();
      
      // 文字
      ctx.fillStyle = this.enabled ? style.text : '#888';
      ctx.font = `bold ${this.fontSize * s * pr}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, x + this.width / 2, y + this.height / 2);
    }
    
    ctx.restore();
  }

  /**
   * 检查触摸点是否在按钮内
   */
  contains(x, y) {
    if (!this.visible || !this.enabled) return false;
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height;
  }

  /**
   * 按下动画
   */
  press() {
    this.isPressed = true;
    this.targetScale = 0.95;
  }

  /**
   * 释放
   */
  release() {
    this.isPressed = false;
    this.targetScale = 1;
    if (this.enabled) {
      this.onClick();
    }
  }

  /**
   * 更新动画
   */
  update(dt) {
    const speed = 15;
    this.scale += (this.targetScale - this.scale) * speed * dt;
  }

  /**
   * 设置位置（支持自适应重新计算）
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * 设置尺寸
   */
  setSize(width, height) {
    this.width = width;
    this.height = height;
  }
}

// 导出到全局
GameGlobal.Button = Button;
