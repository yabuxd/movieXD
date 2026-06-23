import { createContext, useContext, useState, useEffect } from 'react'

const ContinueWatchingContext = createContext()

export function useContinueWatching() {
  return useContext(ContinueWatchingContext)
}

export function ContinueWatchingProvider({ children }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('continue_watching')
    if (stored) {
      try {
        setHistory(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse continue_watching')
        setHistory([])
      }
    }
  }, [])

  const addToHistory = (movie) => {
    setHistory(prev => {
      // Remove if it already exists to move it to the top
      const filtered = prev.filter(m => m.id !== movie.id)
      const newItem = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        viewedAt: Date.now()
      }
      const updated = [newItem, ...filtered].slice(0, 10) // Max 10 items
      localStorage.setItem('continue_watching', JSON.stringify(updated))
      return updated
    })
  }

  const removeFromHistory = (id) => {
    setHistory(prev => {
      const updated = prev.filter(m => m.id !== id)
      localStorage.setItem('continue_watching', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <ContinueWatchingContext.Provider value={{ history, addToHistory, removeFromHistory }}>
      {children}
    </ContinueWatchingContext.Provider>
  )
}
