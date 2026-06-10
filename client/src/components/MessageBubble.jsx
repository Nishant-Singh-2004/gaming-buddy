import ReactMarkdown from 'react-markdown'

const MessageBubble = ({ message, isStreaming = false }) => {
  const isUser = message.role === 'user'

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-cardbg border border-accent/30 flex items-center justify-center text-sm mr-3 flex-shrink-0 mt-1">
          🎮
        </div>
      )}

      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
        ${isUser
          ? 'bg-accent text-white rounded-tr-sm'
          : 'bg-cardbg text-textprim rounded-tl-sm border border-white/5'
        }
        ${isStreaming ? 'streaming-cursor' : ''}
      `}>
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <ReactMarkdown
            components={{
              h1: ({children}) => <h1 className="text-lg font-bold text-textprim mt-3 mb-2 font-gaming tracking-wide">{children}</h1>,
              h2: ({children}) => <h2 className="text-base font-bold text-textprim mt-3 mb-1.5 font-gaming tracking-wide">{children}</h2>,
              h3: ({children}) => <h3 className="text-sm font-bold text-accent mt-2 mb-1">{children}</h3>,
              strong: ({children}) => <strong className="font-semibold text-accentsoft">{children}</strong>,
              em: ({children}) => <em className="italic text-textsec">{children}</em>,
              p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
              li: ({children}) => <li className="text-textprim">{children}</li>,
              code: ({inline, children}) => inline
                ? <code className="bg-gunmetal px-1.5 py-0.5 rounded text-accent font-mono text-xs">{children}</code>
                : <pre className="bg-gunmetal p-3 rounded-lg overflow-x-auto my-2"><code className="text-green-400 font-mono text-xs">{children}</code></pre>,
              blockquote: ({children}) => <blockquote className="border-l-2 border-accent pl-3 my-2 text-textsec italic">{children}</blockquote>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-sm ml-3 flex-shrink-0 mt-1">
          👤
        </div>
      )}
    </div>
  )
}

export default MessageBubble