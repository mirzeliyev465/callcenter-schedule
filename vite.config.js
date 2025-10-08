export default defineConfig({
    plugins: [react()],
    base: './',  // ✅ Dəyişdir
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  })