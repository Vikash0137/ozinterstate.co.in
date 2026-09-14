import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ozinterstate/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/ozinterstate/api': {
        target: 'http://localhost:5005',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ozinterstate/, ''),
      },
    },
  },
})
