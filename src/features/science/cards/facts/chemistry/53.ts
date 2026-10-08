import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-RES-053-C',
  sections: {
    'C53-02': [
      ['What is potable water?', 'Water that is safe for humans to drink.', 'It is not the same as pure water, which contains only H₂O.'],
      ['What must potable water be like?', 'Low levels of dissolved salts, a pH between 6.5 and 8.5, and no harmful microbes.'],
    ],
    'C53-05': [
      ['What are surface water and ground water?', 'Surface water collects in lakes, rivers and reservoirs. Ground water collects in rocks that trap water underground.'],
      ['When is sea water used for drinking water?', 'In very dry countries where there is not enough surface or ground water.'],
    ],
    'C53-08': [
      ['How can sea water be desalinated?', 'By distillation, or by reverse osmosis, which passes salty water through a membrane that only lets water molecules through.', 'Both use lots of energy, so they are expensive.'],
      ['How does distillation desalinate sea water?', 'The sea water is boiled, then the steam is cooled and condensed into a different container. The dissolved salts are left behind.'],
    ],
    'C53-11': [
      ['How is fresh water filtered?', 'Through a wire mesh to stop large things, then filter beds of sand and gravel to catch other solid bits.'],
      ['How is water sterilised?', 'Harmful microbes are killed using chlorine gas, ozone or ultraviolet light.'],
    ],
  },
  recall: ['C53-03', 'C53-06', 'C53-09'],
}
