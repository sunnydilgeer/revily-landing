import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-RES-054-C',
  sections: {
    'C54-02': [
      ['What are three properties of pure water?', 'It boils at 100 °C, has a pH of 7 and contains no dissolved solids.'],
    ],
    'C54-05': [
      ['How do you test water for dissolved solids?', 'Weigh a dry evaporating basin, evaporate a known volume of the sample until dry, cool it and weigh again. An increase in mass means dissolved solids were present.', 'Change in mass = second mass − first mass.'],
    ],
    'C54-08': [
      ['How can you measure the pH of water?', 'With a pH probe and meter, or with universal indicator paper or solution.'],
      ['How does the boiling point show purity?', 'Pure water boils at exactly 100 °C. If the sample boils at a different temperature, it is not pure.'],
    ],
    'C54-11': [
      ['How is water distilled?', 'Heat the sample in a flask until it boils, cool the steam in a condenser and collect the pure water in a beaker.', 'The dissolved solids stay behind in the flask.'],
    ],
  },
  recall: ['C54-03', 'C54-04', 'C54-12'],
}
