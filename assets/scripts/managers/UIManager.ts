import { _decorator, Component, Node, Label, Sprite, Button, ProgressBar, Vec3, Color, UIOpacity } from 'cc';

const { ccclass, property } = _decorator;

/**
 * UIManager Component
 * UI 管理器 - 按 Cocos 引擎设计
 * 职责：所有 UI 面板的显示/隐藏/更新
 */
@ccclass('UIManager')
export class UIManager extends Component {
    
    // ========== 主面板引用 ==========
    
    @property(Node)
    mainMenuPanel: Node | null = null;      // 主菜单
    
    @property(Node)
    gamePanel: Node | null = null;          // 游戏主界面
    
    @property(Node)
    pausePanel: Node | null = null;         // 暂停面板
    
    @property(Node)
    resultPanel: Node | null = null;        // 结算面板
    
    @property(Node)
    settingsPanel: Node | null = null;      // 设置面板
    
    // ========== 游戏内 HUD ==========
    
    @property(Label)
    scoreLabel: Label | null = null;        // 分数显示
    
    @property(Label)
    levelLabel: Label | null = null;        // 关卡显示
    
    @property(Label)
    bombsLeftLabel: Label | null = null;     // 剩余炸弹
    
    @property(ProgressBar)
    progressBar: ProgressBar | null = null;  // 进度条
    
    @property(Label)
    comboLabel: Label | null = null;        // 连击显示
    
    // ========== 浮动文字容器 ==========
    
    @property(Node)
    floatTextContainer: Node | null = null;   // 浮动文字父节点
    
    // ========== 按钮引用 ==========
    
    @property(Button)
    btnPause: Button | null = null;
    
    @property(Button)
    btnResume: Button | null = null;
    
    @property(Button)
    btnRestart: Button | null = null;
    
    @property(Button)
    btnBackMenu: Button | null = null;
    
    // 当前显示的面板
    private currentPanel: Node | null = null;
    
    onLoad() {
        this.hideAllPanels();
        this.setupButtonListeners();
    }
    
    /**
     * 设置按钮监听
     */
    setupButtonListeners() {
        if (this.btnPause) {
            this.btnPause.node.on('click', this.onPauseClick, this);
        }
        if (this.btnResume) {
            this.btnResume.node.on('click', this.onResumeClick, this);
        }
        if (this.btnRestart) {
            this.btnRestart.node.on('click', this.onRestartClick, this);
        }
        if (this.btnBackMenu) {
            this.btnBackMenu.node.on('click', this.onBackMenuClick, this);
        }
    }
    
    // ========== 面板切换 ==========
    
    /**
     * 显示主菜单
     */
    showMainMenu() {
        this.switchPanel(this.mainMenuPanel);
    }
    
    /**
     * 显示游戏界面
     */
    showGame() {
        this.switchPanel(this.gamePanel);
        this.showHUD(true);
    }
    
    /**
     * 显示暂停面板
     */
    showPause() {
        if (this.pausePanel) {
            this.pausePanel.active = true;
            
            // 淡入动画
            const opacity = this.pausePanel.getComponent(UIOpacity) || this.pausePanel.addComponent(UIOpacity);
            opacity.opacity = 0;
            
            // TODO: 使用 tween 动画
            // tween(opacity).to(0.3, { opacity: 255 }).start();
        }
    }
    
    /**
     * 隐藏暂停面板
     */
    hidePause() {
        if (this.pausePanel) {
            this.pausePanel.active = false;
        }
    }
    
    /**
     * 显示结算面板
     */
    showResult(isWin: boolean, score: number, stars: number = 0) {
        this.switchPanel(this.resultPanel);
        
        // 更新结果信息
        const titleLabel = this.resultPanel?.getChildByName('Title')?.getComponent(Label);
        if (titleLabel) {
            titleLabel.string = isWin ? '胜利!' : '失败!';
        }
        
        const scoreLabel = this.resultPanel?.getChildByName('Score')?.getComponent(Label);
        if (scoreLabel) {
            scoreLabel.string = `得分: ${score}`;
        }
    }
    
    /**
     * 切换面板
     */
    private switchPanel(targetPanel: Node | null) {
        if (!targetPanel) return;
        
        // 隐藏当前面板
        if (this.currentPanel && this.currentPanel !== targetPanel) {
            this.currentPanel.active = false;
        }
        
        // 显示目标面板
        targetPanel.active = true;
        this.currentPanel = targetPanel;
    }
    
    /**
     * 隐藏所有面板
     */
    hideAllPanels() {
        [this.mainMenuPanel, this.gamePanel, this.pausePanel, 
         this.resultPanel, this.settingsPanel].forEach(panel => {
            if (panel) panel.active = false;
        });
    }
    
    // ========== HUD 更新 ==========
    
    /**
     * 显示/隐藏 HUD
     */
    showHUD(show: boolean) {
        // HUD 元素都在 gamePanel 下
        if (this.gamePanel) {
            const hud = this.gamePanel.getChildByName('HUD');
            if (hud) hud.active = show;
        }
    }
    
    /**
     * 更新分数
     */
    updateScore(score: number) {
        if (this.scoreLabel) {
            this.scoreLabel.string = score.toString();
        }
    }
    
    /**
     * 更新关卡
     */
    updateLevel(level: number) {
        if (this.levelLabel) {
            this.levelLabel.string = `关卡 ${level}`;
        }
    }
    
    /**
     * 更新剩余炸弹
     */
    updateBombsLeft(count: number) {
        if (this.bombsLeftLabel) {
            this.bombsLeftLabel.string = `炸弹: ${count}`;
        }
    }
    
    /**
     * 更新进度
     */
    updateProgress(progress: number) {
        if (this.progressBar) {
            this.progressBar.progress = progress;
        }
    }
    
    /**
     * 显示连击
     */
    showCombo(count: number) {
        if (this.comboLabel) {
            this.comboLabel.string = `${count} 连击!`;
            this.comboLabel.node.active = true;
            
            // 2秒后隐藏
            // TODO: 使用 scheduleOnce
            // this.scheduleOnce(() => {
            //     this.comboLabel.node.active = false;
            // }, 2);
        }
    }
    
    // ========== 浮动文字 ==========
    
    /**
     * 创建浮动文字
     */
    createFloatText(text: string, worldPos: Vec3, color: Color = Color.YELLOW) {
        if (!this.floatTextContainer) return;
        
        // TODO: 从对象池获取或创建
        const floatNode = new Node('FloatText');
        const label = floatNode.addComponent(Label);
        label.string = text;
        label.color = color;
        label.fontSize = 24;
        
        // 转换世界坐标到本地坐标
        const localPos = this.floatTextContainer.uiTransform?.convertToNodeSpaceAR(worldPos) || new Vec3();
        floatNode.setPosition(localPos);
        
        this.floatTextContainer.addChild(floatNode);
        
        // 向上浮动动画
        // TODO: 使用 tween
        // tween(floatNode)
        //     .by(1.5, { position: new Vec3(0, 50, 0) })
        //     .to(0.5, { opacity: 0 })
        //     .call(() => floatNode.destroy())
        //     .start();
    }
    
    // ========== 按钮回调 ==========
    
    onPauseClick() {
        console.log('[UIManager] Pause clicked');
        this.showPause();
        // TODO: 通知 GameManager 暂停游戏
    }
    
    onResumeClick() {
        console.log('[UIManager] Resume clicked');
        this.hidePause();
        // TODO: 通知 GameManager 恢复游戏
    }
    
    onRestartClick() {
        console.log('[UIManager] Restart clicked');
        // TODO: 通知 GameManager 重新开始
    }
    
    onBackMenuClick() {
        console.log('[UIManager] Back to menu clicked');
        this.showMainMenu();
        // TODO: 通知 GameManager 返回菜单
    }
}
