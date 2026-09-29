import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { energyTrendFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.1.3 Energy resources (trends in the use of energy resources; factors limiting the use of renewables: money, politics, people), as on the supplied revision page' }
const skill = 'P-TRENDS'
const change = author(skill, ['6.1.3'], ['aqa-physics'])
const want = author(skill, ['6.1.3'], ['aqa-physics'])
const limit = author(skill, ['6.1.3'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const energyTrendSections = [
  { id: 'P14-01', label: 'Start here', detail: 'Gadgets in the home' },
  { id: 'P14-02', label: 'How has electricity use changed?', detail: 'Rising, then slowly falling' },
  { id: 'P14-05', label: 'Why do people want more renewables?', detail: 'The chain of pressure' },
  { id: 'P14-08', label: 'What holds renewables back?', detail: 'Money, politics and people' },
  { id: 'P14-11', label: 'On your own', detail: 'Reading trends and giving reasons' },
]

const states: ScienceState[] = [
  { ...change.choice('P14-01', 'Homes now have many more electrical gadgets than 100 years ago. What happened to electricity use in the 20th century?', ['It stayed exactly the same', 'It increased a lot', 'It fell steadily', 'It was only used in winter'], 1, 'Think about how many things in a home use electricity.', ['More people and more electrical things means more electricity is used.', 'Electricity use increased a lot in the 20th century.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(change, 'P14-02', 'How has electricity use changed?'),
  change.choice('P14-03', 'Which is a reason why electricity use in the UK rose in the 20th century?', ['More people, and more things that use electricity', 'Appliances became less efficient', 'People became more careful with energy', 'The Sun became brighter'], 0, 'Think about the number of people and the number of gadgets.', ['The population increased.', 'The number of things that use electricity also increased.'], 'recall'),
  change.choice('P14-04', 'Which is a reason why UK electricity use has slowly fallen since the early 2000s?', ['Appliances have become less efficient', 'More people have moved to the UK', 'Appliances have become more efficient', 'Electricity has become free'], 2, 'An efficient appliance wastes less energy.', ['Appliances are being made more efficient, so they need less electricity.', 'People are also being more careful with their energy use.']),
  t(want, 'P14-05', 'Why do people want more renewables?'),
  want.choice('P14-06', 'Why do many people want more renewable energy resources?', ['Renewable resources are always cheaper', 'Fossil fuels will never run out', 'Burning fossil fuels is very damaging to the environment', 'Renewables can always increase their output on demand'], 2, 'Think about what burning fossil fuels does.', ['Burning fossil fuels is very damaging to the environment.', 'Renewables are better for the environment.']),
  want.choice('P14-07', 'Why might an energy provider build new renewable power plants?', ['To make cars run on petrol', 'To use up fossil fuels faster', 'To cause more pollution', 'To avoid losing business and money as governments set targets'], 3, 'Think about the pressure from the government.', ['Governments set targets for using renewables.', 'Energy providers could lose business and money if they do not build renewable power plants.']),
  t(limit, 'P14-08', 'What holds renewables back?'),
  limit.choice('P14-09', 'Which is an example of money limiting the use of renewables?', ['Scientists have no evidence for renewables', 'Building new renewable power plants costs money', 'Wind farms are always popular', 'Renewables always run out'], 1, 'Think about what it costs to build.', ['Building new renewable power plants costs money.', 'More research is also needed to make them cheaper and more reliable.']),
  limit.choice('P14-10', 'A village does not want a wind farm built next to it. Which factor is this?', ['Money', 'Evidence', 'Politics', 'People'], 3, 'The three factors are money, politics and people.', ['Many people do not want to live near a power plant such as a wind farm.', 'This limit comes from people.']),
  change.choice('P14-11', 'Look at the graph. Which statement describes the change from B to C?', ['Electricity use slowly decreased', 'Electricity use rose quickly', 'Electricity use stayed the same', 'Electricity use doubled'], 0, 'Follow the line from B to C. Is it going up or down?', ['From B to C the line bends gently downwards.', 'So electricity use slowly decreased.'], 'dataInterpretation', true, 'etrend-q-graph'),
  change.choice('P14-12', 'Which is the best reason for the change from B to C?', ['The population fell sharply', 'Fewer power plants were built', 'Electricity was banned', 'Appliances became more efficient and people used energy more carefully'], 3, 'Think about waste and care.', ['Efficient appliances need less electricity.', 'People are also more careful with their energy use.'], 'understanding', true),
  want.choice('P14-13', 'A government sets a target for more electricity from renewable resources. What does this put pressure on energy providers to do?', ['Burn more coal', 'Stop supplying electricity', 'Build new power plants that use renewable resources', 'Raise the price of petrol'], 2, 'Providers could lose business if they ignore the target.', ['Energy providers are pushed to build new renewable power plants.', 'If they do not, they could lose business and money.'], 'application', true),
  limit.choice('P14-14', 'Which statement about why we do not use more renewables is correct?', ['Scientists can force governments to switch', 'There is no scientific evidence for renewables', 'The use of renewables is limited by money, politics and people', 'All renewables can increase their output on demand'], 2, 'Scientists can only give advice.', ['There is a lot of scientific evidence, but scientists cannot make people change.', 'The use of renewables is limited by money, politics and people.'], 'understanding', true),
  limit.written('P14-15', 'Give two reasons why the UK does not use more renewable resources, and one reason why people want more of them.', 'Think of money, politics and people. Then think of the environment.', 'Building new renewable power plants costs money, and more research is needed to make renewables cheaper and more reliable. Some people also do not want to live near a wind farm or a hydro-electric dam, and some do not want to pay higher bills or taxes. However, many people want more renewables because burning fossil fuels is very damaging to the environment, and because fossil fuels will run out one day.', ['A first limit, with a reason, such as the cost of building or research.', 'A second limit from a different factor, such as politics or people.', 'A reason people want more renewables, such as burning fossil fuels damages the environment.', 'A second reason, such as fossil fuels running out, or pressure on governments.'], ['Saying that renewables give out more pollution than fossil fuels.', 'Saying that scientists decide what energy resources a country uses.', 'Saying that renewables will run out first.']),
]

export const lessonP14: ScienceLesson = {
  id: 'P-RES-014-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Trends in energy resource use', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
