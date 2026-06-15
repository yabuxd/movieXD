import { Link } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import { useWatchlist } from '../context/WatchlistContext'

export default function Watchlist() {
  const { watchlist } = useWatchlist()

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-brand-red rounded-full" />
          <h1 className="text-3xl sm:text-4xl font-black text-white">My List</h1>
          <span className="ml-2 px-3 py-1 bg-brand-red/20 border border-red-800/40 text-red-400 text-sm font-semibold rounded-full">
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
              <Link
                to={`/movie/${watchlist[0].id}`}
                id="watchlist-featured-item"
                className="group block relative rounded-2xl overflow-hidden bg-brand-card border border-brand-border hover:border-brand-red/50 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row gap-0">
                  <div className="sm:w-48 aspect-[16/9] sm:aspect-auto flex-shrink-0 relative">
                    {watchlist[0].poster_path ? (
                      <img
                        src={watchlist[0].poster_path}
                        alt={watchlist[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-dark flex items-center justify-center">
                        <span className="text-gray-600 text-sm">{watchlist[0].title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col justify-center">
                    <p className="text-xs text-brand-red font-semibold uppercase tracking-wider mb-1">Movie</p>
                    <h3 className="text-white text-xl font-bold mb-2 group-hover:text-brand-red transition-colors">
                      {watchlist[0].title}
                    </h3>
                    {watchlist[0].vote_average > 0 && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-yellow-400 font-semibold text-sm">{watchlist[0].vote_average.toFixed(1)}</span>
                        <span className="text-gray-500 text-sm">{new Date(watchlist[0].release_date || '').getFullYear()}</span>
                      </div>
                    )}
                    {/* Fake progress bar */}
                    <div className="w-full max-w-xs bg-white/10 rounded-full h-1.5 mb-1">
                      <div className="bg-brand-red h-1.5 rounded-full w-[38%]" />
                    </div>
                    <p className="text-gray-500 text-xs">38% watched</p>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* All Saved */}
          <div>
            <h2 className="text-lg font-semibold text-gray-400 mb-4">All Saved ({watchlist.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {watchlist.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
