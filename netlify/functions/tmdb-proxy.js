// Netlify serverless function: proxies /api/tmdb/* → TMDB API
// Keeps the API key server-side (never exposed to the browser)

export default async (request, context) => {
  const url = new URL(request.url)

  // Extract the TMDB path from the URL
  // Request comes in as /.netlify/functions/tmdb-proxy/trending/movie/day
  // or via redirect as /api/tmdb/trending/movie/day
  const tmdbPath = url.pathname
    .replace('/.netlify/functions/tmdb-proxy', '')
    .replace('/api/tmdb', '')

  if (!tmdbPath || tmdbPath === '/') {
    return new Response(JSON.stringify({ error: 'Missing TMDB path' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const apiKey = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'TMDB API key not configured on server' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  // Build the TMDB URL, merging existing query params with the api_key
  const tmdbUrl = new URL(`https://api.themoviedb.org/3${tmdbPath}`)
  url.searchParams.forEach((value, key) => {
    tmdbUrl.searchParams.set(key, value)
  })
  tmdbUrl.searchParams.set('api_key', apiKey)

  try {
    const tmdbResponse = await fetch(tmdbUrl.toString(), {
      method: request.method,
      headers: {
        Accept: 'application/json',
      },
    })

    const data = await tmdbResponse.text()

    return new Response(data, {
      status: tmdbResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('TMDB proxy error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch from TMDB' }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

export const config = {
  path: '/api/tmdb/*',
}
