import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminHash = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@printsupport.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@printsupport.com',
      passwordHash: adminHash,
      role: 'admin'
    }
  })

  const agentHash = await bcrypt.hash('agent123', 12)
  await prisma.user.upsert({
    where: { email: 'agent1@printsupport.com' },
    update: {},
    create: {
      name: 'Sarah Mitchell',
      email: 'agent1@printsupport.com',
      passwordHash: agentHash,
      role: 'agent'
    }
  })

  await prisma.user.upsert({
    where: { email: 'agent2@printsupport.com' },
    update: {},
    create: {
      name: 'James Cortez',
      email: 'agent2@printsupport.com',
      passwordHash: agentHash,
      role: 'agent'
    }
  })

  console.log('Seed complete.')
  console.log('Admin:   admin@printsupport.com / admin123')
  console.log('Agent 1: agent1@printsupport.com / agent123')
  console.log('Agent 2: agent2@printsupport.com / agent123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
