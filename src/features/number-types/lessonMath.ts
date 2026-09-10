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

export function checkAnswer(interaction: InteractionDefinition, response: unknown): boolean {
  const expected = interaction.correctAnswer
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
  const text = String(value ?? '').trim()
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
