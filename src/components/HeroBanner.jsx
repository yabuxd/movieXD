import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'

export default function HeroBanner({ movie }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const inWatchlist = isInWatchlist(movie.id)
  const [imgError, setImgError] = useState(false)

  return (
    <section
      id="hero-banner"
      className="relative w-full min-h-[90vh] md:min-h-screen flex items-end overflow-hidden"
    >
      {/* Background Image */}
      {!imgError ? (
        <img
          src={movie.backdrop_path ? (movie.backdrop_path.startsWith('http') ? movie.backdrop_path : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`) : ''}
          alt={movie.title}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-brand-dark" />
      )}

      {/* Gradient Overlay: left and bottom */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-brand-dark/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-32 pt-32">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(movie.genres || []).map((g) => (
              <span key={g} className="badge-red">{g}</span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-none mb-4 text-white drop-shadow-2xl">
            {movie.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1.5">
              <StarIcon className="text-yellow-400" />
              <span className="text-yellow-400 font-bold text-lg">{movie.vote_average}</span>
            </div>
            <span className="text-gray-400 text-sm">
              {new Date(movie.release_date).getFullYear()}
            </span>
            {movie.runtime && (
              <span className="text-gray-400 text-sm">{movie.runtime} min</span>
            )}
            <span className="badge-gold">HD</span>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 line-clamp-3">
            {movie.overview}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/movie/${movie.id}`}
              id="hero-play-btn"
              className="btn-primary text-base"
            >
              <PlayIcon />
              Play Now
            </Link>
            <Link
              to={`/movie/${movie.id}`}
              id="hero-info-btn"
              className="btn-secondary text-base"
            >
              <InfoIcon />
              More Info
            </Link>
            <button
              id="hero-watchlist-btn"
              onClick={() => toggleWatchlist(movie)}
              className={`btn-secondary text-base transition-all duration-200 ${
                inWatchlist ? 'border-brand-red text-brand-red' : ''
              }`}
            >
              {inWatchlist ? <CheckIcon /> : <PlusIcon />}
              {inWatchlist ? 'In My List' : 'Add to List'}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none" />
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
    <svg className={`w-5 h-5 ${className}`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
