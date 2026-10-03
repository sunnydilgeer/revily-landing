'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { prefersReducedMotion } from '../../step-chain/flip'
import { isTestMode } from './random'
import { isMuted, setMuted, sfx } from './sfx'
import './lab.css'

/*
 * The pieces every lab shares, so they feel like one game: the header (leave, progress, streak,
 * lives, sound), a row of big answer buttons, the combo pop, a burst over a win, and the rank card.
 */

export const LIVES = 3

/**
 * Hard mode (?hard=1): one life a round, no second chances. It's offered on the rank card to anyone who
 * gets a game's top rank. Read after the page loads (games render client-side), so server and browser agree.
 */
export function isHardMode() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('hard') === '1'
}

/** Lives at the start of each round: 3, or 1 in hard mode. */
export const livesPerRound = () => isHardMode() ? 1 : LIVES

/** Lives and the first-try streak. `hit` counts a right answer; `miss` a wrong one. */
export function useScore() {
  const [lives, setLives] = useState(livesPerRound)
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
    bank() { setKept(kept + lives); setLives(livesPerRound()) },
    /** Retry a round after running out of lives. */
    refill() { setLives(livesPerRound()) },
    reset() { setLives(livesPerRound()); setStreak(0); setBest(0); setKept(0) },
  }
}

export function LabTop({ progress, streak, lives }: { progress: string; streak: number; lives: number }) {
  const [muted, setMutedState] = useState(false)
  useEffect(() => setMutedState(isMuted()), [])
  const toggle = () => { setMuted(!muted); setMutedState(!muted) }
  const hard = isHardMode(), max = livesPerRound()
  return <header className="lab-top">
    <a className="lab-icon lab-icon--close" href="/preview?view=lab" aria-label="Back to the Arcade">×</a>
    <p className="lab-progress">{progress}</p>
    {hard && <span className="lab-hard" aria-label="Hard mode">💀 Hard</span>}
    {streak >= 2 && <span className="lab-streak" aria-label={`${streak} in a row`}>🔥 {streak}</span>}
    <div className="lab-lives" aria-label={`Lives: ${lives} of ${max}`}>
      {Array.from({ length: max }, (_, index) => <span key={index} className={`lab-pip${index < lives ? '' : ' is-lost'}`} aria-hidden="true">◆</span>)}
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
        data-correct={isTestMode() && choice.value === answer ? '' : undefined}
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

/** Splits a Why paragraph into its sentences, so it reads as short steps rather than a block. */
export function whySteps(text: string): string[] {
  return text.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g)?.map(step => step.trim()).filter(Boolean) ?? [text]
}

/**
 * The "How it works" screen that follows each round's story screen: the Why on its own, one short step per
 * line, with a picture of the idea on top. Keeps the story screen to the scene and the banter.
 */
export function WhyScreen({ kicker, title = 'How it works', visual, why, children }: {
  kicker: string
  title?: string
  /** A picture of the idea: a mini diagram, the game scene marked up, or a big emoji. */
  visual: ReactNode
  /** The Why text: split into steps by sentence. Pass steps yourself for control. */
  why: string | ReactNode[]
  /** Usually nothing; extra content under the steps. */
  children?: ReactNode
}) {
  const steps: ReactNode[] = Array.isArray(why) ? why : whySteps(why)
  return <section className="lab-intro lab-whyscreen">
    <p className="lab-kicker">{kicker}</p>
    <h1 className="lab-title">{title}</h1>
    <div className="lab-whyscreen__visual" aria-hidden="true">{visual}</div>
    <ol className="lab-whyscreen__steps">{steps.map((step, index) => <li key={index}>{step}</li>)}</ol>
    {children}
  </section>
}

/**
 * A round's opening, split over two screens so neither is overloaded:
 * 1. the story: kicker, headline, the scene and the character's banter, with a "How it works" button;
 * 2. how it works: the scene again (what the steps refer to) and the Why as short numbered steps,
 *    with Back and the round's own start button.
 * Remount it per round (key) so each round opens on the story.
 */
export function IntroSplit({ kicker, title, scene, speaker, line, why, start, onStart }: {
  kicker: string
  title: ReactNode
  /** The round's scene: shown on both screens. */
  scene?: ReactNode
  speaker?: Speaker
  line?: ReactNode
  /** A string is split into one step per sentence; pass an array for your own steps. */
  why: string | ReactNode[]
  /** The round's start button label: "Check the price". */
  start: ReactNode
  onStart: () => void
}) {
  const [step, setStep] = useState<'story' | 'why'>('story')
  if (step === 'story') return <>
    <section className="lab-intro">
      <p className="lab-kicker">{kicker}</p>
      <h1 className="lab-title">{title}</h1>
      {scene}
      {speaker && line && <Quip speaker={speaker}>{line}</Quip>}
    </section>
    <footer className="lab-bar">
      <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { sfx.tick(); setStep('why') }}>How it works</button>
    </footer>
  </>
  return <>
    <WhyScreen kicker={kicker} visual={scene ?? (speaker ? <span className="lab-whyscreen__emoji">{speaker.emoji}</span> : null)} why={why} />
    <footer className="lab-bar">
      <div className="lab-bar__actions">
        <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-icon-btn" aria-label="Back to the story" onClick={() => setStep('story')}>←</button>
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={onStart}>{start}</button>
      </div>
    </footer>
  </>
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

/** Top ranks handed out by `rankFor`, so the rank card knows when to offer hard mode. */
const TOP_RANKS = new WeakSet<Rank>()

/** The same game with ?hard=1 (keeping ?seed= for tests), starting from fresh. */
function hardModeHref() {
  const url = new URL(window.location.href)
  url.searchParams.set('hard', '1')
  return url.pathname + url.search
}

export function RankCard({ rank, stats }: { rank: Rank; stats: [string, ReactNode][] }) {
  const [offerHard, setOfferHard] = useState(false)
  useEffect(() => setOfferHard(TOP_RANKS.has(rank) && !isHardMode()), [rank])
  const [hardWin, setHardWin] = useState(false)
  useEffect(() => setHardWin(TOP_RANKS.has(rank) && isHardMode()), [rank])
  return <div className="lab-rank">
    {hardWin && <p className="lab-rank__hard">💀 Hard mode cleared</p>}
    <span className="lab-rank__badge" aria-hidden="true">{rank.badge}</span>
    <p className="lab-rank__label">Your rank</p>
    <h1 className="lab-rank__name">{rank.name}</h1>
    <p className="lab-rank__line">{rank.line}</p>
    <dl className="lab-stats">
      {stats.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl>
    {offerHard && <a className="lab-rank__hardlink" href={hardModeHref()}>
      <strong>💀 Try hard mode</strong>
      <span>One life a round. No second chances.</span>
    </a>}
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
  const max = rounds * livesPerRound()
  if (kept === max) { TOP_RANKS.add(names[0]); return names[0] }
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
