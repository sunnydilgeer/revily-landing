import type { ChainStep } from '../../step-chain/StepChain'

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

export const rides = {
  sprint: { name: 'Sprint', emoji: '🏃', speed: 5 },
  car: { name: 'Car', emoji: '🚗', speed: 25 },
  glider: { name: 'Glider', emoji: '🪂', speed: 35 },
} satisfies Record<string, Ride>

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

export const drops: Drop[] = [
  {
    id: 'quarry',
    title: 'Drop 1 · Old Quarry',
    scale: 100,
    squares: 4,
    closes: 100,
    brief: 'You land at the edge of the map. The storm is closing in.',
    why: 'A map is the real world shrunk down. Each square stands for 100 m of ground, so counting squares tells you the real distance.',
    questions: [
      {
        prompt: 'Each square is 100 m. How far is it to the safe zone?',
        answer: 400,
        choices: [
          { value: 104, label: '104 m', nope: 'That’s 100 + 4. It’s 4 squares, each worth 100 m: 4 × 100.' },
          { value: 400, label: '400 m' },
          { value: 25, label: '25 m', nope: 'That’s 100 ÷ 4. Each of the 4 squares is a whole 100 m, so multiply.' },
        ],
        why: '4 squares × 100 m = 400 m.',
        reveals: 'distance',
      },
      {
        prompt: 'You sprint at 5 m/s. How many seconds to get there?',
        answer: 80,
        choices: [
          { value: 2000, label: '2,000 s', nope: '400 × 5 is way too long. 5 m/s means 5 metres every second: how many 5s fit into 400?' },
          { value: 20, label: '20 s', nope: 'That’s 100 ÷ 5, one square. You need all 400 m.' },
          { value: 80, label: '80 s' },
        ],
        why: '5 m/s means 5 metres every second. 400 ÷ 5 = 80 seconds.',
      },
      {
        prompt: 'The storm closes in 100 s. Do you make it on foot?',
        answer: 'yes',
        choices: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No', nope: 'You need 80 s and you’ve got 100 s. That’s 20 seconds to spare.' },
        ],
        why: '80 s is less than 100 s. You’re in with 20 seconds to spare.',
        run: rides.sprint,
      },
    ],
    chain: timeChain(4, 100, rides.sprint),
  },
  {
    id: 'flats',
    title: 'Drop 2 · Salt Flats',
    scale: 250,
    squares: 5,
    closes: 90,
    brief: 'Bigger map, faster storm. There’s a car nearby, but it’s loud.',
    why: 'Same method: squares × scale for the distance, then distance ÷ speed for the time. A faster ride cuts the time.',
    questions: [
      {
        prompt: 'Each square is 250 m. How far to the zone?',
        answer: 1250,
        choices: [
          { value: 1250, label: '1,250 m' },
          { value: 255, label: '255 m', nope: 'That’s 250 + 5. It’s 5 squares of 250 m: 5 × 250.' },
          { value: 50, label: '50 m', nope: 'That’s 250 ÷ 5. Each square is a whole 250 m, so multiply.' },
        ],
        why: '5 squares × 250 m = 1,250 m.',
        reveals: 'distance',
      },
      {
        prompt: 'Sprinting at 5 m/s, how long does it take?',
        answer: 250,
        choices: [
          { value: 6250, label: '6,250 s', nope: 'Multiplying made it longer. Divide: how many lots of 5 m fit into 1,250 m?' },
          { value: 250, label: '250 s' },
          { value: 50, label: '50 s', nope: 'That’s 250 ÷ 5, one square. Use the whole 1,250 m.' },
        ],
        why: '1,250 ÷ 5 = 250 seconds.',
      },
      {
        prompt: 'The storm closes in 90 s. Make it on foot?',
        answer: 'no',
        choices: [
          { value: 'yes', label: 'Yes', nope: 'You need 250 s and you’ve only got 90 s. That’s 160 seconds too slow.' },
          { value: 'no', label: 'No' },
        ],
        why: '250 s is way more than 90 s. On foot, the storm gets you.',
        run: rides.sprint,
      },
      {
        prompt: 'Grab the car: 25 m/s. How long now?',
        answer: 50,
        choices: [
          { value: 31250, label: '31,250 s', nope: 'That’s 1,250 × 25. Divide: how many lots of 25 m fit into 1,250 m?' },
          { value: 10, label: '10 s', nope: 'That’s 250 ÷ 25, one square. Use the whole 1,250 m.' },
          { value: 50, label: '50 s' },
        ],
        why: '1,250 ÷ 25 = 50 seconds.',
      },
      {
        prompt: 'Storm closes in 90 s. Make it in the car?',
        answer: 'yes',
        choices: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No', nope: '50 s is less than 90 s. The car gets you there with 40 seconds to spare.' },
        ],
        why: '50 s beats 90 s. Five times faster, five times less time.',
        run: rides.car,
      },
    ],
    chain: timeChain(5, 250, rides.car),
  },
  {
    id: 'final',
    title: 'Drop 3 · Final Circle',
    scale: 200,
    squares: 3,
    closes: 20,
    brief: 'Final circle. 20 seconds until the storm closes. Pick your ride.',
    why: 'Flip it round. You know the distance and the time you’ve got, so work out the speed you need: distance ÷ time.',
    questions: [
      {
        prompt: 'Each square is 200 m. How far to the zone?',
        answer: 600,
        choices: [
          { value: 203, label: '203 m', nope: 'That’s 200 + 3. It’s 3 squares of 200 m: 3 × 200.' },
          { value: 600, label: '600 m' },
          { value: 60, label: '60 m', nope: 'Close, but check the zeros: 3 × 200 = 600.' },
        ],
        why: '3 squares × 200 m = 600 m.',
        reveals: 'distance',
      },
      {
        prompt: 'You’ve got 20 s. What speed do you need?',
        answer: 30,
        choices: [
          { value: 30, label: '30 m/s' },
          { value: 12000, label: '12,000 m/s', nope: 'That’s 600 × 20, faster than a rocket. Speed is distance ÷ time.' },
          { value: 580, label: '580 m/s', nope: 'That’s 600 − 20. Share the 600 m across the 20 seconds: divide.' },
        ],
        why: '600 m ÷ 20 s = 30 m/s. You need to cover 30 metres every second.',
      },
      {
        prompt: 'Which ride gets you in?',
        answer: 'glider',
        choices: [
          { value: 'sprint', label: '🏃 5', nope: '5 m/s is way under the 30 m/s you need. 600 ÷ 5 = 120 s.' },
          { value: 'car', label: '🚗 25', nope: 'So close. 25 m/s is under 30 m/s: 600 ÷ 25 = 24 s, and you’ve only got 20.' },
          { value: 'glider', label: '🪂 35' },
        ],
        why: '35 m/s is faster than the 30 m/s you need. 600 ÷ 35 is about 17 s. In with time to spare.',
        run: rides.glider,
      },
    ],
    chain: speedChain(3, 200, 20),
  },
]
