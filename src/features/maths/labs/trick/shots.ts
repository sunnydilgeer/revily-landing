import type { ChainStep } from '../../step-chain/StepChain'

/*
 * Table coordinates: 160 × 90, cushions at x = 6 and 154, y = 6 and 84.
 * Angles are in degrees, measured anticlockwise from pointing right (maths convention, y up),
 * and every one drawn is the real angle between the real lines.
 */
export type Point = [number, number]

export type Arc = { id: string; at: Point; from: number; to: number; value: number }

export type ShotQuestion = {
  prompt: string
  /** The arc this question is about. */
  arc: string
  answer: number
  choices: { value: number; label: string; nope?: string }[]
  why: string
}

export type Shot = {
  id: string
  title: string
  brief: string
  why: string
  /** Solid lines: the ball's path, which it rolls along once every angle is found. */
  path: Point[]
  /** Dashed guide lines (a mate's shot, the edge of a triangle). */
  guides: [Point, Point][]
  arcs: Arc[]
  questions: ShotQuestion[]
  chain: ChainStep[]
}

export const POCKETS: Point[] = [[6, 6], [80, 4], [154, 6], [6, 84], [80, 86], [154, 84]]

const rad = (deg: number) => deg * Math.PI / 180
/** From `p`, go `length` in direction `deg`. */
const toward = ([x, y]: Point, deg: number, length: number): Point => [x + length * Math.cos(rad(deg)), y - length * Math.sin(rad(deg))]

// Shot 1 and 2: a 50° line from the bottom cushion into the top-right corner pocket.
const HIT: Point = [154 - 78 / Math.tan(rad(50)), 84]
const START_2 = toward(HIT, 130, 78 / Math.sin(rad(50)))
// Shot 3: into the same pocket, crossed by a mate's shot at 70°.
const CROSS: Point = [80, 45]
const LINE = Math.atan2(45 - 6, 154 - 80) * 180 / Math.PI
const deg = (value: number) => `${value}^\\circ`

export const shots: Shot[] = [
  {
    id: 'straight',
    title: 'Shot 1 · Straight Line',
    brief: 'Your ball’s on the cushion. Pot it in the top corner.',
    why: 'A straight line is a half turn: 180°. The angles along it always add up to 180°, so if you know one, you know the other.',
    path: [HIT, [154, 6]],
    guides: [],
    arcs: [
      { id: 'known', at: HIT, from: 50, to: 180, value: 130 },
      { id: 'aim', at: HIT, from: 0, to: 50, value: 50 },
    ],
    questions: [
      {
        prompt: 'Angles on a straight line add to 180°. What’s the missing angle?',
        arc: 'aim',
        answer: 50,
        choices: [
          { value: 130, label: '130°', nope: 'That’s the angle you were given. The two together make 180°.' },
          { value: 50, label: '50°' },
          { value: 80, label: '80°', nope: 'Check the subtraction: 180 − 130 = 50.' },
        ],
        why: '180° − 130° = 50°. Aim at 50° and it’s in.',
      },
    ],
    chain: [
      { line: `\\text{?} + [[k:${deg(130)}]] = [[t:${deg(180)}]]` },
      { line: `\\text{?} = [[t:${deg(180)}]] [[m:- ${deg(130)}]]`, op: '− 130° both sides', why: 'Angles on a straight line add to 180°. Take the 130° away to leave the missing angle.' },
      { line: `\\text{?} = [[r:${deg(50)}]]`, op: 'Work it out', merge: { r: ['t', 'm'] }, why: '180 − 130 = 50.' },
    ],
  },
  {
    id: 'bank',
    title: 'Shot 2 · Bank Shot',
    brief: 'The corner’s blocked. Bank it off the bottom cushion.',
    why: 'A ball bounces like light off a mirror: the angle in equals the angle out. Then straight-line and triangle facts do the rest.',
    path: [START_2, HIT, [154, 6]],
    guides: [[START_2, [154, 6]]],
    arcs: [
      { id: 'in', at: HIT, from: 130, to: 180, value: 50 },
      { id: 'out', at: HIT, from: 0, to: 50, value: 50 },
      { id: 'gap', at: HIT, from: 50, to: 130, value: 80 },
      { id: 'start', at: START_2, from: 310, to: 360, value: 50 },
      { id: 'pocket', at: [154, 6], from: 180, to: 230, value: 50 },
    ],
    questions: [
      {
        prompt: 'Angle in = angle out. It hits at 50°. What angle does it bounce off at?',
        arc: 'out',
        answer: 50,
        choices: [
          { value: 50, label: '50°' },
          { value: 130, label: '130°', nope: '130° is the straight-line partner of 50°. A bounce keeps the same angle: in = out.' },
          { value: 40, label: '40°', nope: '40° would make a right angle with 50°. For a bounce, the angle out is the same as the angle in.' },
        ],
        why: 'Angle in = angle out, so it leaves at 50° too.',
      },
      {
        prompt: 'The three angles at the cushion make a straight line. What’s the gap between the paths?',
        arc: 'gap',
        answer: 80,
        choices: [
          { value: 130, label: '130°', nope: 'That’s 180 − 50. There are two 50° angles on this line, so take both away.' },
          { value: 80, label: '80°' },
          { value: 100, label: '100°', nope: 'That’s 50 + 50. Those two plus the gap make 180, so 180 − 100.' },
        ],
        why: '180° − 50° − 50° = 80°.',
      },
      {
        prompt: 'The shot makes a triangle. Angles in a triangle add to 180°. Find the angle at the pocket.',
        arc: 'pocket',
        answer: 50,
        choices: [
          { value: 60, label: '60°', nope: '60° is for a triangle with all angles equal. Here it’s 180 − 50 − 80.' },
          { value: 130, label: '130°', nope: 'That’s 180 − 50. Take the 80° away as well.' },
          { value: 50, label: '50°' },
        ],
        why: '180° − 50° − 80° = 50°. Every angle checks out. Take the shot.',
      },
    ],
    chain: [
      { line: `\\text{Out} = [[a:${deg(50)}]]` },
      { line: `\\text{Gap} = [[t:${deg(180)}]] - [[a:${deg(50)}]] - [[b:${deg(50)}]]`, op: 'Straight line', why: 'The angle in, the gap and the angle out sit on the cushion: a straight line, 180°.' },
      { line: `\\text{Gap} = [[g:${deg(80)}]]`, op: 'Work it out', merge: { g: ['t', 'a', 'b'] }, why: '180 − 50 − 50 = 80.' },
      { line: `\\text{Pocket} = [[u:${deg(180)}]] - [[c:${deg(50)}]] - [[g:${deg(80)}]]`, op: 'Triangle', why: 'The three corners of a triangle add to 180°. You know two of them.' },
      { line: `\\text{Pocket} = [[z:${deg(50)}]]`, op: 'Work it out', merge: { z: ['u', 'c', 'g'] }, why: '180 − 50 − 80 = 50.' },
    ],
  },
  {
    id: 'cross',
    title: 'Shot 3 · Cross Fire',
    brief: 'Your mate’s shot crosses yours. Line it up perfectly.',
    why: 'When two straight lines cross, the angles opposite each other are equal. Angles next to each other are on a straight line, so they add to 180°.',
    path: [toward(CROSS, LINE + 180, 55), [154, 6]],
    guides: [[toward(CROSS, LINE + 70, 40), toward(CROSS, LINE + 250, 40)]],
    arcs: [
      { id: 'given', at: CROSS, from: LINE, to: LINE + 70, value: 70 },
      { id: 'opposite', at: CROSS, from: LINE + 180, to: LINE + 250, value: 70 },
      { id: 'next', at: CROSS, from: LINE + 70, to: LINE + 180, value: 110 },
    ],
    questions: [
      {
        prompt: 'Vertically opposite angles are equal. What’s the angle opposite 70°?',
        arc: 'opposite',
        answer: 70,
        choices: [
          { value: 110, label: '110°', nope: '110° is the one NEXT to 70°. The opposite one is the same size: 70°.' },
          { value: 290, label: '290°', nope: 'That’s all the way round minus 70. The opposite angle is just a mirror of 70°.' },
          { value: 70, label: '70°' },
        ],
        why: 'Opposite angles are equal: 70°.',
      },
      {
        prompt: 'And the angle next to it?',
        arc: 'next',
        answer: 110,
        choices: [
          { value: 110, label: '110°' },
          { value: 20, label: '20°', nope: '90 − 70 is for a right angle. These two sit on a straight line: 180 − 70.' },
          { value: 70, label: '70°', nope: 'Opposite ones are equal, but this one’s next door. Next-door angles add to 180°.' },
        ],
        why: '180° − 70° = 110°. Lined up. Shoot.',
      },
    ],
    chain: [
      { line: `\\text{Opposite} = [[a:${deg(70)}]]` },
      { line: `\\text{Next} = [[t:${deg(180)}]] - [[a:${deg(70)}]]`, op: 'Straight line', why: 'Opposite angles are equal, so that one is 70°. The next-door angle sits with it on a straight line: 180°.' },
      { line: `\\text{Next} = [[r:${deg(110)}]]`, op: 'Work it out', merge: { r: ['t', 'a'] }, why: '180 − 70 = 110.' },
    ],
  },
]
