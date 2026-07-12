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

    // #region agent log
    fetch('http://127.0.0.1:7413/ingest/a3696a9f-9e8c-4e33-8045-80214d6aad95',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7cb7ff'},body:JSON.stringify({sessionId:'7cb7ff',runId:'pre-fix',hypothesisId:'C',location:'AuthContext.jsx:login',message:'signIn payload types',data:{emailType:typeof email,passwordType:typeof password,emailLen:typeof email==='string'?email.trim().length:null,passwordLen:typeof password==='string'?password.length:null,passwordIsNull:password===null,passwordIsUndefined:password===undefined,authReady:Boolean(auth)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    try {
      const { user } = await signInWithEmailAndPassword(auth, email.trim(), password)
      // #region agent log
      fetch('http://127.0.0.1:7413/ingest/a3696a9f-9e8c-4e33-8045-80214d6aad95',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7cb7ff'},body:JSON.stringify({sessionId:'7cb7ff',runId:'pre-fix',hypothesisId:'C',location:'AuthContext.jsx:login:success',message:'signIn succeeded',data:{uid:user?.uid??null},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      syncUser(user)
      return { success: true }
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7413/ingest/a3696a9f-9e8c-4e33-8045-80214d6aad95',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7cb7ff'},body:JSON.stringify({sessionId:'7cb7ff',runId:'pre-fix',hypothesisId:'B,E',location:'AuthContext.jsx:login:catch',message:'signIn raw error',data:{code:err?.code??null,message:err?.message??null,name:err?.name??null,customData:err?.customData??null,mapped:mapAuthError(err)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
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

    // #region agent log
    fetch('http://127.0.0.1:7413/ingest/a3696a9f-9e8c-4e33-8045-80214d6aad95',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7cb7ff'},body:JSON.stringify({sessionId:'7cb7ff',runId:'pre-fix',hypothesisId:'C',location:'AuthContext.jsx:register',message:'signUp payload types',data:{nameType:typeof name,emailType:typeof email,passwordType:typeof password,nameLen:typeof name==='string'?name.trim().length:null,emailLen:typeof email==='string'?email.trim().length:null,passwordLen:typeof password==='string'?password.length:null,passwordIsNull:password===null,passwordIsUndefined:password===undefined,authReady:Boolean(auth)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password)
      // #region agent log
      fetch('http://127.0.0.1:7413/ingest/a3696a9f-9e8c-4e33-8045-80214d6aad95',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7cb7ff'},body:JSON.stringify({sessionId:'7cb7ff',runId:'pre-fix',hypothesisId:'C',location:'AuthContext.jsx:register:createSuccess',message:'createUser succeeded, updating profile',data:{uid:user?.uid??null},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      await updateProfile(user, { displayName: name.trim() })
      syncUser(user)
      return { success: true }
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7413/ingest/a3696a9f-9e8c-4e33-8045-80214d6aad95',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7cb7ff'},body:JSON.stringify({sessionId:'7cb7ff',runId:'pre-fix',hypothesisId:'B,E',location:'AuthContext.jsx:register:catch',message:'signUp raw error',data:{code:err?.code??null,message:err?.message??null,name:err?.name??null,customData:err?.customData??null,mapped:mapAuthError(err)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
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
