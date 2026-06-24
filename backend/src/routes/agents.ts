import { Router } from 'express'
import prisma from '../lib/prisma'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { assignNextAvailableAgent } from '../services/assignment'
import { getIo } from '../lib/io'

const router = Router()

// Agent: update own online/offline status
router.patch('/me/status', authenticateToken, async (req: AuthRequest, res) => {
  const { status } = req.body
  if (!['online', 'offline'].includes(status)) {
    res.status(400).json({ error: 'status must be online or offline' })
    return
  }

  await prisma.user.update({
    where: { id: req.user!.id },
    data: { status }
  })

  getIo().to('admin').emit('agent:status-changed', { agentId: req.user!.id, status })

  if (status === 'online') {
    await assignNextAvailableAgent()
  }

  res.json({ ok: true, status })
})

// Agent: get own stats for today
router.get('/me/stats', authenticateToken, async (req: AuthRequest, res) => {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const [totalToday, resolvedToday, closedTickets] = await Promise.all([
    prisma.ticket.count({
      where: { assignedAgentId: req.user!.id, createdAt: { gte: startOfDay } }
    }),
    prisma.ticket.count({
      where: {
        assignedAgentId: req.user!.id,
        status: 'closed',
        resolutionStatus: 'resolved',
        closedAt: { gte: startOfDay }
      }
    }),
    prisma.ticket.findMany({
      where: {
        assignedAgentId: req.user!.id,
        status: 'closed',
        closedAt: { gte: startOfDay },
        activatedAt: { not: null }
      },
      select: { activatedAt: true, closedAt: true }
    })
  ])

  const avgDurationMinutes =
    closedTickets.length > 0
      ? closedTickets.reduce((sum, t) => {
          return sum + (t.closedAt!.getTime() - t.activatedAt!.getTime()) / 60000
        }, 0) / closedTickets.length
      : 0

  res.json({ totalToday, resolvedToday, avgDurationMinutes: Math.round(avgDurationMinutes) })
})

export default router
