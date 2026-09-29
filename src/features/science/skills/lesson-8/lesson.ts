import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsGraphFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'WS 3.5 (interpreting graphs: gradients and rates, relationships between variables), as on the supplied revision page' }
const skill = 'W-DAT-008-W'
const a = author(skill, ['WS 3.5'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wsGraphSections = [
  { id: 'W8-01', label: 'Start here', detail: 'Two lines, two reactions' },
  { id: 'W8-02', label: 'What is a gradient?', detail: 'Steepness, rate and units' },
  { id: 'W8-05', label: 'How do you find a gradient?', detail: 'A worked example, then your turn' },
  { id: 'W8-08', label: 'What is correlation?', detail: 'Positive, negative and none' },
  { id: 'W8-12', label: 'On your own', detail: 'Rates and patterns' },
]

const states: ScienceState[] = [
  { ...a.choice('W8-01', 'Gas volume is plotted against time for two reactions. Line A is steeper than line B. What does that tell you?', ['Reaction A stopped earlier', 'Reaction A used less acid', 'Reaction A made gas faster', 'Both reactions made the same volume'], 2, 'Think about how much gas is made in each second.', ['A steeper line means the volume changes more in each second.', 'So reaction A made gas faster.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W8-02', 'What is a gradient?'),
  a.choice('W8-03', 'On a graph of gas volume against time, part of the line is flat and horizontal. What does this show?', ['The reaction is at its fastest', 'The volume is not changing', 'The line must be wrong', 'The reaction has just started'], 1, 'A flat line has a gradient of zero.', ['A flat line means the volume does not change as time passes.', 'No more gas is being made.'], 'understanding'),
  a.choice('W8-04', 'A graph shows mass in grams against time in minutes. What is the unit of its gradient?', ['min/g', 'g × min', 'g/min', 'g'], 2, 'The unit is the y unit divided by the x unit.', ['The y-axis is in grams and the x-axis is in minutes.', 'So the gradient is in g/min.'], 'calculation'),
  t('W8-05', 'How do you find a gradient?'),
  a.choice('W8-06', 'Two points on a line are (10 s, 4 cm³) and (50 s, 24 cm³). What are the change in y and the change in x?', ['20 cm³ and 40 s', '40 cm³ and 20 s', '28 cm³ and 60 s', '4 cm³ and 10 s'], 0, 'Subtract the smaller value from the larger, for y and then for x.', ['Change in y = 24 − 4 = 20 cm³.', 'Change in x = 50 − 10 = 40 s.'], 'calculation'),
  a.choice('W8-07', 'Two points on a straight line are (20 s, 10 cm³) and (60 s, 30 cm³). What is the rate of reaction?', ['2 cm³/s', '0.5 cm³/s', '20 cm³/s', '40 cm³/s'], 1, 'Find both changes first, then divide the change in y by the change in x.', ['Change in y = 30 − 10 = 20 cm³. Change in x = 60 − 20 = 40 s.', 'Gradient = 20 ÷ 40 = 0.5 cm³/s.'], 'calculation'),
  t('W8-08', 'What is correlation?'),
  a.choice('W8-09', 'Plants given more fertiliser have, on average, a greater height. What correlation is this?', ['No correlation', 'Negative correlation', 'It cannot be told', 'Positive correlation'], 3, 'Both variables increase together.', ['As the fertiliser increases, the height increases too.', 'That is positive correlation.'], 'understanding'),
  a.choice('W8-10', 'A scatter graph of pupils’ shoe sizes against their test marks shows points spread all over the graph. What does it show?', ['No correlation', 'Positive correlation', 'Negative correlation', 'A perfect straight line'], 0, 'Look for a pattern in the points.', ['With no pattern in the points, there is no relationship between the variables.', 'This is called no correlation.'], 'dataInterpretation'),
  a.choice('W8-11', 'Which pair of variables would you expect to show positive correlation?', ['The speed of a car and the time it takes to travel 10 km', 'A pupil’s shoe size and their test mark', 'The temperature of a fridge and the number of days milk stays fresh', 'The force on a spring and how far it stretches'], 3, 'Look for two things that increase together.', ['A bigger force gives a bigger stretch, so both increase.', 'The car and fridge pairs are negative correlations, and shoe size and marks have no relationship.'], 'application'),
  a.choice('W8-12', 'The straight line shows gas volume against time. Points A and B are marked on it. What is the gradient?', ['0.75 cm³/s', '1.33 cm³/s', '30 cm³/s', '60 cm³/s'], 0, 'Read the two points, then divide the change in y by the change in x.', ['Change in y = 45 − 15 = 30 cm³. Change in x = 60 − 20 = 40 s.', 'Gradient = 30 ÷ 40 = 0.75 cm³/s.'], 'calculation', true, 'wsgraph-q-line'),
  a.choice('W8-13', 'The scatter graph shows the time a tablet takes to dissolve at different water temperatures. What correlation does it show?', ['Positive correlation', 'No correlation', 'A gradient of zero', 'Negative correlation'], 3, 'As the temperature goes up, look at what happens to the time.', ['As the water temperature increases, the time to dissolve decreases.', 'One variable goes up while the other goes down, so this is negative correlation.'], 'dataInterpretation', true, 'wsgraph-q-scatter'),
  a.choice('W8-14', 'Two points on a straight line of mass of product against time are (2 min, 3 g) and (6 min, 15 g). What is the rate?', ['0.33 g/min', '3 g/min', '4 g/min', '12 g/min'], 1, 'Change in y ÷ change in x, with the unit.', ['Change in y = 15 − 3 = 12 g. Change in x = 6 − 2 = 4 min.', 'Rate = 12 ÷ 4 = 3 g/min.'], 'calculation', true),
  a.written('W8-15', 'A graph of gas volume against time has points (20 s, 8 cm³) and (60 s, 32 cm³) on its line. Show how to find the rate of reaction.', 'Find both changes, then divide the change in y by the change in x.', 'Change in y = 32 − 8 = 24 cm³. Change in x = 60 − 20 = 40 s. Rate = gradient = change in y ÷ change in x = 24 ÷ 40 = 0.6 cm³/s.', ['Finds the change in y: 32 − 8 = 24 cm³.', 'Finds the change in x: 60 − 20 = 40 s.', 'Divides the change in y by the change in x: 24 ÷ 40.', 'Gives the answer 0.6 with the unit cm³/s.'], ['Dividing the change in x by the change in y.', 'Using one point only.', 'Giving the answer without a unit.']),
]

export const lessonW8: ScienceLesson = {
  id: 'W-DAT-008-W', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Interpreting graphs', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
