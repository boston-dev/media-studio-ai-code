import './assets/main.css'
import './assets/tailwind.css'
import i18n from './locales'  
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

app.use(i18n)                    // 👈 挂载 i18n
app.mount('#app')
