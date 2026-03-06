import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: false, // Disable HMR as per instructions
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        domaines: 'domaines.html',
        contact: 'contact.html',
        mentions: 'mentions-legales.html'
      }
    }
  }
});
