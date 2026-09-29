import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-RAT-032-C',
  sections: {
    'C32-02': [
      ['Name the four factors that affect the rate of a reaction.', 'Temperature, concentration (or pressure), surface area of a solid, and a catalyst.'],
      ['Why does a higher temperature increase the rate?', 'Particles move faster, so they collide more often, and more collisions have enough energy.'],
    ],
    'C32-05': [
      ['Why does a higher concentration increase the rate?', 'More particles in the same volume, so collisions are more frequent.'],
      ['Why does a higher gas pressure increase the rate?', 'The same number of particles take up a smaller space, so collisions are more frequent.'],
    ],
    'C32-08': [
      ['Why does breaking a solid into smaller pieces increase the rate?', 'It increases the surface area to volume ratio, so more particles are exposed and collisions are more frequent.'],
    ],
    'C32-11': [
      ['What is a catalyst?', 'A substance that speeds up a reaction and is not used up.', 'It is not part of the equation.'],
      ['How does a catalyst work?', 'It provides a different pathway with a lower activation energy.'],
      ['What are enzymes?', 'Biological catalysts: they speed up reactions in living things.'],
    ],
  },
  recall: ['C32-03', 'C32-10', 'C32-13'],
}
