import type { ChainStep } from '../../step-chain/StepChain'
import { options, texNum, type Option, type Rand } from '../kit/random'

/*
 * Dex's loot drop: three chests to pack before the drop ship leaves.
 *
 * Round 1 is counted in crates (one crate = one cube): 3–6 long, 2–4 deep, 2–4 tall, so every crate
 * can be drawn. Round 2 is in cm, every side a multiple of 10 (or 25), so volumes land on 500s.
 * Round 3 is a slime tank whose volume is a multiple of 500 cm³, so the litres are whole or .5.
 * Every answer is picked first and the question is built from it.
 */

/** crates: whole cubes you can count · loot: a chest in cm · slime: a tank in cm */
export type Mode = 'crates' | 'loot' | 'slime'
export type Box = { mode: Mode; l: number; w: number; h: number }

/** What a dial fills: the bottom layer, the whole chest in crates, the volume in cm³, or litres. */
export type Fills = 'layer' | 'total' | 'volume' | 'litres'

export type Dial = {
  id: string
  box: Box
  fills: Fills
  /** The dial's name, also in its button names. */
  label: string
  prompt: string
  answer: number
  start: number
  min: number; max: number; step: number; jump?: number
  /** Why the right answer is right: shown on a hit. */
  win: string
  /** What went wrong with the value they set. */
  nope: (value: number) => string
}

/** The one multiple-choice side question a round may have. */
export type Side = { prompt: string; answer: number; choices: Option<number>[]; why: string; box: Box; labels: [string, string, string] }

export type Round = {
  id: string
  title: string
  headline: string
  why: string
  dials: Dial[]
  side: Side | null
  chain: ChainStep[]
}

/** 30,000 */
export const num = (value: number) => value.toLocaleString('en-GB')
export const cm3 = (value: number) => `${num(value)} cm³`
export const litres = (value: number) => `${num(value)} litre${value === 1 ? '' : 's'}`
const crates = (value: number) => `${value} crate${value === 1 ? '' : 's'}`

/** The numbers a dial shows. */
export function formatFor(fills: Fills) {
  if (fills === 'volume') return cm3
  if (fills === 'litres') return (value: number) => `${num(value)} L`
  return String
}

/** How much of the box a dial value fills: 1 is exactly full. */
export function fullness(dial: Dial, value: number) {
  return value / dial.answer
}

// ─── Round 1: crates ───────────────────────────────────────────────────────────────────────────

function layerNope(l: number, w: number, h: number) {
  const layer = l * w
  const fix = `The floor is ${w} rows of ${l}: ${w} × ${l} = ${layer} crates.`
  return (v: number) => {
    if (v === l + w) return `You added the sides: ${l} + ${w} = ${v}. A layer isn’t one row along and one row deep, it’s every space on the floor. ${fix}`
    if (v === 2 * (l + w) - 4) return `That’s only the crates round the edge of the floor. The middle needs filling too. ${fix}`
    if (v === 2 * (l + w)) return `${v} is going round the outside of the floor, like a perimeter. Volume fills the inside. ${fix}`
    if (v === layer * h) return `Whoa, that’s the whole chest! Just the bottom layer for now. ${fix}`
    if (v === l) return `That’s one row along the front. There are ${w} rows like it. ${fix}`
    if (v === w) return `That’s one row going back. There are ${l} of those side by side. ${fix}`
    if (v < layer) return `Gaps! ${layer - v} space${layer - v === 1 ? '' : 's'} on the floor still empty. ${fix}`
    return `${v - layer} crate${v - layer === 1 ? '' : 's'} won’t fit on the floor. ${fix}`
  }
}

function totalNope(l: number, w: number, h: number) {
  const layer = l * w, total = layer * h
  const fix = `${h} layers of ${layer}: ${layer} × ${h} = ${total} crates.`
  const outside = total - Math.max(0, l - 2) * Math.max(0, w - 2) * Math.max(0, h - 2)
  return (v: number) => {
    if (v === layer) return `That’s one layer. The chest is ${h} layers tall, so stack them. ${fix}`
    if (v === l + w + h) return `You added the three sides: ${l} + ${w} + ${h} = ${v}. Volume multiplies them. ${fix}`
    if (v === layer + h) return `You added the layers on: ${layer} + ${h}. Stacking ${h} layers means ${layer} ${h} times over. ${fix}`
    if (v === 2 * (l * w + l * h + w * h)) return `That counts the faces round the outside (surface area), not the space inside. ${fix}`
    if (v === l * w + l * h + w * h) return `That’s three faces added up: floor, front and side. Volume is the space inside. ${fix}`
    if (v === outside && outside !== total) return `That’s only the crates you’d see from the outside. There’s a hidden middle too. ${fix}`
    if (v === layer * (h + 1)) return `One layer too many: count the layers again. It’s ${h} tall. ${fix}`
    if (v === layer * (h - 1)) return `One layer short: count the layers again. It’s ${h} tall. ${fix}`
    if (v < total) return `The lid won’t close on ${total - v} gap${total - v === 1 ? '' : 's'}. ${fix}`
    return `${v - total} crate${v - total === 1 ? '' : 's'} spilling out of the top. ${fix}`
  }
}

function cratesRound(rand: Rand): Round {
  let l = 0, w = 0, h = 0
  do { l = rand.int(3, 6); w = rand.int(2, 4); h = rand.int(2, 4) } while (l === w)
  const layer = l * w, total = layer * h
  const box: Box = { mode: 'crates', l, w, h }
  return {
    id: 'crates',
    title: 'Round 1 · Fill a layer, stack the layers',
    headline: 'Volume is how many cubes fit inside',
    why: `Volume is the space inside a 3D shape, counted in cubes. Don’t count them one by one: fill the floor (rows × crates in a row), then stack that layer up to the top. That’s length × width × height.`,
    dials: [
      {
        id: 'layer', box, fills: 'layer', label: 'Crates in a layer',
        prompt: `The chest is ${l} crates long and ${w} deep. How many crates fill the bottom layer?`,
        answer: layer, start: 1, min: 1, max: 30, step: 1,
        win: `${w} rows of ${l}: ${w} × ${l} = ${layer} crates. Floor full, no gaps.`,
        nope: layerNope(l, w, h),
      },
      {
        id: 'total', box, fills: 'total', label: 'Crates in the chest',
        prompt: `One layer is ${layer}. The chest is ${h} crates tall. How many crates fill the whole chest?`,
        answer: total, start: layer, min: 1, max: 150, step: 1, jump: 10,
        win: `${h} layers of ${layer}: ${layer} × ${h} = ${total}. So the volume is ${l} × ${w} × ${h} = ${total} cubes.`,
        nope: totalNope(l, w, h),
      },
    ],
    side: null,
    chain: [
      { line: `\\text{Layer} = [[l:${l}]] \\times [[w:${w}]]` },
      { line: `\\text{Layer} = [[a:${layer}]]`, op: 'Multiply', merge: { a: ['l', 'w'] }, why: `${w} rows of ${l} crates. ${l} × ${w} = ${layer} fill the floor.` },
      { line: `V = [[a:${layer}]] \\times [[h:${h}]]`, op: '× the layers', why: `The chest is ${h} crates tall, so there are ${h} layers of ${layer}.` },
      { line: `V = [[t:${total}]]`, op: 'Multiply', merge: { t: ['a', 'h'] }, why: `${layer} × ${h} = ${total}. Volume = length × width × height: ${l} × ${w} × ${h}.` },
    ],
  }
}

// ─── Volume in cm³ (rounds 2 and 3) ────────────────────────────────────────────────────────────

/** Diagnoses a cm³ dial. */
function volumeNope(l: number, w: number, h: number) {
  const floor = l * w, v = floor * h
  const fix = `Floor: ${l} × ${w} = ${num(floor)}. Times the height: ${num(floor)} × ${h} = ${cm3(v)}.`
  return (value: number) => {
    if (value === 0) return `An empty chest won’t impress anyone. ${fix}`
    if (value === l + w + h) return `You added the sides: ${l} + ${w} + ${h}. Volume multiplies them. ${fix}`
    if (value === floor) return `That’s just the floor (one layer of 1 cm cubes). Stack it ${h} cm high. ${fix}`
    if (value === l * h || value === w * h) return `That’s the area of one face. Volume needs all three lengths multiplied. ${fix}`
    if (value === 2 * (l * w + l * h + w * h)) return `That’s the surface area: the outside of the chest. Volume is the space inside. ${fix}`
    if (value === v * 10) return `A zero too many. ${fix}`
    if (value * 10 === v) return `A zero short. ${fix}`
    return `${value < v ? 'Lid’s open, it’s not full' : 'Loot’s spilling over the top'}: ${cm3(value)} is ${value < v ? 'too little' : 'too much'}. ${fix}`
  }
}

const LOOT_L = [20, 25, 30, 40, 50, 60], LOOT_W = [10, 20, 25, 30, 40], LOOT_H = [10, 15, 20, 25, 30, 40]

/** A chest in cm whose volume is a multiple of 500, from `lo` to `hi` cm³, with three different sides. */
function pickChest(rand: Rand, lo: number, hi: number) {
  for (;;) {
    const l = rand.pick(LOOT_L), w = rand.pick(LOOT_W), h = rand.pick(LOOT_H)
    const v = l * w * h
    if (l <= w || l === h || w === h || v % 500 !== 0 || v < lo || v > hi) continue
    return { l, w, h, v }
  }
}

function lootRound(rand: Rand): Round {
  const a = pickChest(rand, 6000, 72000)
  let b = pickChest(rand, 6000, 72000)
  while (b.h === a.h || b.v === a.v) b = pickChest(rand, 6000, 72000)
  const floor = a.l * a.w, bFloor = b.l * b.w
  const box: Box = { mode: 'loot', l: a.l, w: a.w, h: a.h }
  const tall = (k: number) => `${num(k)} cm`
  const choices = options<number>(rand, { value: b.h, label: tall(b.h) }, [
    { value: b.v / b.l, label: tall(b.v / b.l), nope: `That’s ${cm3(b.v)} ÷ ${b.l} only. Divide by the whole floor, ${b.l} × ${b.w} = ${num(bFloor)}, and you get ${b.h} cm.` },
    { value: bFloor, label: tall(bFloor), nope: `${num(bFloor)} is the floor area, ${b.l} × ${b.w}, in cm². How many floors stack up to ${cm3(b.v)}? ${num(b.v)} ÷ ${num(bFloor)} = ${b.h}.` },
    { value: b.v / (b.l + b.w), label: tall(b.v / (b.l + b.w)), nope: `You divided by ${b.l} + ${b.w}. The floor is ${b.l} × ${b.w} = ${num(bFloor)}, so ${num(b.v)} ÷ ${num(bFloor)} = ${b.h} cm.` },
    { value: b.h * 10, label: tall(b.h * 10), nope: `A zero too many. Check: ${num(bFloor)} × ${b.h * 10} = ${num(bFloor * b.h * 10)}, not ${num(b.v)}.` },
    { value: b.v - bFloor, label: tall(b.v - bFloor), nope: `Volume isn’t floor + height, so you can’t take the floor away. ${num(b.v)} ÷ ${num(bFloor)} = ${b.h} cm.` },
  ], { valid: value => Number.isInteger(value) && value > 0 && value <= 1000 })
  return {
    id: 'loot',
    title: 'Round 2 · Real units',
    headline: 'Length × width × height, in cm³',
    why: `Real chests are measured in cm. Picture filling it with 1 cm cubes: the floor takes length × width of them, and there are “height” layers. So volume = l × w × h, and the answer is in cm³ (cubic centimetres).`,
    dials: [{
      id: 'chest', box, fills: 'volume', label: 'Volume',
      prompt: `This chest is ${a.l} cm long, ${a.w} cm wide and ${a.h} cm tall. What’s its volume?`,
      answer: a.v, start: 0, min: 0, max: 100000, step: 500, jump: 5000,
      win: `${a.l} × ${a.w} = ${num(floor)} on the floor, × ${a.h} high = ${cm3(a.v)}.`,
      nope: volumeNope(a.l, a.w, a.h),
    }],
    side: {
      prompt: `Another chest holds ${cm3(b.v)}. Its floor is ${b.l} cm by ${b.w} cm. How tall is it?`,
      answer: b.h,
      choices,
      why: `Work backwards. Floor: ${b.l} × ${b.w} = ${num(bFloor)}. Then ${num(b.v)} ÷ ${num(bFloor)} = ${b.h} cm.`,
      box: { mode: 'loot', l: b.l, w: b.w, h: b.h },
      labels: [`${b.l} cm`, `${b.w} cm`, '? cm'],
    },
    chain: [
      { line: `V = [[l:${a.l}]] \\times [[w:${a.w}]] \\times [[h:${a.h}]]` },
      { line: `V = [[f:${texNum(floor)}]] \\times [[h:${a.h}]]`, op: 'Floor first', merge: { f: ['l', 'w'] }, why: `${a.l} × ${a.w} = ${num(floor)}: that’s how many 1 cm cubes cover the floor.` },
      { line: `V = [[v:${texNum(a.v)}\\text{ cm}^3]]`, op: '× the height', merge: { v: ['f', 'h'] }, why: `${a.h} layers of ${num(floor)}: ${num(floor)} × ${a.h} = ${num(a.v)}. Cubes, so cm³.` },
      { line: `h = [[b:${texNum(b.v)}]] \\div [[g:${texNum(bFloor)}]]`, op: 'Backwards', why: `For the other chest, volume ÷ floor gives the height. Its floor is ${b.l} × ${b.w} = ${num(bFloor)}.` },
      { line: `h = [[k:${b.h}\\text{ cm}]]`, op: 'Divide', merge: { k: ['b', 'g'] }, why: `${num(b.v)} ÷ ${num(bFloor)} = ${b.h}. Check: ${b.l} × ${b.w} × ${b.h} = ${num(b.v)}.` },
    ],
  }
}

// ─── Round 3: litres ───────────────────────────────────────────────────────────────────────────

function litreNope(l: number, w: number, h: number) {
  const v = l * w * h, ans = v / 1000
  const fix = `1 litre = 1,000 cm³, so ${num(v)} ÷ 1,000 = ${litres(ans)}.`
  return (value: number) => {
    if (value === 0) return `No slime at all! ${fix}`
    if (value * 100 === v) return `You divided by 100. A litre is 1,000 cm³, not 100, so that’s 10 times too much slime. ${fix}`
    if (value * 10 === v) return `You divided by 10. A litre is 1,000 cm³, so that’s 100 times too much slime. ${fix}`
    if (value === v) return `That’s the cm³, not converted. ${fix}`
    if (value * 10000 === v) return `You divided by 10,000. That’s too far: a litre is 1,000 cm³. ${fix}`
    if (value * 1000 === l * w) return `That’s only the floor, ${l} × ${w}, ÷ 1,000. Times the height first. ${fix}`
    return `${value < ans ? 'Not full yet' : 'Slime over the top'}: ${litres(value)} is ${value < ans ? 'too little' : 'too much'}. ${fix}`
  }
}

function slimeRound(rand: Rand): Round {
  const t = pickChest(rand, 6000, 48000)
  const ans = t.v / 1000, floor = t.l * t.w
  const box: Box = { mode: 'slime', l: t.l, w: t.w, h: t.h }
  const jug = rand.pick([1.5, 2, 2.5, 3, 4, 5]), jugCm = jug * 1000
  const jugText = `${num(jug)}-litre`
  return {
    id: 'slime',
    title: 'Round 3 · Slime tank',
    headline: '1 litre is 1,000 cm³',
    why: `Liquids are measured in litres. A litre is a 10 cm × 10 cm × 10 cm cube, which is 1,000 cm³. So find the volume in cm³ first, then ÷ 1,000 to get litres.`,
    dials: [
      {
        id: 'tank', box, fills: 'volume', label: 'Volume',
        prompt: `Dex’s slime tank is ${t.l} cm by ${t.w} cm by ${t.h} cm. First, its volume?`,
        answer: t.v, start: 0, min: 0, max: 100000, step: 500, jump: 5000,
        win: `${t.l} × ${t.w} × ${t.h} = ${cm3(t.v)}. Now turn that into litres.`,
        nope: volumeNope(t.l, t.w, t.h),
      },
      {
        id: 'litres', box, fills: 'litres', label: 'Slime',
        prompt: `It holds ${cm3(t.v)}. How many litres of slime fill it to the top?`,
        answer: ans, start: 0, min: 0, max: 500, step: 0.5, jump: 10,
        win: `${num(t.v)} ÷ 1,000 = ${litres(ans)}. Filled to the brim, not a drop spilt.`,
        nope: litreNope(t.l, t.w, t.h),
      },
    ],
    side: {
      prompt: `Dex grabs a ${jugText} jug of slime. How many cm³ is that?`,
      answer: jugCm,
      choices: options<number>(rand, { value: jugCm, label: cm3(jugCm) }, [
        { value: jug * 100, label: cm3(jug * 100), nope: `That’s × 100. A litre is 1,000 cm³: ${jug} × 1,000 = ${num(jugCm)}.` },
        { value: jug * 10000, label: cm3(jug * 10000), nope: `That’s × 10,000, too far. A litre is 1,000 cm³: ${jug} × 1,000 = ${num(jugCm)}.` },
        { value: jug, label: cm3(jug), nope: `You forgot to convert. A ${jugText} jug is way more than ${jug} tiny 1 cm cubes: ${jug} × 1,000 = ${num(jugCm)}.` },
        { value: jug * 10, label: cm3(jug * 10), nope: `That’s × 10. A litre is 1,000 cm³: ${jug} × 1,000 = ${num(jugCm)}.` },
      ]),
      why: `Litres to cm³ goes the other way: × 1,000. ${jug} × 1,000 = ${cm3(jugCm)}.`,
      box: { mode: 'slime', l: 10, w: 10, h: 10 },
      labels: ['10 cm', '10 cm', '10 cm'],
    },
    chain: [
      { line: `V = [[l:${t.l}]] \\times [[w:${t.w}]] \\times [[h:${t.h}]]` },
      { line: `V = [[f:${texNum(floor)}]] \\times [[h:${t.h}]]`, op: 'Floor first', merge: { f: ['l', 'w'] }, why: `${t.l} × ${t.w} = ${num(floor)} cm² of floor.` },
      { line: `V = [[v:${texNum(t.v)}\\text{ cm}^3]]`, op: '× the height', merge: { v: ['f', 'h'] }, why: `${num(floor)} × ${t.h} = ${num(t.v)}. That’s the tank’s volume in cm³.` },
      { line: `\\text{Litres} = [[v:${texNum(t.v)}]] \\div [[k:1{,}000]]`, op: '÷ 1,000', why: `Every litre is 1,000 cm³ (a 10 cm cube), so count how many thousands there are.` },
      { line: `\\text{Litres} = [[r:${ans}]]`, op: 'Divide', merge: { r: ['v', 'k'] }, why: `${num(t.v)} ÷ 1,000 = ${num(ans)}. The tank holds ${litres(ans)} of slime.` },
    ],
  }
}

export function makeRounds(rand: Rand): Round[] {
  return [cratesRound(rand), lootRound(rand), slimeRound(rand)]
}
