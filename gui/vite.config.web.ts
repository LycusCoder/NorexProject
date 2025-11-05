import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Vite config for Web (standalone)
// Use this if you want to deploy as web app
export default defineConfig({
  plugins: [react()],
  
  base: '/',
  
  server: {
    port: 3000,
    host: true,
  },
  
  build: {
    outDir: 'dist-web',
    emptyOutDir: true,
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
})
