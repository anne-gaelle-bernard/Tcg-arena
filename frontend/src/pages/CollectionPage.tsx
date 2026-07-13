import { useState } from 'react'
import '../style/CollectionPage.css'
import { ALL_CARDS, type CardData } from '../data/cards'
import type { CardTheme } from '../data/cards'
import CardSvg from '../components/collection/CardSvg'
import CardZoomModal from '../components/collection/CardZoomModal'
import { usePlayerState } from '../store/playerState'

type Filter = 'all' | CardTheme

const FILTER_LABELS: { key: Filter; label: string }[] = [
  { key: 'all',      label: 'Toutes' },
  { key: 'talents',  label: 'Talents' },
  { key: 'specials', label: 'Spéciales' },
  { key: 'legends',  label: 'Légendes' },
]

interface Props {
  onBack: () => void
}

export default function CollectionPage({ onBack }: Props) {
  const { hasCard, state } = usePlayerState()
  const [filter, setFilter] = useState<Filter>('all')
  const [zoomed, setZoomed] = useState<CardData | null>(null)

  const displayed = filter === 'all' ? ALL_CARDS : ALL_CARDS.filter(c => c.theme === filter)
  const owned = state.unlockedIds.length

  return (
    <div className="col-page">
      <header className="col-header">
        <button className="col-back-btn" onClick={onBack}>← Retour</button>
        <h1 className="col-title">MA COLLECTION</h1>
        <span className="col-counter">{owned} / {ALL_CARDS.length} cartes</span>
      </header>

      <nav className="col-filters">
        {FILTER_LABELS.map(({ key, label }) => (
          <button
            key={key}
            className={`col-filter-btn${filter === key ? ' col-filter-active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="col-grid">
        {displayed.map(card => {
          const owned = hasCard(card.id)
          return (
            <div
              key={card.id}
              className={`col-card-wrap${owned ? '' : ' col-card-locked'}`}
              onClick={() => owned && setZoomed(card)}
              style={owned ? { cursor: 'pointer' } : undefined}
            >
              <CardSvg card={card} width={190} />
              {!owned && (
                <div className="col-lock-overlay">
                  <span className="col-lock-rarity">
                    {card.theme === 'legends' ? 'LÉGENDE' : card.theme === 'specials' ? 'SPÉCIALE' : 'TALENT'}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {zoomed && <CardZoomModal card={zoomed} onClose={() => setZoomed(null)} />}
    </div>
  )
}
