import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Bütün hostlar üçün
    port: 5173,  // 5173 portunu sınayın
    strictPort: false, // Port busy olduqda avtomatik dəyişsin
    open: true   // Browser avtomatik açılsın
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})