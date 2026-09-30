import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-WAV-060-P',
  sections: {
    'P60-02': [
      ['What two things affect how much infrared radiation an object emits?', 'Its temperature and its surface (how rough or shiny it is, and its colour).'],
      ['What is a Leslie cube?', 'A hollow metal cube filled with hot water. Its four side faces have different surfaces.'],
    ],
    'P60-05': [
      ['How do you use a Leslie cube to compare surfaces?', 'Fill it with boiling water, then hold an infrared detector 10 cm from each face and record the reading.'],
      ['What is the main hazard in this practical?', 'Boiling water. Do not move the cube just after filling it, and carry the full kettle with care.'],
    ],
    'P60-08': [
      ['Which surface emits the most infrared radiation?', 'A matt black surface. Shiny metal emits the least.', 'The highest detector reading means the most emitted.'],
      ['How do matt and shiny surfaces compare?', 'Matt surfaces emit more infrared radiation than shiny ones.'],
    ],
  },
  recall: ['P60-03', 'P60-07', 'P60-09'],
}
