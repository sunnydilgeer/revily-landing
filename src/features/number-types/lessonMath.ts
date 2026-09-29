import type { DivisionAnswer, InteractionDefinition } from './types'

export function factorsOf(value: number): number[] {
  const factors: number[] = []
  for (let candidate = 1; candidate <= Math.sqrt(value); candidate += 1) {
    if (value % candidate !== 0) continue
    factors.push(candidate)
    if (candidate !== value / candidate) factors.push(value / candidate)
  }
  return factors.sort((a, b) => a - b)
}

export function factorPairsOf(value: number): Array<[number, number]> {
  return factorsOf(value)
    .filter((factor) => factor <= Math.sqrt(value))
    .map((factor) => [factor, value / factor])
}

export function isPrime(value: number): boolean {
  return Number.isInteger(value) && value > 1 && factorsOf(value).length === 2
}

export function positiveMultiples(base: number, count: number): number[] {
  return Array.from({ length: count }, (_, index) => base * (index + 1))
}

function normaliseList(value: unknown): string[] {
  const list = Array.isArray(value) ? value : [value]
  return list.map(String).sort()
}

function parseNumericList(value: unknown): number[] {
  if (Array.isArray(value)) return value.map(Number).filter(Number.isFinite)
  return String(value ?? '')
    .match(/-?\d+(?:\.\d+)?/g)
    ?.map(Number)
    .filter(Number.isFinite) ?? []
}

// Deliberately parse a small numeric grammar; never evaluate learner input as code.
export function parseDecimalOrFraction(response: unknown): number | null {
  const text = String(response ?? '').trim().replace(/−/g, '-').replace(/·/g, '.')
  const decimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/
  if (decimal.test(text)) {
    const value = Number(text)
    return Number.isFinite(value) ? value : null
  }
  const fraction = text.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/)
  if (fraction) {
    const numerator = Number(fraction[1]), denominator = Number(fraction[2])
    return Number.isSafeInteger(numerator) && Number.isSafeInteger(denominator) && denominator !== 0 ? numerator / denominator : null
  }
  const mixed = text.match(/^([+-]?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (!mixed) return null
  const whole = Number(mixed[2]), numerator = Number(mixed[3]), denominator = Number(mixed[4])
  if (![whole, numerator, denominator].every(Number.isSafeInteger) || denominator === 0 || numerator >= denominator) return null
  return (mixed[1] === '-' ? -1 : 1) * (whole + numerator / denominator)
}

export function checkAnswer(interaction: InteractionDefinition, response: unknown): boolean {
  const expected = interaction.correctAnswer
  if (interaction.acceptanceRule === 'rational') {
    const text = String(response ?? '').trim().replace(/−/g, '-')
    const actual = parseExactRational(response)
    const wanted = parseExactRational(expected)
    return actual !== null && wanted !== null
      && (interaction.requiredDenominator === undefined || actual.denominator === BigInt(interaction.requiredDenominator))
      && (!interaction.requireMixedForm || /^[+-]?\d{1,12}\s+\d{1,12}\s*\/\s*\d{1,12}$/.test(text))
      && (!interaction.requireSimplest || bigintGcd(actual.numerator, actual.denominator) === BigInt(1))
      && actual.numerator * wanted.denominator === wanted.numerator * actual.denominator
  }
  if (interaction.acceptanceRule === 'rationalInterval') {
    const actual = parseExactRational(response)
    if (actual === null || (interaction.requiredDenominator !== undefined && actual.denominator !== BigInt(interaction.requiredDenominator))) return false
    const value = Number(actual.numerator) / Number(actual.denominator)
    return Number.isFinite(value)
      && (interaction.lowerBound === undefined || value > interaction.lowerBound)
      && (interaction.upperBound === undefined || value < interaction.upperBound)
  }
  if (interaction.acceptanceRule === 'fraction') {
    const text = String(response ?? '').trim()
    if (!/^\d+\s*\/\s*\d+$/.test(text)) return false
    const actual = parseDecimalOrFraction(text)
    const wanted = parseDecimalOrFraction(expected)
    return actual !== null && wanted !== null && actual === wanted
  }
  if (interaction.acceptanceRule === 'openInterval') {
    const value = parseDecimalOrFraction(response)
    return value !== null && interaction.lowerBound !== undefined && interaction.upperBound !== undefined
      && value > interaction.lowerBound && value < interaction.upperBound
  }
  if (interaction.acceptanceRule === 'integerInterval') {
    const value = parseDecimalOrFraction(response)
    return value !== null && Number.isInteger(value)
      && interaction.lowerBound !== undefined && interaction.upperBound !== undefined
      && value > interaction.lowerBound && value < interaction.upperBound
  }
  if (interaction.acceptanceRule === 'greaterThan') {
    const value = parseDecimalOrFraction(response)
    return value !== null && interaction.lowerBound !== undefined && value > interaction.lowerBound
  }
  if (interaction.acceptanceRule === 'exactDecimalPlaces') {
    const text = String(response ?? '').trim().replace(/−/g, '-').replace(/·/g, '.')
    const match = text.match(/^[+-]?\d+\.(\d+)$/)
    const expectedValue = parseDecimalOrFraction(expected)
    return match !== null && expectedValue !== null
      && Number(text) === expectedValue
      && match[1].length === interaction.requiredDecimalPlaces
  }
  if (interaction.type === 'quotientRemainderInput') {
    if (!isDivisionAnswer(expected) || !isDivisionResponse(response)) return false
    const quotient = parseNonNegativeInteger(response.quotient)
    const remainder = parseNonNegativeInteger(response.remainder)
    if (quotient === null || remainder === null) return false
    if (interaction.dividend === undefined || interaction.divisor === undefined || interaction.divisor <= 0) return false
    return quotient === expected.quotient
      && remainder === expected.remainder
      && remainder < interaction.divisor
      && quotient * interaction.divisor + remainder === interaction.dividend
  }
  if (interaction.acceptanceRule === 'oneOf') {
    return Array.isArray(expected) && expected.map(String).includes(String(response))
  }
  if (interaction.acceptanceRule === 'unorderedSet') {
    const actualValues = [...new Set(parseNumericList(response))].sort((a, b) => a - b)
    const expectedValues = [...new Set(parseNumericList(expected))].sort((a, b) => a - b)
    return actualValues.length === expectedValues.length && actualValues.every((value, index) => value === expectedValues[index])
  }
  if (interaction.acceptanceRule === 'ordered') {
    const actual = Array.isArray(response) ? response.map(String) : []
    const wanted = Array.isArray(expected) ? expected.map(String) : []
    return actual.length === wanted.length && actual.every((value, index) => value === wanted[index])
  }
  if (interaction.acceptanceRule === 'collectedExpression') return sameCollectedExpression(response, expected)
  if (interaction.acceptanceRule === 'power') {
    // One power, base and index both as written: 3^6 is right for 3⁶; 729 or 9^3 is not the power asked for.
    const actual = parsePower(response), wanted = parsePower(expected)
    return actual !== null && wanted !== null && actual.base === wanted.base && actual.power === wanted.power
  }
  if (interaction.acceptanceRule === 'standardForm') {
    // A must be at least 1 and less than 10. With bounds, any such number strictly between them is right.
    const actual = parseStandardForm(response)
    if (actual === null || actual.a < 1 || actual.a >= 10) return false
    if (interaction.lowerBound !== undefined || interaction.upperBound !== undefined) {
      return (interaction.lowerBound === undefined || actual.value > interaction.lowerBound)
        && (interaction.upperBound === undefined || actual.value < interaction.upperBound)
    }
    const wanted = parseStandardForm(expected)
    return wanted !== null && actual.a === wanted.a && actual.n === wanted.n
  }
  if (interaction.acceptanceRule === 'normalisedNumber') {
    const actual = parseFormattedNumber(response)
    const wanted = parseFormattedNumber(expected)
    return actual !== null && wanted !== null && actual === wanted
  }
  if (interaction.acceptanceRule === 'normalisedAlgebra') {
    const actual = normaliseMonomial(response)
    const wanted = normaliseMonomial(expected)
    return actual !== null && wanted !== null && actual === wanted
  }
  if (interaction.acceptanceRule === 'nonNegativeInteger') {
    const actual = parseNonNegativeInteger(response)
    const wanted = parseNonNegativeInteger(expected)
    return actual !== null && wanted !== null && actual === wanted
  }
  if (interaction.acceptanceRule === 'numeric') return Number(response) === Number(expected)
  if (Array.isArray(expected)) {
    const actual = normaliseList(response)
    const wanted = normaliseList(expected)
    return actual.length === wanted.length && actual.every((value, index) => value === wanted[index])
  }
  return String(response) === String(expected)
}

function bigintGcd(a: bigint, b: bigint): bigint {
  a = a < BigInt(0) ? -a : a
  b = b < BigInt(0) ? -b : b
  while (b !== BigInt(0)) { const remainder = a % b; a = b; b = remainder }
  return a
}

// Parse integers, ordinary fractions and mixed numbers exactly. The learner's
// answer is never evaluated as code and comparison uses integer cross-products.
export function parseExactRational(value: unknown): { numerator: bigint; denominator: bigint } | null {
  const text = String(value ?? '').trim().replace(/−/g, '-')
  if (/^[+-]?\d{1,12}$/.test(text)) return { numerator: BigInt(text), denominator: BigInt(1) }
  const fraction = text.match(/^([+-]?\d{1,12})\s*\/\s*(\d{1,12})$/)
  if (fraction) {
    const denominator = BigInt(fraction[2])
    return denominator === BigInt(0) ? null : { numerator: BigInt(fraction[1]), denominator }
  }
  const mixed = text.match(/^([+-]?)(\d{1,12})\s+(\d{1,12})\s*\/\s*(\d{1,12})$/)
  if (!mixed) return null
  const whole = BigInt(mixed[2]), numerator = BigInt(mixed[3]), denominator = BigInt(mixed[4])
  if (denominator === BigInt(0)) return null
  const sign = mixed[1] === '-' ? BigInt(-1) : BigInt(1)
  return { numerator: sign * (whole * denominator + numerator), denominator }
}

// Parse one authored monomial answer without evaluating learner input as code.
// Equivalent factor order and common square notation are accepted.
function normaliseMonomial(value: unknown): string | null {
  let text = String(value ?? '').trim().toLowerCase()
    .replace(/−/g, '-')
    .replace(/²/g, '^2')
    .replace(/\^\{(\d+)\}/g, '^$1')
    .replace(/[×*·\s]/g, '')
  const leading = text.match(/^([+-]?)(\d*)/)
  if (!leading) return null
  const sign = leading[1] === '-' ? -1 : 1
  const coefficient = sign * Number(leading[2] || '1')
  text = text.slice(leading[0].length)
  if (!text || !Number.isSafeInteger(coefficient)) return null
  const powers = new Map<string, number>()
  let consumed = ''
  for (const match of text.matchAll(/([a-z])(?:\^(\d+))?/g)) {
    consumed += match[0]
    const exponent = Number(match[2] || '1')
    if (!Number.isSafeInteger(exponent) || exponent < 1) return null
    powers.set(match[1], (powers.get(match[1]) ?? 0) + exponent)
  }
  if (consumed !== text) return null
  const variables = [...powers.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([letter, power]) => `${letter}${power}`).join('')
  return `${coefficient}|${variables}`
}

export function formatAcceptedAnswer(interaction: InteractionDefinition): string {
  if (interaction.displayAnswer) return `Correct answer: ${interaction.displayAnswer}.`
  if (isDivisionAnswer(interaction.correctAnswer)) {
    return `Correct answer: ${interaction.correctAnswer.quotient} remainder ${interaction.correctAnswer.remainder}.`
  }
  const expected = Array.isArray(interaction.correctAnswer)
    ? interaction.correctAnswer.map(String)
    : [String(interaction.correctAnswer ?? '')]
  const labels = expected.map((value) => interaction.options?.find((option) => option.id === value)?.label ?? value)
  const conjunction = interaction.acceptanceRule === 'oneOf' ? 'or' : 'and'
  const joined = labels.length <= 1
    ? labels[0]
    : labels.length === 2
      ? `${labels[0]} ${conjunction} ${labels[1]}`
      : `${labels.slice(0, -1).join(', ')} and ${labels.at(-1)}`
  const prefix = interaction.acceptanceRule === 'oneOf' ? 'Accepted answers include' : 'Correct answer'
  return `${prefix}: ${joined}${/[.!?]$/.test(joined) ? '' : '.'}`
}

function isDivisionAnswer(value: InteractionDefinition['correctAnswer']): value is DivisionAnswer {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value) && 'quotient' in value && 'remainder' in value)
}

function isDivisionResponse(value: unknown): value is { quotient: unknown; remainder: unknown } {
  return Boolean(value && typeof value === 'object' && 'quotient' in value && 'remainder' in value)
}

function parseNonNegativeInteger(value: unknown): number | null {
  const text = String(value ?? '').trim()
  if (!/^\d+$/.test(text)) return null
  const parsed = Number(text)
  return Number.isSafeInteger(parsed) ? parsed : null
}

/**
 * Reads "A × 10^n" (as the two-box standard form answer writes it) without evaluating it.
 * A is not checked here, so a wrong-answer message can still spot 30 × 10^7.
 */
export function parseStandardForm(value: unknown): { a: number; n: number; value: number } | null {
  const text = String(value ?? '').trim().replace(/^£\s?/, '').replace(/−/g, '-').replace(/·/g, '.')
  const match = text.match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*[×xX*]\s*10\s*\^\s*\(?\s*([+-]?\d{1,3})\s*\)?$/)
  if (!match) return null
  const a = Number(match[1]), n = Number(match[2])
  const exact = Number(`${match[1]}e${n}`)
  return Number.isFinite(a) && Number.isFinite(exact) ? { a, n, value: exact } : null
}

function parseFormattedNumber(value: unknown): number | null {
  // A leading £ is harmless: students often type the unit shown beside the box.
  const text = String(value ?? '').trim().replace(/^£\s?/, '')
  const plain = /^[+-]?\d+(?:\.\d+)?$/
  const commaGrouped = /^[+-]?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/
  const spaceGrouped = /^[+-]?\d{1,3}(?: \d{3})+(?:\.\d+)?$/
  if (!plain.test(text) && !commaGrouped.test(text) && !spaceGrouped.test(text)) return null
  const parsed = Number(text.replace(/[ ,]/g, ''))
  return Number.isFinite(parsed) ? parsed : null
}

/** A single power such as "10^7", "10⁷", "x^1" or "7^-3": its base and its whole-number power. */
export function parsePower(value: unknown): { base: string; power: number } | null {
  const text = plainPowers(String(value ?? '').toLowerCase().replace(/[−–]/g, '-')).replace(/\s/g, '')
  const match = text.match(/^(\d+|[a-z])\^(-?\d+)$/)
  if (!match) return null
  return { base: match[1].replace(/^0+(?=\d)/, ''), power: Number(match[2]) }
}

export function formatExpression(value: string): string {
  return value.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−')
}

/*
 * Algebraic expressions such as "5x + 3y − 2" or "10x²y + xy^2", read as a sum of terms without evaluating
 * the learner's text. Used to mark collected-like-terms answers in any order. Kept in this file because
 * several verifiers load lessonMath.ts on its own, so it must not import anything at runtime.
 */
/** One term: its number in front and its letter part, e.g. −3 and "a" for −3a. */
export type Term = { coefficient: number; key: string }

/** "x^2y" style key with letters in alphabetical order, so yx and xy are the same term. "" is a number term. */
function keyOf(powers: Map<string, number>) {
  return [...powers].sort(([a], [b]) => a.localeCompare(b)).map(([letter, power]) => power === 1 ? letter : `${letter}^${power}`).join('')
}

const SUPERSCRIPT_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹'
/** Typed powers in one spelling: x² and x^2 both become x^2, and a⁻⁴ becomes a^-4. */
function plainPowers(text: string) {
  return text.replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, run => `^${[...run].map(c => c === '⁻' ? '-' : String(SUPERSCRIPT_DIGITS.indexOf(c))).join('')}`)
}

/**
 * The terms exactly as written, in order, or null if the text is not a sum of terms.
 * A power may be negative (a^-4, a⁻⁴), and a term may be over a whole number (x²/9, 8x³/125).
 */
export function readTerms(value: unknown): Term[] | null {
  const text = plainPowers(String(value ?? '').toLowerCase().replace(/[−–]/g, '-'))
    .replace(/[()\s×*·]/g, '')
    // A minus straight after ^ belongs to the power, not to the next term.
    .replace(/\^-/g, '^~')
  if (!text || !/^[+-]?[^+-]+([+-][^+-]+)*$/.test(text)) return null
  const terms: Term[] = []
  for (const match of text.matchAll(/([+-]?)([^+-]+)/g)) {
    const [, sign, body] = match
    const parts = body.match(/^(\d*)((?:[a-z](?:\^~?\d+)?)*)(?:\/(\d+))?$/)
    if (!parts || (!parts[1] && !parts[2])) return null
    const over = parts[3] ? Number(parts[3]) : 1
    if (!over) return null
    const powers = new Map<string, number>()
    for (const [, letter, power] of parts[2].matchAll(/([a-z])(?:\^(~?\d+))?/g)) powers.set(letter, (powers.get(letter) ?? 0) + (power ? Number(power.replace('~', '-')) : 1))
    for (const [letter, power] of powers) if (power === 0) powers.delete(letter)
    const size = parts[1] ? Number(parts[1]) : 1
    terms.push({ coefficient: (sign === '-' ? -1 : 1) * size / over, key: keyOf(powers) })
  }
  return terms
}

/** Collects like terms: key → total number in front, keeping the order each key first appears. */
export function collect(terms: Term[]) {
  const totals = new Map<string, number>()
  for (const { coefficient, key } of terms) totals.set(key, (totals.get(key) ?? 0) + coefficient)
  return totals
}

/** Right when it has the same terms as the answer and nothing is left to collect. */
export function sameCollectedExpression(response: unknown, expected: unknown) {
  const actual = readTerms(response), wanted = readTerms(expected)
  if (!actual || !wanted) return false
  const keys = actual.map(term => term.key)
  if (new Set(keys).size !== keys.length || actual.some(term => term.coefficient === 0)) return false
  const a = collect(actual), b = collect(wanted)
  for (const [key, value] of b) if (value === 0) b.delete(key)
  // Numbers in front can be fractions (x²/9), so compare them to within rounding.
  return a.size === b.size && [...b].every(([key, value]) => Math.abs((a.get(key) ?? NaN) - value) < 1e-9)
}

/** "x^2y" → "x²y", "a^-4b" → "a⁻⁴b". */
export const prettyKey = (key: string) => key.replace(/\^(-?\d+)/g, (_, power: string) => [...power].map(c => c === '-' ? '⁻' : SUPERSCRIPT_DIGITS[Number(c)]).join(''))
/** One term as written: 1x → x, −1x → −x. */
export function prettyTerm({ coefficient, key }: Term, first = true) {
  const size = Math.abs(coefficient)
  const body = key ? `${size === 1 ? '' : size}${prettyKey(key)}` : String(size)
  return first ? `${coefficient < 0 ? '−' : ''}${body}` : `${coefficient < 0 ? '−' : '+'} ${body}`
}
/** Terms as an expression: "7ab − 3a". */
export const prettyExpression = (terms: Term[]) => terms.filter(term => term.coefficient !== 0).map((term, i) => prettyTerm(term, i === 0)).join(' ') || '0'
