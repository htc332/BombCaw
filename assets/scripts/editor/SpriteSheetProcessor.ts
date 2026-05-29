import { _decorator, Component, Sprite, SpriteFrame, Texture2D, assetManager, Size, Rect, Vec2, CCString } from 'cc';

const { ccclass, property } = _decorator;

/**
 * SpriteSheetProcessor
 * Editor 辅助脚本 - 处理精灵图切割
 * 
 * 用法：
 * 1. 将此脚本挂载到场景中的节点
 * 2. 在 Inspector 中配置 spriteSheetConfigs
 * 3. 点击 "Process All" 按钮
 * 
 * 功能：
 * - 读取 index.json 帧数据
 * - 将 sprite.png 切割成多个 SpriteFrame
 * - 输出到 assets/resources/sprites/{name}/frames/ 目录
 */
@ccclass('SpriteSheetProcessor')
export class SpriteSheetProcessor extends Component {
    
    @property([CCString])
    spriteSheetConfigs: string[] = [
        'sprites/lv1',
        'sprites/lv2',
        'sprites/lv3',
        'sprites/lv4',
        'sprites/enemy_n',
        'sprites/enemy_n_death',
        'sprites/enemy_elite',
        'sprites/enemy_elite_break',
        'sprites/enemy_elite_break_idle',
        'sprites/enemy_elite_death'
    ];
    
    /**
     * 处理所有配置的精灵图
     * 可在 Editor 中通过按钮触发
     */
    async processAll() {
        console.log('[SpriteSheetProcessor] Starting...');
        
        for (const configPath of this.spriteSheetConfigs) {
            await this.processSpriteSheet(configPath);
        }
        
        console.log('[SpriteSheetProcessor] All done!');
    }
    
    /**
     * 处理单个精灵图
     */
    private async processSpriteSheet(configPath: string) {
        console.log(`[SpriteSheetProcessor] Processing: ${configPath}`);
        
        try {
            // 1. 加载 index.json
            const indexData = await this.loadIndexJson(configPath);
            if (!indexData) {
                console.error(`[SpriteSheetProcessor] Failed to load index.json for ${configPath}`);
                return;
            }
            
            // 2. 加载 sprite.png 的 Texture
            const texture = await this.loadTexture(configPath);
            if (!texture) {
                console.error(`[SpriteSheetProcessor] Failed to load texture for ${configPath}`);
                return;
            }
            
            // 3. 按帧数据切割
            const frames = this.cutFrames(texture, indexData);
            
            // 4. 保存 SpriteFrame 到对应目录
            await this.saveFrames(configPath, frames);
            
            console.log(`[SpriteSheetProcessor] ${configPath}: ${frames.length} frames generated`);
            
        } catch (error) {
            console.error(`[SpriteSheetProcessor] Error processing ${configPath}:`, error);
        }
    }
    
    /**
     * 加载 index.json
     */
    private loadIndexJson(configPath: string): Promise<any> {
        return new Promise((resolve) => {
            const path = `${configPath}/index`;
            
            // 在 Editor 环境下使用 Editor.assetdb
            if (typeof Editor !== 'undefined' && Editor.assetdb) {
                Editor.assetdb.queryAssets(`db://assets/resources/${path}.json`, 'json', (err: any, results: any[]) => {
                    if (err || !results || results.length === 0) {
                        resolve(null);
                        return;
                    }
                    
                    const uuid = results[0].uuid;
                    Editor.assetdb.loadAssetByUuid(uuid, (err: any, asset: any) => {
                        if (err || !asset) {
                            resolve(null);
                            return;
                        }
                        resolve(asset.json);
                    });
                });
            } else {
                // 运行时环境
                const { resources } = require('cc');
                resources.load(path, (err: any, asset: any) => {
                    if (err) {
                        resolve(null);
                        return;
                    }
                    resolve(asset.json);
                });
            }
        });
    }
    
    /**
     * 加载纹理
     */
    private loadTexture(configPath: string): Promise<Texture2D | null> {
        return new Promise((resolve) => {
            const path = `${configPath}/sprite`;
            
            if (typeof Editor !== 'undefined' && Editor.assetdb) {
                Editor.assetdb.queryAssets(`db://assets/resources/${path}.png`, 'texture', (err: any, results: any[]) => {
                    if (err || !results || results.length === 0) {
                        resolve(null);
                        return;
                    }
                    
                    const uuid = results[0].uuid;
                    Editor.assetdb.loadAssetByUuid(uuid, (err: any, asset: any) => {
                        if (err || !asset) {
                            resolve(null);
                            return;
                        }
                        resolve(asset);
                    });
                });
            } else {
                const { resources } = require('cc');
                resources.load(path, Texture2D, (err: any, texture: Texture2D) => {
                    if (err) {
                        resolve(null);
                        return;
                    }
                    resolve(texture);
                });
            }
        });
    }
    
    /**
     * 按帧数据切割 SpriteFrame
     */
    private cutFrames(texture: Texture2D, indexData: any): SpriteFrame[] {
        const frames: SpriteFrame[] = [];
        
        if (!indexData.frames || !Array.isArray(indexData.frames)) {
            return frames;
        }
        
        for (const frameData of indexData.frames) {
            const { x, y, w, h } = frameData;
            
            // 创建 SpriteFrame
            const spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;
            spriteFrame.rect = new Rect(x, y, w, h);
            spriteFrame.originalSize = new Size(w, h);
            spriteFrame.offset = new Vec2(0, 0);
            
            frames.push(spriteFrame);
        }
        
        return frames;
    }
    
    /**
     * 保存 SpriteFrame 到目录
     */
    private saveFrames(configPath: string, frames: SpriteFrame[]): Promise<void> {
        return new Promise((resolve) => {
            if (typeof Editor === 'undefined' || !Editor.assetdb) {
                console.log('[SpriteSheetProcessor] Not in Editor, skipping save');
                resolve();
                return;
            }
            
            const basePath = `db://assets/resources/${configPath}/frames`;
            
            // 创建目录
            Editor.assetdb.createFolder(basePath, (err: any) => {
                if (err && err.code !== 'EEXIST') {
                    console.error(`[SpriteSheetProcessor] Failed to create folder: ${basePath}`, err);
                    resolve();
                    return;
                }
                
                // 保存每个帧为 SpriteFrame 资源
                let completed = 0;
                const total = frames.length;
                
                if (total === 0) {
                    resolve();
                    return;
                }
                
                frames.forEach((frame, index) => {
                    const framePath = `${basePath}/frame_${index}.spriteframe`;
                    
                    Editor.assetdb.createAsset(framePath, frame, (err: any) => {
                        completed++;
                        if (err) {
                            console.error(`[SpriteSheetProcessor] Failed to save frame ${index}:`, err);
                        }
                        
                        if (completed >= total) {
                            resolve();
                        }
                    });
                });
            });
        });
    }
    
    /**
     * 获取处理后的帧列表（供 AnimationManager 使用）
     */
    static async getFrames(configPath: string): Promise<SpriteFrame[]> {
        const frames: SpriteFrame[] = [];
        const { resources } = require('cc');
        
        // 尝试加载已切割的帧
        let index = 0;
        while (true) {
            try {
                const frame = await new Promise<SpriteFrame | null>((resolve) => {
                    resources.load(`${configPath}/frames/frame_${index}`, SpriteFrame, (err: any, asset: SpriteFrame) => {
                        if (err) {
                            resolve(null);
                            return;
                        }
                        resolve(asset);
                    });
                });
                
                if (!frame) break;
                frames.push(frame);
                index++;
            } catch (e) {
                break;
            }
        }
        
        return frames;
    }
}
