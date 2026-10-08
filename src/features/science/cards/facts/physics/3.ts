import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ENE-003-P',
  sections: {
    'P3-02': [
      ['What does kinetic energy depend on?', 'The mass and the speed of the object. More mass or more speed means more energy in the kinetic store.'],
      ['What happens to the kinetic store when an object speeds up or slows down?', 'Energy is transferred to the kinetic store when it speeds up, and away from it when it slows down.'],
    ],
    'P3-05': [
      ['What is the kinetic energy equation?', 'Kinetic energy = ½ × mass × speed squared. In symbols, Ek = ½ × m × v².', 'Ek in joules (J), m in kilograms (kg), v in metres per second (m/s).'],
      ['What do you do first in Ek = ½ × m × v²?', 'Square the speed. Only the speed is squared, not the mass.'],
    ],
    'P3-08': [
      ['How do you calculate kinetic energy?', 'Write the equation, put in the numbers, square the speed first, then multiply by the mass and by a half. Give the answer in joules.', 'Example: ½ × 0.5 kg × (4 m/s)² = 4 J.'],
      ['What units must you use in Ek = ½ × m × v²?', 'Mass in kg and speed in m/s. The answer is then in joules, J.'],
    ],
  },
  recall: ['P3-06', 'P3-07', 'P3-09'],
}
