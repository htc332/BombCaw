import { _decorator, Component, AudioClip, AudioSource, assetManager, resources } from 'cc';

const { ccclass, property } = _decorator;

/**
 * AudioManager
 * 音效管理器
 * 
 * 职责：
 * 1. 加载和播放音效
 * 2. 管理音量设置
 * 3. 提供音效预加载
 */
@ccclass('AudioManager')
export class AudioManager extends Component {
    
    // 音效路径配置
    private soundPaths: Map<string, string> = new Map([
        ['bomb_place', 'audio/bomb_place'],
        ['bomb_explode', 'audio/bomb_explode'],
        ['bomb_upgrade', 'audio/bomb_upgrade'],
        ['wall_break', 'audio/wall_break'],
        ['wall_destroy', 'audio/wall_destroy'],
        ['victory', 'audio/victory'],
        ['game_over', 'audio/game_over'],
        ['click', 'audio/click'],
        ['bgm', 'audio/bgm']
    ]);
    
    // 音频缓存
    private audioCache: Map<string, AudioClip> = new Map();
    
    // 音量设置
    private masterVolume: number = 1.0;
    private sfxVolume: number = 1.0;
    private bgmVolume: number = 0.5;
    
    // 音频源组件
    private sfxSource: AudioSource | null = null;
    private bgmSource: AudioSource | null = null;
    
    onLoad() {
        console.log('[AudioManager] Loading...');
        
        // 创建音频源
        this.sfxSource = this.node.addComponent(AudioSource);
        this.bgmSource = this.node.addComponent(AudioSource);
        this.bgmSource.loop = true;
        
        // 加载音量设置
        this.loadVolumeSettings();
    }
    
    /**
     * 预加载所有音效
     */
    async preloadAll(): Promise<void> {
        const promises: Promise<void>[] = [];
        
        this.soundPaths.forEach((path, name) => {
            promises.push(this.loadAudio(name, path));
        });
        
        await Promise.all(promises);
        console.log('[AudioManager] All audio preloaded');
    }
    
    /**
     * 加载单个音效
     */
    private loadAudio(name: string, path: string): Promise<void> {
        return new Promise((resolve) => {
            if (this.audioCache.has(name)) {
                resolve();
                return;
            }
            
            resources.load(path, AudioClip, (err, clip) => {
                if (err) {
                    console.warn(`[AudioManager] Failed to load ${name}:`, err);
                    resolve();
                    return;
                }
                
                this.audioCache.set(name, clip);
                console.log(`[AudioManager] Loaded: ${name}`);
                resolve();
            });
        });
    }
    
    /**
     * 播放音效
     */
    playSfx(name: string) {
        const clip = this.audioCache.get(name);
        if (!clip) {
            console.warn(`[AudioManager] Sound not found: ${name}`);
            return;
        }
        
        if (this.sfxSource) {
            this.sfxSource.playOneShot(clip, this.sfxVolume * this.masterVolume);
        }
    }
    
    /**
     * 播放背景音乐
     */
    playBgm(name: string = 'bgm') {
        const clip = this.audioCache.get(name);
        if (!clip) {
            console.warn(`[AudioManager] BGM not found: ${name}`);
            return;
        }
        
        if (this.bgmSource) {
            this.bgmSource.clip = clip;
            this.bgmSource.volume = this.bgmVolume * this.masterVolume;
            this.bgmSource.play();
        }
    }
    
    /**
     * 停止背景音乐
     */
    stopBgm() {
        if (this.bgmSource) {
            this.bgmSource.stop();
        }
    }
    
    /**
     * 暂停背景音乐
     */
    pauseBgm() {
        if (this.bgmSource) {
            this.bgmSource.pause();
        }
    }
    
    /**
     * 恢复背景音乐
     */
    resumeBgm() {
        if (this.bgmSource) {
            this.bgmSource.play();
        }
    }
    
    /**
     * 设置主音量
     */
    setMasterVolume(volume: number) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.saveVolumeSettings();
        
        // 更新 BGM 音量
        if (this.bgmSource) {
            this.bgmSource.volume = this.bgmVolume * this.masterVolume;
        }
    }
    
    /**
     * 设置音效音量
     */
    setSfxVolume(volume: number) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.saveVolumeSettings();
    }
    
    /**
     * 设置背景音乐音量
     */
    setBgmVolume(volume: number) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        this.saveVolumeSettings();
        
        if (this.bgmSource) {
            this.bgmSource.volume = this.bgmVolume * this.masterVolume;
        }
    }
    
    /**
     * 获取音量设置
     */
    getVolumeSettings() {
        return {
            master: this.masterVolume,
            sfx: this.sfxVolume,
            bgm: this.bgmVolume
        };
    }
    
    /**
     * 保存音量设置
     */
    private saveVolumeSettings() {
        const data = {
            master: this.masterVolume,
            sfx: this.sfxVolume,
            bgm: this.bgmVolume
        };
        
        try {
            localStorage.setItem('bomb_wall_audio', JSON.stringify(data));
        } catch (e) {
            console.error('[AudioManager] Failed to save volume:', e);
        }
    }
    
    /**
     * 加载音量设置
     */
    private loadVolumeSettings() {
        try {
            const data = localStorage.getItem('bomb_wall_audio');
            if (data) {
                const parsed = JSON.parse(data);
                this.masterVolume = parsed.master ?? 1.0;
                this.sfxVolume = parsed.sfx ?? 1.0;
                this.bgmVolume = parsed.bgm ?? 0.5;
            }
        } catch (e) {
            console.error('[AudioManager] Failed to load volume:', e);
        }
    }
    
    /**
     * 静音切换
     */
    toggleMute(): boolean {
        if (this.masterVolume > 0) {
            this.setMasterVolume(0);
            return true; // 已静音
        } else {
            this.setMasterVolume(1);
            return false; // 已取消静音
        }
    }
}
