import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ELE-021-P',
  sections: {
    'P21-02': [
      ['What is a branch?', 'In a parallel circuit, each component is on its own loop, called a branch. Each branch is connected separately to the supply.'],
      ['What happens if you remove one branch?', 'The components on the other branches carry on working, so parallel components can be switched on and off without affecting each other.'],
    ],
    'P21-05': [
      ['What is the pd across each branch of a parallel circuit?', 'It is the same on every branch and equals the pd of the cell or battery: V₁ = V₂ = V total.'],
      ['How do the currents in a parallel circuit add up?', 'The total current is the sum of the currents in the branches: I total = I₁ + I₂ + …', 'Identical components in parallel carry the same current.'],
    ],
    'P21-08': [
      ['What does adding a resistor in parallel do to the total resistance?', 'It reduces it. The pd stays the same, the total current increases, and R = V ÷ I gives a smaller value.'],
      ['How does the total resistance in parallel compare with one resistor?', 'It is less than the resistance of any one of the individual resistors.', 'In series the resistances add up instead.'],
    ],
  },
  recall: ['P21-04', 'P21-07', 'P21-10'],
}
