import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { waveTypeFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.6.1.1 Transverse and longitudinal waves and 6.6.1.2 Properties of waves (amplitude, wavelength, frequency, period), as on the supplied revision page' }
const skill = 'P-WAVETYPE'
const energy = author(skill, ['6.6.1.1'], ['aqa-physics'])
const kinds = author(skill, ['6.6.1.1'], ['aqa-physics'])
const words = author(skill, ['6.6.1.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const waveTypeSections = [
  { id: 'P53-01', label: 'Start here', detail: 'A twig on a pond' },
  { id: 'P53-02', label: 'What does a wave carry?', detail: 'Energy, not matter' },
  { id: 'P53-05', label: 'What are the two types of wave?', detail: 'Transverse and longitudinal' },
  { id: 'P53-08', label: 'How do we describe a wave?', detail: 'Amplitude, wavelength, frequency, period' },
  { id: 'P53-11', label: 'On your own', detail: 'Identify, read and explain' },
]

const states: ScienceState[] = [
  { ...energy.choice('P53-01', 'A twig floats on a pond. Ripples spread out across the water and pass the twig. What happens to the twig?', ['It is carried across the pond', 'It sinks to the bottom', 'It bobs up and down but stays about where it is', 'It moves faster than the ripples'], 2, 'Think about what a ripple carries.', ['The water particles vibrate as the ripple passes.', 'They stay in about the same place, so the twig only bobs up and down.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(energy, 'P53-02', 'What does a wave carry?'),
  energy.choice('P53-03', 'What does a wave transfer from one place to another?', ['Matter only', 'Energy but not matter', 'Matter but not energy', 'Neither energy nor matter'], 1, 'The particles stay where they are.', ['Waves transfer energy.', 'They do not transfer any matter.']),
  energy.choice('P53-04', 'You strum a guitar. How do you know sound waves do not carry the air away from it?', ['You would feel a wind whenever there was a sound', 'Sound is not a wave', 'Air is too heavy to move', 'Guitars are quiet'], 0, 'Think about what you would feel if air were carried along.', ['If air were carried away, you would feel a wind whenever there was a sound.', 'You do not, so only energy is transferred.']),
  t(kinds, 'P53-05', 'What are the two types of wave?'),
  kinds.choice('P53-06', 'Which of these is a transverse wave?', ['A sound wave in air', 'Pushing the end of a spring in and out', 'A wave on a string', 'None of these'], 2, 'The vibrations are at right angles to the direction of travel.', ['A wave on a string is transverse.', 'Sound waves and a pushed spring are longitudinal.']),
  kinds.choice('P53-07', 'In a longitudinal wave, what do we call the places where the particles are squashed together?', ['A rarefaction', 'A trough', 'A crest', 'A compression'], 3, 'Think of the word for squashing.', ['Squashed together is a compression.', 'Where they spread out is a rarefaction.'], 'recall'),
  t(words, 'P53-08', 'How do we describe a wave?'),
  words.choice('P53-09', 'The diagram shows a wave with four numbered arrows. Which arrow shows the wavelength?', ['Arrow 1', 'Arrow 2', 'Arrow 3', 'Arrow 4'], 1, 'Wavelength is the distance from one point to the same point on the next wave.', ['Arrow 2 goes from one crest to the next crest.', 'That distance is one wavelength.'], 'understanding', false, 'wavetype-q-wave'),
  words.choice('P53-10', 'What is the unit of frequency?', ['Metres (m)', 'Seconds (s)', 'Hertz (Hz)', 'Joules (J)'], 2, 'It counts waves per second.', ['Frequency is measured in hertz.', '1 Hz is one wave per second.'], 'recall'),
  { ...kinds.choice('P53-11', 'Which of these is a longitudinal wave?', ['A wave on a string', 'Ripples on water', 'Light', 'A sound wave'], 3, 'The vibrations are in the same direction as the wave travels.', ['A sound wave is longitudinal.', 'Light, water ripples and waves on a string are transverse.'], 'understanding', true) },
  { ...words.choice('P53-12', 'A wave has a frequency of 5 Hz. What does this mean?', ['5 complete waves pass a point every second', 'The wave lasts for 5 seconds', 'The wave is 5 metres long', 'The wave has a period of 5 seconds'], 0, '1 Hz is one wave per second.', ['Frequency is the number of waves passing a point each second.', '5 Hz means 5 waves each second.'], 'understanding', true) },
  { ...words.choice('P53-13', 'Look at the diagram of two waves. Which wave has the larger amplitude?', ['Wave A', 'Wave B', 'They are the same', 'It depends on the wavelength'], 1, 'Amplitude is the height from the middle line to a crest.', ['Wave B rises higher above its rest position.', 'So Wave B has the larger amplitude.'], 'dataInterpretation', true, 'wavetype-q-compare') },
  { ...words.choice('P53-14', 'What is the period of a wave?', ['The number of waves per second', 'The distance between two crests', 'The time taken for one complete wave to pass a point', 'The maximum displacement'], 2, 'Period has to do with time.', ['The period is the time for one complete wave to pass a point.', 'Frequency is the number of waves per second.'], 'recall', true) },
  kinds.written('P53-15', 'Explain the difference between a transverse wave and a longitudinal wave. Give one example of each.', 'Think about the direction of the vibrations compared with the direction the wave travels.', 'In a transverse wave the vibrations are at right angles to the direction the wave travels. An example is light, or ripples on water. In a longitudinal wave the vibrations are in the same direction as the wave travels. An example is a sound wave.', ['Transverse: vibrations at right angles to the direction of travel.', 'A correct transverse example such as light, water ripples or a wave on a string.', 'Longitudinal: vibrations in the same direction as the wave travels.', 'A correct longitudinal example such as sound.'], ['Saying transverse waves carry matter.', 'Giving sound as a transverse wave.', 'Saying a longitudinal wave moves up and down.']),
]

export const lessonP53: ScienceLesson = {
  id: 'P-WAV-053-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Transverse and longitudinal waves', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
