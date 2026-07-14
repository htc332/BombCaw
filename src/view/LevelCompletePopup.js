/**
 * View/LevelCompletePopup.js
 * 通关弹窗组件 - v0.9.9
 * Q萌系设计版（与失败弹窗风格统一）
 * 
 * 配色规范：
 * - 背景：奶油白 #FFFDF5 → #FFF8E7
 * - 边框：薄荷绿 #7EC8A0
 * - 文字：深棕 #5C4033
 * - 强调：糖果黄 #FFD700 / 糖果粉 #FFB6C1
 * - 按钮：糖果绿 #90EE90 → #7EC8A0
 */

class LevelCompletePopup {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.isShowing = false;
    this.showProgress = 0;
    this.showDuration = 0.5;
    this.showTimer = 0;
    
    this.data = {
      level: 1,
      score: 0,
      bombsPlaced: 0,
      wallsDestroyed: 0,
      nextLevel: 2
    };
    
    this.onNextLevel = null;
    this.autoTransitionTimer = 3;
    this.buttonArea = null;
    this.animTime = 0;
    
    // 装饰星星
    this.stars = [];
    this.initStars();
  }
  
  initStars() {
    this.stars = [
      { x: -0.35, y: -0.40, size: 0.025, phase: 0, speed: 2.5 },
      { x: 0.35, y: -0.40, size: 0.025, phase: 1.2, speed: 3.0 },
      { x: -0.40, y: 0.30, size: 0.02, phase: 0.5, speed: 2.8 },
      { x: 0.40, y: 0.30, size: 0.02, phase: 2.0, speed: 3.2 },
      { x: 0, y: -0.45, size: 0.02, phase: 0.3, speed: 3.8 },
    ];
  }
  
  show(data) {
    this.data = { ...this.data, ...data };
    this.isShowing = true;
    this.showProgress = 0;
    this.showTimer = 0;
    this.autoTransitionTimer = 3;
  }
  
  hide() {
    this.isShowing = false;
    this.showProgress = 0;
    this.autoTransitionTimer = 3;
  }
  
  update(dt) {
    if (!this.isShowing) return;
    this.animTime += dt;
    
    if (this.showProgress < 1) {
      this.showTimer += dt;
      const t = Math.min(this.showTimer / this.showDuration, 1);
      this.showProgress = this.easeOutBack(t);
    }
    
    if (this.autoTransitionTimer > 0) {
      this.autoTransitionTimer -= dt;
      if (this.autoTransitionTimer <= 0) {
        this.onNextLevel && this.onNextLevel();
      }
    }
  }
  
  easeOutBack(t) {
    const c1 = 1.70158, c3 = c1 + 1;
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
    
    // 与失败弹窗统一尺寸
    const panelW = w * 0.70;
    const panelH = panelW * 1.15;
    
    const panelX = (w - panelW) / 2;
    const panelY = safeTop + (usableH - panelH) / 2;
    
    // 区域划分
    const titleY = panelY + panelH * 0.04;
    const starY = panelY + panelH * 0.12;
    const starH = panelH * 0.10;
    const dataY = panelY + panelH * 0.26;
    const dataH = panelH * 0.42;
    const btnY = panelY + panelH * 0.74;
    
    const btnW = panelW * 0.65;
    const btnH = Math.max(panelH * 0.10, 40 * pr);
    const btnX = (w - btnW) / 2;
    
    this.buttonArea = { x: btnX, y: btnY, width: btnW, height: btnH };
    
    return { pr, s, w, h, panelX, panelY, panelW, panelH, titleY, starY, starH, dataY, dataH, btnX, btnY, btnW, btnH };
  }
  
  draw() {
    if (!this.isShowing || this.showProgress <= 0) return;
    
    const ctx = this.ctx;
    const layout = this.calcLayout();
    const p = this.showProgress;
    
    // 背景遮罩
    ctx.fillStyle = `rgba(0, 0, 0, ${0.6 * p})`;
    ctx.fillRect(0, 0, layout.w, layout.h);
    
    // 弹窗位置
    const cx = layout.panelX + layout.panelW / 2;
    const cy = layout.panelY + layout.panelH / 2;
    const scaledW = layout.panelW * p;
    const scaledH = layout.panelH * p;
    const scaledX = cx - scaledW / 2;
    const scaledY = cy - scaledH / 2;
    
    // 绘制弹窗面板（与失败弹窗统一）
    this.drawPanel(ctx, scaledX, scaledY, scaledW, scaledH, layout.pr);
    
    // 绘制标题
    this.drawTitle(ctx, scaledX, scaledY, scaledW, layout.titleY, layout.pr, layout.s);
    
    // 绘制装饰星星
    this.drawStars(ctx, scaledX, scaledY, scaledW, scaledH, layout.pr, p);
    
    // 绘制数据面板
    this.drawDataPanel(ctx, scaledX, scaledY, scaledW, layout.dataY, layout.dataH, layout.pr, layout.s);
    
    // 绘制按钮
    this.drawButton(ctx, scaledX, scaledY, scaledW, layout.btnX, layout.btnY, layout.btnW, layout.btnH, layout.pr, layout.s);
  }
  
  drawPanel(ctx, x, y, w, h, pr) {
    // 阴影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    this.roundRect(ctx, x + 4 * pr, y + 4 * pr, w, h, 24 * pr);
    ctx.fill();
    
    // 主背景：奶油粉白（粉红萌系）
    const bgGradient = ctx.createLinearGradient(x, y, x, y + h);
    bgGradient.addColorStop(0, '#FFF5F7');
    bgGradient.addColorStop(1, '#FFE4EC');
    ctx.fillStyle = bgGradient;
    this.roundRect(ctx, x, y, w, h, 24 * pr);
    ctx.fill();
    
    // 外边框：樱花粉
    ctx.strokeStyle = '#FFB6C1';
    ctx.lineWidth = 3 * pr;
    this.roundRect(ctx, x, y, w, h, 24 * pr);
    ctx.stroke();
    
    // 内边框（虚线装饰）
    ctx.strokeStyle = 'rgba(255, 182, 193, 0.4)';
    ctx.lineWidth = 1 * pr;
    ctx.setLineDash([6 * pr, 4 * pr]);
    this.roundRect(ctx, x + 8 * pr, y + 8 * pr, w - 16 * pr, h - 16 * pr, 16 * pr);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  
  drawTitle(ctx, px, py, pw, titleY, pr, s) {
    // 标题：深棕色
    ctx.fillStyle = '#5C4033';
    ctx.font = `bold ${22 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('关卡完成!', px + pw / 2, titleY);
    
    // 装饰线（樱花粉）
    const lineY = titleY + 28 * pr;
    ctx.strokeStyle = 'rgba(255, 182, 193, 0.5)';
    ctx.lineWidth = 1 * pr;
    ctx.beginPath();
    ctx.moveTo(px + pw * 0.2, lineY);
    ctx.lineTo(px + pw * 0.8, lineY);
    ctx.stroke();
  }
  
  drawStars(ctx, px, py, pw, ph, pr, progress) {
    const cx = px + pw / 2;
    const cy = py + ph * 0.18;
    const animTime = Date.now() / 1000;
    
    this.stars.forEach(star => {
      const x = cx + star.x * pw;
      const y = cy + star.y * ph;
      const size = star.size * pw * progress;
      
      const alpha = 0.5 + 0.5 * Math.sin(animTime * star.speed + star.phase);
      const scale = 0.8 + 0.2 * Math.sin(animTime * star.speed * 0.7 + star.phase);
      const drawSize = size * scale;
      
      ctx.globalAlpha = alpha * progress;
      this.drawStarShape(ctx, x, y, drawSize, '#FFD700');
      ctx.globalAlpha = 1.0;
    });
  }
  
  drawStarShape(ctx, cx, cy, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      const radius = i % 2 === 0 ? size : size * 0.4;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }
  
  drawDataPanel(ctx, px, py, pw, dataY, dataH, pr, s) {
    const marginX = pw * 0.08;
    const panelX = px + marginX;
    const panelW = pw - marginX * 2;
    const panelH = dataH;
    const panelY = dataY;
    
    // 数据面板背景（浅樱花粉）
    ctx.fillStyle = 'rgba(255, 182, 193, 0.15)';
    this.roundRect(ctx, panelX, panelY, panelW, panelH, 12 * pr);
    ctx.fill();
    
    // 面板边框
    ctx.strokeStyle = 'rgba(255, 182, 193, 0.4)';
    ctx.lineWidth = 1 * pr;
    this.roundRect(ctx, panelX, panelY, panelW, panelH, 12 * pr);
    ctx.stroke();
    
    // 三行信息
    const cx = panelX + panelW / 2;
    const lineHeight = panelH / 3.0;
    const startY = panelY + lineHeight * 0.5;
    
    const items = [
      { label: '最终积分', value: this.data.score },
      { label: '放置牛牛', value: this.data.bombsPlaced },
      { label: '消灭鼠鼠', value: this.data.wallsDestroyed },
    ];
    
    items.forEach((item, index) => {
      const y = startY + index * lineHeight;
      
      // 标签（深棕色小字）
      ctx.fillStyle = '#8B7355';
      ctx.font = `${12 * s * pr}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label, cx, y - 10 * pr);
      
      // 数值（深棕色大字）
      ctx.fillStyle = '#5C4033';
      ctx.font = `bold ${20 * s * pr}px sans-serif`;
      ctx.fillText(String(item.value), cx, y + 10 * pr);
    });
  }
  
  drawButton(ctx, px, py, pw, btnX, btnY, btnW, btnH, pr, s) {
    // 阴影
    ctx.fillStyle = 'rgba(255, 105, 180, 0.2)';
    this.roundRect(ctx, btnX + 2 * pr, btnY + 3 * pr, btnW, btnH, 12 * pr);
    ctx.fill();
    
    // 按钮背景：糖果粉渐变
    const btnGradient = ctx.createLinearGradient(btnX, btnY, btnX, btnY + btnH);
    btnGradient.addColorStop(0, '#FFB6C1');
    btnGradient.addColorStop(0.5, '#FF69B4');
    btnGradient.addColorStop(1, '#FF1493');
    
    ctx.fillStyle = btnGradient;
    this.roundRect(ctx, btnX, btnY, btnW, btnH, 12 * pr);
    ctx.fill();
    
    // 按钮边框
    ctx.strokeStyle = '#FF1493';
    ctx.lineWidth = 2 * pr;
    this.roundRect(ctx, btnX, btnY, btnW, btnH, 12 * pr);
    ctx.stroke();
    
    // 高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.moveTo(btnX + 8 * pr, btnY + 2 * pr);
    ctx.lineTo(btnX + btnW - 8 * pr, btnY + 2 * pr);
    ctx.lineTo(btnX + btnW - 12 * pr, btnY + btnH * 0.35);
    ctx.lineTo(btnX + 12 * pr, btnY + btnH * 0.35);
    ctx.closePath();
    ctx.fill();
    
    // 按钮文字
    const btnCX = btnX + btnW / 2;
    const btnCY = btnY + btnH / 2;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${15 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('开始下一关', btnCX, btnCY);
    
    // 倒计时提示
    if (this.autoTransitionTimer > 0) {
      ctx.fillStyle = '#8B7355';
      ctx.font = `${10 * s * pr}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`${Math.ceil(this.autoTransitionTimer)}秒后自动进入`, btnCX, btnY + btnH + 10 * pr);
    }
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
        this.onNextLevel && this.onNextLevel();
        return true;
      }
    }
    
    // 点击弹窗任意位置也进入下一关
    const layout = this.calcLayout();
    if (x >= layout.panelX && x <= layout.panelX + layout.panelW && 
        y >= layout.panelY && y <= layout.panelY + layout.panelH) {
      this.onNextLevel && this.onNextLevel();
      return true;
    }
    
    return false;
  }
}

GameGlobal.LevelCompletePopup = LevelCompletePopup;
