import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'W-DAT-005-W',
  sections: {
    'W5-02': [
      ['What is sample size?', 'The number of observations or measurements you make in an investigation.'],
      ['Why is a bigger sample better?', 'It reduces the chance that a few odd results change your conclusion.', 'It must still be realistic to collect.'],
      ['What is a representative sample?', 'A sample that includes a range of people or things, like the whole population.'],
    ],
    'W5-05': [
      ['What are precise results?', 'Results that are close together, not spread out.'],
      ['What are accurate results?', 'Results that are close to the true value.', 'Results can be precise without being accurate.'],
      ['How can you make measurements more accurate?', 'Choose a better method, set the equipment up properly and use equipment that is sensitive enough.', 'A gas syringe is better than counting bubbles.'],
    ],
    'W5-09': [
      ['What is a systematic error?', 'A mistake that makes every measurement wrong by the same amount.'],
      ['What is a random error?', 'A small mistake that changes from one reading to the next, so repeat readings vary.', 'Repeat readings and find the mean to reduce it.'],
      ['What is an anomalous result?', 'A result that does not fit with the rest. Find its cause, then ignore it when processing.'],
    ],
  },
  recall: ['W5-03', 'W5-06', 'W5-11'],
}
