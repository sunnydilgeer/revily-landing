import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { halogenFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.1.2.6 Group 7 (with 5.1.1.7 electronic structure, used to explain the group’s properties)' }
const skill = 'C-HALOGENS'
const group = author(skill, ['5.1.2.6'], ['aqa-chemistry'])
const shells = author(skill, ['5.1.2.6', '5.1.1.7'], ['aqa-chemistry'])
const compounds = author(skill, ['5.1.2.6'], ['aqa-chemistry'])
const trends = author(skill, ['5.1.2.6'], ['aqa-chemistry'])
const displacement = author(skill, ['5.1.2.6'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const halogenSections = [
  { id: 'C10-01', label: 'Start here', detail: 'Chlorine’s outer shell' },
  { id: 'C10-02', label: 'What are the halogens?', detail: 'Group 7, seven outer electrons, pairs of atoms' },
  { id: 'C10-05', label: 'What do halogens make?', detail: 'Halide ions, halide salts and shared electrons' },
  { id: 'C10-09', label: 'What changes down the group?', detail: 'Mass, boiling point and reactivity' },
  { id: 'C10-13', label: 'Which halogen wins?', detail: 'Displacement reactions' },
  { id: 'C10-16', label: 'On your own', detail: 'Four test tubes, melting points and a mystery halogen' },
]

const states: ScienceState[] = [
  { ...shells.choice('C10-01', 'A chlorine atom has the electronic structure 2,8,7. How many electrons are in its outer shell?', ['2', '8', '7', '17'], 2, 'Which number is the last shell?', ['The numbers list the shells from the nucleus outwards: 2, then 8, then 7.', 'So the outer shell, the last one, holds 7 electrons. 17 is the total.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(group, 'C10-02', 'What are the halogens?'),
  shells.choice('C10-03', 'Why do all the halogens react in similar ways?', ['They all have 7 electrons in their outer shell', 'They all have the same relative atomic mass', 'They are all gases at room temperature', 'They all have 7 shells of electrons'], 0, 'What decides how an element reacts?', ['The outer electrons decide how an element reacts.', 'Every halogen atom has 7 outer electrons, so they all react in similar ways.']),
  group.choice('C10-04', 'What is chlorine gas made of?', ['Single chlorine atoms, each on its own', 'Molecules made of two chlorine atoms, Cl₂', 'Molecules made of seven chlorine atoms', 'Chloride ions with a 1− charge'], 1, 'What does the small 2 in Cl₂ mean?', ['In a halogen, two atoms of the same element join together.', 'So chlorine gas is made of Cl₂ molecules, each with two chlorine atoms.']),
  t(compounds, 'C10-05', 'What do halogens make?'),
  compounds.choice('C10-06', 'Bromine reacts with a metal. Which ion does each bromine atom form?', ['Br⁺, by losing one electron', 'Br⁻, a bromide ion, by gaining one electron', 'Br²⁻, by gaining two electrons', 'Br₂, a bromine molecule'], 1, 'How many electrons does a halogen atom need for a full outer shell?', ['A bromine atom has 7 outer electrons, so it gains one electron from the metal.', 'So it becomes a bromide ion with a 1− charge, Br⁻.']),
  compounds.choice('C10-07', 'Hydrogen reacts with bromine to make hydrogen bromide. What holds the two atoms together?', ['Ions made when hydrogen gives its electron away', 'Nothing: the two elements are just mixed', 'Two extra electrons taken from bromine', 'A shared pair of electrons: a covalent bond'], 3, 'Is hydrogen a metal or a non-metal?', ['Hydrogen is a non-metal, so it shares electrons with the halogen instead of giving one away.', 'So the atoms are held by a shared pair of electrons, a covalent bond.']),
  compounds.choice('C10-08', 'Potassium reacts with iodine. What is the product called?', ['potassium iodine', 'iodine potassium', 'potassium iodide', 'potassium iodate'], 2, 'How does the ending of a halogen’s name change in its compound?', ['Iodine gains an electron from potassium and becomes an iodide ion.', 'So the product is potassium iodide: -ine changes to -ide.']),
  t(trends, 'C10-09', 'What changes down the group?'),
  trends.choice('C10-10', 'Which of these halogens is the most reactive?', ['Iodine', 'Bromine', 'Chlorine', 'Fluorine'], 3, 'Does reactivity go up or down as you go down Group 7?', ['Reactivity goes down as you go down Group 7.', 'Fluorine is at the top, so it is the most reactive.']),
  shells.choice('C10-11', 'Why is bromine less reactive than chlorine?', ['Its outer shell is further from the nucleus, so it gains an electron less easily', 'It has fewer electrons in its outer shell', 'It is a liquid, so it cannot react', 'Its atoms are lighter than chlorine atoms'], 0, 'How far is bromine’s outer shell from its nucleus?', ['Bromine is below chlorine, so its outer shell is further from the nucleus.', 'So the nucleus pulls on a new electron less strongly, and bromine gains an electron less easily.']),
  trends.choice('C10-12', 'Astatine is below iodine in Group 7. How reactive do you predict it is?', ['More reactive than fluorine', 'Less reactive than iodine', 'Exactly as reactive as chlorine', 'Not reactive at all'], 1, 'Which way does reactivity change down the group?', ['Reactivity goes down as you go down Group 7.', 'Astatine is below iodine, so it should be less reactive than iodine. It is still a halogen, so it can still react.']),
  t(displacement, 'C10-13', 'Which halogen wins?'),
  displacement.choice('C10-14', 'Chlorine water is added to potassium iodide solution. What happens?', ['Nothing, because chlorine is less reactive than iodine', 'Iodine is displaced, so the solution turns brown', 'Chlorine is displaced, so the solution turns green', 'Bromine is made, so the solution turns orange'], 1, 'Is chlorine above or below iodine in Group 7?', ['Chlorine is more reactive than iodine, so it takes iodine’s place in the salt.', 'So iodine is made, and the solution turns brown.']),
  displacement.choice('C10-15', 'Iodine solution is added to potassium bromide solution. Why is there no reaction?', ['Iodine is less reactive than bromine', 'Iodine is more reactive than bromine', 'Potassium bromide is not a salt', 'Iodine and bromine are in different groups'], 0, 'Which is higher up Group 7?', ['Iodine is below bromine in Group 7, so it is less reactive.', 'So iodine cannot take bromine’s place, and nothing happens.']),
  displacement.choice('C10-16', 'Each tube mixes a halogen solution with a salt solution. In which two tubes does a displacement reaction happen?', ['Tubes 1 and 2', 'Tubes 2 and 4', 'Tubes 3 and 4', 'Tubes 1 and 3'], 3, 'In each tube, is the halogen added higher up Group 7 than the one in the salt?', ['Chlorine and bromine are both more reactive than iodine, so they displace iodine in tubes 1 and 3.', 'Iodine and bromine are less reactive than chlorine, so tubes 2 and 4 show no reaction.'], 'application', true, 'hal-q-tubes'),
  trends.choice('C10-17', 'The chart shows the melting points of three halogens. Which is the best prediction for iodine’s melting point?', ['About −150 °C', 'About −50 °C', 'Exactly −7 °C', 'About 110 °C'], 3, 'Which way do the melting points go down the group, and by roughly how much each step?', ['The melting points go up down the group: −220 °C, −101 °C, −7 °C, rising about 100 °C each step.', 'So iodine’s should be roughly 100 °C higher than bromine’s. It is really 114 °C, but the trend only gives an estimate.'], 'dataInterpretation', true, 'hal-q-melt'),
  displacement.choice('C10-18', 'A halogen solution turns sodium iodide solution brown, but it does not change sodium bromide solution. Which halogen is it?', ['Chlorine', 'Iodine', 'Bromine', 'Fluorine'], 2, 'It displaces iodine but not bromine. Where must it sit in Group 7?', ['It displaces iodine, so it must be above iodine in Group 7.', 'It does not displace bromine, so it is not chlorine. So it is bromine.'], 'application', true),
  displacement.written('C10-19', 'Chlorine water turns potassium bromide solution orange, but iodine solution does not react with it. Explain why.', 'Compare how reactive chlorine, bromine and iodine are, say what is displaced, and use the outer shell to explain the order.', 'Chlorine is more reactive than bromine because it is higher up Group 7. So chlorine displaces bromine from potassium bromide: it takes bromine’s place and bromine is made, which is orange. Iodine is lower down the group than bromine, so it is less reactive and cannot displace it. Reactivity goes down the group because the outer shell is further from the nucleus, so the atom gains an electron less easily.', ['Chlorine is more reactive than bromine (it is higher up Group 7).', 'So chlorine displaces bromine from the salt: bromine is made, which is why the solution turns orange.', 'Iodine is less reactive than bromine, so it cannot displace bromine and there is no reaction.', 'Lower halogens are less reactive because the outer shell is further from the nucleus, so they gain an electron less easily.'], ['Saying iodine is more reactive than bromine or chlorine.', 'Saying the orange colour is chlorine or potassium bromide.', 'Saying halogens react by losing electrons.']),
]

export const lessonC10: ScienceLesson = {
  id: 'C-PER-010-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Group 7: the halogens', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
