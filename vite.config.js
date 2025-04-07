import { fileURLToPath, URL } from 'node:url';
import { execSync } from 'child_process';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __APP_COMMIT__: JSON.stringify(
      execSync('git rev-parse HEAD').toString().trim().slice(0, 8),
    ),
  },
  server: {
    hmr: false,
  },
});
