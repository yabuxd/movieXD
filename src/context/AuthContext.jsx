import { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from 'firebase/auth'
import { auth, googleProvider, isConfigured, firebaseConfig, configIssues } from '../services/firebase'
import { normalizeEmail } from '../utils/authValidation'

const AuthContext = createContext(null)

const useMockAuth = import.meta.env.DEV && !isConfigured
const authEnabled = isConfigured || useMockAuth

function readStoredUser() {
  try {
    const saved = localStorage.getItem('auth_user')
    return saved ? JSON.parse(saved) : null
  } catch {
    localStorage.removeItem('auth_user')
    return null
  }
}

function requireFirebaseAuth() {
  if (!auth) {
    throw new Error('Firebase Auth failed to initialize. Check your VITE_FIREBASE_* environment variables.')
  }
  return auth
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    if (isConfigured) return null
    return useMockAuth ? readStoredUser() : null
  })
  const [initializing, setInitializing] = useState(isConfigured)
  const [error, setError] = useState(null)

  const syncSession = (userObj) => {
    setCurrentUser(userObj)
    localStorage.setItem('auth_user', JSON.stringify(userObj))
    return userObj
  }

  useEffect(() => {
    if (!useMockAuth) return

    if (!localStorage.getItem('auth_users')) {
      localStorage.setItem('auth_users', JSON.stringify([
        { id: 'demo-user-id', email: 'user@example.com', passwordHash: 'password123' },
      ]))
    }
  }, [])

  useEffect(() => {
    if (!isConfigured || !auth) {
      setInitializing(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userObj = mapFirebaseUser(firebaseUser)
        setCurrentUser(userObj)
        localStorage.setItem('auth_user', JSON.stringify(userObj))
      } else {
        setCurrentUser(null)
        localStorage.removeItem('auth_user')
      }
      setInitializing(false)
    })

    const timeout = setTimeout(() => setInitializing(false), 8000)

    return () => {
      unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const authUnavailableError = () => {
    const msg = isConfigured
      ? 'Authentication is unavailable. Firebase failed to initialize — verify Netlify env vars and redeploy.'
      : 'Authentication is not configured. Set VITE_FIREBASE_* environment variables in Netlify and redeploy.'
    setError(msg)
    return new Error(msg)
  }

  const login = (email, password) => {
    setError(null)
    const normalizedEmail = normalizeEmail(email)

    if (!password) {
      const msg = 'Password is required.'
      setError(msg)
      return Promise.reject(new Error(msg))
    }

    if (isConfigured) {
      return signInWithEmailAndPassword(requireFirebaseAuth(), normalizedEmail, password)
        .then((result) => syncSession(mapFirebaseUser(result.user)))
        .catch(async (err) => {
          console.error('[Login] Firebase error:', err.code, err.message)
          const message = await resolveLoginError(err.code, normalizedEmail)
          setError(message)
          throw new Error(message)
        })
    }

    if (!useMockAuth) {
      return Promise.reject(authUnavailableError())
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('auth_users') || '[]')
        const found = users.find(
          (u) => u.email.toLowerCase() === normalizedEmail && u.passwordHash === password
        )
        if (found) {
          const userObj = { id: found.id, email: found.email, username: found.email.split('@')[0] }
          resolve(syncSession(userObj))
        } else {
          const msg = 'Invalid email or password. Demo account: user@example.com / password123'
          setError(msg)
          reject(new Error(msg))
        }
      }, 300)
    })
  }

  const loginWithGoogle = () => {
    if (!isConfigured || !auth) {
      const msg = useMockAuth
        ? 'Google sign-in requires Firebase credentials in your .env file.'
        : 'Google sign-in is unavailable. Configure Firebase on Netlify and redeploy.'
      setError(msg)
      return Promise.reject(new Error(msg))
    }

    setError(null)

    return signInWithPopup(requireFirebaseAuth(), googleProvider)
      .then((result) => syncSession(mapFirebaseUser(result.user)))
      .catch((err) => {
        console.error('[Google Sign-In] Firebase error:', err.code, err.message)
        const message = getFirebaseErrorMessage(err.code)
        setError(message)
        throw new Error(message)
      })
  }

  const register = (email, password) => {
    setError(null)
    const normalizedEmail = normalizeEmail(email)

    if (isConfigured) {
      return createUserWithEmailAndPassword(requireFirebaseAuth(), normalizedEmail, password)
        .then((result) => syncSession(mapFirebaseUser(result.user)))
        .catch(async (err) => {
          console.error('[Register] Firebase error:', err.code, err.message)
          const message = await resolveRegisterError(err.code, normalizedEmail)
          setError(message)
          throw new Error(message)
        })
    }

    if (!useMockAuth) {
      return Promise.reject(authUnavailableError())
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('auth_users') || '[]')
        const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail)
        if (exists) {
          const msg = 'A user with this email already exists.'
          setError(msg)
          reject(new Error(msg))
        } else {
          const newUser = { id: Date.now().toString(), email: normalizedEmail, passwordHash: password }
          users.push(newUser)
          localStorage.setItem('auth_users', JSON.stringify(users))
          const userObj = { id: newUser.id, email: newUser.email, username: newUser.email.split('@')[0] }
          resolve(syncSession(userObj))
        }
      }, 300)
    })
  }

  const resetPassword = (email) => {
    if (!isConfigured || !auth) {
      return Promise.reject(new Error('Password reset requires Firebase. Configure it on Netlify and redeploy.'))
    }

    return sendPasswordResetEmail(requireFirebaseAuth(), normalizeEmail(email), {
      url: `${window.location.origin}/login`,
      handleCodeInApp: false,
    }).catch((err) => {
      console.error('[Reset Password] Firebase error:', err.code, err.message)
      throw new Error(getFirebaseErrorMessage(err.code))
    })
  }

  const logout = () => {
    const doLogout = isConfigured && auth ? signOut(auth) : Promise.resolve()
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
        initializing,
        loading: initializing,
        error,
        isConfigured,
        useMockAuth,
        authEnabled,
        firebaseProjectId: firebaseConfig.projectId || null,
        configIssues,
        login,
        loginWithGoogle,
        register,
        resetPassword,
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
  const email = user.email || ''
  return {
    id: user.uid,
    email,
    username: user.displayName || email.split('@')[0] || 'User',
    photoURL: user.photoURL || null,
  }
}

async function getSignInMethods(email) {
  if (!auth) return []
  try {
    return await fetchSignInMethodsForEmail(auth, email)
  } catch {
    return []
  }
}

async function resolveLoginError(code, email) {
  if (!isCredentialError(code)) {
    return getFirebaseErrorMessage(code)
  }

  const methods = await getSignInMethods(email)
  if (methods.includes('google.com') && !methods.includes('password')) {
    return 'This email is registered with Google. Use "Continue with Google" instead.'
  }
  if (methods.length === 0) {
    return 'No account found for this email. Please register first.'
  }
  return 'Invalid email or password.'
}

async function resolveRegisterError(code, email) {
  if (code !== 'auth/email-already-in-use') {
    return getFirebaseErrorMessage(code)
  }

  const methods = await getSignInMethods(email)
  if (methods.includes('google.com')) {
    return 'This email is already registered with Google. Sign in with Google instead.'
  }
  return 'A user with this email already exists. Try signing in.'
}

function isCredentialError(code) {
  return (
    code === 'auth/invalid-credential' ||
    code === 'auth/user-not-found' ||
    code === 'auth/wrong-password' ||
    code === 'auth/invalid-login-credentials'
  )
}

function getFirebaseErrorMessage(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Invalid email or password.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support.'
    case 'auth/email-already-in-use':
      return 'A user with this email already exists.'
    case 'auth/weak-password':
      return 'Password must be at least 8 characters and contain at least 1 number.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was cancelled.'
    case 'auth/popup-blocked':
      return 'Pop-up was blocked by your browser. Please allow pop-ups for this site.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection or try a VPN if you are in a restricted region.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.'
    case 'auth/unauthorized-domain':
      return `This domain (${window.location.hostname}) is not authorised in Firebase. Add it under Authentication → Settings → Authorised domains.`
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Enable Email/Password and Google in Firebase Console → Authentication → Sign-in method.'
    case 'auth/invalid-api-key':
      return 'Invalid Firebase API key. Check VITE_FIREBASE_API_KEY in Netlify environment variables and redeploy.'
    case 'auth/internal-error':
      return 'Firebase internal error. Verify your API key, auth domain, and Google Cloud API key restrictions.'
    default:
      return `Authentication error (${code || 'unknown'}). Check the browser console for details.`
  }
}
