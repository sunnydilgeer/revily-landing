/*
 * Place value workings drawn as pictures, one move a step (src/features/EXPLANATIONS.md). The picture is a place-value
 * chart: each digit under its column's value (100,000 … 10, 1 . 0.1, 0.01 …), so the number a digit is multiplied by
 * is read from the chart, never announced. The digit a step works on is boxed in purple, its column value is blue,
 * and the last move's result is the green answer.
 */

export type PlaceLinePart = { text: string; family?: number }
/** A line of working under the chart: "2 × 10,000 → 20,000". `answer` draws the result in the green answer box. */
export type PlaceLine = { parts: PlaceLinePart[]; result?: string; answer?: boolean }
/**
 * The chart for one step. `value` is the number as written ("526,908", "0.0069"). `labels` shows the column values.
 * `boxed` is the digit a step works on (counting digits from the left, ignoring commas and the point). When building a
 * number, only `placed` digits are written yet and `zeros` are the zeros just filled in; `answer` turns the row green.
 */
export type PlaceChart = { value: string; labels: boolean; boxed?: number; building?: boolean; placed?: number[]; zeros?: number[]; answer?: boolean }
export type PlaceStep = { title: string; instruction: string; chart: PlaceChart; lines?: PlaceLine[]; words?: string }
export type PlaceWorking = { kind: 'place-worked'; given?: string[]; opening: PlaceChart; steps: PlaceStep[] }

/** Each digit of a number with its power of ten: "526,908" → 5 (10⁵), 2 (10⁴) … 8 (10⁰). */
export function placeDigits(value: string) {
  const [whole, decimals = ''] = value.replace(/,/g, '').split('.')
  return [...whole].map((digit, i) => ({ digit: Number(digit), power: whole.length - 1 - i }))
    .concat([...decimals].map((digit, i) => ({ digit: Number(digit), power: -(i + 1) })))
}

/** A column's value as written on the chart: 10,000, 1, 0.01. */
export function columnValue(power: number) {
  return power >= 0 ? (10 ** power).toLocaleString('en-GB') : `0.${'0'.repeat(-power - 1)}1`
}

/** A digit's value, written exactly: 2 in 10⁴ → "20,000"; 7 in 10⁻⁴ → "0.0007". */
export function digitValue(digit: number, power: number) {
  if (!digit) return '0'
  return power >= 0 ? (digit * 10 ** power).toLocaleString('en-GB') : `0.${'0'.repeat(-power - 1)}${digit}`
}

const PLACE_NAMES: Record<number, string> = { 5: 'hundred-thousands', 4: 'ten-thousands', 3: 'thousands', 2: 'hundreds', 1: 'tens', 0: 'units', [-1]: 'tenths', [-2]: 'hundredths', [-3]: 'thousandths', [-4]: 'ten-thousandths', [-5]: 'hundred-thousandths' }
export const placeName = (power: number) => PLACE_NAMES[power] ?? `10^${power}`

const label = (value: string): PlaceStep => ({
  title: 'Label the columns', chart: { value, labels: true },
  instruction: 'Write each column’s value above it. Each column is ten times the one on its right.',
})

/** One step: box a digit and multiply it by its column's value. */
export function valueStep(value: string, index: number, answer = true, title?: string): PlaceStep {
  const { digit, power } = placeDigits(value)[index]
  return {
    title: title ?? `Value of the ${digit}`, chart: { value, labels: true, boxed: index },
    instruction: 'Multiply the digit by the value of its column.',
    lines: [{ parts: [{ text: String(digit), family: 3 }, { text: '×' }, { text: columnValue(power), family: 0 }], result: digitValue(digit, power), answer }],
  }
}

/** The value of one digit, or of several (the last one is the answer): label the columns, then one step a digit. */
export function valueWorking(value: string, ...indexes: number[]): PlaceWorking {
  return { kind: 'place-worked', opening: { value, labels: false }, steps: [label(value), ...indexes.map((index, i) => valueStep(value, index, i === indexes.length - 1))] }
}

/** Writing a number from its parts: an empty chart, one digit a step, then zeros in every empty place. */
export function buildWorking(value: string, given: string[]): PlaceWorking {
  const digits = placeDigits(value)
  const order = digits.map((d, i) => ({ ...d, i })).filter(d => d.digit)
  const steps: PlaceStep[] = []
  const placed: number[] = []
  for (const d of order) {
    placed.push(d.i)
    steps.push({ title: `Put in the ${d.digit}`, chart: { value, labels: true, building: true, placed: [...placed] }, instruction: `Write it in the ${placeName(d.power)} column.` })
  }
  const zeros = digits.map((d, i) => i).filter(i => !placed.includes(i))
  steps.push({ title: 'Fill the gaps with 0', chart: { value, labels: true, building: true, placed: digits.map((_, i) => i), zeros, answer: true }, instruction: 'Every empty column gets a 0, so each digit stays in its place.' })
  return { kind: 'place-worked', given, opening: { value, labels: true, building: true, placed: [] }, steps }
}
