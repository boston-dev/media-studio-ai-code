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
