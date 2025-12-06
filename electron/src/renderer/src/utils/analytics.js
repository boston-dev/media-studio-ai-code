// src/utils/analytics.js
import pkg from '../../../../package.json'
// 生成或读取设备 UUID
function getOrCreateDeviceId() {
  var KEY = 'msa_device_id' // media studio ai
  var id = localStorage.getItem(KEY)
  if (!id) {
    if (window.crypto && window.crypto.randomUUID) {
      id = window.crypto.randomUUID()
    } else {
      // 简单 UUID 替代
      id =
        Math.random().toString(36).slice(2) +
        Date.now().toString(36) +
        Math.random().toString(36).slice(2)
    }
    localStorage.setItem(KEY, id)
  }
  return id
}

// 获取语言/时区/UA 等基础信息
function getBaseInfo() {
  var lang =
    navigator.language ||
    navigator.userLanguage ||
    'en-US'

  var tz = 'UTC'
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch (e) {}

  var ua = navigator.userAgent || ''

  return { lang: lang, tz: tz, ua: ua,appVersion:pkg.version }
}

/**
 * 上报埋点事件
 * @param {string} event - 事件名，比如 app_start / start_download
 * @param {Object} payload - 自定义数据对象
 */
export function reportEvent(event, payload) {
  var deviceId = getOrCreateDeviceId()
  var base = getBaseInfo()

  var body = Object.assign(
    {
      deviceId: deviceId,
      event: event,
      timestamp: Date.now()
    },
    base,
    payload || {}
  )

  // TODO: 换成你自己的后端接口地址
  var endpoint = 'https://tool8s.com/api/track'

  // 用 fetch 上报，失败不影响用户使用
  try {
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).catch(function (err) {
      console.warn('reportEvent error', err)
    })
  } catch (err) {
    console.warn('reportEvent error', err)
  }
}
