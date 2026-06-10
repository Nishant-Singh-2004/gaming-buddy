import express from 'express'
import rateLimit from 'express-rate-limit'
import Session from '../models/Session.js'
import { streamGeminiResponse } from '../services/geminiService.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many requests, slow down!' },
})

const requireAuth = (req, res, next) => {
  const token = req.query.token
  if (!token) return res.status(401).json({ error: 'Login required' })
  try {
    req.user = jwt.verify(token, process.env.SESSION_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

router.post('/', limiter, requireAuth, async (req, res) => {
  const { sessionId, game, message } = req.body
  const userId = req.user._id || req.user.id

  if (!game || !message) {
    return res.status(400).json({ error: 'game and message are required' })
  }

  try {
    let session = sessionId
      ? await Session.findOne({ _id: sessionId, userId })
      : null

    if (!session) {
      session = new Session({
        game,
        userId,
        title: message.slice(0, 40),
        messages: [],
      })
    }

    session.messages.push({ role: 'user', content: message })

    // SSE headers — tell Render/proxies not to buffer
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')  // disables Nginx buffering on Render
    res.setHeader('Transfer-Encoding', 'chunked')
    res.flushHeaders()

    // Send session ID immediately
    res.write(`data: ${JSON.stringify({ type: 'session', sessionId: session._id })}\n\n`)

    // Keepalive ping every 15s so Render doesn't kill the connection
    const keepalive = setInterval(() => {
      res.write(': keepalive\n\n')
    }, 15000)

    // Clean up on client disconnect
    req.on('close', () => {
      clearInterval(keepalive)
    })

    await streamGeminiResponse(
      game,
      session.messages,
      (chunk) => {
        res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`)
      },
      async (fullText) => {
        clearInterval(keepalive)
        session.messages.push({ role: 'model', content: fullText })
        await session.save()
        res.write(`data: ${JSON.stringify({ type: 'done', sessionId: session._id })}\n\n`)
        res.end()
      }
    )

  } catch (err) {
    console.error('Chat error:', err.message)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Something went wrong' })
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`)
      res.end()
    }
  }
})

export default router