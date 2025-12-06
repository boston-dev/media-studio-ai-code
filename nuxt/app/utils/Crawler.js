import muxjs from 'mux.js';
/**
 * 测试一个 m3u8 链接是否可用
 * @param {string} m3u8Url
 * @returns {Promise<{ok: boolean, reason?: string, tsCount?: number, keyUrl?: string}>}
 */
export async function testM3u8(m3u8Url) {
  try {
    const res = await fetch(m3u8Url, { method: 'GET' });
    if (!res.ok) {
      return { ok: false, reason: 'HTTP 状态码：' + res.status };
    }

    const text = await res.text();

    // 1. 必须包含 #EXTM3U
    if (!text.includes('#EXTM3U')) {
      return { ok: false, reason: '内容看起来不是 m3u8' };
    }

    const lines = text
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    const base = new URL(m3u8Url);
    let keyUrl = null;
    const tsList = [];

    for (const line of lines) {
      if (line.startsWith('#EXT-X-KEY')) {
        const m = line.match(/URI="([^"]+)"/);
        if (m) {
          keyUrl = new URL(m[1], base).href;
        }
      } else if (!line.startsWith('#')) {
        // 当作 ts 行
        tsList.push(new URL(line, base).href);
      }
    }

    if (!tsList.length) {
      return { ok: false, reason: 'm3u8 中没有找到 ts 切片' };
    }

    // 到这里就说明 m3u8 解析是 OK 的
    return {
      ok: true,
      tsCount: tsList.length,
      keyUrl
    };
  } catch (err) {
    return { ok: false, reason: '异常：' + (err && err.message ? err.message : String(err)) };
  }
}


/*************************************************************
 *                M3U8 → TS / MP4 下载器（最强版）
 *  - 支持 AES-128 解密
 *  - 自动重试 + 队列控制 + 顺序保证
 *  - 真 · MP4 (mux.js)
 *  - 商用上线推荐
 *************************************************************/

const MAX_RETRY = 5;       // 单切片最大重试次数
const CONCURRENCY = 6;     // 并发数量（6 最稳，8 更快）

// 工具：请求（带重试）
async function fetchRetry(url) {
  for (let i = 0; i < MAX_RETRY; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.arrayBuffer();
    } catch (err) {
      console.warn(`重试 ${i + 1}/${MAX_RETRY}`, url);
      if (i === MAX_RETRY - 1) throw err;
      await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
    }
  }
}

// 解析 m3u8
async function parseM3u8(url) {
  const text = await (await fetch(url)).text();
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let keyUrl = null, iv = null;
  const tsList = [];
  const base = new URL(url);

  for (const line of lines) {
    if (line.startsWith("#EXT-X-KEY")) {
      const keyMatch = line.match(/URI="([^"]+)"/);
      const ivMatch  = line.match(/IV=([^,]+)/);

      if (keyMatch) keyUrl = new URL(keyMatch[1], base).href;
      if (ivMatch) {
        // 去掉 0x 前缀
        let hex = ivMatch[1].replace(/^0x/, "");
        iv = new Uint8Array(hex.match(/.{1,2}/g).map(h => parseInt(h, 16)));
      }
    } else if (!line.startsWith('#')) {
      tsList.push(new URL(line, base).href);
    }
  }

  if (!iv) iv = new Uint8Array(16); // 默认 IV=0
  return { keyUrl, iv, tsList };
}

// AES 解密器
async function createDecryptor(keyUrl, iv) {
  if (!keyUrl) return null;

  const keyBytes = new Uint8Array(await fetchRetry(keyUrl));
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );

  return async function decrypt(data) {
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      cryptoKey,
      data
    );
    return new Uint8Array(decrypted);
  };
}

// 合并
function mergeArrays(list) {
  const total = list.reduce((s, a) => s + a.byteLength, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const arr of list) {
    out.set(arr, offset);
    offset += arr.byteLength;
  }
  return out;
}

// 真 MP4 转码
async function convertToMp4(tsSegments) {
  return new Promise((resolve, reject) => {
    const { Transmuxer } = muxjs.mp4;
    const tm = new Transmuxer({ keepOriginalTimestamps: true });

    const out = [];
    tm.on("data", segment => {
      if (segment.initSegment) out.push(segment.initSegment);
      if (segment.data) out.push(segment.data);
    });

    tm.on("done", () => {
      resolve(mergeArrays(out));
    });

    try {
      tsSegments.forEach(seg => tm.push(seg));
      tm.flush();
    } catch (err) {
      reject(err);
    }
  });
}

// 保存文件
function downloadFile(uint8, fileName, mime) {
  const blob = new Blob([uint8], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/*****************************************************************
 *        ⭐ 最终对外暴露的上线级 API ⭐
 *****************************************************************/
export async function downloadM3u8({ 
  m3u8Url, 
  fileName = "video", 
  format = "mp4"  // "ts" / "mp4"
}) {
  console.log("解析 M3U8 …");
  const { keyUrl, iv, tsList } = await parseM3u8(m3u8Url);

  const decryptor = await createDecryptor(keyUrl, iv);

  console.log(`共 ${tsList.length} 个 TS 分片，开始下载…`);

  // 并发队列
  const results = new Array(tsList.length);
  let index = 0;

  async function worker() {
    while (true) {
      const i = index++;
      if (i >= tsList.length) break;

      const url = tsList[i];
      const data = await fetchRetry(url);
      results[i] = decryptor ? await decryptor(data) : new Uint8Array(data);
    }
  }

  const workers = Array(CONCURRENCY).fill(0).map(worker);
  await Promise.all(workers);

  console.log("下载完毕，开始合并…");

  const mergedTS = mergeArrays(results);

  if (format === "ts") {
    downloadFile(mergedTS, fileName + ".ts", "video/mp2t");
    return;
  }

  console.log("开始转码为 MP4…");
  try {
    const mp4Data = await convertToMp4(results);
    downloadFile(mp4Data, fileName + ".mp4", "video/mp4");
  } catch (err) {
    console.error("转码失败，回退为 TS：", err);
    downloadFile(mergedTS, fileName + ".ts", "video/mp2t");
  }
}
