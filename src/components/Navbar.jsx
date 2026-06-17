import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useWatchlist } from '../context/WatchlistContext'
import GenreDropdown from './GenreDropdown'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { watchlist } = useWatchlist()
  const navigate = useNavigate()
  const location = useLocation()
  const isMoviesActive =
    location.pathname === '/discover' && !location.search.includes('type=tv')
  const isTvActive =
    location.pathname === '/discover' && location.search.includes('type=tv')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setQuery('')
    }
  }

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/discover', label: 'Movies' },
    { to: { pathname: '/discover', search: '?type=tv' }, label: 'TV Shows' },
  ]

  const navPill = (active) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
      active
        ? 'nav-pill-active text-brand-cyan'
        : 'text-brand-muted hover:text-brand-text hover:bg-brand-surface/50'
    }`

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-nav shadow-nav' : 'bg-transparent'
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" id="cineflow-logo" className="flex items-center gap-2.5 group select-none">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-purple flex items-center justify-center shadow-glow-cyan group-hover:scale-105 transition-transform duration-300">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 3l4 4-4 4V3zm5 0h7v2h-7V3zm0 4h5v2h-5V7zm0 4h7v2h-7v-2z" fill="#0A0F1E" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-tight">
                <span className="text-brand-text">Movie</span>
                <span className="text-gradient-cyan">XD</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" end id="nav-home" className={({ isActive }) => navPill(isActive)}>
                Home
              </NavLink>
              <NavLink to="/discover" id="nav-movies" className={navPill(isMoviesActive)}>
                Movies
              </NavLink>
              <NavLink
                to={{ pathname: '/discover', search: '?type=tv' }}
                id="nav-tv-shows"
                className={navPill(isTvActive)}
              >
                TV Shows
              </NavLink>
              <GenreDropdown />
            </nav>

            <div className="flex items-center gap-1">
              <button
                id="navbar-search-btn"
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl text-brand-muted hover:text-brand-cyan hover:bg-brand-surface/60 transition-all duration-300"
                aria-label="Open search"
              >
                <SearchIcon />
              </button>

              <Link
                to="/watchlist"
                id="navbar-watchlist-btn"
                className="relative p-2.5 rounded-xl text-brand-muted hover:text-brand-cyan hover:bg-brand-surface/60 transition-all duration-300"
                aria-label="My Watchlist"
              >
                <BookmarkIcon />
                {watchlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-cyan text-brand-bg text-[9px] font-bold rounded-full flex items-center justify-center">
                    {watchlist.length > 9 ? '9+' : watchlist.length}
                  </span>
                )}
              </Link>

              <Link
                to="/login"
                id="navbar-profile-btn"
                className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-purple to-brand-cyan flex items-center justify-center text-xs font-bold text-brand-bg hover:shadow-glow-cyan transition-all duration-300"
                aria-label="Profile"
              >
                MX
              </Link>

              <button
                id="navbar-mobile-menu-btn"
                className="md:hidden p-2.5 rounded-xl text-brand-muted hover:text-brand-text hover:bg-brand-surface/60 transition-all duration-300"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/[0.06] glass overflow-hidden"
            >
              <nav className="px-4 py-3 flex flex-col gap-1">
                {navLinks.map(({ to, label, end }) => {
                  const isMoviesLink = label === 'Movies'
                  const isTvLink = label === 'TV Shows'
                  const active =
                    (isMoviesLink && isMoviesActive) ||
                    (isTvLink && isTvActive) ||
                    (end ? location.pathname === '/' : false)

                  return (
                    <NavLink
                      key={label}
                      to={to}
                      end={end}
                      onClick={() => setMobileOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        active
                          ? 'text-brand-cyan bg-brand-surface/80 border-l-2 border-brand-cyan'
                          : 'text-brand-muted hover:text-brand-text hover:bg-brand-surface/40'
                      }`}
                    >
                      {label}
                    </NavLink>
                  )
                })}
                <GenreDropdown variant="mobile" onNavigate={() => setMobileOpen(false)} />
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-brand-bg/80 backdrop-blur-xl flex items-start justify-center pt-24 px-4"
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          >
            <motion.form
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSearch}
              className="w-full max-w-2xl relative"
            >
              <div className="flex items-center glass rounded-2xl px-5 py-4 border border-brand-cyan/20 shadow-glow-cyan">
                <SearchIcon className="text-brand-cyan mr-3 flex-shrink-0" />
                <input
                  id="search-input-overlay"
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search movies, anime, shows..."
                  className="flex-1 bg-transparent text-brand-text placeholder-brand-muted text-lg outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="ml-3 text-brand-muted hover:text-brand-text transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>
              <p className="text-center text-brand-muted text-sm mt-4">
                Press <kbd className="px-2 py-0.5 bg-brand-surface rounded text-xs border border-white/[0.08]">Enter</kbd> to search
              </p>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function SearchIcon({ className = '' }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
