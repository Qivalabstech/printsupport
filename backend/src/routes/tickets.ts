import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import prisma from '../lib/prisma'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { assignNextAvailableAgent } from '../services/assignment'
import { getIo } from '../lib/io'

const router = Router()

// Create ticket (visitor-facing, no auth)
router.post('/', async (req, res) => {
  const { visitorName, visitorEmail, brand, issueCategory, description, sessionToken } = req.body

  if (!visitorName || !brand || !issueCategory || !description) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  // Resume existing session if valid
  if (sessionToken) {
    const existing = await prisma.ticket.findUnique({
      where: { sessionToken },
      include: {
        assignedAgent: { select: { id: true, name: true } },
        messages: { orderBy: { createdAt: 'asc' } }
      }
    })
    if (existing && existing.status !== 'closed') {
      res.json({ ticket: existing, sessionToken, isExisting: true })
      return
    }
  }

  const newToken = uuidv4()
  const ticket = await prisma.ticket.create({
    data: {
      visitorName,
      visitorEmail: visitorEmail || null,
      brand,
      issueCategory,
      description,
      sessionToken: newToken
    }
  })

  await assignNextAvailableAgent()

  const updatedTicket = await prisma.ticket.findUnique({
    where: { id: ticket.id },
    include: { assignedAgent: { select: { id: true, name: true } } }
  })

  let queuePosition: number | null = null
  if (updatedTicket?.status === 'waiting') {
    const waitingTickets = await prisma.ticket.findMany({
      where: { status: 'waiting' },
      orderBy: { createdAt: 'asc' }
    })
    queuePosition = waitingTickets.findIndex(t => t.id === ticket.id) + 1
  }

  res.json({ ticket: updatedTicket, sessionToken: newToken, queuePosition })
})

// Get ticket by session token (visitor reconnect)
router.get('/session/:token', async (req, res) => {
  const ticket = await prisma.ticket.findUnique({
    where: { sessionToken: req.params.token },
    include: {
      assignedAgent: { select: { id: true, name: true } },
      messages: { orderBy: { createdAt: 'asc' } }
    }
  })
  if (!ticket) {
    res.status(404).json({ error: 'Session not found' })
    return
  }
  res.json({ ticket })
})

// Agent: get their active chats
router.get('/my', authenticateToken, async (req: AuthRequest, res) => {
  const tickets = await prisma.ticket.findMany({
    where: { assignedAgentId: req.user!.id, status: 'active' },
    include: {
      messages: { orderBy: { createdAt: 'desc' }, take: 1 }
    },
    orderBy: { activatedAt: 'asc' }
  })
  res.json({ tickets })
})

// Get ticket detail (agent or admin)
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: req.params.id },
    include: {
      assignedAgent: { select: { id: true, name: true } },
      messages: {
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, name: true } } }
      }
    }
  })

  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' })
    return
  }

  if (req.user!.role === 'agent' && ticket.assignedAgentId !== req.user!.id) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }

  res.json({ ticket })
})

// Agent or admin: close a ticket with resolution status
router.patch('/:id/close', authenticateToken, async (req: AuthRequest, res) => {
  const { resolutionStatus } = req.body

  if (!['resolved', 'open', 'closed'].includes(resolutionStatus)) {
    res.status(400).json({ error: 'resolutionStatus must be resolved, open, or closed' })
    return
  }

  const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id } })
  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' })
    return
  }

  if (req.user!.role === 'agent' && ticket.assignedAgentId !== req.user!.id) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }

  const updated = await prisma.ticket.update({
    where: { id: req.params.id },
    data: { status: 'closed', closedAt: new Date(), resolutionStatus }
  })

  getIo().to(`ticket-${req.params.id}`).emit('ticket:closed', { resolutionStatus })
  getIo().to('admin').emit('queue:updated')

  await assignNextAvailableAgent()

  res.json({ ticket: updated })
})

export default router
