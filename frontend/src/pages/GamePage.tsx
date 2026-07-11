import { useState, useCallback, useEffect, useRef } from 'react'
import { ALL_CARDS, cardCost, type CardData } from '../data/cards'
import { usePlayerState } from '../store/playerState'
import type { AuthUser } from '../services/authApi'
import CardSvg from '../components/collection/CardSvg'
import '../style/GamePage.css'

type Session = 1 | 2 | 3 | 4

const FIELD_SIZE = 3
const MAX_HAND   = 6
const MAX_HP     = 20

const COST_COLOR: Record<number, string> = { 1: '#60a5fa', 2: '#a78bfa', 3: '#f2c94c' }

const SESSION_INFO: Record<Session, { label: string; difficulty: string; levelReq: number }> = {
  1: { label: 'Session 1', difficulty: 'Facile',    levelReq: 1  },
  2: { label: 'Session 2', difficulty: 'Moyen',     levelReq: 5  },
  3: { label: 'Session 3', difficulty: 'Difficile', levelReq: 10 },
  4: { label: 'Session 4', difficulty: 'Expert',    levelReq: 15 },
}

interface FieldCard {
  card:        CardData
  hasAttacked: boolean
  uid:         string
}

interface GameState {
  session:          Session
  turn:             number
  phase:            'play' | 'attack' | 'opponent'
  energy:           number
  maxEnergy:        number
  playerHp:         number
  opponentHp:       number
  playerHand:       CardData[]
  playerDeck:       CardData[]
  playerField:      (FieldCard | null)[]
  opponentField:    (FieldCard | null)[]
  opponentPool:     CardData[]
  selectedAttacker: number | null
  diffBonus:        number
  gameResult:       'win' | 'lose' | null
  rewardCard:       CardData | null
  creditsAwarded:   number
  log:              string
}

function roundEnergy(turn: number): number {
  return Math.min(turn + 2, 7)
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

function buildHand(unlockedIds: string[], savedDeck: string[]): { hand: CardData[]; deck: CardData[] } {
  const custom = savedDeck
    .map(id => ALL_CARDS.find(c => c.id === id))
    .filter((c): c is CardData => !!c && unlockedIds.includes(c.id))
  let all: CardData[]
  if (custom.length >= 5) {
    all = [...custom].sort(() => Math.random() - 0.5)
  } else {
    const pool = ALL_CARDS.filter(c => unlockedIds.includes(c.id))
    all = (pool.length >= 5 ? pool : ALL_CARDS.filter(c => c.theme === 'talents'))
          .sort(() => Math.random() - 0.5)
  }
  return { hand: all.slice(0, 3), deck: all.slice(3) }
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

let _uid = 0
function toField(card: CardData): FieldCard {
  return { card, hasAttacked: false, uid: String(++_uid) }
}

function directDamage(atk: number): number {
  return Math.max(1, Math.floor(atk / 20))
}

function runOpponentTurn(s: GameState): Partial<GameState> {
  const oppField   = s.opponentField.map(fc => fc ? { ...fc } : null) as (FieldCard | null)[]
  let playerField  = s.playerField.map(fc => fc ? { ...fc } : null) as (FieldCard | null)[]
  let playerHp     = s.playerHp
  const logs: string[] = []

  const emptySlot = oppField.findIndex(f => f === null)
  if (emptySlot !== -1) {
    const card = pickRandom(s.opponentPool)
    oppField[emptySlot] = toField(card)
    logs.push(`Adversaire joue ${card.name}`)
  }

  oppField.forEach((slot, oi) => {
    if (!slot) return
    const atk     = slot.card.atk + s.diffBonus
    const targets  = playerField.map((f, i) => f ? i : -1).filter(i => i !== -1)
    if (targets.length > 0) {
      const ti      = targets[0]
      const target  = playerField[ti]!
      if (atk >= target.card.def) {
        playerField[ti] = null
        logs.push(`${slot.card.name} détruit ${target.card.name}`)
      } else {
        oppField[oi] = null
        logs.push(`${target.card.name} résiste à ${slot.card.name}`)
      }
    } else {
      const dmg  = directDamage(atk)
      playerHp   = Math.max(0, playerHp - dmg)
      logs.push(`Attaque directe -${dmg} PV`)
    }
  })

  let newHand = [...s.playerHand]
  let newDeck = [...s.playerDeck]
  if (newDeck.length > 0 && newHand.length < MAX_HAND) {
    newHand = [...newHand, newDeck.shift()!]
  }

  const nextTurn   = s.turn + 1
  const maxEnergy  = roundEnergy(nextTurn)
  const gameResult = playerHp <= 0 ? 'lose' as const : null
  const resetField = playerField.map(f => f ? { ...f, hasAttacked: false } : null)

  return {
    turn:          nextTurn,
    phase:         'play',
    energy:        maxEnergy,
    maxEnergy,
    playerHp,
    playerHand:    newHand,
    playerDeck:    newDeck,
    playerField:   resetField,
    opponentField: oppField,
    selectedAttacker: null,
    gameResult,
    log:           logs.join(' · ') || 'Tour adverse terminé',
  }
}

function HpBar({ hp, max, label, side }: { hp: number; max: number; label: string; side: 'player' | 'opponent' }) {
  const pct = Math.max(0, (hp / max) * 100)
  return (
    <div className={`hp-bar hp-bar-${side}`}>
      <span className="hp-bar-label">{label}</span>
      <div className="hp-bar-track">
        <div className="hp-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="hp-bar-num">{hp}</span>
    </div>
  )
}

function FieldSlot({ slot, selectable, selected, targetable, onClick }: {
  slot:       FieldCard | null
  selectable: boolean
  selected:   boolean
  targetable: boolean
  onClick:    () => void
}) {
  const cls = [
    'field-slot',
    !slot ? 'field-slot-empty' : '',
    selectable ? 'field-slot-selectable' : '',
    selected   ? 'field-slot-selected'   : '',
    targetable ? 'field-slot-targetable' : '',
    slot?.hasAttacked ? 'field-slot-tapped' : '',
  ].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      className={cls}
      onClick={onClick}
      disabled={!selectable && !targetable}
    >
      {slot ? (
        <>
          <CardSvg card={slot.card} width={82} />
          <div className="slot-stats">
            <span className="slot-atk">{slot.card.atk}</span>
            <span className="slot-sep">/</span>
            <span className="slot-def">{slot.card.def}</span>
          </div>
          {slot.hasAttacked && <div className="tapped-overlay">ATQ</div>}
        </>
      ) : (
        <span className="slot-empty-text">–</span>
      )}
    </button>
  )
}

type Props = { user: AuthUser; onBack: () => void }

export default function GamePage({ user, onBack }: Props) {
  const { state, unlockCard, recordMatch } = usePlayerState()
  const [pagePhase, setPagePhase] = useState<'session-select' | 'battle' | 'game-over'>('session-select')
  const [gs, setGs]               = useState<GameState | null>(null)
  const gameOverHandled            = useRef(false)

  useEffect(() => {
    if (!gs || gs.phase !== 'opponent') return
    const t = setTimeout(() => {
      setGs(prev => {
        if (!prev || prev.phase !== 'opponent') return prev
        return { ...prev, ...runOpponentTurn(prev) }
      })
    }, 900)
    return () => clearTimeout(t)
  }, [gs?.phase, gs?.turn])

  useEffect(() => {
    if (!gs?.gameResult || gameOverHandled.current) return
    gameOverHandled.current = true
    const won     = gs.gameResult === 'win'
    const credits = recordMatch(won)
    let rewardCard: CardData | null = null
    if (won && gs.session === 1) {
      const avail = ALL_CARDS.filter(c => c.theme === 'legends' && !state.unlockedIds.includes(c.id))
      if (avail.length && Math.random() > 0.6) {
        rewardCard = pickRandom(avail)
        unlockCard(rewardCard.id)
      }
    }
    setGs(prev => prev ? { ...prev, creditsAwarded: credits, rewardCard } : prev)
    setPagePhase('game-over')
  }, [gs?.gameResult])

  const startGame = useCallback((session: Session) => {
    gameOverHandled.current = false
    const { hand, deck } = buildHand(state.unlockedIds, state.savedDeck)
    const e = roundEnergy(1)
    setGs({
      session,
      turn:          1,
      phase:         'play',
      energy:        e,
      maxEnergy:     e,
      playerHp:      MAX_HP,
      opponentHp:    MAX_HP,
      playerHand:    hand,
      playerDeck:    deck,
      playerField:   [null, null, null],
      opponentField: [null, null, null],
      opponentPool:  getOpponentPool(session),
      selectedAttacker: null,
      diffBonus:     getDiffBonus(session, user.level),
      gameResult:    null,
      rewardCard:    null,
      creditsAwarded: 0,
      log:           'Jouez des cartes depuis votre main',
    })
    setPagePhase('battle')
  }, [state.unlockedIds, state.savedDeck, user.level])

  const playCard = useCallback((card: CardData, idx: number) => {
    setGs(prev => {
      if (!prev || prev.phase !== 'play') return prev
      if (prev.energy < cardCost(card)) return prev
      const emptySlot = prev.playerField.findIndex(s => s === null)
      if (emptySlot === -1) return prev
      const newField = [...prev.playerField]
      newField[emptySlot] = toField(card)
      return {
        ...prev,
        energy:      prev.energy - cardCost(card),
        playerHand:  prev.playerHand.filter((_, i) => i !== idx),
        playerField: newField,
        log:         `${card.name} posé sur le terrain`,
      }
    })
  }, [])

  const toggleAttacker = useCallback((slotIdx: number) => {
    setGs(prev => {
      if (!prev || prev.phase !== 'attack') return prev
      const slot = prev.playerField[slotIdx]
      if (!slot || slot.hasAttacked) return prev
      const next = prev.selectedAttacker === slotIdx ? null : slotIdx
      return {
        ...prev,
        selectedAttacker: next,
        log: next !== null ? `${slot.card.name} — choisissez une cible` : 'Sélectionnez un attaquant',
      }
    })
  }, [])

  const attackOpponentCard = useCallback((targetIdx: number) => {
    setGs(prev => {
      if (!prev || prev.phase !== 'attack' || prev.selectedAttacker === null) return prev
      const attSlot = prev.playerField[prev.selectedAttacker]
      const defSlot = prev.opponentField[targetIdx]
      if (!attSlot || !defSlot) return prev

      const newPF = [...prev.playerField]
      const newOF = [...prev.opponentField]
      let log = ''

      if (attSlot.card.atk >= defSlot.card.def) {
        newOF[targetIdx] = null
        newPF[prev.selectedAttacker] = { ...attSlot, hasAttacked: true }
        log = `${attSlot.card.name} détruit ${defSlot.card.name}`
      } else {
        newPF[prev.selectedAttacker] = null
        log = `${defSlot.card.name} résiste — ${attSlot.card.name} détruit`
      }

      const newOppHp   = prev.opponentHp
      const gameResult = newOppHp <= 0 ? 'win' as const : null

      return {
        ...prev,
        playerField:      newPF,
        opponentField:    newOF,
        opponentHp:       newOppHp,
        selectedAttacker: null,
        gameResult,
        log,
      }
    })
  }, [])

  const attackDirect = useCallback(() => {
    setGs(prev => {
      if (!prev || prev.phase !== 'attack' || prev.selectedAttacker === null) return prev
      if (prev.opponentField.some(s => s !== null)) return prev
      const attSlot = prev.playerField[prev.selectedAttacker]
      if (!attSlot) return prev

      const dmg      = directDamage(attSlot.card.atk)
      const newOppHp = Math.max(0, prev.opponentHp - dmg)
      const newPF    = [...prev.playerField]
      newPF[prev.selectedAttacker] = { ...attSlot, hasAttacked: true }
      const gameResult = newOppHp <= 0 ? 'win' as const : null

      return {
        ...prev,
        opponentHp:       newOppHp,
        playerField:      newPF,
        selectedAttacker: null,
        gameResult,
        log:              `Attaque directe — -${dmg} PV à l'adversaire`,
      }
    })
  }, [])

  const endTurn = useCallback(() => {
    setGs(prev => {
      if (!prev) return prev
      return { ...prev, phase: 'opponent', selectedAttacker: null, log: 'Tour adverse...' }
    })
  }, [])

  if (pagePhase === 'session-select') {
    return (
      <div className="game-shell">
        <div className="game-topbar">
          <button type="button" className="btn-back" onClick={onBack}>← Retour</button>
          <span className="topbar-title">HOOPS TCG</span>
        </div>
        <div className="session-select-screen">
          <h2 className="ss-title">Choisir une session</h2>
          <div className="ss-grid">
            {([1, 2, 3, 4] as Session[]).map(s => {
              const info = SESSION_INFO[s]
              return (
                <button type="button" key={s} className={`ss-card ss-card-${s}`} onClick={() => startGame(s)}>
                  <span className="ss-num">{info.label}</span>
                  <span className="ss-stars">{s}/4</span>
                  <span className="ss-diff">{info.difficulty}</span>
                  <span className="ss-lvl">Niv. {info.levelReq}+</span>
                  {s === 1 && <span className="ss-drop">DROP LIMITÉ</span>}
                </button>
              )
            })}
          </div>
          <p className="ss-hint">
            Niv. <strong>{user.level}</strong> ·{' '}
            {state.savedDeck.length >= 5
              ? <>Deck : <strong>{state.savedDeck.length}</strong> cartes</>
              : <>Pas de deck sauvegardé</>
            }
          </p>
        </div>
      </div>
    )
  }

  if (pagePhase === 'game-over' && gs) {
    const won = gs.gameResult === 'win'
    return (
      <div className="game-shell">
        <div className="game-topbar">
          <span className="topbar-title">{SESSION_INFO[gs.session].label} — Résultat</span>
        </div>
        <div className="game-over-screen">
          <h2 className={`go-title ${won ? 'go-win' : 'go-lose'}`}>
            {won ? 'VICTOIRE !' : 'DÉFAITE'}
          </h2>
          <p className="go-hp">PV finaux — Vous : {gs.playerHp} · Adversaire : {gs.opponentHp}</p>
          <div className="go-rewards">
            {gs.rewardCard && (
              <div className="reward-pill reward-card">Drop : <strong>{gs.rewardCard.name}</strong></div>
            )}
            {gs.creditsAwarded > 0 && (
              <div className="reward-pill reward-credits">+{gs.creditsAwarded} crédits</div>
            )}
            {!won && !gs.creditsAwarded && (
              <p className="go-streak">Série de défaites : {state.lossStreak}/5</p>
            )}
          </div>
          <div className="go-actions">
            <button type="button" className="btn-primary"   onClick={() => startGame(gs.session)}>Rejouer</button>
            <button type="button" className="btn-secondary" onClick={() => setPagePhase('session-select')}>Sessions</button>
            <button type="button" className="btn-ghost"     onClick={onBack}>Menu</button>
          </div>
        </div>
      </div>
    )
  }

  if (pagePhase === 'battle' && gs) {
    const info        = SESSION_INFO[gs.session]
    const isPlay      = gs.phase === 'play'
    const isAttack    = gs.phase === 'attack'
    const isOpponent  = gs.phase === 'opponent'
    const hasSelected = gs.selectedAttacker !== null
    const oppHasCards = gs.opponentField.some(s => s !== null)
    const allAttacked = gs.playerField.every(s => !s || s.hasAttacked)
    const fieldFull   = gs.playerField.every(s => s !== null)

    return (
      <div className="game-shell">
        <div className="game-topbar">
          <button type="button" className="btn-back" onClick={() => setPagePhase('session-select')}>← Sessions</button>
          <span className="topbar-title">{info.label} — Tour {gs.turn}</span>
        </div>

        <div className="board">
          <HpBar hp={gs.opponentHp} max={MAX_HP} label="Adversaire" side="opponent" />

          <div className="field-row field-row-opponent">
            {gs.opponentField.map((slot, i) => (
              <FieldSlot
                key={i}
                slot={slot}
                selectable={false}
                selected={false}
                targetable={isAttack && hasSelected && !!slot}
                onClick={() => attackOpponentCard(i)}
              />
            ))}
          </div>

          <div className="board-divider">
            <div className="divider-line" />
            <div className={`phase-badge ${isOpponent ? 'phase-opponent' : isAttack ? 'phase-attack' : 'phase-play'}`}>
              {isOpponent ? 'Tour adverse' : isAttack ? 'Phase attaque' : 'Phase de jeu'}
            </div>
          </div>

          <div className="field-row field-row-player">
            {gs.playerField.map((slot, i) => (
              <FieldSlot
                key={i}
                slot={slot}
                selectable={isAttack && !!slot && !slot.hasAttacked}
                selected={gs.selectedAttacker === i}
                targetable={false}
                onClick={() => toggleAttacker(i)}
              />
            ))}
          </div>

          <HpBar hp={gs.playerHp} max={MAX_HP} label="Vous" side="player" />
        </div>

        <div className="hand-bar">
          <div className="turn-indicator">
            <div className="energy-bar">
              {Array.from({ length: gs.maxEnergy }).map((_, i) => (
                <span key={i} className={`energy-crystal${i < gs.energy ? ' ec-full' : ' ec-empty'}`} />
              ))}
              <span className="energy-label">{gs.energy}/{gs.maxEnergy}</span>
            </div>
            <span className="deck-count">Deck : {gs.playerDeck.length} · Main : {gs.playerHand.length}</span>

            <div className="phase-actions">
              {isPlay && (
                <button
                  type="button"
                  className="btn-phase btn-attack-phase"
                  onClick={() => setGs(prev => prev ? { ...prev, phase: 'attack', selectedAttacker: null, log: 'Sélectionnez un attaquant' } : prev)}
                >
                  Attaquer
                </button>
              )}
              {isAttack && hasSelected && !oppHasCards && (
                <button type="button" className="btn-phase btn-direct" onClick={attackDirect}>
                  Attaque directe
                </button>
              )}
              {(isPlay || (isAttack && allAttacked)) && !isOpponent && (
                <button type="button" className="btn-phase btn-endturn" onClick={endTurn}>
                  Fin de tour
                </button>
              )}
            </div>

            <p className="game-log">{gs.log}</p>
          </div>

          <div className="hand-cards">
            {gs.playerHand.map((card, i) => {
              const cost       = cardCost(card)
              const cantAfford = gs.energy < cost
              const disabled   = !isPlay || cantAfford || fieldFull || isOpponent
              return (
                <button
                  key={card.id + i}
                  type="button"
                  className={`hand-card${disabled ? ' hc-disabled' : ''}${cantAfford && isPlay ? ' hc-no-energy' : ''}`}
                  onClick={() => !disabled && playCard(card, i)}
                  disabled={disabled}
                >
                  <CardSvg card={card} width={72} />
                  <div className="hc-cost-badge" style={{ background: COST_COLOR[cost] }}>{cost}</div>
                </button>
              )
            })}
            {gs.playerHand.length === 0 && <p className="deck-empty">Main vide</p>}
          </div>
        </div>
      </div>
    )
  }

  return null
}
