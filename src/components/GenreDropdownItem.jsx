import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function GenreDropdownItem({ genre, onClick, compact = false }) {
  const location = useLocation()
  const isActive = location.pathname === `/genre/${genre.id}`

  return (
    <Link
      to={`/genre/${genre.id}`}
      onClick={onClick}
      className={`group flex items-center gap-2 rounded-lg transition-all duration-200 ${
        compact ? 'px-3 py-2' : 'px-3 py-2.5'
      } ${
        isActive
          ? 'bg-brand-red/90 text-white font-semibold shadow-lg shadow-brand-red/20'
          : 'text-gray-300 hover:text-white hover:bg-white/10'
      }`}
    >
      <motion.span
        className="text-sm truncate"
        whileHover={{ x: 3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {genre.name}
      </motion.span>
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
      )}
    </Link>
  )
}
