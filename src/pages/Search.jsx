import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import {
  MOCK_TRENDING,
  MOCK_POPULAR,
  MOCK_TOP_RATED,
  MOCK_UPCOMING,
  GENRE_MAP,
} from '../data/mockData'

const ALL_MOVIES = [
  ...MOCK_TRENDING,
  ...MOCK_POPULAR,
  ...MOCK_TOP_RATED,
  ...MOCK_UPCOMING,
].filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i)

const GENRES = [...new Set(ALL_MOVIES.flatMap((m) => m.genre_ids || []))]
  .map((id) => ({ id, name: GENRE_MAP[id] || 'Other' }))
  .sort((a, b) => a.name.localeCompare(b.name))

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'rating-desc', label: 'Rating: High to Low' },
  { value: 'rating-asc', label: 'Rating: Low to High' },
  { value: 'year-desc', label: 'Newest First' },
  { value: 'year-asc', label: 'Oldest First' },
  { value: 'title-asc', label: 'A - Z' },
]

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [localQ, setLocalQ] = useState(query)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [sortBy, setSortBy] = useState('default')

  const results = useMemo(() => {
    let list = ALL_MOVIES

    if (query) {
      list = list.filter((m) =>
        m.title.toLowerCase().includes(query.toLowerCase())
      )
    }

    if (selectedGenre) {
      list = list.filter((m) => (m.genre_ids || []).includes(selectedGenre))
    }

    switch (sortBy) {
      case 'rating-desc':
        list = [...list].sort((a, b) => b.vote_average - a.vote_average)
        break
      case 'rating-asc':
        list = [...list].sort((a, b) => a.vote_average - b.vote_average)
        break
      case 'year-desc':
        list = [...list].sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        )
        break
      case 'year-asc':
        list = [...list].sort(
          (a, b) => new Date(a.release_date) - new Date(b.release_date)
        )
        break
      case 'title-asc':
        list = [...list].sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }

    return list
  }, [query, selectedGenre, sortBy])

  const handleSearch = (e) => {
    e.preventDefault()
    if (localQ.trim()) {
      setSearchParams({ q: localQ.trim() })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-white mb-8">
        {query ? (
          <>
            Results for{' '}
            <span className="text-gradient-red">"{query}"</span>
          </>
        ) : (
          'Browse All Movies'
        )}
      </h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <div className="flex-1 flex items-center glass rounded-xl px-4 py-3 border border-brand-border focus-within:border-brand-red/60 transition-colors duration-200">
            <svg className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search-page-input"
              type="text"
              value={localQ}
              onChange={(e) => setLocalQ(e.target.value)}
              placeholder="Search movies..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
            />
            {localQ && (
              <button
                type="button"
                onClick={() => { setLocalQ(''); setSearchParams({}) }}
                className="text-gray-500 hover:text-white transition-colors ml-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            id="search-submit-btn"
            type="submit"
            className="btn-primary px-6"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 items-center">
        {/* Genre Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGenre(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              !selectedGenre
                ? 'bg-brand-red text-white'
                : 'glass border border-brand-border text-gray-400 hover:text-white hover:border-white/30'
            }`}
          >
            All
          </button>
          {GENRES.slice(0, 10).map((g) => (
            <button
              key={g.id}
              id={`genre-filter-${g.id}`}
              onClick={() => setSelectedGenre(selectedGenre === g.id ? null : g.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedGenre === g.id
                  ? 'bg-brand-red text-white'
                  : 'glass border border-brand-border text-gray-400 hover:text-white hover:border-white/30'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="ml-auto">
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass border border-brand-border text-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-brand-red/60 transition-colors bg-transparent cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-brand-card text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-gray-500 text-sm mb-6">
        {results.length} {results.length === 1 ? 'movie' : 'movies'} found
      </p>

      {/* Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <svg className="w-16 h-16 text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-400 text-xl font-semibold mb-2">No movies found</p>
          <p className="text-gray-600 text-sm">Try a different search term or remove filters.</p>
        </div>
      )}
    </div>
  )
}
