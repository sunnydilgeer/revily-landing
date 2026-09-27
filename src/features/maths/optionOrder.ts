import type { LearningState, LessonDefinition, NumberOption } from '../number-types/types'

/**
 * The order a question's answer options are shown in.
 *
 * Lessons were authored with the correct option first, so without this a student can learn to
 * tap the top answer. Options are shown:
 * - smallest to largest when every option is a number (3/4, √16, 0·5, −18 °C, £25);
 * - as written when they are a series (Shop A, Shop B; Monday, Tuesday) or a short pair (Integer / Non-integer);
 * - otherwise shuffled, the same way every time for a given question, so nothing jumps about on a revisit.
 *   Across a lesson the correct answer is spread evenly over the positions (first, second, third…),
 *   so there is no position a student can learn to guess, and no streak of "it's the top one again".
 * Grading uses option ids, never positions, so the order is purely presentational.
 */

const UNIT = /\s*(°C|mm|cm|km|ml|kg|m|s|L|g)$/

/** The value of a label that is just a number: 3/4, √16, 0·5, −18 °C, £25, 68%, π. */
export function numberValue(label: string): number | null {
  const text = label.trim().replace(/·/g, '.').replace(/−/g, '-').replace(UNIT, '').replace(/[£%\s]/g, '')
  if (text === 'π') return Math.PI
  const match = /^(-?)(√?)(\d+(?:\.\d+)?)(?:\/(\d+(?:\.\d+)?))?$/.exec(text)
  if (!match) return null
  const [, minus, root, whole, over] = match
  const value = (root ? Math.sqrt(Number(whole)) : Number(whole)) / (over ? Number(over) : 1)
  return minus ? -value : value
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/** Labels that only differ by a final letter or number (Shop A, Shop B), or days of the week. */
function isSeries(labels: string[]) {
  if (labels.every(label => WEEKDAYS.includes(label))) return true
  const stems = labels.map(label => /^(.*\S)\s+[A-Z0-9]$/.exec(label)?.[1])
  return stems.every(stem => stem && stem === stems[0])
}

/** Short labels that each start with a different number: "0 friends", "1 friend (Zara)". */
function leadingNumbers(labels: string[]) {
  if (!labels.every(label => label.length <= 20)) return null
  const leads = labels.map(label => numberValue(/^[−-]?[\d.·]+/.exec(label)?.[0] ?? ''))
  if (leads.some(lead => lead === null) || new Set(leads).size !== leads.length) return null
  return leads as number[]
}

function seededRandom(seed: string) {
  let hash = 2166136261
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  return () => {
    hash = (hash + 0x6d2b79f5) | 0
    let t = Math.imul(hash ^ (hash >>> 15), 1 | hash)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Options whose order is fixed by what they say, or null when they should be shuffled. */
function naturalOrder(options: NumberOption[]): NumberOption[] | null {
  const labels = options.map(option => option.label)
  const values = labels.map(numberValue)
  if (values.every(value => value !== null)) return sortBy(options, values as number[])
  const leads = leadingNumbers(labels)
  if (leads) return sortBy(options, leads)
  if (isSeries(labels) || (options.length === 2 && labels.every(label => label.length <= 12))) return options
  return null
}

function shuffle<T>(items: T[], random: () => number) {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/** Every state in the lesson as the student sees it, with its options in presentation order. */
function presentLesson(lesson: LessonDefinition) {
  const random = seededRandom(lesson.id)
  const used: number[] = []
  const result = new Map<string, LearningState>()
  for (const state of lesson.states) {
    const { type, options, correctAnswer } = state.interaction
    // Ordering questions arrange the options themselves, so only choice questions are reordered.
    if ((type !== 'select' && type !== 'multiSelect') || !options || options.length < 2) continue
    let ordered = naturalOrder(options)
    if (!ordered) {
      const correct = typeof correctAnswer === 'string' ? options.find(option => option.id === correctAnswer) : undefined
      if (correct) {
        // Put the correct answer in the least-used position so far, picking at random between ties.
        const counts = options.map((_, position) => used[position] ?? 0)
        const fewest = counts.flatMap((count, position) => count === Math.min(...counts) ? [position] : [])
        const target = fewest[Math.floor(random() * fewest.length)]
        used[target] = (used[target] ?? 0) + 1
        ordered = shuffle(options.filter(option => option !== correct), random)
        ordered.splice(target, 0, correct)
      } else ordered = shuffle(options, random)
    }
    result.set(state.id, { ...state, interaction: { ...state.interaction, options: ordered } })
  }
  return result
}

function sortBy(options: NumberOption[], keys: number[]) {
  return options.map((option, i) => ({ option, key: keys[i] })).sort((a, b) => a.key - b.key).map(({ option }) => option)
}

const presented = new WeakMap<LessonDefinition, Map<string, LearningState>>()

/** The state as the student sees it: same object every time, with its options in presentation order. */
export function withOrderedOptions<State extends LearningState>(lesson: LessonDefinition, state: State): State {
  let states = presented.get(lesson)
  if (!states) {
    states = presentLesson(lesson)
    presented.set(lesson, states)
  }
  return (states.get(state.id) ?? state) as State
}
