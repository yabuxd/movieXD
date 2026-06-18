import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import HeroBanner from '../components/HeroBanner'
import AnimeHero from '../components/AnimeHero'
import Row from '../components/Row'
import { getTrending, getPopular, getTopRated, getUpcoming, discoverMovies } from '../services/tmdb'

export default function Home() {
  const [trending, setTrending] = useState([])
  const [popular, setPopular] = useState([])
  const [topRated, setTopRated] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [anime, setAnime] = useState([])
  const [heroMovie, setHeroMovie] = useState(null)
  const [animeHero, setAnimeHero] = useState(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Use allSettled so partial failures don't break the entire page
        const results = await Promise.allSettled([
          getTrending(),
          getPopular(),
          getTopRated(),
          getUpcoming(),
          discoverMovies({ with_genres: 16, sort_by: 'popularity.desc', page: 1 }),
        ])

        const [trendingRes, popularRes, topRatedRes, upcomingRes, animeRes] = results

        // Check if ALL requests failed
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

        // Extract successful results (gracefully handle individual failures)
        const extract = (res) => res.status === 'fulfilled' ? (res.value?.results || []) : []

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

        if (trendingData.length > 0) {
          setHeroMovie(trendingData[0])
        }
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
    <div className="min-h-screen bg-brand-bg">
      {heroMovie ? (
        <HeroBanner movie={heroMovie} />
      ) : (
        <div className="w-full min-h-[92vh] md:min-h-screen bg-brand-surface animate-pulse" />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 -mt-8 pb-20 space-y-12"
      >
        <Row title="Trending Now" movies={trending} badge="Hot" isLoading={isLoading} />
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
      </motion.div>
    </div>
  )
}
