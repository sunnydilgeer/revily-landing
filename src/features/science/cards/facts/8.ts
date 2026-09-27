import type { ScienceFactSet } from '../types'

export const facts: ScienceFactSet = {
  lessonId: 'B-ORG-008-B',
  sections: {
    'B8-02': [
      ['What is an enzyme?', 'A protein that speeds up a reaction in a living thing. It is a biological catalyst.'],
      ['What happens to an enzyme after a reaction?', 'It is unchanged. It is not used up, so it can work again and again.', 'Enzymes are not used up in the reaction.'],
      ['What is a substrate?', 'The substance an enzyme acts on. Amylase acts on starch and makes sugars, the products.'],
    ],
    'B8-04': [
      ['What is the active site?', 'A part of the enzyme with a special shape. The substrate fits into it and the reaction happens there.'],
      ['Why does amylase break down starch but not protein?', 'Only starch fits its active site. Protein has a different shape, so it does not fit. This is the lock-and-key model.'],
      ['Is the lock-and-key model exactly right?', 'No, it is simplified. Real enzymes are flexible, not rigid locks. The model still shows why shape matters.'],
    ],
    'B8-06': [
      ['Why are enzymes slow in the cold?', 'Particles move slowly and meet less often. The enzyme is not damaged by the cold.', 'Cold does not denature enzymes.'],
      ['What happens to an enzyme above its optimum temperature?', 'Heat changes the shape of the active site. The substrate no longer fits. The enzyme is denatured.', 'Enzymes are denatured, not "killed". They are not alive.'],
      ['How does pH affect an enzyme?', 'Each enzyme works fastest at its optimum pH. Far from it, the active site changes shape, so the reaction slows.'],
    ],
    'B8-09': [
      ['In the amylase practical, what are the variables?', 'Independent: pH, set with a different buffer in each tube. Dependent: time for the starch to go. Control: temperature, volumes, concentrations.'],
      ['How do you know the starch has gone?', 'Every 30 seconds, drop the mixture into iodine. When a drop stays brown-orange, no starch is left.', 'Blue-black means starch is still there.'],
      ['Why repeat each pH and take a mean?', 'To reduce the effect of random variation. The real practical needs teacher supervision and a risk assessment.', 'This lesson prepares you for required practical 4. It does not replace it.'],
    ],
    'B8-13': [
      ['What does a shorter time to lose the starch mean?', 'A faster reaction. The shortest time shows the fastest reaction.', 'A longer time means a slower reaction, not a faster one.'],
      ['Is the fastest tested pH the exact optimum?', 'Not always. The real optimum could be a little either side. Test more pH values near the peak.'],
      ['How do you turn a time into a rate?', 'Use rate = 1000 ÷ time. If the starch is gone in 125 seconds, the rate is 1000 ÷ 125 = 8.'],
    ],
  },
  recall: ['B8-03', 'B8-05', 'B8-08'],
}
