import { useState } from 'react'
import { ALL_CARDS, cardCost, DECK_MAX, DECK_MIN, DECK_MAX_LEGENDS, type CardData } from '../data/cards'
import { usePlayerState } from '../store/playerState'
import CardSvg from '../components/collection/CardSvg'
import CardZoomModal from '../components/collection/CardZoomModal'
import '../style/DeckBuilderPage.css'

type Props = { onBack: () => void }

export default function DeckBuilderPage({ onBack }: Props) {
  const { state, saveDeck } = usePlayerState()

  const [deckIds, setDeckIds] = useState<string[]>(
    state.savedDeck.length >= DECK_MIN ? state.savedDeck : []
  )
  const [search, setSearch] = useState('')
  const [theme,  setTheme]  = useState<'all' | 'talents' | 'specials' | 'legends'>('all')
  const [zoomed, setZoomed] = useState<CardData | null>(null)

  const owned = ALL_CARDS
    .filter(c => state.unlockedIds.includes(c.id))
    .filter(c => theme === 'all' || c.theme === theme)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

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
          <span className="db-legends-count">{legendCount}/{DECK_MAX_LEGENDS} légendes</span>
        </div>
      </header>

      <div className="db-body">
        <section className="db-collection">
          <div className="db-search-bar">
            <input
              className="db-search-input"
              type="search"
              placeholder="Rechercher une carte..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="db-theme-filters">
              {(['all', 'talents', 'specials', 'legends'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  className={`db-theme-btn db-theme-${t} ${theme === t ? 'db-theme-active' : ''}`}
                  onClick={() => setTheme(t)}
                >
                  {t === 'all' ? 'Tous' : t === 'talents' ? 'Talents' : t === 'specials' ? 'Spéciales' : 'Légendes'}
                </button>
              ))}
            </div>
          </div>
          <p className="db-hint">
            Sélectionnez {DECK_MIN}–{DECK_MAX} cartes · max {DECK_MAX_LEGENDS} légendes
            {owned.length === 0 && search && <span className="db-no-results"> · Aucun résultat</span>}
          </p>
          <div className="db-grid">
            {owned.map(card => {
              const selected = deckIds.includes(card.id)
              const blocked  = !selected && (isFull || (card.theme === 'legends' && legendCount >= DECK_MAX_LEGENDS))
              return (
                <div key={card.id} className={`db-card-wrap ${selected ? 'db-card-selected' : ''} ${blocked ? 'db-card-blocked' : ''}`}>
                  <button
                    type="button"
                    className="db-card"
                    onClick={() => toggle(card)}
                    title={blocked ? (isFull ? 'Deck plein' : 'Max légendes atteint') : undefined}
                  >
                    <CardSvg card={card} width={110} />
                    <div className="db-card-cost" style={{ background: costColor[cardCost(card)] }}>
                      {cardCost(card)}
                    </div>
                    {selected && <div className="db-card-check">OK</div>}
                  </button>
                  <button
                    type="button"
                    className="db-card-zoom"
                    onClick={() => setZoomed(card)}
                    title="Voir en grand"
                  >⤢</button>
                </div>
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
                  >X</button>
                </li>
              ))}
            </ul>
          )}

          <div className="db-sidebar-footer">
            <div className="db-energy-info">
              <span className="db-ei-row"><span style={{color:'#60a5fa'}}>1</span> Talent = 1 énergie</span>
              <span className="db-ei-row"><span style={{color:'#a78bfa'}}>2</span> Spéciale = 2 énergie</span>
              <span className="db-ei-row"><span style={{color:'#f2c94c'}}>3</span> Légende = 3 énergie</span>
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
      {zoomed && <CardZoomModal card={zoomed} onClose={() => setZoomed(null)} />}
    </div>
  )
}
