import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext(null)

function toFavoriteItem(movie) {
  return {
    id: String(movie.id),
    title: movie.title || '',
    poster_path: movie.poster_path || '',
    release_date: movie.release_date || '',
    vote_average: movie.vote_average || 0,
    addedAt: Date.now(),
  }
}

export function FavoritesProvider({ children }) {
  const { currentUser } = useAuth()
  const [favorites, setFavorites] = useState([])
  const storageKey = currentUser ? `favorites_${currentUser.id}` : null

  useEffect(() => {
    if (!storageKey) {
      setFavorites([])
      return
    }
    const saved = localStorage.getItem(storageKey)
    setFavorites(saved ? JSON.parse(saved) : [])
  }, [storageKey])

  useEffect(() => {
    if (!storageKey) return
    localStorage.setItem(storageKey, JSON.stringify(favorites))
  }, [favorites, storageKey])

  const isFavorite = useCallback(
    (id) => favorites.some((m) => String(m.id) === String(id)),
    [favorites]
  )

  const addToFavorites = useCallback((movie) => {
    setFavorites((prev) => {
      const stringId = String(movie.id)
      if (prev.some((m) => String(m.id) === stringId)) return prev
      return [toFavoriteItem(movie), ...prev]
    })
  }, [])

  const removeFromFavorites = useCallback((id) => {
    setFavorites((prev) => prev.filter((m) => String(m.id) !== String(id)))
  }, [])

  const toggleFavorite = useCallback((movie) => {
    setFavorites((prev) => {
      const stringId = String(movie.id)
      if (prev.some((m) => String(m.id) === stringId)) {
        return prev.filter((m) => String(m.id) !== stringId)
      }
      return [toFavoriteItem(movie), ...prev]
    })
  }, [])

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, addToFavorites, removeFromFavorites, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
