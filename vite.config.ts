import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  base: '/',
  plugins: [react()],
  esbuild: {
    pure: ['console.log'],
    drop: ['debugger'],
  },
  build: {
    outDir: 'dist',
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  server: {
    host: 'localhost',
    port: 5173,
  },
})
