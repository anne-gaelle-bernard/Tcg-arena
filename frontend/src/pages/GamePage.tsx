import { useState, useEffect, useRef } from 'react'
import { ALL_CARDS, cardCost, type CardData } from '../data/cards'
import { usePlayerState } from '../store/playerState'
import type { AuthUser } from '../services/authApi'
import CardSvg from '../components/collection/CardSvg'
import CardZoomModal from '../components/collection/CardZoomModal'
import '../style/GamePage.css'

type Session = 1 | 2 | 3 | 4
type Phase   = 'player' | 'opponent'

const MAX_HAND = 6
const MAX_HP   = 20

const COST_COLOR: Record<number, string> = { 1: '#60a5fa', 2: '#a78bfa', 3: '#f2c94c' }

const WIN_CREDITS: Record<Session, number> = { 1: 5, 2: 10, 3: 15, 4: 20 }

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
  phase:            Phase
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
  difficultyBonus:  number
  gameResult:       'win' | 'lose' | null
  rewardCard:       CardData | null
  creditsAwarded:   number
  log:              string
}

function getEnergyForTurn(turn: number): number {
  return Math.min(turn + 2, 7)
}

function getOpponentCardPool(session: Session): CardData[] {
  if (session === 1) return ALL_CARDS.filter(card => card.theme === 'talents')
  if (session === 2) return ALL_CARDS.filter(card => card.theme === 'specials')
  if (session === 3) return ALL_CARDS.filter(card => card.theme === 'specials' || (card.theme === 'legends' && card.atk <= 88))
  return ALL_CARDS.filter(card => card.theme === 'legends')
}

function getDifficultyBonus(session: Session, playerLevel: number): number {
  return (session - 1) * 5 + Math.floor(playerLevel / 5) * 2
}

function buildStartingHand(unlockedIds: string[], savedDeck: string[]): { hand: CardData[]; deck: CardData[] } {
  const deckCards = savedDeck
    .map(id => ALL_CARDS.find(card => card.id === id))
    .filter((card): card is CardData => !!card && unlockedIds.includes(card.id))

  let allCards: CardData[]

  if (deckCards.length >= 5) {
    allCards = [...deckCards].sort(() => Math.random() - 0.5)
  } else {
    const pool = ALL_CARDS.filter(card => unlockedIds.includes(card.id))
    if (pool.length >= 5) {
      allCards = [...pool].sort(() => Math.random() - 0.5)
    } else {
      allCards = ALL_CARDS.filter(card => card.theme === 'talents').sort(() => Math.random() - 0.5)
    }
  }

  return { hand: allCards.slice(0, 3), deck: allCards.slice(3) }
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

let nextCardId = 0
function makeFieldCard(card: CardData): FieldCard {
  return { card, hasAttacked: false, uid: String(++nextCardId) }
}

function getDirectDamage(atk: number): number {
  return Math.max(1, Math.floor(atk / 20))
}

function runOpponentTurn(currentState: GameState): Partial<GameState> {
  const newOpponentField = currentState.opponentField.map(slot => {
    if (slot === null) return null
    return { ...slot }
  }) as (FieldCard | null)[]

  let newPlayerField = currentState.playerField.map(slot => {
    if (slot === null) return null
    return { ...slot }
  }) as (FieldCard | null)[]

  let newPlayerHp    = currentState.playerHp
  const logs: string[] = []

  const emptySlot = newOpponentField.findIndex(slot => slot === null)
  if (emptySlot !== -1) {
    const card = pickRandom(currentState.opponentPool)
    newOpponentField[emptySlot] = makeFieldCard(card)
    logs.push(`Adversaire joue ${card.name}`)
  }

  newOpponentField.forEach((opponentSlot, opponentIndex) => {
    if (!opponentSlot) return

    const attackValue = opponentSlot.card.atk + currentState.difficultyBonus
    const targets     = newPlayerField
      .map((slot, index) => (slot ? index : -1))
      .filter(index => index !== -1)

    if (targets.length > 0) {
      const targetIndex = targets[0]
      const target      = newPlayerField[targetIndex]!

      if (attackValue >= target.card.def) {
        newPlayerField[targetIndex] = null
        logs.push(`${opponentSlot.card.name} détruit ${target.card.name}`)
      } else {
        newOpponentField[opponentIndex] = null
        logs.push(`${target.card.name} résiste — ${opponentSlot.card.name} détruit`)
      }
    } else {
      const damage = getDirectDamage(attackValue)
      newPlayerHp  = Math.max(0, newPlayerHp - damage)
      logs.push(`Attaque directe : -${damage} PV`)
    }
  })

  let newHand = [...currentState.playerHand]
  let newDeck = [...currentState.playerDeck]
  if (newDeck.length > 0 && newHand.length < MAX_HAND) {
    newHand = [...newHand, newDeck.shift()!]
  }

  const nextTurn  = currentState.turn + 1
  const maxEnergy = getEnergyForTurn(nextTurn)

  let gameResult: 'lose' | null = null
  if (newPlayerHp <= 0) {
    gameResult = 'lose'
  }

  const resetPlayerField = newPlayerField.map(slot => {
    if (slot === null) return null
    return { ...slot, hasAttacked: false }
  })

  const logMessage = logs.length > 0 ? logs.join(' · ') : 'Tour adverse terminé — à vous !'

  return {
    turn:             nextTurn,
    phase:            'player',
    energy:           maxEnergy,
    maxEnergy,
    playerHp:         newPlayerHp,
    playerHand:       newHand,
    playerDeck:       newDeck,
    playerField:      resetPlayerField,
    opponentField:    newOpponentField,
    selectedAttacker: null,
    gameResult,
    log:              logMessage,
  }
}

function FieldSlot({ slot, selectable, selected, targetable, onClick }: {
  slot:       FieldCard | null
  selectable: boolean
  selected:   boolean
  targetable: boolean
  onClick:    () => void
}) {
  const classes = ['field-slot']
  if (!slot)             classes.push('field-slot-empty')
  if (selectable)        classes.push('field-slot-selectable')
  if (selected)          classes.push('field-slot-selected')
  if (targetable)        classes.push('field-slot-targetable')
  if (slot?.hasAttacked) classes.push('field-slot-tapped')

  return (
    <button
      type="button"
      className={classes.join(' ')}
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
  const [zoomed, setZoomed]       = useState<CardData | null>(null)
  const gameOverHandled            = useRef(false)

  useEffect(() => {
    if (!gs || gs.phase !== 'opponent') return
    const timer = setTimeout(() => {
      setGs(prev => {
        if (!prev || prev.phase !== 'opponent') return prev
        return { ...prev, ...runOpponentTurn(prev) }
      })
    }, 1000)
    return () => clearTimeout(timer)
  }, [gs?.phase, gs?.turn])

  useEffect(() => {
    if (!gs?.gameResult || gameOverHandled.current) return
    gameOverHandled.current = true

    const won = gs.gameResult === 'win'

    let winCredits = 0
    if (won) winCredits = WIN_CREDITS[gs.session]

    const credits = recordMatch(won, winCredits)
    let rewardCard: CardData | null = null

    if (won && gs.session === 1) {
      const available = ALL_CARDS.filter(card => card.theme === 'legends' && !state.unlockedIds.includes(card.id))
      if (available.length && Math.random() > 0.6) {
        rewardCard = pickRandom(available)
        unlockCard(rewardCard.id)
      }
    }

    setGs(prev => {
      if (!prev) return prev
      return { ...prev, creditsAwarded: credits, rewardCard }
    })
    setPagePhase('game-over')
  }, [gs?.gameResult])

  function startGame(session: Session) {
    gameOverHandled.current = false
    const { hand, deck } = buildStartingHand(state.unlockedIds, state.savedDeck)
    const energy = getEnergyForTurn(1)

    setGs({
      session,
      turn:             1,
      phase:            'player',
      energy,
      maxEnergy:        energy,
      playerHp:         MAX_HP,
      opponentHp:       MAX_HP,
      playerHand:       hand,
      playerDeck:       deck,
      playerField:      [null, null, null],
      opponentField:    [null, null, null],
      opponentPool:     getOpponentCardPool(session),
      selectedAttacker: null,
      difficultyBonus:  getDifficultyBonus(session, user.level),
      gameResult:       null,
      rewardCard:       null,
      creditsAwarded:   0,
      log:              'Jouez des cartes ou attaquez, puis cliquez Fin de tour',
    })
    setPagePhase('battle')
  }

  function playCard(card: CardData, handIndex: number) {
    setGs(prev => {
      if (!prev || prev.phase !== 'player') return prev
      if (prev.energy < cardCost(card)) return prev

      const emptySlot = prev.playerField.findIndex(slot => slot === null)
      if (emptySlot === -1) return prev

      const newField = [...prev.playerField]
      newField[emptySlot] = makeFieldCard(card)

      return {
        ...prev,
        energy:           prev.energy - cardCost(card),
        playerHand:       prev.playerHand.filter((_, index) => index !== handIndex),
        playerField:      newField,
        selectedAttacker: null,
        log:              `${card.name} posé sur le terrain`,
      }
    })
  }

  function selectAttacker(slotIndex: number) {
    setGs(prev => {
      if (!prev || prev.phase !== 'player') return prev
      const slot = prev.playerField[slotIndex]
      if (!slot || slot.hasAttacked) return prev

      let newSelection: number | null
      if (prev.selectedAttacker === slotIndex) {
        newSelection = null
      } else {
        newSelection = slotIndex
      }

      let logMessage: string
      if (newSelection !== null) {
        logMessage = `${slot.card.name} prêt à attaquer — choisissez une cible`
      } else {
        logMessage = 'Sélectionnez un attaquant'
      }

      return { ...prev, selectedAttacker: newSelection, log: logMessage }
    })
  }

  function attackCard(targetIndex: number) {
    setGs(prev => {
      if (!prev || prev.phase !== 'player' || prev.selectedAttacker === null) return prev

      const attacker = prev.playerField[prev.selectedAttacker]
      const defender = prev.opponentField[targetIndex]
      if (!attacker || !defender) return prev

      const newPlayerField   = [...prev.playerField]
      const newOpponentField = [...prev.opponentField]
      let log = ''

      if (attacker.card.atk >= defender.card.def) {
        newOpponentField[targetIndex] = null
        newPlayerField[prev.selectedAttacker] = { ...attacker, hasAttacked: true }
        log = `${attacker.card.name} détruit ${defender.card.name}`
      } else {
        newPlayerField[prev.selectedAttacker] = null
        log = `${defender.card.name} résiste — ${attacker.card.name} détruit`
      }

      return {
        ...prev,
        playerField:      newPlayerField,
        opponentField:    newOpponentField,
        selectedAttacker: null,
        log,
      }
    })
  }

  function attackDirect() {
    setGs(prev => {
      if (!prev || prev.phase !== 'player' || prev.selectedAttacker === null) return prev
      if (prev.opponentField.some(slot => slot !== null)) return prev

      const attacker = prev.playerField[prev.selectedAttacker]
      if (!attacker) return prev

      const damage        = getDirectDamage(attacker.card.atk)
      const newOpponentHp = Math.max(0, prev.opponentHp - damage)
      const newPlayerField = [...prev.playerField]
      newPlayerField[prev.selectedAttacker] = { ...attacker, hasAttacked: true }

      let newGameResult: 'win' | null = null
      if (newOpponentHp <= 0) {
        newGameResult = 'win'
      }

      return {
        ...prev,
        opponentHp:       newOpponentHp,
        playerField:      newPlayerField,
        selectedAttacker: null,
        gameResult:       newGameResult,
        log:              `Attaque directe — -${damage} PV à l'adversaire (${newOpponentHp} restants)`,
      }
    })
  }

  function endTurn() {
    setGs(prev => {
      if (!prev || prev.phase !== 'player') return prev
      return { ...prev, phase: 'opponent', selectedAttacker: null, log: 'Tour adverse en cours...' }
    })
  }

  // ── Écran de sélection de session ──
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
            {([1, 2, 3, 4] as Session[]).map(session => {
              const info = SESSION_INFO[session]
              return (
                <button type="button" key={session} className={`ss-card ss-card-${session}`} onClick={() => startGame(session)}>
                  <span className="ss-num">{info.label}</span>
                  <span className="ss-stars">{session}/4</span>
                  <span className="ss-diff">{info.difficulty}</span>
                  <span className="ss-lvl">Niv. {info.levelReq}+</span>
                  {session === 1 && <span className="ss-drop">DROP LIMITÉ</span>}
                </button>
              )
            })}
          </div>
          <p className="ss-hint">
            Niv. <strong>{user.level}</strong> ·{' '}
            {state.savedDeck.length >= 5 && (
              <>Deck : <strong>{state.savedDeck.length}</strong> cartes</>
            )}
            {state.savedDeck.length < 5 && (
              <>Pas de deck sauvegardé</>
            )}
          </p>
        </div>
      </div>
    )
  }

  // ── Écran de fin de partie ──
  if (pagePhase === 'game-over' && gs) {
    const won = gs.gameResult === 'win'

    let titleClass = 'go-lose'
    if (won) titleClass = 'go-win'

    let titleText = 'DÉFAITE'
    if (won) titleText = 'VICTOIRE !'

    return (
      <div className="game-shell">
        <div className="game-topbar">
          <span className="topbar-title">{SESSION_INFO[gs.session].label} — Résultat</span>
        </div>
        <div className="game-over-screen">
          <h2 className={`go-title ${titleClass}`}>{titleText}</h2>
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

  // ── Écran de bataille ──
  if (pagePhase === 'battle' && gs) {
    const isPlayerTurn        = gs.phase === 'player'
    const isOpponentTurn      = gs.phase === 'opponent'
    const hasSelectedAttacker = gs.selectedAttacker !== null
    const opponentHasCards    = gs.opponentField.some(slot => slot !== null)
    const playerFieldFull     = gs.playerField.every(slot => slot !== null)

    let phaseBadgeClass = 'phase-play'
    let phaseLabel      = 'Votre tour'
    if (isOpponentTurn) {
      phaseBadgeClass = 'phase-opponent'
      phaseLabel      = 'Tour adverse...'
    } else if (hasSelectedAttacker) {
      phaseBadgeClass = 'phase-attack'
      phaseLabel      = 'Choisir une cible'
    }

    return (
      <div className="game-shell">
        <div className="game-topbar">
          <button type="button" className="btn-back" onClick={() => setPagePhase('session-select')}>← Sessions</button>
          <span className="topbar-title">{SESSION_INFO[gs.session].label} — Tour {gs.turn}</span>
        </div>

        <div className="board">
          <HpBar hp={gs.opponentHp} max={MAX_HP} label="Adversaire" side="opponent" />

          <div className="field-row field-row-opponent">
            {gs.opponentField.map((slot, index) => (
              <FieldSlot
                key={index}
                slot={slot}
                selectable={false}
                selected={false}
                targetable={isPlayerTurn && hasSelectedAttacker && !!slot}
                onClick={() => attackCard(index)}
              />
            ))}
          </div>

          <div className="board-divider">
            <div className="divider-line" />
            <div className={`phase-badge ${phaseBadgeClass}`}>{phaseLabel}</div>
          </div>

          <div className="field-row field-row-player">
            {gs.playerField.map((slot, index) => (
              <FieldSlot
                key={index}
                slot={slot}
                selectable={isPlayerTurn && !!slot && !slot.hasAttacked}
                selected={gs.selectedAttacker === index}
                targetable={false}
                onClick={() => selectAttacker(index)}
              />
            ))}
          </div>

          <HpBar hp={gs.playerHp} max={MAX_HP} label="Vous" side="player" />
        </div>

        <div className="hand-bar">
          <div className="turn-indicator">
            <div className="energy-bar">
              {Array.from({ length: gs.maxEnergy }).map((_, index) => {
                let crystalClass = 'energy-crystal'
                if (index < gs.energy) {
                  crystalClass += ' ec-full'
                } else {
                  crystalClass += ' ec-empty'
                }
                return <span key={index} className={crystalClass} />
              })}
              <span className="energy-label">{gs.energy}/{gs.maxEnergy}</span>
            </div>
            <span className="deck-count">Deck : {gs.playerDeck.length} · Main : {gs.playerHand.length}</span>

            <div className="phase-actions">
              {isPlayerTurn && hasSelectedAttacker && !opponentHasCards && (
                <button type="button" className="btn-phase btn-direct" onClick={attackDirect}>
                  Attaque directe
                </button>
              )}
              <button
                type="button"
                className="btn-phase btn-endturn"
                onClick={endTurn}
                disabled={!isPlayerTurn}
              >
                Fin de tour
              </button>
            </div>

            <p className="game-log">{gs.log}</p>
          </div>

          <div className="hand-cards">
            {gs.playerHand.map((card, index) => {
              const cost       = cardCost(card)
              const cantAfford = gs.energy < cost

              let cardDisabled = false
              if (!isPlayerTurn)   cardDisabled = true
              if (cantAfford)      cardDisabled = true
              if (playerFieldFull) cardDisabled = true

              let handCardClass = 'hand-card'
              if (cardDisabled)              handCardClass += ' hc-disabled'
              if (cantAfford && isPlayerTurn) handCardClass += ' hc-no-energy'

              return (
                <div key={card.id + index} className="hand-card-wrap">
                  <button
                    type="button"
                    className={handCardClass}
                    onClick={() => !cardDisabled && playCard(card, index)}
                    disabled={cardDisabled}
                  >
                    <CardSvg card={card} width={72} />
                    <div className="hc-cost-badge" style={{ background: COST_COLOR[cost] }}>{cost}</div>
                  </button>
                  <button
                    type="button"
                    className="hc-zoom-btn"
                    onClick={() => setZoomed(card)}
                    title="Voir la carte"
                  >⤢</button>
                </div>
              )
            })}
            {gs.playerHand.length === 0 && <p className="deck-empty">Main vide</p>}
          </div>
        </div>

        {zoomed && <CardZoomModal card={zoomed} onClose={() => setZoomed(null)} />}
      </div>
    )
  }

  return null
}

function HpBar({ hp, max, label, side }: { hp: number; max: number; label: string; side: 'player' | 'opponent' }) {
  const percentage = Math.max(0, (hp / max) * 100)
  return (
    <div className={`hp-bar hp-bar-${side}`}>
      <span className="hp-bar-label">{label}</span>
      <div className="hp-bar-track">
        <div className="hp-bar-fill" style={{ width: `${percentage}%` }} />
      </div>
      <span className="hp-bar-num">{hp}</span>
    </div>
  )
}
