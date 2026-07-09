import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const ContinueWatchingContext = createContext()

export function useContinueWatching() {
  return useContext(ContinueWatchingContext)
}

export function ContinueWatchingProvider({ children }) {
  const { currentUser } = useAuth()
  const [history, setHistory] = useState([])
  const storageKey = currentUser ? `continue_watching_${currentUser.id}` : null

  useEffect(() => {
    if (!storageKey) {
      setHistory([])
      return
    }
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        setHistory(JSON.parse(stored))
      } catch {
        setHistory([])
      }
    } else {
      setHistory([])
    }
  }, [storageKey])

  const persist = (updated) => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(updated))
    }
    return updated
  }

  const addToHistory = (movie) => {
    if (!currentUser) return
    setHistory((prev) => {
      const filtered = prev.filter((m) => String(m.id) !== String(movie.id))
      const existing = prev.find((m) => String(m.id) === String(movie.id))
      const newItem = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        viewedAt: Date.now(),
        progress: existing?.progress || 15,
      }
      return persist([newItem, ...filtered].slice(0, 10))
    })
  }

  const updateProgress = (id, progress) => {
    if (!currentUser) return
    setHistory((prev) => {
      const updated = prev.map((m) => {
        if (String(m.id) === String(id)) {
          return { ...m, progress, viewedAt: Date.now() }
        }
        return m
      })
      return persist(updated)
    })
  }

  const removeFromHistory = (id) => {
    if (!currentUser) return
    setHistory((prev) => persist(prev.filter((m) => String(m.id) !== String(id))))
  }

  return (
    <ContinueWatchingContext.Provider
      value={{ history, addToHistory, updateProgress, removeFromHistory }}
    >
      {children}
    </ContinueWatchingContext.Provider>
  )
}
