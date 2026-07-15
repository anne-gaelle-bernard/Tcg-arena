import { useState } from 'react'
import { ALL_CARDS, type CardData } from '../data/cards'
import { usePlayerState } from '../store/playerState'
import CardSvg from '../components/collection/CardSvg'
import CardZoomModal from '../components/collection/CardZoomModal'
import '../style/MarketplacePage.css'

interface PackDef {
  id:          string
  name:        string
  sub:         string
  price:       number
  colorClass:  string
  description: string
  cardCount:   number
  svgSrc:      string
  draw:        (unlocked: string[]) => CardData[]
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function shuffled<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

const TALENTS  = ALL_CARDS.filter(card => card.theme === 'talents')
const SPECIALS = ALL_CARDS.filter(card => card.theme === 'specials')
const LEGENDS  = ALL_CARDS.filter(card => card.theme === 'legends')

function pickPreferringNew(pool: CardData[], unlockedIds: string[], count: number): CardData[] {
  const newCards = pool.filter(card => !unlockedIds.includes(card.id))

  let source: CardData[]
  if (newCards.length >= count) {
    source = shuffled(newCards)
  } else {
    source = shuffled(pool)
  }

  return source.slice(0, count)
}

const PACKS: PackDef[] = [
  {
    id:          'basic',
    name:        'BASIC',
    sub:         'PACK',
    price:       5,
    colorClass:  '',
    description: '3 cartes Talents aléatoires',
    cardCount:   3,
    svgSrc:      '/boosters/bronze.svg',
    draw: (unlockedIds) => pickPreferringNew(TALENTS, unlockedIds, 3),
  },
  {
    id:          'standard',
    name:        'STANDARD',
    sub:         'PACK',
    price:       10,
    colorClass:  '',
    description: '2 Talents + 1 Spéciale',
    cardCount:   3,
    svgSrc:      '/boosters/talents.svg',
    draw: (unlockedIds) => [
      ...pickPreferringNew(TALENTS, unlockedIds, 2),
      ...pickPreferringNew(SPECIALS, unlockedIds, 1),
    ],
  },
  {
    id:          'premium',
    name:        'PREMIUM',
    sub:         'PACK',
    price:       25,
    colorClass:  '',
    description: '1 Talent + 2 Spéciales',
    cardCount:   3,
    svgSrc:      '/boosters/diamond.svg',
    draw: (unlockedIds) => [
      ...pickPreferringNew(TALENTS, unlockedIds, 1),
      ...pickPreferringNew(SPECIALS, unlockedIds, 2),
    ],
  },
  {
    id:          'legend',
    name:        'LEGEND',
    sub:         'PACK',
    price:       40,
    colorClass:  '',
    description: '2 Spéciales + 1 Légende garantie',
    cardCount:   3,
    svgSrc:      '/boosters/legends.svg',
    draw: (unlockedIds) => {
      const specials  = pickPreferringNew(SPECIALS, unlockedIds, 2)
      const newLegend = pickPreferringNew(LEGENDS, unlockedIds, LEGENDS.length)

      let legendPool: CardData[]
      if (newLegend.length > 0) {
        legendPool = newLegend
      } else {
        legendPool = LEGENDS
      }

      const legend = pickRandom(legendPool)
      return [...specials, legend]
    },
  },
]

function PackCard({ pack, credits, onBuy }: { pack: PackDef; credits: number; onBuy: (p: PackDef) => void }) {
  const canAfford = credits >= pack.price

  let btnClass = 'pack-buy-btn'
  if (!canAfford) btnClass += ' pack-buy-disabled'

  let btnText = 'Acheter'
  if (!canAfford) btnText = 'Crédits insuffisants'

  function handleBuyClick() {
    if (canAfford) onBuy(pack)
  }

  return (
    <div className="mp-pack">
      <div className="pack-img-wrap">
        <img src={pack.svgSrc} alt={pack.name} className="pack-img" />
        <div className="pack-price-tag">{pack.price} CR</div>
      </div>
      <button
        type="button"
        className={btnClass}
        onClick={handleBuyClick}
        disabled={!canAfford}
      >
        {btnText}
      </button>
    </div>
  )
}

interface RevealCard { card: CardData; isNew: boolean; flipped: boolean }

function CardReveal({ items, onClose }: { items: RevealCard[]; onClose: () => void }) {
  const [cards, setCards] = useState<RevealCard[]>(items)
  const [zoomed, setZoomed] = useState<RevealCard | null>(null)

  const allFlipped = cards.every(c => c.flipped)
  const newCount   = items.filter(c => c.isNew).length

  function flip(i: number) {
    setCards(prev => prev.map((c, idx) => {
      if (idx === i) return { ...c, flipped: true }
      return c
    }))
  }

  function collectionSummary(): string {
    if (newCount === 0) return 'Ces cartes étaient déjà dans ta collection.'
    if (newCount === 1) return '1 nouvelle carte ajoutée à ta collection !'
    return `${newCount} nouvelles cartes ajoutées à ta collection !`
  }

  let hintText = 'Clique sur les cartes pour les révéler'
  if (allFlipped) hintText = collectionSummary()

  return (
    <div className="reveal-overlay">
      <div className="reveal-box">
        <h2 className="reveal-title">Booster ouvert !</h2>
        <p className="reveal-hint">{hintText}</p>

        <div className="reveal-cards">
          {cards.map((item, i) => {
            let slotClass = 'reveal-slot'
            if (item.flipped) {
              slotClass += ` reveal-slot-open reveal-slot-${item.card.theme}`
              if (item.isNew) slotClass += ' reveal-slot-new'
            } else {
              slotClass += ' reveal-slot-back'
            }

            function handleSlotClick() {
              if (item.flipped) {
                setZoomed(item)
              } else {
                flip(i)
              }
            }

            return (
              <div
                key={item.card.id + i}
                className={slotClass}
                onClick={handleSlotClick}
              >
                {item.flipped && (
                  <div className="reveal-card-wrap">
                    {item.isNew && <span className="new-badge">NOUVEAU</span>}
                    {!item.isNew && <span className="owned-badge">DÉJÀ POSSÉDÉE</span>}
                    <CardSvg card={item.card} width={148} />
                  </div>
                )}
                {!item.flipped && (
                  <span className="card-back-q">?</span>
                )}
              </div>
            )
          })}
        </div>

        {allFlipped && (
          <button type="button" className="reveal-close" onClick={onClose}>
            Voir ma collection
          </button>
        )}
      </div>

      {zoomed && <CardZoomModal card={zoomed.card} onClose={() => setZoomed(null)} />}
    </div>
  )
}

type Props = { onBack: () => void }

export default function MarketplacePage({ onBack }: Props) {
  const { state, spendCredits, unlockCard } = usePlayerState()
  const [openedCards, setOpenedCards] = useState<RevealCard[] | null>(null)

  function buyPack(pack: PackDef) {
    if (!spendCredits(pack.price)) return

    const drawn = pack.draw(state.unlockedIds)
    const items: RevealCard[] = drawn.map(card => {
      const isNew = !state.unlockedIds.includes(card.id)
      if (isNew) unlockCard(card.id)
      return { card, isNew, flipped: false }
    })
    setOpenedCards(items)
  }

  return (
    <div className="mp-shell">
      <header className="mp-header">
        <button type="button" className="mp-back" onClick={onBack}>← Retour</button>
        <h1 className="mp-title">MARKET PLACE</h1>
        <div className="mp-credits">
          <span className="mp-credits-num">{state.credits}</span>
          <span className="mp-credits-label">crédits</span>
        </div>
      </header>

      <main className="mp-main">
        <p className="mp-subtitle">Ouvrez des boosters pour débloquer de nouvelles cartes</p>
        <div className="mp-grid">
          {PACKS.map(pack => (
            <PackCard
              key={pack.id}
              pack={pack}
              credits={state.credits}
              onBuy={buyPack}
            />
          ))}
        </div>

        <div className="mp-info">
          <div className="mp-info-item">
            <span>Cartes débloquées : <strong>{state.unlockedIds.length}</strong> / {ALL_CARDS.length}</span>
          </div>
          <div className="mp-info-item">
            <span>Les cartes déjà possédées n'utilisent pas vos crédits</span>
          </div>
          <div className="mp-info-item">
            <span>Gagnez 10 crédits après 5 défaites consécutives</span>
          </div>
        </div>
      </main>

      {openedCards && (
        <CardReveal
          items={openedCards}
          onClose={() => setOpenedCards(null)}
        />
      )}
    </div>
  )
}
