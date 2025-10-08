import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@Shop': path.resolve(__dirname, './src/pages/Shop'),
      '@ShopShared': path.resolve(__dirname, './src/components/Shop'),
    },
  },
})
