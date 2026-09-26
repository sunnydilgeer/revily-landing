/*
 * Explains *why* a BIDMAS answer is wrong by replaying the sum the way a student might have done it
 * (straight left to right, + and − before × and ÷, 4² as 4 × 2) and seeing which one matches.
 * Fixed rules, no AI. Returns null when no replay matches.
 */
import { tokenize } from './bidmasStepper'

type Token = { t: 'n'; v: number } | { t: 'o'; v: string } | { t: '(' } | { t: ')' } | { t: 'p'; e: number } | { t: 'r' }
type Mode = 'correct' | 'leftToRight' | 'addFirst' | 'powerAsTimes' | 'multiplyBeforeDivide' | 'divideBeforeMultiply' | 'addBeforeSubtract' | 'subtractBeforeAdd'
type Seen = { power?: { base: number; e: number } }

const PASSES: Record<Mode, string[]> = {
  correct: ['×÷', '+−'],
  leftToRight: ['×÷+−'],
  addFirst: ['+−', '×÷'],
  powerAsTimes: ['×÷', '+−'],
  multiplyBeforeDivide: ['×', '÷', '+−'],
  divideBeforeMultiply: ['÷', '×', '+−'],
  addBeforeSubtract: ['×÷', '+', '−'],
  subtractBeforeAdd: ['×÷', '−', '+'],
}

/** Turn a lesson's LaTeX expression into the plain text the stepper reads. */
export function latexToPlain(latex: string) {
  let s = latex.replace(/^[a-z]\s*=\s*/i, '')
  for (let i = 0; i < 4; i++) s = s.replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '($1)÷($2)').replace(/\\frac(\d)(\d)/g, '($1)÷($2)')
  return s.replace(/\\times/g, '×').replace(/\\div/g, '÷').replace(/\\left|\\right/g, '').replace(/\^\{(\d+)\}/g, '^$1').replace(/[{}\s]/g, '')
}

function apply(a: number, op: string, b: number) {
  return op === '×' ? a * b : op === '÷' ? a / b : op === '+' ? a + b : a - b
}

/** Evaluate a flat list (no brackets) under a given wrong strategy. */
function flat(items: Token[], mode: Mode, seen: Seen): number {
  const values: (number | string)[] = []
  for (let i = 0; i < items.length; i++) {
    const it = items[i]
    if (it.t === 'n') {
      let v = it.v
      while (items[i + 1]?.t === 'p') { const e = (items[i + 1] as { e: number }).e; seen.power ??= { base: v, e }; v = mode === 'powerAsTimes' ? v * e : v ** e; i++ }
      values.push(v)
    } else if (it.t === 'r') {
      const next = items[i + 1]
      if (next?.t !== 'n') return NaN
      values.push(Math.sqrt(next.v)); i++
    } else if (it.t === 'o') values.push(it.v)
  }
  for (const set of PASSES[mode]) {
    for (let i = 1; i < values.length; i += 2) {
      if (set.includes(values[i] as string)) {
        values.splice(i - 1, 3, apply(values[i - 1] as number, values[i] as string, values[i + 1] as number))
        i -= 2
      }
    }
  }
  return values.length === 1 ? values[0] as number : NaN
}

function evaluate(tokens: Token[], mode: Mode, seen: Seen = {}): number {
  const items = [...tokens]
  for (let guard = 0; guard < 40; guard++) {
    const close = items.findIndex(it => it.t === ')')
    if (close < 0) break
    let open = close
    while (open >= 0 && items[open].t !== '(') open--
    const inner = flat(items.slice(open + 1, close), mode, seen)
    items.splice(open, close - open + 1, { t: 'n', v: inner })
  }
  return flat(items, mode, seen)
}

const same = (a: number, b: number) => Number.isFinite(a) && Math.abs(a - b) < 1e-9

export function diagnoseBidmas(expressionLatex: string, response: string, expected: number): string | null {
  const value = Number(response.replace(/[−–]/g, '-').replace(/\s/g, ''))
  if (!Number.isFinite(value) || same(value, expected)) return null
  let tokens: Token[]
  try { tokens = tokenize(latexToPlain(expressionLatex)) as Token[] } catch { return null }
  const seen: Seen = {}
  if (same(value, evaluate(tokens, 'powerAsTimes', seen)) && seen.power) {
    const { base, e } = seen.power
    return `Check the power: ${base}${'⁰¹²³⁴⁵⁶⁷⁸⁹'[e] ?? `^${e}`} means ${Array(e).fill(base).join(' × ')}, not ${base} × ${e}.`
  }
  if (same(value, evaluate(tokens, 'leftToRight'))) {
    return 'It looks like you worked straight from left to right. Use the ladder: × and ÷ come before + and −.'
  }
  if (same(value, evaluate(tokens, 'addFirst'))) {
    return 'It looks like you added or subtracted first. × and ÷ are higher up the ladder, so do them first.'
  }
  if (same(value, evaluate(tokens, 'multiplyBeforeDivide')) || same(value, evaluate(tokens, 'divideBeforeMultiply'))) {
    return '× and ÷ share a step on the ladder, so neither goes first. Work from left to right.'
  }
  if (same(value, evaluate(tokens, 'addBeforeSubtract')) || same(value, evaluate(tokens, 'subtractBeforeAdd'))) {
    return '+ and − share a step on the ladder, so neither goes first. Work from left to right.'
  }
  return null
}
