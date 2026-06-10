const LoginPage = ({ onLogin }) => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gunmetal">
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(#e94560 1px, transparent 1px), linear-gradient(90deg, #e94560 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="font-gaming text-6xl font-bold tracking-widest">
            <span className="text-accent">GAME</span>
            <span className="text-textprim">BUDDY</span>
          </h1>
          <p className="text-textsec mt-2 tracking-widest text-sm uppercase">
            Your AI Gaming Companion
          </p>
        </div>

        {/* Game icons row */}
        <div className="flex gap-4 text-3xl opacity-60">
          <span>⚔️</span>
          <span>⛏️</span>
          <span>🎯</span>
          <span>🌀</span>
          <span>🎮</span>
        </div>

        {/* Card */}
        <div className="bg-midbg border border-white/10 rounded-2xl p-8 w-full max-w-sm flex flex-col gap-6 shadow-2xl">
          <div className="text-center">
            <h2 className="font-gaming text-xl font-bold text-textprim tracking-wide">
              Welcome Back
            </h2>
            <p className="text-textsec text-sm mt-1">
              Sign in to access your game chats and history
            </p>
          </div>

          <button
            onClick={onLogin}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl
              bg-white hover:bg-gray-100 text-gray-800 font-semibold text-sm
              transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-textsec text-xs text-center">
            Your chat history is saved per account across all devices
          </p>
        </div>

        <p className="text-textsec text-xs opacity-50">
          Powered by Gemini AI
        </p>
      </div>
    </div>
  )
}

export default LoginPage