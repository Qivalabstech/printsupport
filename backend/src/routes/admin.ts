import { Router } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma'
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth'
import { getIo } from '../lib/io'

const router = Router()

router.use(authenticateToken, requireRole('admin'))

// List all agents with active chat count
router.get('/agents', async (_req, res) => {
  const agents = await prisma.user.findMany({
    where: { role: 'agent' },
    include: {
      tickets: { where: { status: 'active' }, select: { id: true } }
    },
    orderBy: { createdAt: 'asc' }
  })

  res.json({
    agents: agents.map(a => ({
      id: a.id,
      name: a.name,
      email: a.email,
      status: a.status,
      activeChats: a.tickets.length,
      createdAt: a.createdAt
    }))
  })
})

// Create new agent
router.post('/agents', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400).json({ error: 'name, email, and password are required' })
    return
  }

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    res.status(409).json({ error: 'Email already in use' })
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const agent = await prisma.user.create({
    data: { name, email, passwordHash, role: 'agent' }
  })

  res.json({ agent: { id: agent.id, name: agent.name, email: agent.email } })
})

// Deactivate (delete) agent
router.delete('/agents/:id', async (req, res) => {
  const agent = await prisma.user.findUnique({ where: { id: req.params.id } })
  if (!agent || agent.role !== 'agent') {
    res.status(404).json({ error: 'Agent not found' })
    return
  }

  // Unassign any active tickets first
  await prisma.ticket.updateMany({
    where: { assignedAgentId: req.params.id, status: 'active' },
    data: { assignedAgentId: null, status: 'waiting', activatedAt: null }
  })

  await prisma.user.delete({ where: { id: req.params.id } })
  getIo().to('admin').emit('queue:updated')

  res.json({ ok: true })
})

// Queue: all waiting tickets
router.get('/queue', async (_req, res) => {
  const tickets = await prisma.ticket.findMany({
    where: { status: 'waiting' },
    orderBy: { createdAt: 'asc' }
  })
  res.json({ tickets })
})

// All active chats across all agents
router.get('/active', async (_req, res) => {
  const tickets = await prisma.ticket.findMany({
    where: { status: 'active' },
    include: { assignedAgent: { select: { id: true, name: true } } },
    orderBy: { activatedAt: 'asc' }
  })
  res.json({ tickets })
})

// Manual reassign
router.post('/tickets/:id/reassign', async (req, res) => {
  const { newAgentId } = req.body

  const [ticket, newAgent] = await Promise.all([
    prisma.ticket.findUnique({ where: { id: req.params.id } }),
    prisma.user.findUnique({ where: { id: newAgentId } })
  ])

  if (!ticket || ticket.status !== 'active') {
    res.status(404).json({ error: 'Active ticket not found' })
    return
  }
  if (!newAgent || newAgent.role !== 'agent') {
    res.status(404).json({ error: 'Agent not found' })
    return
  }

  const oldAgentId = ticket.assignedAgentId

  const updated = await prisma.ticket.update({
    where: { id: req.params.id },
    data: { assignedAgentId: newAgentId }
  })

  const io = getIo()

  if (oldAgentId) {
    io.to(`user-${oldAgentId}`).emit('ticket:reassigned-away', { ticketId: ticket.id })
  }
  io.to(`user-${newAgentId}`).emit('ticket:new-assignment', {
    ticketId: ticket.id,
    visitorName: ticket.visitorName,
    issueCategory: ticket.issueCategory,
    brand: ticket.brand
  })
  io.to(`ticket-${ticket.id}`).emit('ticket:assigned', { agentName: newAgent.name, ticketId: ticket.id })
  io.to('admin').emit('queue:updated')

  res.json({ ticket: updated })
})

// Closed ticket history (filterable)
router.get('/history', async (req, res) => {
  const { resolutionStatus, agentId, startDate, endDate, page = '1', limit = '20' } = req.query as Record<string, string>

  const where: Record<string, unknown> = { status: 'closed' }
  if (resolutionStatus) where.resolutionStatus = resolutionStatus
  if (agentId) where.assignedAgentId = agentId
  if (startDate || endDate) {
    where.closedAt = {}
    if (startDate) (where.closedAt as Record<string, unknown>).gte = new Date(startDate)
    if (endDate) (where.closedAt as Record<string, unknown>).lte = new Date(endDate)
  }

  const skip = (parseInt(page) - 1) * parseInt(limit)

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      include: { assignedAgent: { select: { id: true, name: true } } },
      orderBy: { closedAt: 'desc' },
      skip,
      take: parseInt(limit)
    }),
    prisma.ticket.count({ where })
  ])

  res.json({ tickets, total, page: parseInt(page), limit: parseInt(limit) })
})

// Analytics
router.get('/analytics', async (_req, res) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    d.setHours(0, 0, 0, 0)
    return d
  }).reverse()

  const chatsPerDay = await Promise.all(
    last7Days.map(async (date) => {
      const next = new Date(date)
      next.setDate(next.getDate() + 1)
      const count = await prisma.ticket.count({
        where: { createdAt: { gte: date, lt: next } }
      })
      return { date: date.toISOString().split('T')[0], count }
    })
  )

  const closedTickets = await prisma.ticket.findMany({
    where: { status: 'closed', activatedAt: { not: null }, closedAt: { not: null } },
    select: { activatedAt: true, closedAt: true }
  })

  const avgResolutionMinutes =
    closedTickets.length > 0
      ? closedTickets.reduce((sum, t) => sum + (t.closedAt!.getTime() - t.activatedAt!.getTime()) / 60000, 0) /
        closedTickets.length
      : 0

  const [resolved, open, closed] = await Promise.all([
    prisma.ticket.count({ where: { status: 'closed', resolutionStatus: 'resolved' } }),
    prisma.ticket.count({ where: { status: 'closed', resolutionStatus: 'open' } }),
    prisma.ticket.count({ where: { status: 'closed', resolutionStatus: 'closed' } })
  ])

  res.json({
    chatsPerDay,
    avgResolutionMinutes: Math.round(avgResolutionMinutes),
    resolutionRatio: { resolved, open, closed }
  })
})

export default router
