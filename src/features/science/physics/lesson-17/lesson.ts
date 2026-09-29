import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wireResistFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.2.1.3 Resistance (required practical: how the length of a wire affects its resistance), as on the supplied revision page' }
const skill = 'P-WIRE'
const setup = author(skill, ['6.2.1.3'], ['aqa-physics'])
const method = author(skill, ['6.2.1.3'], ['aqa-physics'])
const results = author(skill, ['6.2.1.3'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wireResistSections = [
  { id: 'P17-01', label: 'Start here', detail: 'Short wire or long wire' },
  { id: 'P17-02', label: 'What are we measuring, and how is it wired?', detail: 'Variables, ammeter, voltmeter, crocodile clips' },
  { id: 'P17-05', label: 'How do you take the readings?', detail: 'Method and keeping the wire cool' },
  { id: 'P17-08', label: 'What do the results show?', detail: 'R = V ÷ I, table and graph' },
  { id: 'P17-11', label: 'On your own', detail: 'Variables, calculation, graph and prediction' },
]

const states: ScienceState[] = [
  { ...setup.choice('P17-01', 'Two wires have the same metal and thickness, one short and one long. Which slows the flow of charge more?', ['The short wire', 'The long wire', 'Both slow it down by exactly the same amount', 'Neither wire slows the flow at all'], 1, 'Think about the distance the charge has to travel through the wire.', ['A longer wire is more likely to have a greater resistance.', 'That is what this investigation tests.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(setup, 'P17-02', 'What are we measuring, and how is it wired?'),
  setup.choice('P17-03', 'Where should the ammeter be placed in this circuit?', ['In parallel across the test wire', 'Next to the ruler, outside the circuit', 'In series with the test wire', 'Across the battery only'], 2, 'The ammeter measures the current in the loop.', ['An ammeter goes in series, in the same loop as the test wire.', 'The voltmeter is the meter that goes in parallel.']),
  setup.choice('P17-04', 'In this investigation, which is the independent variable?', ['The current in amperes', 'The resistance of the wire', 'The length of wire between the clips', 'The pd across the wire'], 2, 'It is the thing the student chooses to change.', ['The student changes the length by moving a crocodile clip.', 'The resistance is measured, so it is the dependent variable.']),
  t(method, 'P17-05', 'How do you take the readings?'),
  method.choice('P17-06', 'Why should the switch be opened between readings?', ['So the wire cools and its resistance stays steady', 'So the ammeter can be reset to zero', 'So the wire becomes longer', 'So the battery can charge up again'], 0, 'Think about what current does to a thin wire.', ['Current can heat the wire up.', 'A hotter wire has a different resistance, which would spoil the results, so the switch is opened to let it cool.']),
  method.choice('P17-07', 'Which is the correct order for one reading?', ['Move the clip, close the switch, open the switch, read the meters', 'Close the switch, read the meters, open the switch, move the clip', 'Read the meters, close the switch, move the clip, open the switch', 'Open the switch, read the meters, close the switch, move the clip'], 1, 'Read the meters while the current is flowing, then let the wire cool.', ['The meters only read while the switch is closed.', 'Then open the switch, and only after that move the clip.']),
  t(results, 'P17-08', 'What do the results show?'),
  results.choice('P17-09', 'For one length of wire the voltmeter reads 1.5 V and the ammeter reads 0.50 A. What is the resistance?', ['0.75 Ω', '3.0 Ω', '2.0 Ω', '0.33 Ω'], 1, 'Use R = V ÷ I.', ['R = V ÷ I = 1.5 ÷ 0.50.', 'That equals 3.0 Ω.'], 'calculation'),
  results.choice('P17-10', 'A student plots resistance against length and gets a straight line through the origin. What does this show?', ['Resistance is directly proportional to length', 'Resistance does not depend on length', 'Resistance falls as length increases', 'The wire heated up during the experiment'], 0, 'Straight through the origin means both go up in the same proportion.', ['Doubling the length doubles the resistance.', 'That is what directly proportional means.']),
  method.choice('P17-11', 'A student tests different lengths of wire. Which must stay the same to make it a fair test?', ['The length of the wire', 'The type and thickness of the wire', 'The reading on the ruler', 'The resistance of the wire'], 1, 'Only the length should change.', ['Everything except the length must be kept the same.', 'So the same type and thickness of wire is used each time.'], 'application', true),
  results.choice('P17-12', 'A test wire has 2.4 V across it and 0.60 A through it. What is its resistance?', ['4.0 Ω', '1.4 Ω', '0.25 Ω', '14 Ω'], 0, 'Divide the pd by the current.', ['R = V ÷ I = 2.4 ÷ 0.60.', 'That equals 4.0 Ω.'], 'calculation', true),
  results.choice('P17-13', 'Use the graph. What is the resistance of 30 cm of this wire?', ['4.0 Ω', '8.0 Ω', '6.0 Ω', '3.0 Ω'], 2, 'Go up from 30 cm to the line, then across to the resistance axis.', ['Read up from 30 cm to the line of best fit.', 'Then read across to the resistance axis: 6.0 Ω.'], 'dataInterpretation', true, 'wirer-q-graph'),
  results.choice('P17-14', 'A 20 cm length of wire has a resistance of 5.0 Ω. What is the resistance of 40 cm?', ['2.5 Ω', '5.0 Ω', '20 Ω', '10 Ω'], 3, 'Resistance is directly proportional to length.', ['40 cm is double 20 cm.', 'So the resistance doubles to 10 Ω.'], 'application', true),
  method.written('P17-15', 'Describe how you would find out how the length of a wire affects its resistance. Include one safety point.', 'Say what you change, what you measure and how you calculate.', 'Set up a series circuit with a battery, switch, test wire on a metre ruler and an ammeter, with a voltmeter connected in parallel across the wire. Use a crocodile clip to choose a length, close the switch and record the current and pd. Then open the switch so the wire does not heat up and change its resistance. Repeat for a range of lengths. Work out R = V ÷ I for each length and plot resistance against length. Keep the type and thickness of the wire the same.', ['Series circuit with an ammeter in series with the test wire.', 'Voltmeter connected in parallel across the test wire.', 'Change the length using a crocodile clip on a metre ruler.', 'Record current and pd, then calculate R = V ÷ I for each length.', 'Open the switch between readings so the wire does not heat up.', 'Plot resistance against length and draw a line of best fit.'], ['Putting the voltmeter in series with the wire.', 'Changing the thickness of the wire as well as the length.', 'Leaving the switch closed all the time.']),
]

export const lessonP17: ScienceLesson = {
  id: 'P-ELE-017-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Investigating resistance in a wire', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
