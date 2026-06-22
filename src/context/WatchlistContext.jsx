import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'

const WatchlistContext = createContext(null)

export function WatchlistProvider({ children }) {
  const { user } = useAuth()
  const storageKey = user ? `watchlist_${user.email}` : 'watchlist'

  const [watchlist, setWatchlist] = useState([])
  const [loadedKey, setLoadedKey] = useState('')

  // Load from localStorage when storageKey changes
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    setWatchlist(saved ? JSON.parse(saved) : [])
    setLoadedKey(storageKey)
  }, [storageKey])

  // Save to localStorage only if we are saving for the loadedKey
  useEffect(() => {
    if (loadedKey === storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(watchlist))
    }
  }, [watchlist, storageKey, loadedKey])

  const isInWatchlist = useCallback(
    (id) => watchlist.some((m) => m.id === id),
    [watchlist]
  )

  const toggleWatchlist = useCallback((movie) => {
    setWatchlist((prev) =>
      prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    )
  }, [])

  return (
    <WatchlistContext.Provider value={{ watchlist, isInWatchlist, toggleWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider')
  return ctx
}
