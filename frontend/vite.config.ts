import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({ root: resolve(__dirname), plugins: [react()], base: './', build: { outDir: resolve(__dirname, '../static'), emptyOutDir: true, rollupOptions: { input: resolve(__dirname, 'index.html') } } });
