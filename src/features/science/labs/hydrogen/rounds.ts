import { options, type Rand } from '../../../maths/labs/kit/random'
import { diagnose, n, tex, u, type Round, type Side, type Task } from '../kit/types'

/*
 * Green Hydrogen Lab: run an offshore-wind hydrogen plant with Professor Pip and fuel a Net Zero
 * town's buses (AQA Trilogy 8464 Chemistry: quantitative chemistry, electrolysis, rates, the
 * atmosphere). Every answer is picked first, then the question is built around it, so the numbers
 * stay whole.
 */

/** An element on the stage: its symbol, Ar and atomic number (for the classic mix-up). */
type Element = 'H' | 'C' | 'N' | 'O' | 'S' | 'Mg'
const AR: Record<Element, number> = { H: 1, C: 12, N: 14, O: 16, S: 32, Mg: 24 }
const Z: Record<Element, number> = { H: 1, C: 6, N: 7, O: 8, S: 16, Mg: 12 }

/** A molecule: how it reads on screen and in KaTeX, its atoms, and how to draw it (a chain of heavy atoms, with H hung off each). */
export type Molecule = { formula: string; tex: string; name: string; atoms: [Element, number][]; backbone: Element[]; h: number[] }

/** A term in an equation: its coefficient (null = the dial), formula, and the atoms in ONE molecule of it. */
export type Term = { coef: number | null; formula: string; atoms: Partial<Record<Element, number>> }
/** A pan on the conservation-of-mass scale: a substance and its mass (null = the dial). */
export type Load = { name: string; grams: number | null }

export type Scene =
  | { kind: 'molecule'; molecule: Molecule }
  | { kind: 'equation'; left: Term[]; right: Term[] }
  | { kind: 'mass'; left: Load[]; right: Load[] }
  /** Hofmann voltameter: hydrogen at the − electrode, oxygen at the +. `dial` is the tube being set. */
  | { kind: 'cell'; h2: number | null; o2: number | null; total?: number }
  /** A flask fizzing into a gas syringe. */
  | { kind: 'syringe'; volume: number; time: number | null; readings?: [number, number][]; dial: 'rate' | 'time'; note: string }
  | { kind: 'town'; before: number; percent: number }

export type HydrogenTask = Task<Scene>
export type HydrogenRound = Round<Scene>

const pickSide = (rand: Rand, prompt: string, right: string, wrongs: [string, string][], why: string): Side => ({
  prompt, answer: right,
  choices: options<string>(rand, { value: right, label: right }, wrongs.map(([label, nope]) => ({ value: label, label, nope })), { count: wrongs.length + 1 }),
  why,
})

/* ---------------------------------------------------------------- Round 1: relative formula mass */

const M = (formula: string, texF: string, name: string, atoms: [Element, number][], backbone: Element[], h: number[] = backbone.map(() => 0)): Molecule =>
  ({ formula, tex: texF, name, atoms, backbone, h })

const EASY: Molecule[] = [
  M('H₂O', '\\text{H}_2\\text{O}', 'water', [['H', 2], ['O', 1]], ['O'], [2]),
  M('NH₃', '\\text{NH}_3', 'ammonia', [['N', 1], ['H', 3]], ['N'], [3]),
  M('CH₄', '\\text{CH}_4', 'methane', [['C', 1], ['H', 4]], ['C'], [4]),
]
const HARDER: Molecule[] = [
  M('CO₂', '\\text{CO}_2', 'carbon dioxide', [['C', 1], ['O', 2]], ['O', 'C', 'O']),
  M('O₂', '\\text{O}_2', 'oxygen', [['O', 2]], ['O', 'O']),
  M('N₂', '\\text{N}_2', 'nitrogen', [['N', 2]], ['N', 'N']),
  M('H₂O₂', '\\text{H}_2\\text{O}_2', 'hydrogen peroxide', [['H', 2], ['O', 2]], ['O', 'O'], [1, 1]),
  M('C₂H₆', '\\text{C}_2\\text{H}_6', 'ethane', [['C', 2], ['H', 6]], ['C', 'C'], [3, 3]),
  M('NO₂', '\\text{NO}_2', 'nitrogen dioxide', [['N', 1], ['O', 2]], ['O', 'N', 'O']),
  M('SO₂', '\\text{SO}_2', 'sulfur dioxide', [['S', 1], ['O', 2]], ['O', 'S', 'O']),
]

const mr = (m: Molecule) => m.atoms.reduce((sum, [el, count]) => sum + AR[el] * count, 0)
const sumText = (m: Molecule) => m.atoms.map(([el, count]) => count === 1 ? `${AR[el]}` : `${count} × ${AR[el]}`).join(' + ')
const keyText = (m: Molecule) => m.atoms.map(([el]) => `${el} = ${AR[el]}`).join(', ')

function mrTask(id: string, m: Molecule, prompt: string): HydrogenTask {
  const answer = mr(m)
  const fix = `Mr of ${m.formula} = ${sumText(m)} = ${answer}.`
  const plain = m.atoms.reduce((s, [el]) => s + AR[el], 0)
  const atomic = m.atoms.reduce((s, [el, c]) => s + Z[el] * c, 0)
  const atomCount = m.atoms.reduce((s, [, c]) => s + c, 0)
  const most = Math.max(...m.atoms.map(([, c]) => c))
  return {
    id, prompt, label: 'Mr', unit: '', answer, start: 0, min: 0, max: 100, step: 1, jump: 10,
    win: `Add up the Ar of every atom, using the small numbers to count them. ${fix}`,
    nope: value => diagnose(answer, value, '', [
      [plain, `You added each Ar once and ignored the small numbers. The subscript tells you how many of that atom there are.`],
      [atomic, `You used the atomic numbers. Mr uses the relative atomic masses (${keyText(m)}).`],
      [atomCount, `That’s how many atoms there are. Each one needs its own Ar.`],
      [most * plain, `You multiplied the whole lot by ${most}. The small number only counts the atom just before it.`],
    ], fix),
    scene: { kind: 'molecule', molecule: m },
  }
}

/** The working for Mr: count × Ar for each element, then add. */
function mrChain(m: Molecule) {
  const terms = m.atoms.map(([el, count], i) => count === 1 ? `[[a${i}:${AR[el]}]]` : `[[a${i}:${count} \\times ${AR[el]}]]`)
  const lhs = `M_r(${m.tex})`
  const chain: HydrogenRound['chain'] = [{ line: `${lhs} = ${terms.join(' + ')}` }]
  const multiplied = m.atoms.some(([, count]) => count > 1)
  let keys = m.atoms.map((_, i) => `a${i}`)
  if (multiplied && m.atoms.length > 1) {
    const merge: Record<string, string[]> = {}
    const line = m.atoms.map(([el, count], i) => {
      if (count === 1) return `[[a${i}:${AR[el]}]]`
      merge[`m${i}`] = [`a${i}`]
      return `[[m${i}:${AR[el] * count}]]`
    })
    keys = m.atoms.map(([, count], i) => count === 1 ? `a${i}` : `m${i}`)
    chain.push({ line: `${lhs} = ${line.join(' + ')}`, op: 'Multiply', merge, why: `The small number counts the atoms: ${m.atoms.filter(([, c]) => c > 1).map(([el, c]) => `${c} × ${AR[el]} = ${c * AR[el]} for ${el}`).join(', ')}.` })
  }
  chain.push({
    line: `${lhs} = [[r:${mr(m)}]]`, op: m.atoms.length > 1 ? 'Add' : 'Multiply', merge: { r: keys },
    why: m.atoms.length > 1 ? `Add them up: Mr of ${m.formula} = ${mr(m)}. No units, it’s relative.` : `${sumText(m)} = ${mr(m)}. No units, it’s relative.`,
  })
  return chain
}

function massRound(rand: Rand): HydrogenRound {
  const a = rand.pick(EASY), b = rand.pick(HARDER)
  const t1 = mrTask('mr-1', a, `First, the feedstock. What is the relative formula mass of ${a.name}, ${a.formula}? (${keyText(a)})`)
  const t2 = mrTask('mr-2', b, `The lab also handles ${b.name}, ${b.formula}. What is its Mr? (${keyText(b)})`)
  return {
    id: 'mass', title: 'Round 1 · Weigh the molecules', headline: 'Relative formula mass',
    why: `Every element has a relative atomic mass, Ar: H = 1, C = 12, N = 14, O = 16. The small number after a symbol counts that atom. Mr is every atom’s Ar added up. Mr has no units because it’s relative.`,
    tasks: [t1, t2],
    side: pickSide(rand, 'What does the small 2 in H₂O tell you?', 'There are 2 hydrogen atoms', [
      ['There are 2 water molecules', 'A big number IN FRONT counts molecules (2H₂O). The small 2 counts the hydrogen atoms in one molecule.'],
      ['There are 2 oxygen atoms', 'The small number counts the atom just BEFORE it. That’s hydrogen, so 2 hydrogen atoms and 1 oxygen.'],
      ['Hydrogen has a charge of 2', 'Charges go up top, like O²⁻. The small 2 at the bottom counts 2 hydrogen atoms.'],
    ], `The subscript counts the atom just before it. H₂O is 2 hydrogen atoms and 1 oxygen atom, so its Mr is 2 × 1 + 16 = 18.`),
    chain: mrChain(b),
  }
}

/* ---------------------------------------------------------------- Round 2: balancing + conservation of mass */

const T = (coef: number, formula: string, atoms: Partial<Record<Element, number>>): Term => ({ coef, formula, atoms })
type Equation = { story: string; left: Term[]; right: Term[]; blank: ['left' | 'right', number] }
const H2O = (c: number) => T(c, 'H₂O', { H: 2, O: 1 }), H2 = (c: number) => T(c, 'H₂', { H: 2 }), O2 = (c: number) => T(c, 'O₂', { O: 2 })
const EQUATIONS: Equation[] = [
  { story: 'The electrolyser splits water.', left: [H2O(2)], right: [H2(2), O2(1)], blank: ['left', 0] },
  { story: 'The electrolyser splits water.', left: [H2O(2)], right: [H2(2), O2(1)], blank: ['right', 0] },
  { story: 'The bus’s fuel cell burns hydrogen.', left: [H2(2), O2(1)], right: [H2O(2)], blank: ['right', 0] },
  { story: 'The bus’s fuel cell burns hydrogen.', left: [H2(2), O2(1)], right: [H2O(2)], blank: ['left', 0] },
  { story: 'Some hydrogen goes to make ammonia for fertiliser.', left: [T(1, 'N₂', { N: 2 }), H2(3)], right: [T(2, 'NH₃', { N: 1, H: 3 })], blank: ['left', 1] },
  { story: 'Some hydrogen goes to make ammonia for fertiliser.', left: [T(1, 'N₂', { N: 2 }), H2(3)], right: [T(2, 'NH₃', { N: 1, H: 3 })], blank: ['right', 0] },
  { story: 'The town’s old gas boilers burned methane.', left: [T(1, 'CH₄', { C: 1, H: 4 }), O2(2)], right: [T(1, 'CO₂', { C: 1, O: 2 }), H2O(2)], blank: ['left', 1] },
  { story: 'The town’s old gas boilers burned methane.', left: [T(1, 'CH₄', { C: 1, H: 4 }), O2(2)], right: [T(1, 'CO₂', { C: 1, O: 2 }), H2O(2)], blank: ['right', 1] },
  { story: 'The depot’s old heaters burned propane.', left: [T(1, 'C₃H₈', { C: 3, H: 8 }), O2(5)], right: [T(3, 'CO₂', { C: 1, O: 2 }), H2O(4)], blank: ['left', 1] },
  { story: 'The depot’s old heaters burned propane.', left: [T(1, 'C₃H₈', { C: 3, H: 8 }), O2(5)], right: [T(3, 'CO₂', { C: 1, O: 2 }), H2O(4)], blank: ['right', 1] },
  { story: 'A magnesium ribbon burns in the safety demo.', left: [T(2, 'Mg', { Mg: 1 }), O2(1)], right: [T(2, 'MgO', { Mg: 1, O: 1 })], blank: ['right', 0] },
]

/** Atoms of each element on one side, with `value` in the blank (null coef). */
export function tally(terms: Term[], value: number) {
  const out: Partial<Record<Element, number>> = {}
  for (const term of terms) for (const [el, k] of Object.entries(term.atoms) as [Element, number][]) out[el] = (out[el] ?? 0) + (term.coef ?? value) * k
  return out
}
const coefText = (c: number) => c === 1 ? '' : `${c}`
const eqText = (terms: Term[], blank = '?') => terms.map(t => `${t.coef === null ? blank : coefText(t.coef)}${t.formula}`).join(' + ')

function balanceTask(rand: Rand): HydrogenTask {
  const eq = rand.pick(EQUATIONS)
  const [side, index] = eq.blank
  const sides = { left: eq.left.map(t => ({ ...t })), right: eq.right.map(t => ({ ...t })) }
  const blank = sides[side][index], answer = blank.coef as number
  blank.coef = null
  const elements = Object.keys({ ...tally(sides.left, answer) }) as Element[]
  const balanced = tally(sides.left, answer)
  const fix = `Put ${answer} in front of ${blank.formula}: then there are ${elements.map(el => `${balanced[el]} ${el}`).join(' and ')} on each side.`
  return {
    id: 'balance-1', prompt: `${eq.story} Balance it: ${eqText(sides.left)} → ${eqText(sides.right)}. What number goes in front of ${blank.formula}?`,
    label: 'Big number', unit: '', answer, start: 1, min: 1, max: 6, step: 1, jump: 2,
    win: `Atoms aren’t made or destroyed, just rearranged. ${fix}`,
    nope: value => {
      const l = tally(sides.left, value), r = tally(sides.right, value)
      const off = elements.find(el => l[el] !== r[el])
      if (!off) return diagnose(answer, value, '', [], fix)
      return `With ${value} in front of ${blank.formula}, there are ${l[off]} ${off} atoms on the left but ${r[off]} on the right. ${fix}`
    },
    scene: { kind: 'equation', left: sides.left, right: sides.right },
  }
}

function conservationTask(rand: Rand): { task: HydrogenTask; chain: HydrogenRound['chain'] } {
  if (rand.chance(0.5)) {
    const k = rand.int(2, 10), W = 9 * k, H = k, O = 8 * k
    const fix = `Mass in = mass out, so oxygen = ${W} − ${H} = ${O} g.`
    return {
      task: {
        id: 'mass-1', prompt: `The electrolyser splits ${W} g of water and makes ${H} g of hydrogen. What mass of oxygen comes off too?`,
        label: 'Oxygen', unit: 'g', answer: O, start: 0, min: 0, max: 100, step: 1, jump: 10,
        win: `No atoms are lost, so the products weigh the same as the water. ${fix}`,
        nope: value => diagnose(O, value, 'g', [
          [W + H, `You added the hydrogen on. The water splits INTO hydrogen and oxygen, so take it away.`],
          [W, `That’s all the water. Some of that mass left as hydrogen.`],
          [H, `That’s the hydrogen. The oxygen is the rest of the water’s mass.`],
          [W / 2, `It doesn’t split half and half. Mass in = mass out: water − hydrogen.`],
        ], fix),
        scene: { kind: 'mass', left: [{ name: 'water', grams: W }], right: [{ name: 'hydrogen', grams: H }, { name: 'oxygen', grams: null }] },
      },
      chain: [
        { line: `[[w:${W}]] = [[h:${H}]] + [[x:m]]` },
        { line: `[[x:m]] = [[w:${W}]] - [[h:${H}]]`, op: 'Get m on its own', why: `Mass of water = mass of hydrogen + mass of oxygen. Take the hydrogen off both sides.` },
        { line: `[[x:m]] = [[r:${O}]]\\,\\text{g}`, op: 'Subtract', merge: { r: ['w', 'h'] }, why: `${W} − ${H} = ${O} g of oxygen. Every gram of water is accounted for.` },
      ],
    }
  }
  const k = rand.int(1, 5), N = 28 * k, H = 6 * k, A = 34 * k
  const fix = `Mass in = mass out, so hydrogen = ${A} − ${N} = ${H} g.`
  return {
    task: {
      id: 'mass-1', prompt: `${N} g of nitrogen reacts with hydrogen to make ${A} g of ammonia. What mass of hydrogen was used?`,
      label: 'Hydrogen', unit: 'g', answer: H, start: 0, min: 0, max: 60, step: 1, jump: 10,
      win: `The ammonia weighs the same as the nitrogen and hydrogen that made it. ${fix}`,
      nope: value => diagnose(H, value, 'g', [
        [A + N, `You added. The ammonia already includes the nitrogen, so take it away.`],
        [N, `That’s the nitrogen. The hydrogen is the rest of the ammonia’s mass.`],
        [Math.round(A / 2), `It isn’t half and half. Mass in = mass out: ammonia − nitrogen.`],
      ], fix),
      scene: { kind: 'mass', left: [{ name: 'nitrogen', grams: N }, { name: 'hydrogen', grams: null }], right: [{ name: 'ammonia', grams: A }] },
    },
    chain: [
      { line: `[[n:${N}]] + [[x:m]] = [[a:${A}]]` },
      { line: `[[x:m]] = [[a:${A}]] - [[n:${N}]]`, op: 'Get m on its own', why: `Mass of nitrogen + mass of hydrogen = mass of ammonia. Take the nitrogen off both sides.` },
      { line: `[[x:m]] = [[r:${H}]]\\,\\text{g}`, op: 'Subtract', merge: { r: ['a', 'n'] }, why: `${A} − ${N} = ${H} g of hydrogen.` },
    ],
  }
}

function balanceRound(rand: Rand): HydrogenRound {
  const t1 = balanceTask(rand)
  const { task: t2, chain } = conservationTask(rand)
  return {
    id: 'balance', title: 'Round 2 · Balance the books', headline: 'Balancing and conservation of mass',
    why: `In a reaction, atoms are rearranged, never made or destroyed. So each element needs the same number of atoms on both sides. Balance by changing the BIG numbers in front, never the small ones. Because no atoms are lost, the mass of the products equals the mass of the reactants.`,
    tasks: [t1, t2],
    side: pickSide(rand, 'In a balanced equation, what is the same on both sides?', 'The number of atoms of each element', [
      ['The number of molecules', 'Molecules can change: 2H₂ + O₂ is 3 molecules but makes 2H₂O, just 2. It’s the ATOMS of each element that match.'],
      ['The big numbers in front', 'The big numbers often differ (2H₂O → 2H₂ + O₂). It’s the atoms of each element that match.'],
      ['The substances', 'The substances change, that’s the reaction. The atoms of each element stay the same.'],
    ], `Atoms are only rearranged, so each element has the same number of atoms on both sides. That’s why mass is conserved.`),
    chain,
  }
}

/* ---------------------------------------------------------------- Round 3: electrolysis gas volumes */

function cellRound(rand: Rand): HydrogenRound {
  const O = rand.pick([10, 15, 20, 25, 30, 35, 40, 45, 50]), H = 2 * O
  const fix1 = `Hydrogen is twice oxygen: 2 × ${O} = ${H} cm³.`
  const t1: HydrogenTask = {
    id: 'cell-1', prompt: `The oxygen tube has collected ${O} cm³. How much hydrogen is in the other tube?`,
    label: 'Hydrogen', unit: 'cm³', answer: H, start: 0, min: 0, max: 150, step: 5, jump: 10,
    win: `Water is H₂O, so you get 2 volumes of hydrogen for every 1 of oxygen. ${fix1}`,
    nope: value => diagnose(H, value, 'cm³', [
      [O, `Same as the oxygen? Water has two H atoms for every O, so there’s TWICE as much hydrogen.`],
      [O / 2, `Other way round: it’s the hydrogen that’s double, not the oxygen.`],
      [O + 2, `You added 2. The ratio 2 : 1 means multiply by 2.`],
      [3 * O, `That’s the total of 3 parts. Hydrogen is 2 parts.`],
    ], fix1),
    scene: { kind: 'cell', h2: null, o2: O },
  }

  const k = rand.pick([10, 15, 20, 25, 30, 35, 40, 45]), total = 3 * k, H2v = 2 * k
  const fix2 = `2 + 1 = 3 parts. ${total} ÷ 3 = ${k} cm³ a part, so hydrogen = 2 × ${k} = ${H2v} cm³.`
  const t2: HydrogenTask = {
    id: 'cell-2', prompt: `The next run collects ${total} cm³ of gas in total. How much of it is hydrogen?`,
    label: 'Hydrogen', unit: 'cm³', answer: H2v, start: 0, min: 0, max: 150, step: 5, jump: 10,
    win: `Split the total in the ratio 2 : 1. ${fix2}`,
    nope: value => diagnose(H2v, value, 'cm³', [
      [total / 2, `You split it half and half. It’s 2 : 1, so 3 parts, and hydrogen gets 2 of them.`],
      [k, `That’s ONE part, which is the oxygen. Hydrogen is 2 parts.`],
      [total, `That’s all the gas. Some of it is oxygen.`],
      [total - 2, `You took 2 away. The ratio 2 : 1 means 3 parts, and hydrogen gets 2 of them.`],
    ], fix2),
    scene: { kind: 'cell', h2: null, o2: null, total },
  }

  return {
    id: 'cell', title: 'Round 3 · Split the water', headline: 'Electrolysis of water',
    why: `Wind power drives a current through water with a little acid in it. Hydrogen bubbles off at the negative electrode, oxygen at the positive. The equation is 2H₂O → 2H₂ + O₂. So you always get 2 volumes of hydrogen for every 1 of oxygen.`,
    tasks: [t1, t2],
    side: pickSide(rand, 'Which gas forms at the negative electrode (the cathode)?', 'Hydrogen', [
      ['Oxygen', 'Oxygen forms at the POSITIVE electrode. Positive hydrogen ions are attracted to the negative one.'],
      ['Carbon dioxide', 'There’s no carbon in water. Positive hydrogen ions go to the negative electrode and make hydrogen.'],
      ['Chlorine', 'Chlorine needs chloride ions, like in brine. Here, positive hydrogen ions go to the negative electrode.'],
    ], `Hydrogen ions are positive, so they’re attracted to the negative electrode and gain electrons to make hydrogen gas. That’s also why that tube fills twice as fast.`),
    chain: [
      { line: `\\text{H}_2 : \\text{O}_2 = [[a:2]] : [[b:1]]` },
      { line: `\\text{parts} = [[p:3]]`, op: 'Add the parts', merge: { p: ['a', 'b'] }, why: `2 parts hydrogen + 1 part oxygen = 3 parts.` },
      { line: `\\text{one part} = [[t:${total}]] \\div [[p:3]]`, op: 'Share the total', why: `${total} cm³ of gas split into 3 equal parts.` },
      { line: `\\text{one part} = [[k:${k}]]\\,\\text{cm}^3`, op: 'Divide', merge: { k: ['t', 'p'] }, why: `${total} ÷ 3 = ${k} cm³. That’s the oxygen.` },
      { line: `V_{\\text{H}_2} = [[k:${k}]] \\times [[two:2]]`, op: 'Hydrogen is 2 parts', why: `Twice one part.` },
      { line: `V_{\\text{H}_2} = [[h:${H2v}]]\\,\\text{cm}^3`, op: 'Multiply', merge: { h: ['k', 'two'] }, why: `2 × ${k} = ${H2v} cm³ of hydrogen. Check: ${H2v} + ${k} = ${total}.` },
    ],
  }
}

/* ---------------------------------------------------------------- Round 4: rates */

const FASTER: Record<number, string> = { 2: 'doubles', 3: 'triples', 5: 'goes up 5 times' }

function rateRound(rand: Rand): HydrogenRound {
  let r = 0, t = 0
  do { r = rand.int(1, 5); t = rand.pick([10, 20, 30, 40, 50, 60]) } while (r * t > 100 || r * t < 20)
  const V = r * t
  const fix1 = `Mean rate = ${V} ÷ ${t} = ${r} cm³/s.`
  const t1: HydrogenTask = {
    id: 'rate-1', prompt: `Backup hydrogen: magnesium in acid fills the syringe with ${V} cm³ in ${t} s. What is the mean rate?`,
    label: 'Rate', unit: 'cm³/s', answer: r, start: 0, min: 0, max: 20, step: 1, jump: 5,
    win: `Mean rate = amount of product ÷ time. ${fix1}`,
    nope: value => diagnose(r, value, 'cm³/s', [
      [V - t, `You took away. Rate is a division: volume ÷ time.`],
      [t / V, `Upside down: it’s volume ÷ time, not time ÷ volume.`],
      [V, `That’s the volume. Divide it by the ${t} s.`],
    ], fix1),
    scene: { kind: 'syringe', volume: V, time: t, dial: 'rate', note: 'Mg + acid' },
  }

  const f = rand.pick([2, 3, 5].filter(x => t % x === 0 && t / x >= 5)), t2v = t / f
  const fix2 = `The new rate is ${r} × ${f} = ${r * f} cm³/s, so time = ${V} ÷ ${r * f} = ${t2v} s.`
  const t2: HydrogenTask = {
    id: 'rate-2', prompt: `Warm the acid and the rate ${FASTER[f]}. How long to collect the same ${V} cm³ now?`,
    label: 'Time', unit: 's', answer: t2v, start: 0, min: 0, max: 400, step: 1, jump: 10,
    win: `Faster reaction, less time for the same gas. ${fix2}`,
    nope: value => diagnose(t2v, value, 's', [
      [t * f, `A faster reaction takes LESS time, not more. Divide by ${f}.`],
      [t, `That’s the old time. The reaction is ${f} times faster now.`],
      [t - f, `You took ${f} away. ${f} times as fast means ÷ ${f}.`],
      [t + f, `A faster reaction takes LESS time. ${f} times as fast means ÷ ${f}.`],
    ], fix2),
    scene: { kind: 'syringe', volume: V, time: null, dial: 'time', note: `Warm acid, ${f}× rate` },
  }

  return {
    id: 'rate', title: 'Round 4 · Speed it up', headline: 'Rates of reaction',
    why: `The wind dropped, so Pip makes backup hydrogen from magnesium and acid. Mean rate = amount of product ÷ time taken, here in cm³/s. Heat it up, or use stronger acid, and the rate goes up. A faster rate means less time to make the same amount of gas.`,
    tasks: [t1, t2],
    side: pickSide(rand, 'Why does warming the acid speed the reaction up?', 'Particles collide more often and with more energy', [
      ['The particles get bigger', 'Particles don’t grow when heated. They move faster, so they collide more often and with more energy.'],
      ['Heat is a catalyst', 'A catalyst is a substance that isn’t used up. Heat makes particles move faster, so they collide more often and harder.'],
      ['There are more particles', 'Same particles, just moving faster. So they collide more often, and more collisions have enough energy to react.'],
    ], `Hotter particles move faster. They collide more often, and more of the collisions have enough energy (the activation energy) to react.`),
    chain: [
      { line: `\\text{new rate} = [[r:${r}]] \\times [[f:${f}]]` },
      { line: `\\text{new rate} = [[q:${r * f}]]\\,\\text{cm}^3/\\text{s}`, op: 'Multiply', merge: { q: ['r', 'f'] }, why: `The rate ${FASTER[f]}: ${r} × ${f} = ${r * f} cm³/s.` },
      { line: `\\text{time} = [[v:${V}]] \\div [[q:${r * f}]]`, op: 'time = volume ÷ rate', why: `Rearrange rate = volume ÷ time to get the time.` },
      { line: `\\text{time} = [[a:${t2v}]]\\,\\text{s}`, op: 'Divide', merge: { a: ['v', 'q'] }, why: `${V} ÷ ${r * f} = ${t2v} s, which is ${t} ÷ ${f}.` },
    ],
  }
}

/* ---------------------------------------------------------------- Round 5 (boss): the rates practical + Net Zero finale */

function bossRound(rand: Rand): HydrogenRound {
  let r = 0, d = 0, ta = 0, va = 0
  do { r = rand.int(1, 4); d = rand.pick([10, 20, 30]); ta = rand.pick([10, 20]); va = rand.pick([10, 15, 20, 25, 30]) } while (va + r * d > 100)
  const tb = ta + d, vb = va + r * d
  const fix1 = `${vb} − ${va} = ${r * d} cm³ in ${tb} − ${ta} = ${d} s, so ${r * d} ÷ ${d} = ${r} cm³/s.`
  const t1: HydrogenTask = {
    id: 'boss-1', prompt: `Required practical: at ${ta} s the syringe reads ${va} cm³, at ${tb} s it reads ${vb} cm³. What is the mean rate between them?`,
    label: 'Rate', unit: 'cm³/s', answer: r, start: 0, min: 0, max: 20, step: 1, jump: 5,
    win: `Use the CHANGE in volume over the CHANGE in time. ${fix1}`,
    nope: value => diagnose(r, value, 'cm³/s', [
      [vb / tb, `That’s the mean from the very start. You want between ${ta} s and ${tb} s: use the changes.`],
      [r * d, `That’s the gas collected. Divide by the ${d} s it took.`],
      [(vb - va) / tb, `Use the change in time too: ${tb} − ${ta} = ${d} s.`],
      [va / ta, `That’s the rate for the first ${ta} s. You want between the two readings.`],
    ], fix1),
    scene: { kind: 'syringe', volume: vb, time: null, readings: [[ta, va], [tb, vb]], dial: 'rate', note: 'Mg + acid' },
  }

  const X = rand.int(2, 12) * 100, P = rand.pick([20, 25, 40, 50, 60, 75, 80, 90]), S = X * P / 100
  const fix2 = `1% of ${n(X)} is ${X / 100}, so ${P}% is ${X / 100} × ${P} = ${n(S)} tonnes.`
  const t2: HydrogenTask = {
    id: 'boss-2', prompt: `The town’s diesel buses made ${n(X)} tonnes of CO₂ a year. Hydrogen buses cut that by ${P}%. How many tonnes are saved?`,
    label: 'CO₂ saved', unit: 'tonnes', answer: S, start: 0, min: 0, max: 1500, step: 5, jump: 50,
    win: `Hydrogen buses only give out water. ${fix2}`,
    nope: value => diagnose(S, value, 'tonnes', [
      [X - S, `That’s what’s LEFT after the cut. The saving is ${P}% of ${n(X)}.`],
      [P, `That’s the percentage. Find ${P}% OF ${n(X)} tonnes.`],
      [X - P, `You took ${P} away. ${P}% means ${P} out of every 100.`],
      [X, `That’s all of it. Only ${P}% is saved.`],
    ], fix2),
    scene: { kind: 'town', before: X, percent: P },
  }

  const side = rand.chance(0.5)
    ? pickSide(rand, 'You change the acid’s temperature. What must stay the same for a fair test?', 'The concentration and volume of acid', [
      ['The temperature', 'Temperature is what you’re CHANGING (the independent variable). Keep the acid’s concentration and volume the same.'],
      ['The volume of gas collected', 'That’s what you MEASURE (the dependent variable). Keep the acid’s concentration and volume the same.'],
      ['The time on the stopwatch', 'Time is part of what you measure. Keep the acid’s concentration and volume the same.'],
    ], `Only change one thing (temperature) and measure one thing (gas over time). Everything else, like the acid’s concentration and volume and the magnesium, stays the same.`)
    : pickSide(rand, 'Why does cutting CO₂ help the climate?', 'CO₂ is a greenhouse gas that traps heat', [
      ['CO₂ makes the hole in the ozone layer', 'The ozone hole was caused by CFCs. CO₂ is a greenhouse gas: it traps heat in the atmosphere.'],
      ['CO₂ causes acid rain', 'Acid rain is mostly sulfur dioxide and nitrogen oxides. CO₂ is a greenhouse gas that traps heat.'],
      ['CO₂ blocks out sunlight', 'Sunlight gets through. CO₂ absorbs the heat radiated back from the Earth, so it’s a greenhouse gas.'],
    ], `CO₂ absorbs heat radiated from the Earth and keeps it in the atmosphere. More CO₂ means more warming, so less CO₂ helps reach Net Zero.`)

  return {
    id: 'boss', title: 'Round 5 · Net Zero day', headline: 'The rates practical, then the buses',
    why: `Required practical: collect the gas in a syringe and read the volume every 10 seconds. For the mean rate between two readings, divide the change in volume by the change in time. Then the big reveal: hydrogen buses give out only water, no CO₂. Find the saving as a percentage of the old emissions.`,
    tasks: [t1, t2],
    side,
    chain: [
      { line: `1\\% = [[x:${tex(X)}]] \\div [[h:100]]` },
      { line: `1\\% = [[o:${X / 100}]]\\,\\text{t}`, op: 'Divide', merge: { o: ['x', 'h'] }, why: `Percent means out of 100, so 1% of ${n(X)} is ${X / 100} tonnes.` },
      { line: `${P}\\% = [[o:${X / 100}]] \\times [[p:${P}]]`, op: `× ${P}`, why: `${P}% is ${P} lots of 1%.` },
      { line: `${P}\\% = [[s:${tex(S)}]]\\,\\text{t}`, op: 'Multiply', merge: { s: ['o', 'p'] }, why: `${X / 100} × ${P} = ${n(S)} tonnes of CO₂ saved every year.` },
    ],
  }
}

export function makeRounds(rand: Rand): HydrogenRound[] {
  return [massRound(rand), balanceRound(rand), cellRound(rand), rateRound(rand), bossRound(rand)]
}

export { u }
