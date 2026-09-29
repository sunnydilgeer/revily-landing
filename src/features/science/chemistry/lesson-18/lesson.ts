import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { formulaMassFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.3.1.2 Relative formula mass (the sum of the relative atomic masses of the atoms in a formula); percentage mass of an element, one worked example, as on the supplied revision page' }
const skill = 'C-FORMULA-MASS'
const adding = author(skill, ['5.3.1.2'], ['aqa-chemistry'])
const brackets = author(skill, ['5.3.1.2'], ['aqa-chemistry'])
const percent = author(skill, ['5.3.1.2'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const formulaMassSections = [
  { id: 'C18-01', label: 'Start here', detail: 'Reading a small number in a formula' },
  { id: 'C18-02', label: 'What is relative formula mass?', detail: 'Adding up the atoms in CO₂' },
  { id: 'C18-06', label: 'What if there are brackets?', detail: 'Mg(OH)₂ step by step' },
  { id: 'C18-09', label: 'How much of the mass is one element?', detail: 'Percentage mass in MgO' },
  { id: 'C18-12', label: 'On your own', detail: 'Calcium carbonate, a mistake and some data' },
]

const states: ScienceState[] = [
  { ...adding.choice('C18-01', 'In the formula CO₂, what does the small 2 tell you?', ['There are 2 carbon atoms', 'There are 2 oxygen atoms', 'There are 2 molecules of carbon dioxide'], 1, 'Which symbol does the small 2 come straight after?', ['A small number counts the atoms of the element just before it.', 'The 2 comes after O, so there are 2 oxygen atoms and 1 carbon atom.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(adding, 'C18-02', 'What is relative formula mass?'),
  adding.worked('C18-03', 'Work out the relative formula mass of sodium oxide', 'Sodium oxide is Na₂O. Aᵣ: Na = 23, O = 16. What is its relative formula mass, Mᵣ?', ['Look up the Aᵣ values: Na = 23 and O = 16.', 'Count the atoms in Na₂O: 2 sodium atoms and 1 oxygen atom.', 'Multiply: 2 × 23 = 46 for sodium, and 1 × 16 = 16 for oxygen.', 'Add: 46 + 16 = 62. So the Mᵣ of Na₂O is 62.'], 'mr-worked-na2o'),
  adding.choice('C18-04', 'Potassium oxide is K₂O. Aᵣ: K = 39, O = 16. What is its relative formula mass?', ['55', '94', '110', '78'], 1, 'How many potassium atoms are in K₂O?', ['K₂O has 2 potassium atoms and 1 oxygen atom.', 'So Mᵣ = (2 × 39) + 16 = 78 + 16 = 94.'], 'calculation'),
  adding.choice('C18-05', 'What is the relative formula mass, Mᵣ, of a compound?', ['The sum of the Aᵣ values of all the atoms in its formula', 'The Aᵣ of the heaviest element in it', 'The number of atoms in its formula', 'The Aᵣ of each element added once, ignoring small numbers'], 0, 'What did you do with every atom in CO₂?', ['Mᵣ adds up the relative atomic masses of every atom in the formula.', 'So a small number, like the 2 in CO₂, means that Aᵣ is counted more than once.']),
  t(brackets, 'C18-06', 'What if there are brackets?'),
  brackets.choice('C18-07', 'Aluminium hydroxide is Al(OH)₃. Aᵣ: Al = 27, O = 16, H = 1. What is its relative formula mass?', ['46', '44', '76', '78'], 3, 'What does the 3 after the bracket multiply?', ['One OH group is 16 + 1 = 17, and the 3 means three OH groups: 3 × 17 = 51.', 'So Mᵣ = 27 + 51 = 78.'], 'calculation'),
  brackets.choice('C18-08', 'Copper hydroxide is Cu(OH)₂. Aᵣ: Cu = 63.5, O = 16, H = 1. Which sum gives its Mᵣ?', ['63.5 + 16 + (2 × 1)', '2 × (63.5 + 16 + 1)', '63.5 + 2 × (16 + 1)', '63.5 + (2 × 16) + 1'], 2, 'Which atoms are inside the bracket?', ['The 2 after the bracket doubles everything inside it: the oxygen and the hydrogen.', 'Copper is outside the bracket, so it is counted once: 63.5 + 2 × (16 + 1).']),
  t(percent, 'C18-09', 'How much of the mass is one element?'),
  percent.worked('C18-10', 'Work out the percentage mass of magnesium in magnesium oxide', 'Magnesium oxide is MgO. Aᵣ: Mg = 24, O = 16. What is the percentage mass of magnesium?', ['Work out the Mᵣ: 24 + 16 = 40.', 'Magnesium’s part: Aᵣ × number of atoms = 24 × 1 = 24.', 'Divide by the Mᵣ: 24 ÷ 40 = 0.6.', 'Multiply by 100: 0.6 × 100 = 60%. So 60% of the mass of MgO is magnesium.'], 'mr-worked-mgo'),
  percent.choice('C18-11', 'Sulfur trioxide is SO₃. Aᵣ: S = 32, O = 16. What is the percentage mass of sulfur?', ['25%', '40%', '60%', '67%'], 1, 'Work out the Mᵣ first. How many oxygen atoms are there?', ['Mᵣ = 32 + (3 × 16) = 32 + 48 = 80.', 'Sulfur: (32 × 1) ÷ 80 × 100 = 40%. The other 60% is oxygen.'], 'calculation'),
  adding.choice('C18-12', 'Calcium carbonate is CaCO₃. Aᵣ: Ca = 40, C = 12, O = 16. What is its Mᵣ?', ['100', '68', '71', '156'], 0, 'How many oxygen atoms does CaCO₃ have?', ['CaCO₃ has 1 calcium atom, 1 carbon atom and 3 oxygen atoms.', 'So Mᵣ = 40 + 12 + (3 × 16) = 40 + 12 + 48 = 100.'], 'calculation', true),
  brackets.choice('C18-13', 'A student worked out the Mᵣ of magnesium nitrate, Mg(NO₃)₂. Which numbered line has the mistake?', ['Line 1', 'Line 2', 'Line 3', 'Line 4'], 2, 'Which line uses the small 2 after the bracket?', ['Line 3 doubles only the nitrogen. The 2 must double everything in the bracket: 2 × 62 = 124.', 'So the Mᵣ of Mg(NO₃)₂ is 24 + 124 = 148, not 100.'], 'application', true, 'mr-question-error'),
  adding.choice('C18-14', 'The table shows the Mᵣ of four chlorine compounds. Which conclusion do these data support?', ['Every compound with more chlorine atoms has a bigger Mᵣ', 'Chlorine is the heaviest element in each compound', 'Mᵣ depends only on the number of chlorine atoms', 'In this table, compounds with more chlorine atoms have bigger Mᵣ values'], 3, 'Is the claim about these four compounds, or about every compound?', ['In the table, HCl and NaCl (one chlorine atom) have the smallest Mᵣ, then CaCl₂ (two), then AlCl₃ (three).', 'But HCl and NaCl differ, so other atoms matter too, and four compounds cannot show what is true for every compound.'], 'dataInterpretation', true, 'mr-data-chlorides'),
  brackets.written('C18-15', 'Zinc hydroxide is Zn(OH)₂. A student says its Mᵣ is 83. Using Zn 65, O 16, H 1, explain the mistake.', 'Say what the 2 after the bracket multiplies. Then work out the correct Mᵣ step by step: inside the bracket, times 2, then add the zinc.', 'The 2 after the bracket doubles everything inside it, so Zn(OH)₂ has 1 zinc atom, 2 oxygen atoms and 2 hydrogen atoms. The student only doubled the hydrogen: 65 + 16 + (2 × 1) = 83. One OH group is 16 + 1 = 17, so two OH groups are 2 × 17 = 34. The correct Mᵣ is 65 + 34 = 99.', ['The 2 after the bracket doubles everything inside it, so there are 2 oxygen atoms and 2 hydrogen atoms.', 'The student only doubled the hydrogen: 65 + 16 + (2 × 1) = 83.', 'One OH group is 16 + 1 = 17, so two OH groups are 2 × 17 = 34.', 'The correct Mᵣ is 65 + 34 = 99.'], ['Saying the 2 doubles only the hydrogen.', 'Doubling the zinc as well: 2 × (65 + 16 + 1) = 164.', 'Giving a number with no working or no explanation of the mistake.']),
]

export const lessonC18: ScienceLesson = {
  id: 'C-QNT-018-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Relative formula mass', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
