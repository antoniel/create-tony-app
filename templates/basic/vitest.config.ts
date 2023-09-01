/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  define: {
    'import.meta.vitest': true,
  },
  test: {
    watch: true,
    globals: true,
    environment: 'node',
    includeSource: ['src/**/*.{js,ts}'],
  },
});
