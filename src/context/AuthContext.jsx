import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('auth_user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Seed a default user for testing if no users exist
  useEffect(() => {
    const registeredUsers = localStorage.getItem('auth_users')
    if (!registeredUsers) {
      const defaultUsers = [
        {
          id: 'demo-user-id',
          email: 'user@example.com',
          passwordHash: 'password123',
        }
      ]
      localStorage.setItem('auth_users', JSON.stringify(defaultUsers))
    }
  }, [])

  const login = (email, password) => {
    setLoading(true)
    setError(null)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const registeredUsers = JSON.parse(localStorage.getItem('auth_users') || '[]')
          const foundUser = registeredUsers.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password
          )

          if (foundUser) {
            const userObj = {
              id: foundUser.id,
              email: foundUser.email,
              username: foundUser.email.split('@')[0],
            }
            setCurrentUser(userObj)
            localStorage.setItem('auth_user', JSON.stringify(userObj))
            setLoading(false)
            resolve(userObj)
          } else {
            const err = new Error('Invalid email or password')
            setError(err.message)
            setLoading(false)
            reject(err)
          }
        } catch (err) {
          setError('An authentication error occurred')
          setLoading(false)
          reject(err)
        }
      }, 500)
    })
  }

  const register = (email, password) => {
    setLoading(true)
    setError(null)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const registeredUsers = JSON.parse(localStorage.getItem('auth_users') || '[]')
          const exists = registeredUsers.some(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          )

          if (exists) {
            const err = new Error('A user with this email already exists')
            setError(err.message)
            setLoading(false)
            reject(err)
          } else {
            const newUser = {
              id: Date.now().toString(),
              email: email.toLowerCase(),
              passwordHash: password,
            }
            registeredUsers.push(newUser)
            localStorage.setItem('auth_users', JSON.stringify(registeredUsers))

            // Auto-login the registered user
            const userObj = {
              id: newUser.id,
              email: newUser.email,
              username: newUser.email.split('@')[0],
            }
            setCurrentUser(userObj)
            localStorage.setItem('auth_user', JSON.stringify(userObj))

            setLoading(false)
            resolve(userObj)
          }
        } catch (err) {
          setError('A registration error occurred')
          setLoading(false)
          reject(err)
        }
      }, 500)
    })
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('auth_user')
    // Redirect to login page
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        error,
        login,
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
