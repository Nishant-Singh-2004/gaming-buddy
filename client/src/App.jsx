import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'

const App = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gunmetal">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <ChatWindow />
      </main>
    </div>
  )
}

export default App