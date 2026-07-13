import { useState } from 'react'
import { ALL_CARDS, type CardData } from '../data/cards'
import { usePlayerState } from '../store/playerState'
import CardSvg from '../components/collection/CardSvg'
import '../style/MarketplacePage.css'

interface PackDef {
  id:          string
  name:        string
  sub:         string
  price:       number
  colorClass:  string
  description: string
  cardCount:   number
  draw:        (unlocked: string[]) => CardData[]
}

function rnd<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

const TALENTS  = ALL_CARDS.filter(c => c.theme === 'talents')
const SPECIALS = ALL_CARDS.filter(c => c.theme === 'specials')
const LEGENDS  = ALL_CARDS.filter(c => c.theme === 'legends')

function prefer(pool: CardData[], unlocked: string[], n: number): CardData[] {
  const fresh = pool.filter(c => !unlocked.includes(c.id))
  const src   = shuffle(fresh.length >= n ? fresh : pool)
  return src.slice(0, n)
}

const PACKS: PackDef[] = [
  {
    id:          'basic',
    name:        'BASIC',
    sub:         'PACK',
    price:       5,
    colorClass:  'pack-blue',
    description: '3 cartes Talents aléatoires',
    cardCount:   3,
    draw: (u) => prefer(TALENTS, u, 3),
  },
  {
    id:          'standard',
    name:        'STANDARD',
    sub:         'PACK',
    price:       10,
    colorClass:  'pack-green',
    description: '2 Talents + 1 Spéciale',
    cardCount:   3,
    draw: (u) => [...prefer(TALENTS, u, 2), ...prefer(SPECIALS, u, 1)],
  },
  {
    id:          'premium',
    name:        'PREMIUM',
    sub:         'PACK',
    price:       25,
    colorClass:  'pack-orange',
    description: '1 Talent + 2 Spéciales',
    cardCount:   3,
    draw: (u) => [...prefer(TALENTS, u, 1), ...prefer(SPECIALS, u, 2)],
  },
  {
    id:          'legend',
    name:        'LEGEND',
    sub:         'PACK',
    price:       40,
    colorClass:  'pack-red',
    description: '2 Spéciales + 1 Légende garantie',
    cardCount:   3,
    draw: (u) => [...prefer(SPECIALS, u, 2), rnd(prefer(LEGENDS, u, LEGENDS.length) as CardData[]) ?? rnd(LEGENDS)],
  },
]

function PackCard({ pack, credits, onBuy }: { pack: PackDef; credits: number; onBuy: (p: PackDef) => void }) {
  const canAfford = credits >= pack.price
  return (
    <div className={`mp-pack ${pack.colorClass}`}>
      <div className="pack-bag">
        <div className="pack-seal" />
        <div className="pack-body-art">
          <div className="pack-hoop-board" />
          <div className="pack-hoop-rim" />
          <div className="pack-hoop-net" />
          <svg className="pack-ball" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="28" fill="#ea580c"/>
            <ellipse cx="21" cy="19" rx="9" ry="6" fill="rgba(255,210,120,0.2)"/>
            <circle cx="30" cy="30" r="28" stroke="#1a0500" strokeWidth="1.5"/>
            <path d="M2 30 Q15 20 30 30 Q45 40 58 30" stroke="#1a0500" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <path d="M2 30 Q15 40 30 30 Q45 20 58 30" stroke="#1a0500" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <path d="M30 2 Q20 15 30 30 Q40 45 30 58" stroke="#1a0500" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <path d="M30 2 Q40 15 30 30 Q20 45 30 58" stroke="#1a0500" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
          <div className="pack-brand">
            <span className="pack-brand-main">HOOPS</span>
            <span className="pack-brand-sub">TCG</span>
          </div>
          <div className="pack-type-box">
            <span className="pack-type-name">{pack.name}</span>
            <span className="pack-type-label">{pack.sub}</span>
          </div>
        </div>
        <div className="pack-strip">
          <span>{pack.cardCount} cartes · {pack.price} CR</span>
        </div>
      </div>

      <button
        type="button"
        className={`pack-buy-btn ${canAfford ? '' : 'pack-buy-disabled'}`}
        onClick={() => canAfford && onBuy(pack)}
        disabled={!canAfford}
      >
        {canAfford ? 'Acheter' : 'Crédits insuffisants'}
      </button>
    </div>
  )
}

interface RevealCard { card: CardData; isNew: boolean; flipped: boolean }

function CardReveal({ items, onClose }: { items: RevealCard[]; onClose: () => void }) {
  const [cards, setCards] = useState<RevealCard[]>(items)
  const allFlipped = cards.every(c => c.flipped)

  function flip(i: number) {
    setCards(prev => prev.map((c, idx) => idx === i ? { ...c, flipped: true } : c))
  }

  return (
    <div className="reveal-overlay">
      <div className="reveal-box">
        <h2 className="reveal-title">Booster ouvert !</h2>
        <p className="reveal-hint">{allFlipped ? 'Toutes les cartes révélées' : 'Cliquez sur les cartes pour les révéler'}</p>

        <div className="reveal-cards">
          {cards.map((item, i) => (
            <div
              key={item.card.id + i}
              className={`reveal-slot ${item.flipped ? `reveal-slot-open reveal-slot-${item.card.theme}${item.isNew ? ' reveal-slot-new' : ''}` : 'reveal-slot-back'}`}
              onClick={() => !item.flipped && flip(i)}
            >
              {item.flipped ? (
                <div className="reveal-card-wrap">
                  {item.isNew && <span className="new-badge">NOUVEAU</span>}
                  <CardSvg card={item.card} width={148} />
                </div>
              ) : (
                <span className="card-back-q">?</span>
              )}
            </div>
          ))}
        </div>

        {allFlipped && (
          <button type="button" className="reveal-close" onClick={onClose}>
            Fermer
          </button>
        )}
      </div>
    </div>
  )
}

type Props = { onBack: () => void }

export default function MarketplacePage({ onBack }: Props) {
  const { state, spendCredits, unlockCard } = usePlayerState()
  const [openedCards, setOpenedCards] = useState<RevealCard[] | null>(null)
  const [lastPack, setLastPack] = useState<string | null>(null)

  function buyPack(pack: PackDef) {
    if (!spendCredits(pack.price)) return

    const drawn = pack.draw(state.unlockedIds)
    const items: RevealCard[] = drawn.map(card => {
      const isNew = !state.unlockedIds.includes(card.id)
      if (isNew) unlockCard(card.id)
      return { card, isNew, flipped: false }
    })
    setLastPack(pack.name)
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
          onClose={() => { setOpenedCards(null); setLastPack(null) }}
        />
      )}

      {lastPack && !openedCards && null}
    </div>
  )
}
