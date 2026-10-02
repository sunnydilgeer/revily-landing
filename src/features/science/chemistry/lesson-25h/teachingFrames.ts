import type { TeachingFrame } from '../../teachingFrame'

// Redox in terms of electrons builds on ions (metal atoms lose electrons, non-metal atoms gain them), oxidation and
// reduction as gain and loss of oxygen, and displacement. Each teaching section keeps one drawing on screen and changes
// it frame by frame: a magnesium atom and an oxygen atom becoming ions, one board of half equations for the same
// reaction (2Mg + O₂ → 2MgO), and iron in copper sulfate turned into an ionic equation. The last frame of each puts the
// steps together.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const redoxFrames: Record<string, TeachingFrame[]> = {
  'C25H-02': [
    f('Not just oxygen', 'Oxidation and reduction can also be described with electrons.', 'gains oxygen → now look at the electrons', 'You met oxidation as gaining oxygen. When magnesium burns, it gains oxygen, so it is oxidised. Chemists can also describe this using electrons. A magnesium atom has 2 outer electrons. An oxygen atom has 6.', 'hredox-e-oxygen'),
    f('Losing electrons', 'Oxidation is the loss of electrons.', 'Mg loses 2e⁻ → Mg²⁺', 'When magnesium reacts, each atom loses its 2 outer electrons. It becomes a magnesium ion, Mg²⁺. Losing electrons is called oxidation. So the magnesium is oxidised, just as before.', 'hredox-e-lose'),
    f('Gaining electrons', 'Reduction is the gain of electrons.', 'O gains 2e⁻ → O²⁻', 'Each oxygen atom gains 2 electrons. It now has 8 outer electrons and becomes an oxide ion, O²⁻. Gaining electrons is called reduction. So the oxygen is reduced.', 'hredox-e-gain'),
    f('Both at once', 'Electrons move from one reactant to the other, so oxidation and reduction happen together.', 'lost by one → gained by the other', 'The electrons that magnesium loses are the ones that oxygen gains. So one reactant cannot be oxidised unless another is reduced. A reaction where both happen is called a redox reaction. Redox is short for reduction and oxidation.', 'hredox-e-both'),
    f('Put it together', 'OIL RIG: Oxidation Is Loss, Reduction Is Gain, of electrons.', 'OIL RIG', 'A handy way to remember this is OIL RIG. Oxidation Is Loss of electrons. Reduction Is Gain of electrons. Metals reacting with acids are redox reactions too. The metal atoms lose electrons, and hydrogen ions gain them to make hydrogen gas.', 'hredox-e-all'),
  ],
  'C25H-06': [
    f('Half an equation', 'A half equation shows just the electrons lost, or just the electrons gained.', 'one half for each element', 'Magnesium oxide is made of Mg²⁺ and O²⁻ ions. So the equation can be written with ions: 2Mg + O₂ → 2Mg²⁺ + 2O²⁻. A half equation shows just one half of a redox reaction. Write one for each element that changes: Mg → Mg²⁺ and O₂ → 2O²⁻.', 'hredox-half-split'),
    f('Balance the charge', 'Add electrons to the more positive side so the charges match.', 'Mg → Mg²⁺ + 2e⁻', 'The atoms must balance, and so must the charge. On the left, Mg has no charge. On the right, Mg²⁺ has a charge of 2+. Add 2 electrons to the right, the more positive side: Mg → Mg²⁺ + 2e⁻. Electrons on the right have been lost, so this half is oxidation.', 'hredox-half-lose'),
    f('Electrons on the left', 'Electrons on the left have been gained, so that half is reduction.', 'O₂ + 4e⁻ → 2O²⁻', 'Now oxygen. In O₂ → 2O²⁻ there are 2 oxygen atoms on each side, so the atoms balance. The left has no charge, but the right has 4−. Add 4 electrons to the left: O₂ + 4e⁻ → 2O²⁻. Electrons on the left have been gained, so this half is reduction.', 'hredox-half-gain'),
    f('Combine the halves', 'Make the electrons equal, add the halves, then cancel the electrons.', '2 × (Mg → Mg²⁺ + 2e⁻)', 'You can add two half equations to get the whole reaction. First, make the numbers of electrons equal. Oxygen gains 4, so double the magnesium half: 2Mg → 2Mg²⁺ + 4e⁻. Add the halves, and cross out the 4e⁻ on each side. This leaves 2Mg + O₂ → 2Mg²⁺ + 2O²⁻.', 'hredox-half-combine'),
    f('Put it together', 'Write the ions, split into halves, then balance the atoms and the charge.', 'ions → halves → atoms → electrons', 'Step 1: write the equation with any ionic compounds as ions. Step 2: write a half for each element that changes. Step 3: balance the atoms. Step 4: add electrons to the more positive side, so the charges match. To combine two halves, make the electrons equal first.', 'hredox-half-steps'),
  ],
  'C25H-11': [
    f('Displacement is redox', 'In displacement, the metal atom is oxidised and the metal ion is reduced.', 'Fe loses 2e⁻, Cu²⁺ gains 2e⁻', 'Iron displaces copper from copper sulfate solution. Each iron atom loses 2 electrons and becomes an Fe²⁺ ion, so iron is oxidised. Each copper ion, Cu²⁺, gains those 2 electrons and becomes a copper atom. So the copper ions are reduced.', 'hredox-ion-redox'),
    f('Show the ions', 'Write dissolved compounds as separate ions.', 'CuSO₄ in solution → Cu²⁺ + SO₄²⁻', 'Start with the full equation: Fe + CuSO₄ → FeSO₄ + Cu. Copper sulfate and iron sulfate are dissolved, so their ions are separate. Write each of them as its ions. Iron and copper are solid metals, so they stay as atoms.', 'hredox-ion-split'),
    f('Spectator ions', 'Ions that are the same on both sides are spectator ions.', 'SO₄²⁻ on both sides → cross out', 'Look at the sulfate ions, SO₄²⁻. They are the same at the start and at the end. They do not take part in the reaction. Ions like these are called spectator ions, so you can cross them out.', 'hredox-ion-spectator'),
    f('The ionic equation', 'An ionic equation shows only the particles that change.', 'Fe + Cu²⁺ → Fe²⁺ + Cu', 'What is left is Fe + Cu²⁺ → Fe²⁺ + Cu. This is called an ionic equation. It shows only the particles that are oxidised and reduced. Check the charges: there is 2+ on each side.', 'hredox-ion-ionic'),
    f('Put it together', 'Full equation, then ions, then cross out spectator ions, then the ionic equation.', 'full → ions → cross out → ionic', 'Step 1: write the full balanced equation. Step 2: write dissolved compounds as ions. Step 3: cross out the spectator ions. Step 4: write what is left. In displacement, the metal atom is always oxidised and the metal ion is always reduced.', 'hredox-ion-steps'),
  ],
}
