import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { atmosphereFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.9.1.1 to 5.9.1.4 Evolution of the atmosphere (early atmosphere, oceans, carbon dioxide removed, oxygen from algae and plants, proportions of gases today), as on the supplied revision page' }
const skill = 'C-ATMOSPHERE'
const early = author(skill, ['5.9.1.1', '5.9.1.2'], ['aqa-chemistry'])
const removed = author(skill, ['5.9.1.2', '5.9.1.3'], ['aqa-chemistry'])
const oxygen = author(skill, ['5.9.1.3', '5.9.1.4'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const atmosphereSections = [
  { id: 'C45-01', label: 'Start here', detail: 'What is in the air?' },
  { id: 'C45-02', label: 'Phase 1: volcanoes', detail: 'The early atmosphere and the oceans' },
  { id: 'C45-05', label: 'Phase 2: carbon dioxide removed', detail: 'Oceans, algae, plants and rocks' },
  { id: 'C45-08', label: 'Phase 3: oxygen', detail: 'Algae, plants and the air today' },
  { id: 'C45-11', label: 'On your own', detail: 'Order the story and read the air' },
]

const states: ScienceState[] = [
  { ...early.choice('C45-01', 'Which gas makes up the biggest share of the air we breathe today?', ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], 1, 'It is not the gas we need to breathe.', ['Air is about four fifths nitrogen.', 'Oxygen makes up only about one fifth.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(early, 'C45-02', 'Phase 1: volcanoes gave out gases'),
  early.choice('C45-03', 'What was the early atmosphere probably mostly made of?', ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Argon'], 0, 'Think about the gas volcanoes gave out most.', ['Scientists think the early atmosphere was mostly carbon dioxide.', 'It had little or no oxygen.'], 'recall'),
  early.choice('C45-04', 'How did the oceans form?', ['Water vapour in the atmosphere cooled and condensed', 'Volcanoes gave out liquid water', 'Plants made water by photosynthesis', 'Ice arrived from space and melted'], 0, 'The water was in the air first.', ['Water vapour in the early atmosphere condensed as the Earth cooled.', 'Condensing means turning into liquid.']),
  t(removed, 'C45-05', 'Phase 2: carbon dioxide was removed'),
  removed.choice('C45-06', 'What happened to much of the early carbon dioxide?', ['It stayed in the air for ever', 'It was taken out by the oceans, algae and plants', 'It turned into nitrogen', 'It floated off into space'], 1, 'Several things removed it.', ['Lots of it dissolved in the oceans.', 'Algae and green plants took some in for photosynthesis, and carbon was locked in rocks.']),
  removed.choice('C45-07', 'Which of these is formed from the remains of plankton on the seabed?', ['Coal', 'Limestone', 'Crude oil', 'Granite'], 2, 'It is a liquid fossil fuel.', ['Crude oil and natural gas form from the remains of plankton.', 'Coal comes from plants, and limestone from shells.']),
  t(oxygen, 'C45-08', 'Phase 3: algae and plants made oxygen'),
  oxygen.choice('C45-09', 'Which process in algae and green plants added oxygen to the atmosphere?', ['Condensation', 'Photosynthesis', 'Precipitation', 'Combustion'], 1, 'Plants use light to make food.', ['Photosynthesis makes glucose and oxygen from carbon dioxide and water.', 'So it also removes carbon dioxide.']),
  oxygen.choice('C45-10', 'About what fraction of the air today is nitrogen?', ['One fifth', 'Half', 'Four fifths', 'Less than 1%'], 2, 'Oxygen is the smaller share.', ['Air is about 80% nitrogen, which is four fifths.', 'Oxygen is about one fifth.'], 'recall'),
  oxygen.choice('C45-11', 'The bar shows the air today. Which section is oxygen?', ['Section A', 'Section C', 'Section B', 'None of them'], 2, 'Oxygen is about one fifth of the air.', ['Section A is about four fifths, which is nitrogen.', 'Section B is about one fifth, so it is oxygen. Section C is the tiny rest.'], 'dataInterpretation', true, 'atmos-q-bar'),
  removed.choice('C45-12', 'Limestone is mostly made of which compound, from the shells and skeletons of sea creatures?', ['Calcium oxide', 'Sodium chloride', 'Silicon dioxide', 'Calcium carbonate'], 3, 'Carbonates settled on the seabed.', ['Limestone is mostly calcium carbonate.', 'The carbon from the sea creatures is trapped in it.'], 'recall', true),
  early.choice('C45-13', 'A student says the oxygen in the air was always there. Which fact shows this is wrong?', ['The early atmosphere had little or no oxygen, and it built up after algae and plants evolved', 'Volcanoes gave out mostly oxygen', 'The oceans gave out oxygen as they formed', 'Animals made the first oxygen'], 0, 'Think about who makes oxygen.', ['The early atmosphere had little or no oxygen.', 'Oxygen built up after algae and green plants evolved and photosynthesised.'], 'understanding', true),
  oxygen.choice('C45-14', 'Which list puts the changes to the atmosphere in the right order?', ['Oxygen builds up, volcanoes erupt, carbon dioxide removed', 'Volcanoes give out gases, carbon dioxide is removed, oxygen builds up', 'Carbon dioxide is removed, oxygen builds up, volcanoes give out gases', 'Oxygen builds up, carbon dioxide is removed, volcanoes give out gases'], 1, 'Start with where the gases came from.', ['First volcanoes gave out gases.', 'Then carbon dioxide was removed, and later oxygen built up.'], 'understanding', true),
  removed.choice('C45-15', 'Which pair are both fossil fuels?', ['Sand and granite', 'Limestone and salt', 'Ice and clay', 'Coal and natural gas'], 3, 'Both formed from buried living things.', ['Coal and natural gas are both fossil fuels.', 'They formed from the remains of living things over millions of years.'], 'application', true),
  removed.written('C45-16', 'Describe how the amount of carbon dioxide in the atmosphere fell, and explain why oxygen levels rose.', 'Oceans, sediments, plants, algae, rocks and photosynthesis.', 'Much of the carbon dioxide dissolved in the oceans and formed carbonates that settled as sediments. Algae and green plants took in carbon dioxide for photosynthesis. Sea creatures were buried and squashed over millions of years, which locked carbon in sedimentary rocks and fossil fuels. Photosynthesis also made oxygen, so oxygen levels built up in the atmosphere.', ['Some carbon dioxide dissolved in the oceans and formed carbonates that settled as sediments.', 'Algae and green plants took in carbon dioxide for photosynthesis.', 'Carbon was locked in sedimentary rocks and fossil fuels from buried sea creatures and plants.', 'Photosynthesis produced oxygen, so oxygen built up over time.'], ['Saying that plants breathe in oxygen to make carbon dioxide.', 'Saying the oceans made the oxygen directly.', 'Saying the early atmosphere was mostly oxygen.']),
]

export const lessonC45: ScienceLesson = {
  id: 'C-ATM-045-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'How the atmosphere evolved', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
