import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { samplingFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.7.2.1 Levels of organisation: required practical activity 7, measuring the population size of a common species using quadrats and transects; mean, median, mode and population estimates' }
const a = author('B-ECO-SAMPLING', ['4.7.2.1'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const samplingSections = [
  { id: 'B49-01', label: 'Start here', detail: 'Why is there less clover under the tree?' },
  { id: 'B49-02', label: 'How do you sample?', detail: 'Distribution, quadrats and random placing' },
  { id: 'B49-05', label: 'Find the averages', detail: 'Mean, median and mode' },
  { id: 'B49-09', label: 'How many in the field?', detail: 'Estimating population size' },
  { id: 'B49-12', label: 'Along a line', detail: 'Transects and percentage cover' },
  { id: 'B49-15', label: 'On your own', detail: 'Estimates, cover, a mode, data and a method' },
]

const states: ScienceState[] = [
  { ...a.choice('B49-01', 'Clover grows well in open grass but hardly at all under a large tree. Which abiotic factor most likely explains this?', ['Wind direction', 'Light intensity', 'Oxygen level in water'], 1, 'You met abiotic factors when you learned how the environment affects communities. What does the tree block?', ['The tree’s leaves block much of the light.', 'Plants need light for photosynthesis, so light intensity most likely explains it.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B49-02', 'How do you sample?'),
  a.choice('B49-03', 'Why should quadrats be placed at random?', ['So you finish faster', 'So you count fewer plants', 'So the quadrat stays the same size', 'So the results are not biased by where you choose to put them'], 3, 'What might happen if you chose the spots yourself?', ['If you chose the spots, you might pick the best or worst patches.', 'Random placing means the results are not biased by your choices.'], 'practicalReasoning'),
  a.choice('B49-04', 'Why do you use lots of quadrats in each area, not just one?', ['It makes the clover grow', 'Quadrats wear out quickly', 'One quadrat might land on an unusual patch, so more give a better picture'], 2, 'Is one small square typical of the whole area?', ['One quadrat might land on a patch that is not typical.', 'More quadrats give a better picture of the whole area.'], 'practicalReasoning'),
  t('B49-05', 'Find the averages'),
  a.worked('B49-06', 'Find the mean in the shady area', 'In the shady area, 5 quadrats held 2, 0, 3, 1 and 4 clover plants. What is the mean number per quadrat?', ['Add up the counts: 2 + 0 + 3 + 1 + 4 = 10.', 'Count the quadrats: there are 5.', 'Divide the total by the number of quadrats: 10 ÷ 5 = 2.', 'The mean is 2 clover plants per quadrat, far fewer than 9 in the sunny area.'], 'eco-mean-worked'),
  a.choice('B49-07', 'Another group counted 4, 7, 5, 9 and 5 clover plants in 5 quadrats. What is the mean per quadrat?', ['30', '5', '6', '7'], 2, 'Add them up, then divide by 5.', ['Add them up: 4 + 7 + 5 + 9 + 5 = 30.', 'Divide by the number of quadrats: 30 ÷ 5 = 6 per quadrat.'], 'calculation'),
  a.choice('B49-08', 'Seven quadrats held 2, 9, 4, 4, 7, 11 and 5 clover plants. What is the median?', ['4', '5', '6', '7'], 1, 'Put the counts in order first.', ['In order: 2, 4, 4, 5, 7, 9, 11.', 'There are 7 counts, so the median is the 4th one: 5.'], 'calculation'),
  t('B49-09', 'How many in the field?'),
  a.worked('B49-10', 'Estimate a population', 'A lawn has an area of 200 m². Quadrats of 0.25 m² found a mean of 6 buttercups per quadrat. Estimate the number of buttercups on the lawn.', ['Divide the area of the lawn by the area of one quadrat: 200 ÷ 0.25 = 800.', 'So 800 quadrats would fit on the lawn.', 'Multiply by the mean number per quadrat: 800 × 6 = 4800.', 'There are about 4800 buttercups on the lawn.'], 'eco-estimate-worked'),
  a.choice('B49-11', 'A field is 300 m². Quadrats of 0.25 m² found a mean of 5 buttercups each. Estimate the buttercups in the field.', ['75', '1200', '1500', '6000'], 3, 'Divide the area by 0.25, then multiply by the mean.', ['Divide the area by the quadrat area: 300 ÷ 0.25 = 1200 quadrats.', 'Multiply by the mean: 1200 × 5 = 6000 buttercups.'], 'calculation'),
  t('B49-12', 'Along a line'),
  a.choice('B49-13', 'In another quadrat, 64 of the 100 small squares are more than half covered by moss. What is the percentage cover?', ['36%', '64%', '0.64%', '6.4%'], 1, 'Divide by 100, then multiply by 100.', ['64 ÷ 100 = 0.64.', '0.64 × 100 = 64%.'], 'calculation'),
  a.choice('B49-14', 'When would you use a transect rather than quadrats placed at random?', ['To see how the distribution changes across an area', 'To make the results random', 'To count every organism in the field'], 0, 'What does a line from a hedge into a field show?', ['Random quadrats compare areas, but they do not follow a line.', 'A transect shows how the distribution changes across an area, such as away from a hedge.'], 'practicalReasoning'),
  a.choice('B49-15', 'Five 1 m² quadrats on a 250 m² lawn held 3, 5, 2, 6 and 4 buttercups. Estimate the lawn’s buttercup population.', ['20', '250', '1000', '5000'], 2, 'Find the mean first. How many 1 m² quadrats fit on the lawn?', ['The mean is (3 + 5 + 2 + 6 + 4) ÷ 5 = 20 ÷ 5 = 4 per quadrat, and 250 ÷ 1 = 250 quadrats would fit.', 'So the estimate is 250 × 4 = 1000 buttercups.'], 'calculation', true),
  a.choice('B49-16', 'This small quadrat has 25 squares. The shaded squares are more than half covered by moss. What is the percentage cover?', ['36%', '9%', '25%', '90%'], 0, 'Count the shaded squares, divide by 25, then multiply by 100.', ['9 of the 25 squares are shaded.', '9 ÷ 25 × 100 = 36%.'], 'calculation', true, 'eco-cover-question'),
  a.choice('B49-17', 'Seven quadrats held 6, 2, 9, 2, 5, 8 and 3 snails. What is the mode?', ['2', '5', '7', '9'], 0, 'Which count appears most often?', ['The count 2 appears twice, and every other count appears once.', 'So the mode is 2.'], 'calculation', true),
  a.choice('B49-18', 'The chart shows the percentage cover of moss along a transect from a hedge. Which conclusion fits?', ['Shade from the hedge is proven to be the only cause', 'Moss cover would be 0% at 10 m in every field', 'There was more moss further from the hedge', 'Along this transect, moss cover was highest near the hedge and fell further away'], 3, 'Describe the pattern in this data only.', ['Moss cover fell from 60% at the hedge to 5% at 8 m.', 'So along this transect, moss cover was highest near the hedge. The data alone cannot prove the cause, or show other fields.'], 'dataInterpretation', true, 'eco-transect-data'),
  a.written('B49-19', 'Describe how to use quadrats to compare the clover in a sunny area and a shady area of a school field.', 'Think: where each quadrat goes, what you count, how many times, and what you work out at the end.', 'Use two tape measures and random numbers to place a quadrat at random in the sunny area. Count the clover plants inside it. Repeat many times, then work out the mean number per quadrat. Do the same in the shady area, using the same size and number of quadrats. Then compare the two means.', ['Place a quadrat at random, for example using random coordinates along two tape measures.', 'Count the clover plants inside the quadrat.', 'Repeat many times, then work out the mean number per quadrat.', 'Do the same in the other area with the same size and number of quadrats, then compare the means.'], ['Choosing spots that look full of clover.', 'Using only one quadrat in each area.', 'Using different sizes of quadrat in the two areas.']),
]

export const lesson49: ScienceLesson = {
  id: 'B-ECO-049-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Quadrats and transects practical', prerequisites: ['B-ECO-FACTORS'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
