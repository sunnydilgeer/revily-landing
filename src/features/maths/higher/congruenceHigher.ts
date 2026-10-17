/*
 * Lesson 210 (Congruent shapes), a Higher section. From the Higher revision guide, GM11 Congruent Shapes (Level 6-7,
 * p193–195): the four tests for congruent triangles (SSS, SAS, ASA, RHS), naming the test, spotting when a pair fails
 * (Example 2: the side isn't between the two angles), and a short proof (Your Turn Q5: two sides and the angle between
 * them, SAS). Example 1 (4.5 cm, 3.2 cm, 48°) and Example 2 (43°, 71°, 18 mm) use the book's numbers; Your Turn Q4's
 * 5, 7 and 8 cm triangle (whose angle between 5 and 8 is 60°) gives the SSS and SAS questions. Drawn to scale.
 */
import { author } from '../../written-methods/tutor/content'
import type { FigurePoint } from '../../written-methods/tutor/methodWorking'
import { boardModel, choose } from '../../simultaneous-equations/tutor/boardWorkings'
import { screens } from '../../geometry/tutor/figureLesson'
import { asks, pairFig, type PairTri } from './figureHelpers'
import { text, type HigherAddition } from './helpers'

const tests = 'congruence-tests'
const a = author(210, 'L210-H')
const { add } = a
const { worked } = screens(a)
const ask = asks(a)

type Pt = FigurePoint
const rad = (deg: number) => deg * Math.PI / 180
/** Corners of a triangle with base `c` along the bottom and angles `A` (left) and `B` (right) on it. */
function asa(c: number, A: number, B: number): [Pt, Pt, Pt] {
  const b = c * Math.sin(rad(B)) / Math.sin(rad(A + B))
  return [[0, 0], [c, 0], [b * Math.cos(rad(A)), b * Math.sin(rad(A))]]
}
/** Two sides `b` (up from the left corner) and `c` (along the bottom) with the angle `A` between them. */
const sas = (c: number, b: number, A: number): [Pt, Pt, Pt] => [[0, 0], [c, 0], [b * Math.cos(rad(A)), b * Math.sin(rad(A))]]
/** The same triangle flipped left to right, so the pair looks turned over. */
const flip = (pts: [Pt, Pt, Pt]): [Pt, Pt, Pt] => pts.map(([x, y]) => [-x, y]) as [Pt, Pt, Pt]

add(tests, 'Congruent triangles', 'Higher GM11 Congruence in Triangles', text(
  'Two triangles are congruent if they pass one of these four tests:',
  'SSS: all three sides are the same.',
  'SAS: two sides and the angle between them are the same.',
  'ASA: two angles and the side between them are the same.',
  'RHS: a right angle, the hypotenuse and one other side are the same.',
  'Three equal angles is not enough: the triangles could be different sizes.',
))

{
  // Example 1: 4.5 cm and 3.2 cm with 48° between them, in both triangles.
  const tri = (lit?: 'sides' | 'angle' | 'all'): PairTri => ({ pts: sas(4.5, 3.2, 48), sides: [{ label: '4.5 cm', tone: lit && lit !== 'angle' ? 'lit' : undefined }, undefined, { label: '3.2 cm', tone: lit && lit !== 'angle' ? 'lit' : undefined }], angles: [{ at: 0, label: '48°', tone: lit && lit !== 'sides' ? 'lit' : undefined }] })
  const pic = (lit?: 'sides' | 'angle' | 'all', caption?: string) => { const t = tri(lit); return pairFig(t, { ...t, pts: flip(t.pts) }, 'Two triangles, each with sides 4.5 cm and 3.2 cm and an angle of 48° between them. The second is flipped over.', caption) }
  worked(tests, 'Which test can you use to prove these two triangles are congruent?', 'Naming the test', 'Higher GM11 Example 1 (p193)', boardModel([], [
    { title: 'Match the sides', say: 'Both triangles have a side of 4.5 cm and a side of 3.2 cm.', rows: ['>0 Two sides the same: 4.5 cm and 3.2 cm'], picture: pic('sides') },
    { title: 'Where is the angle?', say: 'In both, the 48° angle is between those two sides, where they meet.', rows: ['>0 The 48° angle is between them'], picture: pic('angle') },
    { title: 'Name the test', say: 'Side, angle between, side: that is SAS.', rows: ['! Congruent by SAS'], picture: pic('all', 'SAS') },
  ], 'Name the test', pic()), 'Check what is the same in both triangles, and where the angle sits. Side, angle, side only works when the angle is between the two sides.')
}

const options = (right: string, notes: Record<string, string>) => choose(right, ...Object.entries(notes) as [string, string][])

{
  // Your Turn Q4's triangle: 5, 7 and 8 cm.
  const t: PairTri = { pts: sas(8, 5, 60), sides: [{ label: '8 cm' }, { label: '7 cm' }, { label: '5 cm' }] }
  ask(tests, 'These two triangles are congruent. Which test proves it?', 'Higher GM11 Your Turn Q4 (SSS)', pairFig(t, { ...t, pts: flip(t.pts) }, 'Two triangles, each with sides 8 cm, 7 cm and 5 cm. The second is flipped over.'),
    options('SSS', { SAS: 'No angles are marked, but all three sides are given.', ASA: 'No angles are marked.', RHS: 'There is no right angle.' }),
    'SSS', 'What do you know about each triangle?', {
      kind: 'step-worked', start: 'Sides 8 cm, 7 cm and 5 cm in both', steps: [
        { title: 'Three sides', why: 'All three sides match and no angle is given: side, side, side.', words: 'SSS' },
      ],
    })
}

{
  const t: PairTri = { pts: sas(8, 5, 60), sides: [{ label: '8 cm' }, undefined, { label: '5 cm' }], angles: [{ at: 0, label: '60°' }] }
  ask(tests, 'These two triangles are congruent. Which test proves it?', 'Higher GM11 Your Turn Q4 (SAS)', pairFig(t, { ...t, pts: flip(t.pts) }, 'Two triangles, each with sides 8 cm and 5 cm and a 60° angle between them. The second is flipped over.'),
    options('SAS', { SSS: 'Only two sides are given.', ASA: 'Only one angle is given.', RHS: 'There is no right angle.' }),
    'SAS', 'Is the angle between the two sides?', {
      kind: 'step-worked', start: 'Sides 8 cm and 5 cm, angle 60°', steps: [
        { title: 'Angle between sides', why: 'The 60° angle is where the 8 cm and 5 cm sides meet: side, angle, side.', words: 'SAS' },
      ],
    })
}

{
  const t: PairTri = { pts: [[0, 0], [Math.sqrt(39), 0], [0, 5]], sides: [undefined, { label: '8 cm' }, { label: '5 cm' }], right: 0 }
  ask(tests, 'These two right-angled triangles are congruent. Which test proves it?', 'Higher GM11 RHS (own numbers)', pairFig(t, { ...t, pts: flip(t.pts) }, 'Two right-angled triangles, each with a hypotenuse of 8 cm and another side of 5 cm.'),
    options('RHS', { SAS: 'The right angle isn’t between the 8 cm and 5 cm sides.', SSS: 'Only two sides are given.', ASA: 'Only one angle is given.' }),
    'RHS', 'Look for the right angle and the longest side.', {
      kind: 'step-worked', start: 'Right angle, sides 8 cm and 5 cm', steps: [
        { title: 'Right angle, hypotenuse', why: 'Each has a right angle, the same hypotenuse opposite it, and one more side the same.', words: 'RHS' },
      ],
    })
}

{
  // Example 2: A has 43° and 71° with 18 mm between them; C has the same angles, but 18 mm is not between them.
  const A: PairTri = { pts: asa(18, 43, 71), sides: [{ label: '18 mm' }], angles: [{ at: 0, label: '43°' }, { at: 1, label: '71°' }] }
  const C: PairTri = { pts: asa(18, 71, 66), sides: [{ label: '18 mm' }], angles: [{ at: 0, label: '71°' }, { at: 2, label: '43°' }] }
  ask(tests, 'Is triangle C (right) congruent to triangle A (left)?', 'Higher GM11 Example 2 (p194)', pairFig(A, C, 'Triangle A has angles 43° and 71° with the 18 mm side between them. Triangle C has angles 71° and 43°, but its 18 mm side runs from the 71° corner to an unmarked one.'),
    options('No: its 18 mm side isn’t between the two angles', {
      'Yes, by ASA': 'ASA needs the side between the two angles. In C, the 43° angle is at the top, away from the 18 mm side.',
      'Yes, by SAS': 'SAS needs two sides. Only one is given.',
      'Yes, because the angles match': 'Matching angles alone only make them the same shape, not the same size.',
    }), 'No: its 18 mm side isn’t between the two angles', 'Where does the 18 mm side sit in each?', {
      kind: 'step-worked', start: 'A: 43°, 71° and 18 mm between', steps: [
        { title: 'Find the side', why: 'In A the side runs between the 43° and 71° corners. In C it runs from the 71° corner to the third corner.', words: 'No: its 18 mm side isn’t between the two angles' },
      ],
    })
}

{
  const t: PairTri = { pts: asa(5, 50, 60), angles: [{ at: 0, label: '50°' }, { at: 1, label: '60°' }, { at: 2, label: '70°' }] }
  // The small one's angles are only arcs: its labels wouldn't fit, and the question gives them.
  const big: PairTri = { ...t, pts: asa(7.5, 50, 60) }
  t.angles = t.angles!.map(angle => ({ ...angle, label: '' }))
  ask(tests, 'Both triangles have angles 50°, 60° and 70°. Are they congruent?', 'Higher GM11 (three angles)', pairFig(t, big, 'Two triangles with the same three angles, 50°, 60° and 70°. The second is bigger.'),
    options('Not proven: they could be different sizes', {
      'Yes, by ASA': 'ASA needs a side between the angles to be the same too. No side is given.',
      'Yes, by SSS': 'No sides are given.',
      'Yes, by RHS': 'There is no right angle.',
    }), 'Not proven: they could be different sizes', 'Do you know any side?', {
      kind: 'step-worked', start: 'Angles 50°, 60° and 70° in both', steps: [
        { title: 'Look for a side', why: 'Equal angles only make them the same shape. Without a side, one could be an enlargement of the other.', words: 'Not proven: they could be different sizes' },
      ],
    })
}

{
  // A short proof, set out step by step, then the book's Your Turn Q5.
  const PQR: PairTri = { pts: asa(6, 55, 65), names: ['P', 'Q', 'R'] }
  const LMN: PairTri = { pts: flip(asa(6, 55, 65)), names: ['L', 'M', 'N'] }
  const pic = pairFig(PQR, LMN, 'Two triangles, PQR and LMN.', undefined, 3)
  worked(tests, 'PQ = LM, PR = LN and angle QPR = angle MLN. Prove triangles PQR and LMN are congruent.', 'Writing a proof', 'Higher GM11 Your Turn Q5 (own letters)', boardModel([], [
    { title: 'A pair of sides', say: 'Write each fact you use, with where it came from.', rows: ['PQ = LM (given)'], picture: pic },
    { title: 'Another pair', say: 'The second pair of equal sides.', rows: ['PR = LN (given)'] },
    { title: 'The angle between', say: 'Angle QPR is where PQ and PR meet, and angle MLN is where LM and LN meet.', rows: ['QPR = MLN (given, between the sides)'] },
    { title: 'Conclude', say: 'Two sides and the angle between them: name the test to finish.', rows: ['! PQR and LMN are congruent (SAS)'] },
  ], 'Prove it', pic), 'A congruence proof lists the three equal parts, each with its reason, then names the test.')
}

{
  const ABC: PairTri = { pts: [[0, 0], [5, 0], [4.2, 2.6]], names: ['A', 'C', 'B'], angles: [{ at: 2, label: '' }] }
  const XYZ: PairTri = { ...ABC, pts: flip(ABC.pts), names: ['Z', 'Y', 'X'] }
  ask(tests, 'AB = XZ, CB = XY and angle CBA = angle ZXY. Which test proves triangles ABC and XYZ are congruent?', 'Higher GM11 Your Turn Q5 (Level 6-7)', pairFig(ABC, XYZ, 'Triangles ABC and XYZ, with the angle at B and the angle at X marked.', undefined, 2.5),
    options('SAS', { ASA: 'Only one pair of angles is given.', SSS: 'Only two pairs of sides are given.', RHS: 'There is no right angle.' }),
    'SAS', 'Is the equal angle between the equal sides?', {
      kind: 'step-worked', start: 'AB = XZ, CB = XY, CBA = ZXY', steps: [
        { title: 'Angle between sides', why: 'Angle CBA is where AB and CB meet, and angle ZXY is where XZ and XY meet.', words: 'SAS' },
      ],
    })
}

export const congruenceTests: HigherAddition = { lessonId: 'L210', skill: tests, label: 'Proving congruence', states: a.finish() }
