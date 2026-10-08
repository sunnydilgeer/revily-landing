import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-MOT-043-P',
  sections: {
    'P43-02': [
      ['What is the difference between distance and displacement?', 'Distance is how far an object has moved along its path (a scalar). Displacement is the straight-line distance from start to finish with its direction (a vector).', 'Walk 6 m east then 6 m west: distance 12 m, displacement 0 m.'],
      ['What is the difference between a scalar and a vector?', 'A scalar has size only, like distance. A vector has size and direction, like displacement.', 'Example: 5 m east is a displacement.'],
    ],
    'P43-05': [
      ['What is the difference between speed and velocity?', 'Speed is how fast something moves (a scalar). Velocity is speed in a given direction (a vector).', 'Two cars at 20 m/s going opposite ways have the same speed but different velocities.'],
      ['What is average speed?', 'The speed over a whole journey. Real objects rarely move at a steady speed.'],
    ],
    'P43-07': [
      ['What is the equation linking distance, speed and time?', 'distance = speed × time, or s = v × t. s in m, v in m/s, t in s.', 'Example: 6 m/s × 20 s = 120 m.'],
      ['What does the s stand for in s = v × t?', 's means the distance travelled, not the speed. v is the speed.', 'A common mistake is to read s as speed.'],
    ],
    'P43-09': [
      ['How do you find speed from distance and time?', 'v = s ÷ t. Divide the distance by the time.', 'Example: 300 m ÷ 12 s = 25 m/s.'],
      ['How do you rearrange s = v × t to find speed?', 'Divide both sides by t to get v = s ÷ t. Metres divided by seconds gives metres per second.'],
    ],
    'P43-11': [
      ['What are the typical speeds to remember?', 'Walking 1.5 m/s, running 3 m/s, cycling 6 m/s, car 25 m/s, train 30 m/s, plane 250 m/s. Sound in air is about 330 m/s.'],
      ['What affects how fast a person can walk, run or cycle?', 'Fitness, age, the distance travelled and the terrain (type of ground).'],
    ],
  },
  recall: ['P43-04', 'P43-08', 'P43-10', 'P43-12'],
}
