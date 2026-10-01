import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-MOT-052H-P',
  sections: {
    'P52H-02': [
      ['What is momentum, and what is its unit?', 'Momentum = mass × velocity (p = m v). It is measured in kg m/s.', 'Anything not moving has zero momentum, however big its mass.'],
      ['Why is momentum a vector?', 'It has a size and a direction, because velocity has a direction. Choose one direction as positive; the opposite direction is negative.'],
    ],
    'P52H-05': [
      ['How do you find velocity from momentum?', 'Rearrange p = m v to v = p ÷ m. For example, 600 kg m/s ÷ 200 kg = 3 m/s.'],
      ['How do you find mass from momentum?', 'Rearrange p = m v to m = p ÷ v. For example, 240 kg m/s ÷ 4 m/s = 60 kg.'],
    ],
    'P52H-10': [
      ['What is conservation of momentum?', 'In a closed system, the total momentum before an event (such as a collision) equals the total momentum after it.', 'A closed system has no outside forces acting on it.'],
      ['Two objects collide and stick together. How do you find their velocity?', 'Work out the total momentum before. Divide it by the total mass of the joined objects. More mass moving means a smaller velocity.'],
    ],
    'P52H-13': [
      ['Why do the parts of an explosion move in opposite directions?', 'The momentum before is zero, so the total after must be zero too. The parts have momentum of equal size in opposite directions, which cancel out.'],
      ['What is recoil?', 'Moving backwards when you push something forwards, like a skater throwing a ball. The heavier part moves off more slowly.'],
    ],
  },
  recall: ['P52H-03', 'P52H-07', 'P52H-11'],
}
