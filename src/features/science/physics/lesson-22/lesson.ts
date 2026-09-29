import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { resistorPracFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.2.2 Series and parallel circuits (required practical: investigating resistance of resistors in series and in parallel), as on the supplied revision page' }
const skill = 'P-RESISTOR-PRACTICAL'
const series = author(skill, ['6.2.2'], ['aqa-physics'])
const parallel = author(skill, ['6.2.2'], ['aqa-physics'])
const results = author(skill, ['6.2.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const resistorPracSections = [
  { id: 'P22-01', label: 'Start here', detail: 'What do you need to measure?' },
  { id: 'P22-02', label: 'How do you test resistors in series?', detail: 'Method, measurements and R = V ÷ I' },
  { id: 'P22-05', label: 'What changes for parallel?', detail: 'One change and a fair test' },
  { id: 'P22-08', label: 'What should your results show?', detail: 'Two graphs and staying safe' },
  { id: 'P22-11', label: 'On your own', detail: 'Results, graphs and planning' },
]

const states: ScienceState[] = [
  { ...series.choice('P22-01', 'You want to see how adding resistors changes total resistance. Which two measurements let you work out resistance?', ['Length of wire and temperature', 'Mass and volume', 'Pd across the cell and current in the circuit', 'Time and distance'], 2, 'Resistance is worked out from a pd and a current.', ['Resistance = pd ÷ current.', 'So you need the pd of the cell and the current in the circuit.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(series, 'P22-02', 'How do you test resistors in series?'),
  series.choice('P22-03', 'Where should the ammeter be connected in this investigation?', ['In series, in the same loop as the resistors', 'In parallel across the cell', 'In parallel across one resistor', 'Anywhere, it makes no difference'], 0, 'An ammeter measures the current going through the circuit.', ['An ammeter is always connected in series.', 'The current has to pass through it to be measured.'], 'recall'),
  series.choice('P22-04', 'A 6.0 V cell drives a current of 0.20 A through one resistor. What is the total resistance of the circuit?', ['1.2 Ω', '0.033 Ω', '6.2 Ω', '30 Ω'], 3, 'Divide the pd by the current.', ['R = V ÷ I = 6.0 ÷ 0.20.', 'R = 30 Ω.'], 'calculation'),
  t(parallel, 'P22-05', 'What changes for parallel?'),
  parallel.choice('P22-06', 'For the parallel part of the investigation, what is the only change to the method?', ['Use a different cell', 'Add each new resistor in parallel with the first', 'Remove the ammeter', 'Use different resistors each time'], 1, 'The rest of the method stays the same.', ['Start with the same circuit.', 'Each new resistor is added in parallel with the first, on its own branch.']),
  parallel.choice('P22-07', 'Why use the same cell, resistors and ammeter for both the series and the parallel parts?', ['So the two sets of results can be compared fairly', 'So the results are always equal', 'So no calculation is needed', 'So the circuit never warms up'], 0, 'Think about keeping everything else the same.', ['Only the way the resistors are connected should change.', 'Then any difference in the results is caused by that change.']),
  t(results, 'P22-08', 'What should your results show?'),
  results.choice('P22-09', 'A student adds identical resistors in parallel, one at a time. What happens to the ammeter reading next to the cell?', ['It decreases', 'It stays the same', 'It increases', 'It falls to zero'], 2, 'Each new branch gives the current another route.', ['Each new branch takes extra current.', 'So the total current, on the ammeter next to the cell, increases.']),
  results.choice('P22-10', 'Why should you open the switch between readings?', ['To make the current bigger', 'Warm resistors and wires can change the results', 'To reset the ammeter', 'To increase the pd'], 1, 'Think about what a current does to a resistor.', ['A current makes resistors and wires warm up.', 'A warm resistor can change its resistance, and it is a safety risk.'], 'recall'),
  results.choice('P22-11', 'Which graph shows total resistance against the number of identical resistors when the resistors are added in parallel?', ['Graph 1', 'Graph 2', 'Graph 3', 'Graph 4'], 3, 'Adding resistors in parallel makes the total resistance smaller.', ['In parallel, more resistors means a smaller total resistance.', 'That gives a curve sloping downwards, which is graph 4.'], 'dataInterpretation', true, 'rprac-q-graphs'),
  series.choice('P22-12', 'A 4.5 V cell drives a current of 0.090 A through a circuit. What is the total resistance?', ['50 Ω', '0.02 Ω', '0.41 Ω', '4.4 Ω'], 0, 'Divide the pd by the current.', ['R = V ÷ I = 4.5 ÷ 0.090.', 'R = 50 Ω.'], 'calculation', true),
  series.choice('P22-13', 'Identical resistors are added in series to a 6.0 V cell. Current: 0.30 A, 0.15 A, 0.10 A. What happens to resistance?', ['It decreases', 'It increases each time', 'It stays at 20 Ω', 'It cannot be worked out'], 1, 'Work out R = V ÷ I for each reading.', ['6.0 ÷ 0.30 = 20 Ω, 6.0 ÷ 0.15 = 40 Ω and 6.0 ÷ 0.10 = 60 Ω.', 'The total resistance increases each time a resistor is added in series.'], 'dataInterpretation', true),
  parallel.choice('P22-14', 'A student uses a 3 V cell for series and a 6 V cell for parallel. What is wrong?', ['Nothing, the test is fine', 'The ammeter is in the wrong place', 'The cells are different, so it is not a fair comparison', 'The resistors should all be different'], 2, 'Only the connection of the resistors should change.', ['A fair comparison keeps the equipment the same.', 'Using different cells changes something else as well.'], 'understanding', true),
  series.written('P22-15', 'Describe how you would investigate the total resistance of identical resistors added in series, and say what graph you expect.', 'Method, then what you calculate, then the graph.', 'Build a series circuit with one resistor, a cell and an ammeter in series. Write down the pd of the cell and read the current. Calculate the total resistance using R = V ÷ I. Add another identical resistor in series and repeat, recording each result. Plot total resistance against the number of resistors. I expect a straight line sloping upwards, because more resistors in series means a larger total resistance. Open the switch between readings so the wires and resistors stay cool.', ['Build the circuit with the ammeter in series and note the pd of the cell.', 'Read the current and calculate R = V ÷ I.', 'Add identical resistors in series one at a time and repeat.', 'Plot total resistance against the number of resistors.', 'Expect a straight line sloping upwards.'], ['Connecting the ammeter in parallel.', 'Dividing the current by the pd.', 'Saying the total resistance goes down in series.']),
]

export const lessonP22: ScienceLesson = {
  id: 'P-ELE-022-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Investigating resistors in series and parallel', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
