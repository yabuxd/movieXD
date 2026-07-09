import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'
import { useAuth } from '../context/AuthContext'
import { tmdbBackdropProps } from '../utils/tmdbImages'

const HERO_INTERVAL_MS = 5000
const SLIDE_TRANSITION = { duration: 0.65, ease: [0.4, 0, 0.2, 1] }

const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
}

function getBackdropProps(movie) {
  return tmdbBackdropProps(movie?.backdrop_path)
}

function getGenres(movie) {
  return [
    ...(movie.genres?.map((g) => (typeof g === 'string' ? g : g.name)) || []),
    ...(movie.genre_ids || []).map((id) => GENRE_MAP[id]).filter(Boolean),
  ]
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 3)
}

function HeroSlideContent({ movie, isAuthenticated, location, navigate, toggleWatchlist, isInWatchlist }) {
  const genres = getGenres(movie)
  const saved = isInWatchlist(movie.id)

  return (
    <div className="w-screen flex-shrink-0 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="max-w-xl lg:max-w-2xl">
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {genres.map((g) => (
                <span key={g} className="badge-gold">{g}</span>
              ))}
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.05] mb-5 text-brand-text tracking-tight drop-shadow-2xl">
            {movie.title}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg glass">
              <StarIcon className="text-brand-gold w-4 h-4" />
              <span className="text-brand-gold font-bold">{movie.vote_average?.toFixed(1)}</span>
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
            <Link to={`/movie/${movie.id}`} className="btn-primary text-base">
              <PlayIcon />
              Watch Now
            </Link>
            <Link to={`/movie/${movie.id}`} className="btn-secondary text-base">
              <InfoIcon />
              Details
            </Link>
            {isAuthenticated && (
              <button
                onClick={() => {
                  toggleWatchlist(movie)
                }}
                className={`btn-secondary text-base ${saved ? '!border-brand-gold-muted !text-brand-gold-muted' : ''}`}
              >
                {saved ? <CheckIcon /> : <PlusIcon />}
                {saved ? 'Saved' : 'My List'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HeroBanner({ movies = [] }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [position, setPosition] = useState(0)
  const [skipTransition, setSkipTransition] = useState(false)
  const [imgErrors, setImgErrors] = useState({})
  const positionRef = useRef(0)

  const loopMovies = useMemo(
    () => (movies.length > 1 ? [...movies, movies[0]] : movies),
    [movies]
  )

  const activeIndex = position === movies.length ? 0 : position

  const goTo = useCallback((nextIndex) => {
    positionRef.current = nextIndex
    setSkipTransition(false)
    setPosition(nextIndex)
  }, [])

  const handleLoopComplete = useCallback(() => {
    if (movies.length < 2) return
    if (positionRef.current !== movies.length) return

    setSkipTransition(true)
    positionRef.current = 0
    setPosition(0)
  }, [movies.length])

  useEffect(() => {
    if (!skipTransition) return
    const id = requestAnimationFrame(() => setSkipTransition(false))
    return () => cancelAnimationFrame(id)
  }, [skipTransition])

  useEffect(() => {
    positionRef.current = 0
    setPosition(0)
    setSkipTransition(false)
    setImgErrors({})
  }, [movies])

  useEffect(() => {
    if (movies.length < 2) return
    const timer = setInterval(() => {
      setPosition((p) => {
        const next = p + 1
        positionRef.current = next
        return next
      })
    }, HERO_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [movies.length])

  if (movies.length === 0) return null

  const transition = skipTransition ? { duration: 0 } : SLIDE_TRANSITION

  return (
    <section
      id="hero-banner"
      className="relative w-full min-h-[92vh] md:min-h-screen flex items-end overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="flex h-full"
          animate={{ x: `-${position * 100}vw` }}
          transition={transition}
          onAnimationComplete={handleLoopComplete}
        >
          {loopMovies.map((m, i) => {
            const backdrop = getBackdropProps(m)
            const hasError = imgErrors[m.id]
            const slideIndex = i === movies.length ? 0 : i
            const isNearActive =
              slideIndex === activeIndex ||
              slideIndex === activeIndex + 1 ||
              (activeIndex === movies.length - 1 && slideIndex === 0)

            return (
              <div key={`${m.id}-${i}`} className="w-screen h-full relative flex-shrink-0">
                {!hasError && backdrop && isNearActive ? (
                  <img
                    src={backdrop.src}
                    srcSet={backdrop.srcSet}
                    sizes={backdrop.sizes}
                    alt={m.title}
                    onError={() => setImgErrors((prev) => ({ ...prev, [m.id]: true }))}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={i === 0 ? 'high' : 'low'}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-surface via-brand-card to-brand-bg" />
                )}
              </div>
            )
          })}
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-cinematic-mesh pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-brand-bg/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

      <div className="relative z-10 w-full overflow-hidden pb-20 md:pb-32 pt-32">
        <motion.div
          className="flex"
          animate={{ x: `-${position * 100}vw` }}
          transition={transition}
        >
          {loopMovies.map((m, i) => (
            <HeroSlideContent
              key={`${m.id}-${i}`}
              movie={m}
              isAuthenticated={isAuthenticated}
              location={location}
              navigate={navigate}
              toggleWatchlist={toggleWatchlist}
              isInWatchlist={isInWatchlist}
            />
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-hero-bottom pointer-events-none" />

      {movies.length > 1 && (
        <div className="absolute bottom-8 right-8 flex gap-2 z-10">
          {movies.map((m, i) => (
            <button
              key={m.id}
              type="button"
              aria-label={`Show ${m.title}`}
              onClick={() => goTo(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === activeIndex ? 'w-8 bg-brand-gold' : 'w-4 bg-brand-text/20 hover:bg-brand-text/40'
              }`}
            />
          ))}
        </div>
      )}
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
