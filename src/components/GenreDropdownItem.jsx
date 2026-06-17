import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const ANIME_GENRE_ID = 16

export default function GenreDropdownItem({ genre, onClick, compact = false, featured = false }) {
  const location = useLocation()
  const isActive = location.pathname === `/genre/${genre.id}`
  const isAnime = genre.id === ANIME_GENRE_ID || featured

  return (
    <Link
      to={`/genre/${genre.id}`}
      onClick={onClick}
      className={`group flex items-center gap-2 rounded-xl transition-all duration-200 ${
        compact ? 'px-3 py-2' : 'px-3 py-2.5'
      } ${
        isActive
          ? isAnime
            ? 'bg-brand-purple/90 text-white font-semibold shadow-glow-purple'
            : 'bg-brand-cyan/90 text-brand-bg font-semibold shadow-glow-cyan'
          : isAnime
            ? 'text-brand-purple hover:text-white hover:bg-brand-purple/15 border border-transparent hover:border-brand-purple/30'
            : 'text-brand-muted hover:text-brand-text hover:bg-brand-cyan/10'
      }`}
    >
      <motion.span
        className="text-sm truncate flex items-center gap-1.5"
        whileHover={{ x: 3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {isAnime && (
          <span className="w-1.5 h-1.5 rounded-full bg-brand-purple flex-shrink-0" />
        )}
        {genre.name}
      </motion.span>
      {isActive && (
        <span className={`ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0 ${isAnime ? 'bg-white' : 'bg-brand-bg'}`} />
      )}
    </Link>
  )
}
