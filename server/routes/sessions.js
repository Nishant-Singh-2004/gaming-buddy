import express from 'express'
import Session from '../models/Session.js'

const router = express.Router()

const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Login required' })
  next()
}

router.get('/:game', requireAuth, async (req, res) => {
  try {
    const sessions = await Session.find(
      { game: req.params.game, userId: req.user._id },
      'title game createdAt'
    ).sort({ createdAt: -1 }).limit(20)
    res.json(sessions)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/session/:id', requireAuth, async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
    if (!session) return res.status(404).json({ error: 'Session not found' })
    res.json(session)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Session.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router