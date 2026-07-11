import { useState } from 'react'
import { ALL_CARDS, cardCost, DECK_MAX, DECK_MIN, DECK_MAX_LEGENDS, type CardData } from '../data/cards'
import { usePlayerState } from '../store/playerState'
import CardSvg from '../components/collection/CardSvg'
import '../style/DeckBuilderPage.css'

type Props = { onBack: () => void }

export default function DeckBuilderPage({ onBack }: Props) {
  const { state, saveDeck } = usePlayerState()

  const owned = ALL_CARDS.filter(c => state.unlockedIds.includes(c.id))

  const [deckIds, setDeckIds] = useState<string[]>(
    state.savedDeck.length >= DECK_MIN ? state.savedDeck : []
  )

  const deckCards  = deckIds.map(id => ALL_CARDS.find(c => c.id === id)!).filter(Boolean)
  const legendCount = deckCards.filter(c => c.theme === 'legends').length
  const isFull     = deckIds.length >= DECK_MAX
  const isValid    = deckIds.length >= DECK_MIN

  function toggle(card: CardData) {
    if (deckIds.includes(card.id)) {
      setDeckIds(prev => prev.filter(id => id !== card.id))
      return
    }
    if (isFull) return
    if (card.theme === 'legends' && legendCount >= DECK_MAX_LEGENDS) return
    setDeckIds(prev => [...prev, card.id])
  }

  function confirm() {
    if (!isValid) return
    saveDeck(deckIds)
    onBack()
  }

  function reset() { setDeckIds([]) }

  const costColor: Record<number, string> = { 1: '#60a5fa', 2: '#a78bfa', 3: '#f2c94c' }

  return (
    <div className="db-shell">
      <header className="db-header">
        <button type="button" className="db-back" onClick={onBack}>← Retour</button>
        <h1 className="db-title">MON DECK</h1>
        <div className="db-meta">
          <span className="db-count">{deckIds.length} / {DECK_MAX}</span>
          <span className="db-legends-count">⭐ {legendCount}/{DECK_MAX_LEGENDS} légendes</span>
        </div>
      </header>

      <div className="db-body">
        <section className="db-collection">
          <p className="db-hint">
            Sélectionnez {DECK_MIN}–{DECK_MAX} cartes · max {DECK_MAX_LEGENDS} légendes
          </p>
          <div className="db-grid">
            {owned.map(card => {
              const selected = deckIds.includes(card.id)
              const blocked  = !selected && (isFull || (card.theme === 'legends' && legendCount >= DECK_MAX_LEGENDS))
              return (
                <button
                  key={card.id}
                  type="button"
                  className={`db-card ${selected ? 'db-card-selected' : ''} ${blocked ? 'db-card-blocked' : ''}`}
                  onClick={() => toggle(card)}
                  title={blocked ? (isFull ? 'Deck plein' : 'Max légendes atteint') : undefined}
                >
                  <CardSvg card={card} width={110} />
                  <div className="db-card-cost" style={{ background: costColor[cardCost(card)] }}>
                    {'⚡'.repeat(cardCost(card))}
                  </div>
                  {selected && <div className="db-card-check">✓</div>}
                </button>
              )
            })}
          </div>
        </section>

        <aside className="db-sidebar">
          <h2 className="db-sidebar-title">DECK ACTUEL</h2>

          {deckCards.length === 0 ? (
            <p className="db-empty">Ajoutez des cartes depuis la collection</p>
          ) : (
            <ul className="db-list">
              {deckCards.map(card => (
                <li key={card.id} className={`db-list-item db-li-${card.theme}`}>
                  <span className="db-li-cost" style={{ background: costColor[cardCost(card)] }}>
                    {cardCost(card)}
                  </span>
                  <span className="db-li-name">{card.name}</span>
                  <button
                    type="button"
                    className="db-li-remove"
                    onClick={() => toggle(card)}
                  >✕</button>
                </li>
              ))}
            </ul>
          )}

          <div className="db-sidebar-footer">
            <div className="db-energy-info">
              <span className="db-ei-row"><span style={{color:'#60a5fa'}}>⚡</span> Talent = 1 énergie</span>
              <span className="db-ei-row"><span style={{color:'#a78bfa'}}>⚡⚡</span> Spéciale = 2 énergie</span>
              <span className="db-ei-row"><span style={{color:'#f2c94c'}}>⚡⚡⚡</span> Légende = 3 énergie</span>
            </div>

            <div className="db-actions">
              <button type="button" className="db-btn-reset" onClick={reset}>Réinitialiser</button>
              <button
                type="button"
                className={`db-btn-confirm ${isValid ? '' : 'db-btn-disabled'}`}
                onClick={confirm}
                disabled={!isValid}
              >
                {isValid ? `Confirmer (${deckIds.length})` : `Min. ${DECK_MIN} cartes`}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
