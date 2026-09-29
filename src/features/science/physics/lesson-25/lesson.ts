import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { chargeEnergyFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.2.4.1 Power (P = VI, P = I²R); 6.2.4.2 Energy transfers in everyday appliances (E = QV, energy transferred per charge), as on the supplied revision page' }
const skill = 'P-ENERGY-CHARGE'
const energy = author(skill, ['6.2.4.2'], ['aqa-physics'])
const vi = author(skill, ['6.2.4.1'], ['aqa-physics'])
const i2r = author(skill, ['6.2.4.1'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const chargeEnergySections = [
  { id: 'P25-01', label: 'Start here', detail: 'A 12 V battery and a 3 V battery' },
  { id: 'P25-02', label: 'What does pd tell you about energy?', detail: 'Energy transferred = charge × pd' },
  { id: 'P25-05', label: 'How do you find power from current and pd?', detail: 'P = V × I' },
  { id: 'P25-08', label: 'What if you do not know the pd?', detail: 'P = I² × R' },
  { id: 'P25-11', label: 'On your own', detail: 'Choosing and using the equations' },
]

const states: ScienceState[] = [
  { ...energy.choice('P25-01', 'A 12 V battery and a 3 V battery each push the same charge round a circuit. Which transfers more energy?', ['The 3 V battery', 'They transfer the same amount', 'The 12 V battery', 'Neither, because the charge is the same'], 2, 'Think about what a larger pd means.', ['A larger potential difference transfers more energy to each coulomb of charge.', 'So the 12 V battery transfers more energy.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(energy, 'P25-02', 'What does pd tell you about energy?'),
  energy.choice('P25-03', 'A 12 V battery passes 20 C of charge through a circuit. How much energy does it transfer?', ['0.6 J', '32 J', '240 J', '12 J'], 2, 'Use E = Q × V and put the numbers straight in.', ['E = Q × V = 20 × 12.', 'E = 240 J.'], 'calculation'),
  energy.choice('P25-04', 'The same battery now passes twice as much charge. What happens to the energy transferred?', ['It doubles', 'It halves', 'It stays the same', 'It falls to zero'], 0, 'E = Q × V, and V stays the same.', ['Energy transferred is charge × pd.', 'Twice the charge with the same pd gives twice the energy.']),
  t(vi, 'P25-05', 'How do you find power from current and pd?'),
  vi.choice('P25-06', 'A lamp has 9.0 V across it and a current of 3.0 A through it. What is its power?', ['3.0 W', '12 W', '0.33 W', '27 W'], 3, 'Use P = V × I.', ['P = V × I = 9.0 × 3.0.', 'P = 27 W.'], 'calculation'),
  vi.choice('P25-07', 'Two appliances have the same pd across them. Appliance X has a larger current than appliance Y. Which has the larger power?', ['Appliance Y', 'Appliance X', 'They have the same power', 'It cannot be worked out'], 1, 'P = V × I. The pd is the same for both.', ['With the same pd, a larger current means a larger power.', 'So appliance X has the larger power.']),
  t(i2r, 'P25-08', 'What if you do not know the pd?'),
  i2r.choice('P25-09', 'A current of 2.0 A flows through a resistor of 6.0 Ω. What is the power?', ['12 W', '24 W', '3.0 W', '72 W'], 1, 'Square the current first, then multiply by the resistance.', ['I² = 2.0 × 2.0 = 4.0.', 'P = I² × R = 4.0 × 6.0 = 24 W.'], 'calculation'),
  i2r.choice('P25-10', 'You know the current through a heater and the resistance of the heater. Which equation gives the power?', ['P = V × I', 'E = Q × V', 'P = I² × R', 'R = V ÷ I'], 2, 'Look for the equation with current and resistance in it.', ['P = I² × R uses the current and the resistance.', 'The pd is not needed.'], 'recall'),
  energy.choice('P25-11', 'A 9.0 V battery passes 30 C of charge through a motor. How much energy is transferred?', ['0.30 J', '39 J', '3.3 J', '270 J'], 3, 'Use E = Q × V.', ['E = Q × V = 30 × 9.0.', 'E = 270 J.'], 'calculation', true),
  vi.choice('P25-12', 'A 12 V lamp has a current of 2.5 A through it. What is its power?', ['30 W', '4.8 W', '14.5 W', '9.5 W'], 0, 'Use P = V × I.', ['P = V × I = 12 × 2.5.', 'P = 30 W.'], 'calculation', true),
  i2r.choice('P25-13', 'A current of 4.0 A flows through an element with a resistance of 3.0 Ω. What is its power?', ['12 W', '48 W', '36 W', '0.75 W'], 1, 'Square the current first: I² = I × I.', ['I² = 4.0 × 4.0 = 16.', 'P = I² × R = 16 × 3.0 = 48 W.'], 'calculation', true),
  energy.choice('P25-14', 'An appliance has 230 V across it and a current of 2.0 A. Its resistance is unknown. Which equation gives power?', ['P = I² × R', 'P = V × I', 'E = Q × V', 'V = I × R'], 1, 'You know the pd and the current.', ['P = V × I uses the pd and the current.', 'P = 230 × 2.0 = 460 W.'], 'understanding', true),
  i2r.written('P25-15', 'A student says a bigger pd always means more power. Is this right? Then name the equation using current and resistance.', 'Think about what else is in P = V × I.', 'Power = potential difference × current, P = V × I. If the current stays the same, a bigger pd gives a bigger power. But the current might change too. A bigger pd with a much smaller current could give a smaller power. So the student is only right when the current stays the same. When you know only the current and the resistance, use power = current squared × resistance, P = I² × R.', ['P = V × I: power depends on both the pd and the current.', 'A bigger pd gives a bigger power only if the current stays the same.', 'The current could change, so the power might not go up.', 'Use P = I² × R when you know the current and the resistance.'], ['Saying power depends only on the pd.', 'Using P = V × I when the pd is not known.', 'Not squaring the current.']),
]

export const lessonP25: ScienceLesson = {
  id: 'P-ELE-025-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Energy, charge and power', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
