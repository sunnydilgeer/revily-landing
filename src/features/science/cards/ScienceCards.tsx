'use client'

import { useEffect, useMemo, useState } from 'react'
import CardsView, { useCardStates, type StudyCard, type StudyDeck } from '../../cards/CardsView'
import { deckQueue, SCIENCE_CARDS_KEY } from '../../cards/schedule'
import { readScienceProgress, type ScienceProgressMap } from '../scienceProgress'
import { buildScienceDecks, type ScienceCard } from './decks'

const DECKS = buildScienceDecks()

const toStudyCard = (card: ScienceCard): StudyCard => ({
  id: card.id, front: card.front, back: card.back, note: card.note,
  label: `${card.sectionTitle} · ${card.kind === 'fact' ? 'Key fact' : 'Quick question'}`,
})

/** Science revision cards: their own decks and their own schedule, never mixed with Maths. */
export default function ScienceCards({ onOpenCurriculum }: { onOpenCurriculum: () => void }) {
  const states = useCardStates(SCIENCE_CARDS_KEY)
  const [progress, setProgress] = useState<ScienceProgressMap>({})
  useEffect(() => setProgress(readScienceProgress()), [])

  // Every deck is open. Today's cards come from finished sections plus anything reviewed before.
  const decks = useMemo((): StudyDeck[] => DECKS.map(deck => {
    const status = progress[deck.lessonId]
    const finished = new Set(status?.sections.filter(section => section.done).map(section => section.id) ?? [])
    const cards = deck.cards.map(toStudyCard)
    const studied = deck.cards.filter(card => finished.has(card.section) || states[card.id]).map(toStudyCard)
    return { key: deck.lessonId, title: deck.title, cards, started: Boolean(status?.started), studied, queue: deckQueue(cards, states) }
  }).sort((a, b) => Number(b.started) - Number(a.started)), [progress, states])

  return <CardsView
    storageKey={SCIENCE_CARDS_KEY}
    decks={decks}
    intro={`Pick any of the ${DECKS.length} Science decks. Today’s cards start with what you’ve studied, and the ones you find hard come back sooner.`}
    footnote="Science cards are a draft, waiting for a qualified science teacher to check them. “Got it” is your own check, not a mark."
    unitName="section"
    onOpenCurriculum={onOpenCurriculum}
  />
}
