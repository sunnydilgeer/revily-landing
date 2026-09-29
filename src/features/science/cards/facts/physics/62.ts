import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-WAV-062-P',
  sections: {
    'P62-02': [
      ['Which EM waves can harm living tissue?', 'High frequency waves: ultraviolet radiation, X-rays and gamma rays.'],
      ['How can UV radiation harm people?', 'It damages surface cells: sunburn, faster skin ageing, blindness and a higher risk of skin cancer.'],
      ['Why are X-rays and gamma rays dangerous?', 'They are ionising: they knock electrons off atoms, which can destroy cells or mutate genes and cause cancer.'],
    ],
    'P62-05': [
      ['What is radiation dose?', 'A measure of the risk of harm from being exposed to radiation. It is measured in sieverts (Sv).'],
      ['What two things does the risk depend on?', 'The total amount of radiation absorbed, and how harmful the type of radiation is.'],
      ['How do sieverts and millisieverts compare?', '1000 mSv = 1 Sv. Multiply by 1000 to go from Sv to mSv.', 'Divide by 1000 to go from mSv to Sv.'],
    ],
    'P62-08': [
      ['Why are X-rays used even though they can harm?', 'The benefits, such as finding injuries, are weighed against a small health risk.'],
      ['How do you compare the risk from two scans?', 'Divide the bigger dose by the smaller dose. If one dose is 4 times bigger, the risk is 4 times bigger.'],
    ],
  },
  recall: ['P62-04', 'P62-07', 'P62-10'],
}
