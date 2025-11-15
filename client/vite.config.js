// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  // 🔥 BẮT BUỘC nếu bạn chạy từ repo root (vite --config client/vite.config.js)
  root: __dirname,        // project root = client/
  envDir: __dirname,      // đọc .env trong client/

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      },
      includeAssets: ['**/*'],
      manifest: {
        name: 'FoodDeli',
        short_name: 'FoodDeli',
        description: 'Ứng dụng giao đồ ăn FoodDeli',
        theme_color: '#FE5621',
        background_color: '#ffffff',
        start_url: '/customer/home',
        display: 'standalone',
        icons: [
          {
            src: 'payos_logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'payos_logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'payos_logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // (không bắt buộc) đảm bảo public/ đúng chỗ nếu bạn có icon như /navigation.png
  publicDir: path.resolve(__dirname, 'public'),

  // (tuỳ chọn) Vite mặc định đã expose 'VITE_', khai báo cho rõ ràng
  // envPrefix: 'VITE_',
})
