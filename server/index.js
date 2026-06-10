import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport, { initPassport } from './config/passport.js'
import chatRoutes from './routes/chat.js'
import sessionRoutes from './routes/sessions.js'
import authRoutes from './routes/auth.js'

const app = express()

app.use(helmet())
app.use(morgan('dev'))
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.sendStatus(204)
})

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],  // ← add this
  credentials: true,
}))
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))

// ── Connect MongoDB first, then set up session + passport ──
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected')

    // Session setup AFTER mongoose connects and env vars are loaded
    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }
    }))

    app.use(passport.initialize())
    app.use(passport.session())
    initPassport()

    app.use('/api/chat', chatRoutes)
    app.use('/api/sessions', sessionRoutes)
    app.use('/auth', authRoutes)

    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    )
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })