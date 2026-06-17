import { useRef } from 'react'
import MovieCard from './MovieCard'
import SkeletonCard from './SkeletonCard'

export default function Row({ title, movies = [], badge = null, isLoading = false }) {
  const rowRef = useRef(null)

  const scroll = (dir) => {
    if (!rowRef.current) return
    const amount = rowRef.current.offsetWidth * 0.75
    rowRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <section id={`row-${title.toLowerCase().replace(/\s+/g, '-')}`} className="relative group/row">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
          {badge && (
            <span className="badge-red text-[10px] font-semibold uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
        {!isLoading && movies.length > 0 && (
          <button
            className="text-gray-400 hover:text-brand-red text-sm font-medium transition-colors duration-200 flex items-center gap-1"
          >
            See all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Scroll Wrapper */}
      <div className="relative">
        {/* Left Arrow */}
        {!isLoading && movies.length > 0 && (
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-0 top-0 bottom-6 z-10 w-12 bg-gradient-to-r from-brand-dark to-transparent flex items-center justify-start pl-1
                       opacity-0 group-hover/row:opacity-100 transition-opacity duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-brand-red/80 hover:border-brand-red transition-all duration-200">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>
        )}

        {/* Right Arrow */}
        {!isLoading && movies.length > 0 && (
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="absolute right-0 top-0 bottom-6 z-10 w-12 bg-gradient-to-l from-brand-dark to-transparent flex items-center justify-end pr-1
                       opacity-0 group-hover/row:opacity-100 transition-opacity duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-brand-red/80 hover:border-brand-red transition-all duration-200">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        )}

        {/* Scrollable row */}
        <div
          ref={rowRef}
          className="scroll-row hide-scrollbar px-4 sm:px-6 lg:px-8 flex gap-4"
        >
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : (
            movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
