/**
 * Vercel Node serverless function — proxies TMDB.
 * .cjs so it works with package.json "type": "module".
 * Rewritten from /api/tmdb/* via vercel.json
 */
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://movyxd.netlify.app',
]

const ALLOWED_PATH_PREFIXES = [
  '/trending/',
  '/movie/',
  '/tv/',
  '/search/',
  '/discover/',
  '/genre/',
  '/person/',
]

const SAFE_PARAMS = [
  'page',
  'query',
  'with_genres',
  'sort_by',
  'vote_average.gte',
  'vote_count.gte',
  'with_runtime.gte',
  'first_air_date_year',
  'primary_release_year',
  'with_original_language',
  'append_to_response',
  'language',
  'include_adult',
  'include_video',
]

function corsOrigin(req) {
  const origin = req.headers.origin || ''
  if (ALLOWED_ORIGINS.includes(origin)) return origin
  try {
    const { hostname, protocol } = new URL(origin)
    if (protocol === 'https:' && hostname.endsWith('.vercel.app')) return origin
  } catch {
    /* ignore */
  }
  return null
}

module.exports = async function handler(req, res) {
  const origin = corsOrigin(req)

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', origin || 'null')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Max-Age', '86400')
    return res.status(204).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const rawPath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path || ''
  const tmdbPath = '/' + String(rawPath).replace(/^\/+/, '')

  const isAllowed = ALLOWED_PATH_PREFIXES.some((prefix) => tmdbPath.startsWith(prefix))
  if (!rawPath || tmdbPath === '/' || !isAllowed) {
    return res.status(400).json({ error: 'Invalid or disallowed TMDB path', path: tmdbPath })
  }

  const apiKey = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'TMDB API key not configured on server' })
  }

  const tmdbUrl = new URL(`https://api.themoviedb.org/3${tmdbPath}`)
  for (const key of SAFE_PARAMS) {
    const value = req.query[key]
    if (value !== undefined && value !== '') tmdbUrl.searchParams.set(key, String(value))
  }
  tmdbUrl.searchParams.set('api_key', apiKey)

  try {
    const tmdbResponse = await fetch(tmdbUrl.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    const data = await tmdbResponse.text()

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'public, max-age=300')
    if (origin) res.setHeader('Access-Control-Allow-Origin', origin)

    return res.status(tmdbResponse.status).send(data)
  } catch (error) {
    console.error('TMDB proxy error:', error)
    return res.status(502).json({ error: 'Failed to fetch from TMDB' })
  }
}
