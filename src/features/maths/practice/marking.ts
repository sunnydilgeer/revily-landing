/*
 * Marking typed answers on a phone: numbers (with £, commas, spaces and units ignored), fractions and mixed
 * numbers ("3/4", "2 3/4"), and the form the question asks for (simplest form, a mixed number, 2 d.p.).
 */
import type { FractionPart, NumberPart, Part } from './types'

const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b)

/** A typed number, or null when it isn't one. Ignores £, %, commas and spaces; accepts the − sign. */
export function readNumber(typed: string) {
  // "x = 6" is fine: whatever comes before an = sign is the letter the box is for.
  const cleaned = typed.replace(/[£%,\s]/g, '').replace(/^[^=]*=/, '').replace(/[−–]/g, '-')
  return /^-?\d*\.?\d+$/.test(cleaned) ? Number(cleaned) : null
}

/** Decimal places as typed: "6.00" has 2. */
export function typedPlaces(typed: string) {
  const cleaned = typed.replace(/[£%,\s]/g, '')
  const point = cleaned.indexOf('.')
  return point < 0 ? 0 : cleaned.length - point - 1
}

export type TypedFraction = { whole: number; numerator: number; denominator: number; mixed: boolean }

/** "3/4", "2 3/4", "-1/2" or a whole number. Null when it isn't a fraction. */
export function readFraction(typed: string): TypedFraction | null {
  const cleaned = typed.trim().replace(/[−–]/g, '-').replace(/\s+/g, ' ')
  const mixed = cleaned.match(/^(-?\d+) (\d+)\s?\/\s?(\d+)$/)
  if (mixed) {
    const [, whole, numerator, denominator] = mixed.map(Number)
    return denominator ? { whole, numerator, denominator, mixed: true } : null
  }
  const plain = cleaned.match(/^(-?\d+)\s?\/\s?(\d+)$/)
  if (plain) {
    const [, numerator, denominator] = plain.map(Number)
    return denominator ? { whole: 0, numerator, denominator, mixed: false } : null
  }
  return /^-?\d+$/.test(cleaned) ? { whole: Number(cleaned), numerator: 0, denominator: 1, mixed: false } : null
}

/** A typed fraction as an improper fraction. */
function improper({ whole, numerator, denominator }: TypedFraction): [number, number] {
  const sign = whole < 0 ? -1 : 1
  return [whole * denominator + sign * numerator, denominator]
}

/** Whether the box holds something the part can mark (so the Check button can wake up). */
export function canMark(part: Part, typed: string) {
  if (part.kind === 'number') return readNumber(typed) !== null
  if (part.kind === 'fraction') return readFraction(typed) !== null
  return typed !== ''
}

export type Verdict = { right: boolean; note?: string }

export function markNumber(part: Pick<NumberPart, 'answer' | 'dp' | 'prefix'>, typed: string): Verdict {
  const value = readNumber(typed)
  if (value === null || Math.abs(value - part.answer) > 1e-9) return { right: false }
  if (part.dp !== undefined && typedPlaces(typed) !== part.dp) {
    return { right: false, note: `Right value, but the question wants ${part.dp} decimal place${part.dp === 1 ? '' : 's'}, like ${part.answer.toFixed(part.dp)}.` }
  }
  // AQA marks money as wrong without its pence: £4.2 loses the mark, £4.20 gets it.
  if (part.prefix === '£' && !Number.isInteger(part.answer) && typedPlaces(typed) !== 2) {
    return { right: false, note: `Right amount, but money needs 2 decimal places: £${part.answer.toFixed(2)}, not £${typed.replace(/[£\s]/g, '')}. The exam takes the mark off for this.` }
  }
  return { right: true }
}

export function markFraction(part: Pick<FractionPart, 'answer' | 'form'>, typed: string): Verdict {
  const read = readFraction(typed)
  if (!read) return { right: false }
  const [n, d] = improper(read), [an, ad] = part.answer
  if (n * ad !== an * d) return { right: false }
  if (part.form === 'mixed') {
    if (!read.mixed && Math.abs(n) > d) return { right: false, note: 'Right value. Now write it as a mixed number, like 2 3/4.' }
    if (gcd(read.numerator, read.denominator) !== 1) return { right: false, note: 'Right value, but simplify the fraction part fully.' }
  }
  if (part.form === 'simplest' && gcd(read.mixed ? read.numerator : n, read.denominator) !== 1) {
    return { right: false, note: 'Right value, but the question says simplest form. Can you divide top and bottom again?' }
  }
  return { right: true }
}

/** The feedback for a known slip, when the typed answer is one the mark scheme singles out. */
export function mistakeFor(part: Part, typed: string) {
  if (part.kind === 'number') {
    const value = readNumber(typed)
    return value === null ? undefined : part.mistakes?.find(m => typeof m.answer === 'number' && Math.abs(m.answer - value) < 1e-9)?.note
  }
  if (part.kind === 'fraction') {
    const read = readFraction(typed)
    if (!read) return undefined
    const [n, d] = improper(read)
    return part.mistakes?.find(m => Array.isArray(m.answer) ? m.answer[0] * d === n * m.answer[1] : m.answer * d === n)?.note
  }
  return undefined
}

/** Marks a typed or chosen answer. Choice and spot answers are the option or line index as a string. */
export function mark(part: Part, typed: string): Verdict {
  switch (part.kind) {
    case 'number': return markNumber(part, typed)
    case 'fraction': return markFraction(part, typed)
    case 'choice': return { right: Number(typed) === part.correct }
    case 'spot': return { right: Number(typed) === part.wrong }
  }
}

/** The answer as it would be written on the mark scheme. */
export function answerText(part: Part) {
  switch (part.kind) {
    case 'number': {
      const value = part.dp !== undefined ? part.answer.toFixed(part.dp) : String(part.answer)
      return `${part.prefix ?? ''}${part.prefix === '£' && !Number.isInteger(part.answer) ? part.answer.toFixed(2) : value}${part.suffix ?? ''}`
    }
    case 'fraction': {
      const [n, d] = part.answer
      if (d === 1) return String(n)
      if (part.form === 'mixed' && Math.abs(n) > d) return `${Math.trunc(n / d)} ${Math.abs(n) % d}/${d}`
      return `${n}/${d}`
    }
    case 'choice': return part.options[part.correct]
    case 'spot': return `Line ${part.wrong + 1}`
  }
}
