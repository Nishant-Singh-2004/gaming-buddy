import express from 'express'
import passport from 'passport'

const router = express.Router()

// Initiates Google login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

// Google redirects here after login
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=true` }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}`)
  }
)

// Get current logged in user
router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ user: null })
  res.json({ user: req.user })
})

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ success: true })
  })
})

export default router