import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ATM-035-P',
  sections: {
    'P35-02': [
      ['What is the golden rule of nuclear equations?', 'The total mass numbers and the total atomic numbers must be equal on both sides of the arrow.'],
      ['How are alpha and beta particles written in nuclear equations?', 'Alpha is ⁴₂He. Beta is ⁰₋₁e.'],
    ],
    'P35-05': [
      ['What does alpha decay do to a nucleus?', 'The atomic number goes down by 2 and the mass number goes down by 4.', 'Example: ²¹⁰₈₄Po → ²⁰⁶₈₂Pb + ⁴₂He.'],
    ],
    'P35-08': [
      ['What does beta decay do to a nucleus?', 'A neutron turns into a proton. The atomic number goes up by 1 and the mass number stays the same.', 'Example: ¹⁴₆C → ¹⁴₇N + ⁰₋₁e.'],
    ],
    'P35-11': [
      ['What does gamma emission do to a nucleus?', 'It takes away extra energy only. The mass number and atomic number do not change.'],
    ],
  },
  recall: ['P35-03', 'P35-06', 'P35-09'],
}
