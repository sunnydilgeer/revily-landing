'use client'

import { useMemo } from 'react'
import { mathsLessons } from '../maths/courseRegistry'
import type { LessonProgressMap } from '../maths/lessonProgress'
import { rungsFor } from '../maths/Curriculum'
import CardsView, { useCardStates, type StudyCard, type StudyDeck } from './CardsView'
import { buildDecks, type RevisionCard } from './decks'
import { CARDS_KEY, deckQueue } from './schedule'

const DECKS = buildDecks(mathsLessons)

const toStudyCard = (card: RevisionCard): StudyCard => ({
  id: card.id, front: card.front, back: card.back, note: card.note, frontMath: card.frontMath,
  label: `${card.rungTitle} · ${card.kind === 'fact' ? 'Key fact' : 'Quick question'}`,
})

/** Maths revision cards. Science has its own decks and schedule (features/science/cards). */
export default function RevisionCards({ progress, onOpenCurriculum }: { progress: LessonProgressMap; onOpenCurriculum: () => void }) {
  const states = useCardStates(CARDS_KEY)

  // Every deck is open. Today's cards start with what the student has studied (finished rungs)
  // plus anything they've reviewed before; any deck can be studied at any time.
  const decks = useMemo((): StudyDeck[] => DECKS.map(deck => {
    const entry = mathsLessons.find(lesson => lesson.number === deck.lesson)!
    const finished = new Set<string>(rungsFor(entry, progress[entry.lessonId]).filter(rung => rung.done).map(rung => rung.id))
    const cards = deck.cards.map(toStudyCard)
    const studied = deck.cards.filter(card => finished.has(card.rung) || states[card.id]).map(toStudyCard)
    return { key: String(deck.lesson), title: deck.title, cards, started: Boolean(progress[entry.lessonId]), studied, queue: deckQueue(cards, states) }
  }).sort((a, b) => Number(b.started) - Number(a.started) || Number(a.key) - Number(b.key)), [progress, states])

  return <CardsView
    storageKey={CARDS_KEY}
    decks={decks}
    intro="Pick any deck. Today’s cards start with what you’ve studied, and the ones you find hard come back sooner."
    footnote="Key-fact cards are a draft, waiting for a maths teacher to check them."
    unitName="rung"
    onOpenCurriculum={onOpenCurriculum}
  />
}
