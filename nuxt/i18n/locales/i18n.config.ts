import zh from './locales/zh.json'
import en from './locales/en.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { zh, en }
}))
