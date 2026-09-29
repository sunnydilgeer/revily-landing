import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsCollectFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'WS 2.3 (sample size, accuracy and precision), WS 2.5 (sampling), WS 2.6 (equipment), WS 3.7 (errors and anomalous results), as on the supplied revision page' }
const skill = 'W-DAT-005-W'
const a = author(skill, ['WS 2.3', 'WS 2.5', 'WS 2.6', 'WS 3.7'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wsCollectSections = [
  { id: 'W5-01', label: 'Start here', detail: 'How many measurements?' },
  { id: 'W5-02', label: 'How much data do you need?', detail: 'Sample size and representative samples' },
  { id: 'W5-05', label: 'Precise or accurate?', detail: 'Definitions, methods and equipment' },
  { id: 'W5-09', label: 'What can go wrong?', detail: 'Systematic errors, random errors and anomalies' },
  { id: 'W5-12', label: 'On your own', detail: 'Precision, errors and anomalies' },
]

const states: ScienceState[] = [
  { ...a.choice('W5-01', 'One student tests fertiliser on 5 plants and another on 50. Whose result is more trustworthy?', ['They are equally trustworthy', 'The student with 50 plants', 'It depends on the colour of the plants', 'The student with 5 plants'], 1, 'Think about what happens if a few plants are unusual.', ['With 50 plants, a few unusual plants matter much less.', 'A bigger sample gives a more trustworthy result, as long as it is realistic to collect.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W5-02', 'How much data do you need?'),
  a.choice('W5-03', 'Why is a bigger sample usually better?', ['It reduces the effect of a few odd results', 'It makes the test faster', 'It removes all errors', 'It makes the mean bigger'], 0, 'Think about one unusual result among many.', ['With more results, one odd result changes the overall answer less.', 'A bigger sample does not remove errors, and it takes more time.'], 'understanding'),
  a.choice('W5-04', 'A scientist studies how air pollution affects health in a city of two million people. Which sample is best?', ['Every one of the two million people', 'Three people who live near a road', '1000 people, all aged 20', '1000 people of different ages and backgrounds'], 3, 'The sample should be realistic to collect, and representative.', ['A sample of 1000 people is realistic. Mixing ages and backgrounds makes it representative.', 'Testing everyone would take too long, and three people or one age group would not represent the city.'], 'application'),
  t('W5-05', 'Precise or accurate?'),
  a.choice('W5-06', 'A block’s true mass is 50.0 g. A student reads 52.0 g, 52.1 g and 51.9 g. Describe the readings.', ['Accurate but not precise', 'Neither precise nor accurate', 'Precise but not accurate', 'Both precise and accurate'], 2, 'Are the readings close together? Are they close to 50.0 g?', ['The readings are very close together, so they are precise.', 'They are all about 2 g above the true value, so they are not accurate.'], 'understanding'),
  a.choice('W5-07', 'Which method gives a more accurate measurement of the volume of gas made in a reaction?', ['Counting the bubbles', 'Using a gas syringe', 'Guessing from the size of the flask', 'Listening to the fizzing'], 1, 'Think about which method might miss some gas.', ['A gas syringe measures the volume directly.', 'When you count bubbles you might miss some, and the bubbles can be different sizes.'], 'practicalReasoning'),
  a.choice('W5-08', 'You need to measure out 11 cm³ of liquid. Which equipment is right for the job?', ['A measuring cylinder with 1 cm³ steps', 'A measuring cylinder with 10 cm³ steps', 'A large beaker', 'A test tube'], 0, 'The equipment must be sensitive enough.', ['A cylinder with 1 cm³ steps can show 11 cm³.', 'One with 10 cm³ steps could only show 10 or 20 cm³. Also check a balance reads zero before you weigh anything.'], 'practicalReasoning'),
  t('W5-09', 'What can go wrong?'),
  a.choice('W5-10', 'A balance reads 2 g with nothing on it, and a student weighs five objects. What kind of error is this?', ['A random error', 'An anomalous result', 'No error', 'A systematic error'], 3, 'Every reading is wrong by the same amount.', ['Every mass is 2 g too high, so this is a systematic error.', 'Random errors change from reading to reading. This error is the same each time.'], 'understanding'),
  a.choice('W5-11', 'How can you reduce the effect of random errors?', ['Change the equipment halfway', 'Take only one reading', 'Take repeat readings and find the mean', 'Throw away the highest reading'], 2, 'Some readings are a little high and some a little low.', ['Repeat the readings, then calculate the mean.', 'The highs and lows partly cancel out, so the mean is closer to the true value.'], 'practicalReasoning'),
  a.choice('W5-12', 'Look at the table. Which student’s readings are precise but not accurate?', ['Student A', 'Student B', 'Student C', 'None of them'], 1, 'Look for close readings that are all far from the true value.', ['Student B’s readings are close together, so they are precise.', 'They are all far above the true value, so they are not accurate.'], 'dataInterpretation', true, 'wscollect-q-students'),
  a.choice('W5-13', 'Five temperature readings are 21, 22, 21, 35 and 22 °C. What should you do with 35 °C?', ['Try to find its cause, then ignore it in the mean', 'Use it as it is', 'Change it to 21 °C', 'Throw away all the readings'], 0, '35 °C does not fit with the others.', ['It is an anomalous result. Try to find out what caused it, such as a misread scale.', 'You can then leave it out when you calculate the mean. Do not change it.'], 'dataInterpretation', true),
  a.choice('W5-14', 'Measuring from the end of the ruler, not 0 cm, makes every length 0.5 cm too small. What is this?', ['A random error', 'An anomalous result', 'A systematic error', 'A precise result'], 2, 'Every reading is wrong by the same amount.', ['Every length is too small by the same amount, so this is a systematic error.', 'Taking repeats and a mean would not fix it. The student must start from the 0 mark.'], 'application', true),
  a.written('W5-15', 'A class measures the volume of gas made in a reaction. Explain how to collect data that is trustworthy.', 'Think about equipment, repeats, the mean and odd results.', 'I would use a gas syringe, because it measures the volume more accurately than counting bubbles. I would take at least three repeat readings and find the mean, to reduce the effect of random errors. If one reading did not fit with the others, I would look for its cause and ignore it when I calculate the mean. I would check the equipment is set up properly before I start.', ['Use suitable equipment, such as a gas syringe, and set it up properly.', 'Take repeat readings.', 'Calculate the mean to reduce the effect of random errors.', 'Identify an anomalous result and ignore it in the mean.'], ['Saying bubble counting is more accurate.', 'Changing the odd result to match the others.', 'Saying a mean removes systematic errors.']),
]

export const lessonW5: ScienceLesson = {
  id: skill, contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Collecting data', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
