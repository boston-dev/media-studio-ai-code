import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'

// 如果用户自己选过语言就优先用
const savedLocale = localStorage.getItem('app_locale')

// 浏览器语言 / 系统语言
const lang = (navigator.language || 'en').toLowerCase()

// 核心逻辑：包含 zh 就用中文，否则英文
const browserLocale = lang.includes('zh') ? 'zh-CN' : 'en-US'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale || browserLocale,
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

export default i18n
