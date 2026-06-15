import { RouterProvider } from 'react-router-dom'
import { WatchlistProvider } from './context/WatchlistContext'
import router from './routes/router'

export default function App() {
  return (
    <WatchlistProvider>
      <RouterProvider router={router} />
    </WatchlistProvider>
  )
}
