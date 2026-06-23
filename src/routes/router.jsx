import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RootLayout from '../layouts/RootLayout'
import LoadingSpinner from '../components/LoadingSpinner'

const Home = lazy(() => import('../pages/Home'))
const Search = lazy(() => import('../pages/Search'))
const MovieDetails = lazy(() => import('../pages/MovieDetails'))
const Watchlist = lazy(() => import('../pages/Watchlist'))
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const Profile = lazy(() => import('../pages/Profile'))
const NotFound = lazy(() => import('../pages/NotFound'))
const Discover = lazy(() => import('../pages/Discover'))
const GenrePage = lazy(() => import('../pages/GenrePage'))
const ProtectedRoute = lazy(() => import('../components/ProtectedRoute'))
const Favorites = lazy(() => import('../pages/Favorites'))

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-brand-bg"><LoadingSpinner /></div>}>
    {children}
  </Suspense>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <SuspenseWrapper><Home /></SuspenseWrapper> },
      { path: 'search', element: <SuspenseWrapper><Search /></SuspenseWrapper> },
      { path: 'discover', element: <SuspenseWrapper><Discover /></SuspenseWrapper> },
      { path: 'genre/:id', element: <SuspenseWrapper><GenrePage /></SuspenseWrapper> },
      { path: 'movie/:id', element: <SuspenseWrapper><MovieDetails /></SuspenseWrapper> },
      {
        path: 'watchlist',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'favorites',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'profile',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      { path: 'login', element: <SuspenseWrapper><Login /></SuspenseWrapper> },
      { path: 'register', element: <SuspenseWrapper><Register /></SuspenseWrapper> },
      { path: '*', element: <SuspenseWrapper><NotFound /></SuspenseWrapper> },
    ],
  },
])

export default router
