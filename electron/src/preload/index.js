import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      ipcSend: (channel, ...args) => ipcRenderer.send(channel, ...args),
      ipcInvoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
      on: (channel, listener) => ipcRenderer.on(channel, (event, ...args) => listener(...args))
    })
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
