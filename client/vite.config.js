import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: import.meta.env.VITE_REACT_APP_BASE_URL,
        changeOrigin: true,
        secure: false
      }
    }
  }
})
