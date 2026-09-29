import type { TeachingFrame } from '../../teachingFrame'

// Atomic number, mass number, nuclide notation, counting neutrons (worked example), isotopes, unstable isotopes in one clause.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const isotopeFrames: Record<string, TeachingFrame[]> = {
  'P33-02': [
    f('Atomic number', 'The atomic number is the number of protons in an atom.', 'protons name the element', 'All atoms of one element have the same number of protons. The number of protons in an atom is called its atomic number. So the atomic number tells you which element it is.', 'isotope-atomic'),
    f('Mass number', 'The mass number is the number of protons plus the number of neutrons.', 'protons plus neutrons', 'The mass number counts all the particles in the nucleus. Mass number = number of protons + number of neutrons. Electrons are not counted, because they have almost no mass.', 'isotope-mass'),
    f('Writing an atom with symbols', 'An atom is written with its mass number at the top and its atomic number at the bottom.', 'top is mass, bottom is atomic', 'We show both numbers next to the element symbol. For oxygen we write ¹⁶₈O. The mass number 16 is at the top. The atomic number 8 is at the bottom. In words, this atom is called oxygen-16.', 'isotope-notation'),
  ],
  'P33-05': [
    f('The method', 'Neutrons = mass number − atomic number.', 'take away the protons', 'The mass number is protons plus neutrons. So to find the neutrons, take the atomic number away from the mass number. Neutrons = mass number − atomic number.', 'isotope-work-1'),
    f('Worked example: oxygen-16', 'For ¹⁶₈O: protons 8, neutrons 16 − 8 = 8.', 'write, subtract, check', 'Look at ¹⁶₈O. The atomic number is 8, so there are 8 protons. The mass number is 16. So neutrons = 16 − 8 = 8. This oxygen atom has 8 protons and 8 neutrons.', 'isotope-work-2'),
    f('Electrons in a neutral atom', 'An atom with no overall charge has as many electrons as protons.', 'electrons match protons', 'An atom has no overall charge. So it has the same number of electrons as protons. Oxygen-16 has 8 protons, so it also has 8 electrons. That gives 8 protons, 8 neutrons and 8 electrons.', 'isotope-work-3'),
  ],
  'P33-08': [
    f('Same protons, different neutrons', 'Isotopes are atoms of the same element with different numbers of neutrons.', 'same element, different mass', 'Isotopes of an element have the same number of protons but different numbers of neutrons. So they have the same atomic number but different mass numbers.', 'isotope-def'),
    f('Carbon-12 and carbon-14', 'Both have 6 protons. Carbon-12 has 6 neutrons and carbon-14 has 8.', 'compare the two nuclei', 'Carbon-12 and carbon-14 are isotopes of carbon. Both have 6 protons, so both are carbon. Carbon-12 has 12 − 6 = 6 neutrons. Carbon-14 has 14 − 6 = 8 neutrons.', 'isotope-carbon'),
    f('Some isotopes are unstable', 'Unstable isotopes decay and give out radiation.', 'unstable means radioactive', 'Some isotopes are unstable. Their nuclei tend to decay into other elements and give out radiation. You will learn about the types of radiation soon. Carbon-14 is one unstable isotope.', 'isotope-unstable'),
  ],
}
