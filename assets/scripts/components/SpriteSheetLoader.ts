import { _decorator, Component, Node, Sprite, SpriteFrame, Texture2D, assetManager, Size, Rect, Vec3 } from 'cc';
import { SpriteAnimationHelper } from './SpriteAnimationHelper';

const { ccclass, property } = _decorator;

/**
 * SpriteSheetLoader
 * 精灵图加载器 - 将现有精灵图合图转换为 Cocos SpriteFrame 数组
 * 
 * 支持格式：
 * - sprite.png (合图)
 * - index.json (帧信息，格式不变)
 * 
 * 不修改原有资源规格，运行时动态创建 SpriteFrame
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
    
    // 缓存已加载的精灵图
    private static cache: Map<string, { texture: Texture2D, frames: any[] }> = new Map();
    
    onLoad() {
        if (!this.targetSprite) {
            this.targetSprite = this.getComponent(Sprite);
        }
    }
    
    /**
     * 加载精灵图
     * @param sheetPath 精灵图路径 (如 "resources/sprites/lv1/sprite.png")
     * @param indexPath 索引文件路径 (如 "resources/sprites/lv1/index.json")
     * @param callback 加载完成回调 (frames: SpriteFrame[])
     */
    loadSpriteSheet(sheetPath: string, indexPath: string, callback?: Function) {
        this.spriteSheetPath = sheetPath;
        this.indexJsonPath = indexPath;
        this.onLoadComplete = callback || null;
        
        // 检查缓存
        const cacheKey = sheetPath;
        if (SpriteSheetLoader.cache.has(cacheKey)) {
            const cached = SpriteSheetLoader.cache.get(cacheKey)!;
            this.processSpriteSheet(cached.texture, cached.frames);
            return;
        }
        
        // 加载精灵图纹理
        this.loadTexture(sheetPath, (texture) => {
            if (!texture) {
                console.error('[SpriteSheetLoader] Failed to load texture:', sheetPath);
                return;
            }
            
            // 加载索引 JSON
            this.loadIndexJson(texture, indexPath);
        });
    }
    
    /**
     * 加载纹理
     */
    private loadTexture(path: string, callback: (texture: Texture2D | null) => void) {
        // 使用 resources 目录下的资源
        const bundle = assetManager.getBundle('resources');
        if (bundle) {
            bundle.load(path, Texture2D, (err, texture) => {
                if (err) {
                    console.error('[SpriteSheetLoader] Bundle load error:', err);
                    callback(null);
                    return;
                }
                callback(texture as Texture2D);
            });
        } else {
            // 回退到远程加载
            assetManager.loadRemote(path, (err, asset) => {
                if (err) {
                    console.error('[SpriteSheetLoader] Remote load error:', err);
                    callback(null);
                    return;
                }
                callback(asset as Texture2D);
            });
        }
    }
    
    /**
     * 加载索引 JSON
     */
    private loadIndexJson(texture: Texture2D, indexPath: string) {
        // 从 resources 加载 json
        const bundle = assetManager.getBundle('resources');
        if (bundle) {
            bundle.load(indexPath, (err, asset) => {
                if (err) {
                    console.error('[SpriteSheetLoader] JSON load error:', err);
                    return;
                }
                const indexData = asset as any;
                this.processSpriteSheet(texture, indexData.json ? indexData.json.frames : indexData.frames);
            });
        } else {
            // 使用 fetch 回退
            fetch(indexPath)
                .then(response => response.json())
                .then(data => {
                    this.processSpriteSheet(texture, data.frames);
                })
                .catch(err => {
                    console.error('[SpriteSheetLoader] Failed to load index json:', err);
                });
        }
    }
    
    /**
     * 处理精灵图数据 - 创建 SpriteFrame 数组
     */
    private processSpriteSheet(texture: Texture2D, frames: any[]) {
        const spriteFrames: SpriteFrame[] = [];
        
        if (frames && Array.isArray(frames)) {
            frames.forEach((frame: any) => {
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
        
        console.log(`[SpriteSheetLoader] Created ${spriteFrames.length} SpriteFrames for ${this.spriteSheetPath}`);
        
        // 缓存
        SpriteSheetLoader.cache.set(this.spriteSheetPath, { texture, frames });
        
        if (this.onLoadComplete) {
            this.onLoadComplete(spriteFrames);
        }
    }
    
    /**
     * 创建 SpriteFrame
     * 不修改资源规格：
     * - Trim = false (保持原始尺寸)
     * - Anchor = (0.5, 0.5) (中心锚点)
     * - Filter = LINEAR (线性过滤)
     */
    private createSpriteFrame(texture: Texture2D, x: number, y: number, w: number, h: number): SpriteFrame {
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        
        // 设置矩形区域 (从合图中截取)
        const rect = new Rect(x, y, w, h);
        spriteFrame.rect = rect;
        
        // 设置原始尺寸 (保持原始大小，不裁剪)
        const originalSize = new Size(w, h);
        spriteFrame.originalSize = originalSize;
        
        // 不设置 trim，保持原始尺寸
        // 锚点使用默认 (0.5, 0.5)
        
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
    
    /**
     * 获取缓存
     */
    static getCache(): Map<string, { texture: Texture2D, frames: any[] }> {
        return SpriteSheetLoader.cache;
    }
    
    /**
     * 清除缓存
     */
    static clearCache() {
        SpriteSheetLoader.cache.clear();
    }
}