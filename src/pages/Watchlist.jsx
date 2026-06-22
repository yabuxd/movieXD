import { Link } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import { useWatchlist } from '../context/WatchlistContext'

export default function Watchlist() {
  const { watchlist, toggleWatchlist } = useWatchlist()

  return (
    <div className="min-h-screen bg-brand-bg pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-brand-gold rounded-full" />
          <h1 className="text-3xl sm:text-4xl font-black text-white">My List</h1>
          <span className="ml-2 px-3 py-1 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-sm font-semibold rounded-full">
            {watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'}
          </span>
        </div>
        <p className="text-gray-500 text-sm ml-4">Your saved movies and shows, all in one place.</p>
      </div>

      {watchlist.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-24 h-24 rounded-full bg-brand-card border border-brand-border flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Your list is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md">
            Start adding movies and shows by clicking the bookmark icon on any title.
          </p>
          <Link to="/search" id="watchlist-browse-btn" className="btn-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Movies
          </Link>
        </div>
      ) : (
        <>
          {/* Continue Watching (first item featured) */}
          {watchlist.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-gray-400 mb-4">Continue Watching</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 max-w-2xl bg-brand-card border border-brand-border hover:border-brand-gold/50 rounded-2xl overflow-hidden transition-all duration-300">
                <Link
                  to={`/movie/${watchlist[0].id}`}
                  id="watchlist-featured-item"
                  className="group flex flex-row gap-0 flex-1 min-w-0"
                >
                  <div className="w-32 sm:w-48 aspect-[16/9] flex-shrink-0 relative">
                    {watchlist[0].poster_path ? (
                      <img
                        src={watchlist[0].poster_path.startsWith('http') ? watchlist[0].poster_path : `https://image.tmdb.org/t/p/w500${watchlist[0].poster_path}`}
                        alt={watchlist[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-bg flex items-center justify-center">
                        <span className="text-gray-600 text-xs text-center px-1 truncate">{watchlist[0].title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 sm:p-5 flex flex-col justify-center flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs text-brand-gold font-semibold uppercase tracking-wider mb-0.5 sm:mb-1">Movie</p>
                    <h3 className="text-white text-base sm:text-lg font-bold mb-1 sm:mb-2 group-hover:text-brand-gold transition-colors truncate">
                      {watchlist[0].title}
                    </h3>
                    {watchlist[0].vote_average > 0 && (
                      <div className="flex items-center gap-1.5 mb-2 sm:mb-3 text-xs sm:text-sm">
                        <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-yellow-400 font-semibold">{watchlist[0].vote_average.toFixed(1)}</span>
                        <span className="text-gray-500">{new Date(watchlist[0].release_date || '').getFullYear()}</span>
                      </div>
                    )}
                    {/* Fake progress bar */}
                    <div className="w-full max-w-[140px] sm:max-w-xs bg-white/10 rounded-full h-1 sm:h-1.5 mb-1">
                      <div className="bg-brand-gold h-1 sm:h-1.5 rounded-full w-[38%]" />
                    </div>
                    <p className="text-gray-500 text-[10px] sm:text-xs">38% watched</p>
                  </div>
                </Link>
                <div className="px-4 pb-4 sm:pb-0 sm:pr-6 flex items-center justify-end">
                  <button
                    onClick={() => toggleWatchlist(watchlist[0])}
                    className="py-2 px-4 bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5"
                    aria-label="Remove from watchlist"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* All Saved */}
          <div>
            <h2 className="text-lg font-semibold text-gray-400 mb-4">All Saved ({watchlist.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-5 gap-y-8">
              {watchlist.map((movie) => (
                <div key={movie.id} className="flex flex-col h-full">
                  <div className="flex-1">
                    <MovieCard movie={movie} />
                  </div>
                  <button
                    onClick={() => toggleWatchlist(movie)}
                    className="mt-3 py-2 px-3 bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
                    aria-label={`Remove ${movie.title} from watchlist`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
