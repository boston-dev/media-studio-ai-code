import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import {
  app,
  BrowserWindow,
  clipboard,
  dialog,
  globalShortcut,
  ipcMain,
  nativeImage,
  shell
} from 'electron'
import Screenshots from 'electron-screenshots'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { downloadM3u8ToFile, getM3u8FromPage } from './Crawler.js'

let mainWindow
let screenshots

function createWindow() {
  mainWindow = new BrowserWindow({
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

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// ================== m3u8 检测 ==================
export async function checkM3u8(url, timeout = 8000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(url, { signal: controller.signal })

    const statusCode = res.status
    const contentType = res.headers.get('content-type') || ''
    const text = await res.text()
()
    clearTimeout(timer)

    if (statusCode < 200 || statusCode >= 300) {
      return { ok: false, isM3u8: false }
    }

    const upper = text.slice(0, 20000).toUpperCase()
    const lines = upper.split(/\r?\n/)
    const firstNonEmpty = lines.find((l) => l.trim()) || ''

    if (firstNonEmpty.trim() !== '#EXTM3U') {
      return { ok: true, isM3u8: false }
    }

    if (/<!DOCTYPE HTML>/i.test(text) || /<HTML/i.test(text)) {
         }

    const hasInf = upper.includes('#EXTINF:')
    const hasTs = /\.TS/.test(upper)

    return {
      ok: true,
      isM3u8: hasInf || hasTs
    }
  } catch (err) {
    clearTimeout(timer)
    return { ok: false, isM3u8: false }
  }
}

// ================== 主入口 ==================
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  // ================== 截图初始化 ==================
  screenshots = new Screenshots({
    singleWindow: true,
    saveToClipboard: true
  })

  screenshots.on('ok', (e, buffer) => {
    const image = nativeImage.createFromBuffer(buffer)
    clipboard.writeImage(image)

    // 截图完成恢复窗口
    if (mainWindow) mainWindow.show()
  })

  screenshots.on('cancel', () => {
    if (mainWindow) mainWindow.show()
  })

  // 快捷键（微信同款）
  globalShortcut.register('CommandOrControl+Alt+A', () => {
    if (mainWindow) mainWindow.hide()
    screenshots.startCapture()
  })

  // ================== 业务逻辑 ==================
  ipcMain.handle('postM3U8', async (event, url) => {
    let pageUrl = url

    if (!url.includes('m3u8')) {
      const info = await getM3u8FromPage(url)

      if (!info) {
        await dialog.showMessageBox({
          type: 'error',
          title: '获取链接失败',
          message: '没有找到 m3u8'
        })
        return { ok: false }
      }

      const checkData = await checkM3u8(info.absSrc)

      if (!checkData.isM3u8) {
        await dialog.showMessageBox({
          type: 'error',
          title: '无效链接',
          message: '请填写正确的 m3u8'
        })
        return { ok: false }
      }

      pageUrl = info.absSrc
    }

    const { canceled, filePath } = await dialog.showSaveDialog({
      title: '保存视频',
      defaultPath: 'video.mp4',
      filters: [{ name: 'Video', extensions: ['mp4', 'ts'] }]
    })

    if (canceled || !filePath) {
      return { ok: false }
    }

    await downloadM3u8ToFile({
      m3u8Url: pageUrl,
      filePath,
      format: 'mp4',
      onProgress: (percent) => {
        event.sender.send('m3u8:progress', percent)
      }
    })

    return { ok: true }
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// ================== 退出 ==================
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
