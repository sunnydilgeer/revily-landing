import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'W-DAT-006-W',
  sections: {
    'W6-02': [
      ['How should you draw a results table?', 'Use a ruler, give every column a heading, and put the unit in the heading.'],
      ['How do you set out repeats?', 'Give each repeat its own column, and add a column for the mean.'],
    ],
    'W6-04': [
      ['How do you find the mean?', 'Add up all the values, then divide by how many values there are.', 'Leave out any anomalous result first.'],
      ['What is the median?', 'The middle value when the results are in order. With two middle values, go halfway between them.'],
      ['What are the mode and the range?', 'The mode is the most common value. The range is the largest value minus the smallest value.'],
    ],
    'W6-08': [
      ['How do you count significant figures?', 'The first is the first digit that is not zero. The digits straight after it also count.', '0.0406 has three significant figures.'],
      ['How many significant figures should an answer have?', 'The lowest number of significant figures in the values you were given.'],
      ['When do you round in a multi-step calculation?', 'Only at the end, on the final answer.'],
    ],
  },
  recall: ['W6-03', 'W6-06', 'W6-11'],
}
