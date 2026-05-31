import { _decorator, Component, Node, Label, Vec3, Color, Tween, UIOpacity } from 'cc';

const { ccclass, property } = _decorator;

/**
 * ScoreManager Component
 * 得分管理器
 * 职责：分数计算、显示、连击系统、星级评定
 */
@ccclass('ScoreManager')
export class ScoreManager extends Component {
    
    @property(Label)
    scoreLabel: Label | null = null;
    
    @property(Label)
    comboLabel: Label | null = null;
    
    @property(Node)
    floatingTextContainer: Node | null = null;
    
    // 分数状态
    private currentScore: number = 0;
    private comboCount: number = 0;
    private comboTimer: number = 0;
    private readonly COMBO_WINDOW: number = 3.0; // 连击窗口时间（秒）
    
    // 分数配置
    private scoreConfig = {
        baseWall: 100,           // 基础墙壁分数
        eliteWall: 200,          // 精英墙壁分数
        comboBonus: 50,          // 连击奖励
        maxCombo: 5,             // 最大连击数
        remainingBomb: 200,     // 剩余炸弹奖励
        starThresholds: [300, 500, 800] // 1星、2星、3星阈值
    };
    
    // 浮动文字预制体（动态创建）
    private floatingTextPool: Node[] = [];
    
    onLoad() {
        console.log('[ScoreManager] Loading...');
        this.updateScoreDisplay();
    }
    
    /**
     * 初始化关卡分数
     */
    initLevel() {
        this.currentScore = 0;
        this.comboCount = 0;
        this.comboTimer = 0;
        this.updateScoreDisplay();
        this.hideCombo();
    }
    
    /**
     * 添加分数（主要接口）
     * @param type 分数类型：'wall' | 'elite' | 'combo' | 'remaining'
     * @param data 附加数据
     */
    addScore(type: string, data?: any): number {
        let points = 0;
        let reason = '';
        
        switch (type) {
            case 'wall':
                points = this.scoreConfig.baseWall;
                reason = '摧毁墙壁';
                this.handleCombo();
                break;
                
            case 'elite':
                points = this.scoreConfig.eliteWall;
                reason = '摧毁精英鼠';
                this.handleCombo();
                break;
                
            case 'combo':
                points = (data?.combo || 0) * this.scoreConfig.comboBonus;
                reason = `${data?.combo}连击！`;
                break;
                
            case 'remaining':
                points = (data?.count || 0) * this.scoreConfig.remainingBomb;
                reason = `剩余炸弹奖励`;
                break;
                
            default:
                points = data?.points || 0;
                reason = data?.reason || '奖励';
        }
        
        // 应用连击倍率
        const multiplier = this.getComboMultiplier();
        const finalPoints = Math.floor(points * multiplier);
        
        this.currentScore += finalPoints;
        
        // 显示浮动文字
        this.showFloatingText(finalPoints, reason, data?.position);
        
        // 更新显示
        this.updateScoreDisplay();
        
        console.log(`[Score] ${reason} +${finalPoints} (x${multiplier}) = ${this.currentScore}`);
        
        return finalPoints;
    }
    
    /**
     * 处理连击
     */
    private handleCombo() {
        const now = Date.now() / 1000;
        
        if (now - this.comboTimer < this.COMBO_WINDOW) {
            this.comboCount++;
            if (this.comboCount > 1) {
                this.showCombo(this.comboCount);
            }
        } else {
            // 连击中断，结算连击奖励
            if (this.comboCount >= 2) {
                this.addScore('combo', { combo: this.comboCount });
            }
            this.comboCount = 1;
        }
        
        this.comboTimer = now;
    }
    
    /**
     * 获取连击倍率
     */
    private getComboMultiplier(): number {
        if (this.comboCount <= 1) return 1.0;
        if (this.comboCount >= 5) return 2.0;
        return 1.0 + (this.comboCount - 1) * 0.25; // 1.25, 1.5, 1.75, 2.0
    }
    
    /**
     * 显示连击提示
     */
    private showCombo(count: number) {
        if (!this.comboLabel) return;
        
        this.comboLabel.string = `${count} 连击！`;
        this.comboLabel.node.active = true;
        
        // 动画效果
        const uiOpacity = this.comboLabel.node.getComponent(UIOpacity);
        if (uiOpacity) {
            uiOpacity.opacity = 255;
            
            Tween.stopAllByTarget(this.comboLabel.node);
            
            new Tween(this.comboLabel.node)
                .to(0.3, { scale: new Vec3(1.5, 1.5, 1) })
                .to(0.2, { scale: new Vec3(1, 1, 1) })
                .delay(1.0)
                .call(() => {
                    this.hideCombo();
                })
                .start();
        }
    }
    
    /**
     * 隐藏连击提示
     */
    private hideCombo() {
        if (this.comboLabel) {
            this.comboLabel.node.active = false;
        }
    }
    
    /**
     * 显示浮动文字
     */
    private showFloatingText(points: number, reason: string, position?: Vec3) {
        if (!this.floatingTextContainer) return;
        
        // 创建浮动文字节点
        const textNode = this.createFloatingTextNode();
        textNode.setParent(this.floatingTextContainer);
        
        // 设置位置
        if (position) {
            textNode.setWorldPosition(position);
        } else {
            textNode.setPosition(new Vec3(0, 100, 0));
        }
        
        // 设置文字
        const label = textNode.getComponent(Label);
        if (label) {
            label.string = `+${points}`;
            label.color = this.getScoreColor(points);
        }
        
        // 动画：上浮并淡出
        const uiOpacity = textNode.getComponent(UIOpacity) || textNode.addComponent(UIOpacity);
        uiOpacity.opacity = 255;
        
        Tween.stopAllByTarget(textNode);
        
        new Tween(textNode)
            .parallel(
                new Tween(textNode)
                    .by(1.0, { position: new Vec3(0, 50, 0) }),
                new Tween(uiOpacity)
                    .to(1.0, { opacity: 0 })
            )
            .call(() => {
                this.recycleFloatingText(textNode);
            })
            .start();
    }
    
    /**
     * 获取分数颜色
     */
    private getScoreColor(points: number): Color {
        if (points >= 500) return new Color(255, 215, 0, 255);    // 金色
        if (points >= 200) return new Color(255, 100, 100, 255);  // 红色
        if (points >= 100) return new Color(100, 255, 100, 255);  // 绿色
        return new Color(255, 255, 255, 255);                     // 白色
    }
    
    /**
     * 创建浮动文字节点
     */
    private createFloatingTextNode(): Node {
        // 从对象池获取或创建新节点
        if (this.floatingTextPool.length > 0) {
            return this.floatingTextPool.pop()!;
        }
        
        const node = new Node('FloatingText');
        const label = node.addComponent(Label);
        label.fontSize = 24;
        label.color = new Color(255, 255, 255, 255);
        
        const uiOpacity = node.addComponent(UIOpacity);
        uiOpacity.opacity = 255;
        
        return node;
    }
    
    /**
     * 回收浮动文字节点
     */
    private recycleFloatingText(node: Node) {
        node.removeFromParent();
        
        // 重置状态
        const uiOpacity = node.getComponent(UIOpacity);
        if (uiOpacity) uiOpacity.opacity = 255;
        
        node.setScale(new Vec3(1, 1, 1));
        
        // 放回对象池
        this.floatingTextPool.push(node);
    }
    
    /**
     * 更新分数显示
     */
    private updateScoreDisplay() {
        if (this.scoreLabel) {
            this.scoreLabel.string = `分数: ${this.currentScore}`;
        }
    }
    
    /**
     * 计算星级
     */
    calculateStars(): number {
        const [star1, star2, star3] = this.scoreConfig.starThresholds;
        
        if (this.currentScore >= star3) return 3;
        if (this.currentScore >= star2) return 2;
        if (this.currentScore >= star1) return 1;
        return 0;
    }
    
    /**
     * 关卡结算
     */
    levelComplete(bombsRemaining: number): any {
        // 结算剩余炸弹奖励
        if (bombsRemaining > 0) {
            this.addScore('remaining', { count: bombsRemaining });
        }
        
        // 结算最后的连击
        if (this.comboCount >= 2) {
            this.addScore('combo', { combo: this.comboCount });
        }
        
        const stars = this.calculateStars();
        
        return {
            score: this.currentScore,
            stars: stars,
            comboMax: this.comboCount,
            isNewRecord: this.checkNewRecord()
        };
    }
    
    /**
     * 检查是否新纪录
     */
    private checkNewRecord(): boolean {
        try {
            const bestScoreStr = localStorage.getItem('bomb_wall_best_score');
            const bestScore = bestScoreStr ? parseInt(bestScoreStr) : 0;
            const isNewRecord = this.currentScore > bestScore;
            
            if (isNewRecord) {
                localStorage.setItem('bomb_wall_best_score', this.currentScore.toString());
            }
            
            return isNewRecord;
        } catch (e) {
            console.error('[ScoreManager] Failed to check new record:', e);
            return false;
        }
    }
    
    /**
     * 获取当前分数
     */
    getScore(): number {
        return this.currentScore;
    }
    
    /**
     * 获取连击数
     */
    getCombo(): number {
        return this.comboCount;
    }
}