import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ENE-006-P',
  sections: {
    'P6-02': [
      ['What is power?', 'The rate of energy transfer: how fast energy is transferred. It is also the rate of doing work.'],
      ['What is one watt?', 'One joule of energy transferred every second (1 W = 1 J/s).'],
      ['What does a powerful machine do?', 'It transfers a lot of energy in a short time.'],
    ],
    'P6-05': [
      ['What is the equation for power?', 'Power (W) = energy transferred (J) ÷ time (s), or P = E ÷ t. Also P = W ÷ t, using work done.'],
      ['Which units must you check before calculating power?', 'Time in seconds and energy in joules. Multiply minutes by 60 and kilojoules by 1000.'],
    ],
    'P6-09': [
      ['How do you find the energy from power and time?', 'Energy transferred (J) = power (W) × time (s), or E = P × t.'],
      ['How do you rearrange P = E ÷ t to find energy?', 'Multiply both sides by t. The t on the right cancels, leaving E = P × t.', 'Example: a 20 W lamp on for 10 s transfers 20 × 10 = 200 J.'],
    ],
  },
  recall: ['P6-03', 'P6-04', 'P6-11'],
}
