import { options, type Rand } from '../../../maths/labs/kit/random'
import { diagnose, n, tex, u, type Round, type Task } from '../kit/types'

/*
 * Pit Crew: tune a British self-driving electric car so it always stops before the zebra crossing,
 * with Chief Ade on the pit wall (AQA 6.5 Forces). Every answer is picked first, then the test is
 * built around it, so the numbers stay whole (the trolley practical's masses are the only decimals,
 * as on the real paper).
 */

/**
 * What the Stage draws. `road`: the car from above, driving to the line. `weigh`: the car on a
 * weighbridge. `trolley`: the required-practical bench. The car's stopping point maps the dial:
 * right on the line when it's right, short when it's low, through the line when it's high.
 */
export type Scene = {
  look: 'road' | 'weigh' | 'trolley'
  /** The readouts on the dash: the given values, in order. */
  rows: [string, string][]
  /** The dash readout that shows the dial. */
  dial: string
  /** The label on the line the car has to hit: "Finish", "Stop here". */
  goal: string
  /** Where the line sits along the run, 0 to 1. Defaults to the end, just before the crossing. */
  lineAt?: number
  /** Draw the zebra crossing (with its waiting pedestrian) at the end of the road. */
  zebra?: boolean
  /** A given distance to label from the start to the line (when the dial isn't a distance). */
  span?: string
  /** Force arrows over the car: forward (green) and backward (red) labels. */
  arrows?: { forward: string; back?: string }
}
export type PitTask = Task<Scene>
export type PitRound = Round<Scene>

/** Round 1: speed = distance ÷ time on the test track, then distance = speed × time. */
function trackRound(rand: Rand): PitRound {
  const v = rand.pick([10, 15, 20, 25, 30]), t = rand.pick([4, 5, 6, 8, 10]), d = v * t
  const fix1 = `speed = distance ÷ time = ${d} ÷ ${t} = ${v} m/s.`
  const t1: PitTask = {
    id: 'track-1', prompt: `On the test track the EV covers ${d} m in ${t} s. What is its speed?`,
    label: 'Speed', unit: 'm/s', answer: v, start: 0, min: 0, max: 60, step: 1, jump: 5,
    win: `Speed is how many metres you cover every second. ${fix1}`,
    nope: value => diagnose(v, value, 'm/s', [
      [d * t, `You multiplied. Speed is distance DIVIDED by time.`],
      [d - t, `You took away. Speed is distance divided by time.`],
      [d + t, `You added. Speed is distance divided by time.`],
    ], fix1),
    scene: { look: 'road', rows: [['Distance', `${d} m`], ['Time', `${t} s`]], dial: 'Speed', goal: 'Finish', span: `${d} m` },
  }

  const v2 = rand.pick([10, 15, 20, 25]), t2 = rand.pick([4, 6, 8, 10, 12]), d2 = v2 * t2
  const fix2 = `distance = speed × time = ${v2} × ${t2} = ${d2} m.`
  const t2Task: PitTask = {
    id: 'track-2', prompt: `The sensors want a ${t2} s run at a steady ${v2} m/s. How far down the track is the finish line?`,
    label: 'Distance', unit: 'm', answer: d2, start: 0, min: 0, max: 400, step: 10, jump: 50,
    win: `${v2} metres every second, for ${t2} seconds. ${fix2}`,
    nope: value => diagnose(d2, value, 'm', [
      [v2 + t2, `You added. Distance = speed × time: multiply.`],
      [Math.round(v2 / t2), `You divided. Distance = speed × time: multiply.`],
      [v2 * t2 * 2, `That’s double. Just speed × time.`],
    ], fix2),
    scene: { look: 'road', rows: [['Speed', `${v2} m/s`], ['Time', `${t2} s`]], dial: 'Distance', goal: 'Finish' },
  }

  const right = 'Metres per second (m/s)'
  return {
    id: 'track', title: 'Round 1 · Test track', headline: 'Speed, distance, time',
    why: `Speed tells you how far something goes every second. Speed = distance ÷ time, in metres per second (m/s). Turn it round to get the distance: distance = speed × time.`,
    tasks: [t1, t2Task],
    side: {
      prompt: 'What is the SI unit of speed?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Metres per second squared (m/s²)', label: 'Metres per second squared (m/s²)', nope: 'm/s² is for acceleration, how fast the speed changes. Speed is in m/s.' },
        { value: 'Newtons (N)', label: 'Newtons (N)', nope: 'Newtons measure force. Speed is metres every second: m/s.' },
        { value: 'Seconds (s)', label: 'Seconds (s)', nope: 'Seconds are for time. Speed is distance ÷ time, so metres per second.' },
      ], { count: 4 }),
      why: `Speed = distance ÷ time, so its unit is metres ÷ seconds: m/s.`,
    },
    chain: [
      { line: `[[s:\\text{distance}]] = [[v:\\text{speed}]] \\times [[t:\\text{time}]]` },
      { line: `[[s:\\text{distance}]] = [[v:${v2}]] \\times [[t:${t2}]]`, op: 'Swap in', why: `The speed is ${v2} m/s and the time is ${t2} s.` },
      { line: `[[s:\\text{distance}]] = [[d:${tex(d2)}]]\\,\\text{m}`, op: 'Multiply', merge: { d: ['v', 't'] }, why: `${v2} × ${t2} = ${d2}. The finish line goes ${d2} m down the track.` },
    ],
  }
}

/** Speeds and safety-driver reaction times whose thinking distance comes out whole. */
const REACTIONS: [number, number][] = [
  [10, 0.5], [10, 0.6], [10, 0.7], [10, 0.8], [10, 0.9],
  [20, 0.5], [20, 0.6], [20, 0.7], [20, 0.8], [20, 0.9],
  [30, 0.5], [30, 0.6], [30, 0.7], [30, 0.8],
  [15, 0.6], [15, 0.8], [25, 0.6], [25, 0.8],
]
/** Rough dry-road braking distances (m) for each speed, as in the Highway Code. */
const BRAKING: Record<number, number[]> = { 10: [6, 7, 8], 15: [12, 14, 16], 20: [20, 22, 24], 25: [30, 32, 34], 30: [44, 46, 48] }

/** Round 2: thinking distance = speed × reaction time, then stopping = thinking + braking. */
function stopRound(rand: Rand): PitRound {
  const [v, rt] = rand.pick(REACTIONS), T = Math.round(v * rt), B = rand.pick(BRAKING[v]), S = T + B
  const fix1 = `thinking distance = speed × reaction time = ${v} × ${n(rt)} = ${T} m.`
  const t1: PitTask = {
    id: 'stop-1', prompt: `The safety driver’s reaction time is ${n(rt)} s and the EV is doing ${v} m/s. What is the thinking distance?`,
    label: 'Thinking distance', unit: 'm', answer: T, start: 0, min: 0, max: 60, step: 1, jump: 5,
    win: `Before the brakes even go on, the car keeps going at full speed. ${fix1}`,
    nope: value => diagnose(T, value, 'm', [
      [v, `That’s the speed. Multiply it by the reaction time.`],
      [Math.round(v / rt), `You divided. Thinking distance = speed × reaction time.`],
      [Math.round(v + rt), `You added. Thinking distance = speed × reaction time.`],
      [S, `That’s the whole stopping distance. Thinking distance is just the bit before the brakes go on.`],
    ], fix1),
    scene: { look: 'road', rows: [['Speed', `${v} m/s`], ['Reaction', `${n(rt)} s`]], dial: 'Thinking', goal: 'Brakes on', lineAt: T / S, zebra: true },
  }

  const fix2 = `stopping distance = thinking + braking = ${T} + ${B} = ${S} m.`
  const t2: PitTask = {
    id: 'stop-2', prompt: `The brakes then take ${B} m to stop the car. What is the total stopping distance?`,
    label: 'Stopping distance', unit: 'm', answer: S, start: 0, min: 0, max: 100, step: 1, jump: 10,
    win: `It travels while the driver reacts, then while it brakes. ${fix2} Put the stop sensor ${S} m out and it halts right at the line.`,
    nope: value => diagnose(S, value, 'm', [
      [B, `That’s only the braking distance. Add the ${T} m it travels before the brakes go on.`],
      [T, `That’s only the thinking distance. Add the ${B} m of braking.`],
      [B - T, `You took away. The two distances add up.`],
      [T * B, `You multiplied. Stopping distance = thinking + braking.`],
    ], fix2),
    scene: { look: 'road', rows: [['Thinking', `${T} m`], ['Braking', `${B} m`]], dial: 'Stopping', goal: 'Stop line', zebra: true },
  }

  const right = 'The safety driver checking a phone'
  return {
    id: 'stop', title: 'Round 2 · Zebra crossing', headline: 'Stopping distance',
    why: `Stopping distance = thinking distance + braking distance. Thinking distance is how far the car goes while the driver reacts: speed × reaction time. Braking distance is how far it goes once the brakes are on. Tiredness, alcohol and phones make reactions slower. Wet or icy roads and worn tyres or brakes make braking longer.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Which of these makes the THINKING distance longer?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, rand.shuffle([
        { value: 'An icy road', label: 'An icy road', nope: 'Ice means less grip, so it makes the BRAKING distance longer. Thinking distance is about the driver: tired, drunk or distracted.' },
        { value: 'Worn brake pads', label: 'Worn brake pads', nope: 'Worn brakes make the BRAKING distance longer. Thinking distance is about the driver’s reactions.' },
        { value: 'A wet road', label: 'A wet road', nope: 'A wet road makes the BRAKING distance longer. Thinking distance is about how fast the driver reacts.' },
        { value: 'Bald tyres', label: 'Bald tyres', nope: 'Worn tyres grip less, so the BRAKING distance gets longer. Thinking distance is about the driver.' },
      ]), { count: 4 }),
      why: `A distracted driver reacts more slowly, so the car goes further before the brakes even go on. Road, tyres and brakes change the braking distance instead.`,
    },
    chain: [
      { line: `[[t:\\text{thinking}]] = [[v:${v}]] \\times [[r:${n(rt)}]]` },
      { line: `[[t:\\text{thinking}]] = [[a:${T}]]\\,\\text{m}`, op: 'Multiply', merge: { a: ['v', 'r'] }, why: `${v} m/s for ${n(rt)} s: ${v} × ${n(rt)} = ${T} m.` },
      { line: `[[s:\\text{stopping}]] = [[a:${T}]] + [[b:${B}]]`, op: 'Add braking', why: `Then the brakes take another ${B} m.` },
      { line: `[[s:\\text{stopping}]] = [[c:${S}]]\\,\\text{m}`, op: 'Add', merge: { c: ['a', 'b'] }, why: `${T} + ${B} = ${S} m. Spot the crossing any closer than that and the car can’t stop in time.` },
    ],
  }
}

/** Round 3: resultant force = motor force − drag, then a = F ÷ m. */
function forceRound(rand: Rand): PitRound {
  const m = rand.pick([1000, 1500, 2000]), a = rand.int(1, 3), R = m * a
  const drag = rand.pick([500, 1000, 1500, 2000]), motor = R + drag
  const fix1 = `resultant = ${n(motor)} − ${n(drag)} = ${n(R)} N forwards.`
  const t1: PitTask = {
    id: 'force-1', prompt: `The motor pushes with ${n(motor)} N. Drag and friction push back with ${n(drag)} N. What is the resultant force?`,
    label: 'Resultant force', unit: 'N', answer: R, start: 0, min: 0, max: 10000, step: 100, jump: 1000,
    win: `The forces point opposite ways, so take one from the other. ${fix1}`,
    nope: value => diagnose(R, value, 'N', [
      [motor + drag, `You added. The forces point opposite ways, so subtract.`],
      [motor, `That’s just the motor. Drag pushes back, so take it away.`],
      [drag, `That’s just the drag. The resultant is what’s left after drag cancels part of the motor’s push.`],
    ], fix1),
    scene: { look: 'road', rows: [['Motor', `${n(motor)} N`], ['Drag', `${n(drag)} N`]], dial: 'Resultant', goal: 'Finish', arrows: { forward: `${n(motor)} N`, back: `${n(drag)} N` } },
  }

  const fix2 = `a = F ÷ m = ${n(R)} ÷ ${n(m)} = ${a} m/s².`
  const t2: PitTask = {
    id: 'force-2', prompt: `The EV’s mass is ${n(m)} kg. What acceleration does that ${n(R)} N resultant give it?`,
    label: 'Acceleration', unit: 'm/s²', answer: a, start: 0, min: 0, max: 10, step: 1, jump: 2,
    win: `Newton’s second law: F = m × a, so a = F ÷ m. ${fix2}`,
    nope: value => diagnose(a, value, 'm/s²', [
      [motor / m, `You used the motor force. Use the RESULTANT, ${n(R)} N, once drag is taken off.`],
    ], fix2),
    scene: { look: 'road', rows: [['Resultant', `${n(R)} N`], ['Mass', `${n(m)} kg`]], dial: 'Acceleration', goal: 'Finish', arrows: { forward: `${n(R)} N` } },
  }

  const right = 'Keep going at a steady speed'
  return {
    id: 'force', title: 'Round 3 · Launch control', headline: 'Resultant force and F = m a',
    why: `When forces push opposite ways, the resultant is the bigger one minus the smaller one. Only the resultant force changes the car’s motion. Newton’s second law links them: F = m × a. To find the acceleration, divide: a = F ÷ m.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Motor force and drag become EQUAL. The car will…', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Slow down and stop', label: 'Slow down and stop', nope: 'Balanced forces mean a resultant of zero, so no change in motion. A moving car keeps going at a steady speed.' },
        { value: 'Keep speeding up', label: 'Keep speeding up', nope: 'To speed up it needs a resultant force forwards. Balanced forces give zero resultant: steady speed.' },
        { value: 'Go backwards', label: 'Go backwards', nope: 'Equal forces cancel out. With no resultant force the car just keeps its speed.' },
      ], { count: 4 }),
      why: `Equal forces cancel: the resultant is zero, so there’s no acceleration. The car cruises at a steady speed (Newton’s first law).`,
    },
    chain: [
      { line: `[[f:F]] = [[m:m]] \\times [[a:a]]` },
      { line: `[[f:${tex(R)}]] = [[m:${tex(m)}]] \\times [[a:a]]`, op: 'Swap in', why: `The resultant is ${n(R)} N and the mass is ${n(m)} kg.` },
      { line: `[[a:a]] = [[f:${tex(R)}]] \\div [[m:${tex(m)}]]`, op: 'Get a on its own', why: `a is multiplied by m, so divide both sides by m.` },
      { line: `[[a:a]] = [[r:${a}]]\\,\\text{m/s}^2`, op: 'Divide', merge: { r: ['f', 'm'] }, why: `${n(R)} ÷ ${n(m)} = ${a}. The EV picks up ${a} m/s every second.` },
    ],
  }
}

/** Round 4: a = change in velocity ÷ time, then weight W = m g on the weighbridge. */
function accelRound(rand: Rand): PitRound {
  let a = 0, t = 0, v0 = 0
  do { a = rand.int(2, 5); t = rand.pick([4, 5, 6]); v0 = rand.pick([4, 6, 8, 10]) } while (v0 + a * t > 34)
  const v1 = v0 + a * t, dv = v1 - v0
  const fix1 = `change in velocity = ${v1} − ${v0} = ${dv} m/s, so a = ${dv} ÷ ${t} = ${a} m/s².`
  const t1: PitTask = {
    id: 'accel-1', prompt: `Joining the dual carriageway, the EV goes from ${v0} m/s to ${v1} m/s in ${t} s. What is its acceleration?`,
    label: 'Acceleration', unit: 'm/s²', answer: a, start: 0, min: 0, max: 20, step: 1, jump: 2,
    win: `Acceleration is the change in velocity every second. ${fix1}`,
    nope: value => diagnose(a, value, 'm/s²', [
      [v1 / t, `You used the final speed. Use the CHANGE: ${v1} − ${v0} = ${dv} m/s.`],
      [Math.round((v1 + v0) / t), `You added the speeds. Acceleration uses the change: final minus start.`],
      [dv * t, `You multiplied. Divide the change in velocity by the time.`],
      [dv, `That’s the change in velocity. Now divide it by the ${t} s.`],
    ], fix1),
    scene: { look: 'road', rows: [['Start', `${v0} m/s`], ['End', `${v1} m/s`], ['Time', `${t} s`]], dial: 'Acceleration', goal: 'Slip road' },
  }

  const m = rand.pick([1000, 1500, 2000]), W = Math.round(m * 9.8)
  const fix2 = `W = m × g = ${n(m)} × 9.8 = ${n(W)} N.`
  const t2: PitTask = {
    id: 'accel-2', prompt: `Back in the pit, the EV rolls onto the weighbridge. Its mass is ${n(m)} kg and g = 9.8 N/kg. What is its weight?`,
    label: 'Weight', unit: 'N', answer: W, start: 0, min: 0, max: 25000, step: 100, jump: 1000,
    win: `Weight is the pull of gravity on the mass. ${fix2}`,
    nope: value => diagnose(W, value, 'N', [
      [m, `That’s the mass, in kg. Weight is a force: multiply by g.`],
      [m * 10, `You used g = 10. The exam gives 9.8 N/kg here.`],
      [Math.round(m / 9.8 / 100) * 100, `You divided. W = m × g.`],
    ], fix2),
    scene: { look: 'weigh', rows: [['Mass', `${n(m)} kg`], ['g', '9.8 N/kg']], dial: 'Weight', goal: 'Weighbridge' },
  }

  const right = 'Mass is the amount of stuff, in kg. Weight is the force of gravity on it, in N.'
  return {
    id: 'accel', title: 'Round 4 · Slip road', headline: 'Acceleration and weight',
    why: `Acceleration is how quickly the velocity changes. a = change in velocity ÷ time, in m/s². The change is final velocity minus starting velocity. Weight is a force: W = m × g, where g = 9.8 N/kg on Earth.`,
    tasks: [t1, t2],
    workingOn: 0,
    side: {
      prompt: 'What’s the difference between mass and weight?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'They’re the same thing in different units.', label: 'They’re the same thing in different units.', nope: 'Weight is a FORCE (gravity pulling on the mass). Mass is how much stuff there is. On the Moon your mass stays the same but your weight drops.' },
        { value: 'Mass is in newtons. Weight is in kilograms.', label: 'Mass is in newtons. Weight is in kilograms.', nope: 'Swapped round. Mass is in kg, weight is a force in N.' },
        { value: 'Mass changes on the Moon. Weight stays the same.', label: 'Mass changes on the Moon. Weight stays the same.', nope: 'The other way round. Mass never changes; weight depends on g, which is smaller on the Moon.' },
      ], { count: 4 }),
      why: `Mass is how much matter there is, in kg, and it’s the same everywhere. Weight is gravity’s pull on that mass, W = m × g, in newtons.`,
    },
    chain: [
      { line: `[[d:\\Delta v]] = [[b:${v1}]] - [[c:${v0}]]` },
      { line: `[[d:\\Delta v]] = [[e:${dv}]]\\,\\text{m/s}`, op: 'Take away', merge: { e: ['b', 'c'] }, why: `Final minus start: ${v1} − ${v0} = ${dv} m/s.` },
      { line: `[[a:a]] = [[e:${dv}]] \\div [[t:${t}]]`, op: 'a = Δv ÷ t', why: `Share that change over the ${t} seconds it took.` },
      { line: `[[a:a]] = [[r:${a}]]\\,\\text{m/s}^2`, op: 'Divide', merge: { r: ['e', 't'] }, why: `${dv} ÷ ${t} = ${a}. The EV gains ${a} m/s every second.` },
    ],
  }
}

/** Round 5 (boss): the acceleration required practical, a = F ÷ m on a trolley. */
function trolleyRound(rand: Rand): PitRound {
  let m = 0, a = 0
  do { m = rand.pick([0.5, 1, 2]); a = rand.int(1, 6) } while (m * a > 6 || m * a < 0.5)
  const F = m * a, k = rand.pick([2, 3]), F2 = F * k, a2 = a * k
  const fix1 = `a = F ÷ m = ${n(F)} ÷ ${n(m)} = ${a} m/s².`
  const t1: PitTask = {
    id: 'trolley-1', prompt: `The hanging masses pull the ${n(m)} kg trolley with ${n(F)} N. What acceleration should the light gates measure?`,
    label: 'Acceleration', unit: 'm/s²', answer: a, start: 0, min: 0, max: 30, step: 1, jump: 2,
    win: `Rearrange F = m × a to a = F ÷ m. ${fix1}`,
    nope: value => diagnose(a, value, 'm/s²', [
      [F * m, `You multiplied. a = F ÷ m.`],
      [F, `That’s the force. Divide it by the ${n(m)} kg mass.`],
    ], fix1),
    scene: { look: 'trolley', rows: [['Force', `${n(F)} N`], ['Mass', `${n(m)} kg`]], dial: 'Acceleration', goal: 'Light gate' },
  }

  const fix2 = `${k} times the force on the same mass gives ${k} times the acceleration: ${a} × ${k} = ${a2} m/s².`
  const t2: PitTask = {
    id: 'trolley-2', prompt: `Now the pull is ${n(F2)} N, with the total mass kept the same. Predict the new acceleration.`,
    label: 'Acceleration', unit: 'm/s²', answer: a2, start: 0, min: 0, max: 30, step: 1, jump: 2,
    win: `Acceleration is proportional to the resultant force. ${fix2}`,
    nope: value => diagnose(a2, value, 'm/s²', [
      [a, `That’s the old acceleration. More force on the same mass means MORE acceleration.`],
      [a + k, `You added ${k}. Proportional means multiply: ${k} times the force, ${k} times the acceleration.`],
      [a + F2 - F, `You added the extra force. Proportional means multiply by ${k}.`],
      [a / k, `More force gives more acceleration, not less. Multiply by ${k}.`],
    ], fix2),
    scene: { look: 'trolley', rows: [['Force', `${n(F2)} N`], ['Mass', `${n(m)} kg`]], dial: 'Acceleration', goal: 'Light gate' },
  }

  const right = 'The total mass'
  return {
    id: 'trolley', title: 'Round 5 · The required practical', headline: 'Force and acceleration',
    why: `Hang masses on a string over a pulley to pull a trolley along the bench. Light gates time it, so you can work out the acceleration. Change the force by moving masses from the trolley to the hanger, so the total mass stays the same. Acceleration is proportional to force: double the force, double the acceleration.`,
    tasks: [t1, t2],
    side: {
      prompt: 'To test the effect of FORCE, which variable must stay the same?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'The acceleration', label: 'The acceleration', nope: 'Acceleration is what you MEASURE (the dependent variable). Keep the total mass the same.' },
        { value: 'The force', label: 'The force', nope: 'Force is what you CHANGE on purpose (the independent variable). Keep the total mass the same.' },
        { value: 'The time between the light gates', label: 'The time between the light gates', nope: 'That time changes as the trolley speeds up more; it’s part of the measurement. The control variable is the total mass.' },
      ], { count: 4 }),
      why: `Force is the independent variable and acceleration the dependent one. Keep the total mass the same (move masses from trolley to hanger) so it’s a fair test.`,
    },
    chain: [
      { line: `[[g:${n(F2)}]] \\div [[f:${n(F)}]] = [[k:${k}]]` },
      { line: `a = [[a:${a}]] \\times [[k:${k}]]`, op: 'Scale it', why: `Acceleration is proportional to force. ${k} times the force means ${k} times the acceleration.` },
      { line: `a = [[z:${a2}]]\\,\\text{m/s}^2`, op: 'Multiply', merge: { z: ['a', 'k'] }, why: `${a} × ${k} = ${a2} m/s² with a ${n(F2)} N pull.` },
    ],
  }
}

export function makeRounds(rand: Rand): PitRound[] {
  return [trackRound(rand), stopRound(rand), forceRound(rand), accelRound(rand), trolleyRound(rand)]
}

export { u }
