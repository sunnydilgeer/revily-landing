import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { nobleFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.1.2.4 Group 0 (with 5.1.1.7 electronic structure, recalled to explain the full outer shell)' }
const skill = 'C-NOBLE-GASES'
const family = author(skill, ['5.1.2.4'], ['aqa-chemistry'])
const shells = author(skill, ['5.1.2.4', '5.1.1.7'], ['aqa-chemistry'])
const uses = author(skill, ['5.1.2.4'], ['aqa-chemistry'])
const trend = author(skill, ['5.1.2.4'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const nobleSections = [
  { id: 'C11-01', label: 'Start here', detail: 'How neon’s electrons are arranged' },
  { id: 'C11-02', label: 'Who are the noble gases?', detail: 'Group 0 and its six colourless gases' },
  { id: 'C11-05', label: 'Why do they hardly react?', detail: 'Full outer shells and single atoms' },
  { id: 'C11-08', label: 'What is an unreactive gas good for?', detail: 'Keeping air away from chemicals' },
  { id: 'C11-10', label: 'What changes down the group?', detail: 'Mass, electrons, forces and boiling point' },
  { id: 'C11-13', label: 'Can you predict a boiling point?', detail: 'Using the pattern' },
  { id: 'C11-15', label: 'On your own', detail: 'Numbered boxes, a data table and welding' },
]

const states: ScienceState[] = [
  { ...shells.choice('C11-01', 'Neon has 10 electrons. How are they arranged in shells?', ['8,2', '2,8', '2,4,4', '10 in one shell'], 1, 'How many electrons fit in the first shell?', ['The first shell holds 2 electrons, and the second holds up to 8.', 'So neon’s 10 electrons are arranged 2,8, which fills both shells.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(family, 'C11-02', 'Who are the noble gases?'),
  family.choice('C11-03', 'Where are the noble gases in the periodic table?', ['In the column on the far left, Group 1', 'In the middle block of metals', 'In the column on the far right, Group 0', 'Along the top row'], 2, 'Which column was highlighted in the drawing?', ['The noble gases are the column on the far right of the periodic table.', 'So they are Group 0. Group 1 is the column on the far left.']),
  family.choice('C11-04', 'A sealed jar is full of neon at room temperature. What would you see?', ['A jar that looks empty, because neon is a colourless gas', 'A pale green gas', 'A silvery liquid at the bottom', 'A grey solid'], 0, 'What state and colour are the noble gases at room temperature?', ['Neon, like every noble gas, is a gas at room temperature and has no colour.', 'So the jar would look empty, even though it is full of neon.']),
  t(shells, 'C11-05', 'Why do they hardly react?'),
  shells.choice('C11-06', 'Why are the noble gases very unreactive?', ['Their atoms have no electrons', 'They are gases, and gases never react', 'Their outer shells have only 1 electron', 'Their atoms already have a full outer shell'], 3, 'What do other atoms react to get?', ['Other atoms react by losing, gaining or sharing electrons to get a full outer shell.', 'Noble gas atoms already have one, which is stable, so they have no need to react.']),
  shells.choice('C11-07', 'Helium has only 2 outer electrons, but the other noble gases have 8. Why is helium still in Group 0?', ['Helium is not really a noble gas', 'Its only shell holds 2, so 2 electrons make it full', 'Helium has 8 electrons in its first shell', 'Helium is the heaviest noble gas'], 1, 'How many electrons can the first shell hold?', ['The first shell can only hold 2 electrons, and helium’s electrons are all in that shell.', 'So helium also has a full, stable outer shell, like the other noble gases.']),
  t(uses, 'C11-08', 'What is an unreactive gas good for?'),
  uses.choice('C11-09', 'A chemist makes a product that reacts with water vapour in air. Why does she fill the flask with argon?', ['Argon reacts with the product to make it stronger', 'Argon is coloured, so she can see the product', 'Argon keeps out the air, and argon itself does not react', 'Argon speeds up every reaction'], 2, 'What does argon do with other chemicals?', ['Argon is inert, so it does not react with the product.', 'So a flask full of argon keeps out the water vapour in air and protects the product.']),
  t(trend, 'C11-10', 'What changes down the group?'),
  trend.choice('C11-11', 'What happens to the boiling points of the noble gases as you go down Group 0?', ['They increase', 'They decrease', 'They stay the same', 'They go up, then down'], 0, 'Compare helium at the top with radon at the bottom.', ['Helium boils at −269 °C and radon at −62 °C, with the others in between in order.', 'So boiling point increases down Group 0.']),
  trend.choice('C11-12', 'Xenon has a higher boiling point than argon. Which explanation is correct?', ['Xenon atoms have fewer electrons', 'Xenon has a full outer shell but argon does not', 'Xenon atoms are joined in pairs by strong bonds', 'Xenon atoms have more electrons, so the forces between them are stronger'], 3, 'What changes as atoms get more electrons?', ['Xenon is further down Group 0, so its atoms have more electrons than argon’s.', 'So the forces between xenon atoms are stronger, and more energy is needed to boil it.']),
  t(trend, 'C11-13', 'Can you predict a boiling point?'),
  trend.choice('C11-14', 'Krypton is between argon (−186 °C) and xenon (−108 °C) in Group 0. Which is the best prediction for krypton’s boiling point?', ['−250 °C', '−150 °C', '−50 °C', '+20 °C'], 1, 'Which value lies between −186 °C and −108 °C?', ['Krypton is between argon and xenon in Group 0, so its boiling point should be between −186 °C and −108 °C.', 'Only −150 °C is in that range. Krypton really boils at −153 °C.'], 'application'),
  trend.choice('C11-15', 'The boxes show Group 0 in order, from top to bottom. Which box is the noble gas with the highest boiling point?', ['Box 1', 'Box 2', 'Box 4', 'Box 6'], 3, 'Which way does boiling point increase in Group 0?', ['Boiling point increases down Group 0.', 'So the element at the bottom, box 6 (radon), has the highest boiling point.'], 'understanding', true, 'noble-question'),
  trend.choice('C11-16', 'A student’s table shows four noble gases. Which conclusion does the data support?', ['In this data, boiling point rises as relative atomic mass rises', 'Boiling point doubles each time relative atomic mass doubles', 'Krypton is a liquid at 25 °C', 'Every noble gas boils above 0 °C'], 0, 'Read down both columns. Do they go up together?', ['Going down the table, relative atomic mass rises from 4 to 84 and boiling point rises from −269 °C to −153 °C.', 'So the data shows they rise together. It does not show an exact rule such as doubling.'], 'dataInterpretation', true, 'noble-data'),
  uses.choice('C11-17', 'When steel is welded, the hot metal can react with oxygen in the air. Welders blow argon over the join. Why?', ['Argon reacts with oxygen and uses it up', 'Argon makes the steel melt at a lower temperature', 'Argon keeps the air away and does not react with the hot metal', 'Argon adds electrons to the steel'], 2, 'Does argon react with anything?', ['Argon is inert, so it does not react with the hot steel.', 'So a stream of argon keeps oxygen away from the join, like an unreactive atmosphere in a flask.'], 'application', true),
  shells.written('C11-18', 'Explain why the noble gases are very unreactive, and why their boiling points increase down Group 0.', 'First describe their outer shells. Then link relative atomic mass, electrons, forces between atoms and boiling point.', 'Noble gas atoms have a full outer shell: 8 electrons, or 2 for helium. This is a stable arrangement, so they do not need to lose, gain or share electrons, and they are very unreactive (inert). Going down Group 0, relative atomic mass increases and each atom has more electrons. More electrons mean stronger forces between atoms. So more energy is needed to separate the atoms, and the boiling point increases.', ['Noble gas atoms have a full outer shell (8 electrons; helium 2).', 'A full outer shell is stable, so they do not need to lose, gain or share electrons: very unreactive (inert).', 'Down the group, relative atomic mass increases and atoms have more electrons.', 'More electrons mean stronger forces between atoms, so more energy is needed to separate them: higher boiling point.'], ['Saying noble gases have no electrons or an empty outer shell.', 'Saying boiling point rises because stronger covalent bonds join the atoms.', 'Saying noble gases are unreactive just because they are gases.']),
]

export const lessonC11: ScienceLesson = {
  id: 'C-PER-011-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Group 0: the noble gases', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
