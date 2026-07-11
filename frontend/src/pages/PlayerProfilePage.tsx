import { ALL_CARDS } from '../data/cards'
import { usePlayerState } from '../store/playerState'
import type { AuthUser } from '../services/authApi'
import '../style/PlayerProfilePage.css'

type Props = { user: AuthUser; onBack: () => void }

export default function PlayerProfilePage({ user, onBack }: Props) {
  const { state } = usePlayerState()

  const totalCards    = ALL_CARDS.length
  const ownedCards    = state.unlockedIds.length
  const legendsOwned  = state.unlockedIds.filter(id => id.startsWith('leg_')).length
  const specialsOwned = state.unlockedIds.filter(id => id.startsWith('spe_')).length
  const talentsOwned  = state.unlockedIds.filter(id => id.startsWith('tal_')).length
  const deckSize      = state.savedDeck.length
  const initials      = user.username.slice(0, 2).toUpperCase()

  return (
    <div className="pp-shell">
      <header className="pp-header">
        <button type="button" className="pp-back" onClick={onBack}>← Retour</button>
        <h1 className="pp-title">PROFIL JOUEUR</h1>
      </header>

      <main className="pp-main">
        <section className="pp-card">
          <div className="pp-avatar">{initials}</div>
          <div className="pp-identity">
            <h2 className="pp-username">{user.username}</h2>
            <p className="pp-mail">{user.mail}</p>
            <div className="pp-level-badge">LVL {user.level}</div>
          </div>
        </section>

        <section className="pp-stats-grid">
          <div className="pp-stat">
            <span className="pp-stat-val">{state.credits} CR</span>
            <span className="pp-stat-label">Crédits</span>
          </div>
          <div className="pp-stat">
            <span className="pp-stat-val">{ownedCards} / {totalCards}</span>
            <span className="pp-stat-label">Cartes possédées</span>
          </div>
          <div className="pp-stat">
            <span className="pp-stat-val">{deckSize}</span>
            <span className="pp-stat-label">Cartes dans le deck</span>
          </div>
          <div className="pp-stat">
            <span className="pp-stat-val">{state.lossStreak} / 5</span>
            <span className="pp-stat-label">Série de défaites</span>
          </div>
        </section>

        <section className="pp-collection-breakdown">
          <h3 className="pp-section-title">COLLECTION</h3>
          <div className="pp-breakdown-list">
            <div className="pp-breakdown-item pp-bd-legends">
              <span className="pp-bd-label">Légendes</span>
              <span className="pp-bd-val">{legendsOwned} / {ALL_CARDS.filter(c => c.theme === 'legends').length}</span>
              <div className="pp-bd-bar">
                <div
                  className="pp-bd-fill"
                  style={{ width: `${(legendsOwned / ALL_CARDS.filter(c => c.theme === 'legends').length) * 100}%` }}
                />
              </div>
            </div>
            <div className="pp-breakdown-item pp-bd-specials">
              <span className="pp-bd-label">Spéciales</span>
              <span className="pp-bd-val">{specialsOwned} / {ALL_CARDS.filter(c => c.theme === 'specials').length}</span>
              <div className="pp-bd-bar">
                <div
                  className="pp-bd-fill"
                  style={{ width: `${(specialsOwned / ALL_CARDS.filter(c => c.theme === 'specials').length) * 100}%` }}
                />
              </div>
            </div>
            <div className="pp-breakdown-item pp-bd-talents">
              <span className="pp-bd-label">Talents</span>
              <span className="pp-bd-val">{talentsOwned} / {ALL_CARDS.filter(c => c.theme === 'talents').length}</span>
              <div className="pp-bd-bar">
                <div
                  className="pp-bd-fill"
                  style={{ width: `${(talentsOwned / ALL_CARDS.filter(c => c.theme === 'talents').length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
