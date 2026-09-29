import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-PRT-030-P',
  sections: {
    'P30-02': [
      ['What is latent heat?', 'The energy transferred during a change of state. It is gained when a substance is heated and released when it is cooled.'],
      ['Why does the temperature stay the same during a change of state?', 'The energy is all used to break bonds between the particles (or is released as bonds form), so it does not change the temperature.'],
    ],
    'P30-05': [
      ['What do the flat parts of a heating graph show?', 'A change of state, such as melting at the melting point or boiling at the boiling point. The temperature does not change.'],
      ['What do the sloping parts show?', 'The temperature is rising (or falling on a cooling graph) while the substance stays in one state.'],
    ],
    'P30-08': [
      ['What is specific latent heat?', 'The amount of energy needed to change the state of 1 kg of a material without changing its temperature.'],
      ['What are the two kinds?', 'Fusion: between a solid and a liquid (melting or freezing). Vaporisation: between a liquid and a gas (boiling or condensing).', 'Not the same as specific heat capacity, which is about temperature changes.'],
    ],
    'P30-11': [
      ['What is the equation for latent heat?', 'Energy (J) = mass (kg) × specific latent heat (J/kg), or E = mL.'],
      ['What if the mass is in grams?', 'Divide by 1000 to get kilograms first. For example 250 g = 0.25 kg.'],
    ],
  },
  recall: ['P30-03', 'P30-06', 'P30-09', 'P30-12'],
}
