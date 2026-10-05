import type { ChainStep } from '../../step-chain/StepChain'
import { options, type Option, type Rand } from '../kit/random'

/*
 * Table coordinates: 160 × 90, cushions at x = 6 and 154, y = 6 and 84.
 * Angles are in degrees, measured anticlockwise from pointing right (maths convention, y up),
 * and every one drawn is the real angle between the real lines.
 *
 * Every question is a dial: the player turns an aim line about a corner of the shot (the vertex),
 * starting on a fixed line (`base`) and opening up by the angle they set. "Take the shot" rolls a
 * ball out along it. Only the right angle sends it into the target (a pocket, a ball or a chalk spot).
 */
export type Point = [number, number]

export type Arc = { id: string; at: Point; from: number; to: number; value: number }

/** What the aim line is trying to reach. */
export type TargetKind = 'pocket' | 'ball' | 'cue' | 'spot'

export type Aim = {
  /** The corner the aim line turns about: where the ball sets off from. */
  vertex: Point
  /** The fixed line the angle is measured from. The aim line points at base + angle. */
  base: number
  target: Point
  kind: TargetKind
  /** Where the ball rolls from before it reaches the vertex (a bounce shot), if anywhere. */
  lead?: Point
}

export type ShotQuestion = {
  prompt: string
  /** The arc this question is about. */
  arc: string
  answer: number
  /** The dial: 10° steps, a jump of 30°, and where it starts (never the answer). */
  min: number
  max: number
  start: number
  aim: Aim
  why: string
  /** Why the angle they set missed, worked out from that angle. */
  nope: (value: number) => string
}

/** The one multiple-choice side question a shot has: which angle fact did the work? */
export type Side = { prompt: string; answer: string; choices: Option<string>[]; why: string }

export type Shot = {
  id: string
  title: string
  brief: string
  why: string
  /** The ball's real path, which it rolls along once every angle is found. */
  path: Point[]
  /** Dashed guide lines (a mate's shot, the edge of a triangle, a path you already know). */
  guides: [Point, Point][]
  arcs: Arc[]
  questions: ShotQuestion[]
  side: Side
  chain: ChainStep[]
}

export const POCKETS: Point[] = [[6, 6], [80, 4], [154, 6], [6, 84], [80, 86], [154, 84]]
export const STEP = 10
export const JUMP = 30

const rad = (deg: number) => deg * Math.PI / 180
/** From `p`, go `length` in direction `deg`. */
export const toward = ([x, y]: Point, deg: number, length: number): Point => [x + length * Math.cos(rad(deg)), y - length * Math.sin(rad(deg))]

const deg = (value: number) => `${value}^\\circ`

/** "too wide by 20°" / "too tight by 10°", for the generic fallback. */
const off = (value: number, answer: number) => value > answer ? `${value - answer}° too wide` : `${answer - value}° too tight`

/** The angle facts, as the side questions name them. */
export const FACTS = {
  line: 'Angles on a straight line add to 180°',
  point: 'Angles round a point add to 360°',
  opposite: 'Vertically opposite angles are equal',
  triangle: 'Angles in a triangle add to 180°',
  bounce: 'Angle in = angle out',
  alternate: 'Alternate angles are equal',
  corresponding: 'Corresponding angles are equal',
  quad: 'Angles in a quadrilateral add to 360°',
}
const fact = (key: keyof typeof FACTS, nope?: string): Option<string> => ({ value: key, label: FACTS[key], nope })

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
  const start3 = toward(cross, line + 180, 55)
  const mate = toward(cross, line + a3 + 180, 40)

  // Shot 4: from the top cushion down into the bottom middle pocket. The cushions are parallel.
  const t4 = rand.pick([60, 70, 80, 100, 110, 120]), given4 = 180 - t4
  const pocket4: Point = [80, 84]
  const cue4: Point = [80 + 78 / Math.tan(rad(t4)), 6]

  // Shot 5: a quadrilateral. Cue ball at D, off the red at C, into the bottom-right corner B. A is a chalk mark.
  const q = quad(rand), e5 = 180 - q.d, sum5 = q.a + q.b + q.d

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
          prompt: `Angles on a straight line add to 180°. Turn the cue to the missing angle and pot it.`,
          arc: 'aim',
          answer: t1, min: 0, max: 360, start: 0,
          aim: { vertex: hit1, base: 0, target: [154, 6], kind: 'pocket' },
          nope: v => {
            if (v === given1) return `${given1}° is the angle you were given. The two angles share the straight line, so yours is 180 − ${given1} = ${t1}°.`
            if (v === 360 - given1) return `That’s 360 − ${given1}: a full turn. The cushion is a straight line, half a turn, so it’s 180 − ${given1} = ${t1}°.`
            if (v === 180) return `180° is the whole straight line: you rolled it along the cushion. Take the ${given1}° off: 180 − ${given1} = ${t1}°.`
            if (v === 90) return `90° fires straight up the table. The angles on this line add to 180, so 180 − ${given1} = ${t1}°.`
            if (v === 0) return `0° just rolls along the cushion. Open the cue up to 180 − ${given1} = ${t1}°.`
            if (v > 180) return `Over 180° points the cue into the cushion behind you. Your angle sits on the straight line: 180 − ${given1} = ${t1}°.`
            return `${v}° is ${off(v, t1)}. Check the subtraction: 180 − ${given1} = ${t1}°.`
          },
          why: `180° − ${given1}° = ${t1}°. Aim at ${t1}° and it’s in.`,
        },
      ],
      side: {
        prompt: 'Big Vic wants the reason for the replay. Which fact did you use?',
        answer: 'line',
        choices: options(rand, fact('line'), [
          fact('point', 'That’s for a full turn all the way round a point. Your two angles sit on one straight line: half a turn, 180°.'),
          fact('opposite', 'Opposite angles need two lines crossing. Here there’s one straight line, the cushion, so the angles add to 180°.'),
          fact('triangle', 'There’s no triangle in this shot. Both angles sit on the cushion: a straight line, 180°.'),
        ]),
        why: 'Both angles sit on the cushion, a straight line, so they add to 180°.',
      },
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
      guides: [[start2, hit2], [start2, [154, 6]]],
      arcs: [
        { id: 'in', at: hit2, from: 180 - t2, to: 180, value: t2 },
        { id: 'out', at: hit2, from: 0, to: t2, value: t2 },
        { id: 'gap', at: hit2, from: t2, to: 180 - t2, value: gap2 },
        { id: 'start', at: start2, from: 360 - t2, to: 360, value: t2 },
        { id: 'pocket', at: [154, 6], from: 180, to: 180 + t2, value: t2 },
      ],
      questions: [
        {
          prompt: `Angle in = angle out. It hits the cushion at ${t2}°. Set the angle it bounces off at.`,
          arc: 'out',
          answer: t2, min: 0, max: 180, start: 0,
          aim: { vertex: hit2, base: 0, target: [154, 6], kind: 'pocket', lead: start2 },
          nope: v => {
            if (v === 180 - t2) return `${180 - t2}° is the straight-line partner of ${t2}°. A bounce keeps the same angle: in = out = ${t2}°.`
            if (v === 90 - t2) return `${90 - t2}° would make a right angle with ${t2}°. For a bounce, the angle out is the same as the angle in: ${t2}°.`
            if (v === 2 * t2) return `That’s ${t2} doubled. The angle out is just the same as the angle in: ${t2}°.`
            if (v === 90) return `90° sends it straight up. It came in at ${t2}°, so it leaves at ${t2}°.`
            return `${v}° is ${off(v, t2)}. Angle in = angle out, so it leaves at ${t2}°.`
          },
          why: `Angle in = angle out, so it leaves at ${t2}° too. Straight in.`,
        },
        {
          prompt: `Rewind! The three angles at the cushion make a straight line. Set the gap between the paths to run back to the cue ball.`,
          arc: 'gap',
          answer: gap2, min: 0, max: 180, start: 0,
          aim: { vertex: hit2, base: t2, target: start2, kind: 'cue' },
          nope: v => {
            if (v === 180 - t2) return `That’s 180 − ${t2}. There are two ${t2}° angles on this line, in AND out, so take both away: 180 − ${t2} − ${t2} = ${gap2}°.`
            if (v === 2 * t2) return `That’s ${t2} + ${t2}. Those two plus the gap make 180, so the gap is 180 − ${2 * t2} = ${gap2}°.`
            if (v === 180) return `180° is the whole straight line. Take off the ${t2}° in and the ${t2}° out: ${gap2}°.`
            if (v === t2) return `${t2}° is the angle in. The gap is what’s left of the line: 180 − ${t2} − ${t2} = ${gap2}°.`
            return `${v}° is ${off(v, gap2)}. Check it: 180 − ${t2} − ${t2} = ${gap2}°.`
          },
          why: `180° − ${t2}° − ${t2}° = ${gap2}°. Straight back to the cue ball.`,
        },
        {
          prompt: `The shot makes a triangle. Angles in a triangle add to 180°. Set the angle at the pocket to hit the bounce mark ✕.`,
          arc: 'pocket',
          answer: t2, min: 0, max: 180, start: 0,
          aim: { vertex: [154, 6], base: 180, target: hit2, kind: 'spot' },
          nope: v => {
            if (v === 60) return `60° is for a triangle with all its angles equal. This one isn’t: 180 − ${t2} − ${gap2} = ${t2}°.`
            if (v === 180 - t2) return `That’s 180 − ${t2}. Take the ${gap2}° gap away as well: 180 − ${t2} − ${gap2} = ${t2}°.`
            if (v === gap2) return `${gap2}° is the gap at the cushion. The pocket angle is 180 − ${t2} − ${gap2} = ${t2}°.`
            if (v === 180 - gap2) return `That’s 180 − ${gap2}. The angle at the start is ${t2}° too, so take it off: 180 − ${t2} − ${gap2} = ${t2}°.`
            if (v === 180) return `180° is all three corners put together. Take off the two you know: 180 − ${t2} − ${gap2} = ${t2}°.`
            return `${v}° is ${off(v, t2)}. The three corners make 180: 180 − ${t2} − ${gap2} = ${t2}°.`
          },
          why: `180° − ${t2}° − ${gap2}° = ${t2}°. Every angle checks out. Big Vic is sweating.`,
        },
      ],
      side: {
        prompt: 'Big Vic wants the reason. Which fact gave you the pocket angle?',
        answer: 'triangle',
        choices: options(rand, fact('triangle'), [
          fact('line', `That gave you the ${gap2}° gap at the cushion. The pocket angle came from the triangle: three corners add to 180°.`),
          fact('bounce', `That gave you the angle out at the cushion. The pocket is a corner of the triangle, so it was 180 − ${t2} − ${gap2}.`),
          fact('point', 'Round a point is a full 360° turn. The pocket is one corner of a triangle: 180°.'),
        ]),
        why: `The start, the bounce and the pocket make a triangle, so its corners add to 180°.`,
      },
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
      path: [start3, [154, 6]],
      guides: [[toward(cross, line + a3, 40), mate], [start3, cross]],
      arcs: [
        { id: 'given', at: cross, from: line, to: line + a3, value: a3 },
        { id: 'opposite', at: cross, from: line + 180, to: line + 180 + a3, value: a3 },
        { id: 'next', at: cross, from: line + a3, to: line + 180, value: next3 },
      ],
      questions: [
        {
          prompt: `Vertically opposite angles are equal. Set the angle opposite ${a3}° and clip your mate’s ball.`,
          arc: 'opposite',
          answer: a3, min: 0, max: 360, start: 0,
          aim: { vertex: cross, base: line + 180, target: mate, kind: 'ball' },
          nope: v => {
            if (v === next3) return `${next3}° is the one NEXT to ${a3}° (180 − ${a3}). The opposite one is the same size: ${a3}°.`
            if (v === 360 - a3) return `That’s 360 − ${a3}: all the way round. The opposite angle is just a mirror of the ${a3}°.`
            if (v === 90 - a3) return `${90 - a3}° would make a right angle. Opposite angles are equal: ${a3}°.`
            if (v === 180) return `180° fires straight back along your own line. The opposite angle matches the ${a3}°.`
            return `${v}° is ${off(v, a3)}. Opposite angles are equal, so it’s ${a3}°.`
          },
          why: `Opposite angles are equal: ${a3}°. Clack!`,
        },
        {
          prompt: `Now the angle next to it. Set it to run back to your cue ball, then the shot’s on.`,
          arc: 'next',
          answer: next3, min: 0, max: 360, start: 0,
          aim: { vertex: cross, base: line + a3, target: start3, kind: 'cue' },
          nope: v => {
            if (v === a3) return `Opposite ones are equal, but this one’s next door. Next-door angles add to 180°: 180 − ${a3} = ${next3}°.`
            if (v === 90 - a3) return `90 − ${a3} is for a right angle. These two sit on a straight line: 180 − ${a3} = ${next3}°.`
            if (v === 360 - a3) return `That’s a full turn minus ${a3}. Next-door angles make a straight line, 180°: 180 − ${a3} = ${next3}°.`
            if (v === 180 + a3) return `That’s 180 + ${a3}: you added. Next-door angles share 180, so take it away: 180 − ${a3} = ${next3}°.`
            if (v === 180) return `180° is the whole straight line. Take off the ${a3}° next door: ${next3}°.`
            return `${v}° is ${off(v, next3)}. Next-door angles add to 180: 180 − ${a3} = ${next3}°.`
          },
          why: `180° − ${a3}° = ${next3}°. Lined up. Big Vic can’t look.`,
        },
      ],
      side: {
        prompt: 'For the replay: which fact gave you the angle opposite?',
        answer: 'opposite',
        choices: options(rand, fact('opposite'), [
          fact('line', `That gave you the one next door, ${next3}°. The opposite one came from: vertically opposite angles are equal.`),
          fact('point', `All four angles round the cross do add to 360°, but you didn’t need that. Opposite angles are just equal.`),
          fact('triangle', 'No triangle here: just two straight lines crossing. Opposite angles are equal.'),
        ]),
        why: `Two straight lines cross, so the angles opposite each other are equal: ${a3}° and ${a3}°.`,
      },
      chain: [
        { line: `\\text{Opposite} = [[a:${deg(a3)}]]` },
        { line: `\\text{Next} = [[t:${deg(180)}]] - [[a:${deg(a3)}]]`, op: 'Straight line', why: `Opposite angles are equal, so that one is ${a3}°. The next-door angle sits with it on a straight line: 180°.` },
        { line: `\\text{Next} = [[r:${deg(next3)}]]`, op: 'Work it out', merge: { r: ['t', 'a'] }, why: `180 − ${a3} = ${next3}.` },
      ],
    },
    {
      id: 'rails',
      title: 'Shot 4 · Rail to Rail',
      brief: 'Ball on the top cushion. Drop it in the bottom middle pocket.',
      why: 'The top and bottom cushions are parallel. A path across them makes a Z, and the angles in the corners of a Z are equal: alternate angles. Use the straight line first, then the Z.',
      path: [cue4, pocket4],
      guides: [[[6, 6], [154, 6]]],
      arcs: [
        { id: 'given', at: cue4, from: 180 + t4, to: 360, value: given4 },
        { id: 'cue', at: cue4, from: 180, to: 180 + t4, value: t4 },
        { id: 'pocket', at: pocket4, from: 0, to: t4, value: t4 },
      ],
      questions: [
        {
          prompt: `The ${given4}° and your angle share the top cushion: a straight line. Set the missing angle and drop it in.`,
          arc: 'cue',
          answer: t4, min: 0, max: 180, start: 0,
          aim: { vertex: cue4, base: 180, target: pocket4, kind: 'pocket' },
          nope: v => {
            if (v === given4) return `${given4}° is the angle you were given. Yours is on the other side of the path, on the same cushion: 180 − ${given4} = ${t4}°.`
            if (v === 180) return `180° is the whole cushion: it rolls along the rail. Take the ${given4}° off: 180 − ${given4} = ${t4}°.`
            if (v === 0) return `0° just rolls along the cushion. Open it up to 180 − ${given4} = ${t4}°.`
            if (v === 90) return `90° drops straight down the table. The two angles on the cushion add to 180: 180 − ${given4} = ${t4}°.`
            return `${v}° is ${off(v, t4)}. Angles on a straight line add to 180: 180 − ${given4} = ${t4}°.`
          },
          why: `180° − ${given4}° = ${t4}°. Down the middle and in.`,
        },
        {
          prompt: `Replay check. The cushions are parallel, so the path makes a Z. Set the angle at the pocket to run back to the cue ball.`,
          arc: 'pocket',
          answer: t4, min: 0, max: 180, start: 0,
          aim: { vertex: pocket4, base: 0, target: cue4, kind: 'cue' },
          nope: v => {
            if (v === given4) return `${given4}° sits on the other side of the path. In a Z, the angles in the two corners match: alternate angles are equal, so it’s ${t4}°, same as at the top.`
            if (v === 180) return `180° is the whole bottom cushion. The angle in the Z’s corner matches the top one: ${t4}°.`
            if (v === 90) return `90° fires straight up. The path isn’t upright: alternate angles are equal, so it’s ${t4}°.`
            if (v === 0) return `0° rolls along the bottom cushion. Alternate angles are equal: open it to ${t4}°.`
            return `${v}° is ${off(v, t4)}. The two corners of the Z are equal: ${t4}°.`
          },
          why: `Alternate angles are equal: ${t4}° at the top, ${t4}° at the bottom. Big Vic is crying.`,
        },
      ],
      side: {
        prompt: 'Big Vic wants the reason. Which fact gave you the angle at the pocket?',
        answer: 'alternate',
        choices: options(rand, fact('alternate'), [
          fact('corresponding', 'Corresponding angles sit in matching corners on the SAME side of the path: an F shape. These two are on opposite sides, a Z: alternate.'),
          fact('line', `That got you the ${t4}° at the top from the ${given4}°. The pocket angle came from the parallel cushions: a Z, alternate angles.`),
          fact('opposite', 'Opposite angles are at one crossing. These two are at different cushions, in the corners of a Z: alternate angles.'),
        ]),
        why: 'The cushions are parallel and the path cuts across both in a Z, so the angles in its corners are equal.',
      },
      chain: [
        { line: `\\text{?} + [[k:${deg(given4)}]] = [[t:${deg(180)}]]` },
        { line: `\\text{?} = [[t:${deg(180)}]] [[m:- ${deg(given4)}]]`, op: `− ${given4}° both sides`, why: `The two angles at the cue ball sit on the top cushion, a straight line, so they add to 180°.` },
        { line: `\\text{Top} = [[r:${deg(t4)}]]`, op: 'Work it out', merge: { r: ['t', 'm'] }, why: `180 − ${given4} = ${t4}.` },
        { line: `\\text{Pocket} = [[r:${deg(t4)}]]`, op: 'Alternate', why: 'The cushions are parallel. The path cuts across both in a Z, and alternate angles are equal.' },
      ],
    },
    {
      id: 'quad',
      title: 'Shot 5 · The Final Frame',
      brief: 'Off the red and into the corner. Four corners, one shot.',
      why: 'The chalk lines make a shape with four corners: a quadrilateral. Its angles add to 360°. First use the straight line to turn the outside angle into the inside one. Then take the three you know off 360°.',
      path: [q.D, q.C, q.B],
      guides: [[q.A, q.B], [q.B, q.C], [q.C, q.D], [q.D, q.A], [q.D, toward(q.D, q.cd, Math.min(22, Math.hypot(...toCushion(q.D, q.cd).map((v, i) => v - q.D[i]) as Point)))]],
      arcs: [
        { id: 'a', at: q.A, from: 0, to: q.a, value: q.a },
        { id: 'b', at: q.B, from: 180 - q.b, to: 180, value: q.b },
        { id: 'outside', at: q.D, from: q.cd, to: q.da, value: 180 - q.d },
        { id: 'inside', at: q.D, from: q.da, to: q.da + q.d, value: q.d },
        { id: 'red', at: q.C, from: q.cd, to: q.cd + q.c, value: q.c },
      ],
      questions: [
        {
          prompt: `The ${e5}° outside angle and the inside one share a straight line. Set the inside angle and hit the red.`,
          arc: 'inside',
          answer: q.d, min: 0, max: 180, start: 0,
          aim: { vertex: q.D, base: q.da, target: q.C, kind: 'ball' },
          nope: v => {
            if (v === e5) return `${e5}° is the outside angle. The inside one shares the straight line with it: 180 − ${e5} = ${q.d}°.`
            if (v === 180) return `180° is the whole straight line. Take the ${e5}° outside angle off: ${q.d}°.`
            if (v === 90) return `It’s not a right angle. Inside + outside = 180, so 180 − ${e5} = ${q.d}°.`
            if (v === 0) return `0° runs along the chalk line. Open it to 180 − ${e5} = ${q.d}°.`
            return `${v}° is ${off(v, q.d)}. Inside + outside make a straight line: 180 − ${e5} = ${q.d}°.`
          },
          why: `180° − ${e5}° = ${q.d}°. Clack! Now it’s off the red.`,
        },
        {
          prompt: `Four corners add to 360°. You know ${q.a}°, ${q.b}° and ${q.d}°. Set the angle at the red for the corner pocket.`,
          arc: 'red',
          answer: q.c, min: 0, max: 180, start: 0,
          aim: { vertex: q.C, base: q.cd, target: q.B, kind: 'pocket' },
          nope: v => {
            const outside = 360 - q.a - q.b - e5
            if (v === outside) return `You used the ${e5}° outside angle. Inside the shape that corner is ${q.d}°: 360 − ${q.a} − ${q.b} − ${q.d} = ${q.c}°.`
            if (v === 360 - q.a - q.b) return `That’s 360 − ${q.a} − ${q.b}: you left out the ${q.d}° at the cue ball. All three come off: ${q.c}°.`
            if (v === 360 - q.a - q.d) return `That’s 360 − ${q.a} − ${q.d}: you left out the ${q.b}° at the pocket. All three come off: ${q.c}°.`
            if (v === 360 - q.b - q.d) return `That’s 360 − ${q.b} − ${q.d}: you left out the ${q.a}° at the chalk mark. All three come off: ${q.c}°.`
            if (v === 180) return `180 is for a triangle. This shape has four corners, so they add to 360: 360 − ${sum5} = ${q.c}°.`
            return `${v}° is ${off(v, q.c)}. Four corners make 360: ${q.a} + ${q.b} + ${q.d} = ${sum5}, and 360 − ${sum5} = ${q.c}°.`
          },
          why: `360° − ${sum5}° = ${q.c}°. In off the red. Big Vic has fainted.`,
        },
      ],
      side: {
        prompt: 'Last replay. Which fact gave you the angle at the red?',
        answer: 'quad',
        choices: options(rand, fact('quad'), [
          fact('triangle', 'A triangle has three corners. This shape has four, so its angles add to 360°, not 180°.'),
          fact('line', `That turned the ${e5}° outside angle into ${q.d}° inside. The red’s angle came from the four corners adding to 360°.`),
          fact('point', 'Round a point is 360° too, but these angles aren’t round one point. They’re the four corners of a shape.'),
        ]),
        why: `Four corners of a quadrilateral add to 360°: ${q.a} + ${q.b} + ${q.d} + ${q.c} = 360.`,
      },
      chain: [
        { line: `\\text{Cue} = [[t:${deg(180)}]] - [[e:${deg(e5)}]]` },
        { line: `\\text{Cue} = [[d:${deg(q.d)}]]`, op: 'Straight line', merge: { d: ['t', 'e'] }, why: `Inside and outside angles sit on a straight line: 180 − ${e5} = ${q.d}.` },
        { line: `\\text{Red} = [[f:${deg(360)}]] - [[s:${deg(sum5)}]]`, op: 'Quadrilateral', why: `Four corners add to 360°. The three you know: ${q.a} + ${q.b} + ${q.d} = ${sum5}.` },
        { line: `\\text{Red} = [[c:${deg(q.c)}]]`, op: 'Work it out', merge: { c: ['f', 's'] }, why: `360 − ${sum5} = ${q.c}.` },
      ],
    },
  ]
}

/** Shot 5's shape: A (chalk mark on the bottom cushion), B (bottom-right pocket), C (the red), D (the cue ball). */
export type Quad = { a: number; b: number; c: number; d: number; A: Point; B: Point; C: Point; D: Point; cd: number; da: number }

/** Where the lines from `p` (direction `u`) and `q` (direction `v`) meet, and how far along each. */
function meet(p: Point, u: number, q: Point, v: number): { at: Point; s: number; t: number } | null {
  const [ux, uy] = [Math.cos(rad(u)), -Math.sin(rad(u))], [vx, vy] = [Math.cos(rad(v)), -Math.sin(rad(v))]
  const det = ux * -vy - uy * -vx
  if (Math.abs(det) < 1e-9) return null
  const [dx, dy] = [q[0] - p[0], q[1] - p[1]]
  const s = (dx * -vy - dy * -vx) / det, t = (ux * dy - uy * dx) / det
  return { at: [p[0] + s * ux, p[1] + s * uy], s, t }
}

/** Answer first: the four corners (add to 360), then draw the shape from them and keep it if it fits the table. */
export function quad(rand: Rand): Quad {
  for (let tries = 0; tries < 400; tries++) {
    const d = rand.pick([70, 80, 100, 110]), c = rand.int(70, 120, 10), b = rand.int(70, 110, 10)
    const a = 360 - b - c - d
    if (a < 60 || a > 120) continue
    const A: Point = [rand.int(20, 45, 5), 84], B: Point = [154, 84]
    const C = toward(B, 180 - b, rand.int(45, 65, 5))
    const cd = 360 - b - c, da = cd + 180 - d
    const hit = meet(A, a, C, cd)
    if (!hit || hit.s < 30 || hit.t < 30) continue
    const D = hit.at
    const inside = ([x, y]: Point) => x >= 16 && x <= 144 && y >= 14 && y <= 76
    if (!inside(C) || !inside(D)) continue
    // The angle labels sit 19 out along the middle of each arc: keep them on the felt.
    const labels = [toward(D, cd + (180 - d) / 2, 19), toward(D, da + d / 2, 19), toward(C, cd + c / 2, 19)]
    if (labels.some(([x, y]) => x < 9 || x > 151 || y < 9 || y > 81)) continue
    // Keep the cue ball and the red clear of the pockets.
    if ([C, D].some(p => POCKETS.some(k => Math.hypot(p[0] - k[0], p[1] - k[1]) < 18))) continue
    return { a, b, c, d, A, B, C, D, cd, da }
  }
  // A shape that always fits, in case the dice are unkind.
  const A: Point = [45, 84], B: Point = [154, 84]
  const C = toward(B, 100, 55), cd = 180, D = meet(A, 100, C, cd)!.at
  return { a: 100, b: 80, c: 100, d: 80, A, B, C, D, cd, da: cd + 100 }
}

/** Where a ball rolling from `from` in direction `deg` meets a cushion. */
export function toCushion(from: Point, deg: number): Point {
  const dx = Math.cos(rad(deg)), dy = -Math.sin(rad(deg))
  let best = Infinity
  // Only hits that land on the felt's edge count: a cue pointing into the cushion it sits on goes nowhere.
  const inside = (t: number) => {
    const x = from[0] + t * dx, y = from[1] + t * dy
    return x >= 6 - 1e-6 && x <= 154 + 1e-6 && y >= 6 - 1e-6 && y <= 84 + 1e-6
  }
  const consider = (t: number) => { if (t > 1e-6 && t < best && inside(t)) best = t }
  if (dx > 1e-9) consider((154 - from[0]) / dx)
  if (dx < -1e-9) consider((6 - from[0]) / dx)
  if (dy > 1e-9) consider((84 - from[1]) / dy)
  if (dy < -1e-9) consider((6 - from[1]) / dy)
  return Number.isFinite(best) ? [from[0] + best * dx, from[1] + best * dy] : from
}

/** Does the aim line, set to `value`, point straight at the target? */
export function onTarget(aim: Aim, value: number) {
  const want = Math.atan2(-(aim.target[1] - aim.vertex[1]), aim.target[0] - aim.vertex[0]) * 180 / Math.PI
  const diff = ((aim.base + value - want) % 360 + 540) % 360 - 180
  return Math.abs(diff) < 0.5
}
