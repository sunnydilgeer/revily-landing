export type ConversionForm = {
  latex: string
  accessible: string
}

export type ConversionForms = {
  fraction?: ConversionForm
  decimal?: ConversionForm
  percentage?: ConversionForm
}

export type ConversionStep = {
  title: string
  equation: string
  instruction: string
  forms: ConversionForms
}

export type ConversionWorking = {
  kind: 'conversion-worked'
  expression: string
  label: string
  steps: ConversionStep[]
}

const fraction = (numerator: number | string, denominator: number | string): ConversionForm => ({
  latex: `\\frac{${numerator}}{${denominator}}`,
  accessible: `${numerator} over ${denominator}`,
})
const decimal = (value: number | string): ConversionForm => ({ latex: String(value), accessible: String(value) })
const percentage = (value: number | string): ConversionForm => ({ latex: `${value}\\%`, accessible: `${value} percent` })
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a)
const decimalPlaces = (value: string) => value.includes('.') ? value.split('.')[1].length : 0
const powerOfTen = (places: number) => 10 ** places

export function fractionToDecimalWorking(numerator: number, denominator: number, result: string, roundedResult?: string): ConversionWorking {
  const initialForms = { fraction: fraction(numerator, denominator) }
  const convertedForms = { ...initialForms, decimal: decimal(result) }
  const steps: ConversionStep[] = [
    {
      title: 'Turn the fraction bar into division',
      equation: `${numerator}\\div${denominator}`,
      instruction: `Divide the numerator, ${numerator}, by the denominator, ${denominator}.`,
      forms: initialForms,
    },
    {
      title: 'Complete the division',
      equation: `${numerator}\\div${denominator}=${result}`,
      instruction: `${numerator} divided by ${denominator} is ${result}.`,
      forms: convertedForms,
    },
  ]
  if (roundedResult) steps.push({
    title: 'Round to the requested accuracy',
    equation: `${result}\\longrightarrow${roundedResult}`,
    instruction: `Use the next decimal digit to round the answer to ${roundedResult}.`,
    forms: { ...initialForms, decimal: decimal(roundedResult) },
  })
  return { kind: 'conversion-worked', expression: `\\frac{${numerator}}{${denominator}}`, label: 'Fraction to decimal', steps }
}

export function decimalToFractionWorking(value: string, resultNumerator: number, resultDenominator: number): ConversionWorking {
  const places = decimalPlaces(value)
  const denominator = powerOfTen(places)
  const numerator = Math.round(Number(value) * denominator)
  const factor = gcd(numerator, denominator)
  return {
    kind: 'conversion-worked', expression: value, label: 'Decimal to fraction', steps: [
      {
        title: `Write the decimal over ${denominator}`,
        equation: `${value}=\\frac{${numerator}}{${denominator}}`,
        instruction: `${value} has ${places} decimal ${places === 1 ? 'place' : 'places'}, so use ${denominator} as the denominator.`,
        forms: { decimal: decimal(value), fraction: fraction(numerator, denominator) },
      },
      {
        title: 'Simplify the fraction fully',
        equation: `\\frac{${numerator}\\div${factor}}{${denominator}\\div${factor}}=\\frac{${resultNumerator}}{${resultDenominator}}`,
        instruction: `Divide the numerator and denominator by their highest common factor, ${factor}.`,
        forms: { decimal: decimal(value), fraction: fraction(resultNumerator, resultDenominator) },
      },
    ],
  }
}

export function decimalToPercentageWorking(value: string, result: string): ConversionWorking {
  return {
    kind: 'conversion-worked', expression: value, label: 'Decimal to percentage', steps: [
      {
        title: 'Multiply by 100',
        equation: `${value}\\times100`,
        instruction: 'Multiplying by 100 moves every digit two place-value columns to the left.',
        forms: { decimal: decimal(value) },
      },
      {
        title: 'Attach the percent sign',
        equation: `${value}\\times100=${result}\\%`,
        instruction: `${value} is equivalent to ${result} out of 100.`,
        forms: { decimal: decimal(value), percentage: percentage(result) },
      },
    ],
  }
}

export function percentageToDecimalWorking(value: string, result: string): ConversionWorking {
  return {
    kind: 'conversion-worked', expression: `${value}\\%`, label: 'Percentage to decimal', steps: [
      {
        title: 'Divide by 100',
        equation: `${value}\\div100`,
        instruction: 'Dividing by 100 moves every digit two place-value columns to the right.',
        forms: { percentage: percentage(value) },
      },
      {
        title: 'Write the decimal',
        equation: `${value}\\div100=${result}`,
        instruction: `${value}% is ${result} of one whole.`,
        forms: { percentage: percentage(value), decimal: decimal(result) },
      },
    ],
  }
}

export function fractionToPercentageWorking(numerator: number, denominator: number, result: string): ConversionWorking {
  return {
    kind: 'conversion-worked', expression: `\\frac{${numerator}}{${denominator}}`, label: 'Fraction to percentage', steps: [
      {
        title: 'Multiply the fraction by 100',
        equation: `\\frac{${numerator}}{${denominator}}\\times100=\\frac{${numerator * 100}}{${denominator}}`,
        instruction: 'A percentage tells us how many parts there are in every 100.',
        forms: { fraction: fraction(numerator, denominator) },
      },
      {
        title: 'Complete the division',
        equation: `${numerator * 100}\\div${denominator}=${result}\\%`,
        instruction: `The fraction is equivalent to ${result}%.`,
        forms: { fraction: fraction(numerator, denominator), percentage: percentage(result) },
      },
    ],
  }
}

export function percentageToFractionWorking(value: string, resultNumerator: number, resultDenominator: number): ConversionWorking {
  const places = decimalPlaces(value)
  const scale = powerOfTen(places)
  const numerator = Math.round(Number(value) * scale)
  const denominator = 100 * scale
  const factor = gcd(numerator, denominator)
  return {
    kind: 'conversion-worked', expression: `${value}\\%`, label: 'Percentage to fraction', steps: [
      {
        title: 'Write the percentage over 100',
        equation: places ? `${value}\\%=\\frac{${value}}{100}=\\frac{${numerator}}{${denominator}}` : `${value}\\%=\\frac{${numerator}}{${denominator}}`,
        instruction: places ? `Multiply the numerator and denominator by ${scale} to clear the decimal.` : 'The percent sign means out of 100.',
        forms: { percentage: percentage(value), fraction: fraction(numerator, denominator) },
      },
      {
        title: 'Simplify the fraction fully',
        equation: `\\frac{${numerator}\\div${factor}}{${denominator}\\div${factor}}=\\frac{${resultNumerator}}{${resultDenominator}}`,
        instruction: `Divide both parts by their highest common factor, ${factor}.`,
        forms: { percentage: percentage(value), fraction: fraction(resultNumerator, resultDenominator) },
      },
    ],
  }
}

