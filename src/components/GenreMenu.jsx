import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import GenreDropdownItem from './GenreDropdownItem'
import { POPULAR_GENRE_IDS } from '../constants/genres'

const menuVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.02, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0 },
}

export default function GenreMenu({
  genres,
  isLoading,
  onClose,
  isMobile = false,
  onMouseEnter,
  onMouseLeave,
}) {
  const [search, setSearch] = useState('')

  const { popularGenres, otherGenres } = useMemo(() => {
    const popular = POPULAR_GENRE_IDS.map((id) =>
      genres.find((g) => g.id === id)
    ).filter(Boolean)

    const popularIds = new Set(POPULAR_GENRE_IDS)
    const others = genres.filter((g) => !popularIds.has(g.id))

    return { popularGenres: popular, otherGenres: others }
  }, [genres])

  const filteredPopular = useMemo(() => {
    if (!search.trim()) return popularGenres
    const q = search.toLowerCase()
    return popularGenres.filter((g) => g.name.toLowerCase().includes(q))
  }, [popularGenres, search])

  const filteredOthers = useMemo(() => {
    if (!search.trim()) return otherGenres
    const q = search.toLowerCase()
    return otherGenres.filter((g) => g.name.toLowerCase().includes(q))
  }, [otherGenres, search])

  const hasResults = filteredPopular.length > 0 || filteredOthers.length > 0

  return (
    <motion.div
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`overflow-hidden ${
        isMobile
          ? 'mt-2 rounded-xl border border-white/10 bg-brand-card/95'
          : 'absolute left-0 top-full z-50 mt-2 w-[min(90vw,520px)] rounded-2xl border border-white/10 bg-brand-card/95 backdrop-blur-xl shadow-2xl shadow-black/50'
      }`}
      role="menu"
      aria-label="Genre menu"
    >
      <div className={`p-4 ${isMobile ? '' : 'p-5'}`}>
        {/* Search */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search genres..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/30 transition-all duration-200"
            aria-label="Search genres"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-9 rounded-lg bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : !hasResults ? (
          <p className="text-center text-gray-500 text-sm py-6">
            No genres match &ldquo;{search}&rdquo;
          </p>
        ) : (
          <motion.div variants={listVariants} initial="hidden" animate="visible">
            {filteredPopular.length > 0 && (
              <section className="mb-4">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2 px-1">
                  Popular
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  {filteredPopular.map((genre) => (
                    <motion.div key={genre.id} variants={itemVariants}>
                      <GenreDropdownItem
                        genre={genre}
                        onClick={onClose}
                        compact
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {filteredOthers.length > 0 && (
              <section>
                {!search.trim() && (
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2 px-1">
                    All Genres
                  </h3>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 max-h-[280px] overflow-y-auto pr-1">
                  {filteredOthers.map((genre) => (
                    <motion.div key={genre.id} variants={itemVariants}>
                      <GenreDropdownItem
                        genre={genre}
                        onClick={onClose}
                        compact
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function SearchIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  )
}
