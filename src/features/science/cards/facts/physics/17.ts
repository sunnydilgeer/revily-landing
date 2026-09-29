import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ELE-017-P',
  sections: {
    'P17-02': [
      ['Where do the ammeter and voltmeter go?', 'The ammeter goes in series with the test wire. The voltmeter goes in parallel, across the test wire.'],
      ['What are the variables when investigating wire resistance?', 'The length of the wire is the independent variable. The resistance is the dependent variable.', 'Keep the type and thickness of the wire the same.'],
    ],
    'P17-05': [
      ['Why open the switch between readings?', 'The wire can heat up, which changes its resistance. Opening the switch lets it cool down.'],
      ['What is the method for each length?', 'Set the length with the clips, close the switch, record the current and pd, open the switch, then move the clip and repeat.'],
    ],
    'P17-08': [
      ['How do you work out the resistance for each length?', 'R = V ÷ I, using the pd and the current you measured.'],
      ['What does the resistance–length graph show?', 'A straight line through the origin. Resistance is directly proportional to length: the longer the wire, the greater the resistance.'],
    ],
  },
  recall: ['P17-04', 'P17-06', 'P17-09'],
}
