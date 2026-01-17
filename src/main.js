// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n' // <-- i18n faylini import qilamiz

const app = createApp(App)

app.use(router)
app.use(i18n) // <-- Loyihaga i18n'ni ulaymiz

app.mount('#app')