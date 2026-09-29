import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-MOT-044-P',
  sections: {
    'P44-02': [
      ['What is acceleration?', 'How quickly velocity changes: the change in velocity in a certain time. a = Δv ÷ t, with a in m/s², Δv in m/s and t in s.'],
      ['What is deceleration?', 'Slowing down. It is a negative acceleration.'],
    ],
    'P44-05': [
      ['How do you calculate acceleration?', 'Find Δv (final velocity − starting velocity), then divide by the time: a = Δv ÷ t.', 'Example: (15 − 3) ÷ 4 = 3 m/s².'],
    ],
    'P44-08': [
      ['How do you estimate an acceleration?', 'Use a sensible typical speed and a sensible time in a = Δv ÷ t. The answer is only about right, shown with ~.', 'A bike reaching 6 m/s in 10 s: a ≈ 0.6 m/s².'],
    ],
    'P44-10': [
      ['What is the equation for uniform acceleration?', 'v² − u² = 2as. v = final velocity, u = starting velocity (m/s), a = acceleration (m/s²), s = distance (m).', 'Rearrange to v² = u² + 2as, then take the square root.'],
      ['What is the acceleration due to gravity?', 'About 9.8 m/s² near the Earth’s surface. It is uniform for freely falling objects.'],
    ],
  },
  recall: ['P44-03', 'P44-06', 'P44-09', 'P44-11'],
}
