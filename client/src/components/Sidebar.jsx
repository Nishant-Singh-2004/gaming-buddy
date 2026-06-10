import { useEffect } from 'react'
import useChatStore from '../stores/useChatStore'
import { getSessions, deleteSession } from '../api/chatApi'

const Sidebar = () => {
  const {
    games, activeGame, setActiveGame,
    sessions, setSessions,
    activeSessionId, setActiveSession,
    setMessages, removeSession,
  } = useChatStore()

  // Load sessions whenever active game changes
  useEffect(() => {
    getSessions(activeGame)
      .then(data => setSessions(activeGame, data))
      .catch(() => {})
  }, [activeGame])

  const handleNewChat = () => {
    setActiveSession(activeGame, null)
    setMessages(`new-${Date.now()}`, [])
  }

  const handleDelete = async (e, sessionId) => {
    e.stopPropagation()
    await deleteSession(sessionId)
    removeSession(activeGame, sessionId)
  }

  const activeGame_ = games.find(g => g.id === activeGame)

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-midbg border-r border-white/5">

      {/* Logo */}
      <div className="px-5 py-4 border-b border-white/5">
        <h1 className="font-gaming text-2xl font-bold tracking-widest text-accent">
          GAME<span className="text-textprim">BUDDY</span>
        </h1>
        <p className="text-textsec text-xs mt-0.5">AI Gaming Companion</p>
      </div>

      {/* Game tabs */}
      <div className="px-3 pt-4">
        <p className="text-textsec text-xs uppercase tracking-widest px-2 mb-2">Channels</p>
        {games.map(game => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left transition-all
              ${activeGame === game.id
                ? 'bg-cardbg text-textprim'
                : 'text-textsec hover:bg-white/5 hover:text-textprim'
              }`}
          >
            <span className="text-lg">{game.emoji}</span>
            <span className="font-gaming font-semibold tracking-wide text-sm">{game.label}</span>
            {activeGame === game.id && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: game.color }} />
            )}
          </button>
        ))}
      </div>

      {/* Session history */}
      <div className="flex-1 px-3 pt-4 overflow-y-auto">
        <div className="flex items-center justify-between px-2 mb-2">
          <p className="text-textsec text-xs uppercase tracking-widest">History</p>
          <button
            onClick={handleNewChat}
            className="text-accent hover:text-accentsoft text-xs font-semibold transition-colors"
          >
            + New
          </button>
        </div>

        {(sessions[activeGame] || []).length === 0 && (
          <p className="text-textsec text-xs px-2 py-3">No chats yet. Start one!</p>
        )}

        {(sessions[activeGame] || []).map(session => (
          <div
            key={session._id}
            onClick={() => setActiveSession(activeGame, session._id)}
            className={`group flex items-center justify-between px-3 py-2 rounded-lg mb-1 cursor-pointer transition-all
              ${activeSessionId[activeGame] === session._id
                ? 'bg-cardbg text-textprim'
                : 'text-textsec hover:bg-white/5 hover:text-textprim'
              }`}
          >
            <span className="text-xs truncate flex-1">{session.title}</span>
            <button
              onClick={(e) => handleDelete(e, session._id)}
              className="opacity-0 group-hover:opacity-100 text-textsec hover:text-accent ml-2 text-xs transition-all"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/5">
        <p className="text-textsec text-xs">Powered by Gemini 2.0</p>
      </div>
    </aside>
  )
}

export default Sidebar