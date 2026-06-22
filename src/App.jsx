import { RouterProvider } from 'react-router-dom'
import { WatchlistProvider } from './context/WatchlistContext'
import { AuthProvider } from './context/AuthContext'
import router from './routes/router'

export default function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <RouterProvider router={router} />
      </WatchlistProvider>
    </AuthProvider>
  )
}
