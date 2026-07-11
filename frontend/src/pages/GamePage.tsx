import { useState, useCallback, useEffect } from 'react'
import { ALL_CARDS, cardCost, type CardData } from '../data/cards'
import { usePlayerState } from '../store/playerState'
import type { AuthUser } from '../services/authApi'
import CardSvg from '../components/collection/CardSvg'
import '../style/GamePage.css'

type Session   = 1 | 2 | 3 | 4
type TurnPhase = 'select' | 'revealing' | 'result'
type GamePhase = 'session-select' | 'battle' | 'game-over'

interface RoundData {
  playerCard:    CardData
  opponentCard:  CardData
  playerWon:     boolean
  playerPower:   number
  opponentPower: number
}

interface BattleState {
  session:        Session
  deck:           CardData[]
  hand:           CardData[]
  opponentPool:   CardData[]
  diffBonus:      number
  playerHp:       number
  opponentHp:     number
  playerWins:     number
  opponentWins:   number
  round:          number
  energy:         number
  maxEnergy:      number
  turnPhase:      TurnPhase
  playedCard:     CardData | null
  opponentCard:   CardData | null
  lastRound:      RoundData | null
  gameResult:     'win' | 'lose' | null
  rewardCard:     CardData | null
  creditsAwarded: number
}

const SESSION_INFO: Record<Session, { label: string; difficulty: string; stars: number; levelReq: number }> = {
  1: { label: 'Session 1', difficulty: 'Facile',    stars: 1, levelReq: 1  },
  2: { label: 'Session 2', difficulty: 'Moyen',     stars: 2, levelReq: 5  },
  3: { label: 'Session 3', difficulty: 'Difficile', stars: 3, levelReq: 10 },
  4: { label: 'Session 4', difficulty: 'Expert',    stars: 4, levelReq: 15 },
}

const MAX_HP      = 20
const ROUND_DMG   = 4
const MAX_HAND    = 5
const WINS_NEEDED = 3
const MAX_ROUNDS  = 5

function roundEnergy(round: number): number {
  return Math.min(round + 2, 7)
}

function getOpponentPool(session: Session): CardData[] {
  switch (session) {
    case 1: return ALL_CARDS.filter(c => c.theme === 'talents')
    case 2: return ALL_CARDS.filter(c => c.theme === 'specials')
    case 3: return ALL_CARDS.filter(c => c.theme === 'specials' || (c.theme === 'legends' && c.atk <= 88))
    case 4: return ALL_CARDS.filter(c => c.theme === 'legends')
  }
}

function getDiffBonus(session: Session, level: number): number {
  return (session - 1) * 5 + Math.floor(level / 5) * 2
}

function buildDeckAndHand(unlockedIds: string[], savedDeck: string[]): { hand: CardData[]; deck: CardData[] } {
  const customCards = savedDeck
    .map(id => ALL_CARDS.find(c => c.id === id))
    .filter((c): c is CardData => !!c && unlockedIds.includes(c.id))

  let fullDeck: CardData[]
  if (customCards.length >= MAX_HAND) {
    fullDeck = [...customCards].sort(() => Math.random() - 0.5)
  } else {
    const pool    = ALL_CARDS.filter(c => unlockedIds.includes(c.id))
    const src     = pool.length >= MAX_HAND ? pool : ALL_CARDS.filter(c => c.theme === 'talents')
    const legends = src.filter(c => c.theme === 'legends').sort(() => Math.random() - 0.5)
    const others  = src.filter(c => c.theme !== 'legends').sort(() => Math.random() - 0.5)
    fullDeck = [...legends.slice(0, 1), ...others].sort(() => Math.random() - 0.5)
  }

  return { hand: fullDeck.slice(0, MAX_HAND), deck: fullDeck.slice(MAX_HAND) }
}

function pickRandom(pool: CardData[]): CardData {
  return pool[Math.floor(Math.random() * pool.length)]
}

function resolveRound(pc: CardData, oc: CardData, bonus: number): RoundData {
  const pp = pc.atk + Math.floor(Math.random() * 12)
  const op = oc.score + bonus + Math.floor(Math.random() * 10)
  return { playerCard: pc, opponentCard: oc, playerWon: pp > op, playerPower: pp, opponentPower: op }
}

function getSession1Drop(unlockedIds: string[]): CardData | null {
  if (Math.random() > 0.4) return null
  const avail = ALL_CARDS.filter(c => c.theme === 'legends' && !unlockedIds.includes(c.id))
  return avail.length ? avail[Math.floor(Math.random() * avail.length)] : null
}

function BoardCard({ card, side }: { card: CardData; side: 'player' | 'opponent' }) {
  return (
    <div className={`board-card board-card-${side}`}>
      <CardSvg card={card} width={118} />
    </div>
  )
}

const COST_COLOR: Record<number, string> = { 1: '#60a5fa', 2: '#a78bfa', 3: '#f2c94c' }

function HandCard({ card, onClick, disabled, energy }: {
  card: CardData; onClick: () => void; disabled: boolean; energy: number
}) {
  const cost       = cardCost(card)
  const cantAfford = energy < cost
  const isDisabled = disabled || cantAfford
  return (
    <button
      type="button"
      className={`hand-card${isDisabled ? ' hc-disabled' : ''}${cantAfford && !disabled ? ' hc-no-energy' : ''}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      <CardSvg card={card} width={76} />
      <div className="hc-cost-badge" style={{ background: COST_COLOR[cost] }}>
        {'⚡'.repeat(cost)}
      </div>
    </button>
  )
}

function HpOrb({ hp, max, side }: { hp: number; max: number; side: 'player' | 'opponent' }) {
  const pct = Math.max(0, hp / max)
  return (
    <div className={`hp-orb hp-orb-${side}`}>
      <svg viewBox="0 0 44 44" className="hp-ring">
        <circle cx="22" cy="22" r="18" className="hp-ring-bg" />
        <circle cx="22" cy="22" r="18" className={`hp-ring-fill hp-ring-fill-${side}`} strokeDasharray={`${pct * 113} 113`} />
      </svg>
      <span className="hp-number">{hp}</span>
    </div>
  )
}

type Props = { user: AuthUser; onBack: () => void }

export default function GamePage({ user, onBack }: Props) {
  const { state, unlockCard, recordMatch } = usePlayerState()
  const [gamePhase, setGamePhase] = useState<GamePhase>('session-select')
  const [battle, setBattle]       = useState<BattleState | null>(null)

  useEffect(() => {
    if (!battle || battle.turnPhase !== 'revealing') return
    const t = setTimeout(() => {
      setBattle(prev => {
        if (!prev || !prev.playedCard) return prev
        const oc    = pickRandom(prev.opponentPool)
        const round = resolveRound(prev.playedCard, oc, prev.diffBonus)
        const pWins = prev.playerWins   + (round.playerWon ? 1 : 0)
        const oWins = prev.opponentWins + (round.playerWon ? 0 : 1)
        const pHp   = round.playerWon ? prev.playerHp : Math.max(0, prev.playerHp - ROUND_DMG)
        const oHp   = round.playerWon ? Math.max(0, prev.opponentHp - ROUND_DMG) : prev.opponentHp
        const done  = pWins >= WINS_NEEDED || oWins >= WINS_NEEDED || prev.round >= MAX_ROUNDS || pHp <= 0 || oHp <= 0
        return {
          ...prev,
          opponentCard: oc,
          lastRound:    round,
          playerWins:   pWins,
          opponentWins: oWins,
          playerHp:     pHp,
          opponentHp:   oHp,
          turnPhase:    'result',
          gameResult:   done ? (pWins >= oWins && pHp > 0 ? 'win' : 'lose') : null,
        }
      })
    }, 700)
    return () => clearTimeout(t)
  }, [battle])

  const startGame = useCallback((session: Session) => {
    const { hand, deck } = buildDeckAndHand(state.unlockedIds, state.savedDeck)
    const initEnergy = roundEnergy(1)
    setBattle({
      session,
      deck,
      hand,
      opponentPool:   getOpponentPool(session),
      diffBonus:      getDiffBonus(session, user.level),
      playerHp:       MAX_HP,
      opponentHp:     MAX_HP,
      playerWins:     0,
      opponentWins:   0,
      round:          1,
      energy:         initEnergy,
      maxEnergy:      initEnergy,
      turnPhase:      'select',
      playedCard:     null,
      opponentCard:   null,
      lastRound:      null,
      gameResult:     null,
      rewardCard:     null,
      creditsAwarded: 0,
    })
    setGamePhase('battle')
  }, [state.unlockedIds, state.savedDeck, user.level])

  const playCard = useCallback((card: CardData) => {
    setBattle(prev => {
      if (!prev || prev.turnPhase !== 'select') return prev
      if (prev.energy < cardCost(card)) return prev
      return {
        ...prev,
        hand:       prev.hand.filter(c => c.id !== card.id),
        playedCard: card,
        energy:     prev.energy - cardCost(card),
        turnPhase:  'revealing',
      }
    })
  }, [])

  const nextRound = useCallback(() => {
    setBattle(prev => {
      if (!prev || !prev.lastRound) return prev

      if (prev.gameResult) {
        const credits = recordMatch(prev.gameResult === 'win')
        let reward: CardData | null = null
        if (prev.gameResult === 'win' && prev.session === 1) {
          reward = getSession1Drop(state.unlockedIds)
          if (reward) unlockCard(reward.id)
        }
        setGamePhase('game-over')
        return { ...prev, rewardCard: reward, creditsAwarded: credits }
      }

      let newDeck = [...prev.deck]
      let newHand = [...prev.hand]
      if (newDeck.length > 0 && newHand.length < MAX_HAND) {
        newHand = [...newHand, newDeck.shift()!]
      }

      const next = prev.round + 1
      return {
        ...prev,
        deck:         newDeck,
        hand:         newHand,
        round:        next,
        energy:       roundEnergy(next),
        maxEnergy:    roundEnergy(next),
        turnPhase:    'select',
        playedCard:   null,
        opponentCard: null,
      }
    })
  }, [recordMatch, state.unlockedIds, unlockCard])

  if (gamePhase === 'session-select') {
    return (
      <div className="game-shell">
        <div className="game-topbar">
          <button type="button" className="btn-back" onClick={onBack}>← Retour</button>
          <span className="topbar-title">HOOPS TCG — CHOISIR UNE SESSION</span>
        </div>
        <div className="session-select-screen">
          <h2 className="ss-title">Sélectionnez votre Session</h2>
          <div className="ss-grid">
            {([1, 2, 3, 4] as Session[]).map(s => {
              const info = SESSION_INFO[s]
              return (
                <button type="button" key={s} className={`ss-card ss-card-${s}`} onClick={() => startGame(s)}>
                  <span className="ss-num">{info.label}</span>
                  <span className="ss-stars">{'★'.repeat(info.stars)}{'☆'.repeat(4 - info.stars)}</span>
                  <span className="ss-diff">{info.difficulty}</span>
                  <span className="ss-lvl">Niv. {info.levelReq}+</span>
                  {s === 1 && <span className="ss-drop">⚡ DROP LIMITÉ</span>}
                </button>
              )
            })}
          </div>
          <p className="ss-hint">
            Niveau : <strong>{user.level}</strong> ·{' '}
            {state.savedDeck.length >= 5
              ? <>Deck perso : <strong>{state.savedDeck.length}</strong> cartes</>
              : <>Pas de deck — construis-en un depuis le menu !</>
            }{' '}· Main de <strong>{MAX_HAND}</strong> max
          </p>
        </div>
      </div>
    )
  }

  if (gamePhase === 'game-over' && battle) {
    const won = battle.gameResult === 'win'
    return (
      <div className="game-shell">
        <div className="game-topbar">
          <span className="topbar-title">{SESSION_INFO[battle.session].label} — Résultat final</span>
        </div>
        <div className="game-over-screen">
          <h2 className={`go-title ${won ? 'go-win' : 'go-lose'}`}>
            {won ? '🏆 VICTOIRE !' : '💀 DÉFAITE'}
          </h2>
          <p className="go-score">{battle.playerWins} – {battle.opponentWins}</p>
          <p className="go-hp">PV finaux — Vous : {battle.playerHp} · Adversaire : {battle.opponentHp}</p>
          <div className="go-rewards">
            {won && battle.session === 1 && (
              battle.rewardCard
                ? <div className="reward-pill reward-card">⚡ Drop : <strong>{battle.rewardCard.name}</strong> ({battle.rewardCard.theme})</div>
                : <p className="reward-miss">Pas de drop cette fois — retente !</p>
            )}
            {battle.creditsAwarded > 0 && (
              <div className="reward-pill reward-credits">💰 +{battle.creditsAwarded} crédits (consolation 5 défaites)</div>
            )}
            {!won && battle.creditsAwarded === 0 && (
              <p className="go-streak">Série de défaites : {state.lossStreak}/5 — à 5 tu gagnes 10 crédits !</p>
            )}
          </div>
          <div className="go-actions">
            <button type="button" className="btn-primary"   onClick={() => startGame(battle.session)}>Rejouer</button>
            <button type="button" className="btn-secondary" onClick={() => setGamePhase('session-select')}>Changer de session</button>
            <button type="button" className="btn-ghost"     onClick={onBack}>Menu principal</button>
          </div>
        </div>
      </div>
    )
  }

  if (gamePhase === 'battle' && battle) {
    const info     = SESSION_INFO[battle.session]
    const isSelect = battle.turnPhase === 'select'
    const isReveal = battle.turnPhase === 'revealing'
    const isResult = battle.turnPhase === 'result'

    return (
      <div className="game-shell">
        <div className="game-topbar">
          <button type="button" className="btn-back" onClick={() => setGamePhase('session-select')}>← Sessions</button>
          <span className="topbar-title">{info.label} — Round {battle.round}/{MAX_ROUNDS}</span>
          <div className="topbar-score">
            <span className="score-p">{battle.playerWins}</span>
            <span className="score-sep">–</span>
            <span className="score-o">{battle.opponentWins}</span>
          </div>
        </div>

        <div className="board">
          <div className="board-half board-half-opponent">
            <HpOrb hp={battle.opponentHp} max={MAX_HP} side="opponent" />
            <div className="board-zone board-zone-opponent">
              {(isReveal || isResult) && battle.opponentCard
                ? <BoardCard card={battle.opponentCard} side="opponent" />
                : <div className="zone-placeholder"><span>?</span></div>
              }
            </div>
            <div className="board-label">ADVERSAIRE</div>
          </div>

          <div className="board-divider">
            <div className="divider-line" />
            {isResult && battle.lastRound && (
              <div className={`round-verdict-badge ${battle.lastRound.playerWon ? 'verdict-win' : 'verdict-lose'}`}>
                {battle.lastRound.playerWon ? '✓ ROUND GAGNÉ' : '✗ ROUND PERDU'}
              </div>
            )}
            {isReveal && <div className="round-verdict-badge verdict-thinking">Adversaire joue…</div>}
          </div>

          <div className="board-half board-half-player">
            <div className="board-label">VOUS</div>
            <div className="board-zone board-zone-player">
              {(isReveal || isResult) && battle.playedCard
                ? <BoardCard card={battle.playedCard} side="player" />
                : <div className="zone-placeholder"><span>Jouez une carte</span></div>
              }
            </div>
            <HpOrb hp={battle.playerHp} max={MAX_HP} side="player" />
          </div>
        </div>

        <div className="hand-bar">
          <div className="turn-indicator">
            {isSelect && <span className="turn-badge turn-you">VOTRE TOUR</span>}
            {isReveal && <span className="turn-badge turn-wait">EN ATTENTE…</span>}
            {isResult && (
              <button type="button" className="btn-next" onClick={nextRound}>
                {battle.gameResult ? 'Résultat →' : 'Suivant →'}
              </button>
            )}
            <div className="energy-bar">
              {Array.from({ length: battle.maxEnergy }).map((_, i) => (
                <span key={i} className={`energy-crystal${i < battle.energy ? ' ec-full' : ' ec-empty'}`} />
              ))}
              <span className="energy-label">{battle.energy}/{battle.maxEnergy}</span>
            </div>
            <span className="deck-count">Deck : {battle.deck.length} · Main : {battle.hand.length}</span>
          </div>

          <div className="hand-cards">
            {battle.hand.map(card => (
              <HandCard key={card.id} card={card} onClick={() => playCard(card)} disabled={!isSelect} energy={battle.energy} />
            ))}
            {battle.hand.length === 0 && <p className="deck-empty">Deck vide !</p>}
          </div>
        </div>

        {isResult && battle.lastRound && (
          <div className="power-banner">
            <span>Votre puissance : <strong>{battle.lastRound.playerPower}</strong></span>
            <span className="power-vs">VS</span>
            <span>Adversaire : <strong>{battle.lastRound.opponentPower}</strong></span>
          </div>
        )}
      </div>
    )
  }

  return null
}
