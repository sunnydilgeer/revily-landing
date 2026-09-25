export type Carry = { place: number; value: number; row: 'ones' | 'tens' | 'sum' }
export type LongDivisionRow = { number: string; end: number; kind: 'subtract' | 'remainder' | 'bring-down' }
export type FactorSplit = { value: number; left: number; right: number }
export type NumberListFrame = {
  firstLabel: string; first: number[]
  secondLabel?: string; second?: number[]
  common?: number[]; hcf?: number; lcm?: number
}
export type VennFrame = {
  labels: [string, string]
  left: number[]; middle: number[]; right: number[]
  hcf?: number; lcm?: number
}
export type RoundingFrame = {
  original: string
  target: string
  kept: string
  decisionDigit: string
  remaining: string
  stage: 'identify' | 'decide' | 'result'
  roundsUp: boolean
  answer?: string
}
export type OrderingFrame = {
  values?: string[]
  comparison?: string
  answer?: string
}
export type MethodFrame = {
  ones?: string; tens?: string; total?: string; carry?: Carry
  quotient?: string; remainder?: number; divisionCarry?: { index: number; value: number }
  cells?: Record<string, number>
  longRows?: LongDivisionRow[]
  decimalRows?: string[]; decimalResult?: string; decimalNote?: string
  factorSplits?: FactorSplit[]; factorAnswer?: string
  numberLists?: NumberListFrame
  venn?: VennFrame
  rounding?: RoundingFrame
  ordering?: OrderingFrame
}
export type MethodStep = {
  title: string; operation: string; equation: string; instruction: string; frame: MethodFrame
  focus?: { topPlace?: number; factorPlace: number } | { dividendIndex: number; dividendStart?: number } | { cell: string }
}
export type MethodExample = {
  method: 'column' | 'grid' | 'division' | 'long-division' | 'decimal' | 'rounding' | 'ordering' | 'factor-tree' | 'number-lists' | 'venn'
  expression: string; label: string; first: number; second: number
  grid?: { first: number[]; second: number[] }
  steps: MethodStep[]
}
export type MethodWorking = { kind: 'method-worked'; examples: MethodExample[] }
const place = (i: number) => ['units', 'tens', 'hundreds', 'thousands', 'ten-thousands'][i] ?? `10^${i}`
const value = (n: number) => n.toLocaleString('en-GB')

export function columnWorking(first: number, second: number): MethodExample {
  const steps: MethodStep[] = []
  let frame: MethodFrame = {}
  const digits = String(first).split('').reverse().map(Number)
  const factors = String(second).split('').reverse().map(Number)
  factors.forEach((factor, shift) => {
    let carry = 0, partial = 0
    const row = shift ? 'tens' : 'ones'
    if (shift) {
      frame = { ...frame, carry: undefined, tens: '0' }
      steps.push({ title: 'Why the second row starts with 0', operation: `${factor}\\times10`, equation: `${factor}\\times10=${factor * 10}`, instruction: `The underlined ${factor} is worth ${factor * 10}. Multiplying by ${factor * 10} means multiplying by ${factor}, then by 10. That ×10 moves every product digit one column to the left, leaving 0 in the rightmost column. Write 0 there, then calculate the rest of the second row.`, frame, focus: { factorPlace: shift } })
    }
    digits.forEach((digit, i) => {
      const incoming = carry, product = digit * factor + incoming
      const last = i === digits.length - 1
      partial += (last ? product : product % 10) * 10 ** (i + shift)
      carry = last ? 0 : Math.floor(product / 10)
      const operation = `${factor}\\times${digit}${incoming ? `+${incoming}` : ''}`
      const written = last ? product : product % 10
      const base = digit * factor
      const instruction = `${factor} × ${digit} = ${base}.${incoming ? ` Now add the ${incoming} you carried over ${base} + ${incoming} = ${product}.` : ''} Write ${written}.${carry ? ` Carry over ${carry}.` : ''}${last ? ` So ${first} × ${factor * 10 ** shift} = ${value(partial)}.` : ''}`
      frame = { ...frame, [row]: String(partial).padStart(i + shift + 1, '0'), carry: carry ? { place: i + shift + 1, value: carry, row } : undefined }
      steps.push({ title: `Multiply by ${factor * 10 ** shift}`, operation, equation: `${operation}=${product}`, instruction, frame, focus: { topPlace: i, factorPlace: shift } })
    })
  })
  if (factors.length > 1) {
    const ones = Number(frame.ones), tens = Number(frame.tens)
    const width = Math.max(String(ones).length, String(tens).length)
    let carry = 0, sum = 0
    for (let i = 0; i < width; i++) {
      const a = Math.floor(ones / 10 ** i) % 10, b = Math.floor(tens / 10 ** i) % 10
      const incoming = carry, base = a + b
      const operation = `${a}+${b}${incoming ? `+${incoming}` : ''}`, n = base + incoming
      const last = i === width - 1
      sum += (last ? n : n % 10) * 10 ** i
      carry = last ? 0 : Math.floor(n / 10)
      frame = { ...frame, total: String(sum).padStart(i + 1, '0'), carry: carry ? { place: i + 1, value: carry, row: 'sum' } : undefined }
      steps.push({ title: 'Add the two rows', operation, equation: `${operation}=${n}`, instruction: `${a} + ${b} = ${base}.${incoming ? ` Now add the ${incoming} you carried over ${base} + ${incoming} = ${n}.` : ''} Write ${last ? n : n % 10}.${carry ? ` Carry over ${carry}.` : ''}${last ? ` So ${first} × ${second} = ${value(sum)}.` : ''}`, frame })
    }
  }
  return { method: 'column', expression: `${first}\\times${second}`, label: 'Column method', first, second, steps }
}

export function gridWorking(first: number, second: number): MethodExample {
  const a = [Math.floor(first / 10) * 10, first % 10], b = [Math.floor(second / 10) * 10, second % 10]
  const steps: MethodStep[] = [{ title: 'Split both numbers', operation: `${first}`, equation: `${first}=${a[0]}+${a[1]}`, instruction: `${first} = ${a[0]} + ${a[1]}; ${second} = ${b[0]} + ${b[1]}. Use these parts as the grid headings.`, frame: { cells: {} } }]
  let cells: Record<string, number> = {}
  const products: number[] = []
  a.forEach((n, row) => b.forEach((m, col) => {
    const result = n * m, key = `${row}-${col}`, operation = `${n}\\times${m}`
    products.push(result); cells = { ...cells, [key]: result }
    steps.push({ title: `Fill the ${n} × ${m} cell`, operation, equation: `${operation}=${result}`, instruction: `Write ${result} where row ${n} meets column ${m}.`, frame: { cells }, focus: { cell: key } })
  }))
  steps.push({ title: 'Add the four products', operation: products.join('+'), equation: `${products.join('+')}=${first * second}`, instruction: `The four cells cover the whole multiplication. ${first} × ${second} = ${value(first * second)}.`, frame: { cells, total: String(first * second) } })
  return { method: 'grid', expression: `${first}\\times${second}`, label: 'Grid method', first, second, grid: { first: a, second: b }, steps }
}

export function divisionWorking(first: number, second: number): MethodExample {
  const digits = String(first).split('').map(Number), steps: MethodStep[] = []
  let remainder = 0, quotient = '', begun = false
  digits.forEach((digit, index) => {
    const incoming = remainder, amount = incoming * 10 + digit, q = Math.floor(amount / second)
    remainder = amount % second
    begun = begun || q > 0
    quotient += begun ? q : ' '
    const p = digits.length - index - 1
    const operation = `${amount}\\div${second}`
    const equation = remainder ? `${amount}\\div${second}\\;\\longrightarrow\\;${q}\\;\\mathrm{r}\\,${remainder}` : `${operation}=${q}`
    const nextAmount = remainder * 10 + (digits[index + 1] ?? 0)
    let instruction = !begun ? `${second} does not fit into ${amount} ${place(p)}. Leave this quotient space blank.` : `Write ${q} above the ${place(p)}.`
    if (remainder && index < digits.length - 1) instruction += ` Carry ${remainder} ${place(p)}: ${remainder * 10} + ${digits[index + 1]} = ${nextAmount} ${place(p - 1)} for the next step.`
    else if (index === digits.length - 1) instruction += remainder ? ` ${remainder} left over is the final remainder.` : ' Nothing is left over.'
    if (q && remainder) instruction = `${second} × ${q} = ${second * q}; ${amount} - ${second * q} = ${remainder}. ` + instruction
    steps.push({ title: `Divide the ${place(p)}`, operation, equation, instruction, frame: { quotient, remainder: index === digits.length - 1 ? remainder : undefined, divisionCarry: remainder && index < digits.length - 1 ? { index: index + 1, value: remainder } : undefined }, focus: { dividendIndex: index } })
  })
  const q = Math.floor(first / second)
  steps.push({ title: 'Read and check the answer', operation: `${q}\\times${second}${remainder ? `+${remainder}` : ''}`, equation: `${q}\\times${second}${remainder ? `+${remainder}` : ''}=${first}`, instruction: `${first} ÷ ${second} = ${q}${remainder ? ` remainder ${remainder}. The remainder is smaller than ${second}` : ', with no remainder'}.`, frame: { quotient, remainder } })
  return { method: 'division', expression: `${first}\\div${second}`, label: 'Bus-stop method', first, second, steps }
}

export function longDivisionWorking(first: number, second: number): MethodExample {
  const digits = String(first).split('').map(Number), steps: MethodStep[] = []
  let end = 0, amount = digits[0]
  while (amount < second && end < digits.length - 1) amount = amount * 10 + digits[++end]
  let quotient = ' '.repeat(digits.length), rows: LongDivisionRow[] = [], frame: MethodFrame = { quotient, longRows: rows }
  const group = digits.slice(0, end + 1).map((digit, i) => `${digit}${end - i ? `\\times${10 ** (end - i)}` : ''}`).join('+')
  steps.push({ title: 'Choose the first group of digits', operation: group, equation: `${group}=${amount}`, instruction: `${second} does not fit into ${digits[0]}${end > 1 ? ` or ${Number(digits.slice(0, end).join(''))}` : ''}. Start with ${amount}, the first ${end + 1} digits. The first quotient digit goes above the ${place(digits.length - end - 1)}.`, frame, focus: { dividendStart: 0, dividendIndex: end } })
  while (true) {
    const q = Math.floor(amount / second), product = second * q, remainder = amount - product
    quotient = quotient.slice(0, end) + q + quotient.slice(end + 1)
    frame = { ...frame, quotient }
    steps.push({ title: `Divide ${amount} by ${second}`, operation: `${amount}\\div${second}`, equation: remainder ? `${amount}\\div${second}\\;\\longrightarrow\\;${q}\\;\\mathrm{r}\\,${remainder}` : `${amount}\\div${second}=${q}`, instruction: `${second} fits into ${amount} ${q === 1 ? 'once' : `${q} times`}: ${second} × ${q} = ${product}, while ${second} × ${q + 1} = ${second * (q + 1)} is too big. Write ${q} above the ${place(digits.length - end - 1)}.`, frame, focus: { dividendIndex: end } })
    rows = [...rows, { number: String(product), end, kind: 'subtract' }]
    frame = { ...frame, longRows: rows }
    steps.push({ title: 'Multiply', operation: `${second}\\times${q}`, equation: `${second}\\times${q}=${product}`, instruction: `Write ${product} under ${amount}, lining up the final digits. This is the multiple to subtract.`, frame })
    rows = [...rows, { number: String(remainder), end, kind: 'remainder' }]
    frame = { ...frame, longRows: rows, remainder: end === digits.length - 1 ? remainder : undefined }
    steps.push({ title: 'Subtract', operation: `${amount}-${product}`, equation: `${amount}-${product}=${remainder}`, instruction: `Subtract ${product} from ${amount}. Write ${remainder} below the line.${end === digits.length - 1 ? ` There are no digits left to bring down, so ${remainder} is the final remainder.` : ''}`, frame })
    if (end === digits.length - 1) break
    const nextDigit = digits[++end], nextAmount = remainder * 10 + nextDigit
    rows = [...rows.slice(0, -1), { number: String(nextAmount), end, kind: 'bring-down' }]
    frame = { ...frame, longRows: rows }
    steps.push({ title: `Bring down ${nextDigit}`, operation: `${remainder}\\times10+${nextDigit}`, equation: `${remainder}\\times10+${nextDigit}=${nextAmount}`, instruction: `Bring down the next digit, ${nextDigit}, beside the ${remainder} to make ${nextAmount}. Now repeat: divide, multiply, subtract.`, frame, focus: { dividendIndex: end } })
    amount = nextAmount
  }
  const q = Math.floor(first / second), remainder = first % second
  steps.push({ title: 'Read and check the answer', operation: `${q}\\times${second}+${remainder}`, equation: `${q}\\times${second}+${remainder}=${first}`, instruction: `${first} ÷ ${second} = ${q} remainder ${remainder}. The remainder ${remainder} is smaller than ${second}. Check: quotient × divisor + remainder = dividend.`, frame })
  return { method: 'long-division', expression: `${first}\\div${second}`, label: 'Long division', first, second, steps }
}
export const methodWorking = (...examples: MethodExample[]): MethodWorking => ({ kind: 'method-worked', examples })

const decimalPlaces = (value: number) => {
  const text = String(value)
  return text.includes('.') ? text.length - text.indexOf('.') - 1 : 0
}
const cleanDecimal = (value: number, places = decimalPlaces(value)) => value.toFixed(places).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')
const paddedDecimal = (value: number, places: number) => value.toFixed(places)
const decimalPlaceName = (columnFromRight: number, places: number) => {
  if (columnFromRight < places) return ['tenths', 'hundredths', 'thousandths', 'ten-thousandths'][places - columnFromRight - 1] ?? 'decimal place'
  return ['units', 'tens', 'hundreds', 'thousands'][columnFromRight - places] ?? 'whole-number place'
}
const maskedResult = (answer: string, revealedDigits: number) => {
  let remaining = revealedDigits
  return [...answer].reverse().map(char => {
    if (char === '.') return char
    if (remaining > 0) { remaining--; return char }
    return '·'
  }).reverse().join('')
}

export function decimalAdditionWorking(values: number[]): MethodExample {
  const places = Math.max(...values.map(decimalPlaces))
  const scale = 10 ** places
  const scaled = values.map(value => Math.round(value * scale))
  const total = scaled.reduce((sum, value) => sum + value, 0)
  const answer = paddedDecimal(total / scale, places)
  const width = Math.max(answer.replace('.', '').length, ...scaled.map(value => String(value).length))
  const digits = scaled.map(value => String(value).padStart(width, '0').split('').map(Number))
  const rows = values.map(value => paddedDecimal(value, places))
  const expression = values.map(value => cleanDecimal(value)).join('+')
  const steps: MethodStep[] = [{
    title: 'Line up the decimal points', operation: expression,
    equation: `${expression}=${rows.join('+')}`,
    instruction: `Write every decimal point in the same column. Add trailing zeroes where needed: ${rows.join(', ')}.`,
    frame: { decimalRows: rows, decimalResult: maskedResult(answer, 0), decimalNote: 'Decimal points aligned' },
  }]
  let carry = 0
  for (let column = width - 1, revealed = 1; column >= 0; column--, revealed++) {
    const addends = digits.map(row => row[column])
    const incoming = carry
    const sum = addends.reduce((n, digit) => n + digit, incoming)
    carry = column ? Math.floor(sum / 10) : 0
    const operation = `${addends.join('+')}${incoming ? `+${incoming}` : ''}`
    const placeColumn = width - column - 1
    steps.push({
      title: `Add the ${decimalPlaceName(placeColumn, places)}`, operation,
      equation: `${operation}=${sum}`,
      instruction: `${addends.join(' + ')}${incoming ? `, then add the ${incoming} carried over` : ''} gives ${sum}. Write ${column ? sum % 10 : sum}.${carry ? ` Carry ${carry} into the next column.` : ''}`,
      frame: { decimalRows: rows, decimalResult: maskedResult(answer, revealed), decimalNote: `Working from right to left: ${decimalPlaceName(placeColumn, places)}` },
    })
  }
  steps.push({ title: 'Read the aligned answer', operation: expression, equation: `${expression}=${cleanDecimal(total / scale, places)}`, instruction: `Keep the decimal point in the aligned column. The sum is ${cleanDecimal(total / scale, places)}.`, frame: { decimalRows: rows, decimalResult: answer, decimalNote: 'Complete sum' } })
  return { method: 'decimal', expression, label: 'Decimal addition', first: values[0], second: values[1] ?? 0, steps }
}

export function decimalSubtractionWorking(first: number, second: number): MethodExample {
  const places = Math.max(decimalPlaces(first), decimalPlaces(second))
  const scale = 10 ** places
  const topValue = Math.round(first * scale), bottomValue = Math.round(second * scale), difference = topValue - bottomValue
  const answer = paddedDecimal(difference / scale, places)
  const width = Math.max(String(topValue).length, String(bottomValue).length)
  const top = String(topValue).padStart(width, '0').split('').map(Number)
  const bottom = String(bottomValue).padStart(width, '0').split('').map(Number)
  const rows = [paddedDecimal(first, places), `− ${paddedDecimal(second, places)}`]
  const expression = `${cleanDecimal(first)}-${cleanDecimal(second)}`
  const steps: MethodStep[] = [{ title: 'Line up the decimal points', operation: expression, equation: `${expression}=${paddedDecimal(first, places)}-${paddedDecimal(second, places)}`, instruction: `Line up equal place values and fill empty decimal places with zeroes.`, frame: { decimalRows: rows, decimalResult: maskedResult(answer, 0), decimalNote: 'Decimal points aligned' } }]
  const firstResultColumn = width - String(difference).length
  for (let column = width - 1, revealed = 1; column >= firstResultColumn; column--, revealed++) {
    let regrouped = false
    if (top[column] < bottom[column]) {
      let lender = column - 1
      while (lender >= 0 && top[lender] === 0) lender--
      if (lender >= 0) {
        top[lender]--
        for (let i = lender + 1; i < column; i++) top[i] += 9
        top[column] += 10
        regrouped = true
      }
    }
    const result = top[column] - bottom[column]
    const operation = `${top[column]}-${bottom[column]}`
    const placeColumn = width - column - 1
    steps.push({ title: `Subtract the ${decimalPlaceName(placeColumn, places)}`, operation, equation: `${operation}=${result}`, instruction: `${regrouped ? 'Regroup from the next available column. ' : ''}${top[column]} - ${bottom[column]} = ${result}. Write ${result} in the ${decimalPlaceName(placeColumn, places)} column.`, frame: { decimalRows: rows, decimalResult: maskedResult(answer, revealed), decimalNote: regrouped ? 'Regrouped one place at a time' : `Subtract the ${decimalPlaceName(placeColumn, places)}` } })
  }
  steps.push({ title: 'Read the difference', operation: expression, equation: `${expression}=${cleanDecimal(difference / scale, places)}`, instruction: `Keep the decimal point in its aligned column. The difference is ${cleanDecimal(difference / scale, places)}.`, frame: { decimalRows: rows, decimalResult: answer, decimalNote: 'Complete difference' } })
  return { method: 'decimal', expression, label: 'Decimal subtraction', first, second, steps }
}

function decimalPlacementExample(first: number, second: number): MethodExample {
  const firstPlaces = decimalPlaces(first), secondPlaces = decimalPlaces(second), totalPlaces = firstPlaces + secondPlaces
  const wholeFirst = Math.round(first * 10 ** firstPlaces), wholeSecond = Math.round(second * 10 ** secondPlaces)
  const wholeProduct = wholeFirst * wholeSecond, product = first * second
  const expression = `${cleanDecimal(first)}\\times${cleanDecimal(second)}`
  const steps: MethodStep[] = [
    { title: 'Count the decimal places', operation: `${firstPlaces}+${secondPlaces}`, equation: `${firstPlaces}+${secondPlaces}=${totalPlaces}`, instruction: `${cleanDecimal(first)} has ${firstPlaces} decimal ${firstPlaces === 1 ? 'place' : 'places'} and ${cleanDecimal(second)} has ${secondPlaces}. The product needs ${totalPlaces} decimal ${totalPlaces === 1 ? 'place' : 'places'} altogether.`, frame: { decimalRows: [`${cleanDecimal(first)} → ${firstPlaces} place${firstPlaces === 1 ? '' : 's'}`, `${cleanDecimal(second)} → ${secondPlaces} place${secondPlaces === 1 ? '' : 's'}`], decimalNote: `${totalPlaces} decimal places altogether` } },
    { title: 'Restore the decimal point', operation: `${wholeProduct}\\div${10 ** totalPlaces}`, equation: `${wholeProduct}\\div${10 ** totalPlaces}=${cleanDecimal(product, totalPlaces)}`, instruction: `Starting at the right of ${wholeProduct}, count ${totalPlaces} places to the left. This gives ${cleanDecimal(product, totalPlaces)}.`, frame: { decimalRows: [`Whole-number product: ${wholeProduct}`, `Move ${totalPlaces} place${totalPlaces === 1 ? '' : 's'} left`], decimalResult: cleanDecimal(product, totalPlaces), decimalNote: 'Decimal point restored' } },
    { title: 'State the product', operation: expression, equation: `${expression}=${cleanDecimal(product, totalPlaces)}`, instruction: `${cleanDecimal(first)} × ${cleanDecimal(second)} = ${cleanDecimal(product, totalPlaces)}. Remove unnecessary trailing zeroes only at the end.`, frame: { decimalRows: [cleanDecimal(first), `× ${cleanDecimal(second)}`], decimalResult: cleanDecimal(product, totalPlaces), decimalNote: 'Complete product' } },
  ]
  return { method: 'decimal', expression, label: 'Place the decimal point', first, second, steps }
}

export function decimalMultiplicationWorking(first: number, second: number): MethodWorking {
  const aPlaces = decimalPlaces(first), bPlaces = decimalPlaces(second)
  const wholeFirst = Math.round(first * 10 ** aPlaces), wholeSecond = Math.round(second * 10 ** bPlaces)
  const whole = { ...columnWorking(wholeFirst, wholeSecond), label: 'Whole-number multiplication' }
  return methodWorking(whole, decimalPlacementExample(first, second))
}

export function decimalDivisionWorking(first: number, second: number): MethodExample {
  const scale = 10 ** decimalPlaces(second)
  const scaledFirst = Number((first * scale).toFixed(decimalPlaces(first))), scaledSecond = Math.round(second * scale), quotient = first / second
  const expression = `${cleanDecimal(first)}\\div${cleanDecimal(second)}`
  const steps: MethodStep[] = []
  if (scale > 1) steps.push({ title: 'Make the divisor a whole number', operation: `${cleanDecimal(second)}\\times${scale}`, equation: `${cleanDecimal(second)}\\times${scale}=${cleanDecimal(scaledSecond)}`, instruction: `Multiply the divisor by ${scale}. Apply exactly the same multiplication to the dividend so the quotient does not change.`, frame: { decimalRows: [`Dividend: ${cleanDecimal(first)} × ${scale} = ${cleanDecimal(scaledFirst)}`, `Divisor: ${cleanDecimal(second)} × ${scale} = ${cleanDecimal(scaledSecond)}`], decimalNote: `Both numbers × ${scale}` } })
  else steps.push({ title: 'The divisor is already whole', operation: `${cleanDecimal(second)}`, equation: `${cleanDecimal(second)}=${cleanDecimal(scaledSecond)}`, instruction: `No scaling is needed because ${cleanDecimal(second)} is already a whole number.`, frame: { decimalRows: [`Dividend: ${cleanDecimal(first)}`, `Divisor: ${cleanDecimal(second)}`], decimalNote: 'Ready to divide' } })
  steps.push({ title: 'Write the equivalent division', operation: expression, equation: `${expression}=${cleanDecimal(scaledFirst)}\\div${cleanDecimal(scaledSecond)}`, instruction: `The equivalent calculation is ${cleanDecimal(scaledFirst)} ÷ ${cleanDecimal(scaledSecond)}.`, frame: { decimalRows: [`${cleanDecimal(first)} ÷ ${cleanDecimal(second)}`, `= ${cleanDecimal(scaledFirst)} ÷ ${cleanDecimal(scaledSecond)}`], decimalNote: 'Same quotient' } })
  const quotientText = cleanDecimal(quotient, Math.max(decimalPlaces(first), decimalPlaces(second)) + 2)
  const [wholeText, fractionText = ''] = quotientText.split('.')
  const parts: Array<{ value: number; places: number }> = []
  ;[...wholeText].forEach((digit, index) => { const value = Number(digit) * 10 ** (wholeText.length - index - 1); if (value) parts.push({ value, places: 0 }) })
  ;[...fractionText].forEach((digit, index) => { const value = Number(digit) / 10 ** (index + 1); if (value) parts.push({ value, places: index + 1 }) })
  let built = 0
  for (const part of parts) {
    const partText = cleanDecimal(part.value, part.places)
    const productText = cleanDecimal(scaledSecond * part.value, part.places)
    const operation = `${cleanDecimal(scaledSecond)}\\times${partText}`
    built += part.value
    const builtText = cleanDecimal(built, fractionText.length)
    steps.push({ title: `Build the quotient with ${partText}`, operation, equation: `${operation}=${productText}`, instruction: `${cleanDecimal(scaledSecond)} × ${partText} = ${productText}. The quotient built so far is ${builtText}.`, frame: { decimalRows: [`${cleanDecimal(scaledFirst)} ÷ ${cleanDecimal(scaledSecond)}`, `${cleanDecimal(scaledSecond)} × ${partText} = ${productText}`], decimalResult: builtText, decimalNote: 'Quotient so far' } })
  }
  steps.push({ title: 'Read the quotient', operation: expression, equation: `${expression}=${cleanDecimal(quotient)}`, instruction: `${cleanDecimal(first)} ÷ ${cleanDecimal(second)} = ${cleanDecimal(quotient)}. Scaling both numbers preserved the value.`, frame: { decimalRows: [`${cleanDecimal(scaledFirst)} ÷ ${cleanDecimal(scaledSecond)}`], decimalResult: cleanDecimal(quotient), decimalNote: 'Complete quotient' } })
  return { method: 'decimal', expression, label: 'Decimal division', first, second, steps }
}

const smallestPrimeFactor = (value: number) => {
  for (let candidate = 2; candidate <= Math.sqrt(value); candidate++) if (value % candidate === 0) return candidate
  return value
}
export const primeFactors = (value: number) => {
  const factors: number[] = []
  let remaining = value
  while (remaining > 1) { const factor = smallestPrimeFactor(remaining); factors.push(factor); remaining /= factor }
  return factors
}
export const primeFactorLatex = (value: number) => {
  const counts = new Map<number, number>()
  for (const factor of primeFactors(value)) counts.set(factor, (counts.get(factor) ?? 0) + 1)
  return [...counts].map(([factor, power]) => power === 1 ? String(factor) : `${factor}^{${power}}`).join('\\times')
}

export function factorTreeWorking(value: number): MethodExample {
  const steps: MethodStep[] = [], splits: FactorSplit[] = []
  let branch = value
  while (smallestPrimeFactor(branch) !== branch) {
    const left = smallestPrimeFactor(branch), right = branch / left
    splits.push({ value: branch, left, right })
    const operation = `${left}\\times${right}`
    steps.push({ title: `Split ${branch} into a factor pair`, operation, equation: `${branch}=${operation}`, instruction: `${branch} = ${left} × ${right}. ${left} is prime${smallestPrimeFactor(right) === right ? ` and ${right} is prime, so this branch is complete.` : `; continue splitting ${right}.`}`, frame: { factorSplits: [...splits] } })
    branch = right
  }
  const expanded = primeFactors(value).join('\\times'), indexed = primeFactorLatex(value)
  steps.push({ title: 'Collect every prime at the ends', operation: expanded, equation: `${value}=${expanded}`, instruction: `Every branch now ends in a prime. The prime factors are ${primeFactors(value).join(', ')}.`, frame: { factorSplits: splits, factorAnswer: `${value} = ${expanded}` } })
  steps.push({ title: 'Write repeated factors in index form', operation: indexed, equation: `${value}=${indexed}`, instruction: `Group repeated prime factors as powers: ${value} = ${indexed.replace(/\^\{(\d+)\}/g, '^$1').replace(/\\times/g, ' × ')}.`, frame: { factorSplits: splits, factorAnswer: `${value} = ${indexed}` } })
  return { method: 'factor-tree', expression: String(value), label: 'Factor tree', first: value, second: 1, steps }
}

const factors = (value: number) => Array.from({ length: value }, (_, index) => index + 1).filter(candidate => value % candidate === 0)
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a)
const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b)
export function listingWorking(first: number, second: number, mode: 'both' | 'hcf' = 'both'): MethodExample {
  const firstFactors = factors(first), secondFactors = factors(second)
  const common = firstFactors.filter(value => secondFactors.includes(value)), highest = Math.max(...common), lowest = lcm(first, second)
  const base: NumberListFrame = { firstLabel: `Factors of ${first}`, first: firstFactors }
  const steps: MethodStep[] = [
    { title: `List every factor of ${first}`, operation: String(first), equation: `\\{${firstFactors.join(',')}\\}`, instruction: `These are all the whole numbers that divide ${first} exactly.`, frame: { numberLists: base } },
    { title: `List every factor of ${second}`, operation: String(second), equation: `\\{${secondFactors.join(',')}\\}`, instruction: `List the factors in order so shared values are easy to compare.`, frame: { numberLists: { ...base, secondLabel: `Factors of ${second}`, second: secondFactors } } },
    { title: 'Choose the highest common factor', operation: common.join(','), equation: `\\operatorname{HCF}(${first},${second})=${highest}`, instruction: `${common.join(', ')} appear in both lists. The greatest is ${highest}, so the HCF is ${highest}.`, frame: { numberLists: { ...base, secondLabel: `Factors of ${second}`, second: secondFactors, common, hcf: highest } } },
  ]
  if (mode === 'both') {
    const firstMultiples = Array.from({ length: lowest / first }, (_, index) => first * (index + 1))
    const secondMultiples = Array.from({ length: lowest / second }, (_, index) => second * (index + 1))
    steps.push({ title: `List multiples of ${first}`, operation: String(first), equation: firstMultiples.join(','), instruction: `Count in ${first}s until a value can appear in both lists.`, frame: { numberLists: { firstLabel: `Multiples of ${first}`, first: firstMultiples } } })
    steps.push({ title: `List multiples of ${second}`, operation: String(second), equation: secondMultiples.join(','), instruction: `${lowest} is the first value that appears in both multiple lists.`, frame: { numberLists: { firstLabel: `Multiples of ${first}`, first: firstMultiples, secondLabel: `Multiples of ${second}`, second: secondMultiples, common: [lowest] } } })
    steps.push({ title: 'Choose the lowest common multiple', operation: String(lowest), equation: `\\operatorname{LCM}(${first},${second})=${lowest}`, instruction: `The first shared positive multiple is ${lowest}, so the LCM is ${lowest}.`, frame: { numberLists: { firstLabel: `Multiples of ${first}`, first: firstMultiples, secondLabel: `Multiples of ${second}`, second: secondMultiples, common: [lowest], hcf: highest, lcm: lowest } } })
  }
  return { method: 'number-lists', expression: mode === 'both' ? `\\operatorname{HCF/LCM}(${first},${second})` : `\\operatorname{HCF}(${first},${second})`, label: 'Listing method', first, second, steps }
}

export function multiplesWorking(value: number, count: number): MethodExample {
  const values = Array.from({ length: count }, (_, index) => value * (index + 1)), steps: MethodStep[] = []
  values.forEach((multiple, index) => steps.push({ title: `Find multiple ${index + 1}`, operation: `${value}\\times${index + 1}`, equation: `${value}\\times${index + 1}=${multiple}`, instruction: `Multiply ${value} by ${index + 1}. The ${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} positive multiple is ${multiple}.`, frame: { numberLists: { firstLabel: `First ${count} multiples of ${value}`, first: values.slice(0, index + 1) } } }))
  return { method: 'number-lists', expression: `${value},2\\times${value},3\\times${value},\\ldots`, label: 'Multiples', first: value, second: count, steps }
}

export function vennWorking(first: number, second: number, labels: [string, string] = [String(first), String(second)]): MethodExample {
  const a = primeFactors(first), b = primeFactors(second), remaining = [...b], middle: number[] = [], left: number[] = []
  for (const factor of a) { const index = remaining.indexOf(factor); if (index >= 0) { middle.push(factor); remaining.splice(index, 1) } else left.push(factor) }
  const right = remaining, highest = gcd(first, second), lowest = lcm(first, second)
  const steps: MethodStep[] = [
    { title: `Prime-factorise ${labels[0]}`, operation: primeFactorLatex(first), equation: `${labels[0]}=${primeFactorLatex(first)}`, instruction: `Write ${labels[0]} as prime factors before placing anything in the diagram.`, frame: { venn: { labels, left: a, middle: [], right: [] } } },
    { title: `Prime-factorise ${labels[1]}`, operation: primeFactorLatex(second), equation: `${labels[1]}=${primeFactorLatex(second)}`, instruction: `Now write ${labels[1]} as prime factors and compare repeated copies one by one.`, frame: { venn: { labels, left: a, middle: [], right: b } } },
    { title: 'Place shared copies in the intersection', operation: middle.join('\\times'), equation: `\\text{shared}= ${middle.join('\\times')}`, instruction: `Match each shared copy only once. Put ${middle.join(', ')} in the overlap.`, frame: { venn: { labels, left, middle, right } } },
    { title: 'Multiply the intersection for the HCF', operation: middle.join('\\times'), equation: `${middle.join('\\times')}=${highest}`, instruction: `Only the intersection belongs to both numbers. Its product is the HCF: ${highest}.`, frame: { venn: { labels, left, middle, right, hcf: highest } } },
    { title: 'Multiply every region for the LCM', operation: [...left, ...middle, ...right].join('\\times'), equation: `${[...left, ...middle, ...right].join('\\times')}=${lowest}`, instruction: `Use every factor in the union, counting the shared copies once. Their product is the LCM: ${lowest}.`, frame: { venn: { labels, left, middle, right, hcf: highest, lcm: lowest } } },
  ]
  return { method: 'venn', expression: `\\operatorname{HCF/LCM}(${labels[0]},${labels[1]})`, label: 'Prime-factor Venn diagram', first, second, steps }
}

export function methodProgress(visual: MethodWorking, revealed: number) {
  const total = visual.examples.reduce((n, e) => n + e.steps.length, 0)
  let before = 0
  const working = visual.examples.map(example => {
    const count = Math.max(0, Math.min(example.steps.length, revealed - before))
    before += example.steps.length
    return { example, count, start: before - example.steps.length }
  })
  const activeIndex = working.findIndex(w => revealed <= w.start + w.example.steps.length)
  const active = activeIndex < 0 ? working.length - 1 : activeIndex
  const current = working[active].example.steps[working[active].count - 1]
  const completed = working.flatMap(({ example, count }, index) => example.steps.slice(0, count).map((step, i) => ({ step, example, index, number: i + 1 })))
  return { total, working, active, current, completed }
}
