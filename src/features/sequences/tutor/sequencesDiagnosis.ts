import { sameCollectedExpression } from '../../number-types/lessonMath'
import { fmt } from '../../equations/tutor/equationsDiagnosis'

/*
 * Sequences: one plain sentence on why an answer is wrong, matched against the usual slips. Fixed rules, no AI.
 * Returns null when nothing fits, so the lesson falls back to the hint.
 */

/** "4n + 1", "4n − 1", "−8n + 98": an nth term an + b as written. */
export const linear = (a: number, b: number, letter = 'n') => `${a === 1 ? '' : a === -1 ? '−' : fmt(a)}${letter}${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b)}` : ''}`

/** Why a typed nth term for a sequence starting `first` and going up by `gap` is wrong. */
export function diagnoseNthTerm(response: string, gap: number, first: number): string | null {
  const b = first - gap, right = linear(gap, b)
  const typed = response.replace(/[−–]/g, '-').trim()
  if (!typed || sameCollectedExpression(typed, right.replace(/−/g, '-'))) return null
  const is = (candidate: string) => sameCollectedExpression(typed, candidate.replace(/−/g, '-'))
  if (/^[+-]?\s*\d+(\.\d+)?$/.test(typed)) return `That’s the term-to-term rule: how to get from one term to the next. The nth term has n in it, so it works for any position.`
  if (!/n/i.test(typed)) return 'The nth term has n in it: the gap times n, then add or take away to match.'
  if (is(linear(first, gap))) return `The gap goes in front of n, not the first term. The terms go up by ${fmt(gap)}, so start with ${linear(gap, 0)}.`
  if (is(linear(gap, first))) return `${linear(gap, 0)} gives ${fmt(gap)} for the first term, not 0. Compare ${linear(gap, 0)} with the sequence: what turns ${fmt(gap)} into ${fmt(first)}?`
  if (is(linear(gap, -b))) return `Check the sign: ${linear(gap, 0)} gives ${fmt(gap)}, and the first term is ${fmt(first)}, so you ${b > 0 ? 'add' : 'take away'} ${fmt(Math.abs(b))}.`
  if (is(linear(gap, 0))) return `${linear(gap, 0)} gives ${fmt(gap)}, ${fmt(2 * gap)}, ${fmt(3 * gap)}… Compare it with the sequence: how much do you ${b > 0 ? 'add' : 'take away'}?`
  if (is(linear(-gap, b))) return `The terms go ${gap > 0 ? 'up' : 'down'}, so the number in front of n is ${fmt(gap)}.`
  return null
}

/** The numbers typed in a list of boxes, "48, 96" → [48, 96]. */
export const readList = (response: string) => response.replace(/[−–]/g, '-').split(',').map(part => Number(part.trim())).filter(Number.isFinite)

/** A list answer: the first slip whose numbers match, in order. */
export function diagnoseList(response: string, right: number[], slips: [number[], string][]): string | null {
  const values = readList(response)
  const same = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 1e-9)
  if (!values.length || same(values, right)) return null
  if (values.length < right.length) return `There ${right.length === 2 ? 'are two numbers' : `are ${right.length} numbers`} to find. Fill in every box.`
  if (same([...values].reverse(), right)) return 'Right numbers, wrong order: write them in the order they come.'
  return slips.find(([wrong]) => same(values, wrong))?.[1] ?? null
}
