/**
 * Netlify serverless function: proxies /api/tmdb/* → TMDB API
 * The API key never leaves the server — it is read from process.env only.
 */

// Lock to your own origin. Update if you add a custom domain.
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://movyxd.netlify.app',
]

// Only these TMDB endpoint prefixes are allowed — prevents abuse
const ALLOWED_PATH_PREFIXES = [
  '/trending/',
  '/movie/',
  '/tv/',
  '/search/',
  '/discover/',
  '/genre/',
  '/person/',
]

function getCorsOrigin(request) {
  const origin = request.headers.get('origin') || ''
  if (ALLOWED_ORIGINS.includes(origin)) return origin
  return null
}

export default async (request, context) => {
  const corsOrigin = getCorsOrigin(request)

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin || 'null',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  // Only allow GET
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const url = new URL(request.url)

  // Extract the TMDB path — strip both possible prefixes
  const tmdbPath = url.pathname
    .replace('/.netlify/functions/tmdb-proxy', '')
    .replace('/api/tmdb', '')
    .replace(/\/{2,}/g, '/') // collapse double slashes

  // Validate path is non-empty and starts with an allowed prefix
  const isAllowed = ALLOWED_PATH_PREFIXES.some((prefix) => tmdbPath.startsWith(prefix))
  if (!tmdbPath || tmdbPath === '/' || !isAllowed) {
    return new Response(JSON.stringify({ error: 'Invalid or disallowed TMDB path' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Key is read server-side only — never sent to the browser
  const apiKey = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'TMDB API key not configured on server' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Build TMDB URL — forward allowed query params, inject key
  const tmdbUrl = new URL(`https://api.themoviedb.org/3${tmdbPath}`)
  const SAFE_PARAMS = ['page', 'query', 'with_genres', 'sort_by', 'vote_average.gte',
    'primary_release_year', 'with_original_language', 'append_to_response', 'language']
  url.searchParams.forEach((value, key) => {
    if (SAFE_PARAMS.includes(key)) tmdbUrl.searchParams.set(key, value)
  })
  tmdbUrl.searchParams.set('api_key', apiKey)

  try {
    const tmdbResponse = await fetch(tmdbUrl.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })

    const data = await tmdbResponse.text()

    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    }
    if (corsOrigin) headers['Access-Control-Allow-Origin'] = corsOrigin

    return new Response(data, { status: tmdbResponse.status, headers })
  } catch (error) {
    console.error('TMDB proxy error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch from TMDB' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export const config = {
  path: '/api/tmdb/*',
}
