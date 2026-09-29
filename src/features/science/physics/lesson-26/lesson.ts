import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { gridFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.2.4.3 Energy transfers in everyday appliances (the National Grid), as on the supplied revision page' }
const skill = 'P-GRID'
const what = author(skill, ['6.2.4.3'], ['aqa-physics'])
const demand = author(skill, ['6.2.4.3'], ['aqa-physics'])
const highpd = author(skill, ['6.2.4.3'], ['aqa-physics'])
const transformers = author(skill, ['6.2.4.3'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const gridSections = [
  { id: 'P26-01', label: 'Start here', detail: 'Where home electricity comes from' },
  { id: 'P26-02', label: 'What is the National Grid?', detail: 'Cables and transformers, power stations to consumers' },
  { id: 'P26-05', label: 'How does it keep up with demand?', detail: 'Demand changes; stations have room to spare' },
  { id: 'P26-08', label: 'Why a high pd and a low current?', detail: 'Less energy wasted as heat' },
  { id: 'P26-11', label: 'What do transformers do?', detail: 'Step-up and step-down along the route' },
  { id: 'P26-14', label: 'On your own', detail: 'Demand, high pd and transformers' },
]

const states: ScienceState[] = [
  { ...what.choice('P26-01', 'Most homes in Britain are far from a power station. How does the electricity get there?', ['Each house makes its own in the wall', 'Through a network of cables that links power stations to homes', 'It is delivered in batteries by lorry', 'It travels through the air as a beam'], 1, 'Think about the cables you can see on pylons and underground.', ['Electricity is carried from power stations to homes along cables.', 'The whole network of cables and transformers is called the National Grid.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(what, 'P26-02', 'What is the National Grid?'),
  what.choice('P26-03', 'What is the National Grid?', ['A network of cables and transformers that transfers electrical power from power stations to consumers', 'One very large power station', 'A store that keeps electricity for the whole country', 'A set of batteries in every house'], 0, 'It is a system that carries electricity, not something that makes or stores it.', ['The National Grid is a system of cables and transformers.', 'It covers Great Britain and links power stations to consumers.'], 'recall'),
  what.choice('P26-04', 'Which of these is a consumer on the National Grid?', ['A transformer', 'A power station', 'A family using a kettle', 'A transmission cable'], 2, 'A consumer is anyone who is using electricity.', ['A consumer is anyone using electricity.', 'A family boiling a kettle is using electricity from the grid.']),
  t(demand, 'P26-05', 'How does it keep up with demand?'),
  demand.choice('P26-06', 'What is meant by the demand on the National Grid?', ['The number of power stations', 'How much power a power station could make at most', 'The length of cable in the grid', 'The amount of electricity being used at that time'], 3, 'It is about what people are using, not what could be made.', ['Demand is the amount of electricity being used at a given time.', 'It changes through the day.']),
  demand.choice('P26-07', 'Why do power stations often run below their maximum power output?', ['To save money on cables', 'So they can increase their output when demand rises', 'Because they cannot make more than that', 'So that consumers use less electricity'], 1, 'Think about what you need if demand suddenly goes up.', ['Running below maximum leaves room to spare.', 'The stations can then increase their output quickly when demand rises.']),
  t(highpd, 'P26-08', 'Why a high pd and a low current?'),
  highpd.choice('P26-09', 'Why does the National Grid transfer electricity at a very high pd?', ['So the current is low and the cables lose less energy by heating', 'So the current is as high as possible', 'So the cables glow and light the road', 'So the electricity travels faster'], 0, 'For a given power, a high pd means a low current.', ['A high pd means a low current for the same power.', 'A low current heats the cables less, so less energy is wasted.']),
  highpd.choice('P26-10', 'Two cables each transfer 1000 W, one at 100 V and one at 10 000 V. Which has the smaller current?', ['The 100 V cable', 'They have the same current', 'The 10 000 V cable', 'They cannot be compared'], 2, 'For the same power, the higher pd goes with the lower current.', ['At 100 V the current is 1000 ÷ 100 = 10 A.', 'At 10 000 V the current is 1000 ÷ 10 000 = 0.1 A, so the 10 000 V cable has the smaller current.'], 'understanding'),
  t(transformers, 'P26-11', 'What do transformers do?'),
  transformers.choice('P26-12', 'What does a step-down transformer do on the National Grid?', ['It increases the pd for the long cables', 'It stores energy for later', 'It generates electricity', 'It decreases the pd to a safe level before homes'], 3, 'It works near the end of the journey.', ['A step-down transformer brings the pd back down.', 'This makes the electricity safe for consumers.']),
  transformers.choice('P26-13', 'In the diagram, which numbered point shows a step-up transformer?', ['Point 2', 'Point 1', 'Both points', 'Neither point'], 1, 'The pd is raised straight after the power station.', ['A step-up transformer goes between the power station and the transmission cables.', 'That is point 1. Point 2 is the step-down transformer near the homes.'], 'understanding', false, 'grid-q-route'),
  { ...demand.choice('P26-14', 'On a cold, dark evening demand for electricity rises sharply. What can the National Grid do?', ['Switch off its transformers', 'Ask power stations running below maximum to increase their output', 'Lower the pd of the cables to zero', 'Wait for demand to fall'], 1, 'Think about the room to spare.', ['Power stations often run below their maximum output.', 'They can increase their output to meet the extra demand.'], 'application', true) },
  highpd.choice('P26-15', 'Cable A: 400 000 V, 2.5 A. Cable B: 4000 V, 250 A. Both carry the same power. Which wastes more energy?', ['Cable B, because its current is larger', 'Cable A, because its pd is larger', 'They lose the same amount', 'Cable A, because its current is smaller'], 0, 'A larger current heats the cable more.', ['Both carry the same power.', 'Cable B has the much larger current, so it heats up more and wastes more energy.'], 'dataInterpretation', true),
  transformers.choice('P26-16', 'Which list shows the route of electricity from the power station to a home?', ['Step-down transformer, cables, step-up transformer, home', 'Cables, step-up transformer, step-down transformer, home', 'Step-down transformer, step-up transformer, cables, home', 'Step-up transformer, cables, step-down transformer, home'], 3, 'The pd goes up first, then down again at the end.', ['The step-up transformer comes first, so the current in the cables is low.', 'The step-down transformer comes last, so the pd is safe at the home.'], 'recall', true),
  what.written('P26-17', 'Explain why the National Grid uses transformers and transfers electricity at a high pd.', 'Think about current, heating and the two kinds of transformer.', 'A step-up transformer raises the pd before the long transmission cables. For a given power, a higher pd means a lower current. A lower current heats the cables less, so less energy is wasted and the transfer is cheaper and more efficient. A step-down transformer then lowers the pd before the electricity reaches homes, so it is safe for consumers.', ['A step-up transformer increases the pd before the transmission cables.', 'A high pd means a low current for a given power.', 'A low current means the cables heat up less, so less energy is wasted (more efficient).', 'A step-down transformer decreases the pd before homes, so it is safe.'], ['Saying transformers make electricity.', 'Saying a high pd makes the current higher.', 'Saying the pd is kept high all the way into homes.']),
]

export const lessonP26: ScienceLesson = {
  id: 'P-ELE-026-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'The National Grid', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
