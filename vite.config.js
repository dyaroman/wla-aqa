import { fileURLToPath, URL } from 'node:url';
import { execSync } from 'child_process';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), '');
  return {
    base: '/wla-aqa/',
    plugins: [vue(), vueDevTools()],
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
  };
});
