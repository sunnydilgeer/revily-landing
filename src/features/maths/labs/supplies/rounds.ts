import type { ChainStep } from '../../step-chain/StepChain'
import { options, texNum, type Option, type Rand } from '../kit/random'

/*
 * 99 Nights Supplies: Scout is packing for a forest camp before dark. Every supply is measured out
 * on a dial in the unit the kit uses (cm, m, ml, g, minutes, decimal hours), so every move is a unit
 * conversion. Answers are picked first (whole pieces, cups, bags and shifts) and the amounts built
 * backwards from them, so every division comes out whole.
 */

/** Numbers on screen: 1,200 · 2.5 · 0.75 */
export const fmt = (value: number) => value.toLocaleString('en-GB', { maximumFractionDigits: 2 })
/** 150 → "2 h 30 min" */
export const hm = (minutes: number) => {
  const h = Math.floor(minutes / 60), m = Math.round(minutes - h * 60)
  return h ? (m ? `${h} h ${m} min` : `${h} h`) : `${m} min`
}
/** "5 cups", "1 cup" */
export const unitText = (value: number, unit: string) => `${fmt(value)} ${value === 1 && unit.endsWith('s') ? unit.slice(0, -1) : unit}`
const near = (value: number, target: number, tolerance: number) => Math.abs(value - target) < tolerance - 1e-9
const r2 = (value: number) => Math.round(value * 100) / 100

/** What the camp scene draws for a dial step, from the value the student committed. */
export type Scene =
  /** A bar from one thing to another: rope from tent to peg, the trail to the wood, the watch on a timeline. */
  | { kind: 'measure'; look: 'rope' | 'trail' | 'time'; from: string; to: string; target: number; given: string }
  /** The water can poured into a measuring jug. */
  | { kind: 'jug'; target: number; given: string }
  /** A whole cut into equal pieces: guy lines from the rope, shifts from the night. */
  | { kind: 'split'; look: 'rope' | 'time'; total: number; each: number; given: string; eachText: string }
  /** A store shared into containers: water into cups, rice into bags. */
  | { kind: 'fill'; item: 'cup' | 'bag'; source: string; target: number; given: string }

export type DialStep = {
  kind: 'dial'
  id: string
  asker: string
  prompt: string
  /** The dial's name, also used in its button names: "Rope". */
  label: string
  unit: string
  answer: number
  start: number
  min: number
  max: number
  step: number
  jump: number
  commit: string
  win: string
  /** What goes on the packed list once it's right. */
  packed: string
  nope: (value: number) => string
  scene: Scene
}

export type ChoiceStep = {
  kind: 'choice'
  id: string
  asker: string
  prompt: string
  answer: string
  choices: Option<string>[]
  why: string
}

export type Step = DialStep | ChoiceStep

export type Round = {
  id: string
  title: string
  headline: string
  why: string
  steps: Step[]
  chain: ChainStep[]
}

// ─── Round 1 · Rope and wood: m ↔ cm, km ↔ m, mm ──────────────────────────────────────────

/** Three bits of rope in three units. The mm one always has the biggest number but is never the longest. */
function longestRope(rand: Rand): { prompt: string; answer: string; choices: Option<string>[]; why: string } {
  for (;;) {
    const m = rand.int(3, 9) / 10, cm = rand.int(25, 95, 5), mm = rand.int(20, 95) * 10
    const lens = { m: Math.round(m * 1000), cm: cm * 10, mm }
    const sorted = Object.values(lens).sort((a, b) => b - a)
    if (sorted[0] - sorted[1] < 30 || sorted[1] - sorted[2] < 30) continue
    const best = (Object.keys(lens) as (keyof typeof lens)[]).find(key => lens[key] === sorted[0])!
    if (best === 'mm') continue
    const label = { m: `${fmt(m)} m`, cm: `${cm} cm`, mm: `${mm} mm` }
    const all = `${label.m} = ${fmt(lens.m)} mm, ${label.cm} = ${fmt(lens.cm)} mm.`
    const wrong = (key: keyof typeof lens): Option<string> => ({
      value: key, label: label[key],
      nope: key === 'mm'
        ? `${mm} is the biggest number, not the longest rope. Turn them all into mm: ${all} ${label[best]} wins.`
        : `${label[key]} = ${fmt(lens[key])} mm, but ${label[best]} = ${fmt(lens[best])} mm. Turn them all into mm first, then compare.`,
    })
    const others = (['m', 'cm', 'mm'] as const).filter(key => key !== best)
    return {
      prompt: 'Three spare bits of rope. Which one is the longest?',
      answer: best,
      choices: options<string>(rand, { value: best, label: label[best] }, others.map(wrong)),
      why: `Same unit first. In mm: ${all} So ${label[best]} is the longest. 1 m = 1,000 mm, 1 cm = 10 mm.`,
    }
  }
}

function ropeRound(rand: Rand): Round {
  for (;;) {
    const P = rand.pick([20, 25, 50, 50]), k = rand.int(4, 12)
    const L = k * P
    if (L % 50 || L < 150 || L > 650) continue
    const A = L / 100
    const W = rand.pick([0.5, 0.75, 0.8, 1.2, 1.25, 1.5, 1.8, 2, 2.5])
    const Wm = Math.round(W * 1000)
    const fixL = `1 m = 100 cm, so ${fmt(A)} m × 100 = ${L} cm.`
    const fixW = `1 km = 1,000 m, so ${fmt(W)} × 1,000 = ${fmt(Wm)} m.`
    return {
      id: 'rope',
      title: 'Round 1 · Rope and wood',
      headline: 'Measure the rope. Cut the guy lines. Find the wood.',
      why: `Going from a big unit to a small one, the number gets bigger: multiply. 1 km = 1,000 m, 1 m = 100 cm, 1 cm = 10 mm. Get the units the same before you cut or compare anything.`,
      steps: [
        {
          kind: 'dial', id: 'rope-cm', asker: 'in cm', label: 'Rope', unit: 'cm',
          prompt: `The rope reel says ${fmt(A)} m. The tent instructions only talk in cm. How many cm of rope is that?`,
          answer: L, start: 0, min: 0, max: 1000, step: 10, jump: 100, commit: 'Roll it out',
          win: `${fmt(A)} m × 100 = ${L} cm. Metres to cm is × 100, so the number gets 100 times bigger.`,
          packed: `🪢 ${L} cm of rope`,
          scene: { kind: 'measure', look: 'rope', from: '⛺', to: '📍', target: L, given: `Reel: ${fmt(A)} m` },
          nope: v => {
            if (v === 0) return `Nothing rolled out. ${fixL}`
            if (near(v, A * 10, 10)) return `That’s × 10. There are 100 cm in a metre, not 10. ${fixL}`
            if (v < L) return `${v} cm is only ${fmt(v / 100)} m. The rope stops short of the peg. ${fixL}`
            return `${v} cm is ${fmt(v / 100)} m, more rope than the reel has. ${fixL}`
          },
        },
        {
          kind: 'dial', id: 'rope-cut', asker: 'in guy lines', label: 'Guy lines', unit: 'pieces',
          prompt: `Cut the whole ${fmt(A)} m rope into ${P} cm guy lines. How many guy lines do you get?`,
          answer: k, start: 0, min: 0, max: 30, step: 1, jump: 5, commit: 'Cut the rope',
          win: `${fmt(A)} m = ${L} cm, and ${L} ÷ ${P} = ${k}. Same units first, then divide.`,
          packed: `✂️ ${k} guy lines`,
          scene: { kind: 'split', look: 'rope', total: L, each: P, given: `${fmt(A)} m rope`, eachText: `${P} cm` },
          nope: v => {
            const fix = `${fmt(A)} m = ${L} cm, and ${L} ÷ ${P} = ${k}.`
            if (v === 0) return `No cuts made. ${fix}`
            if (v * P === A * 10) return `That treats 1 m as 10 cm. It’s 100 cm. ${fix}`
            if (v > k) return `${v} × ${P} cm = ${v * P} cm of rope. You’ve only got ${L} cm. ${fix}`
            return `${v} × ${P} cm = ${v * P} cm, leaving ${L - v * P} cm of rope unused. ${fix}`
          },
        },
        {
          kind: 'dial', id: 'wood-m', asker: 'in metres', label: 'Trail', unit: 'm',
          prompt: `Dry firewood is ${fmt(W)} km down the trail. Scout’s map counts in metres. How far is it?`,
          answer: Wm, start: 0, min: 0, max: 3000, step: 50, jump: 500, commit: 'Walk it',
          win: `${fmt(W)} km × 1,000 = ${fmt(Wm)} m. A kilometre is a thousand metres.`,
          packed: `🪵 wood at ${fmt(Wm)} m`,
          scene: { kind: 'measure', look: 'trail', from: '⛺', to: '🪵', target: Wm, given: `${fmt(W)} km` },
          nope: v => {
            if (v === 0) return `You haven’t left the tent. ${fixW}`
            if (near(v, W * 100, 50)) return `That’s × 100, which is for metres to cm. ${fixW}`
            if (near(v, W * 10, 50)) return `That’s × 10. There are 1,000 m in a km. ${fixW}`
            if (v < Wm) return `${fmt(v)} m is only ${fmt(v / 1000)} km. You’d stop in the middle of the woods. ${fixW}`
            return `${fmt(v)} m is ${fmt(v / 1000)} km. You walked right past the wood. ${fixW}`
          },
        },
        { kind: 'choice', id: 'rope-longest', asker: 'quick check', ...longestRope(rand) },
      ],
      chain: [
        { line: `[[r:\\text{rope}]] = [[a:${A}]]\\text{ m}` },
        { line: `[[r:\\text{rope}]] = [[a:${A}]] \\times [[f:100]]\\text{ cm}`, op: '× 100', why: `1 m = 100 cm, so metres to cm is × 100.` },
        { line: `[[r:\\text{rope}]] = [[c:${L}]]\\text{ cm}`, op: 'Work it out', merge: { c: ['a', 'f'] }, why: `${fmt(A)} × 100 = ${L}. Big unit to small unit: the number gets bigger.` },
        { line: `\\text{lines} = [[c:${L}]] \\div [[p:${P}]]`, op: `÷ ${P}`, why: `Both in cm now, so share the ${L} cm into ${P} cm pieces.` },
        { line: `\\text{lines} = [[k:${k}]]`, op: 'Work it out', merge: { k: ['c', 'p'] }, why: `${L} ÷ ${P} = ${k} guy lines, and no rope wasted.` },
      ],
    }
  }
}

// ─── Round 2 · Water and food: litres ↔ ml, kg ↔ g ───────────────────────────────────────

function supplyRound(rand: Rand): Round {
  for (;;) {
    const C = rand.pick([1.5, 2, 2.5, 3, 4, 4.5, 5]), V = rand.pick([200, 250, 300, 500])
    const ml = Math.round(C * 1000), cups = ml / V
    if (!Number.isInteger(cups) || cups < 4 || cups > 20) continue
    const R = rand.pick([0.5, 1, 1.5, 2, 2.5, 3]), B = rand.pick([100, 150, 200, 250, 300, 500])
    const g = Math.round(R * 1000), bags = g / B
    if (!Number.isInteger(bags) || bags < 3 || bags > 15) continue
    const X = rand.pick([0.6, 0.8, 1.2, 1.4, 1.6, 1.8, 2.4, 2.5, 3.5])
    const Xg = Math.round(X * 1000)
    const fixC = `1 litre = 1,000 ml, so ${fmt(C)} × 1,000 = ${fmt(ml)} ml.`
    const fixCups = `${fmt(C)} litres = ${fmt(ml)} ml, and ${fmt(ml)} ÷ ${V} = ${cups}.`
    const fixBags = `${fmt(R)} kg = ${fmt(g)} g, and ${fmt(g)} ÷ ${B} = ${bags}.`
    const grams = (value: number) => ({ value: String(value), label: `${fmt(value)} g` })
    return {
      id: 'supply',
      title: 'Round 2 · Water and food',
      headline: 'Pour the water. Bag the rice.',
      why: `Litres and kilograms are the big units. 1 litre = 1,000 ml and 1 kg = 1,000 g, so going small means × 1,000, not × 100. Once the amounts are in the same unit, sharing into cups or bags is just divide.`,
      steps: [
        {
          kind: 'dial', id: 'water-ml', asker: 'in ml', label: 'Water', unit: 'ml',
          prompt: `The water can holds ${fmt(C)} litres. The measuring jug is marked in ml. How many ml is that?`,
          answer: ml, start: 0, min: 0, max: 6000, step: 50, jump: 500, commit: 'Pour it in',
          win: `${fmt(C)} litres × 1,000 = ${fmt(ml)} ml. Every litre is a thousand millilitres.`,
          packed: `💧 ${fmt(ml)} ml of water`,
          scene: { kind: 'jug', target: ml, given: `${fmt(C)} litres` },
          nope: v => {
            if (v === 0) return `The jug’s empty. ${fixC}`
            if (near(v, C * 100, 50)) return `That’s as if 1 litre were 100 ml. It’s 1,000 ml. ${fixC}`
            if (near(v, C * 10, 50)) return `That’s × 10. A litre is 1,000 ml. ${fixC}`
            if (v < ml) return `${fmt(v)} ml is only ${fmt(v / 1000)} litres. Water’s still left in the can. ${fixC}`
            return `${fmt(v)} ml is ${fmt(v / 1000)} litres. The jug overflows: the can doesn’t have that much. ${fixC}`
          },
        },
        {
          kind: 'dial', id: 'water-cups', asker: 'in cups', label: 'Cups', unit: 'cups',
          prompt: `Pour all ${fmt(C)} litres into ${V} ml cups. How many cups can you fill?`,
          answer: cups, start: 0, min: 0, max: 30, step: 1, jump: 5, commit: 'Fill the cups',
          win: `${fmt(ml)} ml ÷ ${V} ml = ${cups} cups, every drop used.`,
          packed: `🥤 ${cups} cups of water`,
          scene: { kind: 'fill', item: 'cup', source: '💧', target: cups, given: `${fmt(C)} litres · ${V} ml cups` },
          nope: v => {
            if (v === 0) return `No cups poured. ${fixCups}`
            if (v * V === C * 100) return `That’s 1 litre = 100 ml. It’s 1,000 ml. ${fixCups}`
            if (v > cups) return `${v} × ${V} ml = ${fmt(v * V)} ml. The can only holds ${fmt(ml)} ml, so some cups stay empty. ${fixCups}`
            return `${v} × ${V} ml = ${fmt(v * V)} ml, leaving ${fmt(ml - v * V)} ml in the can. ${fixCups}`
          },
        },
        {
          kind: 'dial', id: 'rice-bags', asker: 'in bags', label: 'Bags', unit: 'bags',
          prompt: `There’s ${fmt(R)} kg of rice. Pack it into ${B} g bags. How many bags?`,
          answer: bags, start: 0, min: 0, max: 30, step: 1, jump: 5, commit: 'Bag it up',
          win: `${fmt(R)} kg = ${fmt(g)} g, then ${fmt(g)} ÷ ${B} = ${bags} bags.`,
          packed: `🍚 ${bags} bags of rice`,
          scene: { kind: 'fill', item: 'bag', source: '🍚', target: bags, given: `${fmt(R)} kg · ${B} g bags` },
          nope: v => {
            if (v === 0) return `No bags packed. ${fixBags}`
            if (v * B === R * 100) return `That’s 1 kg = 100 g. A kilogram is 1,000 g. ${fixBags}`
            if (v > bags) return `${v} × ${B} g = ${fmt(v * B)} g. There’s only ${fmt(g)} g of rice. ${fixBags}`
            return `${v} × ${B} g = ${fmt(v * B)} g, leaving ${fmt(g - v * B)} g of rice in the sack. ${fixBags}`
          },
        },
        {
          kind: 'choice', id: 'stew-g', asker: 'quick check',
          prompt: `The stew pot weighs ${fmt(X)} kg. The camp scales only do grams. What do they read?`,
          answer: String(Xg),
          choices: options<string>(rand, grams(Xg), [
            { ...grams(Math.round(X * 100)), nope: `That’s × 100, as if 1 kg were 100 g. It’s 1,000 g: ${fmt(X)} × 1,000 = ${fmt(Xg)} g.` },
            { ...grams(Math.round(X * 10000)), nope: `That’s × 10,000. 1 kg = 1,000 g, so ${fmt(X)} × 1,000 = ${fmt(Xg)} g.` },
            { ...grams(Math.round(X * 10)), nope: `That’s × 10. 1 kg = 1,000 g, so ${fmt(X)} × 1,000 = ${fmt(Xg)} g.` },
          ]),
          why: `1 kg = 1,000 g, so ${fmt(X)} kg × 1,000 = ${fmt(Xg)} g.`,
        },
      ],
      chain: [
        { line: `[[r:\\text{rice}]] = [[a:${R}]]\\text{ kg}` },
        { line: `[[r:\\text{rice}]] = [[a:${R}]] \\times [[f:1000]]\\text{ g}`, op: '× 1,000', why: `1 kg = 1,000 g, so kg to g is × 1,000.` },
        { line: `[[r:\\text{rice}]] = [[c:${texNum(g)}]]\\text{ g}`, op: 'Work it out', merge: { c: ['a', 'f'] }, why: `${fmt(R)} × 1,000 = ${fmt(g)}. Big unit to small unit: the number gets bigger.` },
        { line: `\\text{bags} = [[c:${texNum(g)}]] \\div [[b:${B}]]`, op: `÷ ${B}`, why: `Both in grams now, so share the ${fmt(g)} g into ${B} g bags.` },
        { line: `\\text{bags} = [[k:${bags}]]`, op: 'Work it out', merge: { k: ['c', 'b'] }, why: `${fmt(g)} ÷ ${B} = ${bags} bags of rice.` },
      ],
    }
  }
}

// ─── Round 3 · Night watch: hours ↔ minutes, decimal hours, a timeline ─────────────────────

function endTime(rand: Rand): { prompt: string; answer: string; choices: Option<string>[]; why: string } {
  for (;;) {
    const sh = rand.int(6, 9), sm = rand.int(20, 55, 5), dh = rand.int(1, 2), dm = rand.int(20, 55, 5)
    if (sm + dm <= 60) continue
    const eh = sh + dh + 1, em = sm + dm - 60
    if (eh + 1 > 11) continue
    const pad = (m: number) => String(m).padStart(2, '0')
    const time = (h: number, m: number) => ({ value: `${h}:${pad(m)}`, label: `${h}:${pad(m)} pm` })
    const fix = `${sm} + ${dm} = ${sm + dm} min = 1 h ${em} min. So ${sh}:${pad(sm)} + ${dh} h + 1 h ${em} min = ${eh}:${pad(em)} pm.`
    return {
      prompt: `Last watch starts at ${sh}:${pad(sm)} pm and lasts ${dh} h ${dm} min. When does it end?`,
      answer: time(eh, em).value,
      choices: options<string>(rand, time(eh, em), [
        { ...time(sh + dh, sm + dm), nope: `There’s no ${sm + dm} minutes past the hour. Time isn’t a decimal: 60 minutes make an hour. ${fix}` },
        { ...time(sh + dh, em), nope: `Nearly. ${sm + dm} minutes is 1 h ${em} min, and you dropped that extra hour. ${fix}` },
        { ...time(eh + 1, em), nope: `One hour too many. ${fix}` },
      ]),
      why: `${sh}:${pad(sm)} + ${dh} h = ${sh + dh}:${pad(sm)}. Then + ${dm} min goes past the hour: ${sm} + ${dm} = ${sm + dm} min = 1 h ${em} min. Ends ${eh}:${pad(em)} pm.`,
    }
  }
}

function watchRound(rand: Rand): Round {
  for (;;) {
    const H = rand.pick([1.5, 2.5, 3.5, 4.5, 1.25, 2.25, 2.75, 3.25, 3.75])
    const Hm = Math.round(H * 60), Hw = Math.floor(H), Hf = r2(H - Hw)
    const S = rand.pick([20, 30, 40, 45, 60, 90]), shifts = rand.int(3, 12)
    const total = S * shifts
    if (total % 30 || total < 120 || total > 600) continue
    const T = total / 60
    if (T === H) continue
    // Quarter and half hours only: then the "minutes as a decimal" slip (2.30 h) lands on the dial too.
    const h = rand.int(1, 4), m = rand.pick([15, 30, 45])
    const D = r2(h + m / 60), Df = r2(m / 60)
    const fixH = `1 hour = 60 minutes, so ${fmt(H)} × 60 = ${Hm} minutes.`
    const fixT = `${fmt(T)} hours = ${total} minutes, and ${total} ÷ ${S} = ${shifts}.`
    const fixD = `${m} min = ${m} ÷ 60 = ${fmt(Df)} h, so ${h} h ${m} min = ${fmt(D)} h.`
    return {
      id: 'watch',
      title: 'Round 3 · Night watch',
      headline: 'Set the watch. Split the night. Log the fire.',
      why: `Time is NOT a decimal. An hour is 60 minutes, not 100. So 0.5 h is 30 minutes, and 2 h 30 min is 2.5 h, not 2.30 h. Hours to minutes: × 60. Minutes to hours: ÷ 60.`,
      steps: [
        {
          kind: 'dial', id: 'watch-min', asker: 'in minutes', label: 'Watch', unit: 'min',
          prompt: `Scout’s first watch by the fire is ${fmt(H)} hours. The timer counts minutes. Set it.`,
          answer: Hm, start: 0, min: 0, max: 600, step: 5, jump: 60, commit: 'Start the timer',
          win: `${fmt(H)} × 60 = ${Hm} minutes. That’s ${hm(Hm)}.`,
          packed: `⏱️ ${Hm} min watch`,
          scene: { kind: 'measure', look: 'time', from: '🔥', to: '🌙', target: Hm, given: `${fmt(H)} hours` },
          nope: v => {
            if (v === 0) return `Timer’s on zero. ${fixH}`
            if (Hf && v === Hw * 60 + Math.round(Hf * 100)) return `${fmt(Hf)} h isn’t ${Math.round(Hf * 100)} minutes. An hour is 60 minutes, so ${fmt(Hf)} h = ${fmt(Hf)} × 60 = ${Math.round(Hf * 60)} min. ${fixH}`
            if (v === Math.round(H * 100)) return `That’s × 100, as if an hour were 100 minutes. ${fixH}`
            if (v < Hm) return `${v} min is only ${hm(v)}. Scout falls asleep early. ${fixH}`
            return `${v} min is ${hm(v)}. That’s longer than the watch. ${fixH}`
          },
        },
        {
          kind: 'dial', id: 'watch-shifts', asker: 'in shifts', label: 'Shifts', unit: 'shifts',
          prompt: `The whole night watch is ${fmt(T)} hours. Each scout does a ${S}-minute shift. How many shifts?`,
          answer: shifts, start: 0, min: 0, max: 30, step: 1, jump: 5, commit: 'Make the rota',
          win: `${fmt(T)} hours = ${total} minutes, and ${total} ÷ ${S} = ${shifts} shifts.`,
          packed: `🧑‍🤝‍🧑 ${shifts} shifts`,
          scene: { kind: 'split', look: 'time', total, each: S, given: `${fmt(T)} hours`, eachText: `${S} min` },
          nope: v => {
            if (v === 0) return `Nobody’s on watch. ${fixT}`
            if (v * S === Math.round(T * 100)) return `That treats an hour as 100 minutes. It’s 60. ${fixT}`
            if (v > shifts) return `${v} × ${S} min = ${v * S} min, which is ${hm(v * S)}. The night is only ${fmt(T)} hours. ${fixT}`
            return `${v} × ${S} min = ${v * S} min, which is ${hm(v * S)}. That leaves ${hm(total - v * S)} with nobody on watch. ${fixT}`
          },
        },
        {
          kind: 'dial', id: 'fire-log', asker: 'in hours', label: 'Log', unit: 'h',
          prompt: `The fire burned for ${h} h ${m} min. The camp log wants hours as a decimal. What goes in the log?`,
          answer: D, start: 0, min: 0, max: 6, step: 0.05, jump: 0.25, commit: 'Write it in',
          win: `${m} min = ${m} ÷ 60 = ${fmt(Df)} h. So the log says ${fmt(D)} h.`,
          packed: `🔥 log: ${fmt(D)} h`,
          scene: { kind: 'measure', look: 'time', from: '🔥', to: '🪵', target: D, given: `${h} h ${m} min` },
          nope: v => {
            if (v === 0) return `The log’s blank. ${fixD}`
            if (near(v, h + m / 100, 0.025)) return `${fmt(v)} h treats the minutes like a decimal. An hour has 60 minutes, not 100. ${fixD}`
            if (near(v, h, 0.025)) return `You dropped the ${m} minutes. ${fixD}`
            return `${fmt(v)} h is ${hm(Math.round(v * 60))}, not ${h} h ${m} min. ${fixD}`
          },
        },
        { kind: 'choice', id: 'watch-end', asker: 'quick check', ...endTime(rand) },
      ],
      chain: [
        { line: `[[h:${h}]]\\text{ h} + [[m:${m}]]\\text{ min}` },
        { line: `[[h:${h}]] + [[q:\\tfrac{${m}}{60}]]\\text{ h}`, op: '÷ 60', why: `Minutes to hours is ÷ 60, because an hour is 60 minutes.` },
        { line: `[[h:${h}]] + [[d:${Df}]]\\text{ h}`, op: 'Work it out', merge: { d: ['q'] }, why: `${m} ÷ 60 = ${fmt(Df)}. Not 0.${m}: that would be out of 100.` },
        { line: `[[t:${D}]]\\text{ h}`, op: 'Add', merge: { t: ['h', 'd'] }, why: `${h} + ${fmt(Df)} = ${fmt(D)} hours in the log.` },
      ],
    }
  }
}

export function makeRounds(rand: Rand): Round[] {
  return [ropeRound(rand), supplyRound(rand), watchRound(rand)]
}
