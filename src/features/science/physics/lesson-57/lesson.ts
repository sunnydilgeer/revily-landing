import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { emSpectrumFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.6.2.1 Types of electromagnetic waves and 6.6.2.3 Properties of electromagnetic waves 2 (continuous spectrum, atoms producing and absorbing EM waves), as on the supplied revision page' }
const skill = 'P-EMWAVE'
const transfer = author(skill, ['6.6.2.1'], ['aqa-physics'])
const spectrum = author(skill, ['6.6.2.1'], ['aqa-physics'])
const atoms = author(skill, ['6.6.2.3'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const emSpectrumSections = [
  { id: 'P57-01', label: 'Start here', detail: 'Warmth from a fire' },
  { id: 'P57-02', label: 'How do EM waves transfer energy?', detail: 'Source, absorber and speed' },
  { id: 'P57-05', label: 'What is the EM spectrum?', detail: 'Seven groups in order' },
  { id: 'P57-09', label: 'Where do EM waves come from?', detail: 'Changes in atoms' },
  { id: 'P57-12', label: 'On your own', detail: 'Order, speed and energy' },
]

const states: ScienceState[] = [
  { ...transfer.choice('P57-01', 'You hold your hands out beside a campfire, not above it, and they feel warm. How does energy reach your hands?', ['Sound waves carry it from the fire', 'Waves carry energy from the fire to your hands', 'Your hands send cold to the fire', 'The flames touch your hands'], 1, 'Nothing is touching your hands and the air is not carrying it.', ['The fire gives out waves that carry energy.', 'Your hands absorb the waves and warm up.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(transfer, 'P57-02', 'How do EM waves transfer energy?'),
  transfer.choice('P57-03', 'What is the name for the place that takes in EM waves and gains their energy?', ['Source', 'Absorber', 'Vacuum', 'Spectrum'], 1, 'The source gives out waves. What takes them in?', ['The source gives out the waves.', 'The absorber takes them in and gains the energy.'], 'recall'),
  transfer.choice('P57-04', 'Which statement about the speed of EM waves is correct?', ['Radio waves are faster than light in a vacuum', 'Infrared is slower than gamma rays in a vacuum', 'All EM waves travel at the same speed in a vacuum', 'EM waves are slower than sound in air'], 2, 'Think about lightning and thunder.', ['All EM waves travel at the same speed through air or a vacuum.', 'That speed is much faster than sound.']),
  t(spectrum, 'P57-05', 'What is the EM spectrum?'),
  spectrum.choice('P57-06', 'Which list shows the EM waves in order, from longest wavelength to shortest?', ['Gamma rays, X-rays, ultraviolet, visible light', 'Radio waves, microwaves, infrared, visible light', 'Infrared, microwaves, radio waves, visible light', 'Visible light, infrared, microwaves, radio waves'], 1, 'Radio waves come first in the spectrum.', ['The order starts with radio waves and goes microwaves, infrared, visible light.', 'The wavelength gets shorter each step.'], 'recall'),
  spectrum.choice('P57-07', 'Which group of EM waves has the highest frequency?', ['Radio waves', 'Infrared', 'Microwaves', 'Gamma rays'], 3, 'Shorter wavelength means higher frequency.', ['Gamma rays have the shortest wavelength.', 'So they have the highest frequency.'], 'recall'),
  spectrum.choice('P57-08', 'How much of the EM spectrum can human eyes detect?', ['All of it', 'Only the radio waves', 'Only visible light, which is a small part', 'Everything except gamma rays'], 2, 'Think about the name of the group we can see.', ['Our eyes detect visible light only.', 'This is a small part of the whole spectrum.']),
  t(atoms, 'P57-09', 'Where do EM waves come from?'),
  atoms.choice('P57-10', 'Which of these can produce gamma rays?', ['A radio aerial', 'Electrons moving between energy levels', 'A cold object', 'A change in the nucleus of an atom'], 3, 'Think about what changes inside the atom.', ['Changes in the nucleus of an atom can produce gamma rays.', 'Electrons moving between energy levels produce other EM waves.']),
  atoms.choice('P57-11', 'Why can atoms produce EM waves of many different frequencies?', ['Each different change in an atom gives a different frequency', 'Atoms only change in one way', 'Atoms change in the same way every time', 'Atoms are very hot'], 0, 'There are lots of different changes in atoms.', ['Each different change produces a different frequency.', 'With lots of changes, atoms can produce a large range of frequencies.']),
  transfer.choice('P57-12', 'Which group of EM waves belongs in the box marked with a question mark?', ['Ultraviolet', 'Microwaves', 'Infrared', 'X-rays'], 2, 'Read the order along the spectrum. Which group sits between microwaves and visible light?', ['The order is radio waves, microwaves, infrared, visible light.', 'So the missing group is infrared.'], 'dataInterpretation', true, 'emspec-q-spectrum'),
  transfer.choice('P57-13', 'Radio waves and gamma rays both travel through a vacuum. Which statement is correct?', ['They travel at the same speed', 'Gamma rays travel faster', 'Radio waves travel faster', 'Neither can travel through a vacuum'], 0, 'What do all EM waves have in common in a vacuum?', ['All EM waves travel at the same speed in a vacuum.', 'So radio waves and gamma rays are equally fast.'], 'application', true),
  spectrum.choice('P57-14', 'A student says: "Ultraviolet has a longer wavelength than infrared." What is the correct statement?', ['Ultraviolet has a lower frequency than infrared', 'Ultraviolet and infrared have the same wavelength', 'Ultraviolet is not an EM wave', 'Ultraviolet has a shorter wavelength than infrared'], 3, 'Which comes later in the spectrum, ultraviolet or infrared?', ['Ultraviolet comes after infrared in the spectrum.', 'So it has a shorter wavelength and a higher frequency.'], 'application', true),
  transfer.written('P57-15', 'A glowing electric heater warms a person sitting across the room. Explain how energy gets from the heater to the person.', 'Name the source, the waves, and what the person does with them.', 'The heater is the source. It gives out infrared radiation, which is a type of EM wave. The waves travel across the room to the person. The person absorbs the infrared waves. Energy is transferred to the thermal energy stores of the person, so they warm up.', ['The heater is the source that gives out infrared radiation.', 'Infrared is an EM wave that carries energy across the room.', 'The person is the absorber and absorbs the waves.', 'Energy is transferred to the thermal store of the person.', 'This makes the person warm up.'], ['Saying heat travels as sound waves.', 'Saying the person is the source.', 'Saying the waves are used up without being absorbed.']),
]

export const lessonP57: ScienceLesson = {
  id: 'P-WAV-057-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Electromagnetic waves', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
