import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ELE-019-P',
  sections: {
    'P19-02': [
      ['What is an LDR?', 'A light dependent resistor. Its resistance changes with the intensity of the light.'],
      ['How does the resistance of an LDR change?', 'It is highest in the dark and falls as the light gets brighter.', 'Uses: automatic night lights, outdoor lighting, burglar detectors.'],
    ],
    'P19-05': [
      ['What is a thermistor?', 'A temperature-dependent resistor. Its resistance changes with temperature.'],
      ['How does the resistance of a thermistor change?', 'It is greater when cool and drops when hot.', 'Use: temperature detectors such as electronic thermostats.'],
    ],
    'P19-08': [
      ['What is a sensing circuit?', 'A circuit that switches a component on, or increases its power, depending on conditions such as light or temperature.'],
      ['How does a thermistor make a fan go faster in a hot room?', 'A hotter thermistor has less resistance, so it takes a smaller share of the pd. The pd across the fixed resistor and fan rises, so the fan goes faster.', 'The larger a component’s resistance, the more of the pd it takes.'],
    ],
  },
  recall: ['P19-03', 'P19-06', 'P19-09'],
}
