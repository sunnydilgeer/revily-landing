import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { greenhouseFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.9.2.1 to 5.9.2.3 Greenhouse gases and climate change (the greenhouse effect, human activities, evidence and models, effects of climate change), as on the supplied revision page' }
const skill = 'C-GREENHOUSE'
const effect = author(skill, ['5.9.2.1'], ['aqa-chemistry'])
const human = author(skill, ['5.9.2.1', '5.9.2.2'], ['aqa-chemistry'])
const evidence = author(skill, ['5.9.2.2'], ['aqa-chemistry'])
const results = author(skill, ['5.9.2.3'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const greenhouseSections = [
  { id: 'C46-01', label: 'Start here', detail: 'Why is the Earth warm?' },
  { id: 'C46-02', label: 'The greenhouse effect', detail: 'Four steps, Sun to surface' },
  { id: 'C46-05', label: 'What people add', detail: 'Human activities and greenhouse gases' },
  { id: 'C46-08', label: 'Climate change and the evidence', detail: 'Peer review, models and bias' },
  { id: 'C46-11', label: 'Possible effects', detail: 'Sea level, rain, storms and food' },
  { id: 'C46-13', label: 'On your own', detail: 'Explain and judge the evidence' },
]

const states: ScienceState[] = [
  { ...effect.choice('C46-01', 'Which of these best explains why the Earth is warm enough for life?', ['It is very close to the Sun', 'Clouds stop all cold from reaching it', 'Some gases in the atmosphere keep heat in', 'The oceans make their own heat'], 2, 'Think about the gases around the Earth.', ['Greenhouse gases in the atmosphere keep the Earth warm enough for life.', 'Distance from the Sun matters, but the gases keep heat in.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(effect, 'C46-02', 'The greenhouse effect'),
  effect.choice('C46-03', 'Which of these is a greenhouse gas?', ['Methane', 'Nitrogen', 'Oxygen', 'Argon'], 0, 'Carbon dioxide, methane and water vapour are three.', ['Methane is a greenhouse gas, like carbon dioxide and water vapour.', 'Nitrogen and oxygen make up most of the air but are not greenhouse gases.'], 'recall'),
  effect.choice('C46-04', 'What do greenhouse gases do with the thermal radiation from the Earth?', ['Let all of it escape to space', 'Turn it back into sunlight', 'Destroy it', 'Absorb it and give it out again in all directions'], 3, 'Some of it comes back down.', ['Greenhouse gases absorb the radiation and give it out in all directions.', 'Some heads back towards the Earth and warms the surface.']),
  t(human, 'C46-05', 'What people add to the atmosphere'),
  human.choice('C46-06', 'How does deforestation increase the carbon dioxide in the atmosphere?', ['Trees give out extra carbon dioxide when cut', 'Fewer trees means less carbon dioxide is taken in for photosynthesis', 'Trees turn into methane', 'It makes the Sun hotter'], 1, 'Trees take carbon dioxide in.', ['Trees take in carbon dioxide for photosynthesis.', 'With fewer trees, less is taken in and more stays in the air.']),
  human.choice('C46-07', 'Which human activity releases carbon dioxide when coal, oil or gas is used?', ['Growing rice in paddies', 'Cutting down trees', 'Keeping farm animals', 'Burning fossil fuels'], 3, 'It is about burning.', ['Burning fossil fuels releases carbon dioxide.', 'Farm animals and rice paddies mainly release methane.'], 'recall'),
  t(evidence, 'C46-08', 'Climate change and the evidence'),
  evidence.choice('C46-09', 'What has happened to the average temperature of the Earth’s surface recently?', ['It has gone down', 'It has stayed exactly the same', 'It has gone up', 'It has gone up and down every day only'], 2, 'Scientists agree on the direction.', ['The average temperature has gone up recently.', 'Scientists agree that extra carbon dioxide from human activity has caused this.'], 'recall'),
  evidence.choice('C46-10', 'Why is peer-reviewed evidence considered reliable?', ['Other scientists have checked it', 'It was on the news', 'It comes from one person', 'It is easy to understand'], 0, 'Who checks it?', ['Peer review means other scientists check the work before it is published.', 'That makes the information more reliable.']),
  t(results, 'C46-11', 'Possible effects of climate change'),
  results.choice('C46-12', 'What could happen as ice in the Arctic and Antarctic melts?', ['Sea levels fall', 'Sea levels rise and coastal areas may flood more', 'Rainfall stops everywhere', 'The Earth gets more trees'], 1, 'The water goes into the sea.', ['Melting ice makes sea levels rise.', 'This could lead to more flooding in coastal areas.']),
  effect.choice('C46-13', 'In the diagram, which arrow shows greenhouse gases giving out radiation in all directions?', ['Arrow 1', 'Arrow 2', 'Arrow 4', 'Arrow 3'], 3, 'Follow the steps in order.', ['The steps run in order: Sun, Earth, greenhouse gases, then some back to the surface.', 'Greenhouse gases giving out radiation in all directions is step 3.'], 'dataInterpretation', true, 'ghg-q-steps'),
  evidence.choice('C46-14', 'A news story about climate change is described as biased. What does this mean?', ['It favours one point of view without good evidence', 'It has been peer-reviewed', 'It was written by a scientist', 'It is a model of the climate'], 0, 'Bias means leaning one way.', ['A biased story favours one point of view.', 'It may not be backed up by facts or may only give some of the information.'], 'understanding', true),
  evidence.choice('C46-15', 'Why is it hard to make a good model of the Earth’s climate?', ['Carbon dioxide cannot be measured', 'Scientists disagree that temperature has risen', 'The climate is very complex, so a model is easily oversimplified', 'Models are never used in science'], 2, 'Think about how many things affect the climate.', ['The climate is very complex.', 'That makes it hard to build a model that is not oversimplified.'], 'understanding', true),
  human.choice('C46-16', 'Which pair of activities both increase the methane in the atmosphere?', ['Deforestation and burning coal', 'Keeping farm animals and waste breaking down in landfill', 'Planting trees and building solar panels', 'Growing crops and cycling'], 1, 'Think about animals and rubbish.', ['Farm animals give out methane when they digest food.', 'Waste breaking down in landfill sites also releases methane.'], 'application', true),
  effect.written('C46-17', 'Explain how greenhouse gases keep the Earth warm, and how human activities can make the Earth warmer.', 'Follow the radiation from the Sun to the surface, then add human activities.', 'The Sun gives out short wavelength radiation that reaches the Earth. The Earth absorbs it and gives out long wavelength thermal radiation. Greenhouse gases absorb this and give it out in all directions, so some heads back and warms the surface. This is the greenhouse effect. Human activities such as burning fossil fuels, deforestation, farming animals and rice, and creating waste increase the greenhouse gases, so more heat is sent back and the Earth warms up more.', ['The Earth gives out long wavelength thermal radiation after absorbing radiation from the Sun.', 'Greenhouse gases absorb this radiation and give it out in all directions.', 'Some of it heads back towards the Earth and warms the surface (the greenhouse effect).', 'Human activities such as burning fossil fuels or deforestation increase carbon dioxide, and farming and waste increase methane.', 'More greenhouse gases means more radiation sent back and a warmer surface.'], ['Saying greenhouse gases are made of glass or trap all the Sun’s light.', 'Saying the ozone layer is the cause of the greenhouse effect.', 'Saying only carbon dioxide is a greenhouse gas.']),
]

export const lessonC46: ScienceLesson = {
  id: 'C-ATM-046-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Greenhouse gases and climate change', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
