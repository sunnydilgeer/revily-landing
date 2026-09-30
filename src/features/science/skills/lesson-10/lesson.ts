import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsMathsFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'WS 4.6 (standard form, rearranging equations, using a calculator, proportionality) and the maths skills for science, as on the supplied revision page' }
const skill = 'W-DAT-010-W'
const a = author(skill, ['WS 4.6'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wsMathsSections = [
  { id: 'W10-01', label: 'Start here', detail: 'Huge and tiny numbers' },
  { id: 'W10-02', label: 'How do you write big and small numbers?', detail: 'Standard form, A × 10ⁿ' },
  { id: 'W10-05', label: 'How do you rearrange a formula?', detail: 'Do the same to both sides' },
  { id: 'W10-08', label: 'How do you use a calculator well?', detail: 'Brackets and exact values' },
  { id: 'W10-10', label: 'How are two variables related?', detail: 'Direct and inverse proportion' },
  { id: 'W10-12', label: 'On your own', detail: 'Convert, rearrange and spot the pattern' },
]

const states: ScienceState[] = [
  { ...a.choice('W10-01', 'The Sun is about 150 000 000 000 m from Earth. How can scientists write a number like this more easily?', ['With a shorter unit name', 'In standard form, as a number times a power of ten', 'By rounding it to 150 m', 'By writing it in words each time'], 1, 'Think about a way of writing very big or very small numbers with few digits.', ['Standard form writes a number as A × 10ⁿ, so this distance is 1.5 × 10¹¹ m.', 'It is shorter and easier to compare than a long row of zeros.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W10-02', 'How do you write big and small numbers?'),
  a.choice('W10-03', 'A weight lifter pushes with a force of 50 000 N. What is this in standard form?', ['50 × 10³ N', '5 × 10⁵ N', '0.5 × 10⁵ N', '5 × 10⁴ N'], 3, 'Move the decimal point until you have a number between 1 and 10.', ['Moving the point 4 places to the left gives 5.', 'So 50 000 N is 5 × 10⁴ N.'], 'calculation'),
  a.choice('W10-04', 'A virus is 0.0000007 m across. What is this in standard form?', ['7 × 10⁻⁷ m', '7 × 10⁷ m', '0.7 × 10⁻⁶ m', '7 × 10⁻⁶ m'], 0, 'This is a small number, so the power of ten will be negative.', ['Move the decimal point 7 places to the right to get 7.', 'So 0.0000007 m is 7 × 10⁻⁷ m.'], 'calculation'),
  t('W10-05', 'How do you rearrange a formula?'),
  a.choice('W10-06', 'The formula is s = v × t. Which is the correct rearrangement to find t?', ['t = s × v', 't = v ÷ s', 't = s − v', 't = s ÷ v'], 3, 'Divide both sides by the quantity that multiplies t.', ['Divide both sides by v to get s ÷ v = t.', 'So t = s ÷ v.']),
  a.choice('W10-07', 'A bag of sand weighs 49 N. Rearrange W = m × g to find its mass (g = 9.8 N/kg).', ['0.2 kg', '5 kg', '480 kg', '50 kg'], 1, 'Divide both sides by g, so m = W ÷ g.', ['m = W ÷ g.', 'm = 49 ÷ 9.8 = 5 kg.'], 'calculation'),
  t('W10-08', 'How do you use a calculator well?'),
  a.choice('W10-09', 'You need to find (8.5 + 3.5) ÷ 4 on a calculator. Which key presses are right?', ['(8.5 + 3.5) ÷ 4', '8.5 + 3.5 ÷ 4', '8.5 + (3.5 ÷ 4)', '8.5 ÷ 4 + 3.5'], 0, 'The top of the fraction needs to be worked out first.', ['Brackets make the calculator add 8.5 and 3.5 before dividing.', '(8.5 + 3.5) ÷ 4 = 12 ÷ 4 = 3.']),
  t('W10-10', 'How are two variables related?'),
  a.choice('W10-11', 'Speed and time are inversely proportional. If the speed of a trolley is doubled, what happens to the time?', ['It doubles', 'It stays the same', 'It is four times bigger', 'It halves'], 3, 'In inverse proportion, one goes up as the other goes down.', ['Doubling one variable halves the other in inverse proportion.', 'So the time is halved.'], 'understanding'),
  a.choice('W10-12', 'A gas has a mass of 0.00032 kg. What is this in standard form?', ['3.2 × 10⁻⁴ kg', '3.2 × 10⁴ kg', '32 × 10⁻⁵ kg', '3.2 × 10⁻³ kg'], 0, 'Move the decimal point until the number is between 1 and 10, then count the places.', ['The point moves 4 places to the right to give 3.2.', 'It is a number less than 1, so the power is −4: 3.2 × 10⁻⁴ kg.'], 'calculation', true),
  a.choice('W10-13', 'A crate weighs 294 N on Earth (g = 9.8 N/kg). Use W = m × g to find its mass.', ['3 kg', '300 kg', '30 kg', '2881 kg'], 2, 'Rearrange first: do the same to both sides to get m on its own.', ['Divide both sides by g: m = W ÷ g.', 'm = 294 ÷ 9.8 = 30 kg.'], 'calculation', true),
  a.choice('W10-14', 'The table shows how long a cyclist takes to ride 120 m at different speeds. Which describes the pattern?', ['Direct proportion', 'Inverse proportion', 'Neither, the time is constant', 'Neither, the time is random'], 1, 'Check what happens to the time each time the speed doubles.', ['The speed doubles from 2 to 4 m/s and the time halves from 60 s to 30 s.', 'One variable doubles as the other halves, so it is inverse proportion.'], 'dataInterpretation', true, 'wsmaths-q-table'),
  a.choice('W10-15', 'A student types 12 + 6 ÷ 3 to find (12 + 6) ÷ 3. What is the problem?', ['The calculator cannot divide by 3', 'The answer will be too small by a factor of 3', 'The brackets are missing, so it divides only the 6', 'Nothing, it gives the same answer'], 2, 'The calculator divides before it adds unless brackets tell it not to.', ['Without brackets, 6 ÷ 3 is worked out first, giving 12 + 2 = 14.', 'With brackets, 18 ÷ 3 = 6, so the answers differ.'], 'application', true),
  a.written('W10-16', 'A student rearranges F = m × a as a = m ÷ F. Explain the mistake and give the correct rearrangement.', 'Say what to do to both sides to get a on its own.', 'The student has not done the same thing to both sides. Because m is multiplying a, both sides should be divided by m. This gives F ÷ m = a. So the correct rearrangement is a = F ÷ m.', ['Says that you must do the same to both sides.', 'Says to divide both sides by m, as m multiplies a.', 'Gives the correct rearrangement a = F ÷ m.', 'Explains that a = m ÷ F is wrong.'], ['Only giving the answer with no explanation.', 'Saying to subtract m from both sides.', 'Writing the answer a = F × m.']),
]

export const lessonW10: ScienceLesson = {
  id: skill, contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Maths skills for science', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
