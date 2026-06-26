import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/riot-ap': {
        target: 'https://ap.api.riotgames.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/riot-ap/, '')
      },
      '/riot-asia': {
        target: 'https://asia.api.riotgames.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/riot-asia/, '')
      }
    }
  }
})
