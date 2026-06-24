import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ChatProvider } from './contexts/ChatContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Diagnose from './pages/Diagnose'
import About from './pages/About'
import Privacy from './pages/Privacy'
import AgentLogin from './pages/agent/Login'
import AgentDashboard from './pages/agent/Dashboard'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'

function AgentGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/agent/login" replace />
  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />
  return <>{children}</>
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/agent/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            {/* Public site */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/diagnose" element={<Diagnose />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
            </Route>

            {/* Agent area */}
            <Route path="/agent/login" element={<AgentLogin />} />
            <Route
              path="/agent/dashboard"
              element={<AgentGuard><AgentDashboard /></AgentGuard>}
            />

            {/* Admin area */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={<AdminGuard><AdminDashboard /></AdminGuard>}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
