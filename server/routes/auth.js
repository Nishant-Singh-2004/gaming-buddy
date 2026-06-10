import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=true` }),
  (req, res) => {
    // Create JWT token with user data
    const token = jwt.sign(
      {
        id:     req.user._id,
        name:   req.user.name,
        email:  req.user.email,
        avatar: req.user.avatar,
      },
      process.env.SESSION_SECRET,
      { expiresIn: '7d' }
    )
    // Send token to client via URL param
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`)
  }
)

router.get('/me', (req, res) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ user: null })

  try {
    const user = jwt.verify(auth.slice(7), process.env.SESSION_SECRET)
    res.json({ user })
  } catch {
    res.status(401).json({ user: null })
  }
})

router.get('/logout', (req, res) => {
  res.json({ success: true })
})

export default router