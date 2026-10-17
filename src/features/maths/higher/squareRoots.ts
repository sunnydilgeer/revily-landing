/*
 * Lesson 12 (Estimating), Higher section: estimating square roots. From the Higher revision guide, N13 Type 3
 * (Level 6-7) and its Your Turn Q5: find the square numbers either side, so the root is between their roots, then
 * pick an estimate nearer the closer one. Any estimate on the right side of the halfway point gets the mark.
 */
import { author } from '../../written-methods/tutor/content'
import { line, part, sign, type StepWorking } from '../../written-methods/tutor/stepWorking'
import { between, choose, screens, type HigherAddition } from './helpers'

const skill = 'estimating-square-roots'
const a = author(12, 'L12-H')
const { worked, practice } = screens(a)

/** √n between two whole numbers, on a number line from the square below to the square above. */
function rootWorking(n: number, estimate: string, start = `√${n}`): StepWorking {
  const low = Math.floor(Math.sqrt(n)), high = low + 1
  const below = n - low * low, above = high * high - n
  const nearer = below <= above ? low : high
  const picture = (boxed?: number) => ({
    kind: 'number-line' as const, min: low * low, max: high * high, tick: 1, labels: [low * low, n, high * high],
    marks: [{ value: low * low, label: `${low}²`, boxed: boxed === low }, { value: n, label: String(n), pick: true }, { value: high * high, label: `${high}²`, boxed: boxed === high }],
  })
  return {
    kind: 'step-worked', start, steps: [
      { title: 'Squares either side', why: `Find the square numbers just below and just above ${n}.`, picture: picture(), lines: [line([part(`${low}²`, 0)], low * low, { eq: true }), line([part(`${high}²`, 1)], high * high, { eq: true })] },
      { title: 'Take the square roots', why: `${n} is between ${low * low} and ${high * high}, so its square root is between ${low} and ${high}.`, lines: [line([part(low, 0), sign('<'), part(`√${n}`, 3), sign('<'), part(high, 1)])] },
      { title: 'Which is closer?', why: `${n} is ${below} away from ${low * low} and ${above} away from ${high * high}, so the root is closer to ${nearer}.`, picture: picture(nearer), lines: [line([part(n), sign('−'), part(low * low, 0)], below), line([part(high * high, 1), sign('−'), part(n)], above, { mark: `closer to ${nearer}` })] },
      { title: 'Write the estimate', why: `Pick a number between ${low} and ${high} that is closer to ${nearer}. Any estimate on that side of ${low}.5 gets the mark.`, lines: [line([part(`√${n}`, 3), sign('≈')], estimate, { answer: true })] },
    ],
  }
}
/** Accepts any estimate strictly between the whole number the root is closer to and the halfway point. */
function rootAnswer(n: number, example: number) {
  const low = Math.floor(Math.sqrt(n)), closerToLow = n - low * low <= (low + 1) ** 2 - n
  return closerToLow
    ? between(example, low, low + 0.5, `Any number between ${low} and ${low}.5, for example ${example}`)
    : between(example, low + 0.5, low + 1, `Any number between ${low}.5 and ${low + 1}, for example ${example}`)
}

worked(skill, 'Find an estimate for √40.', 'Higher N13 Type 3', rootWorking(40, '6.3'),
  'The square root of 40 is the number you square to make 40. Use the square numbers you know either side of it.')

practice(skill, 'Which two whole numbers is √70 between?', 'Higher N13 extra practice', choose([
  '8 and 9',
  '7 and 8',
  '35 and 36',
]), '8 and 9', 'Which square numbers are either side of 70?', {
  kind: 'step-worked', start: '√70', steps: [
    { title: 'Squares either side', why: 'Find the square numbers just below and just above 70.', lines: [line([part('8²', 0)], 64, { eq: true }), line([part('9²', 1)], 81, { eq: true })] },
    { title: 'Write the answer', why: '70 is between 64 and 81, so its square root is between their square roots.', words: '8 and 9' },
  ],
})
practice(skill, 'Find an estimate for √20.', 'Higher N13 extra practice', rootAnswer(20, 4.4), '4.4', '16 and 25 are the square numbers either side of 20.', rootWorking(20, '4.4'))
practice(skill, 'Find an estimate for √98.', 'Higher N13 Your Turn Q5', rootAnswer(98, 9.9), '9.9', '81 and 100 are the square numbers either side of 98.', rootWorking(98, '9.9'))
practice(skill, 'Ben estimates √98 as 10. Is 10 an overestimate or an underestimate?', 'Higher N13 Your Turn Q5', choose([
  'An overestimate, because 10² is 100, which is more than 98',
  'An underestimate, because 98 is less than 100',
  'Neither, because √98 is exactly 10',
]), 'An overestimate, because 10² is 100, which is more than 98', 'Square the estimate and compare it with 98.', {
  kind: 'step-worked', start: '√98 ≈ 10', steps: [
    { title: 'Square the estimate', why: 'Squaring the estimate shows which number it is the square root of.', lines: [line([part('10²', 0)], 100, { eq: true, mark: 'more than 98' })] },
    { title: 'Write the answer', why: '10 is the square root of 100, which is too big, so 10 is a bit too big for √98.', words: 'An overestimate, because 10² is 100, which is more than 98' },
  ],
})
practice(skill, 'A square rug has an area of 30 m². Find an estimate for the length of one side.', 'Higher N13 extra practice', rootAnswer(30, 5.4), '5.4 m', 'The side of a square is the square root of its area.', rootWorking(30, '5.4 m', 'side = √30'), 'Side (m)')
practice(skill, 'Find an estimate for √55.', 'Higher N13 extra practice', rootAnswer(55, 7.4), '7.4', '49 and 64 are the square numbers either side of 55.', rootWorking(55, '7.4'))

export const squareRoots: HigherAddition = { lessonId: 'L012', skill, label: 'Estimating square roots', states: a.finish() }
