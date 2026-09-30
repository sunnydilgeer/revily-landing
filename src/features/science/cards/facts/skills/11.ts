import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'W-DAT-011-W',
  sections: {
    'W11-02': [
      ['What can you conclude from data?', 'Only what the data shows, and no more.'],
      ['How do you justify a conclusion?', 'Back it up with the results, for example by quoting the difference between the means.'],
    ],
    'W11-05': [
      ['What should a conclusion say about the hypothesis?', 'Whether the data supports the hypothesis or not.'],
      ['Does supporting a hypothesis prove it?', 'No. The data supports it for the cases tested. It does not prove it for ever.'],
    ],
    'W11-07': [
      ['Does correlation mean cause?', 'No. A correlation does not always mean that a change in one variable causes the change in the other.'],
      ['What are the three reasons for a correlation?', 'Chance, a link through a third variable, or a real cause.'],
      ['When can you conclude a cause?', 'When all the other variables that could affect the result have been controlled.'],
    ],
  },
  recall: ['W11-03', 'W11-08', 'W11-10'],
}
