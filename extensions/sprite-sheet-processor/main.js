/**
 * SpriteSheetProcessor - Editor Extension
 */

const fs = require('fs');
const path = require('path');

// 精灵图配置列表
const SPRITE_SHEETS = [
    { name: 'lv1', path: 'sprites/lv1' },
    { name: 'lv2', path: 'sprites/lv2' },
    { name: 'lv3', path: 'sprites/lv3' },
    { name: 'lv4', path: 'sprites/lv4' },
    { name: 'enemy_n', path: 'sprites/enemy_n' },
    { name: 'enemy_n_death', path: 'sprites/enemy_n_death' },
    { name: 'enemy_elite', path: 'sprites/enemy_elite' },
    { name: 'enemy_elite_break', path: 'sprites/enemy_elite_break' },
    { name: 'enemy_elite_break_idle', path: 'sprites/enemy_elite_break_idle' },
    { name: 'enemy_elite_death', path: 'sprites/enemy_elite_death' }
];

/**
 * 处理所有精灵图
 */
async function processAllSpriteSheets() {
    console.log('[SpriteSheetProcessor] Starting...');
    
    const projectPath = Editor.Project.path;
    const resourcesPath = path.join(projectPath, 'assets', 'resources');
    
    for (const config of SPRITE_SHEETS) {
        await processSpriteSheet(resourcesPath, config);
    }
    
    console.log('[SpriteSheetProcessor] All done!');
    Editor.success('[SpriteSheetProcessor] 所有精灵图处理完成！');
}

/**
 * 处理单个精灵图
 */
async function processSpriteSheet(resourcesPath, config) {
    const { name, path: relativePath } = config;
    const fullPath = path.join(resourcesPath, relativePath);
    
    console.log(`[SpriteSheetProcessor] Processing: ${name}`);
    
    // 1. 读取 index.json
    const indexJsonPath = path.join(fullPath, 'index.json');
    if (!fs.existsSync(indexJsonPath)) {
        console.error(`[SpriteSheetProcessor] index.json not found: ${indexJsonPath}`);
        return;
    }
    
    const indexData = JSON.parse(fs.readFileSync(indexJsonPath, 'utf8'));
    
    // 2. 检查 sprite.png
    const spritePath = path.join(fullPath, 'sprite.png');
    if (!fs.existsSync(spritePath)) {
        console.error(`[SpriteSheetProcessor] sprite.png not found: ${spritePath}`);
        return;
    }
    
    // 3. 创建 frames 目录
    const framesDir = path.join(fullPath, 'frames');
    if (!fs.existsSync(framesDir)) {
        fs.mkdirSync(framesDir, { recursive: true });
    }
    
    // 4. 生成每个帧的 SpriteFrame meta 文件
    const frames = indexData.frames || [];
    let generatedCount = 0;
    
    for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        const frameMetaPath = path.join(framesDir, `frame_${i}.png`);
        
        // 创建帧的 meta 文件（引用原始 texture 的 rect）
        const metaContent = generateFrameMeta(name, i, frame, indexData.sheet_size);
        const metaFilePath = `${frameMetaPath}.meta`;
        
        fs.writeFileSync(metaFilePath, JSON.stringify(metaContent, null, 2));
        generatedCount++;
    }
    
    console.log(`[SpriteSheetProcessor] ${name}: ${generatedCount} frames generated`);
}

/**
 * 生成帧的 meta 文件内容
 */
function generateFrameMeta(sheetName, frameIndex, frameData, sheetSize) {
    const { x, y, w, h } = frameData;
    
    // 生成 UUID（使用固定算法，确保可复现）
    const uuid = generateUUID(`${sheetName}_frame_${frameIndex}`);
    const textureUUID = generateUUID(`${sheetName}_texture`);
    
    return {
        ver: '1.0.27',
        importer: 'sprite-frame',
        imported: true,
        uuid: uuid,
        files: ['.json'],
        subMetas: {},
        userData: {
            trimType: 'custom',
            trimThreshold: 1,
            rotated: false,
            offsetX: 0,
            offsetY: 0,
            trimX: x,
            trimY: y,
            width: w,
            height: h,
            rawWidth: sheetSize.w,
            rawHeight: sheetSize.h,
            borderTop: 0,
            borderBottom: 0,
            borderLeft: 0,
            borderRight: 0,
            packable: true,
            pixelsToUnit: 100,
            pivotX: 0.5,
            pivotY: 0.5,
            meshType: 0,
            isUuid: true,
            imageUuidOrDatabaseUri: textureUUID,
            atlasUuid: ''
        }
    };
}

/**
 * 简单的 UUID 生成（基于字符串哈希）
 */
function generateUUID(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    
    // 转换为 UUID 格式
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `${hex.substr(0, 8)}-${hex.substr(0, 4)}-4${hex.substr(1, 3)}-${hex.substr(2, 4)}-${hex.substr(0, 12)}`;
}

// 导出方法供 Editor 调用
module.exports = {
    processAllSpriteSheets,
    processSpriteSheet
};
