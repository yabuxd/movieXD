import { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, googleProvider, isConfigured } from '../services/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('auth_user')
    return saved ? JSON.parse(saved) : null
  })
  // If Firebase is configured it needs a moment to resolve auth state; otherwise we're ready
  const [loading, setLoading] = useState(isConfigured)
  const [error, setError] = useState(null)

  // Seed a default demo user for the mock (non-Firebase) auth path
  useEffect(() => {
    if (!isConfigured) {
      if (!localStorage.getItem('auth_users')) {
        localStorage.setItem('auth_users', JSON.stringify([
          { id: 'demo-user-id', email: 'user@example.com', passwordHash: 'password123' },
        ]))
      }
    }
  }, [])

  // Subscribe to Firebase auth state changes
  useEffect(() => {
    if (!isConfigured) return

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userObj = mapFirebaseUser(firebaseUser)
        setCurrentUser(userObj)
        localStorage.setItem('auth_user', JSON.stringify(userObj))
      } else {
        setCurrentUser(null)
        localStorage.removeItem('auth_user')
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // ── EMAIL / PASSWORD LOGIN ──────────────────────────────────────────────────
  const login = (email, password) => {
    setLoading(true)
    setError(null)

    if (isConfigured) {
      return signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          setLoading(false)
          return mapFirebaseUser(result.user)
        })
        .catch((err) => {
          const message = getFirebaseErrorMessage(err.code)
          setError(message)
          setLoading(false)
          throw new Error(message)
        })
    }

    // Mock (localStorage) path
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('auth_users') || '[]')
        const found = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password
        )
        if (found) {
          const userObj = { id: found.id, email: found.email, username: found.email.split('@')[0] }
          setCurrentUser(userObj)
          localStorage.setItem('auth_user', JSON.stringify(userObj))
          setLoading(false)
          resolve(userObj)
        } else {
          const msg = 'Invalid email or password.'
          setError(msg)
          setLoading(false)
          reject(new Error(msg))
        }
      }, 500)
    })
  }

  // ── GOOGLE SIGN-IN ──────────────────────────────────────────────────────────
  const loginWithGoogle = () => {
    if (!isConfigured) {
      const msg = 'Google sign-in requires Firebase credentials. Add them to your .env file.'
      setError(msg)
      return Promise.reject(new Error(msg))
    }

    setLoading(true)
    setError(null)

    return signInWithPopup(auth, googleProvider)
      .then((result) => {
        setLoading(false)
        return mapFirebaseUser(result.user)
      })
      .catch((err) => {
        const message = getFirebaseErrorMessage(err.code)
        setError(message)
        setLoading(false)
        throw new Error(message)
      })
  }

  // ── REGISTER ────────────────────────────────────────────────────────────────
  const register = (email, password) => {
    setLoading(true)
    setError(null)

    if (isConfigured) {
      return createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          setLoading(false)
          return mapFirebaseUser(result.user)
        })
        .catch((err) => {
          const message = getFirebaseErrorMessage(err.code)
          setError(message)
          setLoading(false)
          throw new Error(message)
        })
    }

    // Mock path
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('auth_users') || '[]')
        const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase())
        if (exists) {
          const msg = 'A user with this email already exists.'
          setError(msg)
          setLoading(false)
          reject(new Error(msg))
        } else {
          const newUser = { id: Date.now().toString(), email: email.toLowerCase(), passwordHash: password }
          users.push(newUser)
          localStorage.setItem('auth_users', JSON.stringify(users))
          const userObj = { id: newUser.id, email: newUser.email, username: newUser.email.split('@')[0] }
          setCurrentUser(userObj)
          localStorage.setItem('auth_user', JSON.stringify(userObj))
          setLoading(false)
          resolve(userObj)
        }
      }, 500)
    })
  }

  // ── LOGOUT ──────────────────────────────────────────────────────────────────
  const logout = () => {
    const doLogout = isConfigured ? signOut(auth) : Promise.resolve()
    return doLogout.finally(() => {
      setCurrentUser(null)
      localStorage.removeItem('auth_user')
      window.location.href = '/login'
    })
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        error,
        login,
        loginWithGoogle,
        register,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

function mapFirebaseUser(user) {
  return {
    id: user.uid,
    email: user.email,
    username: user.displayName || user.email.split('@')[0],
    photoURL: user.photoURL || null,
  }
}

function getFirebaseErrorMessage(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.'
    case 'auth/email-already-in-use':
      return 'A user with this email already exists.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.'
    case 'auth/popup-blocked':
      return 'Pop-up was blocked by your browser. Please allow pop-ups for this site.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.'
    default:
      return 'An authentication error occurred. Please try again.'
  }
}
