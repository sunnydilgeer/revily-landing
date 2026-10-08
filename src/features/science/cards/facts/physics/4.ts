import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ENE-004-P',
  sections: {
    'P4-02': [
      ['What is the equation for gravitational potential energy?', 'g.p.e. = mass × gravitational field strength × height. In symbols, Ep = m × g × h.', 'Ep in joules (J), m in kg, g in N/kg, h in metres. On Earth, g = 9.8 N/kg.'],
      ['What does the g.p.e. of an object depend on?', 'Its mass, its height above the ground and the gravitational field strength.'],
    ],
    'P4-05': [
      ['How do you calculate g.p.e.?', 'Write Ep = m × g × h, put in the numbers, multiply step by step and give the answer in joules.', 'Example: 5 kg × 9.8 N/kg × 3 m = 147 J.'],
      ['What value of g do you use to calculate g.p.e.?', 'Take g as 9.8 N/kg. The mass must be in kg and the height in m to get an answer in J.'],
    ],
    'P4-08': [
      ['What happens to energy when an object falls with no air resistance?', 'Energy lost from the g.p.e. store = energy gained in the kinetic store.'],
      ['Which energy transfer happens as an object falls?', 'Energy is transferred mechanically from its g.p.e. store to its kinetic store. The object gets lower but moves faster.'],
    ],
    'P4-11': [
      ['What is the equation for elastic potential energy?', 'Ee = ½ × k × e². Ee in joules (J), k (spring constant) in N/m, e (extension) in metres.', 'Only works if the spring has not passed its limit of proportionality.'],
      ['What is extension?', 'How much longer a stretched spring is than its normal length.'],
    ],
  },
  recall: ['P4-04', 'P4-06', 'P4-12'],
}
