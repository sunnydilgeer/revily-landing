import { options, type Rand } from '../../../maths/labs/kit/random'
import { diagnose, n, type Round, type Side, type Slip, type Task } from '../kit/types'

/*
 * Element Hunter: hunt Britain's critical minerals with Professor Tamsin Trevithick, lithium from
 * Cornish granite and brine, silicon for UK-made chips (AQA Trilogy 8464 Chemistry, Foundation:
 * atomic structure and the periodic table, bonding, energy changes and the temperature-changes
 * practical). Every answer is picked first, then the question is built around it.
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
const periodOf = (z: number) => shells(z).length

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

export type Scene =
  /** Round 1: an atom. `dial` is the number being set: the neutrons, or the mass number of an isotope. */
  | { kind: 'atom'; el: Element; neutrons: number; dial: 'neutrons' | 'mass' }
  /** Round 2: the periodic table strip over an atom. */
  | { kind: 'table'; z: number; dial: 'group' | 'electrons' }
  /** Round 3: an atom losing or gaining electrons to become an ion. */
  | { kind: 'ion'; ion: Ion }
  /** Round 3: one `per` ion with the dialled number of `count` ions around it. */
  | { kind: 'lattice'; count: Ion; per: Ion; formula: string }
  /** Rounds 4 and 5: a thermometer. `readings` lists the practical's readings. */
  | { kind: 'thermo'; start: number; target: number; dir: 'rise' | 'drop'; item: 'warmer' | 'cold' | 'cup'; readings?: [number, number][] }
  /** Round 5: three repeats and a mean line. */
  | { kind: 'repeats'; rises: number[] }

export type ElementTask = Task<Scene>
export type ElementRound = Round<Scene>

const pickSide = (rand: Rand, prompt: string, right: string, wrongs: [string, string][], why: string): Side => ({
  prompt, answer: right,
  choices: options<string>(rand, { value: right, label: right }, wrongs.map(([label, nope]) => ({ value: label, label, nope })), { count: wrongs.length + 1 }),
  why,
})

/* ---------------------------------------------------------------- Round 1: inside the atom */

/** Real isotopes [element, neutrons] that aren't the usual atom. */
const ISOTOPES: [Element, number][] = [
  [LI, 3],
  [E('B', 'boron', 5, 11, 'to dope silicon chips'), 5],
  [E('C', 'carbon', 6, 12, 'for battery anodes'), 7],
  [E('C', 'carbon', 6, 12, 'for battery anodes'), 8],
  [E('N', 'nitrogen', 7, 14, 'in the air'), 8],
  [E('O', 'oxygen', 8, 16, 'in the granite'), 10],
  [E('Mg', 'magnesium', 12, 24, 'in the geothermal brine'), 13],
  [E('Mg', 'magnesium', 12, 24, 'in the geothermal brine'), 14],
  [E('Si', 'silicon', 14, 28, 'for UK-made chips'), 15],
  [E('Si', 'silicon', 14, 28, 'for UK-made chips'), 16],
  [E('Cl', 'chlorine', 17, 35, 'in the geothermal brine'), 20],
  [E('K', 'potassium', 19, 39, 'in the Cornish granite'), 22],
]

function atomRound(rand: Rand): ElementRound {
  const el = rand.chance(0.35) ? LI : rand.pick(ELEMENTS)
  const nn = el.a - el.z
  const fix1 = `Neutrons = mass number − atomic number = ${el.a} − ${el.z} = ${nn}.`
  const t1: ElementTask = {
    id: 'atom-1', prompt: `First sample: ${el.name} ${el.use}. Its mass number is ${el.a} and its atomic number is ${el.z}. How many neutrons are in one atom?`,
    label: 'Neutrons', unit: '', answer: nn, start: 0, min: 0, max: 40, step: 1, jump: 5,
    win: `The mass number counts protons AND neutrons; the atomic number counts just the protons. ${fix1}`,
    nope: value => diagnose(nn, value, '', [
      [el.z, `That’s the atomic number, which counts the PROTONS.`],
      [el.a, `That’s the mass number: protons and neutrons together. Take the protons away.`],
      [el.a + el.z, `You added. The mass number already includes the protons, so subtract them.`],
    ], fix1),
    scene: { kind: 'atom', el, neutrons: nn, dial: 'neutrons' },
  }

  const [iso, isoN] = rand.pick(ISOTOPES)
  const mass = iso.z + isoN
  const fix2 = `Mass number = protons + neutrons = ${iso.z} + ${isoN} = ${mass}.`
  const t2: ElementTask = {
    id: 'atom-2', prompt: `An isotope of ${iso.name} (atomic number ${iso.z}) turns up with ${isoN} neutrons. What is its mass number?`,
    label: 'Mass number', unit: '', answer: mass, start: 0, min: 0, max: 50, step: 1, jump: 5,
    win: `Isotopes have the same number of protons but a different number of neutrons. ${fix2}`,
    nope: value => diagnose(mass, value, '', [
      [iso.a, `That’s the usual ${iso.name} atom. This isotope has ${isoN} neutrons, not ${iso.a - iso.z}.`],
      [isoN, `That’s just the neutrons. The mass number counts the protons too.`],
      [iso.z, `That’s the atomic number: just the protons. Add the neutrons.`],
      [isoN - iso.z, `You subtracted. The mass number is protons PLUS neutrons.`],
      [2 * isoN, `You doubled the neutrons. Add the ${iso.z} protons instead.`],
    ], fix2),
    scene: { kind: 'atom', el: { ...iso, a: mass }, neutrons: isoN, dial: 'mass' },
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
    () => pickSide(rand, 'Where is almost all the mass of an atom?', 'In the nucleus', [
      ['In the electron shells', 'Electrons have very little mass. The protons and neutrons, in the nucleus, carry almost all of it.'],
      ['Spread evenly through the atom', 'That’s the old plum pudding model. The mass is packed into the tiny nucleus.'],
      ['In the empty space', 'Empty space has no mass. The protons and neutrons in the nucleus carry it.'],
    ], 'Protons and neutrons (mass 1 each) sit in the tiny nucleus. Electrons are very light, so nearly all the mass is in the middle.'),
  ])()

  return {
    id: 'atom', title: 'Round 1 · Inside the atom', headline: 'Protons, neutrons and electrons',
    why: `Every atom has a tiny nucleus of protons and neutrons, with electrons in shells around it. The atomic number is the number of protons. In an atom, electrons = protons, so there’s no overall charge. The mass number is protons + neutrons, so neutrons = mass number − atomic number. Isotopes have the same protons but different neutrons.`,
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
  const t1: ElementTask = {
    id: 'table-1', prompt: `The probe reads a mystery atom from the brine: electron configuration ${config(z1)}. Which group is it in?`,
    label: 'Group', unit: '', answer: g1, start: 0, min: 0, max: 8, step: 1, jump: 1,
    win: `Group number = outer electrons. ${fix1} It’s ${NAMES[z1]}, ${SYMBOLS[z1]}.`,
    nope: value => diagnose(g1, value, '', [
      [p1, `That’s the number of shells, which gives the PERIOD (the row). The group is the outer electrons.`],
      [z1, `That’s all the electrons, the atomic number. The group only counts the OUTER ones.`],
      [sh[0], `That’s the first shell. Look at the LAST number, the outer shell.`],
      [8, `The 8 is a full inner shell. Look at the last number, the outer shell.`],
    ], fix1),
    scene: { kind: 'table', z: z1, dial: 'group' },
  }

  const z2 = rand.pick(MAIN.filter(z => z !== z1))
  const g2 = groupOf(z2), p2 = periodOf(z2), sh2 = shells(z2)
  const fix2 = `Period ${p2} means ${p2} shells: ${sh2.join(', ')}. Add them: ${sh2.join(' + ')} = ${z2}.`
  const t2: ElementTask = {
    id: 'table-2', prompt: `The next target sits in group ${g2}, period ${p2}. How many electrons does one atom have?`,
    label: 'Electrons', unit: '', answer: z2, start: 0, min: 0, max: 24, step: 1, jump: 5,
    win: `Fill the shells: 2, then 8, then 8. ${fix2} That’s ${NAMES[z2]}, ${SYMBOLS[z2]}, atomic number ${z2}.`,
    nope: value => diagnose(z2, value, '', [
      [g2 + p2, `You added the group and period. Fill the shells instead: ${sh2.join(', ')}.`],
      [g2 * p2, `You multiplied the group by the period. The inner shells hold 2, then 8.`],
      [g2, `That’s only the outer shell. Add the full inner shells too.`],
      [8 * (p2 - 1) + g2, `The first shell only holds 2, not 8.`],
      [2 * (p2 - 1) + g2, `The second and third shells hold 8, not 2.`],
    ], fix2),
    scene: { kind: 'table', z: z2, dial: 'electrons' },
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

  const parts = sh2.map((c, i) => `[[s${i}:${c}]]`)
  return {
    id: 'table', title: 'Round 2 · Read the table', headline: 'The periodic table',
    why: `Electrons fill shells from the inside: 2 in the first shell, then 8, then 8. Write it as a configuration, like sodium 2,8,1. The number of shells is the period (the row). The outer electrons give the group (the column). Elements in the same group react in similar ways.`,
    tasks: [t1, t2], side,
    chain: [
      { line: `\\text{group } ${g2},\\ \\text{period } ${p2}` },
      { line: `\\text{electrons} = ${parts.join(' + ')}`, op: 'Fill the shells', why: `Period ${p2} means ${p2} shells. Inner shells are full (2, then 8); the outer shell has ${g2}, the group number.` },
      { line: `\\text{electrons} = [[r:${z2}]]`, op: 'Add', merge: { r: sh2.map((_, i) => `s${i}`) }, why: `${sh2.join(' + ')} = ${z2}. That’s ${NAMES[z2]}, atomic number ${z2}.` },
    ],
  }
}

/* ---------------------------------------------------------------- Round 3: bonding */

const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
const subs = (k: number) => k === 1 ? '' : String.fromCharCode(0x2080 + k)

function bondRound(rand: Rand): ElementRound {
  const ion = rand.pick(IONS), metal = ion.charge > 0
  const g = ion.group, c = ion.charge
  const fix1 = metal
    ? `${NAMES[ion.z].replace(/^./, s => s.toUpperCase())} loses its ${g} outer electron${g > 1 ? 's' : ''}, so the ion is ${ion.text}, charge ${signed(c)}.`
    : `${NAMES[ion.z].replace(/^./, s => s.toUpperCase())} gains ${-c} electron${c < -1 ? 's' : ''} to fill its outer shell, so the ion is ${ion.text}, charge ${signed(c)}.`
  const t1: ElementTask = {
    id: 'bond-1', prompt: `${ion.name.replace(/^./, s => s.toUpperCase())} is in group ${g} (${config(ion.z)}). What is the charge on ${metal ? 'a' : 'an'} ${ion.ionName} ion?`,
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
  const net = (v: number) => v * count.charge + per.charge
  const fix2 = `${k} × (${signed(count.charge)}) + (${signed(per.charge)}) = 0, so it’s ${k} ${count.text} for each ${per.text}: ${formula}.`
  const slips: Slip[] = [0, 1, 2, 3, 4, 5, 6].map(v => [v, v === 0
    ? `With no ${count.text} at all, the ${per.text} is left with charge ${signed(per.charge)}.`
    : `${v} × (${signed(count.charge)}) + (${signed(per.charge)}) = ${signed(net(v))}. ${net(v) > 0 ? 'Too much positive charge.' : 'Still some negative charge left over.'} An ionic compound has no overall charge.`])
  const t2: ElementTask = {
    id: 'bond-2', prompt: `${cat.name.replace(/^./, s => s.toUpperCase())} ions meet ${an.ionName} ions to make ${compound}. How many ${count.text} ions do you need for each ${per.text} ion?`,
    label: `${count.text} ions`, unit: '', answer: k, start: 0, min: 0, max: 6, step: 1, jump: 1,
    win: `The charges must cancel to zero. ${fix2}`,
    nope: value => diagnose(k, value, '', slips, fix2),
    scene: { kind: 'lattice', count, per, formula },
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
  const MOLECULES: [string, string, number, string][] = [
    ['water, H₂O', 'oxygen', 2, 'H'], ['ammonia, NH₃', 'nitrogen', 3, 'H'], ['methane, CH₄', 'carbon', 4, 'H'], ['hydrogen chloride, HCl', 'chlorine', 1, 'H'],
  ]
  let side: Side
  if (rand.chance(0.5)) {
    const [what, bond] = rand.pick(SUBSTANCES)
    side = pickSide(rand, `What type of bonding is in ${what}?`, bond,
      (['Ionic', 'Covalent', 'Metallic'] as Bond[]).filter(b => b !== bond).map(b => [b, `Not ${b.toLowerCase()}: this is ${NOPE[bond]}`]),
      `Metal + non-metal → ionic. Non-metals only → covalent. Metal only → metallic. This is ${NOPE[bond]}`)
  } else {
    const [what, centre, bonds] = rand.pick(MOLECULES)
    side = pickSide(rand, `How many covalent bonds are in one molecule of ${what}?`, `${bonds}`,
      ['1', '2', '3', '4'].filter(b => Number(b) !== bonds).map(b => [b, `Count the hydrogens: each H shares one pair of electrons with the ${centre}, making one bond. That’s ${bonds}, not ${b}.`]),
      `Each hydrogen has one electron to share, so it makes one covalent bond with the ${centre}. ${bonds} hydrogen${bonds > 1 ? 's' : ''}, ${bonds} bond${bonds > 1 ? 's' : ''}.`)
  }

  return {
    id: 'bond', title: 'Round 3 · Snap them together', headline: 'Ions and bonding',
    why: `Atoms want a full outer shell. Metals in groups 1 and 2 lose electrons to make positive ions, like Li⁺ and Mg²⁺. Non-metals in groups 6 and 7 gain electrons to make negative ions, like O²⁻ and Cl⁻. Opposite ions attract in an ionic compound, and the charges add up to zero. Non-metals share electrons instead: covalent bonds.`,
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
  const t1: ElementTask = {
    id: 'heat-1', prompt: `Field day on the moor: it’s ${s1} °C. Tamsin cracks a hand warmer and it heats up to ${f1} °C. What’s the temperature rise?`,
    label: 'Temperature rise', unit: '°C', answer: r1, start: 0, min: 0, max: 60, step: 1, jump: 5,
    win: `The hand warmer is exothermic: it gives out energy, so the temperature goes up. ${fix1}`,
    nope: value => diagnose(r1, value, '°C', [
      [f1, `That’s the final temperature. The RISE is how much it went up from ${s1} °C.`],
      [s1, `That’s the starting temperature. Take it away from the final one.`],
      [f1 + s1, `You added. A change is a subtraction: final − start.`],
    ], fix1),
    scene: { kind: 'thermo', start: s1, target: f1, dir: 'rise', item: 'warmer' },
  }

  const s2 = rand.int(18, 24), d2 = rand.int(6, 16), f2 = s2 - d2
  const fix2 = `Drop = start − final = ${s2} − ${f2} = ${d2} °C.`
  const t2: ElementTask = {
    id: 'heat-2', prompt: `Someone twists an ankle in the quarry. The cold pack starts at ${s2} °C and falls to ${f2} °C. How big is the drop?`,
    label: 'Temperature drop', unit: '°C', answer: d2, start: 0, min: 0, max: 40, step: 1, jump: 5,
    win: `The cold pack is endothermic: it takes in energy, so the temperature falls. ${fix2}`,
    nope: value => diagnose(d2, value, '°C', [
      [f2, `That’s the final temperature. The drop is how far it fell from ${s2} °C.`],
      [s2, `That’s where it started. Take the final temperature away.`],
      [s2 + f2, `You added. A change is a subtraction: start − final.`],
    ], fix2),
    scene: { kind: 'thermo', start: s2, target: f2, dir: 'drop', item: 'cold' },
  }

  const side = rand.chance(0.5)
    ? pickSide(rand, 'The cold pack takes in energy from your ankle. What type of reaction is it?', 'Endothermic', [
      ['Exothermic', 'Exothermic reactions GIVE OUT energy and warm things up. Taking energy in and cooling down is endothermic.'],
      ['Neutralisation', 'Neutralisation is acid + alkali, and it’s exothermic. Taking energy in is endothermic.'],
      ['Combustion', 'Combustion is burning, which gives out loads of energy. Taking energy in is endothermic.'],
    ], 'Endothermic reactions take in energy from the surroundings, so the temperature drops. That’s why they work as sports injury packs.')
    : pickSide(rand, 'The hand warmer gives out energy to its surroundings. What type of reaction is it?', 'Exothermic', [
      ['Endothermic', 'Endothermic reactions TAKE IN energy and cool things down. Giving energy out is exothermic.'],
      ['Thermal decomposition', 'Thermal decomposition needs heating, so it takes energy in. Giving energy out is exothermic.'],
      ['Electrolysis', 'Electrolysis uses electricity to split compounds. Giving energy out as heat is exothermic.'],
    ], 'Exothermic reactions transfer energy to the surroundings, so the temperature rises. Hand warmers and self-heating cans use them.')

  return {
    id: 'heat', title: 'Round 4 · Feel the heat', headline: 'Exothermic and endothermic',
    why: `Exothermic reactions transfer energy TO the surroundings, so the temperature goes up: hand warmers, self-heating cans, burning fuels. Endothermic reactions take energy IN from the surroundings, so the temperature drops: sports injury cold packs. A temperature change is always the bigger reading minus the smaller one.`,
    tasks: [t1, t2], side,
    chain: [
      { line: `\\text{drop} = [[s:${s2}]] - [[f:${f2}]]` },
      { line: `\\text{drop} = [[r:${d2}]]\\,^{\\circ}\\text{C}`, op: 'Subtract', merge: { r: ['s', 'f'] }, why: `Start − final: ${s2} − ${f2} = ${d2} °C.` },
      { line: `\\text{temperature fell} \\Rightarrow \\text{endothermic}`, op: 'Name it', why: `The pack took energy in from its surroundings (your ankle), so it’s endothermic.` },
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
  const t1: ElementTask = {
    id: 'boss-1', prompt: `Required practical: acid and alkali in a polystyrene cup, starting at ${t0} °C. Read the table. What’s the temperature rise?`,
    label: 'Temperature rise', unit: '°C', answer: rise, start: 0, min: 0, max: 40, step: 1, jump: 5,
    win: `Neutralisation is exothermic. Use the HIGHEST temperature, before the cup starts to cool. ${fix1}`,
    nope: value => diagnose(rise, value, '°C', [
      [last - t0, `That uses the last reading, but the mixture had already started cooling. Use the highest, ${peak} °C.`],
      [peak, `That’s the highest temperature itself. Take away the start, ${t0} °C.`],
      [early - t0, `That uses the 30 s reading. It kept rising after that: use the highest, ${peak} °C.`],
      [peak + t0, `You added. The rise is highest − start.`],
    ], fix1),
    scene: { kind: 'thermo', start: t0, target: peak, dir: 'rise', item: 'cup', readings },
  }

  const mean = rand.int(5, 14), spread = rand.pick(SPREADS)
  const rises = spread.map(s => mean + s), sum = 3 * mean
  const fix2 = `${rises.join(' + ')} = ${sum}, and ${sum} ÷ 3 = ${mean} °C.`
  const t2: ElementTask = {
    id: 'boss-2', prompt: `Three repeats give rises of ${rises.join(' °C, ').replace(/, ([^,]*)$/, ' and $1')} °C. What is the mean temperature rise?`,
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
