import { create } from 'zustand'

const GAMES = [
  { id: 'elden-ring', label: 'Elden Ring',  emoji: '⚔️',  color: '#c9a84c' },
  { id: 'minecraft',  label: 'Minecraft',   emoji: '⛏️',  color: '#5b8a3c' },
  { id: 'valorant',   label: 'Valorant',    emoji: '🎯',  color: '#ff4655' },
  { id: 'fortnite',   label: 'Fortnite',    emoji: '🌀',  color: '#00d4ff' },
  { id: 'free',       label: 'Any Game',    emoji: '🎮',  color: '#e94560' },
]

const useChatStore = create((set, get) => ({
  games: GAMES,
  activeGame: GAMES[0].id,
  sessions: {},        // { [game]: [session metadata] }
  activeSessionId: {}, // { [game]: sessionId }
  messages: {},        // { [sessionId]: [messages] }
  isStreaming: false,
  streamingText: '',

  setActiveGame: (gameId) => set({ activeGame: gameId }),

  setActiveSession: (game, sessionId) =>
    set(state => ({
      activeSessionId: { ...state.activeSessionId, [game]: sessionId }
    })),

  setSessions: (game, sessions) =>
    set(state => ({
      sessions: { ...state.sessions, [game]: sessions }
    })),

  setMessages: (sessionId, messages) =>
    set(state => ({
      messages: { ...state.messages, [sessionId]: messages }
    })),

  addMessage: (sessionId, message) =>
    set(state => ({
      messages: {
        ...state.messages,
        [sessionId]: [...(state.messages[sessionId] || []), message],
      }
    })),

  setStreaming: (val) => set({ isStreaming: val }),
  setStreamingText: (val) => set({ streamingText: val }),
  appendStreamingText: (chunk) =>
    set(state => ({ streamingText: state.streamingText + chunk })),

  clearStreaming: () => set({ isStreaming: false, streamingText: '' }),

  removeSession: (game, sessionId) =>
    set(state => ({
      sessions: {
        ...state.sessions,
        [game]: (state.sessions[game] || []).filter(s => s._id !== sessionId),
      },
      activeSessionId: {
        ...state.activeSessionId,
        [game]: state.activeSessionId[game] === sessionId
          ? null
          : state.activeSessionId[game],
      },
    })),
}))

export { GAMES }
export default useChatStore