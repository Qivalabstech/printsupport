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
            <Link to="/contact" className="btn-ghost text-sm">Contact</Link>
            <Link to="/diagnose" className="btn-primary text-sm py-1.5">
              Get Help
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-primary-600 font-semibold text-sm mb-2">
                <Printer size={16} />
                PrintSupport
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Independent third-party printer setup and troubleshooting assistance via live chat.
                Not affiliated with any manufacturer.
              </p>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Support</div>
              <nav className="flex flex-col gap-1.5 text-sm text-gray-500">
                <Link to="/diagnose" className="hover:text-gray-800 transition-colors">Get Setup Help</Link>
                <Link to="/about" className="hover:text-gray-800 transition-colors">About Us</Link>
                <Link to="/contact" className="hover:text-gray-800 transition-colors">Contact</Link>
              </nav>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Legal</div>
              <nav className="flex flex-col gap-1.5 text-sm text-gray-500">
                <Link to="/privacy" className="hover:text-gray-800 transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-gray-800 transition-colors">Terms of Service</Link>
                <Link to="/refund-policy" className="hover:text-gray-800 transition-colors">Refund Policy</Link>
                <Link to="/disclaimer" className="hover:text-gray-800 transition-colors">Disclaimer</Link>
              </nav>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              <strong>Independent service disclosure:</strong> We are an independent third-party technical
              support provider and are not affiliated with, endorsed by, sponsored by, or authorized by any
              printer manufacturer including HP, Canon, Brother, Epson, Samsung, Xerox, Lexmark or others.
              Any manufacturer names are trademarks of their respective owners, referenced only to indicate
              compatible printer models.
            </p>
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} PrintSupport. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  )
}
