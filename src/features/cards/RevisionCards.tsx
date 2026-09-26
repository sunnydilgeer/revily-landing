'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { MathSpan } from '../../../components/MathText'
import { Button } from '../../ui'
import { mathsLessons } from '../maths/courseRegistry'
import type { LessonProgressMap } from '../maths/lessonProgress'
import { rungsFor } from '../maths/Curriculum'
import { buildDecks, type RevisionCard } from './decks'
import { CARDS_EVENT, deckQueue, readCardStates, review, saveCardStates, todaysQueue, type CardStates } from './schedule'
import './RevisionCards.css'

const DECKS = buildDecks(mathsLessons)

type Session = { title: string; queue: RevisionCard[]; index: number; flipped: boolean; gotIt: number; again: number; requeued: Set<string> }

function useCardStates() {
  const [states, setStates] = useState<CardStates>({})
  useEffect(() => {
    const refresh = () => setStates(readCardStates())
    refresh()
    window.addEventListener(CARDS_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => { window.removeEventListener(CARDS_EVENT, refresh); window.removeEventListener('storage', refresh) }
  }, [])
  return states
}

export default function RevisionCards({ progress, onOpenCurriculum }: { progress: LessonProgressMap; onOpenCurriculum: () => void }) {
  const states = useCardStates()
  const [session, setSession] = useState<Session | null>(null)
  const cardRef = useRef<HTMLButtonElement>(null)

  // Every deck is open. Today's cards start with what the student has studied (finished rungs)
  // plus anything they've reviewed before; any deck can be studied at any time.
  const decks = useMemo(() => DECKS.map(deck => {
    const entry = mathsLessons.find(lesson => lesson.number === deck.lesson)!
    const finished = new Set<string>(rungsFor(entry, progress[entry.lessonId]).filter(rung => rung.done).map(rung => rung.id))
    const studied = deck.cards.filter(card => finished.has(card.rung) || states[card.id])
    return { ...deck, started: Boolean(progress[entry.lessonId]), studied, due: todaysQueue(studied, states).length }
  }).sort((a, b) => Number(b.started) - Number(a.started) || a.lesson - b.lesson), [progress, states])
  const studied = decks.flatMap(deck => deck.studied)
  const today = todaysQueue(studied, states)

  function start(title: string, queue: RevisionCard[]) {
    if (!queue.length) return
    setSession({ title, queue, index: 0, flipped: false, gotIt: 0, again: 0, requeued: new Set() })
    requestAnimationFrame(() => cardRef.current?.focus())
  }

  function answer(gotIt: boolean) {
    if (!session) return
    const card = session.queue[session.index]
    // A card missed earlier in this session stays due tomorrow even if the second go is right.
    if (!(gotIt && session.requeued.has(card.id))) saveCardStates(review(readCardStates(), card.id, gotIt))
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

  const card = session?.queue[session.index]
  const finished = session && !card

  return <div className="rc">
    <header className="rc-head">
      <h1>Revision cards</h1>
      <p>Pick any deck. Today’s cards start with what you’ve studied, and the ones you find hard come back sooner.</p>
    </header>

    <div className={`rc-layout${session ? ' is-studying' : ''}`}>
      <aside className="rc-decks" aria-label="Your decks">
        <section className="rc-today">
          <p className="rc-kicker">Today</p>
          {today.length
            ? <><p className="rc-today__count"><strong>{today.length}</strong> card{today.length === 1 ? '' : 's'} to review</p>
              <Button size="lg" block onClick={() => start('Today’s cards', today)}>Start today’s cards</Button></>
            : <p className="rc-today__none">{studied.length ? 'All done for today. Come back tomorrow, or pick any deck below.' : 'Finish a rung in any lesson and its cards join Today. Or pick any deck below.'}</p>}
        </section>

        <h2 className="rc-kicker">Your decks</h2>
        <ul className="rc-deck-list">
          {decks.map(deck => <li key={deck.lesson}>
            <button type="button" className={`rc-deck${session?.title === deck.title ? ' is-active' : ''}${deck.started ? '' : ' rc-deck--new'}`} onClick={() => start(deck.title, deckQueue(deck.cards, states))}>
              <span className="rc-deck__title">{deck.title}</span>
              <span className="rc-deck__meta">{deck.cards.length} cards{deck.due ? ` · ${deck.due} to review` : ''}{deck.started ? '' : ' · lesson not started yet'}</span>
            </button>
          </li>)}
        </ul>
        <p className="rc-note">Key-fact cards are a draft, waiting for a maths teacher to check them.</p>
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
            className={`rc-card${session.flipped ? ' is-back' : ''}`}
            aria-label={session.flipped ? `Answer: ${card.back}` : `Question: ${card.front}. Press to see the answer.`}
            onClick={() => setSession({ ...session, flipped: !session.flipped })}
          >
            <span className="rc-card__side">{session.flipped ? 'Answer' : `${card.rungTitle} · ${card.kind === 'fact' ? 'Key fact' : 'Quick question'}`}</span>
            <span className="rc-card__text" aria-live="polite">{session.flipped ? card.back : card.front}</span>
            {!session.flipped && card.frontMath && <span className="rc-card__math"><MathSpan latex={card.frontMath} display /></span>}
            {session.flipped && card.note && <span className="rc-card__note">{card.note}</span>}
            <span className="rc-card__hint">{session.flipped ? 'How did you do?' : 'Think of the answer, then tap the card'}</span>
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
