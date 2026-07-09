import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, useReducedMotion } from 'framer-motion'
import MovieCard from '../components/MovieCard'
import SkeletonCard from '../components/SkeletonCard'
import LoadingSpinner from '../components/LoadingSpinner'
import useInfiniteScroll from '../hooks/useInfiniteScroll'
import { searchMovies, getPopular, getGenres, discoverMovies } from '../services/tmdb'
import { normalizeMovieResults } from '../utils/media'

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
  const [debouncedQ, setDebouncedQ] = useState(query)
  const [sortBy, setSortBy] = useState('default')
  
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const shouldReduceMotion = useReducedMotion()

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore || isLoading) return
    setPage((prevPage) => prevPage + 1)
  }, [isLoadingMore, hasMore, isLoading])

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoading || isLoadingMore,
    onLoadMore: loadMore,
  })

  // Debouncing effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQ(localQ)
      if (localQ.trim()) {
        setSearchParams({ q: localQ.trim() })
      } else {
        setSearchParams({})
      }
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [localQ, setSearchParams])

  // Reset page and results when query changes
  useEffect(() => {
    setMovies([])
    setPage(1)
    setHasMore(true)
  }, [debouncedQ])

  const [genres, setGenres] = useState([])

  // Fetch Genres for parsing
  useEffect(() => {
    const fetchG = async () => {
      try {
        const data = await getGenres()
        setGenres(data.genres || [])
      } catch (e) {}
    }
    fetchG()
  }, [])

  // Fetch effect
  useEffect(() => {
    const fetchResults = async () => {
      if (page === 1) setIsLoading(true)
      else setIsLoadingMore(true)

      try {
        const q = debouncedQ.trim().toLowerCase()
        let newData = []
        let totalPages = 1

        if (q) {
          // Natural Language parsing
          const genreMatch = genres.find(g => q.includes(g.name.toLowerCase()))
          const yearMatch = q.match(/\b(19|20)\d{2}\b/)
          const isSmartQuery = genreMatch || yearMatch

          if (isSmartQuery) {
            // Use Discover API for smart queries
            const params = {
              sort_by: 'popularity.desc',
              page: page
            }
            if (genreMatch) params.with_genres = genreMatch.id
            if (yearMatch) params.primary_release_year = yearMatch[0]
            
            const data = await discoverMovies(params)
            newData = normalizeMovieResults(data.results, 'movie')
            totalPages = data.total_pages
          } else {
            // Use Search API for normal title queries
            const data = await searchMovies(debouncedQ, page)
            newData = normalizeMovieResults(data.results, 'movie')
            totalPages = data.total_pages
          }
        } else {
          const data = await getPopular(page)
          newData = normalizeMovieResults(data.results, 'movie')
          totalPages = data.total_pages
        }

        setMovies(prev => {
          // avoid duplicates
          const existingIds = new Set(prev.map(m => m.id))
          const filteredNew = newData.filter(m => !existingIds.has(m.id))
          return page === 1 ? newData : [...prev, ...filteredNew]
        })
        
        setHasMore(page < totalPages && newData.length > 0)
      } catch (err) {
        console.error('Search failed:', err)
        if (page === 1) setMovies([])
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    }

    if (genres.length > 0 || !debouncedQ.trim()) {
      fetchResults()
    }
  }, [debouncedQ, genres, page])

  const results = useMemo(() => {
    let list = [...movies]

    switch (sortBy) {
      case 'rating-desc':
        list.sort((a, b) => b.vote_average - a.vote_average)
        break
      case 'rating-asc':
        list.sort((a, b) => a.vote_average - b.vote_average)
        break
      case 'year-desc':
        list.sort(
          (a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0)
        )
        break
      case 'year-asc':
        list.sort(
          (a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0)
        )
        break
      case 'title-asc':
        list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
        break
      default:
        break
    }

    return list
  }, [movies, sortBy])

  const handleSearch = (e) => {
    e.preventDefault()
    setDebouncedQ(localQ)
    if (localQ.trim()) {
      setSearchParams({ q: localQ.trim() })
    } else {
      setSearchParams({})
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  }

  return (
    <>
      <Helmet>
        <title>{debouncedQ ? `Search: ${debouncedQ} — CineFlow` : 'Search Movies — CineFlow'}</title>
        <meta name="description" content="Search for movies and TV shows on CineFlow." />
      </Helmet>
      <div className="min-h-screen bg-brand-bg pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-white mb-8">
          {debouncedQ ? (
            <>
              Results for{' '}
              <span className="text-gradient-red">"{debouncedQ}"</span>
            </>
          ) : (
            'Browse Popular Movies'
          )}
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 flex items-center glass rounded-xl px-4 py-3 border border-brand-border focus-within:border-brand-gold/60 transition-colors duration-200">
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
        <div className="flex flex-wrap gap-3 mb-8 items-center justify-end">
          {/* Sort */}
          <div className="ml-auto">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass border border-brand-border text-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-brand-gold/60 transition-colors bg-transparent cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-brand-card text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
            >
              {results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} lowPriority />
              ))}
              {isLoadingMore && Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={`skeleton-search-${i}`} />
              ))}
            </motion.div>
            
            {/* Sentinel Intersection and Loading More UI */}
            <div ref={sentinelRef} className="w-full py-12 flex flex-col items-center justify-center min-h-[120px]">
              {isLoadingMore && <LoadingSpinner />}
              {!hasMore && results.length > 0 && (
                <p className="text-gray-500 font-semibold text-sm">No more results</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg className="w-16 h-16 text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-400 text-xl font-semibold mb-2">No movies found</p>
            <p className="text-gray-600 text-sm">Try a different search term.</p>
          </div>
        )}
      </div>
    </>
  )
}
