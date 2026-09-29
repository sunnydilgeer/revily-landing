import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ENE-009-P',
  sections: {
    'P9-02': [
      ['What does efficiency measure?', 'How much of the input energy is transferred usefully. The less energy wasted, the more efficient the transfer.'],
      ['Can a device be 100% efficient?', 'No. Some energy is always wasted (dissipated), so the useful output is always less than the input.'],
    ],
    'P9-05': [
      ['What is the equation for efficiency?', 'Efficiency = useful output energy transfer ÷ total input energy transfer.'],
      ['How do you change a decimal efficiency into a percentage?', 'Multiply by 100. To change a percentage into a decimal, divide by 100.'],
    ],
    'P9-09': [
      ['What is the power form of the efficiency equation?', 'Efficiency = useful power output ÷ total power input.'],
      ['How do you find the useful power output?', 'Useful power output = efficiency (as a decimal) × total power input.'],
    ],
  },
  recall: ['P9-04', 'P9-07', 'P9-11'],
}
