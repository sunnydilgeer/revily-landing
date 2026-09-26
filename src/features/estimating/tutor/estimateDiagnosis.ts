/*
 * Explains why an estimate is wrong, in one plain sentence. Fixed rules, no AI.
 * Returns null when it does not recognise the mistake, so the lesson falls back to the hint.
 */

const toNumber = (text: string) => {
  const clean = text.trim()
    .replace(/^[≈~]\s*/, '')
    .replace(/[£,\s]/g, '')
    .replace(/(cm³|cm3|cm|km\/h|kg\/m³|kg\/m3|litres?|kg|m)$/i, '')
  return /^-?\d*\.?\d+$/.test(clean) ? Number(clean) : null
}
const near = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))

/** Rounds to 1 significant figure, e.g. 20.2176 → 20 and 0.00398 → 0.004. */
export function roundTo1sf(value: number) {
  if (value === 0) return 0
  const place = 10 ** Math.floor(Math.log10(Math.abs(value)))
  return Number((Math.round(value / place) * place).toPrecision(12))
}

export type EstimateCheck = {
  /** The answer from rounding every number to 1 significant figure first. */
  estimate: number
  /** The exact answer, used to spot students who skipped the rounding. */
  exact: number
  /** Question-specific wrong answers and what to say about them. */
  traps?: Array<[number, string]>
}

export function diagnoseEstimate(response: string, { estimate, exact, traps = [] }: EstimateCheck): string | null {
  const value = toNumber(response)
  if (value === null || near(value, estimate)) return null
  for (const [wrong, message] of traps) if (near(value, wrong)) return message
  if (Math.abs(value - exact) <= 0.01 * Math.abs(exact)) {
    return 'That’s the exact answer. For an estimate, round each number to 1 significant figure first, then work it out.'
  }
  if (near(value, roundTo1sf(exact))) {
    return 'You rounded the answer at the end. Round each number to 1 significant figure first, then do the easier calculation.'
  }
  for (const scale of [10, 100, 1000]) {
    if (near(value * scale, estimate) || near(value, estimate * scale)) return 'The digits are right, but the answer is the wrong size. Check where the decimal point goes.'
  }
  return null
}
