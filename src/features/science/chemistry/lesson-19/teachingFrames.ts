import type { TeachingFrame } from '../../teachingFrame'

// Section 1 keeps one reaction on screen (magnesium burning, 2Mg + O₂ → 2MgO) and builds it up: atoms swap partners →
// count them → same mass → same total Mᵣ. Section 2 keeps one reaction with a missing mass (zinc and copper sulfate).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const massConservationFrames: Record<string, TeachingFrame[]> = {
  'C19-02': [
    f('Atoms swap partners', 'In a reaction, the same atoms join up in a new way.', 'same atoms → new partners', 'Magnesium burns in oxygen to make magnesium oxide: 2Mg + O₂ → 2MgO. On the left there are two magnesium atoms and one oxygen molecule. In the reaction the atoms swap partners. On the right, the same four atoms are joined as two magnesium oxide units.', 'cons-atoms-move'),
    f('Nothing lost, nothing made', 'Count each type of atom on both sides.', 'count Mg → count O → same', 'No atoms are lost and no atoms are made in a chemical reaction. Count them to check. There are 2 magnesium atoms and 2 oxygen atoms before, and the same after. In a balanced equation, each type of atom appears the same number of times on both sides.', 'cons-atoms-count'),
    f('Mass is conserved', 'The same atoms mean the same total mass.', 'same atoms → same mass', 'The atoms are the same, so the total mass stays the same. We say mass is conserved. This holds as long as nothing escapes and nothing is added from outside. The mass of everything you start with equals the mass of everything you end with.', 'cons-mass-balance'),
    f('Same total Mᵣ', 'In a balanced equation, the total Mᵣ is the same on both sides.', 'left total Mᵣ = right total Mᵣ', 'You can check this with relative formula mass. Left side: 2 × 24 for the magnesium, plus 32 for O₂, gives 80. Right side: 2 × 40 for the two MgO gives 80. The total Mᵣ is the same on both sides.', 'cons-mr-sum'),
  ],
  'C19-06': [
    f('One mass is missing', 'You can know every mass except one.', 'all masses known but one', 'Zinc reacts with copper sulfate to make copper and zinc sulfate. Here 6.5 g of zinc reacts with 16.0 g of copper sulfate, and 6.4 g of copper is made. The mass of zinc sulfate is not known. Mass is conserved, so you can work it out.', 'cons-miss-setup'),
    f('Add the side you know', 'Find the total mass of the reactants.', '6.5 + 16.0 = 22.5', 'Both reactant masses are known, so add them: 6.5 + 16.0 = 22.5 g. Mass is conserved, so the products must add up to the same total, 22.5 g.', 'cons-miss-left'),
    f('Take away what you know', 'Subtract the known product from the total.', '22.5 − 6.4 = 16.1', 'The products must add up to 22.5 g. Copper makes up 6.4 g of that. What is left is zinc sulfate: 22.5 − 6.4 = 16.1 g. This subtraction finds the difference between the two totals.', 'cons-miss-take'),
    f('Put it together', 'Total one side, then subtract to find the missing mass.', 'total → subtract → missing mass', 'First, add the masses on the side where you know every mass. Next, take away the known masses on the other side. The difference is the missing mass. Check that both sides now total the same: 22.5 g.', 'cons-miss-bar'),
  ],
}
