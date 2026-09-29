import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { ionFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.2.1.1 Chemical bonds (ions as charged particles) and 5.2.1.2 Ionic bonding (metal atoms lose and non-metal atoms gain electrons; ions from Groups 1, 2, 6 and 7 have a noble gas electronic structure and a charge that relates to the group number)' }
const skill = 'C-ION-FORMATION'
const what = author(skill, ['5.2.1.1', '5.2.1.2'], ['aqa-chemistry'])
const why = author(skill, ['5.2.1.2'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const ionSections = [
  { id: 'C12-01', label: 'Start here', detail: 'What is the charge on a whole atom?' },
  { id: 'C12-02', label: 'What is an ion?', detail: 'Lose or gain electrons: a charged particle' },
  { id: 'C12-05', label: 'Why lose or gain electrons?', detail: 'A full outer shell, like a noble gas' },
  { id: 'C12-09', label: 'Which ion does each group form?', detail: 'Groups 1 and 2 lose; Groups 6 and 7 gain' },
  { id: 'C12-12', label: 'On your own', detail: 'An unknown ion, potassium, a table and calcium' },
]

const states: ScienceState[] = [
  { ...what.choice('C12-01', 'A sodium atom has 11 protons and 11 electrons. What is the overall charge of the atom?', ['No overall charge', '11+', '11−', '1+'], 0, 'Protons are positive and electrons are negative. What happens when there are equal numbers?', ['Each proton has a charge of +1 and each electron has a charge of −1.', 'A sodium atom has 11 of each, so the charges cancel out. The atom has no overall charge.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(what, 'C12-02', 'What is an ion?'),
  what.choice('C12-03', 'An atom loses 2 electrons. What is the charge on the ion it forms?', ['2−', '2+', 'No charge', '1+'], 1, 'After losing electrons, are there more protons or more electrons?', ['Losing 2 electrons leaves 2 more protons than electrons.', 'Protons are positive, so the ion has a charge of 2+.']),
  what.choice('C12-04', 'A particle has 8 protons and 10 electrons. What is its overall charge?', ['2+', '8−', '2−', '10−'], 2, 'How many more electrons than protons are there?', ['There are 10 − 8 = 2 more electrons than protons.', 'Electrons are negative, so the overall charge is 2−.']),
  t(why, 'C12-05', 'Why lose or gain electrons?'),
  why.choice('C12-06', 'A chlorine atom (2,8,7) gains one electron to form a chloride ion. Why?', ['To lose its outer shell', 'To gain a proton', 'To become a metal', 'To get a full outer shell, like argon'], 3, 'How many more electrons does its outer shell need?', ['Chlorine’s outer shell has 7 electrons and needs 1 more to be full.', 'After gaining 1 electron it is 2,8,8, the same electronic structure as argon, a noble gas.']),
  why.choice('C12-07', 'A sodium atom is 2,8,1. What is the electronic structure of a sodium ion?', ['2,8', '2,8,2', '2,8,1', '2,7'], 0, 'Sodium loses its outer electron. What is left?', ['Sodium loses the 1 electron in its third shell.', 'That leaves 2,8, which is a full outer shell, the same as neon.']),
  why.choice('C12-08', 'What kind of ion do metal atoms form?', ['Negative ions, by gaining electrons', 'Positive ions, by gaining electrons', 'Positive ions, by losing electrons', 'Negative ions, by losing electrons'], 2, 'Think of sodium. Did it lose or gain an electron?', ['Metal atoms have only a few outer electrons, so they lose them.', 'Losing electrons leaves more protons than electrons, so metal atoms form positive ions.']),
  t(why, 'C12-09', 'Which ion does each group form?'),
  why.choice('C12-10', 'Lithium is in Group 1. Which ion does a lithium atom form?', ['Li⁻', 'Li⁺', 'Li²⁺', 'Li²⁻'], 1, 'How many outer electrons do Group 1 atoms have?', ['Group 1 atoms have 1 outer electron, which they lose.', 'Losing 1 electron gives a charge of 1+, so the ion is Li⁺.']),
  why.choice('C12-11', 'Fluorine is in Group 7. Which ion does a fluorine atom form?', ['F⁺', 'F²⁻', 'F²⁺', 'F⁻'], 3, 'Does a Group 7 atom lose or gain electrons, and how many?', ['Group 7 atoms have 7 outer electrons, so they gain 1 to fill the outer shell.', 'Gaining 1 electron gives a charge of 1−, so the ion is F⁻, a fluoride ion.']),
  why.choice('C12-12', 'Particle 1 is an atom. Particle 2 is the ion it forms. What happened, and what is the ion’s charge?', ['It gained 2 electrons, so the charge is 2−', 'It lost 2 electrons, so the charge is 2+', 'It gained 2 protons, so the charge is 2+', 'It gained 8 electrons, so the charge is 8−'], 0, 'Count the electrons in the outer shell of each particle.', ['The atom’s outer shell has 6 electrons and the ion’s has 8, so the atom gained 2 electrons.', 'The protons did not change, so there are 2 more electrons than protons: the charge is 2−. It is a sulfur atom (2,8,6) becoming a sulfide ion.'], 'application', true, 'ion-question'),
  what.choice('C12-13', 'Potassium is in Group 1. A potassium atom has 19 protons and 19 electrons. How many electrons does a potassium ion have?', ['20', '19', '18', '8'], 2, 'Does a Group 1 atom lose or gain electrons, and how many?', ['Group 1 atoms lose their 1 outer electron.', 'So a potassium ion has 19 − 1 = 18 electrons and a charge of 1+ (K⁺).'], 'application', true),
  what.choice('C12-14', 'The table shows the protons and electrons in four particles. Which particle is a negative ion?', ['A', 'B', 'C', 'D'], 1, 'A negative ion has more electrons than protons.', ['Only B has more electrons (10) than protons (9), so B is a negative ion with a 1− charge.', 'A and D have more protons than electrons, so they are positive ions. C has equal numbers, so it is an atom.'], 'dataInterpretation', true, 'ion-data'),
  why.choice('C12-15', 'Chlorine and bromine are both in Group 7. Why do they form ions with the same charge?', ['They have the same number of protons', 'They are both gases', 'They have the same number of shells', 'They have the same number of outer electrons'], 3, 'What do elements in the same group share?', ['Both atoms have 7 outer electrons, so both gain 1 electron to fill the outer shell.', 'So both form 1− ions: chloride (Cl⁻) and bromide (Br⁻).'], 'understanding', true),
  why.written('C12-16', 'Calcium (Group 2) is 2,8,8,2. Explain how a calcium atom becomes an ion, and why its charge is 2+.', 'Say how many electrons move and which way, what the ion’s electronic structure is, and compare its protons and electrons.', 'Calcium is a metal in Group 2, so its atom has 2 outer electrons. It loses these 2 electrons. The ion is 2,8,8, a full outer shell like the noble gas argon. The number of protons stays at 20, but there are now only 18 electrons. So there are 2 more positive charges than negative charges, and the ion is Ca²⁺.', ['A calcium atom loses its 2 outer electrons.', 'The ion is 2,8,8: a full outer shell, like a noble gas (argon).', 'The protons do not change: 20 protons but only 18 electrons.', 'So there are 2 more positive than negative charges, giving 2+ (Ca²⁺).'], ['Saying calcium gains electrons, or gains protons.', 'Saying the ion has a 2− charge.', 'Saying calcium loses protons.']),
]

export const lessonC12: ScienceLesson = {
  id: 'C-BND-012-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'How ions form', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
