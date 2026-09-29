import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ELE-023-P',
  sections: {
    'P23-02': [
      ['What is the difference between ac and dc?', 'In direct current (dc) the charge flows in one direction only. In alternating current (ac) the direction keeps changing.', 'Cells and batteries supply dc. The mains supply is ac.'],
      ['What are the UK mains values?', 'About 230 V, with a frequency of 50 Hz.'],
    ],
    'P23-05': [
      ['What are the colours and jobs of the three wires?', 'Live is brown (about 230 V, brings the alternating pd). Neutral is blue (about 0 V, completes the circuit). Earth is green and yellow (0 V, a safety wire).'],
      ['What does the earth wire do?', 'It is a safety wire that stops the appliance becoming live. It does not usually carry a current unless there is a fault.'],
    ],
    'P23-08': [
      ['Why can the live wire give you an electric shock?', 'There is a pd between the live wire and the earth (0 V). If you touch the live wire, you provide a link and a current can flow through you.'],
      ['Is the live wire safe when a switch is off?', 'Not necessarily. It may still have a pd, so touching it could still be dangerous.', 'Any connection between live and earth can cause a huge current and a fire.'],
    ],
  },
  recall: ['P23-04', 'P23-06', 'P23-07'],
}
