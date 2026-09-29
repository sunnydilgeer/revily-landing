import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ELE-015-P',
  sections: {
    'P15-02': [
      ['What are current, potential difference and resistance?', 'Current: a flow of charge, in amperes (A). Potential difference: the driving force that pushes charge round, in volts (V). Resistance: anything that slows the flow of charge, in ohms (Ω).'],
      ['What does charge need to flow round a circuit?', 'A complete, closed loop and a source of potential difference. In a single closed loop the current is the same everywhere.', 'For the same potential difference, the greater the resistance, the smaller the current.'],
    ],
    'P15-05': [
      ['What is the equation for charge flow?', 'Charge flow (C) = current (A) × time (s), or Q = I × t.'],
      ['What must you do to a time in minutes?', 'Change it to seconds first, by multiplying by 60.', '3 minutes = 3 × 60 = 180 seconds.'],
    ],
    'P15-09': [
      ['How do you draw a cell, a battery and a switch?', 'A cell has one long thin line and one short thick line. A battery is two or more cells joined. A switch is drawn open (with a gap) or closed.'],
      ['How do you draw an ammeter and a voltmeter?', 'An ammeter is a circle with an A. A voltmeter is a circle with a V.', 'A resistor is a rectangle. A variable resistor has an arrow through it.'],
    ],
    'P15-12': [
      ['What are the rules for drawing a circuit diagram?', 'Draw all the wires as straight lines, and make sure the circuit is closed.'],
      ['Where do an ammeter and a voltmeter go?', 'An ammeter goes in the loop, in series with the component. A voltmeter goes across the component, in parallel.'],
    ],
  },
  recall: ['P15-03', 'P15-08', 'P15-11'],
}
