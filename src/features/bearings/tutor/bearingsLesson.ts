import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { fig, screens, slips } from '../../geometry/tutor/figureLesson'

/*
 * Geometry lesson 18: Bearings. From GM18 in Sunny's revision book (p154–155), with our own numbers except where a
 * question is the book's. The book's three rules run through every screen: measure from North, clockwise, and write
 * three figures. Four rungs: reading a bearing (060°, not 60°); bearings past 180°, where the angle marked goes the
 * other way round and is taken from 360 (Example 2); the bearing back, 180° different, from parallel North lines
 * (Example 3, Your Turn Q2 and Q5); and scale drawings, centimetres to miles or kilometres (Your Turn Q1). Built like
 * lessons 1 to 17: the first rung opens on the measuring board, where you drag B round A and read its bearing.
 *
 * Hidden on live like lessons 1 to 17: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 */

const lesson = author(218)
const { add, finish } = lesson
const { explore, worked, practice } = screens(lesson)
const reading = 'geometry-bearing-read'
const reflex = 'geometry-bearing-reflex'
const backBearing = 'geometry-bearing-back'
const scale = 'geometry-bearing-scale'

const B_BOX = { label: 'Bearing (°)', prefix: 'Bearing =' }
/** A bearing as three figures: 60 is 060. */
const threeFigure = (deg: number) => String(Math.round(((deg % 360) + 360) % 360)).padStart(3, '0')

/* ---------- Pictures ---------- */

const dir = (bearing: number, r = 1, from: FigurePoint = [0, 0]): FigurePoint => [from[0] + r * Math.sin(bearing * Math.PI / 180), from[1] + r * Math.cos(bearing * Math.PI / 180)]
/** A North line up from a point, with its arrowhead and an N. */
const north = (at: FigurePoint, len = 0.85): FigureItem[] => [{ kind: 'line', from: at, to: [at[0], at[1] + len], arrow: true }, { kind: 'text', at: [at[0], at[1] + len], text: 'N', name: true, dx: 12, dy: 6 }]

type Mark = { from: 'north' | 'anticlockwise'; label: string; tone?: FigureTone }
/**
 * B on a bearing from A, the angle marked at A: clockwise from North (`north`), or the other way round from North
 * (`anticlockwise`, the angle the book gives for bearings past 180°).
 */
function bearingFig(bearing: number, mark: Mark | null, opts: { lit?: boolean; caption?: string; full?: Mark } = {}): AngleFrame {
  const A: FigurePoint = [0, 0], B = dir(bearing)
  const items: FigureItem[] = [...north(A), { kind: 'line', from: A, to: B, style: opts.lit ? 'lit' : 'plain' }]
  const arcFor = (m: Mark, r: number) => {
    // FigureItem arcs go anticlockwise from the x axis: North is 90°, and a clockwise bearing b ends at 90 − b.
    const [from, to, mid] = m.from === 'north' ? [90 - bearing, 90, bearing / 2] : [90, 90 + (360 - bearing), bearing + (360 - bearing) / 2]
    items.push({ kind: 'arc', centre: A, r, from, to, style: m.tone === 'found' ? 'found' : m.tone === 'lit' ? 'lit' : 'plain' })
    items.push({ kind: 'text', at: dir(mid, r + 0.24), text: m.label, tone: m.tone ?? 'given' })
  }
  if (mark) arcFor(mark, 0.3)
  if (opts.full) arcFor(opts.full, 0.48)
  items.push({ kind: 'point', at: A, label: 'A', dx: -14, dy: 16 }, { kind: 'point', at: B, label: 'B', dx: 10, dy: -8 })
  return fig(items, `A North line at A and B on a bearing of ${threeFigure(bearing)} degrees from A.`, opts.caption, 10)
}

/* ---------- Rung 1: reading a bearing ---------- */

explore(reading, 'Drag B round A. Watch its bearing.', 'GM18 p154 Three key rules (play)', { mode: 'bearing' })
{
  const p = bearingFig(70, { from: 'north', label: '70°' })
  worked(reading, 'Find the bearing of B from A.', 'Reading a bearing', 'GM18 p154 Example 1 (own numbers)', boardModel([], [
    { title: 'Start at North', say: '“From A” means stand at A and face North, up the North line.', rows: ['>0 Stand at A, face North'], picture: bearingFig(70, { from: 'north', label: '70°' }) },
    { title: 'Turn clockwise to B', say: 'Turn clockwise, like a clock’s hands, until you face B. That’s 70°.', rows: ['Angle = 70°'], picture: bearingFig(70, { from: 'north', label: '70°', tone: 'lit' }, { lit: true }) },
    { title: 'Three figures', say: 'Bearings always have three figures: 70 is written 070.', rows: ['! Bearing = 070°'], picture: bearingFig(70, { from: 'north', label: '070°', tone: 'found' }, { caption: '070°' }) },
  ], 'Bearing', p), 'A bearing is an angle measured from North, clockwise, written with three figures: 060°, not 60°. “The bearing of B from A” is measured at A.')
}
for (const b of [125, 48]) {
  const p = bearingFig(b, { from: 'north', label: `${b}°` })
  practice(reading, 'Find the bearing of B from A.', 'GM18 Your Turn Q4 (own numbers)', p, number(b, `${threeFigure(b)}°`), 'From North, clockwise, three figures.', boardModel([], [
    { title: 'From North, clockwise', say: `The angle from North round to B, clockwise, is ${b}°.`, rows: [`Angle = ${b}°`], picture: bearingFig(b, { from: 'north', label: `${b}°`, tone: 'lit' }, { lit: true }) },
    { title: 'Three figures', say: b < 100 ? `Write it with three figures: ${threeFigure(b)}.` : 'It already has three figures.', rows: [`! Bearing = ${threeFigure(b)}°`], picture: bearingFig(b, { from: 'north', label: `${threeFigure(b)}°`, tone: 'found' }, { caption: `${threeFigure(b)}°` }) },
  ], 'Bearing', p), slips(b, [[90 - b, 'That’s measured from East. Bearings start at North.'], [360 - b, 'That goes anticlockwise. Bearings go clockwise.']]), B_BOX)
}
{
  const p = bearingFig(9, { from: 'north', label: '9°' })
  practice(reading, 'How do you write this bearing?', 'GM18 p154 Rule 2', p, choose('009°', ['9°', 'Bearings have three figures. Fill the front with zeros.'], ['090°', 'That’s 90°, due East. This is 9°.'], ['900°', 'The zeros go in front: 9 is 009.']), 'Three figures, zeros in front.', boardModel([], [
    { title: 'Three figures', say: '9 has one figure. Two zeros in front make three.', rows: ['! Bearing = 009°'], picture: bearingFig(9, { from: 'north', label: '009°', tone: 'found' }) },
  ], 'Bearing', p))
}

/* ---------- Rung 2: bearings past 180° ---------- */

function reflexSteps(b: number) {
  const other = 360 - b
  const p = bearingFig(b, { from: 'anticlockwise', label: `${other}°` })
  return { p, moves: [
    { title: 'Which way is marked', say: `The ${other}° goes anticlockwise from North. A bearing goes clockwise: the long way round.`, rows: [`>0 Marked: ${other}° anticlockwise`], picture: bearingFig(b, { from: 'anticlockwise', label: `${other}°`, tone: 'lit' }) },
    { title: 'Take it from 360', say: 'All the way round is 360°. Clockwise is what’s left.', rows: [`360 − ${other} = ${b}`, `! Bearing = ${b}°`], picture: bearingFig(b, { from: 'anticlockwise', label: `${other}°` }, { full: { from: 'north', label: `${b}°`, tone: 'found' }, caption: `${b}°` }) },
  ] }
}
{
  const { p, moves } = reflexSteps(256)
  worked(reflex, 'Find the bearing of B from A.', 'Bearings past 180°', 'GM18 p154 Example 2 (book’s numbers)', boardModel([], moves, 'Bearing', p),
    'When B is to the West of A, the bearing is over 180°. If the angle you’re given goes the other way, from North anticlockwise, take it from 360.')
}
for (const b of [290, 215]) {
  const { p, moves } = reflexSteps(b)
  practice(reflex, 'Find the bearing of B from A.', 'GM18 p154 (own numbers)', p, number(b, `${b}°`), `The angle marked goes anticlockwise. Take it from 360.`, boardModel([], moves, 'Bearing', p),
    slips(b, [[360 - b, 'That’s the angle anticlockwise. Bearings go clockwise: 360 minus it.'], [180 + (360 - b), 'All the way round is 360, not 180.']]), B_BOX)
}

/* ---------- Rung 3: the bearing back ---------- */

/** A and B with a North line at each; the bearing of B from A marked at A, and the bearing back marked at B. */
function backFig(b: number, at: { a?: Mark; b?: Mark }, caption?: string): AngleFrame {
  const A: FigurePoint = [0, 0], B = dir(b, 1.6)
  const items: FigureItem[] = [...north(A), ...north(B), { kind: 'line', from: A, to: B }]
  const arc = (centre: FigurePoint, bearing: number, m: Mark) => {
    items.push({ kind: 'arc', centre, r: 0.3, from: 90 - bearing, to: 90, style: m.tone === 'found' ? 'found' : m.tone === 'lit' ? 'lit' : 'plain' })
    items.push({ kind: 'text', at: dir(bearing / 2, 0.56, centre), text: m.label, tone: m.tone ?? 'given' })
  }
  if (at.a) arc(A, b, at.a)
  if (at.b) arc(B, (b + 180) % 360, at.b)
  items.push({ kind: 'point', at: A, label: 'A', dx: -14, dy: 16 }, { kind: 'point', at: B, label: 'B', dx: 12, dy: 16 })
  return fig(items, `A and B with a North line at each. The bearing of B from A is ${threeFigure(b)} degrees.`, caption, 10)
}
{
  const p = backFig(60, { a: { from: 'north', label: '060°' } })
  worked(backBearing, 'The bearing of B from A is 060°. Find the bearing of A from B.', 'The bearing back', 'GM18 Your Turn Q5 (book’s numbers)', boardModel([], [
    { title: 'Stand at B now', say: '“From B” means measure at B, from B’s own North line, clockwise round to A.', rows: ['>0 At B, face North'], picture: backFig(60, { a: { from: 'north', label: '060°' } }) },
    { title: 'Add 180', say: 'Facing back down the line turns you exactly half way round. Under 180, add 180.', rows: ['60 + 180 = 240', '! Bearing = 240°'], picture: backFig(60, { a: { from: 'north', label: '060°' }, b: { from: 'north', label: '240°', tone: 'found' } }, '240°') },
  ], 'Bearing', p), 'The bearing back is 180° different. If the bearing is under 180°, add 180. If it’s over 180°, take 180 away. The two North lines are parallel, which is why it works.')
}
for (const [given, right] of [[295, 115], [300, 120], [75, 255]] as const) {
  const p = backFig(given, { a: { from: 'north', label: `${threeFigure(given)}°` } })
  const up = given < 180
  practice(backBearing, `The bearing of B from A is ${threeFigure(given)}°. Find the bearing of A from B.`, given === 295 ? 'GM18 Your Turn Q2 (book’s numbers)' : 'GM18 p155 (own numbers)', p, number(right, `${threeFigure(right)}°`), up ? 'Under 180: add 180.' : 'Over 180: take away 180.', boardModel([], [
    { title: up ? 'Add 180' : 'Take away 180', say: up ? `${given} is under 180, so add 180.` : `${given} is over 180, so take 180 away. Adding would go past 360.`, rows: [up ? `${given} + 180 = ${right}` : `${given} − 180 = ${right}`, `! Bearing = ${threeFigure(right)}°`], picture: backFig(given, { a: { from: 'north', label: `${threeFigure(given)}°` }, b: { from: 'north', label: `${threeFigure(right)}°`, tone: 'found' } }, `${threeFigure(right)}°`) },
  ], 'Bearing', p), slips(right, [[given + 180, 'That goes past 360°. Over 180, take 180 away.'], [360 - given, 'The bearing back is 180° different: add or take away 180.']]), B_BOX)
}

/* ---------- Rung 4: scale drawings ---------- */

/** A scale drawing: A, B on a bearing, the line between them measured in centimetres. */
function scaleFig(b: number, cm: string, real: string, tone: FigureTone = 'given', caption?: string): AngleFrame {
  const A: FigurePoint = [0, 0], B = dir(b, 1.5)
  return fig([...north(A), { kind: 'line', from: A, to: B, style: tone === 'found' ? 'found' : tone === 'lit' ? 'lit' : 'plain' },
    { kind: 'measure', from: A, to: B, label: cm, tone, offset: 14 },
    { kind: 'arc', centre: A, r: 0.3, from: 90 - b, to: 90 }, { kind: 'text', at: dir(b / 2, 0.55), text: `${threeFigure(b)}°` },
    { kind: 'point', at: A, label: 'A', dx: -14, dy: 16 }, { kind: 'point', at: B, label: 'B', dx: 10, dy: -8 },
    // The scale sits below A, on the side away from the line.
    { kind: 'text', at: [B[0] > 0 ? -0.55 : 0.55, -0.55], text: real, tone: 'faint' }],
  `A scale drawing: B is on a bearing of ${threeFigure(b)} degrees from A, ${cm} away on the page. ${real}.`, caption, 30)
}
{
  const p = scaleFig(51, '? cm', '1 cm : 10 miles')
  worked(scale, 'B is 50 miles from A on a bearing of 051°. The scale is 1 cm to 10 miles. How long is the line on the drawing?', 'Scale drawings', 'GM18 Your Turn Q1 (book’s numbers)', boardModel([], [
    { title: 'Miles to centimetres', say: 'Each centimetre on the page stands for 10 miles. How many tens in 50?', rows: ['Line = 50 ÷ 10 = 5 cm'], picture: scaleFig(51, '5 cm', '1 cm : 10 miles', 'lit') },
    { title: 'Draw it', say: 'Put the protractor’s zero on A’s North line, mark 51° clockwise, and draw a 5 cm line through it to B.', rows: ['! 5 cm on a bearing of 051°'], picture: scaleFig(51, '5 cm', '1 cm : 10 miles', 'found', '5 cm on a bearing of 051°') },
  ], 'Scale', p), 'On a scale drawing, divide a real distance by the scale to get centimetres; times centimetres by the scale to get the real distance back.')
}
for (const [b, cm, per, unit, right, ask] of [[130, 4.5, 2, 'km', 9, 'real'], [220, 9, 4, 'km', 9, 'page'], [300, 6.5, 10, 'miles', 65, 'real']] as const) {
  const real = cm * per
  const p = ask === 'real' ? scaleFig(b, `${cm} cm`, `1 cm : ${per} ${unit}`) : scaleFig(b, '? cm', `1 cm : ${per} ${unit}`)
  practice(scale, ask === 'real' ? `On this scale drawing the line from A to B is ${cm} cm. The scale is 1 cm to ${per} ${unit}. How far apart are A and B in real life?` : `B is ${real} ${unit} from A. The scale is 1 cm to ${per} ${unit}. How long is the line on the drawing?`,
    'GM18 Your Turn Q1 (own numbers)', p, number(right, ask === 'real' ? `${right} ${unit}` : `${right} cm`), ask === 'real' ? `Each centimetre is ${per} ${unit}.` : `How many lots of ${per} ${unit}?`, boardModel([], [
      { title: ask === 'real' ? 'Centimetres to real' : 'Real to centimetres', say: ask === 'real' ? `${cm} centimetres, each worth ${per} ${unit}: times.` : `Each centimetre is ${per} ${unit}: divide.`, rows: [ask === 'real' ? `${cm} × ${per} = ${right}` : `${real} ÷ ${per} = ${right}`, `! ${ask === 'real' ? `Distance = ${right} ${unit}` : `Line = ${right} cm`}`], picture: scaleFig(b, `${cm} cm`, `1 cm : ${per} ${unit}`, 'found') },
    ], 'Scale', p), slips(right, ask === 'real' ? [[cm / per, 'That divides. Each centimetre is worth more in real life: times.'], [cm + per, 'Times by the scale, don’t add.']] : [[real * per, 'That multiplies. The page is smaller than real life: divide.']]),
    ask === 'real' ? { label: `Distance (${unit})`, prefix: 'd =' } : { label: 'Length (cm)', prefix: 'Line =' })
}

add('mixed', 'Bearings', 'GM18 consolidation', text(
  'Measure from North, clockwise, and write three figures: 045°.',
  '“From A” means measure at A.',
  'If the angle given goes anticlockwise, take it from 360.',
  'The bearing back is 180° different: add 180 if under 180, take 180 if over.',
))

export const tutorBearingsLesson: TutorMethodLesson = {
  id: 'L218', number: 218, title: 'Bearings', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Read and write three-figure bearings, find the bearing back, and use bearings in scale drawings.',
  labels: { [reading]: 'Reading a bearing', [reflex]: 'Past 180°', [backBearing]: 'The bearing back', [scale]: 'Scale drawings', mixed: 'Review' },
  states: finish(),
}
