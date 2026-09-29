import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { recycleFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.10.1.1 and 5.10.2.2 Sustainable development, reuse and recycling of metals and glass, as on the supplied revision page' }
const skill = 'C-RECYCLING'
const future = author(skill, ['5.10.1.1'], ['aqa-chemistry'])
const metals = author(skill, ['5.10.2.2'], ['aqa-chemistry'])
const glass = author(skill, ['5.10.2.2'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const recycleSections = [
  { id: 'C50-01', label: 'Start here', detail: 'Throw it away or use it again?' },
  { id: 'C50-02', label: 'What is sustainable development?', detail: 'Thinking about the future' },
  { id: 'C50-05', label: 'Why recycle metals?', detail: 'Energy, supply and waste' },
  { id: 'C50-08', label: 'Reusing and recycling glass', detail: 'Bottles and jars' },
  { id: 'C50-11', label: 'On your own', detail: 'Reasons, data and explanation' },
]

const states: ScienceState[] = [
  { ...future.choice('C50-01', 'A glass bottle is empty. Which choice is usually best for saving materials and energy?', ['Put it in the bin', 'Bury it in the garden', 'Wash and refill it, or recycle it', 'Burn it'], 2, 'Think about using the material again.', ['Using the bottle again, or recycling it, saves new materials and energy.', 'Throwing it away wastes the glass.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(future, 'C50-02', 'What is sustainable development?'),
  future.choice('C50-03', 'What does sustainable development mean?', ['Meeting the needs of people today without damaging the lives of people in the future', 'Using up resources as quickly as possible', 'Only using resources that cost nothing', 'Making more waste each year'], 0, 'It looks after both today and tomorrow.', ['Sustainable development meets the needs of people today.', 'It does this without damaging the lives of people in the future.'], 'recall'),
  future.choice('C50-04', 'Which is a way to be more sustainable?', ['Use more finite resources', 'Use fewer finite resources by reusing and recycling', 'Stop all mining and all farming at once', 'Throw materials away after one use'], 1, 'Using less of a finite resource saves it.', ['Using less of a finite resource saves it and the energy needed to make it.', 'Reusing and recycling are ways to do this.']),
  t(metals, 'C50-05', 'Why recycle metals?'),
  metals.choice('C50-06', 'Where does most of the energy for mining and extracting metals come from?', ['The Sun', 'Burning fossil fuels', 'Recycled glass', 'Wind turbines only'], 1, 'Think about the fuels burned in industry.', ['Most of this energy comes from burning fossil fuels.', 'Fossil fuels are finite, so using less energy also helps sustainability.'], 'recall'),
  metals.choice('C50-07', 'Which is a benefit of recycling metals?', ['It uses more energy than making a new metal', 'It sends more waste to landfill', 'It saves some of the limited amount of the metal in the Earth', 'It makes the metal a different element'], 2, 'Look for the benefit, not the problem.', ['Recycling often uses much less energy, saves some of the limited metal supply and cuts waste to landfill.', 'The metal stays the same element.']),
  t(glass, 'C50-08', 'Reusing and recycling glass'),
  glass.choice('C50-09', 'What is done to glass that cannot be reused, before it is made into new products?', ['It is crushed and melted', 'It is buried', 'It is dissolved in water', 'It is frozen'], 0, 'Think about how glass is reshaped.', ['The glass is crushed and melted.', 'It is then reshaped to make products like jars.']),
  glass.choice('C50-10', 'Why does reusing a glass bottle save energy?', ['The bottle is melted twice', 'The bottle keeps its shape, so it does not need to be melted', 'The bottle is made of metal', 'The bottle is made into a jar'], 1, 'Think about what happens to the shape.', ['Reused bottles are washed and filled again without being reshaped.', 'No melting is needed, so very little energy is used.'], 'understanding'),
  metals.choice('C50-11', 'A factory melts used aluminium cans to make new cans instead of extracting aluminium from ore. What is the main saving?', ['Much less energy is needed', 'More waste is made', 'More ore is mined', 'The cans become heavier'], 0, 'Extraction takes a lot of energy.', ['Recycling often uses much less energy than making a new metal.', 'It also means less ore needs to be mined.'], 'application', true),
  metals.choice('C50-12', 'The chart shows energy to make a metal: 100 units from ore, 10 units from scrap. Which statement does it support?', ['Recycling uses less energy than extraction here', 'Recycling costs less money', 'Recycling makes no waste', 'Extraction is quicker'], 0, 'Only use what the chart shows.', ['The chart compares energy only.', '10 units is less than 100 units, so recycling uses less energy. It says nothing about cost or waste.'], 'dataInterpretation', true, 'recycle-q-energy'),
  future.choice('C50-13', 'Which is an example of reuse, not recycling?', ['Crushing and melting old jars', 'Melting scrap steel', 'Washing and refilling a glass bottle', 'Recasting used metal'], 2, 'In reuse, the item keeps its shape.', ['A washed and refilled bottle is used again as it is.', 'Melting or crushing is recycling.'], 'understanding', true),
  metals.choice('C50-14', 'Why can waste steel and iron often be recycled together?', ['They are the same element in different colours', 'Both can be added to iron in a blast furnace, so less ore is needed', 'They never need melting', 'They are both glass'], 1, 'The final product decides how much separation is needed.', ['Waste steel and iron can both be added to iron in a blast furnace.', 'This means less iron ore is needed.'], 'understanding', true),
  glass.written('C50-15', 'A town collects glass bottles and scrap metal from homes. Explain how this helps sustainable development.', 'Think about energy, limited supply and waste.', 'Recycling scrap metal usually uses much less energy than extracting new metal, and much of that energy comes from burning fossil fuels. It saves some of the limited amount of each metal in the Earth and cuts waste sent to landfill. Reusing or recycling glass also reduces the energy used to make new glass and the waste thrown away. This helps meet today’s needs without using up resources people will need in the future.', ['Recycling metal uses less energy than making new metal.', 'It saves some of the limited supply of metal.', 'It cuts the waste sent to landfill.', 'Reusing or recycling glass reduces the energy used for new glass.', 'Sustainable development meets today’s needs without harming people in the future.'], ['Saying recycling uses no energy at all.', 'Saying metals are renewable.', 'Saying recycling makes new metal from nothing.']),
]

export const lessonC50: ScienceLesson = {
  id: 'C-RES-050-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Reuse and recycling', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
