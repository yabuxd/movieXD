import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('moviexd_current_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Seed a default user for testing if no users exist
  useEffect(() => {
    const registeredUsers = localStorage.getItem('moviexd_users')
    if (!registeredUsers) {
      const defaultUsers = [
        {
          email: 'user@example.com',
          password: 'password123',
          name: 'Demo User',
        }
      ]
      localStorage.setItem('moviexd_users', JSON.stringify(defaultUsers))
    }
  }, [])

  const login = (email, password) => {
    setLoading(true)
    setError(null)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const registeredUsers = JSON.parse(localStorage.getItem('moviexd_users') || '[]')
          const foundUser = registeredUsers.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
          )

          if (foundUser) {
            const loggedInUser = { email: foundUser.email, name: foundUser.name || 'User' }
            setUser(loggedInUser)
            localStorage.setItem('moviexd_current_user', JSON.stringify(loggedInUser))
            setLoading(false)
            resolve(loggedInUser)
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
      }, 1000)
    })
  }

  const register = (email, password, name) => {
    setLoading(true)
    setError(null)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const registeredUsers = JSON.parse(localStorage.getItem('moviexd_users') || '[]')
          const exists = registeredUsers.some(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          )

          if (exists) {
            const err = new Error('A user with this email already exists')
            setError(err.message)
            setLoading(false)
            reject(err)
          } else {
            const newUser = { email, password, name: name || 'User' }
            registeredUsers.push(newUser)
            localStorage.setItem('moviexd_users', JSON.stringify(registeredUsers))

            // Auto-login the registered user
            const loggedInUser = { email: newUser.email, name: newUser.name }
            setUser(loggedInUser)
            localStorage.setItem('moviexd_current_user', JSON.stringify(loggedInUser))

            setLoading(false)
            resolve(loggedInUser)
          }
        } catch (err) {
          setError('A registration error occurred')
          setLoading(false)
          reject(err)
        }
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('moviexd_current_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
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
