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

export function formatExpression(value: string): string {
  return value.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−')
}
