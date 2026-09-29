import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { ivFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.2.1.4 Ohmic conductors, filament lamps and diodes: I–V characteristics (required practical), as on the supplied revision page' }
const skill = 'P-IV'
const meaning = author(skill, ['6.2.1.4'], ['aqa-physics'])
const method = author(skill, ['6.2.1.4'], ['aqa-physics'])
const shapes = author(skill, ['6.2.1.4'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const ivSections = [
  { id: 'P18-01', label: 'Start here', detail: 'Pd up, what happens to the current' },
  { id: 'P18-02', label: 'What is an I–V characteristic?', detail: 'Linear, non-linear and R = V ÷ I' },
  { id: 'P18-05', label: 'How do you collect the data?', detail: 'Circuit, readings, reversing the current' },
  { id: 'P18-08', label: 'What do the three graphs look like?', detail: 'Ohmic conductor, filament lamp, diode' },
  { id: 'P18-11', label: 'On your own', detail: 'Matching graphs and reading points' },
]

const states: ScienceState[] = [
  { ...meaning.choice('P18-01', 'A student slowly increases the pd across a fixed resistor at constant temperature. What happens to the current?', ['It gets smaller', 'It stays the same', 'It flows the other way', 'It gets bigger'], 3, 'Think about what V = IR says when R stays the same.', ['The resistance stays the same.', 'So a bigger pd gives a bigger current.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(meaning, 'P18-02', 'What is an I–V characteristic?'),
  meaning.choice('P18-03', 'A component has a curved I–V characteristic. What is it called?', ['A linear component', 'A non-linear component', 'A fixed resistor', 'A source of pd'], 1, 'Straight is linear. Curved is the other one.', ['A curved graph means a non-linear component.', 'Filament lamps and diodes are examples.']),
  meaning.choice('P18-04', 'At one point on an I–V graph the pd is 6.0 V and the current is 0.20 A. What is the resistance?', ['1.2 Ω', '0.033 Ω', '26 Ω', '30 Ω'], 3, 'Use R = V ÷ I.', ['R = V ÷ I = 6.0 ÷ 0.20.', 'That equals 30 Ω.'], 'calculation'),
  t(method, 'P18-05', 'How do you collect the data?'),
  method.choice('P18-06', 'What is the job of the variable resistor in this circuit?', ['To measure the current', 'To change the current and the pd across the component', 'To measure the pd', 'To protect the ammeter from light'], 1, 'It lets you take readings at different settings.', ['Changing the variable resistor changes the current in the circuit.', 'That also changes the pd across the component, giving you many readings.']),
  method.choice('P18-07', 'Why is a protective resistor added in series when testing a diode?', ['To make the diode glow', 'To stop current flowing at all', 'To keep the current from getting too high', 'To measure the pd'], 2, 'A diode can be damaged by too much current.', ['A protective resistor increases the total resistance.', 'This keeps the current low enough to protect the diode.']),
  t(shapes, 'P18-08', 'What do the three graphs look like?'),
  shapes.choice('P18-09', 'Why does the I–V graph of a filament lamp get less steep as the pd increases?', ['Its resistance increases as the filament heats up', 'Its resistance decreases as the filament cools', 'It only lets current flow one way', 'The battery gets weaker'], 0, 'Think about the temperature of the filament.', ['A bigger current heats the filament.', 'A hotter filament has more resistance, so the current grows more slowly.']),
  shapes.choice('P18-10', 'Which component has an I–V graph that is flat at first and then curves up quickly?', ['A filament lamp', 'A fixed resistor', 'A diode', 'A piece of wire at constant temperature'], 2, 'It only lets current flow easily one way.', ['A diode has a very high resistance in the reverse direction.', 'So its graph is flat, then rises steeply.']),
  shapes.choice('P18-11', 'Which graph shows the I–V characteristic of a filament lamp?', ['Graph 3', 'Graph 2', 'Graph 1', 'None of them'], 1, 'Look for the curve that gets less steep and is the same on both sides of the origin.', ['A filament lamp gives a curve that flattens as the pd increases, in both directions.', 'Graph 2 is that shape.'], 'dataInterpretation', true, 'ivchar-q-graphs'),
  meaning.choice('P18-12', 'A lamp’s graph has a point with 3.0 V and 0.25 A. What is the resistance there?', ['0.083 Ω', '0.75 Ω', '3.3 Ω', '12 Ω'], 3, 'Use R = V ÷ I.', ['R = V ÷ I = 3.0 ÷ 0.25.', 'That equals 12 Ω.'], 'calculation', true),
  shapes.choice('P18-13', 'A component has an I–V graph that is a straight line through the origin. What does this tell you?', ['Its resistance increases with current', 'Its current is directly proportional to its pd', 'Current only flows in one direction', 'It is a diode'], 1, 'A straight line through the origin means direct proportion.', ['The current is directly proportional to the pd.', 'So its resistance is constant: it is an ohmic conductor.'], 'understanding', true),
  method.choice('P18-14', 'A student wants to plot the I–V graph of a diode. Which change to the circuit is needed?', ['A protective resistor in series with the diode', 'The voltmeter in series with the diode', 'A longer wire in the circuit', 'The variable resistor taken out'], 0, 'Think about protecting the diode from too much current.', ['A protective resistor is added in series with the diode.', 'A milliammeter is also used, because the currents are small.'], 'application', true),
  meaning.written('P18-15', 'Explain the shape of a filament lamp’s I–V graph where the current and the pd are both positive.', 'Think about what the current does to the filament.', 'As the pd increases, the current through the lamp increases. The filament heats up as the current increases. A hotter filament has a greater resistance, so it is harder for the current to flow. So the graph gets less steep and is a curve, not a straight line.', ['As the pd increases, the current increases.', 'The filament (wire) gets hotter as the current increases.', 'The resistance of the filament increases as it gets hotter.', 'So it is harder for current to flow and the graph gets less steep (a curve).'], ['Saying the resistance of the lamp stays constant.', 'Saying the lamp only lets current flow in one direction.', 'Saying the graph is a straight line through the origin.']),
]

export const lessonP18: ScienceLesson = {
  id: 'P-ELE-018-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'I–V characteristics', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
