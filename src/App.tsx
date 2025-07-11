import { AuthProvider } from "./contexts/AuthContext"
import { Routes } from "./routes/index"


function App() {
  return (
    <AuthProvider>
      <Routes/>
    </AuthProvider>
  )
}

export default App
