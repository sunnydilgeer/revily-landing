import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ELE-022-P',
  sections: {
    'P22-02': [
      ['How do you find the total resistance of a circuit in this investigation?', 'Read the current on the ammeter, use the pd of the cell, and calculate R = V ÷ I.'],
      ['How do you add a resistor in series?', 'Connect it in the same loop as the first, then measure the current again and recalculate the total resistance.', 'The ammeter always goes in series.'],
    ],
    'P22-05': [
      ['What is the only change when testing resistors in parallel?', 'Each new resistor is added in parallel with the first, on its own branch. The rest of the method stays the same.'],
      ['Why use the same equipment for series and parallel?', 'So it is a fair test. Any difference in the results is then caused by how the resistors are connected.'],
    ],
    'P22-08': [
      ['What should the results show?', 'Adding resistors in series decreases the current and increases the total resistance. Adding them in parallel increases the current and decreases the total resistance.'],
      ['What do the two graphs look like?', 'Total resistance against number of identical resistors is a straight line upwards for series and a falling curve for parallel.', 'Open the switch between readings, because warm resistors can change the results.'],
    ],
  },
  recall: ['P22-03', 'P22-04', 'P22-10'],
}
