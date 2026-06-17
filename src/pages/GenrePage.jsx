import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { discoverMovies, getGenres } from '../services/tmdb'
import MovieCard from '../components/MovieCard'
import LoadingSpinner from '../components/LoadingSpinner'
import SkeletonCard from '../components/SkeletonCard'

export default function GenrePage() {
  const { id } = useParams()
  const [genreName, setGenreName] = useState('Genre')
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [totalResults, setTotalResults] = useState(0)
  
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '400px',
  })

  // Fetch genre name
  useEffect(() => {
    const fetchGenreName = async () => {
      try {
        const data = await getGenres()
        const genre = data.genres?.find(g => g.id === Number(id))
        if (genre) setGenreName(genre.name)
      } catch (err) {
        console.error('Failed to load genre name', err)
      }
    }
    fetchGenreName()
  }, [id])

  // Initial Fetch
  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true)
      setPage(1)
      window.scrollTo(0, 0)
      
      try {
        const data = await discoverMovies({
          with_genres: id,
          page: 1,
          sort_by: 'popularity.desc'
        })
        setMovies(data.results || [])
        setHasMore(data.page < data.total_pages)
        setTotalResults(data.total_results)
      } catch (err) {
        console.error('Failed to load genre movies:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitial()
  }, [id])

  // Infinite Scroll Fetch
  const loadMore = useCallback(async () => {
    if (isFetchingMore || !hasMore || isLoading) return

    setIsFetchingMore(true)
    const nextPage = page + 1
    
    try {
      const data = await discoverMovies({
        with_genres: id,
        page: nextPage,
        sort_by: 'popularity.desc'
      })
      setMovies(prev => [...prev, ...data.results])
      setPage(nextPage)
      setHasMore(data.page < data.total_pages)
    } catch (err) {
      console.error('Failed to load more movies:', err)
    } finally {
      setIsFetchingMore(false)
    }
  }, [page, isFetchingMore, hasMore, isLoading, id])

  useEffect(() => {
    if (inView) {
      loadMore()
    }
  }, [inView, loadMore])

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Hero Banner */}
      <div className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto border-b border-white/10 bg-gradient-to-br from-brand-red/10 to-transparent">
        <Link to="/discover" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Discover
        </Link>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
          {genreName} Movies
        </h1>
        <p className="text-gray-400 text-lg">
          {!isLoading && `${totalResults.toLocaleString()} titles available`}
        </p>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
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
          </div>
        )}
      </div>
    </div>
  )
}
