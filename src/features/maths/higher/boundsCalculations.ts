/*
 * Lesson 13 (Bounds and truncation), Higher section: the biggest and smallest answer a calculation can give. From the
 * Higher revision guide, N14 Skill 2 (Level 6-7): find each value's bounds first, then pick the bound that makes the
 * answer biggest (or smallest). Multiplying and adding use the same bounds; dividing and subtracting use opposite ones.
 */
import { author } from '../../written-methods/tutor/content'
import { line, part, sign, type StepLine, type StepWorking } from '../../written-methods/tutor/stepWorking'
import { choose, number, screens, type HigherAddition } from './helpers'

const skill = 'bounds-calculations'
const a = author(13, 'L13-H')
const { worked, practice } = screens(a)

type Bound = { name: string; value: string; lower: string; upper: string; unit?: string }
const u = (value: string, unit?: string) => unit ? `${value} ${unit}` : value
/** "33.5 ≤ length < 34.5": what the rounded value could really be. */
const boundLine = ({ name, lower, upper, unit }: Bound, family: number): StepLine =>
  line([part(u(lower, unit), family), sign('≤'), part(name), sign('<'), part(u(upper, unit), family)])
const findBounds = (bounds: Bound[], why: string) => ({ title: 'Find the bounds', why, lines: bounds.map(boundLine) })

worked(skill, 'A field is 34 m long and 28 m wide, each to the nearest metre. Work out the smallest and largest its area could be.', 'Higher N14 Skill 2', {
  kind: 'step-worked', start: 'area = 34 × 28', steps: [
    findBounds([{ name: 'length', value: '34', lower: '33.5', upper: '34.5', unit: 'm' }, { name: 'width', value: '28', lower: '27.5', upper: '28.5', unit: 'm' }],
      'Each length was rounded to the nearest metre, so it could be up to half a metre less or more.'),
    { title: 'Smallest area', why: 'Multiply the two lower bounds: the smallest length and the smallest width.', lines: [line([part('33.5', 0), sign('×'), part('27.5', 1)], '921.25 m²')] },
    { title: 'Largest area', why: 'Multiply the two upper bounds. The area can get as close as you like to this, but never reach it.', lines: [line([part('34.5', 0), sign('×'), part('28.5', 1)], '983.25 m²')] },
    { title: 'Write the interval', why: 'The smallest area is included. The largest is not, because the lengths never quite reach their upper bounds.', lines: [line([part('921.25 m²'), sign('≤'), part('area'), sign('<')], '983.25 m²', { answer: true })] },
  ],
}, 'When a calculation uses rounded numbers, work out each number’s bounds first. Then choose the bounds that make the answer as small, or as big, as it can be.')

practice(skill, 'A square tile has sides of 12 cm, to the nearest cm. Work out the upper bound of its perimeter.', 'Higher N14 extra practice', number(50, '50 cm'), '50 cm', 'The perimeter is 4 sides. Use the biggest each side could be.', {
  kind: 'step-worked', start: 'perimeter = 4 × 12', steps: [
    findBounds([{ name: 'side', value: '12', lower: '11.5', upper: '12.5', unit: 'cm' }], 'The side was rounded to the nearest cm, so it could be up to half a cm more.'),
    { title: 'Largest perimeter', why: 'Use the upper bound for every side.', lines: [line([part('4'), sign('×'), part('12.5', 0)], '50 cm', { answer: true })] },
  ],
}, 'Perimeter (cm)')

practice(skill, 'A rectangle is 8 cm by 5 cm, each to the nearest cm. Work out the lower bound of its area.', 'Higher N14 extra practice', number(33.75, '33.75 cm²'), '33.75 cm²', 'Multiply the two lower bounds.', {
  kind: 'step-worked', start: 'area = 8 × 5', steps: [
    findBounds([{ name: 'length', value: '8', lower: '7.5', upper: '8.5', unit: 'cm' }, { name: 'width', value: '5', lower: '4.5', upper: '5.5', unit: 'cm' }], 'Each length was rounded to the nearest cm, so it could be up to half a cm less.'),
    { title: 'Smallest area', why: 'Multiply the two lower bounds.', lines: [line([part('7.5', 0), sign('×'), part('4.5', 1)], '33.75 cm²', { answer: true })] },
  ],
}, 'Area (cm²)')

practice(skill, 'Speed = distance ÷ time. Which gives the largest possible speed?', 'Higher N14 extra practice', choose([
  'Upper bound of distance ÷ lower bound of time',
  'Upper bound of distance ÷ upper bound of time',
  'Lower bound of distance ÷ lower bound of time',
]), 'Upper bound of distance ÷ lower bound of time', 'Dividing by a smaller number gives a bigger answer.', {
  kind: 'step-worked', start: 'speed = distance ÷ time', steps: [
    { title: 'Biggest top', why: 'The more distance covered, the faster. Use the upper bound of the distance.', lines: [line([part('distance', 0)], 'upper bound')] },
    { title: 'Smallest bottom', why: 'Dividing by a smaller number gives a bigger answer, so use the lower bound of the time.', lines: [line([part('time', 1)], 'lower bound')] },
    { title: 'Write the answer', why: 'Dividing works the opposite way to multiplying: the biggest answer uses a big top and a small bottom.', words: 'Upper bound of distance ÷ lower bound of time' },
  ],
})

practice(skill, 'A runner covers 52 m, to the nearest metre, in 4 seconds, to the nearest second. Work out the upper bound of her speed.', 'Higher N14 extra practice', number(15, '15 m/s'), '15 m/s', 'Largest distance ÷ smallest time.', {
  kind: 'step-worked', start: 'speed = 52 ÷ 4', steps: [
    findBounds([{ name: 'distance', value: '52', lower: '51.5', upper: '52.5', unit: 'm' }, { name: 'time', value: '4', lower: '3.5', upper: '4.5', unit: 's' }], 'Each value was rounded to the nearest whole unit, so it could be up to half a unit less or more.'),
    { title: 'Largest speed', why: 'Divide the upper bound of the distance by the lower bound of the time.', lines: [line([part('52.5', 0), sign('÷'), part('3.5', 1)], '15 m/s', { answer: true })] },
  ],
}, 'Speed (m/s)')

practice(skill, 'A plank is 2.4 m long, to 1 decimal place. A piece 1.6 m long, to 1 decimal place, is cut off. Work out the lower bound of the length left.', 'Higher N14 extra practice', number(0.7, '0.7 m'), '0.7 m', 'The least is left when the plank is as short as it can be and the piece cut off is as long as it can be.', {
  kind: 'step-worked', start: 'left = 2.4 − 1.6', steps: [
    findBounds([{ name: 'plank', value: '2.4', lower: '2.35', upper: '2.45', unit: 'm' }, { name: 'piece', value: '1.6', lower: '1.55', upper: '1.65', unit: 'm' }], 'Each length was rounded to 1 decimal place, so it could be up to 0.05 m less or more.'),
    { title: 'Smallest length left', why: 'Subtracting works the opposite way: take the biggest piece from the smallest plank.', lines: [line([part('2.35', 0), sign('−'), part('1.65', 1)], '0.7 m', { answer: true })] },
  ],
}, 'Length left (m)')

practice(skill, 'A square has sides of 6 cm, to the nearest cm. Work out the lower bound of its area.', 'Higher N14 extra practice', number(30.25, '30.25 cm²'), '30.25 cm²', 'Square the lower bound of the side.', {
  kind: 'step-worked', start: 'area = 6²', steps: [
    findBounds([{ name: 'side', value: '6', lower: '5.5', upper: '6.5', unit: 'cm' }], 'The side was rounded to the nearest cm, so it could be up to half a cm less.'),
    { title: 'Smallest area', why: 'Square the lower bound of the side.', lines: [line([part('5.5', 0), sign('×'), part('5.5', 0)], '30.25 cm²', { answer: true })] },
  ],
}, 'Area (cm²)')

// N14 Your Turn Q4 and Q5 (Level 6-7): bounds from significant figures and decimal places, not just whole numbers.
practice(skill, 'F = P ÷ v. P is 145 watts to 3 significant figures, and v is 23.4 m/s to 1 decimal place. Work out the lower bound of F, to 3 significant figures.', 'Higher N14 Your Turn Q4', number(6.16, '6.16 N'), '6.16 N', 'Smallest top, biggest bottom.', {
  kind: 'step-worked', start: 'F = 145 ÷ 23.4', steps: [
    findBounds([{ name: 'P', value: '145', lower: '144.5', upper: '145.5', unit: 'W' }, { name: 'v', value: '23.4', lower: '23.35', upper: '23.45', unit: 'm/s' }],
      'To 3 significant figures, 145 could be half a unit either way. To 1 decimal place, 23.4 could be half of a tenth either way.'),
    { title: 'Smallest F', why: 'Dividing works the opposite way: the smallest top over the biggest bottom.', lines: [line([part('144.5', 0), sign('÷'), part('23.45', 1)], '6.162…')] },
    { title: 'Round it', why: 'Give the answer to 3 significant figures, as the question asks.', lines: [line([part('6.162…')], '6.16 N', { answer: true })] },
  ],
}, 'Lower bound of F (N)')
practice(skill, 'A car travels 80.3 miles, to 1 decimal place, in 1.87 hours, to 2 decimal places. Work out the upper bound of its average speed, to 3 significant figures.', 'Higher N14 Your Turn Q5', number(43.1, '43.1 mph'), '43.1 mph', 'Biggest distance, smallest time.', {
  kind: 'step-worked', start: 'speed = 80.3 ÷ 1.87', steps: [
    findBounds([{ name: 'distance', value: '80.3', lower: '80.25', upper: '80.35', unit: 'miles' }, { name: 'time', value: '1.87', lower: '1.865', upper: '1.875', unit: 'hours' }],
      'The distance could be half of a tenth either way, and the time half of a hundredth either way.'),
    { title: 'Largest speed', why: 'The biggest distance over the smallest time.', lines: [line([part('80.35', 0), sign('÷'), part('1.865', 1)], '43.08…')] },
    { title: 'Round it', why: 'Give the answer to 3 significant figures.', lines: [line([part('43.08…')], '43.1 mph', { answer: true })] },
  ],
}, 'Upper bound of speed (mph)')
practice(skill, 'The same car’s speed is between 42.8 mph and 43.08 mph. Give its speed to a suitable degree of accuracy.', 'Higher N14 Your Turn Q5', number(43, '43 mph'), '43 mph', 'Round both bounds the same way until they agree.', {
  kind: 'step-worked', start: '42.8 ≤ speed < 43.08…', steps: [
    { title: 'Smallest speed', why: 'The smallest distance over the biggest time.', lines: [line([part('80.25', 0), sign('÷'), part('1.875', 1)], '42.8')] },
    { title: 'Try 3 figures', why: 'To 3 significant figures the two bounds disagree, so that is too accurate.', lines: [line([part('42.8')], '42.8'), line([part('43.08…')], '43.1', { mark: '✗ different' })] },
    { title: 'Try 2 figures', why: 'To 2 significant figures both bounds round the same, so that is the suitable accuracy.', lines: [line([part('42.8')], '43'), line([part('43.08…')], '43 mph', { answer: true, mark: '✓ same' })] },
  ],
}, 'Speed (mph)')

export const boundsCalculations: HigherAddition = { lessonId: 'L013', skill, label: 'Bounds of a calculation', states: a.finish() }
