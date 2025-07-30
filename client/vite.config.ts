import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  root: __dirname,
  base: '/',
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@righton/shared': resolve(__dirname, '../libs/shared/src/index.ts'),
    },
  },
  build: {
    outDir: '../dist/client',
    emptyOutDir: true,
  },
  server: {
    port: parseInt(process.env.VITE_PORT || '3000'),
    fs: {
      allow: ['..'],
    },
  },
});
