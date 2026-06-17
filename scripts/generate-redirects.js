import { mkdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const apiKey = process.env.VITE_TMDB_API_KEY || process.env.TMDB_API_KEY

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')

mkdirSync(publicDir, { recursive: true })

const lines = []

if (apiKey) {
  lines.push(`/api/tmdb/*  https://api.themoviedb.org/3/:splat?api_key=${apiKey}  200!`)
}

// SPA fallback — must come after API proxy rules
lines.push('/*  /index.html  200')

writeFileSync(join(publicDir, '_redirects'), lines.join('\n') + '\n')

if (apiKey) {
  console.log('TMDB proxy redirect configured for production.')
} else if (process.env.NETLIFY) {
  console.error(
    '\nBuild failed: TMDB API key is missing.\n' +
      'Add VITE_TMDB_API_KEY in Netlify → Site configuration → Environment variables, then redeploy.\n'
  )
  process.exit(1)
} else {
  console.warn(
    'WARNING: No TMDB API key found. Set VITE_TMDB_API_KEY in your .env file for local builds.'
  )
}
