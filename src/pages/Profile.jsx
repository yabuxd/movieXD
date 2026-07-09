import { useWatchlist } from '../context/WatchlistContext'
import { useFavorites } from '../context/FavoritesContext'
import { useContinueWatching } from '../context/ContinueWatchingContext'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

export default function Profile() {
  const { currentUser } = useAuth()
  const { watchlist } = useWatchlist()
  const { favorites } = useFavorites()
  const { history } = useContinueWatching()
  const shouldReduceMotion = useReducedMotion()

  const tableVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -15 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100 } },
  }

  return (
    <>
      <Helmet>
        <title>My Profile — MovieXD</title>
        <meta name="description" content="View your account and library on MovieXD." />
      </Helmet>
      <div className="min-h-screen bg-brand-bg pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-brand-gold rounded-full" />
            <h1 className="text-3xl font-black text-white">My Profile</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-1 glass rounded-2xl border border-brand-border p-6 text-center space-y-4 shadow-2xl">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-brand-gold shadow-glow-gold"
                />
              ) : (
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-muted flex items-center justify-center text-2xl font-black text-brand-bg shadow-glow-gold">
                  {currentUser?.name?.slice(0, 2).toUpperCase() || 'MX'}
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold text-white truncate">{currentUser?.name}</h2>
                <p className="text-[10px] text-brand-gold font-medium tracking-wide mt-0.5 uppercase">
                  {currentUser?.authProvider === 'google' ? 'Google Account' : 'Email Account'}
                </p>
              </div>
              <div className="pt-3 border-t border-brand-border text-left space-y-2">
                <div>
                  <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email</span>
                  <span className="text-gray-300 text-xs truncate block">{currentUser?.email}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</span>
                  <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[10px] font-bold rounded-full">
                    {currentUser?.emailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 glass rounded-2xl border border-brand-border p-6 space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-white">Library Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <Link to="/watchlist" className="group p-4 bg-white/5 border border-brand-border rounded-xl hover:border-brand-gold/40 transition-colors">
                  <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Watchlist</span>
                  <span className="text-2xl font-black text-white group-hover:text-brand-gold transition-colors">{watchlist.length}</span>
                </Link>
                <Link to="/favorites" className="group p-4 bg-white/5 border border-brand-border rounded-xl hover:border-brand-gold/40 transition-colors">
                  <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Favorites</span>
                  <span className="text-2xl font-black text-white group-hover:text-brand-gold transition-colors">{favorites.length}</span>
                </Link>
                <div className="p-4 bg-white/5 border border-brand-border rounded-xl">
                  <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Played</span>
                  <span className="text-2xl font-black text-white">{history.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl border border-brand-border p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Recent Playback</h3>
            {history.length === 0 ? (
              <p className="text-gray-500 text-sm">No watch history yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-brand-border/60">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-border bg-white/[0.02] text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="p-3">Title</th>
                      <th className="p-3">Last Opened</th>
                      <th className="p-3">Progress</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <motion.tbody variants={tableVariants} initial="hidden" animate="show">
                    {history.map((movie) => (
                      <motion.tr
                        key={movie.id}
                        variants={rowVariants}
                        className="border-b border-brand-border/60 hover:bg-white/[0.02] text-xs text-gray-300 transition-colors"
                      >
                        <td className="p-3 font-semibold text-white">
                          <Link to={`/movie/${movie.id}`} className="hover:text-brand-gold transition-colors truncate max-w-[150px] inline-block align-middle">
                            {movie.title}
                          </Link>
                        </td>
                        <td className="p-3 text-[11px] text-gray-500">
                          {new Date(movie.viewedAt || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-white/10 rounded-full h-1">
                              <div className="bg-brand-gold h-1 rounded-full" style={{ width: `${movie.progress || 15}%` }} />
                            </div>
                            <span className="text-[10px] text-brand-gold font-bold">{movie.progress || 15}%</span>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <Link
                            to={`/movie/${movie.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-gold/10 border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-bg text-brand-gold text-[10px] font-bold rounded-lg transition-all"
                          >
                            Resume
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
