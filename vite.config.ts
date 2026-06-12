import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'assets',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // Use IPv4 loopback to avoid localhost (::1/127.0.0.1) mismatch on Windows.
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
});
