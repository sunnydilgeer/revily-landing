/*
 * How ready a student is for each checklist statement, from what they have actually done on this device.
 *
 *   Not started  nothing done in the section yet
 *   Learning     started the section
 *   Learnt       finished the section
 *   Secure       finished it with at least 80% of its questions right first time
 *                (a section with no questions of its own is secure once finished)
 *   Exam-ready   secure, AND past-paper-style questions on it answered in Practice (at least two, two
 *                thirds right first time), AND at least two thirds of its revision cards still remembered
 *                after 1- and 3-day gaps (review box 3 or higher), where the section has cards
 *
 * Exam-ready is the gold level, so it needs exam-style evidence: learning and remembering a skill is not the
 * same as answering an exam question on it. Practice is not built yet, so nobody reaches gold until it is; it
 * will record its results in PRACTICE_KEY, keyed like the checklist ("8:adding-fractions").
 *
 * The student's own red / amber / green rating is kept beside it, and a mismatch between the two is flagged.
 */
import type { LessonProgressSnapshot } from '../lessonProgress'
import type { CardStates } from '../../cards/schedule'

export type Level = 'notStarted' | 'learning' | 'learnt' | 'secure' | 'examReady'
export type SelfRating = 'red' | 'amber' | 'green'
export type SectionScore = { questions: number; firstTry: number; on: string }

export const levelLabels: Record<Level, string> = {
  notStarted: 'Not started', learning: 'Learning', learnt: 'Learnt', secure: 'Secure', examReady: 'Exam-ready',
}
export const levelOrder: Level[] = ['notStarted', 'learning', 'learnt', 'secure', 'examReady']

export const SECURE_SHARE = 0.8
export const REMEMBERED_BOX = 3
export const REMEMBERED_SHARE = 2 / 3
export const PRACTICE_MIN = 2
export const PRACTICE_SHARE = 2 / 3

/** Where Practice will save past-paper-style results, per checklist statement, and the event it sends. */
export const PRACTICE_KEY = 'revily:maths-practice:v1'
export const PRACTICE_EVENT = 'revily:maths-practice'
export type PracticeRecord = { attempted: number; firstTry: number; on: string }

export type SectionEvidence = {
  started: boolean
  finished: boolean
  score?: SectionScore
  /** Revision-card boxes for this section's cards (0 for a card never reviewed). */
  cardBoxes: number[]
  /** Past-paper-style questions answered on it in Practice. */
  practice?: PracticeRecord
}

export function levelFor(evidence: SectionEvidence): Level {
  if (!evidence.finished) return evidence.started ? 'learning' : 'notStarted'
  const { score } = evidence
  // Finished before scores were recorded: the section is learnt, but there is no accuracy evidence yet.
  const secure = score ? score.questions === 0 || score.firstTry / score.questions >= SECURE_SHARE : false
  if (!secure) return 'learnt'
  const { practice, cardBoxes: cards } = evidence
  const practised = Boolean(practice && practice.attempted >= PRACTICE_MIN && practice.firstTry / practice.attempted >= PRACTICE_SHARE)
  const remembered = cards.length === 0 || cards.filter(box => box >= REMEMBERED_BOX).length / cards.length >= REMEMBERED_SHARE
  return practised && remembered ? 'examReady' : 'secure'
}

/** A sentence when the student's own rating and the evidence disagree, else null. */
export function mismatch(rating: SelfRating | undefined, level: Level, score?: SectionScore): string | null {
  if (rating === 'green' && score && score.questions > 0 && score.firstTry / score.questions < 0.6) {
    return `You rated this green, but you got ${score.firstTry} of ${score.questions} right first time. Worth another look.`
  }
  if (rating === 'green' && (level === 'notStarted' || level === 'learning')) {
    return 'You rated this green, but you haven’t finished this section yet.'
  }
  if (rating === 'red' && (level === 'secure' || level === 'examReady')) {
    return 'You rated this red, but your results say you know it better than you think.'
  }
  return null
}

/** Evidence for one section from saved lesson progress and revision-card states. */
export function evidenceFor(
  section: { id: string; startIndex: number; done: boolean },
  snapshot: LessonProgressSnapshot | undefined,
  cardIds: string[],
  cards: CardStates,
  practice?: PracticeRecord,
): SectionEvidence {
  const started = Boolean(snapshot && (section.done || snapshot.furthestStateIndex >= section.startIndex || snapshot.currentSectionId === section.id))
  return {
    started,
    finished: section.done,
    score: snapshot?.sectionScores?.[section.id],
    cardBoxes: cardIds.map(id => cards[id]?.box ?? 0),
    practice,
  }
}

/**
 * The next GCSE May/June series: Maths Paper 1 is usually in mid-May. Until the exam boards publish the
 * timetable, count down to 14 May; after the series ends (end of June), look to the next year.
 */
export function nextExamSeries(today = new Date()) {
  const year = today > new Date(today.getFullYear(), 5, 30) ? today.getFullYear() + 1 : today.getFullYear()
  const start = new Date(year, 4, 14)
  const days = Math.max(0, Math.ceil((start.getTime() - today.getTime()) / 86400000))
  return { year, start, days, weeks: Math.round(days / 7) }
}
