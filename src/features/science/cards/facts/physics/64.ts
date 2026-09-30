import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-MAG-064-P',
  sections: {
    'P64-02': [
      ['What field does a current in a wire create?', 'A magnetic field made of circles around the wire.'],
      ['What is the right-hand thumb rule?', 'Point your right thumb along the current and curl your fingers. Your fingers show the direction of the field.'],
      ['What happens if the current is reversed?', 'The magnetic field reverses direction.'],
    ],
    'P64-05': [
      ['How does distance from the wire affect the field?', 'The closer to the wire, the stronger the field.'],
      ['How does the current affect the field?', 'The larger the current, the stronger the field.'],
    ],
    'P64-08': [
      ['What is a solenoid?', 'A wire wrapped into a coil.'],
      ['What is the field of a solenoid like?', 'Outside it is like a bar magnet. Inside it is strong and uniform.', 'Uniform means the same strength and direction everywhere.'],
      ['What is an electromagnet?', 'A solenoid with an iron core. The iron makes the field even stronger.'],
    ],
  },
  recall: ['P64-03', 'P64-07', 'P64-10'],
}
