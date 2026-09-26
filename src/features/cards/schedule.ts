/*
 * Spaced review for revision cards (Leitner boxes), kept on this device.
 * - "Got it" moves a card up a box: back in 1, 3, 7, then 21 days (the old app's review timing).
 * - "Still learning" drops it to box 1: it comes back later in the same session and again tomorrow.
 * - New cards are introduced at most NEW_PER_DAY a day, so a long lesson doesn't flood the queue.
 */
import { dayKey } from '../maths/studyLog'

export type CardState = { box: number; due: string; reviews: number; introduced: string }
export type CardStates = Record<string, CardState>

export const CARDS_KEY = 'revily:revision-cards:v1'
export const CARDS_EVENT = 'revily:revision-cards'
export const INTERVAL_DAYS = [1, 3, 7, 21]
export const NEW_PER_DAY = 12
export const SESSION_MAX = 20

export function addDays(key: string, days: number) {
  const [y, m, d] = key.split('-').map(Number)
  return dayKey(new Date(y, m - 1, d + days))
}

export function review(states: CardStates, id: string, gotIt: boolean, today = dayKey()): CardStates {
  const current = states[id]
  const box = gotIt ? Math.min(INTERVAL_DAYS.length, (current?.box ?? 0) + 1) : 1
  return {
    ...states,
    [id]: {
      box,
      due: addDays(today, gotIt ? INTERVAL_DAYS[box - 1] : 1),
      reviews: (current?.reviews ?? 0) + 1,
      introduced: current?.introduced ?? today,
    },
  }
}

/** Today's queue: cards that are due (weakest first), then new cards up to today's allowance. */
export function todaysQueue<T extends { id: string }>(unlocked: T[], states: CardStates, today = dayKey()): T[] {
  const due = unlocked.filter(card => states[card.id] && states[card.id].due <= today)
    .sort((a, b) => states[a.id].box - states[b.id].box || states[a.id].due.localeCompare(states[b.id].due))
  const introducedToday = Object.values(states).filter(state => state.introduced === today).length
  const fresh = unlocked.filter(card => !states[card.id]).slice(0, Math.max(0, NEW_PER_DAY - introducedToday))
  return [...due, ...fresh].slice(0, SESSION_MAX)
}

/** Studying one deck: cards due first (weakest first), then ones never seen, then the rest by due date. */
export function deckQueue<T extends { id: string }>(cards: T[], states: CardStates, today = dayKey()): T[] {
  const due = cards.filter(card => states[card.id] && states[card.id].due <= today).sort((a, b) => states[a.id].box - states[b.id].box)
  const unseen = cards.filter(card => !states[card.id])
  const later = cards.filter(card => states[card.id] && states[card.id].due > today).sort((a, b) => states[a.id].due.localeCompare(states[b.id].due))
  return [...due, ...unseen, ...later].slice(0, SESSION_MAX)
}

export function readCardStates(): CardStates {
  if (typeof window === 'undefined') return {}
  try {
    const value = JSON.parse(window.localStorage.getItem(CARDS_KEY) ?? '{}')
    return value && typeof value === 'object' ? value as CardStates : {}
  } catch {
    return {}
  }
}

export function saveCardStates(states: CardStates) {
  try { window.localStorage.setItem(CARDS_KEY, JSON.stringify(states)) } catch { /* storage unavailable: keep going */ }
  window.dispatchEvent(new CustomEvent(CARDS_EVENT))
}
