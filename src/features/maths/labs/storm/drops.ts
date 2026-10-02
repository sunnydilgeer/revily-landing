import type { ChainStep } from '../../step-chain/StepChain'
import { options, whole, type Rand } from '../kit/random'

export type Ride = { name: string; emoji: string; speed: number }

export type StormQuestion = {
  prompt: string
  answer: number | string
  choices: { value: number | string; label: string; nope?: string }[]
  why: string
  /** What the map shows once this is answered. */
  reveals?: 'distance'
  /** Answering this plays the run on the map with this ride. */
  run?: Ride
}

export type Drop = {
  id: string
  title: string
  /** Metres per grid square. */
  scale: number
  /** Squares from where you land to the edge of the safe zone. */
  squares: number
  /** Seconds until the storm reaches the zone. */
  closes: number
  brief: string
  why: string
  questions: StormQuestion[]
  chain: ChainStep[]
}

export const metres = (value: number) => `${value.toLocaleString('en-GB')} m`
const texMetres = (value: number) => `${value.toLocaleString('en-GB').replace(/,/g, '{,}')}\\text{ m}`

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

function speedChain(squares: number, scale: number, seconds: number): ChainStep[] {
  const distance = squares * scale
  return [
    ...distanceLines(squares, scale),
    { line: `\\text{Speed} = [[d:${texMetres(distance)}]] \\div [[t:${seconds}\\text{ s}]]`, op: '÷ the time', why: `Speed is metres every second, so share the distance out over the seconds you have.` },
    { line: `\\text{Speed} = [[v:${distance / seconds}\\text{ m/s}]]`, op: 'Work it out', merge: { v: ['d', 't'] }, why: `${metres(distance)} ÷ ${seconds} = ${distance / seconds}. Anything at least that fast makes it.` },
  ]
}

const SPRINT: Ride = { name: 'Sprint', emoji: '🏃', speed: 5 }
const CAR: Ride = { name: 'Car', emoji: '🚗', speed: 25 }

/** "How far to the zone?" from squares × scale, with the usual slips. */
function distanceQuestion(rand: Rand, squares: number, scale: number, prompt: string): StormQuestion {
  const distance = squares * scale
  return {
    prompt,
    answer: distance,
    choices: options(rand, { value: distance, label: metres(distance) }, [
      { value: scale + squares, label: metres(scale + squares), nope: `That’s ${scale} + ${squares}. It’s ${squares} squares, each worth ${metres(scale)}: ${squares} × ${scale}.` },
      { value: scale / squares, label: metres(scale / squares), nope: `That’s ${scale} ÷ ${squares}. Each square is a whole ${metres(scale)}, so multiply.` },
      { value: distance / 10, label: metres(distance / 10), nope: `Close, but check the zeros: ${squares} × ${scale} = ${distance}.` },
    ], { valid: whole }),
    why: `${squares} squares × ${metres(scale)} = ${metres(distance)}.`,
    reveals: 'distance',
  }
}

/** "How long at this speed?" = distance ÷ speed. */
function timeQuestion(rand: Rand, distance: number, scale: number, ride: Ride, prompt: string): StormQuestion {
  const time = distance / ride.speed
  return {
    prompt,
    answer: time,
    choices: options(rand, { value: time, label: `${time.toLocaleString('en-GB')} s` }, [
      { value: distance * ride.speed, label: `${(distance * ride.speed).toLocaleString('en-GB')} s`, nope: `Multiplying made it longer. ${ride.speed} m/s means ${ride.speed} metres every second: how many lots of ${ride.speed} fit into ${distance}?` },
      { value: scale / ride.speed, label: `${(scale / ride.speed).toLocaleString('en-GB')} s`, nope: `That’s ${scale} ÷ ${ride.speed}, one square. Use the whole ${metres(distance)}.` },
      { value: distance - ride.speed, label: `${(distance - ride.speed).toLocaleString('en-GB')} s`, nope: `That’s ${distance} − ${ride.speed}. Speed is metres EVERY second, so divide.` },
    ], { valid: whole }),
    why: `${ride.speed} m/s means ${ride.speed} metres every second. ${distance.toLocaleString('en-GB')} ÷ ${ride.speed} = ${time} seconds.`,
  }
}

/** "Do you make it?" Yes when the ride's time beats the storm. */
function verdictQuestion(time: number, closes: number, ride: Ride, prompt: string): StormQuestion {
  const makes = time <= closes
  return {
    prompt,
    answer: makes ? 'yes' : 'no',
    choices: [
      { value: 'yes', label: 'Yes', nope: makes ? undefined : `You need ${time} s and you’ve only got ${closes} s. That’s ${time - closes} seconds too slow.` },
      { value: 'no', label: 'No', nope: makes ? `You need ${time} s and you’ve got ${closes} s. That’s ${closes - time} seconds to spare.` : undefined },
    ],
    why: makes ? `${time} s is less than ${closes} s. You’re in with ${closes - time} seconds to spare.` : `${time} s is way more than ${closes} s. ${ride.name === 'Sprint' ? 'On foot, the storm gets you.' : 'The storm gets you.'}`,
    run: ride,
  }
}

/** A fresh set of drops. Distances are multiples of 50 or 100, so every time is whole seconds. */
export function makeDrops(rand: Rand): Drop[] {
  // Drop 1: you make it on foot.
  const scale1 = rand.pick([50, 100, 200]), squares1 = rand.int(3, 5), distance1 = scale1 * squares1
  const time1 = distance1 / SPRINT.speed, closes1 = Math.ceil(time1 / 10) * 10 + rand.pick([10, 20, 30])

  // Drop 2: on foot you don't, in the car you do.
  const scale2 = rand.pick([200, 250, 500]), squares2 = rand.int(4, 5), distance2 = scale2 * squares2
  const car = { ...CAR, speed: rand.pick([20, 25].filter(speed => distance2 % speed === 0)) }
  const carTime = distance2 / car.speed, closes2 = Math.ceil(carTime / 10) * 10 + rand.pick([10, 20])

  // Drop 3: work out the speed you need, then pick the only ride fast enough.
  const needed = rand.pick([30, 40]), closes3 = rand.pick([10, 20, 30]), distance3 = needed * closes3
  const squares3 = rand.pick([2, 3, 4, 5].filter(q => distance3 % q === 0 && (distance3 / q) % 50 === 0))
  const scale3 = distance3 / squares3
  const glider: Ride = { name: 'Glider', emoji: '🪂', speed: rand.pick([needed + 10, needed + 20].filter(speed => distance3 % speed === 0).concat(needed + 10)) }
  const gliderTime = distance3 / glider.speed
  const slowCar = CAR.speed

  return [
    {
      id: 'drop-1',
      title: `Drop 1 · ${rand.pick(['Old Quarry', 'Pine Woods', 'Rust Yard'])}`,
      scale: scale1,
      squares: squares1,
      closes: closes1,
      brief: 'You land at the edge of the map. The storm is closing in.',
      why: `A map is the real world shrunk down. Each square stands for ${metres(scale1)} of ground, so counting squares tells you the real distance.`,
      questions: [
        distanceQuestion(rand, squares1, scale1, `Each square is ${metres(scale1)}. How far is it to the safe zone?`),
        timeQuestion(rand, distance1, scale1, SPRINT, `You sprint at ${SPRINT.speed} m/s. How many seconds to get there?`),
        verdictQuestion(time1, closes1, SPRINT, `The storm closes in ${closes1} s. Do you make it on foot?`),
      ],
      chain: timeChain(squares1, scale1, SPRINT),
    },
    {
      id: 'drop-2',
      title: `Drop 2 · ${rand.pick(['Salt Flats', 'Dust Bowl', 'Long Highway'])}`,
      scale: scale2,
      squares: squares2,
      closes: closes2,
      brief: 'Bigger map, faster storm. There’s a car nearby, but it’s loud.',
      why: 'Same method: squares × scale for the distance, then distance ÷ speed for the time. A faster ride cuts the time.',
      questions: [
        distanceQuestion(rand, squares2, scale2, `Each square is ${metres(scale2)}. How far to the zone?`),
        timeQuestion(rand, distance2, scale2, SPRINT, `Sprinting at ${SPRINT.speed} m/s, how long does it take?`),
        verdictQuestion(distance2 / SPRINT.speed, closes2, SPRINT, `The storm closes in ${closes2} s. Make it on foot?`),
        timeQuestion(rand, distance2, scale2, car, `Grab the car: ${car.speed} m/s. How long now?`),
        verdictQuestion(carTime, closes2, car, `Storm closes in ${closes2} s. Make it in the car?`),
      ],
      chain: timeChain(squares2, scale2, car),
    },
    {
      id: 'final',
      title: 'Drop 3 · Final Circle',
      scale: scale3,
      squares: squares3,
      closes: closes3,
      brief: `Final circle. ${closes3} seconds until the storm closes. Pick your ride.`,
      why: 'Flip it round. You know the distance and the time you’ve got, so work out the speed you need: distance ÷ time.',
      questions: [
        distanceQuestion(rand, squares3, scale3, `Each square is ${metres(scale3)}. How far to the zone?`),
        {
          prompt: `You’ve got ${closes3} s. What speed do you need?`,
          answer: needed,
          choices: options(rand, { value: needed, label: `${needed} m/s` }, [
            { value: distance3 * closes3, label: `${(distance3 * closes3).toLocaleString('en-GB')} m/s`, nope: `That’s ${distance3} × ${closes3}, faster than a rocket. Speed is distance ÷ time.` },
            { value: distance3 - closes3, label: `${(distance3 - closes3).toLocaleString('en-GB')} m/s`, nope: `That’s ${distance3} − ${closes3}. Share the ${metres(distance3)} across the ${closes3} seconds: divide.` },
            { value: closes3 / 10, label: `${closes3 / 10} m/s`, nope: `Too slow! Speed = distance ÷ time = ${distance3} ÷ ${closes3}.` },
          ], { valid: whole }),
          why: `${metres(distance3)} ÷ ${closes3} s = ${needed} m/s. You need to cover ${needed} metres every second.`,
        },
        {
          prompt: 'Which ride gets you in?',
          answer: 'glider',
          choices: [
            { value: 'sprint', label: `🏃 ${SPRINT.speed}`, nope: `${SPRINT.speed} m/s is way under the ${needed} m/s you need. ${distance3} ÷ ${SPRINT.speed} = ${distance3 / SPRINT.speed} s.` },
            { value: 'car', label: `🚗 ${slowCar}`, nope: `So close. ${slowCar} m/s is under ${needed} m/s: ${distance3} ÷ ${slowCar} = ${distance3 / slowCar} s, and you’ve only got ${closes3}.` },
            { value: 'glider', label: `🪂 ${glider.speed}` },
          ],
          why: `${glider.speed} m/s is faster than the ${needed} m/s you need. ${distance3} ÷ ${glider.speed} ${Number.isInteger(gliderTime) ? `= ${gliderTime}` : `is about ${Math.round(gliderTime)}`} s. In with time to spare.`,
          run: glider,
        },
      ],
      chain: speedChain(squares3, scale3, closes3),
    },
  ]
}
