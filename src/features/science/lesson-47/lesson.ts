import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { factorFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.7.1.2 Abiotic factors; 4.7.1.3 Biotic factors; 4.7.1.4 Adaptations (structural, behavioural, functional; extremophiles)' }
const a = author('B-ECO-FACTORS', ['4.7.1.2', '4.7.1.3', '4.7.1.4'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const factorSections = [
  { id: 'B47-01', label: 'Start here', detail: 'Living or not?' },
  { id: 'B47-02', label: 'What non-living things matter?', detail: 'Abiotic factors' },
  { id: 'B47-05', label: 'What living things matter?', detail: 'Biotic factors' },
  { id: 'B47-08', label: 'Built to survive', detail: 'Adaptations and extremophiles' },
  { id: 'B47-11', label: 'On your own', detail: 'Gerbils, fennec foxes, squirrels and a lake' },
]

const states: ScienceState[] = [
  { ...a.choice('B47-01', 'Which of these is not a living thing?', ['A fungus', 'An earthworm', 'Rain', 'Grass'], 2, 'Living things feed, grow and reproduce.', ['A fungus, an earthworm and grass are all living organisms.', 'Rain is water falling from clouds, so it is not living.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B47-02', 'What non-living things matter?'),
  a.choice('B47-03', 'Which of these is an abiotic factor?', ['A new predator', 'Soil pH', 'A new pathogen', 'The amount of food'], 1, 'Abiotic means non-living.', ['Predators, pathogens and food are all living factors.', 'Soil pH is non-living, so it is an abiotic factor.']),
  a.choice('B47-04', 'A long dry spell makes the soil in a field much drier. What is most likely to happen?', ['Plants grow less well, so animals that eat them have less food', 'Plants grow more, so animals that eat them have more food', 'Nothing changes, because the soil is not alive'], 0, 'What do plants take in from the soil?', ['Moisture is an abiotic factor, and plants need water from the soil.', 'So the plants grow less well, and animals that eat them have less food.']),
  t('B47-05', 'What living things matter?'),
  a.choice('B47-06', 'Which of these is a biotic factor?', ['Temperature', 'Wind direction', 'Light intensity', 'A new pathogen'], 3, 'Biotic means living.', ['Temperature, wind direction and light intensity are non-living.', 'A pathogen is a living microorganism, so it is a biotic factor.']),
  a.choice('B47-07', 'Why has the number of red squirrels fallen in many woods where grey squirrels live?', ['Grey squirrels outcompete them for food and shelter', 'Red squirrels need more light than grey squirrels', 'Red squirrels hunt grey squirrels'], 0, 'Both species eat the same food.', ['Red and grey squirrels need the same food and shelter.', 'Grey squirrels are better at getting them, so they outcompete red squirrels.']),
  t('B47-08', 'Built to survive'),
  a.choice('B47-09', 'The Arctic fox has white fur in winter. What type of adaptation is this?', ['Behavioural', 'Functional', 'Structural'], 2, 'Is it something it does, something inside its body, or a feature of its body?', ['Fur colour is part of the body that you can see.', 'A feature of the body, such as its colour, is a structural adaptation.']),
  a.choice('B47-10', 'Some bacteria live in very hot water near volcanic vents. What are organisms like this called?', ['Extremophiles', 'Predators', 'Producers', 'Pathogens'], 0, 'The conditions are extreme.', ['Very hot water is an extreme condition, where most living things could not survive.', 'Organisms that live in extreme conditions are called extremophiles.']),
  a.choice('B47-11', 'A desert gerbil stays in its cool burrow by day and comes out at night. What type of adaptation is this?', ['Structural', 'Behavioural', 'Functional', 'Abiotic'], 1, 'Is this a body feature, a process inside it, or something it does?', ['Staying in a burrow by day is something the gerbil does.', 'A way of behaving that helps it survive is a behavioural adaptation.'], 'application', true),
  a.choice('B47-12', 'The fennec fox lives in hot deserts. Which numbered feature helps it lose heat?', ['Feature 1', 'Feature 2', 'Feature 3'], 2, 'Heat is lost from a surface. Which feature has a large surface?', ['Feature 1 is its sandy fur, which gives camouflage. Feature 2 is its furry soles, which protect its feet from hot sand.', 'Feature 3 is its very large ears, which have a large surface area, so they help it lose heat.'], 'application', true, 'eco-fennec-question'),
  a.choice('B47-13', 'The graph shows the red squirrels counted in one wood. Grey squirrels arrived in year 3. Which conclusion fits?', ['Grey squirrels killed all the red squirrels', 'In this wood, red squirrel numbers fell after grey squirrels arrived', 'Red squirrels will soon be extinct everywhere', 'Red squirrel numbers rose after year 3'], 1, 'Only say what this one wood shows.', ['The count fell from 47 in year 3 to 16 in year 8, but red squirrels were still there.', 'So in this wood, red squirrel numbers fell after grey squirrels arrived. One wood cannot show what happens everywhere.'], 'dataInterpretation', true, 'eco-squirrel-data'),
  a.written('B47-14', 'Warmer water in a lake holds less oxygen. Explain how this could affect the fish and the herons that eat them.', 'Start with the abiotic change, then follow it to the fish, then to the herons.', 'The oxygen level in water is an abiotic factor. Fish need oxygen dissolved in the water, so with less of it, fewer fish survive and the fish population may fall. The herons then have less food, so the heron population may fall too.', ['The oxygen level in the water is an abiotic factor that fish depend on.', 'With less oxygen, fewer fish survive, so the fish population may fall.', 'Herons then have less food, so their population may fall too.'], ['Saying fish take in carbon dioxide from the water to survive.', 'Saying the herons need oxygen from the water.', 'Saying the warmer water is a biotic factor.']),
]

export const lesson47: ScienceLesson = {
  id: 'B-ECO-047-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Abiotic and biotic factors, and adaptations', prerequisites: ['B-ECO-COMMUNITIES'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
