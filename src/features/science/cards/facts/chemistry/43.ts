import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-ANA-043-C',
  sections: {
    'C43-02': [
      ['What is an Rf value?', 'The ratio of the distance moved by a substance to the distance moved by the solvent.', 'Rf = distance moved by substance ÷ distance moved by solvent'],
      ['What does a bigger Rf value mean?', 'The substance moved further up the paper. An Rf value has no units and is never more than 1.'],
    ],
    'C43-05': [
      ['Where do you measure distances from?', 'Measure from the baseline: to the centre of the spot, and to the solvent front.'],
      ['How do you give an Rf value?', 'Divide, then round to 2 significant figures. For example 7.3 ÷ 9.6 = 0.7604… so Rf = 0.76.'],
    ],
    'C43-08': [
      ['How do you identify a substance in a mixture?', 'Run a pure reference sample beside the mixture. A spot with the same Rf value means the substance could be in the mixture.'],
      ['Why repeat with a different solvent?', 'Rf values change with the solvent. Matching again in a second solvent makes it likely the substances are the same.'],
    ],
  },
  recall: ['C43-03', 'C43-07', 'C43-09'],
}
