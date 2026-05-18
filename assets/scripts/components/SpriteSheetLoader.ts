import { _decorator, Component, Node, Sprite, SpriteFrame, AssetManager, assetManager, UITransform, Size, Rect } from 'cc';
import { SpriteAnimationHelper } from './SpriteAnimationHelper';

const { ccclass, property } = _decorator;

/**
 * SpriteSheetLoader
 * 精灵图加载器
 * 
 * 将现有精灵图合图转换为 Cocos SpriteFrame 数组
 * 支持格式：
 * - sprite.png (合图)
 * - index.json (帧信息)
 */
@ccclass('SpriteSheetLoader')
export class SpriteSheetLoader extends Component {
    
    @property
    spriteSheetPath: string = '';
    
    @property
    indexJsonPath: string = '';
    
    @property(Sprite)
    targetSprite: Sprite | null = null;
    
    // 加载完成回调
    private onLoadComplete: Function | null = null;
    
    /**
     * 加载精灵图
     */
    loadSpriteSheet(sheetPath: string, indexPath: string, callback?: Function) {
        this.spriteSheetPath = sheetPath;
        this.indexJsonPath = indexPath;
        this.onLoadComplete = callback || null;
        
        // 加载精灵图纹理
        assetManager.loadRemote(sheetPath, (err, asset) => {
            if (err) {
                console.error('[SpriteSheetLoader] Failed to load sprite sheet:', err);
                return;
            }
            
            // 加载索引 JSON
            this.loadIndexJson(asset as any);
        });
    }
    
    /**
     * 加载索引 JSON
     */
    private loadIndexJson(texture: any) {
        fetch(this.indexJsonPath)
            .then(response => response.json())
            .then(data => {
                this.processSpriteSheet(texture, data);
            })
            .catch(err => {
                console.error('[SpriteSheetLoader] Failed to load index json:', err);
            });
    }
    
    /**
     * 处理精灵图数据
     */
    private processSpriteSheet(texture: any, indexData: any) {
        const spriteFrames: SpriteFrame[] = [];
        
        if (indexData.frames && Array.isArray(indexData.frames)) {
            indexData.frames.forEach((frame: any) => {
                const spriteFrame = this.createSpriteFrame(
                    texture,
                    frame.x,
                    frame.y,
                    frame.w,
                    frame.h
                );
                spriteFrames.push(spriteFrame);
            });
        }
        
        console.log(`[SpriteSheetLoader] Created ${spriteFrames.length} SpriteFrames`);
        
        // 注册到动画辅助器
        const animHelper = this.getComponent(SpriteAnimationHelper);
        if (animHelper) {
            const clipName = this.getClipNameFromPath(this.spriteSheetPath);
            animHelper.registerClip(clipName, spriteFrames);
        }
        
        if (this.onLoadComplete) {
            this.onLoadComplete(spriteFrames);
        }
    }
    
    /**
     * 创建 SpriteFrame
     */
    private createSpriteFrame(texture: any, x: number, y: number, w: number, h: number): SpriteFrame {
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        
        // 设置矩形区域
        const rect = new Rect(x, y, w, h);
        spriteFrame.rect = rect;
        
        // 设置原始尺寸
        const originalSize = new Size(w, h);
        spriteFrame.originalSize = originalSize;
        
        return spriteFrame;
    }
    
    /**
     * 从路径获取动画名称
     */
    private getClipNameFromPath(path: string): string {
        const parts = path.split('/');
        const folderName = parts[parts.length - 2] || 'default';
        return folderName;
    }
    
    /**
     * 批量加载精灵图
     */
    loadMultipleSheets(sheets: { sheetPath: string, indexPath: string }[], callback?: Function) {
        const results: Map<string, SpriteFrame[]> = new Map();
        let loadedCount = 0;
        
        sheets.forEach(sheet => {
            this.loadSpriteSheet(sheet.sheetPath, sheet.indexPath, (frames: SpriteFrame[]) => {
                const clipName = this.getClipNameFromPath(sheet.sheetPath);
                results.set(clipName, frames);
                
                loadedCount++;
                if (loadedCount >= sheets.length && callback) {
                    callback(results);
                }
            });
        });
    }
}
