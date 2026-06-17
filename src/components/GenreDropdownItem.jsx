import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function GenreDropdownItem({ genre, onClick }) {
  const { id } = useParams()
  const isActive = id === String(genre.id)

  return (
    <Link
      to={`/genre/${genre.id}`}
      onClick={onClick}
      className={`block px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-brand-red text-white font-semibold'
          : 'text-gray-300 hover:text-white hover:bg-white/10'
      }`}
    >
      <motion.div
        whileHover={{ x: 4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {genre.name}
      </motion.div>
    </Link>
  )
}
