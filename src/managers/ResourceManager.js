/**
 * ResourceManager.js (v2)
 * 资源管理器 - 多分包加载、重试机制、进度追踪
 * 
 * 基于 Cocos 方案思路适配原生 Canvas:
 * - 串行加载分包，避免并发导致进度条跳动
 * - 指数退避重试，最多 3 次
 * - 已加载分包缓存，不重复下载
 */

class ResourceManager {
  constructor() {
    // 资源缓存
    this.cache = {
      images: {},
      json: {},
      audio: {}
    };
    
    // 分包配置
    this.packages = {
      sprites: { 
        name: 'res',
        root: 'subpackage/',
        loaded: false,
        loading: false,
        displayName: '角色动画'
      },
      levels: { 
        name: 'levels',
        root: 'subpackage/levels/',
        loaded: false,
        loading: false,
        displayName: '关卡数据'
      },
      audio: { 
        name: 'audio',
        root: 'subpackage/audio/',
        loaded: false,
        loading: false,
        displayName: '音效音乐'
      }
    };
    
    // 加载状态
    this.loadingQueue = [];
    this.isLoading = false;
    this.currentTask = null;
    
    // 统计
    this.stats = {
      totalPackages: 0,
      loadedPackages: 0,
      failedPackages: 0
    };
    
    // 进度回调
    this.onProgress = null;
    this.onComplete = null;
    this.onError = null;
  }

  /**
   * 串行加载所有分包
   * @param {string[]} packageNames - 要加载的分包名称列表
   * @param {Function} onProgress - 进度回调 (progress, status)
   * @param {Function} onComplete - 完成回调
   * @param {Function} onError - 错误回调
   */
  loadPackages(packageNames, onProgress, onComplete, onError) {
    this.onProgress = onProgress || null;
    this.onComplete = onComplete || null;
    this.onError = onError || null;
    
    this.loadingQueue = packageNames.filter(name => {
      const pkg = this.packages[name];
      return pkg && !pkg.loaded;
    });
    
    this.stats.totalPackages = this.loadingQueue.length;
    this.stats.loadedPackages = 0;
    this.stats.failedPackages = 0;
    
    if (this.loadingQueue.length === 0) {
      // 生产环境关闭已加载日志
      // console.log('[ResourceManager] All packages already loaded');
      if (this.onComplete) this.onComplete();
      return;
    }
    
    // 生产环境关闭加载日志
    // console.log('[ResourceManager] Loading packages:', this.loadingQueue.join(', '));
    this._loadNextPackage();
  }

  /**
   * 加载单个分包（带重试）
   */
  _loadNextPackage() {
    if (this.loadingQueue.length === 0) {
      // 生产环境关闭全部加载完成日志
      // console.log('[ResourceManager] All packages loaded');
      if (this.onComplete) this.onComplete();
      return;
    }
    
    const packageName = this.loadingQueue.shift();
    const pkg = this.packages[packageName];
    
    if (!pkg) {
      // 生产环境关闭未知包警告
      // console.warn('[ResourceManager] Unknown package:', packageName);
      this._loadNextPackage();
      return;
    }
    
    if (pkg.loaded) {
      this.stats.loadedPackages++;
      this._emitProgress();
      this._loadNextPackage();
      return;
    }
    
    this._loadPackageWithRetry(packageName, 3);
  }

  /**
   * 带重试的分包加载
   * @param {string} packageName
   * @param {number} maxRetries - 最大重试次数
   */
  _loadPackageWithRetry(packageName, maxRetries) {
    const pkg = this.packages[packageName];
    let attempt = 0;
    
    const tryLoad = () => {
      attempt++;
      // 生产环境关闭重试日志
      // console.log(`[ResourceManager] Loading ${pkg.displayName} (${packageName}), attempt ${attempt}/${maxRetries}`);
      
      pkg.loading = true;
      this.currentTask = this._doLoadPackage(packageName);
      
      if (this.currentTask && this.currentTask.onProgressUpdate) {
        this.currentTask.onProgressUpdate((res) => {
          // 分包下载进度只占单个包的进度
          const singleProgress = res.progress / 100;
          const overallProgress = (this.stats.loadedPackages + singleProgress) / this.stats.totalPackages;
          
          const loadedMB = (res.totalBytesWritten / 1024 / 1024).toFixed(1);
          const totalMB = (res.totalBytesExpectedToWrite / 1024 / 1024).toFixed(1);
          const status = `正在加载${pkg.displayName}... ${loadedMB}MB / ${totalMB}MB`;
          
          if (this.onProgress) {
            this.onProgress(Math.min(overallProgress, 0.99), status);
          }
        });
      }
    };
    
    tryLoad();
  }

  /**
   * 执行分包加载
   */
  _doLoadPackage(packageName) {
    const pkg = this.packages[packageName];
    
    return new Promise((resolve, reject) => {
      const task = wx.loadSubpackage({
        name: pkg.name,
        success: () => {
          // 生产环境关闭加载成功日志
          // console.log(`[ResourceManager] Package ${packageName} loaded successfully`);
          pkg.loaded = true;
          pkg.loading = false;
          this.stats.loadedPackages++;
          this._emitProgress();
          this._loadNextPackage();
          resolve();
        },
        fail: (err) => {
          // 生产环境关闭加载失败日志
          // console.error(`[ResourceManager] Package ${packageName} failed:`, err);
          pkg.loading = false;
          this._handleLoadFailure(packageName, err);
          reject(err);
        }
      });
      
      // 返回 task 供进度监听
      return task;
    });
  }

  /**
   * 处理加载失败 - 指数退避重试
   */
  _handleLoadFailure(packageName, err) {
    const pkg = this.packages[packageName];
    if (!pkg.retryCount) pkg.retryCount = 0;
    pkg.retryCount++;
    
    const maxRetries = 3;
    if (pkg.retryCount < maxRetries) {
      // 指数退避: 1s, 2s, 4s
      const delayMs = Math.min(1000 * Math.pow(2, pkg.retryCount - 1), 5000);
      const status = `${pkg.displayName}加载失败，${delayMs / 1000}s后重试...`;
      
      // 生产环境关闭重试日志
      // console.log(`[ResourceManager] Retrying ${packageName} in ${delayMs}ms`);
      if (this.onProgress) this.onProgress(0, status);
      
      setTimeout(() => {
        this._loadPackageWithRetry(packageName, maxRetries);
      }, delayMs);
    } else {
      // 生产环境关闭最终失败日志
      // console.error(`[ResourceManager] Package ${packageName} failed after ${maxRetries} retries`);
      this.stats.failedPackages++;
      
      if (this.onError) {
        this.onError(packageName, pkg.displayName, err);
      } else {
        // 继续加载其他分包，不阻塞
        this._loadNextPackage();
      }
    }
  }

  /**
   * 发送进度事件
   */
  _emitProgress() {
    const progress = this.stats.totalPackages > 0 
      ? this.stats.loadedPackages / this.stats.totalPackages 
      : 1;
    
    const status = this.stats.failedPackages > 0
      ? `加载中... (${this.stats.loadedPackages}/${this.stats.totalPackages})`
      : `加载中... ${Math.round(progress * 100)}%`;
    
    if (this.onProgress) {
      this.onProgress(progress, status);
    }
  }

  /**
   * 加载图片（从分包或主包）
   */
  loadImage(src) {
    return new Promise((resolve, reject) => {
      if (this.cache.images[src]) {
        resolve(this.cache.images[src]);
        return;
      }
      
      const img = wx.createImage();
      img.onload = () => {
        this.cache.images[src] = img;
        resolve(img);
      };
      img.onerror = () => {
        // 生产环境关闭图片加载失败日志
        // console.warn('[ResourceManager] Failed to load image:', src);
        reject(new Error('Failed to load image: ' + src));
      };
      img.src = src;
    });
  }

  /**
   * 批量加载图片
   */
  loadImages(srcs) {
    const promises = srcs.map(src => this.loadImage(src));
    return Promise.all(promises);
  }

  /**
   * 检查分包是否已加载
   */
  isPackageLoaded(packageName) {
    return this.packages[packageName]?.loaded || false;
  }

  /**
   * 检查所有必需分包是否就绪
   */
  arePackagesLoaded(packageNames) {
    return packageNames.every(name => this.isPackageLoaded(name));
  }

  /**
   * 获取已缓存的图片
   */
  getImage(src) {
    return this.cache.images[src] || null;
  }

  /**
   * 清理缓存（非当前关卡资源）
   */
  clearCache(keepSrcs) {
    if (!keepSrcs) {
      this.cache.images = {};
      return;
    }
    
    const newCache = {};
    keepSrcs.forEach(src => {
      if (this.cache.images[src]) {
        newCache[src] = this.cache.images[src];
      }
    });
    this.cache.images = newCache;
  }
}

// 单例
var _rmInstance = null;
ResourceManager.getInstance = function() {
  if (!_rmInstance) {
    _rmInstance = new ResourceManager();
  }
  return _rmInstance;
};

// 导出到全局
GameGlobal.ResourceManager = ResourceManager;
GameGlobal.resourceManager = ResourceManager.getInstance();
