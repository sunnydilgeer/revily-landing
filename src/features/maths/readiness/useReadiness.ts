'use client'

/*
 * Each "I can…" statement's level, worked out from this device's lesson progress and revision cards, plus the
 * student's own confidence ratings. Shared by the exam path and the app header's marks pill, and kept live
 * as progress, cards or another tab change.
 */
import { useEffect, useMemo, useState } from 'react'
import { buildDecks } from '../../cards/decks'
import { CARDS_EVENT, CARDS_KEY, readCardStates, type CardStates } from '../../cards/schedule'
import { mathsLessons } from '../courseRegistry'
import { MATHS_PROGRESS_EVENT, readMathsProgress, type LessonProgressMap } from '../lessonProgress'
import { rungStatus } from '../rungProgress'
import { scoreTopics } from './paperMap'
import { evidenceFor, levelFor, mismatch, type SelfRating } from './readiness'
import { canStatements } from './statements'

const RATINGS_KEY = 'revily:maths-self-rating:v1'

function readRatings(): Record<string, SelfRating> {
  try { return JSON.parse(window.localStorage.getItem(RATINGS_KEY) ?? '{}') ?? {} } catch { return {} }
}

export function useReadiness() {
  const [progress, setProgress] = useState<LessonProgressMap>({})
  const [cards, setCards] = useState<CardStates>({})
  const [ratings, setRatings] = useState<Record<string, SelfRating>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const refresh = () => { setProgress(readMathsProgress()); setCards(readCardStates(CARDS_KEY)); setRatings(readRatings()); setLoaded(true) }
    refresh()
    for (const event of [MATHS_PROGRESS_EVENT, CARDS_EVENT, 'storage']) window.addEventListener(event, refresh)
    return () => { for (const event of [MATHS_PROGRESS_EVENT, CARDS_EVENT, 'storage']) window.removeEventListener(event, refresh) }
  }, [])

  function rate(key: string, rating: SelfRating) {
    const next = { ...ratings }
    if (next[key] === rating) delete next[key]; else next[key] = rating
    setRatings(next)
    try { window.localStorage.setItem(RATINGS_KEY, JSON.stringify(next)) } catch { /* storage blocked: this visit only */ }
  }

  const cardIds = useMemo(() => {
    const ids = new Map<string, string[]>()
    for (const deck of buildDecks(mathsLessons)) for (const card of deck.cards) {
      const key = `${card.lesson}:${card.rung}`
      ids.set(key, [...(ids.get(key) ?? []), card.id])
    }
    return ids
  }, [])

  const lessons = useMemo(() => mathsLessons.map(entry => {
    const snapshot = progress[entry.lessonId]
    const status = rungStatus(entry.sections, entry.stateCount, snapshot)
    const rows = status.flatMap(section => {
      const key = `${entry.number}:${section.id}`, statement = canStatements[key]
      if (!statement) return []
      const evidence = evidenceFor(section, snapshot, cardIds.get(key) ?? [], cards)
      const level = levelFor(evidence)
      const href = `/preview?lesson=${entry.number}&section=${encodeURIComponent(section.id)}`
      return [{ key, statement, level, href, note: mismatch(ratings[key], level, evidence.score) }]
    })
    return { entry, rows }
  }), [progress, cards, ratings, cardIds])
  const rows = useMemo(() => lessons.flatMap(lesson => lesson.rows), [lessons])

  return { lessons, rows, ratings, rate, loaded }
}

/** Marks of the 80-mark paper the student is ready for, for the marks pill. */
export function usePathMarks() {
  const { rows, loaded } = useReadiness()
  const ready = useMemo(() => scoreTopics(Object.fromEntries(rows.map(row => [row.key, row.level]))).reduce((sum, score) => sum + score.ready, 0), [rows])
  return { ready, loaded }
}
