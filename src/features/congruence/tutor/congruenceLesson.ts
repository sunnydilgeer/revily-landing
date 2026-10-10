import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { fig, screens, slips } from '../../geometry/tutor/figureLesson'

/*
 * Geometry lesson 10: Congruent shapes. From GM10 in Sunny's revision book (p135), with our own shapes. Three rungs:
 * what congruent means (the same size and shape, so the same sides and angles, even when one is turned or flipped, as
 * the book's shapes A and C, D and H are); finding congruent pairs among shapes on squared paper (Your Turn Q1 to Q3);
 * and using congruence, where matching sides and angles are equal, to find a missing side, angle or perimeter. Built
 * like lessons 1 to 9, but with no measuring board: the turn-and-flip idea is drawn in each worked example instead.
 *
 * Hidden on live like lessons 1 to 9: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 */

const lesson = author(210)
const { add, finish } = lesson
const { worked, practice } = screens(lesson)
const meaning = 'geometry-congruent-meaning'
const pairs = 'geometry-congruent-pairs'
const missing = 'geometry-congruent-missing'

/* ---------- Pictures ---------- */

type Pt = FigurePoint
const shift = (pts: Pt[], dx: number, dy: number): Pt[] => pts.map(([x, y]) => [x + dx, y + dy])
/** A shape turned a quarter (anticlockwise), flipped left to right, or scaled, then moved so its lowest-left corner sits at `at`. */
function placed(pts: Pt[], at: Pt, how: 'same' | 'turn' | 'flip' | 'half' = 'same', k = 1): Pt[] {
  let q: Pt[] = pts.map(([x, y]) => [x * k, y * k])
  if (how === 'turn') q = q.map(([x, y]) => [-y, x])
  if (how === 'flip') q = q.map(([x, y]) => [-x, y])
  if (how === 'half') q = q.map(([x, y]) => [-x, -y])
  const minX = Math.min(...q.map(p => p[0])), minY = Math.min(...q.map(p => p[1]))
  return shift(q, at[0] - minX, at[1] - minY)
}
const centre = (pts: Pt[]): Pt => [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length]
const inside = ([x, y]: Pt, pts: Pt[]) => pts.reduce((odd, [ax, ay], i) => {
  const [bx, by] = pts[(i + 1) % pts.length]
  return (ay > y) !== (by > y) && x < ax + (y - ay) * (bx - ax) / (by - ay) ? !odd : odd
}, false)
/** Where a shape's name goes: its centre, or for a shape made of whole squares (an L), the middle of the square
 * inside it nearest its centre, so the name stays clear of its edges. */
function nameSpot(pts: Pt[]): Pt {
  const [cx, cy] = centre(pts), xs = pts.map(p => p[0]), ys = pts.map(p => p[1])
  if (pts.some(([x, y], i) => x !== pts[(i + 1) % pts.length][0] && y !== pts[(i + 1) % pts.length][1])) return [cx, cy]
  let best: Pt = [cx, cy], far = Infinity
  for (let x = Math.min(...xs); x < Math.max(...xs); x++) for (let y = Math.min(...ys); y < Math.max(...ys); y++) {
    const at: Pt = [x + 0.5, y + 0.5], d = (at[0] - cx) ** 2 + (at[1] - cy) ** 2
    if (inside(at, pts) && d < far) { best = at; far = d }
  }
  return best
}
type Placed = { pts: Pt[]; name: string; lit?: boolean; faint?: boolean }
/** Shapes on squared paper, each named in its middle; `lit` ones glow purple. */
function paper(to: Pt, shapes: Placed[], spoken: string, caption?: string): AngleFrame {
  const items: FigureItem[] = [{ kind: 'grid', from: [0, 0], to }]
  for (const s of shapes) {
    items.push({ kind: 'shape', points: s.pts, ...(s.lit ? { lit: true } : {}), ...(s.faint ? { fill: 'none' as const, dashed: true } : {}) })
    items.push({ kind: 'text', at: nameSpot(s.pts), text: s.name, name: true })
  }
  return fig(items, spoken, caption)
}

const L: Pt[] = [[0, 0], [3, 0], [3, 1], [1, 1], [1, 2], [0, 2]]
const longL: Pt[] = [[0, 0], [4, 0], [4, 1], [1, 1], [1, 2], [0, 2]]
const tri: Pt[] = [[0, 0], [3, 0], [0, 2]]

/* ---------- Rung 1: what congruent means ---------- */

{
  const A = placed(L, [1, 1]), B = placed(L, [6, 1], 'turn')
  const draw = (lit: boolean, ghost = false, caption?: string) => paper([10, 5], [{ pts: A, name: 'A', lit }, { pts: B, name: 'B', lit }, ...(ghost ? [{ pts: placed(L, [6, 1]), name: '', faint: true }] : [])], 'Two L shapes on squared paper: B is A turned a quarter turn.', caption)
  worked(meaning, 'Are shapes A and B congruent?', 'What congruent means', 'GM10 p135 Simple congruence (own shapes)', boardModel([], [
    { title: 'Compare the sides', say: 'Count the sides of each: 3, 1, 2, 1, 1 and 2 squares, in the same order round both.', rows: ['>0 Same side lengths'], picture: draw(true) },
    { title: 'Turn one onto the other', say: 'Turn B a quarter turn back and it fits exactly on A: same size, same shape.', rows: ['! Yes: A and B are congruent'], picture: draw(false, true, 'B turned back fits exactly on A') },
  ], 'Congruent?', draw(false)), 'Two shapes are congruent if they are exactly the same: the same side lengths and the same angles. A shape that has been turned or flipped over is still congruent; one that is bigger or smaller isn’t.')
}
{
  const A = placed(L, [1, 1]), B = placed(L, [6, 1], 'flip')
  const p = paper([10, 5], [{ pts: A, name: 'A' }, { pts: B, name: 'B' }], 'Two L shapes: B is a mirror image of A.')
  practice(meaning, 'B is A flipped over, like its mirror image. Are A and B congruent?', 'GM10 p135 Shape D and shape H', p,
    choose('Yes: flipping doesn’t change the size or shape', ['No: B faces the other way', 'Facing the other way is fine. Cut A out, flip it over, and it fits on B exactly.'], ['No: only turned shapes count', 'Turned or flipped, both count. Only the size and shape matter.']),
    'Would a paper cut-out of A, flipped over, sit exactly on B?', boardModel([], [
      { title: 'Flip it over', say: 'Flip a cut-out of A over and it fits B exactly: every side and angle matches.', rows: ['! Congruent'], picture: paper([10, 5], [{ pts: A, name: 'A', lit: true }, { pts: B, name: 'B', lit: true }], 'Two L shapes: B is a mirror image of A.') },
    ], 'Congruent?', p))
}
{
  const A = placed(L, [1, 1]), B = placed(L, [5, 1], 'same', 2)
  const p = paper([12, 6], [{ pts: A, name: 'A' }, { pts: B, name: 'B' }], 'Two L shapes the same shape: B is twice as big as A.')
  practice(meaning, 'A and B are the same shape, but B is twice as big. Are they congruent?', 'GM10 p135 (own shapes)', p,
    choose('No: congruent shapes are the same size too', ['Yes: they’re the same shape', 'Same shape but a different size is similar, not congruent.'], ['Yes: one is an enlargement of the other', 'An enlargement changes the size, so they aren’t congruent.']),
    'Same shape is not enough.', boardModel([], [
      { title: 'Check the size', say: 'B’s sides are twice A’s. Congruent means same shape and same size.', rows: ['! Not congruent: similar'], picture: p },
    ], 'Congruent?', p))
}

/* ---------- Rung 2: finding congruent pairs ---------- */

{
  const A = placed(L, [1, 1]), B = placed(longL, [5, 1]), C = placed(L, [11, 1], 'half')
  const draw = (litB: boolean, litC: boolean, caption?: string) => paper([15, 4], [{ pts: A, name: 'A' }, { pts: B, name: 'B', lit: litB }, { pts: C, name: 'C', lit: litC }], 'Three L shapes on squared paper.', caption)
  worked(pairs, 'Which shape is congruent to A?', 'Finding pairs', 'GM10 Your Turn Q1 (own shapes)', boardModel([], [
    { title: 'Count the sides', say: 'A’s long side is 3 squares. B’s long side is 4: B can’t be congruent.', rows: ['>0 B: long side 4, not 3'], picture: draw(true, false) },
    { title: 'Turn the other', say: 'C is A upside down: turn it half way round and every side matches.', rows: ['! C is congruent to A'], picture: draw(false, true, 'C is A turned half way round') },
  ], 'Pair', draw(false, false)), 'To check a pair, count the squares along each side. Ignore which way the shapes face: imagine turning or flipping one onto the other.')
}
{
  const A = placed(tri, [1, 1]), B = placed(tri, [5, 1], 'flip'), C = placed([[0, 0], [3, 0], [0, 3]], [9, 1]), D = placed([[0, 0], [2, 0], [0, 2]], [14, 1])
  const p = paper([17, 5], [{ pts: A, name: 'A' }, { pts: B, name: 'B' }, { pts: C, name: 'C' }, { pts: D, name: 'D' }], 'Four right-angled triangles on squared paper.')
  practice(pairs, 'Which triangle is congruent to A?', 'GM10 Your Turn Q2 (own shapes)', p,
    choose('B', ['C', 'C is 3 tall. A is 3 across but only 2 tall.'], ['D', 'D is 2 across. A is 3 across.']),
    'A is 3 squares across and 2 up.', boardModel([], [
      { title: 'Count across and up', say: 'A is 3 across and 2 up. B is too, just flipped to face the other way.', rows: ['! B is congruent to A'], picture: paper([17, 5], [{ pts: A, name: 'A', lit: true }, { pts: B, name: 'B', lit: true }, { pts: C, name: 'C' }, { pts: D, name: 'D' }], 'Four right-angled triangles on squared paper.') },
    ], 'Pair', p))
}
{
  const T: Pt[] = [[0, 0], [3, 0], [2, 2], [0, 2]]
  const A = placed(T, [1, 1]), B = placed(T, [5, 1], 'turn'), C = placed([[0, 0], [3, 0], [2, 3], [0, 3]], [9, 1]), D = placed([[0, 0], [4, 0], [3, 2], [0, 2]], [13, 1])
  const p = paper([18, 5], [{ pts: A, name: 'A' }, { pts: B, name: 'B' }, { pts: C, name: 'C' }, { pts: D, name: 'D' }], 'Four trapeziums on squared paper.')
  practice(pairs, 'Which shape is congruent to A?', 'GM10 Your Turn Q3 (own shapes)', p,
    choose('B', ['C', 'C’s parallel sides are 3 and 2 like A’s, but they’re 3 apart, not 2.'], ['D', 'D’s bottom is 4 squares. A’s is 3.']),
    'Count the parallel sides: A’s are 3 and 2, 2 apart.', boardModel([], [
      { title: 'Turn and compare', say: 'B is A turned a quarter turn: its parallel sides are 3 and 2, still 2 apart.', rows: ['! B is congruent to A'], picture: paper([18, 5], [{ pts: A, name: 'A', lit: true }, { pts: B, name: 'B', lit: true }, { pts: C, name: 'C' }, { pts: D, name: 'D' }], 'Four trapeziums on squared paper.') },
    ], 'Pair', p))
}

/* ---------- Rung 3: using congruence ---------- */

/** Two congruent triangles ABC and DEF, DEF turned half way round; sides and angles labelled where given. */
function twins(labels: { ab?: string; bc?: string; ca?: string; ef?: string; fd?: string; de?: string; A?: string; B?: string; C?: string; D?: string; E?: string; F?: string }, tones: Partial<Record<string, FigureTone>> = {}, caption?: string): AngleFrame {
  const A: Pt = [0, 0], B: Pt = [4, 0], C: Pt = [1.2, 2.6]
  const D: Pt = [9.5, 2.6], E: Pt = [5.5, 2.6], F: Pt = [8.3, 0]
  const items: FigureItem[] = [{ kind: 'shape', points: [A, B, C] }, { kind: 'shape', points: [D, E, F] }]
  // Each side's length sits just outside it.
  const side = (p: Pt, q: Pt, key: string, dx: number, dy: number) => { const t = labels[key as keyof typeof labels]; if (t) items.push({ kind: 'text', at: [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], text: t, tone: tones[key] ?? 'given', dx, dy }) }
  side(A, B, 'ab', 0, 16); side(B, C, 'bc', 22, -8); side(C, A, 'ca', -26, -6); side(D, E, 'de', 0, -16); side(E, F, 'ef', -26, 8); side(F, D, 'fd', 26, 8)
  const corner = (p: Pt, key: string, dx: number, dy: number, ax: number, ay: number) => {
    items.push({ kind: 'point', at: p, label: key, dx, dy })
    const t = labels[key as keyof typeof labels]
    if (t) items.push({ kind: 'text', at: [p[0] + ax, p[1] + ay], text: t, tone: tones[key] ?? 'given' })
  }
  corner(A, 'A', -16, 6, 0.65, 0.25); corner(B, 'B', 8, 6, -0.75, 0.25); corner(C, 'C', -6, -12, 0.05, -0.6)
  corner(D, 'D', 8, -4, -0.75, -0.25); corner(E, 'E', -18, -4, 0.65, -0.25); corner(F, 'F', 2, 18, -0.05, 0.6)
  return fig(items, 'Two congruent triangles, ABC and DEF, with DEF turned upside down. A matches D, B matches E and C matches F.', caption, 10)
}
{
  const p = twins({ ab: '7 cm', bc: '5 cm', ef: 'x' }, { ef: 'x' })
  worked(missing, 'Triangles ABC and DEF are congruent: A matches D, B matches E, C matches F. Find x.', 'Using congruence', 'GM10 p135 (own numbers)', boardModel([], [
    { title: 'Match the letters', say: 'EF joins E and F. They match B and C, so EF matches BC.', rows: ['>0 EF matches BC'], picture: twins({ ab: '7 cm', bc: '5 cm', ef: 'x' }, { bc: 'lit', ef: 'lit' }) },
    { title: 'Equal sides', say: 'Congruent shapes have equal matching sides.', rows: ['! x = 5 cm'], picture: twins({ ab: '7 cm', bc: '5 cm', ef: '5 cm' }, { ef: 'found' }, 'EF = BC = 5 cm') },
  ], 'Find x', p), 'In congruent shapes, matching sides are equal and matching angles are equal. The order of the letters tells you which corner matches which.')
}
{
  const p = twins({ A: '48°', C: '62°', E: 'y' }, { E: 'x' })
  practice(missing, 'ABC and DEF are congruent: A matches D, B matches E, C matches F. Find angle y at E.', 'GM10 p135 (own numbers)', p, number(70, '70°'), 'E matches B. Find B with the angles in a triangle.', boardModel([], [
    { title: 'Angle B first', say: 'Angles in a triangle add to 180°.', rows: ['B = 180 − 48 − 62 = 70°'], picture: twins({ A: '48°', B: '70°', C: '62°', E: 'y' }, { B: 'lit' }) },
    { title: 'E matches B', say: 'Matching angles are equal.', rows: ['! y = 70°'], picture: twins({ A: '48°', B: '70°', C: '62°', E: '70°' }, { E: 'found' }, 'y = 70°') },
  ], 'Find y', p), slips(70, [[48, 'That’s angle A, which matches D. E matches B.'], [62, 'That’s angle C, which matches F. E matches B.'], [110, 'Take both angles from 180: 180 − 48 − 62.']]), { label: 'Angle y (°)', prefix: 'y =' })
}
{
  const p = twins({ ab: '7 cm', bc: '5 cm', ca: '6 cm' })
  practice(missing, 'ABC and DEF are congruent. What is the perimeter of DEF?', 'GM10 p135 (own numbers)', p, number(18, '18 cm'), 'DEF has the same three sides as ABC.', boardModel([], [
    { title: 'Same three sides', say: 'Congruent triangles have the same sides, so the same perimeter.', rows: ['P = 7 + 5 + 6', '! P = 18 cm'], picture: twins({ ab: '7 cm', bc: '5 cm', ca: '6 cm', de: '7 cm', ef: '5 cm', fd: '6 cm' }, { de: 'found', ef: 'found', fd: 'found' }, 'P = 18 cm') },
  ], 'Perimeter', p), slips(18, [[36, 'That’s both triangles. Just DEF.'], [12, 'Add all three sides: 7 + 5 + 6.']]), { label: 'Perimeter (cm)', prefix: 'P =' })
}

add('mixed', 'Congruent shapes', 'GM10 consolidation', text(
  'Congruent: exactly the same size and shape.',
  'Turned or flipped still counts. Bigger or smaller doesn’t: that’s similar.',
  'Matching sides are equal and matching angles are equal.',
  'The order of the letters says which corner matches which.',
))

export const tutorCongruenceLesson: TutorMethodLesson = {
  id: 'L210', number: 210, title: 'Congruent shapes', level: 'GCSE Foundation',
  steadyPictures: true,
  largePictures: true,
  goal: 'Recognise congruent shapes, even turned or flipped, and use them to find missing sides and angles.',
  labels: { [meaning]: 'What congruent means', [pairs]: 'Finding pairs', [missing]: 'Using congruence', mixed: 'Review' },
  states: finish(),
}
