import express from 'express'
import rateLimit from 'express-rate-limit'
import Session from '../models/Session.js'
import { streamGeminiResponse } from '../services/geminiService.js'

const router = express.Router()

const limiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 20,              // 20 requests per minute per IP
  message: { error: 'Too many requests, slow down!' },
})

router.post('/', limiter, async (req, res) => {
  const { sessionId, game, message } = req.body

  if (!game || !message) {
    return res.status(400).json({ error: 'game and message are required' })
  }

  try {
    // Load or create session
    let session = sessionId
      ? await Session.findById(sessionId)
      : null

    if (!session) {
      session = new Session({
        game,
        title: message.slice(0, 40),   // first message becomes the title
        messages: [],
      })
    }

    // Append user message
    session.messages.push({ role: 'user', content: message })

    // ── SSE headers ────────────────────────────────────
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    // Send session ID immediately so client can track it
    res.write(`data: ${JSON.stringify({ type: 'session', sessionId: session._id })}\n\n`)

    // ── Stream Gemini ───────────────────────────────────
    await streamGeminiResponse(
      game,
      session.messages,
      (chunk) => {
        res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`)
      },
      async (fullText) => {
        // Save completed model response
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