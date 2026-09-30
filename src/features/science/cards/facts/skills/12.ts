import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'W-DAT-012-W',
  sections: {
    'W12-02': [
      ['What is uncertainty?', 'The amount of error your measurements might have.', 'It comes from random errors and the limits of the equipment.'],
      ['How do you work out the uncertainty of a mean?', 'uncertainty = range ÷ 2. The range is the largest value minus the smallest value.'],
      ['How is uncertainty written?', 'With the ± symbol, for example 4.2 ± 0.2 s.'],
    ],
    'W12-05': [
      ['What is the difference between accurate and precise?', 'Accurate results are close to the true value. Precise results are close together.'],
      ['What should you say about anomalous results?', 'Say whether there were any. If there were, try to explain them, for example by an error in measuring.'],
    ],
    'W12-08': [
      ['What does an evaluation comment on?', 'The method (was it valid and fair?), the quality of the results, anomalous results and the uncertainty.'],
      ['How can measurements be improved?', 'Repeat readings, and take readings at narrower intervals near the result you are interested in.'],
    ],
  },
  recall: ['W12-03', 'W12-06', 'W12-09'],
}
