import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ registerType: 'autoUpdate', manifest })
  ],
  base: '/uninter-questions'
});
