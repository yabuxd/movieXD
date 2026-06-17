import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { getGenres } from '../services/tmdb'
import GenreMenu from './GenreMenu'

let genresCache = null
let genresCachePromise = null

async function fetchGenres() {
  if (genresCache) return genresCache
  if (!genresCachePromise) {
    genresCachePromise = getGenres()
      .then((data) => {
        genresCache = data.genres || []
        return genresCache
      })
      .catch((err) => {
        genresCachePromise = null
        throw err
      })
  }
  return genresCachePromise
}

export default function GenreDropdown({ variant = 'desktop', onNavigate }) {
  const [open, setOpen] = useState(false)
  const [genres, setGenres] = useState(genresCache || [])
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef(null)
  const closeTimerRef = useRef(null)
  const location = useLocation()
  const isOnGenrePage = location.pathname.startsWith('/genre/')

  const close = useCallback(() => {
    setOpen(false)
    onNavigate?.()
  }, [onNavigate])

  const loadGenres = useCallback(async () => {
    if (genresCache) {
      setGenres(genresCache)
      return
    }
    setIsLoading(true)
    try {
      const data = await fetchGenres()
      setGenres(data)
    } catch (err) {
      console.error('Failed to load genres', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const openDropdown = useCallback(() => {
    clearTimeout(closeTimerRef.current)
    setOpen(true)
    loadGenres()
  }, [loadGenres])

  const scheduleClose = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setOpen(false), 150)
  }, [])

  const cancelClose = useCallback(() => {
    clearTimeout(closeTimerRef.current)
  }, [])

  const toggle = useCallback(() => {
    if (open) {
      setOpen(false)
    } else {
      openDropdown()
    }
  }, [open, openDropdown])

  // Close on outside click
  useEffect(() => {
    if (!open) return

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  // Close when route changes
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    return () => clearTimeout(closeTimerRef.current)
  }, [])

  const isMobile = variant === 'mobile'

  return (
    <div
      ref={containerRef}
      className={`relative ${isMobile ? 'w-full' : ''}`}
      onMouseEnter={!isMobile ? openDropdown : undefined}
      onMouseLeave={!isMobile ? scheduleClose : undefined}
    >
      <button
        type="button"
        id={isMobile ? 'nav-genres-mobile' : 'nav-genres'}
        onClick={isMobile ? toggle : () => (open ? setOpen(false) : openDropdown())}
        onMouseEnter={!isMobile ? cancelClose : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-1.5 font-medium transition-all duration-200 ${
          isMobile
            ? `w-full px-4 py-3 rounded-lg text-sm ${
                open || isOnGenrePage
                  ? 'text-white bg-white/10 border-l-2 border-brand-red'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            : `px-4 py-2 rounded-lg text-sm ${
                open || isOnGenrePage
                  ? 'text-white bg-white/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
        }`}
      >
        <span>Genres</span>
        <motion.svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <GenreMenu
            key="genre-menu"
            genres={genres}
            isLoading={isLoading}
            onClose={close}
            isMobile={isMobile}
            onMouseEnter={!isMobile ? cancelClose : undefined}
            onMouseLeave={!isMobile ? scheduleClose : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
