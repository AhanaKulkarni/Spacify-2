import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import { fileURLToPath, URL } from 'url';

// Get __dirname equivalent in ESM
const __dirname = fileURLToPath(new URL('.', import.meta.url));

let cartographerPlugin = null;
if (process.env.NODE_ENV !== 'production' && process.env.REPL_ID !== undefined) {
  cartographerPlugin = require('@replit/vite-plugin-cartographer').cartographer();
}

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(cartographerPlugin ? [cartographerPlugin] : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client', 'src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@assets': path.resolve(__dirname, 'attached_assets'),
    },
  },
  root: path.resolve(__dirname, 'client'),
  build: {
    outDir: path.resolve(__dirname, 'dist'), // changed from 'dist/public' to 'dist'
    emptyOutDir: true,
  },
});