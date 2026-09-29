import type { TeachingFrame } from '../../teachingFrame'

// Why crack, how it is done, the bromine water test, then a worked cracking equation built up one step at a time.
// Catalysts are recalled from the rates lessons, not re-taught. Alkenes are introduced only as far as this page needs.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const crackingFrames: Record<string, TeachingFrame[]> = {
  'C40-02': [
    f('Too many long chains', 'There is a high demand for fuels with small molecules, but crude oil has plenty of long ones.', 'demand for short chains is high', 'Short-chain hydrocarbons make better fuels than long-chain ones. There is a high demand for them, for example for petrol. Crude oil does not contain enough short chains to meet that demand.', 'crack-demand'),
    f('Split them up', 'Splitting long-chain hydrocarbons into smaller molecules is called cracking.', 'one long chain becomes smaller pieces', 'The answer is to take the extra long-chain molecules and split them into smaller, more useful ones. This is called cracking. It is done to fractions that come out of the fractionating column.', 'crack-split'),
    f('Two kinds of product', 'Cracking makes alkanes, which are useful fuels, and alkenes, which are another type of hydrocarbon.', 'alkane plus alkene', 'Some of the smaller molecules made are alkanes. These are useful as fuels, for example petrol. Cracking also makes alkenes. Alkenes are another type of hydrocarbon, and they contain a C=C double bond.', 'crack-products'),
    f('Why alkenes matter', 'Alkenes are more reactive than alkanes, so they are used as starting materials to make other compounds, including polymers.', 'reactive, so a good starting material', 'Alkenes are much more reactive than alkanes. That makes them a very useful starting material. Chemists use them to make lots of other compounds. They are also used to make polymers.', 'crack-alkene-uses'),
  ],
  'C40-05': [
    f('Breaking down with heat', 'Cracking is thermal decomposition: molecules are broken down by heating.', 'heat splits the molecules', 'Cracking is a kind of thermal decomposition reaction. That means the molecules are broken down by heating them. There are two main methods, called steam cracking and catalytic cracking.', 'crack-thermal'),
    f('Steam cracking', 'The hydrocarbons are vaporised, mixed with steam and heated to a very high temperature.', 'vapour, steam, very hot', 'In steam cracking, the long-chain hydrocarbons are first vaporised. This means they are heated until they become a gas. The vapour is mixed with steam. It is then heated to a very high temperature, which splits the molecules.', 'crack-steam'),
    f('Catalytic cracking', 'The vaporised hydrocarbons pass over a hot powdered aluminium oxide catalyst, which splits them on its surface.', 'vapour over a hot catalyst', 'In catalytic cracking the hydrocarbons are also vaporised. The vapour is passed over a hot powdered catalyst made of aluminium oxide. The long molecules split apart on the surface of the specks of catalyst. A catalyst speeds up a reaction without being used up.', 'crack-catalytic'),
    f('Two methods side by side', 'Both methods vaporise the hydrocarbons and heat them. Steam cracking adds steam. Catalytic cracking uses a catalyst.', 'what is added in each method', 'Both methods start by vaporising the long-chain hydrocarbons, and both use heat. The difference is what is added. Steam cracking uses steam and a very high temperature. Catalytic cracking uses a hot aluminium oxide catalyst.', 'crack-methods'),
  ],
  'C40-08': [
    f('The test set-up', 'Bromine water is orange. It is used to test whether a hydrocarbon is an alkene.', 'orange bromine water is the test liquid', 'Bromine water can be used to tell alkenes from alkanes. It is an orange liquid. A small amount of the hydrocarbon is shaken with it. In school this is done by, or under the close supervision of, a teacher.', 'crack-br-setup'),
    f('Alkane: no change', 'With an alkane there is no reaction and the bromine water stays orange.', 'no reaction, still orange', 'Shake bromine water with an alkane and nothing happens. There is no reaction. The mixture stays bright orange.', 'crack-br-alkane'),
    f('Alkene: goes colourless', 'With an alkene the bromine reacts and the bromine water turns colourless.', 'alkene: orange to colourless', 'Shake bromine water with an alkene and the bromine reacts with it. It makes a colourless compound. So the orange colour disappears and the mixture turns colourless.', 'crack-br-alkene'),
  ],
  'C40-11': [
    f('The same atoms on both sides', 'In a cracking equation the numbers of carbon atoms and hydrogen atoms must match on each side.', 'count C and H on both sides', 'Here decane, C₁₀H₂₂, is cracked into octane, C₈H₁₈, and one other product. We must find the formula of that missing product. The number of carbon atoms and hydrogen atoms must be the same on each side.', 'crack-eq-setup'),
    f('Carbon atoms', 'Missing carbons = carbons in the starting molecule − carbons in the known product.', 'subtract the carbons', 'Decane has 10 carbon atoms. Octane has 8. So the missing product has 10 − 8 = 2 carbon atoms.', 'crack-eq-carbon'),
    f('Hydrogen atoms', 'Missing hydrogens = hydrogens in the starting molecule − hydrogens in the known product.', 'subtract the hydrogens', 'Decane has 22 hydrogen atoms. Octane has 18. So the missing product has 22 − 18 = 4 hydrogen atoms.', 'crack-eq-hydrogen'),
    f('Write and check', 'The missing product has 2 carbons and 4 hydrogens, so it is C₂H₄. Check both sides.', 'write the formula, then check', 'Put the numbers into a formula. The missing product is C₂H₄. Check: on the right, 8 + 2 = 10 carbons and 18 + 4 = 22 hydrogens. That matches C₁₀H₂₂ on the left.', 'crack-eq-answer'),
  ],
}
