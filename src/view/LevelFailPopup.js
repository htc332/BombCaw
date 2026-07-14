/**
 * View/LevelFailPopup.js
 * 失败弹窗组件 - v0.9.4
 * 使用图片背景板，文字叠加在图片上
 */

class LevelFailPopup {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // 动画状态
    this.isShowing = false;
    this.showProgress = 0;
    this.showDuration = 0.4;
    this.showTimer = 0;
    
    // 背景图片
    this.bgImage = null;
    this.loadBgImage();
    
    // 弹窗数据
    this.data = {
      level: 1,
      score: 0,
      failCount: 0,
      adReward: 10
    };
    
    // 回调
    this.onWatchAd = null;
    this.onWaitRestart = null;
    
    // 倒计时
    this.autoTransitionTimer = 10;
    
    // 按钮区域
    this.buttonArea = null;
  }
  
  loadBgImage() {
    const img = wx.createImage ? wx.createImage() : new Image();
    img.onload = () => {
      this.bgImage = img;
      console.log('[LevelFailPopup] Background image loaded, size:', img.width, 'x', img.height);
    };
    img.onerror = (err) => {
      console.error('[LevelFailPopup] Failed to load background image:', err);
      // 尝试备用路径
      console.log('[LevelFailPopup] Trying fallback path...');
      const fallbackImg = wx.createImage ? wx.createImage() : new Image();
      fallbackImg.onload = () => {
        this.bgImage = fallbackImg;
        console.log('[LevelFailPopup] Fallback image loaded');
      };
      fallbackImg.src = 'res/ui/fail_panel.png';
    };
    console.log('[LevelFailPopup] Loading background from: subpackage/ui/fail_panel.png');
    img.src = 'subpackage/ui/fail_panel.png';
  }
  
  show(data) {
    this.data = { ...this.data, ...data };
    this.isShowing = true;
    this.showProgress = 0;
    this.showTimer = 0;
    this.autoTransitionTimer = 10;
  }
  
  hide() {
    this.isShowing = false;
    this.showProgress = 0;
    this.autoTransitionTimer = 10;
  }
  
  update(dt) {
    if (!this.isShowing) return;
    
    if (this.showProgress < 1) {
      this.showTimer += dt;
      const t = Math.min(this.showTimer / this.showDuration, 1);
      this.showProgress = this.easeOutBack(t);
    }
    
    if (this.autoTransitionTimer > 0) {
      this.autoTransitionTimer -= dt;
      if (this.autoTransitionTimer <= 0) {
        this.onWaitRestart && this.onWaitRestart();
      }
    }
  }
  
  easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
  
  calcLayout() {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : {
      windowWidth: 375, windowHeight: 667, pixelRatio: 2, safeArea: { top: 20, bottom: 647 }
    };
    
    const pr = info.pixelRatio || 2;
    const s = info.windowWidth / 375;
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    const safeTop = (info.safeArea?.top || 0) * pr;
    const safeBottom = (info.windowHeight - (info.safeArea?.bottom || info.windowHeight)) * pr;
    const usableH = h - safeTop - safeBottom;
    
    // [v0.9.3-fix] 根据图片实际比例计算弹窗尺寸
    let imgRatio = 1.45; // 默认比例
    if (this.bgImage && this.bgImage.width > 0 && this.bgImage.height > 0) {
      imgRatio = this.bgImage.height / this.bgImage.width;
    }
    
    // [v0.9.4-fix] 根据原图实际尺寸(400x322)合理放大，避免过度拉伸模糊
    // 原图400px宽，在2倍屏上基础显示为800逻辑像素，最大放大到原图2倍(800px)
    const BASE_IMG_WIDTH = 400; // 原图实际像素
    const maxPanelW = Math.min(w * 0.9, BASE_IMG_WIDTH * 2 * pr); // 最大放大2倍
    const panelW = maxPanelW;
    const panelH = panelW * imgRatio; // 保持图片比例
    
    const panelX = (w - panelW) / 2;
    const panelY = safeTop + (usableH - panelH) / 2;
    
    // 内容框区域随面板比例
    const contentW = panelW * 0.76; // 按面板比例
    const contentH = panelH * 0.38;
    const contentX = panelX + (panelW - contentW) / 2;
    const contentY = panelY + panelH * 0.28;
    
    // 按钮区域
    const btnW = panelW * 0.70;
    const btnH = Math.max(panelH * 0.10, 40 * pr);
    const btnX = (w - btnW) / 2;
    const btnY = panelY + panelH * 0.80;
    
    this.buttonArea = { x: btnX, y: btnY, width: btnW, height: btnH };
    
    return { pr, s, w, h, panelX, panelY, panelW, panelH, contentX, contentY, contentW, contentH, btnX, btnY, btnW, btnH };
  }
  
  draw() {
    if (!this.isShowing || this.showProgress <= 0) return;
    
    const ctx = this.ctx;
    const layout = this.calcLayout();
    const p = this.showProgress;
    
    // 1. 半透明黑色背景
    ctx.fillStyle = `rgba(0, 0, 0, ${0.75 * p})`;
    ctx.fillRect(0, 0, layout.w, layout.h);
    
    // 2. 计算缩放后的弹窗位置
    const cx = layout.panelX + layout.panelW / 2;
    const cy = layout.panelY + layout.panelH / 2;
    
    const scaledW = layout.panelW * p;
    const scaledH = layout.panelH * p;
    const scaledX = cx - scaledW / 2;
    const scaledY = cy - scaledH / 2;
    
    // 3. 绘制背景图片（如果已加载）
    if (this.bgImage && this.bgImage.width > 0) {
      ctx.drawImage(this.bgImage, scaledX, scaledY, scaledW, scaledH);
    } else {
      // 图片未加载时的回退：绘制简单背景
      ctx.fillStyle = '#8FBC8F';
      this.roundRect(ctx, scaledX, scaledY, scaledW, scaledH, 20 * layout.pr);
      ctx.fill();
      
      // [debug] 标记回退模式
      ctx.fillStyle = '#FF0000';
      ctx.font = `bold ${20 * layout.pr}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('NO IMAGE', cx, cy);
      
      // 尝试重新加载图片
      if (!this.bgImage) {
        this.loadBgImage();
      }
    }
    
    // 4. 在内容框区域绘制文字
    this.drawContentText(ctx, layout);
    
    // 5. 在底部按钮区域绘制文字
    this.drawButtonText(ctx, layout);
    
    // 6. 绘制倒计时提示（下移避免被截断）
    if (this.autoTransitionTimer > 0) {
      ctx.fillStyle = '#8FBC8F';
      ctx.font = `${12 * layout.s * layout.pr}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(
        `${Math.ceil(this.autoTransitionTimer)}秒后回到第1关`,
        layout.btnX + layout.btnW / 2,
        layout.btnY + layout.btnH + 16 * layout.pr
      );
    }
  }
  
  drawContentText(ctx, layout) {
    const { contentX, contentY, contentW, contentH, pr, s } = layout;
    const cx = contentX + contentW / 2;
    
    const items = [
      { label: '当前关卡', value: this.data.level },
      { label: '剩余积分', value: this.data.score },
      { label: '失败次数', value: this.data.failCount },
    ];
    
    // [v0.9.5-fix] 增大行高避免文字与数字重叠
    const lineHeight = contentH / 3.2;
    const startY = contentY + lineHeight * 0.5;
    
    items.forEach((item, index) => {
      const y = startY + index * lineHeight;
      
      // 标签
      ctx.fillStyle = '#2F4F2F';
      ctx.font = `bold ${13 * s * pr}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label, cx, y - 10 * pr);
      
      // 数值（大字体）
      ctx.fillStyle = '#556B2F';
      ctx.font = `bold ${24 * s * pr}px sans-serif`;
      ctx.fillText(String(item.value), cx, y + 14 * pr);
    });
  }
  
  drawButtonText(ctx, layout) {
    const { btnX, btnY, btnW, btnH, pr, s } = layout;
    
    // 按钮文字
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${16 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 文字描边
    ctx.strokeStyle = '#2F4F2F';
    ctx.lineWidth = 3 * pr;
    ctx.lineJoin = 'round';
    ctx.strokeText(
      `观看广告 +${this.data.adReward}积分`,
      btnX + btnW / 2,
      btnY + btnH / 2
    );
    ctx.fillText(
      `观看广告 +${this.data.adReward}积分`,
      btnX + btnW / 2,
      btnY + btnH / 2
    );
  }
  
  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
  
  onTouch(x, y) {
    if (!this.isShowing || this.showProgress < 1) return false;
    
    if (this.buttonArea) {
      const btn = this.buttonArea;
      if (x >= btn.x && x <= btn.x + btn.width && y >= btn.y && y <= btn.y + btn.height) {
        this.onWatchAd && this.onWatchAd();
        return true;
      }
    }
    
    return false;
  }
}

GameGlobal.LevelFailPopup = LevelFailPopup;
