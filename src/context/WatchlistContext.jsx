import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'

const WatchlistContext = createContext(null)

export function WatchlistProvider({ children }) {
  const { currentUser } = useAuth()
  const [watchlist, setWatchlist] = useState([])
  const storageKey = currentUser ? `watchlist_${currentUser.id}` : null

  useEffect(() => {
    if (!storageKey) {
      setWatchlist([])
      return
    }
    const saved = localStorage.getItem(storageKey)
    setWatchlist(saved ? JSON.parse(saved) : [])
  }, [storageKey])

  useEffect(() => {
    if (!storageKey) return
    localStorage.setItem(storageKey, JSON.stringify(watchlist))
  }, [watchlist, storageKey])

  const isInWatchlist = useCallback(
    (id) => watchlist.some((m) => String(m.id) === String(id)),
    [watchlist]
  )

  const addToWatchlist = useCallback((movie) => {
    setWatchlist((prev) => {
      const stringId = String(movie.id)
      if (prev.some((m) => String(m.id) === stringId)) {
        return prev
      }
      const newItem = {
        id: stringId,
        title: movie.title || '',
        poster_path: movie.poster_path || '',
        release_date: movie.release_date || '',
        vote_average: movie.vote_average || 0,
        addedAt: Date.now(),
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
      }
      return [
        ...prev,
        {
          id: stringId,
          title: movie.title || '',
          poster_path: movie.poster_path || '',
          release_date: movie.release_date || '',
          vote_average: movie.vote_average || 0,
          addedAt: Date.now(),
        },
      ]
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
