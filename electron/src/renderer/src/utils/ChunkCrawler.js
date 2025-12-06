// chunk-crawler.js
// 浏览器 / Node 18+ 通用

const isNode =
  typeof process !== 'undefined' && process.versions && process.versions.node;

/**
 * @typedef {Object} ChunkCrawlerOptions
 * @property {number} [concurrency=4]    - 并发请求数
 * @property {number} [retries=2]        - 出错重试次数（总尝试次数 = 1 + retries）
 * @property {number} [retryDelay=1000]  - 每次重试之间的间隔（毫秒）
 * @property {number} [timeout=15000]    - 每个请求的超时时间（毫秒）
 * @property {(buf:ArrayBuffer, ctx:{url:string,index:number,attempt:number})=>Promise<Uint8Array>|Uint8Array} [decryptor]
 * @property {(info:{
 *   index:number,
 *   total:number,
 *   url:string,
 *   attempt:number,
 *   loadedSize:number,
 *   loadedCount:number,
 *   totalSize:number
 * })=>void} [onProgress]
 */

/**
 * 一个简易的“分片爬虫”，支持浏览器 + Node，带重试
 */
export class ChunkCrawler {
  /**
   * @param {ChunkCrawlerOptions} options
   */
  constructor(options = {}) {
    this.concurrency = options.concurrency ?? 4;
    this.retries = options.retries ?? 2;
    this.retryDelay = options.retryDelay ?? 1000;
    this.timeout = options.timeout ?? 15000;

    this.decryptor = options.decryptor || null;
    this.onProgress = options.onProgress || null;

    this._loadedCount = 0;
    this._loadedSize = 0;
  }

  /**
   * 批量抓取 ts 分片
   * @param {string[]} urls
   * @returns {Promise<Uint8Array[]>} 按顺序返回每个分片数据
   */
  async crawl(urls) {
    const total = urls.length;
    const results = new Array(total);

    let currentIndex = 0;
    const workers = [];

    const spawnWorker = () => {
      return (async () => {
        while (true) {
          const index = currentIndex++;
          if (index >= total) break;

          const url = urls[index];
          const data = await this._fetchOneWithRetry(url, index, total);
          results[index] = data;
        }
      })();
    };

    const workerCount = Math.min(this.concurrency, total);
    for (let i = 0; i < workerCount; i++) {
      workers.push(spawnWorker());
    }

    await Promise.all(workers);

    return results;
  }

  /**
   * 带重试的单分片抓取
   * @private
   * @param {string} url
   * @param {number} index
   * @param {number} total
   * @returns {Promise<Uint8Array>}
   */
  async _fetchOneWithRetry(url, index, total) {
    const maxAttempts = 1 + this.retries;
    let lastError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const data = await this._fetchOnce(url, index, total, attempt);
        // 成功才计进度
        this._loadedCount += 1;
        this._loadedSize += data.byteLength;

        if (this.onProgress) {
          this.onProgress({
            index,
            total,
            url,
            attempt,
            loadedSize: this._loadedSize,
            loadedCount: this._loadedCount,
            totalSize: NaN,
          });
        }

        return data;
      } catch (err) {
        lastError = err;
        console.warn(
          `[ChunkCrawler] 请求失败 (attempt ${attempt}/${maxAttempts})`,
          url,
          err && err.message ? err.message : err
        );

        if (attempt < maxAttempts) {
          // 等待 retryDelay 再重试
          if (this.retryDelay > 0) {
            await this._sleep(this.retryDelay);
          }
        }
      }
    }

    // 所有尝试都失败，抛出最后一个错误
    throw lastError || new Error(`Unknown error on ${url}`);
  }

  /**
   * 真正发一次请求（不负责重试）
   * @private
   * @param {string} url
   * @param {number} index
   * @param {number} total
   * @param {number} attempt
   * @returns {Promise<Uint8Array>}
   */
  async _fetchOnce(url, index, total, attempt) {
    const res = await this._fetchWithTimeout(url, this.timeout);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText} (${url})`);
    }

    const buf = await res.arrayBuffer();

    if (this.decryptor) {
      const maybe = this.decryptor(buf, { url, index, attempt });
      return maybe instanceof Promise ? await maybe : maybe;
    } else {
      return new Uint8Array(buf);
    }
  }

  /**
   * 带超时的 fetch
   * @private
   * @param {string} url
   * @param {number} timeoutMs
   * @returns {Promise<Response>}
   */
  async _fetchWithTimeout(url, timeoutMs) {
    // 浏览器 & Node18+ 都支持 AbortController
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, { signal: controller.signal });
      return res;
    } catch (err) {
      if (err && err.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeoutMs}ms (${url})`);
      }
      throw err;
    } finally {
      clearTimeout(id);
    }
  }

  /**
   * 简单的 sleep
   * @private
   * @param {number} ms
   */
  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
