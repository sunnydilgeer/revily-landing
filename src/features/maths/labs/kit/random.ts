'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/*
 * Fresh, friendly numbers for every play.
 *
 * Generators pick the ANSWER first and build the question backwards from it, so every division
 * comes out whole and the numbers stay "nice" (multiples of 5, 10, 20, 100...). Wrong options are
 * built from the classic slips, then cleaned up by `options` so they never clash with the answer.
 *
 * Add ?seed=123 to a lab's URL for repeatable numbers. That is test mode: the right answer is also
 * marked in the page (data-correct) so automated playthroughs can find it.
 */

export type Rand = {
  /** 0 ≤ x < 1 */
  next(): number
  /** A whole number from min to max inclusive, in steps of `step` counted from min: int(10, 50, 10) → 10, 20 … 50. */
  int(min: number, max: number, step?: number): number
  pick<T>(items: readonly T[]): T
  shuffle<T>(items: readonly T[]): T[]
  chance(p: number): boolean
}

/** Seeded random numbers (mulberry32): the same seed always gives the same numbers. */
export function makeRand(seed: number): Rand {
  let a = seed >>> 0
  const next = () => {
    a = a + 0x6D2B79F5 | 0
    let t = Math.imul(a ^ a >>> 15, 1 | a)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
  const int = (min: number, max: number, step = 1) => min + step * Math.floor(next() * (Math.floor((max - min) / step) + 1))
  return {
    next,
    int,
    pick: items => items[Math.floor(next() * items.length)],
    shuffle: items => {
      const out = [...items]
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]]
      }
      return out
    },
    chance: p => next() < p,
  }
}

/** The ?seed= in the URL, if there is one. */
export function seedFromUrl(): number | null {
  if (typeof window === 'undefined') return null
  const value = new URLSearchParams(window.location.search).get('seed')
  return value !== null && /^\d+$/.test(value) ? Number(value) : null
}

/** Test mode marks the right answers in the page, for automated playthroughs. */
export function isTestMode() {
  return seedFromUrl() !== null
}

/**
 * Generates a game's numbers after the page loads (so server and browser agree), and again on
 * `regenerate` for "Play again". With ?seed=, the first play uses that seed and each replay the next.
 */
export function useGenerated<T>(make: (rand: Rand) => T) {
  const [game, setGame] = useState<{ data: T; play: number } | null>(null)
  const plays = useRef(0)
  const makeRef = useRef(make)
  makeRef.current = make
  const regenerate = useCallback(() => {
    const fixed = seedFromUrl()
    const seed = fixed !== null ? fixed + plays.current : Math.floor(Math.random() * 2 ** 31)
    plays.current += 1
    setGame({ data: makeRef.current(makeRand(seed)), play: plays.current })
  }, [])
  useEffect(() => { regenerate() }, [regenerate])
  /** `play` counts up on every regenerate: use it as a React key to start the game afresh. */
  return { data: game?.data ?? null, play: game?.play ?? 0, regenerate }
}

export type Option<V extends number | string = number> = { value: V; label: string; nope?: string }

/**
 * The right answer plus up to `count - 1` wrong ones, shuffled. Wrong options that match the answer,
 * repeat another option, or fail `valid` (e.g. not a whole number, not positive) are dropped, so list
 * more slips than you need, best first.
 */
export function options<V extends number | string>(
  rand: Rand,
  answer: Option<V>,
  wrongs: Option<V>[],
  { count = 3, valid = (value: V) => typeof value !== 'number' || (Number.isFinite(value) && value > 0) }: { count?: number; valid?: (value: V) => boolean } = {},
): Option<V>[] {
  const seen = new Set<string>([String(answer.value)])
  const labels = new Set<string>([answer.label])
  const kept: Option<V>[] = []
  for (const wrong of wrongs) {
    if (kept.length === count - 1) break
    if (!valid(wrong.value) || seen.has(String(wrong.value)) || labels.has(wrong.label)) continue
    seen.add(String(wrong.value)); labels.add(wrong.label)
    kept.push(wrong)
  }
  return rand.shuffle([answer, ...kept])
}

/** Is `value` a whole number? Use in `valid` for answers that must be whole. */
export const whole = (value: number) => Number.isInteger(value) && value > 0

/** £ with pence only when needed: £40, £12.50. */
export const gbp = (value: number) => `£${Number.isInteger(value) ? value.toLocaleString('en-GB') : value.toFixed(2)}`

/** £ for KaTeX: \pounds 1{,}200 */
export const texGbp = (value: number) => `\\pounds ${(Number.isInteger(value) ? value.toLocaleString('en-GB') : value.toFixed(2)).replace(/,/g, '{,}')}`

/** A number for KaTeX, with thousands commas braced: 1{,}200 */
export const texNum = (value: number) => value.toLocaleString('en-GB').replace(/,/g, '{,}')
