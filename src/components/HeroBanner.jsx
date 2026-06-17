import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'

export default function HeroBanner({ movie }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const inWatchlist = isInWatchlist(movie.id)
  const [imgError, setImgError] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setImgIndex((i) => (i + 1) % 3), 8000)
    return () => clearInterval(timer)
  }, [])

  const backdrop = movie.backdrop_path
    ? movie.backdrop_path.startsWith('http')
      ? movie.backdrop_path
      : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : ''

  return (
    <section
      id="hero-banner"
      className="relative w-full min-h-[92vh] md:min-h-screen flex items-end overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {!imgError && backdrop ? (
            <img
              src={backdrop}
              alt={movie.title}
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-surface via-brand-card to-brand-bg" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/40 to-transparent" />
      <div className="absolute inset-0 bg-cinematic-mesh" />
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-brand-bg/80 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-32 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-xl lg:max-w-2xl"
        >
          <div className="flex flex-wrap gap-2 mb-5">
            {(movie.genres || []).slice(0, 3).map((g) => (
              <span key={g} className="badge-cyan">{g}</span>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.05] mb-5 text-brand-text tracking-tight drop-shadow-2xl">
            {movie.title}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg glass">
              <StarIcon className="text-amber-400 w-4 h-4" />
              <span className="text-amber-300 font-bold">{movie.vote_average?.toFixed(1)}</span>
            </div>
            <span className="text-brand-muted text-sm">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
            </span>
            {movie.runtime && (
              <span className="text-brand-muted text-sm">{movie.runtime} min</span>
            )}
            <span className="badge-gold">4K</span>
          </div>

          <p className="text-brand-muted text-base md:text-lg leading-relaxed mb-8 line-clamp-3 max-w-lg">
            {movie.overview}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to={`/movie/${movie.id}`} id="hero-play-btn" className="btn-primary text-base">
              <PlayIcon />
              Watch Now
            </Link>
            <Link to={`/movie/${movie.id}`} id="hero-info-btn" className="btn-secondary text-base">
              <InfoIcon />
              Details
            </Link>
            <button
              id="hero-watchlist-btn"
              onClick={() => toggleWatchlist(movie)}
              className={`btn-secondary text-base ${inWatchlist ? '!border-brand-purple !text-brand-purple' : ''}`}
            >
              {inWatchlist ? <CheckIcon /> : <PlusIcon />}
              {inWatchlist ? 'Saved' : 'My List'}
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-hero-bottom pointer-events-none" />

      {/* Slide indicators */}
      <div className="absolute bottom-8 right-8 flex gap-2 z-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === imgIndex % 3 ? 'w-8 bg-brand-cyan' : 'w-4 bg-white/20'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

function PlayIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function StarIcon({ className = '' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
