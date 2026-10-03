'use client'

/*
 * The revision-cards screen, shared by every subject. Each subject passes its own decks and its own
 * storage key, so a session only ever holds one subject's cards and each keeps its own schedule.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { MathSpan } from '../../../components/MathText'
import { Button } from '../../ui'
import { CARDS_EVENT, readCardStates, review, saveCardStates, todaysQueue, type CardStates } from './schedule'
import './RevisionCards.css'

export type StudyCard = {
  id: string
  front: string
  back: string
  /** Shown above the card text, e.g. "Place value · Key fact". */
  label: string
  /** A sum to show as LaTeX when the front text doesn't include it. */
  frontMath?: string
  note?: string
}

export type StudyDeck = {
  key: string
  title: string
  cards: StudyCard[]
  /** The student has opened this lesson. */
  started: boolean
  /** Cards from parts the student has finished (or reviewed before): these feed Today's cards. */
  studied: StudyCard[]
  /** Cards in this deck to study, in order (due first, then new, then the rest). */
  queue: StudyCard[]
}

type Session = { title: string; queue: StudyCard[]; index: number; flipped: boolean; gotIt: number; again: number; requeued: Set<string> }

export function useCardStates(storageKey: string) {
  const [states, setStates] = useState<CardStates>({})
  useEffect(() => {
    const refresh = () => setStates(readCardStates(storageKey))
    refresh()
    window.addEventListener(CARDS_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => { window.removeEventListener(CARDS_EVENT, refresh); window.removeEventListener('storage', refresh) }
  }, [storageKey])
  return states
}

type Props = {
  storageKey: string
  decks: StudyDeck[]
  intro: string
  /** Shown under the deck list (e.g. draft status). */
  footnote: ReactNode
  /** What "finish a part" is called in this subject, for the empty Today message. */
  unitName: string
  onOpenCurriculum: () => void
}

export default function CardsView({ storageKey, decks, intro, footnote, unitName, onOpenCurriculum }: Props) {
  const states = useCardStates(storageKey)
  const [session, setSession] = useState<Session | null>(null)
  const cardRef = useRef<HTMLButtonElement>(null)
  const studied = decks.flatMap(deck => deck.studied)
  const today = todaysQueue(studied, states)

  function start(title: string, queue: StudyCard[]) {
    if (!queue.length) return
    setSession({ title, queue, index: 0, flipped: false, gotIt: 0, again: 0, requeued: new Set() })
    requestAnimationFrame(() => cardRef.current?.focus())
  }

  function answer(gotIt: boolean) {
    if (!session) return
    const card = session.queue[session.index]
    // A card missed earlier in this session stays due tomorrow even if the second go is right.
    if (!(gotIt && session.requeued.has(card.id))) saveCardStates(review(readCardStates(storageKey), card.id, gotIt), storageKey)
    // "Still learning" cards come round once more at the end of this session.
    const requeue = !gotIt && !session.requeued.has(card.id)
    const queue = requeue ? [...session.queue, card] : session.queue
    const requeued = requeue ? new Set([...session.requeued, card.id]) : session.requeued
    setSession({ ...session, queue, requeued, index: session.index + 1, flipped: false, gotIt: session.gotIt + (gotIt ? 1 : 0), again: session.again + (gotIt ? 0 : 1) })
    requestAnimationFrame(() => cardRef.current?.focus())
  }

  // Keyboard: Space or Enter flips, 1 = still learning, 2 = got it.
  useEffect(() => {
    if (!session || session.index >= session.queue.length) return
    const onKey = (event: KeyboardEvent) => {
      if (/INPUT|TEXTAREA|SELECT/.test((event.target as HTMLElement).tagName)) return
      if (session.flipped && (event.key === '1' || event.key === '2')) { event.preventDefault(); answer(event.key === '2') }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // Swipe on a phone: before the answer shows, a swipe either way turns the card over; after it,
  // right is "Got it" and left is "Still learning". The card follows the finger and slides off.
  const [drag, setDrag] = useState<{ x: number; leaving?: 'left' | 'right' } | null>(null)
  const swipe = useRef<{ x: number; y: number; id: number; moved: boolean } | null>(null)
  const swiped = useRef(false)
  const SWIPE = 80
  function swipeStart(event: React.PointerEvent) {
    // A new touch is a new gesture. The click a swipe would leave behind arrives before this, and browsers often
    // skip it after a drag, so clearing here stops a leftover flag swallowing the next real tap.
    swiped.current = false
    if (event.pointerType === 'mouse' || drag?.leaving) return
    swipe.current = { x: event.clientX, y: event.clientY, id: event.pointerId, moved: false }
  }
  function swipeMove(event: React.PointerEvent) {
    const start = swipe.current
    if (!start || start.id !== event.pointerId) return
    const dx = event.clientX - start.x, dy = event.clientY - start.y
    if (!start.moved && (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy))) return
    start.moved = true
    setDrag({ x: dx })
  }
  function swipeEnd(event: React.PointerEvent) {
    const start = swipe.current
    swipe.current = null
    if (!start || !start.moved || !session) return
    swiped.current = true
    const dx = event.clientX - start.x
    if (Math.abs(dx) < SWIPE) { setDrag(null); return }
    if (!session.flipped) { setDrag(null); setSession({ ...session, flipped: true }); return }
    setDrag({ x: dx, leaving: dx > 0 ? 'right' : 'left' })
    window.setTimeout(() => { setDrag(null); answer(dx > 0) }, 180)
  }

  const card = session?.queue[session.index]
  const finished = session && !card
  const lean = drag && session?.flipped ? (drag.x > 0 ? 'right' : 'left') : null
  const dueIn = (deck: StudyDeck) => todaysQueue(deck.studied, states).length

  return <div className="rc">
    <header className="rc-head">
      <h1>Revision cards</h1>
      <p>{intro}</p>
    </header>

    <div className={`rc-layout${session ? ' is-studying' : ''}`}>
      <aside className="rc-decks" aria-label="Your decks">
        <section className="rc-today">
          <p className="rc-kicker">Today</p>
          {today.length
            ? <><p className="rc-today__count"><strong>{today.length}</strong> card{today.length === 1 ? '' : 's'} to review</p>
              <Button size="lg" block onClick={() => start('Today’s cards', today)}>Start today’s cards</Button></>
            : <p className="rc-today__none">{studied.length ? 'All done for today. Come back tomorrow, or pick any deck below.' : `Finish a ${unitName} in any lesson and its cards join Today. Or pick any deck below.`}</p>}
        </section>

        <h2 className="rc-kicker">Your decks</h2>
        <ul className="rc-deck-list">
          {decks.map(deck => {
            const due = dueIn(deck)
            return <li key={deck.key}>
              <button type="button" className={`rc-deck${session?.title === deck.title ? ' is-active' : ''}${deck.started ? '' : ' rc-deck--new'}`} onClick={() => start(deck.title, deck.queue)}>
                <span className="rc-deck__title">{deck.title}</span>
                <span className="rc-deck__meta">{deck.cards.length} cards{due ? ` · ${due} to review` : ''}{deck.started ? '' : ' · lesson not started yet'}</span>
              </button>
            </li>
          })}
        </ul>
        <p className="rc-note">{footnote}</p>
      </aside>

      <section className="rc-study" aria-label="Study">
        {!session && <div className="rc-empty">
          <p>Pick today’s cards or any deck to start.</p>
          {!studied.length && <Button variant="secondary" onClick={onOpenCurriculum}>Or start a lesson</Button>}
        </div>}

        {card && session && <>
          <div className="rc-progress">
            <div className="rc-progress__bar" aria-hidden="true"><span style={{ width: `${session.index / session.queue.length * 100}%` }} /></div>
            <span>Card {session.index + 1} of {session.queue.length}</span>
          </div>
          <button
            ref={cardRef}
            type="button"
            className={`rc-card${session.flipped ? ' is-back' : ''}${drag ? ' is-dragging' : ''}${drag?.leaving ? ` is-leaving-${drag.leaving}` : ''}`}
            style={drag && !drag.leaving ? { transform: `translateX(${drag.x}px) rotate(${drag.x / 24}deg)` } : undefined}
            aria-label={session.flipped ? `Answer: ${card.back}` : `Question: ${card.front}. Press to see the answer.`}
            onPointerDown={swipeStart}
            onPointerMove={swipeMove}
            onPointerUp={swipeEnd}
            onPointerCancel={() => { swipe.current = null; setDrag(null) }}
            onClick={() => {
              // A swipe ends with a click on the card; it has already done its job.
              if (swiped.current) { swiped.current = false; return }
              setSession({ ...session, flipped: !session.flipped })
            }}
          >
            {lean && <span className={`rc-card__stamp rc-card__stamp--${lean}`} style={{ opacity: Math.min(1, Math.abs(drag!.x) / SWIPE) }} aria-hidden="true">{lean === 'right' ? 'Got it ✓' : 'Still learning'}</span>}
            <span className="rc-card__side">{session.flipped ? 'Answer' : 'Question'}</span>
            <span className="rc-card__text" aria-live="polite">{session.flipped ? card.back : card.front}</span>
            {!session.flipped && card.frontMath && <span className="rc-card__math"><MathSpan latex={card.frontMath} display /></span>}
            {session.flipped && card.note && <span className="rc-card__note">{card.note}</span>}
          </button>
          <div className="rc-answer" aria-hidden={!session.flipped}>
            <Button variant="secondary" size="lg" disabled={!session.flipped} onClick={() => answer(false)}>Still learning</Button>
            <Button variant="good" size="lg" disabled={!session.flipped} onClick={() => answer(true)}>Got it</Button>
          </div>
          <button type="button" className="rc-end" onClick={() => setSession(null)}>End session</button>
        </>}

        {finished && session && <div className="rc-done" role="status">
          <p className="rc-kicker">Session complete</p>
          <h2>{session.gotIt} got it · {session.again} still learning</h2>
          <p>{session.again ? 'The ones you’re still learning come back tomorrow.' : 'Nice work. These come back in a few days to keep them fresh.'}</p>
          <Button size="lg" onClick={() => setSession(null)}>Back to decks</Button>
        </div>}
      </section>
    </div>
  </div>
}
