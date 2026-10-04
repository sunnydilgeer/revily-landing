import { options, type Rand } from '../../../maths/labs/kit/random'
import { diagnose, n, type Side, type Task } from '../kit/types'
import type { PlayRound, PlayTask, TileTask } from '../kit/tiles'

/*
 * Element Hunter: hunt Britain's critical minerals with Professor Tamsin Trevithick, lithium from
 * Cornish granite and brine, silicon for UK-made chips (AQA Trilogy 8464 Chemistry, Foundation:
 * atomic structure and the periodic table, bonding, energy changes and the temperature-changes
 * practical). Every answer is picked first, then the question is built around it. Half the jobs are
 * hands-on: drop electrons onto shells, sort the table, snap ions into a formula, label reactions.
 */

/** An element we can draw: symbol, name, atomic number, mass number of its usual atom, and why we're hunting it. */
export type Element = { sym: string; name: string; z: number; a: number; use: string }

const E = (sym: string, name: string, z: number, a: number, use: string): Element => ({ sym, name, z, a, use })
const LI = E('Li', 'lithium', 3, 7, 'for EV batteries')
const ELEMENTS: Element[] = [
  LI,
  E('B', 'boron', 5, 11, 'to dope silicon chips'),
  E('F', 'fluorine', 9, 19, 'for battery electrolyte'),
  E('Na', 'sodium', 11, 23, 'in the geothermal brine'),
  E('Mg', 'magnesium', 12, 24, 'in the geothermal brine'),
  E('Al', 'aluminium', 13, 27, 'for lightweight EV bodies'),
  E('Si', 'silicon', 14, 28, 'for UK-made chips'),
  E('P', 'phosphorus', 15, 31, 'to dope silicon chips'),
  E('Cl', 'chlorine', 17, 35, 'in the geothermal brine'),
  E('K', 'potassium', 19, 39, 'in the Cornish granite'),
  E('Ca', 'calcium', 20, 40, 'in the Cornish granite'),
]

/** The first 20 elements by atomic number, for the periodic table strip. */
export const SYMBOLS = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca']
const NAMES = ['', 'hydrogen', 'helium', 'lithium', 'beryllium', 'boron', 'carbon', 'nitrogen', 'oxygen', 'fluorine', 'neon', 'sodium', 'magnesium', 'aluminium', 'silicon', 'phosphorus', 'sulfur', 'chlorine', 'argon', 'potassium', 'calcium']

/** Electrons into shells: 2, then 8, then 8 (enough for the first 20 elements). */
export function shells(electrons: number): number[] {
  const out: number[] = []
  let left = Math.max(0, Math.round(electrons))
  for (const cap of [2, 8, 8, 8]) { if (left <= 0) break; out.push(Math.min(cap, left)); left -= cap }
  return out
}
const config = (z: number) => shells(z).join(',')
const groupOf = (z: number) => z <= 2 ? (z === 2 ? 0 : 1) : shells(z)[shells(z).length - 1] % 8

/** An ion: the element, its charge, and how it's written. */
export type Ion = { sym: string; name: string; ionName: string; z: number; group: number; charge: number; text: string; tex: string }
const sup = (c: number) => `${Math.abs(c) > 1 ? Math.abs(c) : ''}${c > 0 ? '⁺' : '⁻'}`.replace('2', '²')
const I = (sym: string, name: string, ionName: string, z: number, group: number, charge: number): Ion => ({
  sym, name, ionName, z, group, charge,
  text: `${sym}${sup(charge)}`,
  tex: `\\text{${sym}}^{${Math.abs(charge) > 1 ? Math.abs(charge) : ''}${charge > 0 ? '+' : '-'}}`,
})
const IONS: Ion[] = [
  I('Li', 'lithium', 'lithium', 3, 1, 1), I('Na', 'sodium', 'sodium', 11, 1, 1), I('K', 'potassium', 'potassium', 19, 1, 1),
  I('Mg', 'magnesium', 'magnesium', 12, 2, 2), I('Ca', 'calcium', 'calcium', 20, 2, 2),
  I('F', 'fluorine', 'fluoride', 9, 7, -1), I('Cl', 'chlorine', 'chloride', 17, 7, -1),
  I('O', 'oxygen', 'oxide', 8, 6, -2), I('S', 'sulfur', 'sulfide', 16, 6, -2),
]

/** A signed charge: +2, −1, 0. */
export const signed = (c: number) => c > 0 ? `+${n(c)}` : n(c)
const cap = (s: string) => s.replace(/^./, c => c.toUpperCase())
const SHELL_NAMES = ['first shell', 'second shell', 'third shell', 'fourth shell']

/** Metals among the first 20 (B and Si sit on the staircase, so the game never asks about them). */
export const METALS = new Set([3, 4, 11, 12, 13, 19, 20])
const NON_METALS = [6, 7, 8, 9, 10, 15, 16, 17, 18]

/** An ion tile on the formula bench: real ions and believable fakes with the wrong charge. */
export type IonTile = { text: string; sym: string; charge: number; real: boolean }

/** A reaction to label exothermic or endothermic. */
export type Reaction = { name: string; icon: string; exo: boolean; hint: string }
const REACTIONS: Reaction[] = [
  { name: 'Hand warmer', icon: '🧤', exo: true, hint: 'iron oxidising gives out heat' },
  { name: 'Burning fuel', icon: '🔥', exo: true, hint: 'combustion gives out heat and light' },
  { name: 'Acid + alkali', icon: '🧪', exo: true, hint: 'neutralisation warms the mixture' },
  { name: 'Self-heating can', icon: '🥫', exo: true, hint: 'it gives out energy to heat the food' },
  { name: 'Sports cold pack', icon: '🧊', exo: false, hint: 'it takes in energy, so it feels cold' },
  { name: 'Heating limestone', icon: '🪨', exo: false, hint: 'thermal decomposition needs energy put in' },
  { name: 'Citric acid + bicarb', icon: '🍋', exo: false, hint: 'it takes in energy and the temperature drops' },
]

export type Scene =
  /** Round 1: an atom. `neutrons` dial fills the nucleus; `shells` tiles drop electrons onto the shells. */
  | { kind: 'atom'; el: Element; neutrons: number; mode: 'neutrons' | 'shells' }
  /** Round 2: the periodic table, with a column lighting up for the group dial. */
  | { kind: 'table'; z: number }
  /** Round 2: four cells to sort into metals and non-metals. */
  | { kind: 'sort'; picks: number[] }
  /** Round 3: an atom losing or gaining electrons to become an ion. */
  | { kind: 'ion'; ion: Ion }
  /** Round 3: ions snapping together on the bench. */
  | { kind: 'formula'; compound: string; formula: string; tiles: IonTile[] }
  /** Rounds 4 and 5: a thermometer. `readings` lists the practical's readings. */
  | { kind: 'thermo'; start: number; target: number; item: 'warmer' | 'cup'; readings?: [number, number][] }
  /** Round 4: reactions to label. */
  | { kind: 'reactions'; list: Reaction[] }
  /** Round 5: three repeats and a mean line. */
  | { kind: 'repeats'; rises: number[] }

export type ElementTask = PlayTask<Scene>
export type ElementRound = PlayRound<Scene>

const pickSide = (rand: Rand, prompt: string, right: string, wrongs: [string, string][], why: string): Side => ({
  prompt, answer: right,
  choices: options<string>(rand, { value: right, label: right }, wrongs.map(([label, nope]) => ({ value: label, label, nope })), { count: wrongs.length + 1 }),
  why,
})

/* ---------------------------------------------------------------- Round 1: inside the atom */

function atomRound(rand: Rand): ElementRound {
  const el = rand.chance(0.35) ? LI : rand.pick(ELEMENTS)
  const nn = el.a - el.z
  const fix1 = `Neutrons = mass number − atomic number = ${el.a} − ${el.z} = ${nn}.`
  const t1: Task<Scene> = {
    id: 'atom-1', prompt: `${cap(el.name)}: mass number ${el.a}, atomic number ${el.z}. How many neutrons?`,
    label: 'Neutrons', unit: '', answer: nn, start: 0, min: 0, max: 40, step: 1, jump: 5,
    win: `It’s ${el.use}. The mass number counts protons AND neutrons; the atomic number counts just the protons. ${fix1}`,
    nope: value => diagnose(nn, value, '', [
      [el.z, `That’s the atomic number, which counts the PROTONS.`],
      [el.a, `That’s the mass number: protons and neutrons together. Take the protons away.`],
      [el.a + el.z, `You added. The mass number already includes the protons, so subtract them.`],
    ], fix1),
    scene: { kind: 'atom', el, neutrons: nn, mode: 'neutrons' },
  }

  const answer = shells(el.z).map(String)
  const outer = shells(el.z)[answer.length - 1]
  const pool = new Set([2, 8, outer])
  for (const extra of rand.shuffle([1, 3, 4, 5, 6, 7])) if (pool.size < 5) pool.add(extra)
  const fix2 = `${cap(el.name)} has ${el.z} electrons: ${answer.join(', ')}.`
  const t2: TileTask<Scene> = {
    kind: 'tiles', id: 'atom-2', prompt: `Build ${el.name}’s shells, innermost first.`,
    label: `${cap(el.name)}’s electron shells`, slots: SHELL_NAMES.slice(0, answer.length),
    palette: [...pool].sort((p, q) => p - q).map(v => ({ value: String(v) })), answer,
    win: `Atomic number ${el.z}, so ${el.z} electrons. Fill from the inside: 2, then 8, then 8. ${fix2}`,
    nope: picked => {
      const i = picked.findIndex((tile, index) => tile !== answer[index])
      const total = picked.reduce((sum, tile) => sum + Number(tile), 0)
      if (i === 0) return `The first shell holds just 2 electrons. ${fix2}`
      if (i < answer.length - 1) return `Inner shells fill up first: the ${SHELL_NAMES[i]} takes 8 before any go further out. ${fix2}`
      return `Those add up to ${total}, but ${el.name} has ${el.z} electrons (its atomic number). The outer shell gets what’s left. ${fix2}`
    },
    scene: { kind: 'atom', el, neutrons: nn, mode: 'shells' },
  }

  const side = rand.pick([
    () => pickSide(rand, 'What is the relative charge of a neutron?', '0', [
      ['+1', 'That’s a proton. Neutrons are neutral: no charge at all.'],
      ['−1', 'That’s an electron. The clue’s in the name: neutrons are neutral.'],
      ['+2', 'Nothing in an atom has +2. Neutrons are neutral: charge 0.'],
    ], 'Protons are +1, electrons are −1 and neutrons are 0. An atom has the same number of protons and electrons, so it has no overall charge.'),
    () => pickSide(rand, 'What is the relative mass of an electron?', 'Very small', [
      ['1', 'That’s a proton or a neutron. An electron is about 2,000 times lighter: very small.'],
      ['2', 'Nothing in the atom has mass 2. Protons and neutrons are 1; an electron is very small.'],
      ['Exactly 0', 'Electrons do have mass, just very little. Their relative mass is very small.'],
    ], 'Protons and neutrons each have a relative mass of 1. Electrons are very small, which is why the mass number only counts protons and neutrons.'),
    () => pickSide(rand, 'What do isotopes of an element have different numbers of?', 'Neutrons', [
      ['Protons', 'Change the protons and it’s a different element. Isotopes differ in neutrons.'],
      ['Electrons', 'Atoms of an element all have the same electrons as protons. Isotopes differ in neutrons.'],
      ['Shells', 'Same protons, same electrons, same shells. Isotopes differ in neutrons, so their mass numbers differ.'],
    ], 'Isotopes are atoms of the same element (same protons) with different numbers of neutrons, so different mass numbers. Lithium-6 and lithium-7 are both lithium.'),
  ])()

  return {
    id: 'atom', title: 'Round 1 · Inside the atom', headline: 'Protons, neutrons and electrons',
    why: `Every atom has a tiny nucleus of protons and neutrons, with electrons in shells around it. The atomic number is the number of protons. In an atom, electrons = protons, so there’s no overall charge. Neutrons = mass number − atomic number. Electrons fill the shells from the inside: 2, then 8, then 8.`,
    tasks: [t1, t2], side, workingOn: 0,
    chain: [
      { line: `[[a:${el.a}]] = [[z:${el.z}]] + [[x:\\text{neutrons}]]` },
      { line: `[[x:\\text{neutrons}]] = [[a:${el.a}]] - [[z:${el.z}]]`, op: 'Get neutrons on its own', why: `Mass number = protons + neutrons. Take the ${el.z} protons off both sides.` },
      { line: `[[x:\\text{neutrons}]] = [[r:${nn}]]`, op: 'Subtract', merge: { r: ['a', 'z'] }, why: `${el.a} − ${el.z} = ${nn} neutrons in every ${el.name} atom with mass number ${el.a}.` },
    ],
  }
}

/* ---------------------------------------------------------------- Round 2: the periodic table */

/** Elements 3–20 that aren't noble gases: their group is their outer electrons. */
const MAIN = Array.from({ length: 18 }, (_, i) => i + 3).filter(z => z !== 10 && z !== 18)

function tableRound(rand: Rand): ElementRound {
  const z1 = rand.pick(MAIN.filter(z => z !== 3))
  const sh = shells(z1), g1 = groupOf(z1), p1 = sh.length
  const fix1 = `The last number in ${config(z1)} is ${g1}, so it’s in group ${g1}.`
  const t1: Task<Scene> = {
    id: 'table-1', prompt: `Mystery atom from the brine: ${config(z1)}. Which group?`,
    label: 'Group', unit: '', answer: g1, start: 0, min: 0, max: 8, step: 1, jump: 1,
    win: `Group number = outer electrons. ${fix1} It’s ${NAMES[z1]}, ${SYMBOLS[z1]}, in period ${p1}.`,
    nope: value => diagnose(g1, value, '', [
      [p1, `That’s the number of shells, which gives the PERIOD (the row). The group is the outer electrons.`],
      [z1, `That’s all the electrons, the atomic number. The group only counts the OUTER ones.`],
      [sh[0], `That’s the first shell. Look at the LAST number, the outer shell.`],
      [8, `The 8 is a full inner shell. Look at the last number, the outer shell.`],
    ], fix1),
    scene: { kind: 'table', z: z1 },
  }

  const metals = rand.int(1, 3)
  const picks = rand.shuffle([
    ...rand.shuffle([...METALS].filter(z => z !== z1)).slice(0, metals),
    ...rand.shuffle(NON_METALS.filter(z => z !== z1)).slice(0, 4 - metals),
  ])
  const kind = (z: number) => METALS.has(z) ? 'metal' : 'non-metal'
  const t2: TileTask<Scene> = {
    kind: 'tiles', id: 'table-2', prompt: `Metal or non-metal? Sort the four numbered elements.`,
    label: 'Metal or non-metal', slots: picks.map(z => `${SYMBOLS[z]}, ${NAMES[z]}`),
    palette: [{ value: 'metal', label: 'Metal' }, { value: 'non-metal', label: 'Non-metal' }], answer: picks.map(kind),
    win: `Metals sit on the left and bottom of the table; non-metals on the right and top. ${picks.map(z => `${SYMBOLS[z]}: ${kind(z)}`).join(', ')}.`,
    nope: picked => {
      const i = picked.findIndex((tile, index) => tile !== kind(picks[index]))
      const z = picks[i], g = groupOf(z)
      return METALS.has(z)
        ? `${cap(NAMES[z])} (${SYMBOLS[z]}) is in group ${g}, on the left of the staircase line: a metal. It loses electrons to make positive ions.`
        : `${cap(NAMES[z])} (${SYMBOLS[z]}) is ${g === 0 ? 'a noble gas' : `in group ${g}`}, on the right of the staircase line: a non-metal.`
    },
    scene: { kind: 'sort', picks },
  }

  const side = rand.chance(0.5)
    ? pickSide(rand, 'Why do lithium, sodium and potassium react in similar ways?', 'They all have 1 outer electron', [
      ['They have the same number of shells', 'They’re in different periods, so different shells. It’s the 1 outer electron they share.'],
      ['They have similar masses', 'Lithium is 7, potassium 39: not similar. They all have 1 outer electron.'],
      ['They have the same number of neutrons', 'Neutrons don’t affect reactions. They all have 1 outer electron.'],
    ], 'Elements in the same group have the same number of outer electrons. Group 1 all have 1, so they react in the same way.')
    : pickSide(rand, 'Silicon is 2,8,4. Which element is in the same group?', 'Carbon, 2,4', [
      ['Aluminium, 2,8,3', 'Same period (3 shells), but 3 outer electrons. Same GROUP means the same outer electrons: carbon, 2,4.'],
      ['Phosphorus, 2,8,5', 'Same period, but 5 outer electrons. Carbon, 2,4, has 4 outer electrons, like silicon.'],
      ['Argon, 2,8,8', 'That’s the end of the same period. Carbon, 2,4, has the same 4 outer electrons.'],
    ], 'Same group, same number of outer electrons. Carbon (2,4) and silicon (2,8,4) both have 4, which is why both make strong covalent structures like diamond and silicon chips.')

  return {
    id: 'table', title: 'Round 2 · Read the table', headline: 'The periodic table',
    why: `The number of shells is the period (the row). The outer electrons give the group (the column). Elements in the same group react in similar ways. Metals are on the left and bottom, non-metals on the right and top, either side of the staircase line.`,
    tasks: [t1, t2], side, workingOn: 0,
    chain: [
      { line: `\\text{${SYMBOLS[z1]}}: ${sh.map((c, i) => i === sh.length - 1 ? `[[o:${c}]]` : `${c}`).join(',\\ ')}` },
      { line: `\\text{outer electrons} = [[o:${g1}]]`, op: 'Read the outer shell', why: `The last number is the outer shell: ${g1} electron${g1 > 1 ? 's' : ''}. ${p1} numbers means ${p1} shells, so period ${p1}.` },
      { line: `\\text{group} = [[g:${g1}]]`, op: 'Outer electrons = group', merge: { g: ['o'] }, why: `${g1} outer electron${g1 > 1 ? 's' : ''}, group ${g1}: that’s ${NAMES[z1]}.` },
    ],
  }
}

/* ---------------------------------------------------------------- Round 3: bonding */

const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
const subs = (k: number) => k === 1 ? '' : String.fromCharCode(0x2080 + k)
const supText = (c: number) => `${Math.abs(c) > 1 ? '²' : ''}${c > 0 ? '⁺' : '⁻'}`

function bondRound(rand: Rand): ElementRound {
  const ion = rand.pick(IONS), metal = ion.charge > 0
  const g = ion.group, c = ion.charge
  const fix1 = metal
    ? `${cap(NAMES[ion.z])} loses its ${g} outer electron${g > 1 ? 's' : ''}, so the ion is ${ion.text}, charge ${signed(c)}.`
    : `${cap(NAMES[ion.z])} gains ${-c} electron${c < -1 ? 's' : ''} to fill its outer shell, so the ion is ${ion.text}, charge ${signed(c)}.`
  const t1: Task<Scene> = {
    id: 'bond-1', prompt: `${cap(ion.name)} is ${config(ion.z)}. What charge is its ion?`,
    label: 'Charge', unit: '', answer: c, start: 0, min: -4, max: 4, step: 1, jump: 1,
    win: `Atoms lose or gain electrons to get a full outer shell. Metals lose them (positive ions), non-metals gain them (negative ions). ${fix1}`,
    nope: value => diagnose(c, value, '', metal ? [
      [-g, `Right size, wrong sign. Metals LOSE electrons, and losing negative electrons leaves a positive ion.`],
      [g - 8, `Gaining ${8 - g} is much harder than losing ${g}. Metals lose their outer electrons.`],
    ] : [
      [-c, `Right size, wrong sign. Non-metals GAIN electrons, so their ions are negative.`],
      [g, `That’s the group number, with the wrong sign. ${g} outer electrons need ${8 - g} more to make 8.`],
      [-g, `It has ${g} outer electrons; it only needs ${8 - g} more to make 8.`],
    ], fix1),
    scene: { kind: 'ion', ion },
  }

  // The partner: an opposite ion. Count whichever has the smaller charge, per ONE of the other, so the answer is whole.
  const partners = IONS.filter(p => Math.sign(p.charge) !== Math.sign(c))
  const differ = partners.filter(p => Math.abs(p.charge) !== Math.abs(c)), same = partners.filter(p => Math.abs(p.charge) === Math.abs(c))
  const partner = rand.chance(0.7) ? rand.pick(differ) : rand.pick(same)
  const [count, per] = Math.abs(ion.charge) <= Math.abs(partner.charge) ? [ion, partner] : [partner, ion]
  const k = Math.abs(per.charge) / Math.abs(count.charge)
  const [cat, an] = count.charge > 0 ? [count, per] : [per, count]
  const d = gcd(Math.abs(cat.charge), Math.abs(an.charge))
  const formula = `${cat.sym}${subs(Math.abs(an.charge) / d)}${an.sym}${subs(Math.abs(cat.charge) / d)}`
  const compound = `${cat.name} ${an.ionName}`
  // Fakes: each element with the wrong-sized charge (Mg⁺, O⁻), the classic slip of not reading the group.
  const fake = (real: Ion): IonTile => { const q = Math.sign(real.charge) * (Math.abs(real.charge) === 1 ? 2 : 1); return { text: `${real.sym}${supText(q)}`, sym: real.sym, charge: q, real: false } }
  const tile = (real: Ion): IonTile => ({ text: real.text, sym: real.sym, charge: real.charge, real: true })
  const tiles = [tile(cat), fake(cat), tile(an), fake(an)]
  const answer = [per.text, ...Array.from({ length: k }, () => count.text)]
  const fix2 = `${k} × (${signed(count.charge)}) + (${signed(per.charge)}) = 0, so it’s ${k} ${count.text} for each ${per.text}: ${formula}.`
  const t2: TileTask<Scene> = {
    kind: 'tiles', id: 'bond-2', prompt: `Build ${compound}: tap in the ions.`,
    label: `Ions in ${compound}`, slots: answer.map((_, i) => `ion ${i + 1}`),
    palette: tiles.map(t => ({ value: t.text })), answer, anyOrder: true,
    win: `The charges cancel to zero, so an ionic compound has no overall charge. ${fix2}`,
    nope: picked => {
      const used = picked.map(text => tiles.find(t => t.text === text)!)
      const bad = used.find(t => !t.real)
      if (bad) {
        const real = bad.sym === cat.sym ? cat : an
        return `${cap(real.name)} is in group ${real.group}, so it ${real.charge > 0 ? `loses ${real.charge}` : `gains ${-real.charge}`} electron${Math.abs(real.charge) > 1 ? 's' : ''}: ${real.text}, not ${bad.text}. ${fix2}`
      }
      const net = used.reduce((sum, t) => sum + t.charge, 0)
      return `Those charges add to ${signed(net)}. ${net > 0 ? 'Too much positive.' : 'Too much negative.'} The ions must cancel to 0. ${fix2}`
    },
    scene: { kind: 'formula', compound, formula, tiles },
  }

  type Bond = 'Ionic' | 'Covalent' | 'Metallic'
  const SUBSTANCES: [string, Bond][] = [
    ['lithium chloride, LiCl, from the brine', 'Ionic'], ['magnesium oxide, MgO', 'Ionic'], ['sodium chloride, NaCl, in the brine', 'Ionic'],
    ['methane, CH₄', 'Covalent'], ['water, H₂O', 'Covalent'], ['ammonia, NH₃', 'Covalent'], ['silicon dioxide, SiO₂ (quartz in the granite)', 'Covalent'],
    ['lithium metal in a battery', 'Metallic'], ['copper wire', 'Metallic'], ['aluminium foil', 'Metallic'],
  ]
  const NOPE: Record<Bond, string> = {
    Ionic: 'a metal joined to a non-metal: electrons transfer, making ions held by strong attraction. That’s ionic.',
    Covalent: 'all non-metals: the atoms share pairs of electrons. That’s covalent.',
    Metallic: 'just a metal: its atoms sit in a sea of delocalised electrons. That’s metallic.',
  }
  const [what, bond] = rand.pick(SUBSTANCES)
  const side = pickSide(rand, `What type of bonding is in ${what}?`, bond,
    (['Ionic', 'Covalent', 'Metallic'] as Bond[]).filter(b => b !== bond).map(b => [b, `Not ${b.toLowerCase()}: this is ${NOPE[bond]}`]),
    `Metal + non-metal → ionic. Non-metals only → covalent. Metal only → metallic. This is ${NOPE[bond]}`)

  return {
    id: 'bond', title: 'Round 3 · Snap them together', headline: 'Ions and bonding',
    why: `Atoms want a full outer shell. Metals in groups 1 and 2 lose electrons to make positive ions, like Li⁺ and Mg²⁺. Non-metals in groups 6 and 7 gain electrons to make negative ions, like O²⁻ and Cl⁻. Opposite ions attract in an ionic compound, and the charges add up to zero.`,
    tasks: [t1, t2], side,
    chain: [
      { line: `${count.tex} : ${per.tex}` },
      { line: `[[x:\\text{number}]] \\times [[a:${Math.abs(count.charge)}]] = [[b:${Math.abs(per.charge)}]]`, op: 'Balance the charge', why: `The ${count.text} ions must cancel the ${signed(per.charge)} on one ${per.text}: no overall charge.` },
      { line: `[[x:\\text{number}]] = [[r:${k}]]`, op: 'Divide', merge: { r: ['b', 'a'] }, why: `${Math.abs(per.charge)} ÷ ${Math.abs(count.charge)} = ${k} ${count.text} for each ${per.text}.` },
      { line: `\\text{formula} = \\text{${cat.sym}}${Math.abs(an.charge) / d > 1 ? `_{${Math.abs(an.charge) / d}}` : ''}\\text{${an.sym}}${Math.abs(cat.charge) / d > 1 ? `_{${Math.abs(cat.charge) / d}}` : ''}`, op: 'Write the formula', why: `The small number counts the ions: ${compound} is ${formula}.` },
    ],
  }
}

/* ---------------------------------------------------------------- Round 4: energy changes */

function heatRound(rand: Rand): ElementRound {
  const s1 = rand.int(8, 16), r1 = rand.int(12, 30), f1 = s1 + r1
  const fix1 = `Rise = final − start = ${f1} − ${s1} = ${r1} °C.`
  const t1: Task<Scene> = {
    id: 'heat-1', prompt: `Hand warmer on the moor: ${s1} °C up to ${f1} °C. What’s the rise?`,
    label: 'Temperature rise', unit: '°C', answer: r1, start: 0, min: 0, max: 60, step: 1, jump: 5,
    win: `The hand warmer is exothermic: it gives out energy, so the temperature goes up. ${fix1}`,
    nope: value => diagnose(r1, value, '°C', [
      [f1, `That’s the final temperature. The RISE is how much it went up from ${s1} °C.`],
      [s1, `That’s the starting temperature. Take it away from the final one.`],
      [f1 + s1, `You added. A change is a subtraction: final − start.`],
    ], fix1),
    scene: { kind: 'thermo', start: s1, target: f1, item: 'warmer' },
  }

  const endo = rand.shuffle(REACTIONS.filter(r => !r.exo)).slice(0, rand.int(1, 2))
  const list = rand.shuffle([...endo, ...rand.shuffle(REACTIONS.filter(r => r.exo && r.name !== 'Hand warmer')).slice(0, 4 - endo.length)])
  const tag = (r: Reaction) => r.exo ? 'exo' : 'endo'
  const t2: TileTask<Scene> = {
    kind: 'tiles', id: 'heat-2', prompt: `Exothermic or endothermic? Label each reaction.`,
    label: 'Exothermic or endothermic', slots: list.map(r => r.name),
    palette: [{ value: 'exo', label: 'Exo 🔥' }, { value: 'endo', label: 'Endo ❄️' }], answer: list.map(tag),
    win: `Exothermic gives energy OUT (warms up); endothermic takes energy IN (cools down). ${list.map(r => `${r.name}: ${r.exo ? 'exo' : 'endo'}`).join(', ')}.`,
    nope: picked => {
      const r = list[picked.findIndex((tile, index) => tile !== tag(list[index]))]
      return `${r.name}: ${r.hint}, so it’s ${r.exo ? 'EXOthermic: energy out, temperature up' : 'ENDOthermic: energy in, temperature down'}.`
    },
    scene: { kind: 'reactions', list },
  }

  const side = pickSide(rand, 'In an exothermic reaction, how do the products compare?', 'Less energy than the reactants', [
    ['More energy than the reactants', 'That’s endothermic: energy is taken in, so the products end up higher.'],
    ['The same energy as the reactants', 'Then no energy would be transferred. Exothermic gives energy out, so the products are lower.'],
    ['No energy at all', 'Products always store some energy. Exothermic means they have LESS than the reactants.'],
  ], 'On a reaction profile, an exothermic reaction ends lower than it starts: the difference is the energy given out to the surroundings.')

  return {
    id: 'heat', title: 'Round 4 · Feel the heat', headline: 'Exothermic and endothermic',
    why: `Exothermic reactions transfer energy TO the surroundings, so the temperature goes up: hand warmers, self-heating cans, burning fuels, neutralisation. Endothermic reactions take energy IN, so the temperature drops: sports cold packs and thermal decomposition. Temperature rise = final − start.`,
    tasks: [t1, t2], side, workingOn: 0,
    chain: [
      { line: `\\text{rise} = [[f:${f1}]] - [[s:${s1}]]` },
      { line: `\\text{rise} = [[r:${r1}]]\\,^{\\circ}\\text{C}`, op: 'Subtract', merge: { r: ['f', 's'] }, why: `Final − start: ${f1} − ${s1} = ${r1} °C.` },
      { line: `\\text{temperature rose} \\Rightarrow \\text{exothermic}`, op: 'Name it', why: `The hand warmer gave energy out to its surroundings, so it’s exothermic.` },
    ],
  }
}

/* ---------------------------------------------------------------- Round 5 (boss): the temperature-changes practical */

const SPREADS: [number, number, number][] = [[-1, 0, 1], [-2, 1, 1], [-1, -1, 2], [0, -1, 1], [2, -1, -1], [-2, 0, 2], [1, 1, -2]]

function bossRound(rand: Rand): ElementRound {
  const t0 = rand.int(18, 22), rise = rand.int(6, 15), peak = t0 + rise
  const early = peak - rand.int(2, Math.min(4, rise - 1))
  const peakAt = rand.pick([60, 90])
  const readings: [number, number][] = peakAt === 60
    ? [[0, t0], [30, early], [60, peak], [90, peak - 1], [120, peak - 2]]
    : [[0, t0], [30, early], [60, peak - 1], [90, peak], [120, peak - 1]]
  const last = readings[readings.length - 1][1]
  const fix1 = `Highest − start = ${peak} − ${t0} = ${rise} °C.`
  const t1: Task<Scene> = {
    id: 'boss-1', prompt: `Acid meets alkali at ${t0} °C. Read the table: what’s the rise?`,
    label: 'Temperature rise', unit: '°C', answer: rise, start: 0, min: 0, max: 40, step: 1, jump: 5,
    win: `Neutralisation is exothermic. Use the HIGHEST temperature, before the cup starts to cool. ${fix1}`,
    nope: value => diagnose(rise, value, '°C', [
      [last - t0, `That uses the last reading, but the mixture had already started cooling. Use the highest, ${peak} °C.`],
      [peak, `That’s the highest temperature itself. Take away the start, ${t0} °C.`],
      [early - t0, `That uses the 30 s reading. It kept rising after that: use the highest, ${peak} °C.`],
      [peak + t0, `You added. The rise is highest − start.`],
    ], fix1),
    scene: { kind: 'thermo', start: t0, target: peak, item: 'cup', readings },
  }

  const mean = rand.int(5, 14), spread = rand.pick(SPREADS)
  const rises = spread.map(s => mean + s), sum = 3 * mean
  const fix2 = `${rises.join(' + ')} = ${sum}, and ${sum} ÷ 3 = ${mean} °C.`
  const t2: Task<Scene> = {
    id: 'boss-2', prompt: `Three repeats: ${rises.join(', ').replace(/, ([^,]*)$/, ' and $1')} °C. What’s the mean rise?`,
    label: 'Mean rise', unit: '°C', answer: mean, start: 0, min: 0, max: 60, step: 1, jump: 5,
    win: `Repeats make the result more reliable: add them up, divide by how many. ${fix2}`,
    nope: value => diagnose(mean, value, '°C', [
      [sum, `That’s the total. Divide it by the 3 repeats.`],
      [Math.max(...rises) - Math.min(...rises), `That’s the range (biggest − smallest). The mean is total ÷ 3.`],
      [Math.max(...rises), `That’s the biggest repeat. The mean uses all three: total ÷ 3.`],
      [Math.min(...rises), `That’s the smallest repeat. The mean uses all three: total ÷ 3.`],
      [sum / 2, `You divided by 2. There are 3 repeats, so ÷ 3.`],
    ], fix2),
    scene: { kind: 'repeats', rises },
  }

  return {
    id: 'boss', title: 'Round 5 · The big practical', headline: 'Required practical: temperature changes',
    why: `Put acid in a polystyrene cup with a lid and take its temperature. Add the alkali, stir, and read the thermometer every 30 seconds. The temperature rise is the highest temperature minus the start. Repeat it three times and take the mean: add them up and divide by 3.`,
    tasks: [t1, t2],
    side: pickSide(rand, 'Why use a polystyrene cup with a lid?', 'To reduce energy lost to the surroundings', [
      ['To make the reaction faster', 'The cup doesn’t change the rate. Polystyrene is an insulator: it stops energy escaping.'],
      ['Because glass would react with the acid', 'Glass is fine with dilute acid. Polystyrene and a lid insulate, so less energy is lost.'],
      ['So you can see the colour change', 'Polystyrene isn’t see-through! It’s there to insulate, so less energy is lost to the air.'],
    ], 'Polystyrene is a good insulator and the lid stops warm air escaping. Less energy is lost, so the temperature rise you measure is more accurate.'),
    chain: [
      { line: `\\text{mean} = \\frac{[[a:${rises[0]}]] + [[b:${rises[1]}]] + [[c:${rises[2]}]]}{[[n:3]]}` },
      { line: `\\text{mean} = \\frac{[[s:${sum}]]}{[[n:3]]}`, op: 'Add', merge: { s: ['a', 'b', 'c'] }, why: `${rises.join(' + ')} = ${sum} °C in total.` },
      { line: `\\text{mean} = [[r:${mean}]]\\,^{\\circ}\\text{C}`, op: 'Divide', merge: { r: ['s', 'n'] }, why: `${sum} ÷ 3 = ${mean} °C, the mean temperature rise.` },
    ],
  }
}

export function makeRounds(rand: Rand): ElementRound[] {
  return [atomRound(rand), tableRound(rand), bondRound(rand), heatRound(rand), bossRound(rand)]
}
