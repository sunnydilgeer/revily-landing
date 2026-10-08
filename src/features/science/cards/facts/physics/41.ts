import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-FOR-041-P',
  sections: {
    'P41-02': [
      ['How many forces are needed to change the shape of an object?', 'More than one. One force on its own just makes the object move.'],
      ['What is the difference between elastic and inelastic deformation?', 'An elastically deformed object returns to its original shape and length when the forces are removed. An inelastically deformed object does not.', 'A spring is elastic. Plasticine is inelastic.'],
    ],
    'P41-05': [
      ['What is the equation linking force, spring constant and extension?', 'Force = spring constant × extension, or F = ke. F in N, k in N/m, e in metres.'],
      ['What is extension?', 'How much longer a spring is than its natural length.', 'When compressed, e is how much shorter it is than its natural length.'],
    ],
    'P41-07': [
      ['How do you find the force needed to stretch a spring?', 'Write F = k × e, put the numbers in and multiply.', 'Example: 30 N/m × 0.2 m = 6 N.'],
      ['What units go into F = k × e?', 'Spring constant k in N/m and extension e in metres give the force F in newtons, N.', 'Always write the unit N at the end.'],
    ],
    'P41-09': [
      ['How do you find a spring constant?', 'Use k = F ÷ e. Change centimetres to metres first (divide by 100).', 'Example: 10 N ÷ 0.05 m = 200 N/m.'],
      ['How do you rearrange F = k × e to find k?', 'Divide both sides by e to get k = F ÷ e.'],
    ],
    'P41-11': [
      ['What is the limit of proportionality?', 'The point where a force-extension graph starts to bend. Past it, force and extension are no longer directly proportional and F = ke is no longer true.'],
      ['What does the straight part of a force-extension graph tell you?', 'Force and extension are directly proportional. Its steepness is the spring constant.'],
    ],
  },
  recall: ['P41-04', 'P41-08', 'P41-10', 'P41-12'],
}
