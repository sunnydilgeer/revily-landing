import type { TeachingFrame } from '../../teachingFrame'

// The modern nuclear model: parts and charges, no overall charge, sizes, energy levels, electrons moving, ions.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const atomStructureFrames: Record<string, TeachingFrame[]> = {
  'P32-02': [
    f('Nucleus and electrons', 'An atom has a tiny nucleus in the centre, with electrons around it.', 'nucleus in the middle, electrons around', 'In the nuclear model, an atom has a nucleus in the centre. The electrons orbit the nucleus. The nucleus is made of protons and neutrons.', 'nucatom-model'),
    f('Three particles, three charges', 'Protons are +1, neutrons are 0 and electrons are −1.', 'positive, neutral, negative', 'Each particle has a relative charge. A proton has a charge of +1. A neutron has no charge, so its charge is 0. An electron has a charge of −1. So the nucleus, with its protons, has an overall positive charge.', 'nucatom-charges'),
    f('Atoms have no overall charge', 'The number of protons equals the number of electrons, so the charges cancel.', 'plus one cancels minus one', 'An atom has the same number of protons and electrons. Each proton is +1 and each electron is −1. So the charges cancel out. That means an atom has no overall charge.', 'nucatom-neutral'),
  ],
  'P32-05': [
    f('How big is an atom?', 'An atom has a radius of about 1 × 10⁻¹⁰ m.', 'incredibly small', 'Atoms are very small. The radius of an atom is about 1 × 10⁻¹⁰ metres. That is a way of writing 0.0000000001 m. You could not see an atom, even with a strong light microscope.', 'nucatom-size'),
    f('The nucleus is much smaller', 'The radius of the nucleus is over 10 000 times smaller than the radius of the atom.', 'a pea in a stadium', 'The nucleus is much smaller than the atom. Its radius is over 10 000 times smaller. If an atom were as big as a stadium, the nucleus would be about the size of a pea in the middle.', 'nucatom-nucleus-size'),
    f('Small but heavy', 'The nucleus is tiny, but it holds most of the mass of the atom.', 'tiny yet nearly all the mass', 'The nucleus takes up almost none of the space in an atom. Yet it makes up most of the mass. Protons and neutrons are much heavier than electrons. Most of the atom is empty space.', 'nucatom-mass'),
  ],
  'P32-08': [
    f('Energy levels', 'Electrons orbit at different distances from the nucleus, called energy levels.', 'further out, more energy', 'Electrons orbit the nucleus at different distances. These distances are called energy levels. The further an energy level is from the nucleus, the more energy an electron in it has.', 'nucatom-levels'),
    f('Moving up a level', 'An electron moves to a higher energy level when it absorbs electromagnetic radiation.', 'absorb, then move up', 'An electron can move to a higher energy level. To do this it absorbs electromagnetic radiation, or EM radiation. Light is one kind of EM radiation. The electron takes in the energy and moves further from the nucleus.', 'nucatom-up'),
    f('Moving down a level', 'An electron moves to a lower energy level when it releases electromagnetic radiation.', 'release, then move down', 'An electron can also move to a lower energy level. To do this it releases EM radiation. The energy goes out as radiation, and the electron moves closer to the nucleus.', 'nucatom-down'),
    f('Losing an electron makes an ion', 'An electron in an outer level can leave the atom, which then becomes a positive ion.', 'lose an electron, become positive', 'If an outer electron absorbs enough EM radiation, it can leave the atom altogether. The atom now has one more proton than electrons. So it has an overall positive charge. A charged atom like this is called an ion.', 'nucatom-ion'),
  ],
}
