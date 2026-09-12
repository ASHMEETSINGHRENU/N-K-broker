import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@nestandkey/constants': path.resolve(__dirname, './src/shared/constants'),
      '@nestandkey/utils': path.resolve(__dirname, './src/shared/utils'),
      '@nestandkey/types': path.resolve(__dirname, './src/shared/types')
    }
  }
});
