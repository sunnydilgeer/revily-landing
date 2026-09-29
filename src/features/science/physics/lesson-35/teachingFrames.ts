import type { TeachingFrame } from '../../teachingFrame'

// Nuclear equations for alpha and beta decay only, with the two balancing rows (top numbers, bottom numbers). Gamma changes neither.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const nuclearEquationFrames: Record<string, TeachingFrame[]> = {
  'P35-02': [
    f('How a decay is written', 'A nuclear equation shows the nucleus before decay, an arrow, then the nucleus after plus the radiation.', 'before → after + radiation', 'A nuclear equation shows a radioactive decay. It is written as: nucleus before decay → nucleus after decay + radiation given out. The arrow means "changes into".', 'nucleq-form'),
    f('The balancing rule', 'The total mass numbers and the total atomic numbers must be equal on both sides.', 'top numbers match, bottom numbers match', 'There is one golden rule. The mass numbers on the left must add up to the mass numbers on the right. The atomic numbers must do the same. Check the top row, then check the bottom row.', 'nucleq-rule'),
    f('Symbols for the radiation', 'Alpha is ⁴₂He and beta is ⁰₋₁e. Gamma has no symbol in the equation.', 'alpha is helium, beta is electron', 'An alpha particle is the same as a helium nucleus. So we write it as ⁴₂He. A beta particle is an electron. We write it as ⁰₋₁e, with a mass number of 0 and an atomic number of −1.', 'nucleq-symbols'),
  ],
  'P35-05': [
    f('What alpha decay does', 'In alpha decay the atomic number goes down by 2 and the mass number goes down by 4.', 'lose 2 protons and 2 neutrons', 'Alpha decay is when a nucleus emits an alpha particle. The alpha particle takes away 2 protons and 2 neutrons. So the atomic number goes down by 2 and the mass number goes down by 4. A new element is formed.', 'nucleq-alpha-rule'),
    f('Worked example: set it up', 'Polonium-210 decays by alpha emission. Write ²¹⁰₈₄Po → Pb + ⁴₂He, then find lead\'s two missing numbers.', 'write it, then find the gaps', 'Polonium-210 decays by emitting an alpha particle. The new nucleus is lead, Pb. Write the equation with the two numbers for lead missing. The alpha particle is ⁴₂He.', 'nucleq-alpha-work-1'),
    f('Worked example: top row', 'Mass numbers: 210 = ? + 4, so ? = 206.', 'top row first', 'Start with the top row, the mass numbers. The left side is 210. The right side is the mass number of lead plus 4. So the mass number of lead is 210 − 4 = 206.', 'nucleq-alpha-work-2'),
    f('Worked example: bottom row', 'Atomic numbers: 84 = ? + 2, so ? = 82. The equation is ²¹⁰₈₄Po → ²⁰⁶₈₂Pb + ⁴₂He.', 'bottom row, then check', 'Now the bottom row, the atomic numbers. The left side is 84. So the atomic number of lead is 84 − 2 = 82. Check: 206 + 4 = 210 and 82 + 2 = 84. Both rows balance.', 'nucleq-alpha-work-3'),
  ],
  'P35-08': [
    f('What beta decay does', 'In beta decay a neutron turns into a proton, so the atomic number goes up by 1.', 'neutron becomes proton', 'Beta decay is when a nucleus emits a beta particle. Inside the nucleus, a neutron turns into a proton. So there is one more proton. The atomic number goes up by 1.', 'nucleq-beta-rule'),
    f('The mass number stays the same', 'A neutron and a proton have about the same mass, so the mass number does not change.', 'same mass, new charge', 'A neutron and a proton have about the same mass. So the mass number of the nucleus does not change. The beta particle is ⁰₋₁e. Its mass number is 0 and its atomic number is −1, which makes the rows balance.', 'nucleq-beta-symbol'),
    f('Worked example: carbon-14', '¹⁴₆C → ¹⁴₇N + ⁰₋₁e. Top: 14 = 14 + 0. Bottom: 6 = 7 + (−1).', 'top row, bottom row', 'Carbon-14 decays by beta emission into nitrogen-14. Check the top row: 14 = 14 + 0. Check the bottom row: 6 = 7 + (−1), which is 7 − 1. Both rows balance, and the atomic number went up by 1.', 'nucleq-beta-work'),
  ],
  'P35-11': [
    f('Gamma gets rid of extra energy', 'A gamma ray takes away extra energy from the nucleus.', 'energy leaves, nothing else changes', 'Gamma rays are a way of getting rid of extra energy from a nucleus. They are electromagnetic radiation, not particles. So a gamma ray takes away no protons and no neutrons.', 'nucleq-gamma'),
    f('Gamma changes neither number', 'When a gamma ray is emitted, the mass number and atomic number stay the same.', 'same nucleus, less energy', 'When a gamma ray is emitted, the mass number stays the same. The atomic number stays the same too. So it is still the same element. Gamma rays are sometimes released along with alpha or beta particles.', 'nucleq-gamma-same'),
  ],
}
