import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import HeroBanner from '../components/HeroBanner'
import AnimeHero from '../components/AnimeHero'
import Row from '../components/Row'
import MovieCard from '../components/MovieCard'
import SkeletonCard from '../components/SkeletonCard'
import LoadingSpinner from '../components/LoadingSpinner'
import useInfiniteScroll from '../hooks/useInfiniteScroll'
import { getTrending, getPopular, getTopRated, getUpcoming, discoverMovies } from '../services/tmdb'
import { normalizeMovieResults } from '../utils/media'
import { useContinueWatching } from '../context/ContinueWatchingContext'

export default function Home() {
  const [trending, setTrending] = useState([])
  const [popular, setPopular] = useState([])
  const [topRated, setTopRated] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [anime, setAnime] = useState([])
  const [heroMovies, setHeroMovies] = useState([])
  const [animeHero, setAnimeHero] = useState(null)
  const { history } = useContinueWatching()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Infinite scroll extra states
  const [moreMovies, setMoreMovies] = useState([])
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const loadedIdsRef = useRef(new Set())

  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const results = await Promise.allSettled([
          getTrending(),
          getPopular(),
          getTopRated(),
          getUpcoming(),
          discoverMovies({ with_genres: 16, sort_by: 'popularity.desc', page: 1 }),
        ])

        const [trendingRes, popularRes, topRatedRes, upcomingRes, animeRes] = results

        const allFailed = results.every(r => r.status === 'rejected')
        if (allFailed) {
          const firstError = results[0].reason
          const apiMessage = firstError?.response?.data?.status_message
          throw new Error(
            apiMessage ||
              firstError?.message ||
              'Unable to connect to the movie database. Please check your connection and try again.'
          )
        }

        const extract = (res) =>
          res.status === 'fulfilled' ? normalizeMovieResults(res.value?.results, 'movie') : []

        const trendingData = extract(trendingRes)
        const popularData = extract(popularRes)
        const topRatedData = extract(topRatedRes)
        const upcomingData = extract(upcomingRes)
        const animeData = extract(animeRes)

        setTrending(trendingData)
        setPopular(popularData)
        setTopRated(topRatedData)
        setUpcoming(upcomingData)
        setAnime(animeData)

        // Seed loaded IDs set to avoid duplicates in infinite scroll
        const allInitial = [...trendingData, ...popularData, ...topRatedData, ...upcomingData, ...animeData]
        allInitial.forEach((movie) => {
          if (movie?.id) loadedIdsRef.current.add(movie.id)
        })

        const featured = [...trendingData, ...popularData].filter(
          (movie, i, list) =>
            movie.backdrop_path &&
            list.findIndex((m) => m.id === movie.id) === i
        )
        setHeroMovies(featured.slice(0, 10))
        if (animeData.length > 0) {
          setAnimeHero(animeData[0])
        }
      } catch (err) {
        console.error('Failed to load movies:', err)
        setError(err.message || 'Something went wrong. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoading) return
    setIsLoadingMore(true)
    try {
      const data = await getPopular(page)
      const newMovies = normalizeMovieResults(data.results, 'movie')
      
      const filtered = newMovies.filter(m => m && !loadedIdsRef.current.has(m.id))
      filtered.forEach(m => loadedIdsRef.current.add(m.id))

      setMoreMovies((prev) => [...prev, ...filtered])
      setPage((prev) => prev + 1)
      setHasMore(data.page < data.total_pages && newMovies.length > 0)
    } catch (err) {
      console.error('Failed to load more movies on Home page:', err)
    } finally {
      setIsLoadingMore(false)
    }
  }, [page, isLoadingMore, hasMore, isLoading])

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoading || isLoadingMore,
    onLoadMore: loadMore,
    enabled: !isLoading,
    rootMargin: '200px',
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-brand-text mb-2">Oops! Something went wrong.</h2>
        <p className="text-brand-muted mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>MovieXD — Watch Cinematic Movies & Shows</title>
        <meta name="description" content="Discover, watch, and track the best movies and shows on MovieXD." />
        <meta property="og:title" content="MovieXD — Watch Cinematic Movies & Shows" />
        <meta property="og:description" content="Discover, watch, and track the best movies and shows on MovieXD." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen bg-brand-bg">
        {heroMovies.length > 0 ? (
          <HeroBanner movies={heroMovies} />
        ) : (
          <div className="w-full min-h-[92vh] md:min-h-screen bg-brand-surface animate-pulse" />
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10 -mt-8 pb-20 space-y-12"
        >
          {history && history.length > 0 && (
            <Row title="Continue Watching" movies={history} isLoading={false} />
          )}
          <Row title="Trending Now" movies={trending} badge="Hot" isLoading={isLoading} priorityCount={6} />
          <Row title="Popular on MovieXD" movies={popular} isLoading={isLoading} seeAllLink="/discover" />

          {!isLoading && animeHero && <AnimeHero movie={animeHero} />}

          <Row
            title="Anime & Animation"
            movies={anime}
            badge="Anime"
            variant="anime"
            isLoading={isLoading}
            seeAllLink="/genre/16"
          />
          <Row title="Top Rated" movies={topRated} isLoading={isLoading} />
          <Row title="Coming Soon" movies={upcoming} badge="New" isLoading={isLoading} />

          {/* Explore More Infinite Grid */}
          {!isLoading && (
            <div className="pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-brand-text mb-6 px-4 sm:px-6 lg:px-8">
                Explore More
              </h2>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 px-4 sm:px-6 lg:px-8"
              >
                {moreMovies.map((movie, index) => (
                  <MovieCard key={`${movie.id}-${index}`} movie={movie} lowPriority />
                ))}
                {isLoadingMore &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={`skeleton-home-${i}`} />
                  ))}
              </motion.div>

              <div
                ref={sentinelRef}
                className="w-full py-10 flex flex-col items-center justify-center min-h-[120px]"
              >
                {isLoadingMore && moreMovies.length === 0 && <LoadingSpinner />}
                {!hasMore && moreMovies.length > 0 && (
                  <p className="text-gray-500 font-semibold text-sm">No more results</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  )
}
