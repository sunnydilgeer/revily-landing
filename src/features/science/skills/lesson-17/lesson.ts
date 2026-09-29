import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsSetupFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'AT 3 (electrolysis and collecting gases), AT 8 (potometer and transpiration rate), as on the supplied revision page' }
const skill = 'W-PRC-017-W'
const a = author(skill, ['AT 3', 'AT 8'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wsSetupSections = [
  { id: 'W17-01', label: 'Start here', detail: 'Rate is distance ÷ time' },
  { id: 'W17-02', label: 'How do you set up electrolysis?', detail: 'Electrodes, test tubes and gases' },
  { id: 'W17-05', label: 'How do you set up a potometer?', detail: 'Bubble method and rate' },
  { id: 'W17-10', label: 'On your own', detail: 'Set-ups and calculating rate' },
]

const states: ScienceState[] = [
  { ...a.choice('W17-01', 'A snail travels 30 cm in 10 minutes. How far does it travel each minute, on average?', ['3 cm', '20 cm', '300 cm', '0.3 cm'], 0, 'Divide the distance by the time.', ['30 ÷ 10 = 3, so the snail travels 3 cm each minute.', 'The same idea is used later to find a rate in a plant experiment.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W17-02', 'How do you set up electrolysis?'),
  a.choice('W17-03', 'Which of these could you see forming at the cathode?', ['Bubbles of oxygen', 'Bubbles of chlorine', 'Bubbles of hydrogen', 'Nothing ever forms there'], 2, 'The cathode is the negative electrode.', ['At the cathode you get a coating of a pure metal, or bubbles of hydrogen.', 'Oxygen and halogens such as chlorine form at the anode.'], 'understanding'),
  a.choice('W17-04', 'A test tube of gas has been collected. How can you find out which gas it is?', ['Do the chemical test for the gas', 'Weigh the test tube', 'Measure the temperature of the tube', 'Count the bubbles that formed'], 0, 'Think about the tests for gases you met in Chemistry.', ['Each gas has its own chemical test.', 'Weighing or counting bubbles cannot tell you which gas it is.'], 'practicalReasoning'),
  t('W17-05', 'How do you set up a potometer?'),
  a.worked('W17-06', 'Estimate the transpiration rate', 'A potometer is used with a leafy shoot. The air bubble moves 30 mm in 10 minutes. Estimate the transpiration rate.', ['Transpiration rate = distance the bubble moved ÷ time taken.', 'Distance = 30 mm and time = 10 min.', 'Rate = 30 ÷ 10 = 3.', 'The transpiration rate is 3 mm/min.'], 'wssetup-worked-rate'),
  a.choice('W17-07', 'In a different potometer, the bubble moves 40 mm in 8 minutes. What is the transpiration rate?', ['0.2 mm/min', '5 mm/min', '320 mm/min', '48 mm/min'], 1, 'Divide the distance by the time.', ['Rate = 40 ÷ 8 = 5 mm/min.', 'Do not multiply the numbers. The rate is distance divided by time.'], 'calculation'),
  a.choice('W17-08', 'Why do you record the starting position of the air bubble?', ['So the plant grows faster', 'So you can work out how far it moved', 'So the water is warmer', 'So the bubble stays still'], 1, 'The distance is the difference between where the bubble started and where it ended.', ['You need the start and the end position to know how far the bubble moved.', 'The distance is then divided by the time.'], 'understanding'),
  a.choice('W17-09', 'A potometer bubble distance is in millimetres and the time is in minutes. Which is the correct unit for the rate?', ['min/mm', 'mm', 'mm/min', 'cm²'], 2, 'A rate is distance per unit of time.', ['Distance in mm and time in minutes give a rate in mm per minute, written mm/min.', 'The unit follows from the equation, distance ÷ time.'], 'calculation'),
  a.choice('W17-10', 'Look at the numbered parts of the potometer. Which part is the air bubble?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 3, 'It is the small gap of air that moves along the thin tube.', ['The air bubble moves along the capillary tube as the plant takes up water.', 'Its movement is measured against the scale.'], 'application', true, 'wssetup-q-potometer'),
  a.choice('W17-11', 'In an electrolysis experiment, bubbles of hydrogen form at one electrode. Which electrode is it?', ['The anode', 'The cathode', 'Both electrodes', 'Neither electrode'], 1, 'Hydrogen forms at the negative electrode.', ['Hydrogen bubbles form at the cathode.', 'The anode gives oxygen or a halogen.'], 'understanding', true),
  a.choice('W17-12', 'A potometer bubble moves 24 mm in 6 minutes. What is the transpiration rate?', ['144 mm/min', '0.25 mm/min', '4 mm/min', '18 mm/min'], 2, 'Divide the distance by the time.', ['Rate = 24 ÷ 6 = 4 mm/min.', 'Check the unit: mm for distance and minutes for time.'], 'calculation', true),
  a.choice('W17-13', 'Why is a test tube full of solution turned upside down over each electrode?', ['To collect the gas made at that electrode', 'To keep the electrode cool', 'To stop the current', 'To weigh the solution'], 0, 'Think about what happens to the gas as it rises.', ['The gas rises into the tube and pushes the solution out.', 'This lets you collect the gas and test it.'], 'practicalReasoning', true),
  a.written('W17-14', 'Describe how to use a potometer to estimate the transpiration rate of a leafy shoot.', 'Think about the start position, the timing and the calculation.', 'I would set up the potometer with the shoot in the tube and an air bubble in the capillary tube. I would record the starting position of the bubble and start a stopwatch. As the plant takes up water, the bubble moves along the tube. After a set time I would record how far it moved. Then I would divide the distance by the time to estimate the rate.', ['Record the starting position of the air bubble.', 'Start a stopwatch and wait for a set time.', 'Record how far the bubble moved.', 'Rate = distance ÷ time.'], ['Multiplying distance by time.', 'Forgetting to record the starting position.', 'Leaving out the units.']),
]

export const lessonW17: ScienceLesson = {
  id: skill, contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Setting up electrolysis and a potometer', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
