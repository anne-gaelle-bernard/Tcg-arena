import { useEffect, useState } from 'react'
import './App.css'
import RegisterForm from './components/auth/RegisterForm'
import DashboardPage from './pages/DashboardPage'
import CollectionPage from './pages/CollectionPage'
import GamePage from './pages/GamePage'
import MarketplacePage from './pages/MarketplacePage'
import DeckBuilderPage from './pages/DeckBuilderPage'
import PlayerProfilePage from './pages/PlayerProfilePage'
import type { AuthUser } from './services/authApi'

type Page = 'dashboard' | 'collection' | 'game' | 'market' | 'deck' | 'profile'

function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [page, setPage] = useState<Page>('dashboard')

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
    setPage('dashboard')
  }

  function handleNavigate(id: string) {
    if (id === 'collection') setPage('collection')
    if (id === 'play') setPage('game')
    if (id === 'market') setPage('market')
    if (id === 'deck') setPage('deck')
    if (id === 'profile') setPage('profile')
  }

  if (!currentUser) {
    return (
      <div className="app">
        <RegisterForm onSignInSuccess={handleSignInSuccess} />
      </div>
    )
  }

  if (page === 'collection') {
    return (
      <div className="app">
        <CollectionPage onBack={() => setPage('dashboard')} />
      </div>
    )
  }

  if (page === 'game') {
    return (
      <div className="app">
        <GamePage user={currentUser} onBack={() => setPage('dashboard')} />
      </div>
    )
  }

  if (page === 'market') {
    return (
      <div className="app">
        <MarketplacePage onBack={() => setPage('dashboard')} />
      </div>
    )
  }

  if (page === 'deck') {
    return (
      <div className="app">
        <DeckBuilderPage onBack={() => setPage('dashboard')} />
      </div>
    )
  }

  if (page === 'profile') {
    return (
      <div className="app">
        <PlayerProfilePage user={currentUser} onBack={() => setPage('dashboard')} />
      </div>
    )
  }

  return (
    <div className="app">
      <DashboardPage onLogout={handleLogout} user={currentUser} onNavigate={handleNavigate} />
    </div>
  )
}

export default App
