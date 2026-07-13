import { useState } from 'react'
import { TALENT_IDS } from '../data/cards'

interface PlayerState {
  unlockedIds: string[]
  credits:     number
  lossStreak:  number
  savedDeck:   string[]
}

const STORAGE_KEY      = 'tcg_player_v1'
const LOSS_STREAK_MAX    = 5
const LOSS_STREAK_REWARD = 10

function loadState(): PlayerState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as PlayerState
      if (Array.isArray(parsed.unlockedIds)) {
        return {
          unlockedIds: parsed.unlockedIds,
          credits:     parsed.credits    ?? 50,
          lossStreak:  parsed.lossStreak ?? 0,
          savedDeck:   Array.isArray(parsed.savedDeck) ? parsed.savedDeck : [],
        }
      }
    }
  } catch {}

  // Aucune sauvegarde trouvée : on crée un état de départ
  const initialState: PlayerState = {
    unlockedIds: [...TALENT_IDS],
    credits:     50,
    lossStreak:  0,
    savedDeck:   [],
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState))
  return initialState
}

function saveState(state: PlayerState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function usePlayerState() {
  const [state, setState] = useState<PlayerState>(loadState)

  function hasCard(cardId: string): boolean {
    return state.unlockedIds.includes(cardId)
  }

  function unlockCard(cardId: string): void {
    setState(prev => {
      if (prev.unlockedIds.includes(cardId)) return prev
      const next = { ...prev, unlockedIds: [...prev.unlockedIds, cardId] }
      saveState(next)
      return next
    })
  }

  function addCredits(amount: number): void {
    setState(prev => {
      const next = { ...prev, credits: prev.credits + amount }
      saveState(next)
      return next
    })
  }

  function spendCredits(amount: number): boolean {
    if (state.credits < amount) return false
    setState(prev => {
      if (prev.credits < amount) return prev
      const next = { ...prev, credits: prev.credits - amount }
      saveState(next)
      return next
    })
    return true
  }

  function saveDeck(deckIds: string[]): void {
    setState(prev => {
      const next = { ...prev, savedDeck: deckIds }
      saveState(next)
      return next
    })
  }

  function recordMatch(won: boolean): number {
    let creditsAwarded = 0

    setState(prev => {
      if (won) {
        const next = { ...prev, lossStreak: 0 }
        saveState(next)
        return next
      }

      const newStreak = prev.lossStreak + 1
      if (newStreak >= LOSS_STREAK_MAX) {
        creditsAwarded = LOSS_STREAK_REWARD
        const next = { ...prev, lossStreak: 0, credits: prev.credits + LOSS_STREAK_REWARD }
        saveState(next)
        return next
      }

      const next = { ...prev, lossStreak: newStreak }
      saveState(next)
      return next
    })

    return creditsAwarded
  }

  return { state, hasCard, unlockCard, addCredits, spendCredits, saveDeck, recordMatch }
}
