import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env so we can use the key in the proxy — it is NEVER sent to the browser
  const env = loadEnv(mode, process.cwd(), '')
  const tmdbKey = env.VITE_TMDB_API_KEY || env.TMDB_API_KEY || ''

  return {
    plugins: [react()],

    build: {
      chunkSizeWarningLimit: 1000,
    },

    server: {
      proxy: {
        // Proxy /api/tmdb/* → TMDB in development
        // The API key is injected here on the Vite server — never in the browser bundle
        '/api/tmdb': {
          target: 'https://api.themoviedb.org/3',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/tmdb/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // Append the API key server-side before forwarding the request
              const url = new URL('https://api.themoviedb.org' + proxyReq.path)
              url.searchParams.set('api_key', tmdbKey)
              proxyReq.path = url.pathname + url.search
            })
          },
        },
      },
    },
  }
})
