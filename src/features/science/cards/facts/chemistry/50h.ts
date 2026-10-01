import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-RES-050H-C',
  sections: {
    'C50H-02': [
      ['What is a low-grade ore?', 'An ore that contains only a small amount of metal.', 'A copper-rich ore contains lots of copper.'],
      ['Why is copper now extracted from low-grade ores?', 'Copper is finite and copper-rich ores are in short supply, so getting copper from low-grade ores makes it last longer.'],
    ],
    'C50H-05': [
      ['What happens in bioleaching?', 'Copper ore is added to a solution of bacteria. The bacteria convert copper compounds in the ore into soluble copper compounds.'],
      ['What is the leachate made in bioleaching?', 'A solution that contains copper ions.'],
    ],
    'C50H-08': [
      ['What happens in phytomining?', 'Plants grown in soil containing copper take it up. It builds up in the leaves because they cannot use it or get rid of it.'],
      ['How is copper got out of the plants in phytomining?', 'The plants are harvested, dried and burned. The ash contains soluble copper compounds.'],
    ],
    'C50H-11': [
      ['How is copper metal extracted from a solution of copper ions?', 'By electrolysis, or by displacement with a more reactive metal such as scrap iron.'],
      ['Give one advantage and one disadvantage of bioleaching and phytomining.', 'They have a much smaller impact on the environment than traditional mining, but they are slow.'],
    ],
  },
  recall: ['C50H-06', 'C50H-09', 'C50H-14'],
}
