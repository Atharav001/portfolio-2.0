import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome80', 'safari13.1'],
    cssMinify: 'esbuild',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-v2-[hash].js',
        chunkFileNames: 'assets/[name]-v2-[hash].js',
        assetFileNames: 'assets/[name]-v2-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'framer';
            if (id.includes('lenis')) return 'lenis';
            if (id.includes('react') || id.includes('scheduler')) return 'react';
            if (id.includes('lucide-react')) return 'icons';
            return 'vendor';
          }
        }
      }
    }
  }
})
