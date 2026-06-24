import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import api from '../lib/api'
import { getSocket } from '../lib/socket'

export interface Message {
  id: string
  ticketId: string
  senderType: 'visitor' | 'agent'
  senderId: string | null
  content: string
  createdAt: string
  sender?: { id: string; name: string } | null
}

export interface Ticket {
  id: string
  visitorName: string
  visitorEmail: string | null
  sessionToken: string
  brand: string
  issueCategory: string
  description: string
  status: 'waiting' | 'active' | 'closed'
  assignedAgent: { id: string; name: string } | null
  createdAt: string
  messages?: Message[]
}

export interface DiagnosticContext {
  brand: string
  issueCategory: string
  description: string
}

type ChatStatus = 'idle' | 'name-form' | 'connecting' | 'queued' | 'active' | 'closed'

interface ChatContextType {
  isOpen: boolean
  openWidget: () => void
  closeWidget: () => void
  startDiagnosticChat: (context: DiagnosticContext) => void
  status: ChatStatus
  ticket: Ticket | null
  messages: Message[]
  queuePosition: number | null
  agentName: string | null
  typingIndicator: 'visitor' | 'agent' | null
  pendingDiagnostic: DiagnosticContext | null
  submitVisitorInfo: (name: string, email: string) => Promise<void>
  sendMessage: (content: string) => void
  sendTypingStart: () => void
  sendTypingStop: () => void
  sessionToken: string | null
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<ChatStatus>('idle')
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [queuePosition, setQueuePosition] = useState<number | null>(null)
  const [agentName, setAgentName] = useState<string | null>(null)
  const [typingIndicator, setTypingIndicator] = useState<'visitor' | 'agent' | null>(null)
  const [pendingDiagnostic, setPendingDiagnostic] = useState<DiagnosticContext | null>(null)
  const [sessionToken, setSessionToken] = useState<string | null>(
    () => localStorage.getItem('chat_session_token')
  )
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restore session on mount if token exists
  useEffect(() => {
    const stored = localStorage.getItem('chat_session_token')
    if (!stored) return

    api.get(`/tickets/session/${stored}`)
      .then(({ data }) => {
        const t: Ticket = data.ticket
        if (t.status === 'closed') {
          localStorage.removeItem('chat_session_token')
          return
        }
        setTicket(t)
        setMessages(t.messages || [])
        setSessionToken(stored)
        if (t.status === 'active') {
          setAgentName(t.assignedAgent?.name || null)
          setStatus('active')
        } else {
          setStatus('queued')
        }
        setupSocketListeners(stored, t.id)
      })
      .catch(() => {
        localStorage.removeItem('chat_session_token')
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setupSocketListeners = useCallback((token: string, ticketId: string) => {
    const socket = getSocket()

    socket.emit('visitor:join', { sessionToken: token })

    socket.off('queue:position')
    socket.off('ticket:assigned')
    socket.off('ticket:closed')
    socket.off('message:new')
    socket.off('typing:start')
    socket.off('typing:stop')

    socket.on('queue:position', ({ position }: { position: number }) => {
      setQueuePosition(position)
      setStatus('queued')
    })

    socket.on('ticket:assigned', ({ agentName: name }: { agentName: string }) => {
      setAgentName(name)
      setStatus('active')
      setQueuePosition(null)
    })

    socket.on('ticket:closed', () => {
      setStatus('closed')
    })

    socket.on('message:new', (msg: Message) => {
      if (msg.ticketId === ticketId) {
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev
          return [...prev, msg]
        })
      }
    })

    socket.on('typing:start', ({ senderType }: { senderType: 'visitor' | 'agent' }) => {
      setTypingIndicator(senderType)
    })

    socket.on('typing:stop', () => {
      setTypingIndicator(null)
    })
  }, [])

  const startDiagnosticChat = useCallback((context: DiagnosticContext) => {
    setPendingDiagnostic(context)
    setStatus('name-form')
    setIsOpen(true)
  }, [])

  const submitVisitorInfo = useCallback(async (name: string, email: string) => {
    if (!pendingDiagnostic) return
    setStatus('connecting')

    const { data } = await api.post('/tickets', {
      visitorName: name,
      visitorEmail: email || undefined,
      brand: pendingDiagnostic.brand,
      issueCategory: pendingDiagnostic.issueCategory,
      description: pendingDiagnostic.description,
      sessionToken: sessionToken || undefined
    })

    const t: Ticket = data.ticket
    localStorage.setItem('chat_session_token', data.sessionToken)
    setSessionToken(data.sessionToken)
    setTicket(t)
    setMessages(t.messages || [])
    setPendingDiagnostic(null)

    if (t.status === 'active') {
      setAgentName(t.assignedAgent?.name || null)
      setStatus('active')
    } else {
      setStatus('queued')
      setQueuePosition(data.queuePosition)
    }

    setupSocketListeners(data.sessionToken, t.id)
  }, [pendingDiagnostic, sessionToken, setupSocketListeners])

  const sendMessage = useCallback((content: string) => {
    if (!ticket || !sessionToken || !content.trim()) return
    const socket = getSocket()
    socket.emit('message:send', {
      ticketId: ticket.id,
      content: content.trim(),
      sessionToken
    })
  }, [ticket, sessionToken])

  const sendTypingStart = useCallback(() => {
    if (!ticket) return
    getSocket().emit('typing:start', { ticketId: ticket.id })
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => sendTypingStop(), 3000)
  }, [ticket])

  const sendTypingStop = useCallback(() => {
    if (!ticket) return
    getSocket().emit('typing:stop', { ticketId: ticket.id })
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
  }, [ticket])

  return (
    <ChatContext.Provider value={{
      isOpen, openWidget: () => setIsOpen(true), closeWidget: () => setIsOpen(false),
      startDiagnosticChat, status, ticket, messages, queuePosition, agentName,
      typingIndicator, pendingDiagnostic, submitVisitorInfo, sendMessage,
      sendTypingStart, sendTypingStop, sessionToken
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}
