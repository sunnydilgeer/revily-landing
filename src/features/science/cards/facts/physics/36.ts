import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ATM-036-P',
  sections: {
    'P36-02': [
      ['What is count-rate?', 'The number of radiation counts a detector measures each second.', 'Activity is different: it is the rate at which a source decays, in becquerels (Bq).'],
      ['Why can you not predict one nucleus?', 'Radioactive decay is random. You cannot say which nucleus will decay next, or when.'],
    ],
    'P36-05': [
      ['What is half-life?', 'The time taken for the number of unstable nuclei in a sample to halve. It is also the time for the activity or count-rate to halve.'],
      ['Does half-life change with the starting activity?', 'No. The half-life of a radioactive sample is always the same.'],
    ],
    'P36-08': [
      ['How do you find half-life from a graph?', 'Halve the starting activity, go across to the curve, then down to the time axis. That time is the half-life.'],
    ],
    'P36-11': [
      ['How do you calculate half-life from two activities?', 'Halve the starting activity until you reach the final one and count the steps. Then divide the total time by the number of half-lives.', 'For example 96 → 12 Bq in 15 minutes is 3 halvings, so 15 ÷ 3 = 5 minutes.'],
    ],
  },
  recall: ['P36-03', 'P36-04', 'P36-07', 'P36-12'],
}
