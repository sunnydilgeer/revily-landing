import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-MOL-020H-C',
  sections: {
    'C20H-02': [
      ['What is the Avogadro constant?', '6.02 × 10²³. It is the number of particles in one mole of a substance.'],
      ['What is the mass of one mole of a substance?', 'Its Aᵣ or Mᵣ in grams. For example, one mole of water, H₂O (Mᵣ 18), has a mass of 18 g.', 'One mole of every substance holds the same number of particles.'],
      ['How do you work out the number of moles in a mass?', 'number of moles = mass in g ÷ Mᵣ. Rearranged: mass = number of moles × Mᵣ.'],
    ],
    'C20H-08': [
      ['What do the big numbers in a balanced equation tell you?', 'The ratio of the numbers of moles that react and form. In 2Mg + O₂ → 2MgO, 2 mol of Mg react with 1 mol of O₂ to make 2 mol of MgO.'],
      ['How do you balance an equation from reacting masses?', 'Divide each mass by its Mᵣ to get moles. Divide by the smallest. If any are not whole numbers, multiply them all by the same number. Write them in front of the formulas.'],
    ],
    'C20H-13': [
      ['What is the limiting reactant?', 'The reactant that is used up first. The reaction stops when it runs out, so it limits how much product forms.', 'A reactant that is left over is in excess.'],
      ['How does the amount of product depend on the limiting reactant?', 'It is directly proportional: double the limiting reactant and you double the product.'],
      ['How do you find the mass of product from the mass of the limiting reactant?', 'Write the balanced equation, find the Mᵣ values, find the moles of the limiting reactant, use the equation ratio for the moles of product, then mass = moles × Mᵣ.'],
    ],
  },
  recall: ['C20H-07', 'C20H-10', 'C20H-15'],
}
