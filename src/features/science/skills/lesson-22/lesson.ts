import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsPercentFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'WS 4.6 (percentage change) and maths skills, as on the supplied revision page' }
const skill = 'W-PRC-022-W'
const a = author(skill, ['WS 4.6'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wsPercentSections = [
  { id: 'W22-01', label: 'Start here', detail: 'Same gain, different start' },
  { id: 'W22-02', label: 'How do you work out a percentage change?', detail: 'Change ÷ original × 100' },
  { id: 'W22-06', label: 'What does a negative change mean?', detail: 'Increases and decreases' },
  { id: 'W22-10', label: 'How do you compare two results?', detail: 'Percentages give a fair comparison' },
  { id: 'W22-13', label: 'On your own', detail: 'Percentage change and comparing' },
]

const states: ScienceState[] = [
  { ...a.choice('W22-01', 'Two cylinders each gain 2 g, one from 4 g and one from 20 g. Which changed more compared with its start?', ['The 4 g cylinder', 'The 20 g cylinder', 'They changed by the same amount', 'You cannot tell'], 0, 'Compare the gain with the size of the start.', ['A gain of 2 g is half of 4 g, but only a tenth of 20 g.', 'So the 4 g cylinder changed more compared with its start.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W22-02', 'How do you work out a percentage change?'),
  a.worked('W22-03', 'Work out a percentage change', 'A potato cylinder has a mass of 8.0 g before an investigation and 10.0 g after it. Find the percentage change.', ['Change = final value − original value = 10.0 − 8.0 = 2.0 g.', 'Divide by the original value: 2.0 ÷ 8.0 = 0.25.', 'Multiply by 100: 0.25 × 100 = 25.', 'The percentage change is +25%.'], 'wspercent-worked-increase'),
  a.choice('W22-04', 'A potato cylinder goes from 50 g to 60 g. What is its percentage change?', ['10%', '20%', '17%', '120%'], 1, 'Change = 60 − 50. Divide by the original value, 50, then multiply by 100.', ['Change = 60 − 50 = 10 g.', '10 ÷ 50 = 0.2, and 0.2 × 100 = 20%.'], 'calculation'),
  a.choice('W22-05', 'Which value do you divide by when you work out a percentage change?', ['The mass at the end', 'The change in mass', 'The mass at the start', 'The percentage'], 2, 'It is the value you began with.', ['You always divide by the original value.', 'The original value is the one measured at the start.'], 'recall'),
  t('W22-06', 'What does a negative change mean?'),
  a.worked('W22-07', 'Work out a negative percentage change', 'A potato cylinder in a strong sugar solution has a mass of 5.0 g at the start and 4.0 g at the end. Find the percentage change.', ['Change = final value − original value = 4.0 − 5.0 = −1.0 g.', 'Divide by the original value: −1.0 ÷ 5.0 = −0.2.', 'Multiply by 100: −0.2 × 100 = −20.', 'The percentage change is −20%. The minus sign shows that the mass decreased.'], 'wspercent-worked-decrease'),
  a.choice('W22-08', 'A sample of crystals falls in mass from 20 g to 15 g when heated. What is its percentage change?', ['25%', '−5%', '5%', '−25%'], 3, 'The final value is smaller, so the answer is negative.', ['Change = 15 − 20 = −5 g.', '−5 ÷ 20 = −0.25, and −0.25 × 100 = −25%.'], 'calculation'),
  a.choice('W22-09', 'A percentage change of −8% means that the value has...', ['decreased by 8% of its original value', 'increased by 8% of its original value', 'stayed the same', 'increased by 8 g'], 0, 'A negative sign means down.', ['A negative percentage change means the value decreased.', 'It has gone down by 8% of the value it started with.'], 'understanding'),
  t('W22-10', 'How do you compare two results?'),
  a.worked('W22-11', 'Compare two percentage changes', 'Cylinder A goes from 6.0 g to 7.2 g. Cylinder B goes from 10.0 g to 11.5 g. Which has the larger percentage change?', ['Cylinder A: change = 7.2 − 6.0 = 1.2 g. 1.2 ÷ 6.0 = 0.2. So A changed by +20%.', 'Cylinder B: change = 11.5 − 10.0 = 1.5 g. 1.5 ÷ 10.0 = 0.15. So B changed by +15%.', 'Compare: 20% is larger than 15%.', 'Cylinder A had the larger percentage change, even though B gained more grams.'], 'wspercent-worked-compare'),
  a.choice('W22-12', 'X goes from 4.0 g to 5.0 g. Y goes from 20.0 g to 24.0 g. Which has the larger percentage change?', ['Y, because it gained 4 g', 'Both are the same', 'X, with 25% against 20%', 'Y, with 20% against 25%'], 2, 'Work out both percentage changes, then compare them.', ['X: 1.0 ÷ 4.0 = 0.25, so +25%. Y: 4.0 ÷ 20.0 = 0.2, so +20%.', 'X has the larger percentage change, even though Y gained more grams.'], 'calculation'),
  a.choice('W22-13', 'Copper sulfate crystals lose mass when heated, from 50 g to 40 g. What is the percentage change?', ['20%', '−10%', '−80%', '−20%'], 3, 'Change = final − original. Divide by 50.', ['Change = 40 − 50 = −10 g.', '−10 ÷ 50 = −0.2, and −0.2 × 100 = −20%.'], 'calculation', true),
  a.choice('W22-14', 'Look at the table. Which cylinder had the larger percentage change in mass?', ['Cylinder 2, because its mass change is bigger', 'Cylinder 1, with a change of 20%', 'Both are the same', 'Cylinder 2, with a change of 15%'], 1, 'Work out each percentage change. Divide by the mass at the start.', ['Cylinder 1: 1.0 ÷ 5.0 = 0.2, so +20%. Cylinder 2: 1.2 ÷ 8.0 = 0.15, so +15%.', 'Cylinder 1 has the larger percentage change.'], 'dataInterpretation', true, 'wspercent-q-table'),
  a.written('W22-15', 'Seedling A grows 10 to 12 cm, and B grows 20 to 23 cm. Which grew more compared with its start?', 'Work out a percentage change for each one.', 'For each seedling I would work out the change, divide by the original height, and multiply by 100. For A the change is 12 − 10 = 2 cm, and 2 ÷ 10 × 100 = 20%. For B the change is 23 − 20 = 3 cm, and 3 ÷ 20 × 100 = 15%. Seedling A had the larger percentage change, so it grew more compared with its starting height, even though B grew more centimetres.', ['Change = final − original for each seedling.', 'Divide each change by the original height.', 'Multiply by 100: A = 20%, B = 15%.', 'Compare the percentages.', 'A grew more compared with its start.'], ['Dividing by the final value.', 'Saying B grew more because 3 cm is bigger than 2 cm.', 'Leaving out the × 100.']),
]

export const lessonW22: ScienceLesson = {
  id: skill, contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Percentage change', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
