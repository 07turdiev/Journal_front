// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { createHead } from '@vueuse/head'

const app = createApp(App)

// Initialize @vueuse/head for SEO meta tag management
const head = createHead()

// Install plugins
app.use(head)
app.use(router)
app.use(i18n)

// Mount the application
app.mount('#app')