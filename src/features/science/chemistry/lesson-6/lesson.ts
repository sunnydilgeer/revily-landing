import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { electronFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.1.1.7 Electronic structure (electrons in shells or energy levels, lowest available energy levels first; structures of the first 20 elements as diagrams and numbers)' }
const skill = 'C-ELECTRONIC-STRUCTURE'
const shells = author(skill, ['5.1.1.7'], ['aqa-chemistry'])
const counting = author(skill, ['5.1.1.7', '5.1.1.5'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const electronSections = [
  { id: 'C6-01', label: 'Start here', detail: 'How many electrons in a sodium atom?' },
  { id: 'C6-02', label: 'Where do the electrons go?', detail: 'Shells fill from the inside out: 2, 8, 8' },
  { id: 'C6-05', label: 'How do you write it down?', detail: 'Diagrams and numbers such as 2,8,4' },
  { id: 'C6-08', label: 'Why does the outer shell matter?', detail: 'Full outer shells are stable' },
  { id: 'C6-10', label: 'Work it out from the atomic number', detail: 'Count, fill in order, check' },
  { id: 'C6-13', label: 'On your own', detail: 'Count shells, chlorine, a full shell and calcium' },
]

const states: ScienceState[] = [
  { ...counting.choice('C6-01', 'A sodium atom has atomic number 11. How many electrons does it have?', ['11', '23', '12', '1'], 0, 'How are the numbers of protons and electrons in an atom linked?', ['The atomic number is the number of protons, so sodium has 11 protons.', 'An atom has the same number of electrons as protons, so a sodium atom has 11 electrons.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(shells, 'C6-02', 'Where do the electrons go?'),
  shells.choice('C6-03', 'How many electrons can the first shell of an atom hold?', ['8', '2', '18', 'As many as the atom has'], 1, 'How many electrons filled silicon’s first shell?', ['The first shell is the one closest to the nucleus.', 'It can hold only 2 electrons, so the next electrons go into the second shell.']),
  shells.choice('C6-04', 'Which electron shell in an atom is always filled first?', ['The outer shell', 'All the shells fill at the same time', 'The shell closest to the nucleus'], 2, 'Where did silicon’s first 2 electrons go?', ['Electrons fill the inner shells first.', 'So the shell closest to the nucleus, the first shell, always fills first.']),
  t(shells, 'C6-05', 'How do you write it down?'),
  shells.choice('C6-06', 'An atom’s electronic structure is written 2,8,3. What does the 3 tell you?', ['There are 3 electrons in its third shell', 'The atom has 3 protons', 'The atom has 3 electrons in total', 'Its first shell holds 3 electrons'], 0, 'Which shell does each number stand for?', ['Each number is the electrons in one shell, starting with the inner shell.', 'The third number is 3, so there are 3 electrons in the third shell. The atom has 2 + 8 + 3 = 13 electrons.']),
  shells.choice('C6-07', 'A fluorine atom has 2 electrons in its first shell and 7 in its second. How is its electronic structure written?', ['7,2', '2,7', '2,8', '9'], 1, 'Which shell do you write first?', ['Write the number of electrons in each shell, starting with the inner shell.', 'So fluorine is 2,7.']),
  t(shells, 'C6-08', 'Why does the outer shell matter?'),
  shells.choice('C6-09', 'Neon’s electronic structure is 2,8. Why do neon atoms hardly ever react?', ['They have no electrons', 'They have more protons than electrons', 'Their outer shell is not full', 'Their outer shell is full'], 3, 'How many electrons can the second shell hold?', ['The second shell holds up to 8 electrons, and neon has 8 there.', 'So neon’s outer shell is full, which makes neon atoms stable.']),
  t(counting, 'C6-10', 'Work it out from the atomic number'),
  counting.worked('C6-11', 'Work out the electronic structure of aluminium', 'Aluminium has atomic number 13. What is the electronic structure of an aluminium atom?', ['Atomic number 13 means 13 protons, so an aluminium atom has 13 electrons.', 'The first shell takes 2 electrons. That leaves 13 − 2 = 11.', 'The second shell takes 8 electrons. That leaves 11 − 8 = 3.', 'The last 3 go in the third shell. Check: 2 + 8 + 3 = 13. So aluminium is 2,8,3.'], 'shell-worked'),
  counting.choice('C6-12', 'Sulfur has atomic number 16. What is the electronic structure of a sulfur atom?', ['2,6,8', '2,8,6', '8,8', '2,14'], 1, 'Fill 2, then up to 8, then put the rest in the third shell.', ['16 electrons: 2 in the first shell and 8 in the second, leaving 16 − 10 = 6.', 'The last 6 go in the third shell, so sulfur is 2,8,6. Check: 2 + 8 + 6 = 16.'], 'application'),
  shells.choice('C6-13', 'Count the electrons on each numbered shell of this atom. What is its electronic structure?', ['5,8,2', '2,8,8', '2,8,5', '2,5,8'], 2, 'Start counting at shell 1, next to the nucleus.', ['Shell 1 has 2 electrons, shell 2 has 8 and shell 3 has 5.', 'Written from the inner shell outwards, that is 2,8,5. It has 15 electrons, so it is a phosphorus atom.'], 'application', true, 'shell-question'),
  counting.choice('C6-14', 'Chlorine has atomic number 17. What is the electronic structure of a chlorine atom?', ['2,7,8', '8,8,1', '2,8,8', '2,8,7'], 3, 'How many electrons are left after the first two shells?', ['17 electrons: 2 in the first shell and 8 in the second, leaving 17 − 10 = 7.', 'The last 7 go in the third shell, so chlorine is 2,8,7. Check: 2 + 8 + 7 = 17.'], 'application', true),
  shells.choice('C6-15', 'An atom has the electronic structure 2,8,8. What can you say about it?', ['Its outer shell is full, so it is stable', 'Its outer shell is not full, so it reacts easily', 'It has 8 electrons altogether', 'Its second shell is not full yet'], 0, 'How many electrons can the third shell hold, for the first 20 elements?', ['For the first 20 elements, the third shell holds up to 8 electrons. This atom has 8 there.', 'So its outer shell is full and the atom is stable. It has 2 + 8 + 8 = 18 electrons (argon).'], 'understanding', true),
  counting.written('C6-16', 'Calcium has atomic number 20. Work out its electronic structure, explaining each step. Is its outer shell full?', 'Start from the atomic number. Fill 2, then up to 8, then up to 8, and start a new shell for any left over.', 'Calcium’s atomic number is 20, so it has 20 protons and 20 electrons. The first shell holds 2, leaving 18. The second shell holds 8, leaving 10. The third shell holds 8, leaving 2, so the last 2 go into a fourth shell. So calcium is 2,8,8,2. Its outer shell has only 2 electrons, so it is not full.', ['Atomic number 20, so a calcium atom has 20 electrons.', 'The first shell holds 2, the second 8 and the third 8: 18 so far.', 'The last 2 go into a fourth shell, so calcium is 2,8,8,2.', 'The outer shell has only 2 electrons, so it is not full.'], ['Putting more than 8 electrons in the third shell, such as 2,8,10.', 'Numbers that do not add up to 20, such as 2,8,8.', 'Saying calcium has a full outer shell.']),
]

export const lessonC6: ScienceLesson = {
  id: 'C-PER-006-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Electronic structure', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
