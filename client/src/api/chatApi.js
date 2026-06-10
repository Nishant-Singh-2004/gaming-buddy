import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL
export const getToken = () => localStorage.getItem('gb_token')

const api = axios.create({ baseURL: BASE })

api.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.params = { ...config.params, token }
  return config
})

export const getSessions = (game) =>
  api.get(`/api/sessions/${game}`).then(r => r.data)

export const getSession = (id) =>
  api.get(`/api/sessions/session/${id}`).then(r => r.data)

export const deleteSession = (id) =>
  api.delete(`/api/sessions/${id}`).then(r => r.data)

export const streamChat = ({ sessionId, game, message, onChunk, onSession, onDone, onError }) => {
  const controller = new AbortController()
  const token = getToken()

  fetch(`${BASE}/api/chat?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, game, message }),
    signal: controller.signal,
  })
  .then(async (res) => {
    if (!res.ok) {
      onError('Server error')
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          // Stream ended — process any remaining buffer
          if (buffer.trim()) {
            const lines = buffer.split('\n')
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              try {
                const data = JSON.parse(line.slice(6))
                if (data.type === 'done') onDone(data.sessionId)
              } catch {}
            }
          }
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() // keep incomplete line

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
    } catch (err) {
      if (err.name !== 'AbortError') onError(err.message)
    } finally {
      reader.releaseLock()
    }
  })
  .catch(err => {
    if (err.name !== 'AbortError') onError(err.message)
  })

  return () => controller.abort()
}