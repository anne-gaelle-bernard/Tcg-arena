import { useState } from 'react'
import '../style/CollectionPage.css'
import { ALL_CARDS, type CardData, type CardTheme } from '../data/cards'
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

function getRarityLabel(theme: CardTheme): string {
  if (theme === 'legends') return 'LÉGENDE'
  if (theme === 'specials') return 'SPÉCIALE'
  return 'TALENT'
}

interface Props {
  onBack: () => void
}

export default function CollectionPage({ onBack }: Props) {
  const { hasCard, state } = usePlayerState()
  const [filter, setFilter] = useState<Filter>('all')
  const [zoomed, setZoomed] = useState<CardData | null>(null)

  let displayed: CardData[]
  if (filter === 'all') {
    displayed = ALL_CARDS
  } else {
    displayed = ALL_CARDS.filter(c => c.theme === filter)
  }

  const owned = state.unlockedIds.length

  return (
    <div className="col-page">
      <header className="col-header">
        <button className="col-back-btn" onClick={onBack}>← Retour</button>
        <h1 className="col-title">MA COLLECTION</h1>
        <span className="col-counter">{owned} / {ALL_CARDS.length} cartes</span>
      </header>

      <nav className="col-filters">
        {FILTER_LABELS.map(({ key, label }) => {
          let btnClass = 'col-filter-btn'
          if (filter === key) btnClass += ' col-filter-active'

          return (
            <button
              key={key}
              className={btnClass}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          )
        })}
      </nav>

      <div className="col-grid">
        {displayed.map(card => {
          const isOwned = hasCard(card.id)

          let wrapClass = 'col-card-wrap'
          if (!isOwned) wrapClass += ' col-card-locked'

          let wrapStyle: React.CSSProperties | undefined
          if (isOwned) wrapStyle = { cursor: 'pointer' }

          function handleClick() {
            if (isOwned) setZoomed(card)
          }

          return (
            <div
              key={card.id}
              className={wrapClass}
              onClick={handleClick}
              style={wrapStyle}
            >
              <CardSvg card={card} width={190} />
              {!isOwned && (
                <div className="col-lock-overlay">
                  <span className="col-lock-rarity">
                    {getRarityLabel(card.theme)}
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
