import { useEffect, useRef } from 'react'
import useChatStore from '../stores/useChatStore'
import { getSession, getSessions } from '../api/chatApi'
import MessageBubble from './MessageBubble'
import InputBar from './InputBar'
import useStream from '../hooks/useStream'

const SuggestionChip = ({ text, onSend }) => (
  <div
    onClick={() => onSend(text)}
    className="px-4 py-2 rounded-xl bg-cardbg border border-white/5 text-textsec text-xs cursor-pointer hover:border-accent/30 hover:text-textprim transition-all text-left"
  >
    {text}
  </div>
)

const getSuggestions = (game) => ({
  'elden-ring': ['Best beginner build?', 'How do I beat Malenia?', 'What does Faith scaling do?'],
  'minecraft':  ['How to make an XP farm?', 'Best Y level for diamonds?', 'How to build a nether hub?'],
  'valorant':   ['Best agent for ranked?', 'How to improve my aim?', 'Explain economy management'],
  'fortnite':   ['Best landing spots?', 'Current meta weapons?', 'How to build fast?'],
  'free':       ['Recommend me a game', 'Best RPGs of 2024?', 'Compare Elden Ring vs Dark Souls'],
})[game] || []

const ChatWindow = () => {
  const {
    activeGame, games,
    activeSessionId, messages,
    streamingText, isStreaming,
    setMessages, setSessions,
  } = useChatStore()

  const { sendMessage } = useStream()
  const bottomRef = useRef(null)
  const sessionId = activeSessionId[activeGame]
  const currentMessages = messages[sessionId] || []
  const game = games.find(g => g.id === activeGame)

  // Load messages when session changes
  useEffect(() => {
    if (!sessionId) return
    getSession(sessionId)
      .then(data => setMessages(sessionId, data.messages))
      .catch(() => {})
  }, [sessionId])

  // Load sessions on game change
  useEffect(() => {
    getSessions(activeGame)
      .then(data => setSessions(activeGame, data))
      .catch(() => {})
  }, [activeGame])

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages.length, streamingText])

  const isEmpty = currentMessages.length === 0 && !isStreaming

  return (
    <div className="flex flex-col h-screen bg-gunmetal">

      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-midbg flex-shrink-0">
        <span className="text-2xl">{game?.emoji}</span>
        <div>
          <h2 className="font-gaming font-bold tracking-wide text-textprim">{game?.label}</h2>
          <p className="text-textsec text-xs">AI Gaming Companion</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-textsec text-xs">Online</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 opacity-70">
            <span className="text-6xl">{game?.emoji}</span>
            <div>
              <p className="font-gaming text-xl font-bold text-textprim tracking-wide">
                {game?.label} Buddy
              </p>
              <p className="text-textsec text-sm mt-1">
                Ask me anything — builds, tips, walkthroughs, lore
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-2 w-full max-w-sm">
              {getSuggestions(activeGame).map((s, i) => (
                <SuggestionChip key={i} text={s} onSend={sendMessage} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {currentMessages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}

            {isStreaming && streamingText && (
              <MessageBubble
                message={{ role: 'model', content: streamingText }}
                isStreaming
              />
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <InputBar />
    </div>
  )
}

export default ChatWindow