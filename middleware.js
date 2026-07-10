/**
 * Vercel Edge Middleware — proxies /api/tmdb/* → TMDB before the SPA.
 * Works with Vite static output where /api serverless files may be skipped.
 */

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

export const config = {
  matcher: '/api/tmdb/:path*',
}

export default async function middleware(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
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
    return new Response(data, {
      status: tmdbResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    })
  } catch (error) {
    console.error('TMDB proxy error:', error)
    return Response.json({ error: 'Failed to fetch from TMDB' }, { status: 502 })
  }
}
