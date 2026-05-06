import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: true,
    port: 5174,
    strictPort: true,
    allowedHosts: ['matrilocal-unmatchable-mardell.ngrok-free.dev'],
    proxy: {
      '/uploads': {
        target: 'http://localhost:1337',
        changeOrigin: true,
        secure: false,
      },
      '/media': {
        target: 'http://localhost:1337',
        changeOrigin: true,
        secure: false,
      },
    },
  }   
})
