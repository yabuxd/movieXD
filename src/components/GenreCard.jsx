import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

// Simple mapping for gradient colors based on genre id
const GENRE_COLORS = {
  28: 'from-red-500 to-orange-500', // Action
  12: 'from-emerald-400 to-cyan-400', // Adventure
  16: 'from-pink-500 to-rose-500', // Animation
  35: 'from-yellow-400 to-orange-500', // Comedy
  80: 'from-gray-700 to-black', // Crime
  99: 'from-blue-600 to-indigo-600', // Documentary
  18: 'from-purple-500 to-indigo-500', // Drama
  10751: 'from-green-400 to-emerald-500', // Family
  14: 'from-fuchsia-500 to-purple-600', // Fantasy
  36: 'from-yellow-700 to-amber-900', // History
  27: 'from-red-900 to-black', // Horror
  10402: 'from-pink-400 to-rose-400', // Music
  9648: 'from-slate-700 to-gray-900', // Mystery
  10749: 'from-pink-300 to-rose-400', // Romance
  878: 'from-cyan-500 to-blue-600', // Sci-Fi
  10770: 'from-gray-400 to-gray-600', // TV Movie
  53: 'from-red-700 to-rose-900', // Thriller
  10752: 'from-stone-600 to-stone-800', // War
  37: 'from-amber-700 to-orange-900', // Western
}

export default function GenreCard({ genre }) {
  const gradient = GENRE_COLORS[genre.id] || 'from-brand-red to-purple-600'

  return (
    <Link to={`/genre/${genre.id}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative h-32 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br ${gradient} p-4 flex items-end cursor-pointer group`}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
        <span className="relative z-10 text-white font-bold text-lg drop-shadow-md tracking-wide">
          {genre.name}
        </span>
      </motion.div>
    </Link>
  )
}
