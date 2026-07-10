/**
 * Vercel Edge Function: proxies /api/tmdb/* → TMDB API
 * API key is read from process.env only — never sent to the browser.
 */

export const config = {
  runtime: 'edge',
}

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

function corsOrigin(request) {
  const origin = request.headers.get('origin') || ''
  if (ALLOWED_ORIGINS.includes(origin)) return origin
  try {
    const { hostname, protocol } = new URL(origin)
    if (protocol === 'https:' && hostname.endsWith('.vercel.app')) return origin
  } catch {
    /* ignore */
  }
  return null
}

export default async function handler(request) {
  const origin = corsOrigin(request)

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin || 'null',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  if (request.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const url = new URL(request.url)
  const tmdbPath = url.pathname.replace(/^\/api\/tmdb/, '').replace(/\/{2,}/g, '/') || '/'

  const isAllowed = ALLOWED_PATH_PREFIXES.some((prefix) => tmdbPath.startsWith(prefix))
  if (!tmdbPath || tmdbPath === '/' || !isAllowed) {
    return Response.json({ error: 'Invalid or disallowed TMDB path' }, { status: 400 })
  }

  const apiKey = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'TMDB API key not configured on server' }, { status: 500 })
  }

  const tmdbUrl = new URL(`https://api.themoviedb.org/3${tmdbPath}`)
  for (const key of SAFE_PARAMS) {
    const value = url.searchParams.get(key)
    if (value) tmdbUrl.searchParams.set(key, value)
  }
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
    if (origin) headers['Access-Control-Allow-Origin'] = origin
    return new Response(data, { status: tmdbResponse.status, headers })
  } catch (error) {
    console.error('TMDB proxy error:', error)
    return Response.json({ error: 'Failed to fetch from TMDB' }, { status: 502 })
  }
}
