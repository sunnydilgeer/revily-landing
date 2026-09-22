export type FractionDisplay = {
  numerator: number
  denominator: number
  whole?: number
  label?: string
  tone?: 'source' | 'equivalent' | 'result'
}

export type FractionFrame = {
  kind: 'bars' | 'mixed' | 'area' | 'reciprocal' | 'amount' | 'flow'
  values?: FractionDisplay[]
  amount?: number
  currency?: boolean
  parts?: number
  selectedParts?: number
  unitValue?: number
  note?: string
}

export type FractionStep = {
  title: string
  equation: string
  instruction: string
  frame: FractionFrame
}

export type FractionWorking = {
  kind: 'fraction-worked'
  expression: string
  label: string
  steps: FractionStep[]
}

export type MixedValue = { whole: number; numerator: number; denominator: number }
export type FractionValue = { numerator: number; denominator: number }

const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a)
const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b)
const hcfMany = (values: number[]) => values.reduce(gcd)

export function reduceFraction(numerator: number, denominator: number): FractionValue {
  const factor = gcd(numerator, denominator)
  return { numerator: numerator / factor, denominator: denominator / factor }
}

export function rationalText(numerator: number, denominator: number, mixed = true): string {
  const reduced = reduceFraction(numerator, denominator)
  if (reduced.denominator === 1) return String(reduced.numerator)
  if (mixed && reduced.numerator > reduced.denominator) {
    const whole = Math.floor(reduced.numerator / reduced.denominator)
    const remainder = reduced.numerator % reduced.denominator
    return remainder ? `${whole} ${remainder}/${reduced.denominator}` : String(whole)
  }
  return `${reduced.numerator}/${reduced.denominator}`
}

export function rationalLatex(numerator: number, denominator: number, mixed = true): string {
  const text = rationalText(numerator, denominator, mixed)
  const mixedMatch = text.match(/^(\d+) (\d+)\/(\d+)$/)
  if (mixedMatch) return `${mixedMatch[1]}\\frac{${mixedMatch[2]}}{${mixedMatch[3]}}`
  const fraction = text.match(/^(\d+)\/(\d+)$/)
  return fraction ? `\\frac{${fraction[1]}}{${fraction[2]}}` : text
}

const rawLatex = (numerator: number, denominator: number) => denominator === 1 ? String(numerator) : `\\frac{${numerator}}{${denominator}}`
const valueFrame = (numerator: number, denominator: number, tone: FractionDisplay['tone'] = 'source', label?: string): FractionDisplay => ({ numerator, denominator, tone, label })

export function simplifyFractionWorking(numerator: number, denominator: number): FractionWorking {
  const factor = gcd(numerator, denominator), reduced = reduceFraction(numerator, denominator)
  return {
    kind: 'fraction-worked', expression: rawLatex(numerator, denominator), label: 'Simplify a fraction', steps: [
      { title: 'Find the highest common factor', equation: `\\operatorname{HCF}(${numerator},${denominator})=${factor}`, instruction: `${factor} is the greatest number that divides both ${numerator} and ${denominator} exactly.`, frame: { kind: 'bars', values: [valueFrame(numerator, denominator)], note: `HCF = ${factor}` } },
      { title: 'Divide the numerator and denominator', equation: `\\frac{${numerator}\\div${factor}}{${denominator}\\div${factor}}=\\frac{${reduced.numerator}}{${reduced.denominator}}`, instruction: `Divide both parts by the same factor so the value of the fraction does not change.`, frame: { kind: 'bars', values: [valueFrame(numerator, denominator), valueFrame(reduced.numerator, reduced.denominator, 'equivalent')], note: `Both parts ÷ ${factor}` } },
      { title: 'Check that it is fully simplified', equation: `${rawLatex(numerator, denominator)}=${rawLatex(reduced.numerator, reduced.denominator)}`, instruction: `${reduced.numerator} and ${reduced.denominator} have no common factor greater than 1.`, frame: { kind: 'bars', values: [valueFrame(reduced.numerator, reduced.denominator, 'result')], note: 'Simplest form' } },
    ],
  }
}

export function equivalentFractionWorking(numerator: number, denominator: number, targetDenominator: number): FractionWorking {
  const scale = targetDenominator / denominator, targetNumerator = numerator * scale
  return {
    kind: 'fraction-worked', expression: `${rawLatex(numerator, denominator)}=\\frac{?}{${targetDenominator}}`, label: 'Equivalent fraction', steps: [
      { title: 'Find the scale factor', equation: `${targetDenominator}\\div${denominator}=${scale}`, instruction: `The denominator is multiplied by ${scale}.`, frame: { kind: 'bars', values: [valueFrame(numerator, denominator)], note: `Denominator × ${scale}` } },
      { title: 'Scale the numerator by the same amount', equation: `${numerator}\\times${scale}=${targetNumerator}`, instruction: `Multiply the numerator by the same ${scale} to keep the fraction equivalent.`, frame: { kind: 'bars', values: [valueFrame(numerator, denominator), valueFrame(targetNumerator, targetDenominator, 'equivalent')], note: `Both parts × ${scale}` } },
      { title: 'State the equivalent fraction', equation: `${rawLatex(numerator, denominator)}=${rawLatex(targetNumerator, targetDenominator)}`, instruction: `Both fractions represent the same proportion.`, frame: { kind: 'bars', values: [valueFrame(targetNumerator, targetDenominator, 'result')], note: 'Equivalent value' } },
    ],
  }
}

export function mixedToImproperWorking(whole: number, numerator: number, denominator: number): FractionWorking {
  const improper = whole * denominator + numerator
  return {
    kind: 'fraction-worked', expression: `${whole}\\frac{${numerator}}{${denominator}}`, label: 'Mixed number to improper fraction', steps: [
      { title: 'Count the parts in the whole numbers', equation: `${whole}\\times${denominator}=${whole * denominator}`, instruction: `Each whole contains ${denominator} ${denominator === 1 ? 'part' : 'equal parts'}, so ${whole} wholes contain ${whole * denominator} parts.`, frame: { kind: 'mixed', values: [{ whole, numerator, denominator }], note: `${whole} wholes = ${whole * denominator}/${denominator}` } },
      { title: 'Add the remaining numerator', equation: `${whole * denominator}+${numerator}=${improper}`, instruction: `Add the ${numerator} extra ${numerator === 1 ? 'part' : 'parts'}.`, frame: { kind: 'mixed', values: [valueFrame(improper, denominator, 'equivalent')], note: 'Keep the denominator' } },
      { title: 'Write the improper fraction', equation: `${whole}\\frac{${numerator}}{${denominator}}=${rawLatex(improper, denominator)}`, instruction: `The denominator remains ${denominator}.`, frame: { kind: 'mixed', values: [valueFrame(improper, denominator, 'result')], note: 'Improper fraction' } },
    ],
  }
}

export function improperToMixedWorking(numerator: number, denominator: number): FractionWorking {
  const whole = Math.floor(numerator / denominator), remainder = numerator % denominator
  return {
    kind: 'fraction-worked', expression: rawLatex(numerator, denominator), label: 'Improper fraction to mixed number', steps: [
      { title: 'Divide to find the whole-number part', equation: `${numerator}\\div${denominator}=${whole}\\;\\mathrm{r}\\;${remainder}`, instruction: `${denominator} fits into ${numerator} ${whole} times, with ${remainder} left over.`, frame: { kind: 'mixed', values: [valueFrame(numerator, denominator)], note: `${whole} complete wholes` } },
      { title: 'Use the remainder as the new numerator', equation: `${rawLatex(numerator, denominator)}=${whole}\\frac{${remainder}}{${denominator}}`, instruction: `The remainder becomes the numerator and the denominator stays ${denominator}.`, frame: { kind: 'mixed', values: [{ whole, numerator: remainder, denominator, tone: 'equivalent' }], note: 'Remainder over the original denominator' } },
      { title: 'Check by converting back', equation: `${whole}\\times${denominator}+${remainder}=${numerator}`, instruction: `The reverse calculation returns the original numerator, so the conversion is correct.`, frame: { kind: 'mixed', values: [{ whole, numerator: remainder, denominator, tone: 'result' }], note: 'Conversion checked' } },
    ],
  }
}

export function addSubtractFractionsWorking(values: FractionValue[], operation: 'add' | 'subtract'): FractionWorking {
  const denominator = values.map(value => value.denominator).reduce(lcm)
  const converted = values.map(value => ({ numerator: value.numerator * (denominator / value.denominator), denominator }))
  const numerator = operation === 'add'
    ? converted.reduce((sum, value) => sum + value.numerator, 0)
    : converted.slice(1).reduce((difference, value) => difference - value.numerator, converted[0].numerator)
  const symbol = operation === 'add' ? '+' : '-'
  const expression = values.map(value => rawLatex(value.numerator, value.denominator)).join(symbol)
  const combined = rawLatex(numerator, denominator), final = rationalLatex(numerator, denominator)
  const alreadyCommon = values.every(value => value.denominator === denominator)
  const steps: FractionStep[] = [
    { title: alreadyCommon ? 'Keep the common denominator' : 'Find a common denominator', equation: `\\operatorname{LCM}(${values.map(value => value.denominator).join(',')})=${denominator}`, instruction: alreadyCommon ? `Every fraction is already divided into ${denominator} equal parts.` : `${denominator} is the smallest denominator that every fraction can use.`, frame: { kind: 'bars', values: values.map(value => valueFrame(value.numerator, value.denominator)), note: `Common denominator: ${denominator}` } },
    { title: 'Write equivalent fractions', equation: converted.map(value => rawLatex(value.numerator, value.denominator)).join(symbol), instruction: `Scale each numerator by the same factor used on its denominator.`, frame: { kind: 'bars', values: converted.map(value => ({ ...value, tone: 'equivalent' })), note: 'Equal-sized parts' } },
    { title: `${operation === 'add' ? 'Add' : 'Subtract'} the numerators`, equation: `${converted.map(value => value.numerator).join(symbol)}=${numerator}`, instruction: `${operation === 'add' ? 'Add' : 'Subtract'} the numerators and keep the common denominator ${denominator}.`, frame: { kind: 'bars', values: [valueFrame(numerator, denominator, 'equivalent')], note: `${expression} = ${numerator}/${denominator}` } },
  ]
  if (combined !== final || numerator > denominator) steps.push({ title: 'Simplify and convert if needed', equation: `${combined}=${final}`, instruction: `Give the result in simplest form${numerator > denominator ? ' and write it as a mixed number' : ''}.`, frame: { kind: 'mixed', values: [{ numerator: reduceFraction(numerator, denominator).numerator, denominator: reduceFraction(numerator, denominator).denominator, tone: 'result' }], note: rationalText(numerator, denominator) } })
  else steps.push({ title: 'State the result', equation: `${expression}=${final}`, instruction: `The fraction is already in simplest form.`, frame: { kind: 'bars', values: [valueFrame(numerator, denominator, 'result')], note: rationalText(numerator, denominator) } })
  return { kind: 'fraction-worked', expression, label: operation === 'add' ? 'Add fractions' : 'Subtract fractions', steps }
}

export function multiplyFractionsWorking(first: FractionValue, second: FractionValue, cancelFirst = false): FractionWorking {
  const numerator = first.numerator * second.numerator, denominator = first.denominator * second.denominator
  const result = reduceFraction(numerator, denominator), expression = `${rawLatex(first.numerator, first.denominator)}\\times${rawLatex(second.numerator, second.denominator)}`
  const crossA = gcd(first.numerator, second.denominator), crossB = gcd(second.numerator, first.denominator)
  const steps: FractionStep[] = []
  if (cancelFirst && (crossA > 1 || crossB > 1)) steps.push({ title: 'Cancel common factors first', equation: `\\frac{${first.numerator / crossA}}{${first.denominator / crossB}}\\times\\frac{${second.numerator / crossB}}{${second.denominator / crossA}}`, instruction: `Divide a numerator and a denominator by the same common factor. This keeps the product equal but makes the multiplication smaller.`, frame: { kind: 'area', values: [valueFrame(first.numerator, first.denominator), valueFrame(second.numerator, second.denominator)], note: 'Cross-cancel equal factors' } })
  steps.push({ title: 'Multiply across', equation: `\\frac{${first.numerator}\\times${second.numerator}}{${first.denominator}\\times${second.denominator}}=\\frac{${numerator}}{${denominator}}`, instruction: `Multiply the numerators together and multiply the denominators together.`, frame: { kind: 'area', values: [valueFrame(first.numerator, first.denominator), valueFrame(second.numerator, second.denominator), valueFrame(numerator, denominator, 'equivalent')], note: 'Numerator × numerator; denominator × denominator' } })
  steps.push({ title: 'Simplify the product', equation: `${rawLatex(numerator, denominator)}=${rationalLatex(numerator, denominator)}`, instruction: `Divide the numerator and denominator by their highest common factor, ${gcd(numerator, denominator)}.`, frame: { kind: 'area', values: [valueFrame(result.numerator, result.denominator, 'result')], note: rationalText(numerator, denominator) } })
  return { kind: 'fraction-worked', expression, label: 'Multiply fractions', steps }
}

export function divideFractionsWorking(first: FractionValue, second: FractionValue): FractionWorking {
  const numerator = first.numerator * second.denominator, denominator = first.denominator * second.numerator
  const result = reduceFraction(numerator, denominator), expression = `${rawLatex(first.numerator, first.denominator)}\\div${rawLatex(second.numerator, second.denominator)}`
  return {
    kind: 'fraction-worked', expression, label: 'Divide fractions', steps: [
      { title: 'Use the reciprocal of the divisor', equation: `${expression}=${rawLatex(first.numerator, first.denominator)}\\times${rawLatex(second.denominator, second.numerator)}`, instruction: `Keep the first fraction, change division to multiplication, and swap the numerator and denominator of the second fraction.`, frame: { kind: 'reciprocal', values: [valueFrame(first.numerator, first.denominator), valueFrame(second.numerator, second.denominator), valueFrame(second.denominator, second.numerator, 'equivalent')], note: 'The reciprocal reverses the divisor' } },
      { title: 'Multiply across', equation: `\\frac{${first.numerator}\\times${second.denominator}}{${first.denominator}\\times${second.numerator}}=\\frac{${numerator}}{${denominator}}`, instruction: `Multiply the numerators and denominators.`, frame: { kind: 'reciprocal', values: [valueFrame(numerator, denominator, 'equivalent')], note: 'Equivalent multiplication' } },
      { title: 'Simplify and convert if needed', equation: `${rawLatex(numerator, denominator)}=${rationalLatex(numerator, denominator)}`, instruction: `Simplify fully${result.numerator > result.denominator ? ' and write the improper result as a mixed number' : ''}.`, frame: { kind: 'mixed', values: [valueFrame(result.numerator, result.denominator, 'result')], note: rationalText(numerator, denominator) } },
    ],
  }
}

const improper = (value: MixedValue | FractionValue): FractionValue => 'whole' in value ? { numerator: value.whole * value.denominator + value.numerator, denominator: value.denominator } : value
const sourceLatex = (value: MixedValue | FractionValue) => 'whole' in value ? `${value.whole}\\frac{${value.numerator}}{${value.denominator}}` : rawLatex(value.numerator, value.denominator)

export function mixedCalculationWorking(firstValue: MixedValue | FractionValue, secondValue: MixedValue | FractionValue, operation: 'multiply' | 'divide'): FractionWorking {
  const first = improper(firstValue), second = improper(secondValue), symbol = operation === 'multiply' ? '\\times' : '\\div'
  const base = operation === 'multiply' ? multiplyFractionsWorking(first, second, true) : divideFractionsWorking(first, second)
  const expression = `${sourceLatex(firstValue)}${symbol}${sourceLatex(secondValue)}`
  return {
    kind: 'fraction-worked', expression, label: 'Calculate with mixed numbers', steps: [
      { title: 'Convert mixed numbers to improper fractions', equation: `${sourceLatex(firstValue)}=${rawLatex(first.numerator, first.denominator)},\\quad${sourceLatex(secondValue)}=${rawLatex(second.numerator, second.denominator)}`, instruction: `Use whole × denominator + numerator for each mixed number. Whole numbers can be written over 1.`, frame: { kind: 'mixed', values: [valueFrame(first.numerator, first.denominator, 'equivalent'), valueFrame(second.numerator, second.denominator, 'equivalent')], note: 'Convert before calculating' } },
      ...base.steps.map(step => ({ ...step, frame: { ...step.frame, note: step.frame.note } })),
    ],
  }
}

export function fractionOfAmountWorking(numerator: number, denominator: number, amount: number, currency = true): FractionWorking {
  const unit = amount / denominator, answer = unit * numerator, sign = currency ? '£' : ''
  return {
    kind: 'fraction-worked', expression: `${rawLatex(numerator, denominator)}\\text{ of }${sign}${amount}`, label: 'Fraction of an amount', steps: [
      { title: 'Find one equal part', equation: `${sign}${amount}\\div${denominator}=${sign}${unit}`, instruction: `The denominator ${denominator} tells us to divide the amount into ${denominator} equal parts.`, frame: { kind: 'amount', amount, currency, parts: denominator, selectedParts: 1, unitValue: unit, note: `One ${denominator === 2 ? 'half' : `${denominator}th`} is ${sign}${unit}` } },
      { title: 'Take the required number of parts', equation: `${sign}${unit}\\times${numerator}=${sign}${answer}`, instruction: `The numerator ${numerator} tells us to take ${numerator} of those equal parts.`, frame: { kind: 'amount', amount, currency, parts: denominator, selectedParts: numerator, unitValue: unit, note: `${numerator} equal parts` } },
      { title: 'State the amount', equation: `${rawLatex(numerator, denominator)}\\text{ of }${sign}${amount}=${sign}${answer}`, instruction: `The required fraction of the amount is ${sign}${answer}.`, frame: { kind: 'amount', amount, currency, parts: denominator, selectedParts: numerator, unitValue: unit, note: `${sign}${answer}` } },
    ],
  }
}

export function fractionWorkingProgress(visual: FractionWorking, revealed: number) {
  const total = visual.steps.length
  const count = Math.max(0, Math.min(total, revealed))
  return { total, current: visual.steps[count - 1], completed: visual.steps.slice(0, count) }
}
