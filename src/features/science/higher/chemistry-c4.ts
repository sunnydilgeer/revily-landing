/*
 * Higher-only sections for chapter C4 (chemical changes), from the CGP AQA Combined Science Higher guide pages 136–137
 * (scope only; all wording, examples, questions and diagrams are original). AQA 8464 HT content: 5.4.3.2, 5.4.3.3 and
 * 5.4.3.4 (half equations at the electrodes). Diagram: components/HigherElectrolysisVisuals.tsx ('helec-').
 * Half equations are first met in the redox lesson (25H), so they are only briefly recalled here.
 */
import { addition, f, type HigherAddition } from './helpers'

// Chemistry Lesson 26 · Higher p136: half equations for molten lead bromide and for aluminium. Before "On your own".
const moltenHalf = addition('C-CHG-026-C', 'C26-11', 'C-HIGHER-ELEC-MOLTEN', ['5.4.3.2', '5.4.3.3'],
  { id: 'C26-H01', higher: true, label: 'Half equations at the electrodes', detail: 'Molten lead bromide and aluminium oxide' },
  [
    f('Lead at the cathode', 'At the cathode, each lead ion gains two electrons: Pb²⁺ + 2e⁻ → Pb.', 'Pb²⁺ gains 2e⁻ → Pb', 'A half equation shows the change at one electrode. Lead ions, Pb²⁺, move to the cathode. Each one gains two electrons, e⁻, and becomes a lead atom. So Pb²⁺ + 2e⁻ → Pb. Gaining electrons is called reduction.', 'helec-pb-cathode'),
    f('Bromine at the anode', 'At the anode, two bromide ions lose two electrons: 2Br⁻ → Br₂ + 2e⁻.', 'two Br⁻ lose 2e⁻ → one Br₂', 'Bromide ions, Br⁻, move to the anode. Each one loses one electron. Bromine is made of pairs of atoms, so it takes two bromide ions to make one Br₂ molecule. So 2Br⁻ → Br₂ + 2e⁻. Losing electrons is called oxidation.', 'helec-pb-anode'),
    f('Aluminium at the cathode', 'Each aluminium ion gains three electrons: Al³⁺ + 3e⁻ → Al.', 'charge 3+ → gains 3e⁻', 'Now the aluminium cell. Aluminium ions, Al³⁺, move to the cathode. An ion with a 3+ charge needs three electrons to become an uncharged atom. So Al³⁺ + 3e⁻ → Al. The aluminium ions are reduced.', 'helec-al-cathode'),
    f('Oxygen at the anode', 'Two oxide ions lose four electrons in all: 2O²⁻ → O₂ + 4e⁻.', 'two O²⁻ lose 2e⁻ each → O₂ + 4e⁻', 'Oxide ions, O²⁻, move to the anode. Each one loses two electrons. Oxygen gas is made of O₂ molecules, so two oxide ions make one molecule and give up four electrons. So 2O²⁻ → O₂ + 4e⁻. The oxide ions are oxidised.', 'helec-al-anode'),
    f('Put it together', 'Cathode: positive ions gain electrons (reduction). Anode: negative ions lose electrons (oxidation).', 'cathode gain · anode loss', 'At the cathode, positive ions gain electrons. That is reduction, so the electrons go on the left of the arrow. At the anode, negative ions lose electrons. That is oxidation, so the electrons go on the right. The charges on each side always balance.', 'helec-m-all'),
  ],
  a => [
    a.choice('C26-H02', 'Molten lead bromide is electrolysed. Which half equation shows what happens at the cathode?', ['Pb²⁺ + 2e⁻ → Pb', 'Pb²⁺ → Pb + 2e⁻', '2Br⁻ → Br₂ + 2e⁻', 'Br₂ + 2e⁻ → 2Br⁻'], 0, 'Positive ions go to the cathode. Do they gain or lose electrons?', ['Lead ions are positive, so they move to the cathode.', 'There each one gains two electrons, so the electrons go on the left: Pb²⁺ + 2e⁻ → Pb.']),
    a.choice('C26-H03', 'At the anode of the aluminium cell, 2O²⁻ → O₂ + 4e⁻. What kind of change is this?', ['Oxidation, because the oxide ions lose electrons', 'Reduction, because the oxide ions gain electrons', 'Oxidation, because the oxide ions gain electrons', 'Reduction, because oxygen gas is made'], 0, 'Which side of the arrow are the electrons on?', ['The electrons are on the right, so the oxide ions give them away.', 'Losing electrons is oxidation.']),
    a.choice('C26-H04', 'Molten potassium iodide, KI, is electrolysed. Which half equation shows the reaction at the anode?', ['2I⁻ → I₂ + 2e⁻', 'K⁺ + e⁻ → K', '2I⁻ + 2e⁻ → I₂', 'I₂ → 2I⁻ + 2e⁻'], 0, 'Negative ions go to the anode. Iodine is made of pairs of atoms, like bromine.', ['Iodide ions, I⁻, are negative, so they move to the anode and lose electrons.', 'Two iodide ions make one I₂ molecule and give up two electrons: 2I⁻ → I₂ + 2e⁻.'], 'application', true),
  ])

// Chemistry Lesson 27 · Higher p137: half equations for aqueous solutions. Before "On your own".
const aqueousHalf = addition('C-CHG-027-C', 'C27-17', 'C-HIGHER-ELEC-AQ', ['5.4.3.4'],
  { id: 'C27-H01', higher: true, label: 'Half equations in solutions', detail: 'Hydrogen, copper, chlorine and oxygen' },
  [
    f('Hydrogen at the cathode', 'In sodium chloride solution, H⁺ ions gain electrons: 2H⁺ + 2e⁻ → H₂.', 'two H⁺ gain 2e⁻ → H₂', 'A half equation shows the change at one electrode. In sodium chloride solution, sodium is more reactive than hydrogen. So the H⁺ ions from the water react at the cathode. Two of them gain two electrons to make one hydrogen molecule: 2H⁺ + 2e⁻ → H₂.', 'helec-h-cathode'),
    f('Chlorine at the anode', 'Chloride ions lose electrons: 2Cl⁻ → Cl₂ + 2e⁻.', 'two Cl⁻ lose 2e⁻ → Cl₂', 'Chloride is a halide ion, so chlorine forms at the anode. Each chloride ion loses one electron. Two of them make one Cl₂ molecule: 2Cl⁻ → Cl₂ + 2e⁻. This is just like bromide in molten lead bromide.', 'helec-cl-anode'),
    f('Copper at the cathode', 'In copper sulfate solution, copper ions gain electrons: Cu²⁺ + 2e⁻ → Cu.', 'Cu²⁺ gains 2e⁻ → Cu', 'In copper sulfate solution, copper is less reactive than hydrogen. So the copper ions react at the cathode. Each Cu²⁺ ion gains two electrons and becomes a copper atom: Cu²⁺ + 2e⁻ → Cu. A layer of copper coats the cathode.', 'helec-cu-cathode'),
    f('Oxygen at the anode', 'With no halide ions, hydroxide ions lose electrons: 4OH⁻ → O₂ + 2H₂O + 4e⁻.', 'four OH⁻ → O₂ + water + 4e⁻', 'Sulfate is not a halide ion, so the OH⁻ ions react at the anode. Four hydroxide ions lose four electrons. They make one oxygen molecule and two water molecules: 4OH⁻ → O₂ + 2H₂O + 4e⁻.', 'helec-o-anode'),
    f('Put it together', 'Cathode: hydrogen or a metal forms (reduction). Anode: a halogen or oxygen forms (oxidation).', 'cathode gain · anode loss', 'Use the rules to choose the product, then write its half equation. At the cathode, H⁺ or metal ions gain electrons. That is reduction. At the anode, halide or OH⁻ ions lose electrons. That is oxidation.', 'helec-aq-all'),
  ],
  a => [
    a.choice('C27-H02', 'Sodium chloride solution is electrolysed. Hydrogen forms at the cathode. Which half equation shows this?', ['2H⁺ + 2e⁻ → H₂', 'Na⁺ + e⁻ → Na', '2H⁺ → H₂ + 2e⁻', 'H₂ + 2e⁻ → 2H⁺'], 0, 'At the cathode, ions gain electrons.', ['Sodium is more reactive than hydrogen, so the H⁺ ions react, not the Na⁺ ions.', 'Two H⁺ ions gain two electrons to make one H₂ molecule: 2H⁺ + 2e⁻ → H₂.']),
    a.choice('C27-H03', 'Potassium nitrate solution is electrolysed. Which half equation shows the reaction at the anode?', ['4OH⁻ → O₂ + 2H₂O + 4e⁻', '2H⁺ + 2e⁻ → H₂', '4OH⁻ + 4e⁻ → O₂ + 2H₂O', 'K⁺ + e⁻ → K'], 0, 'Nitrate is not a halide ion. Which negative ion reacts instead?', ['There are no halide ions, so the OH⁻ ions react at the anode.', 'They lose electrons, so the electrons go on the right: 4OH⁻ → O₂ + 2H₂O + 4e⁻.']),
    a.choice('C27-H04', 'Zinc chloride solution is electrolysed. Zinc is more reactive than hydrogen. Which pair of half equations is correct?', ['Cathode: 2H⁺ + 2e⁻ → H₂ · Anode: 2Cl⁻ → Cl₂ + 2e⁻', 'Cathode: Zn²⁺ + 2e⁻ → Zn · Anode: 2Cl⁻ → Cl₂ + 2e⁻', 'Cathode: 2H⁺ + 2e⁻ → H₂ · Anode: 4OH⁻ → O₂ + 2H₂O + 4e⁻', 'Cathode: Zn²⁺ + 2e⁻ → Zn · Anode: 4OH⁻ → O₂ + 2H₂O + 4e⁻'], 0, 'Use the cathode rule and the anode rule, then pick the half equations.', ['Zinc is more reactive than hydrogen, so H⁺ ions react at the cathode: 2H⁺ + 2e⁻ → H₂.', 'Chloride is a halide ion, so chlorine forms at the anode: 2Cl⁻ → Cl₂ + 2e⁻.'], 'application', true),
  ])

export const higherC4: HigherAddition[] = [moltenHalf, aqueousHalf]
