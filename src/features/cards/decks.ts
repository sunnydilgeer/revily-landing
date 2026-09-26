/*
 * Revision decks: one per lesson. Each rung contributes its key-fact cards (keyFacts.ts) and up to
 * three quick-recall cards taken from the rung's own short-answer questions. A rung's cards unlock
 * once the student has finished that rung.
 */
import type { MathsLessonEntry } from '../maths/courseRegistry'
import type { InteractionDefinition, LearningState } from '../number-types/types'
import { KEY_FACTS } from './keyFacts'

export type RevisionCard = {
  id: string
  lesson: number
  rung: string
  rungTitle: string
  kind: 'fact' | 'recall'
  front: string
  /** The sum itself, as LaTeX, when the question's text doesn't include it (Lesson 2 expressions). */
  frontMath?: string
  back: string
  note?: string
}

export type Deck = { lesson: number; title: string; cards: RevisionCard[] }

const RECALL_PER_RUNG = 3

/** Questions that only make sense next to their lesson screen are left out. */
const NEEDS_CONTEXT = /your (column )?working|part \(?[a-z]\)?(?![a-z])|your answer to|you just wrote|the (result|total) is|to check the answer|above|below|this amount|the baker|in 15\.75 ÷ 2\.5, the divisor|for 6\.25 × 1\.6|write down a|possible/i

function answerFor(interaction: InteractionDefinition): string | null {
  if (interaction.type !== 'numericInput' && interaction.type !== 'fractionInput') return null
  if (interaction.displayAnswer) return String(interaction.displayAnswer)
  const answer = interaction.correctAnswer
  return typeof answer === 'number' || typeof answer === 'string' ? String(answer) : null
}

function firstStep(state: LearningState): string | undefined {
  const explanation = state.feedback?.incorrect?.workedExplanation
  const step = explanation?.steps?.[0]
  if (step) return [step.title, ...(step.lines ?? [])].filter(Boolean).join(' ')
  return (state as LearningState & { hint?: string }).hint
}

function recallCards(entry: MathsLessonEntry, rung: string, rungTitle: string): RevisionCard[] {
  const cards: RevisionCard[] = []
  for (const state of entry.definition.states) {
    if (cards.length >= RECALL_PER_RUNG) break
    if (state.microSkillId !== rung) continue
    const title = state.content.title?.trim()
    const answer = answerFor(state.interaction)
    if (!title || !answer || answer.length > 14 || title.length > 110 || NEEDS_CONTEXT.test(title) || /any value/i.test(answer)) continue
    const unit = (state as LearningState & { answerLabel?: string }).answerLabel?.match(/\((.+)\)/)?.[1]
    const back = unit === '£' ? `£${answer}` : unit === '%' ? `${answer}%` : answer
    const visual = (state as LearningState & { visual?: { kind?: string; math?: string } }).visual
    const frontMath = visual?.kind === 'expression' && visual.math && !/\d/.test(title) ? visual.math : undefined
    cards.push({ id: `q-${state.id}`, lesson: entry.number, rung, rungTitle, kind: 'recall', front: title, frontMath, back, note: firstStep(state) })
  }
  return cards
}

export function buildDecks(lessons: MathsLessonEntry[]): Deck[] {
  return lessons.map(entry => ({
    lesson: entry.number,
    title: entry.title,
    cards: entry.sections.flatMap(section => [
      ...(KEY_FACTS[entry.number]?.[section.id] ?? []).map(([front, back], i): RevisionCard => ({
        id: `k-${entry.number}-${section.id}-${i + 1}`, lesson: entry.number, rung: section.id, rungTitle: section.title, kind: 'fact', front, back,
      })),
      ...recallCards(entry, section.id, section.title),
    ]),
  }))
}
