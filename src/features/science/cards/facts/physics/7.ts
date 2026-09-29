import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ENE-007-P',
  sections: {
    'P7-02': [
      ['What is the aim of the specific heat capacity practical?', 'To heat a block, measure how much its temperature rises, and use the results to find its specific heat capacity.'],
      ['Why is the block wrapped in insulation?', 'To reduce the energy transferred by heating to the surroundings, so more of the heater energy stays in the block.'],
      ['What should stay the same when comparing materials?', 'The mass, the heater power and the heating time.'],
    ],
    'P7-05': [
      ['What do you measure before switching on the heater?', 'The mass of the block and its starting temperature.'],
      ['What is the main safety point?', 'The heater and block get hot. Do not touch them, and let them cool before moving them.'],
    ],
    'P7-08': [
      ['How do you find the energy from the heater?', 'Energy = power × time (E = P × t), with the power in watts and the time in seconds.'],
      ['How do you find specific heat capacity from the results?', 'c = ΔE ÷ (m × Δθ). The unit is J/kg°C.', 'Δθ = final temperature − starting temperature.'],
    ],
  },
  recall: ['P7-03', 'P7-07', 'P7-11'],
}
