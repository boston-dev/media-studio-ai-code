// ===== ClipForge 通用更新检查模块（纯 JS 版） =====

const DEFAULT_UPDATE_CONFIG = {
  LOCAL_VERSION: '1.0.0',                     // 本地版本（发版时改）
  VERSION_API: 'https://your-domain.com/api/version', // 版本接口
  APP_NAME: 'ClipForge',                      // 应用名
  CHECK_INTERVAL_HOURS: 4,                    // 间隔检查时间
  DEBUG: false                                // 是否输出日志
};

/** 合并配置 */
function mergeConfig(custom) {
  return Object.assign({}, DEFAULT_UPDATE_CONFIG, custom || {});
}

/** 版本比较：>0 a>b，=0 相等，<0 a<b */
function compareVersion(a, b) {
  const pa = String(a).split('.').map(Number);
  const pb = String(b).split('.').map(Number);
  const len = Math.max(pa.length, pb.length);

  for (let i = 0; i < len; i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}

/** 检测平台：win / mac / linux / web */
function detectPlatform() {
  // Electron 渲染进程
  if (typeof window !== 'undefined' &&
      window.process &&
      window.process.versions &&
      window.process.versions.electron) {
    const p = window.process.platform;
    if (p === 'win32') return 'win';
    if (p === 'darwin') return 'mac';
    return 'linux';
  }

  // 纯浏览器
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('windows')) return 'win';
    if (ua.includes('mac os')) return 'mac';
    if (ua.includes('linux')) return 'linux';
  }
  return 'web';
}

/** 是否需要这次检查（控制频率） */
function shouldCheckNow(appName, hours) {
  const key = `${appName}_last_update_check`;
  try {
    const last = localStorage.getItem(key);
    if (!last) return true;

    const lastTime = Number(last);
    if (!lastTime) return true;

    const now = Date.now();
    const intervalMs = (hours || 4) * 60 * 60 * 1000;
    return now - lastTime > intervalMs;
  } catch (e) {
    return true;
  }
}

/** 记录本次检查时间 */
function markCheckedNow(appName) {
  const key = `${appName}_last_update_check`;
  try {
    localStorage.setItem(key, String(Date.now()));
  } catch (e) {}
}

/** 调试日志 */
function logUpdate(debug, ...args) {
  if (debug) console.log('[UpdateCheck]', ...args);
}

/** 用 Element Plus 弹出更新对话框（带 Tailwind class） */
function showUpdateDialogWithElementPlus(ctx) {
  const { appName, localVersion, serverVersion, changelog, force, downloadUrl } = ctx;

  // 兼容全局 / ESM 两种引入方式
  const ep = window.ElementPlus || window.ELEMENT || window.elementPlus;
  const ElMessageBox = ep && (ep.ElMessageBox || ep.messageBox || ep.ElMessageBoxConfirm);

  if (!ElMessageBox) {
    // 没有 Element Plus，降级
    return showUpdateDialogFallback(ctx);
  }

  const title = `发现新版本`;

  // 拼一段带 Tailwind 的 HTML
  const html = `
    <div class="space-y-3 text-sm text-slate-700">
      <p>应用：<span class="font-semibold">${appName}</span></p>
      <p>当前版本：<span class="font-mono text-slate-600">v${localVersion}</span></p>
      <p>最新版本：<span class="font-mono text-emerald-600">v${serverVersion}</span></p>
      ${
        changelog
          ? `<div class="mt-2 rounded-md bg-slate-100 px-3 py-2 text-xs whitespace-pre-line">
               ${changelog.replace(/\n/g, '<br>')}
             </div>`
          : ''
      }
    </div>
  `;

  // 这里用 raw HTML，需要注意：changelog 是你自己后端控制的内容
  ElMessageBox({
    title,
    message: html,
    dangerouslyUseHTMLString: true,
    showCancelButton: !force,
    confirmButtonText: '立即更新',
    cancelButtonText: '暂不更新',
    closeOnClickModal: !force,
    showClose: !force,
    customClass: 'clipforge-update-dialog' // 你可以用 Tailwind 自定义
  }).then(() => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  }).catch(() => {
    // 用户点了取消
  });
}

/** 不依赖 Element Plus 的兜底方案 */
function showUpdateDialogFallback(ctx) {
  const { appName, localVersion, serverVersion, changelog, force, downloadUrl } = ctx;

  let msg = `发现 ${appName} 新版本 v${serverVersion}\n当前版本 v${localVersion}`;
  if (changelog) {
    msg += `\n\n更新内容：\n${changelog}`;
  }

  if (force) {
    alert(msg + '\n\n此版本为【强制更新】，将为你打开下载页面。');
    if (downloadUrl) window.open(downloadUrl, '_blank');
    return;
  }

  const ok = confirm(msg + '\n\n是否立即下载更新？');
  if (ok && downloadUrl) {
    window.open(downloadUrl, '_blank');
  }
}

/**
 * 主函数：初始化更新检查
 * @param {Object} customConfig - 自定义配置
 */
export async function initUpdateChecker(customConfig = {}) {
  const config = mergeConfig(customConfig);
  const {
    LOCAL_VERSION,
    VERSION_API,
    APP_NAME,
    CHECK_INTERVAL_HOURS,
    DEBUG
  } = config;

  if (!LOCAL_VERSION || !VERSION_API) {
    console.warn('[UpdateCheck] LOCAL_VERSION 或 VERSION_API 未配置，跳过更新检查。');
    return;
  }

  if (!shouldCheckNow(APP_NAME, CHECK_INTERVAL_HOURS)) {
    logUpdate(DEBUG, '距离上次检查时间太短，本次跳过。');
    return;
  }

  const platform = detectPlatform();
  logUpdate(DEBUG, '开始检查更新，本地版本:', LOCAL_VERSION, '平台:', platform);

  try {
    const url = VERSION_API + (VERSION_API.includes('?') ? '&' : '?') + 'platform=' + encodeURIComponent(platform);
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) {
      logUpdate(DEBUG, '版本接口请求失败，状态码:', res.status);
      return;
    }

    const data = await res.json();
    markCheckedNow(APP_NAME);

    if (!data || !data.version) {
      logUpdate(DEBUG, '接口返回无版本信息:', data);
      return;
    }

    const serverVersion = data.version;
    const downloadUrl = data.downloadUrl;
    const force = !!data.force;
    const changelog = data.changelog || '';

    logUpdate(DEBUG, '服务器版本:', serverVersion, 'downloadUrl:', downloadUrl, 'force:', force);

    const cmp = compareVersion(serverVersion, LOCAL_VERSION);
    if (cmp <= 0) {
      logUpdate(DEBUG, '当前已是最新版本。');
      return;
    }

    // 有新版本，弹 UI
    showUpdateDialogWithElementPlus({
      appName: APP_NAME,
      localVersion: LOCAL_VERSION,
      serverVersion,
      changelog,
      force,
      downloadUrl
    });
  } catch (err) {
    console.error('[UpdateCheck] 检查更新异常:', err);
  }
}

// 页面上也挂一个全局方法，方便直接调用（可选）
if (typeof window !== 'undefined') {
  window.ClipForgeUpdateChecker = {
    initUpdateChecker
  };
}

// ===== 模块结束 =====
