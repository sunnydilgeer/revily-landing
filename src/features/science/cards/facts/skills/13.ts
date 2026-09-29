import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'W-PRC-013-W',
  sections: {
    'W13-02': [
      ['How do you weigh a solid on a balance?', 'Put the empty container on the balance, set it to zero, then add the solid and read the mass.'],
      ['How can you find the mass of solid you moved?', 'Weigh the container with the solid, then without it. The difference in mass is the mass you moved.'],
    ],
    'W13-04': [
      ['Which equipment transfers a few drops of liquid?', 'A dropping pipette. Use it when the volume does not need to be accurate.'],
      ['Which equipment measures one exact volume?', 'A pipette with a pipette filler. The filler lets you draw up the liquid safely.'],
      ['How do you read a measuring cylinder?', 'Put your eye level with the liquid and read from the bottom of the meniscus.', 'The meniscus is the curved surface of the liquid.'],
    ],
    'W13-07': [
      ['What is the most accurate way to measure a gas volume?', 'A gas syringe. The gas pushes the plunger and you read the scale.'],
      ['What are two less accurate ways to measure gas?', 'An upturned measuring cylinder full of water, and counting bubbles.', 'Counting bubbles is roughest, because bubbles vary in size.'],
    ],
  },
  recall: ['W13-03', 'W13-05', 'W13-08'],
}
