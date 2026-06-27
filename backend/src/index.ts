import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import { setIo } from './lib/io'
import { setupSocketHandlers } from './socket/handlers'
import authRoutes from './routes/auth'
import ticketRoutes from './routes/tickets'
import agentRoutes from './routes/agents'
import adminRoutes from './routes/admin'

const app = express()
const httpServer = createServer(app)

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173'

const io = new Server(httpServer, {
  cors: { origin: allowedOrigin, credentials: true }
})

setIo(io)

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permittedCrossDomainPolicies: false,
  crossOriginEmbedderPolicy: false
}))
app.use(cors({ origin: allowedOrigin, credentials: true }))
app.use(express.json({ limit: '100kb' }))

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/agents', agentRoutes)
app.use('/api/admin', adminRoutes)

setupSocketHandlers(io)

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`PrintSupport backend running on port ${PORT}`)
})
