import { useState, useEffect, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { getGenres, discoverMovies } from '../services/tmdb'
import { useDiscoverStore } from '../store/discoverStore'
import GenreCard from '../components/GenreCard'
import MovieCard from '../components/MovieCard'
import DiscoverFilters from '../components/DiscoverFilters'
import LoadingSpinner from '../components/LoadingSpinner'
import SkeletonCard from '../components/SkeletonCard'

export default function Discover() {
  const [genres, setGenres] = useState([])
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const { filters } = useDiscoverStore()
  
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '400px',
  })

  // Fetch Genres for navigation
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres()
        setGenres(data.genres || [])
      } catch (err) {
        console.error('Failed to load genres', err)
      }
    }
    fetchGenres()
  }, [])

  // Initial Fetch based on filters
  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true)
      setPage(1)
      try {
        const params = {
          ...filters,
          with_genres: filters.with_genres.join(','),
          page: 1,
        }
        const data = await discoverMovies(params)
        setMovies(data.results || [])
        setHasMore(data.page < data.total_pages)
      } catch (err) {
        console.error('Failed to discover movies:', err)
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce to avoid spamming while user changes filters
    const handler = setTimeout(() => {
      fetchInitial()
    }, 500)

    return () => clearTimeout(handler)
  }, [filters])

  // Infinite Scroll Fetch
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
      const data = await discoverMovies(params)
      setMovies(prev => [...prev, ...data.results])
      setPage(nextPage)
      setHasMore(data.page < data.total_pages)
    } catch (err) {
      console.error('Failed to load more movies:', err)
    } finally {
      setIsFetchingMore(false)
    }
  }, [page, isFetchingMore, hasMore, isLoading, filters])

  useEffect(() => {
    if (inView) {
      loadMore()
    }
  }, [inView, loadMore])

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
      
      {/* 1. Genre Navigation */}
      <div className="mb-16">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Explore Genres</h1>
        <p className="text-gray-400 mb-8">Discover movies perfectly suited to your mood.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {genres.length > 0 ? (
            genres.map(genre => <GenreCard key={genre.id} genre={genre} />)
          ) : (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-gray-800 animate-pulse" />
            ))
          )}
        </div>
      </div>

      {/* 2. Smart Discovery */}
      <DiscoverFilters />

      {/* 3. Movie Grid */}
      <h2 className="text-2xl font-bold text-white mb-6">Discovery Results</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {movies.map((movie, index) => (
              <MovieCard key={`${movie.id}-${index}`} movie={movie} />
            ))}
          </div>
          
          {/* Infinite Scroll trigger */}
          <div ref={ref} className="w-full py-12 flex justify-center">
            {isFetchingMore && <LoadingSpinner />}
            {!hasMore && <p className="text-gray-500">You've reached the end of the list.</p>}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <svg className="w-16 h-16 text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-400 text-xl font-semibold mb-2">No movies found</p>
          <p className="text-gray-600 text-sm">Try adjusting your filters.</p>
        </div>
      )}

    </div>
  )
}
