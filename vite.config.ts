import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/callcenter-schedule/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser'
  },
  // SPA üçün əlavə
  esbuild: {
    target: 'es2020'
})
