import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { fig, screens, slips } from '../../geometry/tutor/figureLesson'

/*
 * Geometry lesson 12: The four transformations. From GM12 in Sunny's revision book (p138–140), with our own shapes and
 * numbers. One rung for each transformation, in the book's order, on squared paper with numbered axes: translation by
 * a vector (top number across, bottom number up), reflection in a mirror line (x = a, y = a, y = x), rotation (its
 * angle, direction and centre, the three things the book says to give), and enlargement (scale factor and centre,
 * Your Turn Q3). Built like lessons 1 to 11: translation opens on the measuring board, where you slide a copy across the
 * paper and read its vector, and enlargement on the enlarging board.
 *
 * Hidden on live like lessons 1 to 11: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 */

const lesson = author(212)
const { add, finish } = lesson
const { explore, worked, practice } = screens(lesson)
const translation = 'geometry-translation'
const reflection = 'geometry-reflection'
const rotation = 'geometry-rotation'
const enlargement = 'geometry-enlargement'

/* ---------- Pictures ---------- */

type Pt = FigurePoint
type Drawn = { pts: Pt[]; name: string; image?: boolean; ghost?: boolean }
const centroid = (pts: Pt[]): Pt => [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length]
const move = (pts: Pt[], dx: number, dy: number): Pt[] => pts.map(([x, y]) => [x + dx, y + dy])
const reflectX = (pts: Pt[], a: number): Pt[] => pts.map(([x, y]) => [2 * a - x, y])
const reflectY = (pts: Pt[], a: number): Pt[] => pts.map(([x, y]) => [x, 2 * a - y])
/** A quarter turn about c: anticlockwise, or clockwise. */
const quarter = (pts: Pt[], c: Pt, clockwise = false): Pt[] => pts.map(([x, y]) => clockwise ? [c[0] + (y - c[1]), c[1] - (x - c[0])] : [c[0] - (y - c[1]), c[1] + (x - c[0])])
const half = (pts: Pt[], c: Pt): Pt[] => pts.map(([x, y]) => [2 * c[0] - x, 2 * c[1] - y])
const enlarge = (pts: Pt[], c: Pt, k: number): Pt[] => pts.map(([x, y]) => [c[0] + k * (x - c[0]), c[1] + k * (y - c[1])])

/**
 * Squared paper with numbered axes from `x` and `y` (low, high), and shapes on it: the object shaded, its image lit in
 * purple, a ghost dashed. `extra` draws mirror lines, arrows and centres on top.
 */
function grid(x: [number, number], y: [number, number], shapes: Drawn[], extra: FigureItem[] = [], spoken = '', caption?: string): AngleFrame {
  const items: FigureItem[] = [{ kind: 'grid', from: [x[0], y[0]], to: [x[1], y[1]], axes: true, numbers: true }]
  for (const s of shapes) {
    items.push({ kind: 'shape', points: s.pts, ...(s.ghost ? { dashed: true } : s.image ? { lit: true } : {}) })
    if (s.name) items.push({ kind: 'text', at: centroid(s.pts), text: s.name, name: true, dx: -5, dy: 5 })
  }
  items.push(...extra)
  return fig(items, spoken || `Squared paper with ${shapes.map(s => `shape ${s.name}`).join(' and ')}.`, caption)
}
const X: [number, number] = [-5, 5], Y: [number, number] = [-3, 4]

/* ---------- Rung 1: translation ---------- */

explore(translation, 'Slide the copy across the paper. Watch its vector.', 'GM12 p138 Translation (play)', { mode: 'translate' })
{
  const A: Pt[] = [[1, 1], [3, 1], [3, 3]]
  const B = move(A, -4, 1)
  const arrows: FigureItem[] = A.map((p, i) => ({ kind: 'line' as const, from: p, to: B[i], style: 'dashed' as const, arrow: true }))
  worked(translation, 'Translate shape A by the vector (−4 over 1): 4 left and 1 up.', 'Translation', 'GM12 p138 Example (own numbers)', boardModel([], [
    { title: 'Read the vector', say: 'The top number is across: −4 is 4 to the left. The bottom number is up: 1 is 1 up.', rows: ['>0 Top −4: 4 left. Bottom 1: 1 up'], picture: grid(X, Y, [{ pts: A, name: 'A' }]) },
    { title: 'Move every corner', say: 'Move each corner 4 left and 1 up, one at a time.', rows: ['>0 (1, 1) → (−3, 2)', '>0 (3, 1) → (−1, 2)', '>0 (3, 3) → (−1, 4)'], picture: grid(X, Y, [{ pts: A, name: 'A' }], arrows.concat(B.map(p => ({ kind: 'point' as const, at: p })))) },
    { title: 'Join them up', say: 'Join the new corners. The shape is just the same, slid across: same size, same way up.', rows: ['! The image of A'], picture: grid(X, Y, [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }], [], '', 'A translated 4 left and 1 up') },
  ], 'Translate', grid(X, Y, [{ pts: A, name: 'A' }])), 'A translation slides a shape without turning it. A column vector says how far: the top number is right (negative is left), the bottom number is up (negative is down).')
}
for (const [dx, dy] of [[3, -2], [-2, -3]] as const) {
  const A: Pt[] = dx > 0 ? [[-4, 1], [-2, 1], [-4, 3]] : [[1, 1], [4, 1], [4, 2], [1, 2]]
  const B = move(A, dx, dy)
  const p = grid(X, Y, [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }])
  const say = (a: number, b: number) => `${Math.abs(a)} ${a > 0 ? 'right' : 'left'}, ${Math.abs(b)} ${b > 0 ? 'up' : 'down'}`
  practice(translation, 'Describe the translation that takes shape A to shape B.', 'GM12 p138 (own numbers)', p,
    choose(say(dx, dy),
      [`${say(-dx, -dy)}`, 'That’s from B back to A. Count from A to B.'], [`${say(dy, dx)}`, 'Across first, then up or down.'], [`${say(dx, -dy)}`, `Check up or down: B is ${dy > 0 ? 'higher' : 'lower'} than A.`]),
    'Pick one corner of A and count squares to the same corner of B.', boardModel([], [
      { title: 'Follow one corner', say: `The corner at (${A[0].join(', ')}) moves to (${B[0].join(', ')}).`.replace(/-/g, '−'), rows: [`>0 (${A[0].join(', ')}) → (${B[0].join(', ')})`.replace(/-/g, '−')], picture: grid(X, Y, [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }], [{ kind: 'line', from: A[0], to: B[0], style: 'lit', arrow: true }]) },
      { title: 'Write the vector', say: 'Top across, bottom up.', rows: [`! ${say(dx, dy)}: vector (${dx} over ${dy})`.replace(/-/g, '−')], picture: p },
    ], 'Vector', p))
}

/* ---------- Rung 2: reflection ---------- */

{
  const A: Pt[] = [[1, 1], [4, 1], [4, 3]]
  const B = reflectY(A, 0)
  const mirror: FigureItem = { kind: 'line', from: [-5, 0], to: [5, 0], style: 'mirror' }
  worked(reflection, 'Reflect shape A in the line y = 0.', 'Reflection', 'GM12 p139 Reflection (own numbers)', boardModel([], [
    { title: 'Find the mirror line', say: 'y = 0 is every point with y = 0: the x axis.', rows: ['>0 y = 0 is the x axis'], picture: grid(X, Y, [{ pts: A, name: 'A' }], [mirror]) },
    { title: 'Same distance, other side', say: 'Each corner goes straight across the mirror, the same distance the other side: 1 above becomes 1 below.', rows: ['>0 (1, 1) → (1, −1)', '>0 (4, 3) → (4, −3)'], picture: grid(X, Y, [{ pts: A, name: 'A' }], [mirror, ...B.map(p => ({ kind: 'point' as const, at: p }))]) },
    { title: 'Join them up', say: 'Join the new corners: a mirror image, flipped over.', rows: ['! The reflection of A'], picture: grid(X, Y, [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }], [mirror], '', 'A reflected in y = 0') },
  ], 'Reflect', grid(X, Y, [{ pts: A, name: 'A' }])), 'To reflect, you need the mirror line. x = a is upright, y = a is flat, y = x goes diagonally through (0, 0). Every point lands the same distance away on the other side.')
}
{
  const A: Pt[] = [[2, 1], [4, 1], [4, 3]]
  const B = reflectX(A, 1)
  const p = grid(X, Y, [{ pts: A, name: 'A' }], [{ kind: 'line', from: [1, -3], to: [1, 4], style: 'mirror' }, { kind: 'point', at: [4, 3], label: '(4, 3)', dx: 8, dy: -10 }])
  practice(reflection, 'Shape A is reflected in the line x = 1. The corner (4, 3) goes to (?, 3). What is its new x coordinate?', 'GM12 Your Turn Q1 (own numbers)', p, number(-2, '−2'), 'How far is the corner from the line x = 1? Go that far the other side.', boardModel([], [
    { title: 'Distance to the mirror', say: 'x = 1 is upright. The corner is at x = 4: 3 squares right of it.', rows: ['4 − 1 = 3'], picture: p },
    { title: 'Same distance back', say: '3 squares left of the line: 1 − 3.', rows: ['x = 1 − 3', '! x = −2'], picture: grid(X, Y, [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }], [{ kind: 'line', from: [1, -3], to: [1, 4], style: 'mirror' }], '', 'The corner lands at (−2, 3)') },
  ], 'Find x', p), slips(-2, [[-4, 'That reflects in x = 0, the y axis. The mirror here is x = 1.'], [2, 'Go the same distance past the mirror: 3 left of x = 1.']]), { label: 'New x coordinate', prefix: 'x =' })
}
{
  const A: Pt[] = [[-3, 2], [-1, 2], [-3, 4]]
  const B = reflectY(A, 1)
  const p = grid(X, Y, [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }])
  practice(reflection, 'Shape B is a reflection of shape A. What is the mirror line?', 'GM12 Your Turn Q1 (own numbers)', p,
    choose('y = 1', ['x = 1', 'x = 1 is an upright line. These shapes flip up and down, across a flat line.'], ['y = 0', 'Halfway between them is y = 1, not the x axis.'], ['y = x', 'y = x is diagonal. The mirror here is flat.']),
    'The mirror is halfway between matching corners.', boardModel([], [
      { title: 'Halfway between', say: 'The corner at y = 2 lands at y = 0. Halfway between is y = 1, a flat line.', rows: ['(2 + 0) ÷ 2 = 1', '! Mirror line y = 1'], picture: grid(X, Y, [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }], [{ kind: 'line', from: [-5, 1], to: [5, 1], style: 'mirror' }]) },
    ], 'Mirror', p))
}

/* ---------- Rung 3: rotation ---------- */

{
  const A: Pt[] = [[2, 1], [4, 1], [2, 3]], c: Pt = [1, 1]
  const B = quarter(A, c)
  const centre: FigureItem = { kind: 'point', at: c, label: '(1, 1)', dx: -20, dy: 18 }
  worked(rotation, 'Rotate shape A 90° anticlockwise about (1, 1).', 'Rotation', 'GM12 p138 Rotation example (book’s centre)', boardModel([], [
    { title: 'Mark the centre', say: 'The centre of rotation stays still. Mark (1, 1).', rows: ['>0 Centre (1, 1), 90° anticlockwise'], picture: grid(X, Y, [{ pts: A, name: 'A' }], [centre]) },
    { title: 'Turn a quarter', say: 'Trace A, hold the pencil on (1, 1), and turn the paper a quarter turn anticlockwise: right turns to up, up turns to left.', rows: ['>0 (4, 1) → (1, 4)', '>0 (2, 3) → (−1, 2)'], picture: grid(X, Y, [{ pts: A, name: 'A' }, { pts: B, name: '', ghost: true }], [centre]) },
    { title: 'Draw the image', say: 'Draw where the tracing lands. Same size and shape, turned.', rows: ['! A turned 90° anticlockwise'], picture: grid(X, Y, [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }], [centre], '', 'A rotated 90° anticlockwise about (1, 1)') },
  ], 'Rotate', grid(X, Y, [{ pts: A, name: 'A' }], [centre])), 'A rotation turns a shape about a fixed point. Give all three: the angle (90°, 180° or 270°), the direction (clockwise or anticlockwise) and the centre. Tracing paper is allowed in the exam.')
}
{
  const A: Pt[] = [[1, 1], [3, 1], [1, 2]], c: Pt = [0, 0]
  const B = quarter(A, c, true)
  const p = grid(X, Y, [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }])
  practice(rotation, 'Describe fully the rotation that takes A to B.', 'GM12 Your Turn Q2 (own numbers)', p,
    choose('90° clockwise about (0, 0)', ['90° anticlockwise about (0, 0)', 'Follow the long side: it points right on A and down on B. That’s clockwise.'], ['180° about (0, 0)', 'A half turn would put B upside down on the far side, below and left.'], ['90° clockwise', 'Describe it fully: give the centre too.']),
    'Angle, direction and centre.', boardModel([], [
      { title: 'Angle and direction', say: 'A’s long side points right; B’s points down. Right to down is a quarter turn clockwise.', rows: ['>0 90° clockwise'], picture: p },
      { title: 'The centre', say: 'Both shapes have a corner pointing at the origin, and each corner is as far from it before and after: the centre is (0, 0).', rows: ['! 90° clockwise about (0, 0)'], picture: grid(X, Y, [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }], [{ kind: 'point', at: [0, 0], label: '(0, 0)', dx: -22, dy: 16 }]) },
    ], 'Describe', p))
}
{
  const A: Pt[] = [[1, 1], [4, 1], [4, 2]], c: Pt = [0, 0]
  const B = half(A, c)
  const p = grid(X, Y, [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }])
  practice(rotation, 'Describe fully the rotation that takes A to B.', 'GM12 Your Turn Q4 (own numbers)', p,
    choose('180° about (0, 0)', ['90° clockwise about (0, 0)', 'A quarter turn would leave B upright on its side. B is upside down: a half turn.'], ['Reflection in y = 0', 'A reflection only flips one way. B is flipped both ways: turned half round.'], ['180° about (1, 1)', 'The centre is halfway between matching corners: (1, 1) and (−1, −1) meet at (0, 0).']),
    'Upside down on the far side: how far round?', boardModel([], [
      { title: 'Half a turn', say: 'B is A upside down, on the opposite side of the origin. That’s a half turn, 180°: either direction gives the same.', rows: ['! 180° about (0, 0)'], picture: grid(X, Y, [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }], [{ kind: 'point', at: [0, 0], label: '(0, 0)', dx: -22, dy: 16 }]) },
    ], 'Describe', p))
}

/* ---------- Rung 4: enlargement ---------- */

explore(enlargement, 'Drag the corner of the copy. Watch the scale factor.', 'GM12 p139 Enlargement (play)', { mode: 'enlarge' })
{
  const A: Pt[] = [[1, 1], [2, 1], [1, 2]], c: Pt = [0, 0]
  const B = enlarge(A, c, 2)
  const G: [number, number] = [-1, 5]
  const rays: FigureItem[] = B.map(p => ({ kind: 'line' as const, from: c, to: p, style: 'dashed' as const }))
  worked(enlargement, 'Enlarge shape A by scale factor 2, centre (0, 0).', 'Enlargement', 'GM12 p139 Example (own numbers)', boardModel([], [
    { title: 'Lines from the centre', say: 'Draw lines from the centre (0, 0) through every corner.', rows: ['>0 Centre (0, 0), scale factor 2'], picture: grid(G, G, [{ pts: A, name: 'A' }], rays) },
    { title: 'Twice as far', say: 'Each new corner is twice as far from the centre: (1, 1) → (2, 2), (2, 1) → (4, 2), (1, 2) → (2, 4).', rows: ['>0 (1, 1) → (2, 2)', '>0 (2, 1) → (4, 2)', '>0 (1, 2) → (2, 4)'], picture: grid(G, G, [{ pts: A, name: 'A' }], [...rays, ...B.map(p => ({ kind: 'point' as const, at: p }))]) },
    { title: 'Join them up', say: 'Join the new corners. Every side is twice as long; the angles haven’t changed.', rows: ['! A enlarged by scale factor 2'], picture: grid(G, G, [{ pts: A, name: 'A' }, { pts: B, name: 'B', image: true }], rays, '', 'Every side twice as long') },
  ], 'Enlarge', grid(G, G, [{ pts: A, name: 'A' }])), 'An enlargement changes a shape’s size: scale factor = new length ÷ old length. Above 1 it gets bigger, below 1 smaller. The centre says where it goes: every corner moves along a line from the centre.')
}
{
  const p = grid([-1, 13], [-1, 6], [{ pts: [[1, 1], [3, 1], [1, 2]], name: 'A' }], [{ kind: 'point', at: [0, 1], label: '(0, 1)', dx: -22, dy: -10 }])
  practice(enlargement, 'Shape A is enlarged by scale factor 3, centre (0, 1). Its bottom side is 2 squares long. How long is it after?', 'GM12 Your Turn Q3 (own numbers)', p, number(6, '6 squares'), 'Every length is times the scale factor.', boardModel([], [
    { title: 'Times the scale factor', say: 'Every length is multiplied by 3.', rows: ['2 × 3 = 6', '! 6 squares'], picture: grid([-1, 13], [-1, 6], [{ pts: [[1, 1], [3, 1], [1, 2]], name: 'A' }, { pts: enlarge([[1, 1], [3, 1], [1, 2]], [0, 1], 3), name: 'B', image: true }], [{ kind: 'point', at: [0, 1], label: '(0, 1)', dx: -22, dy: -10 }], '', '2 squares become 6') },
  ], 'Length', p), slips(6, [[5, 'That adds 3. Enlargements multiply.'], [8, 'Times 3: 2 × 3.']]), { label: 'New length, in squares', prefix: 'Length =' })
}
{
  const A: Pt[] = [[0, 0], [4, 0], [4, 2], [0, 2]]
  const B = move(enlarge(A, [0, 0], 2.5), 6, 0)
  const p = fig([{ kind: 'grid', from: [-1, -1], to: [17, 6] }, { kind: 'shape', points: A }, { kind: 'text', at: [2, 1], text: 'A', name: true }, { kind: 'shape', points: B, lit: true }, { kind: 'text', at: [11, 2.5], text: 'B', name: true },
    { kind: 'measure', from: [0, 0], to: [4, 0], label: '4', offset: 12 }, { kind: 'measure', from: [6, 0], to: [16, 0], label: '10', offset: 12 }], 'Rectangle A, 4 squares long, and its enlargement B, 10 squares long.')
  practice(enlargement, 'B is an enlargement of A. What is the scale factor?', 'GM12 p139 Scale factors (own numbers)', p, number(2.5, '2.5'), 'New length ÷ old length.', boardModel([], [
    { title: 'New over old', say: 'B’s length is 10; A’s is 4.', rows: ['SF = 10 ÷ 4', '! SF = 2.5'], picture: p },
  ], 'Scale factor', p), slips(2.5, [[6, 'That’s 10 − 4. Scale factors divide.'], [0.4, 'New ÷ old: 10 ÷ 4.']]), { label: 'Scale factor', prefix: 'SF =' })
}

add('mixed', 'The four transformations', 'GM12 consolidation', text(
  'Translation: slide by a vector, top number across, bottom number up.',
  'Reflection: flip in a mirror line, every point the same distance the other side.',
  'Rotation: give the angle, the direction and the centre.',
  'Enlargement: give the scale factor and the centre. Lengths multiply; angles stay the same.',
))

export const tutorTransformationsLesson: TutorMethodLesson = {
  id: 'L212', number: 212, title: 'The four transformations', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Translate, reflect, rotate and enlarge shapes on a grid, and describe each transformation fully.',
  labels: { [translation]: 'Translation', [reflection]: 'Reflection', [rotation]: 'Rotation', [enlargement]: 'Enlargement', mixed: 'Review' },
  states: finish(),
}
