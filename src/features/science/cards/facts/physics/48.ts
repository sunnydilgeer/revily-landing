import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-MOT-048-P',
  sections: {
    'P48-02': [
      ['What is Newton\'s Third Law?', 'When two objects interact, the forces they exert on each other are equal and opposite.'],
      ['Which objects do the two forces act on?', 'Different objects: one force on each. They do not cancel out.', 'Skaters pushing apart feel equal forces, but the one with less mass accelerates more.'],
    ],
    'P48-05': [
      ['What happens when you push a wall?', 'The wall pushes back on you with a normal contact force of the same size, in the opposite direction.'],
      ['If forces are equal and opposite, how can anything move?', 'The two forces act on different objects. To see how one object moves, look at the forces on that object.'],
    ],
    'P48-08': [
      ['Why is a book on a table not a Third Law pair?', 'Its weight and the table\'s normal contact force are different types of force and both act on the book.'],
      ['What is the real Third Law pair for a book on a table?', 'The table pushes up on the book and the book pushes down on the table. Same type, different objects.'],
    ],
  },
  recall: ['P48-03', 'P48-04', 'P48-10'],
}
