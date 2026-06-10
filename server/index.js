import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import chatRoutes from './routes/chat.js'
import sessionRoutes from './routes/sessions.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('dotenv').config()
dotenv.config()

const app = express()

// ── Middleware ──────────────────────────────────────────
app.use(helmet())
app.use(morgan('dev'))
app.use(cors({
  // origin: process.env.CLIENT_URL,
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: false,
}))
app.use(express.json())

// ── Routes ──────────────────────────────────────────────
app.use('/api/chat', chatRoutes)
app.use('/api/sessions', sessionRoutes)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

// ── MongoDB + Start ─────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    )
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })