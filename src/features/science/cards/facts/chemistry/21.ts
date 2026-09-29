import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-QNT-021-C',
  sections: {
    'C21-02': [
      ['What does the concentration of a solution measure?', 'How much solute is dissolved in a certain volume of solution: how crowded the dissolved particles are.'],
      ['How can you make a solution more concentrated?', 'Dissolve more solute in the same volume, or use less water for the same solute.', 'Adding more water makes it less concentrated.'],
      ['What are the units of concentration, and what does 20 g/dm³ mean?', 'Grams per cubic decimetre. 20 g/dm³ means 20 g of solute in every 1 dm³ of solution.', '1 dm³ = 1000 cm³.'],
    ],
    'C21-05': [
      ['What is the formula for concentration in g/dm³?', 'concentration = mass of solute ÷ volume of solution, with mass in g and volume in dm³.'],
      ['How do you change a volume from cm³ to dm³?', 'Divide by 1000. For example, 250 cm³ = 0.25 dm³.'],
      ['What is the concentration if 9 g of salt makes 300 cm³ of solution?', '300 cm³ = 0.3 dm³, so 9 ÷ 0.3 = 30 g/dm³.'],
    ],
    'C21-09': [
      ['How do you find the mass of solute from concentration and volume?', 'mass = concentration × volume, with concentration in g/dm³ and volume in dm³.'],
      ['What mass of solute is in 0.30 dm³ of a 50 g/dm³ solution?', '50 × 0.30 = 15 g.'],
    ],
  },
  recall: ['C21-04', 'C21-08', 'C21-12'],
}
