// ===== Media Studio AI 通用更新检查模块（纯 JS 版） =====

// 多语言文本（仅本模块用，不依赖 vue-i18n）
const UPDATE_I18N = {
  'zh-CN': {
    title: '发现新版本',
    appLabel: '应用',
    currentVersion: '当前版本',
    latestVersion: '最新版本',
    changelog: '更新内容',
    forceAppend: '发现新版本需要更新，为确保功能正常，我们将为你打开下载页面。',
    confirmText: '立即更新',
    cancelText: '暂不更新',
    // fallback
    fallbackForceTip: '发现新版本，需要更新后才能继续使用。',
    fallbackAsk: '是否立即下载更新？'
  },
  'en-US': {
    title: 'New version available',
    appLabel: 'App',
    currentVersion: 'Current version',
    latestVersion: 'Latest version',
    changelog: 'Release notes',
    forceAppend: 'A new version is required. To ensure everything works properly, we will open the download page for you.',
    confirmText: 'Update now',
    cancelText: 'Not now',
    // fallback
    fallbackForceTip: 'A new version is required before you can continue.',
    fallbackAsk: 'Do you want to download the update now?'
  }
}

// 自动根据你在应用里用的 app_locale / 浏览器语言，判断当前语言
function getUpdateLocale () {
  try {
    const saved = localStorage.getItem('app_locale') // 你前面 i18n 已经在用这个 key
    if (saved && saved.toLowerCase().includes('zh')) return 'zh-CN'
    if (saved && saved.toLowerCase().includes('en')) return 'en-US'
  } catch (e) {}

  const lang = (navigator.language || 'en').toLowerCase()
  if (lang.includes('zh')) return 'zh-CN'
  return 'en-US'
}

function getText () {
  const locale = getUpdateLocale()
  return UPDATE_I18N[locale] || UPDATE_I18N['en-US']
}

// ===== 基础配置（改成你的应用） =====
const DEFAULT_UPDATE_CONFIG = {
  // 本地版本号：发版时改这个，或者在外面通过参数覆盖
  LOCAL_VERSION: '1.0.3',

  // 你的版本接口（记得改成自己后端的接口）
  // 要求返回 JSON: { version, downloadUrl, force, changelog, appName? }
  VERSION_API: 'https://tool8s.com/api/media-studio/version',

  APP_NAME: 'Media Studio AI',
  CHECK_INTERVAL_HOURS: 4, // 暂时你是“手动点按钮检查”，可以不严格限制
  DEBUG: false
}

/** 合并配置 */
function mergeConfig (custom) {
  return Object.assign({}, DEFAULT_UPDATE_CONFIG, custom || {})
}

/** 版本比较：>0 a>b，=0 相等，<0 a<b */
function compareVersion (a, b) {
  const pa = String(a).split('.').map(Number)
  const pb = String(b).split('.').map(Number)
  const len = Math.max(pa.length, pb.length)

  for (let i = 0; i < len; i++) {
    const x = pa[i] || 0
    const y = pb[i] || 0
    if (x > y) return 1
    if (x < y) return -1
  }
  return 0
}

/** 检测平台：win / mac / linux / web */
function detectPlatform () {
  // Electron 渲染进程
  if (
    typeof window !== 'undefined' &&
    window.process &&
    window.process.versions &&
    window.process.versions.electron
  ) {
    const p = window.process.platform
    if (p === 'win32') return 'win'
    if (p === 'darwin') return 'mac'
    return 'linux'
  }

  // 纯浏览器
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent.toLowerCase()
    if (ua.includes('windows')) return 'win'
    if (ua.includes('mac os')) return 'mac'
    if (ua.includes('linux')) return 'linux'
  }
  return 'web'
}

/** 是否需要这次检查（控制频率）—— 你现在用不到，可以先不用管 */
function shouldCheckNow (appName, hours) {
  const key = `${appName}_last_update_check`
  try {
    const last = localStorage.getItem(key)
    if (!last) return true

    const lastTime = Number(last)
    if (!lastTime) return true

    const now = Date.now()
    const intervalMs = (hours || 4) * 60 * 60 * 1000
    return now - lastTime > intervalMs
  } catch (e) {
    return true
  }
}

/** 记录本次检查时间 */
function markCheckedNow (appName) {
  const key = `${appName}_last_update_check`
  try {
    localStorage.setItem(key, String(Date.now()))
  } catch (e) {}
}

/** 调试日志 */
function logUpdate (debug, ...args) {
  if (debug) console.log('[UpdateCheck]', ...args)
}

/** 不依赖 Element Plus 的兜底方案（alert / confirm） */
function showUpdateDialogFallback (ctx) {
  const { appName, localVersion, serverVersion, changelog, force, downloadUrl } = ctx
  const text = getText()

  let msg =
    `${text.title}\n` +
    `${text.appLabel}: ${appName}\n` +
    `${text.currentVersion}: v${localVersion}\n` +
    `${text.latestVersion}: v${serverVersion}`

  if (changelog) {
    msg += `\n\n${text.changelog}:\n${changelog}`
  }

  if (force) {
    alert(msg + '\n\n' + text.forceAppend)
    if (downloadUrl) window.open(downloadUrl, '_blank')
    return
  }

  const ok = confirm(msg + '\n\n' + text.fallbackAsk)
  if (ok && downloadUrl) {
    window.open(downloadUrl, '_blank')
  }
}

/** 用 Element Plus 弹出更新对话框（带 Tailwind class） */
function showUpdateDialogWithElementPlus (ctx) {
  const { appName, localVersion, serverVersion, changelog, force, downloadUrl } = ctx
  const text = getText()

  // 兼容全局 / ESM 两种引入方式
  const ep = window.ElementPlus || window.ELEMENT || window.elementPlus
  const ElMessageBox = ep && (ep.ElMessageBox || ep.messageBox || ep.ElMessageBoxConfirm)

  if (!ElMessageBox) {
    // 没有 Element Plus，降级
    return showUpdateDialogFallback(ctx)
  }

  const title = text.title

  // 拼一段带 Tailwind 的 HTML（注意这里是你自己可控的文本）
  const html = `
    <div class="space-y-3 text-sm text-slate-700">
      <p>${text.appLabel}：<span class="font-semibold">${appName}</span></p>
      <p>${text.currentVersion}：<span class="font-mono text-slate-600">v${localVersion}</span></p>
      <p>${text.latestVersion}：<span class="font-mono text-emerald-600">v${serverVersion}</span></p>
      ${
        changelog
          ? `<div class="mt-2 rounded-md bg-slate-100 px-3 py-2 text-xs whitespace-pre-line">
               ${changelog.replace(/\n/g, '<br>')}
             </div>`
          : ''
      }
      ${
        force
          ? `<p class="mt-2 text-xs text-amber-600">${text.forceAppend}</p>`
          : ''
      }
    </div>
  `

  ElMessageBox({
    title,
    message: html,
    dangerouslyUseHTMLString: true,
    showCancelButton: !force,
    confirmButtonText: text.confirmText,
    cancelButtonText: text.cancelText,

    // 强制更新时，禁止点击遮罩 & 关闭按钮
    closeOnClickModal: !force,
    closeOnPressEscape: !force,
    showClose: !force,

    customClass: 'media-studio-update-dialog'
  })
    .then(() => {
      if (downloadUrl) {
        // 这里就是「真正开始下载」的逻辑，你后面可以改成：
        // 调用 electron 主进程下载器，而不是直接打开浏览器。
        window.open(downloadUrl, '_blank')
      }
    })
    .catch(() => {
      // 用户点了取消 / 关闭
    })
}

/**
 * ⭐ 主函数：检查更新（只返回状态，不弹窗）
 */
export async function initUpdateChecker (customConfig = {}) {
  const config = mergeConfig(customConfig)
  const { LOCAL_VERSION, VERSION_API, APP_NAME, CHECK_INTERVAL_HOURS, DEBUG } = config

  if (!LOCAL_VERSION || !VERSION_API) {
    console.warn('[UpdateCheck] LOCAL_VERSION 或 VERSION_API 未配置，跳过更新检查。')
    return {
      ok: false,
      hasUpdate: false,
      reason: 'config-missing'
    }
  }

  const platform = detectPlatform()
  logUpdate(DEBUG, '开始检查更新，本地版本:', LOCAL_VERSION, '平台:', platform)

  try {
    const url =
      VERSION_API +
      (VERSION_API.includes('?') ? '&' : '?') +
      'platform=' +
      encodeURIComponent(platform)

    const res = await fetch(url, { cache: 'no-cache' })
    if (!res.ok) {
      logUpdate(DEBUG, '版本接口请求失败，状态码:', res.status)
      return {
        ok: false,
        hasUpdate: false,
        reason: 'http-error',
        status: res.status
      }
    }

    const data = await res.json()
    // 如果以后要做“定时检查”，可以在这里记时间：
    // markCheckedNow(APP_NAME)

    if (!data || !data.version) {
      logUpdate(DEBUG, '接口返回无版本信息:', data)
      return {
        ok: false,
        hasUpdate: false,
        reason: 'no-version',
        raw: data
      }
    }

    const serverVersion = data.version
    const downloadUrl = data.downloadUrl
    const force = !!data.force
    const changelog = data.changelog || ''

    logUpdate(DEBUG, '服务器版本:', serverVersion, 'downloadUrl:', downloadUrl, 'force:', force)

    const cmp = compareVersion(serverVersion, LOCAL_VERSION)
    const hasUpdate = cmp > 0

    return {
      ok: true,
      hasUpdate,
      platform,
      localVersion: LOCAL_VERSION,
      serverVersion,
      force,
      downloadUrl,
      changelog,
      raw: data,
      checkedAt: Date.now()
    }
  } catch (err) {
    console.error('[UpdateCheck] 检查更新异常:', err)
    return {
      ok: false,
      hasUpdate: false,
      reason: 'exception',
      error: err?.message
    }
  }
}

/**
 * ⭐ 根据状态对象，真正弹出更新弹窗 & 执行下载逻辑
 */
export function showUpdatePrompt (state, appNameOverride) {
  if (!state || !state.ok) {
    console.warn('[UpdateCheck] 无效的更新状态，或检查失败:', state)
    return
  }

  if (!state.hasUpdate) {
    // 不弹“已是最新版本”，你在外面用 ElMessage 提示更好
    return
  }

  const ctx = {
    appName: appNameOverride || state.raw?.appName || DEFAULT_UPDATE_CONFIG.APP_NAME,
    localVersion: state.localVersion,
    serverVersion: state.serverVersion,
    changelog: state.changelog,
    force: state.force,
    downloadUrl: state.downloadUrl
  }

  showUpdateDialogWithElementPlus(ctx)
}

// 可选：挂到 window 上，方便你在控制台或别的脚本里直接调用
if (typeof window !== 'undefined') {
  window.MediaStudioUpdateChecker = {
    initUpdateChecker,
    showUpdatePrompt
  }
}

// ===== 模块结束 =====
