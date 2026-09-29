import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'W-PRC-020-W',
  sections: {
    'W20-02': [
      ['How do you connect a voltmeter?', 'In parallel, across the component. It measures potential difference.'],
      ['How do you connect an ammeter?', 'In series, in the same loop as the component. It measures current.'],
      ['Why turn the circuit off between readings?', 'Wires overheat if a current flows for long. This can change your results.'],
    ],
    'W20-05': [
      ['What can a multimeter measure?', 'Potential difference, current and usually resistance. A dial chooses which.'],
      ['How do you use a multimeter for volts and amps?', 'Volts: in parallel, port V. Amps: in series, port A. Turn the dial to match.'],
    ],
    'W20-08': [
      ['How does a light gate work?', 'A beam crosses the gate. An object passing through interrupts it, and the gate records when and for how long.'],
      ['How do you find speed with a light gate?', 'Speed = length of the object ÷ time the beam was interrupted.'],
      ['How do you measure acceleration with a light gate?', 'Use a card with a gap so the beam is interrupted twice. The gate measures two speeds.', 'Light gates cut timing errors compared with a stopwatch.'],
    ],
  },
  recall: ['W20-03', 'W20-07', 'W20-10'],
}
