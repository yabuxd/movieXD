import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'

export default function RootLayout() {
  const location = useLocation()
  const { initializing } = useAuth()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="fixed inset-0 bg-cinematic-mesh pointer-events-none z-0" />
      {!isAuthPage && <Navbar />}
      <main className="relative z-[1]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
