import axios from 'axios'
import { withTrailer } from '../utils/media'

/**
 * Development: Vite proxies /api/tmdb → TMDB (key stays on the dev server).
 * Production (Vercel static): call TMDB directly with VITE_TMDB_API_KEY
 * baked in at build time (set TMDB_API_KEY or VITE_TMDB_API_KEY in Vercel).
 * Netlify can still use /api/tmdb via the serverless function when no key is
 * present in the client bundle.
 */
const apiKey = import.meta.env.VITE_TMDB_API_KEY || ''
const useDirectTmdb = import.meta.env.PROD && Boolean(apiKey)

const tmdbApi = axios.create({
  baseURL: useDirectTmdb ? 'https://api.themoviedb.org/3' : '/api/tmdb',
  timeout: 15000,
  ...(useDirectTmdb ? { params: { api_key: apiKey } } : {}),
})

// Simple in-memory cache to ensure fast retrieval
const apiCache = new Map()

const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (value === '' || value === undefined || value === null) return false
      if (Array.isArray(value) && value.length === 0) return false
      return true
    })
  )

const getCached = async (url, params = {}) => {
  const cleaned = cleanParams(params)
  const cacheKey = `${url}?${JSON.stringify(cleaned)}`
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey)
  }
  const response = await tmdbApi.get(url, { params: cleaned })
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

export const getMovieVideos = async (id) => {
  return getCached(`/movie/${id}/videos`)
}

export const getMovieDetails = async (id) => {
  const data = await getCached(`/movie/${id}`, {
    append_to_response: 'videos,credits,similar,recommendations',
  })
  return withTrailer(data)
}

export const getGenres = async () => {
  return getCached('/genre/movie/list')
}

export const discoverMovies = async (params) => {
  return getCached('/discover/movie', {
    include_adult: false,
    include_video: false,
    ...params,
  })
}

export const getMovieRecommendations = async (id) => {
  return getCached(`/movie/${id}/recommendations`)
}

export const getTvVideos = async (id) => {
  return getCached(`/tv/${id}/videos`)
}

export const getTvDetails = async (id) => {
  const data = await getCached(`/tv/${id}`, {
    append_to_response: 'videos,credits,similar,recommendations',
  })
  return withTrailer(data)
}

export const enrichWithTrailers = async (items, mediaType = 'movie', limit = 5) => {
  if (!items?.length) return items

  const targets = items.slice(0, limit)
  const rest = items.slice(limit)
  const fetchVideos = mediaType === 'tv' ? getTvVideos : getMovieVideos

  const enriched = await Promise.all(
    targets.map(async (item) => {
      if (item.trailer_key) return item
      try {
        const videos = await fetchVideos(item.id)
        return withTrailer({ ...item, videos })
      } catch {
        return item
      }
    })
  )

  return [...enriched, ...rest]
}

export const getTvSeasonDetails = async (tvId, seasonNumber) => {
  return getCached(`/tv/${tvId}/season/${seasonNumber}`)
}

export const discoverTv = async (params) => {
  return getCached('/discover/tv', {
    include_adult: false,
    ...params,
  })
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
