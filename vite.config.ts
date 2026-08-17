/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'assets',
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    open: true,
    port: 5173,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    environmentMatchGlobs: [
      ['**/*.test.ts', 'jsdom'],
      ['**/*.test.tsx', 'jsdom'],
    ],
    css: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
