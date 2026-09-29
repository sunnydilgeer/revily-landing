import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { nuclearEquationFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.4.2.2 Nuclear equations (alpha, beta and gamma emission, balancing mass and atomic numbers), as on the supplied revision page' }
const skill = 'P-NUCLEAR-EQ'
const write = author(skill, ['6.4.2.2'], ['aqa-physics'])
const alpha = author(skill, ['6.4.2.2'], ['aqa-physics'])
const beta = author(skill, ['6.4.2.2'], ['aqa-physics'])
const gamma = author(skill, ['6.4.2.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const nuclearEquationSections = [
  { id: 'P35-01', label: 'Start here', detail: 'Losing an alpha particle' },
  { id: 'P35-02', label: 'How is a decay written?', detail: 'Before, after and the balancing rule' },
  { id: 'P35-05', label: 'How does alpha decay change a nucleus?', detail: 'A worked example, then your turn' },
  { id: 'P35-08', label: 'How does beta decay change a nucleus?', detail: 'Neutron to proton' },
  { id: 'P35-11', label: 'What does gamma change?', detail: 'Neither number' },
  { id: 'P35-13', label: 'On your own', detail: 'Complete and identify decays' },
]

const states: ScienceState[] = [
  { ...write.choice('P35-01', 'An alpha particle is 2 protons and 2 neutrons. What happens to the number of protons when a nucleus emits one?', ['It goes down by 2', 'It goes up by 2', 'It stays the same', 'It goes down by 4'], 0, 'The alpha particle carries protons away.', ['The alpha particle takes 2 protons away with it.', 'So the number of protons goes down by 2.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(write, 'P35-02', 'How is a decay written?'),
  write.choice('P35-03', 'In a nuclear equation, what must be equal on both sides of the arrow?', ['Only the mass numbers', 'Only the atomic numbers', 'The total mass numbers and the total atomic numbers', 'The number of letters'], 2, 'There is one golden rule with two rows.', ['The top row of mass numbers must balance.', 'The bottom row of atomic numbers must balance too.'], 'recall'),
  write.choice('P35-04', 'Which symbol is used for an alpha particle in a nuclear equation?', ['⁰₋₁e', '⁴₂He', '²₄He', 'γ'], 1, 'An alpha particle is the same as a helium nucleus.', ['An alpha particle has a mass number of 4 and an atomic number of 2.', 'That is written ⁴₂He, with the mass number on top.'], 'recall'),
  t(alpha, 'P35-05', 'How does alpha decay change a nucleus?'),
  alpha.choice('P35-06', 'Radium-226 has atomic number 88. It decays by alpha emission. What are the mass number and atomic number of the new nucleus?', ['222 and 86', '226 and 86', '222 and 88', '230 and 90'], 0, 'Mass number down by 4, atomic number down by 2.', ['Mass number: 226 − 4 = 222.', 'Atomic number: 88 − 2 = 86.'], 'calculation'),
  alpha.choice('P35-07', 'Americium-241 has atomic number 95. It decays by alpha emission. What are the mass number and atomic number of the new nucleus?', ['241 and 95', '237 and 97', '245 and 97', '237 and 93'], 3, 'Take 4 off the top number and 2 off the bottom number.', ['Mass number: 241 − 4 = 237.', 'Atomic number: 95 − 2 = 93.'], 'calculation'),
  t(beta, 'P35-08', 'How does beta decay change a nucleus?'),
  beta.choice('P35-09', 'Cobalt-60 has atomic number 27. It decays by beta emission. What are the mass number and atomic number of the new nucleus?', ['60 and 26', '56 and 25', '60 and 28', '61 and 27'], 2, 'In beta decay the mass number stays the same and the atomic number goes up by 1.', ['Mass number stays at 60.', 'Atomic number: 27 + 1 = 28.'], 'calculation'),
  beta.choice('P35-10', 'Iodine-131 has atomic number 53. It decays by beta emission. What are the mass number and atomic number of the new nucleus?', ['131 and 54', '131 and 52', '127 and 51', '132 and 53'], 0, 'The mass number stays the same. The atomic number goes up by 1.', ['Mass number stays at 131.', 'Atomic number: 53 + 1 = 54.'], 'calculation'),
  t(gamma, 'P35-11', 'What does gamma change?'),
  gamma.choice('P35-12', 'Which change happens to a nucleus when it emits a gamma ray?', ['The mass number goes down by 4', 'The atomic number goes up by 1', 'The atomic number goes down by 2', 'Neither number changes'], 3, 'A gamma ray carries away energy only.', ['A gamma ray takes away extra energy, not particles.', 'So neither the mass number nor the atomic number changes.']),
  alpha.choice('P35-13', 'Radon-222 has atomic number 86. It decays by alpha emission. What are the mass number and atomic number of the new nucleus?', ['222 and 84', '218 and 84', '218 and 86', '226 and 88'], 1, 'Take 4 off the top number and 2 off the bottom number.', ['Mass number: 222 − 4 = 218.', 'Atomic number: 86 − 2 = 84.'], 'calculation', true),
  beta.choice('P35-14', 'The decay ⁹⁰₃₈Sr → ⁹⁰₃₉Y + radiation gives out which type of radiation?', ['Alpha', 'Beta', 'Gamma', 'Neutron'], 1, 'Compare the top numbers, then the bottom numbers.', ['The mass number stays at 90.', 'The atomic number goes up by 1, which happens in beta decay.'], 'application', true),
  alpha.choice('P35-15', 'The diagram shows an alpha decay with one number missing. What is it?', ['80', '84', '82', '86'], 2, 'Balance the bottom row: left side = right side.', ['The alpha particle has atomic number 2.', 'Atomic number: 84 − 2 = 82.'], 'calculation', true, 'nucleq-q-missing'),
  beta.written('P35-16', 'Sodium-24 (atomic number 11) decays by beta emission into magnesium. Write the equation and explain why it balances.', 'Write the new nucleus first, then check the top row and the bottom row.', '²⁴₁₁Na → ²⁴₁₂Mg + ⁰₋₁e. The top row balances: 24 = 24 + 0. The bottom row balances: 11 = 12 + (−1). A neutron turned into a proton, so the atomic number went up by 1 and the mass number stayed the same.', ['Writes the new nucleus as magnesium with mass number 24 and atomic number 12.', 'Writes the beta particle as ⁰₋₁e.', 'Shows the top row balances: 24 = 24 + 0.', 'Shows the bottom row balances: 11 = 12 + (−1).'], ['Changing the mass number in beta decay.', 'Writing the beta particle as ⁴₂He.']),
]

export const lessonP35: ScienceLesson = {
  id: 'P-ATM-035-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Nuclear equations', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
