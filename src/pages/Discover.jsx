import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { discoverMovies, discoverTv } from '../services/tmdb'
import { useDiscoverStore } from '../store/discoverStore'
import { normalizeMovieResults } from '../utils/media'
import MovieCard from '../components/MovieCard'
import DiscoverFilters from '../components/DiscoverFilters'
import LoadingSpinner from '../components/LoadingSpinner'
import SkeletonCard from '../components/SkeletonCard'
import useInfiniteScroll from '../hooks/useInfiniteScroll'

export default function Discover() {
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [showSmartDiscovery, setShowSmartDiscovery] = useState(false)
  const { filters } = useDiscoverStore()
  const location = useLocation()
  const isTv = location.search.includes('type=tv')
  const pageTitle = isTv ? 'TV Shows' : 'Movies'

  const loadMore = useCallback(async () => {
    if (isFetchingMore || !hasMore || isLoading) return

    setIsFetchingMore(true)
    const nextPage = page + 1

    try {
      const params = {
        ...filters,
        with_genres: filters.with_genres.join(','),
        page: nextPage,
      }
      const discoverFn = isTv ? discoverTv : discoverMovies
      const data = await discoverFn(params)
      const newResults = normalizeMovieResults(data.results, isTv ? 'tv' : 'movie')

      setMovies((prev) => {
        const existingIds = new Set(prev.map((movie) => movie.id))
        const filtered = newResults.filter((movie) => !existingIds.has(movie.id))
        return [...prev, ...filtered]
      })
      setPage(nextPage)
      setHasMore(data.page < data.total_pages && newResults.length > 0)
    } catch (err) {
      console.error('Failed to load more movies:', err)
    } finally {
      setIsFetchingMore(false)
    }
  }, [page, isFetchingMore, hasMore, isLoading, filters, isTv])

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoading || isFetchingMore,
    onLoadMore: loadMore,
    enabled: !isLoading,
  })

  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true)
      setPage(1)
      setHasMore(true)
      try {
        const params = {
          ...filters,
          with_genres: filters.with_genres.join(','),
          page: 1,
        }
        const discoverFn = isTv ? discoverTv : discoverMovies
        const data = await discoverFn(params)
        setMovies(normalizeMovieResults(data.results, isTv ? 'tv' : 'movie'))
        setHasMore(data.page < data.total_pages)
      } catch (err) {
        console.error('Failed to discover movies:', err)
        setMovies([])
        setHasMore(false)
      } finally {
        setIsLoading(false)
      }
    }

    const handler = setTimeout(() => {
      fetchInitial()
    }, 500)

    return () => clearTimeout(handler)
  }, [filters, isTv])

  return (
    <div className="min-h-screen bg-brand-bg pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white">{pageTitle}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isTv ? 'Discover the best TV shows' : 'Discover the best movies'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSmartDiscovery((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
            showSmartDiscovery
              ? 'bg-brand-gold text-brand-bg border-brand-gold shadow-glow-gold'
              : 'bg-transparent text-brand-gold border-brand-gold hover:bg-brand-gold/10'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Smart Discovery
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${showSmartDiscovery ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showSmartDiscovery && (
          <motion.div
            key="smart-discovery-panel"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <DiscoverFilters />
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-2xl font-bold text-white mb-6">
        {showSmartDiscovery ? 'Filtered Results' : 'Discovery Results'}
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {movies.map((movie, index) => (
              <MovieCard key={`${movie.id}-${index}`} movie={movie} lowPriority />
            ))}
            {isFetchingMore &&
              Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={`skeleton-discover-${i}`} />
              ))}
          </div>

          <div
            ref={sentinelRef}
            className="w-full py-12 flex flex-col items-center justify-center min-h-[120px]"
          >
            {isFetchingMore && <LoadingSpinner />}
            {!hasMore && (
              <p className="text-gray-500 font-semibold text-sm">You've reached the end of the list.</p>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <svg className="w-16 h-16 text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-400 text-xl font-semibold mb-2">No {isTv ? 'TV shows' : 'movies'} found</p>
          <p className="text-gray-600 text-sm">Try adjusting your filters.</p>
        </div>
      )}

    </div>
  )
}
