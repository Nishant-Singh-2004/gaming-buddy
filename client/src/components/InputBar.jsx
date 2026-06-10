import { useState, useRef } from 'react'
import useChatStore from '../stores/useChatStore'
import useStream from '../hooks/useStream'

const InputBar = () => {
  const [text, setText] = useState('')
  const { isStreaming, activeGame, games } = useChatStore()
  const { sendMessage } = useStream()
  const textareaRef = useRef(null)

  const game = games.find(g => g.id === activeGame)

  const handleSend = async () => {
    if (!text.trim() || isStreaming) return
    const msg = text.trim()
    setText('')
    textareaRef.current.style.height = 'auto'
    await sendMessage(msg)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e) => {
    setText(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  return (
    <div className="px-4 py-4 border-t border-white/5 bg-midbg">
      <div className="flex items-end gap-3 bg-cardbg rounded-2xl px-4 py-3 border border-white/5 focus-within:border-accent/40 transition-colors">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
          placeholder={`Ask about ${game?.label ?? 'your game'}...`}
          className="flex-1 bg-transparent text-textprim placeholder-textsec text-sm resize-none outline-none leading-relaxed disabled:opacity-50"
          style={{ maxHeight: '120px' }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || isStreaming}
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all
            bg-accent hover:bg-accentsoft disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isStreaming
            ? <span className="w-3 h-3 rounded-sm bg-white animate-pulse" />
            : <span className="text-white text-sm">↑</span>
          }
        </button>
      </div>
      <p className="text-textsec text-xs text-center mt-2">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}

export default InputBar