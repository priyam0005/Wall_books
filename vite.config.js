import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    hmr: {
      protocol: 'wss',
      host: 'inphase-ashleigh-provocatively.ngrok-free.dev',
      port: 443,
      clientPort: 443,
    },
  },
});
