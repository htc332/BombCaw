import { _decorator, Component, Node, Vec2, Vec3, UITransform, Size } from 'cc';

const { ccclass, property } = _decorator;

/**
 * GridManager Component
 * 网格系统管理器
 * 职责：网格计算、坐标转换、布局适配
 */
@ccclass('GridManager')
export class GridManager extends Component {
    @property
    gridSize: number = 5;
    
    @property
    cellSize: number = 70;
    
    @property
    gap: number = 4;
    
    // 网格原点（左下角）
    private gridOrigin: Vec3 = new Vec3();
    
    // 实际单元格大小（考虑缩放）
    private actualCellSize: number = 70;
    
    onLoad() {
        this.calculateLayout();
    }
    
    /**
     * 计算布局参数
     */
    calculateLayout() {
        const uiTransform = this.getComponent(UITransform);
        if (!uiTransform) return;
        
        const contentSize = uiTransform.contentSize;
        const totalGap = (this.gridSize + 1) * this.gap;
        const availableSpace = Math.min(contentSize.width, contentSize.height) - totalGap;
        
        this.actualCellSize = Math.floor(availableSpace / this.gridSize);
        
        // 计算网格原点，使其居中
        const totalWidth = this.gridSize * this.actualCellSize + totalGap;
        const startX = (contentSize.width - totalWidth) / 2 + this.gap;
        const startY = (contentSize.height - totalWidth) / 2 + this.gap;
        
        this.gridOrigin.set(startX, startY, 0);
        
        console.log('[GridManager] Layout calculated:', {
            cellSize: this.actualCellSize,
            origin: this.gridOrigin
        });
    }
    
    /**
     * 网格坐标转世界坐标
     */
    gridToWorld(gx: number, gy: number): Vec3 {
        const x = this.gridOrigin.x + gx * (this.actualCellSize + this.gap);
        const y = this.gridOrigin.y + gy * (this.actualCellSize + this.gap);
        return new Vec3(x, y, 0);
    }
    
    /**
     * 世界坐标转网格坐标
     */
    worldToGrid(wx: number, wy: number): Vec2 {
        const gx = Math.floor((wx - this.gridOrigin.x) / (this.actualCellSize + this.gap));
        const gy = Math.floor((wy - this.gridOrigin.y) / (this.actualCellSize + this.gap));
        return new Vec2(gx, gy);
    }
    
    /**
     * 获取单元格大小
     */
    getCellSize(): number {
        return this.actualCellSize;
    }
    
    /**
     * 检查坐标是否在网格内
     */
    isInGrid(gx: number, gy: number): boolean {
        return gx >= 0 && gx < this.gridSize && gy >= 0 && gy < this.gridSize;
    }
}
