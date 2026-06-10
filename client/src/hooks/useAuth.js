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
      localStorage.setItem(TOKEN_KEY, urlToken)
      window.history.replaceState({}, '', window.location.pathname)
      window.location.reload()
      return
    }

    const token = getToken()
    if (!token) { setLoading(false); return }

    // Pass token as query param instead of Authorization header
    fetch(`${BASE}/auth/me?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.user) setUser(data.user)
        else localStorage.removeItem(TOKEN_KEY)
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [])

  const login = () => { window.location.href = `${BASE}/auth/google` }
  const logout = () => { localStorage.removeItem(TOKEN_KEY); setUser(null) }

  return { user, loading, login, logout }
}

export default useAuth