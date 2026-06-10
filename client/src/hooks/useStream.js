import { useCallback } from 'react'
import { streamChat, getSessions } from '../api/chatApi'
import useChatStore from '../stores/useChatStore'

const useStream = () => {
  const {
    activeGame,
    activeSessionId,
    addMessage,
    setMessages,
    setSessions,
    setActiveSession,
    setStreaming,
    appendStreamingText,
    clearStreaming,
    setStreamingText,
    messages,
  } = useChatStore()

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return

    const game = useChatStore.getState().activeGame
    const sessionId = useChatStore.getState().activeSessionId[game] || null
    const tempKey = sessionId || `temp-${Date.now()}`

    // Add user message immediately
    useChatStore.getState().addMessage(tempKey, {
      role: 'user',
      content: text,
      timestamp: new Date(),
    })

    useChatStore.getState().setStreaming(true)
    useChatStore.getState().setStreamingText('')

    let resolvedId = tempKey
    let sessionConfirmed = !!sessionId

    streamChat({
      sessionId,
      game,
      message: text,

      onSession: (id) => {
		 console.log('✅ Session ID received:', id)
        resolvedId = id
        if (!sessionConfirmed) {
          sessionConfirmed = true
          // Move temp messages to real session id
          const msgs = useChatStore.getState().messages[tempKey] || []
          useChatStore.getState().setMessages(id, msgs)
          useChatStore.getState().setActiveSession(game, id)
        }
      },

      onChunk: (chunk) => {
		console.log('📦 Chunk:', chunk)
        useChatStore.getState().appendStreamingText(chunk)
      },

      onDone: async () => {
		console.log('🏁 Done')  
        const finalText = useChatStore.getState().streamingText

        useChatStore.getState().addMessage(resolvedId, {
          role: 'model',
          content: finalText,
          timestamp: new Date(),
        })

        useChatStore.getState().clearStreaming()

        try {
          const updated = await getSessions(game)
          useChatStore.getState().setSessions(game, updated)
        } catch {}
      },

      onError: (err) => {
        console.error('Stream error:', err)
        useChatStore.getState().clearStreaming()
      },
    })
  }, [])

  return { sendMessage }
}

export default useStream