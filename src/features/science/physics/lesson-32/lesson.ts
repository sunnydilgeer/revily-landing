import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { atomStructureFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.4.1.1 The structure of an atom; 6.4.1.2 Mass number, atomic number and isotopes (electrons and energy levels, ions), as on the supplied revision page' }
const skill = 'P-ATOMSTRUCT'
const parts = author(skill, ['6.4.1.1'], ['aqa-physics'])
const size = author(skill, ['6.4.1.1'], ['aqa-physics'])
const levels = author(skill, ['6.4.1.1', '6.4.1.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const atomStructureSections = [
  { id: 'P32-01', label: 'Start here', detail: 'The centre of an atom' },
  { id: 'P32-02', label: 'What is inside an atom?', detail: 'Protons, neutrons, electrons and charge' },
  { id: 'P32-05', label: 'How big is an atom?', detail: 'Atom and nucleus sizes' },
  { id: 'P32-08', label: 'What do electrons do?', detail: 'Energy levels, radiation and ions' },
  { id: 'P32-11', label: 'On your own', detail: 'The nuclear model' },
]

const states: ScienceState[] = [
  { ...parts.choice('P32-01', 'What is at the very centre of an atom?', ['An electron', 'The nucleus', 'An energy level', 'Nothing at all'], 1, 'Think of the gold foil experiment.', ['Scientists found a tiny, positive nucleus at the centre of every atom.', 'The electrons orbit around it.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(parts, 'P32-02', 'What is inside an atom?'),
  parts.choice('P32-03', 'Which two particles are found in the nucleus?', ['Protons and electrons', 'Neutrons and electrons', 'Electrons only', 'Protons and neutrons'], 3, 'The electrons orbit outside the nucleus.', ['The nucleus is made of protons and neutrons.', 'Electrons orbit around the outside.'], 'recall'),
  parts.choice('P32-04', 'An atom has 6 protons and no overall charge. How many electrons does it have?', ['6', '0', '12', '3'], 0, 'The charges must cancel out.', ['Each proton is +1 and each electron is −1.', 'So 6 protons need 6 electrons to cancel out.']),
  t(size, 'P32-05', 'How big is an atom?'),
  size.choice('P32-06', 'What is the typical radius of an atom?', ['0.01 m', '1 m', '1 × 10⁻¹⁰ m', '1 × 10¹⁰ m'], 2, 'Atoms are far smaller than anything you can see.', ['A typical atom has a radius of about 1 × 10⁻¹⁰ m.', 'The negative power shows it is a very small number.'], 'recall'),
  size.choice('P32-07', 'How does the radius of the nucleus compare with the radius of the atom?', ['It is about the same', 'It is over 10 000 times smaller', 'It is over 10 000 times bigger', 'It is about half as big'], 1, 'Think of a pea in the middle of a stadium.', ['The nucleus is tiny compared with the whole atom.', 'Its radius is over 10 000 times smaller.']),
  t(levels, 'P32-08', 'What do electrons do?'),
  levels.choice('P32-09', 'An electron moves to a higher energy level. What must it have done?', ['Released EM radiation', 'Lost a proton', 'Absorbed EM radiation', 'Moved closer to the nucleus'], 2, 'Higher means it gained energy.', ['To move up, an electron takes in energy.', 'It does this by absorbing EM radiation.']),
  levels.choice('P32-10', 'An atom loses an electron. What does the atom become?', ['A positively charged ion', 'A negatively charged ion', 'A neutron', 'A new element with no charge'], 0, 'Count the protons and the electrons afterwards.', ['The atom now has more protons than electrons.', 'So it has an overall positive charge and is a positive ion.']),
  levels.choice('P32-11', 'An atom has 11 protons and 11 electrons. What is its overall charge?', ['+11', '−11', '+22', '0'], 3, 'Each proton cancels one electron.', ['11 protons give +11 and 11 electrons give −11.', 'So the charges cancel and the overall charge is 0.'], 'application', true),
  levels.choice('P32-12', 'The diagram shows an electron moving between energy levels. Which statement is correct?', ['It absorbs EM radiation and moves further out', 'It releases EM radiation and moves closer to the nucleus', 'It leaves the atom', 'It turns into a proton'], 1, 'Look at which way the electron moves, and where the wavy arrow points.', ['The electron moves to a lower energy level, closer to the nucleus.', 'It releases EM radiation as it does so.'], 'dataInterpretation', true, 'nucatom-q-levels'),
  parts.choice('P32-13', 'Which statement about the atom is correct?', ['The nucleus is tiny but holds most of the mass', 'The nucleus is large and light', 'Electrons make up most of the mass', 'The nucleus is negatively charged'], 0, 'Protons and neutrons are much heavier than electrons.', ['The nucleus contains the protons and neutrons.', 'So it is tiny but makes up most of the mass.'], 'understanding', true),
  parts.written('P32-14', 'Describe the nuclear model of the atom. Include where each particle is and its charge.', 'Start at the centre and work outwards.', 'There is a tiny nucleus in the centre. It contains protons, which are positive, and neutrons, which have no charge. Electrons, which are negative, orbit the nucleus in energy levels. The number of protons equals the number of electrons, so the atom has no overall charge.', ['Says protons and neutrons are in the nucleus.', 'Gives the charges: protons positive, neutrons none, electrons negative.', 'Says electrons orbit the nucleus in energy levels.', 'Says protons equal electrons, so no overall charge.'], ['Putting electrons in the nucleus.', 'Saying neutrons are negative.']),
]

export const lessonP32: ScienceLesson = {
  id: 'P-ATM-032-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'The structure of the atom', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
