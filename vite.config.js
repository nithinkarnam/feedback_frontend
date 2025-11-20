import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy API calls to backend (adjust if your backend uses a different port)
      '/api': 'http://localhost:8080'
    }
  }
})
