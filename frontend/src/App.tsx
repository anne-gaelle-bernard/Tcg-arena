import { useEffect, useState } from 'react'
import './App.css'
import RegisterForm from './components/auth/RegisterForm'
import DashboardPage from './pages/DashboardPage'
import type { AuthUser } from './services/authApi'

function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('tcg-user')
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser) as AuthUser)
      } catch {
        localStorage.removeItem('tcg-user')
      }
    }
  }, [])

  const handleSignInSuccess = (user: AuthUser) => {
    setCurrentUser(user)
    localStorage.setItem('tcg-user', JSON.stringify(user))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('tcg-user')
  }

  return (
    <div className="app">
      {currentUser ? (
        <DashboardPage onLogout={handleLogout} user={currentUser} />
      ) : (
        <RegisterForm onSignInSuccess={handleSignInSuccess} />
      )}
    </div>
  )
}

export default App
