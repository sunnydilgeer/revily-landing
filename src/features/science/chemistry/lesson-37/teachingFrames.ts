import type { TeachingFrame } from '../../teachingFrame'

// One drawing per section, built up step by step. Hydrocarbons and displayed formulae first, then the alkane formula
// (counting the atoms in the four drawings), then complete combustion, then balancing with one worked example.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const hydrocarbonFrames: Record<string, TeachingFrame[]> = {
  'C37-02': [
    f('Only two ingredients', 'A hydrocarbon is a compound made of hydrogen and carbon atoms only.', 'carbon + hydrogen, nothing else', 'Organic chemistry is the study of compounds that contain carbon. The simplest organic compounds are made of just two elements, carbon and hydrogen. A compound with only these two kinds of atom is called a hydrocarbon.', 'hydro-hc'),
    f('Drawing every bond', 'A displayed formula is a drawing that shows every atom and every bond in a molecule.', 'each line is one covalent bond', 'Here is methane. The letter C is a carbon atom and each H is a hydrogen atom. Each line between two atoms is one single covalent bond. A drawing like this is called a displayed formula.', 'hydro-displayed'),
    f('Four bonds from every carbon', 'Alkanes are hydrocarbons in which every bond is a single covalent bond.', 'count four lines round each C', 'Alkanes are the simplest type of hydrocarbon. All the bonds in an alkane are single bonds, either C–C or C–H. Every carbon atom forms four single bonds, so you can always count four lines touching each C.', 'hydro-alkane'),
    f('The first four alkanes', 'The first four alkanes are methane, ethane, propane and butane.', 'one, two, three, four carbon atoms', 'The names of the first four alkanes tell you how many carbon atoms are in the chain. Methane has one, ethane has two, propane has three and butane has four. Each extra carbon atom adds more hydrogen atoms around it.', 'hydro-four'),
  ],
  'C37-06': [
    f('Counting the atoms', 'Every alkane has twice as many hydrogen atoms as carbon atoms, plus two more.', 'carbons → hydrogens', 'Count the atoms in the first four alkanes. Methane has 1 carbon and 4 hydrogen. Ethane has 2 carbon and 6 hydrogen. Propane has 3 carbon and 8 hydrogen. Butane has 4 carbon and 10 hydrogen.', 'hydro-count'),
    f('A rule for every alkane', 'The general formula of the alkanes is CₙH₂ₙ₊₂, where n is the number of carbon atoms.', 'C = n, H = 2n + 2', 'Look at the pattern in the table. The hydrogen atoms are always double the carbon atoms, plus two. We write this as CₙH₂ₙ₊₂. The letter n stands for the number of carbon atoms in the molecule.', 'hydro-formula'),
    f('Using the rule', 'Put the number of carbon atoms into the rule to find the formula.', 'n → 2n + 2', 'Suppose an alkane has 3 carbon atoms, so n = 3. The hydrogen atoms are 2 × 3 + 2 = 8. The formula is C₃H₈, which is propane. The rule works for any size of alkane, even ones with no name you know.', 'hydro-formula-use'),
  ],
  'C37-09': [
    f('Burning with plenty of oxygen', 'Complete combustion happens when a hydrocarbon burns in plenty of oxygen.', 'hydrocarbon + oxygen → CO₂ + water', 'A hydrocarbon burns well when there is plenty of oxygen. This is called complete combustion. The only waste products are carbon dioxide and water vapour. Lots of energy is also released.', 'hydro-comb-word'),
    f('Gaining oxygen', 'Oxidation is the gain of oxygen. In combustion, both the carbon and the hydrogen are oxidised.', 'carbon and hydrogen both gain oxygen', 'The carbon in the hydrocarbon ends up joined to oxygen in carbon dioxide. The hydrogen ends up joined to oxygen in water. So both have gained oxygen. Gaining oxygen is called oxidation.', 'hydro-oxidation'),
    f('Why they make good fuels', 'Burning releases lots of energy, which makes hydrocarbons useful fuels.', 'lots of energy out', 'Burning hydrocarbons releases a lot of energy as heat. That is why alkanes such as methane and butane are used as fuels. The carbon dioxide and water vapour are the only products when the oxygen supply is plentiful.', 'hydro-comb-fuel'),
  ],
  'C37-12': [
    f('Write the unbalanced equation', 'Start by writing the correct formulae for the reactants and the products.', 'formulae first, numbers later', 'We will balance the equation for the complete combustion of propane. First write the formulae. Propane is C₃H₈. The other formulae are O₂, CO₂ and H₂O. Do not change a formula to balance an equation.', 'hydro-bal-1'),
    f('Balance the carbon', 'Put a number in front of CO₂ so the carbon atoms match on both sides.', 'C: 3 on the left, so 3 CO₂', 'The left side has 3 carbon atoms in C₃H₈. So three molecules of CO₂ are needed on the right. Write a 3 in front of CO₂. That makes 3 carbon atoms on each side.', 'hydro-bal-2'),
    f('Balance the hydrogen', 'Put a number in front of H₂O so the hydrogen atoms match.', 'H: 8 on the left, so 4 H₂O', 'The left side has 8 hydrogen atoms. Each water molecule has 2 hydrogen atoms. So four molecules of H₂O are needed on the right. Write a 4 in front of H₂O.', 'hydro-bal-3'),
    f('Balance the oxygen last', 'Count the oxygen atoms on the right, then put the number in front of O₂.', 'O: 6 + 4 = 10, so 5 O₂', 'On the right there are 3 × 2 = 6 oxygen atoms in CO₂ and 4 in the water. That is 10 oxygen atoms. Each O₂ molecule has 2 atoms, so five O₂ are needed on the left. Check each element once more.', 'hydro-bal-4'),
  ],
}
