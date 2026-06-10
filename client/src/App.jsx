import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import LoginPage from './components/LoginPage'
import useAuth from './hooks/useAuth'

const App = () => {
  const { user, loading, login, logout } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gunmetal">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl animate-pulse">🎮</span>
          <p className="text-textsec text-sm font-gaming tracking-widest">LOADING...</p>
        </div>
      </div>
    )
  }

  if (!user) return <LoginPage onLogin={login} />

  return (
    <div className="flex h-screen overflow-hidden bg-gunmetal">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 overflow-hidden">
        <ChatWindow />
      </main>
    </div>
  )
}

export default App