import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ATM-037-P',
  sections: {
    'P37-02': [
      ['What is irradiation?', 'Being exposed to radiation from a source outside you. It does not make you or an object radioactive.', 'Contamination is different: radioactive atoms get onto or into the object.'],
      ['How can you protect against irradiation?', 'Store sources in lead-lined boxes, stand behind barriers, and keep the source as far away as possible, for example at arm\'s length.'],
    ],
    'P37-05': [
      ['What is contamination?', 'Unwanted radioactive atoms getting onto or into an object. The atoms stay and keep decaying, releasing radiation.'],
      ['How can you protect against contamination?', 'Use gloves and tongs, and wear protective suits and face masks so radioactive material cannot stick to you or be breathed in.'],
    ],
    'P37-08': [
      ['Which source is least dangerous outside the body?', 'Alpha. It cannot penetrate the skin and is stopped by a small air gap.', 'Beta and gamma can penetrate the body.'],
      ['Which source is most dangerous inside the body?', 'Alpha. It does all its damage in a very small area and is the most ionising.', 'Gamma mostly passes straight out, so it is the least dangerous inside.'],
    ],
  },
  recall: ['P37-03', 'P37-06', 'P37-09', 'P37-10'],
}
