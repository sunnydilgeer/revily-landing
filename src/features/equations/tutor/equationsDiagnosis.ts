/*
 * Solving equations: the moves that solve ax + b = cx + d one at a time, and one plain sentence on why an answer is
 * wrong. Fixed rules, no AI. A wrong answer is matched against the usual slips, each applied to one move at a time:
 * the opposite operation not used, the x term moved with the wrong sign, the last division left out or done the wrong
 * way round, and, for squares, one of the two answers missing. Returns null when no slip fits, so the lesson falls
 * back to the hint.
 */

/** An equation once brackets and fractions are gone: x terms and numbers on each side, `xl`x + `nl` = `xr`x + `nr`. */
export type Linear = { xl: number; nl: number; xr: number; nr: number }
/** A known wrong answer and why. */
export type Slip = [number, string]

export const fmt = (n: number) => { const r = Math.round(n * 1e6) / 1e6; return r < 0 ? `−${-r}` : String(r) }
export const solve = ({ xl, nl, xr, nr }: Linear) => (nr - nl) / (xl - xr)

/** Reads a typed number: "6", "x = 6", "−2", "4.8", "24/5". Null if it isn't one number. */
export function readNumber(response: string): number | null {
  const text = response.trim().replace(/^[a-z]\s*=\s*/i, '').replace(/^£\s?/, '').replace(/[−–]/g, '-').replace(/\s/g, '')
  const fraction = text.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/)
  if (fraction) return Number(fraction[2]) ? Number(fraction[1]) / Number(fraction[2]) : null
  return /^-?\d+(?:\.\d+)?$/.test(text) ? Number(text) : null
}

const close = (a: number, b: number) => Math.abs(a - b) < 1e-6
/** The message for the first slip whose value matches, never the right answer's. */
export function diagnoseSlips(response: string, right: number, slips: Slip[]): string | null {
  const value = readNumber(response)
  if (value === null || close(value, right)) return null
  return slips.find(([wrong]) => Number.isFinite(wrong) && !close(wrong, right) && close(wrong, value))?.[1] ?? null
}

/**
 * The usual slips on a linear equation, each on one move: the x term moved with the wrong sign, the number moved
 * with the wrong sign (Nina: 3x = 12 for 5x + 9 = 2x + 3), the last division missed or done the wrong way round.
 */
export function linearSlips(equation: Linear, letter = 'x'): Slip[] {
  const { xl, nl, xr, nr } = equation
  // After moving the smaller x term: a lots of x, plus b, on one side; c on the other.
  const onLeft = xl >= xr
  const a = Math.abs(xl - xr), b = onLeft ? nl : nr, c = onLeft ? nr : nl
  const right = (c - b) / a, slips: Slip[] = []
  if (xl && xr) {
    const [big, small] = onLeft ? [xl, xr] : [xr, xl]
    slips.push([(c - b) / (big + small), `To move ${fmt(small)}${letter}, take it away from both sides: ${fmt(big)}${letter} − ${fmt(small)}${letter} = ${fmt(a)}${letter}.`])
  }
  if (b) slips.push([(c + b) / a, b > 0
    ? `To remove + ${fmt(b)}, take ${fmt(b)} away from both sides: ${fmt(c)} − ${fmt(b)} = ${fmt(c - b)}.`
    : `To remove − ${fmt(-b)}, add ${fmt(-b)} to both sides: ${fmt(c)} + ${fmt(-b)} = ${fmt(c - b)}.`])
  if (a !== 1) {
    slips.push([c - b, `That’s ${fmt(a)}${letter}. Divide both sides by ${fmt(a)} to get ${letter} on its own: ${fmt(c - b)} ÷ ${fmt(a)} = ${fmt(right)}.`])
    if (c - b) slips.push([a / (c - b), `Divide the number by ${fmt(a)}, not ${fmt(a)} by the number: ${fmt(c - b)} ÷ ${fmt(a)} = ${fmt(right)}.`])
  }
  return slips
}

/** Reads both answers of a squared unknown: "7, -7" → [7, −7]. */
const readList = (response: string) => (response.replace(/[−–]/g, '-').match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)

/** Why an x² = k answer is wrong: one root missing, x² given instead of x, halved instead of square-rooted. */
export function diagnoseRoots(response: string, root: number, letter = 'x'): string | null {
  const values = [...new Set(readList(response))], square = root * root
  const right = values.length === 2 && values.every(v => close(Math.abs(v), root)) && !close(values[0], values[1])
  if (right || !values.length) return null
  if (values.some(v => close(Math.abs(v), square))) return `That’s ${letter}². Square root it: √${fmt(square)} = ${fmt(root)}, and −${fmt(root)} works too.`
  if (values.some(v => close(Math.abs(v), square / 2))) return `A square root isn’t half: √${fmt(square)} = ${fmt(root)}, because ${fmt(root)} × ${fmt(root)} = ${fmt(square)}.`
  if (values.every(v => close(Math.abs(v), root))) return `There are two answers. −${fmt(root)} × −${fmt(root)} = ${fmt(square)} too, so ${letter} = ${fmt(root)} or ${letter} = −${fmt(root)}.`
  return null
}

/** Why a √x = k answer is wrong: not squared, square-rooted again, doubled instead of squared. */
export function rootSlips(root: number, letter = 'x'): Slip[] {
  return [
    [root, `That’s √${letter}. Square both sides to undo the square root: ${fmt(root)}² = ${fmt(root * root)}.`],
    [Math.sqrt(root), `To undo a square root, square: don’t square root again. ${fmt(root)}² = ${fmt(root * root)}.`],
    [root * 2, `Squaring means times itself, not times 2: ${fmt(root)}² = ${fmt(root)} × ${fmt(root)} = ${fmt(root * root)}.`],
  ]
}

/**
 * Works out a line of arithmetic as the board writes it: + − × ÷, brackets, √ and ². Used to show the check,
 * "5 × 6 − 3 = 27", without ever evaluating text as code.
 */
export function evaluate(text: string): number {
  const tokens = text.replace(/\s/g, '').match(/\d+(?:\.\d+)?|[-+−×÷()√²]/g) ?? []
  let at = 0
  const peek = () => tokens[at], next = () => tokens[at++]
  function expression(): number {
    let value = term()
    while (peek() === '+' || peek() === '−' || peek() === '-') value = next() === '+' ? value + term() : value - term()
    return value
  }
  function term(): number {
    let value = unary()
    while (peek() === '×' || peek() === '÷' || peek() === '(' || peek() === '√') value = peek() === '(' || peek() === '√' ? value * unary() : next() === '×' ? value * unary() : value / unary()
    return value
  }
  function unary(): number { return peek() === '−' || peek() === '-' ? (next(), -unary()) : power() }
  function power(): number {
    const value = primary()
    return peek() === '²' ? (next(), value * value) : value
  }
  function primary(): number {
    const token = next()
    if (token === '(') { const value = expression(); next(); return value }
    if (token === '√') return Math.sqrt(power())
    return Number(token)
  }
  return expression()
}

/** One side of the question with the answer put in: "5x −3" and x = 6 → "5 × 6 − 3"; fractions become ÷. */
export function substitute(side: string, letter: string, value: number) {
  const put = value < 0 ? `(${fmt(value)})` : fmt(value)
  return side.replace(/[~^]/g, '').replace(/\{([^|]*)\|([^}]*)\}/g, (_, top: string, bottom: string) => /[+−]/.test(top) ? `(${top}) ÷ ${bottom}` : `${top} ÷ ${bottom}`)
    .replace(new RegExp(`(\\d)(${letter})`, 'g'), '$1 × $2').replace(new RegExp(letter, 'g'), put)
    .replace(/(?<=[^(×÷\s])([+−×÷])/g, ' $1 ').replace(/ ([+−])(?=\S)/g, ' $1 ').replace(/\s+/g, ' ').trim()
}
