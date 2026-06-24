import { useState, useEffect, FormEvent } from 'react'
import {
  LogOut, Printer, Users, MessageSquare, Clock, BarChart2,
  History, Loader2, RefreshCw, UserPlus, Trash2, ArrowRightLeft
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import { getSocket } from '../../lib/socket'

type Tab = 'queue' | 'active' | 'agents' | 'history' | 'analytics'

interface Agent {
  id: string; name: string; email: string; status: string; activeChats: number; createdAt: string
}
interface Ticket {
  id: string; visitorName: string; brand: string; issueCategory: string; status: string
  createdAt: string; activatedAt?: string; closedAt?: string; resolutionStatus?: string
  assignedAgent?: { id: string; name: string } | null
}
interface Analytics {
  chatsPerDay: Array<{ date: string; count: number }>
  avgResolutionMinutes: number
  resolutionRatio: { resolved: number; open: number; closed: number }
}

function elapsed(since: string): string {
  const s = Math.floor((Date.now() - new Date(since).getTime()) / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  return `${Math.floor(m / 60)}h ${m % 60}m`
}

function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    resolved: 'bg-green-100 text-green-700',
    open: 'bg-amber-100 text-amber-700',
    closed: 'bg-gray-100 text-gray-600',
    waiting: 'bg-blue-100 text-blue-700',
    active: 'bg-primary-100 text-primary-700',
    online: 'bg-green-100 text-green-700',
    offline: 'bg-gray-100 text-gray-500'
  }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('queue')
  const [queue, setQueue] = useState<Ticket[]>([])
  const [active, setActive] = useState<Ticket[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [history, setHistory] = useState<Ticket[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(false)

  // New agent form
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [agentError, setAgentError] = useState('')
  const [agentSaving, setAgentSaving] = useState(false)

  // History filters
  const [histFilter, setHistFilter] = useState('')
  const [histPage, setHistPage] = useState(1)
  const [histTotal, setHistTotal] = useState(0)

  // Reassign modal
  const [reassignTicketId, setReassignTicketId] = useState<string | null>(null)
  const [reassignAgentId, setReassignAgentId] = useState('')
  const [reassigning, setReassigning] = useState(false)

  const loadData = async (t: Tab) => {
    setLoading(true)
    try {
      if (t === 'queue') {
        const r = await api.get('/admin/queue')
        setQueue(r.data.tickets)
      } else if (t === 'active') {
        const r = await api.get('/admin/active')
        setActive(r.data.tickets)
      } else if (t === 'agents') {
        const r = await api.get('/admin/agents')
        setAgents(r.data.agents)
      } else if (t === 'history') {
        const params: Record<string, string | number> = { page: histPage, limit: 20 }
        if (histFilter) params.resolutionStatus = histFilter
        const r = await api.get('/admin/history', { params })
        setHistory(r.data.tickets)
        setHistTotal(r.data.total)
      } else if (t === 'analytics') {
        const r = await api.get('/admin/analytics')
        setAnalytics(r.data)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/admin/login'); return }
    loadData(tab)

    const socket = getSocket(localStorage.getItem('auth_token') || undefined)
    socket.on('queue:updated', () => loadData(tab))
    socket.on('agent:status-changed', () => { if (tab === 'agents') loadData('agents') })

    return () => {
      socket.off('queue:updated')
      socket.off('agent:status-changed')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, tab, histPage, histFilter])

  const handleTabChange = (t: Tab) => { setTab(t) }

  const createAgent = async (e: FormEvent) => {
    e.preventDefault()
    setAgentError('')
    setAgentSaving(true)
    try {
      await api.post('/admin/agents', { name: newName, email: newEmail, password: newPassword })
      setNewName(''); setNewEmail(''); setNewPassword('')
      loadData('agents')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setAgentError(msg || 'Failed to create agent.')
    } finally {
      setAgentSaving(false)
    }
  }

  const deleteAgent = async (id: string, name: string) => {
    if (!confirm(`Remove agent ${name}? Their active chats will return to the queue.`)) return
    await api.delete(`/admin/agents/${id}`)
    loadData('agents')
  }

  const reassign = async () => {
    if (!reassignTicketId || !reassignAgentId) return
    setReassigning(true)
    try {
      await api.post(`/admin/tickets/${reassignTicketId}/reassign`, { newAgentId: reassignAgentId })
      setReassignTicketId(null)
      setReassignAgentId('')
      loadData('active')
    } finally {
      setReassigning(false)
    }
  }

  const maxDay = analytics ? Math.max(...analytics.chatsPerDay.map(d => d.count), 1) : 1

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary-600 font-semibold">
          <Printer size={18} /> PrintSupport
          <span className="text-gray-400 font-normal text-sm">/ Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700 hidden sm:block">{user?.name}</span>
          <button onClick={() => { logout(); navigate('/admin/login') }} className="btn-ghost text-sm flex items-center gap-1">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1">
          {([
            { key: 'queue', label: 'Queue', icon: <Clock size={14} /> },
            { key: 'active', label: 'Active Chats', icon: <MessageSquare size={14} /> },
            { key: 'agents', label: 'Agents', icon: <Users size={14} /> },
            { key: 'history', label: 'History', icon: <History size={14} /> },
            { key: 'analytics', label: 'Analytics', icon: <BarChart2 size={14} /> }
          ] as const).map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-900 capitalize">{tab}</h1>
          <button onClick={() => loadData(tab)} className="btn-ghost flex items-center gap-1.5 text-sm">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-primary-400" />
          </div>
        )}

        {/* Queue Tab */}
        {tab === 'queue' && !loading && (
          <div>
            {queue.length === 0 ? (
              <div className="card text-center py-12 text-gray-400">
                <Clock size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No visitors in queue</p>
              </div>
            ) : (
              <div className="space-y-2">
                {queue.map((t, i) => (
                  <div key={t.id} className="card flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{t.visitorName}</div>
                        <div className="text-xs text-gray-500">{t.brand} · {t.issueCategory}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">waiting {elapsed(t.createdAt)}</span>
                      <Badge status="waiting" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active Chats Tab */}
        {tab === 'active' && !loading && (
          <div>
            {active.length === 0 ? (
              <div className="card text-center py-12 text-gray-400">
                <MessageSquare size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No active chats</p>
              </div>
            ) : (
              <div className="space-y-2">
                {active.map(t => (
                  <div key={t.id} className="card flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{t.visitorName}</div>
                      <div className="text-xs text-gray-500">{t.brand} · {t.issueCategory}</div>
                      <div className="text-xs text-primary-600 mt-0.5">
                        Agent: {t.assignedAgent?.name || 'Unassigned'}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={11} />
                        {t.activatedAt ? elapsed(t.activatedAt) : '—'}
                      </span>
                      <button
                        onClick={() => { setReassignTicketId(t.id); setReassignAgentId('') }}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:border-primary-400 transition-colors"
                      >
                        <ArrowRightLeft size={12} /> Reassign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reassign modal */}
            {reassignTicketId && (
              <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Reassign chat</h3>
                  <select
                    className="input mb-4"
                    value={reassignAgentId}
                    onChange={e => setReassignAgentId(e.target.value)}
                  >
                    <option value="">Select agent...</option>
                    {agents.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.status})</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => setReassignTicketId(null)} className="btn-secondary flex-1">Cancel</button>
                    <button
                      onClick={reassign}
                      disabled={!reassignAgentId || reassigning}
                      className="btn-primary flex-1"
                    >
                      {reassigning ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Reassign'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Agents Tab */}
        {tab === 'agents' && !loading && (
          <div className="space-y-5">
            {/* Agent list */}
            <div className="space-y-2">
              {agents.map(a => (
                <div key={a.id} className="card flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="font-medium text-sm text-gray-900">{a.name}</div>
                    <div className="text-xs text-gray-500">{a.email}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{a.activeChats} active</span>
                    <Badge status={a.status} />
                    <button
                      onClick={() => deleteAgent(a.id, a.name)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add agent form */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserPlus size={16} className="text-primary-600" /> Add new agent
              </h3>
              <form onSubmit={createAgent} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full name</label>
                    <input className="input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Agent name" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <input className="input" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="agent@example.com" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Temporary password</label>
                  <input className="input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 8 characters" required />
                </div>
                {agentError && <p className="text-xs text-red-600">{agentError}</p>}
                <button type="submit" disabled={agentSaving} className="btn-primary text-sm">
                  {agentSaving ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Create agent account'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* History Tab */}
        {tab === 'history' && !loading && (
          <div>
            <div className="flex gap-2 mb-4">
              {['', 'resolved', 'open', 'closed'].map(f => (
                <button
                  key={f}
                  onClick={() => { setHistFilter(f); setHistPage(1) }}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                    histFilter === f
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {f === '' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {history.map(t => (
                <div key={t.id} className="card flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="font-medium text-sm text-gray-900">{t.visitorName}</div>
                    <div className="text-xs text-gray-500">{t.brand} · {t.issueCategory}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Agent: {t.assignedAgent?.name || '—'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {t.closedAt ? new Date(t.closedAt).toLocaleDateString() : '—'}
                    </span>
                    {t.resolutionStatus && <Badge status={t.resolutionStatus} />}
                  </div>
                </div>
              ))}
            </div>

            {histTotal > 20 && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  disabled={histPage === 1}
                  onClick={() => setHistPage(p => p - 1)}
                  className="btn-secondary text-sm disabled:opacity-40 py-1.5 px-4"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {histPage} of {Math.ceil(histTotal / 20)}
                </span>
                <button
                  disabled={histPage >= Math.ceil(histTotal / 20)}
                  onClick={() => setHistPage(p => p + 1)}
                  className="btn-secondary text-sm disabled:opacity-40 py-1.5 px-4"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {tab === 'analytics' && !loading && analytics && (
          <div className="space-y-5">
            {/* Summary cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="card">
                <div className="text-3xl font-bold text-primary-600">
                  {analytics.resolutionRatio.resolved + analytics.resolutionRatio.open + analytics.resolutionRatio.closed}
                </div>
                <div className="text-sm text-gray-500 mt-1">Total closed chats</div>
              </div>
              <div className="card">
                <div className="text-3xl font-bold text-gray-900">{analytics.avgResolutionMinutes}m</div>
                <div className="text-sm text-gray-500 mt-1">Avg resolution time</div>
              </div>
              <div className="card">
                <div className="text-3xl font-bold text-green-600">{analytics.resolutionRatio.resolved}</div>
                <div className="text-sm text-gray-500 mt-1">Resolved</div>
              </div>
            </div>

            {/* Chats per day chart */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">Chats per day (last 7 days)</h3>
              <div className="flex items-end gap-2 h-28">
                {analytics.chatsPerDay.map(d => (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500 font-medium">{d.count}</span>
                    <div
                      className="w-full bg-primary-500 rounded-t-md transition-all"
                      style={{ height: `${maxDay > 0 ? Math.max(4, (d.count / maxDay) * 80) : 4}px` }}
                    />
                    <span className="text-xs text-gray-400">
                      {new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolution ratio */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">Resolution breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: 'Resolved', value: analytics.resolutionRatio.resolved, color: 'bg-green-500' },
                  { label: 'Open (stepped away)', value: analytics.resolutionRatio.open, color: 'bg-amber-400' },
                  { label: 'Closed (unresolved)', value: analytics.resolutionRatio.closed, color: 'bg-gray-300' }
                ].map(row => {
                  const total = analytics.resolutionRatio.resolved + analytics.resolutionRatio.open + analytics.resolutionRatio.closed
                  const pct = total > 0 ? Math.round((row.value / total) * 100) : 0
                  return (
                    <div key={row.label}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{row.label}</span>
                        <span>{row.value} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${row.color} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
