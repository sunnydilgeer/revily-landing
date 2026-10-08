import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'W-DAT-008-W',
  sections: {
    'W8-02': [
      ['What does the gradient of a graph tell you?', 'How quickly the dependent variable changes as the independent variable changes.'],
      ['What is the formula for gradient?', 'Gradient = change in y ÷ change in x.', 'For a rate, time must be on the x-axis.'],
      ['What is the unit of a gradient?', 'The unit of y divided by the unit of x, such as cm³/s.'],
    ],
    'W8-05': [
      ['How do you find a gradient from a straight line?', 'Pick two points far apart, draw a triangle, read the change in y and the change in x, then divide.'],
      ['How do you find the unit of a gradient?', 'Divide the unit on the y-axis by the unit on the x-axis.', '12 cm³ ÷ 20 s = 0.6 cm³/s.'],
    ],
    'W8-08': [
      ['What is positive correlation?', 'One variable increases as the other increases.'],
      ['What is negative correlation?', 'One variable increases as the other decreases.'],
      ['What is no correlation?', 'The points show no pattern, so there is no relationship.', 'Correlation alone does not prove one variable causes the other.'],
    ],
  },
  recall: ['W8-04', 'W8-07', 'W8-09'],
}
