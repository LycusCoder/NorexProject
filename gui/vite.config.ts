import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Vite config for Electron
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  base: './',
  
  server: {
    port: 5173,
    strictPort: true,
  },
  
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        settings: path.resolve(__dirname, 'settings.html')
      }
    }
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  
  // Prevent vite from obscuring errors
  clearScreen: false,
})
