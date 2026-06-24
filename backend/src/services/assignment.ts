import prisma from '../lib/prisma'
import { getIo } from '../lib/io'

export async function assignNextAvailableAgent(): Promise<void> {
  const waitingTicket = await prisma.ticket.findFirst({
    where: { status: 'waiting' },
    orderBy: { createdAt: 'asc' }
  })

  if (!waitingTicket) return

  const agents = await prisma.user.findMany({
    where: { role: 'agent', status: 'online' },
    include: {
      tickets: { where: { status: 'active' } }
    }
  })

  if (agents.length === 0) {
    // No agents online — update queue positions for all waiting visitors
    await broadcastQueuePositions()
    return
  }

  // Pick agent with fewest active chats
  agents.sort((a, b) => a.tickets.length - b.tickets.length)
  const agent = agents[0]

  await prisma.ticket.update({
    where: { id: waitingTicket.id },
    data: {
      status: 'active',
      assignedAgentId: agent.id,
      activatedAt: new Date()
    }
  })

  const io = getIo()
  // Notify visitor their chat is now active
  io.to(`ticket-${waitingTicket.id}`).emit('ticket:assigned', {
    agentName: agent.name,
    ticketId: waitingTicket.id
  })
  // Notify the assigned agent
  io.to(`user-${agent.id}`).emit('ticket:new-assignment', {
    ticketId: waitingTicket.id,
    visitorName: waitingTicket.visitorName,
    issueCategory: waitingTicket.issueCategory,
    brand: waitingTicket.brand
  })
  // Notify admins
  io.to('admin').emit('queue:updated')

  // Update remaining waiting tickets' queue positions
  await broadcastQueuePositions()
}

async function broadcastQueuePositions(): Promise<void> {
  const io = getIo()
  const waitingTickets = await prisma.ticket.findMany({
    where: { status: 'waiting' },
    orderBy: { createdAt: 'asc' }
  })

  waitingTickets.forEach((ticket, index) => {
    io.to(`ticket-${ticket.id}`).emit('queue:position', { position: index + 1 })
  })
}
