import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { modernTableFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.1.2.1 The periodic table; 5.1.2.3 Metals and non-metals (with 5.1.1.7 electronic structure, used to explain groups and periods)' }
const skill = 'C-PERIODIC-MODERN'
const layout = author(skill, ['5.1.2.1'], ['aqa-chemistry'])
const electrons = author(skill, ['5.1.2.1', '5.1.1.7'], ['aqa-chemistry'])
const predict = author(skill, ['5.1.2.1'], ['aqa-chemistry'])
const metals = author(skill, ['5.1.2.3', '5.1.2.1'], ['aqa-chemistry'])
const properties = author(skill, ['5.1.2.3'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const modernTableSections = [
  { id: 'C8-01', label: 'Start here', detail: 'Lithium’s outer shell' },
  { id: 'C8-02', label: 'How is the table laid out?', detail: 'Atomic number, periods and groups' },
  { id: 'C8-05', label: 'What does the group number tell you?', detail: 'Outer electrons and shells' },
  { id: 'C8-08', label: 'How can you make predictions?', detail: 'Similar reactions and trends' },
  { id: 'C8-11', label: 'Where are the metals?', detail: 'Metals, non-metals and ions' },
  { id: 'C8-14', label: 'How are metals and non-metals different?', detail: 'Physical properties' },
  { id: 'C8-17', label: 'On your own', detail: 'Positions, samples, bromine and magnesium' },
]

const states: ScienceState[] = [
  { ...electrons.choice('C8-01', 'A lithium atom has the electronic structure 2,1. How many electrons are in its outer shell?', ['2', '1', '3'], 1, 'Which number is for the shell furthest from the nucleus?', ['In 2,1 the first shell holds 2 electrons and the outer shell holds 1.', 'So lithium has 1 electron in its outer shell. You will see why that matters in this lesson.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(layout, 'C8-02', 'How is the table laid out?'),
  layout.choice('C8-03', 'In the modern periodic table, what order are the elements in?', ['Order of relative atomic mass', 'Order of atomic number', 'Order of discovery', 'Alphabetical order of symbols'], 1, 'Which number goes up by one from each box to the next?', ['Each box has an atomic number one more than the box before it.', 'So the elements are in order of atomic number, the number of protons.']),
  layout.choice('C8-04', 'Look at the box for magnesium. What is magnesium’s atomic number?', ['12', '24', '36', '2'], 0, 'Is the atomic number at the top or the bottom of the box?', ['The atomic number is the number at the bottom of the box. The top number, 24, is the relative atomic mass.', 'So magnesium’s atomic number is 12: its atoms have 12 protons.'], 'understanding', false, 'mtab-box-q'),
  t(electrons, 'C8-05', 'What does the group number tell you?'),
  electrons.choice('C8-06', 'Oxygen is in Group 6 of the periodic table. How many electrons are in its outer shell?', ['8', '2', '6', '16'], 2, 'What does the group number count?', ['For Groups 1 to 7, the group number is the number of outer-shell electrons.', 'So oxygen, in Group 6, has 6 electrons in its outer shell. Its structure is 2,6.'], 'application'),
  electrons.choice('C8-07', 'An atom has the electronic structure 2,8,3. Where is it in the periodic table?', ['Group 3, period 3', 'Group 2, period 3', 'Group 3, period 2', 'Group 8, period 3'], 0, 'Count the outer electrons, then count the shells.', ['The outer shell has 3 electrons, so it is in Group 3. Its electrons are in 3 shells, so it is in period 3.', 'So it is in Group 3, period 3. It is aluminium.'], 'application'),
  t(predict, 'C8-08', 'How can you make predictions?'),
  predict.choice('C8-09', 'Sodium and potassium are both in Group 1. Why do they react in similar ways?', ['They have the same atomic number', 'They are in the same period', 'They have the same relative atomic mass', 'They have the same number of outer-shell electrons'], 3, 'What do all the elements in one group share?', ['Sodium and potassium each have one electron in their outer shell.', 'So they react in similar ways. They have different atomic numbers and are in different periods.']),
  predict.choice('C8-10', 'The chart shows melting points down Group 1. What is the best prediction for rubidium, below potassium?', ['Lower than 63 °C', 'Higher than 181 °C', 'Between 98 °C and 181 °C', 'Exactly 63 °C'], 0, 'Which way do the melting points change as you go down?', ['The melting point falls down the group: 181 °C, then 98 °C, then 63 °C.', 'So rubidium, next in the trend, should melt below 63 °C. Its real melting point is 39 °C.'], 'dataInterpretation', false, 'mtab-melt'),
  t(metals, 'C8-11', 'Where are the metals?'),
  metals.choice('C8-12', 'Where in the periodic table are most metals found?', ['At the top right', 'On the left and towards the bottom', 'Only in Group 0', 'Only in the top row'], 1, 'Which side of the staircase line were the shaded boxes?', ['Metals are on the left of the table and towards the bottom. Non-metals are at the top right.', 'So most metals are found on the left and towards the bottom.']),
  metals.choice('C8-13', 'Magnesium is a metal in Group 2. What does a magnesium atom usually do when it reacts?', ['Gains 2 electrons to form a negative ion', 'Shares its electrons and forms no ion', 'Loses 2 electrons to form a positive ion', 'Gains 6 electrons to form a positive ion'], 2, 'Do metal atoms lose or gain their outer electrons?', ['Magnesium is in Group 2, so it has 2 outer electrons. Metal atoms lose their outer electrons.', 'So magnesium loses 2 electrons and forms a positive ion, Mg²⁺.'], 'application'),
  t(properties, 'C8-14', 'How are metals and non-metals different?'),
  properties.choice('C8-15', 'Which property is typical of a metal?', ['It is brittle', 'It conducts electricity well', 'It has a low melting point', 'It is a gas at room temperature'], 1, 'Which property did the lit bulb stand for?', ['Brittle, low melting points and being a gas are properties of many non-metals.', 'Metals are good conductors, so a typical metal conducts electricity well.']),
  properties.choice('C8-16', 'A solid element is dull and shatters when it is hit with a hammer. What is it most likely to be?', ['A metal, because it is solid', 'A metal, because it is hard', 'A non-metal, because it is dull and brittle'], 2, 'Do metals shatter or change shape when they are hammered?', ['Metals are malleable: hammering changes their shape. Many non-metals are solid too.', 'This element is dull and brittle, so it is most likely a non-metal.']),
  electrons.choice('C8-17', 'The numbers mark four elements in the periodic table. Which two will react in the most similar ways?', ['1 and 3', '2 and 3', '1 and 4', '3 and 4'], 2, 'Which two numbered boxes are in the same column?', ['Boxes 1 and 4 are in the same column, Group 1, so they have the same number of outer electrons. Boxes 1 and 3 are only in the same period.', 'So elements 1 and 4 react in the most similar ways. They are sodium and potassium.'], 'application', true, 'mtab-q-positions'),
  properties.choice('C8-18', 'A student tested three solid elements. Which conclusion does the data support?', ['Sample B is most likely a non-metal', 'Samples A and C are non-metals', 'All metals melt above 1000 °C', 'Sample A must be in Group 1'], 0, 'Which sample is dull, does not conduct and shatters?', ['Sample B is dull, does not conduct and shatters, like a non-metal. Samples A and C conduct and flatten, like metals.', 'So B is most likely a non-metal. Three samples cannot show which group A is in, or how every metal behaves.'], 'dataInterpretation', true, 'mtab-q-samples'),
  electrons.choice('C8-19', 'Bromine is in Group 7 and period 4. Which of these describes a bromine atom?', ['4 outer electrons, in 7 shells', '7 outer electrons, in 7 shells', '35 outer electrons, in 4 shells', '7 outer electrons, in 4 shells'], 3, 'Which number tells you the outer electrons, and which tells you the shells?', ['Group 7 means 7 electrons in the outer shell.', 'Period 4 means its electrons are in 4 shells. So bromine has 7 outer electrons in 4 shells.'], 'application', true),
  metals.written('C8-20', 'Magnesium is in Group 2 and period 3. Explain what this tells you about its atoms and how it reacts.', 'Say what the group number and the period number tell you. Then use which side of the table it is on.', 'Group 2 means a magnesium atom has 2 electrons in its outer shell. Period 3 means its electrons are in 3 shells, so it is 2,8,2. Magnesium is on the left of the table, so it is a metal. When it reacts, it loses its 2 outer electrons to form a positive ion. It reacts in a similar way to other Group 2 elements, such as calcium.', ['Group 2: a magnesium atom has 2 electrons in its outer shell.', 'Period 3: its electrons are in 3 shells (2,8,2).', 'It is a metal (on the left of the table), so it loses its 2 outer electrons to form a positive ion.', 'It reacts in a similar way to the other elements in Group 2 (e.g. calcium or beryllium).'], ['Saying the group number is the number of shells, or the period number is the number of outer electrons.', 'Saying magnesium gains electrons or forms a negative ion.', 'Saying elements in the same period react in similar ways.']),
]

export const lessonC8: ScienceLesson = {
  id: 'C-PER-008-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'The modern periodic table', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
