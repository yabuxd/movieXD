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

export const getTrending = async () => {
  const response = await tmdbApi.get('/trending/movie/day')
  return response.data
}

export const getPopular = async (page = 1) => {
  const response = await tmdbApi.get('/movie/popular', { params: { page } })
  return response.data
}

export const getTopRated = async () => {
  const response = await tmdbApi.get('/movie/top_rated')
  return response.data
}

export const getUpcoming = async () => {
  const response = await tmdbApi.get('/movie/upcoming')
  return response.data
}

export const searchMovies = async (query, page = 1) => {
  const response = await tmdbApi.get('/search/movie', { params: { query, page } })
  return response.data
}

export const getMovieDetails = async (id) => {
  const response = await tmdbApi.get(`/movie/${id}`, {
    params: { append_to_response: 'videos,credits,similar,recommendations' },
  })
  return response.data
}

export const getGenres = async () => {
  const response = await tmdbApi.get('/genre/movie/list')
  return response.data
}

export const discoverMovies = async (params) => {
  const response = await tmdbApi.get('/discover/movie', { params })
  return response.data
}

export const getMovieRecommendations = async (id) => {
  const response = await tmdbApi.get(`/movie/${id}/recommendations`)
  return response.data
}

export default tmdbApi
