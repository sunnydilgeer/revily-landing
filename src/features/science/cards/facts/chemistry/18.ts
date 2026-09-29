import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-QNT-018-C',
  sections: {
    'C18-02': [
      ['What is the relative formula mass (Mᵣ) of a compound?', 'The sum of the relative atomic masses (Aᵣ) of all the atoms in its formula.'],
      ['How do you work out an Mᵣ?', 'Look up each Aᵣ, count the atoms of each element in the formula, then multiply each Aᵣ by its number of atoms and add.'],
      ['What is the Mᵣ of CO₂? (Aᵣ: C = 12, O = 16)', '12 + (2 × 16) = 44.', 'The small 2 belongs to the oxygen only, so carbon is counted once.'],
    ],
    'C18-06': [
      ['What does a small number after a bracket do, as in Mg(OH)₂?', 'It multiplies everything inside the bracket. Mg(OH)₂ has 1 Mg, 2 O and 2 H.'],
      ['What is the Mᵣ of Mg(OH)₂? (Aᵣ: Mg = 24, O = 16, H = 1)', 'One OH is 16 + 1 = 17, two are 2 × 17 = 34, so Mᵣ = 24 + 34 = 58.', 'Doubling only the hydrogen gives 42, which is wrong.'],
    ],
    'C18-09': [
      ['How do you work out the percentage mass of an element in a compound?', 'Multiply its Aᵣ by its number of atoms, divide by the Mᵣ of the compound, then multiply by 100.'],
      ['What is the percentage mass of magnesium in MgO? (Aᵣ: Mg = 24, O = 16)', 'Mᵣ = 40, so (24 × 1) ÷ 40 × 100 = 60%.'],
    ],
  },
  recall: ['C18-04', 'C18-05', 'C18-08'],
}
