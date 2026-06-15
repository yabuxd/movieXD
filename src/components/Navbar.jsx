import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { watchlist } = useWatchlist()
  const navigate = useNavigate()

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
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Browse' },
    { to: '/watchlist', label: 'My List' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-brand-dark/95 backdrop-blur-md shadow-2xl border-b border-brand-border'
            : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              id="cineflow-logo"
              className="flex items-center gap-2 group select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 3l4 4-4 4V3zm5 0h7v2h-7V3zm0 4h5v2h-5V7zm0 4h7v2h-7v-2z" fill="white" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-tight">
                <span className="text-white">Cine</span>
                <span className="text-brand-red">Flow</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  id={`nav-${label.toLowerCase().replace(/\s/g, '-')}`}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? 'text-white bg-white/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                id="navbar-search-btn"
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Open search"
              >
                <SearchIcon />
              </button>

              {/* Watchlist */}
              <Link
                to="/watchlist"
                id="navbar-watchlist-btn"
                className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="My Watchlist"
              >
                <BookmarkIcon />
                {watchlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {watchlist.length > 9 ? '9+' : watchlist.length}
                  </span>
                )}
              </Link>

              {/* Profile Avatar */}
              <Link
                to="/login"
                id="navbar-profile-btn"
                className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-brand-red flex items-center justify-center text-xs font-bold text-white hover:ring-2 hover:ring-brand-red/50 transition-all duration-200"
                aria-label="Profile"
              >
                CF
              </Link>

              {/* Mobile menu button */}
              <button
                id="navbar-mobile-menu-btn"
                className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-brand-border bg-brand-dark/98 backdrop-blur-md">
            <nav className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-white/10 border-l-2 border-brand-red'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-start justify-center pt-24 px-4"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        >
          <form
            onSubmit={handleSearch}
            className="w-full max-w-2xl relative"
          >
            <div className="flex items-center glass rounded-2xl px-4 py-3 border border-white/20 shadow-2xl">
              <SearchIcon className="text-gray-400 mr-3 flex-shrink-0" />
              <input
                id="search-input-overlay"
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, shows, actors..."
                className="flex-1 bg-transparent text-white placeholder-gray-500 text-lg outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="ml-3 text-gray-400 hover:text-white transition-colors"
              >
                <CloseIcon />
              </button>
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">
              Press <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs">Enter</kbd> to search
            </p>
          </form>
        </div>
      )}
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
