import '../style/DashboardPage.css'
import type { AuthUser } from '../services/authApi'
import { usePlayerState } from '../store/playerState'
import { ALL_CARDS } from '../data/cards'
import CardSvg from '../components/collection/CardSvg'

type DashboardPageProps = {
  onLogout: () => void
  user: AuthUser
  onNavigate: (page: string) => void
}

type MenuItem = {
  id: string
  label: string
  active?: boolean
}

const menuItems: MenuItem[] = [
  { id: 'play', label: 'Play Now', active: true },
  { id: 'deck', label: 'Mon Deck' },
  { id: 'collection', label: 'Ma Collection' },
  { id: 'market', label: 'Marketplace' },
]

const featuredCards = ALL_CARDS.filter(c => c.theme === 'legends').slice(0, 3)

export default function DashboardPage({ onLogout, user, onNavigate }: DashboardPageProps) {
  const { state } = usePlayerState()
  return (
    <div className="dashboard-shell">
      <div className="dashboard-bg-orb dashboard-bg-orb-left" />
      <div className="dashboard-bg-orb dashboard-bg-orb-right" />

      <header className="dashboard-header">
        <div className="brand">
          <div className="brand-icon">O</div>
          <p className="brand-name">HOOPS TCG</p>
        </div>

        <div className="header-right">
          <div className="profile-chip">
            <div>
              <p className="profile-name">{user.username}</p>
              <p className="profile-meta">{user.mail}</p>
            </div>
            <p className="profile-level">LVL {user.level}</p>
          </div>
          <div className="credits-chip">
            <span className="credits-label">CR</span>
            <span className="credits-amount">{state.credits}</span>
          </div>

          <button type="button" className="header-icon header-icon-profile" onClick={() => onNavigate('profile')}>
            Profil
          </button>
          <button type="button" className="header-icon" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="menu-panel">
          <p className="menu-title">Main Menu</p>
          <div className="menu-stack">
            {menuItems.map(item => {
              let menuButtonClassName = 'menu-btn'

              if (item.active) {
                menuButtonClassName += ' menu-btn-active'
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  className={menuButtonClassName}
                  onClick={() => onNavigate(item.id)}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </section>

        <section className="featured-panel">
          <h1>Featured Cards</h1>
          <p className="featured-subtitle">Season 1 — Limited Drop</p>

          <div className="cards-column">
            {featuredCards.map(card => (
              <CardSvg key={card.id} card={card} width={120} />
            ))}
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>12,402 Online Active Players</p>
        <p>All-Star Weekend Current Event</p>
        <p>Help | Global Chat</p>
      </footer>
    </div>
  )
}