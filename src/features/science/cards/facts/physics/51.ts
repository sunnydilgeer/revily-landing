import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-MOT-051-P',
  sections: {
    'P51-02': [
      ['What factors change braking distance?', 'The speed of the car, the weather or road surface, the condition of the tyres and the condition of the brakes.'],
      ['Why do wet or icy roads make braking distance longer?', 'Water, ice, oil or leaves reduce grip, so the car is more likely to skid and takes longer to stop.', 'Bald tyres cannot clear water, so they skid on top of it.'],
    ],
    'P51-05': [
      ['What happens to energy when a car brakes?', 'Friction between the brake pads and the wheels does work. Energy is transferred from the kinetic energy store of the car to the thermal energy stores of the brakes.'],
      ['Why do brakes get hot?', 'The brakes must transfer all of the car\'s kinetic energy, so their temperature increases.'],
    ],
    'P51-08': [
      ['Why does a faster car need more force to stop in the same distance?', 'It has much more kinetic energy, so much more work must be done. Work = force × distance, so the force must be bigger.'],
      ['Why are very large decelerations dangerous?', 'The brakes may overheat and stop working as well, and the car may skid.'],
    ],
  },
  recall: ['P51-03', 'P51-06', 'P51-09', 'P51-10'],
}
