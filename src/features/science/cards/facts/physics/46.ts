import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-MOT-046-P',
  sections: {
    'P46-02': [
      ['What do the lines on a velocity-time graph mean?', 'Straight up: constant acceleration. Flat: steady speed. Straight down: deceleration. A curve: the acceleration is changing.'],
      ['What is on the axes of a velocity-time graph?', 'Time in seconds goes along the bottom and velocity in metres per second goes up the side.'],
    ],
    'P46-05': [
      ['What does the gradient of a velocity-time graph tell you?', 'The gradient is the acceleration. A steeper line means a bigger acceleration.'],
      ['How do you find a gradient?', 'Draw a large right-angled triangle on the line. Gradient = change in velocity ÷ change in time. For example 12 ÷ 4 = 3 m/s².'],
    ],
    'P46-07': [
      ['What is drag?', 'Drag is the force from a fluid, a gas or a liquid, on an object moving through it. In air it is called air resistance.', 'Drag always acts against the movement.'],
      ['How does speed affect drag?', 'The faster an object moves through a fluid, the more drag it feels.'],
    ],
    'P46-09': [
      ['Why does a falling skydiver stop accelerating?', 'Her speed increases, so the drag increases until it equals her weight. The resultant force is then zero.'],
      ['What is terminal velocity?', 'The constant speed reached when the drag on a falling object equals its weight.', 'On a velocity-time graph the curve levels off.'],
    ],
  },
  recall: ['P46-03', 'P46-08', 'P46-10'],
}
