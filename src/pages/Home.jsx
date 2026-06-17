import { useState, useEffect } from 'react'
import HeroBanner from '../components/HeroBanner'
import Row from '../components/Row'
import { getTrending, getPopular, getTopRated, getUpcoming } from '../services/tmdb'

export default function Home() {
  const [trending, setTrending] = useState([])
  const [popular, setPopular] = useState([])
  const [topRated, setTopRated] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [heroMovie, setHeroMovie] = useState(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [trendingData, popularData, topRatedData, upcomingData] = await Promise.all([
          getTrending(),
          getPopular(),
          getTopRated(),
          getUpcoming()
        ])

        setTrending(trendingData.results || [])
        setPopular(popularData.results || [])
        setTopRated(topRatedData.results || [])
        setUpcoming(upcomingData.results || [])

        if (trendingData.results && trendingData.results.length > 0) {
          setHeroMovie(trendingData.results[0])
        }
      } catch (err) {
        console.error('Failed to load movies:', err)
        setError('Failed to load movies. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong.</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Hero */}
      {heroMovie ? (
        <HeroBanner movie={heroMovie} />
      ) : (
        <div className="w-full min-h-[90vh] md:min-h-screen bg-gray-900 animate-pulse" />
      )}

      {/* Primary Rows */}
      <div className="relative z-10 -mt-8 pb-16 space-y-10">
        <Row title="Trending Now" movies={trending} badge="Hot" isLoading={isLoading} />
        <Row title="Popular on MovieXD" movies={popular} isLoading={isLoading} />
        <Row title="Top Rated" movies={topRated} isLoading={isLoading} />
        <Row title="Coming Soon" movies={upcoming} badge="New" isLoading={isLoading} />
      </div>
    </div>
  )
}
