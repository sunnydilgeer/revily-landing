import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-NRG-030-C',
  sections: {
    'C30-02': [
      ['What is activation energy?', 'The minimum energy the reactants need to react when they collide.', 'On a profile it is the rise from the reactants to the top of the peak.'],
      ['What does a greater activation energy mean?', 'More energy is needed to start the reaction, for example by heating.'],
    ],
    'C30-05': [
      ['How can you tell an exothermic reaction from its profile?', 'The products are lower than the reactants.', 'The drop in height is the energy given out.'],
      ['Why does an exothermic mixture get warmer if the chemicals lose energy?', 'The energy passes from the chemicals to the surroundings.'],
    ],
    'C30-08': [
      ['How can you tell an endothermic reaction from its profile?', 'The products are higher than the reactants.', 'The rise in height is the energy taken in.'],
      ['What do exothermic and endothermic profiles have in common?', 'Both start with a rise, which is the activation energy.'],
    ],
  },
  recall: ['C30-03', 'C30-06', 'C30-09'],
}
