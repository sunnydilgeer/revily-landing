'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { prefersReducedMotion } from '../../step-chain/flip'
import { isMuted, setMuted, sfx } from './sfx'
import './lab.css'

/*
 * The pieces every lab shares, so they feel like one game: the header (leave, progress, streak,
 * lives, sound), a row of big answer buttons, the combo pop, a burst over a win, and the rank card.
 */

export const LIVES = 3

/** Lives and the first-try streak. `hit` counts a right answer; `miss` a wrong one. */
export function useScore() {
  const [lives, setLives] = useState(LIVES)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(0)
  const [kept, setKept] = useState(0)
  return {
    lives, streak, best, kept,
    /** A right answer. Only a first try grows the streak. Returns the new streak. */
    hit(firstTry: boolean) {
      const next = firstTry ? streak + 1 : 0
      setStreak(next)
      setBest(Math.max(best, next))
      if (next >= 3 && next % 3 === 0) sfx.win(); else sfx.coin()
      return next
    },
    /** A wrong answer. Returns the lives left. */
    miss() {
      sfx.buzz()
      setStreak(0)
      setLives(lives - 1)
      return lives - 1
    },
    /** End of a round: bank the lives left, and start the next round on full lives. */
    bank() { setKept(kept + lives); setLives(LIVES) },
    /** Retry a round after running out of lives. */
    refill() { setLives(LIVES) },
    reset() { setLives(LIVES); setStreak(0); setBest(0); setKept(0) },
  }
}

export function LabTop({ progress, streak, lives }: { progress: string; streak: number; lives: number }) {
  const [muted, setMutedState] = useState(false)
  useEffect(() => setMutedState(isMuted()), [])
  const toggle = () => { setMuted(!muted); setMutedState(!muted) }
  return <header className="lab-top">
    <a className="lab-icon lab-icon--close" href="/preview?view=lab" aria-label="Back to the Arcade">×</a>
    <p className="lab-progress">{progress}</p>
    {streak >= 2 && <span className="lab-streak" aria-label={`${streak} in a row`}>🔥 {streak}</span>}
    <div className="lab-lives" aria-label={`Lives: ${lives} of ${LIVES}`}>
      {Array.from({ length: LIVES }, (_, index) => <span key={index} className={`lab-pip${index < lives ? '' : ' is-lost'}`} aria-hidden="true">◆</span>)}
    </div>
    <button type="button" className="lab-icon" aria-label={muted ? 'Turn sound on' : 'Turn sound off'} aria-pressed={muted} onClick={toggle}>{muted ? '🔇' : '🔊'}</button>
  </header>
}

export type LabChoice = { value: number | string; label: ReactNode }

/** Big answer buttons. The picked one turns green or red; the rest dim until they try again. */
export function Choices({ choices, picked, answer, onPick, columns }: {
  choices: LabChoice[]
  picked: number | string | null
  answer: number | string
  onPick: (value: number | string) => void
  columns?: number
}) {
  return <div className="lab-choices" style={{ gridTemplateColumns: `repeat(${columns ?? choices.length}, minmax(0, 1fr))` }}>
    {choices.map(choice => {
      const state = picked === choice.value ? (choice.value === answer ? ' is-right' : ' is-wrong') : ''
      return <button
        key={String(choice.value)}
        type="button"
        className={`lab-choice${state}`}
        disabled={picked !== null && picked !== choice.value}
        aria-pressed={picked === choice.value}
        onClick={() => picked === null && onPick(choice.value)}
      >{choice.label}</button>
    })}
  </div>
}

export function Combo({ streak }: { streak: number }) {
  return streak >= 2 ? <p key={streak} className="lab-combo" role="status">🔥 {streak} in a row!</p> : null
}

/** A character with things to say: they ask the questions and react to every answer. */
export type Speaker = { name: string; emoji: string; right: string[]; wrong: string[] }

/** Their line for the nth answer, cycling so it doesn't repeat back to back. */
export const say = (lines: string[], n: number) => lines[n % lines.length]

/** A line of banter in a speech bubble. */
export function Quip({ speaker, children }: { speaker: Speaker; children: ReactNode }) {
  return <div className="lab-quip">
    <span className="lab-quip__who" aria-hidden="true">{speaker.emoji}</span>
    <p className="lab-quip__line"><span className="lab-quip__name">{speaker.name}</span>{children}</p>
  </div>
}

export function Why({ tag = 'Why', children }: { tag?: string; children: ReactNode }) {
  return <p className="lab-why"><span className="lab-why__tag">{tag}</span>{children}</p>
}

/** Something raining over a win. Purely for fun, so reduced motion hides it. */
export function Burst({ emoji }: { emoji: string }) {
  const [drops] = useState(() => Array.from({ length: 18 }, (_, key) => ({
    key, x: Math.round(Math.random() * 100), delay: Math.round(Math.random() * 400), spin: Math.round(Math.random() * 720 - 360),
  })))
  return <div className="lab-burst" aria-hidden="true">
    {drops.map(drop => <span key={drop.key} style={{ left: `${drop.x}%`, animationDelay: `${drop.delay}ms`, ['--spin' as string]: `${drop.spin}deg` }}>{emoji}</span>)}
  </div>
}

export type Rank = { badge: string; name: string; line: string }

export function RankCard({ rank, stats }: { rank: Rank; stats: [string, ReactNode][] }) {
  return <div className="lab-rank">
    <span className="lab-rank__badge" aria-hidden="true">{rank.badge}</span>
    <p className="lab-rank__label">Your rank</p>
    <h1 className="lab-rank__name">{rank.name}</h1>
    <p className="lab-rank__line">{rank.line}</p>
    <dl className="lab-stats">
      {stats.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl>
  </div>
}

/** The end-of-lab rule card: the method in three lines. */
export function Rule({ label = 'The move, every time', steps }: { label?: string; steps: string[] }) {
  return <div className="lab-rule">
    <p className="lab-rule__label">{label}</p>
    <ol>{steps.map(step => <li key={step}>{step}</li>)}</ol>
  </div>
}

/** Share a brag line with the native share sheet, or copy it with the link where there is none. */
export function useShare() {
  const [copied, setCopied] = useState(false)
  const share = async (title: string, text: string) => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title, text, url })
      else { await navigator.clipboard.writeText(`${text} ${url}`); setCopied(true) }
    } catch { /* they closed the share sheet */ }
  }
  return { share, copied, reset: () => setCopied(false) }
}

/** Counts from 0 to `target` once `running` turns on. Reduced motion lands on the number straight away. */
export function useCountUp(target: number, running: boolean, ms = 900) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!running) { setValue(0); return }
    if (prefersReducedMotion()) { setValue(target); return }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      setValue(Math.round(target * (1 - (1 - t) ** 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, running, ms])
  return value
}

const BEST_KEY = 'revily.labs.best'
export type Best = { badge: string; name: string; tier: number }

/** Best rank per lab, saved on this device. Tier 0 is the top rank. */
export function readBests(): Record<string, Best> {
  try { return JSON.parse(localStorage.getItem(BEST_KEY) ?? '{}') } catch { return {} }
}

/** Keeps a lab's rank if it beats the one saved. */
export function recordRank(lab: string, rank: Rank, names: Rank[]) {
  const tier = names.findIndex(candidate => candidate.name === rank.name)
  const bests = readBests()
  if (bests[lab] && bests[lab].tier <= tier) return
  try { localStorage.setItem(BEST_KEY, JSON.stringify({ ...bests, [lab]: { badge: rank.badge, name: rank.name, tier } })) } catch { /* private mode */ }
}

/** Rank from the lives kept across every round. */
export function rankFor(kept: number, rounds: number, names: [Rank, Rank, Rank, Rank]): Rank {
  const max = rounds * LIVES
  if (kept === max) return names[0]
  if (kept >= max - 2) return names[1]
  if (kept >= rounds) return names[2]
  return names[3]
}

/** Reveals a step chain one line at a time, then stops. For working shown after a win, without buttons. */
export function useAutoReveal(total: number, running: boolean, ms = 1100) {
  const [revealed, setRevealed] = useState(1)
  useEffect(() => {
    if (!running) { setRevealed(1); return }
    if (prefersReducedMotion()) { setRevealed(total); return }
    if (revealed >= total) return
    const timer = setTimeout(() => setRevealed(revealed + 1), ms)
    return () => clearTimeout(timer)
  }, [revealed, running, total, ms])
  return revealed
}
