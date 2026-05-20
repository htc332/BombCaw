import { _decorator, Component, Node, Button, Label, director, Vec3, UITransform, Color, Sprite } from 'cc';
import { LevelManager } from '../managers/LevelManager';

const { ccclass, property } = _decorator;

/**
 * MainMenu
 * 主菜单场景脚本
 * 
 * 职责：
 * 1. 显示游戏标题
 * 2. 开始游戏按钮
 * 3. 关卡选择按钮
 * 4. 设置按钮
 * 5. 显示玩家进度
 */
@ccclass('MainMenu')
export class MainMenu extends Component {
    
    // UI 节点引用
    @property(Node)
    titleNode: Node | null = null;
    
    @property(Button)
    startButton: Button | null = null;
    
    @property(Button)
    levelSelectButton: Button | null = null;
    
    @property(Button)
    settingsButton: Button | null = null;
    
    @property(Label)
    progressLabel: Label | null = null;
    
    // 关卡管理器
    private levelManager: LevelManager | null = null;
    
    onLoad() {
        console.log('[MainMenu] Loading...');
        
        // 初始化关卡管理器
        this.initLevelManager();
        
        // 绑定按钮事件
        this.bindButtonEvents();
        
        // 更新进度显示
        this.updateProgressDisplay();
    }
    
    start() {
        console.log('[MainMenu] Started');
        
        // 播放背景音乐
        // this.getComponent(AudioManager)?.playBgm('menu_bgm');
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
     * 绑定按钮事件
     */
    private bindButtonEvents() {
        if (this.startButton) {
            this.startButton.node.on(Button.EventType.CLICK, this.onStartClick, this);
        }
        
        if (this.levelSelectButton) {
            this.levelSelectButton.node.on(Button.EventType.CLICK, this.onLevelSelectClick, this);
        }
        
        if (this.settingsButton) {
            this.settingsButton.node.on(Button.EventType.CLICK, this.onSettingsClick, this);
        }
    }
    
    /**
     * 更新进度显示
     */
    private updateProgressDisplay() {
        if (!this.levelManager || !this.progressLabel) return;
        
        const unlockedLevel = this.levelManager.getUnlockedLevel();
        const totalLevels = 18; // 总关卡数
        
        this.progressLabel.string = `Progress: ${unlockedLevel - 1}/${totalLevels} Levels`;
        
        // 计算总星级
        let totalStars = 0;
        let maxStars = 0;
        for (let i = 1; i < unlockedLevel; i++) {
            totalStars += this.levelManager.getLevelStars(i);
            maxStars += 3;
        }
        
        if (maxStars > 0) {
            this.progressLabel.string += ` | Stars: ${totalStars}/${maxStars}`;
        }
    }
    
    /**
     * 开始游戏按钮点击
     */
    private onStartClick() {
        console.log('[MainMenu] Start game clicked');
        
        // 播放点击音效
        // this.getComponent(AudioManager)?.playSfx('click');
        
        // 获取当前关卡
        const currentLevel = this.levelManager?.getUnlockedLevel() || 1;
        
        // 加载游戏场景
        director.loadScene('Game', () => {
            console.log('[MainMenu] Game scene loaded');
        });
    }
    
    /**
     * 关卡选择按钮点击
     */
    private onLevelSelectClick() {
        console.log('[MainMenu] Level select clicked');
        
        // 播放点击音效
        // this.getComponent(AudioManager)?.playSfx('click');
        
        // 加载关卡选择场景
        director.loadScene('LevelSelect', () => {
            console.log('[MainMenu] Level select scene loaded');
        });
    }
    
    /**
     * 设置按钮点击
     */
    private onSettingsClick() {
        console.log('[MainMenu] Settings clicked');
        
        // 播放点击音效
        // this.getComponent(AudioManager)?.playSfx('click');
        
        // 显示设置面板
        this.showSettingsPanel();
    }
    
    /**
     * 显示设置面板
     */
    private showSettingsPanel() {
        // TODO: 创建设置面板
        console.log('[MainMenu] Showing settings panel');
    }
    
    /**
     * 创建动态标题动画
     */
    createTitleAnimation() {
        if (!this.titleNode) return;
        
        // 简单的上下浮动动画
        const startY = this.titleNode.position.y;
        let time = 0;
        
        this.schedule(() => {
            time += 0.05;
            const offset = Math.sin(time) * 10;
            this.titleNode?.setPosition(this.titleNode.position.x, startY + offset, 0);
        }, 0.05);
    }
}
