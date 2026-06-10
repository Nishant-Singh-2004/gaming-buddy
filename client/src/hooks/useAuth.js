import { useState, useEffect } from 'react'

const BASE = import.meta.env.VITE_API_URL

const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${BASE}/auth/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = () => {
    window.location.href = `${BASE}/auth/google`
  }

  const logout = async () => {
    await fetch(`${BASE}/auth/logout`, { credentials: 'include' })
    setUser(null)
  }

  return { user, loading, login, logout }
}

export default useAuth