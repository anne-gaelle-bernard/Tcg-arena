import '../style/DashboardPage.css'
import type { AuthUser } from '../services/authApi'

type DashboardPageProps = {
  onLogout: () => void
  user: AuthUser
}

type MenuItem = {
  id: string
  label: string
  active?: boolean
}

type FeaturedCard = {
  id: number
  playerName: string
  team: string
  score: number
  badge: string
}

const menuItems: MenuItem[] = [
  { id: 'play', label: 'Play Now', active: true },
  { id: 'collection', label: 'My Collection' },
  { id: 'market', label: 'Marketplace' },
  { id: 'quests', label: 'Quests' },
  { id: 'leaderboards', label: 'Leaderboards' },
]

const featuredCards: FeaturedCard[] = [
  {
    id: 1,
    playerName: 'LeBron James',
    team: 'Los Angeles Lakers',
    score: 99,
    badge: 'MVP',
  },
  {
    id: 2,
    playerName: 'Caitlin Clark',
    team: 'Indiana Fever',
    score: 96,
    badge: 'Rookie',
  },
]

export default function DashboardPage({ onLogout, user }: DashboardPageProps) {
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

          <button type="button" className="header-icon" aria-label="Notifications">
            N
          </button>
          <button type="button" className="header-icon" aria-label="Settings">
            S
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
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </section>

        <section className="featured-panel">
          <h1>Featured Cards</h1>
          <p className="featured-subtitle">Limited Edition - Season 5 Drop</p>

          <div className="cards-column">
            {featuredCards.map(card => (
              <article key={card.id} className="tcg-card">
                <div className="tcg-card-top">
                  <span className="tcg-badge">{card.badge}</span>
                  <span className="tcg-score">{card.score}</span>
                </div>
                <div className="tcg-card-body">
                  <h2>{card.playerName}</h2>
                  <p>{card.team}</p>
                </div>
              </article>
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