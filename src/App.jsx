import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext'
import { WatchlistProvider } from './context/WatchlistContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { ContinueWatchingProvider } from './context/ContinueWatchingContext'
import { ThemeProvider } from './context/ThemeContext'
import router from './routes/router'

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <ContinueWatchingProvider>
            <FavoritesProvider>
              <WatchlistProvider>
                <RouterProvider router={router} />
              </WatchlistProvider>
            </FavoritesProvider>
          </ContinueWatchingProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
