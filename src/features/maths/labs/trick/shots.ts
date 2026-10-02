import type { ChainStep } from '../../step-chain/StepChain'
import { options, type Rand } from '../kit/random'

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

const deg = (value: number) => `${value}^\\circ`
const label = (value: number) => `${value}°`
const angle = (value: number, nope?: string) => ({ value, label: label(value), nope })

/** A fresh set of shots. Every angle is a multiple of 10, and the table is drawn from the angles. */
export function makeShots(rand: Rand): Shot[] {
  // Shot 1: off the bottom cushion at θ into the top-right corner.
  const t1 = rand.pick([30, 40, 50, 60]), given1 = 180 - t1
  const hit1: Point = [154 - 78 / Math.tan(rad(t1)), 84]

  // Shot 2: a bank shot from the top cushion, off the bottom one, into the top-right corner.
  const t2 = rand.pick([50, 60, 70]), gap2 = 180 - 2 * t2
  const hit2: Point = [154 - 78 / Math.tan(rad(t2)), 84]
  const start2 = toward(hit2, 180 - t2, 78 / Math.sin(rad(t2)))

  // Shot 3: into the same pocket, crossed by a mate's shot at α.
  const a3 = rand.pick([40, 50, 60, 70, 80]), next3 = 180 - a3
  const cross: Point = [80, 45]
  const line = Math.atan2(45 - 6, 154 - 80) * 180 / Math.PI

  return [
    {
      id: 'straight',
      title: 'Shot 1 · Straight Line',
      brief: 'Your ball’s on the cushion. Pot it in the top corner.',
      why: 'A straight line is a half turn: 180°. The angles along it always add up to 180°, so if you know one, you know the other.',
      path: [hit1, [154, 6]],
      guides: [],
      arcs: [
        { id: 'known', at: hit1, from: t1, to: 180, value: given1 },
        { id: 'aim', at: hit1, from: 0, to: t1, value: t1 },
      ],
      questions: [
        {
          prompt: 'Angles on a straight line add to 180°. What’s the missing angle?',
          arc: 'aim',
          answer: t1,
          choices: options(rand, angle(t1), [
            angle(given1, 'That’s the angle you were given. The two together make 180°.'),
            angle(t1 + 30, `Check the subtraction: 180 − ${given1} = ${t1}.`),
            angle(360 - given1, `That’s 360 − ${given1}, a full turn. A straight line is half a turn: 180°.`),
          ]),
          why: `180° − ${given1}° = ${t1}°. Aim at ${t1}° and it’s in.`,
        },
      ],
      chain: [
        { line: `\\text{?} + [[k:${deg(given1)}]] = [[t:${deg(180)}]]` },
        { line: `\\text{?} = [[t:${deg(180)}]] [[m:- ${deg(given1)}]]`, op: `− ${given1}° both sides`, why: `Angles on a straight line add to 180°. Take the ${given1}° away to leave the missing angle.` },
        { line: `\\text{?} = [[r:${deg(t1)}]]`, op: 'Work it out', merge: { r: ['t', 'm'] }, why: `180 − ${given1} = ${t1}.` },
      ],
    },
    {
      id: 'bank',
      title: 'Shot 2 · Bank Shot',
      brief: 'The corner’s blocked. Bank it off the bottom cushion.',
      why: 'A ball bounces like light off a mirror: the angle in equals the angle out. Then straight-line and triangle facts do the rest.',
      path: [start2, hit2, [154, 6]],
      guides: [[start2, [154, 6]]],
      arcs: [
        { id: 'in', at: hit2, from: 180 - t2, to: 180, value: t2 },
        { id: 'out', at: hit2, from: 0, to: t2, value: t2 },
        { id: 'gap', at: hit2, from: t2, to: 180 - t2, value: gap2 },
        { id: 'start', at: start2, from: 360 - t2, to: 360, value: t2 },
        { id: 'pocket', at: [154, 6], from: 180, to: 180 + t2, value: t2 },
      ],
      questions: [
        {
          prompt: `Angle in = angle out. It hits at ${t2}°. What angle does it bounce off at?`,
          arc: 'out',
          answer: t2,
          choices: options(rand, angle(t2), [
            angle(180 - t2, `${180 - t2}° is the straight-line partner of ${t2}°. A bounce keeps the same angle: in = out.`),
            angle(90 - t2, `${90 - t2}° would make a right angle with ${t2}°. For a bounce, the angle out is the same as the angle in.`),
            angle(2 * t2, `That’s ${t2} doubled. The angle out is the same as the angle in.`),
          ]),
          why: `Angle in = angle out, so it leaves at ${t2}° too.`,
        },
        {
          prompt: 'The three angles at the cushion make a straight line. What’s the gap between the paths?',
          arc: 'gap',
          answer: gap2,
          choices: options(rand, angle(gap2), [
            angle(180 - t2, `That’s 180 − ${t2}. There are two ${t2}° angles on this line, so take both away.`),
            angle(2 * t2, `That’s ${t2} + ${t2}. Those two plus the gap make 180, so 180 − ${2 * t2}.`),
            angle(gap2 + 20, `Check it: 180 − ${t2} − ${t2} = ${gap2}.`),
          ]),
          why: `180° − ${t2}° − ${t2}° = ${gap2}°.`,
        },
        {
          prompt: 'The shot makes a triangle. Angles in a triangle add to 180°. Find the angle at the pocket.',
          arc: 'pocket',
          answer: t2,
          choices: options(rand, angle(t2), [
            angle(60, `60° is for a triangle with all angles equal. Here it’s 180 − ${t2} − ${gap2}.`),
            angle(180 - t2, `That’s 180 − ${t2}. Take the ${gap2}° away as well.`),
            angle(gap2, `That’s the gap at the cushion. The pocket angle is 180 − ${t2} − ${gap2}.`),
          ]),
          why: `180° − ${t2}° − ${gap2}° = ${t2}°. Every angle checks out. Take the shot.`,
        },
      ],
      chain: [
        { line: `\\text{Out} = [[a:${deg(t2)}]]` },
        { line: `\\text{Gap} = [[t:${deg(180)}]] - [[a:${deg(t2)}]] - [[b:${deg(t2)}]]`, op: 'Straight line', why: 'The angle in, the gap and the angle out sit on the cushion: a straight line, 180°.' },
        { line: `\\text{Gap} = [[g:${deg(gap2)}]]`, op: 'Work it out', merge: { g: ['t', 'a', 'b'] }, why: `180 − ${t2} − ${t2} = ${gap2}.` },
        { line: `\\text{Pocket} = [[u:${deg(180)}]] - [[c:${deg(t2)}]] - [[g:${deg(gap2)}]]`, op: 'Triangle', why: 'The three corners of a triangle add to 180°. You know two of them.' },
        { line: `\\text{Pocket} = [[z:${deg(t2)}]]`, op: 'Work it out', merge: { z: ['u', 'c', 'g'] }, why: `180 − ${t2} − ${gap2} = ${t2}.` },
      ],
    },
    {
      id: 'cross',
      title: 'Shot 3 · Cross Fire',
      brief: 'Your mate’s shot crosses yours. Line it up perfectly.',
      why: 'When two straight lines cross, the angles opposite each other are equal. Angles next to each other are on a straight line, so they add to 180°.',
      path: [toward(cross, line + 180, 55), [154, 6]],
      guides: [[toward(cross, line + a3, 40), toward(cross, line + a3 + 180, 40)]],
      arcs: [
        { id: 'given', at: cross, from: line, to: line + a3, value: a3 },
        { id: 'opposite', at: cross, from: line + 180, to: line + 180 + a3, value: a3 },
        { id: 'next', at: cross, from: line + a3, to: line + 180, value: next3 },
      ],
      questions: [
        {
          prompt: `Vertically opposite angles are equal. What’s the angle opposite ${a3}°?`,
          arc: 'opposite',
          answer: a3,
          choices: options(rand, angle(a3), [
            angle(next3, `${next3}° is the one NEXT to ${a3}°. The opposite one is the same size: ${a3}°.`),
            angle(360 - a3, `That’s all the way round minus ${a3}. The opposite angle is just a mirror of ${a3}°.`),
            angle(90 - a3, `${90 - a3}° would make a right angle. Opposite angles are equal: ${a3}°.`),
          ]),
          why: `Opposite angles are equal: ${a3}°.`,
        },
        {
          prompt: 'And the angle next to it?',
          arc: 'next',
          answer: next3,
          choices: options(rand, angle(next3), [
            angle(a3, 'Opposite ones are equal, but this one’s next door. Next-door angles add to 180°.'),
            angle(90 - a3, `90 − ${a3} is for a right angle. These two sit on a straight line: 180 − ${a3}.`),
            angle(360 - a3, `That’s a full turn minus ${a3}. Next-door angles make a straight line: 180°.`),
          ]),
          why: `180° − ${a3}° = ${next3}°. Lined up. Shoot.`,
        },
      ],
      chain: [
        { line: `\\text{Opposite} = [[a:${deg(a3)}]]` },
        { line: `\\text{Next} = [[t:${deg(180)}]] - [[a:${deg(a3)}]]`, op: 'Straight line', why: `Opposite angles are equal, so that one is ${a3}°. The next-door angle sits with it on a straight line: 180°.` },
        { line: `\\text{Next} = [[r:${deg(next3)}]]`, op: 'Work it out', merge: { r: ['t', 'a'] }, why: `180 − ${a3} = ${next3}.` },
      ],
    },
  ]
}
