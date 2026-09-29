import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-MOT-050-P',
  sections: {
    'P50-02': [
      ['What is stopping distance?', 'The total distance a vehicle travels to stop. Stopping distance = thinking distance + braking distance.'],
      ['What are thinking distance and braking distance?', 'Thinking distance is how far the car goes during the driver\'s reaction time. Braking distance is how far it goes once the brakes are applied.'],
    ],
    'P50-05': [
      ['What are typical stopping distances for a car?', 'About 23 m at 30 mph, 73 m at 60 mph and 96 m at 70 mph.', 'The heavier or faster the vehicle, the longer it takes to stop.'],
      ['Why does stopping distance affect safety?', 'The longer it is, the higher the risk of hitting what is in front. A shorter stopping distance is safer.'],
    ],
    'P50-08': [
      ['What affects thinking distance?', 'The speed of the vehicle and the driver\'s reaction time.'],
      ['What makes reaction time longer?', 'Tiredness, drugs, alcohol and distractions such as a phone. A longer reaction time means a longer thinking distance.'],
    ],
  },
  recall: ['P50-03', 'P50-06', 'P50-09'],
}
