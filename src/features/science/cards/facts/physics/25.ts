import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ELE-025-P',
  sections: {
    'P25-02': [
      ['What does potential difference tell you about energy?', 'It is the energy transferred for each coulomb of charge that passes. A larger pd transfers more energy.'],
      ['What is the equation linking energy, charge and pd?', 'Energy transferred (J) = charge flow (C) × potential difference (V), or E = Q × V.'],
    ],
    'P25-05': [
      ['How can you find power from current and pd?', 'Power (W) = potential difference (V) × current (A), or P = V × I.'],
      ['What happens to power if the pd or current goes up?', 'The power goes up too, because P = V × I.'],
    ],
    'P25-08': [
      ['Which equation gives power from current and resistance?', 'Power (W) = current² (A²) × resistance (Ω), or P = I² × R.', 'Use it when you do not know the pd.'],
      ['What does current squared mean?', 'The current multiplied by itself. Square first, then multiply by the resistance.'],
    ],
  },
  recall: ['P25-03', 'P25-06', 'P25-10'],
}
