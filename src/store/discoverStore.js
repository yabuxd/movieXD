import { create } from 'zustand'

export const useDiscoverStore = create((set) => ({
  filters: {
    with_genres: [],
    primary_release_year: '',
    'vote_average.gte': '',
    with_original_language: '',
    'with_runtime.gte': '',
    sort_by: 'popularity.desc',
  },
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  toggleGenre: (genreId) => set((state) => {
    const genres = state.filters.with_genres;
    const newGenres = genres.includes(genreId)
      ? genres.filter(id => id !== genreId)
      : [...genres, genreId];
    return { filters: { ...state.filters, with_genres: newGenres } }
  }),
  resetFilters: () => set({
    filters: {
      with_genres: [],
      primary_release_year: '',
      'vote_average.gte': '',
      with_original_language: '',
      'with_runtime.gte': '',
      sort_by: 'popularity.desc',
    }
  })
}))
