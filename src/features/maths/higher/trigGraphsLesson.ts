/*
 * Graphs lesson 6H3, Sin, cos and tan graphs (Higher only). From the Higher revision guide, GR11 (pages 130-131, Level
 * 6-7): the graphs are periodic, they repeat the same pattern over and over.
 * - y = sin x from 0° to 360°: peak 1 at 90°, lowest −1 at 270°, crossing the axis at 0°, 180° and 360°; it repeats every
 *   360°. y = cos x: peak 1 at 0° and 360°, lowest −1 at 180°, crossing at 90° and 270°; it repeats every 360°.
 * - y = tan x between −90° and 90°: crosses at the origin, gets big near 90° and small near −90°; the dotted lines at
 *   ±90° are asymptotes it never touches. It repeats every 180°, and so do the asymptotes.
 * - Your Turn: Q1 sin x and cos x on the same axes, −180° to 180°; Q2 tan x from −360° to 360°; Q3 y = −cos x from 0° to
 *   360°; Q4 sin x and 2 sin x between −180° and 180°.
 * Each "plot" is a worked example that builds the graph from its key points, then questions ask for those key values
 * (typed, chosen, or tapped on the board). Axes count in degrees: one square is 45° (90° for tan from −360° to 360°),
 * so every grid stays 11 squares wide; asymptotes are dashed lines.
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import type { AxisScale, GraphFrame, GraphPoint } from '../../written-methods/tutor/methodWorking'
import type { CurveFn } from '../../written-methods/tutor/curves'
import { line, part, sign, type StepWorking } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, mark, pt, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { at } from '../../curve-graphs/tutor/curveWorkings'
import { choose, number, screens, text } from './helpers'

const a = author(106.7, 'L106H3')
const { add, finish } = a
const { practice, graph } = screens(a)

const sinCos = 'trig-graphs-sin-cos'
const tan = 'trig-graphs-tan'

const show = (n: number) => String(n).replace('-', '−')
const pair = (p: GraphPoint) => `(${show(p.x)}, ${show(p.y)})`
const signed = (n: number, shown: string): InteractionDefinition => ({ ...number(n, shown), signed: true })

/* ---------- Degree axes ---------- */

/** x in degrees, one square 45° (numbered every 90°) or 90° (numbered every 180°). */
const degrees = (per: 45 | 90): AxisScale => ({ per, every: 2, start: 0, unit: '°', name: 'x' })
/** y for sin and cos: one square 0.25, numbered every 0.5, so a wave is 8 squares from top to bottom. */
const quarter: AxisScale = { per: 0.25, every: 2, start: 0, name: 'y' }
const half: AxisScale = { per: 0.5, start: 0, name: 'y' }
const whole: AxisScale = { per: 1, start: 0, name: 'y' }
type Extra = Partial<GraphGrid>
/** 0° to 360°: one square of room before 0°, 11 squares across. */
const turn = (extra: Extra = {}): GraphGrid => ({ x: [-45, 450], y: [-1.25, 1.5], scale: { x: degrees(45), y: quarter }, lines: [], points: [], ...extra })
/** −180° to 180°. */
const halfTurns = (extra: Extra = {}, y: [number, number] = [-1.25, 1.5], ys = quarter): GraphGrid => ({ x: [-225, 270], y, scale: { x: degrees(45), y: ys }, lines: [], points: [], ...extra })
/** tan: y from −5 to 6, one a square. */
const tanNear = (extra: Extra = {}): GraphGrid => ({ x: [-225, 270], y: [-5, 6], scale: { x: degrees(45), y: whole }, lines: [], points: [], ...extra })
const tanWide = (extra: Extra = {}): GraphGrid => ({ x: [-450, 540], y: [-5, 6], scale: { x: degrees(90), y: whole }, lines: [], points: [], ...extra })

/* ---------- Drawing ---------- */

type Curve = NonNullable<GraphFrame['curves']>[number]
type Shape = Omit<Curve, 'at'>
const wave = (fn: CurveFn, from: number, to: number, label?: string): Shape => ({ coeffs: [], fn, from, to, label })
const given = (shape: Shape): Curve => ({ ...shape, at: -1 })
/** A dashed asymptote up and down at x degrees. */
const asymptote = (x: number, at: number, label?: string) => ({ from: pt(x, 0), to: pt(x, 1), label, dashed: true, at })

/** Moves: key points put on the grid, their axis numbers marked. `named` writes each one's coordinates. */
const dots = (points: GraphPoint[], title: string, say: string, named = true): GraphMove => ({
  title, say, equation: latex(points.map(pair).join(', ')), adds: 'picture',
  change: (frame, step) => ({
    ...frame, boxed: points,
    marks: [...new Set(points.map(p => p.x))].filter(x => x !== 0).map(x => mark('x', x)),
    points: [...(frame.points ?? []), ...points.map(p => ({ ...p, at: step, label: named ? pair(p) : '' }))],
  }),
})
/** Moves: dashed asymptotes. */
const walls = (xs: number[], title: string, say: string, named = true): GraphMove => ({
  title, say, equation: latex(xs.map(x => `x = ${show(x)}`).join(',\\ ')), adds: 'picture',
  change: (frame, step) => ({ ...frame, marks: xs.map(x => mark('x', x)), lines: [...(frame.lines ?? []), ...xs.map(x => asymptote(x, step, named ? `x = ${show(x)}°` : undefined))] }),
})
/** Moves: the curve drawn smoothly through the points; as the last move, green with the answer. */
const join = (shape: Shape, title: string, say: string, equation: string, answer?: string): GraphMove => {
  const move: GraphMove = {
    title, say, equation: latex(equation), adds: 'picture',
    change: (frame, step) => ({ ...frame, curves: [...(frame.curves ?? []), { ...shape, at: step, answer: !!answer }] }),
  }
  return answer ? answerMove(answer, title, say, [], move) : move
}

/** A question answered by tapping a point on the board. */
function tap(topic: MicroSkillId, title: string, sourceRef: string, board: GraphGrid, answer: GraphPoint, hint: string, model: StepWorking) {
  const state = practice(topic, title, sourceRef, at(answer), pair(answer), hint, model)
  state.board = { mode: 'plot', grid: board }
  return state
}

const sinPoints = [pt(0, 0), pt(90, 1), pt(180, 0), pt(270, -1), pt(360, 0)]
const cosPoints = [pt(0, 1), pt(90, 0), pt(180, -1), pt(270, 0), pt(360, 1)]

/* ---------- Section 1: sin and cos ---------- */

add(sinCos, 'Sin and cos graphs', 'Higher GR11 Sin, Cos and Tan Graphs', text(
  'The graphs of y = sin x and y = cos x are waves. They are periodic: after 360° they repeat the same shape over and over.',
  'y = sin x starts at 0, peaks at 1 at 90°, is back to 0 at 180°, is lowest at −1 at 270°, and is back to 0 at 360°.',
  'y = cos x is the same wave starting at its peak: 1 at 0°, 0 at 90°, −1 at 180°, 0 at 270° and 1 again at 360°.',
  'Neither goes above 1 or below −1. Learn the five key points of each, and draw a smooth wave through them.',
))

graph(sinCos, 'Draw the graph of y = sin x from 0° to 360°.', 'Higher GR11 Sine Graphs', 'y = sin x', turn(), [
  dots([pt(0, 0), pt(180, 0), pt(360, 0)], 'Where it crosses', 'sin x is 0 at 0°, 180° and 360°, so the wave crosses the x axis there.'),
  dots([pt(90, 1), pt(270, -1)], 'Peak and lowest point', 'The peak is 1, at 90°. The lowest point is −1, at 270°.'),
  join(wave({ kind: 'sin' }, 0, 360), 'Join with a wave', 'Join the five points with one smooth wave: up to the peak, down through 180° to the lowest point, and back up. Rounded at the top and bottom, not pointed.', 'y = sin x', 'a wave through (0, 0), (90, 1), (180, 0), (270, −1), (360, 0)'),
], 'Draw it', 'Draw y = sin x', 'Plot the five key points, then join them with a smooth wave.')

practice(sinCos, 'What is sin 90°?', 'Higher GR11 extra practice', number(1, '1'), '1', 'Where is the peak of the sine wave?', {
  kind: 'step-worked', start: 'sin 90°', steps: [
    { title: 'Read the peak', why: 'The sine wave reaches its peak at 90°, and the peak is one.', lines: [line([part('sin 90°', 0)], '1', { eq: true, answer: true })] },
  ],
})
tap(sinCos, 'y = sin x is drawn. Tap its lowest point between 0° and 360°.', 'Higher GR11 extra practice', turn({ curves: [given(wave({ kind: 'sin' }, 0, 360, 'y = sin x'))] }), pt(270, -1),
  'The wave is lowest three quarters of the way along.', {
    kind: 'step-worked', start: 'y = sin x', steps: [
      { title: 'The lowest value', why: 'Sine never goes below minus one.', lines: [line([part('lowest y', 0)], '−1')] },
      { title: 'Where it happens', why: 'Sine is lowest at 270°, halfway between 180° and 360°.', lines: [line([part('sin 270°')], '(270, −1)', { answer: true })] },
    ],
  })

graph(sinCos, 'Draw the graph of y = cos x from 0° to 360°.', 'Higher GR11 Cosine Graphs', 'y = cos x', turn(), [
  dots([pt(0, 1), pt(360, 1)], 'The peaks', 'cos x starts at its peak: 1 at 0°, and 1 again at 360°.'),
  dots([pt(90, 0), pt(270, 0), pt(180, -1)], 'Crossings and lowest', 'It crosses the x axis at 90° and 270°, and is lowest, −1, at 180°.'),
  join(wave({ kind: 'cos' }, 0, 360), 'Join with a wave', 'Join them with one smooth wave: down from the peak, through 90° to the lowest point, and back up to the peak at 360°.', 'y = cos x', 'a wave through (0, 1), (90, 0), (180, −1), (270, 0), (360, 1)'),
], 'Draw it', 'Draw y = cos x', 'The same wave as sin x, but starting at its peak.')

practice(sinCos, 'What is cos 180°?', 'Higher GR11 extra practice', signed(-1, '−1'), '−1', 'Where is the lowest point of the cosine wave?', {
  kind: 'step-worked', start: 'cos 180°', steps: [
    { title: 'Read the lowest', why: 'The cosine wave is lowest halfway along, at 180°, and the lowest value is minus one.', lines: [line([part('cos 180°', 0)], '−1', { eq: true, answer: true })] },
  ],
})
practice(sinCos, 'Where does y = cos x cross the x axis between 0° and 360°?', 'Higher GR11 extra practice',
  choose(['90° and 270°', '0°, 180° and 360°', '180° only', '45° and 225°']), '90° and 270°', 'cos x starts at its peak, not at 0.', {
    kind: 'step-worked', start: 'y = cos x', steps: [
      { title: 'Start at the peak', why: 'Cosine is one at 0°, so it doesn’t cross there. It is lowest at 180°.', lines: [line([part('cos 0°', 0)], '1', { eq: true }), line([part('cos 180°', 0)], '−1', { eq: true })] },
      { title: 'Halfway between', why: 'It crosses the axis halfway between each peak and lowest point.', words: '90° and 270°' },
    ],
  })
practice(sinCos, 'After how many degrees does the graph of y = sin x start to repeat itself?', 'Higher GR11 extra practice', number(360, '360°'), '360°', 'One whole wave: up, down and back to the start.', {
  kind: 'step-worked', start: 'y = sin x', steps: [
    { title: 'One whole wave', why: 'From 0° the wave goes up to its peak, down to its lowest point and back to zero at 360°. Then it does it all again.', lines: [line([part('one period', 0)], '360°', { eq: true, answer: true })] },
  ],
}, 'degrees')

graph(sinCos, 'On the same axes, plot y = sin x and y = cos x between −180° and 180°.', 'Higher GR11 Your Turn Q1', 'y = sin x,\\ y = cos x', halfTurns(), [
  dots([pt(-180, 0), pt(-90, -1), pt(0, 0), pt(90, 1), pt(180, 0)], 'Points for sin x', 'The pattern repeats before 0°: sin x is 0 at −180°, −1 at −90°, 0 at 0°, 1 at 90° and 0 at 180°.', false),
  join(wave({ kind: 'sin' }, -180, 180, 'sin x'), 'Draw sin x', 'Join them with a smooth wave, rounded at the top and bottom.', 'y = sin x'),
  dots([pt(-180, -1), pt(-90, 0), pt(0, 1), pt(90, 0), pt(180, -1)], 'Points for cos x', 'cos x is −1 at −180°, 0 at −90°, 1 at 0°, 0 at 90° and −1 at 180°.', false),
  join(wave({ kind: 'cos' }, -180, 180, 'cos x'), 'Draw cos x', 'Join them with a second smooth wave and label both. cos x is the sin x wave moved 90° to the left.', 'y = cos x', 'two waves, labelled sin x and cos x'),
], 'Plot them', 'Plot sin x and cos x', 'Plot each graph’s key points, using the repeat for the negative angles, then draw both waves.')

practice(sinCos, 'Between −180° and 180°, at which two values of x do the graphs of y = sin x and y = cos x cross?', 'Higher GR11 Your Turn Q1',
  { type: 'numericInput', responseShape: 'roots', acceptanceRule: 'unorderedSet', correctAnswer: '45, -135', displayAnswer: 'x = 45° or x = −135°' }, 'x = 45° or x = −135°',
  'One is halfway between 0° and 90°. The waves repeat, so look half a turn back too.', {
    kind: 'step-worked', start: 'sin x and cos x', steps: [
      { title: 'Halfway between', why: 'Sine climbs from zero to one while cosine falls from one to zero, so they meet halfway, at 45°.', lines: [line([part('sin 45°', 0)], 'cos 45°', { eq: true })] },
      { title: 'Half a turn back', why: 'Half a turn earlier both are negative and equal again.', lines: [line([part('45'), sign('−'), part('180')], '−135'), line([part('sin x and cos x')], 'x = 45° or x = −135°', { answer: true })] },
    ],
  })

graph(sinCos, 'Plot the function y = −cos x between 0° and 360°.', 'Higher GR11 Your Turn Q3', 'y = −cos x', turn({ curves: [given(wave({ kind: 'cos' }, 0, 360, 'y = cos x'))] }), [
  dots([pt(0, -1), pt(180, 1), pt(360, -1)], 'Flip the peaks', 'The minus changes the sign of every y. cos x is 1 at 0° and 360°, so −cos x is −1 there. cos x is −1 at 180°, so −cos x is 1.'),
  dots([pt(90, 0), pt(270, 0)], 'Crossings stay', 'Where cos x is 0, at 90° and 270°, −cos x is 0 too.'),
  join(wave({ kind: 'cos', a: -1 }, 0, 360), 'Join with a wave', 'Join them with a smooth wave. It is the cos x wave upside down: reflected in the x axis.', 'y = −cos x', 'the cos x wave upside down: lowest at 0° and 360°, peak at 180°'),
], 'Plot it', 'Plot y = −cos x', 'Change the sign of each of cos x’s key points, then join them with a wave.')

tap(sinCos, 'y = cos x is drawn. Tap the highest point of y = −cos x between 0° and 360°.', 'Higher GR11 Your Turn Q3', turn({ curves: [given(wave({ kind: 'cos' }, 0, 360, 'y = cos x'))] }), pt(180, 1),
  'The minus turns the wave upside down, so the lowest point becomes the highest.', {
    kind: 'step-worked', start: 'y = −cos x', steps: [
      { title: 'Lowest of cos x', why: 'Cosine is lowest at 180°, where it is minus one.', lines: [line([part('cos 180°', 0)], '−1', { eq: true })] },
      { title: 'Change the sign', why: 'The minus in front changes the sign of every y, so the lowest point becomes the highest.', lines: [line([part('−(−1)')], '1'), line([part('−cos 180°')], '(180, 1)', { answer: true })] },
    ],
  })

graph(sinCos, 'Plot y = sin x and y = 2 sin x between −180° and 180°.', 'Higher GR11 Your Turn Q4', 'y = sin x,\\ y = 2 sin x', halfTurns({}, [-2.5, 3], half), [
  dots([pt(-180, 0), pt(-90, -1), pt(0, 0), pt(90, 1), pt(180, 0)], 'Points for sin x', 'sin x is 0 at −180°, −1 at −90°, 0 at 0°, 1 at 90° and 0 at 180°.', false),
  join(wave({ kind: 'sin' }, -180, 180, 'sin x'), 'Draw sin x', 'Join them with a smooth wave.', 'y = sin x'),
  dots([pt(-90, -2), pt(90, 2)], 'Double every y', '2 sin x is twice sin x. The peak 1 becomes 2 and the lowest −1 becomes −2. Twice 0 is still 0, so the crossings stay.', false),
  join(wave({ kind: 'sin', a: 2 }, -180, 180, '2 sin x'), 'Draw 2 sin x', 'Join them with a taller wave through the same crossings, and label both.', 'y = 2 sin x', '2 sin x is twice as tall: peak 2 at 90°, lowest −2 at −90°'),
], 'Plot them', 'Plot sin x and 2 sin x', 'Multiplying by 2 doubles every y: the wave is twice as tall, but crosses the axis in the same places.')

practice(sinCos, 'What is the highest value of y = 2 sin x?', 'Higher GR11 Your Turn Q4', number(2, '2'), '2', 'The highest value of sin x is 1.', {
  kind: 'step-worked', start: 'y = 2 sin x', steps: [
    { title: 'Highest of sin x', why: 'Sine never goes above one.', lines: [line([part('sin 90°', 0)], '1', { eq: true })] },
    { title: 'Double it', why: 'Every y is doubled, so the peak is doubled too.', lines: [line([part('2'), sign('×'), part('1')], '2', { answer: true })] },
  ],
})
practice(sinCos, 'What is 2 sin 270°?', 'Higher GR11 extra practice', signed(-2, '−2'), '−2', 'Find sin 270° first.', {
  kind: 'step-worked', start: '2 sin 270°', steps: [
    { title: 'Find sin 270°', why: 'Sine is lowest at 270°, where it is minus one.', lines: [line([part('sin 270°', 0)], '−1', { eq: true })] },
    { title: 'Double it', why: 'Twice minus one.', lines: [line([part('2'), sign('×'), part('(−1)')], '−2', { answer: true })] },
  ],
})

/* ---------- Section 2: tan ---------- */

add(tan, 'The tan graph', 'Higher GR11 Tangent Graphs', text(
  'y = tan x looks very different. Between −90° and 90° it crosses the axes once, at the origin.',
  'It gets bigger and bigger as x gets near 90°, and smaller and smaller (more and more negative) near −90°.',
  'The dashed lines at x = 90° and x = −90° are asymptotes: the graph gets closer and closer but never touches them.',
  'tan x repeats every 180°, not every 360°, and so do its asymptotes.',
))

graph(tan, 'Draw the graph of y = tan x between −90° and 90°.', 'Higher GR11 Tangent Graphs', 'y = tan x', tanNear(), [
  walls([-90, 90], 'Draw the asymptotes', 'tan 90° and tan −90° don’t exist. Draw dashed lines at x = −90° and x = 90°: the graph never touches them.'),
  dots([pt(-45, -1), pt(0, 0), pt(45, 1)], 'Key points', 'tan 0° = 0, so it goes through the origin. tan 45° = 1 and tan −45° = −1.'),
  join(wave({ kind: 'tan' }, -90, 90), 'Join the curve', 'Draw one smooth curve through the points, rising steeply towards the dashed line at 90° and falling steeply towards −90°, never touching them.', 'y = tan x', 'through (−45, −1), (0, 0), (45, 1), between the asymptotes x = ±90°'),
], 'Draw it', 'Draw y = tan x', 'Draw the asymptotes first, then the key points, then the curve between them.')

practice(tan, 'What is tan 45°?', 'Higher GR11 extra practice', number(1, '1'), '1', 'Halfway between 0° and the asymptote.', {
  kind: 'step-worked', start: 'tan 45°', steps: [
    { title: 'Read the graph', why: 'The tan graph goes through the origin and reaches one at 45°, halfway to the asymptote.', lines: [line([part('tan 45°', 0)], '1', { eq: true, answer: true })] },
  ],
})
practice(tan, 'After how many degrees does the graph of y = tan x start to repeat itself?', 'Higher GR11 extra practice', number(180, '180°'), '180°', 'Not the same as sin and cos.', {
  kind: 'step-worked', start: 'y = tan x', steps: [
    { title: 'One piece', why: 'One piece of the tan graph runs from one asymptote to the next, from −90° to 90°. Then the same piece repeats.', lines: [line([part('90'), sign('−'), part('(−90)')], '180'), line([part('one period', 0)], '180°', { eq: true, answer: true })] },
  ],
}, 'degrees')
practice(tan, 'Where does y = tan x cross the x axis between 0° and 360°?', 'Higher GR11 extra practice',
  choose(['0°, 180° and 360°', '90° and 270°', '0° and 360° only', '180° only']), '0°, 180° and 360°', 'It crosses at the origin, then repeats every 180°.', {
    kind: 'step-worked', start: 'y = tan x', steps: [
      { title: 'At the origin', why: 'Tan of zero is zero, so it crosses at 0°.', lines: [line([part('tan 0°', 0)], '0', { eq: true })] },
      { title: 'Every 180°', why: 'The graph repeats every 180°, so it crosses again at 180° and 360°. At 90° and 270° are the asymptotes.', words: '0°, 180° and 360°' },
    ],
  })
practice(tan, 'Use the repeat of the tan graph to find tan 225°.', 'Higher GR11 extra practice', number(1, '1'), '1', 'tan x repeats every 180°.', {
  kind: 'step-worked', start: 'tan 225°', steps: [
    { title: 'Take off 180°', why: 'The graph repeats every 180°, so take that off to land on an angle you know.', lines: [line([part('225'), sign('−'), part('180')], '45')] },
    { title: 'Read tan 45°', why: 'Tan of forty-five degrees is one.', lines: [line([part('tan 225°', 0)], '1', { eq: true, answer: true })] },
  ],
})

graph(tan, 'Plot the function y = tan x from −360° to 360°.', 'Higher GR11 Your Turn Q2', 'y = tan x', tanWide(), [
  walls([-270, -90, 90, 270], 'The asymptotes', 'The asymptotes repeat every 180° too: dashed lines at −270°, −90°, 90° and 270°.', false),
  dots([pt(-360, 0), pt(-180, 0), pt(0, 0), pt(180, 0), pt(360, 0)], 'The crossings', 'tan x is 0 at 0°, and every 180° either side: −360°, −180°, 180° and 360°.', false),
  join(wave({ kind: 'tan' }, -360, 360), 'Repeat the piece', 'Between each pair of asymptotes, draw the same piece: rising through the crossing, steep near each dashed line, never touching it. The ends either side are half pieces.', 'y = tan x', 'the same piece every 180°, asymptotes at −270°, −90°, 90°, 270°'),
], 'Plot it', 'Plot y = tan x', 'Draw the asymptotes and the crossings, then repeat the tan piece between each pair of dashed lines.')

practice(tan, 'Between −360° and 360°, where are the asymptotes of y = tan x?', 'Higher GR11 Your Turn Q2',
  choose(['x = −270°, −90°, 90° and 270°', 'x = −360°, −180°, 0°, 180° and 360°', 'x = −180° and 180°', 'x = 90° and 270° only']), 'x = −270°, −90°, 90° and 270°', 'Start from the ones at ±90°, then repeat every 180°.', {
    kind: 'step-worked', start: 'y = tan x', steps: [
      { title: 'The first two', why: 'Near the origin the asymptotes are at plus and minus 90°.', lines: [line([part('x', 0)], '−90°, 90°', { eq: true })] },
      { title: 'Every 180°', why: 'They repeat every 180°: add and take away to stay between minus 360° and 360°.', lines: [
        line([part('90'), sign('+'), part('180')], '270'), line([part('−90'), sign('−'), part('180')], '−270'),
        line([part('asymptotes')], 'x = −270°, −90°, 90° and 270°', { answer: true }),
      ] },
    ],
  })
practice(tan, 'Which of these graphs repeats every 180°?', 'Higher GR11 extra practice',
  choose(['y = tan x', 'y = sin x', 'y = cos x', 'y = −cos x']), 'y = tan x', 'Two of them are waves that take a whole turn.', {
    kind: 'step-worked', start: 'periods', steps: [
      { title: 'The waves', why: 'Sine and cosine, and so minus cosine, each take a whole turn before they repeat.', lines: [line([part('sin x, cos x', 0)], '360°')] },
      { title: 'The tan graph', why: 'Tan repeats from one asymptote to the next.', lines: [line([part('180°')], 'y = tan x', { answer: true })] },
    ],
  })

add('mixed', 'Sin, cos and tan graphs', 'Higher GR11 consolidation', text(
  'y = sin x: 0 at 0°, peak 1 at 90°, 0 at 180°, lowest −1 at 270°, 0 at 360°. It repeats every 360°.',
  'y = cos x: peak 1 at 0°, 0 at 90°, lowest −1 at 180°, 0 at 270°, peak 1 at 360°. It repeats every 360°.',
  'y = tan x: through the origin, never touching its asymptotes at 90°, 270°… It repeats every 180°.',
  'A minus in front turns a graph upside down, and a 2 in front doubles every y.',
))

export const tutorTrigGraphsLesson: TutorMethodLesson = {
  id: 'L106H3', number: 106.7, title: 'Sin, cos and tan graphs', level: 'GCSE Higher', graphCard: true,
  goal: 'Draw the graphs of y = sin x, y = cos x and y = tan x, and read their key values, periods and asymptotes.',
  labels: { [sinCos]: 'Sin and cos', [tan]: 'Tan', mixed: 'Review' },
  states: finish(),
}
