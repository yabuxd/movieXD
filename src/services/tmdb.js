import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || ''; // Add your TMDB API Key in .env file
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getTrending = async () => {
  const response = await tmdbApi.get('/trending/movie/day');
  return response.data;
};

export const getPopular = async () => {
  const response = await tmdbApi.get('/movie/popular');
  return response.data;
};

export const getTopRated = async () => {
  const response = await tmdbApi.get('/movie/top_rated');
  return response.data;
};

export const getUpcoming = async () => {
  const response = await tmdbApi.get('/movie/upcoming');
  return response.data;
};

export const searchMovies = async (query) => {
  const response = await tmdbApi.get('/search/movie', {
    params: {
      query,
    },
  });
  return response.data;
};

export const getMovieDetails = async (id) => {
  const response = await tmdbApi.get(`/movie/${id}`, {
    params: {
      append_to_response: 'videos,credits,similar,recommendations',
    },
  });
  return response.data;
};

export const getGenres = async () => {
  const response = await tmdbApi.get('/genre/movie/list');
  return response.data;
};

export const discoverMovies = async (params) => {
  const response = await tmdbApi.get('/discover/movie', {
    params: {
      ...params,
    },
  });
  return response.data;
};

export const getMovieRecommendations = async (id) => {
  const response = await tmdbApi.get(`/movie/${id}/recommendations`);
  return response.data;
};

export default tmdbApi;
