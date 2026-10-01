import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-ACID-022H-C',
  sections: {
    'C22H-02': [
      ['What is the difference between a strong acid and a weak acid?', 'A strong acid ionises completely in water. A weak acid only partly ionises, and the reaction is reversible (⇌).'],
      ['Name three strong acids and three weak acids.', 'Strong: hydrochloric, nitric and sulfuric acid. Weak: ethanoic, citric and carbonic acid.'],
    ],
    'C22H-06': [
      ['How does the H⁺ ion concentration change for each step down the pH scale?', 'It is multiplied by 10. Each step up the scale divides it by 10.', 'Two steps down means 10 × 10 = 100 times the H⁺ ions.'],
      ['What is the formula for the change in H⁺ ion concentration?', 'Factor = 10⁻ˣ, where X = final pH − initial pH. From pH 4 to pH 2, X = −2, so the factor is 10² = 100.'],
    ],
    'C22H-12': [
      ['What is the difference between a concentrated acid and a strong acid?', 'Concentration is how much acid is in a certain volume. Strength is how much of the acid ionises.', 'You can have a dilute strong acid or a concentrated weak acid.'],
      ['Two acids have the same concentration. Which has the lower pH?', 'The stronger acid, because it releases more H⁺ ions.'],
      ['What happens to the pH of an acid when you make it more concentrated?', 'The pH goes down, whether the acid is strong or weak.'],
    ],
  },
  recall: ['C22H-03', 'C22H-09', 'C22H-14'],
}
