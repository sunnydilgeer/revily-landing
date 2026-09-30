/*
 * Science revision decks: one per lesson, in course order. Each section contributes its authored key
 * facts (facts/<folder>.ts; Chemistry facts/chemistry/<folder>.ts, Physics facts/physics/<folder>.ts, Working Scientifically facts/skills/<folder>.ts), and each lesson adds a few of its own questions that work as flashcards.
 * A section's cards join Today's cards once the student has finished that section.
 */
import { allScienceLessons, type ScienceSubject } from '../lessonNavigation'
import type { ChoiceState } from '../types'
import { scienceFacts } from './facts'

export type ScienceCard = {
  id: string
  lessonId: string
  /** The section's start-state id. */
  section: string
  sectionTitle: string
  kind: 'fact' | 'recall'
  front: string
  back: string
  note?: string
}

/** `number` is the lesson's number within its subject; key on `lessonId`. */
export type ScienceDeck = { lessonId: string; subject: ScienceSubject; number: number; title: string; cards: ScienceCard[] }

export function buildScienceDecks(): ScienceDeck[] {
  return allScienceLessons.map(entry => {
    const set = scienceFacts[entry.lesson.id]
    const states = entry.lesson.states
    const sectionOf = (stateId: string) => {
      const index = states.findIndex(state => state.id === stateId)
      return [...entry.sections].reverse().find(section => states.findIndex(state => state.id === section.id) <= index)!
    }
    const facts = entry.sections.flatMap(section => (set?.sections[section.id] ?? []).map(([front, back, note], i): ScienceCard => ({
      id: `sk-${entry.lesson.id}-${section.id}-${i + 1}`, lessonId: entry.lesson.id, section: section.id, sectionTitle: section.label, kind: 'fact', front, back, note,
    })))
    const recall = (set?.recall ?? []).map((id): ScienceCard => {
      const state = states.find(item => item.id === id) as ChoiceState
      const section = sectionOf(id)
      return { id: `sq-${id}`, lessonId: entry.lesson.id, section: section.id, sectionTitle: section.label, kind: 'recall', front: state.title, back: state.explanation.answer, note: set?.recallNotes?.[id] ?? state.explanation.steps.join(' ') }
    })
    return { lessonId: entry.lesson.id, subject: entry.subject, number: entry.number, title: entry.title, cards: [...facts, ...recall] }
  })
}
