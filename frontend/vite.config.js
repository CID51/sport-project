import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '^/(?!api)': {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        rewrite: (path) => `/api${path}`
      }
    }
  }
})