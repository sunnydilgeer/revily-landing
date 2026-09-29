import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { energyResourceFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.1.3 Energy resources (renewable and non-renewable resources; uses for transport, heating and generating electricity), as on the supplied revision page' }
const skill = 'P-ENERGY-RESOURCES'
const kinds = author(skill, ['6.1.3'], ['aqa-physics'])
const transport = author(skill, ['6.1.3'], ['aqa-physics'])
const heating = author(skill, ['6.1.3'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const energyResourceSections = [
  { id: 'P10-01', label: 'Start here', detail: 'Which one runs out?' },
  { id: 'P10-02', label: 'Which resources run out?', detail: 'Renewable and non-renewable resources' },
  { id: 'P10-05', label: 'How do vehicles use them?', detail: 'Petrol, diesel, bio-fuel and electricity' },
  { id: 'P10-08', label: 'How do we heat buildings?', detail: 'Burning fuels, hot rocks, sunlight and electricity' },
  { id: 'P10-11', label: 'On your own', detail: 'Sorting, using and explaining resources' },
]

const states: ScienceState[] = [
  { ...kinds.choice('P10-01', 'Which of these will one day run out?', ['Sunlight', 'Coal', 'Wind', 'Ocean tides'], 1, 'Think about which one is dug up and used, and is not replaced.', ['Coal was formed over millions of years, and we use it much faster than it forms.', 'Sunlight, wind and tides are replaced all the time, so they do not run out.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(kinds, 'P10-02', 'Which resources run out?'),
  kinds.choice('P10-03', 'Which list contains only renewable energy resources?', ['Coal, wind, solar', 'Oil, tides, natural gas', 'Solar, wind, tides', 'Nuclear fuel, wind, tides'], 2, 'Check each list for a fossil fuel or nuclear fuel.', ['Solar, wind and tides are all renewable.', 'The other lists each contain coal, oil, natural gas or nuclear fuel, which are non-renewable.'], 'recall'),
  kinds.choice('P10-04', 'A friend says natural gas is renewable because there is a lot of it. What is wrong?', ['It is a fossil fuel, so it will run out one day', 'Gas cannot be burnt', 'It is only used for transport', 'It is a form of bio-fuel'], 0, 'Renewable means it can be replaced as fast as it is used.', ['Natural gas is a fossil fuel. It takes millions of years to form, so it cannot be replaced as fast as we use it.', 'A large supply does not make a resource renewable. It will still run out.'], 'understanding'),
  t(transport, 'P10-05', 'How do vehicles use them?'),
  transport.choice('P10-06', 'A car runs on a mix of petrol and bio-fuel. Which statement is correct?', ['Both are renewable', 'Petrol is made from oil, which is non-renewable, and bio-fuel is renewable', 'Both are non-renewable', 'Bio-fuel is made from oil'], 1, 'Where does petrol come from?', ['Petrol is made from oil, a fossil fuel, so it is non-renewable.', 'Bio-fuel is made from plants or waste and is renewable.'], 'application'),
  transport.choice('P10-07', 'An electric train uses electricity. When is its energy from a renewable resource?', ['Always', 'Never', 'Only at night', 'Only if the electricity was generated using renewable resources'], 3, 'Think about how the electricity was generated.', ['Electricity can be generated using renewable or non-renewable resources.', 'The train is only powered by a renewable resource if the electricity came from one.'], 'understanding'),
  t(heating, 'P10-08', 'How do we heat buildings?'),
  heating.choice('P10-09', 'How does a gas boiler help to heat a building?', ['Water is burnt in the boiler', 'The radiators burn the gas', 'Natural gas is burnt to heat water, which is pumped to radiators', 'Solar cells heat the gas'], 2, 'Follow the path from the gas to the radiators.', ['Natural gas is burnt in the boiler and transfers energy to water.', 'The hot water is pumped to the radiators, which warm the rooms.'], 'understanding'),
  heating.choice('P10-10', 'Which of these heats a building without burning any fuel?', ['A gas boiler', 'A fire burning bio-fuel', 'A coal fire', 'A solar water heater'], 3, 'Look for the one that uses sunlight.', ['A solar water heater uses the Sun to heat water, so no fuel is burnt.', 'The others all burn a fuel.'], 'application'),
  kinds.choice('P10-11', 'Which numbered cards show non-renewable energy resources?', ['1 and 3', '1 and 2', '2 and 4', '3 and 4'], 0, 'Fossil fuels and nuclear fuel are non-renewable.', ['Card 1 is coal, a fossil fuel, and card 3 is nuclear fuel. Both are non-renewable.', 'Card 2 is wind and card 4 is tides. Both are renewable.'], 'recall', true, 'eres-q-cards'),
  kinds.choice('P10-12', 'Which statement about renewable energy resources is correct?', ['They will run out sooner than fossil fuels', 'They never run out, but some are unreliable because they depend on the weather', 'None of them ever damage the environment', 'All of them are very reliable'], 1, 'Think about wind and sunshine.', ['Renewable resources are replaced as they are used, so they never run out.', 'Some, such as wind and solar, depend on the weather. Most still cause some damage to the environment.'], 'understanding', true),
  heating.choice('P10-13', 'A geothermal heat pump heats a building. Which energy resource does it use?', ['Coal that is burnt in a boiler', 'Sunlight falling on the roof', 'Nuclear fuel', 'Energy stored in hot rocks under the ground'], 3, 'Geo means Earth.', ['A geothermal heat pump uses energy from hot rocks under the ground.', 'This is a renewable resource, and no fuel is burnt.'], 'application', true),
  kinds.choice('P10-14', 'Fossil fuels are often chosen for power stations. Which is a good reason?', ['They are harmless to the environment', 'They are renewable', 'They are reliable sources of energy', 'They are free to use'], 2, 'Think about what they can do all the time.', ['Fossil fuels are reliable: they can supply energy whenever it is needed.', 'They will run out one day, they damage the environment, and they are not free.'], 'understanding', true),
  kinds.written('P10-15', 'Explain the difference between renewable and non-renewable energy resources. Give two examples of each, and one use of an energy resource.', 'Say what happens to each type over time, then give examples.', 'Non-renewable resources will run out one day because they are used faster than they are replaced. Examples are coal and nuclear fuel. Renewable resources can be replaced as they are used, so they never run out. Examples are wind and solar. Energy resources can be used to generate electricity, for transport or for heating.', ['Non-renewable resources will run out one day.', 'Renewable resources never run out because they are replaced as they are used.', 'Two correct non-renewable examples, such as coal, oil, natural gas or nuclear fuel.', 'Two correct renewable examples, such as solar, wind, tides, waves, hydro-electricity, bio-fuel or geothermal.', 'One correct use, such as generating electricity, transport or heating.'], ['Putting natural gas or nuclear fuel under renewable.', 'Saying renewable resources cause no damage at all.', 'Saying non-renewable resources are the ones that are not used.']),
]

export const lessonP10: ScienceLesson = {
  id: 'P-RES-010-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Energy resources and their uses', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
