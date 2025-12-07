import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { downloadM3u8ToFile, getM3u8FromPage } from './Crawler.js' // ⭐ 用 import

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 1100,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
export async function checkM3u8(url, timeout = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { signal: controller.signal });

    const statusCode = res.status;
    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();

    clearTimeout(timer);

    // ---------- 1. 请求失败 ----------
    if (statusCode < 200 || statusCode >= 300) {
      return {
        ok: false,
        isM3u8: false,
        type: null,
        statusCode,
        contentType,
        reason: `HTTP status ${statusCode}`
      };
    }

    const upper = text.slice(0, 20000).toUpperCase();  // 前 2 万字符判断已足够

    const lines = upper.split(/\r?\n/);
    const firstNonEmpty = lines.find(l => l.trim()) || '';

    // ---------- 2. 开头必须是 #EXTM3U ----------
    if (firstNonEmpty.trim() !== '#EXTM3U') {
      return {
        ok: true,
        isM3u8: false,
        type: null,
        statusCode,
        contentType,
        reason: 'First non-empty line is not #EXTM3U'
      };
    }

    // ---------- 3. 防止是 HTML 假 m3u8 ----------
    if (/<!DOCTYPE HTML>/i.test(text) || /<HTML/i.test(text)) {
      return {
        ok: true,
        isM3u8: false,
        type: null,
        statusCode,
        contentType,
        reason: 'HTML content detected'
      };
    }

    // ---------- 4. 判断类型 ----------
    const hasStreamInf = upper.includes('#EXT-X-STREAM-INF');
    const hasInf = upper.includes('#EXTINF:');
    const hasTs = /\.TS/.test(upper);
    const hasSubM3u8 = /\.M3U8/.test(upper);

    let type = 'unknown';
    if (hasStreamInf || (hasSubM3u8 && !hasInf)) {
      type = 'master'; // 主列表
    } else if (hasInf || hasTs) {
      type = 'media'; // 分片列表
    }

    const isM3u8 = type !== 'unknown';

    return {
      ok: true,
      isM3u8,
      type,
      statusCode,
      contentType,
      reason: isM3u8
        ? (type === 'master'
            ? 'valid master m3u8 (#EXT-X-STREAM-INF or sub-playlists found)'
            : 'valid media m3u8 (#EXTINF/.ts found)')
        : 'header #EXTM3U exists but no segment info found'
    };

  } catch (err) {
    clearTimeout(timer);
    return {
      ok: false,
      isM3u8: false,
      type: null,
      statusCode: null,
      contentType: null,
      reason: `Fetch error: ${err.message}`
    };
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('postM3U8', async (event, url) => {
    let pageUrl = url
    if (!url.includes('m3u8')) {
      const info = await getM3u8FromPage(url)
      console.log(info)
      if (!info) {
        const msg = '没有在该网页中找到 m3u8 视频地址'
        // ❌ 获取失败，弹系统提示
        await dialog.showMessageBox({
          type: 'error',
          title: '获取链接失败',
          message: msg
        })

        // 把错误也返回给渲染进程（可选）
        return { ok: false, error: msg }
      }
      const checkData= await checkM3u8(info.absSrc)
      console.log('-------',checkData)
      if(!checkData.isM3u8){
        await dialog.showMessageBox({
          type: 'error',
          title: `播放链接无效:${info.absSrc}`,
          message: `请填写正确的m3u8播放链接`
        })
         return { ok: false, error: `请填写正确的m3u8播放链接` }
      }
      pageUrl = info.absSrc
    }
    console.log(pageUrl)
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: '保存视频',
      defaultPath: 'video.mp4',
      filters: [{ name: 'Video', extensions: ['mp4', 'ts'] }]
    })
    if (canceled || !filePath) {
      return { ok: false, reason: 'cancel' }
    }
    await downloadM3u8ToFile({
      m3u8Url: pageUrl,
      filePath,
      format: 'mp4',
      onProgress: (percent) => {
        console.log(percent)
        // 发送进度给当前窗口
        event.sender.send('m3u8:progress', percent)
      }
    })

    return { ok: true, filePath }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
