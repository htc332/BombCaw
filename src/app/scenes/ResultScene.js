/**
 * App/Scenes/ResultScene.js
 * 结算场景
 * 通关/失败后的结果展示
 */

class ResultScene extends BaseScene {
  constructor() {
    super('result');
    this.result = {
      isVictory: true,
      level: 1,
      score: 0,
      stars: 0,
      bonus: 0,
      nextLevel: 2
    };
    this.buttons = [];
    this.autoTransitionTimer = null;
  }

  onInit() {
    this.calcLayout();
  }

  calcLayout() {
    const info = this.getWindowInfo();
    const pr = info.pixelRatio || 2;
    const s = info.windowWidth / 375;
    
    this.pr = pr;
    this.s = s;
    
    const safeTop = (info.safeArea?.top || 0) * pr;
    const safeBottom = (info.windowHeight - (info.safeArea?.bottom || info.windowHeight)) * pr;
    const usableH = this.height - safeTop - safeBottom;
    const usableW = this.width * (1 - Constants.LAYOUT.SIDE_MARGIN * 2);
    
    this.panelW = Math.min(usableW, 350 * s * pr);
    this.panelH = usableH * 0.7;
    this.panelX = (this.width - this.panelW) / 2;
    this.panelY = safeTop + usableH * 0.1;
    
    this.btnWidth = this.panelW * 0.8;
    this.btnHeight = 50 * s * pr;
    this.btnGap = 15 * s * pr;
  }

  onEnter(data) {
    this.calcLayout();
    
    this.result = {
      isVictory: data?.isVictory !== false,
      level: data?.level || 1,
      score: data?.score || 0,
      stars: data?.stars || 0,
      bonus: data?.bonus || 0,
      nextLevel: data?.nextLevel || (data?.level || 1) + 1
    };
    
    this.createButtons();
    
    if (this.result.isVictory) {
      this.autoTransitionTimer = 3;
    }
    
    // 生产环境关闭结果场景日志
    // console.log(`[Result] ${this.result.isVictory ? 'Victory' : 'Failed'} - Level ${this.result.level}`);
  }

  onExit() {
    this.autoTransitionTimer = null;
  }

  createButtons() {
    const btnY = this.panelY + this.panelH - 120 * this.pr;
    
    if (this.result.isVictory) {
      this.buttons = [
        new Button({
          x: (this.width - this.btnWidth) / 2,
          y: btnY,
          width: this.btnWidth,
          height: this.btnHeight,
          text: '下一关',
          style: 'primary',
          fontSize: 18,
          onClick: () => this.nextLevel()
        }),
        new Button({
          x: (this.width - this.btnWidth) / 2,
          y: btnY + this.btnHeight + this.btnGap,
          width: this.btnWidth,
          height: this.btnHeight,
          text: '主菜单',
          style: 'secondary',
          fontSize: 16,
          onClick: () => this.toMainMenu()
        })
      ];
    } else {
      this.buttons = [
        new Button({
          x: (this.width - this.btnWidth) / 2,
          y: btnY,
          width: this.btnWidth,
          height: this.btnHeight,
          text: '看广告复活',
          style: 'primary',
          fontSize: 18,
          onClick: () => this.revive()
        }),
        new Button({
          x: (this.width - this.btnWidth) / 2,
          y: btnY + this.btnHeight + this.btnGap,
          width: this.btnWidth,
          height: this.btnHeight,
          text: '重新挑战',
          style: 'secondary',
          fontSize: 16,
          onClick: () => this.retry()
        }),
        new Button({
          x: (this.width - this.btnWidth) / 2,
          y: btnY + (this.btnHeight + this.btnGap) * 2,
          width: this.btnWidth,
          height: this.btnHeight,
          text: '主菜单',
          style: 'secondary',
          fontSize: 16,
          onClick: () => this.toMainMenu()
        })
      ];
    }
  }

  onUpdate(dt) {
    this.buttons.forEach(btn => btn.update(dt));
    
    if (this.autoTransitionTimer > 0) {
      this.autoTransitionTimer -= dt;
      if (this.autoTransitionTimer <= 0) {
        this.nextLevel();
      }
    }
  }

  onRender() {
    const ctx = this.ctx;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, this.width, this.height);
    
    this.drawPanel();
    
    if (this.result.isVictory) {
      this.drawVictoryContent();
    } else {
      this.drawFailContent();
    }
    
    this.buttons.forEach(btn => btn.draw(ctx, this.pr, this.s));
  }

  drawPanel() {
    const ctx = this.ctx;
    const pr = this.pr;
    
    ctx.fillStyle = '#1A1A2E';
    ctx.beginPath();
    ctx.roundRect(this.panelX, this.panelY, this.panelW, this.panelH, [16 * pr]);
    ctx.fill();
    
    ctx.strokeStyle = '#2A3A5E';
    ctx.lineWidth = 2 * pr;
    ctx.stroke();
    
    ctx.fillStyle = this.result.isVictory ? '#FFD700' : '#FF6B35';
    ctx.fillRect(this.panelX, this.panelY, this.panelW, 4 * pr);
  }

  drawVictoryContent() {
    const ctx = this.ctx;
    const pr = this.pr;
    const s = this.s;
    const cx = this.width / 2;
    const contentY = this.panelY + 60 * pr;
    
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${28 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('🎉 关卡完成!', cx, contentY);
    
    ctx.fillStyle = '#A0A8C0';
    ctx.font = `${16 * s * pr}px sans-serif`;
    ctx.fillText(`第 ${this.result.level} 关`, cx, contentY + 40 * pr);
    
    if (this.result.stars > 0) {
      ctx.fillStyle = '#FFD700';
      ctx.font = `${32 * s * pr}px sans-serif`;
      ctx.fillText('★'.repeat(this.result.stars), cx, contentY + 70 * pr);
    }
    
    const scoreY = contentY + 120 * pr;
    ctx.fillStyle = '#A0A8C0';
    ctx.font = `${14 * s * pr}px sans-serif`;
    ctx.fillText('得分', cx, scoreY);
    
    if (this.renderer?.drawNumber) {
      this.renderer.drawNumber(ctx, this.result.score, cx, scoreY + 35 * pr, 40 * s * pr, 'center');
    } else {
      ctx.fillStyle = '#FFF';
      ctx.font = `bold ${36 * s * pr}px sans-serif`;
      ctx.fillText(String(this.result.score), cx, scoreY + 35 * pr);
    }
    
    if (this.result.bonus > 0) {
      ctx.fillStyle = '#4CAF50';
      ctx.font = `${14 * s * pr}px sans-serif`;
      ctx.fillText(`+${this.result.bonus} 奖励`, cx, scoreY + 80 * pr);
    }
    
    if (this.autoTransitionTimer > 0) {
      ctx.fillStyle = '#A0A8C0';
      ctx.font = `${12 * s * pr}px sans-serif`;
      ctx.fillText(`${Math.ceil(this.autoTransitionTimer)}秒后自动进入下一关...`, cx, this.panelY + this.panelH - 30 * pr);
    }
  }

  drawFailContent() {
    const ctx = this.ctx;
    const pr = this.pr;
    const s = this.s;
    const cx = this.width / 2;
    const contentY = this.panelY + 60 * pr;
    
    ctx.fillStyle = '#FF6B35';
    ctx.font = `bold ${28 * s * pr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('💥 游戏结束', cx, contentY);
    
    ctx.fillStyle = '#A0A8C0';
    ctx.font = `${16 * s * pr}px sans-serif`;
    ctx.fillText(`第 ${this.result.level} 关`, cx, contentY + 40 * pr);
    
    const scoreY = contentY + 90 * pr;
    ctx.fillStyle = '#A0A8C0';
    ctx.font = `${14 * s * pr}px sans-serif`;
    ctx.fillText('得分', cx, scoreY);
    
    if (this.renderer?.drawNumber) {
      this.renderer.drawNumber(ctx, this.result.score, cx, scoreY + 35 * pr, 36 * s * pr, 'center');
    } else {
      ctx.fillStyle = '#FFF';
      ctx.font = `bold ${32 * s * pr}px sans-serif`;
      ctx.fillText(String(this.result.score), cx, scoreY + 35 * pr);
    }
    
    const adCount = PlayerData.getInstance().getTodayAdCount();
    const maxAds = Constants.AD.MAX_REVIVE_COUNT;
    
    ctx.fillStyle = '#A0A8C0';
    ctx.font = `${12 * s * pr}px sans-serif`;
    ctx.fillText(`今日已观看广告: ${adCount}/${maxAds}`, cx, contentY + 160 * pr);
  }

  onTouch(x, y) {
    for (const btn of this.buttons) {
      if (btn.contains(x, y)) {
        btn.press();
        btn.release();
        return true;
      }
    }
    return false;
  }

  nextLevel() {
    sceneManager.switchTo('game', { level: this.result.nextLevel });
  }

  retry() {
    sceneManager.switchTo('game', { level: this.result.level });
  }

  toMainMenu() {
    sceneManager.switchTo('main_menu');
  }

  revive() {
    const adCount = PlayerData.getInstance().getTodayAdCount();
    if (adCount >= Constants.AD.MAX_REVIVE_COUNT) {
      // 生产环境关闭广告日志
      // console.log('[Result] Max ad watches reached');
      return;
    }
    
    eventBus.emit(Constants.EVENTS.AD_SHOW, {
      type: 'revive',
      onComplete: () => {
        PlayerData.getInstance().recordAdWatch();
        const reviveBombs = Constants.AD.REVIVE_BOMBS[adCount] || 3;
        sceneManager.switchTo('game', {
          level: this.result.level,
          reviveBombs: reviveBombs
        });
      }
    });
  }
}

// 导出到全局
GameGlobal.ResultScene = ResultScene;
