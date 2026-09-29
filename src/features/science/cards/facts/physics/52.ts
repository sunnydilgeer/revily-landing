import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-MOT-052-P',
  sections: {
    'P52-02': [
      ['What is reaction time?', 'How long a person takes to react to an event. A typical reaction time is between 0.2 and 0.9 seconds, and everyone\'s is different.'],
      ['Why not use a stopwatch to measure it?', 'Reaction times are so short that your own delay in pressing the button would spoil the result.', 'A computer-based test or the ruler drop test works better.'],
    ],
    'P52-05': [
      ['How does the ruler drop test work?', 'A helper drops a ruler without warning and you catch it between your thumb and finger. The distance it fell shows your reaction time.'],
      ['What does a longer distance mean in the ruler drop test?', 'The ruler fell further before it was caught, so the reaction time was longer.'],
    ],
    'P52-08': [
      ['How can you make the ruler drop test more accurate?', 'Do lots of repeats and calculate a mean. Stick a blob of modelling clay to the bottom of the ruler so it falls straight.'],
      ['How do you make the ruler drop test a fair test?', 'Use the same ruler each time and have the same person drop it each time.'],
    ],
  },
  recall: ['P52-03', 'P52-04', 'P52-06', 'P52-10'],
}
