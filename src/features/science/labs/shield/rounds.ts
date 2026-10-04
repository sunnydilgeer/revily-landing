import { options, type Rand } from '../../../maths/labs/kit/random'
import { diagnose, n, tex, type Round, type Task } from '../kit/types'

/*
 * Sky Shield: rogue drones have shut the runway, and you're the young defence engineer who builds,
 * powers and flies the net-drones that bring them down safely, with Squadron Leader Okoro
 * (AQA Combined Science 6.5 Forces, 6.6 Waves, plus electrical power). Every answer is picked first,
 * then the mission is built around it, so the numbers stay friendly. No people, no weapons: every
 * target is a drone, and it gets netted or guided down.
 */

/**
 * What the Stage draws. `lift`: our drone on the pad, climbing to its hover line. `power`: the same,
 * powered by the battery. `track`: a sensor ping racing out to the rogue drone. `chase`: our net-drone
 * flying to the rogue drone. `tank`: the ripple-tank practical from above.
 */
export type Scene = {
  look: 'lift' | 'power' | 'track' | 'chase' | 'tank'
  /** The readouts on the ops panel: the given values, in order. */
  rows: [string, string][]
  /** The ops-panel readout that shows the dial. */
  dial: string
  /** The label on the line or target: "Hover height", "Rogue drone". */
  goal: string
  /** Force arrows on the drone (lift only): up and down labels. */
  arrows?: { up: string; down: string }
  /** The ripple tank: how many waves fit across how many cm. */
  tank?: { waves: number; cm: number }
}
export type ShieldTask = Task<Scene>
export type ShieldRound = Round<Scene>

/** Round 1: weight W = m g, then the resultant force that makes the drone climb. */
function liftRound(rand: Rand): ShieldRound {
  const m = rand.pick([10, 20, 30, 40, 50]), W = Math.round(m * 9.8)
  const fix1 = `W = m × g = ${m} × 9.8 = ${n(W)} N.`
  const t1: ShieldTask = {
    id: 'lift-1', prompt: `Your cargo drone, loaded with its net launcher, has a mass of ${m} kg. With g = 9.8 N/kg, what is its weight?`,
    label: 'Weight W', unit: 'N', answer: W, start: 0, min: 0, max: 600, step: 1, jump: 50,
    win: `Weight is the pull of gravity on the mass, in newtons. ${fix1}`,
    nope: value => diagnose(W, value, 'N', [
      [m * 10, `You used g = 10. This mission uses 9.8 N/kg.`],
      [m, `That’s the mass in kg. Weight is a force: multiply by g.`],
      [Math.round(m / 9.8), `You divided. Weight W = m × g: multiply.`],
      [Math.round(m + 9.8), `You added. Weight W = m × g: multiply.`],
    ], fix1),
    scene: { look: 'lift', rows: [['Mass', `${m} kg`], ['g', '9.8 N/kg']], dial: 'Weight', goal: 'Hover height' },
  }

  const R = rand.pick([20, 30, 40, 50, 60, 80]), T = W + R
  const fix2 = `Resultant = thrust − weight = ${n(T)} − ${n(W)} = ${R} N upwards.`
  const t2: ShieldTask = {
    id: 'lift-2', prompt: `Spin up! The rotors push up with ${n(T)} N of thrust. The weight is ${n(W)} N. What is the resultant force upwards?`,
    label: 'Upward force', unit: 'N', answer: R, start: 0, min: 0, max: 200, step: 1, jump: 10,
    win: `Thrust up, weight down: opposite ways, so take one from the other. ${fix2} It climbs!`,
    nope: value => diagnose(R, value, 'N', [
      [T + W, `You added. The forces point opposite ways, so take away.`],
      [T, `That’s just the thrust. Weight pulls the other way, so take it off.`],
      [W, `That’s just the weight. The resultant is thrust minus weight.`],
    ], fix2),
    scene: { look: 'lift', rows: [['Thrust', `${n(T)} N`], ['Weight', `${n(W)} N`]], dial: 'Resultant', goal: 'Hover height', arrows: { up: `${n(T)} N`, down: `${n(W)} N` } },
  }

  const right = 'Its weight gets smaller, its mass stays the same'
  return {
    id: 'lift', title: 'Round 1 · Lift-off', headline: 'Weight and thrust',
    why: `Mass is how much stuff is in the drone, in kilograms. Weight is the force of gravity on that mass, in newtons: W = m × g, with g = 9.8 N/kg. The rotors push up with thrust. The resultant force is thrust minus weight, and if it points up, the drone climbs.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Sky Shield tests a drone on the Moon, where gravity is weaker. What happens?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Its mass gets smaller, its weight stays the same', label: 'Its mass gets smaller, its weight stays the same', nope: 'Flipped. Mass is the stuff in it, the same anywhere. Weight depends on gravity, so that’s what drops.' },
        { value: 'Both get smaller', label: 'Both get smaller', nope: 'Mass is the amount of stuff, and that never changes. Only the weight drops with weaker gravity.' },
        { value: 'Nothing changes', label: 'Nothing changes', nope: 'Weight is the pull of gravity, W = m × g. Weaker g means less weight, though the mass is the same.' },
      ], { count: 4 }),
      why: `Mass is the amount of stuff, the same everywhere. Weight = m × g, so weaker gravity means less weight.`,
    },
    chain: [
      { line: `[[w:W]] = [[m:${m}]] \\times [[g:9.8]]` },
      { line: `[[w:W]] = [[x:${tex(W)}]]\\,\\text{N}`, op: 'Multiply', merge: { x: ['m', 'g'] }, why: `${m} × 9.8 = ${n(W)} N of weight pulling down.` },
      { line: `[[f:F]] = [[t:${tex(T)}]] - [[x:${tex(W)}]]`, op: 'Resultant force', why: `Thrust up, weight down. Opposite ways, so take away.` },
      { line: `[[f:F]] = [[r:${R}]]\\,\\text{N}`, op: 'Subtract', merge: { r: ['t', 'x'] }, why: `${n(T)} − ${n(W)} = ${R} N upwards. Lift-off.` },
    ],
  }
}

/** Round 2: battery power P = V × I, then flight time t = E ÷ P. */
function powerRound(rand: Rand): ShieldRound {
  const V = rand.pick([12, 24]), I = rand.pick([5, 10, 15, 20]), P = V * I
  const fix1 = `P = V × I = ${V} × ${I} = ${n(P)} W.`
  const t1: ShieldTask = {
    id: 'power-1', prompt: `The rotor motors run off a ${V} V battery and draw ${I} A. What power do they use?`,
    label: 'Power P', unit: 'W', answer: P, start: 0, min: 0, max: 1000, step: 10, jump: 100,
    win: `Power is potential difference × current. ${fix1}`,
    nope: value => diagnose(P, value, 'W', [
      [V + I, `You added. P = V × I: multiply.`],
      [V * I * I, `You used the current twice. P = V × I.`],
      [V * V * I, `You used the voltage twice. P = V × I.`],
    ], fix1),
    scene: { look: 'power', rows: [['Battery', `${V} V`], ['Current', `${I} A`]], dial: 'Power', goal: 'Hover height' },
  }

  const t = rand.pick([60, 120, 180, 240, 300, 600]), E = P * t
  const fix2 = `t = E ÷ P = ${n(E)} ÷ ${n(P)} = ${t} s.`
  const t2: ShieldTask = {
    id: 'power-2', prompt: `The battery stores ${n(E)} J. At ${n(P)} W, how many seconds can the drone fly?`,
    label: 'Flight time t', unit: 's', answer: t, start: 0, min: 0, max: 900, step: 10, jump: 60,
    win: `A watt is a joule every second, so divide the energy by the power. ${fix2} That’s ${t / 60} min on patrol.`,
    nope: value => diagnose(t, value, 's', [
      [t / 60, `That’s minutes. The question wants seconds: don’t divide by 60.`],
      [Math.round(P / E), `Upside down: it’s E ÷ P, not P ÷ E.`],
      [E - P, `You took away. Flight time t = E ÷ P: divide.`],
    ], fix2),
    scene: { look: 'power', rows: [['Energy', `${n(E)} J`], ['Power', `${n(P)} W`]], dial: 'Flight time', goal: 'Hover height' },
  }

  const right = 'Increase the current'
  return {
    id: 'power', title: 'Round 2 · Power the rotors', headline: 'Power, energy and motors',
    why: `Each rotor is an electric motor: a current in a coil, inside a magnetic field, makes it spin. Power is how fast the battery transfers energy: P = V × I, in watts. A watt is one joule every second, so a full battery lasts t = E ÷ P seconds.`,
    tasks: [t1, t2],
    side: {
      prompt: 'The rotors need to spin faster to beat the wind. What should you do to each motor?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Reverse the current', label: 'Reverse the current', nope: 'Swapping the current direction makes the motor spin the OTHER way, not faster. More current makes it faster.' },
        { value: 'Use a weaker magnet', label: 'Use a weaker magnet', nope: 'A weaker magnet gives a smaller force, so it spins slower. A stronger magnet or more current speeds it up.' },
        { value: 'Turn the magnet round', label: 'Turn the magnet round', nope: 'Flipping the magnet reverses the motor’s direction. For more speed, increase the current.' },
      ], { count: 4 }),
      why: `More current (or a stronger magnet) means a bigger force on the coil, so it spins faster. Reversing the current or the magnet just reverses the direction.`,
    },
    chain: [
      { line: `[[t:t]] = [[e:E]] \\div [[p:P]]` },
      { line: `[[t:t]] = [[e:${tex(E)}]] \\div [[p:${tex(P)}]]`, op: 'Swap in', why: `The battery stores ${n(E)} J and the motors use ${n(P)} W.` },
      { line: `[[t:t]] = [[r:${t}]]\\,\\text{s}`, op: 'Divide', merge: { r: ['e', 'p'] }, why: `${n(E)} ÷ ${n(P)} = ${t} s. That’s ${t / 60} min in the air.` },
    ],
  }
}

/** Round 3: the acoustic sensor. λ = v ÷ f for the propeller buzz, then echo distance = v × t ÷ 2. */
function trackRound(rand: Rand): ShieldRound {
  const v = 340
  const [f, lam] = rand.pick([[68, 5], [85, 4], [136, 2.5], [170, 2], [340, 1], [680, 0.5]] as const)
  const fix1 = `λ = v ÷ f = ${v} ÷ ${f} = ${n(lam)} m.`
  const t1: ShieldTask = {
    id: 'track-1', prompt: `The sensor hears the rogue drone’s propellers buzzing at ${f} Hz. Sound travels at ${v} m/s. What is the wavelength?`,
    label: 'Wavelength λ', unit: 'm', answer: lam, start: 0, min: 0, max: 10, step: 0.5, jump: 2,
    win: `Rearrange v = f × λ to λ = v ÷ f. ${fix1}`,
    nope: value => diagnose(lam, value, 'm', [
      [f / v, `Upside down: it’s v ÷ f, not f ÷ v.`],
      [v - f, `You took away. λ = v ÷ f: divide.`],
      [lam * 2, `That’s double. Just v ÷ f.`],
    ], fix1),
    scene: { look: 'track', rows: [['Frequency', `${f} Hz`], ['Speed', `${v} m/s`]], dial: 'Wavelength', goal: 'Rogue drone' },
  }

  const time = rand.pick([0.5, 1, 1.5, 2, 2.5, 3]), d = v * time / 2
  const fix2 = `d = v × t ÷ 2 = ${v} × ${n(time)} ÷ 2 = ${d} m.`
  const t2: ShieldTask = {
    id: 'track-2', prompt: `The sensor sends a ping. The echo off the rogue drone comes back after ${n(time)} s. How far away is the drone?`,
    label: 'Distance', unit: 'm', answer: d, start: 0, min: 0, max: 1200, step: 5, jump: 50,
    win: `The ping goes there AND back, so halve it. ${fix2} Locked on.`,
    nope: value => diagnose(d, value, 'm', [
      [v * time, `That’s the whole trip, there and back. Halve it to get the distance to the drone.`],
      [v * time * 2, `You doubled it. The echo goes there and back, so HALVE it.`],
      [Math.round(v / time), `You divided by the time. Distance = speed × time, then ÷ 2.`],
    ], fix2),
    scene: { look: 'track', rows: [['Echo time', `${n(time)} s`], ['Speed', `${v} m/s`]], dial: 'Distance', goal: 'Rogue drone' },
  }

  const right = 'Longitudinal'
  return {
    id: 'track', title: 'Round 3 · Track it', headline: 'Waves and echoes',
    why: `Every wave obeys wave speed = frequency × wavelength: v = f × λ. Sound in air travels at about 340 m/s. Send out a ping and time the echo. The sound goes there and back, so the distance to the drone is speed × time ÷ 2.`,
    tasks: [t1, t2],
    side: {
      prompt: 'The propeller buzz is a sound wave. What kind of wave is sound?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Transverse', label: 'Transverse', nope: 'Transverse waves, like light or ripples on water, wobble at right angles. Sound vibrates along the way it travels: longitudinal.' },
        { value: 'Electromagnetic', label: 'Electromagnetic', nope: 'Sound needs particles to travel through, so it isn’t electromagnetic. It’s a longitudinal wave.' },
        { value: 'Gamma', label: 'Gamma', nope: 'Gamma rays are electromagnetic waves. Sound is a longitudinal wave of squashed and stretched air.' },
      ], { count: 4 }),
      why: `In sound, the air particles vibrate back and forth along the direction the wave travels: compressions and rarefactions. That’s longitudinal.`,
    },
    chain: [
      { line: `[[d:d]] = [[v:${v}]] \\times [[t:${tex(time)}]] \\div [[h:2]]` },
      { line: `[[d:d]] = [[s:${tex(v * time)}]] \\div [[h:2]]`, op: 'Total trip', merge: { s: ['v', 't'] }, why: `${v} × ${n(time)} = ${n(v * time)} m: out to the drone and back again.` },
      { line: `[[d:d]] = [[a:${d}]]\\,\\text{m}`, op: 'Halve it', merge: { a: ['s', 'h'] }, why: `Only half the trip is out to the drone: ${n(v * time)} ÷ 2 = ${d} m.` },
    ],
  }
}

/** Round 4: the intercept. time = distance ÷ speed, then the net-drone's kinetic energy. */
function chaseRound(rand: Rand): ShieldRound {
  const v = rand.pick([10, 20, 30]), t = rand.pick([4, 5, 6, 8, 10, 12]), d = v * t
  const fix1 = `time = distance ÷ speed = ${d} ÷ ${v} = ${t} s.`
  const t1: ShieldTask = {
    id: 'chase-1', prompt: `The rogue drone is hovering ${d} m away. Your net-drone flies at ${v} m/s. How long until it gets there?`,
    label: 'Time t', unit: 's', answer: t, start: 0, min: 0, max: 30, step: 1, jump: 5,
    win: `Speed = distance ÷ time, so time = distance ÷ speed. ${fix1}`,
    nope: value => diagnose(t, value, 's', [
      [d - v, `You took away. Time = distance ÷ speed.`],
      [Math.round(v / d), `Upside down: it’s distance ÷ speed.`],
      [t * 2, `That’s double. Just distance ÷ speed.`],
    ], fix1),
    scene: { look: 'chase', rows: [['Distance', `${d} m`], ['Speed', `${v} m/s`]], dial: 'Time', goal: 'Rogue drone' },
  }

  const m = rand.pick([2, 4, 6, 8]), E = m * v * v / 2
  const fix2 = `Eₖ = ½ × m × v² = ½ × ${m} × ${v}² = ½ × ${m} × ${v * v} = ${n(E)} J.`
  const t2: ShieldTask = {
    id: 'chase-2', prompt: `The net-drone has a mass of ${m} kg and flies at ${v} m/s. How much kinetic energy does it have?`,
    label: 'Kinetic energy', unit: 'J', answer: E, start: 0, min: 0, max: 5000, step: 50, jump: 500,
    win: `Square the speed first, then × mass, then halve. ${fix2}`,
    nope: value => diagnose(E, value, 'J', [
      [m * v * v, `You forgot the ½. Eₖ = ½ m v².`],
      [m * v / 2, `You didn’t square the speed. Eₖ = ½ m v².`],
      [m * v, `No ½ and no square. Eₖ = ½ × m × v².`],
      [(m * v / 2) ** 2, `You squared m × v. Only the SPEED is squared.`],
    ], fix2),
    scene: { look: 'chase', rows: [['Mass', `${m} kg`], ['Speed', `${v} m/s`]], dial: 'Kinetic energy', goal: 'Rogue drone' },
  }

  const right = '4 times as much'
  return {
    id: 'chase', title: 'Round 4 · Intercept', headline: 'Speed and kinetic energy',
    why: `Speed = distance ÷ time, so time = distance ÷ speed. Anything moving has kinetic energy: Eₖ = ½ × m × v², in joules. The speed is squared, so speed matters most.`,
    tasks: [t1, t2],
    side: {
      prompt: 'The net-drone doubles its speed. What happens to its kinetic energy?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: '2 times as much', label: '2 times as much', nope: 'The speed is SQUARED in ½ m v². Double the speed: 2² = 4 times the energy.' },
        { value: 'It stays the same', label: 'It stays the same', nope: 'Kinetic energy depends on speed: ½ m v². Double v and it goes up 2² = 4 times.' },
        { value: 'Half as much', label: 'Half as much', nope: 'Faster means MORE kinetic energy. With v squared, double the speed is 4 times the energy.' },
      ], { count: 4 }),
      why: `Eₖ = ½ m v², and 2² = 4. Double the speed, four times the kinetic energy.`,
    },
    chain: [
      { line: `[[e:E_k]] = [[h:\\tfrac{1}{2}]] \\times [[m:${m}]] \\times [[v:${v}^2]]` },
      { line: `[[e:E_k]] = [[h:\\tfrac{1}{2}]] \\times [[m:${m}]] \\times [[q:${v * v}]]`, op: 'Square the speed', merge: { q: ['v'] }, why: `${v}² = ${v} × ${v} = ${v * v}.` },
      { line: `[[e:E_k]] = [[k:${m / 2}]] \\times [[q:${v * v}]]`, op: 'Halve the mass', merge: { k: ['h', 'm'] }, why: `½ × ${m} = ${m / 2}.` },
      { line: `[[e:E_k]] = [[r:${tex(E)}]]\\,\\text{J}`, op: 'Multiply', merge: { r: ['k', 'q'] }, why: `${m / 2} × ${v * v} = ${n(E)} J of kinetic energy.` },
    ],
  }
}

/** Round 5 (boss): the ripple-tank required practical. λ from a count, then v = f × λ. */
function tankRound(rand: Rand): ShieldRound {
  const N = rand.pick([5, 8, 10]), lam = rand.pick([2, 3, 4, 5]), L = N * lam
  const fix1 = `λ = ${L} cm ÷ ${N} waves = ${lam} cm.`
  const t1: ShieldTask = {
    id: 'tank-1', prompt: `In the ripple tank, you count ${N} waves across ${L} cm of the ruler. What is the wavelength?`,
    label: 'Wavelength λ', unit: 'cm', answer: lam, start: 0, min: 0, max: 20, step: 1, jump: 5,
    win: `Measure across lots of waves, then share the length between them. ${fix1}`,
    nope: value => diagnose(lam, value, 'cm', [
      [L, `That’s the whole length. Divide it by the ${N} waves.`],
      [N, `That’s how many waves you counted. Divide the length by it.`],
      [L / (N - 1), `You divided by ${N - 1}. There are ${N} whole waves, so divide by ${N}.`],
      [L - N, `You took away. Share the length out: divide.`],
    ], fix1),
    scene: { look: 'tank', rows: [['Waves', `${N}`], ['Length', `${L} cm`]], dial: 'Wavelength', goal: 'Ripple tank', tank: { waves: N, cm: L } },
  }

  const f = rand.pick([2, 4, 5, 6, 8, 10]), v = f * lam
  const fix2 = `v = f × λ = ${f} × ${lam} = ${v} cm/s.`
  const t2: ShieldTask = {
    id: 'tank-2', prompt: `The vibrating bar makes ${f} waves every second (${f} Hz). The wavelength is ${lam} cm. What is the wave speed?`,
    label: 'Wave speed v', unit: 'cm/s', answer: v, start: 0, min: 0, max: 100, step: 1, jump: 10,
    win: `${f} waves a second, each ${lam} cm long. ${fix2}`,
    nope: value => diagnose(v, value, 'cm/s', [
      [f + lam, `You added. v = f × λ: multiply.`],
      [f * L, `You used the whole ${L} cm. Use one wavelength, ${lam} cm.`],
      [f / lam, `You divided. v = f × λ: multiply.`],
      [lam / f, `You divided. v = f × λ: multiply.`],
    ], fix2),
    scene: { look: 'tank', rows: [['Frequency', `${f} Hz`], ['Wavelength', `${lam} cm`]], dial: 'Wave speed', goal: 'Ripple tank', tank: { waves: N, cm: L } },
  }

  const right = 'It makes the measurement more accurate'
  return {
    id: 'tank', title: 'Round 5 · The required practical', headline: 'Waves in a ripple tank',
    why: `Sky Shield engineers prove wave physics in a ripple tank before trusting their sensors. A light above casts the waves onto paper. Count lots of waves across a ruler and divide to get one wavelength. Count the waves passing a point each second for the frequency. Then wave speed v = f × λ.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Why measure across 10 waves instead of just 1?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'It makes the waves go faster', label: 'It makes the waves go faster', nope: 'Measuring doesn’t change the waves. One wave is tiny and hard to measure, so measuring lots and dividing is more accurate.' },
        { value: 'It changes the frequency', label: 'It changes the frequency', nope: 'The vibrating bar sets the frequency. Measuring across many waves just cuts down the measurement error.' },
        { value: 'Single waves can’t be seen', label: 'Single waves can’t be seen', nope: 'You can see them, but one wave is small, so a tiny ruler error is a big fraction of it. Measure lots, then divide.' },
      ], { count: 4 }),
      why: `One wavelength is small, so any ruler error is a big part of it. Across 10 waves the same error is shared out, so the result is more accurate.`,
    },
    chain: [
      { line: `[[l:\\lambda]] = [[L:${L}]] \\div [[N:${N}]]` },
      { line: `[[l:\\lambda]] = [[a:${lam}]]\\,\\text{cm}`, op: 'Divide', merge: { a: ['L', 'N'] }, why: `${L} cm shared between ${N} waves is ${lam} cm each.` },
      { line: `[[v:v]] = [[f:${f}]] \\times [[a:${lam}]]`, op: 'v = f × λ', why: `The bar vibrates at ${f} Hz.` },
      { line: `[[v:v]] = [[s:${v}]]\\,\\text{cm/s}`, op: 'Multiply', merge: { s: ['f', 'a'] }, why: `${f} × ${lam} = ${v} cm/s across the tank.` },
    ],
  }
}

export function makeRounds(rand: Rand): ShieldRound[] {
  return [liftRound(rand), powerRound(rand), trackRound(rand), chaseRound(rand), tankRound(rand)]
}
