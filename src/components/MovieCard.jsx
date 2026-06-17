import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
}

export default function MovieCard({ movie }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const inWatchlist = isInWatchlist(movie.id)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'TBA'

  const rating = movie.vote_average > 0 ? movie.vote_average.toFixed(1) : null

  // Combine explicit genres + mapped genre_ids, deduplicate, take first 2
  const genres = [
    ...(movie.genres?.map(g => g.name) || movie.genres || []),
    ...(movie.genre_ids || []).map((id) => GENRE_MAP[id]).filter(Boolean),
  ]
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 2)

  return (
    <div
      id={`movie-card-${movie.id}`}
      className="group relative flex-shrink-0 w-36 sm:w-44 md:w-48 cursor-pointer"
    >
      <Link to={`/movie/${movie.id}`} className="block">
        {/* Poster Container */}
        <div className="relative rounded-xl overflow-hidden bg-brand-card aspect-[2/3] shadow-lg">
          {/* Skeleton while loading */}
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 skeleton rounded-xl" />
          )}

          {/* Poster Image */}
          {!imgError ? (
            <img
              src={movie.poster_path ? (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`) : ''}
              alt={movie.title}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-brand-card p-3 text-center">
              <FilmIcon className="text-gray-600 mb-2 w-8 h-8" />
              <span className="text-gray-500 text-xs leading-tight">{movie.title}</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

          {/* Rating Badge */}
          {rating && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-md px-2 py-0.5">
              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-white text-[11px] font-semibold">{rating}</span>
            </div>
          )}

          {/* Watchlist toggle on hover */}
          <button
            id={`watchlist-toggle-${movie.id}`}
            onClick={(e) => {
              e.preventDefault()
              toggleWatchlist(movie)
            }}
            className={`absolute top-2 right-2 w-7 h-7 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 ${
              inWatchlist
                ? 'bg-brand-red text-white'
                : 'bg-black/60 text-gray-300 hover:text-white hover:bg-brand-red'
            }`}
            aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {inWatchlist ? (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>

          {/* Hover play hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </Link>

      {/* Title + Year + Genres */}
      <div className="mt-2.5 px-0.5">
        <p className="text-white text-sm font-medium leading-tight truncate group-hover:text-brand-red transition-colors duration-200">
          {movie.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className="text-gray-500 text-xs">{year}</span>
          {genres.map((g) => (
            <span
              key={g}
              className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 leading-none"
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
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
