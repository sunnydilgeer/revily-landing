import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-ATM-001-C',
  sections: {
    'C1-02': [
      ['What is inside an atom?', 'A tiny nucleus in the middle, made of protons and neutrons. Electrons move around the nucleus in shells.'],
      ['How big is an atom, and how big is its nucleus?', 'An atom has a radius of about 0.1 nm (1 × 10⁻¹⁰ m). The nucleus has a radius of about 1 × 10⁻¹⁴ m, about 1/10 000 of the atom.'],
      ['Where is almost all the mass of an atom?', 'In the nucleus. Electrons have almost no mass.', 'The nucleus is tiny, but it is where the mass is.'],
    ],
    'C1-05': [
      ['What are the relative charges of a proton, a neutron and an electron?', 'Proton +1, neutron 0, electron −1.'],
      ['What are the relative masses of a proton, a neutron and an electron?', 'Proton 1, neutron 1, electron very small.'],
      ['Why does an atom have no overall charge?', 'It has the same number of electrons as protons, so the negative and positive charges cancel.', 'Neutrons have no charge, so they do not cancel anything.'],
    ],
    'C1-08': [
      ['What do the atomic number and the mass number tell you?', 'Atomic number = number of protons. Mass number = number of protons + neutrons.'],
      ['How do you work out the number of neutrons in an atom?', 'Neutrons = mass number − atomic number.'],
      ['What is an ion?', 'An atom that has lost or gained electrons, so it has an overall charge. A positive ion has electrons = atomic number − charge.'],
    ],
    'C1-11': [
      ['What is an element?', 'A substance made of atoms that all have the same number of protons. There are about 100 elements.'],
      ['How is a chemical symbol written?', 'One or two letters. The first is a capital and a second letter is small, for example Mg for magnesium.'],
      ['What are isotopes?', 'Atoms of the same element with different numbers of neutrons. They have the same atomic number but different mass numbers.', 'Isotopes have the same number of protons, so they are the same element.'],
    ],
    'C1-14': [
      ['What is relative atomic mass (Aᵣ)?', 'An average mass for an element that takes account of how common each of its isotopes is.'],
      ['How do you work out a relative atomic mass?', 'Multiply each mass number by its abundance, add the answers, then divide by the total abundance (100 for percentages).'],
    ],
  },
  recall: ['C1-03', 'C1-07', 'C1-12', 'C1-13'],
}
