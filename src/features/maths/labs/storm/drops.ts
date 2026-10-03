import type { ChainStep } from '../../step-chain/StepChain'
import type { Option, Rand } from '../kit/random'

/*
 * Storm Run: you land on a map, the safe zone is a few grid squares away, and the storm closes in.
 * The move is setting a value on a dial: the real distance (squares × scale), how long to run, or
 * the speed to run at. Then you run: you cover speed × time metres. Land on the zone and you're
 * safe; stop short and the storm gets you; go too far and you run straight out the far side.
 *
 * Numbers are built backwards from the answer: every distance is a multiple of 50 m, every time a
 * whole number of seconds and every speed a multiple of 5 m/s.
 */

export type Ride = { name: string; emoji: string; speed: number }
/** A run: you go at `speed` m/s for `time` seconds. */
export type Run = { emoji: string; speed: number; time: number }

export type Quantity = 'distance' | 'time' | 'speed'

/** The main move: set a value on a NumberDial, then commit. */
export type DialStep = {
  kind: 'dial'
  id: string
  prompt: string
  sets: Quantity
  /** Dial label, also the start of each button's name: "Speed: more". */
  label: string
  min: number
  max: number
  step: number
  jump: number
  /** Where the dial starts: never the target. */
  start: number
  /** The right value. */
  target: number
  /** The commit button: "Measure", "Set timer", "Run!". */
  commit: string
  /** Committing plays a run. The dial fills in whichever of speed/time is missing here. */
  run?: { emoji: string; speed?: number; time?: number }
  /** Why the right value is right: shown when they get it. */
  win: string
  /** What went wrong, worked out from the value they set. */
  nope: (value: number) => string
}

/** The one small multiple-choice side question a round may have. */
export type SideStep = {
  kind: 'side'
  id: string
  prompt: string
  answer: string
  choices: Option<string>[]
  why: string
  /** Getting it right plays this run, to show what would happen. */
  run?: Run
}

export type Step = DialStep | SideStep

export type Drop = {
  id: string
  title: string
  /** Metres per grid square. */
  scale: number
  /** Squares from where you land to the safe zone. */
  squares: number
  /** Seconds until the storm closes on the zone. */
  closes: number
  /** How the storm timer reads before you've worked it out ("1 min 20 s"), or null when it's in seconds already. */
  timer: string | null
  brief: string
  why: string
  steps: Step[]
  chain: ChainStep[]
}

export const metres = (value: number) => `${value.toLocaleString('en-GB')} m`
export const seconds = (value: number) => `${value.toLocaleString('en-GB')} s`
export const mps = (value: number) => `${value.toLocaleString('en-GB')} m/s`
export const formatFor = (sets: Quantity) => sets === 'distance' ? metres : sets === 'time' ? seconds : mps
const texNum = (value: number) => value.toLocaleString('en-GB').replace(/,/g, '{,}')
const texMetres = (value: number) => `${texNum(value)}\\text{ m}`
const minSec = (total: number) => `${Math.floor(total / 60)} min ${total % 60} s`

/** Where a run ends up against the zone. */
function runOutcome(distance: number, speed: number, time: number) {
  const covered = speed * time
  const gap = covered - distance
  const where = gap < 0
    ? `That’s ${metres(-gap)} short of the zone, so the storm gets you.`
    : `That’s ${metres(gap)} past the zone: straight out the far side into the storm.`
  return `At ${mps(speed)} for ${seconds(time)} you cover ${speed} × ${time} = ${metres(covered)}. ${where}`
}

// ---------------------------------------------------------------- the dials

function distanceDial(id: string, squares: number, scale: number, max: number): DialStep {
  const distance = squares * scale
  const fix = `It’s ${squares} squares and each is ${metres(scale)}: ${squares} × ${scale} = ${metres(distance)}.`
  return {
    kind: 'dial', id, sets: 'distance', label: 'Distance',
    prompt: `1 square = ${metres(scale)}. Set the real distance to the zone.`,
    min: 0, max, step: 50, jump: 500, start: 0, target: distance, commit: 'Measure',
    win: `${squares} squares × ${metres(scale)} = ${metres(distance)}. The map is the ground, shrunk.`,
    nope: value => {
      if (value === 0) return `0 m? The zone isn’t under your feet. ${fix}`
      if (value === scale) return `${metres(scale)} is just one square. ${fix}`
      if (value === distance * 10) return `Too many zeros: that’s ten times too far. ${fix}`
      if (value * 10 === distance) return `Lost a zero: that’s ten times too short. ${fix}`
      if (value === squares * 100 && scale !== 100) return `That’s ${squares} × 100. Read the scale: 1 square is ${metres(scale)}, not 100 m. ${fix}`
      if (value === squares * 1000 || value === squares * 50) return `That’s ${squares} × ${value / squares}. Read the scale: 1 square is ${metres(scale)}. ${fix}`
      if (value % scale === 0) return `${metres(value)} is ${value / scale} squares’ worth. Count the squares along the dotted path again. ${fix}`
      return `You set ${metres(value)}, ${value < distance ? 'too short' : 'too far'}. ${fix}`
    },
  }
}

/** Set how long to run at a fixed speed: time = distance ÷ speed. */
function timeDial(id: string, squares: number, scale: number, ride: Ride): DialStep {
  const distance = squares * scale, time = distance / ride.speed
  const fix = `Time = distance ÷ speed = ${distance} ÷ ${ride.speed} = ${seconds(time)}.`
  return {
    kind: 'dial', id, sets: 'time', label: 'Run time',
    prompt: `You sprint at ${mps(ride.speed)}. Set how long you run for.`,
    min: 0, max: 400, step: 5, jump: 50, start: 0, target: time, commit: 'Run!',
    run: { emoji: ride.emoji, speed: ride.speed },
    win: `${mps(ride.speed)} is ${ride.speed} metres every second. ${distance} ÷ ${ride.speed} = ${seconds(time)}, right onto the zone.`,
    nope: value => {
      const outcome = runOutcome(distance, ride.speed, value)
      if (value === 0) return `0 s? You never left. ${fix}`
      if (value === scale / ride.speed) return `${seconds(value)} is the time for one square (${scale} ÷ ${ride.speed}). Use the whole ${metres(distance)}. ${fix}`
      if (value === distance / 10) return `You divided by 10, not ${ride.speed}. ${outcome} ${fix}`
      if (value === distance - ride.speed) return `That’s ${distance} − ${ride.speed}. Speed is metres EVERY second, so divide. ${fix}`
      if (value === distance * ride.speed) return `Multiplying made it way longer. How many lots of ${ride.speed} fit into ${distance}? ${fix}`
      if (value === squares * ride.speed || value === squares) return `That uses the ${squares} squares, not the real distance. Squares × scale first: ${metres(distance)}. ${fix}`
      return `${outcome} ${fix}`
    },
  }
}

/** Set the speed that lands you on the zone just as the storm closes: speed = distance ÷ time. */
function speedDial(id: string, squares: number, scale: number, closes: number, ride: Omit<Ride, 'speed'>, prompt: string, max: number, timer?: { mins: number; secs: number }): DialStep {
  const distance = squares * scale, speed = distance / closes
  const fix = `Speed = distance ÷ time = ${distance} ÷ ${closes} = ${mps(speed)}.`
  return {
    kind: 'dial', id, sets: 'speed', label: 'Speed',
    prompt, min: 0, max, step: 5, jump: 20, start: 0, target: speed, commit: 'Run!',
    run: { emoji: ride.emoji, time: closes },
    win: `${metres(distance)} ÷ ${seconds(closes)} = ${mps(speed)}. ${speed} metres every second, and you roll in as it closes.`,
    nope: value => {
      const outcome = runOutcome(distance, value, closes)
      if (value === 0) return `Speed 0? You stand still and the storm eats you. ${fix}`
      if (value * closes === scale) return `${mps(value)} only covers one square (${metres(scale)}) in ${seconds(closes)}. Use the whole ${metres(distance)}. ${fix}`
      if (timer && timer.secs && value * timer.secs === distance) return `You divided by ${timer.secs}, but that ignores the ${timer.mins} min. The time is ${seconds(closes)}. ${fix}`
      if (timer && value * (timer.mins * 100 + timer.secs) === distance) return `You treated ${timer.mins} min ${timer.secs} s as ${timer.mins * 100 + timer.secs} s. A minute is 60 seconds. ${fix}`
      if (timer && value * timer.mins * 60 === distance) return `You only used the ${timer.mins} min. Add the ${timer.secs} s too: ${seconds(closes)}. ${fix}`
      if (value === distance * closes) return `That’s ${distance} × ${closes}, faster than a rocket. Speed is distance ÷ time. ${fix}`
      if (value === closes) return `${closes} is the time, not the speed. ${outcome} ${fix}`
      if (value === speed * 10) return `Too many zeros. ${outcome} ${fix}`
      return `${outcome} ${fix}`
    },
  }
}

/** Convert the storm timer from minutes and seconds into seconds. */
function timerDial(id: string, closes: number): DialStep {
  const mins = Math.floor(closes / 60), secs = closes % 60
  const fix = `${mins} min = ${mins} × 60 = ${mins * 60} s, plus ${secs} s, makes ${seconds(closes)}.`
  return {
    kind: 'dial', id, sets: 'time', label: 'Storm timer',
    prompt: `The storm closes in ${minSec(closes)}. Set the timer in seconds.`,
    min: 0, max: 300, step: 10, jump: 60, start: 0, target: closes, commit: 'Set timer',
    win: `A minute is 60 seconds. ${mins} × 60 + ${secs} = ${seconds(closes)}.`,
    nope: value => {
      if (value === mins * 100 + secs) return `A minute is 60 seconds, not 100. ${fix}`
      if (value === secs) return `That’s just the ${secs} s. Don’t forget the ${mins} min. ${fix}`
      if (value === mins * 60) return `That’s just the minutes. Add the ${secs} s on top. ${fix}`
      if (value === mins + secs) return `${mins} + ${secs} mixes minutes and seconds. Turn the minutes into seconds first. ${fix}`
      return `You set ${seconds(value)}. ${fix}`
    },
  }
}

// ---------------------------------------------------------------- the working

function distanceLines(squares: number, scale: number): ChainStep[] {
  return [
    { line: `\\text{Distance} = [[n:${squares}]] \\times [[s:${texMetres(scale)}]]` },
    { line: `\\text{Distance} = [[d:${texMetres(squares * scale)}]]`, op: 'Work it out', merge: { d: ['n', 's'] }, why: `${squares} squares, and each square is ${metres(scale)} on the ground.` },
  ]
}

function timeChain(squares: number, scale: number, ride: Ride): ChainStep[] {
  const distance = squares * scale
  return [
    ...distanceLines(squares, scale),
    { line: `\\text{Time} = [[d:${texMetres(distance)}]] \\div [[v:${ride.speed}\\text{ m/s}]]`, op: '÷ the speed', why: `${ride.speed} m/s means ${ride.speed} metres every second. Dividing counts how many seconds it takes to cover the distance.` },
    { line: `\\text{Time} = [[t:${distance / ride.speed}\\text{ s}]]`, op: 'Work it out', merge: { t: ['d', 'v'] }, why: `${metres(distance)} ÷ ${ride.speed} = ${distance / ride.speed} seconds.` },
  ]
}

function speedChain(squares: number, scale: number, closes: number): ChainStep[] {
  const distance = squares * scale
  return [
    ...distanceLines(squares, scale),
    { line: `\\text{Speed} = [[d:${texMetres(distance)}]] \\div [[t:${closes}\\text{ s}]]`, op: '÷ the time', why: 'Speed is metres every second, so share the distance out over the seconds you have.' },
    { line: `\\text{Speed} = [[v:${distance / closes}\\text{ m/s}]]`, op: 'Work it out', merge: { v: ['d', 't'] }, why: `${metres(distance)} ÷ ${closes} = ${distance / closes}. Exactly that fast lands you on the zone as it closes.` },
  ]
}

/** Minutes to seconds first, then distance ÷ time. Every key flows on, so nothing gets struck out. */
function finalChain(squares: number, scale: number, closes: number): ChainStep[] {
  const distance = squares * scale, mins = Math.floor(closes / 60), secs = closes % 60
  return [
    { line: `\\text{Time} = [[m:${mins * 60}]] + [[x:${secs}]]\\text{ s}` },
    { line: `\\text{Time} = [[t:${closes}\\text{ s}]]`, op: 'Add', merge: { t: ['m', 'x'] }, why: `${mins} min is ${mins} × 60 = ${mins * 60} seconds. Add the ${secs} s.` },
    { line: `\\text{Speed} = [[n:${squares}]] \\times [[s:${texMetres(scale)}]] \\div [[t:${closes}\\text{ s}]]`, op: 'Distance ÷ time', why: `The distance is ${squares} squares × ${metres(scale)}. Share it over the ${closes} seconds.` },
    { line: `\\text{Speed} = [[d:${texMetres(distance)}]] \\div [[t:${closes}\\text{ s}]]`, op: 'Find the distance', merge: { d: ['n', 's'] }, why: `${squares} × ${scale} = ${metres(distance)}.` },
    { line: `\\text{Speed} = [[v:${distance / closes}\\text{ m/s}]]`, op: 'Work it out', merge: { v: ['d', 't'] }, why: `${metres(distance)} ÷ ${closes} = ${distance / closes}. ${distance / closes} metres every second.` },
  ]
}

const SPRINT: Ride = { name: 'Sprint', emoji: '🏃', speed: 5 }

/** A fresh set of drops. Distances are multiples of 50 m, so every time and speed comes out whole. */
export function makeDrops(rand: Rand): Drop[] {
  // Drop 1: on foot, set how long to sprint.
  const scale1 = rand.pick([50, 100, 200]), squares1 = rand.int(3, 5), distance1 = scale1 * squares1
  const time1 = distance1 / SPRINT.speed, closes1 = Math.ceil(time1 / 10) * 10 + rand.pick([10, 20, 30])

  // Drop 2: on foot you don't make it; in the car, set the speed.
  const scale2 = rand.pick([200, 250, 500]), squares2 = rand.int(4, 5), distance2 = scale2 * squares2
  const closes2 = rand.pick([20, 25, 40, 50, 60, 80, 100].filter(c => distance2 % c === 0 && (distance2 / c) % 5 === 0 && distance2 / c >= 15 && distance2 / c <= 50))
  const speed2 = distance2 / closes2

  // Drop 3: the timer's in minutes and seconds. Convert it, then set the speed.
  const combos: [number, number, number][] = []
  for (const speed of [10, 15, 20, 25, 30]) for (const closes of [70, 80, 90, 100, 110, 130, 140, 150]) for (const squares of [3, 4, 5]) {
    const distance = speed * closes, scale = distance / squares
    if (distance <= 3000 && Number.isInteger(scale) && scale % 100 === 0) combos.push([speed, closes, squares])
  }
  const [speed3, closes3, squares3] = rand.pick(combos)
  const scale3 = speed3 * closes3 / squares3
  const mins3 = Math.floor(closes3 / 60), secs3 = closes3 % 60

  return [
    {
      id: 'drop-1',
      title: `Drop 1 · ${rand.pick(['Old Quarry', 'Pine Woods', 'Rust Yard'])}`,
      scale: scale1,
      squares: squares1,
      closes: closes1,
      timer: null,
      brief: 'You land at the edge of the map. The storm is closing in.',
      why: `A map is the real world shrunk down. Each square stands for ${metres(scale1)} of ground, so squares × scale gives the real distance. Then time = distance ÷ speed.`,
      steps: [
        distanceDial('d1-distance', squares1, scale1, 1500),
        timeDial('d1-time', squares1, scale1, SPRINT),
      ],
      chain: timeChain(squares1, scale1, SPRINT),
    },
    {
      id: 'drop-2',
      title: `Drop 2 · ${rand.pick(['Salt Flats', 'Dust Bowl', 'Long Highway'])}`,
      scale: scale2,
      squares: squares2,
      closes: closes2,
      timer: null,
      brief: 'Bigger map, faster storm. There’s a car nearby, but its cruise control is jammed on.',
      why: 'Flip it round. You know the distance and the time you’ve got, so the speed you need is distance ÷ time. Too slow and the storm wins; too fast and you fly straight past.',
      steps: [
        distanceDial('d2-distance', squares2, scale2, 3000),
        {
          kind: 'side', id: 'd2-foot',
          prompt: `Storm closes in ${seconds(closes2)}. On foot at ${mps(SPRINT.speed)}, do you make it?`,
          answer: 'no',
          choices: [
            { value: 'yes', label: 'Yes', nope: `On foot it takes ${distance2.toLocaleString('en-GB')} ÷ ${SPRINT.speed} = ${seconds(distance2 / SPRINT.speed)}. You’ve only got ${seconds(closes2)}.` },
            { value: 'no', label: 'No' },
          ],
          why: `${distance2} ÷ ${SPRINT.speed} = ${seconds(distance2 / SPRINT.speed)}, way more than ${seconds(closes2)}. Watch…`,
          run: { emoji: SPRINT.emoji, speed: SPRINT.speed, time: closes2 },
        },
        speedDial('d2-speed', squares2, scale2, closes2, { name: 'Car', emoji: '🚗' }, `Grab the car. Set the cruise speed to roll in as the storm closes.`, 80),
      ],
      chain: speedChain(squares2, scale2, closes2),
    },
    {
      id: 'final',
      title: 'Drop 3 · Final Circle',
      scale: scale3,
      squares: squares3,
      closes: closes3,
      timer: minSec(closes3),
      brief: `Final circle. The storm timer says ${minSec(closes3)}. Your hoverboard has no brakes.`,
      why: 'Speed is metres per SECOND, so the time has to be in seconds too. Turn the minutes into seconds (× 60), then speed = distance ÷ time.',
      steps: [
        distanceDial('d3-distance', squares3, scale3, 3000),
        timerDial('d3-timer', closes3),
        speedDial('d3-speed', squares3, scale3, closes3, { name: 'Hoverboard', emoji: '🛹' }, `Set the hoverboard speed to land on the zone in ${seconds(closes3)}.`, 60, { mins: mins3, secs: secs3 }),
      ],
      chain: finalChain(squares3, scale3, closes3),
    },
  ]
}
