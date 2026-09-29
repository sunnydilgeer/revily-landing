import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wavePracFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.6.1.2 Properties of waves, including the required practical on waves in a ripple tank and on a vibrating string, as on the supplied revision page' }
const skill = 'P-WAVEPRAC'
const ripple = author(skill, ['6.6.1.2'], ['aqa-physics'])
const speed = author(skill, ['6.6.1.2'], ['aqa-physics'])
const string = author(skill, ['6.6.1.2'], ['aqa-physics'])
const safety = author(skill, ['6.6.1.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wavePracSections = [
  { id: 'P55-01', label: 'Start here', detail: 'Waves you can see' },
  { id: 'P55-02', label: 'How does a ripple tank work?', detail: 'Dipper, lamp and shadows' },
  { id: 'P55-05', label: 'How do you find the ripple speed?', detail: 'Ten wavelengths, then v = f × λ' },
  { id: 'P55-08', label: 'How do you use a vibrating string?', detail: 'Loops and wavelengths' },
  { id: 'P55-11', label: 'How do you stay safe?', detail: 'Water, masses and lamps' },
  { id: 'P55-13', label: 'On your own', detail: 'Calculate, apply and describe' },
]

const states: ScienceState[] = [
  { ...ripple.choice('P55-01', 'You want to measure the wavelength of a wave in a school lab. Which waves are easiest to see and measure?', ['Ripples on water', 'Radio waves', 'X-rays', 'Infrared waves'], 0, 'You need to be able to see the wave.', ['Water ripples can be seen, and shadows make them easy to measure.', 'The other waves cannot be seen.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(ripple, 'P55-02', 'How does a ripple tank work?'),
  ripple.choice('P55-03', 'In the ripple tank, what decides the frequency of the ripples?', ['The height of the lamp', 'The depth of the tank', 'The frequency set on the signal generator', 'The length of the metre ruler'], 2, 'The dipper is attached to something.', ['The dipper moves at the frequency set on the signal generator.', 'So the ripples have that frequency.']),
  ripple.choice('P55-04', 'Why is a lamp placed above the ripple tank?', ['To heat the water', 'To make shadows of the ripples on a screen', 'To make the ripples bigger', 'To speed up the ripples'], 1, 'Think about what appears on the screen below.', ['The lamp makes shadows of the ripples on a screen below the tank.', 'The shadow lines let you measure the wavelength.']),
  t(speed, 'P55-05', 'How do you find the ripple speed?'),
  speed.choice('P55-06', 'Ten wavelengths on the screen measure 0.30 m. The frequency is 5 Hz. What is the speed of the ripples?', ['0.030 m/s', '1.5 m/s', '6 m/s', '0.15 m/s'], 3, 'Find one wavelength first, then use v = f × λ.', ['One wavelength = 0.30 ÷ 10 = 0.030 m.', 'v = f × λ = 5 × 0.030 = 0.15 m/s.'], 'calculation'),
  speed.choice('P55-07', 'Why is a ripple tank suitable for finding wave speed?', ['It makes the waves travel faster', 'It needs no signal generator', 'It lets you measure the wavelength without disturbing the waves', 'It only works for very low frequencies'], 2, 'Think about the shadows.', ['The shadows let you measure the wavelength.', 'You do not need to touch or disturb the waves.']),
  t(string, 'P55-08', 'How do you use a vibrating string?'),
  string.choice('P55-09', 'A vibrating string 0.90 m long has 3 loops on it. What is one wavelength?', ['0.30 m', '0.60 m', '0.90 m', '2.7 m'], 1, 'Each loop is half a wavelength.', ['3 loops is 1.5 wavelengths.', '0.90 ÷ 1.5 = 0.60, so one wavelength is 0.60 m.'], 'calculation'),
  string.choice('P55-10', 'Why is a vibrating string suitable for investigating waves?', ['It works only with sound waves', 'It makes very short waves', 'It needs no signal generator', 'It is easy to see the wave and measure its wavelength'], 3, 'You can see the loops.', ['The wave on the string is easy to see.', 'So its wavelength is easy to measure.']),
  t(safety, 'P55-11', 'How do you stay safe?'),
  safety.choice('P55-12', 'Which is a sensible safety step when using the vibrating string set-up?', ['Wear safety goggles and keep your feet clear of the masses', 'Hold the string while it vibrates', 'Stand under the hanging masses', 'Add as many masses as you can'], 0, 'The masses could fall.', ['The masses could fall if the string slips or snaps.', 'Goggles protect your eyes, and keeping your feet clear protects them too.']),
  { ...string.choice('P55-13', 'The diagram shows a vibrating string. Use its length and the number of loops to find one wavelength.', ['0.30 m', '1.2 m', '0.60 m', '2.4 m'], 2, 'Two loops make one wavelength.', ['4 loops is 2 wavelengths.', '1.2 ÷ 2 = 0.60, so one wavelength is 0.60 m.'], 'calculation', true, 'waveprac-q-string') },
  { ...speed.choice('P55-14', 'In a ripple tank, ten wavelengths measure 0.24 m on the screen. The frequency is 5 Hz. What is the wave speed?', ['0.024 m/s', '0.12 m/s', '1.2 m/s', '0.48 m/s'], 1, 'Divide by ten first, then use v = f × λ.', ['One wavelength = 0.24 ÷ 10 = 0.024 m.', 'v = f × λ = 5 × 0.024 = 0.12 m/s.'], 'calculation', true) },
  { ...safety.choice('P55-15', 'A student spills water near the plug of a ripple tank. What should they do?', ['Ignore it', 'Turn up the signal generator', 'Carry on with the practical', 'Switch off, unplug and then wipe up the spill'], 3, 'Water and electricity do not mix.', ['Switch off and unplug the equipment first.', 'Then wipe up the water.'], 'application', true) },
  { ...ripple.choice('P55-16', 'Why do you measure ten wavelengths in the ripple tank instead of one?', ['Measuring ten and dividing gives a more accurate wavelength', 'The waves speed up', 'The frequency is ten times larger', 'One wavelength cannot be seen'], 0, 'One wavelength is a small distance to measure.', ['A small distance is hard to measure accurately.', 'Measuring ten wavelengths and dividing by ten gives a better average.'], 'understanding', true) },
  ripple.written('P55-17', 'Describe how to use a ripple tank to find the speed of water ripples.', 'Think about the frequency, the shadows, the ten wavelengths and the equation.', 'Attach a signal generator to the dipper to make ripples. The ripples have the frequency set on the signal generator. Use a lamp to make shadows of the ripples on a screen, with a metre ruler beside them. Measure the distance across ten wavelengths and divide by 10 to find one wavelength. Then use v = f × λ. Keep water away from the electrical connections.', ['A signal generator attached to the dipper sets the frequency.', 'A lamp makes shadows of the ripples on a screen, with a metre ruler beside them.', 'Measure across ten wavelengths and divide by 10.', 'Use v = f × λ.', 'Keeps water away from electrical equipment.'], ['Using a stopwatch to time the ripples.', 'Measuring only one wavelength as the final answer.', 'Multiplying the distance by 10.']),
]

export const lessonP55: ScienceLesson = {
  id: 'P-WAV-055-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Investigating waves', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
