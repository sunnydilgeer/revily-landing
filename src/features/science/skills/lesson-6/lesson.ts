import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsProcessFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'WS 3.2 (tables, mean, median, mode and range), WS 4.6 (significant figures), as on the supplied revision page' }
const skill = 'W-DAT-006-W'
const a = author(skill, ['WS 3.2', 'WS 4.6'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wsProcessSections = [
  { id: 'W6-01', label: 'Start here', detail: 'One number from many readings' },
  { id: 'W6-02', label: 'How do you set out a table?', detail: 'Headings, units and repeats' },
  { id: 'W6-04', label: 'Mean, median, mode and range', detail: 'Four ways to summarise data' },
  { id: 'W6-08', label: 'How do you round an answer?', detail: 'Significant figures' },
  { id: 'W6-12', label: 'On your own', detail: 'Means, rounding and odd readings' },
]

const states: ScienceState[] = [
  { ...a.choice('W6-01', 'Three trolley times are 12 s, 14 s and 13 s. Which single value best sums them up?', ['The biggest reading, 14 s', 'The smallest reading, 12 s', 'The average of the readings, 13 s', 'The first reading, 12 s'], 2, 'Think about a value that uses all three readings.', ['An average uses all the readings, so it is a fairer summary than any one reading.', 'Here the mean is (12 + 14 + 13) ÷ 3 = 13 s.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W6-02', 'How do you set out a table?'),
  a.choice('W6-03', 'A student times a reaction in seconds. Which column heading is set out correctly?', ['Time (s)', 'Time', 's', 'Time taken to complete the reaction'], 0, 'The heading should say what is measured and give the unit.', ['A good heading names the quantity and puts the unit in brackets.', 'Then you only write numbers under it.'], 'understanding'),
  t('W6-04', 'Mean, median, mode and range'),
  a.worked('W6-05', 'Find the mean, median, mode and range', 'A student collects gas in a reaction five times. The volumes of gas are 10, 14, 8, 14 and 19 cm³. Find the mean, median, mode and range.', ['Mean: add the values, 10 + 14 + 8 + 14 + 19 = 65 cm³. Divide by 5: 65 ÷ 5 = 13 cm³.', 'Median: put them in order, 8, 10, 14, 14, 19. The middle value is 14 cm³.', 'Mode: the value that appears most often is 14 cm³.', 'Range: largest − smallest = 19 − 8 = 11 cm³.'], 'wsprocess-worked-average'),
  a.choice('W6-06', 'Five repeat times for a reaction are 24 s, 30 s, 27 s, 26 s and 33 s. What is the mean?', ['27 s', '30 s', '24 s', '28 s'], 3, 'Add all five values, then divide by 5.', ['24 + 30 + 27 + 26 + 33 = 140 s.', '140 ÷ 5 = 28 s. The value 27 s is the median, not the mean.'], 'calculation'),
  a.choice('W6-07', 'Six seeds have masses 12, 15, 18, 21, 14 and 17 g. What is the median?', ['15 g', '16 g', '17 g', '16.5 g'], 1, 'Put them in order. With six values, there are two middle ones.', ['In order: 12, 14, 15, 17, 18, 21. The middle two are 15 and 17.', 'The median is halfway between them: (15 + 17) ÷ 2 = 16 g.'], 'calculation'),
  t('W6-08', 'How do you round an answer?'),
  a.worked('W6-09', 'Round a speed to the right number of significant figures', 'A trolley travels 2.5 m in 0.60 s. Work out its speed and round the answer correctly.', ['Speed = distance ÷ time = 2.5 ÷ 0.60 = 4.1666… m/s.', '2.5 has 2 significant figures. 0.60 also has 2 significant figures.', 'Round to the lowest number given: 2 significant figures.', 'The speed is 4.2 m/s.'], 'wsprocess-worked-sf'),
  a.choice('W6-10', 'A toy car goes 4.8 m in 0.70 s. What is its speed, rounded to the right number of significant figures?', ['6.9 m/s', '6.86 m/s', '7 m/s', '6.8 m/s'], 0, 'Both numbers have two significant figures.', ['Speed = 4.8 ÷ 0.70 = 6.857… m/s.', 'Both given values have 2 significant figures, so the answer is 6.9 m/s.'], 'calculation'),
  a.choice('W6-11', 'What is 0.0472 rounded to 2 significant figures?', ['0.05', '0.04', '0.047', '0.048'], 2, 'The first significant figure is the 4. It is the first digit that is not zero.', ['The two significant figures are 4 and 7. The next digit is 2, so the 7 stays the same.', 'That gives 0.047.'], 'calculation'),
  a.choice('W6-12', 'Gas volumes are 22, 24, 41, 23 and 27 cm³, and 41 is anomalous. What is the mean without it?', ['27.4 cm³', '24 cm³', '23.5 cm³', '25 cm³'], 1, 'Leave out 41 cm³, then divide by the number of values you used.', ['22 + 24 + 23 + 27 = 96 cm³. There are 4 values, not 5.', '96 ÷ 4 = 24 cm³. The mean including 41 would be 27.4 cm³.'], 'calculation', true),
  a.choice('W6-13', 'A block has mass 9.1 g and volume 2.4 cm³. What is its density, to the right number of significant figures?', ['3.79 g/cm³', '3.7 g/cm³', '4 g/cm³', '3.8 g/cm³'], 3, 'Both given numbers have two significant figures.', ['Density = 9.1 ÷ 2.4 = 3.7916… g/cm³.', 'Round to 2 significant figures, the fewest given: 3.8 g/cm³.'], 'calculation', true),
  a.choice('W6-14', 'Look at the table of repeats. Which reading looks anomalous?', ['Tube B, repeat 3', 'Tube A, repeat 1', 'Tube B, repeat 1', 'Tube A, repeat 2'], 0, 'Look for the value that does not fit with the others in its row.', ['In Tube B, repeats 1 and 2 are close together, but repeat 3 is much bigger.', 'A reading that does not fit like this is anomalous. Find its cause and leave it out of the mean.'], 'dataInterpretation', true, 'wsprocess-q-table'),
  a.written('W6-15', 'Trolley times are 2.1, 2.3, 2.2, 3.9 and 2.2 s. Explain how to process these results.', 'Think about the odd reading, the mean and the table.', 'The reading of 3.9 s does not fit with the others, so it is anomalous. I would look for its cause and leave it out. Then I would add the other four values, 2.1 + 2.3 + 2.2 + 2.2 = 8.8 s. I would divide by 4 to get a mean of 2.2 s. I would put the results in a table with the unit in the heading, Time (s), and a column for the mean.', ['Identify 3.9 s as the anomalous result.', 'Leave it out of the mean.', 'Add the four remaining values to get 8.8 s.', 'Divide by 4 to get a mean of 2.2 s.', 'Set out a table with headings and the unit in the heading.'], ['Dividing by 5 after leaving one value out.', 'Including 3.9 s in the mean.', 'Putting the unit after every number.']),
]

export const lessonW6: ScienceLesson = {
  id: skill, contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Processing data', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
