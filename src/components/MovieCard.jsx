import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWatchlist } from '../context/WatchlistContext'

const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
}

export default function MovieCard({ movie, variant = 'default' }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const inWatchlist = isInWatchlist(movie.id)
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
  const hoverTitleColor = isAnime ? 'group-hover:text-brand-purple' : 'group-hover:text-brand-cyan'
  const accentBg = isAnime ? 'bg-brand-purple' : 'bg-brand-cyan'
  const accentText = isAnime ? 'text-brand-purple' : 'text-brand-cyan'

  return (
    <motion.div
      id={`movie-card-${movie.id}`}
      className="group relative flex-shrink-0 w-40 sm:w-48 md:w-52 cursor-pointer"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <Link to={`/movie/${movie.id}`} className="block">
        <div
          className={`relative rounded-2xl overflow-hidden bg-brand-card aspect-[2/3] shadow-card ${glowClass} ${
            isAnime ? 'ring-1 ring-brand-purple/10' : 'ring-1 ring-white/[0.06]'
          }`}
        >
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 skeleton rounded-2xl" />
          )}

          {!imgError ? (
            <img
              src={
                movie.poster_path
                  ? movie.poster_path.startsWith('http')
                    ? movie.poster_path
                    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : ''
              }
              alt={movie.title}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-brand-card p-3 text-center">
              <FilmIcon className="text-brand-muted mb-2 w-8 h-8" />
              <span className="text-brand-muted text-xs leading-tight">{movie.title}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-card-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl" />

          {rating && (
            <div className="absolute top-3 left-3 flex items-center gap-1 glass rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
              <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-brand-text text-[11px] font-semibold">{rating}</span>
            </div>
          )}

          <button
            id={`watchlist-toggle-${movie.id}`}
            onClick={(e) => {
              e.preventDefault()
              toggleWatchlist(movie)
            }}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 ${
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

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className={`w-14 h-14 glass rounded-full flex items-center justify-center ${isAnime ? 'shadow-glow-purple' : 'shadow-glow-cyan'}`}>
              <svg className="w-6 h-6 text-brand-text ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-3 px-0.5">
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
                  ? 'bg-brand-purple/10 border border-brand-purple/20 text-brand-purple'
                  : 'bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan'
              }`}
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function FilmIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
  )
}
