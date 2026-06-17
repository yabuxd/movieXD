import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import GenreDropdownItem from './GenreDropdownItem'
import { POPULAR_GENRE_IDS } from '../constants/genres'

const ANIME_GENRE_ID = 16

const menuVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
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

  const animeGenre = useMemo(
    () => genres.find((g) => g.id === ANIME_GENRE_ID),
    [genres]
  )

  const { popularGenres, otherGenres } = useMemo(() => {
    const popular = POPULAR_GENRE_IDS.map((id) =>
      genres.find((g) => g.id === id)
    ).filter(Boolean)

    const popularIds = new Set([...POPULAR_GENRE_IDS, ANIME_GENRE_ID])
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

  const showAnime = animeGenre && (!search.trim() || animeGenre.name.toLowerCase().includes(search.toLowerCase()))
  const hasResults = filteredPopular.length > 0 || filteredOthers.length > 0 || showAnime

  return (
    <motion.div
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`overflow-hidden glass ${
        isMobile
          ? 'mt-2 rounded-2xl'
          : 'absolute left-0 top-full z-50 mt-2 w-[min(90vw,540px)] rounded-2xl shadow-card border border-white/[0.08]'
      }`}
      role="menu"
      aria-label="Genre menu"
    >
      <div className={`p-4 ${isMobile ? '' : 'p-5'}`}>
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search genres..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-brand-surface/60 border border-white/[0.08] text-brand-text placeholder-brand-muted outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20 transition-all duration-200"
            aria-label="Search genres"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-9 rounded-xl skeleton" />
            ))}
          </div>
        ) : !hasResults ? (
          <p className="text-center text-brand-muted text-sm py-6">
            No genres match &ldquo;{search}&rdquo;
          </p>
        ) : (
          <motion.div variants={listVariants} initial="hidden" animate="visible">
            {showAnime && (
              <section className="mb-4">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-brand-purple mb-2 px-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-purple" />
                  Featured — Anime
                </h3>
                <div className="p-2 rounded-xl bg-gradient-to-r from-brand-cyan/5 to-brand-purple/10 border border-brand-purple/20">
                  <GenreDropdownItem
                    genre={animeGenre}
                    onClick={onClose}
                    compact
                    featured
                  />
                </div>
              </section>
            )}

            {filteredPopular.length > 0 && (
              <section className="mb-4">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted mb-2 px-1">
                  Popular
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  {filteredPopular.map((genre) => (
                    <motion.div key={genre.id} variants={itemVariants}>
                      <GenreDropdownItem genre={genre} onClick={onClose} compact />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {filteredOthers.length > 0 && (
              <section>
                {!search.trim() && (
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted mb-2 px-1">
                    All Genres
                  </h3>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 max-h-[260px] overflow-y-auto pr-1">
                  {filteredOthers.map((genre) => (
                    <motion.div key={genre.id} variants={itemVariants}>
                      <GenreDropdownItem genre={genre} onClick={onClose} compact />
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}
