import axios from 'axios'

/**
 * All TMDB requests go through /api/tmdb/* regardless of environment.
 *
 * In development:  Vite proxies /api/tmdb → tmdb-proxy Netlify function via
 *                  the vite.config.js proxy (see below), so the key stays
 *                  in .env on the server side and is never in the browser bundle.
 *
 * In production:   Netlify routes /api/tmdb/* to the serverless function
 *                  which injects the key server-side.
 *
 * The VITE_TMDB_API_KEY is intentionally NOT used here anymore.
 */
const tmdbApi = axios.create({
  baseURL: '/api/tmdb',
  timeout: 15000,
})

// Simple in-memory cache to ensure fast retrieval
const apiCache = new Map()

const getCached = async (url, params = {}) => {
  const cacheKey = `${url}?${JSON.stringify(params)}`
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey)
  }
  const response = await tmdbApi.get(url, { params })
  apiCache.set(cacheKey, response.data)
  return response.data
}

export const getTrending = async () => {
  return getCached('/trending/movie/day')
}

export const getPopular = async (page = 1) => {
  return getCached('/movie/popular', { page })
}

export const getTopRated = async () => {
  return getCached('/movie/top_rated')
}

export const getUpcoming = async () => {
  return getCached('/movie/upcoming')
}

export const searchMovies = async (query, page = 1) => {
  return getCached('/search/movie', { query, page })
}

export const getMovieDetails = async (id) => {
  return getCached(`/movie/${id}`, {
    append_to_response: 'videos,credits,similar,recommendations',
  })
}

export const getGenres = async () => {
  return getCached('/genre/movie/list')
}

export const discoverMovies = async (params) => {
  return getCached('/discover/movie', params)
}

export const getMovieRecommendations = async (id) => {
  return getCached(`/movie/${id}/recommendations`)
}

export const getTvDetails = async (id) => {
  return getCached(`/tv/${id}`, {
    append_to_response: 'videos,credits,similar,recommendations',
  })
}

export const getTvSeasonDetails = async (tvId, seasonNumber) => {
  return getCached(`/tv/${tvId}/season/${seasonNumber}`)
}

export const discoverTv = async (params) => {
  return getCached('/discover/tv', params)
}

export const getTvGenres = async () => {
  return getCached('/genre/tv/list')
}

export const searchTv = async (query, page = 1) => {
  return getCached('/search/tv', { query, page })
}

export const getGenreRecommendations = async (genreIds, mediaType = 'movie', excludeId = null) => {
  const ids = Array.isArray(genreIds) ? genreIds : [genreIds]
  const endpoint = mediaType === 'tv' ? '/discover/tv' : '/discover/movie'
  const data = await getCached(endpoint, {
    with_genres: ids.slice(0, 3).join('|'),
    sort_by: 'popularity.desc',
    'vote_count.gte': 50,
    page: 1,
  })
  return (data.results || [])
    .filter((item) => item.id !== excludeId)
    .slice(0, 12)
}

export default tmdbApi
