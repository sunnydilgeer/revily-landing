/*
 * Lesson 211 (Similar shapes), a Higher section. From the Higher revision guide, GM12 Similar Shapes (Level 6-7 and 8-9,
 * p196–198): areas go up by the scale factor squared and volumes by the scale factor cubed. The book's Example 2 (side
 * 7 and 28 cm, area 320 cm², A = 20 cm²), Example 3 (sides 11 and 22, volume 600, B = 4800), Your Turn Q1 (P: 3 and
 * 2 cm, area 6 cm²; Q: x and 5 cm, so x = 7.5 cm and Q's area 37.5 cm²), Q4 (spheres of radius 3x and x: surface areas
 * 9 : 1) and Q5 (rectangles ABEF and ACDF with FE = 5 cm and BC = 20 cm: scale factor √5), and three of our own that
 * work back from areas and volumes.
 */
import { author } from '../../written-methods/tutor/content'
import type { FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import { boardModel, choose, number } from '../../simultaneous-equations/tutor/boardWorkings'
import { screens } from '../../geometry/tutor/figureLesson'
import { cone, cylinder, sphere, squarePyramid } from '../../geometry/tutor/solidPictures'
import { asks, figure, pairFig, shiftItems, type PairTri } from './figureHelpers'
import { text, type HigherAddition } from './helpers'

const sim = 'similar-area-volume'
const a = author(211, 'L211-H')
const { worked } = screens(a)
const ask = asks(a)

type Pt = FigurePoint
const named = (at: Pt, name: string): FigureItem => ({ kind: 'text', at, text: name, name: true })
/** Two pictures side by side: the second `gap` units right of the first, which is `width` across. */
const sideBySide = (left: FigureItem[], right: FigureItem[], width: number, gap: number) => [...left, ...shiftItems(right, width + gap)]

a.add(sim, 'Area and volume', 'Higher GM12 Similar Shapes: Area and Volume', text(
  'Every length of a similar shape is times the scale factor. Areas and volumes grow faster.',
  'Length: times the scale factor.',
  'Area: times the scale factor squared.',
  'Volume: times the scale factor cubed.',
  'Multiply to find a measure on the bigger shape. Divide to find it on the smaller one.',
))

{
  // Example 2. The book doesn't draw A a quarter of B's size, so neither do we: it would be too small to read.
  const outline: Pt[] = [[0, 0], [1, 0], [1.35, 0.7], [0.8, 1.3], [0.05, 1.05]]
  const shape = (s: number, side: string, area: string, name: string, tone?: FigureTone): FigureItem[] => {
    const pts = outline.map(([x, y]) => [x * s, y * s] as Pt)
    return [{ kind: 'shape', points: pts, ...(tone === 'lit' ? { lit: true } : {}) }, { kind: 'measure', from: pts[0], to: pts[1], label: side, offset: 10, tone: tone === 'lit' ? 'lit' : 'given' },
      named([0.62 * s, 0.62 * s], name), ...(area ? [{ kind: 'text' as const, at: [0.62 * s, 0.62 * s] as Pt, text: area, tone: 'given' as const, dy: 22, small: true }] : [])]
  }
  const pic = (lit = false, areaA = '', caption = 'Not drawn accurately') => figure(sideBySide(shape(1.8, '7 cm', areaA, 'A', lit ? 'lit' : undefined), shape(3.6, '28 cm', '320 cm²', 'B', lit ? 'lit' : undefined), 1.35 * 1.8, 0.9),
    'Two similar shapes. A has a side of 7 cm; the matching side of B is 28 cm. B has area 320 square centimetres.', caption, 24)
  worked(sim, 'A and B are similar. B has area 320 cm². Work out the area of A.', 'Areas of similar shapes', 'Higher GM12 Example 2 (p196)', boardModel([], [
    { title: 'The scale factor', say: 'Divide the matching lengths, bigger by smaller.', rows: ['SF = 28 ÷ 7 = 4'], picture: pic(true) },
    { title: 'Square it for area', say: 'Areas go up by the scale factor squared.', rows: ['Area SF = 4² = 16'], picture: pic() },
    { title: 'Divide for the smaller', say: 'A is the smaller shape, so divide B’s area by 16.', rows: ['Area of A = 320 ÷ 16', '! Area of A = 20 cm²'], picture: pic(false, '20 cm²', 'Area of A = 20 cm²') },
  ], 'Find the area', pic()), 'Find the scale factor from two matching lengths, then square it for areas. Multiply for the bigger shape, divide for the smaller.')
}

{
  // Example 3: square-based pyramids with bases 11 and 22 cm.
  const pyr = (lit: boolean, vB: string) => figure(sideBySide(
    [...squarePyramid(2, 2.6, { b: { label: '11 cm', tone: lit ? 'lit' : 'given' } }), named([1.5, 1.3], 'A'), { kind: 'text', at: [1.5, 3.4], text: '600 cm³', small: true }],
    [...squarePyramid(4, 5.2, { b: { label: '22 cm', tone: lit ? 'lit' : 'given' } }), named([3, 2.4], 'B'), ...(vB ? [{ kind: 'text' as const, at: [3, 6.6] as Pt, text: vB, tone: 'found' as const, small: true }] : [])],
    3.1, 0.9), 'Two similar square-based pyramids. A has base 11 cm and volume 600 cubic centimetres; B has base 22 cm.', vB ? `Volume of B = ${vB}` : undefined, 24)
  worked(sim, 'A and B are similar. A has volume 600 cm³. Work out the volume of B.', 'Volumes of similar shapes', 'Higher GM12 Example 3 (p197)', boardModel([], [
    { title: 'The scale factor', say: 'The matching bases are 11 and 22.', rows: ['SF = 22 ÷ 11 = 2'], picture: pyr(true, '') },
    { title: 'Cube it for volume', say: 'Volumes go up by the scale factor cubed.', rows: ['Volume SF = 2³ = 8'], picture: pyr(false, '') },
    { title: 'Multiply for the bigger', say: 'B is the bigger shape, so multiply A’s volume by 8.', rows: ['Volume of B = 600 × 8', '! Volume of B = 4800 cm³'], picture: pyr(false, '4800 cm³') },
  ], 'Find the volume', pyr(false, '')), 'A shape twice as long is 2 × 2 × 2 = 8 times the volume: cube the scale factor.')
}

{
  // Your Turn Q1: P has sides 3 and 2 cm (its base, not given, drawn 2.5), Q is P times 2.5.
  const tri = (s: number): [Pt, Pt, Pt] => [[0, 0], [2.5 * s, 0], [2.25 * s, 1.984 * s]]
  const P: PairTri = { pts: tri(1), sides: [undefined, { label: '2 cm' }, { label: '3 cm' }], names: ['', '', 'P'] }
  const Q: PairTri = { pts: tri(2.5), sides: [undefined, { label: '5 cm' }, { label: 'x', tone: 'x' }], names: ['', '', 'Q'] }
  const pic = pairFig(P, Q, 'Two similar triangles. P has sides 3 cm and 2 cm and area 6 square centimetres. Q has the matching sides x and 5 cm.', 'Area of P = 6 cm²', 1.6)
  ask(sim, 'P and Q are similar. Calculate the missing length x.', 'Higher GM12 Your Turn Q1a (Level 6-7)', pic, number(7.5, '7.5 cm'), '7.5 cm', 'The 2 cm and 5 cm sides match. How many times bigger is Q?', {
    kind: 'step-worked', start: 'P: 3 cm and 2 cm. Q: x and 5 cm', steps: [
      { title: 'The scale factor', why: 'The right-hand sides match: divide the bigger by the smaller.', lines: [line([part('5'), sign('÷'), part('2')], '2.5')] },
      { title: 'Times the scale factor', why: 'Q is the bigger shape, so multiply P’s matching side.', lines: [line([part('3'), sign('×'), part('2.5')], '7.5 cm', { answer: true })] },
    ],
  }, { label: 'Length (cm)', prefix: 'x =' })
  ask(sim, 'The area of P is 6 cm². Calculate the area of Q.', 'Higher GM12 Your Turn Q1b (Level 6-7)', pic, number(37.5, '37.5 cm²'), '37.5 cm²', 'The scale factor is 2.5. Square it for areas.', {
    kind: 'step-worked', start: 'SF = 2.5, area of P = 6 cm²', steps: [
      { title: 'Square it', why: 'Areas go up by the scale factor squared.', lines: [line([part('2.5'), sign('×'), part('2.5')], '6.25')] },
      { title: 'Multiply for Q', why: 'Q is the bigger shape, so multiply P’s area.', lines: [line([part('6'), sign('×'), part('6.25')], '37.5 cm²', { answer: true })] },
    ],
  }, { label: 'Area (cm²)', prefix: 'Area =' })
}

{
  // Our own: from the areas back to a length.
  const rect = (w: number, h: number, wLabel: string, area: string, name: string, tone: FigureTone): FigureItem[] => [
    { kind: 'shape', points: [[0, 0], [w, 0], [w, h], [0, h]] }, { kind: 'measure', from: [0, 0], to: [w, 0], label: wLabel, offset: 10, tone },
    named([w / 2, h / 2 + 0.5], name), { kind: 'text', at: [w / 2, h / 2 - 0.4], text: area, small: true },
  ]
  const pic = figure(sideBySide(rect(4, 5, '4 cm', '20 cm²', 'A', 'given'), rect(6, 7.5, 'w', '45 cm²', 'B', 'x'), 4, 1.5), 'Two similar rectangles. A is 4 cm wide with area 20 square centimetres. B has area 45 square centimetres and width w.', undefined, 16)
  ask(sim, 'A and B are similar rectangles. Find B’s width, w.', 'Higher GM12 Area to length (own numbers)', pic, number(6, '6 cm'), '6 cm', 'The areas give the scale factor squared. Square root it to get the length scale factor.', {
    kind: 'step-worked', start: 'Areas 20 cm² and 45 cm², A is 4 cm wide', steps: [
      { title: 'Area scale factor', why: 'Divide the bigger area by the smaller.', lines: [line([part('45'), sign('÷'), part('20')], '2.25')] },
      { title: 'Square root it', why: 'The area scale factor is the length scale factor squared, so undo the square.', lines: [line([part('√2.25')], '1.5')] },
      { title: 'Times the width', why: 'B is the bigger shape, so multiply A’s width.', lines: [line([part('4'), sign('×'), part('1.5')], '6 cm', { answer: true })] },
    ],
  }, { label: 'Width (cm)', prefix: 'w =' })
}

{
  // Our own: a volume forwards, with cones.
  const solid = (r: number, h: number, label: string, name: string, volume = ''): FigureItem[] => [...shiftItems(cone(r, h), r, 0),
    { kind: 'measure', from: [2 * r + 0.5, 0], to: [2 * r + 0.5, h], label, offset: 8 }, named([r, -0.35 * r - 0.7], name),
    ...(volume ? [{ kind: 'text' as const, at: [r, h + 0.6] as Pt, text: volume, small: true }] : [])]
  const pic = figure(sideBySide(solid(2.4, 4, '4 cm', 'A', '24 cm³'), solid(6, 10, '10 cm', 'B'), 5.8, 2.6), 'Two similar cones. A is 4 cm tall with volume 24 cubic centimetres; B is 10 cm tall.', undefined, 16)
  ask(sim, 'Cones A and B are similar. A has volume 24 cm³. Find the volume of B.', 'Higher GM12 Volume (own numbers)', pic, number(375, '375 cm³'), '375 cm³', 'Find the scale factor from the heights, then cube it.', {
    kind: 'step-worked', start: 'Heights 4 cm and 10 cm, A is 24 cm³', steps: [
      { title: 'The scale factor', why: 'Divide the matching heights, bigger by smaller.', lines: [line([part('10'), sign('÷'), part('4')], '2.5')] },
      { title: 'Cube it', why: 'Volumes go up by the scale factor cubed.', lines: [line([part('2.5'), sign('×'), part('2.5'), sign('×'), part('2.5')], '15.625')] },
      { title: 'Multiply for B', why: 'B is the bigger cone, so multiply A’s volume.', lines: [line([part('24'), sign('×'), part('15.625')], '375 cm³', { answer: true })] },
    ],
  }, { label: 'Volume (cm³)', prefix: 'V =' })
}

{
  // Our own: from the volumes back to a length.
  const can = (r: number, h: number, label: string, tone: FigureTone, name: string, volume: string): FigureItem[] => [...shiftItems(cylinder(r, h, { h: { label, tone } }), r, 0),
    named([r, -0.32 * r - 0.8], name), { kind: 'text', at: [r, h + 0.32 * r + 0.6], text: volume, small: true }]
  const pic = figure(sideBySide(can(1.6, 2.5, '5 cm', 'given', 'A', '40 cm³'), can(4.8, 7.5, 'h', 'x', 'B', '1080 cm³'), 3.2, 3.8), 'Two similar cylinders. A is 5 cm tall with volume 40 cubic centimetres. B has volume 1080 cubic centimetres and height h.', undefined, 16)
  ask(sim, 'A and B are similar cylinders. Find the height of B, h.', 'Higher GM12 Volume to length (own numbers)', pic, number(15, '15 cm'), '15 cm', 'The volumes give the scale factor cubed. Cube root it.', {
    kind: 'step-worked', start: 'Volumes 40 cm³ and 1080 cm³, A is 5 cm tall', steps: [
      { title: 'Volume scale factor', why: 'Divide the bigger volume by the smaller.', lines: [line([part('1080'), sign('÷'), part('40')], '27')] },
      { title: 'Cube root it', why: 'The volume scale factor is the length scale factor cubed, so undo the cube.', lines: [line([part('∛27')], '3')] },
      { title: 'Times the height', why: 'B is the bigger cylinder, so multiply A’s height.', lines: [line([part('5'), sign('×'), part('3')], '15 cm', { answer: true })] },
    ],
  }, { label: 'Height (cm)', prefix: 'h =' })
}

{
  // Your Turn Q4: spheres of radius 3x and x.
  const pic = figure([...sphere(3, { label: '3x cm' }), ...shiftItems([...sphere(1), { kind: 'line', from: [0, 0], to: [1, 0] }, { kind: 'point', at: [0, 0] }, { kind: 'text', at: [1, 0], text: 'x cm', dx: 24 }], 5)], 'Two spheres. The bigger has radius 3x centimetres, the smaller radius x centimetres.', undefined, 16)
  ask(sim, 'Work out the ratio of the surface areas of these two similar spheres, in its simplest form.', 'Higher GM12 Your Turn Q4 (Level 8-9)', pic,
    choose('9 : 1', ['3 : 1', 'That’s the ratio of the radii. Surface area is an area: square the scale factor.'], ['27 : 1', 'That cubes the scale factor, which is for volumes. Area squares it.'], ['6 : 1', 'Square the scale factor: 3 × 3, not 3 × 2.']),
    '9 : 1', 'Find the length scale factor first. Surface area is an area.', {
      kind: 'step-worked', start: 'Radii 3x cm and x cm', steps: [
        { title: 'The scale factor', why: 'The radii match: 3x is three times x.', lines: [line([part('3x'), sign('÷'), part('x')], '3')] },
        { title: 'Square it', why: 'Surface area is an area, so square the scale factor. Write the bigger sphere first.', words: '9 : 1' },
      ],
    })
}

{
  // Your Turn Q5: ABEF is 5 by AF, ACDF is AF by 25, so AF² = 125.
  const h = 5 * Math.sqrt(5)
  const A: Pt = [0, h], B: Pt = [5, h], C: Pt = [25, h], D: Pt = [25, 0], E: Pt = [5, 0], F: Pt = [0, 0]
  const items: FigureItem[] = [{ kind: 'shape', points: [F, D, C, A] }, { kind: 'line', from: B, to: E },
    { kind: 'measure', from: F, to: E, label: '5 cm', offset: 12 }, { kind: 'measure', from: B, to: C, label: '20 cm', offset: -26, side: -1 },
    ...([[A, 'A', -10, -8], [B, 'B', 0, -10], [C, 'C', 10, -8], [D, 'D', 10, 14], [E, 'E', 0, 28], [F, 'F', -10, 14]] as [Pt, string, number, number][]).map(([at, t, dx, dy]) => ({ kind: 'text' as const, at, text: t, dx, dy }))]
  const pic = figure(items, 'A rectangle ACDF split by the line BE into a rectangle ABEF on the left, with FE = 5 cm, and a rectangle BCDE, with BC = 20 cm.', undefined, 26)
  ask(sim, 'Rectangles ABEF and ACDF are similar. Find the scale factor, in surd form.', 'Higher GM12 Your Turn Q5 (Level 8-9)', pic,
    choose('√5', ['5', 'That matches 5 with 25, but the 5 cm side matches AF: the short side of ACDF.'], ['√125', 'That’s the length of AF. Divide it by 5 to get the scale factor.'], ['25', 'That’s the scale factor for the areas, 125 ÷ 5. Lengths need the square root.']),
    '√5', 'ABEF’s short side is 5 and its long side is AF. ACDF’s short side is AF and its long side is 25.', {
      kind: 'step-worked', start: 'FE = 5 cm, BC = 20 cm', steps: [
        { title: 'Match the sides', why: 'The short sides are 5 and AF, the long sides AF and 25. Both pairs have the same scale factor.', lines: [line([part('5'), sign('+'), part('20')], '25')] },
        { title: 'Solve for AF', why: 'AF over 5 equals 25 over AF, so AF squared is 5 times 25.', lines: [line([part('5'), sign('×'), part('25')], '125'), line([part('AF = √125')], '5√5')] },
        { title: 'The scale factor', why: 'Divide AF by the matching short side, 5.', lines: [line([part('5√5'), sign('÷'), part('5')], '√5', { answer: true })] },
      ],
    })
}

export const similarAreaVolume: HigherAddition = { lessonId: 'L211', skill: sim, label: 'Area and volume', states: a.finish() }
