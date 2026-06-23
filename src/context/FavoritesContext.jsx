import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext()

export function useFavorites() {
  return useContext(FavoritesContext)
}

export function FavoritesProvider({ children }) {
  const { currentUser, isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const stored = localStorage.getItem(`favorites_${currentUser.id}`)
      if (stored) {
        try {
          setFavorites(JSON.parse(stored))
        } catch (e) {
          console.error('Failed to parse favorites')
          setFavorites([])
        }
      } else {
        setFavorites([])
      }
    } else {
      setFavorites([])
    }
  }, [currentUser, isAuthenticated])

  const saveFavorites = (newFavorites) => {
    setFavorites(newFavorites)
    if (currentUser) {
      localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(newFavorites))
    }
  }

  const toggleFavorite = (movie) => {
    const exists = favorites.find(m => m.id === movie.id)
    if (exists) {
      saveFavorites(favorites.filter(m => m.id !== movie.id))
    } else {
      saveFavorites([
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          addedAt: Date.now()
        },
        ...favorites
      ])
    }
  }

  const removeFromFavorites = (id) => {
    saveFavorites(favorites.filter(m => m.id !== id))
  }

  const isFavorite = (id) => {
    return favorites.some(m => m.id === id)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, removeFromFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}
