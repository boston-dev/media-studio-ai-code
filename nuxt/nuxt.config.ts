// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
   modules: ['@nuxtjs/i18n','@element-plus/nuxt','@pinia/nuxt','@nuxtjs/tailwindcss'],
  elementPlus: {
    importStyle: 'css',   // 自动引入样式
    themes: ['dark']   // 需要可开
  },
  pinia: {
    // 可选：允许在组件里自动导入 defineStore 等
    autoImports: ['defineStore'],
  },
  css: [
    '~/assets/scss/tailwind.css',
    '~/assets/scss/index.scss',
  ],
  devServer: {
    port: 4391,   // 这里改成你想要的端口
  },
})
