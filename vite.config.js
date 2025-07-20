import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    mimeTypes: {
      'text/jsx': 'text/javascript'
    }
  },
  base: '/',
  plugins: [react(),tailwindcss(),],
})
