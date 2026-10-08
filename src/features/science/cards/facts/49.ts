import type { ScienceFactSet } from '../types'

export const facts: ScienceFactSet = {
  lessonId: 'B-ECO-049-B',
  sections: {
    'B49-02': [
      ['What is distribution?', 'How an organism is spread across the area where it is found. Biotic and abiotic factors affect it.'],
      ['How do you use quadrats to compare two areas?', 'Place a quadrat at random, count the organisms inside, repeat many times and work out the mean. Do the same in the second area, then compare the means.'],
      ['Why are quadrats placed at random?', 'So the results are not biased by where you choose to put them.'],
    ],
    'B49-05': [
      ['How do you find the mean number per quadrat?', 'Add up all the counts, then divide by the number of quadrats.'],
      ['What are the median and the mode?', 'The median is the middle value when the counts are in order. The mode is the value that appears most often.'],
    ],
    'B49-09': [
      ['How do you estimate a population size from quadrats?', 'Divide the area of the habitat by the area of one quadrat, then multiply by the mean number per quadrat.', 'The answer is an estimate, not an exact count.'],
      ['What is the population size of a species also called?', 'Its abundance. It is the estimated total number of that organism in the whole area.'],
    ],
    'B49-12': [
      ['What is a transect used for?', 'To study how the distribution of an organism changes along a line across an area, for example from a hedge into a field.'],
      ['How do you find percentage cover?', 'Count the small squares more than half covered, divide by the total number of squares, then multiply by 100.'],
    ],
  },
  recall: ['B49-03', 'B49-07', 'B49-14'],
}
