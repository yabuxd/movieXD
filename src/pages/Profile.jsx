import { useAuth } from '../context/AuthContext'
import { useWatchlist } from '../context/WatchlistContext'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { user } = useAuth()
  const { watchlist } = useWatchlist()

  return (
    <div className="min-h-screen bg-brand-bg pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-md mx-auto relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-brand-gold rounded-full" />
          <h1 className="text-3xl font-black text-white">My Profile</h1>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl border border-brand-border p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Avatar Area */}
          <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-brand-border">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-muted flex items-center justify-center text-2xl font-black text-brand-bg shadow-glow-gold">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'MX'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-xs text-brand-gold font-medium tracking-wide mt-0.5">VIP Cinema Member</p>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4">
            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</span>
              <span className="text-white text-base font-medium">{user?.email}</span>
            </div>

            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Membership Status</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-bold rounded-full">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.8 star1h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Active Premium
              </span>
            </div>

            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Watchlist size</span>
              <Link to="/watchlist" className="group flex items-center justify-between p-3 bg-white/5 border border-brand-border rounded-xl hover:border-brand-gold/40 transition-colors">
                <span className="text-gray-300 text-sm font-medium">Saved titles</span>
                <span className="text-white text-sm font-bold bg-brand-border px-2.5 py-0.5 rounded-lg group-hover:bg-brand-gold group-hover:text-brand-bg transition-colors">
                  {watchlist.length}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
