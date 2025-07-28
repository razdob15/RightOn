import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      '@righton/shared': resolve(__dirname, '../libs/shared/src/index.ts'),
    },
  },
  optimizeDeps: {
    include: ['crypto-browserify'],
  },
});
