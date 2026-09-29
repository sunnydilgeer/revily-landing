import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-MOT-047-P',
  sections: {
    'P47-02': [
      ['What is Newton\'s First Law?', 'If the resultant force on an object is zero, a stationary object stays stationary and a moving object keeps moving at the same velocity.'],
      ['What are the five changes in motion?', 'A resultant force can make an object start, stop, speed up, slow down or change direction.', 'The velocity only changes if the resultant force is not zero.'],
    ],
    'P47-05': [
      ['What is Newton\'s Second Law?', 'The acceleration of an object is directly proportional to the resultant force on it, and inversely related to its mass: more mass means less acceleration for the same force.'],
      ['What is the equation for Newton\'s Second Law?', 'Resultant force = mass × acceleration, F = ma. Force is in N, mass in kg and acceleration in m/s².'],
    ],
    'P47-08': [
      ['How do you estimate the force on a car?', 'Estimate its acceleration (change in velocity ÷ time) and its mass, then use F = ma. For example 1000 kg × 2 m/s² = 2000 N.'],
      ['What does the sign ≈ mean?', 'It means "is about". Estimates use sensible round numbers.'],
    ],
  },
  recall: ['P47-03', 'P47-06', 'P47-10'],
}
