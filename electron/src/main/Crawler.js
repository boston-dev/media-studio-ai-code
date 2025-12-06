// Crawler.node.js  (放在 main 同级目录)
const muxjs = require('mux.js')
const { webcrypto } = require('crypto')
const fs = require('fs/promises')
import { BrowserWindow } from 'electron'
const crypto = webcrypto

const MAX_RETRY = 5
const CONCURRENCY = 6

async function fetchRetry(url) {
  for (let i = 0; i < MAX_RETRY; i++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error('HTTP ' + res.status)
      return await res.arrayBuffer()
    } catch (e) {
      if (i === MAX_RETRY - 1) throw e
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 500))
    }
  }
}

// 解析 m3u8（跟你原来的一样）:contentReference[oaicite:0]{index=0}
async function parseM3u8(url) {
  const text = await (await fetch(url)).text()
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  let keyUrl = null
  let iv = null
  const tsList = []
  const base = new URL(url)

  for (const line of lines) {
    if (line.startsWith('#EXT-X-KEY')) {
      const keyMatch = line.match(/URI="([^"]+)"/)
      const ivMatch = line.match(/IV=([^,]+)/)

      if (keyMatch) keyUrl = new URL(keyMatch[1], base).href
      if (ivMatch) {
        let hex = ivMatch[1].replace(/^0x/, '')
        iv = new Uint8Array(hex.match(/.{1,2}/g).map((h) => parseInt(h, 16)))
      }
    } else if (!line.startsWith('#')) {
      tsList.push(new URL(line, base).href)
    }
  }

  if (!iv) iv = new Uint8Array(16)
  return { keyUrl, iv, tsList }
}

async function createDecryptor(keyUrl, iv) {
  if (!keyUrl) return null

  const keyBytes = new Uint8Array(await fetchRetry(keyUrl))
  const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-CBC' }, false, [
    'decrypt'
  ])

  return async function decrypt(data) {
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, cryptoKey, data)
    return new Uint8Array(decrypted)
  }
}

function mergeArrays(list) {
  const total = list.reduce((s, a) => s + a.byteLength, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const arr of list) {
    out.set(arr, offset)
    offset += arr.byteLength
  }
  return out
}

async function convertToMp4(tsSegments) {
  return new Promise((resolve, reject) => {
    const { Transmuxer } = muxjs.mp4
    const tm = new Transmuxer({ keepOriginalTimestamps: true })

    const out = []
    tm.on('data', (segment) => {
      if (segment.initSegment) out.push(segment.initSegment)
      if (segment.data) out.push(segment.data)
    })
    tm.on('done', () => resolve(mergeArrays(out)))

    try {
      tsSegments.forEach((seg) => tm.push(seg))
      tm.flush()
    } catch (e) {
      reject(e)
    }
  })
}

// 对外：下载到文件
// Crawler.js
export async function downloadM3u8ToFile({
  m3u8Url,
  filePath,
  format = 'mp4',
  onProgress // 新增
}) {
  const { keyUrl, iv, tsList } = await parseM3u8(m3u8Url)
  const decryptor = await createDecryptor(keyUrl, iv)

  const results = new Array(tsList.length)
  let index = 0
  let finished = 0
  const total = tsList.length

  const report = () => {
    if (!onProgress) return
    const percent = Math.floor((finished / total) * 100)
    onProgress(percent)
  }

  // 刚开始报 0%
  report()

  async function worker() {
    while (true) {
      const i = index++
      if (i >= tsList.length) break

      const u = tsList[i]
      const data = await fetchRetry(u)
      results[i] = decryptor ? await decryptor(data) : new Uint8Array(data)

      finished++
      report()
    }
  }

  const workers = Array(CONCURRENCY).fill(0).map(worker)
  await Promise.all(workers)

  const mergedTS = mergeArrays(results)

  if (format === 'ts') {
    await fs.writeFile(filePath, Buffer.from(mergedTS.buffer))
    onProgress && onProgress(100)
    return
  }

  try {
    const mp4Data = await convertToMp4(results)
    await fs.writeFile(filePath, Buffer.from(mp4Data.buffer))
    onProgress && onProgress(100)
  } catch (e) {
    console.error('转 MP4 失败，回退为 TS：', e)
    await fs.writeFile(filePath, Buffer.from(mergedTS.buffer))
    onProgress && onProgress(100)
  }
}

// 假设前面：const { BrowserWindow } = require('electron');

export async function getM3u8FromPage(url) {
  const hiddenWin = new BrowserWindow({
    show: false,
    webPreferences: {
      offscreen: true
    }
  })

  await hiddenWin.loadURL(url)

  const result = await hiddenWin.webContents.executeJavaScript(
    `
    (function () {
      // 把相对路径转绝对路径
      function toAbs(rawSrc) {
        if (!rawSrc) return null;
        try {
          return new URL(rawSrc, location.href).href;
        } catch (e) {
          return rawSrc;
        }
      }

      // 处理像 "\\/hls\\/1154102\\/index.m3u8" 这种：去掉转义斜杠 & HTML 实体
      function normalize(raw) {
        if (!raw) return raw;
        // "\/" -> "/"
        raw = raw.replace(/\\\\\\//g, '/'); // 兼容 "\\/" 这种
        raw = raw.replace(/\\//g, '/');     // 兼容 "\/" 这种（innerHTML 里一般是这一种）
        raw = raw.replace(/&amp;/g, '&');
        return raw.trim();
      }

      // ① 优先：在 <video>/<source> 里找 m3u8
      function findM3u8SourceElement() {
        // 可能挂 m3u8 的位置都选出来
        const nodes = document.querySelectorAll(
          'video source[src], video[src], source[src]'
        );

        for (const node of nodes) {
          const src = node.getAttribute('src') || '';
          // .m3u8 后面可以跟 ? 或 # 或直接结尾，不区分大小写
          if (/\\.m3u8(\\?|#|$)/i.test(src)) {
            return node;
          }
        }
        return null;
      }

      // 1️⃣ 先用改进后的方式找 <video>/<source>
      let el = findM3u8SourceElement();

      if (el) {
        let rawSrc1 = el.getAttribute('src');  // 例如 /1150050/index.m3u8?xxx
        rawSrc1 = normalize(rawSrc1);
        const absSrc1 = toAbs(rawSrc1);

        return {
          title: document.title,
          rawSrc: rawSrc1,
          absSrc: absSrc1,
          foundBy: 'video-source'
        };
      }

      // ② 第二层：在所有 src / href / data-* 属性里找 .m3u8
      try {
        const nodes = document.querySelectorAll('[src],[href],[data-src],[data-url]');
        for (const node of nodes) {
          const attrs = ['src', 'href', 'data-src', 'data-url'];
          for (const name of attrs) {
            const v = node.getAttribute && node.getAttribute(name);
            if (!v) continue;
            if (/\\.m3u8(\\?|#|$)/i.test(v)) {
              let rawAttr = normalize(v);
              return {
                title: document.title,
                rawSrc: rawAttr,
                absSrc: toAbs(rawAttr),
                foundBy: 'attr'
              };
            }
          }
        }
      } catch (e) {
        // 忽略，继续下一步
      }

      // ③ 第三层：正则在整份 HTML/JS 里扫 m3u8
      let html = '';
      try {
        if (document.documentElement && document.documentElement.innerHTML) {
          html = document.documentElement.innerHTML;
        } else if (document.body && document.body.innerHTML) {
          html = document.body.innerHTML;
        }
      } catch (e) {
        html = '';
      }

      if (!html) return null;

      // 3.1 优先匹配引号里的 m3u8（包括参数，兼容 \/hls\/xxx 写法）
      let m = /["']([^"'<>]*?\\.m3u8(?:\\?[^"'<>]*)?)["']/i.exec(html);
      if (m && m[1]) {
        let rawRegex1 = normalize(m[1]);
        return {
          title: document.title,
          rawSrc: rawRegex1,
          absSrc: toAbs(rawRegex1),
          foundBy: 'regex-quoted'
        };
      }

      // 3.2 再匹配裸露的 http(s)://xxx.m3u8?... 文本
      m = /https?:\\/\\/[^\\s"'<>]*?\\.m3u8(?:\\?[^\\s"'<>]*)?/i.exec(html);
      if (m && m[0]) {
        let rawRegex2 = normalize(m[0]);
        return {
          title: document.title,
          rawSrc: rawRegex2,
          absSrc: toAbs(rawRegex2),
          foundBy: 'regex-http'
        };
      }

      // ④ 实在找不到
      return null;
    })()
    `,
    true
  )

  hiddenWin.destroy()
  return result // { title, rawSrc, absSrc, foundBy } 或 null
}
