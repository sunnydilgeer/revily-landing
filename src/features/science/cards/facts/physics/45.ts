import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-MOT-045-P',
  sections: {
    'P45-02': [
      ['What do the parts of a distance-time graph mean?', 'Flat line: stationary. Straight sloping line: steady speed. Steeper line: faster.', 'The gradient of a distance-time graph is the speed.'],
      ['What goes on each axis of a distance-time graph?', 'Distance in metres goes up the vertical axis. Time in seconds goes along the horizontal axis.'],
    ],
    'P45-05': [
      ['What does a curve on a distance-time graph mean?', 'The speed is changing. A curve getting steeper means speeding up. A curve levelling off means slowing down.'],
      ['Why does a curved line on a distance-time graph mean the speed is changing?', 'The gradient is the speed, and the gradient keeps changing along a curve. So the object is accelerating or decelerating.'],
    ],
    'P45-08': [
      ['How do you find the speed from a distance-time graph?', 'Work out the gradient of a straight line: draw a large right-angled triangle, then divide the change in distance by the change in time.', 'Example: 12 m ÷ 6 s = 2 m/s.'],
      ['Why should you draw a large triangle to find a gradient?', 'A large triangle uses most of the line, so the numbers are easier to read accurately.', 'A small triangle makes it hard to read the numbers accurately.'],
    ],
    'P45-10': [
      ['How do you draw a distance-time graph for a journey?', 'Split the journey into stages and start at the origin. Draw a sloping line for moving, a flat line for stopped, and label both axes with units.', 'A faster stage is steeper.'],
      ['How do you check which stage of your graph should be steeper?', 'The stage that covers more distance each second is faster, so its line must be steeper.', '20 m in 10 s is steeper than 20 m in 20 s.'],
    ],
  },
  recall: ['P45-04', 'P45-06', 'P45-09', 'P45-11'],
}
