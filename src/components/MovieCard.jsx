import { useState, memo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useWatchlist } from '../context/WatchlistContext'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { tmdbPosterProps } from '../utils/tmdbImages'

const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
}

const MovieCard = memo(function MovieCard({ movie, variant = 'default', priority = false, lowPriority = false }) {
  const poster = tmdbPosterProps(movie.poster_path)
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const inWatchlist = isInWatchlist(movie.id)
  const isFav = isFavorite(movie.id)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const isAnime = variant === 'anime'

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'TBA'

  const rating = movie.vote_average > 0 ? movie.vote_average.toFixed(1) : null

  const genres = [
    ...(movie.genres?.map((g) => g.name) || movie.genres || []),
    ...(movie.genre_ids || []).map((id) => GENRE_MAP[id]).filter(Boolean),
  ]
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 2)

  const glowClass = isAnime ? 'poster-glow-anime' : 'poster-glow'
  const hoverTitleColor = isAnime ? 'group-hover:text-brand-gold-muted' : 'group-hover:text-brand-gold'
  const accentBg = isAnime ? 'bg-brand-gold-muted' : 'bg-brand-gold'

  const shouldReduceMotion = useReducedMotion()

  const itemVariants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 },
    show: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 },
  }

  return (
    <motion.div
      id={`movie-card-${movie.id}`}
      className="group relative flex-shrink-0 w-40 sm:w-48 md:w-52 cursor-pointer"
      variants={itemVariants}
      whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.05 }}
      transition={{ duration: shouldReduceMotion ? 0.05 : 0.3, ease: 'easeOut' }}
    >
      <div
        className={`relative rounded-2xl overflow-hidden bg-brand-card aspect-[2/3] shadow-card border border-transparent group-hover:border-[#D4AF37]/50 transition-all duration-300 ${glowClass} ${
          isAnime ? 'ring-1 ring-brand-gold-muted/10' : 'ring-1 ring-black/[0.06] dark:ring-white/[0.06]'
        }`}
      >
        <Link to={`/movie/${movie.id}`} className="absolute inset-0 z-0 block">
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 skeleton rounded-2xl" />
          )}

          {!imgError && poster ? (
            <img
              src={poster.src}
              srcSet={poster.srcSet}
              sizes={poster.sizes}
              alt={movie.title}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : lowPriority ? 'low' : 'auto'}
              className={`w-full h-full object-cover transition-opacity duration-75 group-hover:scale-105 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : imgError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-brand-card p-3 text-center">
              <FilmIcon className="text-brand-muted mb-2 w-8 h-8" />
              <span className="text-brand-muted text-xs leading-tight">{movie.title}</span>
            </div>
          ) : (
            <div className="absolute inset-0 skeleton rounded-2xl" />
          )}
        </Link>

        {movie.progress !== undefined && (
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/60 z-20">
            <div
              className="bg-brand-gold h-full transition-all duration-300"
              style={{ width: `${movie.progress}%` }}
            />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-card-gradient opacity-40 group-hover:opacity-100 transition-opacity duration-400 rounded-b-2xl pointer-events-none z-[1]" />

        {rating && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-[#121212]/95 border border-[#D4AF37]/40 rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 pointer-events-none">
            <svg className="w-3 h-3 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-[#D4AF37] text-[11px] font-semibold">{rating}</span>
          </div>
        )}

        {isAuthenticated && (
          <>
            <button
              type="button"
              id={`watchlist-toggle-${movie.id}`}
              onClick={() => {
                toggleWatchlist(movie)
              }}
              className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full glass flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 ${
                inWatchlist ? `${accentBg} text-brand-bg` : 'text-brand-muted hover:text-brand-text'
              }`}
              aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {inWatchlist ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>

            <button
              type="button"
              id={`favorite-toggle-${movie.id}`}
              onClick={() => toggleFavorite(movie)}
              className={`absolute top-12 right-3 z-20 w-8 h-8 rounded-full glass flex items-center justify-center transition-all duration-300 ${
                isFav
                  ? 'bg-red-500 text-white opacity-100'
                  : 'text-brand-muted hover:text-red-400 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0'
              }`}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFav}
            >
              {isFav ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          </>
        )}

        <div className="absolute inset-0 z-[1] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="w-14 h-14 glass rounded-full flex items-center justify-center shadow-glow-gold">
            <svg className="w-6 h-6 text-brand-text ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <Link to={`/movie/${movie.id}`} className="block mt-3 px-0.5">
        <p className={`text-brand-text text-sm font-semibold leading-tight truncate transition-colors duration-200 ${hoverTitleColor}`}>
          {movie.title}
        </p>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <span className="text-brand-muted text-xs">{year}</span>
          {genres.map((g) => (
            <span
              key={g}
              className={`text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md leading-none ${
                isAnime
                  ? 'bg-brand-gold-muted/10 border border-brand-gold-muted/20 text-brand-gold-muted'
                  : 'bg-brand-gold/10 border border-brand-gold/20 text-brand-gold'
              }`}
            >
              {g}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  )
})

function FilmIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
  )
}

export default MovieCard
