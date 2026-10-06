/*
 * Lesson 11's workings, one move a step (src/features/EXPLANATIONS.md). Decimals and whole numbers go in a place-value
 * chart: line them up, fill the gaps after the point with 0, then compare one column at a time from the left, a tie
 * moving on to the next column. Negatives go on a thermometer or number line: draw it, mark the values, compare the
 * ones below zero, then read the order off the picture. The answer is written once, in green, in the question's form.
 */
import { chartCells, columnName, line, ordinal, part, sign, type NumberLinePicture, type OrderChartPicture, type StepLine, type StepWorking, type WorkedStep } from '../../written-methods/tutor/stepWorking'

// Keeps "12 750" and "−7" on one line.
const keep = (text: string) => text.replace(/(\d) (?=\d)/g, '$1 ').replace(/−/g, '−⁠')
const spaced = (digits: string) => digits.length > 4 ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : digits
const list = (items: string[]) => items.length < 3 ? items.join(' and ') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`

type Chart = {
  /** The values as written in the chart: "3.7", "12 750"; `label` names a row ("Monday"). */
  rows: Array<{ label?: string; value: string }>
  /** Smallest first, or largest first (fastest, tallest… turned into a direction by the question). */
  largestFirst?: boolean
  /** The answer as the question wants it, drawn once in green. */
  answer: string
  /** The last step's heading and ⓘ, when the question asks for more than the order. */
  finish?: { title: string; why: string }
  /** Choosing a value strictly between two (the rows are the two ends): the value picked. */
  between?: string
  /** Decimal places to fill to, when more than the longest value has (choosing between 1.3 and 1.31 needs 3). */
  places?: number
}

/** A chart working for decimals or positive whole numbers. */
export function chartWorking(spec: Chart): StepWorking {
  const digits = spec.rows.map(r => r.value.replace(/\s/g, ''))
  const decimal = digits.some(d => d.includes('.'))
  const places = Math.max(spec.places ?? 0, ...[...digits, spec.between ?? ''].map(d => (d.split('.')[1] ?? '').length))
  const whole = Math.max(...[...digits, spec.between ?? ''].map(d => d.split('.')[0].length))
  const base = { kind: 'order-chart' as const, rows: spec.rows, whole, places }
  const hasGaps = digits.some(d => chartCells({ whole, places }, d).some(c => !c))
  const decimalGaps = decimal && digits.some(d => (d.split('.')[1] ?? '').length < places)
  const filled = decimalGaps
  const shown = (r: number) => {
    const cells = chartCells({ whole, places, filled }, digits[r]).map(c => c?.digit ?? '')
    const text = cells.slice(0, whole).join('') + (places ? `.${cells.slice(whole).join('')}` : '')
    return spec.rows[r].label ?? keep(decimal ? text : spaced(text))
  }
  const steps: WorkedStep[] = [{
    title: decimal ? 'Line up the points' : 'Line up the units',
    why: decimal
      ? `Write each number in the chart with the decimal points under each other.${hasGaps ? ' Some numbers have an empty box.' : ''}`
      : `Whole numbers line up on the right, units under units.${hasGaps ? ' The shorter numbers have empty boxes at the front.' : ''}`,
    picture: base,
  }]
  if (decimalGaps) steps.push({
    title: 'Fill the gaps',
    why: 'An empty box means none of that place. Writing 0 there says the same thing, so the value does not change.',
    picture: { ...base, filled },
  })

  if (spec.between !== undefined) {
    const ends = digits.map((_, r) => shown(r))
    const pick = keep(decimal ? spec.between.padEnd(spec.between.split('.')[0].length + 1 + places, '0') : spaced(spec.between.replace(/\s/g, '')))
    const rows = [spec.rows[0], { value: spec.between }, spec.rows[1]]
    steps.push({
      title: 'Pick one between',
      why: 'The two end values are not allowed, so pick any number in the gap between them.',
      picture: { ...base, rows, filled, pick: 1 },
      lines: [line([part(ends[0]), sign('<'), part(pick, 0), sign('<'), part(ends[1])])],
    })
    steps.push({ title: 'Write the answer', why: 'Any number in the gap is right. This is one of them.', picture: { ...base, rows, filled, pick: 1 }, words: keep(spec.answer) })
    return { kind: 'step-worked', start: keep(spec.rows.map(r => r.value).join(' and ')), steps }
  }

  const ranks: Record<number, number> = {}
  const digitAt = (r: number, col: number) => Number(chartCells({ whole, places, filled: true }, digits[r])[col]?.digit ?? 0)
  const cmp = spec.largestFirst ? '>' : '<'
  let compares = 0
  const solve = (group: number[], col: number, offset: number, same: StepLine[]) => {
    const values = group.map(r => digitAt(r, col))
    if (values.every(v => v === values[0])) {
      const name = columnName({ whole }, col)
      solve(group, col + 1, offset, [...same, line([part(`${name[0].toUpperCase()}${name.slice(1)}:`), part(`${group.length === 2 ? 'both' : 'all'} ${values[0]}`)])])
      return
    }
    const distinct = [...new Set(values)].sort((a, b) => spec.largestFirst ? b - a : a - b)
    const groups = distinct.map(d => group.filter(r => digitAt(r, col) === d))
    const fresh: number[] = []
    const placing: StepLine[] = []
    let at = offset
    for (const g of groups) {
      if (g.length === 1) { ranks[g[0]] = at + 1; fresh.push(g[0]); placing.push(line([part(shown(g[0]), 0), part(`is ${ordinal(at + 1)}`)])) }
      else placing.push(line([part(`${list(g.map(shown))} tie`)]))
      at += g.length
    }
    const name = columnName({ whole }, col)
    const empty = !decimal && group.some(r => digits[r].length < whole - col)
    const title = `Compare the ${name}`
    steps.push({
      title: steps.some(st => st.title === title) && name.split(' ').length === 1 ? `${title} again` : title,
      why: empty
        ? 'An empty box means none of that place, so it counts as 0. A number with fewer digits is always smaller.'
        : compares === 0 && same.length
          ? 'Start on the left. Columns where every number matches do not help, so the first column where they differ decides.'
        : compares === 0
          ? `Start with the biggest place value, on the left. The ${spec.largestFirst ? 'biggest' : 'smallest'} digit there goes first.${groups.some(g => g.length > 1) ? ' Numbers that tie move on to the next column.' : ''}`
          : `These numbers match in every column so far, so the first column where they differ decides.${groups.some(g => g.length > 1) ? ' A tie moves on to the next column.' : ''}`,
      picture: { ...base, filled, focus: col, active: group, ranks: { ...ranks }, fresh },
      lines: [...same, line(distinct.flatMap((d, i) => [...(i ? [sign(cmp)] : []), part(d, 0, { boxed: true })])), ...placing],
    })
    compares++
    at = offset
    for (const g of groups) { if (g.length > 1) solve(g, col + 1, at, []); at += g.length }
  }
  solve(digits.map((_, r) => r), 0, 0, [])
  steps.push({
    ...(spec.finish ?? { title: 'Write the answer', why: 'Use the numbers as the question wrote them, in the order it asks for.' }),
    picture: { ...base, filled, ranks: { ...ranks } },
    words: keep(spec.answer),
  })
  return { kind: 'step-worked', start: keep(spec.rows.map(r => r.label ? `${r.label} ${r.value}` : r.value).join(', ')), steps }
}

type Line = {
  /** Each value and how it is labelled on the picture ("−7", "−£60"). */
  values: Array<{ value: number; label: string }>
  /** Temperatures go on a thermometer; anything else on a number line. */
  thermometer?: boolean
  largestFirst?: boolean
  answer: string
  /** The compare step: its ⓘ, and any lines after "−12 is 12 below zero" (3.50 > 3.05). */
  compare?: { why?: string; lines?: StepLine[] }
  finish?: { title: string; why: string }
  /** Choosing a value strictly between the two values: the one picked. */
  between?: { value: number; label: string }
  /** The scale's ends and spacing. */
  scale: { min: number; max: number; tick: number }
}

/** A thermometer or number line working for negatives. */
export function lineWorking(spec: Line): StepWorking {
  const vertical = spec.thermometer
  const base: NumberLinePicture = { kind: 'number-line', vertical, ...spec.scale, marks: [] }
  const marks = spec.values.map(v => ({ ...v }))
  const steps: WorkedStep[] = [
    {
      title: vertical ? 'Draw the thermometer' : 'Draw a number line',
      why: vertical
        ? 'Higher up is warmer and lower down is colder. Below 0 the numbers have a minus sign.'
        : 'Numbers get bigger to the right and smaller to the left. Left of 0 the numbers have a minus sign.',
      picture: base,
    },
    {
      title: vertical ? 'Mark each temperature' : 'Mark each value',
      why: vertical ? 'Put a dot at each temperature. The ones with a minus sign go below the 0 line.' : 'Put a dot at each value. The ones with a minus sign go left of 0.',
      picture: { ...base, marks },
    },
  ]
  const show = (v: number) => keep(`${v < 0 ? '−' : ''}${Math.abs(v)}`)
  if (spec.between) {
    const [low, high] = [...spec.values].sort((a, b) => a.value - b.value)
    steps.push({
      title: 'Pick one between',
      why: 'The two end values are not allowed, so pick any number in the gap between them.',
      picture: { ...base, marks: [...marks, { ...spec.between, pick: true }] },
      lines: [line([part(show(low.value)), sign('<'), part(show(spec.between.value), 0), sign('<'), part(show(high.value))])],
    })
    steps.push({ title: 'Write the answer', why: 'Any whole number in the gap is right. This is one of them.', picture: { ...base, marks: [...marks, { ...spec.between, pick: true }] }, words: keep(spec.answer) })
    return { kind: 'step-worked', start: keep(spec.values.map(v => v.label).join(' and ')), steps }
  }
  const below = spec.values.filter(v => v.value < 0).sort((a, b) => a.value - b.value)
  if (below.length > 1) steps.push({
    title: 'Compare below zero',
    why: spec.compare?.why ?? `Further below zero means ${vertical ? 'colder' : 'smaller'}, even though the number without its minus sign is bigger.`,
    picture: { ...base, marks: marks.map(m => ({ ...m, boxed: m.value < 0 })) },
    lines: [
      ...below.map(v => line([part(show(v.value), 0), part(`is ${keep(String(Math.abs(v.value)))} below zero`)])),
      ...(spec.compare?.lines ?? []),
      line(below.flatMap((v, i) => [...(i ? [sign('<')] : []), part(show(v.value), 0, { boxed: true })])),
    ],
  })
  const read = vertical ? (spec.largestFirst ? 'down' : 'up') : (spec.largestFirst ? 'left' : 'right')
  steps.push({
    ...(spec.finish ?? {
      title: vertical ? (spec.largestFirst ? 'Read top to bottom' : 'Read bottom to top') : (spec.largestFirst ? 'Read right to left' : 'Read left to right'),
      why: 'The picture puts them in order. Read them off in the order the question asks for.',
    }),
    picture: { ...base, marks, read },
    words: keep(spec.answer),
  })
  return { kind: 'step-worked', start: keep(spec.values.map(v => v.label).join(', ')), steps }
}
