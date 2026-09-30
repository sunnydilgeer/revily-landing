import { line, part, says, sign, type ColumnsPicture, type StepLine, type StepWorking, type WorkedStep } from '../../written-methods/tutor/stepWorking'

/*
 * Lesson 6 workings, one move a step (src/features/EXPLANATIONS.md). Adding and subtracting line the points up in columns
 * and work one column a step; multiplying and dividing are lines that show where every number comes from. Numbers are
 * handled as text, digit by digit, so no step ever shows a rounding error.
 */

const PLACES: Record<number, string> = { 2: 'hundreds', 1: 'tens', 0: 'units', [-1]: 'tenths', [-2]: 'hundredths', [-3]: 'thousandths' }
const ONE: Record<number, string> = { 2: 'hundred', 1: 'ten', 0: 'unit', [-1]: 'tenth', [-2]: 'hundredth', [-3]: 'thousandth' }
const decimalsOf = (n: string) => n.includes('.') ? n.split('.')[1].length : 0
const pad = (n: string, places: number) => places ? `${n.includes('.') ? n : `${n}.`}${'0'.repeat(places - decimalsOf(n))}` : n
/** Digits of a number lined up by column, column 0 being its last decimal place (in a sum with `places` decimals). */
const columnDigits = (n: string, places: number) => [...pad(n, places).replace('.', '')].reverse().map(Number)

/** Adding decimals in columns: line up the points (zeros fill the gaps), then add one column a step, from the right. */
export function decimalAddition(values: string[], given?: string): StepWorking {
  const places = Math.max(...values.map(decimalsOf))
  const digits = values.map(v => columnDigits(v, places))
  const width = Math.max(...digits.map(d => d.length))
  const base: ColumnsPicture = { kind: 'columns', op: '+', rows: values, padded: false }
  const steps: WorkedStep[] = []
  const needsPad = values.filter(v => decimalsOf(v) < places)
  if (needsPad.length) steps.push({
    title: 'Line up the points', why: 'Points go in one column, so each digit sits under a digit of the same value. Zeros fill the gaps.',
    picture: { ...base, padded: true }, lines: needsPad.map(v => says(`${v} → ${pad(v, places)}`)),
  })
  let answer = '', carry = 0
  let carries: NonNullable<ColumnsPicture['carries']> = []
  for (let col = 0; col < width; col++) {
    const present = digits.map(d => d[col]).filter(d => d !== undefined)
    const incoming = carry, sum = present.reduce((a, b) => a + b, 0), n = sum + incoming, last = col === width - 1
    answer = `${last ? n : n % 10}${answer}`
    carry = last ? 0 : Math.floor(n / 10)
    carries = carries.map(c => c.boxed ? { ...c, boxed: false, used: true } : c).map(c => incoming && c.col === col && !c.used ? { ...c, boxed: true } : c)
    if (carry) carries = [...carries, { col: col + 1, value: carry }]
    const lines: StepLine[] = present.length > 1
      ? [line(present.flatMap((d, i) => [...(i ? [sign('+')] : []), part(d, i === 0 ? 1 : 0)]), sum)]
      : [line([part(present[0], 1)], undefined, { mark: incoming ? undefined : 'nothing to add' })]
    if (incoming) lines.push(line([part(present.length > 1 ? sum : present[0]), sign('+'), part(incoming, 3, { boxed: true })], n))
    steps.push({
      title: `Add the ${PLACES[col - places]}`,
      why: last ? 'This is the last column, so write all of it.' : n > 9 ? 'Write the units digit here and carry the tens digit to the next column.' : 'Add the digits in this column.',
      picture: { ...base, padded: true, answer, focus: col, carries: [...carries], done: last }, lines,
    })
  }
  return { kind: 'step-worked', given, opening: base, steps }
}

/** Subtracting decimals in columns: line up the points, then one column a step, exchanging one from the left when needed. */
export function decimalSubtraction(first: string, second: string, given?: string): StepWorking {
  const places = Math.max(decimalsOf(first), decimalsOf(second))
  const top = columnDigits(first, places), bottom = columnDigits(second, places)
  const width = top.length
  const base: ColumnsPicture = { kind: 'columns', op: '−', rows: [first, second], padded: false }
  const steps: WorkedStep[] = []
  const needsPad = [first, second].filter(v => decimalsOf(v) < places)
  if (needsPad.length) steps.push({
    title: 'Line up the points', why: 'Points go in one column, so each digit sits under a digit of the same value. Zeros fill the gaps.',
    picture: { ...base, padded: true }, lines: needsPad.map(v => says(`${v} → ${pad(v, places)}`)),
  })
  let answer = ''
  const regroups: Array<{ col: number; to: number; boxed?: boolean }> = []
  const setRegroup = (col: number, to: number) => {
    const at = regroups.findIndex(r => r.col === col)
    if (at >= 0) regroups.splice(at, 1)
    regroups.push({ col, to, boxed: true })
  }
  const settle = () => regroups.forEach(r => { r.boxed = false })
  for (let col = 0; col < width; col++) {
    const b = bottom[col] ?? 0
    if (top[col] < b) {
      let from = col + 1
      while (top[from] === 0) from++
      for (let k = from; k > col; k--) {
        settle()
        top[k] -= 1; top[k - 1] += 10
        setRegroup(k, top[k]); setRegroup(k - 1, top[k - 1])
        steps.push({
          title: `Exchange 1 ${ONE[k - places]}`, why: `There aren't enough to take away, so change one from the next column into ten of this one.`,
          picture: { ...base, padded: true, answer, regroups: regroups.map(r => ({ ...r })) },
          lines: [line([part(1), part(ONE[k - places])], `10 ${PLACES[k - 1 - places]}`)],
        })
      }
    }
    settle()
    const last = col === width - 1, value = top[col] - b
    const leading = last && value === 0 && bottom[col] === undefined
    if (leading) { steps[steps.length - 1].picture = { ...steps[steps.length - 1].picture as ColumnsPicture, done: true }; break }
    answer = `${value}${answer}`
    const regrouped = regroups.some(r => r.col === col)
    steps.push({
      title: `Subtract the ${PLACES[col - places]}`,
      why: last ? 'This is the last column.' : 'Take the bottom digit from the top digit in this column.',
      picture: { ...base, padded: true, answer, focus: col, regroups: regroups.map(r => ({ ...r, boxed: false })), done: last || (col === width - 2 && top[width - 1] === 0 && bottom[width - 1] === undefined) },
      lines: [bottom[col] === undefined ? line([part(top[col], 1)], undefined, { mark: 'nothing to take' }) : line([part(top[col], 1, { boxed: regrouped }), sign('−'), part(b, 0)], value)],
    })
  }
  const end = steps[steps.length - 1]
  end.picture = { ...end.picture as ColumnsPicture, done: true }
  return { kind: 'step-worked', given, opening: base, steps }
}

const withPoint = (digits: string, places: number) => {
  if (!places) return digits
  const padded = digits.padStart(places + 1, '0')
  return `${padded.slice(0, -places)}.${padded.slice(-places)}`
}
const tidy = (n: string) => n.includes('.') ? n.replace(/0+$/, '').replace(/\.$/, '') : n

/** Multiplying decimals: count the decimal places, multiply without the points, then put the point back. */
export function decimalMultiplication(first: string, second: string, given?: string): StepWorking {
  const pa = decimalsOf(first), pb = decimalsOf(second), places = pa + pb
  const a = first.replace('.', '').replace(/^0+(?=\d)/, ''), b = second.replace('.', '').replace(/^0+(?=\d)/, '')
  const product = String(Number(a) * Number(b))
  const plural = (n: number) => `${n} decimal place${n === 1 ? '' : 's'}`
  const steps: WorkedStep[] = [
    { title: 'Count the decimal places', why: 'The answer has as many decimal places as the two numbers together.', lines: [says(`${first} → ${plural(pa)}`), says(`${second} → ${plural(pb)}`), ...(pa && pb ? [says(`${pa} + ${pb} → ${places}`)] : [])] },
    { title: 'Ignore the points', why: 'Multiply the whole numbers first.', lines: [first, second].filter(n => n.includes('.')).map(n => says(`${n} → ${n.replace('.', '').replace(/^0+(?=\d)/, '')}`)) },
  ]
  steps[0].title = 'Count decimal places'
  if (b.length === 1) steps.push({ title: 'Multiply', why: 'Multiply the whole numbers.', lines: [says(`${a} × ${b} → ${product}`)] })
  else {
    const rows = [...b].reverse().map((d, i) => ({ by: Number(d) * 10 ** i, value: Number(a) * Number(d) * 10 ** i }))
    rows.forEach(row => steps.push({ title: `Multiply by ${row.by}`, why: 'Split the second number into tens and units, and multiply by each part.', lines: [says(`${a} × ${row.by} → ${row.value}`)] }))
    steps.push({ title: 'Add the parts', why: 'The parts together make the whole multiplication.', lines: [says(`${rows.map(r => r.value).reverse().join(' + ')} → ${product}`)] })
  }
  const placed = withPoint(product, places), answer = tidy(placed)
  steps.push({
    title: 'Put the point back', why: `Count ${places} place${places === 1 ? '' : 's'} in from the right.${answer !== placed ? ' Zeros at the end of a decimal can go.' : ''}`,
    lines: answer === placed ? [says(`${product} → ${placed}`, true)] : [says(`${product} → ${placed}`), { ...says(`${placed} → ${answer}`, true), eq: true }],
  })
  return { kind: 'step-worked', given, trail: true, steps }
}

/** Dividing decimals: make the divisor whole (both numbers × 10), then short division, the point going straight up. */
export function decimalDivision(first: string, second: string, given?: string): StepWorking {
  const k = decimalsOf(second), scale = 10 ** k
  const shift = (n: string) => {
    if (!k) return n
    const [i, d = ''] = n.split('.')
    const digits = `${i}${d.padEnd(k, '0')}`
    const whole = digits.slice(0, i.length + k).replace(/^0+(?=\d)/, ''), rest = d.slice(k)
    return rest ? `${whole}.${rest}` : whole
  }
  const dividend = shift(first), divisor = shift(second)
  const d = Number(divisor)
  const steps: WorkedStep[] = []
  if (k) steps.push({
    title: 'Make the divisor whole', why: `Multiply both numbers by ${scale}. The answer stays the same.`,
    lines: [says(`${second} × ${scale} → ${divisor}`), says(`${first} × ${scale} → ${dividend}`)],
  })
  let remainder = 0, quotient = '', begun = false
  const carries: Array<{ index: number; value: number }> = []
  const chars = [...dividend]
  chars.forEach((c, index) => {
    const last = index === chars.length - 1
    if (c === '.') {
      quotient += '.'
      steps.push({ title: 'Point goes straight up', why: 'The point in the answer sits above the point in the number you divide.', picture: { kind: 'bus-stop', divisor, dividend, quotient, carries: [...carries], focus: index } })
      return
    }
    const amount = remainder * 10 + Number(c), q = Math.floor(amount / d)
    remainder = amount % d
    begun = begun || q > 0
    quotient += begun ? String(q) : ' '
    const next = chars[index + 1] === '.' ? index + 2 : index + 1
    if (remainder && !last) carries.push({ index: next, value: remainder })
    const lines = q ? [says(`${d} × ${q} → ${d * q}`), ...(remainder ? [says(`${amount} − ${d * q} → ${remainder}`)] : [])] : [line([part(d, 0), sign('won’t go into'), part(amount, 1)])]
    steps.push({
      title: `How many ${d}s?`, why: q ? `Find the biggest multiple of ${d} that fits.${remainder && !last ? ' Carry what’s left to the next digit.' : ''}` : `It won’t go, so carry it to the next digit.`,
      picture: { kind: 'bus-stop', divisor, dividend, quotient, carries: [...carries], focus: index, done: last }, lines,
    })
  })
  if (remainder) throw new Error(`${first} ÷ ${second} does not end`)
  return { kind: 'step-worked', given, opening: { kind: 'bus-stop', divisor: second, dividend: first, quotient: '', carries: [] }, steps }
}

/** The value of a digit: find its column, then multiply by the column's value. */
export function digitValue(number: string, digit: string, power: number): StepWorking {
  const unit = power >= 0 ? String(10 ** power) : `0.${'0'.repeat(-power - 1)}1`
  const value = power >= 0 ? String(Number(digit) * 10 ** power) : `0.${'0'.repeat(-power - 1)}${digit}`
  return { kind: 'step-worked', given: number, steps: [
    { title: 'Find its column', why: 'Count the places after the point: tenths, hundredths, thousandths.', lines: [line([part(digit, 3)], PLACES[power])] },
    { title: 'Work out its value', why: 'Multiply the digit by the value of its column.', lines: [line([part(digit, 3), sign('×'), part(unit, 0)], value, { answer: true })] },
  ] }
}

/** Rounding money to the nearest penny: keep two decimal places and look at the next digit. */
export function roundToPenny(amount: string): StepWorking {
  const [pounds, decimals] = amount.split('.')
  const kept = `${pounds}.${decimals.slice(0, 2)}`, next = Number(decimals[2])
  const up = next >= 5
  const rounded = (Math.round(Number(amount) * 100) / 100).toFixed(2)
  return { kind: 'step-worked', given: `£${amount}`, trail: true, steps: [
    { title: 'Keep two places', why: 'Pence are hundredths of a pound, so keep two decimal places.', lines: [line([part(kept, 0), sign('|'), part(decimals.slice(2), 1)])] },
    { title: 'The next digit', why: '5 or more rounds up; less than 5 keeps the last digit.', lines: [line([part(next, 1)], up ? 'round up' : 'keep it', { mark: up ? '5 or more' : 'less than 5' })] },
    { title: 'Round', why: up ? 'Add one to the last digit you keep.' : 'Keep the digits and drop the rest.', lines: [line([part(`£${kept}`)], `£${rounded}`, { answer: true })] },
  ] }
}

/** How many decimal places there are altogether in two numbers. */
export function countPlaces(first: string, second: string): StepWorking {
  const pa = decimalsOf(first), pb = decimalsOf(second)
  return { kind: 'step-worked', trail: true, steps: [
    { title: 'Count each one', why: 'Count the digits after each point.', lines: [says(`${first} → ${pa}`), says(`${second} → ${pb}`)] },
    { title: 'Add them', why: 'Together they give the decimal places in the answer.', lines: [says(`${pa} + ${pb} → ${pa + pb}`, true)] },
  ] }
}

/** Making a divisor whole: both numbers are multiplied by the same power of ten. */
export function scaleBoth(first: string, second: string): StepWorking {
  const k = decimalsOf(second), scale = 10 ** k
  const shifted = (n: string) => String(Math.round(Number(n) * scale * 1e6) / 1e6)
  return { kind: 'step-worked', trail: true, steps: [
    { title: 'The divisor', why: `Multiply by ${scale} to make it whole.`, lines: [says(`${second} × ${scale} → ${shifted(second)}`)] },
    { title: 'The number divided', why: 'Do the same to the other number, so the answer stays the same.', lines: [says(`${first} × ${scale} → ${shifted(first)}`, true)] },
  ] }
}
