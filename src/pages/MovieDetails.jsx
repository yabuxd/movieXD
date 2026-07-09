import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useWatchlist } from '../context/WatchlistContext'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { useContinueWatching } from '../context/ContinueWatchingContext'
import { getMovieDetails } from '../services/tmdb'
import useMoviePlayer from '../hooks/useMoviePlayer'
import LoadingSpinner from '../components/LoadingSpinner'
import VideoPlayer from '../components/VideoPlayer'
import GenreRecommendations from '../components/GenreRecommendations'
import { getMediaTitle, getMediaYear } from '../utils/media'

export default function MovieDetails() {
  const { id } = useParams()
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addToHistory } = useContinueWatching()
  const { isAuthenticated } = useAuth()

  const [movie, setMovie] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const {
    source: playerSource,
    embedUrl: playerEmbedUrl,
    isResolving: isPlayerResolving,
    error: playerError,
    sources: playerSources,
    resolve: resolvePlayer,
    switchSource,
    reset: resetPlayer,
  } = useMoviePlayer()

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true)
      setError(null)
      resetPlayer()
      try {
        const data = await getMovieDetails(id)
        setMovie(data)
        addToHistory(data)

        const trailer = data.videos?.results?.find(
          (v) => v.site === 'YouTube' && v.type === 'Trailer'
        ) || data.videos?.results?.find((v) => v.site === 'YouTube')
        resolvePlayer(data.title, trailer?.key, false, null, getMediaYear(data))
      } catch (err) {
        console.error('Failed to load movie details:', err)
        setError('Failed to load movie details. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetail()
    window.scrollTo(0, 0)
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-white text-2xl font-bold mb-4">{error || 'Movie not found'}</h1>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    )
  }

  const title = getMediaTitle(movie)
  const year = getMediaYear(movie)
  const rating = movie.vote_average > 0 ? movie.vote_average.toFixed(1) : 'N/A'
  const genres = (movie.genres || []).map((g) => g.name)
  const inWatchlist = isInWatchlist(movie.id)

  return (
    <>
      <Helmet>
        <title>{title} — MovieXD</title>
        <meta name="description" content={movie.overview?.substring(0, 160) || `Watch ${title} on MovieXD.`} />
      </Helmet>

      <div className="min-h-screen bg-brand-bg pt-20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium bg-brand-surface/80 px-3 py-1.5 rounded-full border border-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>

            {isAuthenticated && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleWatchlist(movie)}
                  className={`btn-secondary text-sm py-2 ${inWatchlist ? 'border-red-500/50 text-red-400' : ''}`}
                >
                  {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(movie)}
                  className={`btn-secondary text-sm py-2 ${isFavorite(movie.id) ? 'border-red-500 text-red-400' : ''}`}
                >
                  {isFavorite(movie.id) ? 'Favorited' : 'Favorite'}
                </button>
              </div>
            )}
          </div>

          <div className="w-full min-h-[calc(100vh-12rem)] rounded-2xl overflow-hidden border border-brand-border shadow-2xl">
            <VideoPlayer
              title={title}
              embedUrl={playerEmbedUrl}
              isResolving={isPlayerResolving}
              error={playerError}
              source={playerSource}
              sources={playerSources}
              onSwitchSource={switchSource}
              className="min-h-[calc(100vh-12rem)]"
            />
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap gap-2 mb-3">
              {genres.map((g) => (
                <span key={g} className="badge-gold">{g}</span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
              <span className="text-[#D4AF37] font-bold">{rating} / 10</span>
              <span className="text-gray-400">{year}</span>
              {movie.runtime > 0 && <span className="text-gray-400">{movie.runtime} min</span>}
            </div>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              {movie.overview || 'No description available.'}
            </p>
          </div>

          <GenreRecommendations item={movie} mediaType="movie" />
        </div>
      </div>
    </>
  )
}
