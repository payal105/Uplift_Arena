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
      // Dev dashboard (its own Vite server, base '/master/')
      '/master': {
        target: 'http://localhost:5175',
        changeOrigin: true
      }
    }
  }
})
