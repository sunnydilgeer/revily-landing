import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { emUseFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.6.2.4 Uses and applications of electromagnetic waves (radio waves, microwaves, infrared), as on the supplied revision page' }
const skill = 'P-EMUSE'
const radio = author(skill, ['6.6.2.4'], ['aqa-physics'])
const micro = author(skill, ['6.6.2.4'], ['aqa-physics'])
const infra = author(skill, ['6.6.2.4'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const emUseSections = [
  { id: 'P58-01', label: 'Start here', detail: 'A car radio' },
  { id: 'P58-02', label: 'How are radio waves used?', detail: 'TV, radio and Bluetooth' },
  { id: 'P58-05', label: 'How do satellites use microwaves?', detail: 'Up to the satellite and back' },
  { id: 'P58-07', label: 'How does a microwave oven cook?', detail: 'Water absorbs the microwaves' },
  { id: 'P58-09', label: 'How is infrared used?', detail: 'Cameras, heaters and toasters' },
  { id: 'P58-12', label: 'On your own', detail: 'Choose the wave and explain' },
]

const states: ScienceState[] = [
  { ...radio.choice('P58-01', 'A car radio plays a programme from a distant studio, with no wire between them. What carries it to the car?', ['Sound waves in the air', 'Radio waves', 'Water waves', 'Waves from the engine'], 1, 'Think about which EM wave the radio is named after.', ['The programme is sent as radio waves.', 'The aerial of the car receives them.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(radio, 'P58-02', 'How are radio waves used?'),
  radio.choice('P58-03', 'Which radio waves can travel the furthest?', ['Radio waves with a shorter wavelength', 'Bluetooth signals', 'Radio waves with a longer wavelength', 'FM radio signals'], 2, 'Think about how long the wavelength is.', ['Radio waves with a longer wavelength travel further.', 'They can be used to send signals around the world.']),
  radio.choice('P58-04', 'What is Bluetooth used for?', ['Sending data over very short distances without wires', 'Sending signals around the world', 'Cooking food', 'Seeing hot objects in the dark'], 0, 'Bluetooth uses very short radio waves.', ['Bluetooth uses radio waves with a very short wavelength.', 'They only travel a short distance, for example to wireless headphones.']),
  t(micro, 'P58-05', 'How do satellites use microwaves?'),
  micro.choice('P58-06', 'A satellite receives a microwave signal from a dish on Earth. What does it do next?', ['Absorbs it and stores it', 'Turns it into sound', 'Sends it further into space', 'Sends it back to Earth in a different direction'], 3, 'The signal has to reach another dish on the ground.', ['The satellite sends the signal back to Earth.', 'It goes in a different direction, so another dish can receive it.']),
  t(micro, 'P58-07', 'How does a microwave oven cook?'),
  micro.choice('P58-08', 'In a microwave oven, what mainly absorbs the microwaves?', ['The plate', 'The water in the food', 'The air in the oven', 'The oven door'], 1, 'Think about what most food contains.', ['Most food contains water, and the water absorbs the microwaves.', 'The water heats up and then heats the rest of the food.']),
  t(infra, 'P58-09', 'How is infrared used?'),
  infra.choice('P58-10', 'A survey uses an infrared camera on a house. Why is this useful?', ['It shows where the most energy is being lost from the house', 'It measures the air pressure', 'It makes the house warmer', 'It cooks the walls'], 0, 'Hotter parts give out more infrared.', ['An infrared camera detects the infrared radiation from the walls and roof.', 'The redder the colour, the more energy is being lost there.']),
  infra.choice('P58-11', 'Object A is hot and object B is cold. Which statement is correct?', ['Object B gives out more infrared radiation', 'They give out the same amount', 'Object A gives out more infrared radiation, because it is hotter', 'Neither gives out any infrared radiation'], 2, 'All objects give out infrared radiation.', ['The hotter an object is, the more infrared radiation it gives out.', 'So the hot object A gives out more.']),
  radio.choice('P58-12', 'A rescue team wants to find a warm person in a dark field. Which type of EM wave should their camera detect?', ['Radio waves', 'Microwaves', 'Ultraviolet', 'Infrared'], 3, 'Warm objects give out more of one type of EM wave.', ['A warm person gives out more infrared radiation than the cold field.', 'An infrared camera detects this and shows where the person is.'], 'application', true),
  micro.choice('P58-13', 'Which numbered arrow shows the microwave signal being sent back to Earth from the satellite?', ['Arrow 1', 'Arrow 2', 'Both arrows', 'Neither arrow'], 1, 'Follow the signal from the first dish, up to the satellite, and down again.', ['Arrow 1 goes from the dish up to the satellite.', 'Arrow 2 goes from the satellite back down to Earth.'], 'dataInterpretation', true, 'emuse-q-satellite'),
  micro.choice('P58-14', 'Which statement explains how a microwave oven heats a bowl of soup?', ['Microwaves are absorbed by the water in the soup, which transfers energy to it', 'The soup gives out microwaves', 'Microwaves are absorbed by the air, which warms the bowl', 'Radio waves are absorbed by the bowl'], 0, 'What absorbs the microwaves, and where does the energy go?', ['The water in the soup absorbs the microwaves.', 'Energy is transferred to the water molecules, so the soup heats up.'], 'understanding', true),
  micro.written('P58-15', 'Explain how a microwave oven cooks a piece of food.', 'Follow the energy: oven, microwaves, water, the rest of the food.', 'The oven gives out microwaves. The water in the food absorbs the microwaves. Energy carried by the microwaves is transferred to the water molecules, so they heat up. The hot water heats the rest of the food, and the food cooks.', ['The oven gives out microwaves.', 'The water in the food absorbs the microwaves.', 'Energy is transferred to the water molecules, which heat up.', 'The heat spreads to the rest of the food, which cooks.'], ['Saying the microwaves are heat.', 'Saying the food is heated from outside like a flame.', 'Saying the oven uses radio waves or infrared only.']),
]

export const lessonP58: ScienceLesson = {
  id: 'P-WAV-058-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Uses of radio waves, microwaves and infrared', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
