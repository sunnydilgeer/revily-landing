import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { atomFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.1.1.1 Atoms, elements and compounds (atoms and chemical symbols); 5.1.1.4 Relative electrical charges of subatomic particles; 5.1.1.5 Size and mass of atoms (atomic number, mass number, isotopes, ions); 5.1.1.6 Relative atomic mass' }
const skill = 'C-ATOMS-ELEMENTS'
const atoms = author(skill, ['5.1.1.1'], ['aqa-chemistry'])
const size = author(skill, ['5.1.1.5', '5.1.1.1'], ['aqa-chemistry'])
const particles = author(skill, ['5.1.1.4', '5.1.1.5'], ['aqa-chemistry'])
const numbers = author(skill, ['5.1.1.5', '5.1.1.4'], ['aqa-chemistry'])
const elements = author(skill, ['5.1.1.1', '5.1.1.5'], ['aqa-chemistry'])
const average = author(skill, ['5.1.1.6'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const atomSections = [
  { id: 'C1-01', label: 'Start here', detail: 'Cutting gold in half' },
  { id: 'C1-02', label: 'What is inside an atom?', detail: 'Nucleus, protons, neutrons and electrons' },
  { id: 'C1-05', label: 'How heavy, and what charge?', detail: 'Relative mass and relative charge' },
  { id: 'C1-08', label: 'What do the numbers tell you?', detail: 'Atomic number, mass number and ions' },
  { id: 'C1-11', label: 'What makes an element?', detail: 'Elements, symbols and isotopes' },
  { id: 'C1-14', label: 'What is the average mass?', detail: 'Working out relative atomic mass' },
  { id: 'C1-17', label: 'On your own', detail: 'An atom, aluminium, neon and oxygen' },
]

const states: ScienceState[] = [
  { ...atoms.choice('C1-01', 'You keep cutting a piece of pure gold in half. What is the smallest piece that is still gold?', ['A speck of gold dust you can just see', 'A single atom of gold', 'There is no smallest piece'], 1, 'Think about what everything is made of.', ['Everything is made of tiny particles called atoms.', 'So the smallest piece that is still gold is one atom of gold. It is far too small to see.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(size, 'C1-02', 'What is inside an atom?'),
  size.choice('C1-03', 'Which particles are found in the nucleus of an atom?', ['Protons and electrons', 'Electrons only', 'Protons and neutrons', 'Neutrons and electrons'], 2, 'Which particles did you see packed in the middle?', ['The nucleus contains protons and neutrons.', 'Electrons are not in the nucleus: they move around it in shells.']),
  size.choice('C1-04', 'How does the radius of the nucleus compare with the radius of the whole atom?', ['About half as big', 'About the same size', 'About 1/10 000 as big'], 2, 'Is an atom mostly nucleus, or mostly empty space?', ['The radius of an atom is about 1 × 10⁻¹⁰ m and the radius of its nucleus is about 1 × 10⁻¹⁴ m.', 'So the nucleus is only about 1/10 000 of the radius of the atom.']),
  t(particles, 'C1-05', 'How heavy, and what charge?'),
  particles.choice('C1-06', 'Which particle has a relative charge of −1 and a very small mass?', ['Proton', 'Electron', 'Neutron', 'Nucleus'], 1, 'Which particle is negative and very light?', ['A proton is +1 and a neutron is 0, and each has a relative mass of 1.', 'An electron has a relative charge of −1 and a very small mass.']),
  particles.choice('C1-07', 'An atom has 6 protons. Why does it have no overall charge?', ['Its neutrons cancel the charge of the protons', 'It has 6 electrons, so the charges cancel', 'Protons have no charge', 'Its electrons have no charge'], 1, 'Which particle has the opposite charge to a proton?', ['Neutrons have no charge, so they cannot cancel anything.', 'The atom has 6 electrons. Six −1 charges cancel six +1 charges, so the atom is neutral.']),
  t(numbers, 'C1-08', 'What do the numbers tell you?'),
  numbers.choice('C1-09', 'A fluorine atom has atomic number 9 and mass number 19. How many neutrons does it have?', ['9', '19', '28', '10'], 3, 'Which two numbers do you take away?', ['Neutrons = mass number − atomic number.', '19 − 9 = 10 neutrons.'], 'application'),
  numbers.choice('C1-10', 'A magnesium atom has atomic number 12. It loses 2 electrons to become Mg²⁺. How many electrons does the ion have?', ['14', '12', '10'], 2, 'How many electrons did the atom have before it lost any?', ['A magnesium atom has 12 protons, so it has 12 electrons.', 'Mg²⁺ has lost 2 electrons, so it has 12 − 2 = 10 electrons.'], 'application'),
  t(elements, 'C1-11', 'What makes an element?'),
  elements.choice('C1-12', 'Atom X has 12 protons and 12 neutrons. Atom Y has 12 protons and 14 neutrons. What are X and Y?', ['Two different elements', 'Isotopes of the same element', 'Ions with different charges', 'Atoms with different atomic numbers'], 1, 'Compare the protons first, then the neutrons.', ['Both atoms have 12 protons, so both are the same element (magnesium).', 'They have different numbers of neutrons, so they are isotopes.']),
  elements.choice('C1-13', 'Every carbon atom has 6 protons. An atom has 7 protons. What can you say about it?', ['It is an atom of a different element', 'It is an isotope of carbon', 'It is a carbon ion'], 0, 'What decides which element an atom is?', ['The number of protons decides which element an atom is.', 'Carbon atoms always have 6 protons, so an atom with 7 protons is a different element (nitrogen).']),
  t(average, 'C1-14', 'What is the average mass?'),
  average.worked('C1-15', 'Work out the relative atomic mass of chlorine', 'Chlorine is 75% chlorine-35 and 25% chlorine-37. What is its relative atomic mass?', ['Multiply each mass number by its abundance: 35 × 75 = 2625 and 37 × 25 = 925.', 'Add these together: 2625 + 925 = 3550.', 'Add the abundances: 75 + 25 = 100.', 'Divide: 3550 ÷ 100 = 35.5. So the relative atomic mass of chlorine is 35.5.'], 'atom-ram-example'),
  average.choice('C1-16', 'Boron is 20% boron-10 and 80% boron-11. What is its relative atomic mass?', ['10.5', '10.8', '10.2', '1080'], 1, 'Multiply, add, then divide by the total abundance.', ['(10 × 20) + (11 × 80) = 200 + 880 = 1080, and 20 + 80 = 100.', '1080 ÷ 100 = 10.8. It is closer to 11, because boron-11 is more common.'], 'calculation'),
  size.choice('C1-17', 'Look at the numbered parts of this atom. Which part holds almost all of its mass?', ['Part 1', 'Part 2', 'Part 3'], 2, 'Which part holds the protons and neutrons?', ['Part 1 is an electron shell and part 2 is an electron, which has almost no mass.', 'Part 3 is the nucleus. It holds the protons and neutrons, so it has almost all the mass.'], 'understanding', true, 'atom-question'),
  numbers.choice('C1-18', 'An aluminium atom has atomic number 13 and mass number 27. How many of each particle does it have?', ['13 protons, 14 neutrons, 13 electrons', '13 protons, 27 neutrons, 13 electrons', '14 protons, 13 neutrons, 14 electrons', '13 protons, 14 neutrons, 14 electrons'], 0, 'Start with the protons, then use the mass number.', ['Protons = atomic number = 13, and an atom has the same number of electrons, 13.', 'Neutrons = mass number − atomic number = 27 − 13 = 14.'], 'application', true),
  average.choice('C1-19', 'Neon is 90% neon-20 and 10% neon-22. What is its relative atomic mass?', ['21.0', '21.8', '20.2', '2020'], 2, 'Use the rule: multiply, add, then divide.', ['(20 × 90) + (22 × 10) = 1800 + 220 = 2020, and 90 + 10 = 100.', '2020 ÷ 100 = 20.2. It is close to 20, because most neon atoms are neon-20.'], 'calculation', true, 'atom-ram-neon'),
  numbers.written('C1-20', 'Oxygen-16 and oxygen-18 are isotopes. Oxygen’s atomic number is 8. Explain how their atoms are alike and how they differ.', 'Use the atomic number and each mass number. Count the protons, electrons and neutrons in each atom.', 'Both atoms have atomic number 8, so both have 8 protons. That is why both are oxygen. Atoms are neutral, so both also have 8 electrons. They have different numbers of neutrons: oxygen-16 has 16 − 8 = 8 neutrons and oxygen-18 has 18 − 8 = 10. So they have different mass numbers.', ['Both have 8 protons (atomic number 8), so both are oxygen.', 'Both have 8 electrons, because atoms are neutral.', 'Oxygen-16 has 16 − 8 = 8 neutrons.', 'Oxygen-18 has 18 − 8 = 10 neutrons, so the mass numbers are different.'], ['Saying the two isotopes have different numbers of protons.', 'Saying oxygen-18 has 18 neutrons.', 'Saying isotopes are different elements.']),
]

export const lessonC1: ScienceLesson = {
  id: 'C-ATM-001-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Atoms, elements and isotopes', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
