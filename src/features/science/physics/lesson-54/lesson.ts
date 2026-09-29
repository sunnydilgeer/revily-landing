import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { waveSpeedFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.6.1.2 Properties of waves (period, wave speed, the wave equation, measuring the speed of sound), as on the supplied revision page' }
const skill = 'P-WAVESPEED'
const period = author(skill, ['6.6.1.2'], ['aqa-physics'])
const speed = author(skill, ['6.6.1.2'], ['aqa-physics'])
const wavelength = author(skill, ['6.6.1.2'], ['aqa-physics'])
const sound = author(skill, ['6.6.1.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const waveSpeedSections = [
  { id: 'P54-01', label: 'Start here', detail: 'Lightning and thunder' },
  { id: 'P54-02', label: 'How are period and frequency linked?', detail: 'T = 1 ÷ f' },
  { id: 'P54-04', label: 'How do you calculate wave speed?', detail: 'v = f × λ' },
  { id: 'P54-07', label: 'How do you find a wavelength?', detail: 'λ = v ÷ f, with standard form' },
  { id: 'P54-09', label: 'How can you measure the speed of sound?', detail: 'Two microphones and an oscilloscope' },
  { id: 'P54-12', label: 'On your own', detail: 'Calculate and describe' },
]

const states: ScienceState[] = [
  { ...speed.choice('P54-01', 'You see a flash of lightning, and a few seconds later you hear the thunder. What does this tell you?', ['Light travels faster than sound', 'Sound travels faster than light', 'Light and sound travel at the same speed', 'Thunder is quieter than lightning'], 0, 'Which one reaches you first?', ['The light reaches you first.', 'So light travels faster than sound.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(period, 'P54-02', 'How are period and frequency linked?'),
  period.choice('P54-03', 'A wave has a frequency of 5 Hz. What is its period?', ['5 s', '20 s', '0.2 s', '0.5 s'], 2, 'Use T = 1 ÷ f.', ['T = 1 ÷ f = 1 ÷ 5.', '1 ÷ 5 = 0.2, so the period is 0.2 s.'], 'calculation'),
  t(speed, 'P54-04', 'How do you calculate wave speed?'),
  speed.choice('P54-05', 'A water wave has a frequency of 3 Hz and a wavelength of 0.5 m. What is its speed?', ['0.17 m/s', '3.5 m/s', '6 m/s', '1.5 m/s'], 3, 'v = f × λ. Put the numbers in.', ['v = f × λ = 3 × 0.5.', '3 × 0.5 = 1.5, so the speed is 1.5 m/s.'], 'calculation'),
  speed.choice('P54-06', 'Which equation links wave speed, frequency and wavelength?', ['v = f ÷ λ', 'v = f × λ', 'v = f + λ', 'v = λ − f'], 1, 'Wave speed is frequency times wavelength.', ['Wave speed = frequency × wavelength.', 'In symbols, v = fλ.'], 'recall'),
  t(wavelength, 'P54-07', 'How do you find a wavelength?'),
  wavelength.choice('P54-08', 'A radio wave has a frequency of 1.5 × 10⁸ Hz. Its speed is 3.0 × 10⁸ m/s. What is its wavelength?', ['0.5 m', '4.5 m', '2 m', '4.5 × 10⁸ m'], 2, 'Rearrange to λ = v ÷ f. Use brackets on the calculator.', ['λ = v ÷ f = (3.0 × 10⁸) ÷ (1.5 × 10⁸).', 'The answer is 2, so the wavelength is 2 m.'], 'calculation'),
  t(sound, 'P54-09', 'How can you measure the speed of sound?'),
  sound.choice('P54-10', 'When measuring the speed of sound, why do you move one microphone away until the waves line up again?', ['To make the sound louder', 'To change the frequency', 'To make the speaker quieter', 'So the microphones are exactly one wavelength apart'], 3, 'Lined up again means one more whole wave.', ['When the waves line up again the microphones are one wavelength apart.', 'Measuring that distance gives the wavelength.']),
  sound.choice('P54-11', 'The traces from the two microphones are shown on the oscilloscope and do not line up. What should you do?', ['Move one microphone until the traces line up', 'Switch the oscilloscope off', 'Add more microphones', 'Turn up the speaker'], 0, 'You are looking for the traces to match.', ['Move one microphone slowly until the traces line up.', 'They are then exactly one wavelength apart.'], 'understanding', false, 'wavespeed-q-scope'),
  { ...period.choice('P54-12', 'A wave has a frequency of 20 Hz. What is its period?', ['20 s', '0.05 s', '2.0 s', '0.5 s'], 1, 'Use T = 1 ÷ f.', ['T = 1 ÷ f = 1 ÷ 20.', '1 ÷ 20 = 0.05, so the period is 0.05 s.'], 'calculation', true) },
  { ...speed.choice('P54-13', 'A wave on a rope has a frequency of 4 Hz and a wavelength of 1.5 m. What is its speed?', ['0.375 m/s', '5.5 m/s', '6 m/s', '2.5 m/s'], 2, 'v = f × λ.', ['v = f × λ = 4 × 1.5.', '4 × 1.5 = 6, so the speed is 6 m/s.'], 'calculation', true) },
  { ...wavelength.choice('P54-14', 'Sound travels at 330 m/s. A sound has a frequency of 110 Hz. What is its wavelength?', ['3 m', '36 300 m', '0.33 m', '220 m'], 0, 'Rearrange to λ = v ÷ f.', ['λ = v ÷ f = 330 ÷ 110.', '330 ÷ 110 = 3, so the wavelength is 3 m.'], 'calculation', true) },
  { ...sound.choice('P54-15', 'In the speed of sound method, which piece of equipment shows the waves picked up by the microphones?', ['A signal generator', 'An oscilloscope', 'A speaker', 'A ruler'], 1, 'It shows waves on a screen.', ['An oscilloscope shows the waves on a screen.', 'The signal generator makes the sound, and the ruler measures the distance.'], 'recall', true) },
  sound.written('P54-16', 'Describe how you could measure the speed of sound in air using two microphones, an oscilloscope, a speaker and a signal generator.', 'Think about lining the waves up, the distance and the equation.', 'Connect the speaker to a signal generator and the two microphones to an oscilloscope. Start with both microphones next to the speaker so the waves line up. Move one microphone away until the waves line up again. Measure the distance between the microphones. This is one wavelength. The frequency is set on the signal generator. Use v = f × λ to find the speed, which should be about 330 m/s.', ['Speaker connected to a signal generator and two microphones connected to an oscilloscope.', 'Start with the microphones together so the waves line up.', 'Move one microphone until the waves line up again.', 'Measure the distance between the microphones to find the wavelength.', 'Use v = f × λ, with the frequency from the signal generator.'], ['Using a stopwatch to time the sound.', 'Measuring the distance from the speaker to the oscilloscope.', 'Dividing the frequency by the wavelength.']),
]

export const lessonP54: ScienceLesson = {
  id: 'P-WAV-054-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Frequency, period and wave speed', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
