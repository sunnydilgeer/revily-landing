import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-RAT-035-C',
  sections: {
    'C35-02': [
      ['Which axes do you use for a rate graph?', 'Time goes on the x-axis and the amount of product (such as the volume of gas) on the y-axis, both labelled with units.'],
      ['What line do you draw on a rate graph?', 'A line of best fit: one smooth curve close to the crosses, or two straight lines (sloping part and flat part). Do not join the dots one by one.'],
    ],
    'C35-05': [
      ['What does a steep line on a rate graph mean?', 'The reaction is fast, because a lot of product is made every second.'],
      ['How can you tell from a graph that a reaction has finished?', 'The line goes flat, because no more product is being made.', 'The finish time is where the line first goes flat.'],
    ],
    'C35-07': [
      ['What is the formula for the mean rate of a reaction?', 'Mean rate = amount of product formed (or reactant used up) ÷ time.'],
      ['What are two units for the rate of a reaction?', 'g/s for a mass in grams, and cm³/s for a volume of gas.'],
    ],
    'C35-10': [
      ['How do you find the mean rate for the whole reaction from a graph?', 'Find when the line goes flat, read the amount made by then, and divide the amount by that time.', 'Example: 30 cm³ ÷ 50 s = 0.60 cm³/s.'],
      ['How do you find the mean rate between two times on a graph?', 'Read the amount at each time, subtract to get the amount made in between, and divide by the time in between.', 'Example: (29 − 22) ÷ (40 − 20) = 0.35 cm³/s.'],
    ],
  },
  recall: ['C35-04', 'C35-09', 'C35-12'],
}
