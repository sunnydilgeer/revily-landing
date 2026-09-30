import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'W-DAT-007-W',
  sections: {
    'W7-02': [
      ['When do you draw a bar chart?', 'When the data comes in separate groups, such as blood group, habitat or type of rock.'],
      ['When do you plot a graph?', 'When both variables are continuous, so they can take any value in a range, such as time, temperature or volume.'],
    ],
    'W7-05': [
      ['What makes a good bar chart?', 'An even scale, both axes labelled with units, gaps between the bars, and a key if there is more than one set of data.'],
      ['How big should a chart be?', 'Big: use at least half of the paper.'],
    ],
    'W7-08': [
      ['Which variable goes on which axis?', 'The independent variable goes on the x-axis (horizontal). The dependent variable goes on the y-axis (vertical).'],
      ['What is a line of best fit?', 'A line that passes through, or close to, as many points as possible. Do not just join the dots.'],
      ['What do you do with an anomalous result?', 'Circle it and ignore it when you draw the line of best fit.'],
    ],
  },
  recall: ['W7-03', 'W7-07', 'W7-09'],
}
