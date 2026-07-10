/**
 * Vercel Function (Web API) — proxies /api/tmdb/* → TMDB.
 * Path comes from rewrite: /api/tmdb/:path* → /api/tmdb?path=:path*
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

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  })
}

export async function OPTIONS(request) {
  const origin = corsOrigin(request)
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

export async function GET(request) {
  const origin = corsOrigin(request)
  const extra = origin ? { 'Access-Control-Allow-Origin': origin } : {}

  const url = new URL(request.url)
  const rawPath = url.searchParams.get('path') || ''
  const tmdbPath = '/' + rawPath.replace(/^\/+/, '')

  const isAllowed = ALLOWED_PATH_PREFIXES.some((prefix) => tmdbPath.startsWith(prefix))
  if (!rawPath || tmdbPath === '/' || !isAllowed) {
    return json({ error: 'Invalid or disallowed TMDB path', path: tmdbPath }, 400, extra)
  }

  const apiKey = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY
  if (!apiKey) {
    return json({ error: 'TMDB API key not configured on server' }, 500, extra)
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
    return new Response(data, {
      status: tmdbResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
        ...extra,
      },
    })
  } catch (error) {
    console.error('TMDB proxy error:', error)
    return json({ error: 'Failed to fetch from TMDB' }, 502, extra)
  }
}
