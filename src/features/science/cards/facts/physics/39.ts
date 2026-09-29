import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-FOR-039-P',
  sections: {
    'P39-02': [
      ['What is mass?', 'The amount of matter in an object, measured in kilograms. It is the same everywhere.', 'Weight is a force, measured in newtons, and it changes with the strength of gravity.'],
      ['What is weight?', 'The force on an object due to gravity, acting from its centre of mass. Measured in newtons with a newtonmeter.'],
    ],
    'P39-05': [
      ['What is the weight equation?', 'weight = mass × gravitational field strength, or W = mg. Weight in N, mass in kg, g in N/kg.', 'On Earth g is about 9.8 N/kg. On the Moon it is about 1.6 N/kg.'],
      ['What is the weight of 20 kg on Earth?', '20 × 9.8 = 196 N.'],
    ],
    'P39-08': [
      ['How do you find mass from weight?', 'Rearrange W = mg to m = W ÷ g. For example 490 N ÷ 9.8 N/kg = 50 kg.'],
      ['How are weight and mass linked?', 'They are directly proportional (W ∝ m) in the same gravitational field. Double the mass, double the weight.'],
    ],
  },
  recall: ['P39-03', 'P39-04', 'P39-07', 'P39-10'],
}
