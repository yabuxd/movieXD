import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import MovieCard from './MovieCard'
import SkeletonCard from './SkeletonCard'

export default function Row({
  title,
  movies = [],
  badge = null,
  isLoading = false,
  variant = 'default',
  seeAllLink = null,
  priorityCount = 0,
}) {
  const rowRef = useRef(null)
  const isAnime = variant === 'anime'

  const scroll = (dir) => {
    if (!rowRef.current) return
    const amount = rowRef.current.offsetWidth * 0.75
    rowRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  const badgeClass = isAnime ? 'badge-gold-muted' : 'badge-gold'
  const hoverAccent = isAnime ? 'hover:text-brand-gold-muted' : 'hover:text-brand-gold'
  const arrowHover = isAnime
    ? 'hover:bg-brand-gold-muted/80 hover:border-brand-gold-muted hover:shadow-glow-gold'
    : 'hover:bg-brand-gold/80 hover:border-brand-gold hover:shadow-glow-gold'

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  }

  return (
    <motion.section 
      id={`row-${title.toLowerCase().replace(/\s+/g, '-')}`} 
      className="relative group/row"
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between mb-5 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <h2 className={`text-xl sm:text-2xl font-bold ${isAnime ? 'text-gradient-anime' : 'text-brand-text'}`}>
            {title}
          </h2>
          {badge && (
            <span className={`${badgeClass} text-[10px] font-semibold uppercase tracking-wider`}>
              {badge}
            </span>
          )}
        </div>
        {!isLoading && movies.length > 0 && seeAllLink && (
          <Link
            to={seeAllLink}
            className={`text-brand-muted ${hoverAccent} text-sm font-medium transition-colors duration-200 flex items-center gap-1`}
          >
            See all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      <div className="relative">
        {!isLoading && movies.length > 0 && (
          <>
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="absolute left-0 top-0 bottom-8 z-10 w-14 bg-gradient-to-r from-brand-bg to-transparent flex items-center justify-start pl-2 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
            >
              <div className={`w-9 h-9 rounded-full glass flex items-center justify-center border border-white/10 transition-all duration-200 ${arrowHover}`}>
                <svg className="w-4 h-4 text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="absolute right-0 top-0 bottom-8 z-10 w-14 bg-gradient-to-l from-brand-bg to-transparent flex items-center justify-end pr-2 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
            >
              <div className={`w-9 h-9 rounded-full glass flex items-center justify-center border border-white/10 transition-all duration-200 ${arrowHover}`}>
                <svg className="w-4 h-4 text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </>
        )}

        <motion.div 
          ref={rowRef} 
          className="scroll-row hide-scrollbar px-4 sm:px-6 lg:px-8 flex gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} variant={variant} />)
            : movies.map((movie, index) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  variant={variant}
                  priority={index < priorityCount}
                />
              ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
