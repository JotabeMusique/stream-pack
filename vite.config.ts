import { dirname, resolve } from "node:path";
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: './',
  root: 'src',
  server: {
    host: '0.0.0.0',
  },
  build: {
    outDir: '../dist',
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[hash].js',
      },
      input: {
        index: resolve(__dirname, 'src/index.html'),
        'chat/mock': resolve(__dirname, 'src/chat/mock.html'),
        'overlay/index': resolve(__dirname, 'src/overlay/index.html'),
        'overlay/mock': resolve(__dirname, 'src/overlay/mock.html'),
        'music/index': resolve(__dirname, 'src/music/index.html'),
        'docks/streamTitle': resolve(__dirname, 'src/docks/streamTitle.html'),
      },
    },
  },
})
