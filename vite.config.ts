import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');"
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
