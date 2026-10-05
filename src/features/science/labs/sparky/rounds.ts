import { options, type Rand } from '../../../maths/labs/kit/random'
import { diagnose, n, tex, u, type Round, type Task } from '../kit/types'

/*
 * Sparky: wire up a solar house and an EV charger with Sal the electrician (AQA 6.2 Electricity).
 * Every answer is picked first, then the circuit is built to fit it, so the numbers stay whole
 * (the practical's meter readings are the only decimals, as on the real paper).
 */

/** Where things sit on the board, and what each label says. `dial` is the slot showing the dial. */
export type Slot = 'supply' | 'a' | 'a1' | 'a2' | 'r1' | 'r2' | 'rt' | 'v' | 'p' | 't' | 'e' | 'len'
export type Board = {
  layout: 'single' | 'series' | 'parallel' | 'charger' | 'wire'
  slots: Partial<Record<Slot, string>>
  dial: Slot
  /** What the charger is powering, for the charger board. */
  device?: { name: string; emoji: string }
}
export type SparkyTask = Task<Board>
export type SparkyRound = Round<Board>

const OHM = 'Ω'

/** Round 1: V = I × R forwards, then rearranged for I. */
function ohmRound(rand: Rand): SparkyRound {
  const I = rand.int(2, 5), R = rand.pick([2, 3, 4, 5, 6, 8, 10].filter(r => r !== I)), V = I * R
  const fix1 = `V = I × R = ${I} × ${R} = ${V} V.`
  const t1: SparkyTask = {
    id: 'ohm-1', prompt: `The porch lamp needs ${I} A through its ${R} Ω filament. What voltage should the supply be?`,
    label: 'Voltage V', unit: 'V', answer: V, start: 0, min: 0, max: 60, step: 1, jump: 10,
    win: `Voltage pushes the current through the resistance. ${fix1}`,
    nope: value => diagnose(V, value, 'V', [
      [I + R, `You added. In V = I × R the current and resistance multiply.`],
      [R - I, `You took away. In V = I × R the current and resistance multiply.`],
      [I * I * R, `You used I twice. It’s just I × R.`],
      [R * R, `You squared the resistance. It’s I × R.`],
    ], fix1),
    scene: { layout: 'single', slots: { a: `${I} A`, r1: `${R} ${OHM}` }, dial: 'supply' },
  }

  const I2 = rand.int(2, 6), R2 = rand.pick([3, 4, 5, 6, 10].filter(r => r !== I2)), V2 = I2 * R2
  const fix2 = `I = V ÷ R = ${V2} ÷ ${R2} = ${I2} A.`
  const t2: SparkyTask = {
    id: 'ohm-2', prompt: `The shed light runs on ${V2} V and has ${R2} Ω resistance. What current flows?`,
    label: 'Current I', unit: 'A', answer: I2, start: 0, min: 0, max: 30, step: 1, jump: 5,
    win: `Rearrange V = I × R to get I = V ÷ R. ${fix2}`,
    nope: value => diagnose(I2, value, 'A', [
      [V2 - R2, `You took away. To get I on its own, divide: I = V ÷ R.`],
      [V2 + R2, `You added. To get I on its own, divide: I = V ÷ R.`],
      [R2 / V2, `Upside down: it’s V ÷ R, not R ÷ V.`],
      [V2, `That’s the voltage. Divide it by the resistance to get the current.`],
    ], fix2),
    scene: { layout: 'single', slots: { supply: `${V2} V`, r1: `${R2} ${OHM}` }, dial: 'a' },
  }

  const right = 'Ohms (Ω)'
  return {
    id: 'ohm', title: 'Round 1 · Porch light', headline: 'Voltage, current, resistance',
    why: `Voltage (V) is the push from the supply, in volts. Current (I) is the flow of charge, in amps. Resistance (R) fights the flow, in ohms. They link up as V = I × R. To find I, divide: I = V ÷ R.`,
    tasks: [t1, t2],
    side: {
      prompt: 'What unit is resistance measured in?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Volts (V)', label: 'Volts (V)', nope: 'Volts are for potential difference, the push. Resistance is in ohms, Ω.' },
        { value: 'Amps (A)', label: 'Amps (A)', nope: 'Amps are for current, the flow. Resistance is in ohms, Ω.' },
        { value: 'Watts (W)', label: 'Watts (W)', nope: 'Watts are for power. Resistance is in ohms, Ω.' },
      ], { count: 4 }),
      why: `Resistance is in ohms, Ω. Volts for the push, amps for the flow, ohms for what fights it.`,
    },
    chain: [
      { line: `V = I \\times R` },
      { line: `[[v:${V2}]] = [[i:I]] \\times [[r:${R2}]]`, op: 'Swap in', why: `The supply is ${V2} V and the resistance is ${R2} Ω.` },
      { line: `[[i:I]] = [[v:${V2}]] \\div [[r:${R2}]]`, op: 'Get I on its own', why: `I is multiplied by R, so divide both sides by R.` },
      { line: `[[i:I]] = [[c:${I2}]]\\,\\text{A}`, op: 'Divide', merge: { c: ['v', 'r'] }, why: `${V2} ÷ ${R2} = ${I2}. The shed light takes ${I2} A.` },
    ],
  }
}

/** Round 2: series. Resistances add, the current is the same all the way round. */
function seriesRound(rand: Rand): SparkyRound {
  let R1 = 0, R2 = 0
  do { R1 = rand.int(2, 12); R2 = rand.int(2, 12) } while (R1 === R2)
  const Rt = R1 + R2
  const fix1 = `In series, add them: ${R1} + ${R2} = ${Rt} Ω.`
  const t1: SparkyTask = {
    id: 'series-1', prompt: `Two garden lamps in series: ${R1} Ω and ${R2} Ω. What is the total resistance?`,
    label: 'Total resistance', unit: OHM, answer: Rt, start: 0, min: 0, max: 50, step: 1, jump: 5,
    win: `One path, so the current has to get through both lamps. ${fix1}`,
    nope: value => diagnose(Rt, value, OHM, [
      [R1 * R2, `You multiplied. Resistances in series just add.`],
      [Math.abs(R1 - R2), `You took away. Resistances in series add.`],
      [R1, `You only counted one lamp. The current goes through both.`],
      [R2, `You only counted one lamp. The current goes through both.`],
    ], fix1),
    scene: { layout: 'series', slots: { r1: `${R1} ${OHM}`, r2: `${R2} ${OHM}` }, dial: 'rt' },
  }

  const I = rand.int(1, 3), V = I * Rt
  const fix2 = `Total resistance ${Rt} Ω, so I = V ÷ R = ${V} ÷ ${Rt} = ${I} A.`
  const t2: SparkyTask = {
    id: 'series-2', prompt: `Now the supply is ${V} V. What current flows round the circuit?`,
    label: 'Current I', unit: 'A', answer: I, start: 0, min: 0, max: 20, step: 1, jump: 5,
    win: `Use the TOTAL resistance for the whole circuit. ${fix2}`,
    nope: value => diagnose(I, value, 'A', [
      [V / R1, `You only used the ${R1} Ω lamp. The current goes through both, so use the total, ${Rt} Ω.`],
      [V / R2, `You only used the ${R2} Ω lamp. The current goes through both, so use the total, ${Rt} Ω.`],
      [V - Rt, `You took away. I = V ÷ R.`],
      [V / R1 + V / R2, `That’s how parallel works. In series there’s one path: use the total, ${Rt} Ω.`],
    ], fix2),
    scene: { layout: 'series', slots: { supply: `${V} V`, r1: `${R1} ${OHM}`, r2: `${R2} ${OHM}` }, dial: 'a' },
  }

  const right = 'The same everywhere'
  return {
    id: 'series', title: 'Round 2 · Garden lights', headline: 'Series: one path',
    why: `In series there is only one path, so the same current goes through every lamp. The total resistance is the resistances added up. Then use I = V ÷ R with the total.`,
    tasks: [t1, t2],
    side: {
      prompt: 'In a series circuit, the current is…', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Used up by each lamp', label: 'Used up by each lamp', nope: 'Current isn’t used up. Energy is transferred, but the charge keeps flowing, so the current is the same everywhere.' },
        { value: 'Biggest next to the battery', label: 'Biggest next to the battery', nope: 'There’s only one path, so the same current flows through every part, battery or not.' },
        { value: 'Split between the lamps', label: 'Split between the lamps', nope: 'Current splits in PARALLEL. In series there’s one path, so it’s the same everywhere.' },
      ], { count: 4 }),
      why: `One path, so every bit of charge goes through every lamp. The current is the same everywhere in series.`,
    },
    chain: [
      { line: `[[q:R_{\\text{total}}]] = [[a:${R1}]] + [[b:${R2}]]` },
      { line: `[[q:R_{\\text{total}}]] = [[t:${Rt}]]\\,\\Omega`, op: 'Add in series', merge: { t: ['a', 'b'] }, why: `Series resistances add: ${R1} + ${R2} = ${Rt}.` },
      { line: `[[i:I]] = [[v:${V}]] \\div [[t:${Rt}]]`, op: 'I = V ÷ R', why: `Use the total resistance for the whole circuit.` },
      { line: `[[i:I]] = [[c:${I}]]\\,\\text{A}`, op: 'Divide', merge: { c: ['v', 't'] }, why: `${V} ÷ ${Rt} = ${I}. The same ${I} A goes through both lamps.` },
    ],
  }
}

/** Round 3: parallel. Every branch gets the full voltage; branch currents add up. */
function parallelRound(rand: Rand): SparkyRound {
  const V = rand.pick([12, 24])
  const currents = V === 12 ? [1, 2, 3, 4, 6] : [1, 2, 3, 4, 6, 8]
  const [I1, I2] = rand.shuffle(currents)
  const R1 = V / I1, R2 = V / I2, It = I1 + I2
  const fix1 = `Each branch gets the full ${V} V, so I = ${V} ÷ ${R1} = ${I1} A.`
  const t1: SparkyTask = {
    id: 'parallel-1', prompt: `The solar battery gives ${V} V. Lamp 1 is ${R1} Ω. What current goes through lamp 1?`,
    label: 'Current I₁', unit: 'A', answer: I1, start: 0, min: 0, max: 30, step: 1, jump: 5,
    win: `In parallel, every branch gets the full supply voltage. ${fix1}`,
    nope: value => diagnose(I1, value, 'A', [
      [V / (R1 + R2), `You added the resistances, which is series thinking. In parallel, lamp 1 gets the full ${V} V on its own.`],
      [V / 2 / R1, `You split the voltage. In parallel every branch gets the FULL ${V} V.`],
      [V * R1, `You multiplied. I = V ÷ R.`],
      [V / R2, `That’s lamp 2. Use lamp 1’s ${R1} Ω.`],
    ], fix1),
    scene: { layout: 'parallel', slots: { supply: `${V} V`, r1: `${R1} ${OHM}`, r2: `${R2} ${OHM}` }, dial: 'a1' },
  }

  const fix2 = `Lamp 2: ${V} ÷ ${R2} = ${I2} A. Total: ${I1} + ${I2} = ${It} A.`
  const t2: SparkyTask = {
    id: 'parallel-2', prompt: `Lamp 2 is ${R2} Ω. What is the total current from the battery?`,
    label: 'Total current', unit: 'A', answer: It, start: 0, min: 0, max: 30, step: 1, jump: 5,
    win: `Find lamp 2’s current, then add the branches. ${fix2}`,
    nope: value => diagnose(It, value, 'A', [
      [I1, `That’s just lamp 1. The battery feeds both branches, so add lamp 2’s current too.`],
      [I2, `That’s just lamp 2. Add lamp 1’s ${I1} A too.`],
      [V / (R1 + R2), `You added the resistances, which is series. In parallel, add the branch CURRENTS.`],
      [I1 * I2, `You multiplied. Branch currents add up.`],
    ], fix2),
    scene: { layout: 'parallel', slots: { supply: `${V} V`, r1: `${R1} ${OHM}`, r2: `${R2} ${OHM}`, a1: `${I1} A` }, dial: 'a' },
  }

  const right = 'Go down'
  return {
    id: 'parallel', title: 'Round 3 · Solar house', headline: 'Parallel: every lamp, full power',
    why: `Houses are wired in parallel, so each light gets the full voltage and can be switched on its own. Work out each branch with I = V ÷ R. The current from the battery is all the branch currents added together.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Add a third lamp in parallel. The total resistance will…', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Go up', label: 'Go up', nope: 'In series it would. In parallel you’ve added another path, so more current flows and the total resistance goes DOWN.' },
        { value: 'Stay the same', label: 'Stay the same', nope: 'Another path lets more current flow from the same voltage, so the total resistance goes down.' },
      ], { count: 3 }),
      why: `Another branch is another path. More current flows from the same voltage, so the total resistance goes down.`,
    },
    chain: [
      { line: `[[i:I_2]] = [[v:${V}]] \\div [[r:${R2}]]` },
      { line: `[[i:I_2]] = [[c:${I2}]]\\,\\text{A}`, op: 'Lamp 2', merge: { c: ['v', 'r'] }, why: `Lamp 2 gets the full ${V} V too: ${V} ÷ ${R2} = ${I2}.` },
      { line: `[[t:I_{\\text{total}}]] = [[a:${I1}]] + [[c:${I2}]]`, op: 'Add the branches', why: `The battery’s current splits between the branches, so add them back up.` },
      { line: `[[t:I_{\\text{total}}]] = [[s:${It}]]\\,\\text{A}`, op: 'Add', merge: { s: ['a', 'c'] }, why: `${I1} + ${I2} = ${It} A from the battery.` },
    ],
  }
}

const DEVICES = [
  { name: 'kettle', emoji: '🫖', I: 10 },
  { name: 'heater', emoji: '🔥', I: 8 },
  { name: 'toaster', emoji: '🍞', I: 4 },
  { name: 'hair dryer', emoji: '💨', I: 5 },
  { name: 'microwave', emoji: '📦', I: 3 },
  { name: 'telly', emoji: '📺', I: 2 },
] as const

/** Round 4: P = V × I on the mains, then E = P × t. */
function powerRound(rand: Rand): SparkyRound {
  const device = rand.pick(DEVICES), V = 230, I = device.I, P = V * I
  const fix1 = `P = V × I = ${V} × ${I} = ${n(P)} W.`
  const t1: SparkyTask = {
    id: 'power-1', prompt: `The ${device.name} draws ${I} A from the ${V} V mains. What is its power?`,
    label: 'Power P', unit: 'W', answer: P, start: 0, min: 0, max: 3000, step: 10, jump: 100,
    win: `Power is voltage × current. ${fix1}`,
    nope: value => diagnose(P, value, 'W', [
      [V + I, `You added. Power P = V × I: multiply.`],
      [V - I, `You took away. Power P = V × I: multiply.`],
      [V * I * I, `You used I twice. P = V × I.`],
    ], fix1),
    scene: { layout: 'charger', slots: { v: `${V} V`, a: `${I} A` }, dial: 'p', device },
  }

  const Pw = rand.pick([5, 10, 20, 50]), t = rand.pick([10, 20, 30, 60]), E = Pw * t
  const fix2 = `E = P × t = ${Pw} × ${t} = ${n(E)} J.`
  const t2: SparkyTask = {
    id: 'power-2', prompt: `An LED floodlight is ${Pw} W. How much energy does it transfer in ${t} seconds?`,
    label: 'Energy E', unit: 'J', answer: E, start: 0, min: 0, max: 4000, step: 10, jump: 100,
    win: `A watt is a joule every second. ${fix2}`,
    nope: value => diagnose(E, value, 'J', [
      [Pw + t, `You added. Energy E = P × t: multiply.`],
      [Pw * t / 60, `You turned the seconds into minutes. Keep t in seconds for joules.`],
      [Pw * t * 60, `t is already in seconds. Don’t × 60 again.`],
    ], fix2),
    scene: { layout: 'charger', slots: { p: `${Pw} W`, t: `${t} s` }, dial: 'e', device: { name: 'floodlight', emoji: '💡' } },
  }

  const right = '1 joule of energy every second'
  return {
    id: 'power', title: 'Round 4 · Plug it in', headline: 'Power and energy',
    why: `Power is how fast energy is transferred, in watts. On the mains, P = V × I. A watt is one joule every second, so energy E = P × t, with t in seconds.`,
    tasks: [t1, t2],
    side: {
      prompt: 'A power of 1 watt means…', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: '1 volt for every amp', label: '1 volt for every amp', nope: 'Volts per amp is resistance (ohms). A watt is 1 joule every second.' },
        { value: '1 joule of energy in total', label: '1 joule of energy in total', nope: 'Power is a RATE: 1 joule every second, for as long as it’s on.' },
        { value: '1 amp of current', label: '1 amp of current', nope: 'Amps measure current. A watt is 1 joule every second.' },
      ], { count: 4 }),
      why: `Power is a rate: 1 W = 1 J/s. That’s why E = P × t.`,
    },
    chain: [
      { line: `[[e:E]] = [[p:P]] \\times [[t:t]]` },
      { line: `[[e:E]] = [[p:${Pw}]] \\times [[t:${t}]]`, op: 'Swap in', why: `P = ${Pw} W and t = ${t} s. Seconds, so the answer comes out in joules.` },
      { line: `[[e:E]] = [[r:${tex(E)}]]\\,\\text{J}`, op: 'Multiply', merge: { r: ['p', 't'] }, why: `${Pw} × ${t} = ${n(E)} J.` },
    ],
  }
}

/** Round 5 (boss): the resistance-of-a-wire required practical. */
function wireRound(rand: Rand): SparkyRound {
  const I = rand.pick([0.2, 0.4, 0.5]), R1 = rand.pick([2, 3, 4, 5, 6, 8, 10]), V = Number((I * R1).toFixed(2))
  const L1 = rand.pick([20, 25]), k = rand.int(2, 4), L2 = L1 * k, R2 = R1 * k
  const fix1 = `R = V ÷ I = ${n(V)} ÷ ${n(I)} = ${R1} Ω.`
  const t1: SparkyTask = {
    id: 'wire-1', prompt: `With ${L1} cm of wire, the voltmeter reads ${n(V)} V and the ammeter ${n(I)} A. What is the resistance?`,
    label: 'Resistance R', unit: OHM, answer: R1, start: 0, min: 0, max: 30, step: 1, jump: 5,
    win: `Rearrange V = I × R to R = V ÷ I. ${fix1}`,
    nope: value => diagnose(R1, value, OHM, [
      [Math.round(V * I), `You multiplied. R = V ÷ I.`],
      [Math.round(V + I), `You added. R = V ÷ I.`],
      [Math.round(V), `That’s the voltage reading. Divide it by the current.`],
    ], fix1),
    scene: { layout: 'wire', slots: { v: `${n(V)} V`, a: `${n(I)} A`, len: `${L1} cm` }, dial: 'r1' },
  }

  const fix2 = `${L2} cm is ${k} times ${L1} cm, so R = ${R1} × ${k} = ${R2} Ω.`
  const t2: SparkyTask = {
    id: 'wire-2', prompt: `Slide the clip to ${L2} cm. The resistance is proportional to length. Predict the new resistance.`,
    label: 'Resistance R', unit: OHM, answer: R2, start: 0, min: 0, max: 60, step: 1, jump: 5,
    win: `Double the length, double the resistance. ${fix2}`,
    nope: value => diagnose(R2, value, OHM, [
      [R1, `That’s the old resistance. A longer wire has MORE resistance.`],
      [R1 + k, `You added ${k}. Proportional means multiply: ${k} times as long, ${k} times the resistance.`],
      [R1 + L2 - L1, `You added the extra length. Proportional means multiply by ${k}.`],
      [Math.round(R1 / k), `A longer wire has more resistance, not less. Multiply by ${k}.`],
    ], fix2),
    scene: { layout: 'wire', slots: { a: `${n(I)} A`, len: `${L2} cm` }, dial: 'r1' },
  }

  const right = 'So the wire doesn’t heat up and change its resistance'
  return {
    id: 'wire', title: 'Round 5 · The required practical', headline: 'Resistance of a wire',
    why: `Clip the wire at different lengths. Read the voltmeter and the ammeter, then work out R = V ÷ I. Resistance is directly proportional to length: twice as long, twice the resistance. Switch off between readings so the wire stays cool.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Why switch the circuit off between readings?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'So the ammeter can reset to zero', label: 'So the ammeter can reset to zero', nope: 'Ammeters don’t need resetting. A warm wire has more resistance, which would spoil your results.' },
        { value: 'To make the current bigger next time', label: 'To make the current bigger next time', nope: 'Switching off doesn’t change the next current. It stops the wire heating up, which would raise its resistance.' },
        { value: 'So the voltmeter can cool down', label: 'So the voltmeter can cool down', nope: 'It’s the WIRE that heats up. A hotter wire has more resistance, so your results go wrong.' },
      ], { count: 4 }),
      why: `Current heats the wire, and a hot wire has more resistance. Switching off keeps the temperature the same, so it’s a fair test.`,
    },
    chain: [
      { line: `[[l:${L2}]] \\div [[m:${L1}]] = [[k:${k}]]` },
      { line: `R = [[r:${R1}]] \\times [[k:${k}]]`, op: 'Scale it', why: `Resistance is proportional to length. ${k} times as long means ${k} times the resistance.` },
      { line: `R = [[z:${R2}]]\\,\\Omega`, op: 'Multiply', merge: { z: ['r', 'k'] }, why: `${R1} × ${k} = ${R2} Ω at ${L2} cm.` },
    ],
  }
}

export function makeRounds(rand: Rand): SparkyRound[] {
  return [ohmRound(rand), seriesRound(rand), parallelRound(rand), powerRound(rand), wireRound(rand)]
}

/** The label a slot shows: its given value, or the dial (live while setting, the answer once nailed). */
export const slotText = (board: Board, slot: Slot, live: string) => board.dial === slot ? live : board.slots[slot]

export { u }
