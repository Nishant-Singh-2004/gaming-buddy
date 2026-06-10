import express from 'express'
import Session from '../models/Session.js'

const router = express.Router()

// Get all sessions for a game tab
router.get('/:game', async (req, res) => {
  try {
    const sessions = await Session.find(
      { game: req.params.game },
      'title game createdAt'          // only send metadata, not full messages
    ).sort({ createdAt: -1 }).limit(20)

    res.json(sessions)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get a single session with full message history
router.get('/session/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
    if (!session) return res.status(404).json({ error: 'Session not found' })
    res.json(session)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete a session
router.delete('/:id', async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router