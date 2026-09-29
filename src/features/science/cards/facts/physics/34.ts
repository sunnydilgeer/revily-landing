import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ATM-034-P',
  sections: {
    'P34-02': [
      ['What are alpha, beta and gamma radiation?', 'Alpha is 2 protons and 2 neutrons. Beta is a fast-moving electron. Gamma is electromagnetic radiation from the nucleus.', 'Neutrons can also be released.'],
      ['What is radioactive decay?', 'An unstable nucleus gives out radiation to become more stable.'],
    ],
    'P34-05': [
      ['What is ionising radiation?', 'Radiation that knocks electrons off atoms and turns them into positive ions.'],
      ['Which radiation is most and least ionising?', 'Alpha is strongly ionising, beta moderately and gamma weakly.'],
    ],
    'P34-07': [
      ['What stops alpha, beta and gamma?', 'Alpha is stopped by paper, beta by aluminium, and gamma by thick lead or metres of concrete.', 'Ranges in air: a few centimetres, a few metres, a long way.'],
    ],
    'P34-10': [
      ['Why is gamma used for medical tracers?', 'It passes through the body to be detected outside and is only weakly ionising, so it does less harm.', 'Alpha cannot get out and is strongly ionising.'],
    ],
  },
  recall: ['P34-03', 'P34-08', 'P34-11'],
}
