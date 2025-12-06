// tailwind.config.ts
import type { Config } from 'tailwindcss'
export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './assets/scss/**/*.{scss,css}' // ← 加上你的 SCSS
  ],
  theme: {
    extend: {
      boxShadow: { card: '0 8px 30px rgba(0,0,0,0.06)' },
      borderRadius: { '2xl': '1rem' }
    }
  },
  darkMode: 'class'
}
