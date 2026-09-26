import type { ScienceFactSet } from '../types'

export const facts: ScienceFactSet = {
  lessonId: 'B-INF-025-B',
  sections: {
    'B25-02': [
      ['What is preclinical testing?', 'Testing done before any people take the drug. First on human cells and tissues in the lab, then on live animals.'],
      ['What three things do drug tests check?', 'Efficacy: does it work? Toxicity: how harmful is it? Dosage: how much to give, and how often.', 'Toxicity is about harm. Efficacy is about whether it works.'],
      ['What is a side effect?', 'An unwanted effect of a drug.'],
    ],
    'B25-05': [
      ['What is a clinical trial?', 'Testing a drug on human volunteers who choose to take part.'],
      ['Why do clinical trials start with healthy volunteers at a very low dose?', 'To check for harmful side effects while the body is working normally. The dose is then increased little by little.'],
      ['What is the optimum dose?', 'The dose that is most effective and has few side effects. It is found by testing on patients.'],
    ],
    'B25-08': [
      ['What is a placebo?', 'A substance that looks like the drug but does not do anything. Groups are compared to see if the drug makes a real difference.'],
      ['What is a double-blind trial?', 'Neither patients nor doctors know who got the drug until all results are gathered. So nobody’s expectations affect the results.', 'In a blind trial only the patients do not know.'],
      ['What is peer review?', 'Other scientists check the work before the results are published. It helps to prevent false claims.'],
    ],
  },
  recall: ['B25-06', 'B25-09', 'B25-12', 'B25-13'],
}
