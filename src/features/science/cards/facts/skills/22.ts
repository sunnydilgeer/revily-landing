import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'W-PRC-022-W',
  sections: {
    'W22-02': [
      ['Why use percentage change?', 'It lets you compare results that had different starting values.'],
      ['What is the equation for percentage change?', 'Percentage change = (final value − original value) ÷ original value × 100.', 'The original value is the one at the start.'],
    ],
    'W22-06': [
      ['What does a positive percentage change mean?', 'The value has increased.'],
      ['What does a negative percentage change mean?', 'The value has decreased. Keep the minus sign in your answer.'],
    ],
    'W22-10': [
      ['How do you compare two results with different starts?', 'Work out the percentage change for each, then compare the percentages.'],
      ['Does the bigger gain always have the bigger percentage change?', 'No. If it started with a large value, the same gain is a smaller percentage.'],
    ],
  },
  recall: ['W22-04', 'W22-05', 'W22-09'],
}
