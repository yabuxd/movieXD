/**
 * Generates public/_redirects for Netlify.
 *
 * The TMDB API key is NEVER written into this file.
 * All /api/tmdb/* requests are proxied through the Netlify Function
 * (netlify/functions/tmdb-proxy.js) which reads the key server-side
 * from process.env — keeping it completely out of the browser.
 */
import { mkdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')

mkdirSync(publicDir, { recursive: true })

// Route TMDB calls through the serverless function — key stays server-side
const lines = [
  '/api/tmdb/*  /.netlify/functions/tmdb-proxy/:splat  200',
  '/*           /index.html                            200',
]

writeFileSync(join(publicDir, '_redirects'), lines.join('\n') + '\n')
console.log('_redirects generated — TMDB key is server-side only.')
