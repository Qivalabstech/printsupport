import { useState, useEffect, useRef, FormEvent } from 'react'
import { LogOut, Printer, MessageSquare, Clock, Send, X, CheckCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import { getSocket } from '../../lib/socket'

interface TicketSummary {
  id: string
  visitorName: string
  brand: string
  issueCategory: string
  activatedAt: string
  status: string
  messages: Array<{ id: string; createdAt: string }>
}

interface Message {
  id: string
  ticketId: string
  senderType: 'visitor' | 'agent'
  content: string
  createdAt: string
  sender?: { id: string; name: string } | null
}

interface TicketDetail {
  id: string
  visitorName: string
  visitorEmail: string | null
  brand: string
  issueCategory: string
  description: string
  status: string
  activatedAt: string
  messages: Message[]
  assignedAgent: { name: string } | null
}

type ResolutionStatus = 'resolved' | 'open' | 'closed'

interface Stats { totalToday: number; resolvedToday: number; avgDurationMinutes: number }

function elapsed(since: string): string {
  const s = Math.floor((Date.now() - new Date(since).getTime()) / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  return `${Math.floor(m / 60)}h ${m % 60}m`
}

export default function AgentDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [agentStatus, setAgentStatus] = useState<'online' | 'offline'>('offline')
  const [tickets, setTickets] = useState<TicketSummary[]>([])
  const [openTicket, setOpenTicket] = useState<TicketDetail | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [typingIndicator, setTypingIndicator] = useState(false)
  const [closing, setClosing] = useState(false)
  const [stats, setStats] = useState<Stats>({ totalToday: 0, resolvedToday: 0, avgDurationMinutes: 0 })
  const [tick, setTick] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Live timer tick
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 10000)
    return () => clearInterval(interval)
  }, [])

  const loadTickets = () => {
    api.get('/tickets/my').then(r => setTickets(r.data.tickets))
  }

  const loadStats = () => {
    api.get('/agents/me/stats').then(r => setStats(r.data))
  }

  useEffect(() => {
    if (!user) { navigate('/agent/login'); return }
    loadTickets()
    loadStats()

    const socket = getSocket(localStorage.getItem('auth_token') || undefined)

    socket.on('ticket:new-assignment', (data: { ticketId: string }) => {
      loadTickets()
      loadStats()
      // If chat panel is open for this ticket, don't auto-switch
    })

    socket.on('ticket:reassigned-away', (data: { ticketId: string }) => {
      if (openTicket?.id === data.ticketId) {
        setOpenTicket(null)
        setMessages([])
      }
      loadTickets()
    })

    return () => {
      socket.off('ticket:new-assignment')
      socket.off('ticket:reassigned-away')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const toggleStatus = async () => {
    const next = agentStatus === 'online' ? 'offline' : 'online'
    await api.patch('/agents/me/status', { status: next })
    setAgentStatus(next)
  }

  const openChat = async (ticketId: string) => {
    const { data } = await api.get(`/tickets/${ticketId}`)
    setOpenTicket(data.ticket)
    setMessages(data.ticket.messages || [])

    const socket = getSocket()
    socket.emit('agent:join-ticket', { ticketId })

    socket.off('message:new')
    socket.off('typing:start')
    socket.off('typing:stop')

    socket.on('message:new', (msg: Message) => {
      if (msg.ticketId === ticketId) {
        setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg])
      }
    })

    socket.on('typing:start', ({ senderType }: { senderType: string }) => {
      if (senderType === 'visitor') setTypingIndicator(true)
    })

    socket.on('typing:stop', () => setTypingIndicator(false))
  }

  const closeChat = (ticketId: string) => {
    getSocket().emit('agent:leave-ticket', { ticketId })
    getSocket().off('message:new')
    getSocket().off('typing:start')
    getSocket().off('typing:stop')
    setOpenTicket(null)
    setMessages([])
    setTypingIndicator(false)
  }

  const sendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !openTicket) return
    getSocket().emit('message:send', {
      ticketId: openTicket.id,
      content: input.trim()
    })
    setInput('')
    sendTypingStop()
  }

  const sendTypingStart = () => {
    if (!openTicket) return
    getSocket().emit('typing:start', { ticketId: openTicket.id })
    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(sendTypingStop, 3000)
  }

  const sendTypingStop = () => {
    if (!openTicket) return
    getSocket().emit('typing:stop', { ticketId: openTicket.id })
    if (typingTimeout.current) { clearTimeout(typingTimeout.current); typingTimeout.current = null }
  }

  const closeTicket = async (resolutionStatus: ResolutionStatus) => {
    if (!openTicket) return
    setClosing(true)
    try {
      await api.patch(`/tickets/${openTicket.id}/close`, { resolutionStatus })
      closeChat(openTicket.id)
      loadTickets()
      loadStats()
    } finally {
      setClosing(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/agent/login') }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 text-primary-600 font-semibold">
          <Printer size={18} />
          PrintSupport
          <span className="text-gray-400 font-normal text-sm">/ Agent</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleStatus}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              agentStatus === 'online'
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${agentStatus === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
            {agentStatus === 'online' ? 'Online' : 'Offline'}
          </button>
          <span className="text-sm text-gray-700 hidden sm:block">{user?.name}</span>
          <button onClick={handleLogout} className="btn-ghost text-sm flex items-center gap-1">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: chat list */}
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
          {/* Stats strip */}
          <div className="px-4 py-3 border-b border-gray-100 flex gap-4 text-center">
            <div className="flex-1">
              <div className="text-lg font-bold text-gray-900">{stats.totalToday}</div>
              <div className="text-xs text-gray-500">Chats today</div>
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-green-600">{stats.resolvedToday}</div>
              <div className="text-xs text-gray-500">Resolved</div>
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-gray-900">{stats.avgDurationMinutes}m</div>
              <div className="text-xs text-gray-500">Avg time</div>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">My Active Chats</h2>
            <span className="text-xs bg-primary-100 text-primary-700 font-semibold px-2 py-0.5 rounded-full">
              {tickets.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {tickets.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400 mt-8">
                <MessageSquare size={28} className="mx-auto mb-2 opacity-40" />
                {agentStatus === 'offline' ? 'Go online to receive chats.' : 'No active chats right now.'}
              </div>
            ) : (
              tickets.map(ticket => (
                <button
                  key={ticket.id}
                  onClick={() => openChat(ticket.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    openTicket?.id === ticket.id ? 'bg-primary-50 border-l-2 border-l-primary-600' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-medium text-gray-900 text-sm truncate">{ticket.visitorName}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1 ml-2 flex-shrink-0">
                      <Clock size={11} />
                      {ticket.activatedAt ? elapsed(ticket.activatedAt) : '—'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">{ticket.issueCategory}</div>
                  <div className="text-xs text-primary-600 mt-0.5">{ticket.brand}</div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Chat panel */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {!openTicket ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a chat from the list to open it.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between flex-shrink-0">
                <div>
                  <div className="font-semibold text-gray-900">{openTicket.visitorName}</div>
                  <div className="text-xs text-gray-500">
                    {openTicket.brand} · {openTicket.issueCategory}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Close ticket buttons */}
                  {['resolved', 'open', 'closed'].map((status) => (
                    <button
                      key={status}
                      disabled={closing}
                      onClick={() => closeTicket(status as ResolutionStatus)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors disabled:opacity-50 ${
                        status === 'resolved'
                          ? 'border-green-300 text-green-700 hover:bg-green-50'
                          : status === 'open'
                          ? 'border-amber-300 text-amber-700 hover:bg-amber-50'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {closing ? <Loader2 size={12} className="animate-spin" /> : (
                        status === 'resolved' ? <><CheckCircle size={12} className="inline mr-1" />Resolved</> :
                        status === 'open' ? 'Open' : 'Closed'
                      )}
                    </button>
                  ))}
                  <button onClick={() => closeChat(openTicket.id)} className="btn-ghost p-1.5">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Issue context banner */}
              <div className="bg-primary-50 border-b border-primary-100 px-5 py-2.5 flex-shrink-0">
                <p className="text-xs text-primary-800">
                  <span className="font-semibold">Issue:</span> {openTicket.description}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderType === 'agent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-3.5 py-2 text-sm ${
                      msg.senderType === 'agent'
                        ? 'bg-primary-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}>
                      {msg.content}
                      <div className={`text-xs mt-0.5 ${msg.senderType === 'agent' ? 'text-primary-200' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {typingIndicator && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2 text-gray-400 text-xs">
                      {openTicket.visitorName} is typing...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="border-t border-gray-200 bg-white px-4 py-3 flex gap-2 flex-shrink-0">
                <input
                  className="input flex-1 text-sm"
                  value={input}
                  onChange={e => { setInput(e.target.value); sendTypingStart() }}
                  placeholder={`Reply to ${openTicket.visitorName}...`}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-primary-600 text-white p-2.5 rounded-lg hover:bg-primary-700 disabled:opacity-40 transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
