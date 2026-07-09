import { useAuth } from '../context/AuthContext'
import { useWatchlist } from '../context/WatchlistContext'
import { useContinueWatching } from '../context/ContinueWatchingContext'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

export default function Profile() {
  const { currentUser } = useAuth()
  const { watchlist } = useWatchlist()
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
        <meta name="description" content="View your account details and watch activity log on MovieXD." />
      </Helmet>
      <div className="min-h-screen bg-brand-bg pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-brand-gold rounded-full" />
            <h1 className="text-3xl font-black text-white">My Profile</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* User Profile Card */}
            <div className="md:col-span-1 glass rounded-2xl border border-brand-border p-6 text-center space-y-4 shadow-2xl">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.username}
                  className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-brand-gold shadow-glow-gold"
                />
              ) : (
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-muted flex items-center justify-center text-2xl font-black text-brand-bg shadow-glow-gold">
                  {currentUser?.username ? currentUser.username.slice(0, 2).toUpperCase() : 'MX'}
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold text-white truncate">{currentUser?.username}</h2>
                <p className="text-[10px] text-brand-gold font-medium tracking-wide mt-0.5 uppercase">VIP Member</p>
              </div>
              <div className="pt-3 border-t border-brand-border text-left space-y-2">
                <div>
                  <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email</span>
                  <span className="text-gray-300 text-xs truncate block">{currentUser?.email}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</span>
                  <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[10px] font-bold rounded-full">
                    Active Premium
                  </span>
                </div>
              </div>
            </div>

            {/* Watch Stats & Quick Links */}
            <div className="md:col-span-2 glass rounded-2xl border border-brand-border p-6 space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-white">Library Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/watchlist" className="group p-4 bg-white/5 border border-brand-border rounded-xl hover:border-brand-gold/40 transition-colors">
                  <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Watchlist Size</span>
                  <span className="text-2xl font-black text-white group-hover:text-brand-gold transition-colors">{watchlist.length}</span>
                  <span className="block text-[10px] text-gray-400 mt-1">Saved titles</span>
                </Link>
                <div className="p-4 bg-white/5 border border-brand-border rounded-xl">
                  <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Titles Played</span>
                  <span className="text-2xl font-black text-white">{history.length}</span>
                  <span className="block text-[10px] text-gray-400 mt-1">History logs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Watch History Table with Staggered Rows */}
          <div className="glass rounded-2xl border border-brand-border p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Recent Playback Logs</h3>
            {history.length === 0 ? (
              <p className="text-gray-500 text-sm">No watch history records available.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-brand-border/60">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-border bg-white/[0.02] text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="p-3">Movie / Title</th>
                      <th className="p-3">Last Opened</th>
                      <th className="p-3">Progress</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <motion.tbody
                    variants={tableVariants}
                    initial="hidden"
                    animate="show"
                  >
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
                              <div
                                className="bg-brand-gold h-1 rounded-full"
                                style={{ width: `${movie.progress || 15}%` }}
                              />
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
