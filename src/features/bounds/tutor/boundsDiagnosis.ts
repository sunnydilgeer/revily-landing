/*
 * Explains why a bound or a truncated number is wrong, in one plain sentence. Fixed rules, no AI.
 * Returns null when it does not recognise the mistake, so the lesson falls back to the hint.
 */

const toNumber = (text: string) => {
  const clean = text.trim().replace(/[£,\s]/g, '').replace(/(cm|ml|kg|m|s|seconds)$/i, '')
  return /^-?\d*\.?\d+$/.test(clean) ? Number(clean) : null
}
const near = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))
const tidy = (n: number) => Number(n.toPrecision(12))
const show = (n: number) => String(tidy(n))

export type BoundCheck = {
  /** The value as it was given, e.g. 8.4 */
  value: number
  /** The rounding unit, e.g. 0.1 for 1 decimal place, 10 for "nearest 10". */
  unit: number
  /** What the question asks for. */
  side: 'lower' | 'upper' | 'half'
  /** The value was truncated, not rounded. */
  truncated?: boolean
}

export function expectedBound({ value, unit, side, truncated }: BoundCheck) {
  if (side === 'half') return tidy(unit / 2)
  if (truncated) return tidy(side === 'lower' ? value : value + unit)
  return tidy(side === 'lower' ? value - unit / 2 : value + unit / 2)
}

export function diagnoseBound(response: string, check: BoundCheck): string | null {
  const answer = toNumber(response)
  if (answer === null) return null
  const { value, unit, side, truncated } = check
  const expected = expectedBound(check), half = tidy(unit / 2)
  if (near(answer, expected)) return null

  if (side === 'half') {
    if (near(answer, unit)) return `That’s the whole unit. Halve it: the real value can be up to ${show(half)} either side.`
    return null
  }
  const lower = side === 'lower'
  if (truncated) {
    if (lower && near(answer, value - half)) return 'Truncating never rounds up, so the real value can’t be below the truncated value. The lower bound is the value itself.'
    if (!lower && near(answer, value + half)) return `Half a unit either side is for rounding. A truncated value can be anything up to the next ${show(unit)}: ${show(value)} + ${show(unit)} = ${show(expected)}.`
    if (!lower && near(answer, value)) return `${show(value)} is the lower bound. The real value could be bigger, up to ${show(expected)}.`
    return null
  }
  if (near(answer, lower ? value - unit : value + unit)) return `You used the whole unit. Go half a unit ${lower ? 'down' : 'up'}: ${show(value)} ${lower ? '−' : '+'} ${show(half)} = ${show(expected)}.`
  if (near(answer, lower ? value + half : value - half)) return `That’s the ${lower ? 'upper' : 'lower'} bound. The ${lower ? 'lower' : 'upper'} bound is ${lower ? 'below' : 'above'} ${show(value)}.`
  if (near(answer, value)) return `That’s the rounded value itself. Go half a unit ${lower ? 'down' : 'up'} from it.`
  return null
}

export type CutCheck = {
  original: number
  places: number
  mode: 'truncate' | 'round'
}

export function diagnoseCut(response: string, { original, places, mode }: CutCheck): string | null {
  const answer = toNumber(response)
  if (answer === null) return null
  const scale = 10 ** places
  const truncated = tidy(Math.trunc(tidy(original * scale)) / scale)
  const rounded = tidy(Math.round(tidy(original * scale)) / scale)
  const expected = mode === 'truncate' ? truncated : rounded
  if (near(answer, expected)) return null
  const next = Math.floor(tidy(original * scale * 10)) % 10
  if (mode === 'truncate' && near(answer, rounded)) return `That’s rounding. Truncating just chops off everything after the cut-off, so the ${next} is thrown away.`
  if (mode === 'round' && near(answer, truncated)) return `That’s truncating. Rounding uses the next digit: ${next} is 5 or more, so round up.`
  for (const other of [places - 1, places + 1]) {
    if (other >= 0 && near(answer, tidy(Math.trunc(tidy(original * 10 ** other)) / 10 ** other))) return `Keep exactly ${places} decimal place${places === 1 ? '' : 's'}.`
  }
  return null
}
