/*
 * Lesson 206 (Areas of shapes), a Higher section. From the Higher revision guide, GM6 Areas of Shapes (Level 6-7,
 * p180–181): Area of a Triangle 2, Area = ½ab sin C, where a and b are two sides and C is the angle between them. Your
 * Turn Q4 works back from the area (1.47 m²) to a side: x = 3.12 m. Each triangle is drawn to scale.
 */
import { author } from '../../written-methods/tutor/content'
import type { FigurePoint } from '../../written-methods/tutor/methodWorking'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import { boardModel, choose, number } from '../../simultaneous-equations/tutor/boardWorkings'
import { screens, triangleFig, type TriAngle, type TriSide } from '../../geometry/tutor/figureLesson'
import { asks } from './figureHelpers'
import { text, type HigherAddition } from './helpers'

const sine = 'triangle-area-sine'
const a = author(206, 'L206-H')
const { add } = a
const { worked } = screens(a)
const ask = asks(a)

type Pt = FigurePoint
const rad = (deg: number) => deg * Math.PI / 180
/** A triangle with sides `a` (along the bottom) and `b` meeting at C, bottom left, with angle `angle` between them. */
function sas(a: number, b: number, angle: number, o: { sides?: (TriSide | undefined)[]; angles?: TriAngle[]; spoken: string; caption?: string }) {
  const pts: [Pt, Pt, Pt] = [[0, 0], [a, 0], [b * Math.cos(rad(angle)), b * Math.sin(rad(angle))]]
  return triangleFig(pts, { ...o, names: ['C', 'B', 'A'] })
}

add(sine, 'Area with ½ab sin C', 'Higher GM6 Area of a Triangle 2', text(
  'When you know two sides of a triangle and the angle between them, there is no need for the height.',
  'Area = ½ab sin C, where a and b are the two sides and C is the angle between them.',
  'The angle must be the one between the two sides you use.',
  'Make sure your calculator is in degrees.',
))

{
  const at = (tone?: 'lit' | 'found') => sas(9, 7, 40, { sides: [{ label: '9 cm', tone: tone === 'lit' ? 'lit' : undefined }, undefined, { label: '7 cm', tone: tone === 'lit' ? 'lit' : undefined }], angles: [{ at: 0, label: '40°', tone: tone === 'lit' ? 'lit' : undefined }], spoken: 'A triangle with sides 9 cm and 7 cm and the angle of 40° between them.', caption: tone === 'found' ? 'Area = 20.2 cm²' : undefined })
  worked(sine, 'Find the area of this triangle, to 1 decimal place.', 'Area = ½ab sin C', 'Higher GM6 Area of a Triangle 2 (own numbers)', boardModel([], [
    { title: 'Two sides, one angle', say: 'The two sides are 9 cm and 7 cm, and the 40° angle is between them.', rows: ['>0 a = 9 cm, b = 7 cm, C = 40°'], picture: at('lit') },
    { title: 'Use the formula', say: 'Half of a times b times sin C. Round at the end.', rows: ['A = {1|2} × 9 × 7 × sin 40°', '= 20.247…', '! A = 20.2 cm²'], picture: at('found') },
  ], 'Find the area', at()), 'Area = ½ab sin C: two sides and the angle between them. It works for any triangle, with no height needed.')
}

{
  const p = sas(15, 12, 110, { sides: [{ label: '15 m' }, undefined, { label: '12 m' }], angles: [{ at: 0, label: '110°' }], spoken: 'A triangle with sides 15 m and 12 m and the angle of 110° between them.' })
  ask(sine, 'Find the area of this triangle, to 1 decimal place.', 'Higher GM6 Area of a Triangle 2 (own numbers)', p, number(84.6, '84.6 m²'), '84.6 m²', 'Half of 15 times 12 times sin 110°.', {
    kind: 'step-worked', start: 'a = 15 m, b = 12 m, C = 110°', steps: [
      { title: 'Halve a times b', why: 'Halve the product of the two sides first.', lines: [line([part('0.5'), sign('×'), part('15'), sign('×'), part('12')], '90')] },
      { title: 'Times sin C', why: 'Multiply by the sine of the angle between them, then round to one decimal place.', lines: [line([part('90'), sign('×'), part('sin 110°')], '84.6 m²', { answer: true })] },
    ],
  }, { label: 'Area (m²)', prefix: 'A =' })
}

{
  // Your Turn Q4: area 1.47 m², one side 2.15 m, the angle 26°, the other side x.
  const pts: [Pt, Pt, Pt] = [[0, 0], [3.12, 0], [2.15 * Math.cos(rad(26)), 2.15 * Math.sin(rad(26))]]
  const p = triangleFig(pts, { sides: [{ label: 'x', tone: 'x' }, undefined, { label: '2.15 m' }], angles: [{ at: 0, label: '26°' }], spoken: 'A triangle with area 1.47 m². One side is 2.15 m, the angle next to it is 26°, and the other side next to that angle is x.' })
  ask(sine, 'The triangle has area 1.47 m². Work out the length of x, to 2 decimal places.', 'Higher GM6 Your Turn Q4 (Level 6-7)', p, number(3.12, '3.12 m'), '3.12 m', 'Put what you know into ½ab sin C, then divide.', {
    kind: 'step-worked', start: 'Area = 1.47 m²', steps: [
      { title: 'Write the formula', why: 'The two sides either side of the angle are 2.15 m and x.', lines: [line([part('½ × 2.15 × x × sin 26°')], '1.47', { eq: true })] },
      { title: 'Work out the numbers', why: 'Half of 2.15 times sin 26° is one number, so the area is that number times x.', lines: [line([part('0.5'), sign('×'), part('2.15'), sign('×'), part('sin 26°')], '0.4712…')] },
      { title: 'Divide', why: 'Divide the area by that number to find x, then round to two decimal places.', lines: [line([part('1.47'), sign('÷'), part('0.4712…')], '3.12 m', { answer: true })] },
    ],
  }, { label: 'x (m)', prefix: 'x =' })
}

{
  const pts: [Pt, Pt, Pt] = [[0, 0], [8, 0], [6 * Math.cos(rad(50)), 6 * Math.sin(rad(50))]]
  const p = triangleFig(pts, { sides: [{ label: '8 cm' }, undefined, { label: '6 cm' }], angles: [{ at: 0, label: '50°' }, { at: 1, label: '48°' }], spoken: 'A triangle with sides 8 cm and 6 cm meeting at a 50° angle. Another corner is 48°.' })
  ask(sine, 'Which calculation gives the area of this triangle?', 'Higher GM6 Area of a Triangle 2 (choosing the angle)', p,
    choose('½ × 8 × 6 × sin 50°',
      ['½ × 8 × 6 × sin 48°', 'The 48° angle isn’t between the 8 cm and 6 cm sides. Use the angle where they meet.'],
      ['8 × 6 × sin 50°', 'Don’t forget the half.'],
      ['½ × 8 × 6', 'That is only right when the angle between them is 90°.']),
    '½ × 8 × 6 × sin 50°', 'Use the angle between the two sides you know.', {
      kind: 'step-worked', start: 'Sides 8 cm and 6 cm', steps: [
        { title: 'Find the angle between', why: 'The 8 cm and 6 cm sides meet at the 50° corner, so that is angle C.', words: '½ × 8 × 6 × sin 50°' },
      ],
    })
}

export const triangleAreaSine: HigherAddition = { lessonId: 'L206', skill: sine, label: 'Area with ½ab sin C', states: a.finish() }
