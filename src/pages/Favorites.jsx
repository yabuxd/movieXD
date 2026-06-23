import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import MovieCard from '../components/MovieCard'
import { useFavorites } from '../context/FavoritesContext'

export default function Favorites() {
  const { favorites, removeFromFavorites } = useFavorites()

  const sortedFavorites = [...favorites].sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0))

  return (
    <>
      <Helmet>
        <title>My Favorites — CineFlow</title>
      </Helmet>
      <div className="min-h-screen bg-brand-bg pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-[#e50914] rounded-full" />
            <h1 className="text-3xl sm:text-4xl font-black text-white">My Favorites</h1>
            <span className="ml-2 px-3 py-1 bg-[#e50914]/20 border border-[#e50914]/40 text-[#e50914] text-sm font-semibold rounded-full">
              {sortedFavorites.length} {sortedFavorites.length === 1 ? 'title' : 'titles'}
            </span>
          </div>
        </div>

        {sortedFavorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h2 className="text-xl font-bold text-white mb-3">No favorites yet. Start adding movies you love.</h2>
            <Link to="/" className="btn-primary mt-4">
              Browse Movies
            </Link>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-5 gap-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {sortedFavorites.map((movie) => (
              <div key={movie.id} className="flex flex-col h-full">
                <div className="flex-1">
                  <MovieCard movie={movie} />
                </div>
                <button
                  onClick={() => removeFromFavorites(movie.id)}
                  className="mt-3 py-2 px-3 bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  )
}
