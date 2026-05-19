import { _decorator, Component, Node, Label, ProgressBar, Button, Vec3, UIOpacity, Color } from 'cc';

const { ccclass, property } = _decorator;

/**
 * UIManager
 * 测试场景 UI 管理器
 * 
 * 职责：
 * 1. 显示分数、剩余炸弹数
 * 2. 显示关卡信息
 * 3. 显示胜利/失败面板
 * 4. 处理按钮点击
 */
@ccclass('UIManager')
export class UIManager extends Component {
    
    // UI 节点引用
    @property(Label)
    scoreLabel: Label | null = null;
    
    @property(Label)
    bombsLeftLabel: Label | null = null;
    
    @property(Label)
    levelInfoLabel: Label | null = null;
    
    @property(Node)
    victoryPanel: Node | null = null;
    
    @property(Node)
    gameOverPanel: Node | null = null;
    
    @property(Button)
    resetButton: Button | null = null;
    
    @property(Button)
    nextLevelButton: Button | null = null;
    
    onLoad() {
        console.log('[UIManager] Loading...');
        
        // 查找或创建 UI 节点
        this.findOrCreateUIElements();
    }
    
    start() {
        // 绑定按钮事件
        if (this.resetButton) {
            this.resetButton.node.on(Button.EventType.CLICK, this.onResetClick, this);
        }
        
        if (this.nextLevelButton) {
            this.nextLevelButton.node.on(Button.EventType.CLICK, this.onNextLevelClick, this);
        }
    }
    
    /**
     * 查找或创建 UI 元素
     */
    private findOrCreateUIElements() {
        // 查找现有节点
        this.scoreLabel = this.findLabel('ScoreLabel');
        this.bombsLeftLabel = this.findLabel('BombsLeftLabel');
        this.levelInfoLabel = this.findLabel('LevelInfoLabel');
        
        // 如果没有找到，创建默认 UI
        if (!this.scoreLabel) {
            this.createDefaultUI();
        }
    }
    
    /**
     * 查找 Label 节点
     */
    private findLabel(name: string): Label | null {
        const node = this.node.getChildByName(name);
        if (node) {
            return node.getComponent(Label);
        }
        return null;
    }
    
    /**
     * 创建默认 UI
     */
    private createDefaultUI() {
        console.log('[UIManager] Creating default UI...');
        
        // 创建分数标签
        const scoreNode = new Node('ScoreLabel');
        this.node.addChild(scoreNode);
        this.scoreLabel = scoreNode.addComponent(Label);
        this.scoreLabel.string = 'Score: 0';
        this.scoreLabel.fontSize = 24;
        this.scoreLabel.color = Color.WHITE;
        scoreNode.setPosition(0, 250);
        
        // 创建剩余炸弹标签
        const bombsNode = new Node('BombsLeftLabel');
        this.node.addChild(bombsNode);
        this.bombsLeftLabel = bombsNode.addComponent(Label);
        this.bombsLeftLabel.string = 'Bombs: 3';
        this.bombsLeftLabel.fontSize = 20;
        this.bombsLeftLabel.color = Color.YELLOW;
        bombsNode.setPosition(0, 220);
        
        // 创建关卡信息标签
        const levelNode = new Node('LevelInfoLabel');
        this.node.addChild(levelNode);
        this.levelInfoLabel = levelNode.addComponent(Label);
        this.levelInfoLabel.string = 'Test Level - Walls: 5';
        this.levelInfoLabel.fontSize = 18;
        this.levelInfoLabel.color = Color.CYAN;
        levelNode.setPosition(0, 200);
    }
    
    /**
     * 更新分数显示
     */
    updateScore(score: number) {
        if (this.scoreLabel) {
            this.scoreLabel.string = `Score: ${score}`;
        }
    }
    
    /**
     * 更新剩余炸弹数
     */
    updateBombsLeft(bombsLeft: number) {
        if (this.bombsLeftLabel) {
            this.bombsLeftLabel.string = `Bombs: ${bombsLeft}`;
        }
    }
    
    /**
     * 更新关卡信息
     */
    updateLevelInfo(level: number, wallCount: number) {
        if (this.levelInfoLabel) {
            this.levelInfoLabel.string = `Level ${level} - Walls: ${wallCount}`;
        }
    }
    
    /**
     * 显示胜利面板
     */
    showVictoryPanel(score: number, stars: number) {
        console.log('[UIManager] Victory! Score:', score, 'Stars:', stars);
        
        // 创建胜利面板
        if (!this.victoryPanel) {
            this.createVictoryPanel();
        }
        
        if (this.victoryPanel) {
            this.victoryPanel.active = true;
            
            // 更新分数显示
            const scoreLabel = this.victoryPanel.getChildByName('VictoryScore')?.getComponent(Label);
            if (scoreLabel) {
                scoreLabel.string = `Score: ${score}`;
            }
            
            // 更新星级显示
            const starsLabel = this.victoryPanel.getChildByName('StarsLabel')?.getComponent(Label);
            if (starsLabel) {
                starsLabel.string = '★'.repeat(stars);
            }
        }
    }
    
    /**
     * 创建胜利面板
     */
    private createVictoryPanel() {
        const panel = new Node('VictoryPanel');
        this.node.addChild(panel);
        
        // 背景
        const bg = new Node('Background');
        panel.addChild(bg);
        const bgSprite = bg.addComponent(Sprite);
        // TODO: 设置背景颜色或图片
        
        // 标题
        const titleNode = new Node('Title');
        panel.addChild(titleNode);
        const titleLabel = titleNode.addComponent(Label);
        titleLabel.string = 'Victory!';
        titleLabel.fontSize = 48;
        titleLabel.color = Color.YELLOW;
        titleNode.setPosition(0, 100);
        
        // 分数
        const scoreNode = new Node('VictoryScore');
        panel.addChild(scoreNode);
        const scoreLabel = scoreNode.addComponent(Label);
        scoreLabel.string = 'Score: 0';
        scoreLabel.fontSize = 32;
        scoreLabel.color = Color.WHITE;
        scoreNode.setPosition(0, 50);
        
        // 星级
        const starsNode = new Node('StarsLabel');
        panel.addChild(starsNode);
        const starsLabel = starsNode.addComponent(Label);
        starsLabel.string = '★★★';
        starsLabel.fontSize = 40;
        starsLabel.color = Color.YELLOW;
        starsNode.setPosition(0, 0);
        
        // 下一关按钮
        const nextBtnNode = new Node('NextLevelButton');
        panel.addChild(nextBtnNode);
        const nextBtn = nextBtnNode.addComponent(Button);
        const nextBtnLabel = nextBtnNode.addComponent(Label);
        nextBtnLabel.string = 'Next Level';
        nextBtnLabel.fontSize = 24;
        nextBtnNode.setPosition(0, -80);
        
        // 重置按钮
        const resetBtnNode = new Node('ResetButton');
        panel.addChild(resetBtnNode);
        const resetBtn = resetBtnNode.addComponent(Button);
        const resetBtnLabel = resetBtnNode.addComponent(Label);
        resetBtnLabel.string = 'Retry';
        resetBtnLabel.fontSize = 24;
        resetBtnNode.setPosition(0, -130);
        
        panel.active = false;
        this.victoryPanel = panel;
        
        // 绑定按钮事件
        nextBtnNode.on(Button.EventType.CLICK, this.onNextLevelClick, this);
        resetBtnNode.on(Button.EventType.CLICK, this.onResetClick, this);
    }
    
    /**
     * 隐藏所有面板
     */
    hideAllPanels() {
        if (this.victoryPanel) {
            this.victoryPanel.active = false;
        }
        if (this.gameOverPanel) {
            this.gameOverPanel.active = false;
        }
    }
    
    /**
     * 重置按钮点击
     */
    private onResetClick() {
        console.log('[UIManager] Reset clicked');
        
        // 隐藏面板
        this.hideAllPanels();
        
        // 通知重置
        this.node.emit('ui_reset_level');
    }
    
    /**
     * 下一关按钮点击
     */
    private onNextLevelClick() {
        console.log('[UIManager] Next level clicked');
        
        // 隐藏面板
        this.hideAllPanels();
        
        // 通知下一关
        this.node.emit('ui_next_level');
    }
}

// 需要导入 Sprite
import { Sprite } from 'cc';
