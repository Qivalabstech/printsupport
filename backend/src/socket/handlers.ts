import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

interface AuthPayload {
  id: string
  role: string
  name: string
}

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    const token = socket.handshake.auth?.token as string | undefined
    let currentUser: AuthPayload | null = null

    if (token) {
      try {
        currentUser = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload
        socket.join(`user-${currentUser.id}`)
        if (currentUser.role === 'admin') {
          socket.join('admin')
        }
      } catch {
        // Anonymous visitor connection
      }
    }

    // Visitor joins their ticket room
    socket.on('visitor:join', async ({ sessionToken }: { sessionToken: string }) => {
      const ticket = await prisma.ticket.findUnique({
        where: { sessionToken },
        include: { assignedAgent: true }
      })
      if (!ticket) return

      socket.join(`ticket-${ticket.id}`)

      if (ticket.status === 'waiting') {
        const waitingTickets = await prisma.ticket.findMany({
          where: { status: 'waiting' },
          orderBy: { createdAt: 'asc' }
        })
        const position = waitingTickets.findIndex(t => t.id === ticket.id) + 1
        socket.emit('queue:position', { position })
      } else if (ticket.status === 'active') {
        socket.emit('ticket:assigned', {
          agentName: ticket.assignedAgent?.name,
          ticketId: ticket.id
        })
      } else if (ticket.status === 'closed') {
        socket.emit('ticket:closed', { resolutionStatus: ticket.resolutionStatus })
      }
    })

    // Agent opens a specific ticket chat
    socket.on('agent:join-ticket', async ({ ticketId }: { ticketId: string }) => {
      if (!currentUser || currentUser.role !== 'agent') return
      const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } })
      if (!ticket || ticket.assignedAgentId !== currentUser.id) return
      socket.join(`ticket-${ticketId}`)
    })

    // Admin joins any ticket for monitoring
    socket.on('admin:join-ticket', async ({ ticketId }: { ticketId: string }) => {
      if (!currentUser || currentUser.role !== 'admin') return
      socket.join(`ticket-${ticketId}`)
    })

    // Agent leaves a ticket room (without closing the chat)
    socket.on('agent:leave-ticket', ({ ticketId }: { ticketId: string }) => {
      socket.leave(`ticket-${ticketId}`)
    })

    // Send a message (visitor or agent)
    socket.on('message:send', async ({
      ticketId,
      content,
      sessionToken
    }: {
      ticketId: string
      content: string
      sessionToken?: string
    }) => {
      if (!content?.trim()) return

      let senderType: 'visitor' | 'agent'
      let senderId: string | null = null

      if (currentUser?.role === 'agent') {
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } })
        if (!ticket || ticket.assignedAgentId !== currentUser.id) return
        senderType = 'agent'
        senderId = currentUser.id
      } else if (sessionToken) {
        const ticket = await prisma.ticket.findUnique({ where: { sessionToken } })
        if (!ticket || ticket.id !== ticketId || ticket.status === 'closed') return
        senderType = 'visitor'
      } else {
        return
      }

      const message = await prisma.message.create({
        data: { ticketId, content: content.trim(), senderType, senderId },
        include: { sender: { select: { id: true, name: true } } }
      })

      io.to(`ticket-${ticketId}`).emit('message:new', message)
    })

    // Typing indicators
    socket.on('typing:start', ({ ticketId }: { ticketId: string }) => {
      const senderType = currentUser?.role === 'agent' ? 'agent' : 'visitor'
      socket.to(`ticket-${ticketId}`).emit('typing:start', { senderType })
    })

    socket.on('typing:stop', ({ ticketId }: { ticketId: string }) => {
      const senderType = currentUser?.role === 'agent' ? 'agent' : 'visitor'
      socket.to(`ticket-${ticketId}`).emit('typing:stop', { senderType })
    })
  })
}
