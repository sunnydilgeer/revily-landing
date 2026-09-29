import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { hydrocarbonFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.7.1.1 Hydrocarbons and the alkanes (general formula CₙH₂ₙ₊₂, displayed formulae of the first four alkanes); 5.7.1.3 Complete combustion of hydrocarbons; balancing equations, as on the supplied revision page' }
const skill = 'C-HYDROCARBONS'
const alkanes = author(skill, ['5.7.1.1'], ['aqa-chemistry'])
const formula = author(skill, ['5.7.1.1'], ['aqa-chemistry'])
const burning = author(skill, ['5.7.1.3'], ['aqa-chemistry'])
const balancing = author(skill, ['5.7.1.3'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const hydrocarbonSections = [
  { id: 'C37-01', label: 'Start here', detail: 'A camping gas made of two elements' },
  { id: 'C37-02', label: 'What is a hydrocarbon?', detail: 'Carbon, hydrogen and single bonds' },
  { id: 'C37-06', label: 'What is the formula of an alkane?', detail: 'CₙH₂ₙ₊₂ from the first four' },
  { id: 'C37-09', label: 'What happens when a hydrocarbon burns?', detail: 'Complete combustion and oxidation' },
  { id: 'C37-12', label: 'How do you balance the equation?', detail: 'Propane step by step' },
  { id: 'C37-15', label: 'On your own', detail: 'Molecules, a formula, a mistake and ethane' },
]

const states: ScienceState[] = [
  { ...alkanes.choice('C37-01', 'A camping gas is made only of carbon and hydrogen atoms joined together. What kind of compound is it?', ['A metal oxide', 'A hydrocarbon', 'An ionic compound', 'An element'], 1, 'Look at the two elements in the name: hydro… and carbon.', ['A compound of only carbon and hydrogen is a hydrocarbon.', 'Its atoms share electrons, so it is not ionic.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(alkanes, 'C37-02', 'What is a hydrocarbon?'),
  alkanes.choice('C37-03', 'Which statement describes a hydrocarbon?', ['A compound of carbon, hydrogen and oxygen', 'A mixture of carbon and hydrogen', 'A compound made only of carbon and hydrogen atoms', 'Any compound that contains hydrogen'], 2, 'How many different elements are allowed?', ['A hydrocarbon has carbon and hydrogen atoms and no other element.', 'It is a compound, so the atoms are bonded together, not just mixed.'], 'recall'),
  alkanes.choice('C37-04', 'How many single covalent bonds does each carbon atom form in an alkane?', ['Four', 'Two', 'Three', 'Eight'], 0, 'Count the lines touching one C in the methane drawing.', ['Each carbon atom in an alkane forms four single covalent bonds.', 'So four lines always touch every C in a displayed formula.'], 'recall'),
  alkanes.choice('C37-05', 'Which alkane has two carbon atoms?', ['Methane', 'Propane', 'Butane', 'Ethane'], 3, 'Put the four names in order: one carbon, two, three, four.', ['The first four alkanes are methane, ethane, propane and butane.', 'They have 1, 2, 3 and 4 carbon atoms, so ethane has two.']),
  t(formula, 'C37-06', 'What is the formula of an alkane?'),
  formula.choice('C37-07', 'An alkane has 6 carbon atoms. Use CₙH₂ₙ₊₂ to find how many hydrogen atoms it has.', ['12', '13', '14', '16'], 2, 'Here n = 6. Double it, then add two.', ['With n = 6, the hydrogen atoms are 2 × 6 + 2.', 'That is 12 + 2 = 14 hydrogen atoms.'], 'calculation'),
  formula.choice('C37-08', 'Which of these is the formula of an alkane?', ['C₃H₆', 'C₃H₈', 'C₃H₁₀', 'C₄H₈'], 1, 'For each one, double the carbon atoms and add two. Does it match?', ['For 3 carbon atoms the rule gives 2 × 3 + 2 = 8 hydrogen atoms.', 'So C₃H₈ fits the rule and the others do not.'], 'application'),
  t(burning, 'C37-09', 'What happens when a hydrocarbon burns?'),
  burning.choice('C37-10', 'What are the only two products when a hydrocarbon burns completely in plenty of oxygen?', ['Carbon and water', 'Carbon monoxide and hydrogen', 'Carbon dioxide and hydrogen', 'Carbon dioxide and water'], 3, 'The carbon and the hydrogen each join to oxygen.', ['The carbon becomes carbon dioxide and the hydrogen becomes water.', 'Nothing else is made in complete combustion.'], 'recall'),
  burning.choice('C37-11', 'During complete combustion, what happens to the carbon and hydrogen in a hydrocarbon?', ['They gain oxygen and are oxidised', 'They lose oxygen', 'They are not changed', 'They turn into oxygen'], 0, 'Oxidation has to do with oxygen. Do the atoms gain it or lose it?', ['The carbon and hydrogen join to oxygen in the products.', 'Gaining oxygen is oxidation, so both are oxidised.']),
  t(balancing, 'C37-12', 'How do you balance the equation?'),
  balancing.choice('C37-13', 'Methane burns: CH₄ + ?O₂ → CO₂ + 2H₂O. How many O₂ molecules are needed to balance it?', ['1', '2', '3', '4'], 1, 'Count the oxygen atoms on the right, then halve the number.', ['The right side has 2 oxygen atoms in CO₂ and 2 in the water, which is 4.', 'Each O₂ has 2 atoms, so 2 molecules of O₂ are needed.'], 'calculation'),
  balancing.choice('C37-14', 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. If 2 propane molecules burn completely, how many CO₂ molecules form?', ['3', '4', '6', '10'], 2, 'Each propane makes 3 CO₂. How many propane molecules are there?', ['One propane molecule makes 3 CO₂ molecules.', 'So 2 propane molecules make 2 × 3 = 6 CO₂ molecules.'], 'calculation'),
  alkanes.choice('C37-15', 'Three displayed formulae are shown. Which molecule is not a hydrocarbon?', ['Molecule 1', 'Molecule 3', 'All three are hydrocarbons', 'Molecule 2'], 3, 'Look at which atoms each molecule contains.', ['Molecule 2 contains an oxygen atom as well as carbon and hydrogen.', 'A hydrocarbon has carbon and hydrogen only, so molecule 2 is not one.'], 'application', true, 'hydro-q-three'),
  formula.choice('C37-16', 'An alkane has 9 carbon atoms. How many hydrogen atoms does one molecule have?', ['20', '18', '19', '11'], 0, 'Use CₙH₂ₙ₊₂ with n = 9.', ['With n = 9, the hydrogen atoms are 2 × 9 + 2.', 'That is 18 + 2 = 20 hydrogen atoms.'], 'calculation', true),
  balancing.choice('C37-17', 'A student balances the burning of methane as CH₄ + O₂ → CO₂ + 2H₂O. What is wrong?', ['The carbon atoms do not balance', 'There are 2 oxygen atoms on the left but 4 on the right', 'The hydrogen atoms do not balance', 'Nothing is wrong'], 1, 'Count each element on both sides, one at a time.', ['Carbon (1 and 1) and hydrogen (4 and 4) balance.', 'Oxygen does not: 2 atoms on the left and 4 on the right, so 2O₂ is needed.'], 'calculation', true),
  balancing.written('C37-18', 'Ethane is C₂H₆. Explain why it is a hydrocarbon, then write the balanced symbol equation for its complete combustion.', 'Say which two elements ethane contains. Then balance carbon, then hydrogen, then oxygen.', 'Ethane is a hydrocarbon because it contains only carbon and hydrogen atoms. In complete combustion it reacts with oxygen to make carbon dioxide and water. The balanced equation is 2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O. The 2 in front of C₂H₆ gives 4 carbon atoms and 12 hydrogen atoms, which need 4 CO₂ and 6 H₂O, and those hold 14 oxygen atoms, so 7 O₂ are needed.', ['Ethane contains only carbon and hydrogen atoms, so it is a hydrocarbon.', 'The reactants are ethane and oxygen; the products are carbon dioxide and water.', 'The equation is correctly balanced: 2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O.'], ['Writing carbon monoxide or carbon as a product.', 'Changing a formula (for example writing O instead of O₂) to balance it.', 'Giving an unbalanced equation such as C₂H₆ + O₂ → CO₂ + H₂O.']),
]

export const lessonC37: ScienceLesson = {
  id: 'C-ORG-037-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Hydrocarbons and alkanes', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
