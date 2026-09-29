import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { compoundFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.1.1.1 Atoms, elements and compounds (compounds, formulae, word equations and balanced symbol equations)' }
const skill = 'C-COMPOUNDS-EQUATIONS'
const compounds = author(skill, ['5.1.1.1'], ['aqa-chemistry'])
const formulas = author(skill, ['5.1.1.1'], ['aqa-chemistry'])
const equations = author(skill, ['5.1.1.1'], ['aqa-chemistry'])
const balancing = author(skill, ['5.1.1.1'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const compoundSections = [
  { id: 'C2-01', label: 'Start here', detail: 'A rusty nail' },
  { id: 'C2-02', label: 'What is a compound?', detail: 'New substances, fixed proportions and bonds' },
  { id: 'C2-05', label: 'What does a formula tell you?', detail: 'Symbols, small numbers and brackets' },
  { id: 'C2-08', label: 'How do you write a reaction?', detail: 'Word equations and symbol equations' },
  { id: 'C2-11', label: 'How do you balance an equation?', detail: 'Numbers in front, never new formulas' },
  { id: 'C2-15', label: 'On your own', detail: 'Particles, formulas and balancing' },
]

const states: ScienceState[] = [
  { ...compounds.choice('C2-01', 'An iron nail left outside turns rusty. What is the rust?', ['Iron that has only changed colour', 'A new substance made from iron and substances in the air', 'Dirt that has stuck to the iron'], 1, 'Could you rub the rust straight back into shiny iron?', ['Iron reacts with oxygen and water from the air.', 'So rust is a new substance, with different properties from iron.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(compounds, 'C2-02', 'What is a compound?'),
  compounds.choice('C2-03', 'Which of these describes a compound?', ['A substance made of only one kind of atom', 'Two or more elements chemically combined in fixed proportions', 'Two elements mixed together but not joined', 'Atoms that all have the same number of protons'], 1, 'How many elements, and are their atoms joined?', ['A compound contains atoms of two or more different elements.', 'The atoms are chemically joined by bonds, always in the same fixed proportions.']),
  compounds.choice('C2-04', 'How could you split water into hydrogen and oxygen?', ['Boil it', 'Filter it', 'Use a chemical reaction'], 2, 'Can boiling or filtering break chemical bonds?', ['Boiling only turns water into steam, and filtering leaves it as water.', 'The atoms are held by chemical bonds, so only a chemical reaction can split water into its elements.']),
  t(formulas, 'C2-05', 'What does a formula tell you?'),
  formulas.choice('C2-06', 'Propane, a camping gas, has the formula C₃H₈. How many atoms are in one molecule?', ['3', '8', '11', '24'], 2, 'What does each small number count?', ['C₃ means 3 carbon atoms and H₈ means 8 hydrogen atoms.', 'So one molecule has 3 + 8 = 11 atoms.'], 'application'),
  formulas.choice('C2-07', 'Copper hydroxide has the formula Cu(OH)₂. How many atoms of each element does it show?', ['1 Cu, 2 O, 2 H', '1 Cu, 1 O, 2 H', '2 Cu, 2 O, 2 H', '1 Cu, 2 O, 1 H'], 0, 'Which atoms are inside the bracket?', ['Cu is outside the bracket, so there is 1 copper atom.', 'The 2 after the bracket doubles O and H, so there are 2 oxygen atoms and 2 hydrogen atoms.'], 'application'),
  t(equations, 'C2-08', 'How do you write a reaction?'),
  equations.choice('C2-09', 'Zinc reacts with sulfur to make zinc sulfide. Which is the word equation?', ['zinc sulfide → zinc + sulfur', 'zinc + sulfur → zinc sulfide', 'zinc + zinc sulfide → sulfur'], 1, 'Which substances do you start with?', ['Zinc and sulfur are the reactants, so they go on the left of the arrow.', 'Zinc sulfide is the product, so it goes on the right.']),
  equations.choice('C2-10', 'calcium + water → calcium hydroxide + hydrogen. Which are the products?', ['Calcium hydroxide and hydrogen', 'Calcium and water', 'Calcium and hydrogen'], 0, 'Which side of the arrow are the products on?', ['Calcium and water are on the left, so they are the reactants.', 'Calcium hydroxide and hydrogen are on the right. They are the new substances made, so they are the products.']),
  t(balancing, 'C2-11', 'How do you balance an equation?'),
  balancing.worked('C2-12', 'Balance the equation for making ammonia', 'Nitrogen reacts with hydrogen to make ammonia: N₂ + H₂ → NH₃. Balance the equation.', ['Count the atoms. Left: 2 N and 2 H. Right: 1 N and 3 H.', 'Nitrogen does not match, so put a 2 in front of NH₃. Now the right has 2 N and 2 × 3 = 6 H.', 'Hydrogen does not match: 2 on the left, 6 on the right. Put a 3 in front of H₂, so the left has 3 × 2 = 6 H.', 'Count again: 2 N and 6 H on each side. So the balanced equation is N₂ + 3H₂ → 2NH₃.'], 'cmpd-balance-example'),
  balancing.choice('C2-13', 'Nitrogen reacts with oxygen to make nitrogen dioxide: N₂ + O₂ → NO₂. Which is the balanced equation?', ['N₂ + O₂ → 2NO₂', 'N₂ + 2O₂ → NO₂', 'N₂ + O₂ → N₂O₂', 'N₂ + 2O₂ → 2NO₂'], 3, 'Balance nitrogen first, then count the oxygen.', ['Put a 2 in front of NO₂ to get 2 N on each side. The right now has 2 × 2 = 4 O.', 'Put a 2 in front of O₂ to get 4 O on the left. N₂ + 2O₂ → 2NO₂ has 2 N and 4 O on each side.'], 'calculation', false, 'cmpd-balance-practice'),
  balancing.choice('C2-14', 'You are balancing an equation that contains H₂O. Which change are you allowed to make?', ['Write 2H₂O instead of H₂O', 'Change H₂O to H₂O₂', 'Change H₂O to H₄O₂', 'Take an O atom away from one side'], 0, 'Which change keeps the substance as water?', ['Changing the small numbers changes the formula, so it would no longer be water.', 'Only numbers in front are allowed, so 2H₂O (two water molecules) is the allowed change.']),
  formulas.choice('C2-15', 'Look at the numbered particles. Which one is a molecule of a compound?', ['Particle 1', 'Particle 2', 'Particle 3'], 1, 'Which particle has atoms of more than one element joined together?', ['Particle 1 is two nitrogen atoms joined (N₂) and particle 3 is one argon atom. Both are elements.', 'Particle 2 has nitrogen and hydrogen atoms joined together, so it is a compound (ammonia, NH₃).'], 'understanding', true, 'cmpd-question-particles'),
  formulas.choice('C2-16', 'Aluminium hydroxide has the formula Al(OH)₃. How many oxygen atoms does the formula show?', ['1', '3', '4', '6'], 1, 'What does the number after the bracket multiply?', ['The small 3 after the bracket multiplies everything inside it.', 'There is 1 O inside the bracket, so there are 3 × 1 = 3 oxygen atoms.'], 'application', true),
  balancing.choice('C2-17', 'Carbon burns in a little oxygen to make carbon monoxide: C + O₂ → CO. Which is the balanced equation?', ['C + O₂ → CO₂', 'C + O₂ → 2CO', '2C + O₂ → 2CO', 'C + O₂ → CO + O'], 2, 'Balance the oxygen first, then count the carbon.', ['Put a 2 in front of CO to get 2 O on each side. The right now has 2 C.', 'Put a 2 in front of C. 2C + O₂ → 2CO has 2 C and 2 O on each side.'], 'calculation', true, 'cmpd-question-co'),
  balancing.choice('C2-18', 'Which of these symbol equations is already balanced?', ['K + Cl₂ → KCl', 'Zn + O₂ → ZnO', 'H₂ + I₂ → HI', 'S + O₂ → SO₂'], 3, 'Count each kind of atom on both sides.', ['In the first three, the left has 2 Cl, 2 O or 2 I, but the right has only 1.', 'S + O₂ → SO₂ has 1 S and 2 O on each side, so it is balanced.'], 'application', true),
  balancing.written('C2-19', 'To balance Li + Cl₂ → LiCl, a student writes LiCl₂. Explain the mistake and balance it correctly.', 'Say what changing a formula does. Then count each kind of atom on both sides and use numbers in front.', 'The student changed a formula. LiCl₂ is not lithium chloride, so the equation would show a different substance. When balancing, you may only put numbers in front of formulas. Chlorine has 2 on the left and 1 on the right, so write 2LiCl. Now there are 2 Li on the right, so write 2Li. The balanced equation is 2Li + Cl₂ → 2LiCl, with 2 Li and 2 Cl on each side.', ['Changing LiCl to LiCl₂ changes the formula, so it would be a different substance.', 'Only numbers in front of formulas may be added when balancing.', 'A 2 in front of LiCl balances the chlorine: 2 Cl on each side.', 'A 2 in front of Li balances the lithium: 2Li + Cl₂ → 2LiCl, with 2 Li and 2 Cl on each side.'], ['Keeping LiCl₂ or any other changed formula.', 'Li + Cl₂ → 2LiCl (the lithium is not balanced).', 'Saying atoms can be made or lost in a reaction.']),
]

export const lessonC2: ScienceLesson = {
  id: 'C-ATM-002-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Compounds and chemical equations', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
