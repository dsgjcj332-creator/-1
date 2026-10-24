import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

/**
 * Vite plugin to serve a specific HTML file at the root path `/`.
 * Use VITE_SPA_PAGE env var (e.g. landing.html, merchant.html, operations.html).
 * Falls back to index.html if not set.
 */
function spaPagePlugin(): Plugin {
  const page = process.env.VITE_SPA_PAGE || 'index.html';
  return {
    name: 'spa-page-root',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/' || req.url === '') {
          req.url = `/${page}`;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), spaPagePlugin()],
    server: {
      port: parseInt(process.env.VITE_PORT || '3000', 10),
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'index.html'),
          landing: path.resolve(__dirname, 'landing.html'),
          merchant: path.resolve(__dirname, 'merchant.html'),
          operations: path.resolve(__dirname, 'operations.html'),
        },
      },
    },
  };
});
