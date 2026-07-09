import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider, isConfigured } from '../services/firebase'
import { mapFirebaseUser } from '../utils/mapUser'
import { mapAuthError } from '../utils/authValidation'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const syncUser = useCallback((user) => {
    setCurrentUser(mapFirebaseUser(user))
  }, [])

  useEffect(() => {
    if (!isConfigured || !auth) {
      setInitializing(false)
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      syncUser(user)
      setInitializing(false)
    })

    return unsubscribe
  }, [syncUser])

  const clearError = useCallback(() => setError(null), [])

  const requireConfigured = useCallback(() => {
    if (isConfigured && auth) return true
    const msg = 'Authentication is not configured. Set VITE_FIREBASE_* environment variables.'
    setError(msg)
    return false
  }, [])

  const login = useCallback(async (email, password) => {
    if (!requireConfigured()) return { success: false }
    setLoading(true)
    setError(null)

    try {
      const { user } = await signInWithEmailAndPassword(auth, email.trim(), password)
      syncUser(user)
      return { success: true }
    } catch (err) {
      setError(mapAuthError(err))
      return { success: false }
    } finally {
      setLoading(false)
    }
  }, [requireConfigured, syncUser])

  const register = useCallback(async (name, email, password) => {
    if (!requireConfigured()) return { success: false }
    setLoading(true)
    setError(null)

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password)
      await updateProfile(user, { displayName: name.trim() })
      syncUser(user)
      return { success: true }
    } catch (err) {
      setError(mapAuthError(err))
      return { success: false }
    } finally {
      setLoading(false)
    }
  }, [requireConfigured, syncUser])

  const loginWithGoogle = useCallback(async () => {
    if (!requireConfigured()) return { success: false }
    setLoading(true)
    setError(null)

    try {
      const { user } = await signInWithPopup(auth, googleProvider)
      syncUser(user)
      return { success: true }
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(mapAuthError(err))
      }
      return { success: false }
    } finally {
      setLoading(false)
    }
  }, [requireConfigured, syncUser])

  const logout = useCallback(async () => {
    if (!auth) return
    setLoading(true)
    setError(null)
    try {
      await signOut(auth)
      setCurrentUser(null)
    } catch (err) {
      setError(mapAuthError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    initializing,
    loading,
    error,
    clearError,
    login,
    register,
    loginWithGoogle,
    logout,
    isConfigured,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
