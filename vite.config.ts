import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  // The Graphviz WASM chunk is ~1.4 MB and is loaded lazily.
  build: { chunkSizeWarningLimit: 1500 },
});
