import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-QNT-019-C',
  sections: {
    'C19-02': [
      ['What happens to the atoms in a chemical reaction?', 'They are rearranged. No atoms are lost and no atoms are made.'],
      ['What does “mass is conserved” mean?', 'The total mass of the reactants equals the total mass of the products.', 'This is because the atoms are the same before and after.'],
      ['What is the same on both sides of a balanced symbol equation?', 'The number of each type of atom, and the total Mᵣ.'],
    ],
    'C19-06': [
      ['How do you find a missing mass in a reaction?', 'Total the side where every mass is known, take away the known masses on the other side, and the difference is the missing mass.'],
      ['3.0 g of A reacts with 5.0 g of B to make 2.0 g of C and some D. What mass of D is made?', '3.0 + 5.0 = 8.0 g, then 8.0 − 2.0 = 6.0 g.'],
    ],
  },
  recall: ['C19-04', 'C19-05', 'C19-09'],
}
