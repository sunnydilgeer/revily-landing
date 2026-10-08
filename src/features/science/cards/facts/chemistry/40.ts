import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-ORG-040-C',
  sections: {
    'C40-02': [
      ['What is cracking?', 'Splitting long-chain hydrocarbons into smaller, more useful molecules.', 'It is done because there is a high demand for fuels with small molecules.'],
      ['Why are alkenes useful?', 'They are more reactive than alkanes, so they are used as a starting material to make other compounds and polymers.'],
    ],
    'C40-05': [
      ['What are the two methods of cracking?', 'Steam cracking and catalytic cracking. Both are thermal decomposition.'],
      ['How does catalytic cracking work?', 'Vaporised hydrocarbons pass over a hot powdered aluminium oxide catalyst, which splits the molecules on its surface.'],
    ],
    'C40-08': [
      ['How do you test for an alkene?', 'Shake it with orange bromine water. An alkene turns it colourless; an alkane leaves it orange.'],
      ['Why does bromine water turn colourless with an alkene?', 'The bromine reacts with the alkene to make a colourless compound, so the orange colour disappears.', 'With an alkane there is no reaction, so it stays orange.'],
    ],
    'C40-11': [
      ['How do you find the missing product in a cracking equation?', 'Subtract the carbon atoms and the hydrogen atoms of the known products from those of the starting molecule.', 'C₁₀H₂₂ → C₈H₁₈ + C₂H₄'],
      ['How do you check a completed cracking equation?', 'Add up the carbon atoms and the hydrogen atoms in the products. They must match the starting molecule.', '8 + 2 = 10 carbons and 18 + 4 = 22 hydrogens, matching C₁₀H₂₂.'],
    ],
  },
  recall: ['C40-03', 'C40-07', 'C40-10'],
}
