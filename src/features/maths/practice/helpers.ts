/* Small helpers for writing question templates: numbers as AQA prints them, fractions, and option order. */

export const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b)
export const lcm = (a: number, b: number) => a / gcd(a, b) * b

/** Rounds away floating-point dust: 0.1 + 0.2 → 0.3. */
export const tidy = (value: number) => Math.round(value * 1e9) / 1e9

/** 38562 → "38 562", with a non-breaking space, as the papers print it. Four-digit numbers stay together. */
export function num(value: number) {
  const [whole, decimals] = String(tidy(value)).split('.')
  const grouped = whole.replace('-', '').length > 4 ? whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : whole
  return decimals ? `${grouped}.${decimals}` : grouped
}

/** The same in LaTeX, with a thin space between groups. */
export const tex = (value: number) => num(value).replace(/ /g, '\\,').replace('-', '−')

/** Money as it is written: £7.35, £25 (whole pounds need no pence unless `pence` is set). */
export const money = (value: number, pence = false) => `£${Number.isInteger(tidy(value)) && !pence ? tidy(value) : tidy(value).toFixed(2)}`
export const texMoney = (value: number, pence = false) => money(value, pence).replace('£', '\\pounds ')
/** Pence-exact arithmetic for money. */
export const pounds = (pence: number) => Math.round(pence) / 100

export const frac = (n: number, d: number) => `\\frac{${n}}{${d}}`
export const mixed = (n: number, d: number) => n % d === 0 ? String(n / d) : n > d ? `${Math.floor(n / d)}\\frac{${n % d}}{${d}}` : frac(n, d)
/** A fraction in running text: $\frac{3}{8}$. */
export const f = (n: number, d: number) => `$${frac(n, d)}$`

/** Moves the options round so the right answer is not always in the same place. */
export function rotate(options: string[], correct: number, by: number) {
  const shift = by % options.length
  return { options: [...options.slice(shift), ...options.slice(0, shift)], correct: (correct - shift + options.length) % options.length }
}

/** Prime factors, smallest first: 84 → [2, 2, 3, 7]. */
export function primeFactors(value: number) {
  const factors: number[] = []
  let rest = value
  for (let p = 2; rest > 1; p++) while (rest % p === 0) { factors.push(p); rest /= p }
  return factors
}

/** [2, 2, 3, 7] → 2^2 \times 3 \times 7 (index form). */
export function indexForm(factors: number[]) {
  const counts = new Map<number, number>()
  for (const p of factors) counts.set(p, (counts.get(p) ?? 0) + 1)
  return [...counts].map(([p, n]) => n > 1 ? `${p}^${n}` : String(p)).join(' \\times ')
}

/** Names of place-value columns: 0 is ones, 1 tens…; −1 tenths, −2 hundredths… */
export function columnName(power: number) {
  const names: Record<number, string> = {
    6: 'millions', 5: 'hundred thousands', 4: 'ten thousands', 3: 'thousands', 2: 'hundreds', 1: 'tens', 0: 'ones',
    [-1]: 'tenths', [-2]: 'hundredths', [-3]: 'thousandths',
  }
  return names[power]
}
