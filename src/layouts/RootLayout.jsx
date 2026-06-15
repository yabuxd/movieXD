import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
