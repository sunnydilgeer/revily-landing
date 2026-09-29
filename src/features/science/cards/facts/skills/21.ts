import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'W-PRC-021-W',
  sections: {
    'W21-02': [
      ['Why take a sample?', 'A population is usually too big to study all of it, so you study a sample.'],
      ['What makes a good sample?', 'It represents the whole population, and it is chosen at random.', 'Random means everyone has an equal chance of being chosen.'],
    ],
    'W21-05': [
      ['How do you sample plants at random?', 'Divide the field into a grid, pick coordinates with a random number generator, and place a quadrat at each pair.'],
      ['Why is non-random sampling a problem?', 'It is biased. It may not represent the whole field.'],
    ],
    'W21-08': [
      ['How do you take a random sample of people?', 'Number everyone on the records, then use a random number generator to pick the sample group.'],
      ['What can you do with the sample?', 'Work out the proportion with a feature and use it to estimate the proportion in the whole population.'],
    ],
  },
  recall: ['W21-03', 'W21-04', 'W21-07'],
}
