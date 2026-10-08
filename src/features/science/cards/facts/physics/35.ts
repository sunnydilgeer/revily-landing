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
      ['What does an alpha particle take away from a nucleus?', '2 protons and 2 neutrons. It is written ⁴₂He, and a new element is formed.', 'Check both rows balance: 210 = 206 + 4 and 84 = 82 + 2.'],
    ],
    'P35-08': [
      ['What does beta decay do to a nucleus?', 'A neutron turns into a proton. The atomic number goes up by 1 and the mass number stays the same.', 'Example: ¹⁴₆C → ¹⁴₇N + ⁰₋₁e.'],
      ['Why does the mass number stay the same in beta decay?', 'A neutron and a proton have about the same mass, so turning one into the other does not change the mass number. The beta particle is ⁰₋₁e.'],
    ],
    'P35-11': [
      ['What does gamma emission do to a nucleus?', 'It takes away extra energy only. The mass number and atomic number do not change.'],
      ['What kind of radiation is a gamma ray?', 'Electromagnetic radiation, not a particle. It takes away no protons or neutrons, so the nucleus is still the same element.', 'Gamma rays are sometimes released along with alpha or beta particles.'],
    ],
  },
  recall: ['P35-03', 'P35-06', 'P35-09'],
}
