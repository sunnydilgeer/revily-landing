import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ELE-020-P',
  sections: {
    'P20-02': [
      ['What is a series circuit?', 'A circuit where the components are connected one after another in a single loop.'],
      ['What happens if you remove one component from a series circuit?', 'The circuit is broken, so all the components stop working.', 'Voltmeters are the exception: they are connected in parallel.'],
    ],
    'P20-05': [
      ['What are the rules for current and pd in a series circuit?', 'The current is the same everywhere: I₁ = I₂ = … The pd of the supply is shared: V total = V₁ + V₂ + …'],
      ['What is the rule for resistance in series?', 'The total resistance is the sum of the resistances: R total = R₁ + R₂ + …', 'Adding a resistor increases the total resistance, so the current goes down.'],
    ],
    'P20-09': [
      ['How do you find the current in a series circuit?', 'Add the resistances to find the total resistance, then use I = V ÷ R.'],
      ['What happens to the pd when cells are connected in series?', 'If they face the same way, the pds add up: two 1.5 V cells supply 3.0 V.'],
    ],
  },
  recall: ['P20-03', 'P20-08', 'P20-10'],
}
