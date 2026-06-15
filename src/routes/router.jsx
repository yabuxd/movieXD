import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout'
import Home from '../pages/Home'
import Search from '../pages/Search'
import MovieDetails from '../pages/MovieDetails'
import Watchlist from '../pages/Watchlist'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'search', element: <Search /> },
      { path: 'movie/:id', element: <MovieDetails /> },
      { path: 'watchlist', element: <Watchlist /> },
      { path: 'login', element: <Login /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default router
