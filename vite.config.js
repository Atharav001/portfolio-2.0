import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-chat-middleware',
      configureServer(server) {
        server.middlewares.use('/api/chat', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          }

          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });

          req.on('end', async () => {
            try {
              req.body = JSON.parse(bodyStr || '{}');
            } catch {
              req.body = {};
            }

            const mockRes = {
              status(code) {
                res.statusCode = code;
                return this;
              },
              setHeader(name, value) {
                res.setHeader(name, value);
                return this;
              },
              json(data) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return this;
              },
            };

            try {
              const { default: handler } = await import('./api/chat.js');
              await handler(req, mockRes);
            } catch (err) {
              console.error('Local dev /api/chat error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  answer: 'Something went wrong on my end — please try again in a moment.',
                })
              );
            }
          });
        });
      },
    },
  ],
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
        },
      },
    },
  },
})

