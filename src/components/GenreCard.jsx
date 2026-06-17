import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const GENRE_COLORS = {
  28: 'from-cyan-600 to-blue-700',
  12: 'from-emerald-400 to-cyan-500',
  16: 'from-brand-cyan to-brand-purple',
  35: 'from-amber-400 to-orange-500',
  80: 'from-slate-600 to-slate-900',
  99: 'from-blue-600 to-indigo-700',
  18: 'from-brand-purple to-indigo-600',
  10751: 'from-green-400 to-emerald-600',
  14: 'from-violet-500 to-brand-purple',
  36: 'from-amber-600 to-amber-900',
  27: 'from-slate-800 to-brand-bg',
  10402: 'from-pink-400 to-brand-purple',
  9648: 'from-slate-600 to-brand-surface',
  10749: 'from-pink-400 to-rose-500',
  878: 'from-brand-cyan to-blue-600',
  10770: 'from-gray-500 to-gray-700',
  53: 'from-indigo-700 to-brand-bg',
  10752: 'from-stone-600 to-stone-800',
  37: 'from-amber-700 to-orange-900',
}

export default function GenreCard({ genre }) {
  const isAnime = genre.id === 16
  const gradient = GENRE_COLORS[genre.id] || 'from-brand-cyan to-brand-purple'

  return (
    <Link to={`/genre/${genre.id}`}>
      <motion.div
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`relative h-32 rounded-2xl overflow-hidden shadow-card bg-gradient-to-br ${gradient} p-4 flex items-end cursor-pointer group border border-white/[0.08] ${
          isAnime ? 'ring-1 ring-brand-purple/30' : ''
        }`}
      >
        <div className="absolute inset-0 bg-brand-bg/20 group-hover:bg-transparent transition-colors duration-300" />
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isAnime ? 'shadow-glow-purple' : 'shadow-glow-cyan'}`} />
        <span className="relative z-10 text-brand-text font-bold text-lg drop-shadow-md tracking-wide">
          {genre.name}
        </span>
        {isAnime && (
          <span className="absolute top-3 right-3 badge-purple text-[9px]">Anime</span>
        )}
      </motion.div>
    </Link>
  )
}
