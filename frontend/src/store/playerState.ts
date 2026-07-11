import { useState } from 'react'
import { TALENT_IDS } from '../data/cards'

interface PlayerState {
  unlockedIds: string[]
  credits: number
  lossStreak: number
  savedDeck: string[]
}

const STORAGE_KEY = 'tcg_player_v1'
const LOSS_STREAK_MAX = 5
const LOSS_STREAK_REWARD = 10

function loadState(): PlayerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as PlayerState
      if (Array.isArray(parsed.unlockedIds)) {
        return {
          unlockedIds: parsed.unlockedIds,
          credits: parsed.credits ?? 50,
          lossStreak: parsed.lossStreak ?? 0,
          savedDeck: Array.isArray(parsed.savedDeck) ? parsed.savedDeck : [],
        }
      }
    }
  } catch {}
  const initial: PlayerState = { unlockedIds: [...TALENT_IDS], credits: 50, lossStreak: 0, savedDeck: [] }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
  return initial
}

function saveState(state: PlayerState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function usePlayerState() {
  const [state, setState] = useState<PlayerState>(loadState)

  function hasCard(id: string): boolean {
    return state.unlockedIds.includes(id)
  }

  function unlockCard(id: string): void {
    setState(prev => {
      if (prev.unlockedIds.includes(id)) return prev
      const next = { ...prev, unlockedIds: [...prev.unlockedIds, id] }
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
    let ok = false
    setState(prev => {
      if (prev.credits < amount) return prev
      ok = true
      const next = { ...prev, credits: prev.credits - amount }
      saveState(next)
      return next
    })
    return ok
  }

  function saveDeck(deckIds: string[]): void {
    setState(prev => {
      const next = { ...prev, savedDeck: deckIds }
      saveState(next)
      return next
    })
  }

  function recordMatch(win: boolean): number {
    let awarded = 0
    setState(prev => {
      let next: PlayerState
      if (win) {
        next = { ...prev, lossStreak: 0 }
      } else {
        const newStreak = prev.lossStreak + 1
        if (newStreak >= LOSS_STREAK_MAX) {
          awarded = LOSS_STREAK_REWARD
          next = { ...prev, lossStreak: 0, credits: prev.credits + LOSS_STREAK_REWARD }
        } else {
          next = { ...prev, lossStreak: newStreak }
        }
      }
      saveState(next)
      return next
    })
    return awarded
  }

  return { state, hasCard, unlockCard, addCredits, spendCredits, saveDeck, recordMatch }
}
