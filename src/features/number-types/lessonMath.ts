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
    .replace(/[−–]/g, '-')
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
  if (interaction.acceptanceRule === 'numberList') {
    // The same numbers in the same order: the next two terms, or the first five.
    const actual = parseNumericList(response), wanted = parseNumericList(expected)
    return actual.length === wanted.length && actual.every((value, index) => Math.abs(value - wanted[index]) < 1e-9)
  }
  if (interaction.acceptanceRule === 'inequality') {
    // The same set of numbers: x > 4 is 4 < x; −4 ≤ x < 1 must match both ends and whether each is included.
    const actual = parseInequality(response), wanted = parseInequality(expected)
    return actual !== null && wanted !== null && actual.letter === wanted.letter && sameEnd(actual.lower, wanted.lower) && sameEnd(actual.upper, wanted.upper)
  }
  if (interaction.acceptanceRule === 'ordered') {
    const actual = Array.isArray(response) ? response.map(String) : []
    const wanted = Array.isArray(expected) ? expected.map(String) : []
    return actual.length === wanted.length && actual.every((value, index) => value === wanted[index])
  }
  if (interaction.acceptanceRule === 'collectedExpression') return sameCollectedExpression(response, expected)
  if (interaction.acceptanceRule === 'factorisedExpression') return sameFactorised(response, expected)
  if (interaction.acceptanceRule === 'formula') return sameFormula(response, expected)
  if (interaction.acceptanceRule === 'brackets') return sameBrackets(response, expected)
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
    // An angle can be typed with its degree sign: 52° is 52. A length or area can be typed with its unit (cm, mm², m),
    // and an answer in terms of π with its π, when the box says so: 24π is 24.
    const actual = parseFormattedNumber(String(response).replace(/\s*(?:°|π?\s*(?:[cm]?m[²2³3]?)?)\s*$/, ''))
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
  // A leading £ is harmless: students often type the unit shown beside the box. So is "x =" before a solution.
  const text = String(value ?? '').trim().replace(/^[a-z]\s*=\s*/i, '').replace(/^£\s?/, '').replace(/^[−–]/, '-')
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
  return Boolean(actual && wanted) && sameTerms(actual!, wanted!)
}

function sameTerms(actual: Term[], wanted: Term[]) {
  const keys = actual.map(term => term.key)
  if (new Set(keys).size !== keys.length || actual.some(term => term.coefficient === 0)) return false
  const a = collect(actual), b = collect(wanted)
  for (const [key, value] of b) if (value === 0) b.delete(key)
  // Numbers in front can be fractions (x²/9), so compare them to within rounding.
  return a.size === b.size && [...b].every(([key, value]) => Math.abs((a.get(key) ?? NaN) - value) < 1e-9)
}

/**
 * A factorised answer, "3x(2x + 3)": the one term outside the bracket and the terms inside, or null.
 * The bracket may come first, "(2x + 3)3x", and a bare bracket has 1 outside.
 */
export function readFactorised(value: unknown): { outside: Term; inside: Term[] } | null {
  const text = plainPowers(String(value ?? '').toLowerCase().replace(/[−–]/g, '-')).replace(/[\s×*·]/g, '')
  const before = text.match(/^([^()]*)\(([^()]+)\)$/), after = text.match(/^\(([^()]+)\)([^()]*)$/)
  const [outsideText, insideText] = before ? [before[1], before[2]] : after ? [after[2], after[1]] : []
  if (insideText === undefined) return null
  const outside = outsideText === '' || outsideText === '+' ? [{ coefficient: 1, key: '' }] : outsideText === '-' ? [{ coefficient: -1, key: '' }] : readTerms(outsideText)
  const inside = readTerms(insideText)
  return outside && outside.length === 1 && inside ? { outside: outside[0], inside } : null
}

/**
 * Right when the term outside is the one in the answer and the bracket holds the same terms, in any order.
 * Taking out the negative of the factor, −3x(−2x − 3), is also fully factorised, so it is right too.
 */
export function sameFactorised(response: unknown, expected: unknown) {
  const actual = readFactorised(response), wanted = readFactorised(expected)
  if (!actual || !wanted || actual.outside.key !== wanted.outside.key) return false
  const sign = Math.sign(actual.outside.coefficient) * Math.sign(wanted.outside.coefficient)
  return Math.abs(actual.outside.coefficient - sign * wanted.outside.coefficient) < 1e-9
    && sameTerms(actual.inside, wanted.inside.map(term => ({ ...term, coefficient: sign * term.coefficient })))
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

/*
 * Formulas such as "(C − 5)/3", "√(A/6)" or "T²/4": the right-hand side of a rearranged formula. Read with a small
 * parser (the learner's text is never run as code) and marked by trying numbers, so every correct form is right:
 * (C − 5)/3, C/3 − 5/3 and (C − 5) ÷ 3 all are. Letters are read in lower case: no formula in the course uses
 * the same letter twice in different cases, and phone keyboards often type the wrong case.
 */
type FormulaNode = (values: Record<string, number>) => number

/** The text as tokens, or null if something in it can't be part of a formula. "m = 2x" reads only the "2x". */
function formulaTokens(value: unknown): string[] | null {
  const text = plainPowers(String(value ?? '').toLowerCase())
    .replace(/^\s*[a-z]\s*=/, '')
    .replace(/[−–]/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/sqrt/g, '√').replace(/\s+/g, '')
  if (!text || /[^a-z\d.+\-*/^()√]/.test(text)) return null
  return text.match(/\d+(?:\.\d+)?|[a-z]|[+\-*/^()√]/g)
}

/** Parses a formula into something that works it out for given letters, or null if it isn't one. */
export function readFormula(value: unknown): { letters: string[]; at: FormulaNode } | null {
  const tokens = formulaTokens(value)
  if (!tokens) return null
  let i = 0
  const letters = new Set<string>()
  const peek = () => tokens[i]
  const sum = (): FormulaNode | null => {
    let left = product()
    while (left && (peek() === '+' || peek() === '-')) {
      const op = tokens[i++], right = product()
      if (!right) return null
      const a = left
      left = op === '+' ? v => a(v) + right(v) : v => a(v) - right(v)
    }
    return left
  }
  const product = (): FormulaNode | null => {
    let left = signed()
    // Two things side by side multiply: 2a, bh, 3(x + 1), (c − 5)√a.
    while (left && (peek() === '*' || peek() === '/' || (peek() !== undefined && /^[\da-z(√]/.test(peek())))) {
      const op = peek() === '*' || peek() === '/' ? tokens[i++] : '*'
      const right = signed()
      if (!right) return null
      const a = left
      left = op === '/' ? v => a(v) / right(v) : v => a(v) * right(v)
    }
    return left
  }
  const signed = (): FormulaNode | null => {
    if (peek() === '-') { i++; const inner = signed(); return inner && (v => -inner(v)) }
    if (peek() === '+') { i++; return signed() }
    return power()
  }
  const power = (): FormulaNode | null => {
    const base = atom()
    if (!base || peek() !== '^') return base
    i++
    const exponent = signed()
    return exponent && (v => base(v) ** exponent(v))
  }
  const atom = (): FormulaNode | null => {
    const token = tokens[i++]
    if (token === undefined) return null
    if (token === '√') { const inner = power(); return inner && (v => Math.sqrt(inner(v))) }
    if (token === '(') {
      const inner = sum()
      if (tokens[i++] !== ')') return null
      return inner
    }
    if (/^\d/.test(token)) { const n = Number(token); return () => n }
    if (/^[a-z]$/.test(token)) { letters.add(token); return v => v[token] ?? NaN }
    return null
  }
  const at = sum()
  return at && i === tokens.length ? { letters: [...letters], at } : null
}

/** Numbers to try for the letters: not whole, not small, so different formulas don't agree by chance. */
const TRIAL_VALUES = [7.3, 11.9, 5.7, 13.1, 9.4, 17.3, 6.1]

/** Right when the response works out the same as the answer for every set of numbers tried, using no other letters. */
export function sameFormula(response: unknown, expected: unknown) {
  const actual = readFormula(response), wanted = readFormula(expected)
  if (!actual || !wanted || actual.letters.some(letter => !wanted.letters.includes(letter))) return false
  return [0, 1, 2, 3].every(trial => {
    const values = Object.fromEntries(wanted.letters.map((letter, k) => [letter, TRIAL_VALUES[(trial * 3 + k) % TRIAL_VALUES.length]]))
    const a = actual.at(values), b = wanted.at(values)
    return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b))
  })
}

/**
 * A quadratic factorised into two brackets, "(x + 3)(x − 5)": each bracket's number of x and number, or null.
 * A × or * between the brackets is fine.
 */
export function readBrackets(value: unknown): { letter: string; brackets: [number, number][] } | null {
  const text = plainPowers(String(value ?? '').toLowerCase().replace(/[−–]/g, '-')).replace(/[\s×*·]/g, '')
  const match = text.match(/^\(([^()]+)\)\(([^()]+)\)$/)
  if (!match) return null
  let letter = ''
  const brackets: [number, number][] = []
  for (const inside of [match[1], match[2]]) {
    const terms = readTerms(inside)
    if (!terms || terms.some(term => term.key !== '' && !/^[a-z]$/.test(term.key))) return null
    for (const term of terms) if (term.key) { if (letter && term.key !== letter) return null; letter = term.key }
    const totals = collect(terms)
    brackets.push([totals.get(letter) ?? 0, totals.get('') ?? 0])
  }
  return letter && brackets.every(([x]) => x !== 0) ? { letter, brackets } : null
}

/** Right when the two brackets multiply out to the same quadratic as the answer's, in either order. */
export function sameBrackets(response: unknown, expected: unknown) {
  const actual = readBrackets(response), wanted = readBrackets(expected)
  if (!actual || !wanted || actual.letter !== wanted.letter) return false
  const expand = ([[a, b], [c, d]]: [number, number][]) => [a * c, a * d + b * c, b * d]
  const [p, q] = [expand(actual.brackets), expand(wanted.brackets)]
  return p.every((n, i) => Math.abs(n - q[i]) < 1e-9)
}

/** One end of an inequality: the number and whether it is included (≤, ≥). Missing when the numbers go on for ever. */
export type InequalityEnd = { value: number; included: boolean }
export type ParsedInequality = { letter: string; lower?: InequalityEnd; upper?: InequalityEnd }
const sameEnd = (a?: InequalityEnd, b?: InequalityEnd) => a === undefined || b === undefined ? a === b : Math.abs(a.value - b.value) < 1e-9 && a.included === b.included

/**
 * "x ≥ −2", "3 > x", "−4 <= x < 1": the letter with the numbers it can be between. Signs may be typed <=, >= or =<.
 * Two signs must point the same way (−4 ≤ x < 1, or 1 > x ≥ −4). Never evaluated as code.
 */
export function parseInequality(value: unknown): ParsedInequality | null {
  const text = String(value ?? '').replace(/[−–]/g, '-').replace(/<=|=</g, '≤').replace(/>=|=>/g, '≥').replace(/\s+/g, '')
  const parts = text.split(/([<>≤≥])/)
  if (parts.length !== 3 && parts.length !== 5) return null
  const terms = parts.filter((_, i) => i % 2 === 0), signs = parts.filter((_, i) => i % 2 === 1)
  const letterAt = terms.findIndex(term => /^[a-z]$/i.test(term))
  if (letterAt < 0 || terms.filter(term => /^[a-z]$/i.test(term)).length !== 1) return null
  const numbers = terms.map(term => term === terms[letterAt] ? 0 : parseDecimalOrFraction(term))
  if (numbers.some(n => n === null)) return null
  const result: ParsedInequality = { letter: terms[letterAt].toLowerCase() }
  // Read each sign as "left (sign) right" and put the number on the letter's lower or upper side.
  for (let i = 0; i < signs.length; i++) {
    const sign = signs[i], less = sign === '<' || sign === '≤', included = sign === '≤' || sign === '≥'
    if (i === letterAt - 1) {
      // number (sign) letter: 3 < x puts 3 below x.
      const end = { value: numbers[i]!, included }
      if (less) { if (result.lower) return null; result.lower = end } else { if (result.upper) return null; result.upper = end }
    } else if (i === letterAt) {
      // letter (sign) number: x < 3 puts 3 above x.
      const end = { value: numbers[i + 1]!, included }
      if (less) { if (result.upper) return null; result.upper = end } else { if (result.lower) return null; result.lower = end }
    } else return null
  }
  return result
}
