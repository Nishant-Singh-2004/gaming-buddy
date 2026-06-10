import { useState, useEffect } from 'react'

const BASE = import.meta.env.VITE_API_URL

const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const getToken = () => localStorage.getItem('gb_token')
  const setToken = (t) => localStorage.setItem('gb_token', t)
  const clearToken = () => localStorage.removeItem('gb_token')

  useEffect(() => {
    // Check if Google redirected back with a token in URL
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    console.log('URL token:', urlToken)
  console.log('Full URL:', window.location.href)
  console.log('Stored token:', localStorage.getItem('gb_token'))
    if (urlToken) {
      setToken(urlToken)
      // Clean token from URL without reload
      window.history.replaceState({}, '', window.location.pathname)
    }

    const token = urlToken || getToken()
    if (!token) { setLoading(false); return }

    fetch(`${BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.user) setUser(data.user)
        else clearToken()
      })
      .catch(() => clearToken())
      .finally(() => setLoading(false))
  }, [])

  const login = () => {
    window.location.href = `${BASE}/auth/google`
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  return { user, loading, login, logout, getToken }
}

export default useAuth