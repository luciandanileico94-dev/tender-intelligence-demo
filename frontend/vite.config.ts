import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  root: resolve(__dirname),
  plugins: [react()],
  base: './',
  define: { 'import.meta.env.VITE_DATA_MODE': JSON.stringify(process.env.VITE_DATA_MODE ?? 'local') },
  build: { outDir: resolve(__dirname, '../static'), emptyOutDir: true, rollupOptions: { input: resolve(__dirname, 'index.html') } },
  server: { proxy: { '/api': 'http://127.0.0.1:8000' } },
});
