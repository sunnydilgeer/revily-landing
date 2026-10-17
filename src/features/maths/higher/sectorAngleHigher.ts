/*
 * Lesson 209 (Sectors and arcs), a Higher section. From the Higher revision guide, GM10 Circle Sectors and Arcs (p192):
 * working back from a sector's area or arc length to its angle. Your Turn Q3 (Level 4-5: radius 15 m, area 26.15 m²,
 * x = 13.3°) and Q5 (Level 6-7: a reflex sector, radius 9 m, area 160 m², x = 226° to 3 sf), and one arc length of
 * our own. Each answer is worked out from Math.PI.
 */
import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureTone } from '../../written-methods/tutor/methodWorking'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import { boardModel, number } from '../../simultaneous-equations/tutor/boardWorkings'
import { screens } from '../../geometry/tutor/figureLesson'
import { sectorFig } from '../../sectors/tutor/sectorsLesson'
import { asks } from './figureHelpers'
import { text, type HigherAddition } from './helpers'

const back = 'sector-angle-from-area'
const a = author(209, 'L209-H')
const { add } = a
const { worked } = screens(a)
const ask = asks(a)

/** The lesson's sector picture with its angle written as `label` (x before it is found) in that tone. */
function sector(angle: number, r: string, label: string, tone: FigureTone, marks: Parameters<typeof sectorFig>[2] = {}, caption?: string): AngleFrame {
  const frame = sectorFig(angle, r, marks, caption)
  const items = frame.figure!.items.map(item => item.kind === 'text' && item.text === `${angle}°` ? { ...item, text: label, tone } : item)
  return { ...frame, figure: { ...frame.figure!, items, spoken: frame.figure!.spoken.replace(`angle ${angle}°`, `angle ${label}`) } }
}

add(back, 'Finding the angle', 'Higher GM10 Circle Sectors and Arcs', text(
  'Sometimes you know a sector’s area (or arc length) and need its angle. Work backwards.',
  'Find the whole circle’s area (or circumference).',
  'Divide: the sector is that fraction of the whole circle.',
  'Times 360: the angle is the same fraction of a full turn.',
))

{
  const at = (tone: FigureTone, label = 'x', caption?: string) => sector(127, '6 cm', label, tone, { fill: tone !== 'x' }, caption)
  worked(back, 'This sector has area 40 cm². Find its angle, to 1 decimal place.', 'From the area to the angle', 'Higher GM10 (own numbers)', boardModel([], [
    { title: 'The whole circle', say: 'The whole circle’s area is πr²: π × 6² = 113.097….', rows: ['πr² = π × 6² = 113.097…'], picture: at('x') },
    { title: 'The fraction', say: 'The sector is 40 out of 113.097… of the circle.', rows: ['Fraction = {40|113.097…} = 0.3536…'], picture: at('lit') },
    { title: 'Times 360', say: 'The angle is that fraction of a whole turn, 360°.', rows: ['x = 0.3536… × 360', '! x = 127.3°'], picture: at('found', '127.3°', 'x = 127.3°') },
  ], 'Find x', at('x')), 'Angle = {sector area ÷ circle area} × 360. Keep the full calculator number until the end.')
}

ask(back, 'The sector has radius 15 m and area 26.15 m². Calculate x, to 1 decimal place.', 'Higher GM10 Your Turn Q3', sector(40, '15 m', 'x', 'x'),
  number(13.3, '13.3°'), '13.3°', 'The sector’s area over the whole circle’s area, times 360.', {
    kind: 'step-worked', start: 'r = 15 m, area 26.15 m²', steps: [
      { title: 'The whole circle', why: 'Work out the area of the whole circle first.', lines: [line([part('π × 15²')], '706.858…')] },
      { title: 'The fraction', why: 'The sector is this fraction of the whole circle.', lines: [line([part('26.15'), sign('÷'), part('706.858…')], '0.03699…')] },
      { title: 'Times 360', why: 'The angle is the same fraction of a whole turn. Round to one decimal place.', lines: [line([part('0.03699…'), sign('×'), part('360')], '13.3°', { answer: true })] },
    ],
  }, { label: 'Angle x (°)', prefix: 'x =' })

ask(back, 'The sector has radius 9 m and area 160 m². Work out the angle x, to 3 significant figures.', 'Higher GM10 Your Turn Q5 (Level 6-7)', sector(226, '9 m', 'x', 'x'),
  number(226, '226°'), '226°', 'The sector is more than half the circle, so expect an angle over 180°.', {
    kind: 'step-worked', start: 'r = 9 m, area 160 m²', steps: [
      { title: 'The whole circle', why: 'Work out the area of the whole circle first.', lines: [line([part('π × 9²')], '254.469…')] },
      { title: 'The fraction', why: 'The sector is this fraction of the whole circle.', lines: [line([part('160'), sign('÷'), part('254.469…')], '0.6287…')] },
      { title: 'Times 360', why: 'The angle is the same fraction of a whole turn. Round to three significant figures.', lines: [line([part('0.6287…'), sign('×'), part('360')], '226°', { answer: true })] },
    ],
  }, { label: 'Angle x (°)', prefix: 'x =' })

ask(back, 'The sector has radius 8 cm and arc length 10 cm. Find the angle x, to 1 decimal place.', 'Higher GM10 (own numbers, arc length)', sector(72, '8 cm', 'x', 'x', { arcLabel: '10 cm' }),
  number(71.6, '71.6°'), '71.6°', 'Use the whole circumference this time: πd.', {
    kind: 'step-worked', start: 'r = 8 cm, arc 10 cm', steps: [
      { title: 'The whole circumference', why: 'An arc is part of the circumference, so work that out first, with a diameter of sixteen.', lines: [line([part('π × 16')], '50.265…')] },
      { title: 'The fraction', why: 'The arc is this fraction of the whole circumference.', lines: [line([part('10'), sign('÷'), part('50.265…')], '0.1989…')] },
      { title: 'Times 360', why: 'The angle is the same fraction of a whole turn. Round to one decimal place.', lines: [line([part('0.1989…'), sign('×'), part('360')], '71.6°', { answer: true })] },
    ],
  }, { label: 'Angle x (°)', prefix: 'x =' })

export const sectorAngle: HigherAddition = { lessonId: 'L209', skill: back, label: 'Finding the angle', states: a.finish() }
