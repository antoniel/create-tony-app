import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react()],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: '../.nsh',
    emptyOutDir: false,
    lib: {
      entry: fileURLToPath(new URL('./host.tsx', import.meta.url)),
      name: 'StudioWebHost',
      formats: ['es'],
      fileName: () => 'web-host.js',
    },
    rolldownOptions: { output: { codeSplitting: false } },
  },
})
