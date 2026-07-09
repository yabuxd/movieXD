import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RootLayout from '../layouts/RootLayout'
import LoadingSpinner from '../components/LoadingSpinner'
import ProtectedRoute from '../components/ProtectedRoute'
import GuestRoute from '../components/GuestRoute'

const Home = lazy(() => import('../pages/Home'))
const Search = lazy(() => import('../pages/Search'))
const MovieDetails = lazy(() => import('../pages/MovieDetails'))
const SeriesDetails = lazy(() => import('../pages/SeriesDetails'))
const Watchlist = lazy(() => import('../pages/Watchlist'))
const Profile = lazy(() => import('../pages/Profile'))
const NotFound = lazy(() => import('../pages/NotFound'))
const Discover = lazy(() => import('../pages/Discover'))
const GenrePage = lazy(() => import('../pages/GenrePage'))
const Favorites = lazy(() => import('../pages/Favorites'))
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))

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
      { path: 'tv/:id', element: <SuspenseWrapper><SeriesDetails /></SuspenseWrapper> },
      {
        path: 'watchlist',
        element: (
          <ProtectedRoute>
            <SuspenseWrapper><Watchlist /></SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'favorites',
        element: (
          <ProtectedRoute>
            <SuspenseWrapper><Favorites /></SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <SuspenseWrapper><Profile /></SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'login',
        element: (
          <GuestRoute>
            <SuspenseWrapper><Login /></SuspenseWrapper>
          </GuestRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestRoute>
            <SuspenseWrapper><Register /></SuspenseWrapper>
          </GuestRoute>
        ),
      },
      { path: '*', element: <SuspenseWrapper><NotFound /></SuspenseWrapper> },
    ],
  },
])

export default router
