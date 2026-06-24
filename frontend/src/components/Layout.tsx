import { Link, Outlet, useLocation } from 'react-router-dom'
import ChatWidget from './ChatWidget'
import { Printer } from 'lucide-react'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-semibold text-lg">
            <Printer size={20} />
            PrintSupport
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`btn-ghost text-sm ${isHome ? 'text-primary-600' : ''}`}
            >
              Home
            </Link>
            <Link to="/about" className="btn-ghost text-sm">About</Link>
            <Link to="/diagnose" className="btn-primary text-sm py-1.5">
              Start Activation
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-100 bg-gray-50 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-primary-600 font-medium text-sm">
              <Printer size={16} />
              PrintSupport
            </div>
            <nav className="flex flex-wrap gap-4 text-sm text-gray-500">
              <Link to="/about" className="hover:text-gray-800 transition-colors">About Us</Link>
              <Link to="/privacy" className="hover:text-gray-800 transition-colors">Privacy Policy</Link>
              <Link to="/agent/login" className="hover:text-gray-800 transition-colors">Agent Login</Link>
            </nav>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            PrintSupport is an independent technical support service. We are not affiliated with, endorsed by,
            or sponsored by HP, Canon, Epson, Brother, Samsung, or any other printer manufacturer.
          </p>
        </div>
      </footer>

      <ChatWidget />
    </div>
  )
}
