import { useState } from 'react'
import { TALENT_IDS } from '../data/cards'

interface PlayerState {
  unlockedIds: string[]
}

const STORAGE_KEY = 'tcg_player_v1'

function loadState(): PlayerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as PlayerState
      if (Array.isArray(parsed.unlockedIds)) return parsed
    }
  } catch {}
  const initial: PlayerState = { unlockedIds: [...TALENT_IDS] }
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

  return { state, hasCard, unlockCard }
}
