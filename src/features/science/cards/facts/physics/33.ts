import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ATM-033-P',
  sections: {
    'P33-02': [
      ['What are atomic number and mass number?', 'Atomic number is the number of protons. Mass number is the number of protons plus the number of neutrons.'],
      ['How is an atom written in symbols?', 'Mass number at the top, atomic number at the bottom, then the element symbol, such as ¹⁶₈O.', 'In words this is oxygen-16.'],
    ],
    'P33-05': [
      ['How do you work out the number of neutrons?', 'Neutrons = mass number − atomic number.', 'Example: ¹⁶₈O has 16 − 8 = 8 neutrons.'],
    ],
    'P33-08': [
      ['What are isotopes?', 'Atoms of the same element with the same number of protons but different numbers of neutrons.', 'They have the same atomic number but different mass numbers.'],
      ['What happens to unstable isotopes?', 'They decay into other elements and give out radiation.'],
    ],
  },
  recall: ['P33-03', 'P33-04', 'P33-06'],
}
