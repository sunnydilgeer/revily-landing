import type { TeachingFrame } from '../../teachingFrame'

// T = 1/f, v = fλ with one rearrangement (standard form kept friendly), and the two-microphone oscilloscope method for the speed of sound.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const waveSpeedFrames: Record<string, TeachingFrame[]> = {
  'P54-02': [
    f('Period and frequency', 'Period is the time for one wave. Frequency is waves per second. They are linked by T = 1 ÷ f.', 'time and rate', 'Period is the time taken for one complete wave. Frequency is the number of waves each second. They are linked by the word equation period = 1 ÷ frequency. In symbols this is T = 1/f, with T in seconds and f in hertz.', 'wavespeed-period'),
    f('A worked example', 'A wave has a frequency of 4 Hz. T = 1 ÷ f = 1 ÷ 4 = 0.25 s.', 'equation, numbers, answer', 'A wave has a frequency of 4 Hz. Start with T = 1 ÷ f. Put in the frequency: T = 1 ÷ 4. Work it out: T = 0.25. The period is 0.25 s.', 'wavespeed-t-worked'),
    f('Does it make sense?', 'Four waves each second means each wave takes a quarter of a second.', 'high frequency, short period', 'Four waves pass every second. So one wave takes a quarter of a second, which is 0.25 s. A high frequency always means a short period.', 'wavespeed-t-check'),
  ],
  'P54-04': [
    f('Wave speed', 'Wave speed is how fast the wave moves. Wave speed = frequency × wavelength, or v = fλ.', 'three quantities', 'Wave speed is how fast a wave moves, or how fast it transfers energy. It is found from wave speed = frequency × wavelength. In symbols, v = fλ, where λ is the Greek letter lambda. Speed is in m/s, frequency in Hz and wavelength in m. This works for all waves.', 'wavespeed-equation'),
    f('Put the numbers in', 'A rope wave has a frequency of 5 Hz and a wavelength of 0.4 m. v = 5 × 0.4.', 'equation, then numbers', 'A wave on a rope has a frequency of 5 Hz and a wavelength of 0.4 m. Start with v = f × λ. Put in the values: v = 5 × 0.4.', 'wavespeed-v1'),
    f('Work it out', 'v = 5 × 0.4 = 2. The wave speed is 2 m/s.', 'units give the unit', 'Multiply on a calculator: 5 × 0.4 = 2. The frequency was in hertz and the wavelength in metres. So the speed is in metres per second. The wave speed is 2 m/s.', 'wavespeed-v2'),
  ],
  'P54-07': [
    f('Rearrange for wavelength', 'To find wavelength, divide both sides of v = fλ by f. That gives λ = v ÷ f.', 'undo the multiply', 'Sometimes you know the speed and the frequency and need the wavelength. Start with v = f × λ. Divide both sides by f. That gives λ = v ÷ f.', 'wavespeed-rearrange'),
    f('Numbers in standard form', 'A radio wave has f = 6.0 × 10⁷ Hz and v = 3.0 × 10⁸ m/s. λ = (3.0 × 10⁸) ÷ (6.0 × 10⁷).', 'brackets round each number', 'A radio wave has a frequency of 6.0 × 10⁷ Hz. Its speed in air is 3.0 × 10⁸ m/s. Put the values into λ = v ÷ f. Put brackets round each number in standard form: λ = (3.0 × 10⁸) ÷ (6.0 × 10⁷).', 'wavespeed-std1'),
    f('Use the calculator', 'Enter each number with the ×10ˣ button. The answer is 5, so λ = 5 m.', 'keep the brackets', 'On a calculator, enter each standard form number with the ×10ˣ or EXP button. Keep the brackets. The answer is 5. Wavelength is in metres, so the wavelength is 5 m.', 'wavespeed-std2'),
  ],
  'P54-09': [
    f('Set up', 'Connect two microphones to an oscilloscope. Connect a speaker to a signal generator.', 'equipment', 'An oscilloscope is a device that shows waves on a screen. Connect two microphones to it. Connect a speaker to a signal generator, which makes sound waves at a frequency you choose.', 'wavespeed-scope-setup'),
    f('Line the waves up', 'Start with both microphones next to the speaker. The two waves on the screen line up.', 'two traces, together', 'Set the oscilloscope so each microphone shows as its own wave. Start with both microphones next to the speaker. The two waves on the screen line up.', 'wavespeed-scope-line'),
    f('Find one wavelength', 'Move one microphone away slowly. Stop when the waves line up again. Now they are one wavelength apart.', 'line up again', 'Slowly move one microphone away from the speaker. Stop when the waves line up again on the screen. The microphones are now exactly one wavelength apart. Measure the distance between them to find the wavelength.', 'wavespeed-scope-move'),
    f('Work out the speed', 'Use v = fλ. The frequency is the value set on the signal generator. Sound in air should be near 330 m/s.', 'frequency times wavelength', 'Use v = f × λ to find the speed of the sound. The frequency is whatever you set on the signal generator. The speed of sound in air is about 330 m/s, so check that your result roughly agrees.', 'wavespeed-scope-speed'),
  ],
}
