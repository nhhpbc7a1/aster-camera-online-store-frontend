import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/core': path.resolve(__dirname, './src/core'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/apps': path.resolve(__dirname, './src/apps'),
      '@/public': path.resolve(__dirname, './src/public'),
      '@/domains': path.resolve(__dirname, './src/domains'),
      '@/assets': path.resolve(__dirname, './src/assets'),
    }
  },

  server: {
    host: '0.0.0.0',  // Cho phép truy cập từ bên ngoài
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
})
