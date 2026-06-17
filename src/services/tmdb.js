import axios from 'axios'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || ''
const IS_PROD = import.meta.env.PROD

// In production, route through Netlify Function so the API key stays server-side
// and works even when VITE_* vars are not set at build time.
const tmdbApi = axios.create({
  baseURL: IS_PROD ? '/.netlify/functions/tmdb' : 'https://api.themoviedb.org/3',
  params: IS_PROD ? {} : { api_key: TMDB_API_KEY },
})

if (IS_PROD) {
  tmdbApi.interceptors.request.use((config) => {
    const endpoint = config.url || '/'
    config.params = {
      ...config.params,
      endpoint,
    }
    config.url = ''
    return config
  })
}

export const getTrending = async () => {
  const response = await tmdbApi.get('/trending/movie/day')
  return response.data
}

export const getPopular = async () => {
  const response = await tmdbApi.get('/movie/popular')
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

export const searchMovies = async (query) => {
  const response = await tmdbApi.get('/search/movie', {
    params: { query },
  })
  return response.data
}

export const getMovieDetails = async (id) => {
  const response = await tmdbApi.get(`/movie/${id}`, {
    params: {
      append_to_response: 'videos,credits,similar,recommendations',
    },
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
