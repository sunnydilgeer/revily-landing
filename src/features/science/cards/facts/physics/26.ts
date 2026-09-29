import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ELE-026-P',
  sections: {
    'P26-02': [
      ['What is the National Grid?', 'A giant system of cables and transformers that covers Great Britain and transfers electrical power from power stations to consumers.'],
      ['What is a consumer?', 'Anyone who is using electricity.'],
    ],
    'P26-05': [
      ['What is demand?', 'The amount of electricity being used at a given time. It changes through the day.'],
      ['How does the grid cope with high demand?', 'Power stations often run below their maximum output, so they can increase it quickly. The grid can cope even if one power station shuts down without warning.'],
    ],
    'P26-08': [
      ['Why does the grid use a high pd?', 'For a given power, a high pd means a low current. A low current heats the cables less, so less energy is wasted.', 'P = VI'],
      ['Why not use a high current?', 'A high current heats the wires and wastes energy to the surroundings, so it would be inefficient and more expensive.'],
    ],
    'P26-11': [
      ['What does a step-up transformer do?', 'It increases the pd between the power station and the transmission cables. The current goes down.'],
      ['What does a step-down transformer do?', 'It brings the pd back down before electricity reaches homes, so it is safe. The current goes up.'],
    ],
  },
  recall: ['P26-03', 'P26-06', 'P26-09', 'P26-12'],
}
