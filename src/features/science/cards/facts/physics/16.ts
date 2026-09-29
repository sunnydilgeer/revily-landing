import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ELE-016-P',
  sections: {
    'P16-02': [
      ['What is the equation linking pd, current and resistance?', 'Potential difference = current × resistance, or V = IR.', 'V in volts, I in amperes, R in ohms.'],
      ['What happens to the current if the resistance goes up?', 'It goes down, for the same potential difference.'],
    ],
    'P16-05': [
      ['How do you find the current from V and R?', 'Divide the potential difference by the resistance: I = V ÷ R.'],
      ['How do you use V = IR in a calculation?', 'Write the equation, substitute the numbers, work out the answer and give the unit.'],
    ],
    'P16-08': [
      ['What is an ohmic conductor?', 'A component with a constant resistance at a fixed temperature, such as a wire or a resistor. Its current is directly proportional to its pd.'],
      ['Why does a filament lamp not have a constant resistance?', 'Its filament heats up as the current increases, and a hotter wire has more resistance.', 'A diode also changes: its resistance is very high in the reverse direction.'],
    ],
  },
  recall: ['P16-04', 'P16-07', 'P16-10'],
}
