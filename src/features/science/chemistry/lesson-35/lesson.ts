import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { rateGraphFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.6.1.1 Rate of reaction (quantity of product formed or reactant used up over time; mean rate from a graph or from measurements; units g/s and cm³/s); Foundation tier, no tangents' }
const skill = 'C-RATE-GRAPHS'
const drawing = author(skill, ['5.6.1.1'], ['aqa-chemistry'])
const reading = author(skill, ['5.6.1.1'], ['aqa-chemistry'])
const mean = author(skill, ['5.6.1.1'], ['aqa-chemistry'])
const fromGraph = author(skill, ['5.6.1.1'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const rateGraphSections = [
  { id: 'C35-01', label: 'Start here', detail: 'Average speed from distance and time' },
  { id: 'C35-02', label: 'How do you draw a rate graph?', detail: 'Axes, crosses and a line of best fit' },
  { id: 'C35-05', label: 'What does the graph tell you?', detail: 'Steep, flat and reading values' },
  { id: 'C35-07', label: 'How do you work out a mean rate?', detail: 'Amount ÷ time, with units' },
  { id: 'C35-10', label: 'How do you find a mean rate from a graph?', detail: 'The whole reaction and between two times' },
  { id: 'C35-13', label: 'On your own', detail: 'Calculations, a graph and a comparison' },
]

const states: ScienceState[] = [
  { ...drawing.choice('C35-01', 'A cyclist rides 60 metres in 10 seconds. What is her average speed?', ['600 m/s', '6 m/s', '50 m/s', '70 m/s'], 1, 'What do you do with the distance and the time to find a speed?', ['Average speed is the distance divided by the time.', '60 ÷ 10 = 6, so her average speed is 6 m/s.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(drawing, 'C35-02', 'How do you draw a rate graph?'),
  drawing.choice('C35-03', 'A student plots the volume of gas made against time. Which way round do the axes go?', ['Time on the x-axis, volume of gas on the y-axis', 'Volume of gas on the x-axis, time on the y-axis', 'Time and volume of gas both on the x-axis', 'It does not matter which way round they go'], 0, 'Which axis goes along the bottom of the page?', ['Time goes on the x-axis, along the bottom, and the volume of gas goes on the y-axis, going up.', 'Label each axis with its unit, such as time (s) and volume of gas (cm³).']),
  drawing.choice('C35-04', 'The crosses on a rate graph rise and then level off. Which line of best fit is best?', ['Straight lines joining each cross to the next one', 'One straight line from the origin to the last cross', 'A curve that goes exactly through every cross, even if it wobbles', 'One smooth curve that passes close to the crosses'], 3, 'Should a line of best fit join the dots one by one?', ['A line of best fit runs as close as it can to all the points. It does not join them one by one.', 'For a reaction that levels off, that means one smooth curve. Two straight lines are also allowed.']),
  t(reading, 'C35-05', 'What does the graph tell you?'),
  reading.choice('C35-06', 'The graph shows gas made by a reaction. At what time did the reaction finish?', ['20 s', '30 s', '40 s', '50 s'], 2, 'Where does the line first go flat?', ['The line goes flat when no more gas is being made, so the reaction has finished.', 'On this graph the line first goes flat at 40 seconds.'], 'understanding', false, 'rgraph-question-read'),
  t(mean, 'C35-07', 'How do you work out a mean rate?'),
  mean.worked('C35-08', 'Work out the mean rate of a reaction', 'A reaction makes 3.6 g of product in 90 seconds. What is the mean rate of the reaction?', ['Write the rule: mean rate = amount of product formed ÷ time.', 'The amount of product is 3.6 g and the time is 90 s.', 'Divide: 3.6 ÷ 90 = 0.04.', 'The amount is in grams and the time in seconds, so the mean rate is 0.04 g/s.'], 'rgraph-worked-mean'),
  mean.choice('C35-09', 'A reaction uses up 5.0 g of a reactant in 250 seconds. What is the mean rate?', ['0.02 g/s', '0.2 g/s', '50 g/s', '1250 g/s'], 0, 'Divide the amount by the time, not the time by the amount.', ['Mean rate = amount of reactant used up ÷ time = 5.0 ÷ 250.', '5.0 ÷ 250 = 0.02, so the mean rate is 0.02 g/s.'], 'calculation'),
  t(fromGraph, 'C35-10', 'How do you find a mean rate from a graph?'),
  fromGraph.worked('C35-11', 'Find the mean rate between two times on a graph', 'The graph shows the gas made by a reaction. Find the mean rate between 10 s and 30 s.', ['Read the volume at 10 s: 10 cm³. Read the volume at 30 s: 19 cm³.', 'The gas made in between is 19 − 10 = 9 cm³.', 'The time in between is 30 − 10 = 20 s.', 'Divide: 9 ÷ 20 = 0.45. So the mean rate is 0.45 cm³/s.'], 'rgraph-worked-between'),
  fromGraph.choice('C35-12', 'Use the same graph. What is the mean rate between 20 s and 40 s?', ['0.50 cm³/s', '0.80 cm³/s', '0.20 cm³/s', '4.0 cm³/s'], 2, 'Read the volume at both times, then find the difference.', ['At 20 s the volume is 16 cm³ and at 40 s it is 20 cm³, so 4 cm³ was made in between.', 'The time in between is 20 s. So 4 ÷ 20 = 0.20 cm³/s.'], 'calculation', false, 'rgraph-question-between'),
  mean.choice('C35-13', 'A reaction makes 48 cm³ of gas in 80 seconds. What is the mean rate of reaction?', ['0.06 cm³/s', '0.6 cm³/s', '1.7 cm³/s', '128 cm³/s'], 1, 'Divide the volume of gas by the time.', ['Mean rate = 48 cm³ ÷ 80 s.', '48 ÷ 80 = 0.6, so the mean rate is 0.6 cm³/s.'], 'calculation', true),
  fromGraph.choice('C35-14', 'The graph shows the gas made by another reaction. What is the mean rate for the whole reaction?', ['0.60 cm³/s', '0.90 cm³/s', '1.1 cm³/s', '36 cm³/s'], 1, 'At what time does the line first go flat?', ['The line goes flat at 40 s, when 36 cm³ of gas had been made.', '36 ÷ 40 = 0.90. Dividing by 60 s, the end of the graph, would wrongly give 0.60.'], 'calculation', true, 'rgraph-question-whole'),
  mean.choice('C35-15', 'Reaction X made 4.0 g of product in 50 s. Reaction Y made 6.0 g in 100 s. Which conclusion is supported?', ['Reaction Y was faster, because it made more product', 'Both reactions had about the same mean rate', 'The reactions cannot be compared, because the times are different', 'Reaction X had the higher mean rate, 0.08 g/s compared with 0.06 g/s'], 3, 'Work out the mean rate of each reaction before you compare them.', ['X: 4.0 ÷ 50 = 0.08 g/s. Y: 6.0 ÷ 100 = 0.06 g/s.', 'Y made more product, but it took longer, so X had the higher mean rate. Different times can be compared once you divide.'], 'dataInterpretation', true),
  fromGraph.written('C35-16', 'A student measured gas from a reaction. Describe how to find the mean rate for the whole reaction, and work it out.', 'Time (s): 0, 10, 20, 30, 40, 50. Volume of gas (cm³): 0, 11, 18, 22, 24, 24. Say when the reaction finished, then divide.', 'The reaction has finished when the amount of gas stops going up, which is at 40 s, where the graph would go flat. By then 24 cm³ of gas had been made. Divide the volume by the time: 24 ÷ 40 = 0.60. The mean rate is 0.60 cm³/s.', ['The reaction finished when the volume stopped increasing, at 40 s.', '24 cm³ of gas had been made by then.', 'Divide the amount by the time: 24 ÷ 40.', 'The mean rate is 0.60 cm³/s, with the unit.'], ['Dividing by 50 s, the last time in the table, instead of 40 s.', 'Giving 0.6 with no unit, or the unit g/s for a gas volume.', 'Giving a number with no explanation of how the finish time was found.']),
]

export const lessonC35: ScienceLesson = {
  id: 'C-RAT-035-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Rate graphs and mean rate', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
