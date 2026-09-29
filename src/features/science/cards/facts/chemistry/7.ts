import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-PER-007-C',
  sections: {
    'C7-02': [
      ['How were elements ordered in the early 1800s?', 'By atomic weight. Protons, neutrons and electrons had not been discovered, so nobody knew atomic numbers.'],
      ['Why were early periodic tables not complete?', 'Many elements had not been discovered yet.'],
      ['Why were some elements in the wrong group in early tables?', 'Strict atomic-weight order put some elements, such as iodine, with elements they are not like.', 'A group should hold elements with similar properties.'],
    ],
    'C7-05': [
      ['How did Mendeleev arrange the elements in 1869?', 'Mainly in order of atomic weight, but he switched some so elements with similar properties stayed in the same group.'],
      ['Give an example of a pair Mendeleev switched.', 'Tellurium and iodine. Tellurium is heavier, but he put it first so iodine stayed with chlorine and bromine.'],
      ['Why did Mendeleev leave gaps in his table?', 'For elements that had not been discovered yet.', 'The gaps were not mistakes: he used them to make predictions.'],
    ],
    'C7-08': [
      ['How did Mendeleev use the gaps?', 'He used the elements around each gap to predict the properties of the missing element.'],
      ['What showed that Mendeleev was right?', 'Elements found later, such as germanium (1886), fitted his gaps and matched his predictions.'],
    ],
    'C7-11': [
      ['Why do isotopes of one element share one place in the periodic table?', 'They have the same number of protons, so they are the same element with the same properties.'],
      ['How do isotopes explain why atomic-weight order was sometimes wrong?', 'Atomic weight is an average of an element’s isotopes. Tellurium has mostly heavy isotopes, so it weighs more than iodine even though it has fewer protons.'],
    ],
  },
  recall: ['C7-03', 'C7-06', 'C7-07', 'C7-13'],
}
