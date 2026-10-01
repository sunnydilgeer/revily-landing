import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-MAG-064H-P',
  sections: {
    'P64H-02': [
      ['What is the motor effect?', 'A wire carrying a current in a magnetic field feels a force, which can make it move.'],
      ['When is the force on a wire in a magnetic field biggest?', 'When the wire is at 90° to the field.', 'Parallel to the field there is no force; at angles in between there is some.'],
      ['Which way does the force on the wire act?', 'At right angles to both the magnetic field and the current.'],
    ],
    'P64H-05': [
      ['What does each finger show in Fleming’s left-hand rule?', 'First finger: the Field (N to S). seCond finger: the Current. thuMb: the Motion (the force).'],
      ['What happens to the force if the current or the field is reversed?', 'The force reverses.'],
    ],
    'P64H-08': [
      ['What is magnetic flux density?', 'How many field lines there are in a region. It shows how strong the field is and is measured in tesla, T.'],
      ['What is the equation for the force on a wire at 90° to a magnetic field?', 'F = B I l: force (N) = magnetic flux density (T) × current (A) × length (m).', 'Change lengths in cm into m first.'],
    ],
    'P64H-13': [
      ['Why does the coil of a simple dc motor rotate?', 'The current flows opposite ways in the two sides, so the forces on them act in opposite directions.'],
      ['What does the split-ring commutator do?', 'It swaps the contacts every half turn, reversing the current in the coil so it keeps turning the same way.'],
      ['How can you make a dc motor spin faster?', 'Increase the current, add more turns to the coil or use a stronger magnetic field.', 'Reverse the current or swap the poles to make it turn the other way.'],
    ],
  },
  recall: ['P64H-03', 'P64H-06', 'P64H-14'],
}
