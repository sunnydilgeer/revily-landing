import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-WAV-054-P',
  sections: {
    'P54-02': [
      ['How do you find the period of a wave from its frequency?', 'Period = 1 ÷ frequency, or T = 1/f. T is in seconds and f is in hertz. For example, 4 Hz gives 1 ÷ 4 = 0.25 s.'],
    ],
    'P54-04': [
      ['What is the wave equation?', 'Wave speed = frequency × wavelength, or v = fλ. Speed is in m/s, frequency in Hz and wavelength in m. It applies to all waves.'],
      ['How do you work out a wave speed?', 'Put the frequency and wavelength into v = f × λ. For example 5 Hz × 0.4 m = 2 m/s.'],
    ],
    'P54-07': [
      ['How do you find a wavelength from speed and frequency?', 'Rearrange v = fλ to λ = v ÷ f. For example (3.0 × 10⁸) ÷ (6.0 × 10⁷) = 5 m.', 'On a calculator, use brackets and the ×10ˣ button for standard form.'],
    ],
    'P54-09': [
      ['How can you measure the speed of sound in air?', 'Two microphones connected to an oscilloscope, and a speaker connected to a signal generator. Move one microphone until the waves line up again, then measure the distance for one wavelength.'],
      ['How do you get the speed of sound from that experiment?', 'Use v = f × λ, with the frequency set on the signal generator. The speed of sound in air is about 330 m/s.'],
    ],
  },
  recall: ['P54-03', 'P54-05', 'P54-06', 'P54-10'],
}
