import { _decorator, Component, Node, Button, Label, ScrollView, Layout, director, Color, Sprite, UITransform } from 'cc';
import { LevelManager } from '../managers/LevelManager';

const { ccclass, property } = _decorator;

/**
 * LevelSelect
 * 关卡选择场景脚本
 * 
 * 职责：
 * 1. 显示所有关卡按钮
 * 2. 显示关卡星级
 * 3. 处理关卡点击
 * 4. 返回主菜单
 */
@ccclass('LevelSelect')
export class LevelSelect extends Component {
    
    // UI 节点引用
    @property(Node)
    levelGrid: Node | null = null;
    
    @property(Button)
    backButton: Button | null = null;
    
    @property(Label)
    titleLabel: Label | null = null;
    
    @property(Node)
    levelButtonPrefab: Node | null = null;
    
    // 关卡管理器
    private levelManager: LevelManager | null = null;
    
    // 总关卡数
    private totalLevels: number = 18;
    
    onLoad() {
        console.log('[LevelSelect] Loading...');
        
        // 初始化关卡管理器
        this.initLevelManager();
        
        // 创建关卡按钮
        this.createLevelButtons();
        
        // 绑定返回按钮
        if (this.backButton) {
            this.backButton.node.on(Button.EventType.CLICK, this.onBackClick, this);
        }
    }
    
    start() {
        console.log('[LevelSelect] Started');
    }
    
    /**
     * 初始化关卡管理器
     */
    private initLevelManager() {
        this.levelManager = this.getComponent(LevelManager);
        if (!this.levelManager) {
            this.levelManager = this.addComponent(LevelManager);
        }
    }
    
    /**
     * 创建关卡按钮
     */
    private createLevelButtons() {
        if (!this.levelGrid) return;
        
        const layout = this.levelGrid.getComponent(Layout);
        if (!layout) return;
        
        const unlockedLevel = this.levelManager?.getUnlockedLevel() || 1;
        
        for (let i = 1; i <= this.totalLevels; i++) {
            const buttonNode = this.createLevelButton(i, i <= unlockedLevel);
            this.levelGrid.addChild(buttonNode);
        }
        
        console.log(`[LevelSelect] Created ${this.totalLevels} level buttons`);
    }
    
    /**
     * 创建单个关卡按钮
     */
    private createLevelButton(levelId: number, isUnlocked: boolean): Node {
        const buttonNode = new Node(`LevelButton_${levelId}`);
        
        // 添加 UITransform
        const uiTransform = buttonNode.addComponent(UITransform);
        uiTransform.setContentSize(80, 80);
        
        // 添加按钮组件
        const button = buttonNode.addComponent(Button);
        
        // 添加背景精灵
        const bgNode = new Node('Background');
        buttonNode.addChild(bgNode);
        const bgTransform = bgNode.addComponent(UITransform);
        bgTransform.setContentSize(80, 80);
        const bgSprite = bgNode.addComponent(Sprite);
        
        // 根据解锁状态设置颜色
        if (isUnlocked) {
            bgSprite.color = new Color(100, 200, 100, 255); // 绿色
        } else {
            bgSprite.color = new Color(100, 100, 100, 255); // 灰色
            button.interactable = false;
        }
        
        // 添加关卡编号标签
        const labelNode = new Node('Label');
        buttonNode.addChild(labelNode);
        const labelTransform = labelNode.addComponent(UITransform);
        labelTransform.setContentSize(80, 40);
        const label = labelNode.addComponent(Label);
        label.string = `${levelId}`;
        label.fontSize = 32;
        label.color = Color.WHITE;
        
        // 添加星级显示
        const stars = this.levelManager?.getLevelStars(levelId) || 0;
        if (stars > 0 && isUnlocked) {
            const starsNode = new Node('Stars');
            buttonNode.addChild(starsNode);
            const starsTransform = starsNode.addComponent(UITransform);
            starsTransform.setContentSize(80, 20);
            const starsLabel = starsNode.addComponent(Label);
            starsLabel.string = '★'.repeat(stars);
            starsLabel.fontSize = 16;
            starsLabel.color = Color.YELLOW;
            starsNode.setPosition(0, -25);
        }
        
        // 绑定点击事件
        if (isUnlocked) {
            buttonNode.on(Button.EventType.CLICK, () => {
                this.onLevelClick(levelId);
            }, this);
        }
        
        return buttonNode;
    }
    
    /**
     * 关卡按钮点击
     */
    private onLevelClick(levelId: number) {
        console.log(`[LevelSelect] Level ${levelId} selected`);
        
        // 设置当前关卡
        this.levelManager?.setCurrentLevel(levelId);
        
        // 加载游戏场景
        director.loadScene('Game', () => {
            console.log(`[LevelSelect] Game scene loaded for level ${levelId}`);
        });
    }
    
    /**
     * 返回按钮点击
     */
    private onBackClick() {
        console.log('[LevelSelect] Back clicked');
        
        // 返回主菜单
        director.loadScene('MainMenu', () => {
            console.log('[LevelSelect] Main menu loaded');
        });
    }
}

