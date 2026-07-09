import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function GuestRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/'

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <LoadingSpinner />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}
