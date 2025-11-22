import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/healthz': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      // Proxy short code redirects (6–8 alphanumeric characters)
      '^/[A-Za-z0-9]{6,8}$': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})