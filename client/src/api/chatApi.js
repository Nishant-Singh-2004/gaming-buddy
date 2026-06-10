import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,  // ← sends cookies with every request
})

export const getSessions = (game) =>
  api.get(`/api/sessions/${game}`).then(r => r.data)

export const getSession = (id) =>
  api.get(`/api/sessions/session/${id}`).then(r => r.data)

export const deleteSession = (id) =>
  api.delete(`/api/sessions/${id}`).then(r => r.data)

export const streamChat = ({ sessionId, game, message, onChunk, onSession, onDone, onError }) => {
  const controller = new AbortController()

  fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',   // ← sends cookies with stream request
    body: JSON.stringify({ sessionId, game, message }),
    signal: controller.signal,
  })
  .then(async (res) => {
    if (!res.ok) throw new Error('Server error')
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop()

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        try {
          const data = JSON.parse(line.slice(6))
          if (data.type === 'session') onSession(data.sessionId)
          if (data.type === 'chunk')   onChunk(data.text)
          if (data.type === 'done')    onDone(data.sessionId)
          if (data.type === 'error')   onError(data.message)
        } catch {}
      }
    }
  })
  .catch(err => {
    if (err.name !== 'AbortError') onError(err.message)
  })

  return () => controller.abort()
}