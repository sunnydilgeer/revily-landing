import type { ChainStep } from '../../step-chain/StepChain'
import { options, type Option, type Rand } from '../kit/random'

/*
 * Flint's forge: weapon damage comes from formulas. Every answer is picked so it lands on a
 * multiple of 5 (where the numbers allow), then the stats are built to fit it. The dials go up
 * in 1s with ±10 (or ±5) jumps, so every classic slip can be dialled in and diagnosed.
 */

/** One stat on the weapon's tag: a = 6 · sharpness. */
export type Stat = { letter: string; value: number; what: string }
export type Kind = 'formula' | 'forward' | 'backward'

/** One forge: turn the dial to the answer, then strike. */
export type Forge = {
  id: string
  kind: Kind
  weapon: { name: string; emoji: string }
  /** On screen, with a proper minus sign: D = 5a − 2b. */
  formula: string
  stats: Stat[]
  prompt: string
  /** The dial's name, also in its button names. */
  label: string
  answer: number
  start: number
  min: number; max: number; step: number; jump: number
  /** Why the right answer is right: shown when it's forged. */
  win: string
  /** What went wrong with the value they set. */
  nope: (value: number) => string
}

/** The function machine: input x → × k → + c → output y. */
export type Machine = { k: number; c: number }

/** The one multiple-choice side question a round may have. */
export type Side = { prompt: string; answer: string; choices: Option<string>[]; why: string }

export type Round = {
  id: string
  title: string
  headline: string
  why: string
  forges: Forge[]
  machine: Machine | null
  side: Side | null
  chain: ChainStep[]
}

/** On-screen numbers with a proper minus sign. */
export const n = (value: number) => value < 0 ? `−${-value}` : String(value)
/** A number in a sum, bracketed when negative: 2 × (−3). */
const br = (value: number) => value < 0 ? `(${n(value)})` : String(value)
/** Digits stuck together: 3 and 6 → 36 (the "3a = 36" slip). */
const cat = (a: number, b: number) => Number(`${a}${b}`)

type Slip = [number, string]

/** The first slip that matches the value they set, or how far off they are. */
function diagnose(answer: number, value: number, slips: Slip[], fix: string) {
  for (const [slip, text] of slips) if (Number.isInteger(slip) && slip === value && slip !== answer) return `${text} ${fix}`
  const gap = value - answer
  return `${n(value)} is ${Math.abs(gap)} too ${gap > 0 ? 'high' : 'low'}. ${fix}`
}

const BLADES = [
  { name: 'sword', emoji: '🗡️', a: 'sharpness', b: 'weight' },
  { name: 'axe', emoji: '🪓', a: 'edge', b: 'swing' },
  { name: 'bow', emoji: '🏹', a: 'pull', b: 'arrows' },
  { name: 'pickaxe', emoji: '⛏️', a: 'point', b: 'heft' },
  { name: 'trident', emoji: '🔱', a: 'prongs', b: 'reach' },
  { name: 'boomerang', emoji: '🪃', a: 'spin', b: 'range' },
] as const

const CURSED = [
  { name: 'cursed sword', emoji: '🗡️' },
  { name: 'haunted axe', emoji: '🪓' },
  { name: 'hexed bow', emoji: '🏹' },
  { name: 'doom trident', emoji: '🔱' },
] as const

const DIAL = { start: 0, step: 1, jump: 10 }

/** Round 1: D = pa + qb, then D = ab + c. Positive numbers only. */
function forgeRound(rand: Rand): Round {
  const [w1, w2] = rand.shuffle(BLADES)
  let p = 0, q = 0, a = 0, b = 0
  for (;;) {
    p = rand.int(2, 6); q = rand.int(2, 5); a = rand.int(2, 9); b = rand.int(2, 9)
    if (p !== q && a !== b && a !== p && b !== q && (p * a + q * b) % 5 === 0) break
  }
  const pa = p * a, qb = q * b, A = p * a + q * b
  const fix1 = `${p} × ${a} = ${pa} and ${q} × ${b} = ${qb}, so D = ${pa} + ${qb} = ${A}.`
  const f1: Forge = {
    id: 'forge-1', kind: 'formula', weapon: w1,
    formula: `D = ${p}a + ${q}b`,
    stats: [{ letter: 'a', value: a, what: w1.a }, { letter: 'b', value: b, what: w1.b }],
    prompt: `Work out the damage D for this ${w1.name}. Set the dial, then forge it.`,
    label: 'Damage D', answer: A, min: 0, max: 150, ...DIAL,
    win: `${p}a means ${p} × a. ${fix1}`,
    nope: value => diagnose(A, value, [
      [p + a + q + b, `You added everything. ${p}a means ${p} × a, not ${p} + a.`],
      [pa + q + b, `${p}a was right, but ${q}b means ${q} × ${b}, not ${q} + ${b}.`],
      [p + a + qb, `${q}b was right, but ${p}a means ${p} × ${a}, not ${p} + ${a}.`],
      [cat(p, a) + cat(q, b), `You stuck the digits together: ${p}a with a = ${a} isn’t ${cat(p, a)}. A number next to a letter means multiply.`],
      [cat(p, a) + qb, `You stuck the digits together: ${p}a with a = ${a} isn’t ${cat(p, a)}. It’s ${p} × ${a}.`],
      [pa + cat(q, b), `You stuck the digits together: ${q}b with b = ${b} isn’t ${cat(q, b)}. It’s ${q} × ${b}.`],
      [(pa + q) * b, `You went left to right: ${pa} + ${q}, then × ${b}. Multiply before you add (BIDMAS).`],
      [pa, `You forgot the ${q}b part. Every term counts.`],
      [qb, `You forgot the ${p}a part. Every term counts.`],
      [p * b + q * a, `You swapped a and b. a = ${a} goes with the ${p}, b = ${b} with the ${q}.`],
    ], fix1),
  }

  let x = 0, y = 0, c = 0
  for (;;) {
    x = rand.int(3, 9); y = rand.int(3, 9); c = rand.int(2, 14)
    if (x !== y && c !== x && c !== y && (x * y + c) % 5 === 0) break
  }
  const xy = x * y, B = xy + c
  const fix2 = `${x} × ${y} = ${xy}, then + ${c} makes ${B}.`
  const f2: Forge = {
    id: 'forge-2', kind: 'formula', weapon: w2,
    formula: `D = ab + ${c}`,
    stats: [{ letter: 'a', value: x, what: w2.a }, { letter: 'b', value: y, what: w2.b }],
    prompt: `New order: ${/^[aeiou]/i.test(w2.name) ? 'an' : 'a'} ${w2.name}. Work out D, set the dial and forge.`,
    label: 'Damage D', answer: B, min: 0, max: 150, ...DIAL,
    win: `ab means a × b. ${fix2}`,
    nope: value => diagnose(B, value, [
      [x + y + c, `ab means a × b, not a + b.`],
      [cat(x, y) + c, `You stuck the digits together: ab isn’t ${cat(x, y)}. Letters side by side mean multiply.`],
      [x * (y + c), `You did b + ${c} first, then × a. Multiply first, add after.`],
      [xy, `You forgot the + ${c} on the end.`],
      [xy - c, `It’s + ${c}, not − ${c}.`],
      [x + c, `You left out b.`],
    ], fix2),
  }

  return {
    id: 'forge',
    title: 'Round 1 · Forge it',
    headline: 'Swap the letters for numbers',
    why: `A formula is a recipe. Swap each letter for its number, then work it out. A number stuck to a letter means multiply: 3a is 3 × a. And multiply before you add.`,
    forges: [f1, f2], machine: null, side: null,
    chain: [
      { line: `D = [[p:${p}]][[a:a]] + [[q:${q}]][[b:b]]` },
      { line: `D = [[p:${p}]] \\times [[a:${a}]] + [[q:${q}]] \\times [[b:${b}]]`, op: 'Swap in a and b', why: `a = ${a} and b = ${b}. ${p}a means ${p} × a, so the hidden × signs come out.` },
      { line: `D = [[m:${pa}]] + [[n:${qb}]]`, op: 'Multiply first', merge: { m: ['p', 'a'], n: ['q', 'b'] }, why: `BIDMAS: multiply before you add. ${p} × ${a} = ${pa} and ${q} × ${b} = ${qb}.` },
      { line: `D = [[d:${A}]]`, op: 'Add', merge: { d: ['m', 'n'] }, why: `${pa} + ${qb} = ${A}. That ${w1.name} hits for ${A}.` },
    ],
  }
}

/** Round 2: minus a negative, then a square with a cursed (negative) stat. */
function curseRound(rand: Rand): Round {
  const [w1, w2] = rand.shuffle(CURSED)
  let p = 0, q = 0, a = 0, B = 0
  for (;;) {
    p = rand.int(2, 6); q = rand.int(2, 5); a = rand.int(3, 10); B = rand.int(1, 6)
    if (p !== q && a !== p && (p * a + q * B) % 5 === 0 && p * a - q * B !== 0) break
  }
  const b = -B, pa = p * a, qB = q * B, A = pa + qB
  const fix1 = `${q} × (−${B}) = −${qB}, and ${pa} − (−${qB}) = ${pa} + ${qB} = ${A}.`
  const f1: Forge = {
    id: 'curse-1', kind: 'formula', weapon: w1,
    formula: `D = ${p}a − ${q}b`,
    stats: [{ letter: 'a', value: a, what: 'power' }, { letter: 'b', value: b, what: 'curse' }],
    prompt: `This ${w1.name} has a negative curse stat. Work out D and forge it.`,
    label: 'Damage D', answer: A, min: -50, max: 150, ...DIAL,
    win: `Minus a negative is a plus. ${p} × ${a} = ${pa}. ${fix1}`,
    nope: value => diagnose(A, value, [
      [pa - qB, `Minus a negative! ${q} × (−${B}) = −${qB}, and taking away −${qB} is the same as adding ${qB}.`],
      [pa - q - b, `${q}b means ${q} × b, not ${q} + b.`],
      [p + a + qB, `${p}a means ${p} × ${a}, not ${p} + ${a}.`],
      [pa, `You dropped the curse part. It still counts, and minus a negative ADDS.`],
      [-pa - qB, `The ${p}a part is positive: ${p} × ${a} = ${pa}.`],
      [qB - pa, `Order matters: it’s ${p}a take away ${q}b, not the other way round.`],
    ], `${p} × ${a} = ${pa}. ${fix1}`),
  }

  let s = 0, r = 0, C = 0
  for (;;) {
    s = rand.int(3, 9); r = rand.int(2, 5); C = rand.int(1, 5)
    const D = s * s - r * C
    if (D > 0 && D % 5 === 0 && s !== r && s * s !== 2 * s) break
  }
  const c = -C, ss = s * s, rC = r * C, D = ss - rC
  const fix2 = `${s}² = ${s} × ${s} = ${ss}. ${r} × (−${C}) = −${rC}. ${ss} − ${rC} = ${D}.`
  const f2: Forge = {
    id: 'curse-2', kind: 'formula', weapon: w2,
    formula: `D = a² + ${r}b`,
    stats: [{ letter: 'a', value: s, what: 'power' }, { letter: 'b', value: c, what: 'curse' }],
    prompt: `A squared stat AND a curse. Work out D for the ${w2.name}.`,
    label: 'Damage D', answer: D, min: -50, max: 150, ...DIAL,
    win: `a² means a × a, and the curse takes damage away. ${fix2}`,
    nope: value => diagnose(D, value, [
      [2 * s - rC, `a² means a × a, not 2 × a. ${s}² is ${ss}, not ${2 * s}.`],
      [ss + rC, `Watch the curse: ${r} × (−${C}) = −${rC}, so it takes damage away.`],
      [2 * s + rC, `Two slips: a² is a × a (not 2 × a), and the curse is negative, so it takes away.`],
      [s - rC, `You forgot to square a. ${s}² = ${s} × ${s} = ${ss}.`],
      [ss + r + c, `${r}b means ${r} × b, not ${r} + b.`],
      [ss, `You left out the curse. ${r}b still counts.`],
    ], fix2),
  }

  return {
    id: 'curse',
    title: 'Round 2 · Cursed stats',
    headline: 'Negatives and squares',
    why: `Cursed stats are negative, so put them in brackets: 2 × (−3) = −6. Taking away a negative is the same as adding. And a² means a × a, not 2 × a.`,
    forges: [f1, f2], machine: null, side: null,
    chain: [
      { line: `D = [[p:${p}]][[a:a]] - [[q:${q}]][[b:b]]` },
      { line: `D = [[p:${p}]] \\times [[a:${a}]] - [[q:${q}]] \\times [[b:(${b})]]`, op: 'Swap in a and b', why: `a = ${a} and the curse b = ${n(b)}. Brackets round the negative keep its sign safe.` },
      { line: `D = [[m:${pa}]] [[t:- (-${qB})]]`, op: 'Multiply first', merge: { m: ['p', 'a'], t: ['q', 'b'] }, why: `${p} × ${a} = ${pa}, and ${q} × (−${B}) = −${qB}.` },
      { line: `D = [[m:${pa}]] [[t:+ ${qB}]]`, op: 'Minus a minus', why: `Taking away a negative is adding: − (−${qB}) is + ${qB}.` },
      { line: `D = [[d:${A}]]`, op: 'Add', merge: { d: ['m', 't'] }, why: `${pa} + ${qB} = ${A}. The curse backfired: more damage, not less.` },
    ],
  }
}

/** Round 3: the function machine, forwards then backwards, plus one side question. */
function machineRound(rand: Rand): Round {
  const k = rand.int(2, 5), c = rand.int(10, 30, 5)
  let x = 0, X = 0
  for (;;) {
    // k × x must be a multiple of 5 so the damage out is too.
    x = k === 5 ? rand.int(3, 12) : rand.pick([5, 10])
    X = k === 5 ? rand.int(3, 12) : rand.pick([5, 10, 15, 20])
    if (X !== x && X !== c && x !== c) break
  }
  const kx = k * x, y = kx + c, kX = k * X, Y = kX + c, less = Y - c
  const ore = { name: 'forge machine', emoji: '⚙️' }
  const fixF = `${x} × ${k} = ${kx}, then + ${c} = ${y}.`
  const forward: Forge = {
    id: 'machine-1', kind: 'forward', weapon: ore,
    formula: `× ${k} then + ${c}`,
    stats: [{ letter: 'x', value: x, what: 'bars of ore in' }],
    prompt: `${x} bars of ore go in. What damage comes out? Set the output.`,
    label: 'Output y', answer: y, min: 0, max: 200, ...DIAL,
    win: `Do the boxes in order. ${fixF}`,
    nope: value => diagnose(y, value, [
      [(x + c) * k, `Wrong order: you added ${c} first, then × ${k}. The ore hits the × ${k} box first.`],
      [x + k + c, `The first box is × ${k}, not + ${k}.`],
      [kx, `You stopped after × ${k}. It still goes through + ${c}.`],
      [x + c, `You skipped the × ${k} box.`],
      [kx - c, `The second box is + ${c}, not − ${c}.`],
    ], fixF),
  }
  const fixB = `Undo the last box first: ${Y} − ${c} = ${less}, then ÷ ${k} = ${X}. Check: ${X} × ${k} + ${c} = ${Y}.`
  const backward: Forge = {
    id: 'machine-2', kind: 'backward', weapon: ore,
    formula: `× ${k} then + ${c}`,
    stats: [{ letter: 'y', value: Y, what: 'damage wanted' }],
    prompt: `A knight wants exactly ${Y} damage. How many bars go in? Run it backwards.`,
    label: 'Input x', answer: X, min: 0, max: 50, start: 0, step: 1, jump: 5,
    win: fixB,
    nope: value => diagnose(X, value, [
      [k * Y + c, `You ran it forwards. Backwards, you undo each box: − ${c}, then ÷ ${k}.`],
      [(Y + c) / k, `You kept the + ${c}. To undo + ${c}, take ${c} away.`],
      [less * k, `You kept the × ${k}. To undo × ${k}, divide by ${k}.`],
      [Y / k - c, `Right moves, wrong order. Undo the LAST box first: − ${c}, then ÷ ${k}.`],
      [less, `Halfway there: you undid the + ${c}. Now undo the × ${k}.`],
      [Y / k, `You undid the × ${k}, but not the + ${c}. And undo the last box first.`],
      [x, `That’s the input from last time. New target, new input.`],
    ], fixB),
  }

  const right = `y = ${k}x + ${c}`
  const test = (f: (v: number) => number) => `Try x = ${x}: that gives ${n(f(x))}, but the machine gives ${y}.`
  const choices = options<string>(rand, { value: right, label: right }, [
    { value: `y = ${k}(x + ${c})`, label: `y = ${k}(x + ${c})`, nope: `That adds ${c} before × ${k}. ${test(v => k * (v + c))}` },
    { value: `y = ${c}x + ${k}`, label: `y = ${c}x + ${k}`, nope: `The numbers are swapped. ${test(v => c * v + k)}` },
    { value: `y = x + ${k + c}`, label: `y = x + ${k + c}`, nope: `The first box multiplies by ${k}, it doesn’t add. ${test(v => v + k + c)}` },
    { value: `y = ${k}x − ${c}`, label: `y = ${k}x − ${c}`, nope: `The second box adds ${c}. ${test(v => k * v - c)}` },
  ])

  return {
    id: 'machine',
    title: 'Round 3 · Function machine',
    headline: 'In one end, out the other',
    why: `A function machine does its boxes in order. Forwards: follow the arrows. Backwards: start at the output and undo each box, last one first. The opposite of × is ÷, the opposite of + is −.`,
    forges: [forward, backward], machine: { k, c },
    side: {
      prompt: `Which formula does Flint’s machine follow?`,
      answer: right,
      choices,
      why: `x goes in, gets × ${k} (that’s ${k}x), then + ${c}. So ${right}. Check: x = ${x} gives ${kx} + ${c} = ${y}.`,
    },
    chain: [
      { line: `[[x:x]] \\times [[k:${k}]] [[c:+ ${c}]] = [[t:${Y}]]` },
      { line: `[[x:x]] \\times [[k:${k}]] = [[r:${less}]]`, op: `Undo + ${c}`, merge: { r: ['t', 'c'] }, why: `The + ${c} happened last, so undo it first: ${Y} − ${c} = ${less}.` },
      { line: `[[x:x]] = [[s:${X}]]`, op: `Undo × ${k}`, merge: { s: ['r', 'k'] }, why: `Undo × ${k} by dividing: ${less} ÷ ${k} = ${X}.` },
      { line: `[[s:${X}]] \\times ${k} + ${c} = ${Y}`, op: 'Check it', why: `Run ${X} forwards: ${X} × ${k} = ${kX}, + ${c} = ${Y}. Spot on.` },
    ],
  }
}

export function makeRounds(rand: Rand): Round[] {
  return [forgeRound(rand), curseRound(rand), machineRound(rand)]
}
