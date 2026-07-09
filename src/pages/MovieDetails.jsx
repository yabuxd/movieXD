import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useWatchlist } from '../context/WatchlistContext'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { useContinueWatching } from '../context/ContinueWatchingContext'
import { getMovieDetails } from '../services/tmdb'
import useMoviePlayer from '../hooks/useMoviePlayer'
import LoadingSpinner from '../components/LoadingSpinner'
import { tmdbImageUrl, BACKDROP, POSTER } from '../utils/tmdbImages'

export default function MovieDetails() {
  const { id } = useParams()
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addToHistory, updateProgress, history } = useContinueWatching()
  const { isAuthenticated } = useAuth()
  
  const [movie, setMovie] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imgError, setImgError] = useState(false)

  // Full Movie Player States
  const {
    source: playerSource,
    embedUrl: playerEmbedUrl,
    isResolving: isPlayerResolving,
    error: playerError,
    sources: playerSources,
    resolve: resolvePlayer,
    fallbackToTrailer,
    switchSource,
    reset: resetPlayer,
  } = useMoviePlayer()

  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(15)

  const castRef = useRef(null)
  const similarRef = useRef(null)
  const recommendationsRef = useRef(null)

  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getMovieDetails(id)
        setMovie(data)
        addToHistory(data)
      } catch (err) {
        console.error('Failed to load movie details:', err)
        setError('Failed to load movie details. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDetail()
    // Reset window scroll on mount/id change
    window.scrollTo(0, 0)
  }, [id])

  // Sync state progress from Continue Watching history
  useEffect(() => {
    if (isPlayerOpen && movie) {
      const historyItem = history.find((h) => String(h.id) === String(movie.id))
      if (historyItem?.progress !== undefined) {
        setCurrentProgress(historyItem.progress)
      } else {
        setCurrentProgress(15)
      }
    }
  }, [isPlayerOpen, movie, history])

  // Simulate active progress increments while watching
  useEffect(() => {
    let interval
    if (isPlayerOpen && !isPlayerResolving && playerEmbedUrl && movie?.id) {
      interval = setInterval(() => {
        setCurrentProgress((prev) => {
          const next = Math.min(100, prev + 1)
          updateProgress(movie.id, next)
          return next
        })
      }, 15000) // Increments by 1% every 15 seconds
    }
    return () => clearInterval(interval)
  }, [isPlayerOpen, isPlayerResolving, playerEmbedUrl, movie?.id, updateProgress])

  // Handle ESC key press to close player modal and handle scroll locking
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsPlayerOpen(false)
        resetPlayer()
      }
    }
    if (isPlayerOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isPlayerOpen, resetPlayer])

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
        <p className="text-gray-500 text-6xl mb-4">Oops</p>
        <h1 className="text-white text-2xl font-bold mb-4">{error || 'Movie not found'}</h1>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    )
  }

  const inWatchlist = isInWatchlist(movie.id)
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'
  const rating = movie.vote_average > 0 ? movie.vote_average.toFixed(1) : 'N/A'
  const genres = (movie.genres || []).map(g => g.name)

  const related = (movie.similar?.results || []).slice(0, 12)
  const recommendations = (movie.recommendations?.results || []).slice(0, 12)
  const cast = (movie.credits?.cast || []).slice(0, 12)
  
  // Find trailer key
  const trailer = movie.videos?.results?.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer'
  ) || movie.videos?.results?.find((video) => video.site === 'YouTube')
  const trailerKey = trailer?.key

  const backdropSrc = tmdbImageUrl(movie.backdrop_path, BACKDROP.hero) || null
  const posterSrc = tmdbImageUrl(movie.poster_path, POSTER.detail) || backdropSrc

  const scrollContainer = (ref, dir) => {
    if (!ref.current) return
    const amount = ref.current.offsetWidth * 0.75
    ref.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <>
      <Helmet>
        <title>{movie.title} — MovieXD</title>
        <meta name="description" content={movie.overview ? movie.overview.substring(0, 160) : `Watch ${movie.title} on MovieXD.`} />
        <meta property="og:title" content={`${movie.title} — MovieXD`} />
        <meta property="og:description" content={movie.overview ? movie.overview.substring(0, 160) : `Watch ${movie.title} on MovieXD.`} />
        {backdropSrc && <meta property="og:image" content={backdropSrc} />}
        <meta property="og:type" content="video.movie" />
      </Helmet>
      <div className="min-h-screen bg-brand-bg relative">
        {/* Backdrop Section */}
        <div className="relative h-[50vh] md:h-[65vh] overflow-hidden">
          {backdropSrc && !imgError ? (
            <img
              src={backdropSrc}
              alt={movie.title}
              onError={() => setImgError(true)}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-card via-brand-surface to-brand-bg" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-bg/80 to-transparent" />

          {/* Back button */}
          <Link
            to="/"
            id="movie-detail-back-btn"
            className="absolute top-24 left-4 sm:left-8 flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium z-20 bg-brand-bg/60 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
        </div>

        {/* Details Container */}
        <div className="relative z-10 -mt-40 md:-mt-56 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster Card */}
            <div className="flex-shrink-0 w-44 sm:w-56 mx-auto md:mx-0">
              <div className="rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/10 aspect-[2/3] bg-brand-card">
                {posterSrc && !imgError ? (
                  <img
                    src={posterSrc}
                    alt={movie.title}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Info Details */}
            <div className="flex-1 text-center md:text-left">
              {/* Genres Badges */}
              <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                {genres.map((g) => (
                  <span key={g} className="badge-gold">{g}</span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight">
                {movie.title}
              </h1>

              {/* Meta statistics row */}
              <div className="flex flex-wrap items-center gap-4 mb-6 justify-center md:justify-start">
                <div className="flex items-center gap-1.5">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-[#D4AF37] font-bold text-lg">{rating}</span>
                  <span className="text-gray-500 text-sm">/10</span>
                </div>
                <span className="text-gray-400 font-medium">{year}</span>
                {movie.runtime > 0 && (
                  <span className="text-gray-400 font-medium">{movie.runtime} min</span>
                )}
                <span className="badge-gold">4K</span>
                <span className="badge-gold">HDR</span>
              </div>

              {/* Overview / Tagline */}
              {movie.tagline && (
                <p className="text-[#D4AF37]/90 text-sm italic font-medium mb-3 tracking-wide">
                  "{movie.tagline}"
                </p>
              )}
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto md:mx-0">
                {movie.overview || 'No description available for this title.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <button
                  id="detail-play-btn"
                  onClick={() => {
                    setIsPlayerOpen(true)
                    resolvePlayer(movie.title, trailerKey)
                  }}
                  className="btn-primary text-base font-bold flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Full Movie
                </button>

                <button
                  id="detail-trailer-btn"
                  onClick={() => {
                    if (trailerKey) {
                      setIsPlayerOpen(true)
                      fallbackToTrailer(trailerKey)
                    }
                  }}
                  disabled={!trailerKey}
                  className={`btn-secondary text-base ${!trailerKey ? 'opacity-50 cursor-not-allowed border-gray-600 text-gray-500 hover:bg-transparent hover:transform-none hover:shadow-none' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {trailerKey ? 'Watch Trailer' : 'Trailer N/A'}
                </button>

                {isAuthenticated && (
                  <>
                    <button
                      id="detail-watchlist-btn"
                      onClick={() => {
                        toggleWatchlist(movie)
                      }}
                      className={`btn-secondary text-base ${inWatchlist ? 'border-red-500/50 text-red-400 bg-red-500/10 hover:border-red-500 hover:text-white' : ''}`}
                    >
                      {inWatchlist ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Remove from Watchlist
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          Add to Watchlist
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      id="detail-favorite-btn"
                      onClick={() => {
                        toggleFavorite(movie)
                      }}
                      className={`btn-secondary text-base ${isFavorite(movie.id) ? 'border-red-500/50 text-white bg-red-500 hover:border-red-600 hover:bg-red-600' : 'border-gray-600 hover:border-red-500 hover:text-red-400'}`}
                      title={isFavorite(movie.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                    >
                      {isFavorite(movie.id) ? (
                        <>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Added to Favorites
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Add to Favorites
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Rating', value: rating !== 'N/A' ? `${rating} / 10` : 'N/A', icon: '⭐' },
              { label: 'Release Year', value: year, icon: '📅' },
              { label: 'Runtime', value: movie.runtime ? `${movie.runtime} min` : 'N/A', icon: '⏱️' },
              { label: 'Popularity', value: movie.popularity ? Math.round(movie.popularity).toLocaleString() : 'N/A', icon: '🔥' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="glass rounded-xl p-4 border border-brand-border text-center shadow-card hover:border-[#D4AF37]/35 transition-all duration-300">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-white font-bold text-lg">{value}</div>
                <div className="text-gray-400 text-xs mt-0.5 font-medium">{label}</div>
              </div>
            ))}
          </div>

          {/* Cast Section */}
          {cast.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-white mb-6 text-gradient-gold inline-block">
                Cast & Crew
              </h2>
              <div className="relative group/cast">
                {/* Scroll buttons for cast */}
                <button
                  onClick={() => scrollContainer(castRef, 'left')}
                  aria-label="Scroll left"
                  className="absolute left-0 top-0 bottom-8 z-10 w-12 bg-gradient-to-r from-brand-bg to-transparent flex items-center justify-start pl-1 opacity-0 group-hover/cast:opacity-100 transition-opacity duration-300"
                >
                  <div className="w-8 h-8 rounded-full glass flex items-center justify-center border border-white/10 hover:bg-brand-gold/80 hover:border-brand-gold hover:shadow-glow-gold transition-all duration-200">
                    <svg className="w-4 h-4 text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                </button>
                <button
                  onClick={() => scrollContainer(castRef, 'right')}
                  aria-label="Scroll right"
                  className="absolute right-0 top-0 bottom-8 z-10 w-12 bg-gradient-to-l from-brand-bg to-transparent flex items-center justify-end pr-1 opacity-0 group-hover/cast:opacity-100 transition-opacity duration-300"
                >
                  <div className="w-8 h-8 rounded-full glass flex items-center justify-center border border-white/10 hover:bg-brand-gold/80 hover:border-brand-gold hover:shadow-glow-gold transition-all duration-200">
                    <svg className="w-4 h-4 text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                <div
                  ref={castRef}
                  className="scroll-row hide-scrollbar flex gap-4 overflow-x-auto pb-4"
                >
                  {cast.map((actor) => (
                    <div key={actor.id} className="w-28 sm:w-36 flex-shrink-0 text-center group">
                      <div className="rounded-xl overflow-hidden bg-brand-card aspect-[3/4] shadow-lg mb-2 border border-white/5 group-hover:border-brand-gold/40 transition-all duration-300">
                        {actor.profile_path ? (
                          <img
                            src={tmdbImageUrl(actor.profile_path, POSTER.thumb)}
                            alt={actor.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-brand-card">
                            <svg className="w-10 h-10 text-brand-muted/40" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-white text-xs font-semibold truncate px-1 group-hover:text-brand-gold transition-colors">{actor.name}</p>
                      <p className="text-brand-muted text-[10px] truncate px-1 mt-0.5">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Similar Movies Section */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-white mb-6 text-gradient-gold inline-block">
                Similar Movies
              </h2>
              <div className="relative group/similar">
                <button
                  onClick={() => scrollContainer(similarRef, 'left')}
                  aria-label="Scroll left"
                  className="absolute left-0 top-0 bottom-8 z-10 w-12 bg-gradient-to-r from-brand-bg to-transparent flex items-center justify-start pl-1 opacity-0 group-hover/similar:opacity-100 transition-opacity duration-300"
                >
                  <div className="w-8 h-8 rounded-full glass flex items-center justify-center border border-white/10 hover:bg-brand-gold/80 hover:border-brand-gold hover:shadow-glow-gold transition-all duration-200">
                    <svg className="w-4 h-4 text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                </button>
                <button
                  onClick={() => scrollContainer(similarRef, 'right')}
                  aria-label="Scroll right"
                  className="absolute right-0 top-0 bottom-8 z-10 w-12 bg-gradient-to-l from-brand-bg to-transparent flex items-center justify-end pr-1 opacity-0 group-hover/similar:opacity-100 transition-opacity duration-300"
                >
                  <div className="w-8 h-8 rounded-full glass flex items-center justify-center border border-white/10 hover:bg-brand-gold/80 hover:border-brand-gold hover:shadow-glow-gold transition-all duration-200">
                    <svg className="w-4 h-4 text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                <div
                  ref={similarRef}
                  className="scroll-row hide-scrollbar flex gap-4 overflow-x-auto pb-4"
                >
                  {related.map((m) => {
                    const rating = m.vote_average > 0 ? m.vote_average.toFixed(1) : null
                    const mYear = m.release_date ? new Date(m.release_date).getFullYear() : 'TBA'
                    return (
                      <Link
                        key={m.id}
                        to={`/movie/${m.id}`}
                        id={`similar-movie-${m.id}`}
                        className="w-36 sm:w-44 flex-shrink-0 group block"
                      >
                        <div className="relative rounded-xl overflow-hidden bg-brand-card aspect-[2/3] shadow-lg mb-2 border border-transparent group-hover:border-[#D4AF37]/50 transition-all duration-300 poster-glow ring-1 ring-white/[0.06]">
                          {m.poster_path ? (
                            <img
                              src={tmdbImageUrl(m.poster_path, POSTER.card)}
                              alt={m.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-brand-card p-3 text-center">
                              <svg className="w-8 h-8 text-brand-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                              </svg>
                              <span className="text-brand-muted text-xs leading-tight">{m.title}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-card-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                          {rating && (
                            <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#121212]/95 border border-[#D4AF37]/40 rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 pointer-events-none">
                              <svg className="w-3 h-3 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              <span className="text-[#D4AF37] text-[11px] font-semibold">{rating}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-brand-text text-sm font-semibold truncate group-hover:text-brand-gold transition-colors">{m.title}</p>
                        <p className="text-brand-muted text-xs mt-0.5">{mYear}</p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Recommendations Section */}
          {recommendations.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-white mb-6 text-gradient-gold inline-block">
                Recommendations
              </h2>
              <div className="relative group/rec">
                <button
                  onClick={() => scrollContainer(recommendationsRef, 'left')}
                  aria-label="Scroll left"
                  className="absolute left-0 top-0 bottom-8 z-10 w-12 bg-gradient-to-r from-brand-bg to-transparent flex items-center justify-start pl-1 opacity-0 group-hover/rec:opacity-100 transition-opacity duration-300"
                >
                  <div className="w-8 h-8 rounded-full glass flex items-center justify-center border border-white/10 hover:bg-brand-gold/80 hover:border-brand-gold hover:shadow-glow-gold transition-all duration-200">
                    <svg className="w-4 h-4 text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                </button>
                <button
                  onClick={() => scrollContainer(recommendationsRef, 'right')}
                  aria-label="Scroll right"
                  className="absolute right-0 top-0 bottom-8 z-10 w-12 bg-gradient-to-l from-brand-bg to-transparent flex items-center justify-end pr-1 opacity-0 group-hover/rec:opacity-100 transition-opacity duration-300"
                >
                  <div className="w-8 h-8 rounded-full glass flex items-center justify-center border border-white/10 hover:bg-brand-gold/80 hover:border-brand-gold hover:shadow-glow-gold transition-all duration-200">
                    <svg className="w-4 h-4 text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                <div
                  ref={recommendationsRef}
                  className="scroll-row hide-scrollbar flex gap-4 overflow-x-auto pb-4"
                >
                  {recommendations.map((m) => {
                    const rating = m.vote_average > 0 ? m.vote_average.toFixed(1) : null
                    const mYear = m.release_date ? new Date(m.release_date).getFullYear() : 'TBA'
                    return (
                      <Link
                        key={m.id}
                        to={`/movie/${m.id}`}
                        id={`recommended-movie-${m.id}`}
                        className="w-36 sm:w-44 flex-shrink-0 group block"
                      >
                        <div className="relative rounded-xl overflow-hidden bg-brand-card aspect-[2/3] shadow-lg mb-2 border border-transparent group-hover:border-[#D4AF37]/50 transition-all duration-300 poster-glow ring-1 ring-white/[0.06]">
                          {m.poster_path ? (
                            <img
                              src={tmdbImageUrl(m.poster_path, POSTER.card)}
                              alt={m.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-brand-card p-3 text-center">
                              <svg className="w-8 h-8 text-brand-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                              </svg>
                              <span className="text-brand-muted text-xs leading-tight">{m.title}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-card-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                          {rating && (
                            <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#121212]/95 border border-[#D4AF37]/40 rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 pointer-events-none">
                              <svg className="w-3 h-3 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              <span className="text-[#D4AF37] text-[11px] font-semibold">{rating}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-brand-text text-sm font-semibold truncate group-hover:text-brand-gold transition-colors">{m.title}</p>
                        <p className="text-brand-muted text-xs mt-0.5">{mYear}</p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Unified Movie Player Modal (Supports IA, Youtube Search, and TMDB Trailer fallbacks with scale/fade) */}
        <AnimatePresence>
          {isPlayerOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsPlayerOpen(false)
                resetPlayer()
              }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-4 cursor-pointer"
            >
              <motion.div 
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: shouldReduceMotion ? 0.05 : 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl bg-brand-surface border border-brand-gold/20 rounded-2xl overflow-hidden shadow-glow-gold-lg cursor-default"
              >
                {/* Header controls bar */}
                <div className="p-4 bg-brand-bg/95 border-b border-brand-border flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                        Source:
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold/10 text-brand-gold border border-brand-gold/20 uppercase tracking-wider">
                        {isPlayerResolving ? 'Resolving prints...' : playerSource || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  {/* Manual selector tabs */}
                  {!isPlayerResolving && (
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      {playerSources.archive && (
                        <button
                          onClick={() => {
                            switchSource('archive')
                            updateProgress(movie.id, Math.min(100, Math.max(0, currentProgress + 5)))
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all duration-200 ${
                            playerSource === 'archive'
                              ? 'bg-brand-gold text-brand-bg border-brand-gold shadow-glow-gold'
                              : 'bg-transparent text-gray-400 border-gray-600 hover:text-white hover:border-gray-400'
                          }`}
                        >
                          Archive.org
                        </button>
                      )}
                      {playerSources.youtube && (
                        <button
                          onClick={() => {
                            switchSource('youtube')
                            updateProgress(movie.id, Math.min(100, Math.max(0, currentProgress + 5)))
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all duration-200 ${
                            playerSource === 'youtube'
                              ? 'bg-red-600 text-white border-red-600 shadow-glow-red'
                              : 'bg-transparent text-gray-400 border-gray-600 hover:text-white hover:border-gray-400'
                          }`}
                        >
                          YouTube Full Search
                        </button>
                      )}
                      {playerSources.trailer && (
                        <button
                          onClick={() => switchSource('trailer')}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all duration-200 ${
                            playerSource === 'trailer'
                              ? 'bg-brand-gold-muted/10 text-brand-gold-muted border-brand-gold-muted/30'
                              : 'bg-transparent text-gray-400 border-gray-600 hover:text-white hover:border-gray-400'
                          }`}
                        >
                          TMDB Trailer
                        </button>
                      )}
                    </div>
                  )}

                  {/* Close modal */}
                  <button
                    onClick={() => {
                      setIsPlayerOpen(false)
                      resetPlayer()
                    }}
                    className="w-9 h-9 rounded-full bg-brand-bg/85 border border-[#D4AF37]/35 hover:border-[#D4AF37] text-[#D4AF37] hover:text-[#E6C55A] flex items-center justify-center transition-all duration-200 shadow-lg"
                    aria-label="Close Player"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Video Playback Content */}
                <div className="aspect-video w-full relative bg-black flex items-center justify-center">
                  {isPlayerResolving ? (
                    <div className="flex flex-col items-center gap-3">
                      <LoadingSpinner />
                      <p className="text-brand-gold font-semibold text-sm animate-pulse">
                        Scanning Archive.org and YouTube for full prints...
                      </p>
                    </div>
                  ) : playerError ? (
                    <div className="text-center p-6">
                      <p className="text-red-500 font-bold mb-2">{playerError}</p>
                      {playerSources.trailer ? (
                        <button
                          onClick={() => switchSource('trailer')}
                          className="btn-primary mt-2"
                        >
                          Play Trailer Fallback
                        </button>
                      ) : (
                        <p className="text-gray-500 text-sm">No playbacks available.</p>
                      )}
                    </div>
                  ) : playerEmbedUrl ? (
                    <iframe
                      src={playerEmbedUrl}
                      title={movie.title}
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <p className="text-gray-500">Initializing player...</p>
                  )}
                </div>

                {/* Interactive Watch Progress Slider */}
                {!isPlayerResolving && playerEmbedUrl && (
                  <div className="p-4 bg-brand-bg/95 border-t border-brand-border flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex-1 flex items-center gap-3 min-w-[200px]">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        Progress:
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentProgress}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10)
                          setCurrentProgress(val)
                          updateProgress(movie.id, val)
                        }}
                        className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold hover:accent-brand-gold-hover transition-colors"
                      />
                      <span className="text-xs font-bold text-brand-gold">
                        {currentProgress}%
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-medium">
                      Drag slider or watch to update progress
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
