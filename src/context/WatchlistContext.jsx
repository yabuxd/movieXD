import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'

const WatchlistContext = createContext(null)

export function WatchlistProvider({ children }) {
  const { currentUser } = useAuth()
  const storageKey = currentUser ? `watchlist_${currentUser.id}` : 'watchlist'

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
    (id) => watchlist.some((m) => String(m.id) === String(id)),
    [watchlist]
  )

  const addToWatchlist = useCallback((movie) => {
    setWatchlist((prev) => {
      const stringId = String(movie.id)
      if (prev.some((m) => String(m.id) === stringId)) {
        return prev // Silently ignore duplicate
      }
      const newItem = {
        id: stringId,
        title: movie.title || '',
        poster_path: movie.poster_path || '',
        release_date: movie.release_date || '',
        vote_average: movie.vote_average || 0,
        addedAt: Date.now()
      }
      return [...prev, newItem]
    })
  }, [])

  const removeFromWatchlist = useCallback((movieId) => {
    setWatchlist((prev) => prev.filter((m) => String(m.id) !== String(movieId)))
  }, [])

  const toggleWatchlist = useCallback((movie) => {
    setWatchlist((prev) => {
      const stringId = String(movie.id)
      if (prev.some((m) => String(m.id) === stringId)) {
        return prev.filter((m) => String(m.id) !== stringId)
      } else {
        return [
          ...prev,
          {
            id: stringId,
            title: movie.title || '',
            poster_path: movie.poster_path || '',
            release_date: movie.release_date || '',
            vote_average: movie.vote_average || 0,
            addedAt: Date.now()
          }
        ]
      }
    })
  }, [])

  return (
    <WatchlistContext.Provider value={{ watchlist, isInWatchlist, addToWatchlist, removeFromWatchlist, toggleWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider')
  return ctx
}
