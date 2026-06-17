const TMDB_BASE = 'https://api.themoviedb.org/3'

export const handler = async (event) => {
  const apiKey = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status_message:
          'TMDB API key is not configured. Add TMDB_API_KEY in Netlify environment variables.',
      }),
    }
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    }
  }

  const params = new URLSearchParams(event.queryStringParameters || {})
  const endpoint = params.get('endpoint') || '/movie/popular'
  params.delete('endpoint')
  params.set('api_key', apiKey)

  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = `${TMDB_BASE}${path}?${params.toString()}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
      body: JSON.stringify(data),
    }
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status_message: 'Failed to reach TMDB API',
        error: err.message,
      }),
    }
  }
}
