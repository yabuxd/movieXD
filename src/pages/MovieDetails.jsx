import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useWatchlist } from '../context/WatchlistContext'
import {
  MOCK_TRENDING,
  MOCK_POPULAR,
  MOCK_TOP_RATED,
  MOCK_UPCOMING,
  MOCK_HERO,
  GENRE_MAP,
} from '../data/mockData'

const ALL_MOVIES = [
  MOCK_HERO,
  ...MOCK_TRENDING,
  ...MOCK_POPULAR,
  ...MOCK_TOP_RATED,
  ...MOCK_UPCOMING,
].filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i)

export default function MovieDetails() {
  const { id } = useParams()
  const movie = ALL_MOVIES.find((m) => m.id === Number(id))
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const [imgError, setImgError] = useState(false)

  if (!movie) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-center px-4">
        <p className="text-gray-500 text-6xl mb-4">404</p>
        <h1 className="text-white text-2xl font-bold mb-4">Movie not found</h1>
        <p className="text-gray-500 mb-8">We couldn't find a movie with that ID in our mock data.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    )
  }

  const inWatchlist = isInWatchlist(movie.id)
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'
  const rating = movie.vote_average > 0 ? movie.vote_average.toFixed(1) : 'N/A'
  const genres = movie.genres
    || (movie.genre_ids || []).map((id) => GENRE_MAP[id]).filter(Boolean)

  // Related movies (same genre, excluding current)
  const related = ALL_MOVIES.filter(
    (m) =>
      m.id !== movie.id &&
      (m.genre_ids || []).some((g) => (movie.genre_ids || []).includes(g))
  ).slice(0, 6)

  const posterSrc = movie.poster_path || movie.backdrop_path

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Backdrop */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {movie.backdrop_path && !imgError ? (
          <img
            src={movie.backdrop_path}
            alt={movie.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-brand-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-transparent" />

        {/* Back button */}
        <Link
          to="/"
          id="movie-detail-back-btn"
          className="absolute top-20 left-4 sm:left-8 flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      {/* Details */}
      <div className="relative z-10 -mt-40 md:-mt-52 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-40 sm:w-52 mx-auto md:mx-0">
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/10 aspect-[2/3] bg-brand-card">
              {posterSrc && !imgError ? (
                <img
                  src={posterSrc}
                  alt={movie.title}
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

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
              {genres.map((g) => (
                <span key={g} className="badge-red">{g}</span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight">
              {movie.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mb-6 justify-center md:justify-start">
              <div className="flex items-center gap-1.5">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-yellow-400 font-bold text-lg">{rating}</span>
                <span className="text-gray-500 text-sm">/10</span>
              </div>
              <span className="text-gray-400">{year}</span>
              {movie.runtime && (
                <span className="text-gray-400">{movie.runtime} min</span>
              )}
              <span className="badge-gold">4K</span>
              <span className="badge-gold">HDR</span>
            </div>

            {/* Overview */}
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto md:mx-0">
              {movie.overview || 'No description available for this title.'}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button
                id="detail-play-btn"
                className="btn-primary text-base"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play
              </button>
              <button
                id="detail-trailer-btn"
                className="btn-secondary text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Trailer
              </button>
              <button
                id="detail-watchlist-btn"
                onClick={() => toggleWatchlist(movie)}
                className={`btn-secondary text-base ${inWatchlist ? 'border-brand-red text-brand-red' : ''}`}
              >
                {inWatchlist ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                )}
                {inWatchlist ? 'In My List' : 'Add to List'}
              </button>
              <button
                id="detail-share-btn"
                className="btn-secondary text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Rating', value: `${rating} / 10`, icon: '⭐' },
            { label: 'Year', value: year, icon: '📅' },
            { label: 'Runtime', value: movie.runtime ? `${movie.runtime} min` : 'N/A', icon: '⏱️' },
            { label: 'Status', value: movie.vote_average > 0 ? 'Released' : 'Coming Soon', icon: '🎬' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="glass rounded-xl p-4 border border-brand-border text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-white font-semibold">{value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Related Movies */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {related.map((m) => (
                <Link
                  key={m.id}
                  to={`/movie/${m.id}`}
                  id={`related-movie-${m.id}`}
                  className="group block"
                >
                  <div className="rounded-xl overflow-hidden bg-brand-card aspect-[2/3] shadow-lg mb-2 group-hover:ring-2 group-hover:ring-brand-red/60 transition-all duration-200">
                    {m.poster_path ? (
                      <img
                        src={m.poster_path}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-card">
                        <span className="text-gray-600 text-xs text-center px-2">{m.title}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-white text-xs font-medium truncate group-hover:text-brand-red transition-colors">{m.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
