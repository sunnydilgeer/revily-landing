import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { isotopeFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.4.1.2 Mass number, atomic number and isotopes (isotopes and unstable isotopes), as on the supplied revision page' }
const skill = 'P-ISOTOPE'
const numbers = author(skill, ['6.4.1.2'], ['aqa-physics'])
const count = author(skill, ['6.4.1.2'], ['aqa-physics'])
const iso = author(skill, ['6.4.1.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const isotopeSections = [
  { id: 'P33-01', label: 'Start here', detail: 'What makes an element?' },
  { id: 'P33-02', label: 'What do the two numbers mean?', detail: 'Atomic number, mass number and symbols' },
  { id: 'P33-05', label: 'How do you count the neutrons?', detail: 'A worked example, then your turn' },
  { id: 'P33-08', label: 'What are isotopes?', detail: 'Same protons, different neutrons' },
  { id: 'P33-11', label: 'On your own', detail: 'Count and compare' },
]

const states: ScienceState[] = [
  { ...numbers.choice('P33-01', 'Which number decides which element an atom belongs to?', ['The number of protons', 'The number of neutrons', 'The mass number', 'The number of shells'], 0, 'Think about what the periodic table is ordered by.', ['Every atom of an element has the same number of protons.', 'So the number of protons decides the element.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(numbers, 'P33-02', 'What do the two numbers mean?'),
  numbers.choice('P33-03', 'In the symbol ¹⁶₈O, what does the 8 show?', ['The number of neutrons', 'The mass number', 'The number of protons', 'The number of atoms'], 2, 'The bottom number is the atomic number.', ['The bottom number is the atomic number.', 'The atomic number is the number of protons.'], 'recall'),
  numbers.choice('P33-04', 'The mass number of an atom is the number of…', ['protons', 'protons plus neutrons', 'neutrons plus electrons', 'electrons'], 1, 'Mass number counts everything in the nucleus.', ['The nucleus contains protons and neutrons.', 'The mass number counts both.'], 'recall'),
  t(count, 'P33-05', 'How do you count the neutrons?'),
  count.choice('P33-06', 'How many neutrons are in a fluorine atom, ¹⁹₉F?', ['19', '9', '28', '10'], 3, 'Neutrons = mass number − atomic number.', ['Write the sum: 19 − 9.', 'Neutrons = 19 − 9 = 10.'], 'calculation'),
  count.choice('P33-07', 'How many neutrons are in a lithium atom, ⁷₃Li?', ['4', '3', '7', '10'], 0, 'Take the atomic number away from the mass number.', ['Write the sum: 7 − 3.', 'Neutrons = 7 − 3 = 4.'], 'calculation'),
  t(iso, 'P33-08', 'What are isotopes?'),
  iso.choice('P33-09', 'Which pair are isotopes of the same element?', ['¹⁴₆C and ¹⁴₇N', '¹²₆C and ¹⁴₆C', '¹⁶₈O and ¹⁶₇N', '¹²₆C and ¹⁶₈O'], 1, 'Isotopes have the same bottom number.', ['Isotopes have the same atomic number.', '¹²₆C and ¹⁴₆C both have 6 protons but different mass numbers.']),
  iso.choice('P33-10', 'What is the same in all isotopes of an element?', ['The mass number', 'The number of neutrons', 'The atomic number', 'The total number of particles'], 2, 'Same element means the same number of protons.', ['Isotopes are atoms of the same element.', 'So they have the same number of protons, which is the atomic number.'], 'recall'),
  count.choice('P33-11', 'How many neutrons are in a chlorine atom, ³⁵₁₇Cl?', ['35', '52', '17', '18'], 3, 'Neutrons = mass number − atomic number.', ['Write the sum: 35 − 17.', 'Neutrons = 35 − 17 = 18.'], 'calculation', true),
  iso.choice('P33-12', 'The diagram shows the nuclei of two atoms, X and Y. Which statement is correct?', ['They are different elements', 'They are isotopes of the same element', 'They have different numbers of protons', 'They have the same mass number'], 1, 'Count the protons, then count the neutrons.', ['Both have the same number of protons, so they are the same element.', 'They have different numbers of neutrons, so they are isotopes.'], 'dataInterpretation', true, 'isotope-q-nuclei'),
  numbers.choice('P33-13', 'An atom has atomic number 6 and mass number 14. Which description is correct?', ['Carbon with 8 neutrons', 'Carbon with 6 neutrons', 'Nitrogen with 8 neutrons', 'Carbon with 14 neutrons'], 0, 'Atomic number 6 is carbon. Then subtract.', ['Atomic number 6 means 6 protons, so it is carbon.', 'Neutrons = 14 − 6 = 8.'], 'application', true),
  iso.written('P33-14', 'Explain what isotopes are. Use carbon-12 and carbon-14 as your example.', 'Say what is the same and what is different.', 'Isotopes are atoms of the same element with the same number of protons but different numbers of neutrons. Carbon-12 and carbon-14 both have 6 protons. Carbon-12 has 6 neutrons and carbon-14 has 8 neutrons, so they have different mass numbers.', ['Says isotopes have the same number of protons.', 'Says isotopes have different numbers of neutrons.', 'Gives 6 protons for both carbon isotopes.', 'Gives 6 and 8 neutrons, or mass numbers 12 and 14.'], ['Saying isotopes have different numbers of protons.', 'Saying isotopes are different elements.']),
]

export const lessonP33: ScienceLesson = {
  id: 'P-ATM-033-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Isotopes', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
