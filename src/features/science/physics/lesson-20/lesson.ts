import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { seriesFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.2.2 Series and parallel circuits (series circuits: current, potential difference, resistance, cells in series), as on the supplied revision page' }
const skill = 'P-SER'
const meaning = author(skill, ['6.2.2'], ['aqa-physics'])
const rules = author(skill, ['6.2.2'], ['aqa-physics'])
const calc = author(skill, ['6.2.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const seriesSections = [
  { id: 'P20-01', label: 'Start here', detail: 'What a circuit needs to work' },
  { id: 'P20-02', label: 'What is a series circuit?', detail: 'One loop, one path' },
  { id: 'P20-05', label: 'What are the series rules?', detail: 'Current, pd and resistance' },
  { id: 'P20-09', label: 'How do you calculate the current?', detail: 'Total resistance, then I = V ÷ R' },
  { id: 'P20-12', label: 'On your own', detail: 'Series circuit calculations and reasoning' },
]

const states: ScienceState[] = [
  { ...meaning.choice('P20-01', 'What must be true for charge to flow round a circuit?', ['It must be a complete, closed loop', 'It must contain a fuse', 'It must contain a motor', 'It must have two batteries'], 0, 'Think about what happens if there is a gap in the wire.', ['Charge only flows round a complete loop with a source of pd.', 'A gap in the loop stops the flow.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(meaning, 'P20-02', 'What is a series circuit?'),
  meaning.choice('P20-03', 'Two lamps are in series with a battery. One lamp is unscrewed and removed. What happens to the other lamp?', ['Nothing changes', 'It gets brighter', 'It goes out too', 'The current flows the other way'], 2, 'Removing a component leaves a gap in the one loop.', ['A series circuit has one loop, so removing a component breaks it.', 'All the components stop working.']),
  meaning.choice('P20-04', 'Which meter is always connected in parallel, so it does not count as part of the series circuit?', ['Ammeter', 'Voltmeter', 'Switch', 'Resistor'], 1, 'It measures the pd across a component.', ['Voltmeters are always connected in parallel.', 'So they do not count as part of the series circuit.'], 'recall'),
  t(rules, 'P20-05', 'What are the series rules?'),
  rules.choice('P20-06', 'Two resistors are in series with a 12 V battery. The first has 5 V across it. What is across the second?', ['5 V', '17 V', '12 V', '7 V'], 3, 'The pds add up to the pd of the supply.', ['V total = V₁ + V₂, so 12 = 5 + V₂.', 'V₂ = 12 − 5 = 7 V.'], 'calculation'),
  rules.choice('P20-07', 'An ammeter in a series loop reads 0.40 A. A second ammeter is placed in the same loop. What does it read?', ['0.20 A', '0.80 A', '0.40 A', 'Zero'], 2, 'The current is the same everywhere in a series loop.', ['In a single closed loop the current has the same value everywhere.', 'So the second ammeter reads 0.40 A.']),
  rules.choice('P20-08', 'A 3.0 Ω resistor and a 4.0 Ω resistor are connected in series. What is the total resistance?', ['12 Ω', '7.0 Ω', '1.0 Ω', '3.5 Ω'], 1, 'In series, the resistances add up.', ['R total = R₁ + R₂ = 3.0 + 4.0.', 'That equals 7.0 Ω.'], 'calculation'),
  t(calc, 'P20-09', 'How do you calculate the current?'),
  calc.choice('P20-10', 'A 3.0 Ω and a 9.0 Ω resistor are in series with a 36 V battery. What is the current?', ['12 A', '0.33 A', '1.0 A', '3.0 A'], 3, 'First find the total resistance, then use I = V ÷ R.', ['R total = 3.0 + 9.0 = 12 Ω.', 'I = V ÷ R = 36 ÷ 12 = 3.0 A.'], 'calculation'),
  calc.choice('P20-11', 'Three 1.5 V cells are connected in series, all facing the same way. What pd do they supply together?', ['4.5 V', '1.5 V', '3.0 V', '0.5 V'], 0, 'Add the pd of each cell.', ['Cells in series facing the same way add their pds.', '1.5 + 1.5 + 1.5 = 4.5 V.'], 'calculation'),
  calc.choice('P20-12', 'Resistors of 3.0 Ω, 4.0 Ω and 5.0 Ω are in series. The current is 0.50 A. What is the battery’s pd?', ['12.5 V', '6.0 V', '24 V', '0.042 V'], 1, 'Find the total resistance first, then use V = IR.', ['R total = 3.0 + 4.0 + 5.0 = 12 Ω.', 'V = I × R = 0.50 × 12 = 6.0 V.'], 'calculation', true, 'series-q-circuit'),
  rules.choice('P20-13', 'Three resistors are in series with a 12 V battery. Two have 2.0 V and 4.0 V. What is across the third?', ['8.0 V', '10 V', '6.0 V', '4.0 V'], 2, 'The three pds must add up to the pd of the battery.', ['V total = V₁ + V₂ + V₃, so 12 = 2.0 + 4.0 + V₃.', 'V₃ = 12 − 6.0 = 6.0 V.'], 'dataInterpretation', true, 'series-q-voltmeters'),
  rules.choice('P20-14', 'A student adds another resistor in series to a circuit. The battery stays the same. What happens to the current?', ['It gets smaller', 'It gets bigger', 'It stays the same', 'It doubles'], 0, 'The total resistance goes up.', ['Adding a resistor in series increases the total resistance.', 'So the current in the circuit goes down.'], 'application', true),
  meaning.written('P20-15', 'Two lamps are in series with a battery. Describe what is true about the current, the pd and the resistance.', 'Think about each of the three series rules.', 'The current is the same everywhere in the loop, so it is the same through both lamps. The pd of the battery is shared between the two lamps, so the pds across the lamps add up to the pd of the battery. The total resistance is the sum of the resistance of each lamp. If one lamp is removed, the circuit is broken and both go out.', ['The current is the same through both lamps.', 'The battery pd is shared between the lamps: V total = V₁ + V₂.', 'The total resistance is the sum of the lamps’ resistances.', 'If one lamp is removed the circuit is broken and both stop working.'], ['Saying the current is shared out between the lamps.', 'Saying the total resistance is less than either lamp.', 'Saying each lamp gets the full pd of the battery.']),
]

export const lessonP20: ScienceLesson = {
  id: 'P-ELE-020-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Series circuits', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
