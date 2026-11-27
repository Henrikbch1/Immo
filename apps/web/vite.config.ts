import { execSync } from 'node:child_process';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { SPRINT } from './src/sprint.ts';

// GitHub Pages: https://henrikbch1.github.io/Immo/ (E9, 11 §2) – Pfad mit großem I.
const BASE = '/Immo/';

function commitHash(): string {
  const ausCi = process.env.GITHUB_SHA;
  if (ausCi) return ausCi.slice(0, 7);
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return 'lokal';
  }
}

export default defineConfig({
  base: BASE,
  define: {
    __BUILD_INFO__: JSON.stringify({ sprint: SPRINT, commit: commitHash(), zeit: new Date().toISOString() }),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        id: BASE,
        name: 'Immo – Immobilien-Trainingsspiel',
        short_name: 'Immo',
        description: 'Realistisches Trainingsspiel für Immobilieninvestments in Deutschland. Keine Beratung.',
        lang: 'de',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1f4fd8',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,json}'],
        navigateFallback: `${BASE}index.html`,
      },
    }),
  ],
});
