import { useState, useEffect } from 'react'

const BASE = import.meta.env.VITE_API_URL
const TOKEN_KEY = 'gb_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')

    if (urlToken) {
      try {
        localStorage.setItem(TOKEN_KEY, urlToken)
        const stored = localStorage.getItem(TOKEN_KEY)
        console.log('Token stored:', stored ? 'YES' : 'NO')
      } catch(e) {
        console.error('localStorage failed:', e)
      }
      // Replace URL and let the same render cycle continue
      window.history.replaceState({}, '', window.location.pathname)
    }

    const token = localStorage.getItem(TOKEN_KEY)
    console.log('Token found:', token ? 'YES' : 'NO')

    if (!token) {
      setLoading(false)
      return
    }

    fetch(`${BASE}/auth/me?token=${token}`)
      .then(r => r.json())
      .then(data => {
        console.log('Auth me response:', data)
        if (data.user) setUser(data.user)
        else localStorage.removeItem(TOKEN_KEY)
      })
      .catch(err => {
        console.error('Auth me error:', err)
        localStorage.removeItem(TOKEN_KEY)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = () => { window.location.href = `${BASE}/auth/google` }
  const logout = () => { localStorage.removeItem(TOKEN_KEY); setUser(null) }

  return { user, loading, login, logout }
}

export default useAuth